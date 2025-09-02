/**
 * 인증 상태 디버깅 스크립트
 * 브라우저 콘솔에서 실행하여 현재 인증 상태를 확인합니다.
 */

// Supabase 인증 상태 확인
async function debugAuthState() {
  console.log('🔍 인증 상태 디버깅 시작...');
  
  try {
    // 현재 사용자 정보
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('👤 현재 사용자:', user);
    
    if (error) {
      console.error('❌ 인증 에러:', error);
      return;
    }
    
    if (!user) {
      console.warn('⚠️ 로그인되지 않은 상태');
      return;
    }
    
    // 세션 정보
    const { data: { session } } = await supabase.auth.getSession();
    console.log('🔐 현재 세션:', {
      access_token: session?.access_token ? '✅ 존재' : '❌ 없음',
      refresh_token: session?.refresh_token ? '✅ 존재' : '❌ 없음',
      expires_at: session?.expires_at,
      user_id: session?.user?.id
    });
    
    // JWT 토큰 디코딩 (간단히)
    if (session?.access_token) {
      const tokenParts = session.access_token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('🎫 JWT 페이로드:', {
          sub: payload.sub,
          role: payload.role,
          exp: new Date(payload.exp * 1000),
          iss: payload.iss
        });
      }
    }
    
    // 테스트 쿼리 실행
    console.log('📋 테스트 쿼리 실행...');
    const { data: testData, error: testError } = await supabase
      .from('reviews')
      .select('*')
      .limit(1);
      
    if (testError) {
      console.error('❌ 테스트 쿼리 실패:', testError);
    } else {
      console.log('✅ 테스트 쿼리 성공:', testData);
    }
    
  } catch (error) {
    console.error('💥 디버깅 중 예외 발생:', error);
  }
}

// 리뷰 삽입 테스트
async function testReviewInsert() {
  console.log('🧪 리뷰 삽입 테스트 시작...');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('❌ 로그인이 필요합니다.');
    return;
  }
  
  const testData = {
    user_id: user.id,
    isbn13: '9999999999999',
    memo: '테스트 리뷰입니다.',
    read_date: new Date().toISOString()
  };
  
  console.log('💾 테스트 데이터:', testData);
  
  const { data, error } = await supabase
    .from('reviews')
    .insert(testData)
    .select()
    .single();
    
  if (error) {
    console.error('❌ 삽입 실패:', error);
  } else {
    console.log('✅ 삽입 성공:', data);
    
    // 테스트 데이터 정리
    await supabase.from('reviews').delete().eq('id', data.id);
    console.log('🧹 테스트 데이터 정리 완료');
  }
}

// 사용법 안내
console.log(`
🔧 인증 디버깅 도구 사용법:
1. debugAuthState() - 현재 인증 상태 확인
2. testReviewInsert() - 리뷰 삽입 테스트

예시:
await debugAuthState();
await testReviewInsert();
`);
