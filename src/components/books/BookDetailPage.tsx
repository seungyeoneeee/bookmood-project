import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Calendar, BookOpen, Heart, Sparkles, BarChart3, User, Clock, Play, RotateCcw, CheckCircle, Edit, Trash2, Activity } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBook } from '../../hooks/useBooks';
import { BookExternal, LibraryItem } from '../../types/database';
import { aladinApi } from '../../services/aladinApi';
import * as libraryApi from '../../api/library';



interface BookDetailPageProps {
  onBack: () => void;
  onWishlistToggle?: (book: BookExternal) => void;
  onStartReading?: (book: BookExternal) => void;
  onViewEmotionStats?: (book: BookExternal) => void;
  onCompleteReading?: (book: BookExternal) => void;
  onUpdateProgress?: (book: BookExternal, progress: number) => void;
  wishlistBooks?: string[];
  user?: { id: string };
}

const BookDetailPage: React.FC<BookDetailPageProps> = ({
  onBack,
  onWishlistToggle,
  onStartReading,
  onViewEmotionStats,
  onCompleteReading,
  onUpdateProgress,
  wishlistBooks = [],
  user
}) => {
  const { bookId } = useParams<{ bookId: string }>(); // 실제로는 ISBN13
  const navigate = useNavigate();
  const [aladinBook, setAladinBook] = useState<BookExternal | null>(null);
  const [isLoadingAladin, setIsLoadingAladin] = useState(false);
  const [libraryItem, setLibraryItem] = useState<LibraryItem | null>(null);
  const [progressInput, setProgressInput] = useState<number>(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const searchAttempted = useRef<Set<string>>(new Set()); // 이미 검색한 ISBN 추적
  
  // 먼저 데이터베이스에서 조회
  const { book: dbBook, loading: dbLoading, error: dbError } = useBook(bookId);

  // 🔍 사용자의 라이브러리 상태 확인
  useEffect(() => {
    const loadLibraryStatus = async () => {
      if (bookId && user?.id) {
        try {
          const { data } = await libraryApi.getLibraryItemByIsbn(bookId, user.id);
          setLibraryItem(data);
          if (data?.progress) {
            setProgressInput(data.progress);
          }
        } catch (error) {
          console.error('라이브러리 상태 조회 실패:', error);
        }
      }
    };

    loadLibraryStatus();
  }, [bookId, user?.id]);

  // 알라딘 API 검색 함수 메모이제이션
  const searchByISBN = useCallback(async (isbn: string) => {
    try {
      const response = await aladinApi.searchBooks({
        query: isbn,
        queryType: 'ISBN',
        maxResults: 1
      });
      
      if (response.item && response.item.length > 0) {
        const transformedBook = aladinApi.transformToBookExternal(response.item[0]);
        setAladinBook(transformedBook);
        return;
      }
    } catch (error) {
      console.warn('ISBN 검색 실패, Keyword로 재시도:', error);
    }

    // ISBN 검색 실패 시 Keyword로 재시도
    try {
      const response = await aladinApi.searchBooks({
        query: isbn,
        queryType: 'Keyword',
        maxResults: 5
      });
      
      if (response.item && response.item.length > 0) {
        // ISBN이 정확히 일치하는 책을 찾기
        const exactMatch = response.item.find(item => item.isbn13 === isbn);
        if (exactMatch) {
          const transformedBook = aladinApi.transformToBookExternal(exactMatch);
          setAladinBook(transformedBook);
        }
      }
    } catch (error) {
      console.error('알라딘 API 조회 완전 실패:', error);
    }
  }, []);

  // 📖 책의 읽기 상태 판단
  const getBookStatus = () => {
    if (!libraryItem) return null;
    
    if (libraryItem.is_wishlist) {
      return 'wishlist';
    } else if (libraryItem.progress === 100 || libraryItem.shelf_status === 'completed') {
      return 'completed';
    } else if ((libraryItem.progress && libraryItem.progress > 0) || libraryItem.shelf_status === 'reading') {
      return 'reading';
    } else {
      return 'reading'; // 기본값 (위시리스트가 아니면 읽고 있는 것으로 간주)
    }
  };

  // 📚 책 완료 처리
  const handleCompleteBook = async () => {
    if (!libraryItem || !user?.id) return;
    
    try {
      await libraryApi.updateLibraryItem(libraryItem.id, {
        shelf_status: 'completed',
        progress: 100,
        finished_at: new Date().toISOString()
      });
      
      // 상태 업데이트
      setLibraryItem(prev => prev ? {
        ...prev,
        shelf_status: 'completed',
        progress: 100,
        finished_at: new Date().toISOString()
      } : null);
      
      if (onCompleteReading && (dbBook || aladinBook)) {
        onCompleteReading(dbBook || aladinBook!);
      }
    } catch (error) {
      console.error('Error completing book:', error);
    }
  };

  // 🔄 읽기 재시작
  const handleRestartReading = async () => {
    if (!libraryItem || !user?.id) return;
    
    try {
      await libraryApi.updateLibraryItem(libraryItem.id, {
        shelf_status: 'reading',
        progress: 0,
        started_at: new Date().toISOString(),
        finished_at: undefined
      });
      
      // 상태 업데이트
      setLibraryItem(prev => prev ? {
        ...prev,
        shelf_status: 'reading',
        progress: 0,
        started_at: new Date().toISOString(),
        finished_at: undefined
      } : null);
      
      if (onStartReading && (dbBook || aladinBook)) {
        onStartReading(dbBook || aladinBook!);
      }
    } catch (error) {
      console.error('Error restarting book:', error);
    }
  };

  // 🗑️ 라이브러리에서 제거
  const handleRemoveFromLibrary = async () => {
    if (!libraryItem || !user?.id) return;
    
    try {
      await libraryApi.removeFromLibrary(libraryItem.id);
      setLibraryItem(null);
    } catch (error) {
      console.error('Error removing from library:', error);
    }
  };

  // 📊 진행률 업데이트
  const handleProgressUpdate = async () => {
    if (!libraryItem || !user?.id) return;
    
    try {
      const updatedProgress = Math.min(Math.max(progressInput, 0), 100);
      
      await libraryApi.updateLibraryItem(libraryItem.id, {
        progress: updatedProgress,
        shelf_status: updatedProgress === 100 ? 'completed' : 'reading',
        finished_at: updatedProgress === 100 ? new Date().toISOString() : undefined
      });
      
      // 상태 업데이트
      setLibraryItem(prev => prev ? {
        ...prev,
        progress: updatedProgress,
        shelf_status: updatedProgress === 100 ? 'completed' : 'reading',
        finished_at: updatedProgress === 100 ? new Date().toISOString() : undefined
      } : null);
      
      setShowProgressModal(false);
      
      if (onUpdateProgress && (dbBook || aladinBook)) {
        onUpdateProgress(dbBook || aladinBook!, updatedProgress);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // 데이터베이스에 없으면 알라딘 API로 조회 (중복 검색 방지)
  useEffect(() => {
    if (!dbLoading && !dbBook && bookId && !isLoadingAladin && !searchAttempted.current.has(bookId)) {
      setIsLoadingAladin(true);
      searchAttempted.current.add(bookId); // 검색 시도 기록
      
      searchByISBN(bookId).finally(() => {
        setIsLoadingAladin(false);
      });
    }
  }, [dbLoading, dbBook, bookId, isLoadingAladin, searchByISBN]);
  
  // bookId가 변경되면 검색 기록 초기화
  useEffect(() => {
    return () => {
      searchAttempted.current.clear();
    };
  }, [bookId]);

  // 실제 사용할 책 데이터 결정
  const book = dbBook || aladinBook;
  const isLoading = dbLoading || isLoadingAladin;

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-screen"
      >
        <div className="px-4 md:px-0">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={onBack} 
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">책 정보</h1>
            <div className="w-10" />
          </div>
          
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#A8B5E8] border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-gray-600">책 정보를 불러오는 중...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!book) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-screen"
      >
        <div className="max-w-sm mx-auto text-center py-20">
          <h3 className="text-lg font-medium text-gray-800 mb-2">책을 찾을 수 없습니다</h3>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-[#A8B5E8] text-white rounded-xl font-medium"
          >
            돌아가기
          </button>
        </div>
      </motion.div>
    );
  }

  const handleProceedToReview = () => {
    navigate(`/books/${book.isbn13}/review`);
  };

  const isInWishlist = wishlistBooks.includes(book.isbn13);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="min-h-screen"
    >
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack} 
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">책 정보</h1>
          <div className="w-10" />
        </div>

        <div className="space-y-6">
          {/* Book Cover & Basic Info */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <div className="text-center">
              <img 
                src={book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop'} 
                alt={book.title}
                className="w-32 h-44 object-cover rounded-lg mx-auto mb-4 border border-gray-100" 
              />
              <h1 className="text-xl font-bold text-gray-900 mb-1 leading-snug">
                {book.title}
              </h1>
              <p className="text-gray-600 mb-4">{book.author || '작가 미상'}</p>
              
              <div className="flex items-center justify-center gap-4 mb-4">
                {book.customer_review_rank && book.customer_review_rank > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium text-gray-700">{(book.customer_review_rank / 2).toFixed(1)}</span>
                  </div>
                )}
                {book.category_name && (
                  <span className="text-sm text-gray-500">{book.category_name}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              {book.pub_date && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-1">출간일</p>
                  <p className="font-medium text-gray-900">
                    {new Date(book.pub_date).getFullYear()}년
                  </p>
                </div>
              )}
              {book.price_sales && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-1">판매가</p>
                  <p className="font-medium text-gray-900">
                    {book.price_sales.toLocaleString()}원
                    {book.price_standard && book.price_standard !== book.price_sales && (
                      <span className="text-xs text-gray-400 line-through ml-1">
                        {book.price_standard.toLocaleString()}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {book.publisher && (
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">출판사</p>
                <p className="text-gray-700 font-medium">{book.publisher}</p>
              </div>
            )}

            {/* Aladin Link */}
            {book.aladin_link && (
              <div className="text-center">
                <a 
                  href={book.aladin_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  알라딘에서 보기
                </a>
              </div>
            )}
          </div>

          {/* Description */}
          {book.summary && (
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                책 소개
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                {book.summary?.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') || ''}
              </p>
            </div>
          )}

          {/* Reading Status */}
          {libraryItem && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-800">
                  {getBookStatus() === 'wishlist' && '찜한 책'}
                  {getBookStatus() === 'reading' && '읽고 있는 책'}
                  {getBookStatus() === 'completed' && '완료한 책'}
                </span>
                {libraryItem.progress !== undefined && (
                  <span className="text-sm text-gray-600">{libraryItem.progress}%</span>
                )}
              </div>
              {libraryItem.progress !== undefined && libraryItem.progress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${libraryItem.progress}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Buttons - 상태별 다른 버튼 */}
          <div className="space-y-3">
            {(() => {
              const status = getBookStatus();
              
              switch (status) {
                case 'wishlist':
                  return (
                    <>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => onStartReading?.(book)} 
                          className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          읽기 시작
                        </button>
                        
                        <button 
                          onClick={handleProceedToReview} 
                          className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                        >
                          감상문 작성
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => onWishlistToggle?.(book)} 
                        className="w-full py-3 bg-white border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                      >
                        위시리스트에서 제거
                      </button>
                    </>
                  );

                case 'reading':
                  return (
                    <>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => navigate(`/books/${book.isbn13}/progress`)} 
                          className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          이어서 읽기
                        </button>
                        
                        <button 
                          onClick={() => setShowProgressModal(true)} 
                          className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                        >
                          진행률 업데이트
                        </button>
                      </div>
                      
                      <button 
                        onClick={handleCompleteBook}
                        className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        독서 완료
                      </button>
                    </>
                  );

                case 'completed':
                  return (
                    <>
                      <div className="flex gap-3">
                        <button 
                          onClick={handleRestartReading} 
                          className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          다시 읽기
                        </button>
                        
                        <button 
                          onClick={handleProceedToReview} 
                          className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                        >
                          리뷰 수정
                        </button>
                      </div>
                      
                      <button 
                        onClick={handleRemoveFromLibrary}
                        className="w-full py-3 bg-white border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        읽은 책에서 제거
                      </button>
                    </>
                  );

                default: // normal
                  return (
                    <>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => onStartReading?.(book)} 
                          className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          읽기 시작
                        </button>
                        
                        <button 
                          onClick={handleProceedToReview} 
                          className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                        >
                          감상문 작성
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => onWishlistToggle?.(book)} 
                        className="w-full py-3 bg-white border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                      >
                        위시리스트에 추가
                      </button>
                    </>
                  );
              }
            })()}
          </div>

          {/* 📊 Progress Update Modal */}
          {showProgressModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowProgressModal(false)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">진행률 업데이트</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    진행률: {progressInput}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressInput}
                    onChange={(e) => setProgressInput(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowProgressModal(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleProgressUpdate}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium"
                  >
                    업데이트
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Additional Info */}
          {book.isbn13 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">ISBN13</p>
                <p className="text-sm font-mono text-gray-700">{book.isbn13}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookDetailPage; 