"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Book, Star, User, Calendar, Sparkles, Send, Loader2, X, BookOpen, Heart, Tag, Clock, Award, Smile, Frown, Meh, Zap, Coffee, Flame, Droplets, Sun, Moon, Cloud, Rainbow, Snowflake, Leaf, Mountain, Waves, Filter, Users, TrendingUp } from 'lucide-react';
interface BookData {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  isbn?: string;
  publishedYear?: string;
  rating?: number;
  publisher?: string;
  genre?: string;
  pages?: number;
  dominantEmotions?: string[];
  emotionScores?: {
    [emotion: string]: number;
  };
  readerCount?: number;
  averageRating?: number;
  tags?: string[];
  mpid?: string;
}
interface BookSearchAndFilterProps {
  onReviewSubmit: (bookData: BookData, reviewText: string, selectedEmotions: string[]) => void;
  onBack: () => void;
  onWishlistToggle?: (book: BookData) => void;
  onStartReading?: (book: BookData) => void;
  onViewEmotionStats?: (book: BookData) => void;
  wishlistBooks?: string[];
  mpid?: string;
}
type FlowStep = 'search' | 'book-list' | 'book-detail' | 'review' | 'emotion-filter';
type SortType = 'relevance' | 'rating' | 'readers' | 'recent';
interface EmotionCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  subcategories: string[];
  mpid?: string;
}
const BookSearchAndFilter: React.FC<BookSearchAndFilterProps> = ({
  onReviewSubmit,
  onBack,
  onWishlistToggle,
  onStartReading,
  onViewEmotionStats,
  wishlistBooks = []
}) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookData[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter states
  const [selectedFilterEmotions, setSelectedFilterEmotions] = useState<string[]>([]);
  const [sortType, setSortType] = useState<SortType>('relevance');
  const [minRating, setMinRating] = useState<number>(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Enhanced mock book data with emotion data
  const mockBooks: BookData[] = [{
    id: '1',
    title: '달러구트 꿈 백화점',
    author: '이미예',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    description: '잠들어야만 입장할 수 있는 신비한 꿈 백화점에서 벌어지는 따뜻하고 환상적인 이야기.',
    publishedYear: '2020',
    rating: 4.5,
    publisher: '팩토리나인',
    genre: '판타지',
    pages: 312,
    dominantEmotions: ['기쁨', '평온', '영감'],
    emotionScores: {
      '기쁨': 0.8,
      '평온': 0.7,
      '영감': 0.6,
      '슬픔': 0.1,
      '사랑': 0.2,
      '깨달음': 0.3
    },
    readerCount: 1250,
    averageRating: 4.5,
    tags: ['판타지', '힐링', '꿈'],
    mpid: "3345c6ca-c436-4004-a4bf-41e5d8b852a3"
  }, {
    id: '2',
    title: '아몬드',
    author: '손원평',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
    description: '감정을 느끼지 못하는 소년 윤재의 성장 이야기를 통해 인간의 감정과 공감에 대해 탐구하는 소설.',
    publishedYear: '2017',
    rating: 4.7,
    publisher: '창비',
    genre: '청소년 소설',
    pages: 267,
    dominantEmotions: ['슬픔', '사랑', '깨달음'],
    emotionScores: {
      '슬픔': 0.7,
      '사랑': 0.8,
      '깨달음': 0.6,
      '기쁨': 0.2,
      '평온': 0.1,
      '영감': 0.3
    },
    readerCount: 2100,
    averageRating: 4.7,
    tags: ['성장', '감정', '청소년'],
    mpid: "5839e606-b15f-4064-8efc-147581835d02"
  }, {
    id: '3',
    title: '미드나이트 라이브러리',
    author: '매트 헤이그',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop',
    description: '삶과 죽음 사이에 존재하는 도서관에서 다양한 인생의 가능성을 탐험하는 철학적 소설.',
    publishedYear: '2020',
    rating: 4.3,
    publisher: '인플루엔셜',
    genre: '철학 소설',
    pages: 288,
    dominantEmotions: ['깨달음', '그리움', '희망'],
    emotionScores: {
      '깨달음': 0.9,
      '그리움': 0.6,
      '희망': 0.7,
      '슬픔': 0.4,
      '영감': 0.5
    },
    readerCount: 890,
    averageRating: 4.3,
    tags: ['철학', '인생', '선택'],
    mpid: "c2749605-3e26-452b-bb52-88714b110301"
  }];

  // Detailed emotion categories
  const emotionCategories: EmotionCategory[] = [{
    id: 'joy',
    name: '기쁨',
    icon: <Smile className="w-4 h-4" data-magicpath-id="0" data-magicpath-path="BookSearchAndFilter.tsx" />,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    subcategories: ['행복', '즐거움', '만족', '희열', '환희', '기대감', '설렘', '감동'],
    mpid: "d99bbd35-2d91-410a-9482-f9d14a5a8cde"
  }, {
    id: 'sadness',
    name: '슬픔',
    icon: <Frown className="w-4 h-4" data-magicpath-id="1" data-magicpath-path="BookSearchAndFilter.tsx" />,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    subcategories: ['우울', '아쉬움', '그리움', '애잔함', '쓸쓸함', '허무', '절망', '안타까움'],
    mpid: "0d179b37-4d93-4628-a01b-597c7a53758e"
  }, {
    id: 'love',
    name: '사랑',
    icon: <Heart className="w-4 h-4" data-magicpath-id="2" data-magicpath-path="BookSearchAndFilter.tsx" />,
    color: 'bg-pink-100 text-pink-700 border-pink-200',
    subcategories: ['애정', '따뜻함', '친밀감', '소중함', '아끼는 마음', '연민', '동정', '공감'],
    mpid: "aa477fb2-2dd0-4b18-a984-f746219c4656"
  }, {
    id: 'peace',
    name: '평온',
    icon: <Leaf className="w-4 h-4" data-magicpath-id="3" data-magicpath-path="BookSearchAndFilter.tsx" />,
    color: 'bg-green-100 text-green-700 border-green-200',
    subcategories: ['고요함', '차분함', '안정감', '편안함', '여유', '평화', '휴식', '치유'],
    mpid: "66b1ca67-276c-4327-8d2a-2d196c66f0c2"
  }, {
    id: 'inspiration',
    name: '영감',
    icon: <Rainbow className="w-4 h-4" />,
    color: 'bg-teal-100 text-teal-700 border-teal-200',
    subcategories: ['깨달음', '통찰', '자극', '동기부여', '희망', '용기', '의지', '결심'],
    mpid: "3de1e1da-e57f-4977-8da1-d2357c0c4bd4"
  }];

  // Available emotions for filtering
  const filterEmotionCategories = [{
    category: '긍정적 감정',
    emotions: [{
      name: '기쁨',
      color: '#F4E4B8',
      count: 0,
      mpid: "e10524ae-9ffb-42e4-a4cf-54bcc5ff8aa7"
    }, {
      name: '사랑',
      color: '#E91E63',
      count: 0,
      mpid: "49fc79a3-68f1-43a3-95ba-704cfdc8b767"
    }, {
      name: '평온',
      color: '#B5D4C8',
      count: 0,
      mpid: "98b63c28-efb2-4396-be39-987438d00e91"
    }, {
      name: '영감',
      color: '#00D4AA',
      count: 0,
      mpid: "3da2887d-fcac-4c54-a0ec-0229662e144b"
    }, {
      name: '희망',
      color: '#4CAF50',
      count: 0,
      mpid: "d4c76b22-ded8-4bf3-b852-52012fb1bdca"
    }],
    mpid: "566888dc-58d0-449b-a37e-168b9126c859"
  }, {
    category: '복합적 감정',
    emotions: [{
      name: '그리움',
      color: '#9C27B0',
      count: 0,
      mpid: "b7c9a240-43a0-46bd-a289-773da56efc3b"
    }, {
      name: '감동',
      color: '#E91E63',
      count: 0,
      mpid: "ef873d79-003f-4b78-8de3-db71e07d4072"
    }, {
      name: '깨달음',
      color: '#607D8B',
      count: 0,
      mpid: "d4b5ce3a-ac1b-463e-bafc-4917b3bfc4f6"
    }],
    mpid: "9a3d90c0-1e6a-4ba0-8021-f7378116a1e7"
  }, {
    category: '내성적 감정',
    emotions: [{
      name: '슬픔',
      color: '#A8B5E8',
      count: 0,
      mpid: "e4dd110c-25ac-4349-b7d3-c845e04fcfe8"
    }, {
      name: '고독',
      color: '#95A5A6',
      count: 0,
      mpid: "cf84a7e8-bc13-4ea0-86f3-4b677624663e"
    }],
    mpid: "ec7defa7-6b0e-49b3-86d4-dc1c35bd7112"
  }] as any[];
  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]);
  };
  const toggleFilterEmotion = (emotion: string) => {
    setSelectedFilterEmotions(prev => prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]);
  };
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Filter mock books based on search query
    const results = mockBooks.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase()) || book.genre?.toLowerCase().includes(searchQuery.toLowerCase()));
    setSearchResults(results);
    setCurrentStep('book-list');
    setIsSearching(false);
  };
  const handleBookSelect = (book: BookData) => {
    setSelectedBook(book);
    setCurrentStep('book-detail');
  };
  const handleProceedToReview = () => {
    setCurrentStep('review');
  };
  const handleSubmitReview = async () => {
    if (!selectedBook || !reviewText.trim() || selectedEmotions.length === 0) return;
    setIsSubmitting(true);

    // Mock AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    onReviewSubmit(selectedBook, reviewText, selectedEmotions);
    setIsSubmitting(false);
  };
  const getFilteredBooks = () => {
    let filtered = searchResults;

    // Emotion filter
    if (selectedFilterEmotions.length > 0) {
      filtered = filtered.filter(book => selectedFilterEmotions.some(emotion => book.dominantEmotions?.includes(emotion)));
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(book => (book.averageRating || 0) >= minRating);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortType) {
        case 'relevance':
          if (selectedFilterEmotions.length === 0) return 0;
          const aScore = selectedFilterEmotions.reduce((sum, emotion) => sum + (a.emotionScores?.[emotion] || 0), 0);
          const bScore = selectedFilterEmotions.reduce((sum, emotion) => sum + (b.emotionScores?.[emotion] || 0), 0);
          return bScore - aScore;
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'readers':
          return (b.readerCount || 0) - (a.readerCount || 0);
        case 'recent':
          return parseInt(b.publishedYear || '0') - parseInt(a.publishedYear || '0');
        default:
          return 0;
      }
    });
    return filtered;
  };
  const renderSearchStep = () => <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} className="min-h-screen px-4 py-8" data-magicpath-id="4" data-magicpath-path="BookSearchAndFilter.tsx">
      <div className="max-w-sm mx-auto" data-magicpath-id="5" data-magicpath-path="BookSearchAndFilter.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-magicpath-id="6" data-magicpath-path="BookSearchAndFilter.tsx">
          <button onClick={onBack} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors" data-magicpath-id="7" data-magicpath-path="BookSearchAndFilter.tsx">
            <ArrowLeft className="w-5 h-5 text-gray-600" data-magicpath-id="8" data-magicpath-path="BookSearchAndFilter.tsx" />
          </button>
          <h1 className="text-xl font-bold text-gray-800" data-magicpath-id="9" data-magicpath-path="BookSearchAndFilter.tsx">AI 책 추천 & 검색</h1>
          <button onClick={() => setCurrentStep('emotion-filter')} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors" data-magicpath-id="10" data-magicpath-path="BookSearchAndFilter.tsx">
            <Filter className="w-5 h-5 text-gray-600" data-magicpath-id="11" data-magicpath-path="BookSearchAndFilter.tsx" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-8" data-magicpath-id="12" data-magicpath-path="BookSearchAndFilter.tsx">
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSearch()} placeholder="책 제목, 작가, 장르를 검색하세요" className="w-full px-4 py-4 pl-12 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20 shadow-sm" data-magicpath-id="13" data-magicpath-path="BookSearchAndFilter.tsx" />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" data-magicpath-id="14" data-magicpath-path="BookSearchAndFilter.tsx" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2" data-magicpath-id="15" data-magicpath-path="BookSearchAndFilter.tsx">
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" data-magicpath-id="16" data-magicpath-path="BookSearchAndFilter.tsx" />
            </button>}
        </div>

        <button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} className="w-full py-4 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-8 shadow-lg hover:shadow-xl transition-shadow" data-magicpath-id="17" data-magicpath-path="BookSearchAndFilter.tsx">
          {isSearching ? <div className="flex items-center justify-center space-x-2" data-magicpath-id="18" data-magicpath-path="BookSearchAndFilter.tsx">
              <Loader2 className="w-5 h-5 animate-spin" data-magicpath-id="19" data-magicpath-path="BookSearchAndFilter.tsx" />
              <span data-magicpath-id="20" data-magicpath-path="BookSearchAndFilter.tsx">검색 중...</span>
            </div> : '검색하기'}
        </button>

        {/* AI Recommendation Section */}
        <div className="bg-gradient-to-r from-[#A8B5E8]/10 to-[#B5D4C8]/10 rounded-2xl p-6 border border-gray-100 mb-6" data-magicpath-id="21" data-magicpath-path="BookSearchAndFilter.tsx">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center" data-magicpath-id="22" data-magicpath-path="BookSearchAndFilter.tsx">
            <Sparkles className="w-5 h-5 mr-2 text-[#A8B5E8]" />
            AI 맞춤 추천
          </h3>
          <p className="text-sm text-gray-600 mb-4" data-magicpath-id="23" data-magicpath-path="BookSearchAndFilter.tsx">
            당신의 감정 취향을 분석해서 추천해드려요
          </p>
          <button onClick={() => setCurrentStep('emotion-filter')} className="w-full py-3 bg-gradient-to-r from-[#B5D4C8] to-[#A8D4C8] text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-shadow" data-magicpath-id="24" data-magicpath-path="BookSearchAndFilter.tsx">
            감정별 책 찾기
          </button>
        </div>

        {/* Popular Books Suggestion */}
        <div className="bg-gradient-to-r from-[#F4E4B8]/10 to-[#F0E4B8]/10 rounded-2xl p-6 border border-gray-100" data-magicpath-id="25" data-magicpath-path="BookSearchAndFilter.tsx">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center" data-magicpath-id="26" data-magicpath-path="BookSearchAndFilter.tsx">
            <Award className="w-5 h-5 mr-2 text-[#F4E4B8]" data-magicpath-id="27" data-magicpath-path="BookSearchAndFilter.tsx" />
            인기 도서 추천
          </h3>
          <div className="space-y-3" data-magicpath-id="28" data-magicpath-path="BookSearchAndFilter.tsx">
            {mockBooks.slice(0, 3).map(book => <button key={book.id} onClick={() => {
            setSearchQuery(book.title);
            setSearchResults([book]);
            setCurrentStep('book-list');
          }} className="w-full text-left p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors border border-white/50" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="29" data-magicpath-path="BookSearchAndFilter.tsx">
                <div className="flex items-center space-x-3" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="30" data-magicpath-path="BookSearchAndFilter.tsx">
                  <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded-lg shadow-sm" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="cover:unknown" data-magicpath-id="31" data-magicpath-path="BookSearchAndFilter.tsx" />
                  <div className="flex-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="32" data-magicpath-path="BookSearchAndFilter.tsx">
                    <h4 className="font-medium text-gray-800 text-sm" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="title:unknown" data-magicpath-id="33" data-magicpath-path="BookSearchAndFilter.tsx">{book.title}</h4>
                    <p className="text-gray-600 text-xs" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="author:unknown" data-magicpath-id="34" data-magicpath-path="BookSearchAndFilter.tsx">{book.author}</p>
                    <div className="flex items-center mt-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="35" data-magicpath-path="BookSearchAndFilter.tsx">
                      <Star className="w-3 h-3 text-[#F4E4B8] fill-current mr-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="36" data-magicpath-path="BookSearchAndFilter.tsx" />
                      <span className="text-xs text-gray-500" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="rating:unknown" data-magicpath-id="37" data-magicpath-path="BookSearchAndFilter.tsx">{book.rating}</span>
                    </div>
                  </div>
                </div>
              </button>)}
          </div>
        </div>
      </div>
    </motion.div>;
  const renderEmotionFilterStep = () => {
    const filteredBooks = getFilteredBooks();
    return <motion.div initial={{
      opacity: 0,
      x: 20
    }} animate={{
      opacity: 1,
      x: 0
    }} exit={{
      opacity: 0,
      x: -20
    }} className="min-h-screen px-4 py-8" data-magicpath-id="38" data-magicpath-path="BookSearchAndFilter.tsx">
        <div className="max-w-sm mx-auto" data-magicpath-id="39" data-magicpath-path="BookSearchAndFilter.tsx">
          {/* Header */}
          <div className="flex items-center justify-between mb-8" data-magicpath-id="40" data-magicpath-path="BookSearchAndFilter.tsx">
            <button onClick={() => setCurrentStep('search')} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors" data-magicpath-id="41" data-magicpath-path="BookSearchAndFilter.tsx">
              <ArrowLeft className="w-5 h-5 text-gray-600" data-magicpath-id="42" data-magicpath-path="BookSearchAndFilter.tsx" />
            </button>
            <div className="text-center" data-magicpath-id="43" data-magicpath-path="BookSearchAndFilter.tsx">
              <h1 className="text-xl font-bold text-gray-800" data-magicpath-id="44" data-magicpath-path="BookSearchAndFilter.tsx">감정별 책 찾기</h1>
              <p className="text-sm text-gray-600" data-magicpath-id="45" data-magicpath-path="BookSearchAndFilter.tsx">{filteredBooks.length}권의 책</p>
            </div>
            <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors" data-magicpath-id="46" data-magicpath-path="BookSearchAndFilter.tsx">
              <Filter className="w-5 h-5 text-gray-600" data-magicpath-id="47" data-magicpath-path="BookSearchAndFilter.tsx" />
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence data-magicpath-id="48" data-magicpath-path="BookSearchAndFilter.tsx">
            {showAdvancedFilters && <motion.div initial={{
            opacity: 0,
            height: 0
          }} animate={{
            opacity: 1,
            height: 'auto'
          }} exit={{
            opacity: 0,
            height: 0
          }} className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm" data-magicpath-id="49" data-magicpath-path="BookSearchAndFilter.tsx">
                <div className="space-y-4" data-magicpath-id="50" data-magicpath-path="BookSearchAndFilter.tsx">
                  <div className="flex items-center justify-between" data-magicpath-id="51" data-magicpath-path="BookSearchAndFilter.tsx">
                    <h3 className="font-medium text-gray-800" data-magicpath-id="52" data-magicpath-path="BookSearchAndFilter.tsx">고급 필터</h3>
                    <button onClick={() => {
                  setSelectedFilterEmotions([]);
                  setMinRating(0);
                  setSortType('relevance');
                }} className="text-xs text-gray-600 hover:text-gray-800" data-magicpath-id="53" data-magicpath-path="BookSearchAndFilter.tsx">
                      모두 초기화
                    </button>
                  </div>

                  {/* Sort */}
                  <div data-magicpath-id="54" data-magicpath-path="BookSearchAndFilter.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="55" data-magicpath-path="BookSearchAndFilter.tsx">정렬</label>
                    <select value={sortType} onChange={e => setSortType(e.target.value as SortType)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#A8B5E8]" data-magicpath-id="56" data-magicpath-path="BookSearchAndFilter.tsx">
                      <option value="relevance" data-magicpath-id="57" data-magicpath-path="BookSearchAndFilter.tsx">관련도순</option>
                      <option value="rating" data-magicpath-id="58" data-magicpath-path="BookSearchAndFilter.tsx">평점순</option>
                      <option value="readers" data-magicpath-id="59" data-magicpath-path="BookSearchAndFilter.tsx">독자수순</option>
                      <option value="recent" data-magicpath-id="60" data-magicpath-path="BookSearchAndFilter.tsx">최신순</option>
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div data-magicpath-id="61" data-magicpath-path="BookSearchAndFilter.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="62" data-magicpath-path="BookSearchAndFilter.tsx">
                      최소 평점: {minRating}점 이상
                    </label>
                    <input type="range" min="0" max="5" step="0.5" value={minRating} onChange={e => setMinRating(parseFloat(e.target.value))} className="w-full" data-magicpath-id="63" data-magicpath-path="BookSearchAndFilter.tsx" />
                  </div>
                </div>
              </motion.div>}
          </AnimatePresence>

          {/* Emotion Categories */}
          <div className="space-y-6 mb-8" data-magicpath-id="64" data-magicpath-path="BookSearchAndFilter.tsx">
            {filterEmotionCategories.map(category => <div key={category.category} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" data-magicpath-uuid={(category as any)["mpid"] ?? "unsafe"} data-magicpath-id="65" data-magicpath-path="BookSearchAndFilter.tsx">
                <h3 className="text-lg font-semibold text-gray-800 mb-4" data-magicpath-uuid={(category as any)["mpid"] ?? "unsafe"} data-magicpath-field="category:unknown" data-magicpath-id="66" data-magicpath-path="BookSearchAndFilter.tsx">
                  {category.category}
                </h3>
                <div className="grid grid-cols-2 gap-3" data-magicpath-uuid={(category as any)["mpid"] ?? "unsafe"} data-magicpath-id="67" data-magicpath-path="BookSearchAndFilter.tsx">
                  {category.emotions.map(emotion => <button key={emotion.name} onClick={() => toggleFilterEmotion(emotion.name)} className={`p-3 rounded-xl border-2 transition-all text-left ${selectedFilterEmotions.includes(emotion.name) ? 'border-[#A8B5E8] bg-[#A8B5E8]/10' : 'border-gray-200 hover:border-gray-300'}`} data-magicpath-uuid={(category as any)["mpid"] ?? "unsafe"} data-magicpath-id="68" data-magicpath-path="BookSearchAndFilter.tsx">
                      <div className="flex items-center justify-between mb-2" data-magicpath-uuid={(category as any)["mpid"] ?? "unsafe"} data-magicpath-id="69" data-magicpath-path="BookSearchAndFilter.tsx">
                        <div className="w-4 h-4 rounded-full" style={{
                    backgroundColor: emotion.color
                  }} data-magicpath-uuid={(category as any)["mpid"] ?? "unsafe"} data-magicpath-id="70" data-magicpath-path="BookSearchAndFilter.tsx" />
                        <span className="text-xs text-gray-500" data-magicpath-uuid={(category as any)["mpid"] ?? "unsafe"} data-magicpath-id="71" data-magicpath-path="BookSearchAndFilter.tsx">{emotion.count}</span>
                      </div>
                      <div className="font-medium text-gray-800 text-sm" data-magicpath-uuid={(category as any)["mpid"] ?? "unsafe"} data-magicpath-id="72" data-magicpath-path="BookSearchAndFilter.tsx">
                        {emotion.name}
                      </div>
                    </button>)}
                </div>
              </div>)}
          </div>

          {/* Selected Emotions */}
          {selectedFilterEmotions.length > 0 && <div className="bg-[#A8B5E8]/10 border border-[#A8B5E8]/20 rounded-2xl p-4 mb-6" data-magicpath-id="73" data-magicpath-path="BookSearchAndFilter.tsx">
              <div className="flex items-center justify-between mb-3" data-magicpath-id="74" data-magicpath-path="BookSearchAndFilter.tsx">
                <h4 className="font-medium text-gray-800" data-magicpath-id="75" data-magicpath-path="BookSearchAndFilter.tsx">선택된 감정</h4>
                <button onClick={() => setSelectedFilterEmotions([])} className="text-xs text-gray-600 hover:text-gray-800" data-magicpath-id="76" data-magicpath-path="BookSearchAndFilter.tsx">
                  모두 해제
                </button>
              </div>
              <div className="flex flex-wrap gap-2" data-magicpath-id="77" data-magicpath-path="BookSearchAndFilter.tsx">
                {selectedFilterEmotions.map(emotion => {
              const emotionData = filterEmotionCategories.flatMap(cat => cat.emotions).find(e => e.name === emotion);
              return <span key={emotion} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200 flex items-center space-x-2" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="78" data-magicpath-path="BookSearchAndFilter.tsx">
                      <div className="w-3 h-3 rounded-full" style={{
                  backgroundColor: emotionData?.color || '#A8B5E8'
                }} data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="79" data-magicpath-path="BookSearchAndFilter.tsx" />
                      <span data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="80" data-magicpath-path="BookSearchAndFilter.tsx">{emotion}</span>
                      <button onClick={() => toggleFilterEmotion(emotion)} className="text-gray-400 hover:text-gray-600" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="81" data-magicpath-path="BookSearchAndFilter.tsx">
                        <X className="w-3 h-3" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="82" data-magicpath-path="BookSearchAndFilter.tsx" />
                      </button>
                    </span>;
            })}
              </div>
            </div>}

          {/* Books List */}
          <div className="space-y-4" data-magicpath-id="83" data-magicpath-path="BookSearchAndFilter.tsx">
            <AnimatePresence data-magicpath-id="84" data-magicpath-path="BookSearchAndFilter.tsx">
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
            }} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="85" data-magicpath-path="BookSearchAndFilter.tsx">
                  <div className="flex space-x-4" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="86" data-magicpath-path="BookSearchAndFilter.tsx">
                    <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded-lg shadow-sm" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="cover:unknown" data-magicpath-id="87" data-magicpath-path="BookSearchAndFilter.tsx" />
                    <div className="flex-1 space-y-2" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="88" data-magicpath-path="BookSearchAndFilter.tsx">
                      <div data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="89" data-magicpath-path="BookSearchAndFilter.tsx">
                        <h3 className="font-semibold text-gray-800 text-sm leading-tight" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="title:unknown" data-magicpath-id="90" data-magicpath-path="BookSearchAndFilter.tsx">
                          {book.title}
                        </h3>
                        <p className="text-gray-600 text-xs" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="author:unknown" data-magicpath-id="91" data-magicpath-path="BookSearchAndFilter.tsx">{book.author}</p>
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-gray-500" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="92" data-magicpath-path="BookSearchAndFilter.tsx">
                        <div className="flex items-center" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="93" data-magicpath-path="BookSearchAndFilter.tsx">
                          <Star className="w-3 h-3 text-[#F4E4B8] fill-current mr-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="94" data-magicpath-path="BookSearchAndFilter.tsx" />
                          <span data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="95" data-magicpath-path="BookSearchAndFilter.tsx">{book.averageRating?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <div className="flex items-center" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="96" data-magicpath-path="BookSearchAndFilter.tsx">
                          <Users className="w-3 h-3 mr-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="97" data-magicpath-path="BookSearchAndFilter.tsx" />
                          <span data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="readerCount:unknown" data-magicpath-id="98" data-magicpath-path="BookSearchAndFilter.tsx">{book.readerCount}</span>
                        </div>
                        {book.publishedYear && <div className="flex items-center" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="99" data-magicpath-path="BookSearchAndFilter.tsx">
                            <Calendar className="w-3 h-3 mr-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="100" data-magicpath-path="BookSearchAndFilter.tsx" />
                            <span data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="publishedYear:unknown" data-magicpath-id="101" data-magicpath-path="BookSearchAndFilter.tsx">{book.publishedYear}</span>
                          </div>}
                      </div>

                      <p className="text-gray-700 text-xs line-clamp-2 leading-relaxed" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="description:unknown" data-magicpath-id="102" data-magicpath-path="BookSearchAndFilter.tsx">
                        {book.description}
                      </p>

                      {/* Dominant Emotions */}
                      <div className="flex flex-wrap gap-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="103" data-magicpath-path="BookSearchAndFilter.tsx">
                        {book.dominantEmotions?.slice(0, 3).map((emotion, idx) => {
                      const emotionData = filterEmotionCategories.flatMap(cat => cat.emotions).find(e => e.name === emotion);
                      const isSelected = selectedFilterEmotions.includes(emotion);
                      return <span key={idx} className={`px-2 py-0.5 text-xs rounded-full border flex items-center space-x-1 ${isSelected ? 'bg-[#A8B5E8]/20 text-[#A8B5E8] border-[#A8B5E8]/30 font-medium' : 'bg-gray-100 text-gray-600 border-gray-200'}`} data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="104" data-magicpath-path="BookSearchAndFilter.tsx">
                              <div className="w-2 h-2 rounded-full" style={{
                          backgroundColor: emotionData?.color || '#A8B5E8'
                        }} data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="105" data-magicpath-path="BookSearchAndFilter.tsx" />
                              <span data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="106" data-magicpath-path="BookSearchAndFilter.tsx">{emotion}</span>
                              {isSelected && <Sparkles className="w-2 h-2" />}
                            </span>;
                    })}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="107" data-magicpath-path="BookSearchAndFilter.tsx">
                        <div className="flex space-x-2" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="108" data-magicpath-path="BookSearchAndFilter.tsx">
                          <button onClick={() => handleBookSelect(book)} className="px-3 py-1 text-xs bg-[#A8B5E8] text-white rounded-lg hover:bg-[#8BB5E8] transition-colors" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="109" data-magicpath-path="BookSearchAndFilter.tsx">
                            읽기
                          </button>
                          {onViewEmotionStats && <button onClick={() => onViewEmotionStats(book)} className="px-3 py-1 text-xs bg-[#B5D4C8] text-white rounded-lg hover:bg-[#A8D4C8] transition-colors flex items-center space-x-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="110" data-magicpath-path="BookSearchAndFilter.tsx">
                              <TrendingUp className="w-3 h-3" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="111" data-magicpath-path="BookSearchAndFilter.tsx" />
                              <span data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="112" data-magicpath-path="BookSearchAndFilter.tsx">통계</span>
                            </button>}
                        </div>
                        <button onClick={() => onWishlistToggle?.(book)} className="p-1 text-gray-400 hover:text-pink-500 transition-colors" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="113" data-magicpath-path="BookSearchAndFilter.tsx">
                          <Heart className={`w-4 h-4 ${wishlistBooks.includes(book.id) ? 'fill-current text-pink-500' : ''}`} data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="114" data-magicpath-path="BookSearchAndFilter.tsx" />
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
        }} className="text-center py-16" data-magicpath-id="115" data-magicpath-path="BookSearchAndFilter.tsx">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" data-magicpath-id="116" data-magicpath-path="BookSearchAndFilter.tsx" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2" data-magicpath-id="117" data-magicpath-path="BookSearchAndFilter.tsx">
                조건에 맞는 책이 없습니다
              </h3>
              <p className="text-gray-600 text-sm mb-4" data-magicpath-id="118" data-magicpath-path="BookSearchAndFilter.tsx">
                다른 감정이나 필터를 시도해보세요
              </p>
              <button onClick={() => {
            setSelectedFilterEmotions([]);
            setMinRating(0);
            setSortType('relevance');
          }} className="px-4 py-2 bg-[#A8B5E8] text-white rounded-xl text-sm hover:bg-[#8BB5E8] transition-colors" data-magicpath-id="119" data-magicpath-path="BookSearchAndFilter.tsx">
                필터 초기화
              </button>
            </motion.div>}
        </div>
      </motion.div>;
  };
  const renderBookListStep = () => <motion.div initial={{
    opacity: 0,
    x: 20
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -20
  }} className="min-h-screen px-4 py-8" data-magicpath-id="120" data-magicpath-path="BookSearchAndFilter.tsx">
      <div className="max-w-sm mx-auto" data-magicpath-id="121" data-magicpath-path="BookSearchAndFilter.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-magicpath-id="122" data-magicpath-path="BookSearchAndFilter.tsx">
          <button onClick={() => setCurrentStep('search')} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors" data-magicpath-id="123" data-magicpath-path="BookSearchAndFilter.tsx">
            <ArrowLeft className="w-5 h-5 text-gray-600" data-magicpath-id="124" data-magicpath-path="BookSearchAndFilter.tsx" />
          </button>
          <div className="text-center" data-magicpath-id="125" data-magicpath-path="BookSearchAndFilter.tsx">
            <h1 className="text-xl font-bold text-gray-800" data-magicpath-id="126" data-magicpath-path="BookSearchAndFilter.tsx">검색 결과</h1>
            <p className="text-sm text-gray-600" data-magicpath-id="127" data-magicpath-path="BookSearchAndFilter.tsx">{searchResults.length}권의 책을 찾았습니다</p>
          </div>
          <button onClick={() => setCurrentStep('emotion-filter')} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors" data-magicpath-id="128" data-magicpath-path="BookSearchAndFilter.tsx">
            <Filter className="w-5 h-5 text-gray-600" data-magicpath-id="129" data-magicpath-path="BookSearchAndFilter.tsx" />
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 ? <div className="space-y-6" data-magicpath-id="130" data-magicpath-path="BookSearchAndFilter.tsx">
            {searchResults.map((book, index) => <motion.div key={book.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} onClick={() => handleBookSelect(book)} className="bg-white border border-gray-200 rounded-3xl p-6 active:scale-95 transition-all shadow-sm hover:shadow-lg cursor-pointer" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="131" data-magicpath-path="BookSearchAndFilter.tsx">
                <div className="flex space-x-4" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="132" data-magicpath-path="BookSearchAndFilter.tsx">
                  <div className="relative" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="133" data-magicpath-path="BookSearchAndFilter.tsx">
                    <img src={book.cover} alt={book.title} className="w-20 h-28 object-cover rounded-2xl shadow-lg" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="cover:unknown" data-magicpath-id="134" data-magicpath-path="BookSearchAndFilter.tsx" />
                    <button onClick={e => {
                e.stopPropagation();
                onWishlistToggle?.(book);
              }} className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg ${wishlistBooks.includes(book.id) ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-[#F4E4B8] to-[#F0E4B8]'}`} data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="135" data-magicpath-path="BookSearchAndFilter.tsx">
                      <Heart className={`w-3 h-3 ${wishlistBooks.includes(book.id) ? 'text-white fill-current' : 'text-white'}`} data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="136" data-magicpath-path="BookSearchAndFilter.tsx" />
                    </button>
                  </div>
                  
                  <div className="flex-1 space-y-3" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="137" data-magicpath-path="BookSearchAndFilter.tsx">
                    <div data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="138" data-magicpath-path="BookSearchAndFilter.tsx">
                      <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="title:unknown" data-magicpath-id="139" data-magicpath-path="BookSearchAndFilter.tsx">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-sm font-medium" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="author:unknown" data-magicpath-id="140" data-magicpath-path="BookSearchAndFilter.tsx">
                        {book.author}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-gray-500" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="141" data-magicpath-path="BookSearchAndFilter.tsx">
                      {book.publishedYear && <div className="flex items-center" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="142" data-magicpath-path="BookSearchAndFilter.tsx">
                          <Calendar className="w-3 h-3 mr-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="143" data-magicpath-path="BookSearchAndFilter.tsx" />
                          <span data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="publishedYear:unknown" data-magicpath-id="144" data-magicpath-path="BookSearchAndFilter.tsx">{book.publishedYear}</span>
                        </div>}
                      {book.pages && <div className="flex items-center" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="145" data-magicpath-path="BookSearchAndFilter.tsx">
                          <BookOpen className="w-3 h-3 mr-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="146" data-magicpath-path="BookSearchAndFilter.tsx" />
                          <span data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="pages:unknown" data-magicpath-id="147" data-magicpath-path="BookSearchAndFilter.tsx">{book.pages}p</span>
                        </div>}
                    </div>

                    <div className="flex items-center justify-between" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="148" data-magicpath-path="BookSearchAndFilter.tsx">
                      <div className="flex items-center space-x-2" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="149" data-magicpath-path="BookSearchAndFilter.tsx">
                        {book.rating && <div className="flex items-center bg-[#F4E4B8]/20 px-2 py-1 rounded-full" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="150" data-magicpath-path="BookSearchAndFilter.tsx">
                            <Star className="w-3 h-3 text-[#F4E4B8] fill-current mr-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="151" data-magicpath-path="BookSearchAndFilter.tsx" />
                            <span className="text-xs font-medium text-gray-700" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="rating:unknown" data-magicpath-id="152" data-magicpath-path="BookSearchAndFilter.tsx">{book.rating}</span>
                          </div>}
                        {book.genre && <div className="bg-[#B5D4C8]/20 px-2 py-1 rounded-full" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="153" data-magicpath-path="BookSearchAndFilter.tsx">
                            <span className="text-xs font-medium text-gray-700" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="genre:unknown" data-magicpath-id="154" data-magicpath-path="BookSearchAndFilter.tsx">{book.genre}</span>
                          </div>}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="description:unknown" data-magicpath-id="155" data-magicpath-path="BookSearchAndFilter.tsx">
                      {book.description}
                    </p>

                    <div className="flex items-center justify-between pt-2" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="156" data-magicpath-path="BookSearchAndFilter.tsx">
                      <p className="text-xs text-gray-500" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="publisher:unknown" data-magicpath-id="157" data-magicpath-path="BookSearchAndFilter.tsx">{book.publisher}</p>
                      <div className="flex items-center text-[#A8B5E8] text-xs font-medium" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="158" data-magicpath-path="BookSearchAndFilter.tsx">
                        <span data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="159" data-magicpath-path="BookSearchAndFilter.tsx">자세히 보기</span>
                        <ArrowLeft className="w-3 h-3 ml-1 rotate-180" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="160" data-magicpath-path="BookSearchAndFilter.tsx" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>)}
          </div> : <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} className="text-center py-16" data-magicpath-id="161" data-magicpath-path="BookSearchAndFilter.tsx">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" data-magicpath-id="162" data-magicpath-path="BookSearchAndFilter.tsx" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2" data-magicpath-id="163" data-magicpath-path="BookSearchAndFilter.tsx">검색 결과가 없습니다</h3>
            <p className="text-gray-600" data-magicpath-id="164" data-magicpath-path="BookSearchAndFilter.tsx">다른 키워드로 검색해보세요</p>
          </motion.div>}
      </div>
    </motion.div>;
  const renderBookDetailStep = () => <motion.div initial={{
    opacity: 0,
    x: 20
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -20
  }} className="min-h-screen px-4 py-8" data-magicpath-id="165" data-magicpath-path="BookSearchAndFilter.tsx">
      <div className="max-w-sm mx-auto" data-magicpath-id="166" data-magicpath-path="BookSearchAndFilter.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-magicpath-id="167" data-magicpath-path="BookSearchAndFilter.tsx">
          <button onClick={() => setCurrentStep('book-list')} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors" data-magicpath-id="168" data-magicpath-path="BookSearchAndFilter.tsx">
            <ArrowLeft className="w-5 h-5 text-gray-600" data-magicpath-id="169" data-magicpath-path="BookSearchAndFilter.tsx" />
          </button>
          <h1 className="text-xl font-bold text-gray-800" data-magicpath-id="170" data-magicpath-path="BookSearchAndFilter.tsx">책 정보</h1>
          <div className="w-10" data-magicpath-id="171" data-magicpath-path="BookSearchAndFilter.tsx" />
        </div>

        {selectedBook && <div className="space-y-6" data-magicpath-id="172" data-magicpath-path="BookSearchAndFilter.tsx">
            {/* Book Cover & Basic Info */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm" data-magicpath-id="173" data-magicpath-path="BookSearchAndFilter.tsx">
              <div className="text-center mb-6" data-magicpath-id="174" data-magicpath-path="BookSearchAndFilter.tsx">
                <img src={selectedBook.cover} alt={selectedBook.title} className="w-40 h-56 object-cover rounded-2xl shadow-xl mx-auto mb-6" data-magicpath-id="175" data-magicpath-path="BookSearchAndFilter.tsx" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2 leading-tight" data-magicpath-id="176" data-magicpath-path="BookSearchAndFilter.tsx">
                  {selectedBook.title}
                </h1>
                <p className="text-gray-600 text-lg font-medium mb-4" data-magicpath-id="177" data-magicpath-path="BookSearchAndFilter.tsx">{selectedBook.author}</p>
                
                <div className="flex items-center justify-center space-x-6 mb-6" data-magicpath-id="178" data-magicpath-path="BookSearchAndFilter.tsx">
                  {selectedBook.rating && <div className="flex items-center bg-[#F4E4B8]/20 px-3 py-2 rounded-full" data-magicpath-id="179" data-magicpath-path="BookSearchAndFilter.tsx">
                      <Star className="w-4 h-4 text-[#F4E4B8] fill-current mr-2" data-magicpath-id="180" data-magicpath-path="BookSearchAndFilter.tsx" />
                      <span className="text-sm font-semibold text-gray-700" data-magicpath-id="181" data-magicpath-path="BookSearchAndFilter.tsx">{selectedBook.rating}/5</span>
                    </div>}
                  {selectedBook.genre && <div className="bg-[#B5D4C8]/20 px-3 py-2 rounded-full" data-magicpath-id="182" data-magicpath-path="BookSearchAndFilter.tsx">
                      <span className="text-sm font-semibold text-gray-700" data-magicpath-id="183" data-magicpath-path="BookSearchAndFilter.tsx">{selectedBook.genre}</span>
                    </div>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6" data-magicpath-id="184" data-magicpath-path="BookSearchAndFilter.tsx">
                {selectedBook.publishedYear && <div className="text-center p-3 bg-gray-50 rounded-xl" data-magicpath-id="185" data-magicpath-path="BookSearchAndFilter.tsx">
                    <Calendar className="w-5 h-5 text-gray-600 mx-auto mb-1" data-magicpath-id="186" data-magicpath-path="BookSearchAndFilter.tsx" />
                    <p className="text-xs text-gray-500 mb-1" data-magicpath-id="187" data-magicpath-path="BookSearchAndFilter.tsx">출간년도</p>
                    <p className="text-sm font-semibold text-gray-800" data-magicpath-id="188" data-magicpath-path="BookSearchAndFilter.tsx">{selectedBook.publishedYear}</p>
                  </div>}
                {selectedBook.pages && <div className="text-center p-3 bg-gray-50 rounded-xl" data-magicpath-id="189" data-magicpath-path="BookSearchAndFilter.tsx">
                    <BookOpen className="w-5 h-5 text-gray-600 mx-auto mb-1" data-magicpath-id="190" data-magicpath-path="BookSearchAndFilter.tsx" />
                    <p className="text-xs text-gray-500 mb-1" data-magicpath-id="191" data-magicpath-path="BookSearchAndFilter.tsx">페이지</p>
                    <p className="text-sm font-semibold text-gray-800" data-magicpath-id="192" data-magicpath-path="BookSearchAndFilter.tsx">{selectedBook.pages}p</p>
                  </div>}
              </div>

              {selectedBook.publisher && <div className="text-center mb-6" data-magicpath-id="193" data-magicpath-path="BookSearchAndFilter.tsx">
                  <p className="text-sm text-gray-500" data-magicpath-id="194" data-magicpath-path="BookSearchAndFilter.tsx">출판사</p>
                  <p className="text-gray-700 font-medium" data-magicpath-id="195" data-magicpath-path="BookSearchAndFilter.tsx">{selectedBook.publisher}</p>
                </div>}
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm" data-magicpath-id="196" data-magicpath-path="BookSearchAndFilter.tsx">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center" data-magicpath-id="197" data-magicpath-path="BookSearchAndFilter.tsx">
                <Book className="w-5 h-5 mr-2" data-magicpath-id="198" data-magicpath-path="BookSearchAndFilter.tsx" />
                책 소개
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm" data-magicpath-id="199" data-magicpath-path="BookSearchAndFilter.tsx">
                {selectedBook.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3" data-magicpath-id="200" data-magicpath-path="BookSearchAndFilter.tsx">
              <button onClick={() => onStartReading?.(selectedBook)} className="flex-1 py-4 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-2xl font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-shadow" data-magicpath-id="201" data-magicpath-path="BookSearchAndFilter.tsx">
                <BookOpen className="w-5 h-5" data-magicpath-id="202" data-magicpath-path="BookSearchAndFilter.tsx" />
                <span data-magicpath-id="203" data-magicpath-path="BookSearchAndFilter.tsx">읽기 시작</span>
              </button>
              
              <button onClick={handleProceedToReview} className="flex-1 py-4 bg-gradient-to-r from-[#B5D4C8] to-[#A8D4C8] text-white rounded-2xl font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-shadow" data-magicpath-id="204" data-magicpath-path="BookSearchAndFilter.tsx">
                <Sparkles className="w-5 h-5" />
                <span data-magicpath-id="205" data-magicpath-path="BookSearchAndFilter.tsx">감상문 작성</span>
              </button>
              
              <button onClick={() => onWishlistToggle?.(selectedBook)} className={`px-6 py-4 rounded-2xl font-medium flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow ${wishlistBooks.includes(selectedBook.id) ? 'bg-gradient-to-r from-red-400 to-red-500 text-white' : 'bg-gradient-to-r from-[#F4E4B8] to-[#F0E4B8] text-white'}`} data-magicpath-id="206" data-magicpath-path="BookSearchAndFilter.tsx">
                <Heart className={`w-5 h-5 ${wishlistBooks.includes(selectedBook.id) ? 'fill-current' : ''}`} data-magicpath-id="207" data-magicpath-path="BookSearchAndFilter.tsx" />
              </button>
            </div>
          </div>}
      </div>
    </motion.div>;
  const renderReviewStep = () => <motion.div initial={{
    opacity: 0,
    x: 20
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -20
  }} className="min-h-screen px-4 py-8" data-magicpath-id="208" data-magicpath-path="BookSearchAndFilter.tsx">
      <div className="max-w-sm mx-auto" data-magicpath-id="209" data-magicpath-path="BookSearchAndFilter.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-magicpath-id="210" data-magicpath-path="BookSearchAndFilter.tsx">
          <button onClick={() => setCurrentStep('book-detail')} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors" data-magicpath-id="211" data-magicpath-path="BookSearchAndFilter.tsx">
            <ArrowLeft className="w-5 h-5 text-gray-600" data-magicpath-id="212" data-magicpath-path="BookSearchAndFilter.tsx" />
          </button>
          <h1 className="text-xl font-bold text-gray-800" data-magicpath-id="213" data-magicpath-path="BookSearchAndFilter.tsx">감상문 작성</h1>
          <div className="w-10" data-magicpath-id="214" data-magicpath-path="BookSearchAndFilter.tsx" />
        </div>

        {selectedBook && <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm" data-magicpath-id="215" data-magicpath-path="BookSearchAndFilter.tsx">
            <div className="flex items-center space-x-3" data-magicpath-id="216" data-magicpath-path="BookSearchAndFilter.tsx">
              <img src={selectedBook.cover} alt={selectedBook.title} className="w-12 h-18 object-cover rounded-lg shadow-sm" data-magicpath-id="217" data-magicpath-path="BookSearchAndFilter.tsx" />
              <div data-magicpath-id="218" data-magicpath-path="BookSearchAndFilter.tsx">
                <h3 className="font-semibold text-gray-800 text-sm" data-magicpath-id="219" data-magicpath-path="BookSearchAndFilter.tsx">{selectedBook.title}</h3>
                <p className="text-gray-600 text-xs" data-magicpath-id="220" data-magicpath-path="BookSearchAndFilter.tsx">{selectedBook.author}</p>
              </div>
            </div>
          </div>}

        {/* Emotion Categories */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6" data-magicpath-id="221" data-magicpath-path="BookSearchAndFilter.tsx">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center" data-magicpath-id="222" data-magicpath-path="BookSearchAndFilter.tsx">
            <Heart className="w-5 h-5 mr-2 text-pink-500" data-magicpath-id="223" data-magicpath-path="BookSearchAndFilter.tsx" />
            어떤 감정을 느끼나요?
          </h3>
          <p className="text-sm text-gray-600 mb-6" data-magicpath-id="224" data-magicpath-path="BookSearchAndFilter.tsx">책을 읽으며 느낀 감정들을 선택해주세요 (복수 선택 가능)</p>
          
          <div className="space-y-4" data-magicpath-id="225" data-magicpath-path="BookSearchAndFilter.tsx">
            {emotionCategories.map(category => <div key={category.id} className="space-y-3" data-magicpath-uuid={(category as any)["mpid"] ?? "unsafe"} data-magicpath-id="226" data-magicpath-path="BookSearchAndFilter.tsx">
                <div className="flex items-center space-x-2" data-magicpath-uuid={(category as any)["mpid"] ?? "unsafe"} data-magicpath-id="227" data-magicpath-path="BookSearchAndFilter.tsx">
                  <div className={`p-2 rounded-lg ${category.color} border`} data-magicpath-uuid={(category as any)["mpid"] ?? "unsafe"} data-magicpath-field="icon:unknwon" data-magicpath-id="228" data-magicpath-path="BookSearchAndFilter.tsx">
                    {category.icon}
                  </div>
                  <h4 className="font-medium text-gray-800" data-magicpath-uuid={(category as any)["mpid"] ?? "unsafe"} data-magicpath-field="name:string" data-magicpath-id="229" data-magicpath-path="BookSearchAndFilter.tsx">{category.name}</h4>
                </div>
                
                <div className="flex flex-wrap gap-2 ml-10" data-magicpath-uuid={(category as any)["mpid"] ?? "unsafe"} data-magicpath-id="230" data-magicpath-path="BookSearchAndFilter.tsx">
                  {category.subcategories.map(emotion => <button key={emotion} onClick={() => toggleEmotion(emotion)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedEmotions.includes(emotion) ? 'bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} data-magicpath-uuid={(category as any)["mpid"] ?? "unsafe"} data-magicpath-id="231" data-magicpath-path="BookSearchAndFilter.tsx">
                      {emotion}
                    </button>)}
                </div>
              </div>)}
          </div>

          {selectedEmotions.length > 0 && <div className="mt-6 p-4 bg-gradient-to-r from-[#A8B5E8]/10 to-[#B5D4C8]/10 rounded-xl border border-gray-100" data-magicpath-id="232" data-magicpath-path="BookSearchAndFilter.tsx">
              <h4 className="text-sm font-medium text-gray-800 mb-2" data-magicpath-id="233" data-magicpath-path="BookSearchAndFilter.tsx">선택한 감정들:</h4>
              <div className="flex flex-wrap gap-2" data-magicpath-id="234" data-magicpath-path="BookSearchAndFilter.tsx">
                {selectedEmotions.map(emotion => <span key={emotion} className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200 flex items-center space-x-1" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="235" data-magicpath-path="BookSearchAndFilter.tsx">
                    <span data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="236" data-magicpath-path="BookSearchAndFilter.tsx">{emotion}</span>
                    <button onClick={() => toggleEmotion(emotion)} className="text-gray-400 hover:text-gray-600" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="237" data-magicpath-path="BookSearchAndFilter.tsx">
                      <X className="w-3 h-3" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="238" data-magicpath-path="BookSearchAndFilter.tsx" />
                    </button>
                  </span>)}
              </div>
            </div>}
        </div>

        {/* Review Text */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" data-magicpath-id="239" data-magicpath-path="BookSearchAndFilter.tsx">
          <label className="block text-sm font-medium text-gray-800 mb-4 flex items-center" data-magicpath-id="240" data-magicpath-path="BookSearchAndFilter.tsx">
            <BookOpen className="w-4 h-4 mr-2" data-magicpath-id="241" data-magicpath-path="BookSearchAndFilter.tsx" />
            감상문 작성
          </label>
          <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="이 책을 읽으면서 어떤 감정을 느끼나요? 어떤 장면이 가장 인상 깊었나요? 자유롭게 감상을 적어주세요..." className="w-full h-40 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20 resize-none text-sm" data-magicpath-id="242" data-magicpath-path="BookSearchAndFilter.tsx" />
          
          <div className="mt-6" data-magicpath-id="243" data-magicpath-path="BookSearchAndFilter.tsx">
            <p className="text-xs text-gray-500 mb-4 text-center" data-magicpath-id="244" data-magicpath-path="BookSearchAndFilter.tsx">
              AI가 당신의 감상과 선택한 감정을 분석해서 개인화된 무드 카드를 만들어드려요
            </p>
            <button onClick={handleSubmitReview} disabled={!reviewText.trim() || selectedEmotions.length === 0 || isSubmitting} className="w-full py-4 bg-gradient-to-r from-[#F4E4B8] to-[#F0E4B8] text-white rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-shadow" data-magicpath-id="245" data-magicpath-path="BookSearchAndFilter.tsx">
              {isSubmitting ? <>
                  <Loader2 className="w-5 h-5 animate-spin" data-magicpath-id="246" data-magicpath-path="BookSearchAndFilter.tsx" />
                  <span data-magicpath-id="247" data-magicpath-path="BookSearchAndFilter.tsx">무드 카드 생성 중...</span>
                </> : <>
                  <Send className="w-5 h-5" data-magicpath-id="248" data-magicpath-path="BookSearchAndFilter.tsx" />
                  <span data-magicpath-id="249" data-magicpath-path="BookSearchAndFilter.tsx">감상문 제출하기</span>
                </>}
            </button>
            
            {selectedEmotions.length === 0 && reviewText.trim() && <p className="text-xs text-amber-600 mt-2 text-center" data-magicpath-id="250" data-magicpath-path="BookSearchAndFilter.tsx">
                감정을 하나 이상 선택해주세요
              </p>}
          </div>
        </div>
      </div>
    </motion.div>;
  return <AnimatePresence mode="wait" data-magicpath-id="251" data-magicpath-path="BookSearchAndFilter.tsx">
      {currentStep === 'search' && renderSearchStep()}
      {currentStep === 'emotion-filter' && renderEmotionFilterStep()}
      {currentStep === 'book-list' && renderBookListStep()}
      {currentStep === 'book-detail' && renderBookDetailStep()}
      {currentStep === 'review' && renderReviewStep()}
    </AnimatePresence>;
};
export default BookSearchAndFilter;