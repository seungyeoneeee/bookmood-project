import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Heart, TrendingUp, User, Search, Archive, Settings, Home, BookOpen, BarChart3, Bookmark, Filter, Users } from 'lucide-react';
import AppLayout from './AppLayout';
import BookSearchAndFilter from './BookSearchAndFilter';
import ArchiveDashboard from './ArchiveDashboard';
import MoodCardDetail from './MoodCardDetail';
import WishlistManager from './WishlistManager';
import BookEmotionStats from './BookEmotionStats';
import ReadingProgressTracker from './ReadingProgressTracker';
export interface BookData {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  isbn?: string;
  mpid?: string;
}
export interface ReviewData {
  id: string;
  bookId: string;
  review: string;
  emotions: string[];
  topics: string[];
  moodSummary: string;
  createdAt: Date;
  moodCardUrl?: string;
  mpid?: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  mpid?: string;
}
type ViewType = 'home' | 'search' | 'archive' | 'mood-detail' | 'settings' | 'wishlist' | 'emotion-stats' | 'emotion-filter' | 'reading-progress';
const BookMoodApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedMoodCard, setSelectedMoodCard] = useState<ReviewData | null>(null);
  const [selectedBookForStats, setSelectedBookForStats] = useState<any>(null);
  const [selectedBookForReading, setSelectedBookForReading] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [wishlistBooks, setWishlistBooks] = useState<any[]>([]);

  // Mock data for demonstration
  const mockReviews: ReviewData[] = [{
    id: '1',
    bookId: '1',
    review: 'This book made me feel deeply contemplative about life and relationships.',
    emotions: ['contemplative', 'melancholic', 'hopeful'],
    topics: ['relationships', 'philosophy', 'growth'],
    moodSummary: 'A profound journey through human connections that left you feeling both introspective and optimistic about the future.',
    createdAt: new Date('2024-01-15'),
    moodCardUrl: '/api/mood-cards/1',
    mpid: "ed5a8f74-372f-4488-b5dc-8ae52c4cdc19"
  }, {
    id: '2',
    bookId: '2',
    review: 'An exhilarating adventure that kept me on the edge of my seat!',
    emotions: ['excited', 'anxious', 'thrilled'],
    topics: ['adventure', 'mystery', 'suspense'],
    moodSummary: 'A heart-pounding experience that awakened your sense of adventure and left you craving more excitement.',
    createdAt: new Date('2024-01-20'),
    moodCardUrl: '/api/mood-cards/2',
    mpid: "7227b429-e619-4ab2-9211-e40e00d3c481"
  }];
  // Mock data for emotion filtering and stats
  const mockFilterableBooks = [{
    id: '1',
    title: '달러구트 꿈 백화점',
    author: '이미예',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    description: '잠들어야만 입장할 수 있는 신비한 꿈 백화점에서 벌어지는 따뜻하고 환상적인 이야기.',
    rating: 4.5,
    publishedYear: '2020',
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
    mpid: "33c3af11-dc6b-4e3c-b89c-2e59819a6587"
  }, {
    id: '2',
    title: '아몬드',
    author: '손원평',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
    description: '감정을 느끼지 못하는 소년 윤재의 성장 이야기를 통해 인간의 감정과 공감에 대해 탐구하는 소설.',
    rating: 4.7,
    publishedYear: '2017',
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
    mpid: "f70ebf0e-c8c9-42fe-92fb-3abc393bf069"
  }] as any[];
  const mockBookEmotionData = {
    bookId: '1',
    bookTitle: '달러구트 꿈 백화점',
    bookAuthor: '이미예',
    bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    totalReaders: 1250,
    emotionStats: [{
      emotion: '기쁨',
      count: 450,
      percentage: 36,
      mpid: "1c985506-1f02-433e-8237-9ae5ed39f7d7"
    }, {
      emotion: '평온',
      count: 380,
      percentage: 30,
      mpid: "7c63e479-4f6c-4243-9489-4c359268518f"
    }, {
      emotion: '영감',
      count: 250,
      percentage: 20,
      mpid: "7478b8a9-1eed-4b79-91da-c3a4f7d88617"
    }, {
      emotion: '사랑',
      count: 120,
      percentage: 10,
      mpid: "a09180a3-2fc6-46f1-9a40-f77bffc2ff5c"
    }, {
      emotion: '그리움',
      count: 50,
      percentage: 4,
      mpid: "36ad5256-25db-415b-a5d3-40e454b093d3"
    }],
    averageRating: 4.5,
    recentReviews: [{
      id: '1',
      userName: '독서러버',
      emotions: ['기쁨', '평온'],
      rating: 5,
      snippet: '정말 따뜻하고 아름다운 이야기였어요. 꿈이라는 소재를 이렇게 잘 풀어낼 수 있다니...',
      createdAt: new Date('2024-01-20'),
      mpid: "775cdc04-e7f3-4277-8c21-b7318efa0495"
    }, {
      id: '2',
      userName: '책벌레',
      emotions: ['영감', '기쁨'],
      rating: 4,
      snippet: '상상력이 풍부한 작품이에요. 읽는 내내 미소가 지어졌습니다.',
      createdAt: new Date('2024-01-18'),
      mpid: "9ab485aa-6ec0-4a25-bc8b-ea1e4f935e85"
    }],
    trendData: [{
      month: '10월',
      readers: 200,
      avgRating: 4.3,
      mpid: "5ae0d746-632f-4212-a9ba-d33229ab3f85"
    }, {
      month: '11월',
      readers: 350,
      avgRating: 4.4,
      mpid: "766d1b09-ca8d-4347-aa9d-ca6e40bfb463"
    }, {
      month: '12월',
      readers: 450,
      avgRating: 4.5,
      mpid: "baa596f3-471d-459c-9cdd-47af8b43c910"
    }, {
      month: '1월',
      readers: 250,
      avgRating: 4.6,
      mpid: "ecf978ca-e22b-4d30-923a-34cc909d7780"
    }]
  };
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    if (view !== 'mood-detail') {
      setSelectedMoodCard(null);
    }
    if (view !== 'emotion-stats') {
      setSelectedBookForStats(null);
    }
    if (view !== 'reading-progress') {
      setSelectedBookForReading(null);
    }
  };
  const handleMoodCardSelect = (review: ReviewData) => {
    setSelectedMoodCard(review);
    setCurrentView('mood-detail');
  };
  const handleBookStatsSelect = (book: any) => {
    setSelectedBookForStats(book);
    setCurrentView('emotion-stats');
  };
  const handleStartReading = (book: any) => {
    setSelectedBookForReading(book);
    setCurrentView('reading-progress');
  };
  const handleCompleteReading = (progress: any) => {
    // Handle reading completion - could trigger review flow
    setCurrentView('search');
  };
  const handleWishlistToggle = (book: any) => {
    setWishlistBooks(prev => {
      const exists = prev.find(b => b.id === book.id);
      if (exists) {
        return prev.filter(b => b.id !== book.id);
      } else {
        return [...prev, {
          ...book,
          addedAt: new Date(),
          priority: 'medium' as const,
          tags: book.tags || [],
          notes: ''
        }];
      }
    });
  };
  const handleReviewSubmit = (bookData: BookData, reviewText: string, selectedEmotions: string[]) => {
    // Mock AI analysis - in real app, this would call OpenAI API
    const mockAnalysis = {
      emotions: selectedEmotions.length > 0 ? selectedEmotions : ['inspired', 'curious', 'satisfied'],
      topics: ['learning', 'discovery', 'knowledge'],
      moodSummary: 'This reading experience sparked your intellectual curiosity and left you feeling enriched with new perspectives.'
    };
    const newReview: ReviewData = {
      id: Date.now().toString(),
      bookId: bookData.id,
      review: reviewText,
      emotions: mockAnalysis.emotions,
      topics: mockAnalysis.topics,
      moodSummary: mockAnalysis.moodSummary,
      createdAt: new Date(),
      moodCardUrl: `/api/mood-cards/${Date.now()}`
    };
    setReviews(prev => [...prev, newReview]);
    setCurrentView('archive');
  };
  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="min-h-screen px-4 py-8" data-magicpath-id="0" data-magicpath-path="BookMoodApp.tsx">
            <div className="max-w-sm mx-auto" data-magicpath-id="1" data-magicpath-path="BookMoodApp.tsx">
              {/* Hero Section */}
              <div className="text-center mb-12" data-magicpath-id="2" data-magicpath-path="BookMoodApp.tsx">
                <motion.h1 initial={{
                opacity: 0,
                y: 30
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.2
              }} className="text-3xl font-bold text-gray-800 mb-4" data-magicpath-id="3" data-magicpath-path="BookMoodApp.tsx">
                  나만의 독서 감정
                  <span className="block text-gray-600 mt-1" data-magicpath-id="4" data-magicpath-path="BookMoodApp.tsx">아카이브</span>
                </motion.h1>
                <motion.p initial={{
                opacity: 0,
                y: 30
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.4
              }} className="text-gray-600 text-base leading-relaxed" data-magicpath-id="5" data-magicpath-path="BookMoodApp.tsx">
                  AI가 분석하는 감정 태그로
                  <br data-magicpath-id="6" data-magicpath-path="BookMoodApp.tsx" />당신의 독서 취향을 발견하세요
                </motion.p>
              </div>

              {/* Stats Preview */}
              <motion.div initial={{
              opacity: 0,
              y: 40
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.6
            }} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8" data-magicpath-id="7" data-magicpath-path="BookMoodApp.tsx">
                <h4 className="text-gray-800 font-medium mb-4" data-magicpath-id="8" data-magicpath-path="BookMoodApp.tsx">이번 달 독서 현황</h4>
                <div className="grid grid-cols-3 gap-4" data-magicpath-id="9" data-magicpath-path="BookMoodApp.tsx">
                  <div className="text-center" data-magicpath-id="10" data-magicpath-path="BookMoodApp.tsx">
                    <div className="text-2xl font-bold text-[#A8B5E8] mb-1" data-magicpath-id="11" data-magicpath-path="BookMoodApp.tsx">3</div>
                    <div className="text-gray-600 text-xs" data-magicpath-id="12" data-magicpath-path="BookMoodApp.tsx">읽은 책</div>
                  </div>
                  <div className="text-center" data-magicpath-id="13" data-magicpath-path="BookMoodApp.tsx">
                    <div className="text-2xl font-bold text-[#B5D4C8] mb-1" data-magicpath-id="14" data-magicpath-path="BookMoodApp.tsx">{wishlistBooks.length}</div>
                    <div className="text-gray-600 text-xs" data-magicpath-id="15" data-magicpath-path="BookMoodApp.tsx">찜한 책</div>
                  </div>
                  <div className="text-center" data-magicpath-id="16" data-magicpath-path="BookMoodApp.tsx">
                    <div className="text-2xl font-bold text-[#F4E4B8] mb-1" data-magicpath-id="17" data-magicpath-path="BookMoodApp.tsx">2</div>
                    <div className="text-gray-600 text-xs" data-magicpath-id="18" data-magicpath-path="BookMoodApp.tsx">무드 카드</div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Action Cards */}
              <div className="space-y-4 mb-8" data-magicpath-id="19" data-magicpath-path="BookMoodApp.tsx">
                <motion.div initial={{
                opacity: 0,
                y: 40
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.8
              }} onClick={() => handleViewChange('search')} className="bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] rounded-2xl p-6 active:scale-95 transition-transform shadow-lg" data-magicpath-id="20" data-magicpath-path="BookMoodApp.tsx">
                  <div className="flex items-center space-x-4" data-magicpath-id="21" data-magicpath-path="BookMoodApp.tsx">
                    <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm" data-magicpath-id="22" data-magicpath-path="BookMoodApp.tsx">
                      <BookOpen className="w-6 h-6 text-white" data-magicpath-id="23" data-magicpath-path="BookMoodApp.tsx" />
                    </div>
                    <div data-magicpath-id="24" data-magicpath-path="BookMoodApp.tsx">
                      <h3 className="text-lg font-semibold text-white mb-1" data-magicpath-id="25" data-magicpath-path="BookMoodApp.tsx">책 찾고 기록하기</h3>
                      <p className="text-white/90 text-sm" data-magicpath-id="26" data-magicpath-path="BookMoodApp.tsx">
                        읽은 책의 감정을 기록해보세요
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{
                opacity: 0,
                y: 40
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 1.0
              }} onClick={() => handleViewChange('archive')} className="bg-gradient-to-r from-[#B5D4C8] to-[#A8D4C8] rounded-2xl p-6 active:scale-95 transition-transform shadow-lg" data-magicpath-id="27" data-magicpath-path="BookMoodApp.tsx">
                  <div className="flex items-center space-x-4" data-magicpath-id="28" data-magicpath-path="BookMoodApp.tsx">
                    <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm" data-magicpath-id="29" data-magicpath-path="BookMoodApp.tsx">
                      <Bookmark className="w-6 h-6 text-white" data-magicpath-id="30" data-magicpath-path="BookMoodApp.tsx" />
                    </div>
                    <div data-magicpath-id="31" data-magicpath-path="BookMoodApp.tsx">
                      <h3 className="text-lg font-semibold text-white mb-1" data-magicpath-id="32" data-magicpath-path="BookMoodApp.tsx">내 독서 아카이브</h3>
                      <p className="text-white/90 text-sm" data-magicpath-id="33" data-magicpath-path="BookMoodApp.tsx">
                        감정 타임라인과 무드카드 보기
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{
                opacity: 0,
                y: 40
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 1.2
              }} onClick={() => handleViewChange('wishlist')} className="bg-gradient-to-r from-[#F4E4B8] to-[#F0E4B8] rounded-2xl p-6 active:scale-95 transition-transform shadow-lg" data-magicpath-id="34" data-magicpath-path="BookMoodApp.tsx">
                  <div className="flex items-center space-x-4" data-magicpath-id="35" data-magicpath-path="BookMoodApp.tsx">
                    <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm" data-magicpath-id="36" data-magicpath-path="BookMoodApp.tsx">
                      <Heart className="w-6 h-6 text-white" data-magicpath-id="37" data-magicpath-path="BookMoodApp.tsx" />
                    </div>
                    <div data-magicpath-id="38" data-magicpath-path="BookMoodApp.tsx">
                      <h3 className="text-lg font-semibold text-white mb-1" data-magicpath-id="39" data-magicpath-path="BookMoodApp.tsx">찜한 책</h3>
                      <p className="text-white/90 text-sm" data-magicpath-id="40" data-magicpath-path="BookMoodApp.tsx">
                        읽고 싶은 책들을 모아보세요
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>;
      case 'search':
        return <BookSearchAndFilter onReviewSubmit={handleReviewSubmit} onBack={() => handleViewChange('home')} onWishlistToggle={handleWishlistToggle} onStartReading={handleStartReading} onViewEmotionStats={handleBookStatsSelect} wishlistBooks={wishlistBooks.map(book => book.id)} data-magicpath-id="41" data-magicpath-path="BookMoodApp.tsx" />;
      case 'archive':
        return <ArchiveDashboard reviews={reviews.length > 0 ? reviews : mockReviews} onMoodCardSelect={handleMoodCardSelect} onBack={() => handleViewChange('home')} data-magicpath-id="42" data-magicpath-path="BookMoodApp.tsx" />;
      case 'mood-detail':
        return selectedMoodCard ? <MoodCardDetail review={selectedMoodCard} onBack={() => handleViewChange('archive')} data-magicpath-id="43" data-magicpath-path="BookMoodApp.tsx" /> : null;
      case 'settings':
        return <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="min-h-screen p-4" data-magicpath-id="44" data-magicpath-path="BookMoodApp.tsx">
            <div className="max-w-sm mx-auto pt-8" data-magicpath-id="45" data-magicpath-path="BookMoodApp.tsx">
              <h1 className="text-2xl font-bold text-gray-800 mb-8" data-magicpath-id="46" data-magicpath-path="BookMoodApp.tsx">설정</h1>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100" data-magicpath-id="47" data-magicpath-path="BookMoodApp.tsx">
                <p className="text-gray-600" data-magicpath-id="48" data-magicpath-path="BookMoodApp.tsx">설정 패널 준비 중...</p>
              </div>
            </div>
          </motion.div>;
      case 'wishlist':
        return <WishlistManager onBack={() => handleViewChange('home')} onBookSelect={book => {
          // Convert wishlist book to search flow format and start reading
          handleStartReading(book);
        }} data-magicpath-id="49" data-magicpath-path="BookMoodApp.tsx" />;
      case 'emotion-stats':
        return selectedBookForStats ? <BookEmotionStats bookData={mockBookEmotionData} onBack={() => handleViewChange('search')} data-magicpath-id="50" data-magicpath-path="BookMoodApp.tsx" /> : null;
      case 'reading-progress':
        return selectedBookForReading ? <ReadingProgressTracker bookData={selectedBookForReading} onBack={() => handleViewChange('search')} onComplete={handleCompleteReading} data-magicpath-id="51" data-magicpath-path="BookMoodApp.tsx" /> : null;
      default:
        return null;
    }
  };
  return <AppLayout currentView={currentView} onViewChange={handleViewChange} user={user} data-magicpath-id="52" data-magicpath-path="BookMoodApp.tsx">
      <AnimatePresence mode="wait" data-magicpath-id="53" data-magicpath-path="BookMoodApp.tsx">
        {renderContent()}
      </AnimatePresence>
    </AppLayout>;
};
export default BookMoodApp;