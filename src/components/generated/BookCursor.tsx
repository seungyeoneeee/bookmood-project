"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
export default function BookCursor() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
      setIsVisible(true);
    };
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Hide default cursor
    document.body.style.cursor = 'none';
    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.body.style.cursor = 'auto';
    };
  }, []);
  if (!isVisible) return null;
  return <motion.div className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference" style={{
    x: mousePosition.x - 12,
    y: mousePosition.y - 12
  }} initial={{
    scale: 0,
    opacity: 0
  }} animate={{
    scale: 1,
    opacity: 1
  }} transition={{
    type: "spring",
    stiffness: 500,
    damping: 28
  }}>
      {/* Book Icon Cursor */}
      <motion.div className="relative" animate={{
      rotate: [0, 5, -5, 0]
    }} transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}>
        {/* Book Body */}
        <div className="w-6 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-sm shadow-lg relative">
          {/* Book Pages */}
          <div className="absolute top-1 left-1 right-1 bottom-1 bg-white rounded-sm opacity-90">
            <div className="w-full h-0.5 bg-gray-300 mt-1"></div>
            <div className="w-full h-0.5 bg-gray-300 mt-1"></div>
            <div className="w-full h-0.5 bg-gray-300 mt-1"></div>
          </div>
          
          {/* Book Spine */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-700 rounded-l-sm"></div>
        </div>
        
        {/* Pointer Tip */}
        <motion.div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-gray-800 rounded-full shadow-md" animate={{
        scale: [1, 1.2, 1]
      }} transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}>
          {/* Inner dot */}
          <div className="absolute inset-1 bg-gray-800 rounded-full"></div>
        </motion.div>
        
        {/* Glow Effect */}
        <motion.div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-sm opacity-30 blur-sm" animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.1, 1]
      }} transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
      </motion.div>
    </motion.div>;
}