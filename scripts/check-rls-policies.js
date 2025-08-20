/**
 * RLS 정책 확인 및 수정 스크립트
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // 관리자 키

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndFixRLS() {
  try {
    console.log('🔍 RLS 정책 확인 중...\n');

    // 1. 현재 library_items 테이블의 RLS 정책 확인
    console.log('1️⃣ 현재 RLS 정책 상태:');
    
    const { data: policies, error: policyError } = await supabaseAdmin
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'library_items');

    if (policyError) {
      console.log('⚠️ 정책 조회 실패 (일반적):', policyError.message);
    } else {
      console.log('📋 현재 정책들:');
      if (policies && policies.length > 0) {
        policies.forEach(policy => {
          console.log(`- ${policy.policyname}: ${policy.cmd} (${policy.qual})`);
        });
      } else {
        console.log('🔵 RLS 정책이 없음');
      }
    }

    // 2. 테이블 정보 확인
    console.log('\n2️⃣ 테이블 정보 확인:');
    const { data: tableInfo, error: tableError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        SELECT 
          schemaname, 
          tablename, 
          rowsecurity,
          tableowner
        FROM pg_tables 
        WHERE tablename = 'library_items';
      `
    });

    if (tableError) {
      console.log('⚠️ 테이블 정보 조회 실패');
    } else {
      console.log('📊 테이블 정보:', tableInfo);
    }

    // 3. RLS 정책 생성/수정 SQL 실행
    console.log('\n3️⃣ RLS 정책 수정 중...');
    
    const rlsQueries = [
      // 기존 정책 삭제 (있다면)
      `DROP POLICY IF EXISTS "Users can insert their own library items" ON library_items;`,
      `DROP POLICY IF EXISTS "Users can view their own library items" ON library_items;`,
      `DROP POLICY IF EXISTS "Users can update their own library items" ON library_items;`,
      `DROP POLICY IF EXISTS "Users can delete their own library items" ON library_items;`,
      
      // 새로운 정책 생성
      `CREATE POLICY "Users can insert their own library items" 
       ON library_items FOR INSERT 
       WITH CHECK (auth.uid() = user_id);`,
       
      `CREATE POLICY "Users can view their own library items" 
       ON library_items FOR SELECT 
       USING (auth.uid() = user_id);`,
       
      `CREATE POLICY "Users can update their own library items" 
       ON library_items FOR UPDATE 
       USING (auth.uid() = user_id);`,
       
      `CREATE POLICY "Users can delete their own library items" 
       ON library_items FOR DELETE 
       USING (auth.uid() = user_id);`,
    ];

    for (const query of rlsQueries) {
      try {
        console.log(`📝 실행 중: ${query.split('\n')[0]}...`);
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql: query });
        if (error) {
          console.log(`⚠️ 쿼리 실행 실패: ${error.message}`);
        } else {
          console.log('✅ 성공');
        }
      } catch (err) {
        console.log(`❌ 쿼리 오류: ${err.message}`);
      }
    }

    // 4. 정책 적용 확인
    console.log('\n4️⃣ 정책 적용 확인:');
    const { data: newPolicies, error: newPolicyError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        SELECT policyname, cmd, qual 
        FROM pg_policies 
        WHERE tablename = 'library_items';
      `
    });

    if (newPolicyError) {
      console.log('⚠️ 새 정책 조회 실패');
    } else {
      console.log('✅ 새로운 정책들:');
      if (newPolicies && newPolicies.length > 0) {
        newPolicies.forEach(policy => {
          console.log(`- ${policy.policyname}: ${policy.cmd}`);
        });
      }
    }

    console.log('\n🎯 RLS 정책 수정 완료!');
    console.log('이제 앱에서 위시리스트 추가를 다시 시도해보세요.');

  } catch (error) {
    console.error('❌ RLS 정책 확인/수정 실패:', error);
  }
}

checkAndFixRLS();
