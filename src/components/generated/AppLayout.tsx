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
  mpid?: string;
}
type ViewType = 'login' | 'home' | 'search' | 'archive' | 'mood-detail' | 'settings' | 'wishlist' | 'emotion-stats' | 'emotion-filter' | 'reading-progress';
interface AppLayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  user: User | null;
  onLogout?: () => void;
  mpid?: string;
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
    color: '#A8B5E8',
    mpid: "f05ff08d-39dc-4d19-b62c-2a0083e0ace8"
  }, {
    id: 'search',
    label: '검색',
    icon: BookOpen,
    color: '#8BB5E8',
    mpid: "e9b547ac-9f51-4975-8566-f63f55a825d6"
  }, {
    id: 'archive',
    label: '아카이브',
    icon: Bookmark,
    color: '#B5D4C8',
    mpid: "a0f3c58f-5d23-4e16-aa88-223313c3ddbd"
  }, {
    id: 'wishlist',
    label: '찜한책',
    icon: Heart,
    color: '#F4E4B8',
    mpid: "b4aabb9b-5db3-478e-9759-227b49825933"
  }, {
    id: 'settings',
    label: '설정',
    icon: Settings,
    color: '#E8B5A8',
    mpid: "2601f559-b385-406b-aa8e-8b48c38414ce"
  }] as any[];
  const handleLogin = () => {
    console.log('Login clicked');
  };
  return <div className="min-h-screen bg-white" data-magicpath-id="0" data-magicpath-path="AppLayout.tsx">
      {/* Desktop Top Navigation - Only show on desktop */}
      {!isMobile && <div className="fixed top-0 left-0 right-0 z-50" data-magicpath-id="1" data-magicpath-path="AppLayout.tsx">
          <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm" data-magicpath-id="2" data-magicpath-path="AppLayout.tsx">
            <div className="flex items-center justify-between py-4 px-6" data-magicpath-id="3" data-magicpath-path="AppLayout.tsx">
              {/* Logo */}
              <div className="flex items-center space-x-3" data-magicpath-id="4" data-magicpath-path="AppLayout.tsx">
                <div className="w-8 h-8 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-lg flex items-center justify-center" data-magicpath-id="5" data-magicpath-path="AppLayout.tsx">
                  <Heart className="w-5 h-5 text-white" data-magicpath-id="6" data-magicpath-path="AppLayout.tsx" />
                </div>
                <h1 className="text-xl font-bold text-gray-800" data-magicpath-id="7" data-magicpath-path="AppLayout.tsx">BookMood</h1>
              </div>

              {/* Navigation */}
              <div className="flex items-center space-x-8" data-magicpath-id="8" data-magicpath-path="AppLayout.tsx">
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
              } : {}} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="9" data-magicpath-path="AppLayout.tsx">
                      <Icon className="w-5 h-5" style={{
                  color: isActive ? item.color : '#6B7280'
                }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="10" data-magicpath-path="AppLayout.tsx" />
                      <span className="text-sm font-medium" style={{
                  color: isActive ? item.color : '#6B7280'
                }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:unknown" data-magicpath-id="11" data-magicpath-path="AppLayout.tsx">
                        {item.label}
                      </span>
                      {isActive && <motion.div layoutId="activeDesktopTab" className="absolute inset-0 rounded-xl border-2" style={{
                  backgroundColor: `${item.color}10`,
                  borderColor: `${item.color}40`
                }} initial={false} transition={{
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.6
                }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="12" data-magicpath-path="AppLayout.tsx" />}
                    </motion.button>;
            })}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4" data-magicpath-id="13" data-magicpath-path="AppLayout.tsx">
                {user ? <div className="flex items-center space-x-3" data-magicpath-id="14" data-magicpath-path="AppLayout.tsx">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] flex items-center justify-center" data-magicpath-id="15" data-magicpath-path="AppLayout.tsx">
                      {user.avatar ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" data-magicpath-id="16" data-magicpath-path="AppLayout.tsx" /> : <User className="w-4 h-4 text-white" data-magicpath-id="17" data-magicpath-path="AppLayout.tsx" />}
                    </div>
                    <span className="text-sm font-medium text-gray-700" data-magicpath-id="18" data-magicpath-path="AppLayout.tsx">{user.name}</span>
                    {onLogout && <button onClick={onLogout} className="text-sm text-gray-500 hover:text-gray-700 transition-colors" data-magicpath-id="19" data-magicpath-path="AppLayout.tsx">
                        로그아웃
                      </button>}
                  </div> : <button onClick={handleLogin} className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-xl hover:from-[#9AA8E5] hover:to-[#7DA8E5] transition-all duration-200" data-magicpath-id="20" data-magicpath-path="AppLayout.tsx">
                    <LogIn className="w-4 h-4" data-magicpath-id="21" data-magicpath-path="AppLayout.tsx" />
                    <span className="text-sm font-medium" data-magicpath-id="22" data-magicpath-path="AppLayout.tsx">로그인</span>
                  </button>}
              </div>
            </div>
          </div>
        </div>}

      {/* Main Content */}
      <main className={isMobile ? "pb-0" : "pt-20 pb-8"} data-magicpath-id="23" data-magicpath-path="AppLayout.tsx">
        {children}
      </main>

      {/* Mobile Bottom Navigation - Only show on mobile */}
      {isMobile && <div className="fixed bottom-0 left-0 right-0 z-50" data-magicpath-id="24" data-magicpath-path="AppLayout.tsx">
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg" data-magicpath-id="25" data-magicpath-path="AppLayout.tsx">
            <div className="flex items-center justify-around py-3 px-4" data-magicpath-id="26" data-magicpath-path="AppLayout.tsx">
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
            } : {}} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="27" data-magicpath-path="AppLayout.tsx">
                    <Icon className="w-6 h-6" style={{
                color: isActive ? item.color : '#6B7280'
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="28" data-magicpath-path="AppLayout.tsx" />
                    <span className="text-xs font-medium" style={{
                color: isActive ? item.color : '#6B7280'
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:unknown" data-magicpath-id="29" data-magicpath-path="AppLayout.tsx">
                      {item.label}
                    </span>
                    {isActive && <motion.div layoutId="activeMobileTab" className="absolute inset-0 rounded-xl border-2" style={{
                backgroundColor: `${item.color}10`,
                borderColor: `${item.color}40`
              }} initial={false} transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.6
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="30" data-magicpath-path="AppLayout.tsx" />}
                  </motion.button>;
          })}
            </div>
          </div>
        </div>}
    </div>;
};
export default AppLayout;