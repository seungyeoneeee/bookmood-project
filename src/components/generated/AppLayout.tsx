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
    label: 'Home',
    icon: Home,
    mpid: "4362003e-73c9-4ec8-9c97-23ed37d5739d"
  }, {
    id: 'search',
    label: 'Search',
    icon: Book,
    mpid: "24999847-b075-46e8-957c-7c0e5ee4f881"
  }, {
    id: 'archive',
    label: 'Archive',
    icon: Archive,
    mpid: "0b465422-b27e-4ae3-9d0d-aca4799438ae"
  }, {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    mpid: "2759530d-6a4e-4991-aa52-492abf309843"
  }] as any[];
  const handleLogin = () => {
    // Mock login - in real app, this would integrate with Firebase Auth
    console.log('Login clicked');
  };
  return <div className="min-h-screen bg-background" data-magicpath-id="0" data-magicpath-path="AppLayout.tsx">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border" data-magicpath-id="1" data-magicpath-path="AppLayout.tsx">
        <div className="container mx-auto px-4" data-magicpath-id="2" data-magicpath-path="AppLayout.tsx">
          <div className="flex items-center justify-between h-16" data-magicpath-id="3" data-magicpath-path="AppLayout.tsx">
            {/* Logo */}
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} className="flex items-center space-x-3 cursor-pointer" onClick={() => onViewChange('home')} data-magicpath-id="4" data-magicpath-path="AppLayout.tsx">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center" data-magicpath-id="5" data-magicpath-path="AppLayout.tsx">
                <Heart className="w-6 h-6 text-white" data-magicpath-id="6" data-magicpath-path="AppLayout.tsx" />
              </div>
              <div className="hidden sm:block" data-magicpath-id="7" data-magicpath-path="AppLayout.tsx">
                <h1 className="text-xl font-bold text-foreground" data-magicpath-id="8" data-magicpath-path="AppLayout.tsx">BookMood</h1>
                <p className="text-xs text-muted-foreground -mt-1" data-magicpath-id="9" data-magicpath-path="AppLayout.tsx">Reading Journal</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1" data-magicpath-id="10" data-magicpath-path="AppLayout.tsx">
              {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return <motion.button key={item.id} initial={{
                opacity: 0,
                y: -10
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: index * 0.1
              }} onClick={() => onViewChange(item.id as ViewType)} className={`
                      relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                    `} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="11" data-magicpath-path="AppLayout.tsx">
                    <div className="flex items-center space-x-2" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="12" data-magicpath-path="AppLayout.tsx">
                      <Icon className="w-4 h-4" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="13" data-magicpath-path="AppLayout.tsx" />
                      <span data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:string" data-magicpath-id="14" data-magicpath-path="AppLayout.tsx">{item.label}</span>
                    </div>
                    {isActive && <motion.div layoutId="activeTab" className="absolute inset-0 bg-primary/5 border border-primary/20 rounded-lg" initial={false} transition={{
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.6
                }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="15" data-magicpath-path="AppLayout.tsx" />}
                  </motion.button>;
            })}
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-3" data-magicpath-id="16" data-magicpath-path="AppLayout.tsx">
              {user ? <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} className="flex items-center space-x-3" data-magicpath-id="17" data-magicpath-path="AppLayout.tsx">
                  <div className="hidden sm:block text-right" data-magicpath-id="18" data-magicpath-path="AppLayout.tsx">
                    <p className="text-sm font-medium text-foreground" data-magicpath-id="19" data-magicpath-path="AppLayout.tsx">{user.name}</p>
                    <p className="text-xs text-muted-foreground" data-magicpath-id="20" data-magicpath-path="AppLayout.tsx">{user.email}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center" data-magicpath-id="21" data-magicpath-path="AppLayout.tsx">
                    {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" data-magicpath-id="22" data-magicpath-path="AppLayout.tsx" /> : <User className="w-5 h-5 text-white" data-magicpath-id="23" data-magicpath-path="AppLayout.tsx" />}
                  </div>
                </motion.div> : <motion.button initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} onClick={handleLogin} className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors" data-magicpath-id="24" data-magicpath-path="AppLayout.tsx">
                  <LogIn className="w-4 h-4" data-magicpath-id="25" data-magicpath-path="AppLayout.tsx" />
                  <span className="hidden sm:inline" data-magicpath-id="26" data-magicpath-path="AppLayout.tsx">Sign In</span>
                </motion.button>}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border" data-magicpath-id="27" data-magicpath-path="AppLayout.tsx">
        <div className="flex items-center justify-around py-2" data-magicpath-id="28" data-magicpath-path="AppLayout.tsx">
          {navigationItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return <button key={item.id} onClick={() => onViewChange(item.id as ViewType)} className={`
                  flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200
                  ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}
                `} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="29" data-magicpath-path="AppLayout.tsx">
                <Icon className="w-5 h-5" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="30" data-magicpath-path="AppLayout.tsx" />
                <span className="text-xs font-medium" data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-field="label:string" data-magicpath-id="31" data-magicpath-path="AppLayout.tsx">{item.label}</span>
                {isActive && <motion.div layoutId="activeMobileTab" className="absolute inset-0 bg-primary/5 border border-primary/20 rounded-lg" initial={false} transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.6
            }} data-magicpath-uuid={(item as any)["mpid"] ?? "unsafe"} data-magicpath-id="32" data-magicpath-path="AppLayout.tsx" />}
              </button>;
        })}
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20 md:pb-0" data-magicpath-id="33" data-magicpath-path="AppLayout.tsx">
        {children}
      </main>

      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" data-magicpath-id="34" data-magicpath-path="AppLayout.tsx">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" data-magicpath-id="35" data-magicpath-path="AppLayout.tsx" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-3xl" data-magicpath-id="36" data-magicpath-path="AppLayout.tsx" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-secondary/3 to-transparent rounded-full blur-3xl" data-magicpath-id="37" data-magicpath-path="AppLayout.tsx" />
      </div>
    </div>;
};
export default AppLayout;