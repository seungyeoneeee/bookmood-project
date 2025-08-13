"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Heart, ArrowLeft, Eye, EyeOff } from 'lucide-react';
export interface LoginPageProps {
  onLogin?: (provider: 'google' | 'apple' | 'email', credentials?: {
    email: string;
    password: string;
  }) => void;
  onBack?: () => void;
  onSignUp?: () => void;
  mpid?: string;
}
export default function LoginPage({
  onLogin,
  onBack,
  onSignUp
}: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setIsLoading(provider);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(null);
      onLogin?.(provider);
    }, 1500);
  };
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading('email');
    // Simulate loading
    setTimeout(() => {
      setIsLoading(null);
      onLogin?.('email', {
        email,
        password
      });
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0
    }
  };
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  const floatingDelayedVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, -3, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden" data-magicpath-id="0" data-magicpath-path="LoginPage.tsx">
      {/* Floating Background Elements */}
      <motion.div variants={floatingVariants} animate="animate" className="absolute top-20 right-8 w-16 h-16 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-full flex items-center justify-center shadow-lg opacity-60" data-magicpath-id="1" data-magicpath-path="LoginPage.tsx">
        <Book className="w-8 h-8 text-white" data-magicpath-id="2" data-magicpath-path="LoginPage.tsx" />
      </motion.div>
      
      <motion.div variants={floatingDelayedVariants} animate="animate" className="absolute top-32 left-6 w-12 h-12 bg-gradient-to-br from-[#F4E4B8] to-[#E8D5A3] rounded-full flex items-center justify-center shadow-lg opacity-50" data-magicpath-id="3" data-magicpath-path="LoginPage.tsx">
        <Heart className="w-6 h-6 text-white" data-magicpath-id="4" data-magicpath-path="LoginPage.tsx" />
      </motion.div>

      <motion.div variants={floatingVariants} animate="animate" className="absolute bottom-32 right-12 w-14 h-14 bg-gradient-to-br from-[#B5D4C8] to-[#A3C9B8] rounded-full flex items-center justify-center shadow-lg opacity-40" data-magicpath-id="5" data-magicpath-path="LoginPage.tsx">
        <Book className="w-7 h-7 text-white" data-magicpath-id="6" data-magicpath-path="LoginPage.tsx" />
      </motion.div>

      <div className="relative z-10 min-h-screen flex flex-col" data-magicpath-id="7" data-magicpath-path="LoginPage.tsx">
        {/* Header */}
        <motion.header initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="p-6 flex items-center" data-magicpath-id="8" data-magicpath-path="LoginPage.tsx">
          {onBack && <button onClick={onBack} className="mr-4 hover:bg-gray-100 rounded-full p-2 transition-colors" data-magicpath-id="9" data-magicpath-path="LoginPage.tsx">
              <ArrowLeft className="w-5 h-5" data-magicpath-id="10" data-magicpath-path="LoginPage.tsx" />
            </button>}
          <div className="flex items-center space-x-3" data-magicpath-id="11" data-magicpath-path="LoginPage.tsx">
            <div className="w-8 h-8 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-lg flex items-center justify-center" data-magicpath-id="12" data-magicpath-path="LoginPage.tsx">
              <Heart className="w-5 h-5 text-white" data-magicpath-id="13" data-magicpath-path="LoginPage.tsx" />
            </div>
            <h1 className="text-xl font-bold text-gray-800" data-magicpath-id="14" data-magicpath-path="LoginPage.tsx">BookMood</h1>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-8" data-magicpath-id="15" data-magicpath-path="LoginPage.tsx">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-sm" data-magicpath-id="16" data-magicpath-path="LoginPage.tsx">
            <div className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-xl" data-magicpath-id="17" data-magicpath-path="LoginPage.tsx">
              <div className="p-8" data-magicpath-id="18" data-magicpath-path="LoginPage.tsx">
                {/* Welcome Text */}
                <motion.div variants={itemVariants} className="text-center mb-8" data-magicpath-id="19" data-magicpath-path="LoginPage.tsx">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2" data-magicpath-id="20" data-magicpath-path="LoginPage.tsx">
                    다시 만나서 반가워요
                  </h2>
                  <p className="text-gray-600" data-magicpath-id="21" data-magicpath-path="LoginPage.tsx">
                    독서 여정을 계속해보세요
                  </p>
                </motion.div>

                {/* Social Login Buttons */}
                <motion.div variants={itemVariants} className="space-y-4 mb-6" data-magicpath-id="22" data-magicpath-path="LoginPage.tsx">
                  <button onClick={() => handleSocialLogin('google')} disabled={isLoading !== null} className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm relative overflow-hidden group rounded-lg flex items-center justify-center disabled:opacity-50" data-magicpath-id="23" data-magicpath-path="LoginPage.tsx">
                    {isLoading === 'google' ? <motion.div animate={{
                    rotate: 360
                  }} transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }} className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full" data-magicpath-id="24" data-magicpath-path="LoginPage.tsx" /> : <>
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" data-magicpath-id="25" data-magicpath-path="LoginPage.tsx">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" data-magicpath-id="26" data-magicpath-path="LoginPage.tsx" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" data-magicpath-id="27" data-magicpath-path="LoginPage.tsx" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" data-magicpath-id="28" data-magicpath-path="LoginPage.tsx" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" data-magicpath-id="29" data-magicpath-path="LoginPage.tsx" />
                        </svg>
                        Google로 계속하기
                      </>}
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full" transition={{
                    duration: 0.6
                  }} data-magicpath-id="30" data-magicpath-path="LoginPage.tsx" />
                  </button>

                  <button onClick={() => handleSocialLogin('apple')} disabled={isLoading !== null} className="w-full h-12 bg-black hover:bg-gray-800 text-white relative overflow-hidden group rounded-lg flex items-center justify-center disabled:opacity-50" data-magicpath-id="31" data-magicpath-path="LoginPage.tsx">
                    {isLoading === 'apple' ? <motion.div animate={{
                    rotate: 360
                  }} transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }} className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full" data-magicpath-id="32" data-magicpath-path="LoginPage.tsx" /> : <>
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor" data-magicpath-id="33" data-magicpath-path="LoginPage.tsx">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" data-magicpath-id="34" data-magicpath-path="LoginPage.tsx" />
                        </svg>
                        Apple로 계속하기
                      </>}
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full" transition={{
                    duration: 0.6
                  }} data-magicpath-id="35" data-magicpath-path="LoginPage.tsx" />
                  </button>
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemVariants} className="relative my-6" data-magicpath-id="36" data-magicpath-path="LoginPage.tsx">
                  <div className="absolute inset-0 flex items-center" data-magicpath-id="37" data-magicpath-path="LoginPage.tsx">
                    <div className="w-full border-t border-gray-200" data-magicpath-id="38" data-magicpath-path="LoginPage.tsx" />
                  </div>
                  <div className="relative flex justify-center text-sm" data-magicpath-id="39" data-magicpath-path="LoginPage.tsx">
                    <span className="px-4 bg-white text-gray-500" data-magicpath-id="40" data-magicpath-path="LoginPage.tsx">또는</span>
                  </div>
                </motion.div>

                {/* Email Login Form */}
                <motion.form variants={itemVariants} onSubmit={handleEmailLogin} className="space-y-4" data-magicpath-id="41" data-magicpath-path="LoginPage.tsx">
                  <div className="space-y-2" data-magicpath-id="42" data-magicpath-path="LoginPage.tsx">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700" data-magicpath-id="43" data-magicpath-path="LoginPage.tsx">
                      이메일
                    </label>
                    <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full h-12 px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20 focus:outline-none" required data-magicpath-id="44" data-magicpath-path="LoginPage.tsx" />
                  </div>

                  <div className="space-y-2" data-magicpath-id="45" data-magicpath-path="LoginPage.tsx">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700" data-magicpath-id="46" data-magicpath-path="LoginPage.tsx">
                      비밀번호
                    </label>
                    <div className="relative" data-magicpath-id="47" data-magicpath-path="LoginPage.tsx">
                      <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-12 px-3 py-2 pr-12 border border-gray-200 rounded-lg focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20 focus:outline-none" required data-magicpath-id="48" data-magicpath-path="LoginPage.tsx" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded flex items-center justify-center" data-magicpath-id="49" data-magicpath-path="LoginPage.tsx">
                        {showPassword ? <EyeOff className="w-4 h-4 text-gray-500" data-magicpath-id="50" data-magicpath-path="LoginPage.tsx" /> : <Eye className="w-4 h-4 text-gray-500" data-magicpath-id="51" data-magicpath-path="LoginPage.tsx" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading !== null || !email || !password} className="w-full h-12 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] hover:from-[#9AA8E5] hover:to-[#7DA8E5] text-white font-medium shadow-lg relative overflow-hidden group rounded-lg flex items-center justify-center disabled:opacity-50" data-magicpath-id="52" data-magicpath-path="LoginPage.tsx">
                    {isLoading === 'email' ? <motion.div animate={{
                    rotate: 360
                  }} transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" data-magicpath-id="53" data-magicpath-path="LoginPage.tsx" /> : '로그인'}
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full" transition={{
                    duration: 0.6
                  }} data-magicpath-id="54" data-magicpath-path="LoginPage.tsx" />
                  </button>
                </motion.form>

                {/* Footer Links */}
                <motion.div variants={itemVariants} className="mt-8 text-center space-y-4" data-magicpath-id="55" data-magicpath-path="LoginPage.tsx">
                  <button type="button" className="text-sm text-[#A8B5E8] hover:text-[#8BB5E8] font-medium transition-colors" data-magicpath-id="56" data-magicpath-path="LoginPage.tsx">
                    비밀번호를 잊으셨나요?
                  </button>
                  
                  <div className="text-sm text-gray-600" data-magicpath-id="57" data-magicpath-path="LoginPage.tsx">
                    계정이 없으신가요?{' '}
                    <button type="button" onClick={onSignUp} className="text-[#A8B5E8] hover:text-[#8BB5E8] font-medium transition-colors" data-magicpath-id="58" data-magicpath-path="LoginPage.tsx">
                      회원가입
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Trust Indicators */}
            <motion.div variants={itemVariants} className="mt-6 text-center" data-magicpath-id="59" data-magicpath-path="LoginPage.tsx">
              <p className="text-xs text-gray-500 leading-relaxed" data-magicpath-id="60" data-magicpath-path="LoginPage.tsx">
                로그인하면 BookMood의{' '}
                <span className="text-[#A8B5E8] hover:underline cursor-pointer" data-magicpath-id="61" data-magicpath-path="LoginPage.tsx">이용약관</span>과{' '}
                <span className="text-[#A8B5E8] hover:underline cursor-pointer" data-magicpath-id="62" data-magicpath-path="LoginPage.tsx">개인정보처리방침</span>에<br data-magicpath-id="63" data-magicpath-path="LoginPage.tsx" />
                동의하는 것으로 간주됩니다.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>;
}