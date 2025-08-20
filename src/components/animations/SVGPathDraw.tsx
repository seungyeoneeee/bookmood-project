import React from 'react';
import { motion } from 'framer-motion';

interface SVGPathDrawProps {
  pathData: string;
  strokeColor?: string;
  strokeWidth?: number;
  duration?: number;
  className?: string;
  trigger?: 'hover' | 'inView' | 'immediate';
}

export const SVGPathDraw: React.FC<SVGPathDrawProps> = ({
  pathData,
  strokeColor = "#3b82f6",
  strokeWidth = 2,
  duration = 2,
  className = "",
  trigger = 'hover'
}) => {
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration, ease: "easeInOut" },
        opacity: { duration: 0.2 }
      }
    }
  };

  const getInitialState = () => {
    return trigger === 'immediate' ? 'visible' : 'hidden';
  };

  const getAnimateState = () => {
    return trigger === 'immediate' ? 'visible' : undefined;
  };

  const getHoverState = () => {
    return trigger === 'hover' ? 'visible' : undefined;
  };

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={`w-full h-full ${className}`}
      initial={getInitialState()}
      animate={getAnimateState()}
      whileHover={getHoverState()}
      whileInView={trigger === 'inView' ? 'visible' : undefined}
    >
      <motion.path
        d={pathData}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="transparent"
        variants={pathVariants}
      />
    </motion.svg>
  );
};

// 미리 정의된 아이콘 패스들
export const iconPaths = {
  heart: "M100,30 C90,20 70,20 60,30 C50,40 50,60 60,70 L100,110 L140,70 C150,60 150,40 140,30 C130,20 110,20 100,30 Z",
  star: "M100,20 L110,70 L160,70 L120,100 L130,150 L100,120 L70,150 L80,100 L40,70 L90,70 Z",
  book: "M60,40 L140,40 L140,160 L100,140 L60,160 Z M100,40 L100,140",
  search: "M80,80 m-30,0 a30,30 0 1,1 60,0 a30,30 0 1,1 -60,0 M110,110 L130,130",
  arrow: "M60,100 L140,100 M120,80 L140,100 L120,120",
  check: "M70,100 L90,120 L130,80",
  close: "M70,70 L130,130 M130,70 L70,130",
  plus: "M100,70 L100,130 M70,100 L130,100"
};
