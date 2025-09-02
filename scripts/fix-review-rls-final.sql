-- 📋 완전한 리뷰 시스템 RLS 정책 설정 스크립트
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- =======================================
-- 1단계: 기존 정책 정리 (안전하게)
-- =======================================

-- reviews 테이블 기존 정책 삭제
DROP POLICY IF EXISTS "Allow read access for all users" ON reviews;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own reviews" ON reviews;
DROP POLICY IF EXISTS "Allow owner to update their reviews" ON reviews;
DROP POLICY IF EXISTS "Allow owner to delete their reviews" ON reviews;
DROP POLICY IF EXISTS "Enable read access for all users" ON reviews;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON reviews;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON reviews;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON reviews;

-- review_emotions 테이블 기존 정책 삭제
DROP POLICY IF EXISTS "Allow read access for all review_emotions" ON review_emotions;
DROP POLICY IF EXISTS "Allow authenticated users to insert review emotions for their reviews" ON review_emotions;
DROP POLICY IF EXISTS "Allow owner to update review emotions" ON review_emotions;
DROP POLICY IF EXISTS "Allow owner to delete review emotions" ON review_emotions;
DROP POLICY IF EXISTS "Enable read access for all users" ON review_emotions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON review_emotions;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON review_emotions;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON review_emotions;

-- review_topics 테이블 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Allow read access for all review_topics" ON review_topics;
DROP POLICY IF EXISTS "Allow authenticated users to insert review topics for their reviews" ON review_topics;
DROP POLICY IF EXISTS "Allow owner to update review topics" ON review_topics;
DROP POLICY IF EXISTS "Allow owner to delete review topics" ON review_topics;

-- =======================================
-- 2단계: RLS 활성화 확인
-- =======================================

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_emotions ENABLE ROW LEVEL SECURITY;

-- review_topics 테이블이 존재한다면 RLS 활성화
DO $$ 
BEGIN 
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'review_topics') THEN
        ALTER TABLE review_topics ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- =======================================
-- 3단계: 새로운 안전한 정책 생성
-- =======================================

-- 📝 REVIEWS 테이블 정책

-- 읽기: 모든 사용자가 모든 리뷰 읽기 가능 (공개)
CREATE POLICY "reviews_select_all" ON reviews 
    FOR SELECT 
    USING (true);

-- 삽입: 인증된 사용자가 자신의 리뷰만 생성 가능
CREATE POLICY "reviews_insert_own" ON reviews 
    FOR INSERT 
    WITH CHECK (
        auth.role() = 'authenticated' 
        AND auth.uid()::text = user_id
    );

-- 업데이트: 리뷰 소유자만 수정 가능
CREATE POLICY "reviews_update_own" ON reviews 
    FOR UPDATE 
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- 삭제: 리뷰 소유자만 삭제 가능
CREATE POLICY "reviews_delete_own" ON reviews 
    FOR DELETE 
    USING (auth.uid()::text = user_id);

-- 🎨 REVIEW_EMOTIONS 테이블 정책

-- 읽기: 모든 사용자가 모든 감정 데이터 읽기 가능
CREATE POLICY "review_emotions_select_all" ON review_emotions 
    FOR SELECT 
    USING (true);

-- 삽입: 인증된 사용자가 자신의 리뷰에만 감정 데이터 추가 가능
CREATE POLICY "review_emotions_insert_own" ON review_emotions 
    FOR INSERT 
    WITH CHECK (
        auth.role() = 'authenticated' 
        AND EXISTS (
            SELECT 1 FROM reviews 
            WHERE reviews.id = review_emotions.review_id 
            AND reviews.user_id = auth.uid()::text
        )
    );

-- 업데이트: 리뷰 소유자만 감정 데이터 수정 가능
CREATE POLICY "review_emotions_update_own" ON review_emotions 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM reviews 
            WHERE reviews.id = review_emotions.review_id 
            AND reviews.user_id = auth.uid()::text
        )
    );

-- 삭제: 리뷰 소유자만 감정 데이터 삭제 가능
CREATE POLICY "review_emotions_delete_own" ON review_emotions 
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM reviews 
            WHERE reviews.id = review_emotions.review_id 
            AND reviews.user_id = auth.uid()::text
        )
    );

-- 🏷️ REVIEW_TOPICS 테이블 정책 (있다면)
DO $$ 
BEGIN 
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'review_topics') THEN
        
        -- 읽기: 모든 사용자가 모든 주제 데이터 읽기 가능
        EXECUTE 'CREATE POLICY "review_topics_select_all" ON review_topics 
            FOR SELECT 
            USING (true)';

        -- 삽입: 인증된 사용자가 자신의 리뷰에만 주제 데이터 추가 가능
        EXECUTE 'CREATE POLICY "review_topics_insert_own" ON review_topics 
            FOR INSERT 
            WITH CHECK (
                auth.role() = ''authenticated'' 
                AND EXISTS (
                    SELECT 1 FROM reviews 
                    WHERE reviews.id = review_topics.review_id 
                    AND reviews.user_id = auth.uid()::text
                )
            )';

        -- 업데이트: 리뷰 소유자만 주제 데이터 수정 가능
        EXECUTE 'CREATE POLICY "review_topics_update_own" ON review_topics 
            FOR UPDATE 
            USING (
                EXISTS (
                    SELECT 1 FROM reviews 
                    WHERE reviews.id = review_topics.review_id 
                    AND reviews.user_id = auth.uid()::text
                )
            )';

        -- 삭제: 리뷰 소유자만 주제 데이터 삭제 가능
        EXECUTE 'CREATE POLICY "review_topics_delete_own" ON review_topics 
            FOR DELETE 
            USING (
                EXISTS (
                    SELECT 1 FROM reviews 
                    WHERE reviews.id = review_topics.review_id 
                    AND reviews.user_id = auth.uid()::text
                )
            )';
    END IF;
END $$;

-- =======================================
-- 4단계: 정책 확인 및 검증
-- =======================================

-- 생성된 정책 목록 확인
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('reviews', 'review_emotions', 'review_topics')
ORDER BY tablename, policyname;

-- =======================================
-- 5단계: 권한 확인 (선택사항)
-- =======================================

-- 현재 데이터베이스 사용자와 권한 확인
SELECT 
    current_user as "현재 사용자",
    current_database() as "현재 데이터베이스",
    version() as "PostgreSQL 버전";

-- RLS 활성화 상태 확인
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as "RLS 활성화됨"
FROM pg_tables 
WHERE tablename IN ('reviews', 'review_emotions', 'review_topics');

-- =======================================
-- 📋 실행 완료 메시지
-- =======================================

SELECT 
    '✅ 리뷰 시스템 RLS 정책이 성공적으로 설정되었습니다!' as "실행 결과",
    '이제 감상문 작성이 정상적으로 작동해야 합니다.' as "안내사항";
