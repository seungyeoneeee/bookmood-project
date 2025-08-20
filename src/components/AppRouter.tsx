import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Heart, TrendingUp, User, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BookExternal } from '../types/database';
import * as booksApi from '../api/books';
import * as libraryApi from '../api/library';
import { aladinApi } from '../services/aladinApi';
import { ReadingBook } from './reading/CurrentlyReadingManager';

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

const ReadingProgressRoute: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>(); // 실제로는 ISBN13
  const navigate = useNavigate();
  const [bookData, setBookData] = useState<any>(null);
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
            pages: 300 // 기본값 (알라딘 API에 페이지 수 없음)
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
            setBookData({
              id: book.isbn13,
              title: book.title,
              author: book.author || '작가 미상',
              cover: book.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
              pages: 300 // 기본값
            });
          } else {
            // 3. 아무것도 없으면 기본값
            setBookData({
              id: bookId,
              title: 'ISBN: ' + bookId,
              author: '작가 미상',
              cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
              pages: 300
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
          pages: 300
        });
      }
      
      setIsLoading(false);
    };

    loadBookData();
  }, [bookId]);

  const handleProgressUpdate = async (isbn13: string, currentPage: number, totalPages: number, notes: any[]) => {
    if (!user) return;

    try {
      const progressPercentage = Math.round((currentPage / totalPages) * 100);
      const notesText = notes.map(note => `[${note.page}p] ${note.content}`).join('\n');
      
      // library_items 테이블에 진행 상태 실시간 저장/업데이트
      await libraryApi.addLibraryItem({
        isbn13: isbn13,
        shelf_status: progressPercentage === 100 ? 'completed' : 'reading',
        progress: progressPercentage,
        started_at: new Date().toISOString().split('T')[0],
        note: notesText || undefined
      });
      
      console.log(`📚 진행 상태 저장됨: ${progressPercentage}% (${currentPage}/${totalPages})`);
    } catch (error) {
      console.error('진행 상태 저장 실패:', error);
    }
  };

  const handleComplete = async (progress: any) => {
    if (!user || !bookId) return;

    try {
      // library_items 테이블에 독서 완료 기록 저장
      await libraryApi.addLibraryItem({
        isbn13: bookId,
        shelf_status: 'completed',
        progress: 100,
        finished_at: new Date().toISOString().split('T')[0],
        note: `총 ${progress.notes.length}개의 메모 작성`
      });
      
      console.log('독서 완료 기록이 저장되었습니다!');
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
    />
  );
};

const HomePage: React.FC<{ 
  user: User | null; 
  wishlistBooks: WishlistBook[]; 
  onViewChange: (view: string) => void 
}> = ({ user, wishlistBooks, onViewChange }) => {
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
      className="min-h-screen px-4 py-8 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
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

      <div className="max-w-md mx-auto relative z-10">
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
          <div className="grid grid-cols-3 gap-6">
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
        console.log(`📚 위시리스트 로딩 완료: ${wishlist.length}권`);
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
          .map(item => ({
            id: item.book!.isbn13,
            title: item.book!.title,
            author: item.book!.author || '작가 미상',
            cover: item.book!.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
            description: item.book!.summary || '',
            rating: item.book!.customer_review_rank ? item.book!.customer_review_rank / 10 : undefined,
            publishedYear: item.book!.pub_date ? new Date(item.book!.pub_date).getFullYear().toString() : undefined,
            genre: item.book!.category_name,
            pages: 300, // 기본값 (알라딘 API에 페이지 수 없음)
            progress: item.progress || 0,
            startedAt: new Date(item.started_at || item.created_at),
            lastReadAt: new Date(item.updated_at),
            notes: item.note || '',
            status: item.shelf_status === 'paused' ? 'paused' as const : 'reading' as const,
            currentPage: Math.floor((item.progress || 0) * 3), // 임시 계산
            totalPages: 300 // 기본값
          }));
        
        setReadingBooks(readingList);
        console.log(`📖 읽고 있는 책 로딩 완료: ${readingList.length}권`);
      }
    } catch (error) {
      console.error('읽고 있는 책 로딩 실패:', error);
    }
  }, [user]);

  // 초기 데이터 로딩
  useEffect(() => {
    loadWishlistBooks();
    loadReadingBooks();
  }, [loadWishlistBooks, loadReadingBooks]);

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
  const mockReviews: ReviewData[] = [
    {
      id: '1',
      bookId: '1',
      review: 'This book made me feel deeply contemplative about life and relationships.',
      emotions: ['contemplative', 'melancholic', 'hopeful'],
      topics: ['relationships', 'philosophy', 'growth'],
      moodSummary: 'A profound journey through human connections that left you feeling both introspective and optimistic about the future.',
      createdAt: new Date('2024-01-15'),
      moodCardUrl: '/api/mood-cards/1'
    },
    {
      id: '2',
      bookId: '2',
      review: 'An exhilarating adventure that kept me on the edge of my seat!',
      emotions: ['excited', 'anxious', 'thrilled'],
      topics: ['adventure', 'mystery', 'suspense'],
      moodSummary: 'A heart-pounding experience that awakened your sense of adventure and left you craving more excitement.',
      createdAt: new Date('2024-01-20'),
      moodCardUrl: '/api/mood-cards/2'
    }
  ];

  const handleViewChange = (view: string) => {
    navigate(`/${view === 'home' ? '' : view}`);
  };

  const handleMoodCardSelect = (review: ReviewData) => {
    navigate(`/mood-cards/${review.id}`);
  };

  const handleBookStatsSelect = (book: BookExternal) => {
    navigate(`/books/${book.isbn13}/stats`);
  };

  const handleStartReading = (book: BookData | BookExternal) => {
    // BookData는 id를, BookExternal은 isbn13을 사용
    const bookIdentifier = 'id' in book ? book.id : book.isbn13;
    navigate(`/books/${bookIdentifier}/progress`);
  };

  const handleCompleteBook = (book: BookData | BookExternal) => {
    const bookId = 'id' in book ? book.id : book.isbn13;
    setLibraryBooks(prev => prev.map(b => 
      b.id === bookId 
        ? { ...b, shelf_status: 'completed', finished_at: new Date() }
        : b
    ));
    console.log('Book completed:', bookId);
  };

  const handleProgressUpdate = (book: BookExternal, progress: number) => {
    setLibraryBooks(prev => prev.map(b => 
      b.id === book.isbn13 
        ? { ...b, progress: progress }
        : b
    ));
    console.log('Progress updated:', book.isbn13, progress);
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
            throw new Error(`책 정보 저장 실패: ${saveBookError.message || saveBookError}`);
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
      alert(`위시리스트 저장 실패: ${error.message || error}`);
      // 실패시에만 다시 로드
      loadWishlistBooks();
    }
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
    navigate('/archive');
  };

  const handleLogin = (provider: 'google' | 'apple' | 'email', credentials?: {
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

  const currentReviews = reviews.length > 0 ? reviews : mockReviews;

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
              user={user}
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
                  <ReadingProgressRoute />
                } />
                
                {/* Archive & Library Routes */}
                <Route path="/archive" element={
                  <ArchiveDashboard 
                    reviews={currentReviews}
                    onMoodCardSelect={handleMoodCardSelect}
                    onBack={() => navigate('/')}
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
                  />
                } />
                
                {/* Settings */}
                <Route path="/settings" element={
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="min-h-screen p-4"
                  >
                    <div className="max-w-sm mx-auto pt-8">
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