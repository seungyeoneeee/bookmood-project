# Supabase 데이터베이스 연결 설정 가이드

## 🎯 현재 완료된 작업

✅ Supabase JavaScript 클라이언트 라이브러리 설치  
✅ Supabase 클라이언트 초기화 파일 생성  
✅ 인증 컨텍스트 및 훅 설정  
✅ 데이터베이스 연결 테스트 컴포넌트 생성  
✅ 앱에 AuthProvider 연결  
✅ 테스트 페이지 라우트 추가  

## 🔧 남은 설정 작업

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**값 확인 방법:**
1. [Supabase 대시보드](https://app.supabase.com) 로그인
2. 프로젝트 선택
3. Settings > API 메뉴
4. Project URL과 anon public 키 복사

### 2. Supabase 프로젝트 설정

#### 인증 설정
1. Supabase 대시보드 > Authentication > Settings
2. Site URL에 `http://localhost:5173` 추가 (개발용)
3. 이메일 인증 설정 확인

#### 데이터베이스 테이블 생성 (예시)
```sql
-- books 테이블 생성
CREATE TABLE books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover TEXT,
  description TEXT,
  isbn TEXT,
  published_year TEXT,
  rating DECIMAL(2,1),
  publisher TEXT,
  genre TEXT,
  pages INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽을 수 있도록 정책 생성
CREATE POLICY "Anyone can view books" ON books
  FOR SELECT USING (true);

-- 인증된 사용자만 추가/수정/삭제 가능하도록 정책 생성
CREATE POLICY "Authenticated users can insert books" ON books
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update books" ON books
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete books" ON books
  FOR DELETE USING (auth.role() = 'authenticated');
```

## 🧪 연결 테스트

### 1. 개발 서버 실행
```bash
yarn dev
```

### 2. 테스트 페이지 접속
브라우저에서 `http://localhost:5173/supabase-test` 접속

### 3. 테스트 항목
- ✅ 데이터베이스 연결 상태 확인
- ✅ 인증 테스트 (회원가입/로그인)
- ✅ 기본 쿼리 실행
- ✅ 실시간 데이터 동기화

## 📁 생성된 파일들

```
src/
├── lib/
│   └── supabase.ts          # Supabase 클라이언트 설정
├── contexts/
│   └── AuthContext.tsx      # 인증 컨텍스트
├── components/
│   └── test/
│       └── SupabaseTest.tsx # 연결 테스트 컴포넌트
└── App.tsx                  # AuthProvider 연결
```

## 🎨 사용 예시

### 1. 인증 사용하기
```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();
  
  if (user) {
    return <div>환영합니다, {user.email}!</div>;
  }
  
  return <button onClick={() => signIn(email, password)}>로그인</button>;
}
```

### 2. 데이터베이스 쿼리
```tsx
import { supabase } from '../lib/supabase';

// 데이터 가져오기
const { data, error } = await supabase
  .from('books')
  .select('*')
  .limit(10);

// 데이터 추가하기
const { error } = await supabase
  .from('books')
  .insert({ title: '새 책', author: '작가' });
```

## 🚨 주의사항

1. **환경 변수 보안**: `.env` 파일을 `.gitignore`에 추가하세요
2. **RLS 정책**: 프로덕션에서는 적절한 Row Level Security 정책 설정 필수
3. **타입 안전성**: `supabase gen types` 명령어로 TypeScript 타입 자동 생성 권장

## 🔗 유용한 링크

- [Supabase 공식 문서](https://supabase.com/docs)
- [React와 Supabase 연동 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Supabase CLI 설치](https://supabase.com/docs/guides/cli)

## 📞 문제 해결

문제가 발생하면 `/supabase-test` 페이지에서 연결 상태를 확인하고, 브라우저 개발자 도구에서 오류 메시지를 확인하세요.
