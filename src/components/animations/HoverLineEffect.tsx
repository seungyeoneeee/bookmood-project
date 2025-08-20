import React from 'react';
import { motion } from 'framer-motion';

interface HoverLineEffectProps {
  children: React.ReactNode;
  className?: string;
  lineColor?: string;
  direction?: 'horizontal' | 'vertical' | 'both' | 'corner';
}

export const HoverLineEffect: React.FC<HoverLineEffectProps> = ({
  children,
  className = '',
  lineColor = 'bg-blue-400',
  direction = 'horizontal'
}) => {
  const getLineVariants = () => {
    switch (direction) {
      case 'horizontal':
        return {
          initial: { width: 0 },
          animate: { width: '100%' },
          exit: { width: 0 }
        };
      case 'vertical':
        return {
          initial: { height: 0 },
          animate: { height: '100%' },
          exit: { height: 0 }
        };
      case 'both':
        return {
          initial: { width: 0, height: 0 },
          animate: { width: '100%', height: '100%' },
          exit: { width: 0, height: 0 }
        };
      case 'corner':
        return {
          initial: { scale: 0, rotate: 0 },
          animate: { scale: 1, rotate: 90 },
          exit: { scale: 0, rotate: 0 }
        };
      default:
        return {
          initial: { width: 0 },
          animate: { width: '100%' },
          exit: { width: 0 }
        };
    }
  };

  const getLineClasses = () => {
    const baseClasses = `absolute ${lineColor}`;
    switch (direction) {
      case 'horizontal':
        return `${baseClasses} h-0.5 bottom-0 left-0`;
      case 'vertical':
        return `${baseClasses} w-0.5 left-0 top-0`;
      case 'both':
        return `${baseClasses} inset-0 border-2 border-current`;
      case 'corner':
        return `${baseClasses} w-4 h-0.5 bottom-0 left-0 origin-left`;
      default:
        return `${baseClasses} h-0.5 bottom-0 left-0`;
    }
  };

  return (
    <motion.div
      className={`relative inline-block cursor-pointer ${className}`}
      initial="initial"
      whileHover="animate"
    >
      {children}
      <motion.div
        className={getLineClasses()}
        variants={getLineVariants()}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};
