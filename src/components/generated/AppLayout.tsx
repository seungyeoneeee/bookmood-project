import React from 'react';
import { motion } from 'framer-motion';
import { Book, Home, Archive, Settings, User, LogIn, Heart, BookOpen, BarChart3, Bookmark } from 'lucide-react';
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  mpid?: string;
}
type ViewType = 'home' | 'search' | 'archive' | 'mood-detail' | 'settings' | 'wishlist' | 'emotion-stats' | 'emotion-filter';
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
  const navigationItems = [{
    id: 'home',
    label: '홈',
    icon: Home,
    color: '#A8B5E8',
    mpid: "c51b3bac-2257-4b0c-bc83-090a265a95e4"
  }, {
    id: 'search',
    label: '검색',
    icon: BookOpen,
    color: '#8BB5E8',
    mpid: "ee150d94-bda9-44ce-bc04-b63ad762bb0c"
  }, {
    id: 'archive',
    label: '아카이브',
    icon: Bookmark,
    color: '#B5D4C8',
    mpid: "473e223b-df1d-41a4-8057-b9c440afe2b4"
  }, {
    id: 'settings',
    label: '설정',
    icon: Settings,
    color: '#F4E4B8',
    mpid: "879587dc-d99b-40cc-8cca-da2cdb320da0"
  }] as any[];
  const handleLogin = () => {
    // Mock login - in real app, this would integrate with Firebase Auth
    console.log('Login clicked');
  };
  return <div className="min-h-screen bg-white" data-magicpath-id="0" data-magicpath-path="AppLayout.tsx">
      {/* Status Bar Spacer */}
      <div className="h-12 bg-transparent" data-magicpath-id="1" data-magicpath-path="AppLayout.tsx" />

      {/* Header */}
      <header className="sticky top-12 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm" data-magicpath-id="2" data-magicpath-path="AppLayout.tsx">
        <div className="px-4" data-magicpath-id="3" data-magicpath-path="AppLayout.tsx">
          <div className="flex items-center justify-between h-16" data-magicpath-id="4" data-magicpath-path="AppLayout.tsx">
            {/* Logo */}
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} className="flex items-center space-x-3 cursor-pointer" onClick={() => onViewChange('home')} data-magicpath-id="5" data-magicpath-path="AppLayout.tsx">
              <div className="w-10 h-10 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-xl flex items-center justify-center shadow-lg" data-magicpath-id="6" data-magicpath-path="AppLayout.tsx">
                <Heart className="w-6 h-6 text-white" data-magicpath-id="7" data-magicpath-path="AppLayout.tsx" />
              </div>
              <div data-magicpath-id="8" data-magicpath-path="AppLayout.tsx">
                <h1 className="text-lg font-bold text-gray-800" data-magicpath-id="9" data-magicpath-path="AppLayout.tsx">BookMood</h1>
                <p className="text-xs text-gray-500 -mt-1" data-magicpath-id="10" data-magicpath-path="AppLayout.tsx">독서 감정 일기</p>
              </div>
            </motion.div>

            {/* User Section */}
            <div className="flex items-center space-x-3" data-magicpath-id="11" data-magicpath-path="AppLayout.tsx">
              {user ? <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} className="flex items-center space-x-3" data-magicpath-id="12" data-magicpath-path="AppLayout.tsx">
                  <div className="text-right" data-magicpath-id="13" data-magicpath-path="AppLayout.tsx">
                    <p className="text-sm font-medium text-gray-800" data-magicpath-id="14" data-magicpath-path="AppLayout.tsx">{user.name}</p>
                    <p className="text-xs text-gray-500" data-magicpath-id="15" data-magicpath-path="AppLayout.tsx">{user.email}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-[#B5D4C8] to-[#A8D4C8] rounded-full flex items-center justify-center shadow-lg" data-magicpath-id="16" data-magicpath-path="AppLayout.tsx">
                    {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" data-magicpath-id="17" data-magicpath-path="AppLayout.tsx" /> : <User className="w-5 h-5 text-white" data-magicpath-id="18" data-magicpath-path="AppLayout.tsx" />}
                  </div>
                </motion.div> : <motion.button initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} onClick={handleLogin} className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-xl hover:shadow-lg transition-all shadow-md" data-magicpath-id="19" data-magicpath-path="AppLayout.tsx">
                  <LogIn className="w-4 h-4" data-magicpath-id="20" data-magicpath-path="AppLayout.tsx" />
                  <span className="text-sm" data-magicpath-id="21" data-magicpath-path="AppLayout.tsx">로그인</span>
                </motion.button>}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24" data-magicpath-id="22" data-magicpath-path="AppLayout.tsx">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50" data-magicpath-id="23" data-magicpath-path="AppLayout.tsx">
        {/* Safe Area Bottom Spacer */}
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg" data-magicpath-id="24" data-magicpath-path="AppLayout.tsx">
          <div className="flex items-center justify-around py-3 px-4" data-magicpath-id="25" data-magicpath-path="AppLayout.tsx">
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
            } : {}} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="26" data-magicpath-path="AppLayout.tsx">
                  <Icon className="w-6 h-6" style={{
                color: isActive ? item.color : '#6B7280'
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="27" data-magicpath-path="AppLayout.tsx" />
                  <span className="text-xs font-medium" style={{
                color: isActive ? item.color : '#6B7280'
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:unknown" data-magicpath-id="28" data-magicpath-path="AppLayout.tsx">
                    {item.label}
                  </span>
                  {isActive && <motion.div layoutId="activeMobileTab" className="absolute inset-0 rounded-xl border-2" style={{
                backgroundColor: `${item.color}10`,
                borderColor: `${item.color}40`
              }} initial={false} transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.6
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="29" data-magicpath-path="AppLayout.tsx" />}
                </motion.button>;
          })}
          </div>
        </div>
        <div className="h-8 bg-white/95" data-magicpath-id="30" data-magicpath-path="AppLayout.tsx" />
      </div>
    </div>;
};
export default AppLayout;