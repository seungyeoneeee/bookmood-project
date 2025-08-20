"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Filter, Search, X, Heart, Star, Calendar, BookOpen, Tag, Users, TrendingUp, Sparkles } from 'lucide-react';
export interface FilterableBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  rating?: number;
  publishedYear?: string;
  genre?: string;
  pages?: number;
  dominantEmotions: string[];
  emotionScores: {
    [emotion: string]: number;
  };
  readerCount: number;
  averageRating: number;
  tags: string[];
}
interface EmotionFilterViewProps {
  books: FilterableBook[];
  onBack: () => void;
  onBookSelect?: (book: FilterableBook) => void;
  onViewEmotionStats?: (book: FilterableBook) => void;
}
type SortType = 'relevance' | 'rating' | 'readers' | 'recent';
const EmotionFilterView: React.FC<EmotionFilterViewProps> = ({
  books,
  onBack,
  onBookSelect,
  onViewEmotionStats
}) => {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('relevance');
  const [minRating, setMinRating] = useState<number>(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Available emotions with colors and icons
  const emotionCategories = [{
    category: '긍정적 감정',
    emotions: [{
      name: '기쁨',
      color: '#F4E4B8',
      count: 0
    }, {
      name: '사랑',
      color: '#E91E63',
      count: 0
    }, {
      name: '평온',
      color: '#B5D4C8',
      count: 0
    }, {
      name: '영감',
      color: '#00D4AA',
      count: 0
    }, {
      name: '흥미진진',
      color: '#FF9500',
      count: 0
    }, {
      name: '희망',
      color: '#4CAF50',
      count: 0
    }]
  }, {
    category: '복합적 감정',
    emotions: [{
      name: '그리움',
      color: '#9C27B0',
      count: 0
    }, {
      name: '향수',
      color: '#795548',
      count: 0
    }, {
      name: '경이로움',
      color: '#FF5722',
      count: 0
    }, {
      name: '감동',
      color: '#E91E63',
      count: 0
    }, {
      name: '깨달음',
      color: '#607D8B',
      count: 0
    }]
  }, {
    category: '내성적 감정',
    emotions: [{
      name: '슬픔',
      color: '#A8B5E8',
      count: 0
    }, {
      name: '우울감',
      color: '#6C7CE0',
      count: 0
    }, {
      name: '고독',
      color: '#95A5A6',
      count: 0
    }, {
      name: '두려움',
      color: '#95A5A6',
      count: 0
    }, {
      name: '불안',
      color: '#FF6B6B',
      count: 0
    }]
  }] as any[];

  // Calculate emotion counts from books
  const emotionCounts = useMemo(() => {
    const counts: {
      [emotion: string]: number;
    } = {};
    books.forEach(book => {
      book.dominantEmotions.forEach(emotion => {
        counts[emotion] = (counts[emotion] || 0) + 1;
      });
    });
    return counts;
  }, [books]);

  // Update emotion counts in categories
  const categoriesWithCounts = useMemo(() => {
    return emotionCategories.map(category => ({
      ...category,
      emotions: category.emotions.map(emotion => ({
        ...emotion,
        count: emotionCounts[emotion.name] || 0
      }))
    }));
  }, [emotionCounts]);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let filtered = books;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase()) || book.genre?.toLowerCase().includes(searchQuery.toLowerCase()) || book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    }

    // Emotion filter
    if (selectedEmotions.length > 0) {
      filtered = filtered.filter(book => selectedEmotions.some(emotion => book.dominantEmotions.includes(emotion)));
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(book => (book.averageRating || 0) >= minRating);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortType) {
        case 'relevance':
          if (selectedEmotions.length === 0) return 0;
          const aScore = selectedEmotions.reduce((sum, emotion) => sum + (a.emotionScores[emotion] || 0), 0);
          const bScore = selectedEmotions.reduce((sum, emotion) => sum + (b.emotionScores[emotion] || 0), 0);
          return bScore - aScore;
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'readers':
          return b.readerCount - a.readerCount;
        case 'recent':
          return parseInt(b.publishedYear || '0') - parseInt(a.publishedYear || '0');
        default:
          return 0;
      }
    });
    return filtered;
  }, [books, searchQuery, selectedEmotions, minRating, sortType]);
  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]);
  };
  const clearAllFilters = () => {
    setSelectedEmotions([]);
    setSearchQuery('');
    setMinRating(0);
    setSortType('relevance');
  };
  const getEmotionIntensity = (book: FilterableBook, emotion: string) => {
    const score = book.emotionScores[emotion] || 0;
    if (score >= 0.8) return '매우 강함';
    if (score >= 0.6) return '강함';
    if (score >= 0.4) return '보통';
    if (score >= 0.2) return '약함';
    return '매우 약함';
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="min-h-screen">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">감정별 책 찾기</h1>
            <p className="text-sm text-gray-600">{filteredBooks.length}권의 책</p>
          </div>
          <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="책 제목, 작가, 장르로 검색..." className="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20" />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>}
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvancedFilters && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">고급 필터</h3>
                  <button onClick={clearAllFilters} className="text-xs text-gray-600 hover:text-gray-800">
                    모두 초기화
                  </button>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">정렬</label>
                  <select value={sortType} onChange={e => setSortType(e.target.value as SortType)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#A8B5E8]">
                    <option value="relevance">관련도순</option>
                    <option value="rating">평점순</option>
                    <option value="readers">독자수순</option>
                    <option value="recent">최신순</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최소 평점: {minRating}점 이상
                  </label>
                  <input type="range" min="0" max="5" step="0.5" value={minRating} onChange={e => setMinRating(parseFloat(e.target.value))} className="w-full" />
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>

        {/* Emotion Categories */}
        <div className="space-y-6 mb-8">
          {categoriesWithCounts.map((category, categoryIndex) => <div key={category.category} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {category.category}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {category.emotions.map(emotion => <button key={emotion.name} onClick={() => toggleEmotion(emotion.name)} disabled={emotion.count === 0} className={`p-3 rounded-xl border-2 transition-all text-left ${selectedEmotions.includes(emotion.name) ? 'border-[#A8B5E8] bg-[#A8B5E8]/10' : emotion.count > 0 ? 'border-gray-200 hover:border-gray-300' : 'border-gray-100 opacity-50 cursor-not-allowed'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-4 h-4 rounded-full" style={{
                  backgroundColor: emotion.color
                }} />
                      <span className="text-xs text-gray-500">{emotion.count}</span>
                    </div>
                    <div className="font-medium text-gray-800 text-sm">
                      {emotion.name}
                    </div>
                  </button>)}
              </div>
            </div>)}
        </div>

        {/* Selected Emotions */}
        {selectedEmotions.length > 0 && <div className="bg-[#A8B5E8]/10 border border-[#A8B5E8]/20 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800">선택된 감정</h4>
              <button onClick={() => setSelectedEmotions([])} className="text-xs text-gray-600 hover:text-gray-800">
                모두 해제
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedEmotions.map(emotion => {
            const emotionData = categoriesWithCounts.flatMap(cat => cat.emotions).find(e => e.name === emotion);
            return <span key={emotion} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200 flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{
                backgroundColor: emotionData?.color || '#A8B5E8'
              }} />
                    <span>{emotion}</span>
                    <button onClick={() => toggleEmotion(emotion)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>;
          })}
            </div>
          </div>}

        {/* Books List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredBooks.map((book, index) => <motion.div key={book.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            x: -100
          }} transition={{
            delay: index * 0.05
          }} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex space-x-4">
                  <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded-lg shadow-sm" />
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-xs">{book.author}</p>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-[#F4E4B8] fill-current mr-1" />
                        <span>{book.averageRating?.toFixed(1) || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        <span>{book.readerCount}</span>
                      </div>
                      {book.publishedYear && <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{book.publishedYear}</span>
                        </div>}
                    </div>

                    <p className="text-gray-700 text-xs line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>

                    {/* Dominant Emotions */}
                    <div className="flex flex-wrap gap-1">
                      {book.dominantEmotions.slice(0, 3).map((emotion, idx) => {
                    const emotionData = categoriesWithCounts.flatMap(cat => cat.emotions).find(e => e.name === emotion);
                    const isSelected = selectedEmotions.includes(emotion);
                    return <span key={idx} className={`px-2 py-0.5 text-xs rounded-full border flex items-center space-x-1 ${isSelected ? 'bg-[#A8B5E8]/20 text-[#A8B5E8] border-[#A8B5E8]/30 font-medium' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                            <div className="w-2 h-2 rounded-full" style={{
                        backgroundColor: emotionData?.color || '#A8B5E8'
                      }} />
                            <span>{emotion}</span>
                            {isSelected && <Sparkles className="w-2 h-2" />}
                          </span>;
                  })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex space-x-2">
                        {onBookSelect && <button onClick={() => onBookSelect(book)} className="px-3 py-1 text-xs bg-[#A8B5E8] text-white rounded-lg hover:bg-[#8BB5E8] transition-colors">
                            읽기
                          </button>}
                        {onViewEmotionStats && <button onClick={() => onViewEmotionStats(book)} className="px-3 py-1 text-xs bg-[#B5D4C8] text-white rounded-lg hover:bg-[#A8D4C8] transition-colors flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>통계</span>
                          </button>}
                      </div>
                      <button className="p-1 text-gray-400 hover:text-pink-500 transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>)}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              조건에 맞는 책이 없습니다
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              다른 감정이나 필터를 시도해보세요
            </p>
            <button onClick={clearAllFilters} className="px-4 py-2 bg-[#A8B5E8] text-white rounded-xl text-sm hover:bg-[#8BB5E8] transition-colors">
              필터 초기화
            </button>
          </motion.div>}
      </div>
    </motion.div>;
};
export default EmotionFilterView;