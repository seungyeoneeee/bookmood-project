import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  showSearchButton?: boolean;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = '검색어를 입력하세요',
  size = 'md',
  showSearchButton = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-3 py-2 pl-9 text-sm',
    md: 'px-4 py-3 pl-11 text-base',
    lg: 'px-4 py-4 pl-12 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconPositions = {
    sm: 'left-3',
    md: 'left-4',
    lg: 'left-4'
  };

  const clearButtonPositions = {
    sm: 'right-2',
    md: 'right-3',
    lg: 'right-4'
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className={`
          w-full bg-white border border-gray-200 rounded-xl
          text-gray-800 placeholder-gray-400
          focus:outline-none focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20
          transition-all shadow-sm
          ${sizeClasses[size]}
        `}
      />
      
      {/* Search Icon */}
      <Search 
        className={`
          absolute top-1/2 transform -translate-y-1/2 text-gray-400
          ${iconSizes[size]} ${iconPositions[size]}
        `} 
      />
      
      {/* Clear Button */}
      {value && (
        <button
          onClick={handleClear}
          className={`
            absolute top-1/2 transform -translate-y-1/2
            hover:bg-gray-100 rounded-full p-1 transition-colors
            ${clearButtonPositions[size]}
          `}
        >
          <X className={`text-gray-400 hover:text-gray-600 ${iconSizes[size]}`} />
        </button>
      )}
      
      {/* Search Button */}
      {showSearchButton && (
        <button
          onClick={onSearch}
          disabled={!value.trim()}
          className={`
            absolute top-1/2 transform -translate-y-1/2
            bg-[#A8B5E8] text-white rounded-lg px-3 py-1
            hover:bg-[#8BB5E8] transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            ${clearButtonPositions[size]}
          `}
        >
          <Search className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput; 