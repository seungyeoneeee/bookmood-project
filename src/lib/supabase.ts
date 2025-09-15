import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase 설정 가져오기
// 실제 사용 시에는 .env 파일에서 아래 값들을 설정해주세요
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your_supabase_project_url';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key';

// 임시 테스트용 - 실제 값으로 교체해주세요
// const supabaseUrl = 'https://your-project.supabase.co';
// const supabaseAnonKey = 'your-anon-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다!');
  console.log('VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 .env 파일에 설정해주세요.');
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
  }
});

// 타입 정의를 위한 Database 타입
export type Database = {
  public: {
    Tables: {
      book_external: {
        Row: {
          isbn13: string;
          item_id: number;
          title: string;
          author: string | null;
          publisher: string | null;
          pub_date: string | null;
          cover_url: string | null;
          category_id: number | null;
          category_name: string | null;
          price_standard: number | null;
          price_sales: number | null;
          customer_review_rank: number | null;
          aladin_link: string | null;
          summary: string | null;
          raw: Record<string, unknown> | null;
          fetched_at: string | null;
        };
        Insert: {
          isbn13: string;
          item_id: number;
          title?: string;
          author?: string | null;
          publisher?: string | null;
          pub_date?: string | null;
          cover_url?: string | null;
          category_id?: number | null;
          category_name?: string | null;
          price_standard?: number | null;
          price_sales?: number | null;
          customer_review_rank?: number | null;
          aladin_link?: string | null;
          summary?: string | null;
          raw?: any | null;
          fetched_at?: string | null;
        };
        Update: {
          isbn13?: string;
          item_id?: number;
          title?: string;
          author?: string | null;
          publisher?: string | null;
          pub_date?: string | null;
          cover_url?: string | null;
          category_id?: number | null;
          category_name?: string | null;
          price_standard?: number | null;
          price_sales?: number | null;
          customer_review_rank?: number | null;
          aladin_link?: string | null;
          summary?: string | null;
          raw?: any | null;
          fetched_at?: string | null;
        };
      };
      library_items: {
        Row: {
          id: string;
          user_id: string;
          isbn13: string;
          shelf_status: string;
          progress: number;
          started_at: string | null;
          finished_at: string | null;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          isbn13?: string;
          shelf_status?: string;
          progress?: number;
          started_at?: string | null;
          finished_at?: string | null;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          isbn13?: string;
          shelf_status?: string;
          progress?: number;
          started_at?: string | null;
          finished_at?: string | null;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          isbn13: string;
          read_date: string | null;
          memo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          isbn13?: string;
          read_date?: string | null;
          memo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          isbn13?: string;
          read_date?: string | null;
          memo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      review_emotions: {
        Row: {
          id: string;
          review_id: string;
          emotion: string;
          score: number | null;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          review_id?: string;
          emotion?: string;
          score?: number | null;
          source?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          review_id?: string;
          emotion?: string;
          score?: number | null;
          source?: string;
          created_at?: string;
        };
      };
      review_topics: {
        Row: {
          id: string;
          review_id: string;
          keyword: string;
          weight: number | null;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          review_id?: string;
          keyword?: string;
          weight?: number | null;
          source?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          review_id?: string;
          keyword?: string;
          weight?: number | null;
          source?: string;
          created_at?: string;
        };
      };
      summary_periods: {
        Row: {
          id: string;
          user_id: string;
          period_type: string;
          period: string;
          emotion_status: Record<string, unknown> | null;
          top_books: Record<string, unknown> | null;
          created_at: string;
          refreshed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string;
          period_type?: string;
          period?: string;
          emotion_status?: any | null;
          top_books?: any | null;
          created_at?: string;
          refreshed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          period_type?: string;
          period?: string;
          emotion_status?: any | null;
          top_books?: any | null;
          created_at?: string;
          refreshed_at?: string | null;
        };
      };
    };
  };
};
