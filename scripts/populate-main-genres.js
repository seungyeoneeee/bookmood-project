/**
 * 주요 장르별 인기도서 대량 수집 스크립트
 * 소설, 산문집 등 주류 장르 중심으로 데이터 채우기
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const aladinApiKey = process.env.VITE_ALADIN_API_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 📚 주요 장르 카테고리 (알라딘 API 카테고리 ID)
const MAIN_GENRES = [
  { id: 1, name: '소설', categoryId: 1 },           // 문학 > 소설
  { id: 2, name: '시/에세이', categoryId: 2 },      // 문학 > 시/에세이  
  { id: 3, name: '경제경영', categoryId: 170 },     // 경제경영
  { id: 4, name: '자기계발', categoryId: 336 },     // 자기계발
  { id: 5, name: '인문학', categoryId: 656 },       // 인문학
  { id: 6, name: '역사', categoryId: 74 },          // 역사
  { id: 7, name: '과학', categoryId: 987 },         // 과학
  { id: 8, name: '컴퓨터/IT', categoryId: 351 },    // 컴퓨터/IT
];

// 🔥 수집할 리스트 타입
const LIST_TYPES = [
  'Bestseller',    // 베스트셀러
  'ItemNewAll',    // 신간 전체
  'ItemNewSpecial' // 신간 특별상품
];

async function fetchAladinBooks(categoryId, queryType = 'Bestseller', maxResults = 50) {
  try {
    console.log(`📖 알라딘 API 호출: 카테고리 ${categoryId}, 타입 ${queryType}`);
    
    const url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${aladinApiKey}&QueryType=${queryType}&MaxResults=${maxResults}&start=1&SearchTarget=Book&output=js&Version=20131101&CategoryId=${categoryId}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.item || data.item.length === 0) {
      console.log(`⚠️ 카테고리 ${categoryId}에서 데이터 없음`);
      return [];
    }
    
    console.log(`✅ 카테고리 ${categoryId}에서 ${data.item.length}개 도서 수집`);
    return data.item;
    
  } catch (error) {
    console.error(`❌ 알라딘 API 호출 실패 (카테고리 ${categoryId}):`, error.message);
    return [];
  }
}

function transformAladinToBookExternal(aladinBook) {
  // category_id 범위 체크 (smallint 범위: -32768 ~ 32767)
  let categoryId = aladinBook.categoryId;
  if (categoryId && (categoryId > 32767 || categoryId < -32768)) {
    categoryId = null;
  }

  // item_id 숫자 변환
  let itemId = aladinBook.itemId;
  if (typeof itemId === 'string') {
    itemId = parseInt(itemId) || null;
  }

  return {
    isbn13: aladinBook.isbn13,
    item_id: itemId,
    title: aladinBook.title,
    author: aladinBook.author,
    publisher: aladinBook.publisher,
    pub_date: aladinBook.pubDate,
    cover_url: aladinBook.cover,
    category_id: categoryId,
    category_name: aladinBook.categoryName,
    price_standard: aladinBook.priceStandard,
    price_sales: aladinBook.priceSales,
    customer_review_rank: aladinBook.customerReviewRank,
    aladin_link: aladinBook.link,
    summary: aladinBook.description,
    raw: JSON.stringify(aladinBook),
    fetched_at: new Date().toISOString()
  };
}

async function saveBooksToDatabase(books) {
  if (!books || books.length === 0) {
    return { success: 0, failed: 0, errors: [] };
  }

  console.log(`💾 데이터베이스 저장 시도: ${books.length}개`);
  
  let success = 0;
  let failed = 0;
  const errors = [];

  for (const book of books) {
    try {
      // 기존 책 확인 (ISBN13으로)
      const { data: existing } = await supabase
        .from('book_external')
        .select('isbn13')
        .eq('isbn13', book.isbn13)
        .single();

      if (existing) {
        console.log(`⏭️ 이미 존재: ${book.title}`);
        continue;
      }

      // 새 책 저장
      const { error } = await supabase
        .from('book_external')
        .insert(book);

      if (error) {
        console.error(`❌ 저장 실패: ${book.title} - ${error.message}`);
        failed++;
        errors.push({ title: book.title, error: error.message });
      } else {
        console.log(`✅ 저장 성공: ${book.title}`);
        success++;
      }

    } catch (err) {
      console.error(`❌ 처리 실패: ${book.title} - ${err.message}`);
      failed++;
      errors.push({ title: book.title, error: err.message });
    }
  }

  return { success, failed, errors };
}

async function populateMainGenres() {
  try {
    console.log('🚀 주요 장르별 도서 수집 시작...\n');

    let totalSuccess = 0;
    let totalFailed = 0;
    const allErrors = [];

    // 각 장르별로 처리
    for (const genre of MAIN_GENRES) {
      console.log(`\n📚 ${genre.name} 장르 처리 중...`);
      
      // 각 리스트 타입별로 수집
      for (const listType of LIST_TYPES) {
        console.log(`\n  🔍 ${genre.name} - ${listType} 수집 중...`);
        
        const aladinBooks = await fetchAladinBooks(genre.categoryId, listType, 50);
        
        if (aladinBooks.length === 0) {
          console.log(`    ⚠️ ${listType}에서 데이터 없음`);
          continue;
        }

        // 알라딘 형식을 DB 형식으로 변환
        const transformedBooks = aladinBooks
          .filter(book => book.isbn13) // ISBN13이 있는 책만
          .map(transformAladinToBookExternal);

        console.log(`    📝 변환된 책: ${transformedBooks.length}개`);

        // 데이터베이스 저장
        const result = await saveBooksToDatabase(transformedBooks);
        
        totalSuccess += result.success;
        totalFailed += result.failed;
        allErrors.push(...result.errors);

        console.log(`    ✅ ${listType} 결과: 성공 ${result.success}개, 실패 ${result.failed}개`);
        
        // API 호출 간격 (1초 대기)
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log(`📊 ${genre.name} 완료`);
    }

    // 최종 결과
    console.log('\n🎯 전체 수집 결과:');
    console.log(`✅ 총 성공: ${totalSuccess}개`);
    console.log(`❌ 총 실패: ${totalFailed}개`);
    
    if (allErrors.length > 0) {
      console.log('\n🚨 오류 상세:');
      allErrors.slice(0, 10).forEach(err => {
        console.log(`  - ${err.title}: ${err.error}`);
      });
      if (allErrors.length > 10) {
        console.log(`  ... 및 ${allErrors.length - 10}개 더`);
      }
    }

    // 현재 데이터베이스 상태 확인
    const { count } = await supabase
      .from('book_external')
      .select('*', { count: 'exact', head: true });

    console.log(`\n📚 현재 데이터베이스 총 도서 수: ${count}개`);
    console.log('🎉 주요 장르 수집 완료!');

  } catch (error) {
    console.error('❌ 수집 중 오류:', error);
  }
}

populateMainGenres();
