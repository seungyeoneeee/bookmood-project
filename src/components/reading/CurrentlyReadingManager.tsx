import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Search, Clock, BarChart3, Calendar, Star, Heart, CheckCircle, PlayCircle, PauseCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchInput from '../common/SearchInput';
import * as libraryApi from '../../api/library';

export interface ReadingBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  rating?: number;
  publishedYear?: string;
  genre?: string;
  pages?: number;
  progress: number; // 0-100
  startedAt: Date;
  currentPage?: number;
  totalPages?: number;
  lastReadAt?: Date;
  notes?: string;
  status: 'reading' | 'paused';
}

interface CurrentlyReadingManagerProps {
  onBack: () => void;
  onBookSelect?: (book: ReadingBook) => void;
  readingBooks?: ReadingBook[];
  onReadingUpdate?: () => void;
  user?: { id: string };
}

const CurrentlyReadingManager: React.FC<CurrentlyReadingManagerProps> = ({
  onBack,
  onBookSelect,
  readingBooks: externalReadingBooks = [],
  onReadingUpdate,
  user
}) => {
  const navigate = useNavigate();
  
  // State
  const [localReadingBooks, setLocalReadingBooks] = useState<ReadingBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<'recent' | 'progress' | 'title' | 'started'>('recent');
  const [filterStatus, setFilterStatus] = useState<'all' | 'reading' | 'paused'>('all');

  // 외부에서 받은 읽고 있는 책 데이터 사용
  useEffect(() => {
    setIsLoading(true);
    setLocalReadingBooks(externalReadingBooks);
    // 데이터 로딩이 완료되면 로딩 상태 해제
    setTimeout(() => setIsLoading(false), 100);
  }, [externalReadingBooks]);

  // Filtered and sorted books
  const filteredBooks = useMemo(() => {
    let filtered = localReadingBooks;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(book => book.status === filterStatus);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortType) {
        case 'recent':
          return (b.lastReadAt?.getTime() || 0) - (a.lastReadAt?.getTime() || 0);
        case 'progress':
          return b.progress - a.progress;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'started':
          return b.startedAt.getTime() - a.startedAt.getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [localReadingBooks, searchQuery, filterStatus, sortType]);

  const handleBookClick = (book: ReadingBook) => {
    if (onBookSelect) {
      onBookSelect(book);
    } else {
      // 읽기 진행 페이지로 이동
      navigate(`/books/${book.id}/progress`);
    }
  };

  const handleContinueReading = (book: ReadingBook, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/books/${book.id}/progress`);
  };

  // 상태 토글 함수
  const handleToggleStatus = async (book: ReadingBook, e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    
    const originalBook = book;
    const newStatus = book.status === 'reading' ? 'paused' : 'reading';
    
    console.log(`📖 책 상태 변경 시작: ${book.title} -> ${newStatus}`);
    
    if (!user?.id) {
      console.warn('❌ 사용자 인증 정보 없음');
      return;
    }
    
    try {
      // 1. 로컬 상태 먼저 업데이트 (즉시 UI 반영)
      setLocalReadingBooks(prev => prev.map(b => 
        b.id === book.id ? { ...b, status: newStatus } : b
      ));
      
      // 2. API 호출 - 데이터베이스 업데이트
      const { data: libraryItem } = await libraryApi.getLibraryItemByIsbn(book.id, user.id);
      if (!libraryItem) {
        throw new Error('해당 책의 라이브러리 아이템을 찾을 수 없음');
      }
      
      const updateResult = await libraryApi.updateLibraryItem(libraryItem.id, { 
        shelf_status: newStatus 
      });
      
      if (updateResult.error) {
        throw updateResult.error;
      }
      
      console.log(`✅ 데이터베이스 업데이트 완료: ${book.title} -> ${newStatus}`);
      
      // 3. 전체 목록 새로고침 - 서버에서 최신 데이터 가져오기
      if (onReadingUpdate) {
        await onReadingUpdate();
        console.log('📚 전체 목록 새로고침 완료');
      }
      
    } catch (error) {
      console.error('❌ 상태 변경 실패:', error);
      
      // 4. 실패 시 원래 상태로 롤백
      setLocalReadingBooks(prev => prev.map(b => 
        b.id === book.id ? originalBook : b
      ));
      
      // 사용자에게 알림
      alert(`상태 변경에 실패했습니다: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleViewStats = (book: ReadingBook, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/books/${book.id}/stats`);
  };

  const formatReadingTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    return `${Math.floor(diffDays / 30)}개월 전`;
  };

  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-yellow-500';
    if (progress < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen"
    >
      <div className="px-4 md:px-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">읽고 있는 책</h1>
          <div className="w-10" />
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="읽고 있는 책을 검색하세요"
            size="md"
          />
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#A8B5E8] mb-1">
                {localReadingBooks.filter(book => book.status === 'reading').length}
              </div>
              <div className="text-xs text-gray-600">읽는 중</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#F4E4B8] mb-1">
                {localReadingBooks.filter(book => book.status === 'paused').length}
              </div>
              <div className="text-xs text-gray-600">잠시 멈춤</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#B5D4C8] mb-1">
                {Math.round(localReadingBooks.reduce((acc, book) => acc + book.progress, 0) / (localReadingBooks.length || 1))}%
              </div>
              <div className="text-xs text-gray-600">평균 진행률</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="space-y-4">
            {/* Status Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-sm text-gray-700 font-medium">상태:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all' as const, label: '전체', icon: BookOpen },
                  { value: 'reading' as const, label: '읽는 중', icon: PlayCircle },
                  { value: 'paused' as const, label: '잠시 멈춤', icon: PauseCircle }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setFilterStatus(value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 ${
                      filterStatus === value
                        ? 'bg-[#A8B5E8] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-sm text-gray-700 font-medium">정렬:</span>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value as 'recent' | 'progress' | 'title' | 'started')}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#A8B5E8] w-full sm:w-auto"
              >
                <option value="recent">최근 읽은 순</option>
                <option value="progress">진행률 순</option>
                <option value="title">제목 순</option>
                <option value="started">시작한 순</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-2 border-[#A8B5E8] border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">읽고 있는 책을 불러오는 중...</span>
          </div>
        ) : (
          <>
            {/* Reading List */}
            {filteredBooks.length > 0 ? (
          <div className="space-y-4">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleBookClick(book)}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex space-x-4">
                  <img 
                    src={book.cover} 
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{book.author}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">진행률</span>
                        <span className="text-xs font-medium text-gray-700">{book.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${getProgressColor(book.progress)}`}
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                      {book.currentPage && book.totalPages && (
                        <div className="text-xs text-gray-500 mt-1">
                          {book.currentPage} / {book.totalPages} 페이지
                        </div>
                      )}
                    </div>

                    {/* Status and Last Read */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          book.status === 'reading' ? 'bg-green-400' : 'bg-yellow-400'
                        }`} />
                        <span className="text-xs text-gray-600">
                          {book.status === 'reading' ? '읽는 중' : '잠시 멈춤'}
                        </span>
                      </div>
                      {book.lastReadAt && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatReadingTime(book.lastReadAt)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>시작: {book.startedAt.toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => handleToggleStatus(book, e)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            book.status === 'reading'
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                          }`}
                          title={book.status === 'reading' ? '일시 정지' : '읽기 재개'}
                        >
                          {book.status === 'reading' ? (
                            <PauseCircle className="w-4 h-4" />
                          ) : (
                            <PlayCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={(e) => handleViewStats(book, e)}
                          className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <BarChart3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleContinueReading(book, e)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 ${
                            book.status === 'reading'
                              ? 'bg-[#A8B5E8] text-white hover:bg-[#8BB5E8]'
                              : 'bg-[#F4E4B8] text-gray-700 hover:bg-[#E8D5A3]'
                          }`}
                        >
                          <PlayCircle className="w-3 h-3" />
                          <span>{book.status === 'reading' ? '계속 읽기' : '다시 시작'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {searchQuery || filterStatus !== 'all' ? '검색 결과가 없습니다' : '읽고 있는 책이 없습니다'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? '다른 검색어나 필터를 시도해보세요' 
                : '새로운 책을 찾아 읽기를 시작해보세요'
              }
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/search')}
                className="w-full py-3 bg-[#A8B5E8] text-white rounded-xl font-medium"
              >
                책 찾아보기
              </button>
              <button
                onClick={() => navigate('/wishlist')}
                className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium"
              >
                위시리스트 보기
              </button>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CurrentlyReadingManager;
