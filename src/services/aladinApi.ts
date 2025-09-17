// 알라딘 Open API 서비스
import { BookExternal } from '../types/database';

interface AladinApiParams {
  query?: string;
  queryType?: 'Title' | 'Author' | 'Publisher' | 'Keyword' | 'ISBN' | 'Bestseller' | 'ItemNewAll' | 'ItemIdSearch';
  categoryId?: number;
  start?: number;
  maxResults?: number;
  sort?: 'Accuracy' | 'PublishTime' | 'Title' | 'SalesPoint' | 'CustomerRating' | 'ReviewCount' | 'PriceAsc' | 'PriceDesc';
  searchTarget?: 'Book' | 'Foreign' | 'Music' | 'DVD' | 'Used' | 'eBook' | 'All';
  output?: 'xml' | 'js';
  version?: string;
  optResult?: string[];
}

interface AladinBook {
  title: string;
  author: string;
  pubDate: string;
  description: string;
  isbn13: string;
  itemId: number;
  priceSales: number;
  priceStandard: number;
  mallType: string;
  stockStatus: string;
  mileage: number;
  cover: string;
  categoryId: number;
  categoryName: string;
  publisher: string;
  salesPoint: number;
  adult: boolean;
  fixedPrice: boolean;
  customerReviewRank: number;
  subInfo?: any;
  seriesInfo?: any;
  fullDescription?: string; // 상세 설명에서 페이지 수 추출 가능
}

interface AladinApiResponse {
  version: string;
  logo: string;
  title: string;
  link: string;
  pubDate: string;
  totalResults: number;
  startIndex: number;
  itemsPerPage: number;
  query: string;
  searchCategoryId: number;
  searchCategoryName: string;
  item: AladinBook[];
}

const ALADIN_API_BASE_URL = 'http://www.aladin.co.kr/ttb/api';
const API_KEY = import.meta.env.VITE_ALADIN_API_KEY;

// CORS 문제 해결을 위한 프록시 URL (실제 운영에서는 백엔드에서 처리)
const PROXY_URL = 'https://api.allorigins.win/get?url=';

class AladinApiService {
  private buildUrl(endpoint: string, params: AladinApiParams): string {
    const url = new URL(`${ALADIN_API_BASE_URL}/${endpoint}`);
    
    // 기본 파라미터
    url.searchParams.append('ttbkey', API_KEY || 'demo_key');
    url.searchParams.append('output', params.output || 'js');
    url.searchParams.append('version', params.version || '20131101');
    
    // 선택적 파라미터
    if (params.query) url.searchParams.append('Query', params.query);
    if (params.queryType) url.searchParams.append('QueryType', params.queryType);
    if (params.categoryId) url.searchParams.append('CategoryId', params.categoryId.toString());
    if (params.start) url.searchParams.append('Start', params.start.toString());
    if (params.maxResults) url.searchParams.append('MaxResults', params.maxResults.toString());
    if (params.sort) url.searchParams.append('Sort', params.sort);
    if (params.searchTarget) url.searchParams.append('SearchTarget', params.searchTarget);
    if (params.optResult && params.optResult.length > 0) {
      url.searchParams.append('OptResult', params.optResult.join(','));
    }

    return url.toString();
  }

  private async makeRequest(url: string): Promise<AladinApiResponse> {
    try {
      if (!API_KEY || API_KEY === 'your_aladin_api_key_here') {
        throw new Error('알라딘 API 키가 설정되지 않았습니다. .env 파일에 VITE_ALADIN_API_KEY를 설정해주세요.');
      }

      // CORS 프록시를 통한 요청
      const proxyUrl = `${PROXY_URL}${encodeURIComponent(url)}`;
      console.log('알라딘 API 호출:', proxyUrl);
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const result = JSON.parse(data.contents);
      console.log('알라딘 API 응답:', result);
      
      return result;
    } catch (error) {
      console.error('Aladin API request failed:', error);
      throw new Error(`알라딘 API 요청에 실패했습니다: ${(error as Error).message}`);
    }
  }

  // 도서 검색
  async searchBooks(params: AladinApiParams): Promise<AladinApiResponse> {
    const url = this.buildUrl('ItemSearch.aspx', {
      ...params,
      searchTarget: params.searchTarget || 'Book',
      sort: params.sort || 'Accuracy',
      maxResults: params.maxResults || 20,
      optResult: ['ratingInfo', 'description', 'fulldescription', 'authors', 'publisher', 'subInfo']
    });

    return this.makeRequest(url);
  }

  // 베스트셀러 조회
  async getBestSellers(params: Partial<AladinApiParams> = {}): Promise<AladinApiResponse> {
    const url = this.buildUrl('ItemList.aspx', {
      ...params,
      queryType: 'Bestseller',
      searchTarget: params.searchTarget || 'Book',
      maxResults: params.maxResults || 50,
      optResult: ['ratingInfo', 'description', 'authors', 'publisher', 'subInfo']
    });

    return this.makeRequest(url);
  }

  // 신간 도서 조회
  async getNewBooks(params: Partial<AladinApiParams> = {}): Promise<AladinApiResponse> {
    const url = this.buildUrl('ItemList.aspx', {
      ...params,
      queryType: 'ItemNewAll',
      searchTarget: params.searchTarget || 'Book',
      maxResults: params.maxResults || 50,
      optResult: ['ratingInfo', 'description', 'authors', 'publisher', 'subInfo']
    });

    return this.makeRequest(url);
  }

  // 카테고리별 도서 조회
  async getBooksByCategory(categoryId: number, params: Partial<AladinApiParams> = {}): Promise<AladinApiResponse> {
    const url = this.buildUrl('ItemList.aspx', {
      ...params,
      queryType: 'Bestseller',
      categoryId,
      searchTarget: 'Book',
      maxResults: params.maxResults || 50,
      optResult: ['ratingInfo', 'description', 'authors', 'publisher', 'subInfo']
    });

    return this.makeRequest(url);
  }

  // 특정 도서 상세 정보 조회
  async getBookDetail(itemId: number): Promise<AladinApiResponse> {
    const url = this.buildUrl('ItemLookUp.aspx', {
      queryType: 'ItemIdSearch',
      query: itemId.toString(),
      optResult: ['ratingInfo', 'description', 'fulldescription', 'authors', 'publisher', 'categoryIdList']
    });

    return this.makeRequest(url);
  }

  // 페이지 수 추출 함수
  private extractPageCount(aladinBook: AladinBook): number | null {
    try {
      console.log(`🔍 "${aladinBook.title}" 페이지 수 추출 시도...`);
      
      // 1. subInfo에서 페이지 수 추출 시도 (개선된 패턴)
      if (aladinBook.subInfo) {
        console.log('📋 subInfo:', aladinBook.subInfo);
        const subInfoStr = JSON.stringify(aladinBook.subInfo);
        console.log('📋 subInfoStr:', subInfoStr);
        
        const patterns = [
          /(\d+)\s*페이지/gi,
          /(\d+)\s*p\b/gi,
          /(\d+)\s*쪽/gi,
          /페이지\s*:\s*(\d+)/gi,
          /총\s*(\d+)\s*페이지/gi
        ];
        
        for (const pattern of patterns) {
          const match = subInfoStr.match(pattern);
          if (match) {
            const pageNum = parseInt(match[1]);
            console.log(`✅ subInfo에서 페이지 수 발견: ${pageNum} (패턴: ${pattern})`);
            if (pageNum > 0 && pageNum < 10000) return pageNum;
          }
        }
        console.log('❌ subInfo에서 페이지 수 추출 실패');
      }
      
      // 2. fullDescription에서 페이지 수 추출 시도
      if (aladinBook.fullDescription) {
        const patterns = [
          /(\d+)\s*페이지/gi,
          /(\d+)\s*p\b/gi,
          /(\d+)\s*쪽/gi
        ];
        
        for (const pattern of patterns) {
          const match = aladinBook.fullDescription.match(pattern);
          if (match) {
            const pageNum = parseInt(match[1]);
            if (pageNum > 0 && pageNum < 10000) return pageNum;
          }
        }
      }
      
      // 3. description에서 페이지 수 추출 시도
      if (aladinBook.description) {
        const patterns = [
          /(\d+)\s*페이지/gi,
          /(\d+)\s*p\b/gi,
          /(\d+)\s*쪽/gi
        ];
        
        for (const pattern of patterns) {
          const match = aladinBook.description.match(pattern);
          if (match) {
            const pageNum = parseInt(match[1]);
            if (pageNum > 0 && pageNum < 10000) return pageNum;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.warn('페이지 수 추출 실패:', error);
      return null;
    }
  }

  // 🔥 기본값 함수 제거됨 - 실제 데이터만 사용!

  // 알라딘 데이터를 book_external 스키마에 맞게 변환
  transformToBookExternal(aladinBook: AladinBook): Partial<BookExternal> {
    // smallint 범위 체크 함수 (-32,768 ~ 32,767)
    const toSmallInt = (value: number | null | undefined): number | null => {
      if (value === null || value === undefined) return null;
      if (value < -32768 || value > 32767) {
        console.warn(`Value ${value} out of smallint range, setting to null`);
        return null;
      }
      return value;
    };

    // 페이지 수 추출 시도 - 기본값 사용하지 않음!
    const extractedPageCount = this.extractPageCount(aladinBook);
    
    console.log(`📖 "${aladinBook.title}" 최종 페이지 수: ${extractedPageCount || 'null'} ${extractedPageCount ? '(추출됨)' : '(추출 실패 - null 저장)'}`);

    return {
      isbn13: aladinBook.isbn13,
      item_id: aladinBook.itemId,
      title: aladinBook.title || '',
      author: aladinBook.author || null,
      publisher: aladinBook.publisher || null,
      pub_date: aladinBook.pubDate ? this.parseDate(aladinBook.pubDate) : null,
      cover_url: aladinBook.cover || null,
      category_id: toSmallInt(aladinBook.categoryId),
      category_name: aladinBook.categoryName || null,
      price_standard: toSmallInt(aladinBook.priceStandard),
      price_sales: toSmallInt(aladinBook.priceSales),
      customer_review_rank: toSmallInt(aladinBook.customerReviewRank),
      aladin_link: `https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=${aladinBook.itemId}`,
      summary: aladinBook.description || null,
      page_count: extractedPageCount, // 🆕 실제 페이지 수만 (기본값 없음)
      raw: aladinBook, // 원본 데이터 보관
      fetched_at: new Date().toISOString()
    };
  }

  private parseDate(dateString: string): string | null {
    try {
      // 알라딘 날짜 형식: "2024-01-15" 또는 "2024-01-15 00:00:00"
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    } catch (error) {
      console.warn('Date parsing failed:', dateString);
      return null;
    }
  }
}

export const aladinApi = new AladinApiService();
export type { AladinBook, AladinApiResponse, AladinApiParams };
