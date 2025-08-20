const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// .env 파일 직접 읽기
let envVars = {};
try {
  const envContent = fs.readFileSync('../.env', 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
} catch (error) {
  console.log('환경변수를 직접 입력해주세요.');
  process.exit(1);
}

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);
const ALADIN_API_KEY = envVars.VITE_ALADIN_API_KEY;

// 알라딘 문학 카테고리들
const literatureCategories = [
  { id: 1, name: '소설' },
  { id: 2, name: '시/에세이' },
  { id: 3, name: '예술/대중문화' },
  { id: 4, name: '수필' },
  { id: 50924, name: '한국소설' },
  { id: 50925, name: '외국소설' },
  { id: 50929, name: '추리/스릴러' },
  { id: 50931, name: '로맨스' },
  { id: 50932, name: '판타지/SF' },
  { id: 2551, name: '시' },
  { id: 2557, name: '에세이' },
  { id: 2559, name: '산문' },
  { id: 2560, name: '수필' },
];

async function fetchBooksFromAladin(categoryId, start = 1, maxResults = 50) {
  const url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx`;
  const params = new URLSearchParams({
    ttbkey: ALADIN_API_KEY,
    QueryType: 'ItemNewAll',
    CategoryId: categoryId.toString(),
    MaxResults: maxResults.toString(),
    start: start.toString(),
    SearchTarget: 'Book',
    output: 'js',
    Version: '20131101'
  });

  try {
    console.log(`📚 알라딘 API 호출: 카테고리 ${categoryId}, 시작 ${start}`);
    const response = await fetch(`${url}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`알라딘 API 오류 (카테고리 ${categoryId}):`, error);
    return null;
  }
}

function transformToBookExternal(aladinBook) {
  // smallint 범위(32767)를 초과하는 값들은 null로 저장
  const categoryId = aladinBook.categoryId && aladinBook.categoryId <= 32767 ? aladinBook.categoryId : null;
  const priceStandard = aladinBook.priceStandard && aladinBook.priceStandard <= 32767 ? aladinBook.priceStandard : null;
  const priceSales = aladinBook.priceSales && aladinBook.priceSales <= 32767 ? aladinBook.priceSales : null;
  
  return {
    isbn13: aladinBook.isbn13,
    item_id: aladinBook.itemId || null,
    title: aladinBook.title,
    author: aladinBook.author,
    publisher: aladinBook.publisher,
    pub_date: aladinBook.pubDate,
    cover_url: aladinBook.cover,
    category_id: categoryId,
    category_name: aladinBook.categoryName || null,
    price_standard: priceStandard,
    price_sales: priceSales,
    customer_review_rank: aladinBook.customerReviewRank || null,
    aladin_link: aladinBook.link || null,
    summary: aladinBook.description || null,
    raw: JSON.stringify(aladinBook),
    fetched_at: new Date().toISOString()
  };
}

async function saveBooksToDatabase(books) {
  try {
    const { data, error } = await supabase
      .from('book_external')
      .upsert(books, { 
        onConflict: 'isbn13',
        ignoreDuplicates: false 
      })
      .select();

    if (error) throw error;
    return { data, error: null, count: data?.length || 0 };
  } catch (error) {
    console.error('데이터베이스 저장 오류:', error);
    return { data: null, error, count: 0 };
  }
}

async function collectLiteratureBooks() {
  console.log('📖 문학/소설 도서 수집 시작!');
  
  let totalCollected = 0;
  
  for (const category of literatureCategories) {
    console.log(`\n🎯 카테고리: ${category.name} (ID: ${category.id})`);
    
    // 각 카테고리에서 여러 페이지 수집
    const pages = 3; // 페이지당 50권씩, 3페이지 = 150권
    
    for (let page = 1; page <= pages; page++) {
      const start = (page - 1) * 50 + 1;
      
      const aladinResponse = await fetchBooksFromAladin(category.id, start, 50);
      
      if (!aladinResponse || !aladinResponse.item || aladinResponse.item.length === 0) {
        console.log(`  페이지 ${page}: 데이터 없음`);
        break;
      }
      
      // ISBN이 있는 책만 필터링
      const validBooks = aladinResponse.item
        .filter(book => book.isbn13)
        .map(book => transformToBookExternal(book));
      
      if (validBooks.length > 0) {
        const saveResult = await saveBooksToDatabase(validBooks);
        
        if (saveResult.error) {
          console.error(`  페이지 ${page} 저장 실패:`, saveResult.error);
        } else {
          console.log(`  ✅ 페이지 ${page}: ${saveResult.count}권 저장`);
          totalCollected += saveResult.count;
        }
      }
      
      // API 호출 간격 (알라딘 API 제한 고려)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`\n🎉 문학/소설 도서 수집 완료!`);
  console.log(`📚 총 ${totalCollected}권의 책이 추가되었습니다.`);
  
  // 최종 통계
  const { data: finalCount } = await supabase
    .from('book_external')
    .select('*', { count: 'exact', head: true });
    
  console.log(`💫 현재 데이터베이스 총 책 수: ${finalCount}권`);
}

// 스크립트 실행
collectLiteratureBooks()
  .then(() => {
    console.log('✨ 완료!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ 오류:', error);
    process.exit(1);
  });
