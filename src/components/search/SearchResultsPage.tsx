import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, Star, User, Calendar, BookOpen, Heart, Filter, Clock, Award } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRealtimeBookSearch } from '../../hooks/useBooks';
import { BookExternal } from '../../types/database';

interface SearchResultsPageProps {
  onBack: () => void;
  onWishlistToggle?: (book: BookExternal) => void;
  wishlistBooks?: string[];
}

type SortType = 'relevance' | 'rating' | 'readers' | 'recent';

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ 
  onBack, 
  onWishlistToggle,
  wishlistBooks = [] 
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';
  
  const [sortType, setSortType] = useState<SortType>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { books: searchResults, loading: isLoading, error: searchError, totalFound, searchBooks } = useRealtimeBookSearch();
  
  const BOOKS_PER_PAGE = 30;
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1); // 새 검색 시 페이지 리셋
      searchBooks(searchQuery, 200); // 무한스크롤을 위한 더 많은 결과 가져오기
    }
  }, [searchQuery, searchBooks]);

  // 무한스크롤 핸들러
  const loadMoreBooks = useCallback(async () => {
    if (isLoadingMore || currentPage * BOOKS_PER_PAGE >= searchResults.length) {
      return;
    }

    setIsLoadingMore(true);
    
    // 시뮬레이션: API에서 더 많은 결과 로드
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, currentPage, searchResults.length]);

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && !isLoadingMore) {
          loadMoreBooks();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMoreBooks, isLoading, isLoadingMore]);

  const getSortedResults = () => {
    const sorted = [...searchResults];
    switch (sortType) {
      case 'rating':
        return sorted.sort((a, b) => (b.customer_review_rank || 0) - (a.customer_review_rank || 0));
      case 'readers':
        return sorted.sort((a, b) => (b.customer_review_rank || 0) - (a.customer_review_rank || 0));
      case 'recent':
        return sorted.sort((a, b) => 
          new Date(b.pub_date || '0').getTime() - new Date(a.pub_date || '0').getTime()
        );
      default:
        return sorted; // 관련도순 (기본 순서 유지)
    }
  };

  const getDisplayedResults = () => {
    const sorted = getSortedResults();
    return sorted.slice(0, currentPage * BOOKS_PER_PAGE);
  };

  const hasMoreResults = () => {
    return currentPage * BOOKS_PER_PAGE < searchResults.length;
  };

  const handleBookClick = (book: BookExternal) => {
    navigate(`/books/${book.isbn13}`);
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-screen"
      >
        <div className="px-4 md:px-0">
          <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">검색 결과</h1>
            <div className="w-10" />
          </div>
          
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#A8B5E8] border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-gray-600">검색 중...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="min-h-screen"
    >
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBack} 
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-gray-800">검색 결과</h1>
            <p className="text-sm text-gray-500">"{searchQuery}"</p>
          </div>
          <button 
            onClick={() => navigate('/search/filter')}
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Error Message */}
        {searchError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">{searchError}</p>
          </div>
        )}

        {/* Results Summary & Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            총 <span className="font-semibold text-[#A8B5E8]">{searchResults.length}권</span>의 책을 찾았습니다
            {totalFound > searchResults.length && (
              <span className="text-xs text-gray-500 block">
                (전체 {totalFound}개 중 {searchResults.length}개 검색됨)
              </span>
            )}
            <span className="text-xs text-gray-500 block">
              현재 {getDisplayedResults().length}개 표시 중
            </span>
          </p>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as SortType)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A8B5E8]"
          >
            <option value="relevance">관련도순</option>
            <option value="rating">평점순</option>
            <option value="readers">인기순</option>
            <option value="recent">최신순</option>
          </select>
        </div>

        {/* Search Results */}
        {!isLoading && searchResults.length > 0 ? (
          <div className="space-y-4">
            {getDisplayedResults().map((book, index) => (
              <motion.div
                key={book.isbn13}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleBookClick(book)}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-gray-300"
              >
                <div className="flex space-x-4">
                  <img 
                    src={book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop'} 
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-1.5 line-clamp-2 leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 font-medium">{book.author || '작가 미상'}</p>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      {book.customer_review_rank && book.customer_review_rank > 0 && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium text-gray-700">{(book.customer_review_rank / 10).toFixed(1)}</span>
                        </div>
                      )}
                      {book.price_sales && (
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-[#A8B5E8]">{book.price_sales.toLocaleString()}원</span>
                          {book.price_standard && book.price_standard !== book.price_sales && (
                            <span className="text-xs text-gray-400 line-through ml-1">{book.price_standard.toLocaleString()}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    {book.summary && (
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {book.summary}
                      </p>
                    )}

                    {/* Bottom Info Section */}
                    <div className="space-y-2">
                      {/* Category Tag */}
                      {book.category_name && (
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-[#A8B5E8]/20 to-[#B5D4C8]/20 text-[#6366F1] text-xs font-medium rounded-full border border-[#A8B5E8]/30">
                            {book.category_name}
                          </span>
                        </div>
                      )}
                      
                      {/* Publisher & Year + Wishlist */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          {book.publisher && (
                            <div className="flex items-center space-x-1">
                              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                              <span>{book.publisher}</span>
                            </div>
                          )}
                          {book.pub_date && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span>{new Date(book.pub_date).getFullYear()}</span>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onWishlistToggle?.(book);
                          }}
                          className={`flex-shrink-0 p-2 rounded-full transition-all duration-200 ${
                            wishlistBooks.includes(book.isbn13)
                              ? 'bg-red-100 text-red-500 scale-110' 
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:scale-105'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${wishlistBooks.includes(book.isbn13) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* 무한스크롤 트리거 및 로딩 인디케이터 */}
            {hasMoreResults() && (
              <div ref={observerTarget} className="py-8 flex items-center justify-center">
                {isLoadingMore ? (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-[#A8B5E8] rounded-full animate-spin" />
                    <span className="text-sm">더 많은 책을 불러오는 중...</span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 py-4">
                    스크롤하여 더 많은 책 보기
                  </div>
                )}
              </div>
            )}
            
            {/* 모든 결과 표시 완료 메시지 */}
            {!hasMoreResults() && searchResults.length > BOOKS_PER_PAGE && (
              <div className="py-8 text-center">
                <div className="text-sm text-gray-500 mb-2">
                  모든 검색 결과를 확인했습니다! 📚
                </div>
                <div className="text-xs text-gray-400">
                  총 {searchResults.length}권의 책을 찾았습니다
                </div>
              </div>
            )}
          </div>
        ) : !isLoading ? (
          /* Empty State - 로딩이 완료되고 결과가 없을 때만 표시 */
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600 mb-6">다른 키워드로 검색해보시거나<br />감정 기반 검색을 이용해보세요</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/search')}
                className="w-full py-3 bg-[#A8B5E8] text-white rounded-xl font-medium"
              >
                다시 검색하기
              </button>
              <button
                onClick={() => navigate('/search/filter')}
                className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium"
              >
                감정 기반 검색
              </button>
            </div>
          </div>
        ) : null /* 로딩 중일 때는 아무것도 표시하지 않음 */}
      </div>
    </motion.div>
  );
};

export default SearchResultsPage; 