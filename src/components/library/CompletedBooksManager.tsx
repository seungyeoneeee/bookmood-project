import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Star, BookOpen, Eye, Sparkles, Trophy, TrendingUp } from 'lucide-react';
import * as libraryApi from '../../api/library';
import { BookExternal } from '../../types/database';

export interface CompletedBook {
  id: string;
  isbn13: string;
  title: string;
  author: string;
  cover_url: string;
  finishedAt: string;
  rating?: number;
  note?: string;
  book?: BookExternal;
}

interface CompletedBooksManagerProps {
  onBack: () => void;
  onBookSelect: (isbn13: string) => void;
  user?: { id: string };
}

const CompletedBooksManager: React.FC<CompletedBooksManagerProps> = ({
  onBack,
  onBookSelect,
  user
}) => {
  const [completedBooks, setCompletedBooks] = useState<CompletedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState<'recent' | 'oldest' | 'rating' | 'title'>('recent');

  useEffect(() => {
    loadCompletedBooks();
  }, [user]);

  const loadCompletedBooks = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await libraryApi.getCompletedBooks(user.id);
      
      if (error) {
        console.error('❌ 완독 도서 로딩 실패:', error);
        return;
      }

      const books: CompletedBook[] = (data || []).map(item => ({
        id: item.id,
        isbn13: item.isbn13,
        title: item.book?.title || '제목 없음',
        author: item.book?.author || '작가 미상',
        cover_url: item.book?.cover_url || '',
        finishedAt: item.finished_at || item.updated_at,
        rating: extractRatingFromNote(item.note),
        note: item.note,
        book: item.book
      }));

      setCompletedBooks(books);
      console.log(`📚 완독 도서 ${books.length}권 로딩 완료`);
    } catch (error) {
      console.error('❌ 완독 도서 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 메모에서 평점 추출하는 간단한 함수
  const extractRatingFromNote = (note?: string): number | undefined => {
    if (!note) return undefined;
    const match = note.match(/평점:\s*(\d+)/);
    return match ? parseInt(match[1]) : undefined;
  };

  // 정렬된 책 목록
  const sortedBooks = [...completedBooks].sort((a, b) => {
    switch (sortType) {
      case 'recent':
        return new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime();
      case 'oldest':
        return new Date(a.finishedAt).getTime() - new Date(b.finishedAt).getTime();
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // 통계 계산
  const stats = {
    totalBooks: completedBooks.length,
    thisYear: completedBooks.filter(book => 
      new Date(book.finishedAt).getFullYear() === new Date().getFullYear()
    ).length,
    averageRating: completedBooks.length > 0 
      ? completedBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / completedBooks.length 
      : 0,
    favoriteGenres: [] // TODO: 장르별 통계
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
            <button 
              onClick={onBack} 
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">내 도서관</h1>
            <div className="w-10" />
          </div>
          
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#A8B5E8] border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-gray-600">완독 도서를 불러오는 중...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="min-h-screen"
    >
      <div className="px-4 md:px-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBack} 
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">내 도서관</h1>
          <div className="w-10" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#F0F3FF] via-[#F5F7FF] to-[#FAFBFF] rounded-2xl p-5 border border-[#E8ECFF] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 min-h-[120px]">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-[#A8B5E8]/15 rounded-full flex items-center justify-center flex-shrink-0">
                <Trophy className="w-4 h-4 text-[#8BB5E8]" />
              </div>
              <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">총 완독</span>
            </div>
            <p className="text-2xl font-bold mb-1 text-[#6B7BE8] min-h-[32px] flex items-center">
              {isLoading ? '···' : `${stats.totalBooks}권`}
            </p>
            <p className="text-xs text-gray-500">나의 독서 여정</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#F0FAF7] via-[#F5FBF9] to-[#FAFCFB] rounded-2xl p-5 border border-[#E8F7F2] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 min-h-[120px]">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-[#B5D4C8]/15 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-[#6ABFA0]" />
              </div>
              <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">올해</span>
            </div>
            <p className="text-2xl font-bold mb-1 text-[#4DB08A] min-h-[32px] flex items-center">
              {isLoading ? '···' : `${stats.thisYear}권`}
            </p>
            <p className="text-xs text-gray-500">2024년 성과</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#FFFDF5] via-[#FFFEF7] to-[#FFFFF9] rounded-2xl p-5 border border-[#FEF9E8] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 min-h-[120px]">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-[#F4E4B8]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 fill-current text-[#E6B800]" />
              </div>
              <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">평균 평점</span>
            </div>
            <p className="text-2xl font-bold mb-1 text-[#D4A017] min-h-[32px] flex items-center">
              {isLoading ? '···' : `${stats.averageRating.toFixed(1)}`}
            </p>
            <p className="text-xs text-gray-500">내 기준점</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#FEF7FC] via-[#FEF9FD] to-[#FFFAFF] rounded-2xl p-5 border border-[#F9ECFB] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 min-h-[120px]">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-[#E8B5D4]/15 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-[#D695B8]" />
              </div>
              <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">이달</span>
            </div>
            <p className="text-2xl font-bold mb-1 text-[#C7759C] min-h-[32px] flex items-center">
              {isLoading ? '···' : `${stats?.thisMonth || 0}권`}
            </p>
            <p className="text-xs text-gray-500">현재 진행중</p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            완독한 책 ({completedBooks.length}권)
          </h2>
          <select 
            value={sortType} 
            onChange={(e) => setSortType(e.target.value as typeof sortType)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A8B5E8] focus:border-transparent shadow-sm hover:shadow-md transition-all"
          >
            <option value="recent">최근 완독순</option>
            <option value="oldest">오래된 완독순</option>
            <option value="rating">평점순</option>
            <option value="title">제목순</option>
          </select>
        </div>

        {/* Books Grid */}
        {sortedBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onBookSelect(book.isbn13)}
                className="bg-white border border-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-[#A8B5E8]/20 hover:-translate-y-1 group"
              >
                                  <div className="flex space-x-5">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop'} 
                      alt={book.title}
                      className="w-20 h-28 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                    />
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center shadow-md border border-emerald-100">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 leading-tight text-lg group-hover:text-[#A8B5E8] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 font-medium">{book.author}</p>
                    
                    <div className="space-y-3">
                      {/* 완독 날짜 */}
                      <div className="flex items-center text-sm text-gray-600 bg-gray-25 px-3 py-1.5 rounded-lg">
                        <Calendar className="w-4 h-4 mr-2 text-[#B8C5F0]" />
                        <span className="font-medium">완독: {new Date(book.finishedAt).toLocaleDateString('ko-KR')}</span>
                      </div>
                      
                      {/* 평점 */}
                      {book.rating && (
                        <div className="flex items-center text-sm bg-gradient-to-r from-yellow-25 to-amber-25 px-3 py-1.5 rounded-lg">
                          <Star className="w-4 h-4 mr-2 text-amber-400 fill-current" />
                          <span className="font-bold text-amber-600">{book.rating}/5</span>
                        </div>
                      )}
                      
                      {/* 간단한 메모 */}
                      {book.note && (
                        <p className="text-sm text-gray-600 line-clamp-2 italic bg-gradient-to-r from-blue-25 to-purple-25 px-3 py-2 rounded-lg border-l-4 border-[#C8D5F0]">
                          "{book.note.length > 60 ? `${book.note.substring(0, 60)}...` : book.note}"
                        </p>
                      )}
                    </div>
                    
                    {/* 액션 버튼들 */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-[#A8B5E8] transition-all hover:scale-105 bg-gray-25 hover:bg-[#A8B5E8]/5 px-3 py-1.5 rounded-lg">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">상세보기</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 text-sm text-purple-600 bg-gradient-to-r from-purple-25 to-pink-25 hover:from-purple-50 hover:to-pink-50 transition-all hover:scale-105 px-3 py-1.5 rounded-lg shadow-sm border border-purple-100">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-medium">감상문</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="w-28 h-28 bg-gradient-to-br from-[#A8B5E8]/10 to-[#B5D4C8]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-14 h-14 text-[#A8B5E8]" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">아직 완독한 책이 없어요</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              첫 번째 책을 완독하고 나만의 특별한 도서관을 만들어보세요!<br/>
              <span className="text-[#A8B5E8] font-medium">독서의 즐거움이 여러분을 기다리고 있어요 ✨</span>
            </p>
            <button 
              onClick={onBack}
              className="px-8 py-4 bg-gradient-to-r from-[#F0F3FF] to-[#F5F7FF] text-[#6B7BE8] rounded-2xl font-bold hover:from-[#E8ECFF] hover:to-[#F0F3FF] transition-all transform hover:scale-105 shadow-sm hover:shadow-md border border-[#E8ECFF]"
            >
              📚 책 찾으러 가기
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CompletedBooksManager;
