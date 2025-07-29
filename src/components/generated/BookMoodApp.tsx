import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Heart, TrendingUp, User, Search, Archive, Settings, Home } from 'lucide-react';
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
    mpid: "c9917e80-7557-4fdc-bba4-316a0fa0363b"
  }, {
    id: '2',
    bookId: '2',
    review: 'An exhilarating adventure that kept me on the edge of my seat!',
    emotions: ['excited', 'anxious', 'thrilled'],
    topics: ['adventure', 'mystery', 'suspense'],
    moodSummary: 'A heart-pounding experience that awakened your sense of adventure and left you craving more excitement.',
    createdAt: new Date('2024-01-20'),
    moodCardUrl: '/api/mood-cards/2',
    mpid: "f0a37338-f36f-4a7c-a8dc-6a76a64264d6"
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
        }} className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5" data-magicpath-id="0" data-magicpath-path="BookMoodApp.tsx">
            <div className="container mx-auto px-4 py-16" data-magicpath-id="1" data-magicpath-path="BookMoodApp.tsx">
              <div className="text-center mb-16" data-magicpath-id="2" data-magicpath-path="BookMoodApp.tsx">
                <motion.h1 initial={{
                opacity: 0,
                y: 30
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.2
              }} className="text-5xl font-bold text-foreground mb-6" data-magicpath-id="3" data-magicpath-path="BookMoodApp.tsx">
                  Your Reading Journey,
                  <span className="text-primary block mt-2" data-magicpath-id="4" data-magicpath-path="BookMoodApp.tsx">Emotionally Mapped</span>
                </motion.h1>
                <motion.p initial={{
                opacity: 0,
                y: 30
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.4
              }} className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-magicpath-id="5" data-magicpath-path="BookMoodApp.tsx">
                  Discover the emotional landscape of your reading experiences through AI-powered insights and beautiful mood cards.
                </motion.p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto" data-magicpath-id="6" data-magicpath-path="BookMoodApp.tsx">
                <motion.div initial={{
                opacity: 0,
                y: 40
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.6
              }} onClick={() => handleViewChange('search')} className="group cursor-pointer" data-magicpath-id="7" data-magicpath-path="BookMoodApp.tsx">
                  <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all duration-300 group-hover:border-primary/20" data-magicpath-id="8" data-magicpath-path="BookMoodApp.tsx">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors" data-magicpath-id="9" data-magicpath-path="BookMoodApp.tsx">
                      <Search className="w-8 h-8 text-primary" data-magicpath-id="10" data-magicpath-path="BookMoodApp.tsx" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3" data-magicpath-id="11" data-magicpath-path="BookMoodApp.tsx">Find & Review Books</h3>
                    <p className="text-muted-foreground leading-relaxed" data-magicpath-id="12" data-magicpath-path="BookMoodApp.tsx">
                      Search for books and capture your emotional journey through thoughtful reviews.
                    </p>
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
              }} onClick={() => handleViewChange('archive')} className="group cursor-pointer" data-magicpath-id="13" data-magicpath-path="BookMoodApp.tsx">
                  <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all duration-300 group-hover:border-accent/20" data-magicpath-id="14" data-magicpath-path="BookMoodApp.tsx">
                    <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors" data-magicpath-id="15" data-magicpath-path="BookMoodApp.tsx">
                      <Archive className="w-8 h-8 text-accent" data-magicpath-id="16" data-magicpath-path="BookMoodApp.tsx" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3" data-magicpath-id="17" data-magicpath-path="BookMoodApp.tsx">My Reading Archive</h3>
                    <p className="text-muted-foreground leading-relaxed" data-magicpath-id="18" data-magicpath-path="BookMoodApp.tsx">
                      Explore your reading timeline and discover patterns in your emotional responses.
                    </p>
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
              }} className="group cursor-pointer" data-magicpath-id="19" data-magicpath-path="BookMoodApp.tsx">
                  <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all duration-300 group-hover:border-secondary/20" data-magicpath-id="20" data-magicpath-path="BookMoodApp.tsx">
                    <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors" data-magicpath-id="21" data-magicpath-path="BookMoodApp.tsx">
                      <TrendingUp className="w-8 h-8 text-secondary" data-magicpath-id="22" data-magicpath-path="BookMoodApp.tsx" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3" data-magicpath-id="23" data-magicpath-path="BookMoodApp.tsx">Style Report</h3>
                    <p className="text-muted-foreground leading-relaxed" data-magicpath-id="24" data-magicpath-path="BookMoodApp.tsx">
                      Get personalized insights about your reading preferences and emotional patterns.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>;
      case 'search':
        return <BookSearchFlow onReviewSubmit={handleReviewSubmit} onBack={() => handleViewChange('home')} data-magicpath-id="25" data-magicpath-path="BookMoodApp.tsx" />;
      case 'archive':
        return <ArchiveDashboard reviews={reviews.length > 0 ? reviews : mockReviews} onMoodCardSelect={handleMoodCardSelect} onBack={() => handleViewChange('home')} data-magicpath-id="26" data-magicpath-path="BookMoodApp.tsx" />;
      case 'mood-detail':
        return selectedMoodCard ? <MoodCardDetail review={selectedMoodCard} onBack={() => handleViewChange('archive')} data-magicpath-id="27" data-magicpath-path="BookMoodApp.tsx" /> : null;
      case 'settings':
        return <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="min-h-screen bg-background p-8" data-magicpath-id="28" data-magicpath-path="BookMoodApp.tsx">
            <div className="max-w-2xl mx-auto" data-magicpath-id="29" data-magicpath-path="BookMoodApp.tsx">
              <h1 className="text-3xl font-bold text-foreground mb-8" data-magicpath-id="30" data-magicpath-path="BookMoodApp.tsx">Settings</h1>
              <div className="bg-card border border-border rounded-xl p-8" data-magicpath-id="31" data-magicpath-path="BookMoodApp.tsx">
                <p className="text-muted-foreground" data-magicpath-id="32" data-magicpath-path="BookMoodApp.tsx">Settings panel coming soon...</p>
              </div>
            </div>
          </motion.div>;
      default:
        return null;
    }
  };
  return <AppLayout currentView={currentView} onViewChange={handleViewChange} user={user} data-magicpath-id="33" data-magicpath-path="BookMoodApp.tsx">
      <AnimatePresence mode="wait" data-magicpath-id="34" data-magicpath-path="BookMoodApp.tsx">
        {renderContent()}
      </AnimatePresence>
    </AppLayout>;
};
export default BookMoodApp;