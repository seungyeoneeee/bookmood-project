import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Heart, Calendar, Tag, Sparkles, Copy, Check, Twitter, Facebook, Instagram, BookOpen, User, Star } from 'lucide-react';
import { useBook } from '../../hooks/useBooks';
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
  
  // 책 정보 로딩
  const { book, loading: bookLoading } = useBook(review.bookId);
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
  }} className="min-h-screen bg-gray-50">
      <div className="px-4 md:px-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">무드 카드</h1>
          <div className="w-10" />
        </div>

        {/* 책 정보 섹션 */}
        {book && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100"
          >
            <div className="flex space-x-4">
              <img 
                src={book.cover_url || book.cover} 
                alt={book.title}
                className="w-20 h-28 object-cover rounded-xl shadow-sm flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                  {book.title}
                </h2>
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {book.author}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {book.publisher && (
                    <span className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {book.publisher}
                    </span>
                  )}
                  {book.pub_date && (
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {book.pub_date}
                    </span>
                  )}
                </div>
                
                {book.customer_review_rank && (
                  <div className="flex items-center mt-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm text-gray-600">
                      평점 {book.customer_review_rank}/10
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* 감상문 카드 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#A8B5E8] to-[#B5D4C8] rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">감상문</h3>
            </div>
            <div className="text-sm text-gray-500">
              {review.createdAt.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {review.review}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {review.emotions.map((emotion, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-[#A8B5E8] to-[#B5D4C8] text-white text-xs rounded-full font-medium"
              >
                {emotion}
              </span>
            ))}
          </div>
        </motion.div>

        {/* AI 요약 카드 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#A8B5E8]/10 to-[#B5D4C8]/10 rounded-2xl p-6 mb-6 border border-[#A8B5E8]/20"
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#A8B5E8] to-[#B5D4C8] rounded-full flex items-center justify-center mr-3">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">AI 감정 요약</h3>
          </div>
          
          <blockquote className="text-gray-700 italic text-lg leading-relaxed border-l-4 border-[#A8B5E8] pl-4">
            "{review.moodSummary}"
          </blockquote>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#A8B5E8]/20">
            <div className="flex items-center text-sm text-gray-500">
              <Sparkles className="w-4 h-4 mr-1" />
              AI 생성
            </div>
            <div className="text-xs text-gray-400">
              #{review.id.slice(0, 8)}
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

        {/* 주제 키워드 */}
        {review.topics && review.topics.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#B5D4C8] to-[#A8D4C8] rounded-full flex items-center justify-center mr-3">
                <Tag className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">주제 키워드</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {review.topics.map((topic, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full font-medium flex items-center"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* 통계 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-[#A8B5E8]/10 to-[#B5D4C8]/10 rounded-2xl p-6 mb-6 border border-[#A8B5E8]/20"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">감상문 통계</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#A8B5E8]">{review.emotions.length}</p>
              <p className="text-sm text-gray-600">감지된 감정</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#B5D4C8]">{review.topics.length}</p>
              <p className="text-sm text-gray-600">주제 키워드</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && <div className="fixed inset-0 z-0" onClick={() => setShowShareMenu(false)} />}
    </motion.div>;
};
export default MoodCardDetail;