#!/usr/bin/env node

/**
 * 📚 BookMood 책 정보 배치 동기화 스크립트
 * 
 * 매일 오전에 실행되어 알라딘 API에서 책 정보를 가져와서
 * book_external 테이블에 저장하는 배치 작업
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// 환경변수 로드 (상위 디렉토리의 .env 파일)
dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
// 알라딘 API 설정 (.env 파일에서 읽어오기)
const ALADIN_API_KEY = process.env.VITE_ALADIN_API_KEY;
const ALADIN_BASE_URL = 'http://www.aladin.co.kr/ttb/api/ItemList.aspx';

console.log('🔧 환경변수 확인:', {
  supabaseUrl: supabaseUrl ? '설정됨' : '없음',
  supabaseKey: supabaseKey ? '설정됨' : '없음',
  aladinApiKey: ALADIN_API_KEY ? '설정됨' : '없음'
});

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

if (!ALADIN_API_KEY) {
  console.error('❌ 알라딘 API 키가 설정되지 않았습니다. VITE_ALADIN_API_KEY를 확인해주세요.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 알라딘 API에서 책 목록 가져오기
 */
async function fetchBooksFromAladin(queryType = 'Bestseller', maxResults = 50, start = 1) {
  try {
    const params = new URLSearchParams({
      ttbkey: ALADIN_API_KEY,
      QueryType: queryType,
      MaxResults: maxResults.toString(),
      start: start.toString(),
      SearchTarget: 'Book',
      output: 'js',
      Version: '20131101'
    });

    const response = await fetch(`${ALADIN_BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.item || [];
  } catch (error) {
    console.error(`❌ 알라딘 API 호출 실패 (${queryType}):`, error.message);
    return [];
  }
}

/**
 * 알라딘 책 데이터를 BookExternal 형식으로 변환
 */
function transformAladinBook(aladinBook) {
  return {
    isbn13: aladinBook.isbn13 || aladinBook.isbn,
    item_id: aladinBook.itemId,
    title: aladinBook.title,
    author: aladinBook.author,
    publisher: aladinBook.publisher,
    pub_date: aladinBook.pubDate,
    cover_url: aladinBook.cover,
    category_id: aladinBook.categoryId,
    category_name: aladinBook.categoryName,
    price_standard: parseInt(aladinBook.priceStandard) || null,
    price_sales: parseInt(aladinBook.priceSales) || null,
    customer_review_rank: parseInt(aladinBook.customerReviewRank) || null,
    aladin_link: aladinBook.link,
    summary: aladinBook.description,
    raw: aladinBook,
    fetched_at: new Date().toISOString()
  };
}

/**
 * 책 정보를 book_external 테이블에 저장 (중복 체크)
 */
async function saveBookToDatabase(book) {
  try {
    // ISBN13이 없으면 스킵
    if (!book.isbn13) {
      return { success: false, reason: 'No ISBN13' };
    }

    // 이미 존재하는지 확인
    const { data: existingBook } = await supabase
      .from('book_external')
      .select('isbn13')
      .eq('isbn13', book.isbn13)
      .maybeSingle();

    if (existingBook) {
      return { success: false, reason: 'Already exists' };
    }

    // 새로 저장
    const { data, error } = await supabase
      .from('book_external')
      .insert(book)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error(`❌ 책 저장 실패 (${book.title}):`, error.message);
    return { success: false, reason: error.message };
  }
}

/**
 * 메인 배치 작업 실행
 */
async function runBatchSync() {
  console.log('🚀 BookMood 책 정보 배치 동기화 시작...');
  console.log(`📅 실행 시간: ${new Date().toLocaleString('ko-KR')}`);
  
  const stats = {
    total: 0,
    saved: 0,
    skipped: 0,
    failed: 0
  };

  // 다양한 카테고리의 책들을 수집
  const queryTypes = [
    { type: 'Bestseller', name: '베스트셀러' },
    { type: 'ItemNewAll', name: '신간 전체' },
    { type: 'ItemNewSpecial', name: '신간 주목할만한' },
    { type: 'BlogBest', name: '블로거 베스트' }
  ];

  for (const { type, name } of queryTypes) {
    console.log(`\n📚 ${name} 수집 중...`);
    
    // 각 카테고리당 100권씩 (2페이지)
    for (let page = 1; page <= 2; page++) {
      const books = await fetchBooksFromAladin(type, 50, (page - 1) * 50 + 1);
      
      console.log(`  📖 ${page}페이지: ${books.length}권 발견`);
      
      for (const aladinBook of books) {
        const book = transformAladinBook(aladinBook);
        const result = await saveBookToDatabase(book);
        
        stats.total++;
        
        if (result.success) {
          stats.saved++;
          console.log(`  ✅ 저장: ${book.title}`);
        } else if (result.reason === 'Already exists') {
          stats.skipped++;
        } else {
          stats.failed++;
          console.log(`  ❌ 실패: ${book.title} (${result.reason})`);
        }
        
        // API 호출 제한을 위한 딜레이
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  // 결과 출력
  console.log('\n📊 배치 작업 완료!');
  console.log(`📈 총 처리: ${stats.total}권`);
  console.log(`✅ 새로 저장: ${stats.saved}권`);
  console.log(`⏭️ 이미 존재: ${stats.skipped}권`);
  console.log(`❌ 실패: ${stats.failed}권`);
  console.log(`📅 완료 시간: ${new Date().toLocaleString('ko-KR')}`);

  return stats;
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  runBatchSync()
    .then(stats => {
      if (stats.saved > 0) {
        console.log('🎉 배치 작업이 성공적으로 완료되었습니다!');
      } else {
        console.log('ℹ️ 새로 추가된 책이 없습니다.');
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 배치 작업 실패:', error);
      process.exit(1);
    });
}

export { runBatchSync };
