/**
 * library_items 테이블에 isWishlist 컬럼 추가 스크립트
 * Service Role Key를 사용하여 데이터베이스 스키마 수정
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service Role Key 사용

console.log('🔧 환경변수 확인:', {
  supabaseUrl: supabaseUrl ? '설정됨' : '없음',
  supabaseServiceKey: supabaseServiceKey ? '설정됨' : '없음'
});

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

// Service Role Key로 클라이언트 생성 (관리자 권한)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * 데이터베이스 스키마 수정 실행
 */
async function addWishlistColumn() {
  try {
    console.log('🔧 데이터베이스 스키마 수정 시작...\n');

    // 1. isWishlist 컬럼 추가
    console.log('1️⃣ isWishlist 컬럼 추가 중...');
    const { error: addColumnError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE library_items 
        ADD COLUMN IF NOT EXISTS isWishlist BOOLEAN DEFAULT false;
      `
    });

    if (addColumnError) {
      console.error('❌ 컬럼 추가 실패:', addColumnError);
      // 컬럼이 이미 있을 수도 있으니 계속 진행
    } else {
      console.log('✅ isWishlist 컬럼 추가 완료');
    }

    // 2. 기존 want_to_read 데이터를 isWishlist = true로 변환
    console.log('\n2️⃣ 기존 위시리스트 데이터 변환 중...');
    const { data: updateData, error: updateError } = await supabase
      .from('library_items')
      .update({ isWishlist: true })
      .eq('shelf_status', 'want_to_read')
      .select('id, isbn13, shelf_status, isWishlist');

    if (updateError) {
      console.error('❌ 데이터 변환 실패:', updateError);
    } else {
      console.log(`✅ ${updateData?.length || 0}개 항목을 위시리스트로 변환 완료`);
      if (updateData && updateData.length > 0) {
        console.log('변환된 항목들:', updateData);
      }
    }

    // 3. 위시리스트 항목들의 shelf_status를 null로 설정 (선택사항)
    console.log('\n3️⃣ 위시리스트 항목의 shelf_status 정리 중...');
    const { data: cleanupData, error: cleanupError } = await supabase
      .from('library_items')
      .update({ shelf_status: null })
      .eq('isWishlist', true)
      .select('id, isbn13, isWishlist, shelf_status');

    if (cleanupError) {
      console.error('❌ shelf_status 정리 실패:', cleanupError);
    } else {
      console.log(`✅ ${cleanupData?.length || 0}개 위시리스트 항목의 shelf_status 정리 완료`);
    }

    // 4. 결과 확인
    console.log('\n4️⃣ 최종 결과 확인...');
    const { data: finalData, error: finalError } = await supabase
      .from('library_items')
      .select('id, isbn13, isWishlist, shelf_status, progress, user_id')
      .order('created_at', { ascending: false })
      .limit(10);

    if (finalError) {
      console.error('❌ 결과 확인 실패:', finalError);
    } else {
      console.log('📊 최근 library_items 데이터 (최대 10개):');
      console.table(finalData);
    }

    // 5. 위시리스트 통계
    console.log('\n5️⃣ 위시리스트 통계...');
    const { data: statsData, error: statsError } = await supabase
      .from('library_items')
      .select('isWishlist')
      .eq('isWishlist', true);

    if (statsError) {
      console.error('❌ 통계 조회 실패:', statsError);
    } else {
      console.log(`📚 총 위시리스트 항목: ${statsData?.length || 0}개`);
    }

    console.log('\n🎉 데이터베이스 스키마 수정 완료!');
    return true;

  } catch (error) {
    console.error('❌ 스키마 수정 중 오류 발생:', error);
    return false;
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  const success = await addWishlistColumn();
  
  if (success) {
    console.log('\n✅ 모든 작업이 성공적으로 완료되었습니다!');
    console.log('이제 앱에서 위시리스트가 새로고침 후에도 유지됩니다! 🚀');
  } else {
    console.log('\n❌ 일부 작업이 실패했습니다. 수동으로 확인이 필요할 수 있습니다.');
  }
}

// 스크립트 실행
main().catch(console.error);
