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
}
interface BookEmotionStatsProps {
  bookData: BookEmotionData;
  onBack: () => void;
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
  const renderOverview = () => <div className="space-y-6">
      {/* Book Info Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <img src={bookData.bookCover} alt={bookData.bookTitle} className="w-16 h-24 object-cover rounded-lg shadow-md" />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-800 mb-1">{bookData.bookTitle}</h2>
            <p className="text-gray-600 text-sm mb-2">{bookData.bookAuthor}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                <span>{bookData.totalReaders.toLocaleString()}명</span>
              </div>
              <div className="flex items-center">
                <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
                <span>{bookData.averageRating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-[#A8B5E8]/10 to-[#A8B5E8]/5 rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-[#A8B5E8] rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-bold text-gray-800">{bookData.totalReaders.toLocaleString()}</div>
            <div className="text-xs text-gray-600">총 독자 수</div>
          </div>
          
          <div className="bg-gradient-to-br from-[#F4E4B8]/10 to-[#F4E4B8]/5 rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-[#F4E4B8] rounded-lg flex items-center justify-center mx-auto mb-2">
              <Star className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-bold text-gray-800">{bookData.averageRating}</div>
            <div className="text-xs text-gray-600">평균 평점</div>
          </div>
          
          <div className="bg-gradient-to-br from-[#B5D4C8]/10 to-[#B5D4C8]/5 rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-[#B5D4C8] rounded-lg flex items-center justify-center mx-auto mb-2">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-bold text-gray-800">{bookData.emotionStats.length}</div>
            <div className="text-xs text-gray-600">감정 종류</div>
          </div>
          
          <div className="bg-gradient-to-br from-[#E8B5A8]/10 to-[#E8B5A8]/5 rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-[#E8B5A8] rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-bold text-gray-800">
              {bookData.emotionStats[0]?.emotion || 'N/A'}
            </div>
            <div className="text-xs text-gray-600">주요 감정</div>
          </div>
        </div>
      </div>

      {/* Top Emotions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-[#A8B5E8]" />
          독자 감정 분포
        </h3>
        <div className="space-y-3">
          {bookData.emotionStats.slice(0, 5).map((stat, index) => <div key={stat.emotion} className="flex items-center space-x-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">{stat.emotion}</span>
                  <span className="text-xs text-gray-600">{stat.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <motion.div initial={{
                width: 0
              }} animate={{
                width: `${stat.percentage}%`
              }} transition={{
                delay: index * 0.1,
                duration: 0.8
              }} className="h-2 rounded-full" style={{
                backgroundColor: getEmotionColor(stat.emotion)
              }} />
                </div>
              </div>
              <div className="text-xs text-gray-500 min-w-[40px] text-right">
                {stat.count}명
              </div>
            </div>)}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-[#B5D4C8]" />
          최근 독자 리뷰
        </h3>
        <div className="space-y-4">
          {bookData.recentReviews.slice(0, 3).map(review => <div key={review.id} className="border-l-4 border-[#A8B5E8]/30 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800 text-sm">{review.userName}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600">{review.rating}</span>
                </div>
              </div>
              <p className="text-gray-700 text-xs leading-relaxed mb-2">{review.snippet}</p>
              <div className="flex flex-wrap gap-1">
                {review.emotions.map(emotion => <span key={emotion} className="px-2 py-0.5 text-xs rounded-full border" style={{
              backgroundColor: `${getEmotionColor(emotion)}20`,
              borderColor: `${getEmotionColor(emotion)}40`,
              color: getEmotionColor(emotion)
            }}>
                    {emotion}
                  </span>)}
              </div>
            </div>)}
        </div>
      </div>
    </div>;
  const renderEmotions = () => <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-[#A8B5E8]" />
          전체 감정 분석
        </h3>
        
        {/* Emotion Grid */}
        <div className="grid grid-cols-2 gap-4">
          {bookData.emotionStats.map((stat, index) => <motion.div key={stat.emotion} initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: index * 0.1
        }} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{
            backgroundColor: `${getEmotionColor(stat.emotion)}20`
          }}>
                <Heart className="w-6 h-6" style={{
              color: getEmotionColor(stat.emotion)
            }} />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">{stat.emotion}</h4>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.percentage}%</div>
              <div className="text-xs text-gray-600">{stat.count}명의 독자</div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <motion.div initial={{
              width: 0
            }} animate={{
              width: `${stat.percentage}%`
            }} transition={{
              delay: index * 0.1 + 0.5,
              duration: 0.8
            }} className="h-1 rounded-full" style={{
              backgroundColor: getEmotionColor(stat.emotion)
            }} />
              </div>
            </motion.div>)}
        </div>
      </div>
    </div>;
  const renderTrends = () => <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-[#B5D4C8]" />
          독서 트렌드
        </h3>
        
        <div className="space-y-4">
          {bookData.trendData.map((trend, index) => <div key={trend.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#B5D4C8] rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{trend.month}</div>
                  <div className="text-xs text-gray-600">독자 {trend.readers}명</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold text-gray-800">{trend.avgRating}</span>
                </div>
                <div className="text-xs text-gray-600">평균 평점</div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
  const renderReviews = () => <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <Users className="w-5 h-5 mr-2 text-[#F4E4B8]" />
          독자 리뷰 모음
        </h3>
        
        <div className="space-y-6">
          {bookData.recentReviews.map(review => <div key={review.id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {review.userName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{review.userName}</div>
                    <div className="text-xs text-gray-500">
                      {review.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold text-gray-800">{review.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.snippet}</p>
              
              <div className="flex flex-wrap gap-2">
                {review.emotions.map(emotion => <span key={emotion} className="px-3 py-1 text-xs rounded-full border font-medium" style={{
              backgroundColor: `${getEmotionColor(emotion)}15`,
              borderColor: `${getEmotionColor(emotion)}30`,
              color: getEmotionColor(emotion)
            }}>
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
    icon: Target
  }, {
    id: 'emotions',
    label: '감정',
    icon: Heart
  }, {
    id: 'trends',
    label: '트렌드',
    icon: TrendingUp
  }, {
    id: 'reviews',
    label: '리뷰',
    icon: Users
  }] as any[];
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
            <h1 className="text-xl font-bold text-gray-800">독자 감정 통계</h1>
            <p className="text-sm text-gray-600">데이터 기반 감정 분석</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-4 gap-1">
            {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`relative flex flex-col items-center space-y-1 px-3 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>;
          })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
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
        }}>
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