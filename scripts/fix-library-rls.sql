-- 📚 library_items 테이블 RLS 정책 수정
-- Supabase 대시보드 > SQL Editor에서 실행하세요

-- 1. 기존 정책들 삭제 (있다면)
DROP POLICY IF EXISTS "Users can insert their own library items" ON library_items;
DROP POLICY IF EXISTS "Users can view their own library items" ON library_items;
DROP POLICY IF EXISTS "Users can update their own library items" ON library_items;
DROP POLICY IF EXISTS "Users can delete their own library items" ON library_items;

-- 2. RLS 활성화 확인
ALTER TABLE library_items ENABLE ROW LEVEL SECURITY;

-- 3. 새로운 RLS 정책 생성
-- 📝 INSERT: 사용자 자신의 데이터만 삽입 가능
CREATE POLICY "Users can insert their own library items" 
ON library_items FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 👀 SELECT: 사용자 자신의 데이터만 조회 가능
CREATE POLICY "Users can view their own library items" 
ON library_items FOR SELECT 
USING (auth.uid() = user_id);

-- ✏️ UPDATE: 사용자 자신의 데이터만 수정 가능
CREATE POLICY "Users can update their own library items" 
ON library_items FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 🗑️ DELETE: 사용자 자신의 데이터만 삭제 가능
CREATE POLICY "Users can delete their own library items" 
ON library_items FOR DELETE 
USING (auth.uid() = user_id);

-- 4. 정책 확인
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'library_items'
ORDER BY policyname;
