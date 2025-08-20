"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Heart, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
export interface LoginPageProps {
  onLogin?: (provider: 'google' | 'apple' | 'email', credentials?: {
    email: string;
    password: string;
  }) => void;
  onBack?: () => void;
  onSignUp?: () => void;
}
export default function LoginPage({
  onLogin,
  onBack,
  onSignUp
}: LoginPageProps) {
  const { signIn, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    if (provider === 'apple') {
      // Apple 로그인은 아직 구현되지 않음
      alert('Apple 로그인은 곧 지원될 예정입니다.');
      return;
    }

    setIsLoading(provider);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        setError('구글 로그인 중 오류가 발생했습니다: ' + error.message);
        setIsLoading(null);
      } else {
        // OAuth 리다이렉션이 시작되므로 로딩 상태는 자동으로 해제됨
        console.log('구글 로그인 리다이렉션 시작');
      }
    } catch (err) {
      setError('구글 로그인 연결에 실패했습니다.');
      setIsLoading(null);
      console.error('구글 로그인 오류:', err);
    }
  };
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading('email');
    setError(null);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        setIsLoading(null);
      } else {
        // 로그인 성공
        onLogin?.('email', { email, password });
        setIsLoading(null);
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      setIsLoading(null);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading('email');
    setError(null);
    
    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
        setIsLoading(null);
      } else {
        // 회원가입 성공
        setError(null);
        alert('회원가입 성공! 이메일을 확인해서 인증을 완료해주세요.');
        setIsSignUpMode(false);
        setIsLoading(null);
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
      setIsLoading(null);
    }
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
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <motion.div variants={floatingVariants} animate="animate" className="absolute top-20 right-8 w-16 h-16 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-full flex items-center justify-center shadow-lg opacity-60">
        <Book className="w-8 h-8 text-white" />
      </motion.div>
      
      <motion.div variants={floatingDelayedVariants} animate="animate" className="absolute top-32 left-6 w-12 h-12 bg-gradient-to-br from-[#F4E4B8] to-[#E8D5A3] rounded-full flex items-center justify-center shadow-lg opacity-50">
        <Heart className="w-6 h-6 text-white" />
      </motion.div>

      <motion.div variants={floatingVariants} animate="animate" className="absolute bottom-32 right-12 w-14 h-14 bg-gradient-to-br from-[#B5D4C8] to-[#A3C9B8] rounded-full flex items-center justify-center shadow-lg opacity-40">
        <Book className="w-7 h-7 text-white" />
      </motion.div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="p-6 flex items-center">
          {onBack && <button onClick={onBack} className="mr-4 hover:bg-gray-100 rounded-full p-2 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#A8B5E8] to-[#8BB5E8] rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">BookMood</h1>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-8">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-sm">
            <div className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-xl">
              <div className="p-8">
                {/* Welcome Text */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {isSignUpMode ? '북무드에 오신 것을 환영해요' : '다시 만나서 반가워요'}
                  </h2>
                  <p className="text-gray-600">
                    {isSignUpMode ? '당신만의 독서 여정을 시작해보세요' : '독서 여정을 계속해보세요'}
                  </p>
                </motion.div>

                {/* Social Login Buttons */}
                <motion.div variants={itemVariants} className="space-y-4 mb-6">
                  <button onClick={() => handleSocialLogin('google')} disabled={isLoading !== null} className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm relative overflow-hidden group rounded-lg flex items-center justify-center disabled:opacity-50">
                    {isLoading === 'google' ? <motion.div animate={{
                    rotate: 360
                  }} transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }} className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full" /> : <>
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google로 계속하기
                      </>}
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full" transition={{
                    duration: 0.6
                  }} />
                  </button>

                  <button onClick={() => handleSocialLogin('apple')} disabled={isLoading !== null} className="w-full h-12 bg-black hover:bg-gray-800 text-white relative overflow-hidden group rounded-lg flex items-center justify-center disabled:opacity-50">
                    {isLoading === 'apple' ? <motion.div animate={{
                    rotate: 360
                  }} transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }} className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full" /> : <>
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        Apple로 계속하기
                      </>}
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full" transition={{
                    duration: 0.6
                  }} />
                  </button>
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemVariants} className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">또는</span>
                  </div>
                </motion.div>

                {/* Email Login Form */}
                <motion.form variants={itemVariants} onSubmit={isSignUpMode ? handleSignUp : handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      이메일
                    </label>
                    <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full h-12 px-3 py-2 border border-gray-200 rounded-lg focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20 focus:outline-none" required />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      비밀번호
                    </label>
                    <div className="relative">
                      <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-12 px-3 py-2 pr-12 border border-gray-200 rounded-lg focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20 focus:outline-none" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded flex items-center justify-center">
                        {showPassword ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg"
                    >
                      {error}
                    </motion.div>
                  )}

                  <button type="submit" disabled={isLoading !== null || !email || !password} className="w-full h-12 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] hover:from-[#9AA8E5] hover:to-[#7DA8E5] text-white font-medium shadow-lg relative overflow-hidden group rounded-lg flex items-center justify-center disabled:opacity-50">
                    {isLoading === 'email' ? <motion.div animate={{
                    rotate: 360
                  }} transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : (isSignUpMode ? '회원가입' : '로그인')}
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full" transition={{
                    duration: 0.6
                  }} />
                  </button>
                </motion.form>

                {/* Footer Links */}
                <motion.div variants={itemVariants} className="mt-8 text-center space-y-4">
                  <button type="button" className="text-sm text-[#A8B5E8] hover:text-[#8BB5E8] font-medium transition-colors">
                    비밀번호를 잊으셨나요?
                  </button>
                  
                  <div className="text-sm text-gray-600">
                    {isSignUpMode ? (
                      <>
                        이미 계정이 있으신가요?{' '}
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsSignUpMode(false);
                            setError(null);
                          }} 
                          className="text-[#A8B5E8] hover:text-[#8BB5E8] font-medium transition-colors"
                        >
                          로그인
                        </button>
                      </>
                    ) : (
                      <>
                        계정이 없으신가요?{' '}
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsSignUpMode(true);
                            setError(null);
                          }} 
                          className="text-[#A8B5E8] hover:text-[#8BB5E8] font-medium transition-colors"
                        >
                          회원가입
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Trust Indicators */}
            <motion.div variants={itemVariants} className="mt-6 text-center">
              <p className="text-xs text-gray-500 leading-relaxed">
                {isSignUpMode ? '회원가입하면' : '로그인하면'} BookMood의{' '}
                <span className="text-[#A8B5E8] hover:underline cursor-pointer">이용약관</span>과{' '}
                <span className="text-[#A8B5E8] hover:underline cursor-pointer">개인정보처리방침</span>에<br />
                동의하는 것으로 간주됩니다.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>;
}