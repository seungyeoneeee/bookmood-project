import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import WishlistFilters, { SortType } from './WishlistFilters';
import WishlistBookCard, { WishlistBook } from './WishlistBookCard';
import WishlistActions from './WishlistActions';
import WishlistEmptyState from './WishlistEmptyState';

interface WishlistManagerProps {
  onBack: () => void;
  onBookSelect?: (book: WishlistBook) => void;
  wishlistBooks?: WishlistBook[];
  onWishlistUpdate?: () => void;
}

const NewWishlistManager: React.FC<WishlistManagerProps> = ({
  onBack,
  onBookSelect,
  wishlistBooks: externalWishlistBooks = [],
  onWishlistUpdate
}) => {
  const navigate = useNavigate();
  
  // State - 외부에서 받은 데이터 사용
  const [localWishlistBooks, setLocalWishlistBooks] = useState<WishlistBook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('recent');
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // 외부에서 받은 위시리스트 데이터 사용
  useEffect(() => {
    setLocalWishlistBooks(externalWishlistBooks);
  }, [externalWishlistBooks]);

  // Filtered and sorted books
  const filteredBooks = useMemo(() => {
    let filtered = localWishlistBooks;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortType) {
        case 'recent':
          return b.addedAt.getTime() - a.addedAt.getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        default:
          return 0;
      }
    });

    return sorted;
  }, [localWishlistBooks, searchQuery, sortType]);

  // Handlers
  const handleBookSelect = (bookId: string, selected: boolean) => {
    setSelectedBooks(prev =>
      selected
        ? [...prev, bookId]
        : prev.filter(id => id !== bookId)
    );
  };

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedBooks([]);
  };

  const handleSelectAll = () => {
    setSelectedBooks(filteredBooks.map(book => book.id));
  };

  const handleDeselectAll = () => {
    setSelectedBooks([]);
  };

  const handleDeleteSelected = async () => {
    if (selectedBooks.length === 0) return;
    
    if (confirm(`선택한 ${selectedBooks.length}권의 책을 위시리스트에서 제거하시겠습니까?`)) {
      try {
        // 로컬에서 즉시 제거
        setLocalWishlistBooks(prev => prev.filter(book => !selectedBooks.includes(book.id)));
        setSelectedBooks([]);
        setIsSelectionMode(false);
        // 외부 상태도 업데이트
        onWishlistUpdate?.();
      } catch (error) {
        console.error('선택된 책들 제거 실패:', error);
      }
    }
  };

  const handleBookUpdate = (updatedBook: WishlistBook) => {
    setLocalWishlistBooks(prev =>
      prev.map(book => book.id === updatedBook.id ? updatedBook : book)
    );
    // 외부 상태도 업데이트
    onWishlistUpdate?.();
  };

  const handleBookRemove = async (bookId: string) => {
    if (confirm('이 책을 위시리스트에서 제거하시겠습니까?')) {
      try {
        // 실제 API에서 제거
        const bookToRemove = localWishlistBooks.find(book => book.id === bookId);
        if (bookToRemove) {
          // AppRouter의 handleWishlistToggle을 통해 실제 삭제 수행
          // 임시로 로컬에서 제거하고 외부 업데이트 호출
          setLocalWishlistBooks(prev => prev.filter(book => book.id !== bookId));
          onWishlistUpdate?.();
        }
      } catch (error) {
        console.error('위시리스트 제거 실패:', error);
      }
    }
  };

  const handleBookClick = (book: WishlistBook) => {
    if (onBookSelect) {
      onBookSelect(book);
    } else {
      navigate(`/books/${book.id}`);
    }
  };

  const handleGoToSearch = () => {
    navigate('/search');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen"
    >
      <div className="px-4 md:px-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">위시리스트</h1>
          <div className="w-10" />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <WishlistFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortType={sortType}
            onSortChange={setSortType}
            totalCount={localWishlistBooks.length}
            filteredCount={filteredBooks.length}
          />
        </div>

        {/* Actions */}
        {localWishlistBooks.length > 0 && (
          <div className="mb-6">
            <WishlistActions
              isSelectionMode={isSelectionMode}
              selectedCount={selectedBooks.length}
              totalCount={filteredBooks.length}
              onToggleSelectionMode={handleToggleSelectionMode}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onDeleteSelected={handleDeleteSelected}
            />
          </div>
        )}

        {/* Content */}
        {filteredBooks.length > 0 ? (
          <div className="space-y-4">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <WishlistBookCard
                  book={book}
                  selected={selectedBooks.includes(book.id)}
                  selectionMode={isSelectionMode}
                  onClick={() => handleBookClick(book)}
                  onSelect={(selected) => handleBookSelect(book.id, selected)}
                  onRemove={() => handleBookRemove(book.id)}
                  onUpdate={handleBookUpdate}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <WishlistEmptyState
            hasSearchQuery={!!searchQuery}
            onGoToSearch={handleGoToSearch}
          />
        )}
      </div>
    </motion.div>
  );
};

export default NewWishlistManager; 