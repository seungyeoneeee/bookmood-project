-- 📚 library_items 테이블에 is_wishlist 컬럼 추가
-- Supabase SQL Editor에서 실행

-- 1. is_wishlist 컬럼 추가 (기본값 false)
ALTER TABLE library_items 
ADD COLUMN is_wishlist BOOLEAN DEFAULT false;

-- 2. 기존 want_to_read 데이터를 is_wishlist = true로 변경
UPDATE library_items 
SET is_wishlist = true 
WHERE shelf_status = 'want_to_read';

-- 3. 위시리스트인 경우 shelf_status를 null로 설정 (선택사항)
UPDATE library_items 
SET shelf_status = null 
WHERE is_wishlist = true;

-- 4. 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_library_items_wishlist 
ON library_items(user_id, is_wishlist);

-- 5. 결과 확인
SELECT 
  isbn13, 
  is_wishlist, 
  shelf_status, 
  progress,
  user_id
FROM library_items 
ORDER BY created_at DESC 
LIMIT 10;
