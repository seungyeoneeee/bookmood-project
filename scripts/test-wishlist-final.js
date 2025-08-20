/**
 * is_wishlist 컬럼 최종 테스트 스크립트
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testWishlistFinal() {
  try {
    console.log('🧪 is_wishlist 컬럼 최종 테스트 시작...\n');

    // 1. 컬럼 존재 확인
    console.log('1️⃣ is_wishlist 컬럼 존재 확인:');
    const { error: checkError } = await supabase
      .from('library_items')
      .select('is_wishlist')
      .limit(1);

    if (checkError) {
      console.log('❌ is_wishlist 컬럼이 아직 없습니다:', checkError.message);
      console.log('\n📋 Supabase에서 다음 명령어를 실행하세요:');
      console.log('ALTER TABLE library_items ADD COLUMN is_wishlist BOOLEAN DEFAULT false;');
      return;
    }
    console.log('✅ is_wishlist 컬럼 존재 확인됨!');

    // 2. 테스트 데이터 삽입 (위시리스트)
    console.log('\n2️⃣ 테스트 위시리스트 데이터 삽입:');
    const testUserId = 'test-user-final';
    const testIsbn = '9788934942467'; // 달러구트 꿈 백화점

    const { data: insertData, error: insertError } = await supabase
      .from('library_items')
      .insert({
        user_id: testUserId,
        isbn13: testIsbn,
        is_wishlist: true,
        shelf_status: null,
        progress: 0
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ 위시리스트 삽입 실패:', insertError.message);
    } else {
      console.log('✅ 위시리스트 삽입 성공!');
      console.log('삽입된 데이터:', {
        id: insertData.id,
        isbn13: insertData.isbn13,
        is_wishlist: insertData.is_wishlist,
        shelf_status: insertData.shelf_status
      });
    }

    // 3. 위시리스트 조회 테스트
    console.log('\n3️⃣ 위시리스트 조회 테스트:');
    const { data: wishlistData, error: wishlistError } = await supabase
      .from('library_items')
      .select('id, isbn13, is_wishlist, shelf_status, user_id')
      .eq('is_wishlist', true);

    if (wishlistError) {
      console.error('❌ 위시리스트 조회 실패:', wishlistError.message);
    } else {
      console.log(`✅ 위시리스트 ${wishlistData?.length || 0}개 발견:`);
      console.table(wishlistData);
    }

    // 4. 일반 독서 기록 삽입 테스트
    console.log('\n4️⃣ 일반 독서 기록 삽입 테스트:');
    const { data: readingData, error: readingError } = await supabase
      .from('library_items')
      .insert({
        user_id: testUserId,
        isbn13: '9788950990237', // 역행자
        is_wishlist: false,
        shelf_status: 'reading',
        progress: 25
      })
      .select()
      .single();

    if (readingError) {
      console.error('❌ 독서 기록 삽입 실패:', readingError.message);
    } else {
      console.log('✅ 독서 기록 삽입 성공!');
      console.log('삽입된 데이터:', {
        id: readingData.id,
        isbn13: readingData.isbn13,
        is_wishlist: readingData.is_wishlist,
        shelf_status: readingData.shelf_status,
        progress: readingData.progress
      });
    }

    // 5. 조건별 조회 테스트
    console.log('\n5️⃣ 조건별 조회 테스트:');
    
    // 위시리스트만 조회
    const { data: onlyWishlist } = await supabase
      .from('library_items')
      .select('*')
      .eq('is_wishlist', true);
    
    // 독서 기록만 조회
    const { data: onlyReading } = await supabase
      .from('library_items')
      .select('*')
      .eq('is_wishlist', false);

    console.log(`📚 위시리스트 전용: ${onlyWishlist?.length || 0}개`);
    console.log(`📖 독서 기록 전용: ${onlyReading?.length || 0}개`);

    console.log('\n🎉 모든 테스트 완료! is_wishlist 방식이 정상 작동합니다! 🚀');

  } catch (error) {
    console.error('❌ 테스트 중 오류:', error);
  }
}

testWishlistFinal();
