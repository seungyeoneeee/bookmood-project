import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Plus, Sparkles } from 'lucide-react';

interface WishlistEmptyStateProps {
  hasSearchQuery?: boolean;
  onGoToSearch?: () => void;
}

const WishlistEmptyState: React.FC<WishlistEmptyStateProps> = ({
  hasSearchQuery = false,
  onGoToSearch
}) => {
  if (hasSearchQuery) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">검색 결과가 없습니다</h3>
        <p className="text-gray-600 mb-6">다른 검색어로 시도해보세요</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-full flex items-center justify-center mx-auto mb-8 relative">
        <Heart className="w-12 h-12 text-white" />
        {/* Floating effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">위시리스트가 비어있어요</h3>
      <p className="text-gray-600 mb-8 leading-relaxed">
        관심있는 책들을 위시리스트에 추가하고<br />
        나만의 독서 목록을 만들어보세요
      </p>

      {onGoToSearch && (
        <div className="space-y-4">
          <button
            onClick={onGoToSearch}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-xl font-medium hover:shadow-lg transition-shadow space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>책 검색하러 가기</span>
          </button>

          <div className="bg-[#A8B5E8]/10 rounded-2xl p-6 border border-[#A8B5E8]/20 mx-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#A8B5E8] rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-medium text-gray-800 mb-2">위시리스트 활용 팁</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 태그를 활용해 카테고리별로 분류하세요</li>
                  <li>• 메모 기능으로 읽고 싶은 이유를 기록하세요</li>
                  <li>• 정렬 기능으로 원하는 순서로 정리하세요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WishlistEmptyState; 