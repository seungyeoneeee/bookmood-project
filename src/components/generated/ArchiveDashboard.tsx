import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Heart, Tag, TrendingUp, Filter, Grid, List, Download, Share2, BarChart3, BookOpen, Bookmark } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
interface ReviewData {
  id: string;
  bookId: string;
  review: string;
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
}
type ViewMode = 'grid' | 'timeline';
type FilterType = 'all' | 'month' | 'emotion' | 'topic';
const ArchiveDashboard: React.FC<ArchiveDashboardProps> = ({
  reviews,
  onMoodCardSelect,
  onBack
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('');

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
  const renderMoodCard = (review: ReviewData, index: number) => <motion.div key={review.id} initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay: index * 0.1
  }} onClick={() => onMoodCardSelect(review)} className="bg-white border border-gray-200 rounded-2xl p-6 active:scale-95 transition-transform cursor-pointer shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
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
            {review.emotions.slice(0, 3).map((emotion, idx) => <span key={idx} className="px-2 py-1 text-xs bg-[#A8B5E8]/20 text-[#A8B5E8] rounded-full border border-[#A8B5E8]/30">
                {emotion}
              </span>)}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">주제</p>
          <div className="flex flex-wrap gap-1">
            {review.topics.slice(0, 2).map((topic, idx) => <span key={idx} className="px-2 py-1 text-xs bg-[#B5D4C8]/20 text-[#B5D4C8] rounded-full border border-[#B5D4C8]/30">
                {topic}
              </span>)}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <span className="text-xs text-gray-400">탭해서 자세히 보기</span>
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-gray-100 rounded opacity-70 hover:opacity-100 transition-opacity">
            <Download className="w-3 h-3 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded opacity-70 hover:opacity-100 transition-opacity">
            <Share2 className="w-3 h-3 text-gray-600" />
          </button>
        </div>
      </div>
    </motion.div>;
  const renderTimeline = () => <div className="space-y-4">
      {filteredReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((review, index) => <motion.div key={review.id} initial={{
      opacity: 0,
      x: -20
    }} animate={{
      opacity: 1,
      x: 0
    }} transition={{
      delay: index * 0.1
    }} onClick={() => onMoodCardSelect(review)} className="cursor-pointer">
            <div className="flex space-x-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-[#A8B5E8] rounded-full" />
                {index < filteredReviews.length - 1 && <div className="w-px h-16 bg-gray-200 mt-2" />}
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs text-gray-500">
                    {review.createdAt.toLocaleDateString('ko-KR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
                  </p>
                  <Heart className="w-4 h-4 text-[#F4E4B8]" />
                </div>
                
                <p className="text-gray-800 font-medium mb-3 text-sm line-clamp-2">
                  {review.moodSummary}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {review.emotions.map((emotion, idx) => <span key={idx} className="px-2 py-1 text-xs bg-[#A8B5E8]/20 text-[#A8B5E8] rounded-full border border-[#A8B5E8]/30">
                      {emotion}
                    </span>)}
                  {review.topics.map((topic, idx) => <span key={idx} className="px-2 py-1 text-xs bg-[#B5D4C8]/20 text-[#B5D4C8] rounded-full border border-[#B5D4C8]/30">
                      {topic}
                    </span>)}
                </div>

                <p className="text-xs text-gray-500 line-clamp-2">
                  {review.review}
                </p>
              </div>
            </div>
          </motion.div>)}
    </div>;
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="min-h-screen">
      <div className="px-4 md:px-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">내 아카이브</h1>
            <p className="text-gray-600 text-sm">{reviews.length}개의 감상문</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Stats Overview */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            이번 달 통계
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#A8B5E8] mb-1">
                {reviews.length}
              </div>
              <div className="text-gray-600 text-xs">총 기록</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#B5D4C8] mb-1">
                {emotionData.length}
              </div>
              <div className="text-gray-600 text-xs">감정 종류</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#F4E4B8] mb-1">
                {topicData.length}
              </div>
              <div className="text-gray-600 text-xs">주제 종류</div>
            </div>
          </div>
        </div>

        {/* Top Emotions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            자주 느낀 감정
          </h3>
          <div className="space-y-3">
            {emotionData.slice(0, 5).map((item, index) => <div key={item.emotion} className="flex items-center justify-between">
                <span className="text-sm text-gray-800 capitalize">{item.emotion}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#A8B5E8] to-[#B5D4C8] rounded-full transition-all duration-500" style={{
                  width: `${item.count / emotionData[0].count * 100}%`
                }} />
                  </div>
                  <span className="text-xs text-gray-600 w-6 text-right">{item.count}</span>
                </div>
              </div>)}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center bg-gray-100 rounded-2xl p-1">
            <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'}`}>
              <Grid className="w-4 h-4 mr-2 inline" />
              카드
            </button>
            <button onClick={() => setViewMode('timeline')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${viewMode === 'timeline' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'}`}>
              <List className="w-4 h-4 mr-2 inline" />
              타임라인
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <select value={filterType} onChange={e => {
          setFilterType(e.target.value as FilterType);
          setSelectedFilter('');
        }} className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20">
            <option value="all">전체</option>
            <option value="month">월별</option>
            <option value="emotion">감정별</option>
            <option value="topic">주제별</option>
          </select>

          {filterType !== 'all' && <select value={selectedFilter} onChange={e => setSelectedFilter(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20">
              <option value="">선택하세요</option>
              {filterType === 'month' && chartData.map((item: any) => <option key={item.month} value={item.month}>{item.month}</option>)}
              {filterType === 'emotion' && emotionData.map(item => <option key={item.emotion} value={item.emotion}>{item.emotion}</option>)}
              {filterType === 'topic' && topicData.map(item => <option key={item.topic} value={item.topic}>{item.topic}</option>)}
            </select>}

          {selectedFilter && <button onClick={() => {
          setFilterType('all');
          setSelectedFilter('');
        }} className="px-3 py-2 text-xs bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
              필터 해제
            </button>}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? <motion.div key="grid" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="space-y-4">
              {filteredReviews.map((review, index) => renderMoodCard(review, index))}
            </motion.div> : <motion.div key="timeline" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }}>
              {renderTimeline()}
            </motion.div>}
        </AnimatePresence>

        {filteredReviews.length === 0 && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">기록이 없습니다</h3>
            <p className="text-gray-600 text-sm">
              {selectedFilter ? '필터를 조정해보세요' : '첫 번째 감상문을 작성해보세요'}
            </p>
          </motion.div>}
      </div>
    </motion.div>;
};
export default ArchiveDashboard;