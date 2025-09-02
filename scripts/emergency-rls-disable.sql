-- 🚨 응급 처치: RLS 임시 비활성화 (즉시 해결용)
-- Supabase Dashboard > SQL Editor에서 실행하세요
-- ⚠️ 주의: 이는 임시 해결책입니다. 보안상 나중에 fix-review-rls-final.sql 실행 권장

-- RLS 임시 비활성화
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE review_emotions DISABLE ROW LEVEL SECURITY;

-- review_topics 테이블이 있다면 비활성화
DO $$ 
BEGIN 
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'review_topics') THEN
        ALTER TABLE review_topics DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 결과 확인
SELECT 
    '🚨 RLS가 임시 비활성화되었습니다.' as "실행 결과",
    '이제 감상문 작성이 작동해야 합니다.' as "안내사항",
    '보안을 위해 나중에 fix-review-rls-final.sql을 실행해주세요.' as "중요사항";
