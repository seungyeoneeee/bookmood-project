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
    mpid: "f718df89-83a5-4f6d-ab32-17b6f62cf1c0"
  }, {
    id: 'search',
    label: '검색',
    icon: BookOpen,
    color: '#8BB5E8',
    mpid: "211f7159-9078-4a1e-ab47-c1f495f1b030"
  }, {
    id: 'archive',
    label: '아카이브',
    icon: Bookmark,
    color: '#B5D4C8',
    mpid: "fcf6b911-c3df-409b-8ccc-d174b8870081"
  }, {
    id: 'wishlist',
    label: '찜한책',
    icon: Heart,
    color: '#F4E4B8',
    mpid: "c22ffe28-28a8-48d5-9ad3-9674ee0d857f"
  }, {
    id: 'settings',
    label: '설정',
    icon: Settings,
    color: '#E8B5A8',
    mpid: "17acb5a4-0b69-4ed5-a45c-5e00b04f14e4"
  }] as any[];
  const handleLogin = () => {
    console.log('Login clicked');
  };
  return <div className="min-h-screen bg-white" data-magicpath-id="0" data-magicpath-path="AppLayout.tsx">
      {/* Desktop Top Navigation - Only show on desktop */}
      {!isMobile && <div className="fixed top-0 left-0 right-0 z-50" data-magicpath-id="1" data-magicpath-path="AppLayout.tsx">
          <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm" data-magicpath-id="2" data-magicpath-path="AppLayout.tsx">
            <div className="flex items-center justify-center py-4 px-6" data-magicpath-id="3" data-magicpath-path="AppLayout.tsx">
              <div className="flex items-center space-x-8" data-magicpath-id="4" data-magicpath-path="AppLayout.tsx">
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
              } : {}} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="5" data-magicpath-path="AppLayout.tsx">
                      <Icon className="w-5 h-5" style={{
                  color: isActive ? item.color : '#6B7280'
                }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="6" data-magicpath-path="AppLayout.tsx" />
                      <span className="text-sm font-medium" style={{
                  color: isActive ? item.color : '#6B7280'
                }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:unknown" data-magicpath-id="7" data-magicpath-path="AppLayout.tsx">
                        {item.label}
                      </span>
                      {isActive && <motion.div layoutId="activeDesktopTab" className="absolute inset-0 rounded-xl border-2" style={{
                  backgroundColor: `${item.color}10`,
                  borderColor: `${item.color}40`
                }} initial={false} transition={{
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.6
                }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="8" data-magicpath-path="AppLayout.tsx" />}
                    </motion.button>;
            })}
              </div>
            </div>
          </div>
        </div>}

      {/* Main Content */}
      <main className={isMobile ? "pb-0" : "pt-20 pb-8"} data-magicpath-id="9" data-magicpath-path="AppLayout.tsx">
        {children}
      </main>

      {/* Mobile Bottom Navigation - Only show on mobile */}
      {isMobile && <div className="fixed bottom-0 left-0 right-0 z-50" data-magicpath-id="10" data-magicpath-path="AppLayout.tsx">
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg" data-magicpath-id="11" data-magicpath-path="AppLayout.tsx">
            <div className="flex items-center justify-around py-3 px-4" data-magicpath-id="12" data-magicpath-path="AppLayout.tsx">
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
            } : {}} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="13" data-magicpath-path="AppLayout.tsx">
                    <Icon className="w-6 h-6" style={{
                color: isActive ? item.color : '#6B7280'
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="14" data-magicpath-path="AppLayout.tsx" />
                    <span className="text-xs font-medium" style={{
                color: isActive ? item.color : '#6B7280'
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:unknown" data-magicpath-id="15" data-magicpath-path="AppLayout.tsx">
                      {item.label}
                    </span>
                    {isActive && <motion.div layoutId="activeMobileTab" className="absolute inset-0 rounded-xl border-2" style={{
                backgroundColor: `${item.color}10`,
                borderColor: `${item.color}40`
              }} initial={false} transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.6
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="16" data-magicpath-path="AppLayout.tsx" />}
                  </motion.button>;
          })}
            </div>
          </div>
        </div>}
    </div>;
};
export default AppLayout;