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
type ViewType = 'home' | 'search' | 'archive' | 'mood-detail' | 'settings' | 'wishlist' | 'emotion-stats' | 'emotion-filter' | 'reading-progress';
interface AppLayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  user: User | null;
  mpid?: string;
}
const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentView,
  onViewChange,
  user
}) => {
  const isMobile = useIsMobile();
  const navigationItems = [{
    id: 'home',
    label: '홈',
    icon: Home,
    color: '#A8B5E8',
    mpid: "85b23988-44a4-4c78-9228-39c3b4fd9035"
  }, {
    id: 'search',
    label: '검색',
    icon: BookOpen,
    color: '#8BB5E8',
    mpid: "822cae36-b184-4810-b341-f5b646efa89b"
  }, {
    id: 'archive',
    label: '아카이브',
    icon: Bookmark,
    color: '#B5D4C8',
    mpid: "b29ef938-6d59-4ef0-8b90-56701fb81f35"
  }, {
    id: 'wishlist',
    label: '찜한책',
    icon: Heart,
    color: '#F4E4B8',
    mpid: "fc92f99b-1da5-4e25-8aff-dfc207eae924"
  }, {
    id: 'settings',
    label: '설정',
    icon: Settings,
    color: '#E8B5A8',
    mpid: "a5b18dd0-3a13-4354-9ccb-3c2e2d96174e"
  }] as any[];
  const handleLogin = () => {
    console.log('Login clicked');
  };
  return <div className="min-h-screen bg-white" data-magicpath-id="0" data-magicpath-path="AppLayout.tsx">
      {/* Status Bar Spacer */}
      <div className="h-12 bg-transparent" data-magicpath-id="1" data-magicpath-path="AppLayout.tsx" />

      {/* Main Content */}
      <main className={isMobile ? "pb-24" : "pb-8"} data-magicpath-id="2" data-magicpath-path="AppLayout.tsx">
        {children}
      </main>

      {/* Mobile Bottom Navigation - Only show on mobile */}
      {isMobile && <div className="fixed bottom-0 left-0 right-0 z-50" data-magicpath-id="3" data-magicpath-path="AppLayout.tsx">
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg" data-magicpath-id="4" data-magicpath-path="AppLayout.tsx">
            <div className="flex items-center justify-around py-3 px-4" data-magicpath-id="5" data-magicpath-path="AppLayout.tsx">
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
            } : {}} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="6" data-magicpath-path="AppLayout.tsx">
                    <Icon className="w-6 h-6" style={{
                color: isActive ? item.color : '#6B7280'
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="7" data-magicpath-path="AppLayout.tsx" />
                    <span className="text-xs font-medium" style={{
                color: isActive ? item.color : '#6B7280'
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:unknown" data-magicpath-id="8" data-magicpath-path="AppLayout.tsx">
                      {item.label}
                    </span>
                    {isActive && <motion.div layoutId="activeMobileTab" className="absolute inset-0 rounded-xl border-2" style={{
                backgroundColor: `${item.color}10`,
                borderColor: `${item.color}40`
              }} initial={false} transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.6
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="9" data-magicpath-path="AppLayout.tsx" />}
                  </motion.button>;
          })}
            </div>
          </div>
          <div className="h-8 bg-white/95" data-magicpath-id="10" data-magicpath-path="AppLayout.tsx" />
        </div>}
    </div>;
};
export default AppLayout;