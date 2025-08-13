import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Heart, Calendar, Tag, Sparkles, Copy, Check, Twitter, Facebook, Instagram } from 'lucide-react';
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
interface MoodCardDetailProps {
  review: ReviewData;
  onBack: () => void;
}
const MoodCardDetail: React.FC<MoodCardDetailProps> = ({
  review,
  onBack
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleDownload = async () => {
    setIsDownloading(true);
    // Mock download process
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsDownloading(false);
  };
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };
  const handleSocialShare = (platform: string) => {
    const text = `내 독서 무드 카드를 확인해보세요: "${review.moodSummary}"`;
    const url = window.location.href;
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'instagram':
        handleCopyLink();
        return;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  // Generate a gradient based on emotions
  const getEmotionGradient = () => {
    const emotionColors: Record<string, string> = {
      happy: '#F4E4B8',
      sad: '#A8B5E8',
      excited: '#F4E4B8',
      contemplative: '#A8B5E8',
      melancholic: '#8BB5E8',
      hopeful: '#B5D4C8',
      anxious: '#A8B5E8',
      thrilled: '#F4E4B8',
      inspired: '#B5D4C8',
      curious: '#A8B5E8',
      satisfied: '#B5D4C8',
      peaceful: '#B5D4C8'
    };
    const colors = review.emotions.slice(0, 3).map(emotion => emotionColors[emotion.toLowerCase()] || '#A8B5E8');
    if (colors.length === 1) {
      return `linear-gradient(135deg, ${colors[0]}, ${colors[0]}80)`;
    } else if (colors.length === 2) {
      return `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
    } else {
      return `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`;
    }
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="min-h-screen px-4 py-8">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">무드 카드</h1>
          <div className="w-10" />
        </div>

        {/* Main Mood Card */}
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: 0.2
      }} className="mb-8">
          <div className="aspect-square rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl" style={{
          background: getEmotionGradient()
        }}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full" />
              <div className="absolute bottom-8 left-8 w-24 h-24 border border-white/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/10 rounded-full" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="w-6 h-6" />
                  <span className="text-sm font-medium opacity-90">BookMood</span>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm opacity-75 mb-2">
                    {review.createdAt.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <blockquote className="text-lg font-medium leading-relaxed">
                  "{review.moodSummary}"
                </blockquote>

                <div className="flex flex-wrap gap-2">
                  {review.emotions.slice(0, 3).map((emotion, index) => <span key={index} className="px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full">
                      {emotion}
                    </span>)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 opacity-75" />
                  <span className="text-xs opacity-75">AI 생성</span>
                </div>
                <div className="text-xs opacity-75">
                  #{review.id.slice(0, 8)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-8">
          <button onClick={handleDownload} disabled={isDownloading} className="flex-1 py-4 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-2xl font-medium disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-shadow">
            <Download className="w-5 h-5" />
            <span>{isDownloading ? '생성 중...' : '다운로드'}</span>
          </button>

          <div className="relative">
            <button onClick={() => setShowShareMenu(!showShareMenu)} className="px-6 py-4 bg-gradient-to-r from-[#B5D4C8] to-[#A8D4C8] text-white rounded-2xl font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow">
              <Share2 className="w-5 h-5" />
              <span>공유</span>
            </button>

            {showShareMenu && <motion.div initial={{
            opacity: 0,
            scale: 0.95,
            y: -10
          }} animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }} className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-lg z-10">
                <div className="p-2">
                  <button onClick={() => handleSocialShare('twitter')} className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                    <Twitter className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-800">트위터</span>
                  </button>
                  <button onClick={() => handleSocialShare('facebook')} className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                    <Facebook className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-800">페이스북</span>
                  </button>
                  <button onClick={() => handleSocialShare('instagram')} className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span className="text-sm text-gray-800">인스타그램</span>
                  </button>
                  <div className="border-t border-gray-200 my-2" />
                  <button onClick={handleCopyLink} className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-600" />}
                    <span className="text-sm text-gray-800">
                      {copied ? '복사됨!' : '링크 복사'}
                    </span>
                  </button>
                </div>
              </motion.div>}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Metadata */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              독서 정보
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">날짜</p>
                <p className="text-gray-800">
                  {review.createdAt.toLocaleDateString('ko-KR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">감지된 감정</p>
                <div className="flex flex-wrap gap-2">
                  {review.emotions.map((emotion, index) => <span key={index} className="px-3 py-1 text-sm bg-[#A8B5E8]/20 text-[#A8B5E8] rounded-full font-medium border border-[#A8B5E8]/30">
                      {emotion}
                    </span>)}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">주제</p>
                <div className="flex flex-wrap gap-2">
                  {review.topics.map((topic, index) => <span key={index} className="px-3 py-1 text-sm bg-[#B5D4C8]/20 text-[#B5D4C8] rounded-full font-medium flex items-center border border-[#B5D4C8]/30">
                      <Tag className="w-3 h-3 mr-1" />
                      {topic}
                    </span>)}
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              AI 감정 분석
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">생성된 요약</p>
                <blockquote className="text-gray-800 italic border-l-4 border-[#A8B5E8] pl-4 py-2 bg-[#A8B5E8]/10 rounded-r-xl">
                  "{review.moodSummary}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  이 분석은 AI를 사용하여 당신의 독서 경험의 감정적 본질을 포착했습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Original Review */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">원본 감상문</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {review.review}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-[#A8B5E8]/20 to-[#B5D4C8]/20 border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">무드 카드 통계</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#A8B5E8]">{review.emotions.length}</p>
                <p className="text-sm text-gray-600">감정</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#B5D4C8]">{review.topics.length}</p>
                <p className="text-sm text-gray-600">주제</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && <div className="fixed inset-0 z-0" onClick={() => setShowShareMenu(false)} />}
    </motion.div>;
};
export default MoodCardDetail;