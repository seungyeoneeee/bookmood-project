-- 📚 book_external 테이블 RLS 정책 수정
-- Supabase 대시보드 > SQL Editor에서 실행하세요

-- 1. 기존 정책들 삭제 (있다면)
DROP POLICY IF EXISTS "Allow public read access to books" ON book_external;
DROP POLICY IF EXISTS "Allow authenticated users to insert books" ON book_external;

-- 2. RLS 임시 비활성화 (개발 중)
ALTER TABLE book_external DISABLE ROW LEVEL SECURITY;

-- 3. 확인
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename IN ('book_external', 'library_items')
ORDER BY tablename;
