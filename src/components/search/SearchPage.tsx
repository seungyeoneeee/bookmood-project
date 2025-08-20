import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, Filter, X, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchPageProps {
  onBack: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

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
      className="min-h-screen px-4 py-8"
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

        {/* Popular Books Suggestion */}
        <div className="mt-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#F4E4B8] to-[#E8D5A3] rounded-full flex items-center justify-center mr-3">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">인기 검색어</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['달러구트 꿈 백화점', '아몬드', '미드나이트 라이브러리', '어린왕자', '데미안'].map((keyword) => (
              <button
                key={keyword}
                onClick={() => {
                  setSearchQuery(keyword);
                  navigate(`/search/results?q=${encodeURIComponent(keyword)}`);
                }}
                className="px-3 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* Community Stats */}
        <div className="mt-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#B5D4C8] to-[#A3C9B8] rounded-full flex items-center justify-center mr-3">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">커뮤니티 현황</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              {/* TODO: 실제 데이터 연동 */}
              <div className="text-2xl font-bold text-[#A8B5E8]">2,384</div>
              <div className="text-sm text-gray-600">등록된 책</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#B5D4C8]">8,942</div>
              <div className="text-sm text-gray-600">감정 리뷰</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchPage; 