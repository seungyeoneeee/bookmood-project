-- RLS 정책 수정 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. reviews 테이블의 RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'reviews';

-- 2. 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Users can insert their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;

-- 3. 새로운 정책 생성 (인증된 사용자가 자신의 리뷰만 관리할 수 있도록)
CREATE POLICY "Users can insert their own reviews" 
ON reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "Users can view their own reviews" 
ON reviews FOR SELECT 
USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can update their own reviews" 
ON reviews FOR UPDATE 
USING (auth.uid() = user_id::uuid)
WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "Users can delete their own reviews" 
ON reviews FOR DELETE 
USING (auth.uid() = user_id::uuid);

-- 4. review_emotions 테이블 정책도 설정
DROP POLICY IF EXISTS "Users can manage emotions for their reviews" ON review_emotions;

CREATE POLICY "Users can manage emotions for their reviews" 
ON review_emotions FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM reviews 
    WHERE reviews.id = review_emotions.review_id 
    AND reviews.user_id::uuid = auth.uid()
  )
);

-- 5. review_topics 테이블 정책도 설정 (있다면)
DROP POLICY IF EXISTS "Users can manage topics for their reviews" ON review_topics;

CREATE POLICY "Users can manage topics for their reviews" 
ON review_topics FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM reviews 
    WHERE reviews.id = review_topics.review_id 
    AND reviews.user_id::uuid = auth.uid()
  )
);

-- 6. RLS 활성화 확인
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_emotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_topics ENABLE ROW LEVEL SECURITY;

-- 7. 테스트용 임시 정책 (개발 중에만 사용, 나중에 제거)
-- 만약 위 정책들이 작동하지 않으면 임시로 사용
/*
DROP POLICY IF EXISTS "Temporary allow all for reviews" ON reviews;
CREATE POLICY "Temporary allow all for reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
*/
