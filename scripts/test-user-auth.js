/**
 * 사용자 인증 상태 및 RLS 정책 테스트
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseApp = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testUserAuth() {
  try {
    console.log('🧪 사용자 인증 및 RLS 정책 테스트 시작...\n');

    // 1. 현재 RLS 정책 확인 (관리자 권한)
    console.log('1️⃣ 현재 RLS 정책 확인:');
    try {
      const { data: policies, error } = await supabaseAdmin
        .from('library_items')
        .select('*')
        .limit(1);
      
      console.log('📊 관리자로 library_items 조회 결과:', {
        success: !error,
        count: policies?.length || 0,
        error: error?.message
      });
    } catch (err) {
      console.log('⚠️ 관리자 조회 실패:', err.message);
    }

    // 2. 테스트 사용자 생성/로그인
    console.log('\n2️⃣ 테스트 사용자 로그인 시도:');
    const testEmail = 'test@bookmood.com';
    const testPassword = 'test123456';

    // 가입 시도 (이미 있을 수 있음)
    const { data: signUpData, error: signUpError } = await supabaseApp.auth.signUp({
      email: testEmail,
      password: testPassword
    });

    if (signUpError && !signUpError.message.includes('already registered')) {
      console.log('⚠️ 가입 실패:', signUpError.message);
    }

    // 로그인 시도
    const { data: signInData, error: signInError } = await supabaseApp.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (signInError) {
      console.error('❌ 로그인 실패:', signInError.message);
      return;
    }

    console.log('✅ 로그인 성공:', {
      user_id: signInData.user.id,
      email: signInData.user.email
    });

    // 3. 인증 상태에서 현재 세션 확인
    console.log('\n3️⃣ 현재 세션 확인:');
    const { data: { session }, error: sessionError } = await supabaseApp.auth.getSession();
    
    if (sessionError) {
      console.error('❌ 세션 확인 실패:', sessionError);
    } else {
      console.log('📱 현재 세션:', {
        user_id: session?.user?.id,
        expires_at: session?.expires_at
      });
    }

    // 4. auth.uid() 함수 직접 테스트
    console.log('\n4️⃣ auth.uid() 함수 테스트:');
    try {
      const { data: authUidResult, error: authUidError } = await supabaseApp
        .rpc('auth_uid_test'); // 이 함수는 없을 수 있음 - 테스트용
        
      console.log('🔑 auth.uid() 결과:', authUidResult);
    } catch (err) {
      console.log('⚠️ auth.uid() 직접 테스트 불가 (정상)');
    }

    // 5. 실제 INSERT 시도 (디버그 모드)
    console.log('\n5️⃣ 실제 INSERT 시도:');
    const testIsbn = '9788934942467';
    const testUserId = signInData.user.id;

    console.log('📝 삽입할 데이터:', {
      user_id: testUserId,
      isbn13: testIsbn,
      is_wishlist: true,
      shelf_status: null,
      progress: 0
    });

    const { data: insertResult, error: insertError } = await supabaseApp
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
      console.error('❌ INSERT 실패:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
      
      // 6. 관리자 권한으로 강제 삽입 시도
      console.log('\n6️⃣ 관리자 권한으로 강제 삽입 시도:');
      const { data: adminInsert, error: adminError } = await supabaseAdmin
        .from('library_items')
        .insert({
          user_id: testUserId,
          isbn13: testIsbn + '_admin',
          is_wishlist: true,
          shelf_status: null,
          progress: 0
        })
        .select()
        .single();

      if (adminError) {
        console.error('❌ 관리자 삽입도 실패:', adminError.message);
      } else {
        console.log('✅ 관리자 삽입 성공:', adminInsert);
      }
      
    } else {
      console.log('✅ INSERT 성공!:', insertResult);
    }

    // 7. 현재 데이터 조회 시도
    console.log('\n7️⃣ 사용자 데이터 조회 시도:');
    const { data: userLibrary, error: selectError } = await supabaseApp
      .from('library_items')
      .select('*')
      .eq('user_id', testUserId);

    if (selectError) {
      console.error('❌ 조회 실패:', selectError.message);
    } else {
      console.log(`✅ 사용자 라이브러리 ${userLibrary?.length || 0}개 조회됨:`, userLibrary);
    }

    console.log('\n🎯 테스트 완료!');

  } catch (error) {
    console.error('❌ 테스트 중 오류:', error);
  }
}

testUserAuth();
