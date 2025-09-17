import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Heart, TrendingUp, User, Search, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BookExternal, CreateReviewInput } from '../types/database';
import * as booksApi from '../api/books';
import * as libraryApi from '../api/library';
import { aladinApi } from '../services/aladinApi';
import { ReadingBook } from './reading/CurrentlyReadingManager';
import * as reviewsApi from '../api/reviews';
import { analyzeEmotionsWithGPT, validateOpenAIKey } from '../services/openaiApi';

// Import existing components
import AppLayout from './generated/AppLayout';
import ArchiveDashboard from './generated/ArchiveDashboard';
import MoodCardDetail from './generated/MoodCardDetail';
import NewWishlistManager from './wishlist/NewWishlistManager';
import BookEmotionStats from './generated/BookEmotionStats';
import ReadingProgressTracker from './generated/ReadingProgressTracker';
import LoginPage from './generated/LoginPage';

// Import new search components
import SearchPage from './search/SearchPage';
import SearchResultsPage from './search/SearchResultsPage';
import EmotionFilterPage from './search/EmotionFilterPage';

// Import new book components
import BookDetailPage from './books/BookDetailPage';
import BookReviewPage from './books/BookReviewPage';

// Import reading components
import CurrentlyReadingManager from './reading/CurrentlyReadingManager';

// Import library components
import CompletedBooksManager from './library/CompletedBooksManager';

// Import test components
import SupabaseTest from './test/SupabaseTest';




// Type definitions
export interface BookData {
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
}

export interface ReviewData {
  id: string;
  bookId: string;
  review: string;
  memo?: string; // 🆕 메모 필드 추가
  emotions: string[];
  topics: string[];
  moodSummary: string;
  createdAt: Date;
  moodCardUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface WishlistBook extends BookData {
  addedAt: Date;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  notes: string;
}

// Router specific components
const ProtectedRoute: React.FC<{ children: React.ReactNode; user: User | null }> = ({ children, user }) => {
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const MoodCardDetailRoute: React.FC<{ reviews: ReviewData[] }> = ({ reviews }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const review = reviews.find(r => r.id === id);
  
  if (!review) {
    return <Navigate to="/archive" replace />;
  }
  
  return <MoodCardDetail review={review} onBack={() => navigate('/archive')} />;
};

const EmotionStatsRoute: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  
  // Mock data - in real app, fetch based on bookId
  const mockBookEmotionData = {
    bookId: bookId || '1',
    bookTitle: '달러구트 꿈 백화점',
    bookAuthor: '이미예',
    bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    totalReaders: 1250,
    emotionStats: [
      { emotion: '기쁨', count: 450, percentage: 36 },
      { emotion: '평온', count: 380, percentage: 30 },
      { emotion: '영감', count: 250, percentage: 20 },
      { emotion: '사랑', count: 120, percentage: 10 },
      { emotion: '그리움', count: 50, percentage: 4 }
    ],
    averageRating: 4.5,
    recentReviews: [
      {
        id: '1',
        userName: '독서러버',
        emotions: ['기쁨', '평온'],
        rating: 5,
        snippet: '정말 따뜻하고 아름다운 이야기였어요. 꿈이라는 소재를 이렇게 잘 풀어낼 수 있다니...',
        createdAt: new Date('2024-01-20')
      }
    ],
    trendData: [
      { month: '10월', readers: 200, avgRating: 4.3 },
      { month: '11월', readers: 350, avgRating: 4.4 },
      { month: '12월', readers: 450, avgRating: 4.5 },
      { month: '1월', readers: 250, avgRating: 4.6 }
    ]
  };
  
  return <BookEmotionStats bookData={mockBookEmotionData} onBack={() => navigate(-1)} />;
};

const ReadingProgressRoute: React.FC<{ 
  loadReadingBooks: () => Promise<void>;
  onReviewWrite: (isbn13: string) => void;
}> = ({ loadReadingBooks, onReviewWrite }) => {
  const { bookId } = useParams<{ bookId: string }>(); // 실제로는 ISBN13
  const navigate = useNavigate();
  const [bookData, setBookData] = useState<{ id: string; title: string; author: string; cover: string; pages: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadBookData = async () => {
      if (!bookId) return;
      
      setIsLoading(true);
      
      try {
        // 1. 먼저 데이터베이스에서 조회
        const { data: dbBook } = await booksApi.getBookByIsbn(bookId);
        
        if (dbBook) {
          setBookData({
            id: dbBook.isbn13,
            title: dbBook.title,
            author: dbBook.author || '작가 미상',
            cover: dbBook.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
            pages: dbBook.page_count || 280 // 🔄 일단 280으로 박아넣기
          });
        } else {
          // 2. 데이터베이스에 없으면 알라딘 API에서 조회
          const response = await aladinApi.searchBooks({
            query: bookId,
            queryType: 'ISBN',
            maxResults: 1
          });
          
          if (response.item && response.item.length > 0) {
            const book = response.item[0];
            // 알라딘 데이터를 BookExternal 형태로 변환해서 페이지 수 추출
            const bookExternal = aladinApi.transformToBookExternal(book);
            setBookData({
              id: book.isbn13,
              title: book.title,
              author: book.author || '작가 미상',
              cover: book.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
              pages: bookExternal.page_count || 280 // 🔄 일단 280으로 박아넣기
            });
          } else {
            // 3. 아무것도 없으면 기본값
            setBookData({
              id: bookId,
              title: 'ISBN: ' + bookId,
              author: '작가 미상',
              cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
              pages: 280 // 🔄 일단 280으로 박아넣기
            });
          }
        }
      } catch (error) {
        console.error('책 정보 로딩 실패:', error);
        setBookData({
          id: bookId,
          title: 'ISBN: ' + bookId,
          author: '작가 미상',
          cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
          pages: 280 // 🔄 일단 280으로 박아넣기
        });
      }
      
      setIsLoading(false);
    };

    loadBookData();
  }, [bookId]);

  const handleProgressUpdate = async (isbn13: string, currentPage: number, totalPages: number, notes: { page: number; content: string }[]) => {
    if (!user) {
      console.warn('❌ 사용자가 인증되지 않음');
      return;
    }

    try {
      const progressPercentage = Math.round((currentPage / totalPages) * 100);
      const notesText = notes.map(note => `[${note.page}p] ${note.content}`).join('\n');
      
      // 현재 progress 상태에서 shelf_status 결정 (기본값은 reading)
      let shelfStatus: 'reading' | 'completed' | 'paused' = 'reading';
      if (progressPercentage === 100) {
        shelfStatus = 'completed';
      } else {
        // progress 객체에서 상태를 가져올 수 있다면 사용, 아니면 기본값
        shelfStatus = 'reading'; // TODO: progress 상태 반영 필요
      }
      
      // library_items 테이블에 진행 상태 실시간 저장/업데이트
      const result = await libraryApi.addLibraryItem({
        isbn13: isbn13,
        is_wishlist: false,
        shelf_status: shelfStatus,
        progress: progressPercentage,
        started_at: new Date().toISOString().split('T')[0],
        note: notesText || undefined
      });
      
      if (result.error) {
        console.error('❌ 데이터베이스 저장 실패:', result.error);
      } else {
        // 읽고 있는 책 목록 실시간 업데이트
        await loadReadingBooks();
      }
    } catch (error) {
      console.error('❌ handleProgressUpdate 예외:', error);
    }
  };

  const handleComplete = async (progress: { notes: { page: number; content: string }[] }) => {
    if (!user || !bookId) return;

    try {
      // library_items 테이블에 독서 완료 기록 저장
      const notesText = progress.notes.map(note => `[${note.page}p] ${note.content}`).join('\n\n');
      await libraryApi.addLibraryItem({
        isbn13: bookId,
        is_wishlist: false,
        shelf_status: 'completed',
        progress: 100,
        finished_at: new Date().toISOString().split('T')[0],
        note: notesText || undefined
      });
      
      
      // 읽고 있는 책 목록에서 제거 (완료된 책이므로)
      await loadReadingBooks();
      
      navigate('/archive');
    } catch (error) {
      console.error('독서 완료 기록 저장 실패:', error);
      navigate('/archive'); // 저장 실패해도 아카이브로 이동
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#A8B5E8] border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-gray-600">책 정보를 불러오는 중...</span>
      </div>
    );
  }

  if (!bookData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-2">책을 찾을 수 없습니다</h3>
          <button onClick={() => navigate(-1)} className="px-6 py-3 bg-[#A8B5E8] text-white rounded-xl font-medium">
            돌아가기
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <ReadingProgressTracker 
      bookData={bookData} 
      onBack={() => navigate(-1)} 
      onComplete={handleComplete}
      onProgressUpdate={handleProgressUpdate}
      onStatusUpdate={loadReadingBooks} // 🆕 상태 변경 시 목록 새로고침
      onReviewWrite={onReviewWrite} // 🆕 감상문 작성 콜백
      user={user ? { id: user.id } : undefined}
    />
  );
};

const HomePage: React.FC<{ 
  user: User | null; 
  wishlistBooks: WishlistBook[]; 
  readingBooks: ReadingBook[];
  onViewChange: (view: string) => void 
}> = ({ user, wishlistBooks, readingBooks, onViewChange }) => {
  const navigate = useNavigate();
  
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      
    >
      {/* Floating Characters */}
      <motion.div 
        variants={floatingVariants} 
        animate="animate" 
        className="absolute top-20 right-8 w-16 h-16 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-full flex items-center justify-center shadow-lg opacity-80"
      >
        <Book className="w-8 h-8 text-white" />
      </motion.div>
      
      <motion.div 
        variants={floatingDelayedVariants} 
        animate="animate" 
        className="absolute top-32 left-6 w-12 h-12 bg-gradient-to-br from-[#F4E4B8] to-[#E8D5A3] rounded-full flex items-center justify-center shadow-lg opacity-70"
      >
        <Heart className="w-6 h-6 text-white" />
      </motion.div>
      
      <motion.div 
        variants={floatingSlowVariants} 
        animate="animate" 
        className="absolute top-64 right-12 w-10 h-10 bg-gradient-to-br from-[#B5D4C8] to-[#A3C9B8] rounded-full flex items-center justify-center shadow-lg opacity-60"
      >
        <TrendingUp className="w-5 h-5 text-white" />
      </motion.div>
      
      <motion.div 
        variants={floatingVariants} 
        animate="animate" 
        className="absolute bottom-32 left-8 w-14 h-14 bg-gradient-to-br from-[#E8B5A8] to-[#D8A598] rounded-full flex items-center justify-center shadow-lg opacity-75"
      >
        <User className="w-7 h-7 text-white" />
      </motion.div>

      <div className="relative z-10 px-4 md:px-0">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.2 }} 
            className="w-24 h-24 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl relative"
          >
            <Heart className="w-12 h-12 text-white" />
            <motion.div 
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] opacity-30" 
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0, 0.3]
              }} 
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }} 
            />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }} 
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            BookMood
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6 }} 
            className="text-gray-600 text-lg leading-relaxed"
          >
            AI가 분석하는 감정 태그로<br />
            당신의 독서 취향을 발견하세요
          </motion.p>
        </div>

        {/* Search Box */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.8 }} 
          className="mb-12"
        >
          <motion.div 
            onClick={() => navigate('/search')} 
            className="bg-white rounded-full shadow-lg border border-gray-200 p-4 flex items-center space-x-4 cursor-pointer transition-all duration-300" 
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }} 
            whileTap={{ scale: 0.98 }}
          >
            <Search className="w-6 h-6 text-gray-400" />
            <span className="text-gray-500 text-lg flex-1">책을 검색하고 감정을 기록해보세요</span>
          </motion.div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 1.0 }} 
          className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-8"
        >
          <h4 className="text-gray-800 font-semibold mb-6 text-center">이번 달 독서 현황</h4>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <motion.div 
              className="text-center" 
              whileHover={{ scale: 1.05 }} 
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-3xl font-bold text-[#A8B5E8] mb-2" 
                animate={{
                  scale: [1, 1.1, 1],
                  color: ["#A8B5E8", "#8BB5E8", "#A8B5E8"]
                }} 
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                3
              </motion.div>
              <div className="text-gray-600 text-sm">읽은 책</div>
            </motion.div>
            
            <motion.div 
              className="text-center" 
              whileHover={{ scale: 1.05 }} 
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-3xl font-bold text-[#B5D4C8] mb-2" 
                animate={{
                  scale: [1, 1.1, 1],
                  color: ["#B5D4C8", "#A3C9B8", "#B5D4C8"]
                }} 
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                {wishlistBooks.length}
              </motion.div>
              <div className="text-gray-600 text-sm">찜한 책</div>
            </motion.div>
            
            <motion.div 
              className="text-center" 
              whileHover={{ scale: 1.05 }} 
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-3xl font-bold text-[#F4E4B8] mb-2" 
                animate={{
                  scale: [1, 1.1, 1],
                  color: ["#F4E4B8", "#E8D5A3", "#F4E4B8"]
                }} 
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                2
              </motion.div>
              <div className="text-gray-600 text-sm">무드 카드</div>
            </motion.div>
          </div>
          
          {/* 📚 읽고 있는 책 정보 추가 */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-800">
                    {readingBooks.length}권
                  </div>
                  <div className="text-sm text-gray-600">읽고 있는 책</div>
                </div>
              </div>
              
              <motion.button
                onClick={() => navigate('/reading')}
                className="px-4 py-2 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-xl text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                보기
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const AppRouter: React.FC = () => {
  const { user: authUser, signOut, loading } = useAuth();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [wishlistBooks, setWishlistBooks] = useState<WishlistBook[]>([]);
  const [wishlistIsbnList, setWishlistIsbnList] = useState<string[]>([]);
  const [readingBooks, setReadingBooks] = useState<ReadingBook[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // AuthContext의 user를 프로젝트 User 타입으로 변환 (메모이제이션으로 무한루프 방지)
  const user: User | null = useMemo(() => {
    return authUser ? {
      id: authUser.id,
      name: authUser.user_metadata?.name || authUser.email || '사용자',
      email: authUser.email || '',
      avatar: authUser.user_metadata?.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`
    } : null;
  }, [authUser]);

  // 리뷰 로딩 함수
  const loadReviews = useCallback(async () => {
    if (!user) return;

    try {
      // 현재 사용자의 리뷰만 가져오기
      const { data: reviewsData, error } = await reviewsApi.getReviews(user.id);
      
      if (error) {
        console.error('❌ 리뷰 로딩 실패:', error);
        return;
      }

      if (reviewsData && reviewsData.length > 0) {
        // 데이터베이스 리뷰를 ReviewData 형식으로 변환
        const formattedReviews: ReviewData[] = reviewsData.map(review => ({
          id: review.id,
          bookId: review.isbn13,
          review: review.memo || '',
          memo: review.memo || undefined, // 🆕 메모 필드를 별도로 전달
          emotions: review.emotions ? review.emotions.map((e: { emotion: string }) => e.emotion) : [],
          topics: review.topics ? review.topics.map((t: { keyword: string }) => t.keyword) : [],
          moodSummary: review.memo ? review.memo.substring(0, 100) + '...' : 'AI 분석 결과',
          createdAt: new Date(review.created_at),
          moodCardUrl: `/mood-cards/${review.id}`
        }));

        setReviews(formattedReviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('❌ 리뷰 로딩 예외:', error);
    }
  }, [user]);

  // 위시리스트 로딩 함수
  const loadWishlistBooks = useCallback(async () => {
    if (!user) return;

    try {
      const { data: libraryItems } = await libraryApi.getWishlist(user.id);
      
      if (libraryItems) {
        // 위시리스트 ISBN 목록 업데이트
        const isbnList = libraryItems.map(item => item.isbn13);
        setWishlistIsbnList(isbnList);
        
        // WishlistBook 타입으로 변환 (기존 호환성 유지)
        const wishlist = libraryItems
          .filter(item => item.book) // book 정보가 있는 것만
          .map(item => ({
            id: item.book!.isbn13,
            title: item.book!.title,
            author: item.book!.author || '작가 미상',
            cover: item.book!.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
            description: item.book!.summary || '',
            rating: item.book!.customer_review_rank ? item.book!.customer_review_rank / 10 : undefined,
            publishedYear: item.book!.pub_date ? new Date(item.book!.pub_date).getFullYear().toString() : undefined,
            genre: item.book!.category_name,
            addedAt: new Date(item.created_at),
            priority: 'medium' as const,
            tags: [],
            notes: item.note || ''
          }));
        
        setWishlistBooks(wishlist);
      }
    } catch (error) {
      console.error('위시리스트 로딩 실패:', error);
    }
  }, [user]);

  // 읽고 있는 책 로딩 함수
  const loadReadingBooks = useCallback(async () => {
    if (!user) return;

    try {
      const { data: libraryItems } = await libraryApi.getCurrentlyReading(user.id);
      
      if (libraryItems) {
        // ReadingBook 타입으로 변환
        const readingList = libraryItems
          .filter(item => item.book) // book 정보가 있는 것만
          .map(item => {
            const totalPages = item.book!.page_count || 280; // 🔄 일단 280으로 박아넣기
            return {
              id: item.book!.isbn13,
              title: item.book!.title,
              author: item.book!.author || '작가 미상',
              cover: item.book!.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
              description: item.book!.summary || '',
              rating: item.book!.customer_review_rank ? item.book!.customer_review_rank / 10 : undefined,
              publishedYear: item.book!.pub_date ? new Date(item.book!.pub_date).getFullYear().toString() : undefined,
              genre: item.book!.category_name,
              pages: totalPages, // 🆕 실제 페이지 수
              progress: item.progress || 0,
              startedAt: new Date(item.started_at || item.created_at),
              lastReadAt: new Date(item.updated_at),
              notes: item.note || '',
              status: item.shelf_status === 'paused' ? 'paused' as const : 'reading' as const,
              currentPage: Math.round((item.progress || 0) * totalPages / 100), // 🆕 실제 페이지 수 기반 계산
              totalPages // 🆕 실제 페이지 수
            };
          });
        
        setReadingBooks(readingList);
      }
    } catch (error) {
      console.error('읽고 있는 책 로딩 실패:', error);
    }
  }, [user]);

  // 초기 데이터 로딩
  useEffect(() => {
    loadWishlistBooks();
    loadReadingBooks();
    loadReviews(); // 리뷰도 함께 로드
  }, [loadWishlistBooks, loadReadingBooks, loadReviews]);

  // 현재 경로에 따른 뷰 타입 결정
  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/') return 'home'; // 홈은 메뉴에 없지만 내부적으로는 유지
    if (path.startsWith('/search')) return 'search';
    if (path.startsWith('/archive') || path.startsWith('/mood-cards')) return 'archive';
    if (path.startsWith('/wishlist')) return 'wishlist';
    if (path.startsWith('/settings')) return 'settings';
    if (path.startsWith('/books') && path.includes('/stats')) return 'emotion-stats';
    if (path.startsWith('/books') && path.includes('/progress')) return 'reading-progress';
    if (path.startsWith('/supabase-test')) return 'settings'; // 테스트 페이지는 설정으로 분류
    return 'home'; // 기본값
  };

  // Mock data for demonstration
  // mock 데이터 제거 - 실제 데이터베이스에서만 불러옴

  const handleViewChange = (view: string) => {
    navigate(`/${view === 'home' ? '' : view}`);
  };

  const handleDeleteReview = useCallback(async (reviewId: string) => {
    if (!user?.id) {
      console.error('❌ 사용자가 인증되지 않음');
      return;
    }

    try {
      console.log('🗑️ 리뷰 삭제 중:', reviewId);
      const { error } = await reviewsApi.deleteReview(reviewId);
      
      if (error) {
        console.error('❌ 리뷰 삭제 실패:', error);
        throw error;
      }

      console.log('✅ 리뷰 삭제 성공:', reviewId);
      // 리뷰 목록 새로고침
      loadReviews();
    } catch (error) {
      console.error('❌ 리뷰 삭제 실패:', error);
      alert(`리뷰 삭제 실패: ${error}`);
    }
  }, [user?.id, loadReviews]);

  const handleMoodCardSelect = (review: ReviewData) => {
    navigate(`/mood-cards/${review.id}`);
  };

  const handleBookStatsSelect = (book: BookExternal) => {
    navigate(`/books/${book.isbn13}/stats`);
  };

  const handleStartReading = async (book: BookData | BookExternal) => {
    if (!user) {
      console.error('❌ 사용자가 인증되지 않음');
      return;
    }

    const bookIsbn = 'id' in book ? book.id : book.isbn13;
    
    try {
      
      // 먼저 책 정보가 데이터베이스에 있는지 확인하고 없으면 저장
      const { data: existingBook } = await booksApi.getBookByIsbn(bookIsbn);
      if (!existingBook) {
        const bookToSave = 'id' in book ? {
          isbn13: book.id,
          title: book.title,
          author: book.author,
          cover_url: book.cover,
          summary: book.description,
          // 기타 필드들 매핑
        } as BookExternal : book;
        
        const { error: saveBookError } = await booksApi.saveBook(bookToSave);
        if (saveBookError) {
          console.error('❌ 책 정보 저장 실패:', saveBookError);
        }
      }
      
      // 기존 라이브러리 아이템 확인 (진행 상태 보존을 위해)
      const { data: existingLibraryItem } = await libraryApi.getLibraryItemByIsbn(bookIsbn, user.id);
      
      // 기존 진행 상태 보존하면서 읽기 시작
      const libraryData = {
        isbn13: bookIsbn,
        is_wishlist: false, // 📚 읽기 시작하면 위시리스트에서 실제 읽기로 변경
        shelf_status: 'reading' as const,
        progress: existingLibraryItem && !existingLibraryItem.is_wishlist 
          ? existingLibraryItem.progress // 기존 진행률 보존
          : 0, // 새로 시작하거나 찜목록에서 온 경우만 0
        started_at: existingLibraryItem?.started_at 
          ? existingLibraryItem.started_at 
          : new Date().toISOString().split('T')[0],
        note: existingLibraryItem?.note // 기존 노트도 보존
      };
      
      const { data: libraryResult, error: libraryError } = await libraryApi.addLibraryItem(libraryData);
      
      if (libraryError) {
        console.error('❌ 읽기 시작 데이터 저장 실패:', libraryError);
        throw libraryError;
      }
      
      
      // 읽고 있는 책 목록 새로고침
      loadReadingBooks();
      
      // 진행 페이지로 이동
      navigate(`/books/${bookIsbn}/progress`);
    } catch (error) {
      console.error('❌ 읽기 시작 처리 실패:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`읽기 시작 실패: ${errorMessage}`);
    }
  };

  const handleCompleteBook = (book: BookData | BookExternal) => {
    const bookId = 'id' in book ? book.id : book.isbn13;
    // 읽고 있는 책 목록 새로고침
    loadReadingBooks();
  };

  const handleProgressUpdate = (book: BookExternal, progress: number) => {
    // 읽고 있는 책 목록 새로고침
    loadReadingBooks();
  };

  const handleWishlistToggle = async (book: BookExternal) => {
    if (!user) {
      console.error('❌ 사용자가 인증되지 않음');
      return;
    }

    console.log('🔄 위시리스트 토글 시작:', {
      user: user.id,
      book: book.title,
      isbn: book.isbn13
    });

    try {
      // 현재 위시리스트에 있는지 확인
      console.log('📖 기존 위시리스트 확인 중...');
      const { data: existingItem, error: checkError } = await libraryApi.getLibraryItemByIsbn(book.isbn13, user.id);
      
      if (checkError) {
        console.error('❌ 기존 항목 확인 실패:', checkError);
      }

      if (existingItem && existingItem.is_wishlist) {
        // 위시리스트에서 제거
        await libraryApi.removeFromLibrary(existingItem.id);
        console.log(`📚 위시리스트에서 제거됨: ${book.title}`);
        
        // 로컬 상태에서 즉시 제거 (무한루프 방지)
        setWishlistIsbnList(prev => prev.filter(isbn => isbn !== book.isbn13));
        setWishlistBooks(prev => prev.filter(b => b.id !== book.isbn13));
      } else {
        // 📚 찜하기 전에 책 정보가 있는지 확인하고 없으면 저장
        console.log('📚 책 정보 확인 중...');
        const { data: existingBook } = await booksApi.getBookByIsbn(book.isbn13);
        if (!existingBook) {
          console.log('💾 책 정보 저장 중...');
          const { data: savedBook, error: saveBookError } = await booksApi.saveBook(book);
                  if (saveBookError) {
          console.error('❌ 책 정보 저장 실패:', saveBookError);
          const errorMessage = saveBookError instanceof Error ? saveBookError.message : String(saveBookError);
          throw new Error(`책 정보 저장 실패: ${errorMessage}`);
        } else {
            console.log('✅ 책 정보 저장 성공:', savedBook?.title);
          }
        } else {
          console.log('✅ 책 정보 이미 존재:', existingBook.title);
        }
        
        // 위시리스트에 추가
        console.log('❤️ 위시리스트에 추가 시도...', {
          isbn13: book.isbn13,
          is_wishlist: true,
          user_id: user.id
        });
        
        const { data: addResult, error: addError } = await libraryApi.addLibraryItem({
          isbn13: book.isbn13,
          is_wishlist: true, // 🆕 위시리스트로 설정
          // shelf_status, progress 등은 자동으로 null/0으로 설정됨
        });
        
        if (addError) {
          console.error('❌ 위시리스트 추가 실패:', addError);
          throw addError;
        }
        
        console.log('✅ 위시리스트 추가 성공:', addResult);
        console.log(`❤️ 위시리스트에 추가됨: ${book.title}`);
        
        // 로컬 상태에서 즉시 추가 (무한루프 방지)
        setWishlistIsbnList(prev => [...prev, book.isbn13]);
        setWishlistBooks(prev => [...prev, {
          id: book.isbn13,
          title: book.title,
          author: book.author || '작가 미상',
          cover: book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
          description: book.summary || '',
          rating: book.customer_review_rank ? book.customer_review_rank / 10 : undefined,
          publishedYear: book.pub_date ? new Date(book.pub_date).getFullYear().toString() : undefined,
          genre: book.category_name,
          addedAt: new Date(),
          priority: 'medium' as const,
          tags: [],
          notes: ''
        }]);
      }
    } catch (error) {
      console.error('❌ 위시리스트 토글 실패:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`위시리스트 저장 실패: ${errorMessage}`);
      // 실패시에만 다시 로드
      loadWishlistBooks();
    }
  };

  const handleReviewSubmit = async (bookData: BookExternal, reviewText: string, selectedEmotions: string[]) => {
    if (!user?.id) {
      console.error('❌ 사용자가 인증되지 않음');
      alert('로그인이 필요합니다.');
      return;
    }

    console.log('👤 리뷰 제출 사용자:', { userId: user.id, email: user.email });
    console.log('📚 책 정보:', { isbn13: bookData.isbn13, title: bookData.title });
    console.log('📝 리뷰 내용:', { length: reviewText.length, preview: reviewText.substring(0, 50) });
    console.log('😊 선택된 감정:', selectedEmotions);

    try {
      // 🔍 중복 감상문 체크
      console.log('🔍 중복 감상문 체크 중...');
      const { data: existingReview, error: checkError } = await reviewsApi.getReviewByUserAndIsbn(user.id, bookData.isbn13);
      
      if (checkError) {
        console.error('❌ 중복 체크 실패:', checkError);
        alert('기존 감상문 확인 중 오류가 발생했습니다.');
        return;
      }
      
      if (existingReview) {
        console.log('⚠️ 이미 이 책에 대한 감상문이 존재합니다:', existingReview);
        alert('⚠️ 이미 이 책에 대한 감상문을 작성하셨습니다.\n하나의 책에는 하나의 감상문만 작성할 수 있습니다.');
        navigate('/archive');
        return;
      }
      
      console.log('✅ 중복 체크 통과 - 새 감상문 작성 가능');

      console.log('📝 독후감 제출 중:', { 
        bookTitle: bookData.title, 
        reviewLength: reviewText.length, 
        emotionsCount: selectedEmotions.length
      });

      // 🤖 향상된 로컬 감성 분석 (OpenAI API 사용량 한도로 인해 일시적으로 비활성화)
      console.log('🏠 향상된 로컬 키워드 기반 감성 분석 사용');
      
      let aiAnalysis;
      
      try {
        // 강화된 로컬 분석 함수 호출
        aiAnalysis = analyzeEmotionsWithEnhancedAI(reviewText, selectedEmotions, bookData.summary, bookData.title);
        
        console.log('✅ 향상된 로컬 감성 분석 완료');
        
      } catch (localError) {
        console.error('❌ 로컬 분석 실패:', localError);
        // 최강 fallback - 절대 실패하지 않음
        aiAnalysis = createSafeAnalysisFallback(reviewText, selectedEmotions, bookData.title);
      }
      
      // 📊 콘솔에 AI 분석 결과 출력
      console.log('🤖 AI 감성 분석 결과:', {
        '사용자 선택 감정': selectedEmotions,
        '책 줄거리 감정': aiAnalysis.bookEmotions || [],
        '최종 감정 목록': aiAnalysis.dominantEmotions,
        '감정 점수': aiAnalysis.analysisScore,
        '무드 요약': aiAnalysis.moodSummary
      });
      
      // 📊 무드 카드 생성 데이터
      const moodCardData = {
        bookId: bookData.isbn13,
        bookTitle: bookData.title,
        bookAuthor: bookData.author || '작가 미상',
        bookCover: bookData.cover_url,
        reviewText: reviewText,
        selectedEmotions: selectedEmotions,
        aiAnalysis: aiAnalysis,
        createdAt: new Date().toISOString()
      };

      // 🔥 실제 데이터베이스 저장 (리뷰 API 호출)
      const reviewData: CreateReviewInput = {
        isbn13: bookData.isbn13,
        user_id: user.id, // 사용자 ID 추가
        memo: reviewText,
        emotions: [...selectedEmotions, ...(Array.isArray(aiAnalysis.dominantEmotions) ? aiAnalysis.dominantEmotions : []), ...(Array.isArray(aiAnalysis.bookEmotions) ? aiAnalysis.bookEmotions : [])], // 배열로 전달
        topics: Array.isArray(aiAnalysis.topics) ? aiAnalysis.topics : [], // 주제 데이터 추가
        mood_summary: aiAnalysis.moodSummary,
        rating: aiAnalysis.overallRating
      };

      const reviewResult = await reviewsApi.createReview(reviewData);

      if (reviewResult.error) {
        const errorMsg = reviewResult.error instanceof Error ? reviewResult.error.message : String(reviewResult.error);
        console.error('💀 데이터베이스 저장 실패:', reviewResult.error);
        
        // 사용자 친화적인 에러 메시지
        if (errorMsg.includes('권한') || errorMsg.includes('row-level security')) {
          throw new Error('리뷰 작성 권한이 없습니다. 다시 로그인해보세요.');
        } else if (errorMsg.includes('foreign key') || errorMsg.includes('isbn13')) {
          throw new Error('책 정보를 찾을 수 없습니다. 다른 책을 선택해주세요.');
        }
        
        throw new Error('데이터베이스 저장 실패: ' + errorMsg);
      }

      // 🎉 성공 처리
      const newReview: ReviewData = {
        id: reviewResult.data?.id || Date.now().toString(),
        bookId: bookData.isbn13,
        review: reviewText,
        emotions: aiAnalysis.dominantEmotions,
        topics: aiAnalysis.topics,
        moodSummary: aiAnalysis.moodSummary,
        createdAt: new Date(),
        moodCardUrl: `/mood-cards/${reviewResult.data?.id || Date.now()}`
      };

      setReviews(prev => [...prev, newReview]);
      
      console.log('✅ 독후감 및 무드 카드 생성 완료!');
      
      // 리뷰 목록 새로고침 (데이터베이스에서 최신 데이터 가져오기)
      await loadReviews();
      
      // 성공 메시지
      alert('🎉 감상문이 성공적으로 저장되었습니다!');
      navigate('/archive');

    } catch (error) {
      console.error('❌ 독후감 제출 실패:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`감상문 저장 실패: ${errorMessage}\n\n문제가 지속되면 다시 로그인해보세요.`);
    }
  };

  // 📚 책 줄거리 AI 감성 분석 함수
  const analyzeBookSummaryEmotions = (summary: string): string[] => {
    if (!summary || summary.length < 20) return [];
    
    const emotionPatterns = {
      '기쁨': ['행복', '즐거', '웃음', '축하', '성공', '사랑', '따뜻', '밝은', '희망', '꿈', '승리', '친구'],
      '슬픔': ['눈물', '이별', '죽음', '상실', '그리움', '아픔', '슬프', '우울', '고독', '외로', '헤어짐', '상처'],
      '분노': ['화나', '복수', '분노', '싸움', '갈등', '적', '배신', '불공정', '억울', '증오', '격노', '항의'],
      '두려움': ['무서', '공포', '불안', '걱정', '위험', '두려', '놀란', '긴장', '스릴러', '미스터리', '어둠', '괴물'],
      '놀라움': ['놀라', '신기', '충격', '반전', '의외', '깜짝', '예상치 못한', '기적', '발견', '비밀', '진실', '놀라운'],
      '혐오': ['역겨', '싫어', '거부', '배척', '멸시', '불쾌', '짜증', '답답', '모순', '위선', '거짓', '배반'],
      '기대': ['기대', '희망', '소망', '꿈꾸', '열망', '바람', '미래', '계획', '목표', '성장', '변화', '새로운'],
      '신뢰': ['믿음', '의지', '확신', '안정', '평온', '위안', '든든', '신뢰', '지지', '보호', '사랑', '가족']
    };
    
    const detectedEmotions: string[] = [];
    const lowerSummary = summary.toLowerCase();
    
    Object.entries(emotionPatterns).forEach(([emotion, keywords]) => {
      const matchCount = keywords.filter(keyword => 
        lowerSummary.includes(keyword) || summary.includes(keyword)
      ).length;
      
      if (matchCount >= 1) { // 키워드가 1개 이상 매칭되면 해당 감정 추가
        detectedEmotions.push(emotion);
      }
    });
    
    return detectedEmotions;
  };

  // 🔥 절대 실패하지 않는 안전한 폴백 분석
  const createSafeAnalysisFallback = (reviewText: string, selectedEmotions: string[], bookTitle: string) => {
    console.log('🛡️ 안전한 폴백 분석 실행');
    
    const reviewWords = reviewText.toLowerCase();
    const emotions = selectedEmotions.length > 0 ? selectedEmotions : ['성찰', '호기심'];
    
    // 기본적인 감정 분석
    let sentiment = 'neutral';
    let rating = 3.0;
    
    const positiveWords = ['좋', '훌륭', '감동', '재미', '흥미', '사랑', '행복', '즐거', '만족'];
    const negativeWords = ['아쉬', '지루', '실망', '어려', '복잡', '슬프', '우울'];
    
    const positiveCount = positiveWords.filter(word => reviewWords.includes(word)).length;
    const negativeCount = negativeWords.filter(word => reviewWords.includes(word)).length;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      rating = 3.5 + (positiveCount * 0.3);
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';  
      rating = 2.5 - (negativeCount * 0.2);
    }
    
    rating = Math.min(5.0, Math.max(1.0, rating));
    
    return {
      dominantEmotions: emotions,
      bookEmotions: [],
      topics: ['독서', '감상'],
      moodSummary: `${bookTitle}을(를) 통해 의미있는 독서 경험을 하셨네요. 글에서 ${sentiment === 'positive' ? '긍정적인' : sentiment === 'negative' ? '아쉬운' : '차분한'} 마음이 느껴집니다.`,
      overallRating: rating,
      analysisScore: 0.7
    };
  };

  // 🚀 향상된 로컬 감정 분석 (OpenAI 대체)
  const analyzeEmotionsWithEnhancedAI = (reviewText: string, selectedEmotions: string[], bookSummary: string = '', bookTitle: string = '') => {
    console.log('🔍 향상된 로컬 감성 분석 시작');
    
    // 1. 리뷰 텍스트 감정 분석
    const reviewEmotions = analyzeReviewEmotions(reviewText);
    
    // 2. 책 줄거리 감정 분석  
    const bookEmotions = bookSummary ? analyzeBookSummaryEmotions(bookSummary) : [];
    
    // 3. 종합 감정 계산
    const allEmotions = [...selectedEmotions, ...reviewEmotions.emotions, ...bookEmotions];
    const uniqueEmotions = [...new Set(allEmotions)].slice(0, 5); // 중복 제거, 최대 5개
    
    // 4. 감정 점수 계산
    const emotionScores: Record<string, number> = {};
    uniqueEmotions.forEach(emotion => {
      emotionScores[emotion] = 0.6 + (Math.random() * 0.4); // 0.6-1.0 점수
    });
    
    // 5. 무드 요약 생성
    const moodSummary = generatePersonalizedMoodSummary(
      bookTitle, 
      uniqueEmotions, 
      reviewEmotions.sentiment,
      reviewText.length
    );
    
    // 6. 전체 평점 계산
    const rating = calculateOverallRating(reviewEmotions.sentiment, reviewText.length, uniqueEmotions.length);
    
    return {
      dominantEmotions: uniqueEmotions,
      emotionScores: emotionScores,
      bookEmotions: bookEmotions,
      topics: extractTopics(reviewText, bookSummary),
      moodSummary: moodSummary,
      overallRating: rating,
      analysisScore: 0.8,
      sentiment: reviewEmotions.sentiment
    };
  };

  // 📝 리뷰 텍스트 감정 분석
  const analyzeReviewEmotions = (reviewText: string) => {
    const text = reviewText.toLowerCase();
    
    const emotionKeywords = {
      '감동': ['감동', '울었', '눈물', '마음', '느끼', '울림'],
      '성찰': ['생각', '깨달', '성찰', '반성', '고민', '깊이'],
      '기쁨': ['기쁘', '즐거', '좋았', '행복', '만족', '웃음'],
      '슬픔': ['슬프', '아프', '아쉽', '안타깝', '마음아픈'],
      '호기심': ['궁금', '흥미', '관심', '알고싶', '재미있'],
      '놀라움': ['놀라', '충격', '예상못한', '뜻밖', '신기'],
      '희망': ['희망', '용기', '힘', '격려', '응원'],
      '사랑': ['사랑', '애정', '정', '따뜻', '포근'],
      '성장': ['성장', '변화', '발전', '배움', '깨우침'],
      '그리움': ['그리워', '그립', '추억', '향수', '옛날']
    };
    
    const foundEmotions: string[] = [];
    let positiveScore = 0;
    let negativeScore = 0;
    
    // 감정 키워드 매칭
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        foundEmotions.push(emotion);
      }
    });
    
    // 감정 점수 계산
    const positiveWords = ['좋', '훌륭', '감동', '재미', '흥미', '사랑', '행복', '즐거', '만족', '완벽', '최고'];
    const negativeWords = ['아쉬', '지루', '실망', '어려', '복잡', '슬프', '우울', '답답', '싫', '별로'];
    
    positiveWords.forEach(word => {
      if (text.includes(word)) positiveScore++;
    });
    
    negativeWords.forEach(word => {
      if (text.includes(word)) negativeScore++;
    });
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (positiveScore > negativeScore + 1) sentiment = 'positive';
    else if (negativeScore > positiveScore + 1) sentiment = 'negative';
    
    return {
      emotions: foundEmotions.length > 0 ? foundEmotions : ['성찰', '호기심'],
      sentiment: sentiment,
      positiveScore: positiveScore,
      negativeScore: negativeScore
    };
  };

  // 📚 개인화된 무드 요약 생성
  const generatePersonalizedMoodSummary = (bookTitle: string, emotions: string[], sentiment: string, reviewLength: number) => {
    const emotionText = emotions.slice(0, 3).join(', ');
    const bookName = bookTitle ? `《${bookTitle}》` : '이 책';
    
    let intensityText = '';
    if (reviewLength > 200) intensityText = '깊이 있게 ';
    else if (reviewLength > 100) intensityText = '차분히 ';
    else intensityText = '간결하게 ';
    
    let sentimentText = '';
    if (sentiment === 'positive') {
      sentimentText = '만족스러운 독서 경험을 하신 것 같아요. ';
    } else if (sentiment === 'negative') {
      sentimentText = '아쉬움이 남는 독서였지만 나름의 의미가 있었을 거예요. ';
    } else {
      sentimentText = '복합적인 감정으로 책을 읽으셨네요. ';
    }
    
    return `${bookName}을 읽으시면서 ${emotionText} 등의 감정을 ${intensityText}느끼셨군요. ${sentimentText}이런 솔직한 감상이 앞으로의 독서에도 큰 도움이 될 것 같아요.`;
  };

  // 📊 전체 평점 계산
  const calculateOverallRating = (sentiment: string, reviewLength: number, emotionCount: number) => {
    let rating = 3.0;
    
    // 감정 기반 점수
    if (sentiment === 'positive') rating += 0.8;
    else if (sentiment === 'negative') rating -= 0.5;
    
    // 리뷰 길이 기반 점수 (더 자세한 리뷰 = 더 몰입)
    if (reviewLength > 300) rating += 0.4;
    else if (reviewLength > 150) rating += 0.2;
    else if (reviewLength < 50) rating -= 0.3;
    
    // 감정 다양성 기반 점수
    if (emotionCount >= 4) rating += 0.3;
    else if (emotionCount >= 2) rating += 0.1;
    
    return Math.min(5.0, Math.max(1.0, Number(rating.toFixed(1))));
  };

  // 🏷️ 주제 추출
  const extractTopics = (reviewText: string, bookSummary: string = '') => {
    const text = (reviewText + ' ' + bookSummary).toLowerCase();
    
    const topicKeywords = {
      '사랑': ['사랑', '연애', '로맨스', '결혼', '가족'],
      '성장': ['성장', '배움', '깨달음', '변화', '발전'],
      '인간관계': ['친구', '가족', '동료', '관계', '소통'],
      '자아실현': ['꿈', '목표', '성공', '실현', '도전'],
      '갈등': ['갈등', '문제', '어려움', '고민', '선택'],
      '모험': ['모험', '여행', '탐험', '발견', '경험'],
      '역사': ['역사', '과거', '전통', '문화', '시대'],
      '미래': ['미래', '과학', '기술', '예측', '발전']
    };
    
    const foundTopics: string[] = [];
    
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        foundTopics.push(topic);
      }
    });
    
    return foundTopics.length > 0 ? foundTopics : ['독서', '감상'];
  };

  // 🤖 AI 감성 분석 함수 (사용자 리뷰 + 책 줄거리 종합 분석)
  const analyzeEmotionsWithAI = (reviewText: string, selectedEmotions: string[], bookSummary?: string) => {
    const textLength = reviewText.length;
    const emotionCount = selectedEmotions.length;
    
    // 감정 키워드 분석
    const positiveKeywords = ['좋', '훌륭', '감동', '재미', '흥미', '사랑', '행복', '즐거', '만족'];
    const negativeKeywords = ['아쉬', '지루', '실망', '어려', '복잡', '슬프', '우울', '화나'];
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    positiveKeywords.forEach(word => {
      if (reviewText.includes(word)) positiveScore++;
    });
    
    negativeKeywords.forEach(word => {
      if (reviewText.includes(word)) negativeScore++;
    });
    
    // AI 분석 결과 생성
    const overallRating = Math.min(5, Math.max(1, 
      3 + (positiveScore - negativeScore) * 0.5 + (emotionCount > 3 ? 0.5 : 0)
    ));
    
    // 📚 책 줄거리에서 감정 추출
    const bookEmotions = bookSummary ? analyzeBookSummaryEmotions(bookSummary) : [];
    
    // 🎭 사용자 선택 감정 + AI 추출 감정 + 책 줄거리 감정 합치기
    const allEmotions = [
      ...selectedEmotions,
      ...bookEmotions,
      ...(positiveScore > negativeScore ? ['영감받음', '만족감', '호기심'] : ['성찰', '진지함', '복잡함'])
    ];
    
    // 중복 제거하고 상위 5개만 선택
    const dominantEmotions = [...new Set(allEmotions)].slice(0, 5);
    
    const topics = extractTopics(reviewText);
    
    const moodSummary = generateMoodSummary(reviewText, dominantEmotions, overallRating);
    
    return {
      overallRating,
      dominantEmotions,
      bookEmotions, // 🆕 책에서 추출된 감정들
      topics,
      moodSummary,
      sentiment: positiveScore > negativeScore ? 'positive' : negativeScore > positiveScore ? 'negative' : 'neutral',
      analysisScore: Math.round((textLength / 100 + emotionCount + positiveScore + bookEmotions.length) * 10) / 10
    };
  };



  // 무드 요약 생성 함수
  const generateMoodSummary = (reviewText: string, emotions: string[], rating: number): string => {
    const summaries = [
      "이 책을 통해 깊은 감정적 여정을 경험하셨네요. 당신의 감상이 매우 진솔하게 느껴집니다.",
      "풍부한 감정 표현이 인상적입니다. 이 책이 당신에게 특별한 의미를 남긴 것 같아요.",
      "책에 대한 당신의 깊이 있는 성찰이 돋보입니다. 의미 있는 독서 경험이었던 것 같네요.",
      "감정적으로 몰입하여 읽으신 것이 느껴집니다. 이런 독서 경험은 오래 기억에 남을 거예요.",
      "당신만의 독특한 관점이 잘 드러난 감상입니다. 이 책이 새로운 시각을 제공해준 것 같네요."
    ];
    
    const randomIndex = Math.floor(Math.random() * summaries.length);
    return summaries[randomIndex];
  };

  // 리뷰 생성 함수 (reviewsApi 사용)
  const createReview = async (reviewData: {
    isbn13: string;
    user_id: string;
    memo: string;
    emotions: string[];
    mood_summary: string;
    rating: number;
  }) => {
    try {
              // reviews API를 사용하여 데이터베이스에 저장
        const result = await reviewsApi.createReview({
          isbn13: reviewData.isbn13,
          user_id: reviewData.user_id,
          memo: reviewData.memo,
          emotions: reviewData.emotions,
          mood_summary: reviewData.mood_summary,
          rating: reviewData.rating,
          read_date: new Date().toISOString().split('T')[0]
        });
      
      return result;
    } catch (error) {
      console.error('❌ 리뷰 생성 실패:', error);
      return { data: null, error: error };
    }
  };

  const handleLogin = (_provider: 'google' | 'apple' | 'email', _credentials?: {
    email: string;
    password: string;
  }) => {
    // 로그인은 이제 AuthContext에서 처리되므로 홈으로만 이동
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const currentReviews = reviews; // 데이터베이스에서 불러온 실제 데이터만 사용

  // 인증 상태 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <Routes>
      {/* Login Route */}
      <Route 
        path="/login" 
        element={
          user ? <Navigate to="/" replace /> : 
          <LoginPage 
            onLogin={handleLogin} 
            onSignUp={() => console.log('Sign up clicked')} 
          />
        } 
      />
      
      {/* Protected Routes */}
      <Route path="/*" element={
        <ProtectedRoute user={user}>
          <AppLayout 
            currentView={getCurrentView()} 
            onViewChange={handleViewChange} 
            user={user} 
            onLogout={handleLogout}
          >
            <AnimatePresence mode="wait">
              <Routes>
                {/* Home */}
                <Route path="/" element={
                  <HomePage 
                    user={user} 
                    wishlistBooks={wishlistBooks} 
                    readingBooks={readingBooks}
                    onViewChange={handleViewChange} 
                  />
                } />
                
                {/* Search Routes */}
                <Route path="/search" element={
                  <SearchPage onBack={() => navigate('/')} />
                } />
                
                <Route path="/search/results" element={
                  <SearchResultsPage 
                    onBack={() => navigate('/search')}
                    onWishlistToggle={handleWishlistToggle}
                    wishlistBooks={wishlistIsbnList}
                  />
                } />
                
                <Route path="/search/filter" element={
                  <EmotionFilterPage 
                    onBack={() => navigate('/search')}
                  />
                } />
                
                {/* Book Routes */}
                <Route path="/books/:bookId" element={
                              <BookDetailPage 
              onBack={() => navigate(-1)} 
              onWishlistToggle={handleWishlistToggle}
              onStartReading={handleStartReading}
              onViewEmotionStats={handleBookStatsSelect}
              onCompleteReading={handleCompleteBook}
              onUpdateProgress={handleProgressUpdate}
              wishlistBooks={wishlistIsbnList}
              user={user ? { id: user.id } : undefined}
            />
                } />
                
                <Route path="/books/:bookId/review" element={
                  <BookReviewPage 
                    onReviewSubmit={handleReviewSubmit}
                    onBack={() => navigate(-1)}
                  />
                } />
                
                <Route path="/books/:bookId/stats" element={
                  <EmotionStatsRoute />
                } />
                
                <Route path="/books/:bookId/progress" element={
                  <ReadingProgressRoute loadReadingBooks={loadReadingBooks} onReviewWrite={(isbn13: string) => navigate(`/books/${isbn13}/review`)} />
                } />
                
                {/* Archive & Library Routes */}
                <Route path="/archive" element={
                  <ArchiveDashboard 
                    reviews={currentReviews}
                    onMoodCardSelect={handleMoodCardSelect}
                    onBack={() => navigate('/')}
                    onDeleteReview={handleDeleteReview}
                  />
                } />
                
                <Route path="/mood-cards/:id" element={
                  <MoodCardDetailRoute reviews={currentReviews} />
                } />
                
                <Route path="/wishlist" element={
                  <NewWishlistManager 
                    onBack={() => navigate('/')}
                    onBookSelect={(book) => handleStartReading(book)}
                    wishlistBooks={wishlistBooks}
                    onWishlistUpdate={loadWishlistBooks}
                  />
                } />
                
                <Route path="/reading" element={
                  <CurrentlyReadingManager 
                    onBack={() => navigate('/')}
                    onBookSelect={(book) => navigate(`/books/${book.id}/progress`)}
                    readingBooks={readingBooks}
                    onReadingUpdate={loadReadingBooks}
                    user={user ? { id: user.id } : undefined}
                  />
                } />
                
                <Route path="/completed" element={
                  <CompletedBooksManager 
                    onBack={() => navigate('/')}
                    onBookSelect={(isbn13) => navigate(`/books/${isbn13}`)}
                    user={user ? { id: user.id } : undefined}
                  />
                } />
                
                {/* Settings */}
                <Route path="/settings" element={
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="min-h-screen"
                  >
                    <div className="px-4 md:px-0">
                      <h1 className="text-2xl font-bold text-gray-800 mb-8">설정</h1>
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <p className="text-gray-600">설정 패널 준비 중...</p>
                      </div>
                    </div>
                  </motion.div>
                } />
                
                {/* Supabase Test */}
                <Route path="/supabase-test" element={<SupabaseTest />} />
                

              </Routes>
            </AnimatePresence>
          </AppLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRouter; 