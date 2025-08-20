import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import SearchInput from '../common/SearchInput';

export type SortType = 'recent' | 'title' | 'author';

interface WishlistFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
  totalCount: number;
  filteredCount: number;
}

const WishlistFilters: React.FC<WishlistFiltersProps> = ({
  searchQuery,
  onSearchChange,
  sortType,
  onSortChange,
  totalCount,
  filteredCount
}) => {
  const sortOptions = [
    { value: 'recent' as SortType, label: '최근 추가순' },
    { value: 'title' as SortType, label: '제목순' },
    { value: 'author' as SortType, label: '저자순' }
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="책 제목이나 저자를 검색하세요"
        size="md"
      />

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          총 <span className="font-semibold text-[#A8B5E8]">{filteredCount}권</span>
          {totalCount !== filteredCount && ` / ${totalCount}권`}
        </span>
      </div>

      {/* Sort Only */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">정렬:</span>
        </div>
        <select
          value={sortType}
          onChange={(e) => onSortChange(e.target.value as SortType)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#A8B5E8] w-full sm:w-auto"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default WishlistFilters; 