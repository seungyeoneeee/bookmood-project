"use client";

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

  // Animation variants for floating elements
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  const floatingDelayedVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, -3, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }
    }
  };
  const floatingSlowVariants = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 2, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 4
      }
    }
  };

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
    mpid: "35c634f0-17f4-4c85-8c49-220e1cde646d"
  }, {
    id: '2',
    bookId: '2',
    review: 'An exhilarating adventure that kept me on the edge of my seat!',
    emotions: ['excited', 'anxious', 'thrilled'],
    topics: ['adventure', 'mystery', 'suspense'],
    moodSummary: 'A heart-pounding experience that awakened your sense of adventure and left you craving more excitement.',
    createdAt: new Date('2024-01-20'),
    moodCardUrl: '/api/mood-cards/2',
    mpid: "63a17f0d-1201-4af0-8af6-827b480082e9"
  }];
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
      mpid: "eb41c640-95bc-4b80-a9b5-9d7a2a9f1c1e"
    }, {
      emotion: '평온',
      count: 380,
      percentage: 30,
      mpid: "bd9886cc-5643-400e-a9d0-ca4ec3cef907"
    }, {
      emotion: '영감',
      count: 250,
      percentage: 20,
      mpid: "d30fface-2e11-4836-9e91-fd242c01ffa5"
    }, {
      emotion: '사랑',
      count: 120,
      percentage: 10,
      mpid: "e6c14473-6399-48fe-bb8f-1746680f010b"
    }, {
      emotion: '그리움',
      count: 50,
      percentage: 4,
      mpid: "d54f904c-6fe9-4271-a759-a71be4a7fb9f"
    }],
    averageRating: 4.5,
    recentReviews: [{
      id: '1',
      userName: '독서러버',
      emotions: ['기쁨', '평온'],
      rating: 5,
      snippet: '정말 따뜻하고 아름다운 이야기였어요. 꿈이라는 소재를 이렇게 잘 풀어낼 수 있다니...',
      createdAt: new Date('2024-01-20'),
      mpid: "97ba1434-3d18-4d7f-bd69-aa9b48a42e1f"
    }, {
      id: '2',
      userName: '책벌레',
      emotions: ['영감', '기쁨'],
      rating: 4,
      snippet: '상상력이 풍부한 작품이에요. 읽는 내내 미소가 지어졌습니다.',
      createdAt: new Date('2024-01-18'),
      mpid: "f65717d3-f86a-4dff-8831-9922308175e3"
    }],
    trendData: [{
      month: '10월',
      readers: 200,
      avgRating: 4.3,
      mpid: "4f3f0286-c83e-4675-b2a1-77a13236e5ef"
    }, {
      month: '11월',
      readers: 350,
      avgRating: 4.4,
      mpid: "3c3940ed-2a2f-4e06-a290-95d4635ef5cf"
    }, {
      month: '12월',
      readers: 450,
      avgRating: 4.5,
      mpid: "6320722e-cfbc-415d-8d16-57cd92af944b"
    }, {
      month: '1월',
      readers: 250,
      avgRating: 4.6,
      mpid: "ccdfd45a-363e-4453-a1d6-10330cff5618"
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
        }} className="min-h-screen px-4 py-8 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden" data-magicpath-id="0" data-magicpath-path="BookMoodApp.tsx">
            {/* Floating Characters */}
            <motion.div variants={floatingVariants} animate="animate" className="absolute top-20 right-8 w-16 h-16 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-full flex items-center justify-center shadow-lg opacity-80" data-magicpath-id="1" data-magicpath-path="BookMoodApp.tsx">
              <Book className="w-8 h-8 text-white" data-magicpath-id="2" data-magicpath-path="BookMoodApp.tsx" />
            </motion.div>
            
            <motion.div variants={floatingDelayedVariants} animate="animate" className="absolute top-32 left-6 w-12 h-12 bg-gradient-to-br from-[#F4E4B8] to-[#E8D5A3] rounded-full flex items-center justify-center shadow-lg opacity-70" data-magicpath-id="3" data-magicpath-path="BookMoodApp.tsx">
              <Heart className="w-6 h-6 text-white" data-magicpath-id="4" data-magicpath-path="BookMoodApp.tsx" />
            </motion.div>
            
            <motion.div variants={floatingSlowVariants} animate="animate" className="absolute top-64 right-12 w-10 h-10 bg-gradient-to-br from-[#B5D4C8] to-[#A3C9B8] rounded-full flex items-center justify-center shadow-lg opacity-60" data-magicpath-id="5" data-magicpath-path="BookMoodApp.tsx">
              <TrendingUp className="w-5 h-5 text-white" data-magicpath-id="6" data-magicpath-path="BookMoodApp.tsx" />
            </motion.div>
            
            <motion.div variants={floatingVariants} animate="animate" className="absolute bottom-32 left-8 w-14 h-14 bg-gradient-to-br from-[#E8B5A8] to-[#D8A598] rounded-full flex items-center justify-center shadow-lg opacity-75" data-magicpath-id="7" data-magicpath-path="BookMoodApp.tsx">
              <User className="w-7 h-7 text-white" data-magicpath-id="8" data-magicpath-path="BookMoodApp.tsx" />
            </motion.div>

            <div className="max-w-md mx-auto relative z-10" data-magicpath-id="9" data-magicpath-path="BookMoodApp.tsx">
              {/* Hero Section */}
              <div className="text-center mb-16 pt-8" data-magicpath-id="10" data-magicpath-path="BookMoodApp.tsx">
                <motion.div initial={{
                opacity: 0,
                scale: 0.9
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                delay: 0.2
              }} className="w-24 h-24 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl relative" data-magicpath-id="11" data-magicpath-path="BookMoodApp.tsx">
                  <Heart className="w-12 h-12 text-white" data-magicpath-id="12" data-magicpath-path="BookMoodApp.tsx" />
                  {/* Pulse effect */}
                  <motion.div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] opacity-30" animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0, 0.3]
                }} transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }} data-magicpath-id="13" data-magicpath-path="BookMoodApp.tsx" />
                </motion.div>
                
                <motion.h1 initial={{
                opacity: 0,
                y: 30
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.4
              }} className="text-4xl font-bold text-gray-800 mb-4" data-magicpath-id="14" data-magicpath-path="BookMoodApp.tsx">
                  BookMood
                </motion.h1>
                
                <motion.p initial={{
                opacity: 0,
                y: 30
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.6
              }} className="text-gray-600 text-lg leading-relaxed" data-magicpath-id="15" data-magicpath-path="BookMoodApp.tsx">
                  AI가 분석하는 감정 태그로<br data-magicpath-id="16" data-magicpath-path="BookMoodApp.tsx" />
                  당신의 독서 취향을 발견하세요
                </motion.p>
              </div>

              {/* Search Box - Google Style */}
              <motion.div initial={{
              opacity: 0,
              y: 40
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.8
            }} className="mb-12" data-magicpath-id="17" data-magicpath-path="BookMoodApp.tsx">
                <motion.div onClick={() => handleViewChange('search')} className="bg-white rounded-full shadow-lg border border-gray-200 p-4 flex items-center space-x-4 cursor-pointer transition-all duration-300" whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }} whileTap={{
                scale: 0.98
              }} data-magicpath-id="18" data-magicpath-path="BookMoodApp.tsx">
                  <Search className="w-6 h-6 text-gray-400" data-magicpath-id="19" data-magicpath-path="BookMoodApp.tsx" />
                  <span className="text-gray-500 text-lg flex-1" data-magicpath-id="20" data-magicpath-path="BookMoodApp.tsx">책을 검색하고 감정을 기록해보세요</span>
                </motion.div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div initial={{
              opacity: 0,
              y: 40
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 1.0
            }} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-8" data-magicpath-id="21" data-magicpath-path="BookMoodApp.tsx">
                <h4 className="text-gray-800 font-semibold mb-6 text-center" data-magicpath-id="22" data-magicpath-path="BookMoodApp.tsx">이번 달 독서 현황</h4>
                <div className="grid grid-cols-3 gap-6" data-magicpath-id="23" data-magicpath-path="BookMoodApp.tsx">
                  <motion.div className="text-center" whileHover={{
                  scale: 1.05
                }} transition={{
                  type: "spring",
                  stiffness: 300
                }} data-magicpath-id="24" data-magicpath-path="BookMoodApp.tsx">
                    <motion.div className="text-3xl font-bold text-[#A8B5E8] mb-2" animate={{
                    scale: [1, 1.1, 1],
                    color: ["#A8B5E8", "#8BB5E8", "#A8B5E8"]
                  }} transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }} data-magicpath-id="25" data-magicpath-path="BookMoodApp.tsx">
                      3
                    </motion.div>
                    <div className="text-gray-600 text-sm" data-magicpath-id="26" data-magicpath-path="BookMoodApp.tsx">읽은 책</div>
                  </motion.div>
                  <motion.div className="text-center" whileHover={{
                  scale: 1.05
                }} transition={{
                  type: "spring",
                  stiffness: 300
                }} data-magicpath-id="27" data-magicpath-path="BookMoodApp.tsx">
                    <motion.div className="text-3xl font-bold text-[#B5D4C8] mb-2" animate={{
                    scale: [1, 1.1, 1],
                    color: ["#B5D4C8", "#A3C9B8", "#B5D4C8"]
                  }} transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }} data-magicpath-id="28" data-magicpath-path="BookMoodApp.tsx">
                      {wishlistBooks.length}
                    </motion.div>
                    <div className="text-gray-600 text-sm" data-magicpath-id="29" data-magicpath-path="BookMoodApp.tsx">찜한 책</div>
                  </motion.div>
                  <motion.div className="text-center" whileHover={{
                  scale: 1.05
                }} transition={{
                  type: "spring",
                  stiffness: 300
                }} data-magicpath-id="30" data-magicpath-path="BookMoodApp.tsx">
                    <motion.div className="text-3xl font-bold text-[#F4E4B8] mb-2" animate={{
                    scale: [1, 1.1, 1],
                    color: ["#F4E4B8", "#E8D5A3", "#F4E4B8"]
                  }} transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }} data-magicpath-id="31" data-magicpath-path="BookMoodApp.tsx">
                      2
                    </motion.div>
                    <div className="text-gray-600 text-sm" data-magicpath-id="32" data-magicpath-path="BookMoodApp.tsx">무드 카드</div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>;
      case 'search':
        return <BookSearchAndFilter onReviewSubmit={handleReviewSubmit} onBack={() => handleViewChange('home')} onWishlistToggle={handleWishlistToggle} onStartReading={handleStartReading} onViewEmotionStats={handleBookStatsSelect} wishlistBooks={wishlistBooks.map(book => book.id)} data-magicpath-id="33" data-magicpath-path="BookMoodApp.tsx" />;
      case 'archive':
        return <ArchiveDashboard reviews={reviews.length > 0 ? reviews : mockReviews} onMoodCardSelect={handleMoodCardSelect} onBack={() => handleViewChange('home')} data-magicpath-id="34" data-magicpath-path="BookMoodApp.tsx" />;
      case 'mood-detail':
        return selectedMoodCard ? <MoodCardDetail review={selectedMoodCard} onBack={() => handleViewChange('archive')} data-magicpath-id="35" data-magicpath-path="BookMoodApp.tsx" /> : null;
      case 'settings':
        return <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="min-h-screen p-4" data-magicpath-id="36" data-magicpath-path="BookMoodApp.tsx">
            <div className="max-w-sm mx-auto pt-8" data-magicpath-id="37" data-magicpath-path="BookMoodApp.tsx">
              <h1 className="text-2xl font-bold text-gray-800 mb-8" data-magicpath-id="38" data-magicpath-path="BookMoodApp.tsx">설정</h1>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100" data-magicpath-id="39" data-magicpath-path="BookMoodApp.tsx">
                <p className="text-gray-600" data-magicpath-id="40" data-magicpath-path="BookMoodApp.tsx">설정 패널 준비 중...</p>
              </div>
            </div>
          </motion.div>;
      case 'wishlist':
        return <WishlistManager onBack={() => handleViewChange('home')} onBookSelect={book => {
          handleStartReading(book);
        }} data-magicpath-id="41" data-magicpath-path="BookMoodApp.tsx" />;
      case 'emotion-stats':
        return selectedBookForStats ? <BookEmotionStats bookData={mockBookEmotionData} onBack={() => handleViewChange('search')} data-magicpath-id="42" data-magicpath-path="BookMoodApp.tsx" /> : null;
      case 'reading-progress':
        return selectedBookForReading ? <ReadingProgressTracker bookData={selectedBookForReading} onBack={() => handleViewChange('search')} onComplete={handleCompleteReading} data-magicpath-id="43" data-magicpath-path="BookMoodApp.tsx" /> : null;
      default:
        return null;
    }
  };
  return <AppLayout currentView={currentView} onViewChange={handleViewChange} user={user} data-magicpath-id="44" data-magicpath-path="BookMoodApp.tsx">
      <AnimatePresence mode="wait" data-magicpath-id="45" data-magicpath-path="BookMoodApp.tsx">
        {renderContent()}
      </AnimatePresence>
    </AppLayout>;
};
export default BookMoodApp;