"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Book, Home, Archive, Settings, User, LogIn, Heart, BookOpen, BarChart3, Bookmark } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
type ViewType = 'login' | 'home' | 'search' | 'archive' | 'mood-detail' | 'settings' | 'wishlist' | 'emotion-stats' | 'emotion-filter' | 'reading-progress';
interface AppLayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  user: User | null;
  onLogout?: () => void;
}
const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentView,
  onViewChange,
  user,
  onLogout
}) => {
  const isMobile = useIsMobile();
  const navigationItems = [{
    id: 'home',
    label: '홈',
    icon: Home,
    color: '#A8B5E8'
  }, {
    id: 'search',
    label: '검색',
    icon: BookOpen,
    color: '#8BB5E8'
  }, {
    id: 'archive',
    label: '아카이브',
    icon: Bookmark,
    color: '#B5D4C8'
  }, {
    id: 'wishlist',
    label: '찜한책',
    icon: Heart,
    color: '#F4E4B8'
  }, {
    id: 'settings',
    label: '설정',
    icon: Settings,
    color: '#E8B5A8'
  }] as any[];
  const handleLogin = () => {
    console.log('Login clicked');
  };
  return <div className="min-h-screen bg-white">
      {/* Desktop Top Navigation - Only show on desktop */}
      {!isMobile && <div className="fixed top-0 left-0 right-0 z-50">
          <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="flex items-center justify-between py-4 px-6">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-800">BookMood</h1>
              </div>

              {/* Navigation */}
              <div className="flex items-center space-x-8">
                {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return <motion.button key={item.id} initial={{
                opacity: 0,
                y: -20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: index * 0.1
              }} onClick={() => onViewChange(item.id as ViewType)} className={`
                        relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200
                        ${isActive ? 'bg-gradient-to-r shadow-lg' : 'hover:bg-gray-50'}
                      `} style={isActive ? {
                background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
                borderColor: `${item.color}30`
              } : {}}>
                      <Icon className="w-5 h-5" style={{
                  color: isActive ? item.color : '#6B7280'
                }} />
                      <span className="text-sm font-medium" style={{
                  color: isActive ? item.color : '#6B7280'
                }}>
                        {item.label}
                      </span>
                      {isActive && <motion.div layoutId="activeDesktopTab" className="absolute inset-0 rounded-xl border-2" style={{
                  backgroundColor: `${item.color}10`,
                  borderColor: `${item.color}40`
                }} initial={false} transition={{
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.6
                }} />}
                    </motion.button>;
            })}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                {user ? <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] flex items-center justify-center">
                      {user.avatar ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" /> : <User className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    {onLogout && <button onClick={onLogout} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        로그아웃
                      </button>}
                  </div> : <button onClick={handleLogin} className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-xl hover:from-[#9AA8E5] hover:to-[#7DA8E5] transition-all duration-200">
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">로그인</span>
                  </button>}
              </div>
            </div>
          </div>
        </div>}

      {/* Main Content */}
      <main className={isMobile ? "pb-0" : "pt-20 pb-8"}>
        {children}
      </main>

      {/* Mobile Bottom Navigation - Only show on mobile */}
      {isMobile && <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
            <div className="flex items-center justify-around py-3 px-4">
              {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return <motion.button key={item.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.1
            }} onClick={() => onViewChange(item.id as ViewType)} className={`
                      relative flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200
                      ${isActive ? 'bg-gradient-to-r shadow-lg' : 'hover:bg-gray-50'}
                    `} style={isActive ? {
              background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
              borderColor: `${item.color}30`
            } : {}}>
                    <Icon className="w-6 h-6" style={{
                color: isActive ? item.color : '#6B7280'
              }} />
                    <span className="text-xs font-medium" style={{
                color: isActive ? item.color : '#6B7280'
              }}>
                      {item.label}
                    </span>
                    {isActive && <motion.div layoutId="activeMobileTab" className="absolute inset-0 rounded-xl border-2" style={{
                backgroundColor: `${item.color}10`,
                borderColor: `${item.color}40`
              }} initial={false} transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.6
              }} />}
                  </motion.button>;
          })}
            </div>
          </div>
        </div>}
    </div>;
};
export default AppLayout;