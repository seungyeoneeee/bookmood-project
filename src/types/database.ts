export interface BookExternal {
  isbn13: string;
  item_id: number;
  title: string;
  author?: string;
  publisher?: string;
  pub_date?: string;
  cover_url?: string;
  category_id?: number | null;
  category_name?: string;
  price_standard?: number | null;
  price_sales?: number | null;
  customer_review_rank?: number | null;
  aladin_link?: string;
  summary?: string;
  raw?: Record<string, unknown>;
  fetched_at?: string;
}

export interface LibraryItem {
  id: string;
  user_id: string;
  isbn13: string;
  is_wishlist: boolean; // 🆕 위시리스트 여부
  shelf_status?: string; // is_wishlist가 false일 때만 필수
  progress?: number;
  started_at?: string;
  finished_at?: string;
  note?: string;
  created_at: string;
  updated_at: string;
  // 조인된 책 정보
  book?: BookExternal;
}

export interface Review {
  id: string;
  user_id: string;
  isbn13: string;
  read_date?: string;
  memo?: string;
  created_at: string;
  updated_at: string;
  // 조인된 데이터
  book?: BookExternal;
  emotions?: ReviewEmotion[];
  topics?: ReviewTopic[];
}

export interface ReviewEmotion {
  id: string;
  review_id: string;
  emotion: string;
  score?: number;
  source: string;
  created_at: string;
}

export interface ReviewTopic {
  id: string;
  review_id: string;
  keyword: string;
  weight?: number;
  source: string;
  created_at: string;
}

export interface SummaryPeriod {
  id: string;
  user_id: string;
  period_type: string;
  period: string;
  emotion_status?: Record<string, unknown>;
  top_books?: Record<string, unknown>;
  created_at: string;
  refreshed_at?: string;
}

// 책장 상태 타입
export type ShelfStatus = 'reading' | 'completed' | 'want_to_read' | 'paused' | 'dropped';

// 기간 타입
export type PeriodType = 'monthly' | 'quarterly' | 'yearly';

// 입력용 타입들
export interface CreateLibraryItemInput {
  isbn13: string;
  is_wishlist: boolean; // 🆕 위시리스트 여부
  shelf_status?: ShelfStatus; // is_wishlist가 false일 때만 필수
  progress?: number;
  started_at?: string;
  finished_at?: string;
  note?: string;
}

export interface UpdateLibraryItemInput {
  shelf_status?: ShelfStatus;
  progress?: number;
  started_at?: string;
  finished_at?: string;
  note?: string;
}

export interface CreateReviewInput {
  isbn13: string;
  user_id?: string;
  read_date?: string;
  memo: string;
  // 🆕 감성 분석 기능을 위한 추가 필드들 (배열로 수정)
  emotions?: string[];
  mood_summary?: string;
  rating?: number;
}

export interface UpdateReviewInput {
  read_date?: string;
  memo?: string;
}
