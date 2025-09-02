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
type ViewType = 'login' | 'home' | 'search' | 'archive' | 'mood-detail' | 'settings' | 'wishlist' | 'emotion-stats' | 'emotion-filter' | 'reading-progress' | 'completed';
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
    id: 'completed',
    label: '내도서관',
    icon: Book,
    color: '#D4B5E8'
  }, {
    id: 'settings',
    label: '설정',
    icon: Settings,
    color: '#E8B5A8'
  }];
  const handleLogin = () => {
    console.log('Login clicked');
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Top Navigation - Only show on desktop */}
      {!isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="flex items-center justify-between py-3 px-8 max-w-7xl mx-auto">
              {/* Logo */}
              <button 
                onClick={() => onViewChange('home')} 
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-800 group-hover:text-[#A8B5E8] transition-colors duration-200">BookMood</h1>
              </button>

              {/* Navigation */}
              <div className="flex items-center space-x-6">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <motion.button 
                      key={item.id} 
                      initial={{ opacity: 0, y: -20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: index * 0.1 }} 
                      onClick={() => {
                        if (item.id === 'completed') {
                          window.location.href = '/completed';
                        } else {
                          onViewChange(item.id as ViewType);
                        }
                      }} 
                      className={`
                        relative flex items-center space-x-2 px-4 py-2.5 rounded-xl 
                        transition-all duration-300 ease-in-out group
                        ${isActive 
                          ? 'bg-white shadow-lg border-2 transform scale-105' 
                          : 'hover:bg-gray-50 hover:scale-105'
                        }
                      `}
                      style={isActive ? { 
                        borderColor: item.color,
                        backgroundColor: `${item.color}08`
                      } : {}}
                    >
                      <Icon 
                        className={`w-5 h-5 transition-colors duration-300 ${
                          isActive ? '' : 'group-hover:text-gray-600'
                        }`}
                        style={{ color: isActive ? item.color : '#6B7280' }} 
                      />
                      <span 
                        className={`text-sm font-medium transition-colors duration-300 ${
                          isActive ? '' : 'group-hover:text-gray-600'
                        }`}
                        style={{ color: isActive ? item.color : '#6B7280' }}
                      >
                        {item.label}
                      </span>

                    </motion.button>
                  );
                })}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] flex items-center justify-center shadow-sm">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                    {onLogout && (
                      <button 
                        onClick={onLogout} 
                        className="ml-3 text-sm text-gray-500 hover:text-red-600 transition-colors duration-200 font-medium"
                      >
                        로그아웃
                      </button>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={handleLogin} 
                    className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-xl hover:from-[#9AA8E5] hover:to-[#7DA8E5] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">로그인</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={isMobile ? "pb-20 pt-4 px-4" : "pt-24 pb-8 px-8"}>
        <div className={isMobile ? "" : "max-w-6xl mx-auto"}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Only show on mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
            <div className="flex items-center justify-around py-2 px-2 safe-bottom">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <motion.button 
                    key={item.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: index * 0.1 }} 
                    onClick={() => {
                      if (item.id === 'completed') {
                        window.location.href = '/completed';
                      } else {
                        onViewChange(item.id as ViewType);
                      }
                    }} 
                    className={`
                      relative flex flex-col items-center space-y-1 px-3 py-2 rounded-xl 
                      transition-all duration-300 ease-in-out group min-w-0 flex-1
                      ${isActive 
                        ? 'bg-white shadow-md transform -translate-y-1' 
                        : 'hover:bg-gray-50'
                      }
                    `}
                    style={isActive ? { 
                      backgroundColor: `${item.color}08`,
                      borderColor: `${item.color}40`
                    } : {}}
                  >
                    <Icon 
                      className={`w-6 h-6 transition-all duration-300 ${
                        isActive ? 'transform scale-110' : 'group-hover:scale-105'
                      }`}
                      style={{ color: isActive ? item.color : '#6B7280' }} 
                    />
                    <span 
                      className={`text-xs font-medium transition-colors duration-300 truncate ${
                        isActive ? 'font-semibold' : ''
                      }`}
                      style={{ color: isActive ? item.color : '#6B7280' }}
                    >
                      {item.label}
                    </span>

                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AppLayout;