"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Users, TrendingUp, BarChart3, PieChart, Eye, Filter, Calendar, BookOpen, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';
export interface BookEmotionData {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  totalReaders: number;
  emotionStats: {
    emotion: string;
    count: number;
    percentage: number;
  }[];
  averageRating: number;
  recentReviews: {
    id: string;
    userName: string;
    userAvatar?: string;
    emotions: string[];
    rating: number;
    snippet: string;
    createdAt: Date;
  }[];
  trendData: {
    month: string;
    readers: number;
    avgRating: number;
  }[];
  mpid?: string;
}
interface BookEmotionStatsProps {
  bookData: BookEmotionData;
  onBack: () => void;
  mpid?: string;
}
type ViewMode = 'overview' | 'emotions' | 'trends' | 'reviews';
const BookEmotionStats: React.FC<BookEmotionStatsProps> = ({
  bookData,
  onBack
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  // Color palette for emotions
  const emotionColors = {
    '기쁨': '#F4E4B8',
    '슬픔': '#A8B5E8',
    '분노': '#FF6B6B',
    '두려움': '#95A5A6',
    '놀라움': '#9B59B6',
    '사랑': '#E91E63',
    '평온': '#B5D4C8',
    '흥미진진': '#FF9500',
    '우울감': '#6C7CE0',
    '영감': '#00D4AA'
  };
  const getEmotionColor = (emotion: string) => {
    return emotionColors[emotion as keyof typeof emotionColors] || '#A8B5E8';
  };
  const filteredReviews = useMemo(() => {
    if (!selectedEmotion) return bookData.recentReviews;
    return bookData.recentReviews.filter(review => review.emotions.includes(selectedEmotion));
  }, [bookData.recentReviews, selectedEmotion]);
  const renderOverview = () => <div className="space-y-6" data-magicpath-id="0" data-magicpath-path="BookEmotionStats.tsx">
      {/* Book Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" data-magicpath-id="1" data-magicpath-path="BookEmotionStats.tsx">
        <div className="flex space-x-4" data-magicpath-id="2" data-magicpath-path="BookEmotionStats.tsx">
          <img src={bookData.bookCover} alt={bookData.bookTitle} className="w-20 h-28 object-cover rounded-xl shadow-lg" data-magicpath-id="3" data-magicpath-path="BookEmotionStats.tsx" />
          <div className="flex-1" data-magicpath-id="4" data-magicpath-path="BookEmotionStats.tsx">
            <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight" data-magicpath-id="5" data-magicpath-path="BookEmotionStats.tsx">
              {bookData.bookTitle}
            </h2>
            <p className="text-gray-600 mb-3" data-magicpath-id="6" data-magicpath-path="BookEmotionStats.tsx">{bookData.bookAuthor}</p>
            <div className="flex items-center space-x-4 text-sm" data-magicpath-id="7" data-magicpath-path="BookEmotionStats.tsx">
              <div className="flex items-center" data-magicpath-id="8" data-magicpath-path="BookEmotionStats.tsx">
                <Users className="w-4 h-4 text-[#A8B5E8] mr-1" data-magicpath-id="9" data-magicpath-path="BookEmotionStats.tsx" />
                <span className="text-gray-700" data-magicpath-id="10" data-magicpath-path="BookEmotionStats.tsx">{bookData.totalReaders}명 읽음</span>
              </div>
              <div className="flex items-center" data-magicpath-id="11" data-magicpath-path="BookEmotionStats.tsx">
                <Star className="w-4 h-4 text-[#F4E4B8] fill-current mr-1" data-magicpath-id="12" data-magicpath-path="BookEmotionStats.tsx" />
                <span className="text-gray-700" data-magicpath-id="13" data-magicpath-path="BookEmotionStats.tsx">{bookData.averageRating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Emotions */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" data-magicpath-id="14" data-magicpath-path="BookEmotionStats.tsx">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center" data-magicpath-id="15" data-magicpath-path="BookEmotionStats.tsx">
          <Heart className="w-5 h-5 mr-2 text-pink-500" data-magicpath-id="16" data-magicpath-path="BookEmotionStats.tsx" />
          독자들이 느낀 주요 감정
        </h3>
        <div className="space-y-3" data-magicpath-id="17" data-magicpath-path="BookEmotionStats.tsx">
          {bookData.emotionStats.slice(0, 5).map((emotion, index) => <div key={emotion.emotion} className="flex items-center justify-between" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="18" data-magicpath-path="BookEmotionStats.tsx">
              <div className="flex items-center space-x-3" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="19" data-magicpath-path="BookEmotionStats.tsx">
                <div className="w-4 h-4 rounded-full" style={{
              backgroundColor: getEmotionColor(emotion.emotion)
            }} data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="20" data-magicpath-path="BookEmotionStats.tsx" />
                <span className="text-gray-800 font-medium" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-field="emotion:unknown" data-magicpath-id="21" data-magicpath-path="BookEmotionStats.tsx">{emotion.emotion}</span>
              </div>
              <div className="flex items-center space-x-3" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="22" data-magicpath-path="BookEmotionStats.tsx">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="23" data-magicpath-path="BookEmotionStats.tsx">
                  <div className="h-full rounded-full transition-all duration-500" style={{
                width: `${emotion.percentage}%`,
                backgroundColor: getEmotionColor(emotion.emotion)
              }} data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="24" data-magicpath-path="BookEmotionStats.tsx" />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-field="percentage:unknown" data-magicpath-id="25" data-magicpath-path="BookEmotionStats.tsx">
                  {emotion.percentage}%
                </span>
              </div>
            </div>)}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4" data-magicpath-id="26" data-magicpath-path="BookEmotionStats.tsx">
        <div className="bg-gradient-to-r from-[#A8B5E8]/20 to-[#B5D4C8]/20 rounded-2xl p-6 border border-gray-100" data-magicpath-id="27" data-magicpath-path="BookEmotionStats.tsx">
          <div className="text-center" data-magicpath-id="28" data-magicpath-path="BookEmotionStats.tsx">
            <div className="text-2xl font-bold text-[#A8B5E8] mb-1" data-magicpath-id="29" data-magicpath-path="BookEmotionStats.tsx">
              {bookData.emotionStats.length}
            </div>
            <div className="text-gray-600 text-sm" data-magicpath-id="30" data-magicpath-path="BookEmotionStats.tsx">감정 종류</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#B5D4C8]/20 to-[#F4E4B8]/20 rounded-2xl p-6 border border-gray-100" data-magicpath-id="31" data-magicpath-path="BookEmotionStats.tsx">
          <div className="text-center" data-magicpath-id="32" data-magicpath-path="BookEmotionStats.tsx">
            <div className="text-2xl font-bold text-[#B5D4C8] mb-1" data-magicpath-id="33" data-magicpath-path="BookEmotionStats.tsx">
              {bookData.recentReviews.length}
            </div>
            <div className="text-gray-600 text-sm" data-magicpath-id="34" data-magicpath-path="BookEmotionStats.tsx">최근 리뷰</div>
          </div>
        </div>
      </div>
    </div>;
  const renderEmotions = () => <div className="space-y-6" data-magicpath-id="35" data-magicpath-path="BookEmotionStats.tsx">
      {/* Emotion Chart */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" data-magicpath-id="36" data-magicpath-path="BookEmotionStats.tsx">
        <h3 className="text-lg font-semibold text-gray-800 mb-4" data-magicpath-id="37" data-magicpath-path="BookEmotionStats.tsx">감정 분포</h3>
        <div className="h-64" data-magicpath-id="38" data-magicpath-path="BookEmotionStats.tsx">
          <ResponsiveContainer width="100%" height="100%" data-magicpath-id="39" data-magicpath-path="BookEmotionStats.tsx">
            <RechartsPieChart data-magicpath-id="40" data-magicpath-path="BookEmotionStats.tsx">
              <Pie data={bookData.emotionStats} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="count" label={({
              emotion,
              percentage
            }) => `${emotion} ${percentage}%`} labelLine={false} data-magicpath-id="41" data-magicpath-path="BookEmotionStats.tsx">
                {bookData.emotionStats.map((entry, index) => <Cell key={`cell-${index}`} fill={getEmotionColor(entry.emotion)} data-magicpath-id="42" data-magicpath-path="BookEmotionStats.tsx" />)}
              </Pie>
              <Tooltip formatter={(value: any, name: any, props: any) => [`${value}명 (${props.payload.percentage}%)`, '독자 수']} data-magicpath-id="43" data-magicpath-path="BookEmotionStats.tsx" />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Emotion List */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" data-magicpath-id="44" data-magicpath-path="BookEmotionStats.tsx">
        <h3 className="text-lg font-semibold text-gray-800 mb-4" data-magicpath-id="45" data-magicpath-path="BookEmotionStats.tsx">상세 감정 통계</h3>
        <div className="space-y-4" data-magicpath-id="46" data-magicpath-path="BookEmotionStats.tsx">
          {bookData.emotionStats.map((emotion, index) => <motion.div key={emotion.emotion} initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: index * 0.1
        }} onClick={() => setSelectedEmotion(selectedEmotion === emotion.emotion ? null : emotion.emotion)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedEmotion === emotion.emotion ? 'border-[#A8B5E8] bg-[#A8B5E8]/10' : 'border-gray-200 hover:border-gray-300'}`} data-magicpath-id="47" data-magicpath-path="BookEmotionStats.tsx">
              <div className="flex items-center justify-between" data-magicpath-id="48" data-magicpath-path="BookEmotionStats.tsx">
                <div className="flex items-center space-x-3" data-magicpath-id="49" data-magicpath-path="BookEmotionStats.tsx">
                  <div className="w-6 h-6 rounded-full" style={{
                backgroundColor: getEmotionColor(emotion.emotion)
              }} data-magicpath-id="50" data-magicpath-path="BookEmotionStats.tsx" />
                  <div data-magicpath-id="51" data-magicpath-path="BookEmotionStats.tsx">
                    <h4 className="font-semibold text-gray-800" data-magicpath-id="52" data-magicpath-path="BookEmotionStats.tsx">{emotion.emotion}</h4>
                    <p className="text-sm text-gray-600" data-magicpath-id="53" data-magicpath-path="BookEmotionStats.tsx">{emotion.count}명의 독자</p>
                  </div>
                </div>
                <div className="text-right" data-magicpath-id="54" data-magicpath-path="BookEmotionStats.tsx">
                  <div className="text-2xl font-bold text-gray-800" data-magicpath-id="55" data-magicpath-path="BookEmotionStats.tsx">
                    {emotion.percentage}%
                  </div>
                  <div className="text-xs text-gray-500" data-magicpath-id="56" data-magicpath-path="BookEmotionStats.tsx">전체 중</div>
                </div>
              </div>
            </motion.div>)}
        </div>
      </div>
    </div>;
  const renderTrends = () => <div className="space-y-6" data-magicpath-id="57" data-magicpath-path="BookEmotionStats.tsx">
      {/* Reader Trend */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" data-magicpath-id="58" data-magicpath-path="BookEmotionStats.tsx">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center" data-magicpath-id="59" data-magicpath-path="BookEmotionStats.tsx">
          <TrendingUp className="w-5 h-5 mr-2" data-magicpath-id="60" data-magicpath-path="BookEmotionStats.tsx" />
          독자 수 추이
        </h3>
        <div className="h-48" data-magicpath-id="61" data-magicpath-path="BookEmotionStats.tsx">
          <ResponsiveContainer width="100%" height="100%" data-magicpath-id="62" data-magicpath-path="BookEmotionStats.tsx">
            <LineChart data={bookData.trendData} data-magicpath-id="63" data-magicpath-path="BookEmotionStats.tsx">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" data-magicpath-id="64" data-magicpath-path="BookEmotionStats.tsx" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{
              fontSize: 12,
              fill: '#666'
            }} data-magicpath-id="65" data-magicpath-path="BookEmotionStats.tsx" />
              <YAxis axisLine={false} tickLine={false} tick={{
              fontSize: 12,
              fill: '#666'
            }} data-magicpath-id="66" data-magicpath-path="BookEmotionStats.tsx" />
              <Tooltip contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }} data-magicpath-id="67" data-magicpath-path="BookEmotionStats.tsx" />
              <Line type="monotone" dataKey="readers" stroke="#A8B5E8" strokeWidth={3} dot={{
              fill: '#A8B5E8',
              strokeWidth: 2,
              r: 4
            }} activeDot={{
              r: 6,
              stroke: '#A8B5E8',
              strokeWidth: 2
            }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rating Trend */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" data-magicpath-id="68" data-magicpath-path="BookEmotionStats.tsx">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center" data-magicpath-id="69" data-magicpath-path="BookEmotionStats.tsx">
          <Star className="w-5 h-5 mr-2 text-[#F4E4B8]" data-magicpath-id="70" data-magicpath-path="BookEmotionStats.tsx" />
          평점 추이
        </h3>
        <div className="h-48" data-magicpath-id="71" data-magicpath-path="BookEmotionStats.tsx">
          <ResponsiveContainer width="100%" height="100%" data-magicpath-id="72" data-magicpath-path="BookEmotionStats.tsx">
            <LineChart data={bookData.trendData} data-magicpath-id="73" data-magicpath-path="BookEmotionStats.tsx">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" data-magicpath-id="74" data-magicpath-path="BookEmotionStats.tsx" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{
              fontSize: 12,
              fill: '#666'
            }} data-magicpath-id="75" data-magicpath-path="BookEmotionStats.tsx" />
              <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{
              fontSize: 12,
              fill: '#666'
            }} data-magicpath-id="76" data-magicpath-path="BookEmotionStats.tsx" />
              <Tooltip contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }} data-magicpath-id="77" data-magicpath-path="BookEmotionStats.tsx" />
              <Line type="monotone" dataKey="avgRating" stroke="#F4E4B8" strokeWidth={3} dot={{
              fill: '#F4E4B8',
              strokeWidth: 2,
              r: 4
            }} activeDot={{
              r: 6,
              stroke: '#F4E4B8',
              strokeWidth: 2
            }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>;
  const renderReviews = () => <div className="space-y-6" data-magicpath-id="78" data-magicpath-path="BookEmotionStats.tsx">
      {/* Filter */}
      {selectedEmotion && <div className="bg-[#A8B5E8]/10 border border-[#A8B5E8]/20 rounded-2xl p-4" data-magicpath-id="79" data-magicpath-path="BookEmotionStats.tsx">
          <div className="flex items-center justify-between" data-magicpath-id="80" data-magicpath-path="BookEmotionStats.tsx">
            <div className="flex items-center space-x-2" data-magicpath-id="81" data-magicpath-path="BookEmotionStats.tsx">
              <div className="w-4 h-4 rounded-full" style={{
            backgroundColor: getEmotionColor(selectedEmotion)
          }} data-magicpath-id="82" data-magicpath-path="BookEmotionStats.tsx" />
              <span className="text-sm font-medium text-gray-700" data-magicpath-id="83" data-magicpath-path="BookEmotionStats.tsx">
                '{selectedEmotion}' 감정 필터 적용
              </span>
            </div>
            <button onClick={() => setSelectedEmotion(null)} className="text-xs text-gray-600 hover:text-gray-800" data-magicpath-id="84" data-magicpath-path="BookEmotionStats.tsx">
              필터 해제
            </button>
          </div>
        </div>}

      {/* Reviews List */}
      <div className="space-y-4" data-magicpath-id="85" data-magicpath-path="BookEmotionStats.tsx">
        {filteredReviews.map((review, index) => <motion.div key={review.id} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: index * 0.1
      }} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="86" data-magicpath-path="BookEmotionStats.tsx">
            <div className="flex items-start space-x-3" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="87" data-magicpath-path="BookEmotionStats.tsx">
              <div className="w-10 h-10 bg-gradient-to-r from-[#A8B5E8] to-[#B5D4C8] rounded-full flex items-center justify-center" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="88" data-magicpath-path="BookEmotionStats.tsx">
                <span className="text-white font-medium text-sm" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="89" data-magicpath-path="BookEmotionStats.tsx">
                  {review.userName.charAt(0)}
                </span>
              </div>
              <div className="flex-1" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="90" data-magicpath-path="BookEmotionStats.tsx">
                <div className="flex items-center justify-between mb-2" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="91" data-magicpath-path="BookEmotionStats.tsx">
                  <div data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="92" data-magicpath-path="BookEmotionStats.tsx">
                    <h4 className="font-medium text-gray-800" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-field="userName:unknown" data-magicpath-id="93" data-magicpath-path="BookEmotionStats.tsx">{review.userName}</h4>
                    <p className="text-xs text-gray-500" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="94" data-magicpath-path="BookEmotionStats.tsx">
                      {review.createdAt.toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div className="flex items-center" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="95" data-magicpath-path="BookEmotionStats.tsx">
                    <Star className="w-4 h-4 text-[#F4E4B8] fill-current mr-1" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="96" data-magicpath-path="BookEmotionStats.tsx" />
                    <span className="text-sm text-gray-700" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-field="rating:unknown" data-magicpath-id="97" data-magicpath-path="BookEmotionStats.tsx">{review.rating}</span>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-3 leading-relaxed" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-field="snippet:unknown" data-magicpath-id="98" data-magicpath-path="BookEmotionStats.tsx">
                  {review.snippet}
                </p>

                <div className="flex flex-wrap gap-1" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="99" data-magicpath-path="BookEmotionStats.tsx">
                  {review.emotions.map((emotion, idx) => <span key={idx} className="px-2 py-1 text-xs rounded-full border" style={{
                backgroundColor: `${getEmotionColor(emotion)}20`,
                color: getEmotionColor(emotion),
                borderColor: `${getEmotionColor(emotion)}30`
              }} data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="100" data-magicpath-path="BookEmotionStats.tsx">
                      {emotion}
                    </span>)}
                </div>
              </div>
            </div>
          </motion.div>)}
      </div>

      {filteredReviews.length === 0 && <div className="text-center py-12" data-magicpath-id="101" data-magicpath-path="BookEmotionStats.tsx">
          <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" data-magicpath-id="102" data-magicpath-path="BookEmotionStats.tsx" />
          <p className="text-gray-600" data-magicpath-id="103" data-magicpath-path="BookEmotionStats.tsx">해당 감정의 리뷰가 없습니다</p>
        </div>}
    </div>;
  const renderContent = () => {
    switch (viewMode) {
      case 'overview':
        return renderOverview();
      case 'emotions':
        return renderEmotions();
      case 'trends':
        return renderTrends();
      case 'reviews':
        return renderReviews();
      default:
        return renderOverview();
    }
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="min-h-screen px-4 py-8" data-magicpath-id="104" data-magicpath-path="BookEmotionStats.tsx">
      <div className="max-w-sm mx-auto" data-magicpath-id="105" data-magicpath-path="BookEmotionStats.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-magicpath-id="106" data-magicpath-path="BookEmotionStats.tsx">
          <button onClick={onBack} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors" data-magicpath-id="107" data-magicpath-path="BookEmotionStats.tsx">
            <ArrowLeft className="w-5 h-5 text-gray-600" data-magicpath-id="108" data-magicpath-path="BookEmotionStats.tsx" />
          </button>
          <h1 className="text-xl font-bold text-gray-800" data-magicpath-id="109" data-magicpath-path="BookEmotionStats.tsx">독자 감정 통계</h1>
          <div className="w-10" data-magicpath-id="110" data-magicpath-path="BookEmotionStats.tsx" />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-gray-100 rounded-2xl p-1 mb-8" data-magicpath-id="111" data-magicpath-path="BookEmotionStats.tsx">
          {[{
          key: 'overview',
          label: '개요',
          icon: BarChart3,
          mpid: "52da2cf5-e94e-4078-b083-f2bda67d7aba"
        }, {
          key: 'emotions',
          label: '감정',
          icon: Heart,
          mpid: "876ed4c2-0c64-4cde-a817-622ada8d92ff"
        }, {
          key: 'trends',
          label: '추이',
          icon: TrendingUp,
          mpid: "1801582d-8274-49db-b9b1-fe89e1438cfc"
        }, {
          key: 'reviews',
          label: '리뷰',
          icon: Users,
          mpid: "b3803518-c4d8-41dc-a086-d924cd317a23"
        }].map(({
          key,
          label,
          icon: Icon
        }) => <button key={key} onClick={() => setViewMode(key as ViewMode)} className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-center space-x-1 ${viewMode === key ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`} data-magicpath-id="112" data-magicpath-path="BookEmotionStats.tsx">
              <Icon className="w-3 h-3" data-magicpath-id="113" data-magicpath-path="BookEmotionStats.tsx" />
              <span data-magicpath-id="114" data-magicpath-path="BookEmotionStats.tsx">{label}</span>
            </button>)}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait" data-magicpath-id="115" data-magicpath-path="BookEmotionStats.tsx">
          <motion.div key={viewMode} initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }} transition={{
          duration: 0.2
        }} data-magicpath-id="116" data-magicpath-path="BookEmotionStats.tsx">
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>;
};
export default BookEmotionStats;