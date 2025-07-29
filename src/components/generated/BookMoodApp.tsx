import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Heart, TrendingUp, User, Search, Archive, Settings, Home, BookOpen, BarChart3, Bookmark } from 'lucide-react';
import AppLayout from './AppLayout';
import BookSearchFlow from './BookSearchFlow';
import ArchiveDashboard from './ArchiveDashboard';
import MoodCardDetail from './MoodCardDetail';
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
type ViewType = 'home' | 'search' | 'archive' | 'mood-detail' | 'settings';
const BookMoodApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedMoodCard, setSelectedMoodCard] = useState<ReviewData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);

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
    mpid: "f9af91f0-1d0c-48df-9f05-1e7991f7e2ed"
  }, {
    id: '2',
    bookId: '2',
    review: 'An exhilarating adventure that kept me on the edge of my seat!',
    emotions: ['excited', 'anxious', 'thrilled'],
    topics: ['adventure', 'mystery', 'suspense'],
    moodSummary: 'A heart-pounding experience that awakened your sense of adventure and left you craving more excitement.',
    createdAt: new Date('2024-01-20'),
    moodCardUrl: '/api/mood-cards/2',
    mpid: "39cb399b-3a74-45d8-98f0-39908405f1c7"
  }];
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    if (view !== 'mood-detail') {
      setSelectedMoodCard(null);
    }
  };
  const handleMoodCardSelect = (review: ReviewData) => {
    setSelectedMoodCard(review);
    setCurrentView('mood-detail');
  };
  const handleReviewSubmit = (bookData: BookData, reviewText: string) => {
    // Mock AI analysis - in real app, this would call OpenAI API
    const mockAnalysis = {
      emotions: ['inspired', 'curious', 'satisfied'],
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

              {/* Quick Action Cards */}
              <div className="space-y-4 mb-8" data-magicpath-id="7" data-magicpath-path="BookMoodApp.tsx">
                <motion.div initial={{
                opacity: 0,
                y: 40
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.6
              }} onClick={() => handleViewChange('search')} className="bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] rounded-2xl p-6 active:scale-95 transition-transform shadow-lg" data-magicpath-id="8" data-magicpath-path="BookMoodApp.tsx">
                  <div className="flex items-center space-x-4" data-magicpath-id="9" data-magicpath-path="BookMoodApp.tsx">
                    <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm" data-magicpath-id="10" data-magicpath-path="BookMoodApp.tsx">
                      <BookOpen className="w-6 h-6 text-white" data-magicpath-id="11" data-magicpath-path="BookMoodApp.tsx" />
                    </div>
                    <div data-magicpath-id="12" data-magicpath-path="BookMoodApp.tsx">
                      <h3 className="text-lg font-semibold text-white mb-1" data-magicpath-id="13" data-magicpath-path="BookMoodApp.tsx">책 찾고 기록하기</h3>
                      <p className="text-white/90 text-sm" data-magicpath-id="14" data-magicpath-path="BookMoodApp.tsx">
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
                delay: 0.8
              }} onClick={() => handleViewChange('archive')} className="bg-gradient-to-r from-[#B5D4C8] to-[#A8D4C8] rounded-2xl p-6 active:scale-95 transition-transform shadow-lg" data-magicpath-id="15" data-magicpath-path="BookMoodApp.tsx">
                  <div className="flex items-center space-x-4" data-magicpath-id="16" data-magicpath-path="BookMoodApp.tsx">
                    <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm" data-magicpath-id="17" data-magicpath-path="BookMoodApp.tsx">
                      <Bookmark className="w-6 h-6 text-white" data-magicpath-id="18" data-magicpath-path="BookMoodApp.tsx" />
                    </div>
                    <div data-magicpath-id="19" data-magicpath-path="BookMoodApp.tsx">
                      <h3 className="text-lg font-semibold text-white mb-1" data-magicpath-id="20" data-magicpath-path="BookMoodApp.tsx">내 독서 아카이브</h3>
                      <p className="text-white/90 text-sm" data-magicpath-id="21" data-magicpath-path="BookMoodApp.tsx">
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
                delay: 1.0
              }} className="bg-gradient-to-r from-[#F4E4B8] to-[#F0E4B8] rounded-2xl p-6 active:scale-95 transition-transform shadow-lg" data-magicpath-id="22" data-magicpath-path="BookMoodApp.tsx">
                  <div className="flex items-center space-x-4" data-magicpath-id="23" data-magicpath-path="BookMoodApp.tsx">
                    <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm" data-magicpath-id="24" data-magicpath-path="BookMoodApp.tsx">
                      <BarChart3 className="w-6 h-6 text-white" data-magicpath-id="25" data-magicpath-path="BookMoodApp.tsx" />
                    </div>
                    <div data-magicpath-id="26" data-magicpath-path="BookMoodApp.tsx">
                      <h3 className="text-lg font-semibold text-white mb-1" data-magicpath-id="27" data-magicpath-path="BookMoodApp.tsx">감성 리포트</h3>
                      <p className="text-white/90 text-sm" data-magicpath-id="28" data-magicpath-path="BookMoodApp.tsx">
                        나의 독서 성향 분석 보고서
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Stats Preview */}
              <motion.div initial={{
              opacity: 0,
              y: 40
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 1.2
            }} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100" data-magicpath-id="29" data-magicpath-path="BookMoodApp.tsx">
                <h4 className="text-gray-800 font-medium mb-4" data-magicpath-id="30" data-magicpath-path="BookMoodApp.tsx">이번 달 독서 현황</h4>
                <div className="grid grid-cols-3 gap-4" data-magicpath-id="31" data-magicpath-path="BookMoodApp.tsx">
                  <div className="text-center" data-magicpath-id="32" data-magicpath-path="BookMoodApp.tsx">
                    <div className="text-2xl font-bold text-[#A8B5E8] mb-1" data-magicpath-id="33" data-magicpath-path="BookMoodApp.tsx">3</div>
                    <div className="text-gray-600 text-xs" data-magicpath-id="34" data-magicpath-path="BookMoodApp.tsx">읽은 책</div>
                  </div>
                  <div className="text-center" data-magicpath-id="35" data-magicpath-path="BookMoodApp.tsx">
                    <div className="text-2xl font-bold text-[#B5D4C8] mb-1" data-magicpath-id="36" data-magicpath-path="BookMoodApp.tsx">12</div>
                    <div className="text-gray-600 text-xs" data-magicpath-id="37" data-magicpath-path="BookMoodApp.tsx">감정 태그</div>
                  </div>
                  <div className="text-center" data-magicpath-id="38" data-magicpath-path="BookMoodApp.tsx">
                    <div className="text-2xl font-bold text-[#F4E4B8] mb-1" data-magicpath-id="39" data-magicpath-path="BookMoodApp.tsx">2</div>
                    <div className="text-gray-600 text-xs" data-magicpath-id="40" data-magicpath-path="BookMoodApp.tsx">무드 카드</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>;
      case 'search':
        return <BookSearchFlow onReviewSubmit={handleReviewSubmit} onBack={() => handleViewChange('home')} data-magicpath-id="41" data-magicpath-path="BookMoodApp.tsx" />;
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
      default:
        return null;
    }
  };
  return <AppLayout currentView={currentView} onViewChange={handleViewChange} user={user} data-magicpath-id="49" data-magicpath-path="BookMoodApp.tsx">
      <AnimatePresence mode="wait" data-magicpath-id="50" data-magicpath-path="BookMoodApp.tsx">
        {renderContent()}
      </AnimatePresence>
    </AppLayout>;
};
export default BookMoodApp;