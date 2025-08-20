import React from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, BookOpen, Heart, User, Clock } from 'lucide-react';

export interface BaseBookData {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  rating?: number;
  publishedYear?: string;
  genre?: string;
  pages?: number;
  readerCount?: number;
  averageRating?: number;
}

interface BookCardProps {
  book: BaseBookData;
  onClick?: () => void;
  onWishlistToggle?: () => void;
  isInWishlist?: boolean;
  showActions?: boolean;
  compact?: boolean;
  additionalContent?: React.ReactNode;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onClick,
  onWishlistToggle,
  isInWishlist = false,
  showActions = true,
  compact = false,
  additionalContent,
  className = ''
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onWishlistToggle) {
      onWishlistToggle();
    }
  };

  if (compact) {
    return (
      <motion.div
        onClick={handleCardClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${className}`}
      >
        <div className="flex space-x-3">
          <img 
            src={book.cover} 
            alt={book.title}
            className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{book.title}</h4>
            <p className="text-gray-600 text-xs mb-1">{book.author}</p>
            {book.rating && (
              <div className="flex items-center">
                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                <span className="text-xs text-gray-600">{book.rating}</span>
              </div>
            )}
          </div>
          {showActions && onWishlistToggle && (
            <button
              onClick={handleWishlistClick}
              className={`p-1 rounded-full transition-colors ${
                isInWishlist 
                  ? 'bg-red-100 text-red-500' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-3 h-3 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
        {additionalContent}
      </motion.div>
    );
  }

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${className}`}
    >
      <div className="flex space-x-4">
        <img 
          src={book.cover} 
          alt={book.title}
          className="w-20 h-28 object-cover rounded-xl flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2">{book.author}</p>
          
          {/* Rating and Stats */}
          <div className="flex items-center space-x-3 mb-3">
            {book.rating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="text-sm font-medium text-gray-700">{book.rating}</span>
              </div>
            )}
            {book.readerCount && (
              <div className="flex items-center">
                <User className="w-4 h-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">{book.readerCount.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              {book.genre && (
                <span className="px-2 py-1 bg-gray-100 rounded-full">
                  {book.genre}
                </span>
              )}
              {book.publishedYear && (
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{book.publishedYear}</span>
                </div>
              )}
              {book.pages && (
                <div className="flex items-center">
                  <BookOpen className="w-3 h-3 mr-1" />
                  <span>{book.pages}p</span>
                </div>
              )}
            </div>
            
            {showActions && onWishlistToggle && (
              <button
                onClick={handleWishlistClick}
                className={`p-2 rounded-full transition-colors ${
                  isInWishlist 
                    ? 'bg-red-100 text-red-500' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>
      {additionalContent}
    </motion.div>
  );
};

export default BookCard; 