import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, X, Smile, Frown, Meh, Zap, Coffee, Flame, Droplets, Sun, Moon, Cloud, Rainbow, Snowflake, Leaf, Mountain, Waves, Star, User, Heart, Filter, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BookExternal } from '../../types/database';
import * as booksApi from '../../api/books';

interface BookData {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  dominantEmotions?: string[];
  emotionScores?: {
    [emotion: string]: number;
  };
  readerCount?: number;
  averageRating?: number;
  genre?: string;
  publishedYear?: string;
}

interface EmotionFilterPageProps {
  onBack: () => void;
  onWishlistToggle?: (book: BookExternal) => void;
  wishlistBooks?: string[];
}

interface EmotionData {
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface EmotionCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  emotions: EmotionData[];
}

type SortType = 'relevance' | 'rating' | 'readers' | 'recent' | 'accuracy';
type CategoryType = 'all' | 'literature' | 'economics' | 'self-help' | 'humanities' | 'history' | 'science' | 'it';

const EmotionFilterPage: React.FC<EmotionFilterPageProps> = ({ 
  onBack, 
  onWishlistToggle,
  wishlistBooks = [] 
}) => {
  const navigate = useNavigate();
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [sortType, setSortType] = useState<SortType>('relevance');
  const [minRating, setMinRating] = useState<number>(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [allBooks, setAllBooks] = useState<BookExternal[]>([]); // 전체 로드된 책들
  const [books, setBooks] = useState<BookExternal[]>([]); // 필터링된 책들
  const [loading, setLoading] = useState(true);
  
  // 무한스크롤 상태
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // 📚 책 카테고리 (실제 DB 데이터 기반)
  const bookCategories = [
    { 
      id: 'all', 
      name: '전체', 
      icon: <Book className="w-4 h-4" />, 
      aladinId: null,
      keywords: null
    },
    { 
      id: 'literature', 
      name: '문학/소설', 
      icon: <Book className="w-4 h-4" />, 
      aladinId: null, // category_name으로 필터링
      keywords: ['소설', '시', '에세이', '산문', '수필', '희곡', '문학', '한국소설', '외국소설', '추리', '로맨스', '판타지', 'SF', '스릴러']
    },
    { 
      id: 'economics', 
      name: '경제/경영', 
      icon: <Book className="w-4 h-4" />, 
      aladinId: [2225, 174, 3060, 175, 2173, 3103, 1632, 3065, 3101, 8587, 852, 8586, 3058, 853, 3104, 180, 249, 282, 3048, 11501, 3062, 8563, 8557, 263, 3069],
      keywords: ['경제', '경영', '재테크', '투자', '부동산', '마케팅', '성공', '금융', '창업', '취업', 'CEO']
    },
    { 
      id: 'history', 
      name: '역사', 
      icon: <Mountain className="w-4 h-4" />, 
      aladinId: [141, 169, 1962, 1753, 1438, 1955, 116, 5557, 160, 165, 5445, 3802, 1628, 117, 1806, 4867, 121, 118, 3431],
      keywords: ['역사', '근현대사', '세계사', '중국사', '한국사', '조선', '일본사', '미국사', '유럽사', '아시아사']
    },
    { 
      id: 'self-help', 
      name: '자기계발', 
      icon: <Star className="w-4 h-4" />, 
      aladinId: [2952, 32399, 5247, 2944],
      keywords: ['자기계발', '인간관계', '성장', '동기부여', '심리학', '진로', '취업']
    },
    { 
      id: 'education', 
      name: '교육/청소년', 
      icon: <Zap className="w-4 h-4" />, 
      aladinId: [1143, 32399, 4303, 8431, 8412, 8420, 8328, 16034],
      keywords: ['청소년', '교육', '수학', '과학', '교육학', '대학교재', '인문학']
    },
    { 
      id: 'it', 
      name: 'IT/컴퓨터', 
      icon: <Coffee className="w-4 h-4" />, 
      aladinId: [2632, 3023, 6734, 2602, 2673, 6593, 6997, 2737, 2662, 2721, 2502, 2633, 6589, 6794, 7007, 6357, 2608, 8482, 6636],
      keywords: ['컴퓨터', '그래픽', '멀티미디어', '프로그래밍', 'IT', '파이썬', '자바', '포토샵', '엑셀', '데이터베이스', '네트워크']
    },
    { 
      id: 'comics', 
      name: '만화/웹툰', 
      icon: <User className="w-4 h-4" />, 
      aladinId: [4133, 7443, 6130, 3742, 3746, 4134],
      keywords: ['만화', '판타지', '웹툰', '순정만화', '소년만화', 'BL', '액션']
    },
    { 
      id: 'magazines', 
      name: '잡지/기타', 
      icon: <Heart className="w-4 h-4" />, 
      aladinId: [7605, 3563, 8366, 8498, 8536, 8475, 8578],
      keywords: ['잡지', '시사', '경제', '법학', '건축', '전기', '공학']
    },
  ];

  // Emotion categories with detailed emotions
  const filterEmotionCategories: EmotionCategory[] = [
    {
      id: 'joy',
      name: '기쁨',
      icon: <Smile className="w-4 h-4" />,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      emotions: [
        { name: '행복', icon: <Sun className="w-3 h-3" />, color: 'bg-yellow-50 text-yellow-600' },
        { name: '즐거움', icon: <Rainbow className="w-3 h-3" />, color: 'bg-yellow-50 text-yellow-600' },
        { name: '만족', icon: <Smile className="w-3 h-3" />, color: 'bg-yellow-50 text-yellow-600' },
        { name: '희열', icon: <Zap className="w-3 h-3" />, color: 'bg-yellow-50 text-yellow-600' },
        { name: '환희', icon: <Star className="w-3 h-3" />, color: 'bg-yellow-50 text-yellow-600' },
        { name: '기대감', icon: <Mountain className="w-3 h-3" />, color: 'bg-yellow-50 text-yellow-600' },
        { name: '설렘', icon: <Waves className="w-3 h-3" />, color: 'bg-yellow-50 text-yellow-600' },
        { name: '감동', icon: <Heart className="w-3 h-3" />, color: 'bg-yellow-50 text-yellow-600' }
      ]
    },
    {
      id: 'sadness',
      name: '슬픔',
      icon: <Frown className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      emotions: [
        { name: '우울', icon: <Cloud className="w-3 h-3" />, color: 'bg-blue-50 text-blue-600' },
        { name: '아쉬움', icon: <Droplets className="w-3 h-3" />, color: 'bg-blue-50 text-blue-600' },
        { name: '그리움', icon: <Moon className="w-3 h-3" />, color: 'bg-blue-50 text-blue-600' },
        { name: '애잔함', icon: <Snowflake className="w-3 h-3" />, color: 'bg-blue-50 text-blue-600' },
        { name: '쓸쓸함', icon: <Leaf className="w-3 h-3" />, color: 'bg-blue-50 text-blue-600' },
        { name: '허무', icon: <Meh className="w-3 h-3" />, color: 'bg-blue-50 text-blue-600' }
      ]
    },
    {
      id: 'excitement',
      name: '흥미진진',
      icon: <Zap className="w-4 h-4" />,
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      emotions: [
        { name: '스릴', icon: <Zap className="w-3 h-3" />, color: 'bg-orange-50 text-orange-600' },
        { name: '긴장감', icon: <Flame className="w-3 h-3" />, color: 'bg-orange-50 text-orange-600' },
        { name: '흥미', icon: <Star className="w-3 h-3" />, color: 'bg-orange-50 text-orange-600' },
        { name: '놀라움', icon: <Zap className="w-3 h-3" />, color: 'bg-orange-50 text-orange-600' },
        { name: '신비로움', icon: <Moon className="w-3 h-3" />, color: 'bg-orange-50 text-orange-600' }
      ]
    },
    {
      id: 'calm',
      name: '평온',
      icon: <Droplets className="w-4 h-4" />,
      color: 'bg-green-100 text-green-700 border-green-200',
      emotions: [
        { name: '안정감', icon: <Leaf className="w-3 h-3" />, color: 'bg-green-50 text-green-600' },
        { name: '고요함', icon: <Mountain className="w-3 h-3" />, color: 'bg-green-50 text-green-600' },
        { name: '여유', icon: <Waves className="w-3 h-3" />, color: 'bg-green-50 text-green-600' },
        { name: '편안함', icon: <Coffee className="w-3 h-3" />, color: 'bg-green-50 text-green-600' },
        { name: '힐링', icon: <Sun className="w-3 h-3" />, color: 'bg-green-50 text-green-600' }
      ]
    },
    {
      id: 'inspiration',
      name: '영감',
      icon: <Star className="w-4 h-4" />,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      emotions: [
        { name: '깨달음', icon: <Star className="w-3 h-3" />, color: 'bg-purple-50 text-purple-600' },
        { name: '통찰', icon: <Sun className="w-3 h-3" />, color: 'bg-purple-50 text-purple-600' },
        { name: '창의성', icon: <Rainbow className="w-3 h-3" />, color: 'bg-purple-50 text-purple-600' },
        { name: '영감', icon: <Zap className="w-3 h-3" />, color: 'bg-purple-50 text-purple-600' },
        { name: '성장', icon: <Mountain className="w-3 h-3" />, color: 'bg-purple-50 text-purple-600' }
      ]
    }
  ];

  // 📖 실제 데이터베이스에서 책 로드 (최초 한 번만)
  useEffect(() => {
    loadBooks(true);
  }, []); // 의존성 배열 비워서 최초 한 번만 실행

  // 🔄 무한스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 // 하단 1000px 전에 로드 시작
      ) {
        loadMoreBooks();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadingMore]);

  // 🔍 필터 변경 시 클라이언트 사이드 필터링 실행
  useEffect(() => {
    const filteredResult = getFilteredBooks();
    setBooks(filteredResult);
  }, [allBooks, selectedEmotions, selectedCategory, sortType, minRating]);

  const loadBooks = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }
      
      let result;
      const currentPage = reset ? 1 : page;
      const limit = 200; // 페이지당 더 많은 데이터 로드
      
      // 항상 전체 책 조회 (클라이언트에서 필터링하므로)
      result = await booksApi.getRandomBooks(limit * currentPage);
      
      if (result?.data) {
        if (reset) {
          setAllBooks(result.data);
          setHasMore(result.data.length >= limit); // 로드된 데이터가 limit와 같으면 더 있을 수 있음
        } else {
          // 추가 로드 시 중복 제거하며 병합
          setAllBooks(prev => {
            const existingIsbns = new Set(prev.map(book => book.isbn13));
            const newBooks = result.data.filter(book => !existingIsbns.has(book.isbn13));
            return [...prev, ...newBooks];
          });
          setHasMore(result.data.length >= limit);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('책 로딩 실패:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 📚 더 많은 책 로드 (무한스크롤용)
  const loadMoreBooks = async () => {
    if (!hasMore || loadingMore) return;
    
    setPage(prev => prev + 1);
    await loadBooks(false);
  };

  // Mock emotion scoring for existing books (나중에 AI로 대체)
  const getEmotionScoreForBook = (book: BookExternal, emotion: string): number => {
    // 간단한 키워드 기반 감정 매칭 (나중에 AI로 대체)
    const summary = (book.summary || '').toLowerCase();
    const title = book.title.toLowerCase();
    
    const emotionKeywords: { [key: string]: string[] } = {
      '행복': ['행복', '기쁨', '즐거', '희', '웃음'],
      '슬픔': ['슬픔', '눈물', '아픔', '이별', '상실'],
      '흥미': ['흥미', '재미', '신기', '놀라'],
      '평온': ['평온', '고요', '안정', '힐링', '휴식'],
      '영감': ['영감', '깨달음', '통찰', '지혜', '성장']
    };
    
    const keywords = emotionKeywords[emotion] || [];
    let score = 0;
    
    keywords.forEach(keyword => {
      if (title.includes(keyword)) score += 0.3;
      if (summary.includes(keyword)) score += 0.2;
    });
    
    return Math.min(score, 1.0);
  };

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const getFilteredBooks = () => {
    let filtered = allBooks; // allBooks 기반으로 변경

    // Category filter (카테고리 필터링 추가)
    if (selectedCategory !== 'all') {
      const category = bookCategories.find(cat => cat.id === selectedCategory);
      if (category) {
        filtered = filtered.filter(book => {
          // ID 기반 매칭
          if (category.aladinId && Array.isArray(category.aladinId)) {
            if (category.aladinId.includes(book.category_id)) {
              return true;
            }
          }
          
          // 키워드 기반 매칭 (category_name에서)
          if (category.keywords) {
            const categoryName = (book.category_name || '').toLowerCase();
            return category.keywords.some(keyword => 
              categoryName.includes(keyword.toLowerCase())
            );
          }
          
          return false;
        });
      }
    }

    // Emotion filter
    if (selectedEmotions.length > 0) {
      filtered = filtered.filter(book => {
        const emotionScore = selectedEmotions.reduce((sum, emotion) => 
          sum + getEmotionScoreForBook(book, emotion), 0);
        return emotionScore > 0.1; // 최소 감정 매칭 점수
      });
    }

    // Rating filter (customer_review_rank 기반)
    if (minRating > 0) {
      filtered = filtered.filter(book => {
        const rating = book.customer_review_rank ? book.customer_review_rank / 2 : 0;
        return rating >= minRating;
      });
    }

    // Sort
    switch (sortType) {
      case 'relevance':
        if (selectedEmotions.length > 0) {
          return filtered.sort((a, b) => {
            const aScore = selectedEmotions.reduce((sum, emotion) => 
              sum + getEmotionScoreForBook(a, emotion), 0);
            const bScore = selectedEmotions.reduce((sum, emotion) => 
              sum + getEmotionScoreForBook(b, emotion), 0);
            return bScore - aScore;
          });
        }
        return filtered;
      case 'rating':
        return filtered.sort((a, b) => 
          (b.customer_review_rank || 0) - (a.customer_review_rank || 0));
      case 'recent':
        return filtered.sort((a, b) => 
          new Date(b.pub_date || '').getTime() - new Date(a.pub_date || '').getTime());
      case 'accuracy':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  };

  const handleBookClick = (book: BookExternal) => {
    navigate(`/books/${book.isbn13}`);
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
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBack} 
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">도서 필터링</h1>
          <div className="w-10" />
        </div>

        {/* Book Categories */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Book className="w-4 h-4 mr-2" />
            책 종류
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {bookCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as CategoryType)}
                className={`flex items-center p-3 rounded-xl border text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#A8B5E8] text-white border-[#A8B5E8] shadow-md'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mb-6">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="w-full text-left text-sm font-medium text-gray-700 mb-3 flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            고급 필터 {showAdvancedFilters ? '▼' : '▶'}
          </button>
          
          {showAdvancedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="space-y-4 bg-gray-50 p-4 rounded-xl"
            >
              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">정렬</label>
                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value as SortType)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                >
                  <option value="relevance">감정 매칭도순</option>
                  <option value="rating">평점순</option>
                  <option value="recent">최신순</option>
                  <option value="accuracy">가나다순</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최소 평점: {minRating.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>전체</span>
                  <span>5점</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Emotion Categories */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Heart className="w-4 h-4 mr-2" />
            감정별 분류 (AI 분석 예정)
          </h3>
          <div className="space-y-4">
            {filterEmotionCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className={`inline-flex items-center px-3 py-2 rounded-full border text-sm font-medium mb-3 ${category.color}`}>
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {category.emotions.map((emotion) => {
                    const isSelected = selectedEmotions.includes(emotion.name);
                    return (
                      <button
                        key={emotion.name}
                        onClick={() => toggleEmotion(emotion.name)}
                        className={`flex items-center p-2 rounded-lg border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#A8B5E8] text-white border-[#A8B5E8] shadow-md'
                            : `${emotion.color} border-gray-200 hover:border-gray-300`
                        }`}
                      >
                        {emotion.icon}
                        <span className="ml-1">{emotion.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Emotions */}
        {selectedEmotions.length > 0 && (
          <div className="mb-6 bg-[#A8B5E8]/10 rounded-2xl p-4 border border-[#A8B5E8]/20">
            <h3 className="text-sm font-medium text-gray-800 mb-3">선택된 감정</h3>
            <div className="flex flex-wrap gap-2">
              {selectedEmotions.map((emotion) => {
                const emotionData = filterEmotionCategories
                  .flatMap(cat => cat.emotions)
                  .find(e => e.name === emotion);
                return (
                  <span 
                    key={emotion}
                    className="inline-flex items-center px-3 py-2 bg-[#A8B5E8] text-white rounded-full text-sm font-medium"
                  >
                    {emotionData?.icon}
                    <span className="ml-2">{emotion}</span>
                    <button
                      onClick={() => toggleEmotion(emotion)}
                      className="ml-2 hover:bg-white/20 rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            총 <span className="font-semibold text-[#A8B5E8]">{books.length}권</span>의 책을 찾았습니다
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-4 animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-20 h-28 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="space-y-4">
            {books.map((book, index) => {
              const rating = book.customer_review_rank ? (book.customer_review_rank / 2).toFixed(1) : null;
              const publishYear = book.pub_date ? new Date(book.pub_date).getFullYear().toString() : '';
              
              return (
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
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1.5 line-clamp-2 leading-snug">{book.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 font-medium">{book.author}</p>
                      
                      <div className="flex items-center space-x-3 mb-3">
                        {rating && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium">{rating}</span>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          {book.category_name}
                        </div>
                      </div>

                      {/* Emotion Indicators (AI 분석 예정) */}
                      {selectedEmotions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {selectedEmotions.map((emotion) => {
                            const score = getEmotionScoreForBook(book, emotion);
                            if (score > 0.1) {
                              const emotionData = filterEmotionCategories
                                .flatMap(cat => cat.emotions)
                                .find(e => e.name === emotion);
                              return (
                                <span 
                                  key={emotion}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#A8B5E8]/20 text-[#A8B5E8]"
                                >
                                  {emotionData?.icon}
                                  <span className="ml-1">{emotion}</span>
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}

                      {/* Category & Publisher Info */}
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
                            {publishYear && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span>{publishYear}</span>
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
              );
            })}
            
            {/* 무한스크롤 로딩 & 더보기 버튼 */}
            {loadingMore && (
              <div className="flex justify-center py-8">
                <div className="flex items-center space-x-2 text-[#A8B5E8]">
                  <div className="w-5 h-5 border-2 border-[#A8B5E8] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">더 많은 책을 불러오는 중...</span>
                </div>
              </div>
            )}
            
            {/* 수동 더보기 버튼 */}
            {hasMore && !loadingMore && (
              <div className="text-center py-6">
                <button
                  onClick={loadMoreBooks}
                  className="px-8 py-3 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  더 많은 책 보기
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Meh className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">결과가 없습니다</h3>
            <p className="text-gray-600 mb-6">다른 필터 조건을 시도하거나<br />카테고리를 변경해보세요</p>
            <button
              onClick={() => {
                setSelectedEmotions([]);
                setSelectedCategory('all');
                setMinRating(0);
                setSortType('relevance');
              }}
              className="px-6 py-3 bg-[#A8B5E8] text-white rounded-xl font-medium"
            >
              모든 필터 초기화
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EmotionFilterPage; 