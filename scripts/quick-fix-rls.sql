-- 🚨 즉시 해결용 RLS 정책 스크립트
-- Supabase Dashboard → SQL Editor에서 실행하세요

-- 1. 모든 RLS 정책 비활성화 (개발 중에만 사용)
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE review_emotions DISABLE ROW LEVEL SECURITY;
ALTER TABLE review_topics DISABLE ROW LEVEL SECURITY;

-- 또는 임시 허용 정책 생성 (더 안전한 방법)
/*
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Allow authenticated users to manage reviews" ON reviews;
DROP POLICY IF EXISTS "Allow authenticated users to manage emotions" ON review_emotions;

-- 인증된 사용자에게 모든 권한 허용 (임시)
CREATE POLICY "Allow authenticated users to manage reviews" 
ON reviews FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage emotions" 
ON review_emotions FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
*/
