import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export const MouseTrail: React.FC = () => {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let frameId: number;
    let lastTime = 0;
    const throttleDelay = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now();
      
      if (currentTime - lastTime >= throttleDelay) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        
        setTrail(prev => {
          const newPoint: TrailPoint = {
            x: e.clientX,
            y: e.clientY,
            id: Date.now()
          };
          
          // 최대 15개 점만 유지
          const newTrail = [newPoint, ...prev].slice(0, 15);
          return newTrail;
        });
        
        lastTime = currentTime;
      }
    };

    // Trail 점들 자동 제거
    const cleanupInterval = setInterval(() => {
      setTrail(prev => prev.slice(0, -1));
    }, 50);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(cleanupInterval);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
            style={{
              left: point.x - 4,
              top: point.y - 4,
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ 
              opacity: 1 - (index * 0.1),
              scale: 1 - (index * 0.05)
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </AnimatePresence>
      
      {/* 메인 커서 */}
      <motion.div
        className="absolute w-4 h-4 border-2 border-blue-400 rounded-full"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28
        }}
      />
    </div>
  );
};
