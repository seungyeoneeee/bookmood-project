import React from 'react';
import { X } from 'lucide-react';

interface EmotionTagProps {
  emotion: string;
  color?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  removable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

const EmotionTag: React.FC<EmotionTagProps> = ({
  emotion,
  color,
  icon,
  selected = false,
  removable = false,
  size = 'md',
  onClick,
  onRemove,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const baseClasses = `
    inline-flex items-center rounded-full font-medium transition-all cursor-pointer
    ${sizeClasses[size]}
    ${className}
  `;

  const colorClasses = selected
    ? 'bg-[#A8B5E8] text-white border border-[#A8B5E8] shadow-md'
    : color
    ? `bg-[${color}]/10 text-[${color}] border border-[${color}]/20 hover:border-[${color}]/40`
    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300';

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <span
      onClick={handleClick}
      className={`${baseClasses} ${colorClasses} ${onClick ? 'hover:scale-105' : ''}`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      <span>{emotion}</span>
      {removable && (
        <button
          onClick={handleRemove}
          className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default EmotionTag; 