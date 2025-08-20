/**
 * 위시리스트 저장 테스트 스크립트
 * 실제 DB에 위시리스트가 저장되는지 확인
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // RLS 우회
const ALADIN_API_KEY = process.env.VITE_ALADIN_API_KEY;

console.log('🔧 환경변수 확인:', {
  supabaseUrl: supabaseUrl ? '설정됨' : '없음',
  supabaseServiceKey: supabaseServiceKey ? '설정됨' : '없음'
});

// Service Role Key로 클라이언트 생성 (RLS 우회)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 테스트용 위시리스트 데이터 삽입
 */
async function testWishlistInsert() {
  try {
    console.log('📚 테스트 위시리스트 데이터 삽입 중...');
    
    // 임시 사용자 ID (실제로는 auth에서 가져와야 함)
    const testUserId = 'test-user-123';
    const testIsbn = '9788934942467'; // 달러구트 꿈 백화점

    // library_items에 위시리스트 데이터 삽입
    const { data, error } = await supabase
      .from('library_items')
      .insert({
        user_id: testUserId,
        isbn13: testIsbn,
        shelf_status: 'want_to_read',
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ 위시리스트 저장 실패:', error);
      return false;
    }

    console.log('✅ 위시리스트 저장 성공:', data);
    return true;

  } catch (error) {
    console.error('❌ 테스트 실패:', error);
    return false;
  }
}

/**
 * 저장된 위시리스트 데이터 조회
 */
async function testWishlistQuery() {
  try {
    console.log('📖 저장된 위시리스트 데이터 조회 중...');
    
    const { data, error } = await supabase
      .from('library_items')
      .select(`
        *,
        book:book_external!library_items_isbn13_fkey(*)
      `)
      .eq('shelf_status', 'want_to_read')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 위시리스트 조회 실패:', error);
      return;
    }

    console.log('📚 현재 위시리스트:', data);
    console.log(`총 ${data?.length || 0}개의 위시리스트 항목 발견`);

  } catch (error) {
    console.error('❌ 조회 실패:', error);
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('🧪 위시리스트 저장 테스트 시작...\n');
  
  // 1. 기존 위시리스트 조회
  await testWishlistQuery();
  
  console.log('\n---\n');
  
  // 2. 새 위시리스트 추가 테스트
  const success = await testWishlistInsert();
  
  if (success) {
    console.log('\n---\n');
    // 3. 추가 후 다시 조회
    await testWishlistQuery();
  }
  
  console.log('\n🏁 테스트 완료!');
}

// 스크립트 실행
main().catch(console.error);
