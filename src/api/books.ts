import { supabase } from '../lib/supabase';
import { BookExternal } from '../types/database';
import { aladinApi, AladinBook } from '../services/aladinApi';

// 책 검색 (제목 또는 저자로)
export async function searchBooks(query: string, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('book_external')
      .select('*')
      .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
      .order('customer_review_rank', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error searching books:', error);
    return { data: null, error };
  }
}

// ISBN으로 책 조회
export async function getBookByIsbn(isbn13: string) {
  try {
    const { data, error } = await supabase
      .from('book_external')
      .select('*')
      .eq('isbn13', isbn13)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching book:', error);
    return { data: null, error };
  }
}

// 책 정보를 book_external 테이블에 저장
export async function saveBook(book: BookExternal) {
  try {
    // 이미 존재하는지 확인
    const { data: existingBook } = await supabase
      .from('book_external')
      .select('isbn13')
      .eq('isbn13', book.isbn13)
      .maybeSingle();

    if (existingBook) {
      // 이미 존재하면 저장하지 않음
      return { data: existingBook, error: null };
    }

    // 새로 저장 (item_id를 안전하게 처리)
    const insertData = {
      isbn13: book.isbn13,
      item_id: book.item_id ? (typeof book.item_id === 'number' ? book.item_id : parseInt(book.item_id.toString())) : null,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      pub_date: book.pub_date,
      cover_url: book.cover_url,
      category_id: book.category_id,
      category_name: book.category_name,
      price_standard: book.price_standard,
      price_sales: book.price_sales,
      customer_review_rank: book.customer_review_rank,
      aladin_link: book.aladin_link,
      summary: book.summary,
      raw: book.raw,
      fetched_at: new Date().toISOString()
    };

    console.log('📝 책 저장 데이터:', insertData);

    const { data, error } = await supabase
      .from('book_external')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving book:', error);
    return { data: null, error };
  }
}

// 카테고리별 책 목록
export async function getBooksByCategory(categoryId: number, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('book_external')
      .select('*')
      .eq('category_id', categoryId)
      .order('customer_review_rank', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching books by category:', error);
    return { data: null, error };
  }
}

// 인기 책 목록
export async function getPopularBooks(limit = 20) {
  try {
    const { data, error } = await supabase
      .from('book_external')
      .select('*')
      .not('customer_review_rank', 'is', null)
      .order('customer_review_rank', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching popular books:', error);
    return { data: null, error };
  }
}

// 최신 책 목록
export async function getRecentBooks(limit = 20) {
  try {
    const { data, error } = await supabase
      .from('book_external')
      .select('*')
      .order('pub_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching recent books:', error);
    return { data: null, error };
  }
}

// === 알라딘 API 연동 함수들 ===

// 단일 책 정보를 book_external에 저장
export async function saveBookToDatabase(bookData: Partial<BookExternal>) {
  try {
    const { data, error } = await supabase
      .from('book_external')
      .upsert(bookData, { 
        onConflict: 'isbn13',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving book to database:', error);
    return { data: null, error };
  }
}

// 여러 책 정보를 일괄 저장
export async function saveBooksToDatabase(booksData: Partial<BookExternal>[]) {
  try {
    const { data, error } = await supabase
      .from('book_external')
      .upsert(booksData, { 
        onConflict: 'isbn13',
        ignoreDuplicates: false 
      })
      .select();

    if (error) throw error;
    return { data, error: null, count: data?.length || 0 };
  } catch (error) {
    console.error('Error saving books to database:', error);
    return { data: null, error, count: 0 };
  }
}

// 알라딘에서 검색 후 자동 저장 (스마트 캐싱)
export async function searchBooksRealtime(query: string, maxResults = 200) {
  try {
    console.log('알라딘 API 검색 시작:', query);
    
    const aladinResponse = await aladinApi.searchBooks({
      query,
      queryType: 'Title',
      maxResults,
      sort: 'Accuracy'
    });

    console.log('알라딘 API 응답:', aladinResponse);

    if (!aladinResponse.item || aladinResponse.item.length === 0) {
      return {
        data: [],
        error: null,
        message: '검색 결과가 없습니다.',
        totalFound: 0
      };
    }

    const transformedBooks = aladinResponse.item
      .filter(book => book.isbn13)
      .map(book => aladinApi.transformToBookExternal(book));

    console.log('변환된 책 데이터:', transformedBooks);

    // 🚀 자동 캐싱: 검색 결과를 백그라운드에서 데이터베이스에 저장
    if (transformedBooks.length > 0) {
      saveBooksToDatabase(transformedBooks).then(result => {
        console.log(`📚 자동 캐싱: ${result.count}개 책이 데이터베이스에 저장됨`);
      }).catch(error => {
        console.log('자동 캐싱 실패 (무시됨):', error);
      });
    }

    return {
      data: transformedBooks,
      error: null,
      message: `${aladinResponse.item.length}개의 책을 찾았습니다`,
      totalFound: aladinResponse.item.length
    };
  } catch (error) {
    console.error('Error in searchBooksRealtime:', error);
    
    // API 오류 시 mock 데이터 반환 (개발용)
    if (process.env.NODE_ENV === 'development') {
      const mockBooks = getMockBooks(query);
      return {
        data: mockBooks,
        error: null,
        message: `${mockBooks.length}개의 책을 찾았습니다 (테스트 데이터)`,
        totalFound: mockBooks.length
      };
    }
    
    return {
      data: [],
      error,
      message: '검색 중 오류가 발생했습니다.',
      totalFound: 0
    };
  }
}

// 개발용 mock 데이터
function getMockBooks(query: string): Partial<BookExternal>[] {
  const mockData = [
    {
      isbn13: '9788954429245',
      item_id: 123456,
      title: '달러구트 꿈 백화점',
      author: '이미예',
      publisher: '팩토리나인',
      pub_date: '2020-07-08',
      cover_url: 'https://image.aladin.co.kr/product/24962/95/cover/8954429246_1.jpg',
      category_name: '소설',
      price_standard: 13800,
      price_sales: 12420,
      customer_review_rank: 45,
      summary: '잠들어야만 입장할 수 있는 신비한 꿈 백화점에서 벌어지는 따뜻하고 환상적인 이야기.',
      fetched_at: new Date().toISOString()
    },
    {
      isbn13: '9788936434267',
      item_id: 234567,
      title: '아몬드',
      author: '손원평',
      publisher: '창비',
      pub_date: '2017-03-31',
      cover_url: 'https://image.aladin.co.kr/product/10391/91/cover/8936434268_1.jpg',
      category_name: '청소년소설',
      price_standard: 12000,
      price_sales: 10800,
      customer_review_rank: 47,
      summary: '감정을 느끼지 못하는 소년의 성장 이야기.',
      fetched_at: new Date().toISOString()
    }
  ];

  // 무한스크롤 테스트를 위해 더 많은 mock 데이터 생성
  const extendedData = [];
  for (let i = 0; i < 50; i++) {
    extendedData.push({
      ...mockData[i % mockData.length],
      isbn13: `978895442924${i}`,
      item_id: 123456 + i,
      title: `${mockData[i % mockData.length].title} ${i + 1}`,
    });
  }

  // 쿼리와 관련된 책만 필터링
  return extendedData.filter(book => 
    book.title?.toLowerCase().includes(query.toLowerCase()) ||
    book.author?.toLowerCase().includes(query.toLowerCase())
  );
}

// 알라딘에서 검색하고 데이터베이스에 저장
export async function searchAndSaveBooks(query: string, maxResults = 20) {
  try {
    // 1. 알라딘 API에서 검색
    const aladinResponse = await aladinApi.searchBooks({
      query,
      queryType: 'Title',
      maxResults,
      sort: 'Accuracy'
    });

    if (!aladinResponse.item || aladinResponse.item.length === 0) {
      return { 
        data: [], 
        error: null, 
        message: '검색 결과가 없습니다.',
        savedCount: 0,
        totalFound: 0
      };
    }

    // 2. 데이터 변환
    const transformedBooks = aladinResponse.item
      .filter(book => book.isbn13) // ISBN이 있는 책만
      .map(book => aladinApi.transformToBookExternal(book));

    // 3. 데이터베이스에 저장
    const { data, error, count } = await saveBooksToDatabase(transformedBooks);

    return {
      data,
      error,
      message: `${aladinResponse.item.length}개 발견, ${count}개 저장`,
      savedCount: count,
      totalFound: aladinResponse.item.length
    };
  } catch (error) {
    console.error('Error in searchAndSaveBooks:', error);
    return { 
      data: null, 
      error, 
      message: '검색 및 저장 중 오류가 발생했습니다.',
      savedCount: 0,
      totalFound: 0
    };
  }
}

// 베스트셀러 수집 및 저장
export async function fetchAndSaveBestSellers(maxResults = 50) {
  try {
    const aladinResponse = await aladinApi.getBestSellers({ maxResults });

    if (!aladinResponse.item || aladinResponse.item.length === 0) {
      return { 
        data: [], 
        error: null, 
        message: '베스트셀러 데이터가 없습니다.',
        savedCount: 0
      };
    }

    const transformedBooks = aladinResponse.item
      .filter(book => book.isbn13)
      .map(book => aladinApi.transformToBookExternal(book));

    const { data, error, count } = await saveBooksToDatabase(transformedBooks);

    return {
      data,
      error,
      message: `베스트셀러 ${count}개 저장 완료`,
      savedCount: count
    };
  } catch (error) {
    console.error('Error in fetchAndSaveBestSellers:', error);
    return { 
      data: null, 
      error, 
      message: '베스트셀러 수집 중 오류가 발생했습니다.',
      savedCount: 0
    };
  }
}

// 신간 도서 수집 및 저장
export async function fetchAndSaveNewBooks(maxResults = 50) {
  try {
    const aladinResponse = await aladinApi.getNewBooks({ maxResults });

    if (!aladinResponse.item || aladinResponse.item.length === 0) {
      return { 
        data: [], 
        error: null, 
        message: '신간 데이터가 없습니다.',
        savedCount: 0
      };
    }

    const transformedBooks = aladinResponse.item
      .filter(book => book.isbn13)
      .map(book => aladinApi.transformToBookExternal(book));

    const { data, error, count } = await saveBooksToDatabase(transformedBooks);

    return {
      data,
      error,
      message: `신간 도서 ${count}개 저장 완료`,
      savedCount: count
    };
  } catch (error) {
    console.error('Error in fetchAndSaveNewBooks:', error);
    return { 
      data: null, 
      error, 
      message: '신간 도서 수집 중 오류가 발생했습니다.',
      savedCount: 0
    };
  }
}

// 카테고리별 도서 수집 및 저장
export async function fetchAndSaveBooksbyCategory(categoryId: number, maxResults = 50) {
  try {
    const aladinResponse = await aladinApi.getBooksByCategory(categoryId, { maxResults });

    if (!aladinResponse.item || aladinResponse.item.length === 0) {
      return { 
        data: [], 
        error: null, 
        message: `카테고리 ${categoryId} 데이터가 없습니다.`,
        savedCount: 0
      };
    }

    const transformedBooks = aladinResponse.item
      .filter(book => book.isbn13)
      .map(book => aladinApi.transformToBookExternal(book));

    const { data, error, count } = await saveBooksToDatabase(transformedBooks);

    return {
      data,
      error,
      message: `카테고리 ${categoryId} 도서 ${count}개 저장 완료`,
      savedCount: count
    };
  } catch (error) {
    console.error('Error in fetchAndSaveBooksbyCategory:', error);
    return { 
      data: null, 
      error, 
      message: `카테고리 ${categoryId} 수집 중 오류가 발생했습니다.`,
      savedCount: 0
    };
  }
}

// 데이터베이스 책 수 조회
export async function getBooksCount() {
  try {
    const { count, error } = await supabase
      .from('book_external')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return { count, error: null };
  } catch (error) {
    console.error('Error counting books:', error);
    return { count: 0, error };
  }
}

// 랜덤 책 조회 (전체 책에서)
export async function getRandomBooks(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('book_external')
      .select('*')
      .order('fetched_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return { 
      data, 
      error: null,
      message: `${data?.length || 0}개의 책을 조회했습니다`,
      totalFound: data?.length || 0
    };
  } catch (error) {
    console.error('Error getting random books:', error);
    return { 
      data: [], 
      error,
      message: '책 조회 중 오류가 발생했습니다',
      totalFound: 0
    };
  }
}

// 카테고리별 책 조회 (데이터베이스에서)
// export async function getBooksByCategory(categoryId: number, limit = 50) {
//   try {
//     const { data, error } = await supabase
//       .from('book_external')
//       .select('*')
//       .eq('category_id', categoryId)
//       .order('fetched_at', { ascending: false })
//       .limit(limit);

//     if (error) throw error;
    
//     return { 
//       data, 
//       error: null,
//       message: `카테고리 ${categoryId}에서 ${data?.length || 0}개의 책을 조회했습니다`,
//       totalFound: data?.length || 0
//     };
//   } catch (error) {
//     console.error('Error getting books by category:', error);
//     return { 
//       data: [], 
//       error,
//       message: `카테고리 ${categoryId} 조회 중 오류가 발생했습니다`,
//       totalFound: 0
//     };
//   }
// }
