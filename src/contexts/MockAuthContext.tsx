import React, { createContext, useContext, useState } from 'react';

interface MockUser {
  id: string;
  email: string;
  created_at: string;
}

interface MockAuthContextType {
  user: MockUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const MockAuthContext = createContext<MockAuthContextType>({
  user: null,
  loading: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
});

export const useMockAuth = () => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth는 MockAuthProvider 내에서 사용되어야 합니다');
  }
  return context;
};

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    // 간단한 Mock 로그인 (실제 인증 없이)
    setTimeout(() => {
      const mockUser: MockUser = {
        id: 'mock-user-id',
        email: email,
        created_at: new Date().toISOString()
      };
      
      setUser(mockUser);
      setLoading(false);
      console.log('Mock 로그인 성공:', email);
    }, 1000);
    
    return { error: null };
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    
    setTimeout(() => {
      const mockUser: MockUser = {
        id: 'mock-user-id',
        email: email,
        created_at: new Date().toISOString()
      };
      
      setUser(mockUser);
      setLoading(false);
      console.log('Mock 회원가입 성공:', email);
    }, 1000);
    
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    console.log('Mock 로그아웃');
    return { error: null };
  };

  const resetPassword = async (email: string) => {
    console.log('Mock 비밀번호 재설정:', email);
    return { error: null };
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
};
