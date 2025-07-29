import React from 'react';
import { motion } from 'framer-motion';
import { Book, Home, Archive, Settings, User, LogIn, Heart } from 'lucide-react';
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  mpid?: string;
}
type ViewType = 'home' | 'search' | 'archive' | 'mood-detail' | 'settings';
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
    mpid: "dc310094-2974-4cba-93e7-6860d9ee81b4"
  }, {
    id: 'search',
    label: '검색',
    icon: Book,
    color: '#8BB5E8',
    mpid: "0cbe8a82-2720-4ed3-b704-24bd7b28f312"
  }, {
    id: 'archive',
    label: '아카이브',
    icon: Archive,
    color: '#B5D4C8',
    mpid: "ad883ef2-7a50-40d4-ae0a-59e5ab95dd69"
  }, {
    id: 'settings',
    label: '설정',
    icon: Settings,
    color: '#F4E4B8',
    mpid: "73e5b84b-716f-4b97-a4b3-483e7a72d0b4"
  }] as any[];
  const handleLogin = () => {
    // Mock login - in real app, this would integrate with Firebase Auth
    console.log('Login clicked');
  };
  return <div className="min-h-screen bg-gradient-to-br from-[#A8B5E8] via-[#8BB5E8] to-[#B5D4C8]" data-magicpath-id="0" data-magicpath-path="AppLayout.tsx">
      {/* Status Bar Spacer */}
      <div className="h-12 bg-transparent" data-magicpath-id="1" data-magicpath-path="AppLayout.tsx" />

      {/* Header */}
      <header className="sticky top-12 z-50 bg-white/10 backdrop-blur-md border-b border-white/20" data-magicpath-id="2" data-magicpath-path="AppLayout.tsx">
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
              <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20" data-magicpath-id="6" data-magicpath-path="AppLayout.tsx">
                <Heart className="w-6 h-6 text-white" data-magicpath-id="7" data-magicpath-path="AppLayout.tsx" />
              </div>
              <div data-magicpath-id="8" data-magicpath-path="AppLayout.tsx">
                <h1 className="text-lg font-bold text-white" data-magicpath-id="9" data-magicpath-path="AppLayout.tsx">BookMood</h1>
                <p className="text-xs text-white/70 -mt-1" data-magicpath-id="10" data-magicpath-path="AppLayout.tsx">독서 감정 일기</p>
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
                    <p className="text-sm font-medium text-white" data-magicpath-id="14" data-magicpath-path="AppLayout.tsx">{user.name}</p>
                    <p className="text-xs text-white/70" data-magicpath-id="15" data-magicpath-path="AppLayout.tsx">{user.email}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20" data-magicpath-id="16" data-magicpath-path="AppLayout.tsx">
                    {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" data-magicpath-id="17" data-magicpath-path="AppLayout.tsx" /> : <User className="w-5 h-5 text-white" data-magicpath-id="18" data-magicpath-path="AppLayout.tsx" />}
                  </div>
                </motion.div> : <motion.button initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} onClick={handleLogin} className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20" data-magicpath-id="19" data-magicpath-path="AppLayout.tsx">
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
        <div className="bg-white/10 backdrop-blur-md border-t border-white/20" data-magicpath-id="24" data-magicpath-path="AppLayout.tsx">
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
                    ${isActive ? 'bg-white/20 backdrop-blur-sm border border-white/30' : 'hover:bg-white/10'}
                  `} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="26" data-magicpath-path="AppLayout.tsx">
                  <Icon className="w-6 h-6" style={{
                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="27" data-magicpath-path="AppLayout.tsx" />
                  <span className="text-xs font-medium" style={{
                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'
              }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:unknown" data-magicpath-id="28" data-magicpath-path="AppLayout.tsx">
                    {item.label}
                  </span>
                  {isActive && <motion.div layoutId="activeMobileTab" className="absolute inset-0 rounded-xl" style={{
                backgroundColor: `${item.color}20`,
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
        <div className="h-8 bg-white/10" data-magicpath-id="30" data-magicpath-path="AppLayout.tsx" />
      </div>

      {/* Background Gradient Overlays */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" data-magicpath-id="31" data-magicpath-path="AppLayout.tsx">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#F4E4B8]/20 to-transparent rounded-full blur-3xl" data-magicpath-id="32" data-magicpath-path="AppLayout.tsx" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#B5D4C8]/20 to-transparent rounded-full blur-3xl" data-magicpath-id="33" data-magicpath-path="AppLayout.tsx" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl" data-magicpath-id="34" data-magicpath-path="AppLayout.tsx" />
      </div>
    </div>;
};
export default AppLayout;