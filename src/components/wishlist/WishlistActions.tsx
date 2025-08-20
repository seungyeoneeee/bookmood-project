import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Trash2, CheckSquare } from 'lucide-react';

interface WishlistActionsProps {
  isSelectionMode: boolean;
  selectedCount: number;
  totalCount: number;
  onToggleSelectionMode: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
}

const WishlistActions: React.FC<WishlistActionsProps> = ({
  isSelectionMode,
  selectedCount,
  totalCount,
  onToggleSelectionMode,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
      {/* Selection Mode Toggle */}
      <button
        onClick={onToggleSelectionMode}
        className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
          isSelectionMode
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-[#A8B5E8] text-white hover:bg-[#8BB5E8]'
        }`}
      >
        {isSelectionMode ? (
          <>
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">선택 취소</span>
            <span className="sm:hidden">취소</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            <span className="hidden sm:inline">선택 모드</span>
            <span className="sm:hidden">선택</span>
          </>
        )}
      </button>

      {/* Selection Actions */}
      <AnimatePresence>
        {isSelectionMode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3"
          >
            {/* Selected Count */}
            <div className="text-sm text-gray-600 text-center sm:text-left">
              {selectedCount}개 선택됨
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={onSelectAll}
                disabled={selectedCount === totalCount}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center space-x-1"
              >
                <CheckSquare className="w-3 h-3" />
                <span className="hidden sm:inline">전체선택</span>
                <span className="sm:hidden">전체</span>
              </button>
              <button
                onClick={onDeselectAll}
                disabled={selectedCount === 0}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                해제
              </button>
              <button
                onClick={onDeleteSelected}
                disabled={selectedCount === 0}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 disabled:opacity-50 transition-colors flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>삭제</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WishlistActions; 