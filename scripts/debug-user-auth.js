/**
 * 브라우저 콘솔용 사용자 인증 디버깅 스크립트
 * 개발자 도구 콘솔에서 실행하세요
 */

// 전역 함수로 등록
window.debugAuth = async function() {
  console.log('🔍=== 사용자 인증 디버깅 시작 ===');
  
  try {
    // 1. 현재 세션 확인
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('📋 현재 세션:', {
      exists: !!session,
      user_id: session?.user?.id,
      email: session?.user?.email,
      role: session?.user?.role,
      expires_at: session?.expires_at ? new Date(session.expires_at * 1000) : null
    });
    
    if (sessionError) {
      console.error('❌ 세션 에러:', sessionError);
      return;
    }
    
    if (!session) {
      console.warn('⚠️ 세션이 없습니다. 로그인이 필요합니다.');
      return;
    }
    
    // 2. 현재 사용자 정보
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('👤 사용자 정보:', {
      id: user?.id,
      email: user?.email,
      created_at: user?.created_at,
      last_sign_in_at: user?.last_sign_in_at
    });
    
    if (userError) {
      console.error('❌ 사용자 조회 에러:', userError);
      return;
    }
    
    // 3. RLS 테스트
    console.log('🧪 RLS 정책 테스트...');
    
    // SELECT 테스트
    const { data: selectData, error: selectError } = await supabase
      .from('reviews')
      .select('*')
      .limit(1);
      
    console.log('📖 SELECT 테스트:', {
      success: !selectError,
      error: selectError?.message,
      data_count: selectData?.length || 0
    });
    
    // INSERT 테스트
    const testReview = {
      user_id: user.id,
      isbn13: '9999999999999',
      memo: '테스트 리뷰',
      read_date: new Date().toISOString()
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('reviews')
      .insert(testReview)
      .select()
      .single();
      
    console.log('✍️ INSERT 테스트:', {
      success: !insertError,
      error: insertError?.message,
      error_code: insertError?.code,
      data: insertData
    });
    
    // 테스트 데이터 정리
    if (insertData) {
      await supabase.from('reviews').delete().eq('id', insertData.id);
      console.log('🧹 테스트 데이터 정리됨');
    }
    
    // 4. RLS 정책 상태 확인 (이건 일반 사용자는 확인 불가, 관리자만)
    console.log('🔐 RLS 정책 상태는 Supabase Dashboard에서 확인하세요.');
    
    console.log('✅=== 디버깅 완료 ===');
    
  } catch (error) {
    console.error('💥 디버깅 중 예외:', error);
  }
};

// 간단한 재로그인 함수
window.quickReAuth = async function() {
  console.log('🔄 재인증 시도...');
  
  try {
    await supabase.auth.signOut();
    console.log('👋 로그아웃 완료');
    
    // 새로고침을 통해 로그인 페이지로 이동
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  } catch (error) {
    console.error('❌ 재인증 실패:', error);
  }
};

console.log(`
🛠️ 인증 디버깅 도구가 로드되었습니다!

사용 방법:
1. await debugAuth() - 전체 인증 상태 확인
2. await quickReAuth() - 재로그인 시도

예시:
await debugAuth();
`);
