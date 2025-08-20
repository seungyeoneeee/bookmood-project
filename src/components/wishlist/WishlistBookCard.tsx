import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Calendar, BookOpen, Tag, Clock, Edit3, Save, X, Trash2 } from 'lucide-react';
import BookCard, { BaseBookData } from '../common/BookCard';

export interface WishlistBook extends BaseBookData {
  addedAt: Date;
  tags: string[];
  notes?: string;
}

interface WishlistBookCardProps {
  book: WishlistBook;
  selected?: boolean;
  selectionMode?: boolean;
  onClick?: () => void;
  onSelect?: (selected: boolean) => void;
  onRemove?: () => void;
  onUpdate?: (book: WishlistBook) => void;
}

const WishlistBookCard: React.FC<WishlistBookCardProps> = ({
  book,
  selected = false,
  selectionMode = false,
  onClick,
  onSelect,
  onRemove,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingBook, setEditingBook] = useState<WishlistBook>(book);



  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '오늘';
    if (diffDays === 2) return '어제';
    if (diffDays <= 7) return `${diffDays}일 전`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}주 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const handleCardClick = () => {
    if (selectionMode && onSelect) {
      onSelect(!selected);
    } else if (onClick) {
      onClick();
    }
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editingBook);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingBook(book);
    setIsEditing(false);
  };

  const additionalContent = (
    <div className="mt-4 space-y-3">
      {/* Priority and Date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">

          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            <span>{formatDate(book.addedAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          {!selectionMode && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1.5 text-gray-400 hover:text-[#A8B5E8] hover:bg-[#A8B5E8]/10 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.();
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tags */}
      {book.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {book.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-[#A8B5E8]/10 text-[#A8B5E8] rounded-full text-xs font-medium"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Notes */}
      {book.notes && (
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700 leading-relaxed">{book.notes}</p>
        </div>
      )}

      {/* Selection Checkbox */}
      {selectionMode && (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect?.(e.target.checked)}
            className="w-4 h-4 text-[#A8B5E8] border-gray-300 rounded focus:ring-[#A8B5E8] focus:ring-2"
          />
          <span className="ml-2 text-sm text-gray-700">선택</span>
        </div>
      )}
    </div>
  );

  // Edit Modal
  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">책 정보 수정</h3>
          <button
            onClick={handleCancel}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">


          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">태그 (쉼표로 구분)</label>
            <input
              type="text"
              value={editingBook.tags.join(', ')}
              onChange={(e) => setEditingBook({
                ...editingBook,
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
              })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#A8B5E8]"
              placeholder="예: 개발, 실무, 필수독서"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
            <textarea
              value={editingBook.notes || ''}
              onChange={(e) => setEditingBook({ ...editingBook, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#A8B5E8] resize-none"
              placeholder="이 책에 대한 메모를 남겨보세요"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-[#A8B5E8] text-white rounded-lg font-medium hover:bg-[#8BB5E8] transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>저장</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <BookCard
      book={book}
      onClick={handleCardClick}
      showActions={false}
      className={`${selectionMode ? 'cursor-pointer' : ''} ${selected ? 'ring-2 ring-[#A8B5E8] ring-opacity-50' : ''}`}
      additionalContent={additionalContent}
    />
  );
};

export default WishlistBookCard; 