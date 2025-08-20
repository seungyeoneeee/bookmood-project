-- 📚 BookMood 샘플 데이터 생성 SQL
-- Supabase SQL Editor에서 실행하여 테스트 데이터 생성

-- book_external 테이블에 샘플 책 데이터 삽입
INSERT INTO book_external (
  isbn13, item_id, title, author, publisher, pub_date, 
  cover_url, category_name, price_standard, price_sales, 
  customer_review_rank, aladin_link, summary, fetched_at
) VALUES 
(
  '9788934942467', 
  123456, 
  '달러구트 꿈 백화점', 
  '이미예', 
  '팩토리나인', 
  '2020-07-08',
  'https://image.aladin.co.kr/product/23877/24/cover/8934942460_1.jpg',
  '국내도서>소설/시/희곡>한국소설',
  13800,
  12420,
  45,
  'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=23877424',
  '하루 종일 걸어도 끝나지 않을 것 같은 복도와 수많은 문이 있는 달러구트 꿈 백화점. 그곳에서 파는 것은 바로 꿈이다.',
  NOW()
),
(
  '9788950990237', 
  234567, 
  '역행자', 
  '자청', 
  '웅진지식하우스', 
  '2021-12-29',
  'https://image.aladin.co.kr/product/28497/54/cover/8950990237_1.jpg',
  '국내도서>자기계발>성공/처세',
  17800,
  16020,
  42,
  'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=284975468',
  '돈도 실력도 인맥도 없던 평범한 사람이 어떻게 역행자가 되었는지, 그 노하우를 공개한다.',
  NOW()
),
(
  '9788936434267', 
  345678, 
  '원피스 1', 
  '오다 에이치로', 
  '대원씨아이', 
  '1998-12-31',
  'https://image.aladin.co.kr/product/71/88/cover/8936434268_1.jpg',
  '국내도서>만화>일본만화>소년만화',
  4000,
  3600,
  50,
  'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=718845',
  '해적왕을 꿈꾸는 소년 몽키 D. 루피의 모험이 시작된다.',
  NOW()
),
(
  '9788954639194', 
  456789, 
  '아토믹 해빗', 
  '제임스 클리어', 
  '비즈니스북스', 
  '2019-06-03',
  'https://image.aladin.co.kr/product/19346/4/cover/8954639194_1.jpg',
  '국내도서>자기계발>성공/처세',
  16800,
  15120,
  47,
  'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=193460405',
  '작은 변화가 만드는 큰 차이, 1%의 힘에 관한 놀라운 책.',
  NOW()
),
(
  '9788937484995', 
  567890, 
  '데미안', 
  '헤르만 헤세', 
  '민음사', 
  '2007-01-15',
  'https://image.aladin.co.kr/product/17789/29/cover/8937484994_1.jpg',
  '국내도서>소설/시/희곡>외국고전문학',
  8500,
  7650,
  43,
  'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=1778925',
  '한 소년의 성장과 자아 발견의 여정을 그린 헤르만 헤세의 대표작.',
  NOW()
),
(
  '9788932917245', 
  678901, 
  '클린 코드', 
  '로버트 C. 마틴', 
  '인사이트', 
  '2013-12-24',
  'https://image.aladin.co.kr/product/3681/61/cover/8932917245_1.jpg',
  '국내도서>컴퓨터/모바일>프로그래밍 개발/방법론',
  33000,
  29700,
  44,
  'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=36816188',
  '애자일 소프트웨어 장인 정신에 대한 핸드북.',
  NOW()
),
(
  '9788901224015', 
  789012, 
  '사피엔스', 
  '유발 하라리', 
  '김영사', 
  '2015-11-02',
  'https://image.aladin.co.kr/product/6142/51/cover/8901224011_1.jpg',
  '국내도서>역사>세계사>문명사',
  22800,
  20520,
  46,
  'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=61425112',
  '인류의 역사를 거시적 관점에서 조망한 베스트셀러.',
  NOW()
),
(
  '9788925573724', 
  890123, 
  '미드나잇 라이브러리', 
  '매트 헤이그', 
  '인플루엔셜', 
  '2021-05-21',
  'https://image.aladin.co.kr/product/26894/32/cover/8925573725_1.jpg',
  '국내도서>소설/시/희곡>영미소설',
  16800,
  15120,
  41,
  'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=268943245',
  '무한한 가능성의 도서관에서 펼쳐지는 감동적인 이야기.',
  NOW()
);

-- RLS 정책 임시 비활성화 (관리자만 실행 가능)
-- ALTER TABLE book_external DISABLE ROW LEVEL SECURITY;

-- 데이터 확인
SELECT COUNT(*) as total_books FROM book_external;
SELECT title, author, isbn13 FROM book_external LIMIT 5;
