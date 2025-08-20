/**
 * RLS 우회 배치 책 동기화 스크립트
 * Supabase Service Role Key를 사용하여 RLS 정책을 우회하고 책 데이터를 저장합니다.
 * 
 * 주의: Service Role Key는 보안상 매우 민감한 정보입니다.
 * 실제 환경에서는 안전한 서버 환경에서만 사용해야 합니다.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// 환경변수 로드 (상위 디렉토리의 .env 파일)
dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service Role Key 필요
const ALADIN_API_KEY = process.env.VITE_ALADIN_API_KEY;
const ALADIN_BASE_URL = 'http://www.aladin.co.kr/ttb/api/ItemList.aspx';

console.log('🔧 환경변수 확인:', {
  supabaseUrl: supabaseUrl ? '설정됨' : '없음',
  supabaseServiceKey: supabaseServiceKey ? '설정됨' : '없음',
  aladinApiKey: ALADIN_API_KEY ? '설정됨' : '없음'
});

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  console.error('VITE_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY가 필요합니다.');
  process.exit(1);
}

if (!ALADIN_API_KEY) {
  console.error('❌ 알라딘 API 키가 설정되지 않았습니다. VITE_ALADIN_API_KEY를 확인해주세요.');
  process.exit(1);
}

// Service Role Key로 클라이언트 생성 (RLS 우회)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 알라딘 API에서 책 목록 가져오기
 */
async function fetchBooksFromAladin(queryType = 'Bestseller', maxResults = 50, start = 1) {
  try {
    const url = new URL(ALADIN_BASE_URL);
    url.searchParams.append('ttbkey', ALADIN_API_KEY);
    url.searchParams.append('QueryType', queryType);
    url.searchParams.append('MaxResults', maxResults.toString());
    url.searchParams.append('Start', start.toString());
    url.searchParams.append('SearchTarget', 'Book');
    url.searchParams.append('output', 'js');
    url.searchParams.append('Version', '20131101');

    console.log(`📡 알라딘 API 호출: ${queryType} (${start}~${start + maxResults - 1})`);
    
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.errorCode) {
      console.error(`❌ 알라딘 API 오류: ${data.errorMessage}`);
      return [];
    }

    return data.item || [];
  } catch (error) {
    console.error('❌ 알라딘 API 호출 실패:', error.message);
    return [];
  }
}

/**
 * 책 데이터를 Supabase에 저장
 */
async function saveBookToSupabase(bookData) {
  try {
    // 중복 체크
    const { data: existing } = await supabase
      .from('book_external')
      .select('isbn13')
      .eq('isbn13', bookData.isbn13)
      .single();

    if (existing) {
      console.log(`⚠️ 이미 존재: ${bookData.title}`);
      return { success: true, action: 'skipped' };
    }

    // 새 책 삽입
    const { error } = await supabase
      .from('book_external')
      .insert(bookData);

    if (error) {
      throw error;
    }

    console.log(`✅ 저장 성공: ${bookData.title}`);
    return { success: true, action: 'inserted' };

  } catch (error) {
    console.error(`❌ 책 저장 실패 (${bookData.title}): ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * 책 목록 수집 및 저장
 */
async function syncBooksForQueryType(queryType, maxPages = 2) {
  const results = {
    total: 0,
    inserted: 0,
    skipped: 0,
    failed: 0,
    errors: []
  };

  console.log(`\n📚 ${queryType} 수집 중...`);

  for (let page = 1; page <= maxPages; page++) {
    const start = (page - 1) * 50 + 1;
    const books = await fetchBooksFromAladin(queryType, 50, start);
    
    if (!books || books.length === 0) {
      console.log(`  📖 ${page}페이지: 책을 찾을 수 없습니다.`);
      break;
    }

    console.log(`  📖 ${page}페이지: ${books.length}권 발견`);

    for (const item of books) {
      if (!item.isbn13) {
        console.log(`⚠️ ISBN 없음: ${item.title || 'Unknown'}`);
        continue;
      }

      // category_id가 smallint 범위(32767)를 초과하면 null로 설정
      const categoryId = parseInt(item.categoryId) || null;
      const validCategoryId = categoryId && categoryId <= 32767 ? categoryId : null;
      
      const bookData = {
        isbn13: item.isbn13,
        item_id: item.itemId || Math.floor(Math.random() * 1000000), // itemId 필수
        title: item.title,
        author: item.author,
        cover_url: item.cover, // cover → cover_url
        category_id: validCategoryId,
        category_name: item.categoryName || null,
        publisher: item.publisher || null,
        pub_date: item.pubDate || null,
        summary: item.description || null, // description → summary
        price_standard: parseInt(item.priceStandard) || null,
        price_sales: parseInt(item.priceSales) || null,
        customer_review_rank: parseFloat(item.customerReviewRank) || null, // rating → customer_review_rank
        aladin_link: `https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=${item.itemId}`,
        raw: item, // 원본 데이터 보관
        fetched_at: new Date().toISOString()
      };

      const result = await saveBookToSupabase(bookData);
      results.total++;

      if (result.success) {
        if (result.action === 'inserted') {
          results.inserted++;
        } else {
          results.skipped++;
        }
      } else {
        results.failed++;
        results.errors.push(`${bookData.title}: ${result.error}`);
      }
    }

    // API 호출 간격 조정
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('🚀 RLS 우회 책 배치 동기화 시작...\n');
  
  const queryTypes = [
    'Bestseller',      // 베스트셀러
    'ItemNewAll',      // 신간 전체
    'ItemNewSpecial'   // 신간 주목할만한 도서
  ];

  const totalResults = {
    total: 0,
    inserted: 0,
    skipped: 0,
    failed: 0,
    errors: []
  };

  for (const queryType of queryTypes) {
    try {
      const results = await syncBooksForQueryType(queryType, 2);
      
      totalResults.total += results.total;
      totalResults.inserted += results.inserted;
      totalResults.skipped += results.skipped;
      totalResults.failed += results.failed;
      totalResults.errors.push(...results.errors);

      console.log(`\n📊 ${queryType} 결과:`);
      console.log(`  - 총 처리: ${results.total}권`);
      console.log(`  - 새로 저장: ${results.inserted}권`);
      console.log(`  - 이미 존재: ${results.skipped}권`);
      console.log(`  - 실패: ${results.failed}권`);

    } catch (error) {
      console.error(`❌ ${queryType} 처리 중 오류:`, error.message);
    }
  }

  console.log('\n🎉 배치 동기화 완료!');
  console.log('📊 전체 결과:');
  console.log(`  - 총 처리: ${totalResults.total}권`);
  console.log(`  - 새로 저장: ${totalResults.inserted}권`);
  console.log(`  - 이미 존재: ${totalResults.skipped}권`);
  console.log(`  - 실패: ${totalResults.failed}권`);

  if (totalResults.errors.length > 0) {
    console.log('\n❌ 오류 목록 (처음 10개):');
    totalResults.errors.slice(0, 10).forEach(error => {
      console.log(`  - ${error}`);
    });
  }
}

// 스크립트 실행
main().catch(console.error);
