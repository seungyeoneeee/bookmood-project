import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Book, Star, User, Calendar, Sparkles, Send, Loader2, X, BookOpen, Heart, Tag, Clock, Award, Smile, Frown, Meh, Zap, Coffee, Flame, Droplets, Sun, Moon, Cloud, Rainbow, Snowflake, Leaf, Mountain, Waves } from 'lucide-react';
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
}
interface BookSearchFlowProps {
  onReviewSubmit: (bookData: BookData, reviewText: string, selectedEmotions: string[]) => void;
  onBack: () => void;
  onWishlistToggle?: (book: BookData) => void;
  onStartReading?: (book: BookData) => void;
  wishlistBooks?: string[];
}
type FlowStep = 'search' | 'book-list' | 'book-detail' | 'review';
interface EmotionCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  subcategories: string[];
}
const BookSearchFlow: React.FC<BookSearchFlowProps> = ({
  onReviewSubmit,
  onBack,
  onWishlistToggle,
  onStartReading,
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

  // Detailed emotion categories
  const emotionCategories: EmotionCategory[] = [{
    id: 'joy',
    name: '기쁨',
    icon: <Smile className="w-4 h-4" />,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    subcategories: ['행복', '즐거움', '만족', '희열', '환희', '기대감', '설렘', '감동']
  }, {
    id: 'sadness',
    name: '슬픔',
    icon: <Frown className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    subcategories: ['우울', '아쉬움', '그리움', '애잔함', '쓸쓸함', '허무', '절망', '안타까움']
  }, {
    id: 'anger',
    name: '분노',
    icon: <Flame className="w-4 h-4" />,
    color: 'bg-red-100 text-red-700 border-red-200',
    subcategories: ['화남', '짜증', '분개', '억울함', '답답함', '불만', '격분', '원망']
  }, {
    id: 'fear',
    name: '두려움',
    icon: <Cloud className="w-4 h-4" />,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    subcategories: ['불안', '걱정', '긴장', '공포', '무서움', '경계', '조심스러움', '위축']
  }, {
    id: 'surprise',
    name: '놀라움',
    icon: <Zap className="w-4 h-4" />,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    subcategories: ['충격', '경이로움', '신기함', '의외', '당황', '깜짝', '놀람', '감탄']
  }, {
    id: 'love',
    name: '사랑',
    icon: <Heart className="w-4 h-4" />,
    color: 'bg-pink-100 text-pink-700 border-pink-200',
    subcategories: ['애정', '따뜻함', '친밀감', '소중함', '아끼는 마음', '연민', '동정', '공감']
  }, {
    id: 'peace',
    name: '평온',
    icon: <Leaf className="w-4 h-4" />,
    color: 'bg-green-100 text-green-700 border-green-200',
    subcategories: ['고요함', '차분함', '안정감', '편안함', '여유', '평화', '휴식', '치유']
  }, {
    id: 'excitement',
    name: '흥미진진',
    icon: <Sun className="w-4 h-4" />,
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    subcategories: ['스릴', '재미', '흥미', '몰입', '집중', '긴장감', '박진감', '활력']
  }, {
    id: 'melancholy',
    name: '우울감',
    icon: <Moon className="w-4 h-4" />,
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    subcategories: ['멜랑콜리', '센치함', '쓸쓸함', '고독', '외로움', '침울함', '무기력', '공허함']
  }, {
    id: 'inspiration',
    name: '영감',
    icon: <Rainbow className="w-4 h-4" />,
    color: 'bg-teal-100 text-teal-700 border-teal-200',
    subcategories: ['깨달음', '통찰', '자극', '동기부여', '희망', '용기', '의지', '결심']
  }];
  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]);
  };

  // Enhanced mock book data with more details
  const mockBooks: BookData[] = [{
    id: '1',
    title: '달러구트 꿈 백화점',
    author: '이미예',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    description: '잠들어야만 입장할 수 있는 신비한 꿈 백화점에서 벌어지는 따뜻하고 환상적인 이야기. 꿈을 사고파는 특별한 공간에서 만나는 사람들의 감동적인 에피소드.',
    publishedYear: '2020',
    rating: 4.5,
    publisher: '팩토리나인',
    genre: '판타지',
    pages: 312
  }, {
    id: '2',
    title: '아몬드',
    author: '손원평',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
    description: '감정을 느끼지 못하는 소년 윤재의 성장 이야기를 통해 인간의 감정과 공감에 대해 탐구하는 소설. 따뜻한 시선으로 그려낸 청소년 문학의 걸작.',
    publishedYear: '2017',
    rating: 4.7,
    publisher: '창비',
    genre: '청소년 소설',
    pages: 267
  }, {
    id: '3',
    title: '미드나이트 라이브러리',
    author: '매트 헤이그',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop',
    description: '삶과 죽음 사이에 존재하는 도서관에서 다양한 인생의 가능성을 탐험하는 철학적 소설. 후회와 선택에 대한 깊이 있는 성찰을 담은 작품.',
    publishedYear: '2020',
    rating: 4.3,
    publisher: '인플루엔셜',
    genre: '철학 소설',
    pages: 288
  }, {
    id: '4',
    title: '82년생 김지영',
    author: '조남주',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop',
    description: '평범한 한국 여성의 일생을 통해 우리 사회의 성차별 문제를 조명한 화제작. 많은 독자들의 공감을 불러일으킨 현실적인 이야기.',
    publishedYear: '2016',
    rating: 4.2,
    publisher: '민음사',
    genre: '사회 소설',
    pages: 215
  }, {
    id: '5',
    title: '코스모스',
    author: '칼 세이건',
    cover: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=450&fit=crop',
    description: '우주와 과학에 대한 경이로운 탐험. 복잡한 과학 개념을 아름다운 문체로 풀어낸 과학 교양서의 고전.',
    publishedYear: '1980',
    rating: 4.8,
    publisher: '사이언스북스',
    genre: '과학',
    pages: 512
  }, {
    id: '6',
    title: '채식주의자',
    author: '한강',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop',
    description: '한 여성의 채식 선언으로 시작되는 파괴적이고 아름다운 이야기. 맨부커상을 수상한 한국 문학의 걸작.',
    publishedYear: '2007',
    rating: 4.1,
    publisher: '창비',
    genre: '현대 소설',
    pages: 158
  }];
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

    // Pass both review text and selected emotions to the parent
    onReviewSubmit(selectedBook, reviewText, selectedEmotions);
    setIsSubmitting(false);
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
  }} className="min-h-screen px-4 py-8">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">책 검색</h1>
          <div className="w-10" />
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSearch()} placeholder="책 제목, 작가, 장르를 검색하세요" className="w-full px-4 py-4 pl-12 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20 shadow-sm" />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>}
        </div>

        <button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} className="w-full py-4 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-8 shadow-lg hover:shadow-xl transition-shadow">
          {isSearching ? <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>검색 중...</span>
            </div> : '검색하기'}
        </button>

        {/* Popular Books Suggestion */}
        <div className="bg-gradient-to-r from-[#A8B5E8]/10 to-[#B5D4C8]/10 rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-[#F4E4B8]" />
            인기 도서 추천
          </h3>
          <div className="space-y-3">
            {mockBooks.slice(0, 3).map(book => <button key={book.id} onClick={() => {
            setSearchQuery(book.title);
            setSearchResults([book]);
            setCurrentStep('book-list');
          }} className="w-full text-left p-3 bg-white/50 rounded-xl hover:bg-white/80 transition-colors border border-white/50">
                <div className="flex items-center space-x-3">
                  <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded-lg shadow-sm" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">{book.title}</h4>
                    <p className="text-gray-600 text-xs">{book.author}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-3 h-3 text-[#F4E4B8] fill-current mr-1" />
                      <span className="text-xs text-gray-500">{book.rating}</span>
                    </div>
                  </div>
                </div>
              </button>)}
          </div>
        </div>
      </div>
    </motion.div>;
  const renderBookListStep = () => <motion.div initial={{
    opacity: 0,
    x: 20
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -20
  }} className="min-h-screen px-4 py-8">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setCurrentStep('search')} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">검색 결과</h1>
            <p className="text-sm text-gray-600">{searchResults.length}권의 책을 찾았습니다</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 ? <div className="space-y-6">
            {searchResults.map((book, index) => <motion.div key={book.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} onClick={() => handleBookSelect(book)} className="bg-white border border-gray-200 rounded-3xl p-6 active:scale-95 transition-all shadow-sm hover:shadow-lg cursor-pointer">
                <div className="flex space-x-4">
                  <div className="relative">
                    <img src={book.cover} alt={book.title} className="w-20 h-28 object-cover rounded-2xl shadow-lg" />
                    <button onClick={e => {
                e.stopPropagation();
                onWishlistToggle?.(book);
              }} className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg ${wishlistBooks.includes(book.id) ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-[#F4E4B8] to-[#F0E4B8]'}`}>
                      <Heart className={`w-3 h-3 ${wishlistBooks.includes(book.id) ? 'text-white fill-current' : 'text-white'}`} />
                    </button>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-sm font-medium">
                        {book.author}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {book.publishedYear && <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{book.publishedYear}</span>
                        </div>}
                      {book.pages && <div className="flex items-center">
                          <BookOpen className="w-3 h-3 mr-1" />
                          <span>{book.pages}p</span>
                        </div>}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {book.rating && <div className="flex items-center bg-[#F4E4B8]/20 px-2 py-1 rounded-full">
                            <Star className="w-3 h-3 text-[#F4E4B8] fill-current mr-1" />
                            <span className="text-xs font-medium text-gray-700">{book.rating}</span>
                          </div>}
                        {book.genre && <div className="bg-[#B5D4C8]/20 px-2 py-1 rounded-full">
                            <span className="text-xs font-medium text-gray-700">{book.genre}</span>
                          </div>}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {book.description}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-gray-500">{book.publisher}</p>
                      <div className="flex items-center text-[#A8B5E8] text-xs font-medium">
                        <span>자세히 보기</span>
                        <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>)}
          </div> : <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600">다른 키워드로 검색해보세요</p>
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
  }} className="min-h-screen px-4 py-8">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setCurrentStep('book-list')} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">책 정보</h1>
          <div className="w-10" />
        </div>

        {selectedBook && <div className="space-y-6">
            {/* Book Cover & Basic Info */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <div className="text-center mb-6">
                <img src={selectedBook.cover} alt={selectedBook.title} className="w-40 h-56 object-cover rounded-2xl shadow-xl mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
                  {selectedBook.title}
                </h1>
                <p className="text-gray-600 text-lg font-medium mb-4">{selectedBook.author}</p>
                
                <div className="flex items-center justify-center space-x-6 mb-6">
                  {selectedBook.rating && <div className="flex items-center bg-[#F4E4B8]/20 px-3 py-2 rounded-full">
                      <Star className="w-4 h-4 text-[#F4E4B8] fill-current mr-2" />
                      <span className="text-sm font-semibold text-gray-700">{selectedBook.rating}/5</span>
                    </div>}
                  {selectedBook.genre && <div className="bg-[#B5D4C8]/20 px-3 py-2 rounded-full">
                      <span className="text-sm font-semibold text-gray-700">{selectedBook.genre}</span>
                    </div>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {selectedBook.publishedYear && <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 mb-1">출간년도</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedBook.publishedYear}</p>
                  </div>}
                {selectedBook.pages && <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <BookOpen className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 mb-1">페이지</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedBook.pages}p</p>
                  </div>}
              </div>

              {selectedBook.publisher && <div className="text-center mb-6">
                  <p className="text-sm text-gray-500">출판사</p>
                  <p className="text-gray-700 font-medium">{selectedBook.publisher}</p>
                </div>}
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Book className="w-5 h-5 mr-2" />
                책 소개
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                {selectedBook.description}
              </p>
            </div>

            {/* Action Button */}
            <div className="flex space-x-3">
              <button onClick={() => onStartReading?.(selectedBook)} className="flex-1 py-4 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-2xl font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-shadow">
                <BookOpen className="w-5 h-5" />
                <span>읽기 시작</span>
              </button>
              
              <button onClick={handleProceedToReview} className="flex-1 py-4 bg-gradient-to-r from-[#B5D4C8] to-[#A8D4C8] text-white rounded-2xl font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-shadow">
                <Sparkles className="w-5 h-5" />
                <span>감상문 작성</span>
              </button>
              
              <button onClick={() => onWishlistToggle?.(selectedBook)} className={`px-6 py-4 rounded-2xl font-medium flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow ${wishlistBooks.includes(selectedBook.id) ? 'bg-gradient-to-r from-red-400 to-red-500 text-white' : 'bg-gradient-to-r from-[#F4E4B8] to-[#F0E4B8] text-white'}`}>
                <Heart className={`w-5 h-5 ${wishlistBooks.includes(selectedBook.id) ? 'fill-current' : ''}`} />
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
  }} className="min-h-screen px-4 py-8">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setCurrentStep('book-detail')} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">감상문 작성</h1>
          <div className="w-10" />
        </div>

        {selectedBook && <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <img src={selectedBook.cover} alt={selectedBook.title} className="w-12 h-18 object-cover rounded-lg shadow-sm" />
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{selectedBook.title}</h3>
                <p className="text-gray-600 text-xs">{selectedBook.author}</p>
              </div>
            </div>
          </div>}

        {/* Emotion Categories */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-500" />
            어떤 감정을 느꼈나요?
          </h3>
          <p className="text-sm text-gray-600 mb-6">책을 읽으며 느낀 감정들을 선택해주세요 (복수 선택 가능)</p>
          
          <div className="space-y-4">
          dddd
            {emotionCategories.map(category => <div key={category.id} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${category.color} border`}>
                    {category.icon}
                  </div>
                  <h4 className="font-medium text-gray-800">{category.name}</h4>
                </div>
                
                <div className="flex flex-wrap gap-2 ml-10">
                  {category.subcategories.map(emotion => <button key={emotion} onClick={() => toggleEmotion(emotion)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedEmotions.includes(emotion) ? 'bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {emotion}
                    </button>)}
                </div>
              </div>)}
          </div>

          {selectedEmotions.length > 0 && <div className="mt-6 p-4 bg-gradient-to-r from-[#A8B5E8]/10 to-[#B5D4C8]/10 rounded-xl border border-gray-100">
              <h4 className="text-sm font-medium text-gray-800 mb-2">선택한 감정들:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedEmotions.map(emotion => <span key={emotion} className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200 flex items-center space-x-1">
                    <span>{emotion}</span>
                    <button onClick={() => toggleEmotion(emotion)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>)}
              </div>
            </div>}
        </div>

        {/* Review Text */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-800 mb-4 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            감상문 작성
          </label>
          <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="이 책을 읽으면서 어떤 감정을 느꼈나요? 어떤 장면이 가장 인상 깊었나요? 자유롭게 감상을 적어주세요..." className="w-full h-40 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20 resize-none text-sm" />
          
          <div className="mt-6">
            <p className="text-xs text-gray-500 mb-4 text-center">
              AI가 당신의 감상과 선택한 감정을 분석해서 개인화된 무드 카드를 만들어드려요
            </p>
            <button onClick={handleSubmitReview} disabled={!reviewText.trim() || selectedEmotions.length === 0 || isSubmitting} className="w-full py-4 bg-gradient-to-r from-[#F4E4B8] to-[#F0E4B8] text-white rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-shadow">
              {isSubmitting ? <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>무드 카드 생성 중...</span>
                </> : <>
                  <Send className="w-5 h-5" />
                  <span>감상문 제출하기</span>
                </>}
            </button>
            
            {selectedEmotions.length === 0 && reviewText.trim() && <p className="text-xs text-amber-600 mt-2 text-center">
                감정을 하나 이상 선택해주세요
              </p>}
          </div>
        </div>
      </div>
    </motion.div>;
  return <AnimatePresence mode="wait">
      {currentStep === 'search' && renderSearchStep()}
      {currentStep === 'book-list' && renderBookListStep()}
      {currentStep === 'book-detail' && renderBookDetailStep()}
      {currentStep === 'review' && renderReviewStep()}
    </AnimatePresence>;
};
export default BookSearchFlow;