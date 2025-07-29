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
  mpid?: string;
}
interface MoodCardDetailProps {
  review: ReviewData;
  onBack: () => void;
  mpid?: string;
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
  }} className="min-h-screen px-4 py-8" data-magicpath-id="0" data-magicpath-path="MoodCardDetail.tsx">
      <div className="max-w-sm mx-auto" data-magicpath-id="1" data-magicpath-path="MoodCardDetail.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-magicpath-id="2" data-magicpath-path="MoodCardDetail.tsx">
          <button onClick={onBack} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors" data-magicpath-id="3" data-magicpath-path="MoodCardDetail.tsx">
            <ArrowLeft className="w-5 h-5 text-gray-600" data-magicpath-id="4" data-magicpath-path="MoodCardDetail.tsx" />
          </button>
          <h1 className="text-xl font-bold text-gray-800" data-magicpath-id="5" data-magicpath-path="MoodCardDetail.tsx">무드 카드</h1>
          <div className="w-10" data-magicpath-id="6" data-magicpath-path="MoodCardDetail.tsx" />
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
      }} className="mb-8" data-magicpath-id="7" data-magicpath-path="MoodCardDetail.tsx">
          <div className="aspect-square rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl" style={{
          background: getEmotionGradient()
        }} data-magicpath-id="8" data-magicpath-path="MoodCardDetail.tsx">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" data-magicpath-id="9" data-magicpath-path="MoodCardDetail.tsx">
              <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full" data-magicpath-id="10" data-magicpath-path="MoodCardDetail.tsx" />
              <div className="absolute bottom-8 left-8 w-24 h-24 border border-white/20 rounded-full" data-magicpath-id="11" data-magicpath-path="MoodCardDetail.tsx" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/10 rounded-full" data-magicpath-id="12" data-magicpath-path="MoodCardDetail.tsx" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between" data-magicpath-id="13" data-magicpath-path="MoodCardDetail.tsx">
              <div data-magicpath-id="14" data-magicpath-path="MoodCardDetail.tsx">
                <div className="flex items-center space-x-2 mb-4" data-magicpath-id="15" data-magicpath-path="MoodCardDetail.tsx">
                  <Heart className="w-6 h-6" data-magicpath-id="16" data-magicpath-path="MoodCardDetail.tsx" />
                  <span className="text-sm font-medium opacity-90" data-magicpath-id="17" data-magicpath-path="MoodCardDetail.tsx">BookMood</span>
                </div>
                
                <div className="mb-6" data-magicpath-id="18" data-magicpath-path="MoodCardDetail.tsx">
                  <p className="text-sm opacity-75 mb-2" data-magicpath-id="19" data-magicpath-path="MoodCardDetail.tsx">
                    {review.createdAt.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  </p>
                </div>
              </div>

              <div className="space-y-4" data-magicpath-id="20" data-magicpath-path="MoodCardDetail.tsx">
                <blockquote className="text-lg font-medium leading-relaxed" data-magicpath-id="21" data-magicpath-path="MoodCardDetail.tsx">
                  "{review.moodSummary}"
                </blockquote>

                <div className="flex flex-wrap gap-2" data-magicpath-id="22" data-magicpath-path="MoodCardDetail.tsx">
                  {review.emotions.slice(0, 3).map((emotion, index) => <span key={index} className="px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full" data-magicpath-uuid={(emotion as any)["mpid"] ?? "unsafe"} data-magicpath-id="23" data-magicpath-path="MoodCardDetail.tsx">
                      {emotion}
                    </span>)}
                </div>
              </div>

              <div className="flex items-center justify-between" data-magicpath-id="24" data-magicpath-path="MoodCardDetail.tsx">
                <div className="flex items-center space-x-2" data-magicpath-id="25" data-magicpath-path="MoodCardDetail.tsx">
                  <Sparkles className="w-4 h-4 opacity-75" />
                  <span className="text-xs opacity-75" data-magicpath-id="26" data-magicpath-path="MoodCardDetail.tsx">AI 생성</span>
                </div>
                <div className="text-xs opacity-75" data-magicpath-id="27" data-magicpath-path="MoodCardDetail.tsx">
                  #{review.id.slice(0, 8)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-8" data-magicpath-id="28" data-magicpath-path="MoodCardDetail.tsx">
          <button onClick={handleDownload} disabled={isDownloading} className="flex-1 py-4 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-2xl font-medium disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-shadow" data-magicpath-id="29" data-magicpath-path="MoodCardDetail.tsx">
            <Download className="w-5 h-5" data-magicpath-id="30" data-magicpath-path="MoodCardDetail.tsx" />
            <span data-magicpath-id="31" data-magicpath-path="MoodCardDetail.tsx">{isDownloading ? '생성 중...' : '다운로드'}</span>
          </button>

          <div className="relative" data-magicpath-id="32" data-magicpath-path="MoodCardDetail.tsx">
            <button onClick={() => setShowShareMenu(!showShareMenu)} className="px-6 py-4 bg-gradient-to-r from-[#B5D4C8] to-[#A8D4C8] text-white rounded-2xl font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow" data-magicpath-id="33" data-magicpath-path="MoodCardDetail.tsx">
              <Share2 className="w-5 h-5" data-magicpath-id="34" data-magicpath-path="MoodCardDetail.tsx" />
              <span data-magicpath-id="35" data-magicpath-path="MoodCardDetail.tsx">공유</span>
            </button>

            {showShareMenu && <motion.div initial={{
            opacity: 0,
            scale: 0.95,
            y: -10
          }} animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }} className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-lg z-10" data-magicpath-id="36" data-magicpath-path="MoodCardDetail.tsx">
                <div className="p-2" data-magicpath-id="37" data-magicpath-path="MoodCardDetail.tsx">
                  <button onClick={() => handleSocialShare('twitter')} className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors" data-magicpath-id="38" data-magicpath-path="MoodCardDetail.tsx">
                    <Twitter className="w-4 h-4 text-blue-400" data-magicpath-id="39" data-magicpath-path="MoodCardDetail.tsx" />
                    <span className="text-sm text-gray-800" data-magicpath-id="40" data-magicpath-path="MoodCardDetail.tsx">트위터</span>
                  </button>
                  <button onClick={() => handleSocialShare('facebook')} className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors" data-magicpath-id="41" data-magicpath-path="MoodCardDetail.tsx">
                    <Facebook className="w-4 h-4 text-blue-500" data-magicpath-id="42" data-magicpath-path="MoodCardDetail.tsx" />
                    <span className="text-sm text-gray-800" data-magicpath-id="43" data-magicpath-path="MoodCardDetail.tsx">페이스북</span>
                  </button>
                  <button onClick={() => handleSocialShare('instagram')} className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors" data-magicpath-id="44" data-magicpath-path="MoodCardDetail.tsx">
                    <Instagram className="w-4 h-4 text-pink-400" data-magicpath-id="45" data-magicpath-path="MoodCardDetail.tsx" />
                    <span className="text-sm text-gray-800" data-magicpath-id="46" data-magicpath-path="MoodCardDetail.tsx">인스타그램</span>
                  </button>
                  <div className="border-t border-gray-200 my-2" data-magicpath-id="47" data-magicpath-path="MoodCardDetail.tsx" />
                  <button onClick={handleCopyLink} className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-50 rounded-xl transition-colors" data-magicpath-id="48" data-magicpath-path="MoodCardDetail.tsx">
                    {copied ? <Check className="w-4 h-4 text-green-400" data-magicpath-id="49" data-magicpath-path="MoodCardDetail.tsx" /> : <Copy className="w-4 h-4 text-gray-600" data-magicpath-id="50" data-magicpath-path="MoodCardDetail.tsx" />}
                    <span className="text-sm text-gray-800" data-magicpath-id="51" data-magicpath-path="MoodCardDetail.tsx">
                      {copied ? '복사됨!' : '링크 복사'}
                    </span>
                  </button>
                </div>
              </motion.div>}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6" data-magicpath-id="52" data-magicpath-path="MoodCardDetail.tsx">
          {/* Metadata */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" data-magicpath-id="53" data-magicpath-path="MoodCardDetail.tsx">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center" data-magicpath-id="54" data-magicpath-path="MoodCardDetail.tsx">
              <Calendar className="w-5 h-5 mr-2" data-magicpath-id="55" data-magicpath-path="MoodCardDetail.tsx" />
              독서 정보
            </h2>
            
            <div className="space-y-4" data-magicpath-id="56" data-magicpath-path="MoodCardDetail.tsx">
              <div data-magicpath-id="57" data-magicpath-path="MoodCardDetail.tsx">
                <p className="text-sm font-medium text-gray-600 mb-1" data-magicpath-id="58" data-magicpath-path="MoodCardDetail.tsx">날짜</p>
                <p className="text-gray-800" data-magicpath-id="59" data-magicpath-path="MoodCardDetail.tsx">
                  {review.createdAt.toLocaleDateString('ko-KR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                </p>
              </div>

              <div data-magicpath-id="60" data-magicpath-path="MoodCardDetail.tsx">
                <p className="text-sm font-medium text-gray-600 mb-2" data-magicpath-id="61" data-magicpath-path="MoodCardDetail.tsx">감지된 감정</p>
                <div className="flex flex-wrap gap-2" data-magicpath-id="62" data-magicpath-path="MoodCardDetail.tsx">
                  {review.emotions.map((emotion, index) => <span key={index} className="px-3 py-1 text-sm bg-[#A8B5E8]/20 text-[#A8B5E8] rounded-full font-medium border border-[#A8B5E8]/30" data-magicpath-id="63" data-magicpath-path="MoodCardDetail.tsx">
                      {emotion}
                    </span>)}
                </div>
              </div>

              <div data-magicpath-id="64" data-magicpath-path="MoodCardDetail.tsx">
                <p className="text-sm font-medium text-gray-600 mb-2" data-magicpath-id="65" data-magicpath-path="MoodCardDetail.tsx">주제</p>
                <div className="flex flex-wrap gap-2" data-magicpath-id="66" data-magicpath-path="MoodCardDetail.tsx">
                  {review.topics.map((topic, index) => <span key={index} className="px-3 py-1 text-sm bg-[#B5D4C8]/20 text-[#B5D4C8] rounded-full font-medium flex items-center border border-[#B5D4C8]/30" data-magicpath-id="67" data-magicpath-path="MoodCardDetail.tsx">
                      <Tag className="w-3 h-3 mr-1" data-magicpath-id="68" data-magicpath-path="MoodCardDetail.tsx" />
                      {topic}
                    </span>)}
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" data-magicpath-id="69" data-magicpath-path="MoodCardDetail.tsx">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center" data-magicpath-id="70" data-magicpath-path="MoodCardDetail.tsx">
              <Sparkles className="w-5 h-5 mr-2" />
              AI 감정 분석
            </h3>
            
            <div className="space-y-4" data-magicpath-id="71" data-magicpath-path="MoodCardDetail.tsx">
              <div data-magicpath-id="72" data-magicpath-path="MoodCardDetail.tsx">
                <p className="text-sm font-medium text-gray-600 mb-2" data-magicpath-id="73" data-magicpath-path="MoodCardDetail.tsx">생성된 요약</p>
                <blockquote className="text-gray-800 italic border-l-4 border-[#A8B5E8] pl-4 py-2 bg-[#A8B5E8]/10 rounded-r-xl" data-magicpath-id="74" data-magicpath-path="MoodCardDetail.tsx">
                  "{review.moodSummary}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-gray-200" data-magicpath-id="75" data-magicpath-path="MoodCardDetail.tsx">
                <p className="text-xs text-gray-500" data-magicpath-id="76" data-magicpath-path="MoodCardDetail.tsx">
                  이 분석은 AI를 사용하여 당신의 독서 경험의 감정적 본질을 포착했습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Original Review */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" data-magicpath-id="77" data-magicpath-path="MoodCardDetail.tsx">
            <h3 className="text-lg font-semibold text-gray-800 mb-4" data-magicpath-id="78" data-magicpath-path="MoodCardDetail.tsx">원본 감상문</h3>
            <div className="prose prose-sm max-w-none" data-magicpath-id="79" data-magicpath-path="MoodCardDetail.tsx">
              <p className="text-gray-700 leading-relaxed" data-magicpath-id="80" data-magicpath-path="MoodCardDetail.tsx">
                {review.review}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-[#A8B5E8]/20 to-[#B5D4C8]/20 border border-gray-200 rounded-2xl p-6" data-magicpath-id="81" data-magicpath-path="MoodCardDetail.tsx">
            <h3 className="text-lg font-semibold text-gray-800 mb-4" data-magicpath-id="82" data-magicpath-path="MoodCardDetail.tsx">무드 카드 통계</h3>
            <div className="grid grid-cols-2 gap-4" data-magicpath-id="83" data-magicpath-path="MoodCardDetail.tsx">
              <div className="text-center" data-magicpath-id="84" data-magicpath-path="MoodCardDetail.tsx">
                <p className="text-2xl font-bold text-[#A8B5E8]" data-magicpath-id="85" data-magicpath-path="MoodCardDetail.tsx">{review.emotions.length}</p>
                <p className="text-sm text-gray-600" data-magicpath-id="86" data-magicpath-path="MoodCardDetail.tsx">감정</p>
              </div>
              <div className="text-center" data-magicpath-id="87" data-magicpath-path="MoodCardDetail.tsx">
                <p className="text-2xl font-bold text-[#B5D4C8]" data-magicpath-id="88" data-magicpath-path="MoodCardDetail.tsx">{review.topics.length}</p>
                <p className="text-sm text-gray-600" data-magicpath-id="89" data-magicpath-path="MoodCardDetail.tsx">주제</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && <div className="fixed inset-0 z-0" onClick={() => setShowShareMenu(false)} data-magicpath-id="90" data-magicpath-path="MoodCardDetail.tsx" />}
    </motion.div>;
};
export default MoodCardDetail;