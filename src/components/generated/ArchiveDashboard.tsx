import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Heart, Tag, TrendingUp, Filter, Grid, List, Download, Share2, BarChart3 } from 'lucide-react';
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
  mpid?: string;
}
interface ArchiveDashboardProps {
  reviews: ReviewData[];
  onMoodCardSelect: (review: ReviewData) => void;
  onBack: () => void;
  mpid?: string;
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
  }} onClick={() => onMoodCardSelect(review)} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 active:scale-95 transition-transform cursor-pointer" data-magicpath-id="0" data-magicpath-path="ArchiveDashboard.tsx">
      <div className="flex items-start justify-between mb-4" data-magicpath-id="1" data-magicpath-path="ArchiveDashboard.tsx">
        <div className="flex-1" data-magicpath-id="2" data-magicpath-path="ArchiveDashboard.tsx">
          <p className="text-xs text-white/60 mb-2 flex items-center" data-magicpath-id="3" data-magicpath-path="ArchiveDashboard.tsx">
            <Calendar className="w-3 h-3 mr-1" data-magicpath-id="4" data-magicpath-path="ArchiveDashboard.tsx" />
            {review.createdAt.toLocaleDateString('ko-KR')}
          </p>
          <p className="text-white font-medium text-sm line-clamp-3 mb-4 leading-relaxed" data-magicpath-id="5" data-magicpath-path="ArchiveDashboard.tsx">
            {review.moodSummary}
          </p>
        </div>
        <Heart className="w-5 h-5 text-[#F4E4B8] ml-3" data-magicpath-id="6" data-magicpath-path="ArchiveDashboard.tsx" />
      </div>

      <div className="space-y-3" data-magicpath-id="7" data-magicpath-path="ArchiveDashboard.tsx">
        <div data-magicpath-id="8" data-magicpath-path="ArchiveDashboard.tsx">
          <p className="text-xs font-medium text-white/70 mb-2" data-magicpath-id="9" data-magicpath-path="ArchiveDashboard.tsx">감정</p>
          <div className="flex flex-wrap gap-1" data-magicpath-id="10" data-magicpath-path="ArchiveDashboard.tsx">
            {review.emotions.slice(0, 3).map((emotion, idx) => <span key={idx} className="px-2 py-1 text-xs bg-[#A8B5E8]/20 text-white rounded-full border border-white/20" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="11" data-magicpath-path="ArchiveDashboard.tsx">
                {emotion}
              </span>)}
          </div>
        </div>

        <div data-magicpath-id="12" data-magicpath-path="ArchiveDashboard.tsx">
          <p className="text-xs font-medium text-white/70 mb-2" data-magicpath-id="13" data-magicpath-path="ArchiveDashboard.tsx">주제</p>
          <div className="flex flex-wrap gap-1" data-magicpath-id="14" data-magicpath-path="ArchiveDashboard.tsx">
            {review.topics.slice(0, 2).map((topic, idx) => <span key={idx} className="px-2 py-1 text-xs bg-[#B5D4C8]/20 text-white rounded-full border border-white/20" data-magicpath-uuid={(topic as any)["mpid"] ?? "unsafe"} data-magicpath-id="15" data-magicpath-path="ArchiveDashboard.tsx">
                {topic}
              </span>)}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between" data-magicpath-id="16" data-magicpath-path="ArchiveDashboard.tsx">
        <span className="text-xs text-white/50" data-magicpath-id="17" data-magicpath-path="ArchiveDashboard.tsx">탭해서 자세히 보기</span>
        <div className="flex items-center space-x-2" data-magicpath-id="18" data-magicpath-path="ArchiveDashboard.tsx">
          <button className="p-1 hover:bg-white/10 rounded opacity-70 hover:opacity-100 transition-opacity" data-magicpath-id="19" data-magicpath-path="ArchiveDashboard.tsx">
            <Download className="w-3 h-3 text-white" data-magicpath-id="20" data-magicpath-path="ArchiveDashboard.tsx" />
          </button>
          <button className="p-1 hover:bg-white/10 rounded opacity-70 hover:opacity-100 transition-opacity" data-magicpath-id="21" data-magicpath-path="ArchiveDashboard.tsx">
            <Share2 className="w-3 h-3 text-white" data-magicpath-id="22" data-magicpath-path="ArchiveDashboard.tsx" />
          </button>
        </div>
      </div>
    </motion.div>;
  const renderTimeline = () => <div className="space-y-4" data-magicpath-id="23" data-magicpath-path="ArchiveDashboard.tsx">
      {filteredReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((review, index) => <motion.div key={review.id} initial={{
      opacity: 0,
      x: -20
    }} animate={{
      opacity: 1,
      x: 0
    }} transition={{
      delay: index * 0.1
    }} onClick={() => onMoodCardSelect(review)} className="cursor-pointer" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="24" data-magicpath-path="ArchiveDashboard.tsx">
            <div className="flex space-x-4" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="25" data-magicpath-path="ArchiveDashboard.tsx">
              <div className="flex flex-col items-center" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="26" data-magicpath-path="ArchiveDashboard.tsx">
                <div className="w-3 h-3 bg-[#A8B5E8] rounded-full" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="27" data-magicpath-path="ArchiveDashboard.tsx" />
                {index < filteredReviews.length - 1 && <div className="w-px h-16 bg-white/20 mt-2" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="28" data-magicpath-path="ArchiveDashboard.tsx" />}
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-colors" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="29" data-magicpath-path="ArchiveDashboard.tsx">
                <div className="flex items-start justify-between mb-3" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="30" data-magicpath-path="ArchiveDashboard.tsx">
                  <p className="text-xs text-white/60" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="31" data-magicpath-path="ArchiveDashboard.tsx">
                    {review.createdAt.toLocaleDateString('ko-KR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
                  </p>
                  <Heart className="w-4 h-4 text-[#F4E4B8]" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="32" data-magicpath-path="ArchiveDashboard.tsx" />
                </div>
                
                <p className="text-white font-medium mb-3 text-sm line-clamp-2" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-field="moodSummary:unknown" data-magicpath-id="33" data-magicpath-path="ArchiveDashboard.tsx">
                  {review.moodSummary}
                </p>

                <div className="flex flex-wrap gap-1 mb-3" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="34" data-magicpath-path="ArchiveDashboard.tsx">
                  {review.emotions.map((emotion, idx) => <span key={idx} className="px-2 py-1 text-xs bg-[#A8B5E8]/20 text-white rounded-full border border-white/20" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="35" data-magicpath-path="ArchiveDashboard.tsx">
                      {emotion}
                    </span>)}
                  {review.topics.map((topic, idx) => <span key={idx} className="px-2 py-1 text-xs bg-[#B5D4C8]/20 text-white rounded-full border border-white/20" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="36" data-magicpath-path="ArchiveDashboard.tsx">
                      {topic}
                    </span>)}
                </div>

                <p className="text-xs text-white/60 line-clamp-2" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-field="review:unknown" data-magicpath-id="37" data-magicpath-path="ArchiveDashboard.tsx">
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
  }} className="min-h-screen bg-white px-4 py-8" data-magicpath-id="38" data-magicpath-path="ArchiveDashboard.tsx">
      <div className="max-w-sm mx-auto" data-magicpath-id="39" data-magicpath-path="ArchiveDashboard.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-magicpath-id="40" data-magicpath-path="ArchiveDashboard.tsx">
          <button onClick={onBack} className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20" data-magicpath-id="41" data-magicpath-path="ArchiveDashboard.tsx">
            <ArrowLeft className="w-5 h-5 text-white" data-magicpath-id="42" data-magicpath-path="ArchiveDashboard.tsx" />
          </button>
          <div className="text-center" data-magicpath-id="43" data-magicpath-path="ArchiveDashboard.tsx">
            <h1 className="text-xl font-bold text-white" data-magicpath-id="44" data-magicpath-path="ArchiveDashboard.tsx">내 아카이브</h1>
            <p className="text-white/70 text-sm" data-magicpath-id="45" data-magicpath-path="ArchiveDashboard.tsx">{reviews.length}개의 감정 기록</p>
          </div>
          <div className="w-10" data-magicpath-id="46" data-magicpath-path="ArchiveDashboard.tsx" />
        </div>

        {/* Stats Overview */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8" data-magicpath-id="47" data-magicpath-path="ArchiveDashboard.tsx">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center" data-magicpath-id="48" data-magicpath-path="ArchiveDashboard.tsx">
            <BarChart3 className="w-5 h-5 mr-2" data-magicpath-id="49" data-magicpath-path="ArchiveDashboard.tsx" />
            이번 달 통계
          </h3>
          <div className="grid grid-cols-3 gap-4" data-magicpath-id="50" data-magicpath-path="ArchiveDashboard.tsx">
            <div className="text-center" data-magicpath-id="51" data-magicpath-path="ArchiveDashboard.tsx">
              <div className="text-2xl font-bold text-[#A8B5E8] mb-1" data-magicpath-id="52" data-magicpath-path="ArchiveDashboard.tsx">
                {reviews.length}
              </div>
              <div className="text-white/70 text-xs" data-magicpath-id="53" data-magicpath-path="ArchiveDashboard.tsx">총 기록</div>
            </div>
            <div className="text-center" data-magicpath-id="54" data-magicpath-path="ArchiveDashboard.tsx">
              <div className="text-2xl font-bold text-[#B5D4C8] mb-1" data-magicpath-id="55" data-magicpath-path="ArchiveDashboard.tsx">
                {emotionData.length}
              </div>
              <div className="text-white/70 text-xs" data-magicpath-id="56" data-magicpath-path="ArchiveDashboard.tsx">감정 종류</div>
            </div>
            <div className="text-center" data-magicpath-id="57" data-magicpath-path="ArchiveDashboard.tsx">
              <div className="text-2xl font-bold text-[#F4E4B8] mb-1" data-magicpath-id="58" data-magicpath-path="ArchiveDashboard.tsx">
                {topicData.length}
              </div>
              <div className="text-white/70 text-xs" data-magicpath-id="59" data-magicpath-path="ArchiveDashboard.tsx">주제 종류</div>
            </div>
          </div>
        </div>

        {/* Top Emotions */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8" data-magicpath-id="60" data-magicpath-path="ArchiveDashboard.tsx">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center" data-magicpath-id="61" data-magicpath-path="ArchiveDashboard.tsx">
            <Heart className="w-5 h-5 mr-2" data-magicpath-id="62" data-magicpath-path="ArchiveDashboard.tsx" />
            자주 느낀 감정
          </h3>
          <div className="space-y-3" data-magicpath-id="63" data-magicpath-path="ArchiveDashboard.tsx">
            {emotionData.slice(0, 5).map((item, index) => <div key={item.emotion} className="flex items-center justify-between" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="64" data-magicpath-path="ArchiveDashboard.tsx">
                <span className="text-sm text-white capitalize" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="emotion:unknown" data-magicpath-id="65" data-magicpath-path="ArchiveDashboard.tsx">{item.emotion}</span>
                <div className="flex items-center space-x-2" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="66" data-magicpath-path="ArchiveDashboard.tsx">
                  <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="67" data-magicpath-path="ArchiveDashboard.tsx">
                    <div className="h-full bg-gradient-to-r from-[#A8B5E8] to-[#B5D4C8] rounded-full transition-all duration-500" style={{
                  width: `${item.count / emotionData[0].count * 100}%`
                }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="68" data-magicpath-path="ArchiveDashboard.tsx" />
                  </div>
                  <span className="text-xs text-white/70 w-6 text-right" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="count:unknown" data-magicpath-id="69" data-magicpath-path="ArchiveDashboard.tsx">{item.count}</span>
                </div>
              </div>)}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-center mb-6" data-magicpath-id="70" data-magicpath-path="ArchiveDashboard.tsx">
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/20" data-magicpath-id="71" data-magicpath-path="ArchiveDashboard.tsx">
            <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-white/20 text-white border border-white/30' : 'text-white/70'}`} data-magicpath-id="72" data-magicpath-path="ArchiveDashboard.tsx">
              <Grid className="w-4 h-4 mr-2 inline" />
              카드
            </button>
            <button onClick={() => setViewMode('timeline')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${viewMode === 'timeline' ? 'bg-white/20 text-white border border-white/30' : 'text-white/70'}`} data-magicpath-id="73" data-magicpath-path="ArchiveDashboard.tsx">
              <List className="w-4 h-4 mr-2 inline" data-magicpath-id="74" data-magicpath-path="ArchiveDashboard.tsx" />
              타임라인
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6" data-magicpath-id="75" data-magicpath-path="ArchiveDashboard.tsx">
          <select value={filterType} onChange={e => {
          setFilterType(e.target.value as FilterType);
          setSelectedFilter('');
        }} className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-white/40" data-magicpath-id="76" data-magicpath-path="ArchiveDashboard.tsx">
            <option value="all" data-magicpath-id="77" data-magicpath-path="ArchiveDashboard.tsx">전체</option>
            <option value="month" data-magicpath-id="78" data-magicpath-path="ArchiveDashboard.tsx">월별</option>
            <option value="emotion" data-magicpath-id="79" data-magicpath-path="ArchiveDashboard.tsx">감정별</option>
            <option value="topic" data-magicpath-id="80" data-magicpath-path="ArchiveDashboard.tsx">주제별</option>
          </select>

          {filterType !== 'all' && <select value={selectedFilter} onChange={e => setSelectedFilter(e.target.value)} className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-white/40" data-magicpath-id="81" data-magicpath-path="ArchiveDashboard.tsx">
              <option value="" data-magicpath-id="82" data-magicpath-path="ArchiveDashboard.tsx">선택하세요</option>
              {filterType === 'month' && chartData.map((item: any) => <option key={item.month} value={item.month} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="month:unknown" data-magicpath-id="83" data-magicpath-path="ArchiveDashboard.tsx">{item.month}</option>)}
              {filterType === 'emotion' && emotionData.map(item => <option key={item.emotion} value={item.emotion} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="emotion:unknown" data-magicpath-id="84" data-magicpath-path="ArchiveDashboard.tsx">{item.emotion}</option>)}
              {filterType === 'topic' && topicData.map(item => <option key={item.topic} value={item.topic} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="topic:unknown" data-magicpath-id="85" data-magicpath-path="ArchiveDashboard.tsx">{item.topic}</option>)}
            </select>}

          {selectedFilter && <button onClick={() => {
          setFilterType('all');
          setSelectedFilter('');
        }} className="px-3 py-2 text-xs bg-white/10 text-white/70 rounded-xl hover:bg-white/20 transition-colors" data-magicpath-id="86" data-magicpath-path="ArchiveDashboard.tsx">
              필터 해제
            </button>}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait" data-magicpath-id="87" data-magicpath-path="ArchiveDashboard.tsx">
          {viewMode === 'grid' ? <motion.div key="grid" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="space-y-4" data-magicpath-id="88" data-magicpath-path="ArchiveDashboard.tsx">
              {filteredReviews.map((review, index) => renderMoodCard(review, index))}
            </motion.div> : <motion.div key="timeline" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} data-magicpath-id="89" data-magicpath-path="ArchiveDashboard.tsx">
              {renderTimeline()}
            </motion.div>}
        </AnimatePresence>

        {filteredReviews.length === 0 && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} className="text-center py-16" data-magicpath-id="90" data-magicpath-path="ArchiveDashboard.tsx">
            <Heart className="w-16 h-16 text-white/40 mx-auto mb-4" data-magicpath-id="91" data-magicpath-path="ArchiveDashboard.tsx" />
            <h3 className="text-lg font-semibold text-white mb-2" data-magicpath-id="92" data-magicpath-path="ArchiveDashboard.tsx">기록이 없습니다</h3>
            <p className="text-white/70 text-sm" data-magicpath-id="93" data-magicpath-path="ArchiveDashboard.tsx">
              {selectedFilter ? '필터를 조정해보세요' : '첫 번째 책 리뷰를 작성해보세요'}
            </p>
          </motion.div>}
      </div>
    </motion.div>;
};
export default ArchiveDashboard;