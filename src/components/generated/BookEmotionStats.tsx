"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, TrendingUp, Users, Star, Calendar, BookOpen, Heart, BarChart3, PieChart, Activity, Award, Zap, Target, Clock, Filter } from 'lucide-react';
export interface BookEmotionData {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  totalReaders: number;
  emotionStats: Array<{
    emotion: string;
    count: number;
    percentage: number;
    mpid?: string;
  }>;
  averageRating: number;
  recentReviews: Array<{
    id: string;
    userName: string;
    emotions: string[];
    rating: number;
    snippet: string;
    createdAt: Date;
    mpid?: string;
  }>;
  trendData: Array<{
    month: string;
    readers: number;
    avgRating: number;
    mpid?: string;
  }>;
  mpid?: string;
}
interface BookEmotionStatsProps {
  bookData: BookEmotionData;
  onBack: () => void;
  mpid?: string;
}
const BookEmotionStats: React.FC<BookEmotionStatsProps> = ({
  bookData,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'emotions' | 'trends' | 'reviews'>('overview');
  const getEmotionColor = (emotion: string) => {
    const colors: {
      [key: string]: string;
    } = {
      '기쁨': '#F4E4B8',
      '평온': '#B5D4C8',
      '영감': '#00D4AA',
      '사랑': '#E91E63',
      '그리움': '#9C27B0',
      '슬픔': '#A8B5E8',
      '감동': '#FF6B6B',
      '깨달음': '#607D8B'
    };
    return colors[emotion] || '#A8B5E8';
  };
  const renderOverview = () => <div className="space-y-6" data-magicpath-id="0" data-magicpath-path="BookEmotionStats.tsx">
      {/* Book Info Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100" data-magicpath-id="1" data-magicpath-path="BookEmotionStats.tsx">
        <div className="flex items-center space-x-4 mb-6" data-magicpath-id="2" data-magicpath-path="BookEmotionStats.tsx">
          <img src={bookData.bookCover} alt={bookData.bookTitle} className="w-16 h-24 object-cover rounded-lg shadow-md" data-magicpath-id="3" data-magicpath-path="BookEmotionStats.tsx" />
          <div className="flex-1" data-magicpath-id="4" data-magicpath-path="BookEmotionStats.tsx">
            <h2 className="text-lg font-bold text-gray-800 mb-1" data-magicpath-id="5" data-magicpath-path="BookEmotionStats.tsx">{bookData.bookTitle}</h2>
            <p className="text-gray-600 text-sm mb-2" data-magicpath-id="6" data-magicpath-path="BookEmotionStats.tsx">{bookData.bookAuthor}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500" data-magicpath-id="7" data-magicpath-path="BookEmotionStats.tsx">
              <div className="flex items-center" data-magicpath-id="8" data-magicpath-path="BookEmotionStats.tsx">
                <Users className="w-3 h-3 mr-1" data-magicpath-id="9" data-magicpath-path="BookEmotionStats.tsx" />
                <span data-magicpath-id="10" data-magicpath-path="BookEmotionStats.tsx">{bookData.totalReaders.toLocaleString()}명</span>
              </div>
              <div className="flex items-center" data-magicpath-id="11" data-magicpath-path="BookEmotionStats.tsx">
                <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" data-magicpath-id="12" data-magicpath-path="BookEmotionStats.tsx" />
                <span data-magicpath-id="13" data-magicpath-path="BookEmotionStats.tsx">{bookData.averageRating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 gap-4" data-magicpath-id="14" data-magicpath-path="BookEmotionStats.tsx">
          <div className="bg-gradient-to-br from-[#A8B5E8]/10 to-[#A8B5E8]/5 rounded-xl p-4 text-center" data-magicpath-id="15" data-magicpath-path="BookEmotionStats.tsx">
            <div className="w-8 h-8 bg-[#A8B5E8] rounded-lg flex items-center justify-center mx-auto mb-2" data-magicpath-id="16" data-magicpath-path="BookEmotionStats.tsx">
              <Users className="w-4 h-4 text-white" data-magicpath-id="17" data-magicpath-path="BookEmotionStats.tsx" />
            </div>
            <div className="text-xl font-bold text-gray-800" data-magicpath-id="18" data-magicpath-path="BookEmotionStats.tsx">{bookData.totalReaders.toLocaleString()}</div>
            <div className="text-xs text-gray-600" data-magicpath-id="19" data-magicpath-path="BookEmotionStats.tsx">총 독자 수</div>
          </div>
          
          <div className="bg-gradient-to-br from-[#F4E4B8]/10 to-[#F4E4B8]/5 rounded-xl p-4 text-center" data-magicpath-id="20" data-magicpath-path="BookEmotionStats.tsx">
            <div className="w-8 h-8 bg-[#F4E4B8] rounded-lg flex items-center justify-center mx-auto mb-2" data-magicpath-id="21" data-magicpath-path="BookEmotionStats.tsx">
              <Star className="w-4 h-4 text-white" data-magicpath-id="22" data-magicpath-path="BookEmotionStats.tsx" />
            </div>
            <div className="text-xl font-bold text-gray-800" data-magicpath-id="23" data-magicpath-path="BookEmotionStats.tsx">{bookData.averageRating}</div>
            <div className="text-xs text-gray-600" data-magicpath-id="24" data-magicpath-path="BookEmotionStats.tsx">평균 평점</div>
          </div>
          
          <div className="bg-gradient-to-br from-[#B5D4C8]/10 to-[#B5D4C8]/5 rounded-xl p-4 text-center" data-magicpath-id="25" data-magicpath-path="BookEmotionStats.tsx">
            <div className="w-8 h-8 bg-[#B5D4C8] rounded-lg flex items-center justify-center mx-auto mb-2" data-magicpath-id="26" data-magicpath-path="BookEmotionStats.tsx">
              <Heart className="w-4 h-4 text-white" data-magicpath-id="27" data-magicpath-path="BookEmotionStats.tsx" />
            </div>
            <div className="text-xl font-bold text-gray-800" data-magicpath-id="28" data-magicpath-path="BookEmotionStats.tsx">{bookData.emotionStats.length}</div>
            <div className="text-xs text-gray-600" data-magicpath-id="29" data-magicpath-path="BookEmotionStats.tsx">감정 종류</div>
          </div>
          
          <div className="bg-gradient-to-br from-[#E8B5A8]/10 to-[#E8B5A8]/5 rounded-xl p-4 text-center" data-magicpath-id="30" data-magicpath-path="BookEmotionStats.tsx">
            <div className="w-8 h-8 bg-[#E8B5A8] rounded-lg flex items-center justify-center mx-auto mb-2" data-magicpath-id="31" data-magicpath-path="BookEmotionStats.tsx">
              <TrendingUp className="w-4 h-4 text-white" data-magicpath-id="32" data-magicpath-path="BookEmotionStats.tsx" />
            </div>
            <div className="text-xl font-bold text-gray-800" data-magicpath-id="33" data-magicpath-path="BookEmotionStats.tsx">
              {bookData.emotionStats[0]?.emotion || 'N/A'}
            </div>
            <div className="text-xs text-gray-600" data-magicpath-id="34" data-magicpath-path="BookEmotionStats.tsx">주요 감정</div>
          </div>
        </div>
      </div>

      {/* Top Emotions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100" data-magicpath-id="35" data-magicpath-path="BookEmotionStats.tsx">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center" data-magicpath-id="36" data-magicpath-path="BookEmotionStats.tsx">
          <BarChart3 className="w-5 h-5 mr-2 text-[#A8B5E8]" data-magicpath-id="37" data-magicpath-path="BookEmotionStats.tsx" />
          독자 감정 분포
        </h3>
        <div className="space-y-3" data-magicpath-id="38" data-magicpath-path="BookEmotionStats.tsx">
          {bookData.emotionStats.slice(0, 5).map((stat, index) => <div key={stat.emotion} className="flex items-center space-x-3" data-magicpath-uuid={(stat as any)["mpid"] ?? "unsafe"} data-magicpath-id="39" data-magicpath-path="BookEmotionStats.tsx">
              <div className="flex-1" data-magicpath-uuid={(stat as any)["mpid"] ?? "unsafe"} data-magicpath-id="40" data-magicpath-path="BookEmotionStats.tsx">
                <div className="flex items-center justify-between mb-1" data-magicpath-uuid={(stat as any)["mpid"] ?? "unsafe"} data-magicpath-id="41" data-magicpath-path="BookEmotionStats.tsx">
                  <span className="text-sm font-medium text-gray-800" data-magicpath-uuid={(stat as any)["mpid"] ?? "unsafe"} data-magicpath-field="emotion:unknown" data-magicpath-id="42" data-magicpath-path="BookEmotionStats.tsx">{stat.emotion}</span>
                  <span className="text-xs text-gray-600" data-magicpath-uuid={(stat as any)["mpid"] ?? "unsafe"} data-magicpath-field="percentage:unknown" data-magicpath-id="43" data-magicpath-path="BookEmotionStats.tsx">{stat.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2" data-magicpath-uuid={(stat as any)["mpid"] ?? "unsafe"} data-magicpath-id="44" data-magicpath-path="BookEmotionStats.tsx">
                  <motion.div initial={{
                width: 0
              }} animate={{
                width: `${stat.percentage}%`
              }} transition={{
                delay: index * 0.1,
                duration: 0.8
              }} className="h-2 rounded-full" style={{
                backgroundColor: getEmotionColor(stat.emotion)
              }} data-magicpath-uuid={(stat as any)["mpid"] ?? "unsafe"} data-magicpath-id="45" data-magicpath-path="BookEmotionStats.tsx" />
                </div>
              </div>
              <div className="text-xs text-gray-500 min-w-[40px] text-right" data-magicpath-uuid={(stat as any)["mpid"] ?? "unsafe"} data-magicpath-field="count:unknown" data-magicpath-id="46" data-magicpath-path="BookEmotionStats.tsx">
                {stat.count}명
              </div>
            </div>)}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100" data-magicpath-id="47" data-magicpath-path="BookEmotionStats.tsx">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center" data-magicpath-id="48" data-magicpath-path="BookEmotionStats.tsx">
          <Activity className="w-5 h-5 mr-2 text-[#B5D4C8]" data-magicpath-id="49" data-magicpath-path="BookEmotionStats.tsx" />
          최근 독자 리뷰
        </h3>
        <div className="space-y-4" data-magicpath-id="50" data-magicpath-path="BookEmotionStats.tsx">
          {bookData.recentReviews.slice(0, 3).map(review => <div key={review.id} className="border-l-4 border-[#A8B5E8]/30 pl-4 py-2" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="51" data-magicpath-path="BookEmotionStats.tsx">
              <div className="flex items-center justify-between mb-2" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="52" data-magicpath-path="BookEmotionStats.tsx">
                <span className="font-medium text-gray-800 text-sm" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-field="userName:unknown" data-magicpath-id="53" data-magicpath-path="BookEmotionStats.tsx">{review.userName}</span>
                <div className="flex items-center space-x-1" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="54" data-magicpath-path="BookEmotionStats.tsx">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="55" data-magicpath-path="BookEmotionStats.tsx" />
                  <span className="text-xs text-gray-600" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-field="rating:unknown" data-magicpath-id="56" data-magicpath-path="BookEmotionStats.tsx">{review.rating}</span>
                </div>
              </div>
              <p className="text-gray-700 text-xs leading-relaxed mb-2" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-field="snippet:unknown" data-magicpath-id="57" data-magicpath-path="BookEmotionStats.tsx">{review.snippet}</p>
              <div className="flex flex-wrap gap-1" data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="58" data-magicpath-path="BookEmotionStats.tsx">
                {review.emotions.map(emotion => <span key={emotion} className="px-2 py-0.5 text-xs rounded-full border" style={{
              backgroundColor: `${getEmotionColor(emotion)}20`,
              borderColor: `${getEmotionColor(emotion)}40`,
              color: getEmotionColor(emotion)
            }} data-magicpath-uuid={(review as any)["mpid"] ?? "unsafe"} data-magicpath-id="59" data-magicpath-path="BookEmotionStats.tsx">
                    {emotion}
                  </span>)}
              </div>
            </div>)}
        </div>
      </div>
    </div>;
  const renderEmotions = () => <div className="space-y-6" data-magicpath-id="60" data-magicpath-path="BookEmotionStats.tsx">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100" data-magicpath-id="61" data-magicpath-path="BookEmotionStats.tsx">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center" data-magicpath-id="62" data-magicpath-path="BookEmotionStats.tsx">
          <PieChart className="w-5 h-5 mr-2 text-[#A8B5E8]" data-magicpath-id="63" data-magicpath-path="BookEmotionStats.tsx" />
          전체 감정 분석
        </h3>
        
        {/* Emotion Grid */}
        <div className="grid grid-cols-2 gap-4" data-magicpath-id="64" data-magicpath-path="BookEmotionStats.tsx">
          {bookData.emotionStats.map((stat, index) => <motion.div key={stat.emotion} initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: index * 0.1
        }} className="bg-gray-50 rounded-xl p-4 text-center" data-magicpath-id="65" data-magicpath-path="BookEmotionStats.tsx">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{
            backgroundColor: `${getEmotionColor(stat.emotion)}20`
          }} data-magicpath-id="66" data-magicpath-path="BookEmotionStats.tsx">
                <Heart className="w-6 h-6" style={{
              color: getEmotionColor(stat.emotion)
            }} data-magicpath-id="67" data-magicpath-path="BookEmotionStats.tsx" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1" data-magicpath-id="68" data-magicpath-path="BookEmotionStats.tsx">{stat.emotion}</h4>
              <div className="text-2xl font-bold text-gray-800 mb-1" data-magicpath-id="69" data-magicpath-path="BookEmotionStats.tsx">{stat.percentage}%</div>
              <div className="text-xs text-gray-600" data-magicpath-id="70" data-magicpath-path="BookEmotionStats.tsx">{stat.count}명의 독자</div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3" data-magicpath-id="71" data-magicpath-path="BookEmotionStats.tsx">
                <motion.div initial={{
              width: 0
            }} animate={{
              width: `${stat.percentage}%`
            }} transition={{
              delay: index * 0.1 + 0.5,
              duration: 0.8
            }} className="h-1 rounded-full" style={{
              backgroundColor: getEmotionColor(stat.emotion)
            }} data-magicpath-id="72" data-magicpath-path="BookEmotionStats.tsx" />
              </div>
            </motion.div>)}
        </div>
      </div>
    </div>;
  const renderTrends = () => <div className="space-y-6" data-magicpath-id="73" data-magicpath-path="BookEmotionStats.tsx">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100" data-magicpath-id="74" data-magicpath-path="BookEmotionStats.tsx">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center" data-magicpath-id="75" data-magicpath-path="BookEmotionStats.tsx">
          <TrendingUp className="w-5 h-5 mr-2 text-[#B5D4C8]" data-magicpath-id="76" data-magicpath-path="BookEmotionStats.tsx" />
          독서 트렌드
        </h3>
        
        <div className="space-y-4" data-magicpath-id="77" data-magicpath-path="BookEmotionStats.tsx">
          {bookData.trendData.map((trend, index) => <div key={trend.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl" data-magicpath-id="78" data-magicpath-path="BookEmotionStats.tsx">
              <div className="flex items-center space-x-4" data-magicpath-id="79" data-magicpath-path="BookEmotionStats.tsx">
                <div className="w-10 h-10 bg-[#B5D4C8] rounded-lg flex items-center justify-center" data-magicpath-id="80" data-magicpath-path="BookEmotionStats.tsx">
                  <Calendar className="w-5 h-5 text-white" data-magicpath-id="81" data-magicpath-path="BookEmotionStats.tsx" />
                </div>
                <div data-magicpath-id="82" data-magicpath-path="BookEmotionStats.tsx">
                  <div className="font-semibold text-gray-800" data-magicpath-id="83" data-magicpath-path="BookEmotionStats.tsx">{trend.month}</div>
                  <div className="text-xs text-gray-600" data-magicpath-id="84" data-magicpath-path="BookEmotionStats.tsx">독자 {trend.readers}명</div>
                </div>
              </div>
              <div className="text-right" data-magicpath-id="85" data-magicpath-path="BookEmotionStats.tsx">
                <div className="flex items-center space-x-1 mb-1" data-magicpath-id="86" data-magicpath-path="BookEmotionStats.tsx">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" data-magicpath-id="87" data-magicpath-path="BookEmotionStats.tsx" />
                  <span className="text-sm font-semibold text-gray-800" data-magicpath-id="88" data-magicpath-path="BookEmotionStats.tsx">{trend.avgRating}</span>
                </div>
                <div className="text-xs text-gray-600" data-magicpath-id="89" data-magicpath-path="BookEmotionStats.tsx">평균 평점</div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
  const renderReviews = () => <div className="space-y-6" data-magicpath-id="90" data-magicpath-path="BookEmotionStats.tsx">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100" data-magicpath-id="91" data-magicpath-path="BookEmotionStats.tsx">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center" data-magicpath-id="92" data-magicpath-path="BookEmotionStats.tsx">
          <Users className="w-5 h-5 mr-2 text-[#F4E4B8]" data-magicpath-id="93" data-magicpath-path="BookEmotionStats.tsx" />
          독자 리뷰 모음
        </h3>
        
        <div className="space-y-6" data-magicpath-id="94" data-magicpath-path="BookEmotionStats.tsx">
          {bookData.recentReviews.map(review => <div key={review.id} className="border border-gray-100 rounded-xl p-4" data-magicpath-id="95" data-magicpath-path="BookEmotionStats.tsx">
              <div className="flex items-center justify-between mb-3" data-magicpath-id="96" data-magicpath-path="BookEmotionStats.tsx">
                <div className="flex items-center space-x-3" data-magicpath-id="97" data-magicpath-path="BookEmotionStats.tsx">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-full flex items-center justify-center" data-magicpath-id="98" data-magicpath-path="BookEmotionStats.tsx">
                    <span className="text-white text-xs font-semibold" data-magicpath-id="99" data-magicpath-path="BookEmotionStats.tsx">
                      {review.userName.charAt(0)}
                    </span>
                  </div>
                  <div data-magicpath-id="100" data-magicpath-path="BookEmotionStats.tsx">
                    <div className="font-medium text-gray-800 text-sm" data-magicpath-id="101" data-magicpath-path="BookEmotionStats.tsx">{review.userName}</div>
                    <div className="text-xs text-gray-500" data-magicpath-id="102" data-magicpath-path="BookEmotionStats.tsx">
                      {review.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1" data-magicpath-id="103" data-magicpath-path="BookEmotionStats.tsx">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" data-magicpath-id="104" data-magicpath-path="BookEmotionStats.tsx" />
                  <span className="text-sm font-semibold text-gray-800" data-magicpath-id="105" data-magicpath-path="BookEmotionStats.tsx">{review.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed mb-3" data-magicpath-id="106" data-magicpath-path="BookEmotionStats.tsx">{review.snippet}</p>
              
              <div className="flex flex-wrap gap-2" data-magicpath-id="107" data-magicpath-path="BookEmotionStats.tsx">
                {review.emotions.map(emotion => <span key={emotion} className="px-3 py-1 text-xs rounded-full border font-medium" style={{
              backgroundColor: `${getEmotionColor(emotion)}15`,
              borderColor: `${getEmotionColor(emotion)}30`,
              color: getEmotionColor(emotion)
            }} data-magicpath-id="108" data-magicpath-path="BookEmotionStats.tsx">
                    {emotion}
                  </span>)}
              </div>
            </div>)}
        </div>
      </div>
    </div>;
  const tabs = [{
    id: 'overview',
    label: '개요',
    icon: Target,
    mpid: "e285bc9a-6b93-4f6f-a6b1-d6651b9d952b"
  }, {
    id: 'emotions',
    label: '감정',
    icon: Heart,
    mpid: "34135500-daca-4877-892e-ce8a433a133e"
  }, {
    id: 'trends',
    label: '트렌드',
    icon: TrendingUp,
    mpid: "5ce64377-2e75-462a-a8ab-8c1bbe022a72"
  }, {
    id: 'reviews',
    label: '리뷰',
    icon: Users,
    mpid: "8b040eb3-7cb0-4cf7-b224-1690289cb9b1"
  }] as any[];
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="min-h-screen px-4 py-8" data-magicpath-id="109" data-magicpath-path="BookEmotionStats.tsx">
      <div className="max-w-sm mx-auto" data-magicpath-id="110" data-magicpath-path="BookEmotionStats.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-magicpath-id="111" data-magicpath-path="BookEmotionStats.tsx">
          <button onClick={onBack} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors" data-magicpath-id="112" data-magicpath-path="BookEmotionStats.tsx">
            <ArrowLeft className="w-5 h-5 text-gray-600" data-magicpath-id="113" data-magicpath-path="BookEmotionStats.tsx" />
          </button>
          <div className="text-center" data-magicpath-id="114" data-magicpath-path="BookEmotionStats.tsx">
            <h1 className="text-xl font-bold text-gray-800" data-magicpath-id="115" data-magicpath-path="BookEmotionStats.tsx">독자 감정 통계</h1>
            <p className="text-sm text-gray-600" data-magicpath-id="116" data-magicpath-path="BookEmotionStats.tsx">데이터 기반 감정 분석</p>
          </div>
          <div className="w-10" data-magicpath-id="117" data-magicpath-path="BookEmotionStats.tsx" />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-6" data-magicpath-id="118" data-magicpath-path="BookEmotionStats.tsx">
          <div className="grid grid-cols-4 gap-1" data-magicpath-id="119" data-magicpath-path="BookEmotionStats.tsx">
            {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`relative flex flex-col items-center space-y-1 px-3 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`} data-magicpath-uuid={(tab as any)["mpid"] ?? "unsafe"} data-magicpath-id="120" data-magicpath-path="BookEmotionStats.tsx">
                  <Icon className="w-4 h-4" data-magicpath-uuid={(tab as any)["mpid"] ?? "unsafe"} data-magicpath-id="121" data-magicpath-path="BookEmotionStats.tsx" />
                  <span className="text-xs font-medium" data-magicpath-uuid={(tab as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:string" data-magicpath-id="122" data-magicpath-path="BookEmotionStats.tsx">{tab.label}</span>
                </button>;
          })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait" data-magicpath-id="123" data-magicpath-path="BookEmotionStats.tsx">
          <motion.div key={activeTab} initial={{
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
        }} data-magicpath-id="124" data-magicpath-path="BookEmotionStats.tsx">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'emotions' && renderEmotions()}
            {activeTab === 'trends' && renderTrends()}
            {activeTab === 'reviews' && renderReviews()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>;
};
export default BookEmotionStats;