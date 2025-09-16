import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, Filter, X, Sparkles, TrendingUp, Users, BookOpen, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface SearchPageProps {
  onBack: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalReviews: 0,
    isLoading: true
  });
  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);
  const navigate = useNavigate();

  // 통계 및 인기 검색어 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. 기본 통계 데이터
        const { count: bookCount } = await supabase
          .from('book_external')
          .select('*', { count: 'exact', head: true });

        const { count: reviewCount } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true });

        // 2. 인기 검색어 알고리즘
        const popularKeywords = await getPopularKeywords();

        setStats({
          totalBooks: bookCount || 0,
          totalReviews: reviewCount || 0,
          isLoading: false
        });
        setPopularKeywords(popularKeywords);

      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        // 에러 시 기본값 설정
        setStats({
          totalBooks: 0,
          totalReviews: 0,
          isLoading: false
        });
        setPopularKeywords(getFallbackKeywords());
      }
    };

    loadData();
  }, []);

  // 인기 검색어 알고리즘
  const getPopularKeywords = async (): Promise<string[]> => {
    try {
      // 1. 실제 검색 기록이 있는지 확인
      const { data: searchLogs } = await supabase
        .from('reviews')
        .select('memo')
        .not('memo', 'is', null)
        .limit(100);

      if (searchLogs && searchLogs.length > 0) {
        // 실제 검색 기록 기반 인기 검색어 생성
        return generateKeywordsFromReviews(searchLogs);
      }

      // 2. 데이터가 부족하면 책 제목 기반 인기 검색어
      const { data: books } = await supabase
        .from('book_external')
        .select('title')
        .not('title', 'is', null)
        .limit(50);

      if (books && books.length > 0) {
        return generateKeywordsFromBooks(books);
      }

      // 3. 최후의 수단: 하드코딩된 인기 검색어
      return getFallbackKeywords();

    } catch (error) {
      console.error('인기 검색어 생성 실패:', error);
      return getFallbackKeywords();
    }
  };

  // 리뷰에서 키워드 추출
  const generateKeywordsFromReviews = (reviews: any[]): string[] => {
    const bookTitles = reviews
      .map(review => review.memo)
      .filter(memo => memo && memo.length > 10)
      .slice(0, 5)
      .map(memo => memo.substring(0, 20) + '...');

    return bookTitles.length > 0 ? bookTitles : getFallbackKeywords();
  };

  // 책 제목에서 키워드 추출
  const generateKeywordsFromBooks = (books: any[]): string[] => {
    const titles = books
      .map(book => book.title)
      .filter(title => title && title.length > 0)
      .slice(0, 5);

    return titles.length > 0 ? titles : getFallbackKeywords();
  };

  // 기본 인기 검색어
  const getFallbackKeywords = (): string[] => {
    return ['달러구트 꿈 백화점', '아몬드', '미드나이트 라이브러리', '어린왕자', '데미안'];
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Navigate to results page with search query
    navigate(`/search/results?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleEmotionSearch = () => {
    navigate('/search/filter');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      className="min-h-screen"
    >
      <div className="px-4 md:px-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack} 
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">AI 책 추천 & 검색</h1>
          <button 
            onClick={handleEmotionSearch}
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="책 제목, 작가, 장르를 검색하세요"
            className="w-full px-4 py-4 pl-12 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20 shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')} 
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <button
          onClick={handleSearch}
          disabled={!searchQuery.trim() || isSearching}
          className="w-full py-4 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSearching ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>검색 중...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>책 검색하기</span>
            </>
          )}
        </button>

        {/* AI Recommendation Section */}
        <div className="mt-12 bg-gradient-to-br from-[#A8B5E8]/10 to-[#B5D4C8]/10 rounded-3xl p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-full flex items-center justify-center mr-3">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">AI 맞춤 추천</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            감정 상태를 기반으로 AI가 책을 추천해드려요!
          </p>
          <button
            onClick={handleEmotionSearch}
            className="w-full py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>감정 기반 검색</span>
          </button>
        </div>

        {/* Popular Books Suggestion - Coming Soon */}
        <div className="mt-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden min-h-[200px]">
          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F4E4B8] to-[#E8D5A3] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">곧 출시됩니다</h4>
              <p className="text-gray-500 text-sm">
                스마트 추천 검색어 기능을 준비 중이에요
              </p>
              <div className="mt-3 inline-flex items-center px-3 py-1 bg-gradient-to-r from-[#F4E4B8] to-[#E8D5A3] text-white text-xs rounded-full">
                <Sparkles className="w-3 h-3 mr-1" />
                Coming Soon
              </div>
            </div>
          </div>

          {/* Background Content (blurred) */}
          <div className="opacity-30 min-h-[200px]">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#F4E4B8] to-[#E8D5A3] rounded-full flex items-center justify-center mr-3">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">추천 검색어</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularKeywords.map((keyword) => (
                <button
                  key={keyword}
                  className="px-3 py-2 bg-gray-100 rounded-full text-sm text-gray-700"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="mt-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm min-h-[200px]">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#B5D4C8] to-[#A3C9B8] rounded-full flex items-center justify-center mr-3">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">나의 서재 현황</h3>
          </div>
          
          {stats.isLoading ? (
            // 로딩 상태
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-300 animate-pulse">---</div>
                <div className="text-sm text-gray-500">로딩 중...</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-300 animate-pulse">---</div>
                <div className="text-sm text-gray-500">로딩 중...</div>
              </div>
            </div>
          ) : stats.totalBooks === 0 && stats.totalReviews === 0 ? (
            // 데이터가 없는 상태
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">아직 데이터가 없어요</h4>
              <p className="text-gray-500 text-sm mb-4">
                첫 번째 책을 검색하고 리뷰를 작성해보세요!
              </p>
              <div className="flex justify-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center">
                  <BookOpen className="w-3 h-3 mr-1" />
                  <span>책 검색</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-3 h-3 mr-1" />
                  <span>리뷰 작성</span>
                </div>
              </div>
            </div>
          ) : (
            // 실제 데이터 표시
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#A8B5E8]">
                  {stats.totalBooks.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">등록된 책</div>
                {stats.totalBooks < 10 && (
                  <div className="text-xs text-orange-500 mt-1">📈 성장 중</div>
                )}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#B5D4C8]">
                  {stats.totalReviews.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">감상문</div>
                {stats.totalReviews < 5 && (
                  <div className="text-xs text-orange-500 mt-1">💝 첫 감상문을 작성해보세요!</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchPage; 