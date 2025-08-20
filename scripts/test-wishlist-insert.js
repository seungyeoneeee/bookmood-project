/**
 * isWishlist 컬럼 추가 후 테스트 스크립트
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testWishlistColumn() {
  try {
    console.log('🧪 isWishlist 컬럼 테스트 시작...\n');

    // 1. 컬럼 존재 확인
    console.log('1️⃣ isWishlist 컬럼 존재 확인:');
    const { error: checkError } = await supabase
      .from('library_items')
      .select('isWishlist')
      .limit(1);

    if (checkError) {
      console.log('❌ isWishlist 컬럼이 아직 없습니다:', checkError.message);
      return;
    }
    console.log('✅ isWishlist 컬럼 존재 확인됨!');

    // 2. 테스트 데이터 삽입 (위시리스트)
    console.log('\n2️⃣ 테스트 위시리스트 데이터 삽입:');
    const testUserId = 'test-user-wishlist';
    const testIsbn = '9788934942467'; // 달러구트 꿈 백화점

    const { data: insertData, error: insertError } = await supabase
      .from('library_items')
      .insert({
        user_id: testUserId,
        isbn13: testIsbn,
        isWishlist: true,
        shelf_status: null,
        progress: 0
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ 위시리스트 삽입 실패:', insertError.message);
    } else {
      console.log('✅ 위시리스트 삽입 성공:', insertData);
    }

    // 3. 위시리스트 조회 테스트
    console.log('\n3️⃣ 위시리스트 조회 테스트:');
    const { data: wishlistData, error: wishlistError } = await supabase
      .from('library_items')
      .select('*')
      .eq('isWishlist', true);

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
        isWishlist: false,
        shelf_status: 'reading',
        progress: 25
      })
      .select()
      .single();

    if (readingError) {
      console.error('❌ 독서 기록 삽입 실패:', readingError.message);
    } else {
      console.log('✅ 독서 기록 삽입 성공:', readingData);
    }

    // 5. 전체 데이터 확인
    console.log('\n5️⃣ 전체 library_items 데이터:');
    const { data: allData, error: allError } = await supabase
      .from('library_items')
      .select('isbn13, isWishlist, shelf_status, progress, user_id')
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ 전체 데이터 조회 실패:', allError.message);
    } else {
      console.table(allData);
    }

    console.log('\n🎉 테스트 완료!');

  } catch (error) {
    console.error('❌ 테스트 중 오류:', error);
  }
}

testWishlistColumn();
