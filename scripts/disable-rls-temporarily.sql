-- 🚨 임시로 RLS 비활성화 (테스트용)
-- Supabase 대시보드 > SQL Editor에서 실행하세요

-- library_items 테이블의 RLS 비활성화
ALTER TABLE library_items DISABLE ROW LEVEL SECURITY;

-- 확인
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'library_items';
