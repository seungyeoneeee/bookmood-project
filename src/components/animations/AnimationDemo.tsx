import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MouseTrail } from './MouseTrail';
import { HoverLineEffect } from './HoverLineEffect';
import { SVGPathDraw, iconPaths } from './SVGPathDraw';
import { MagneticEffect } from './MagneticEffect';
import { 
  Heart, 
  Star, 
  BookOpen, 
  Search, 
  ArrowRight, 
  Check, 
  X, 
  Plus,
  Sparkles,
  Zap,
  Palette
} from 'lucide-react';

export const AnimationDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('all');
  const [showTrail, setShowTrail] = useState(false);

  const demoSections = [
    {
      id: 'trail',
      title: '🎯 마우스 트레일',
      description: '마우스 뒤에 따라다니는 부드러운 점들'
    },
    {
      id: 'hover',
      title: '✨ 호버 라인 효과',
      description: '호버시 그려지는 다양한 선 애니메이션'
    },
    {
      id: 'svg',
      title: '🎨 SVG 패스 그리기',
      description: '아이콘이 그려지는 애니메이션'
    },
    {
      id: 'magnetic',
      title: '🧲 자석 효과',
      description: '마우스에 끌려가는 버튼들'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white p-8">
      {/* 마우스 트레일 (토글 가능) */}
      <AnimatePresence>
        {showTrail && <MouseTrail />}
      </AnimatePresence>

      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          🎭 애니메이션 데모
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          마우스 움직임을 활용한 부드러운 CSS 애니메이션 효과들
        </p>
        
        {/* 트레일 토글 */}
        <motion.button
          onClick={() => setShowTrail(!showTrail)}
          className={`px-6 py-3 rounded-full border-2 transition-all duration-300 ${
            showTrail 
              ? 'bg-blue-500 border-blue-500 text-white' 
              : 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showTrail ? '트레일 끄기' : '트레일 켜기'} ✨
        </motion.button>
      </motion.div>

      {/* 데모 섹션 선택 */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <motion.button
          onClick={() => setActiveDemo('all')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeDemo === 'all' ? 'bg-purple-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          전체 보기
        </motion.button>
        {demoSections.map((section) => (
          <motion.button
            key={section.id}
            onClick={() => setActiveDemo(section.id)}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeDemo === section.id ? 'bg-purple-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {section.title}
          </motion.button>
        ))}
      </div>

      {/* 데모 컨텐츠 */}
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* 호버 라인 효과 데모 */}
        {(activeDemo === 'all' || activeDemo === 'hover') && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">✨ 호버 라인 효과</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <h3 className="text-lg mb-4">가로선</h3>
                <HoverLineEffect direction="horizontal" lineColor="bg-blue-400">
                  <span className="text-xl font-semibold p-4 block">Hover Me!</span>
                </HoverLineEffect>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg mb-4">세로선</h3>
                <HoverLineEffect direction="vertical" lineColor="bg-green-400">
                  <span className="text-xl font-semibold p-4 block">Hover Me!</span>
                </HoverLineEffect>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg mb-4">테두리</h3>
                <HoverLineEffect direction="both" lineColor="bg-purple-400">
                  <span className="text-xl font-semibold p-4 block">Hover Me!</span>
                </HoverLineEffect>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg mb-4">코너선</h3>
                <HoverLineEffect direction="corner" lineColor="bg-pink-400">
                  <span className="text-xl font-semibold p-4 block">Hover Me!</span>
                </HoverLineEffect>
              </div>
            </div>
          </motion.section>
        )}

        {/* SVG 패스 그리기 데모 */}
        {(activeDemo === 'all' || activeDemo === 'svg') && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">🎨 SVG 패스 그리기</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(iconPaths).map(([name, path]) => (
                <div key={name} className="text-center">
                  <h3 className="text-lg mb-2 capitalize">{name}</h3>
                  <div className="w-20 h-20 mx-auto">
                    <SVGPathDraw
                      pathData={path}
                      strokeColor="#3b82f6"
                      duration={2}
                      trigger="hover"
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 자석 효과 데모 */}
        {(activeDemo === 'all' || activeDemo === 'magnetic') && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">🧲 자석 효과</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <MagneticEffect strength={0.3} range={100}>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full text-white font-semibold shadow-lg">
                    <Heart className="inline mr-2" size={20} />
                    Magnetic Button
                  </button>
                </MagneticEffect>
              </div>
              
              <div className="text-center">
                <MagneticEffect strength={0.5} range={120}>
                  <button className="bg-gradient-to-r from-green-500 to-teal-600 px-8 py-4 rounded-full text-white font-semibold shadow-lg">
                    <Star className="inline mr-2" size={20} />
                    Strong Magnet
                  </button>
                </MagneticEffect>
              </div>
              
              <div className="text-center">
                <MagneticEffect strength={0.2} range={80}>
                  <button className="bg-gradient-to-r from-pink-500 to-rose-600 px-8 py-4 rounded-full text-white font-semibold shadow-lg">
                    <Sparkles className="inline mr-2" size={20} />
                    Gentle Magnet
                  </button>
                </MagneticEffect>
              </div>
            </div>
          </motion.section>
        )}

        {/* 아이콘 갤러리 */}
        {(activeDemo === 'all' || activeDemo === 'hover') && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">🎭 Lucide 아이콘 + 애니메이션</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
              {[
                Heart, Star, BookOpen, Search, ArrowRight, Check, X, Plus,
                Sparkles, Zap, Palette
              ].map((Icon, index) => (
                <MagneticEffect key={index} strength={0.3}>
                  <motion.div
                    className="bg-gradient-to-br from-purple-500 to-blue-600 p-4 rounded-xl cursor-pointer"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -5, 5, -5, 0],
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon size={24} className="text-white" />
                  </motion.div>
                </MagneticEffect>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* 푸터 정보 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-16 text-gray-400"
      >
        <p>💡 마우스를 움직여서 다양한 애니메이션 효과를 경험해보세요!</p>
        <p className="mt-2">🛠️ Framer Motion + Lucide React + Tailwind CSS로 제작</p>
      </motion.div>
    </div>
  );
};
