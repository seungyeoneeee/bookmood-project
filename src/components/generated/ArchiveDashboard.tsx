import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Heart, Tag, TrendingUp, Filter, Grid, List, Download, Share2, BarChart3, BookOpen, Bookmark, MoreHorizontal, FileText, Image, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { exportToPNG, exportToMarkdown, createExportableCard, ExportableReview } from '../../lib/exportUtils';

interface ReviewData {
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

interface ArchiveDashboardProps {
  reviews: ReviewData[];
  onMoodCardSelect: (review: ReviewData) => void;
  onBack: () => void;
  onDeleteReview?: (reviewId: string) => void;
}

type ViewMode = 'grid' | 'timeline';
type FilterType = 'all' | 'month' | 'emotion' | 'topic';

const ArchiveDashboard: React.FC<ArchiveDashboardProps> = ({
  reviews,
  onMoodCardSelect,
  onBack,
  onDeleteReview
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [showDropdownMenu, setShowDropdownMenu] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Process data for visualizations
  const chartData = useMemo(() => {
    const monthlyData = reviews.reduce((acc, review) => {
      const month = review.createdAt.toLocaleDateString('ko-KR', {
        month: 'short'
      });
      if (!acc[month]) {
        acc[month] = {
          month,
          count: 0,
          emotions: {}
        };
      }
      acc[month].count++;
      review.emotions.forEach(emotion => {
        acc[month].emotions[emotion] = (acc[month].emotions[emotion] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, any>);
    return Object.values(monthlyData);
  }, [reviews]);

  const emotionData = useMemo(() => {
    const emotions = reviews.flatMap(r => r.emotions);
    const emotionCounts = emotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(emotionCounts).map(([emotion, count]) => ({
      emotion,
      count
    })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [reviews]);

  const topicData = useMemo(() => {
    const topics = reviews.flatMap(r => r.topics);
    const topicCounts = topics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(topicCounts).map(([topic, count]) => ({
      topic,
      count
    })).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (filterType === 'all' || !selectedFilter) return reviews;
    return reviews.filter(review => {
      switch (filterType) {
        case 'month':
          const reviewMonth = review.createdAt.toLocaleDateString('ko-KR', {
            month: 'short'
          });
          return reviewMonth === selectedFilter;
        case 'emotion':
          return review.emotions.includes(selectedFilter);
        case 'topic':
          return review.topics.includes(selectedFilter);
        default:
          return true;
      }
    });
  }, [reviews, filterType, selectedFilter]);

  // Download functions
  const handleDownloadPNG = async (review: ReviewData) => {
    setIsExporting(true);
    setShowDropdownMenu(null); // 메뉴를 먼저 닫기
    try {
      const cardElement = cardRefs.current[review.id];
      if (cardElement) {
        // 기존 카드를 PNG로 저장
        const filename = `BookMood_${review.bookId}_${review.createdAt.toISOString().split('T')[0]}`;
        await exportToPNG(cardElement, filename);
      } else {
        // 카드가 없으면 새로 생성해서 저장
        const exportableReview: ExportableReview = {
          ...review,
          bookTitle: `책 ${review.bookId}`, // TODO: 실제 책 제목 가져오기
          bookAuthor: '저자 정보 없음', // TODO: 실제 저자 정보 가져오기
        };
        const tempCard = createExportableCard(exportableReview);
        document.body.appendChild(tempCard);
        
        const filename = `BookMood_${review.bookId}_${review.createdAt.toISOString().split('T')[0]}`;
        await exportToPNG(tempCard, filename);
        
        document.body.removeChild(tempCard);
      }
    } catch (error) {
      console.error('PNG 다운로드 실패:', error);
      alert('이미지 저장에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadMarkdown = (review: ReviewData) => {
    setShowDropdownMenu(null); // 메뉴를 먼저 닫기
    try {
      const exportableReview: ExportableReview = {
        ...review,
        bookTitle: `책 ${review.bookId}`, // TODO: 실제 책 제목 가져오기
        bookAuthor: '저자 정보 없음', // TODO: 실제 저자 정보 가져오기
      };
      exportToMarkdown(exportableReview);
    } catch (error) {
      console.error('마크다운 다운로드 실패:', error);
      alert('파일 저장에 실패했습니다.');
    }
  };

  const handleDeleteReview = (review: ReviewData) => {
    setShowDropdownMenu(null); // 메뉴를 먼저 닫기
    if (confirm('정말로 이 감상문을 삭제하시겠습니까?\n삭제된 감상문은 복구할 수 없습니다.')) {
      onDeleteReview?.(review.id);
    }
  };

  const renderMoodCard = (review: ReviewData, index: number) => (
    <motion.div 
      key={review.id} 
      ref={el => { cardRefs.current[review.id] = el; }}
      initial={{
        opacity: 0,
        y: 20
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      transition={{
        delay: index * 0.1
      }} 
      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md relative group"
    >
      {/* 드롭다운 메뉴 버튼 */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdownMenu(showDropdownMenu === review.id ? null : review.id);
            }}
            className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
            disabled={isExporting}
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>

          {/* 드롭다운 메뉴 */}
          {showDropdownMenu === review.id && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-48 z-20"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadPNG(review);
                }}
                disabled={isExporting}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center disabled:opacity-50"
              >
                <Image className="w-4 h-4 mr-2" />
                PNG 이미지로 저장
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadMarkdown(review);
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                마크다운으로 저장
              </button>
              <hr className="my-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteReview(review);
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                감상문 삭제
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* 카드 컨텐츠 (클릭 가능) */}
      <div 
        onClick={() => onMoodCardSelect(review)} 
        className="cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4 pr-8">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-2 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {review.createdAt.toLocaleDateString('ko-KR')}
            </p>
            <p className="text-gray-800 font-medium text-sm line-clamp-3 mb-4 leading-relaxed">
              {review.moodSummary}
            </p>
          </div>
          <Heart className="w-5 h-5 text-[#F4E4B8] ml-3" />
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">감정</p>
            <div className="flex flex-wrap gap-1">
              {review.emotions.slice(0, 3).map((emotion, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-[#A8B5E8]/20 text-[#A8B5E8] rounded-full border border-[#A8B5E8]/30">
                  {emotion}
                </span>
              ))}
              {review.emotions.length > 3 && (
                <span className="text-xs text-gray-500">+{review.emotions.length - 3}</span>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">주제</p>
            <div className="flex flex-wrap gap-1">
              {review.topics.slice(0, 2).map((topic, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-[#B5D4C8]/20 text-[#B5D4C8] rounded-full border border-[#B5D4C8]/30">
                  {topic}
                </span>
              ))}
              {review.topics.length > 2 && (
                <span className="text-xs text-gray-500">+{review.topics.length - 2}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
  
  // 타임라인 렌더링
  const renderTimeline = () => (
    <div className="space-y-6">
      {filteredReviews.map((review, index) => (
        <div key={review.id} className="border-l-2 border-gray-200 pl-6 relative">
          <div className="absolute left-[-8px] top-2 w-4 h-4 bg-[#A8B5E8] rounded-full border-2 border-white"></div>
          {renderMoodCard(review, index)}
        </div>
      ))}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={onBack} 
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">내 도서관</h1>
              <p className="text-sm text-gray-600">{reviews.length}개의 감상문</p>
            </div>
          </div>
          
          {/* 뷰 모드 토글 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-[#A8B5E8] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'timeline' 
                  ? 'bg-[#A8B5E8] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 감상문</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}권</p>
                <p className="text-xs text-gray-500">나의 독서 여정</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#A8B5E8] to-[#B5D4C8] rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">올해</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.createdAt.getFullYear() === new Date().getFullYear()).length}권
                </p>
                <p className="text-xs text-gray-500">2024년 성과</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">평균 평점</p>
                <p className="text-2xl font-bold text-gray-900">0.0</p>
                <p className="text-xs text-gray-500">내 기준점</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">이달</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => 
                    r.createdAt.getFullYear() === new Date().getFullYear() && 
                    r.createdAt.getMonth() === new Date().getMonth()
                  ).length}권
                </p>
                <p className="text-xs text-gray-500">월간 집중</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setFilterType('all');
              setSelectedFilter('');
            }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === 'all' 
                ? 'bg-[#A8B5E8] text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            전체
          </button>
          
          {/* 월별 필터 */}
          {Array.from(new Set(reviews.map(r => r.createdAt.toLocaleDateString('ko-KR', { month: 'short' })))).map(month => (
            <button
              key={month}
              onClick={() => {
                setFilterType('month');
                setSelectedFilter(month);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === 'month' && selectedFilter === month 
                  ? 'bg-[#A8B5E8] text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {month}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div 
              key="grid" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredReviews.map((review, index) => renderMoodCard(review, index))}
            </motion.div>
          ) : (
            <motion.div 
              key="timeline" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderTimeline()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredReviews.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">기록이 없습니다</h3>
            <p className="text-gray-600 text-sm">
              {selectedFilter ? '필터를 조정해보세요' : '첫 번째 감상문을 작성해보세요'}
            </p>
          </motion.div>
        )}
      </div>

      {/* 드롭다운 메뉴 닫기를 위한 배경 클릭 */}
      {showDropdownMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdownMenu(null);
          }}
        />
      )}
      
      {/* Export Loading */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-[#A8B5E8] border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-700">이미지를 생성하고 있습니다...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ArchiveDashboard;