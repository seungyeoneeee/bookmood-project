#!/usr/bin/env node

/**
 * 📚 테스트 책 데이터 삽입 스크립트
 * 알라딘 API 이슈 해결 전까지 임시로 사용
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 환경변수 로드 (상위 디렉토리의 .env 파일)
dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 환경변수 확인:', { 
  supabaseUrl: supabaseUrl ? '설정됨' : '없음',
  supabaseKey: supabaseKey ? '설정됨' : '없음'
});

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 테스트용 책 데이터
const testBooks = [
  {
    isbn13: '9788934942467',
    item_id: 123456,
    title: '달러구트 꿈 백화점',
    author: '이미예',
    publisher: '팩토리나인',
    pub_date: '2020-07-08',
    cover_url: 'https://image.aladin.co.kr/product/23877/24/cover/8934942460_1.jpg',
    category_id: null, // smallint 범위 초과로 null 처리
    category_name: '국내도서>소설/시/희곡>한국소설',
    price_standard: 13800,
    price_sales: 12420,
    customer_review_rank: 45,
    aladin_link: 'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=23877424',
    summary: '하루 종일 걸어도 끝나지 않을 것 같은 복도와 수많은 문이 있는 달러구트 꿈 백화점. 그곳에서 파는 것은 바로 꿈이다.',
    raw: {},
    fetched_at: new Date().toISOString()
  },
  {
    isbn13: '9788950990237',
    item_id: 234567,
    title: '역행자',
    author: '자청',
    publisher: '웅진지식하우스',
    pub_date: '2021-12-29',
    cover_url: 'https://image.aladin.co.kr/product/28497/54/cover/8950990237_1.jpg',
    category_id: null, // smallint 범위 초과로 null 처리
    category_name: '국내도서>자기계발>성공/처세',
    price_standard: 17800,
    price_sales: 16020,
    customer_review_rank: 42,
    aladin_link: 'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=284975468',
    summary: '돈도 실력도 인맥도 없던 평범한 사람이 어떻게 역행자가 되었는지, 그 노하우를 공개한다.',
    raw: {},
    fetched_at: new Date().toISOString()
  },
  {
    isbn13: '9788936434267',
    item_id: 345678,
    title: '원피스 1',
    author: '오다 에이치로',
    publisher: '대원씨아이',
    pub_date: '1998-12-31',
    cover_url: 'https://image.aladin.co.kr/product/71/88/cover/8936434268_1.jpg',
    category_id: null, // smallint 범위 초과로 null 처리
    category_name: '국내도서>만화>일본만화>소년만화',
    price_standard: 4000,
    price_sales: 3600,
    customer_review_rank: 50,
    aladin_link: 'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=718845',
    summary: '해적왕을 꿈꾸는 소년 몽키 D. 루피의 모험이 시작된다.',
    raw: {},
    fetched_at: new Date().toISOString()
  },
  {
    isbn13: '9788954639194',
    item_id: 456789,
    title: '아토믹 해빗',
    author: '제임스 클리어',
    publisher: '비즈니스북스',
    pub_date: '2019-06-03',
    cover_url: 'https://image.aladin.co.kr/product/19346/4/cover/8954639194_1.jpg',
    category_id: null, // smallint 범위 초과로 null 처리
    category_name: '국내도서>자기계발>성공/처세',
    price_standard: 16800,
    price_sales: 15120,
    customer_review_rank: 47,
    aladin_link: 'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=193460405',
    summary: '작은 변화가 만드는 큰 차이, 1%의 힘에 관한 놀라운 책.',
    raw: {},
    fetched_at: new Date().toISOString()
  },
  {
    isbn13: '9788937484995',
    item_id: 567890,
    title: '데미안',
    author: '헤르만 헤세',
    publisher: '민음사',
    pub_date: '2007-01-15',
    cover_url: 'https://image.aladin.co.kr/product/17789/29/cover/8937484994_1.jpg',
    category_id: null, // smallint 범위 초과로 null 처리
    category_name: '국내도서>소설/시/희곡>외국고전문학',
    price_standard: 8500,
    price_sales: 7650,
    customer_review_rank: 43,
    aladin_link: 'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=1778925',
    summary: '한 소년의 성장과 자아 발견의 여정을 그린 헤르만 헤세의 대표작.',
    raw: {},
    fetched_at: new Date().toISOString()
  }
];

async function insertTestBooks() {
  console.log('🚀 테스트 책 데이터 삽입 시작...');
  
  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const book of testBooks) {
    try {
      // 이미 존재하는지 확인
      const { data: existingBook } = await supabase
        .from('book_external')
        .select('isbn13')
        .eq('isbn13', book.isbn13)
        .maybeSingle();

      if (existingBook) {
        console.log(`⏭️ 이미 존재: ${book.title}`);
        skipped++;
        continue;
      }

      // 새로 저장
      const { data, error } = await supabase
        .from('book_external')
        .insert(book)
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ 저장 완료: ${book.title}`);
      inserted++;

    } catch (error) {
      console.error(`❌ 저장 실패: ${book.title}`, error.message);
      failed++;
    }
  }

  console.log('\n📊 테스트 데이터 삽입 완료!');
  console.log(`✅ 새로 저장: ${inserted}권`);
  console.log(`⏭️ 이미 존재: ${skipped}권`);
  console.log(`❌ 실패: ${failed}권`);
}

// 스크립트 실행
insertTestBooks()
  .then(() => {
    console.log('🎉 테스트 데이터 삽입이 완료되었습니다!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 테스트 데이터 삽입 실패:', error);
    process.exit(1);
  });
