import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Zap, BookOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmotionFilterPageProps {
  onBack: () => void;
  onWishlistToggle?: (book: { isbn13: string }) => void;
  wishlistBooks?: string[];
}

const EmotionFilterPage: React.FC<EmotionFilterPageProps> = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Container with responsive max-width */}
      <div className="max-w-sm mx-auto lg:max-w-2xl xl:max-w-4xl bg-white min-h-screen lg:shadow-xl lg:mt-0 lg:rounded-none">
        {/* Header - responsive padding and layout */}
        <div className="flex items-center justify-between p-4 lg:p-6 xl:p-8 bg-white border-b border-gray-100">
          <button 
            onClick={onBack}
            className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
          </button>
          <h1 className="text-lg lg:text-2xl xl:text-3xl font-bold text-gray-800">감정 기반 검색</h1>
          <div className="w-10 lg:w-12" />
        </div>

        {/* Coming Soon Content - responsive layout */}
        <div className="flex flex-col items-center justify-center px-6 lg:px-12 xl:px-20 py-20 lg:py-32 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-full flex items-center justify-center mb-6 lg:mb-8"
          >
            <Heart className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-white" />
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-3 lg:mb-6"
          >
            감정 기반 검색
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 lg:text-lg xl:text-xl mb-6 lg:mb-10 leading-relaxed max-w-lg lg:max-w-2xl"
          >
            AI가 책의 줄거리를 분석해서<br />
            당신의 감정 상태에 맞는<br />
            완벽한 책을 추천해드릴게요!
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 lg:p-6 mb-8 lg:mb-12 max-w-md lg:max-w-lg"
          >
            <div className="flex items-center justify-center mb-2 lg:mb-3">
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-amber-800 font-medium text-sm lg:text-base">준비 중</span>
            </div>
            <p className="text-amber-700 text-xs lg:text-sm">
              더 정확한 감정 분석을 위해<br />
              AI 시스템을 준비하고 있어요
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-3 lg:space-y-4 w-full max-w-md lg:max-w-lg"
          >
            <div className="flex items-center text-gray-600 text-sm lg:text-base">
              <Zap className="w-4 h-4 lg:w-5 lg:h-5 mr-3 lg:mr-4 text-blue-500" />
              <span>10가지 감정 카테고리 분석</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm lg:text-base">
              <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 mr-3 lg:mr-4 text-green-500" />
              <span>개인별 맞춤 추천 시스템</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm lg:text-base">
              <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 mr-3 lg:mr-4 text-purple-500" />
              <span>AI 기반 줄거리 감정 분석</span>
            </div>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={() => navigate('/search')}
            className="w-full lg:max-w-md mt-12 lg:mt-16 py-4 lg:py-5 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-xl font-medium text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
          >
            일반 검색으로 이동
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmotionFilterPage;