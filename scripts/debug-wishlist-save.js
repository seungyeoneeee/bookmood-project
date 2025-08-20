/**
 * 위시리스트 저장 디버깅 스크립트
 * 실제 앱에서 위시리스트 저장이 안되는 이유 찾기
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY; // 앱에서 사용하는 키
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // 관리자 키

// 두 가지 클라이언트 생성
const supabaseApp = createClient(supabaseUrl, supabaseAnonKey); // 앱과 동일한 환경
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey); // 관리자 환경

async function debugWishlistSave() {
  try {
    console.log('🔍 위시리스트 저장 디버깅 시작...\n');

    // 1. 현재 데이터베이스 상태 확인 (관리자 권한)
    console.log('1️⃣ 현재 library_items 테이블 상태 (관리자 권한):');
    const { data: allData, error: allError } = await supabaseAdmin
      .from('library_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (allError) {
      console.error('❌ 관리자 조회 실패:', allError.message);
    } else {
      console.log(`📊 현재 총 ${allData?.length || 0}개의 레코드:`);
      if (allData && allData.length > 0) {
        console.table(allData.map(item => ({
          id: item.id.substring(0, 8) + '...',
          user_id: item.user_id.substring(0, 8) + '...',
          isbn13: item.isbn13,
          is_wishlist: item.is_wishlist,
          shelf_status: item.shelf_status
        })));
      } else {
        console.log('🔵 테이블이 비어있습니다.');
      }
    }

    // 2. 앱 클라이언트로 인증 없이 조회 시도
    console.log('\n2️⃣ 앱 클라이언트로 조회 시도 (인증 없음):');
    const { data: appData, error: appError } = await supabaseApp
      .from('library_items')
      .select('*')
      .limit(5);

    if (appError) {
      console.error('❌ 앱 클라이언트 조회 실패:', appError.message);
      console.log('🔍 이것이 RLS 정책으로 인한 차단일 가능성이 높습니다.');
    } else {
      console.log(`✅ 앱 클라이언트로 ${appData?.length || 0}개 조회 성공`);
    }

    // 3. 실제 사용자 인증 시뮬레이션
    console.log('\n3️⃣ 실제 사용자 인증 시뮬레이션...');
    
    // 테스트용 사용자 생성/로그인 시도
    const testEmail = 'test@example.com';
    const testPassword = 'testpassword123';

    // 먼저 가입 시도
    const { data: signUpData, error: signUpError } = await supabaseApp.auth.signUp({
      email: testEmail,
      password: testPassword
    });

    if (signUpError) {
      console.log('ℹ️ 가입 실패 (이미 존재할 수 있음):', signUpError.message);
    }

    // 로그인 시도
    const { data: signInData, error: signInError } = await supabaseApp.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (signInError) {
      console.error('❌ 로그인 실패:', signInError.message);
      console.log('⚠️ 실제 앱에서 사용자 인증 상태를 확인해주세요.');
    } else {
      console.log('✅ 테스트 로그인 성공:', signInData.user?.id);

      // 4. 인증된 상태에서 위시리스트 저장 시도
      console.log('\n4️⃣ 인증된 상태에서 위시리스트 저장 시도:');
      const testIsbn = '9788934942467';
      
      const { data: insertData, error: insertError } = await supabaseApp
        .from('library_items')
        .insert({
          user_id: signInData.user.id,
          isbn13: testIsbn,
          is_wishlist: true,
          shelf_status: null,
          progress: 0
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ 인증된 상태 저장 실패:', insertError.message);
        console.log('🔍 RLS 정책이나 컬럼 구조 문제일 수 있습니다.');
      } else {
        console.log('✅ 인증된 상태 저장 성공!');
        console.log('저장된 데이터:', {
          id: insertData.id,
          user_id: insertData.user_id,
          isbn13: insertData.isbn13,
          is_wishlist: insertData.is_wishlist
        });
      }

      // 5. 저장 후 조회 테스트
      console.log('\n5️⃣ 저장 후 조회 테스트:');
      const { data: queryData, error: queryError } = await supabaseApp
        .from('library_items')
        .select('*')
        .eq('user_id', signInData.user.id)
        .eq('is_wishlist', true);

      if (queryError) {
        console.error('❌ 조회 실패:', queryError.message);
      } else {
        console.log(`✅ 사용자 위시리스트 ${queryData?.length || 0}개 조회됨:`);
        if (queryData && queryData.length > 0) {
          console.table(queryData);
        }
      }
    }

    // 6. RLS 정책 상태 확인 (관리자 권한)
    console.log('\n6️⃣ RLS 정책 상태 확인:');
    const { data: rlsData, error: rlsError } = await supabaseAdmin
      .rpc('exec_sql', {
        sql: `
          SELECT schemaname, tablename, rowsecurity, policies 
          FROM pg_tables 
          LEFT JOIN (
            SELECT schemaname as pol_schema, tablename as pol_table, 
                   array_agg(policyname) as policies
            FROM pg_policies 
            GROUP BY schemaname, tablename
          ) pol ON pg_tables.schemaname = pol.pol_schema 
                  AND pg_tables.tablename = pol.pol_table
          WHERE tablename = 'library_items';
        `
      });

    if (rlsError) {
      console.log('⚠️ RLS 정책 조회 불가 (정상)');
    } else {
      console.log('📋 RLS 정책 정보:', rlsData);
    }

    console.log('\n🎯 디버깅 완료!');

  } catch (error) {
    console.error('❌ 디버깅 중 오류:', error);
  }
}

debugWishlistSave();
