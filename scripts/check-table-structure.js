/**
 * library_items 테이블 구조 확인 스크립트
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Service Role Key로 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableStructure() {
  try {
    console.log('🔍 library_items 테이블 구조 확인 중...\n');

    // 1. 현재 테이블 데이터 몇 개 확인
    console.log('1️⃣ 현재 데이터 샘플:');
    const { data: sampleData, error: sampleError } = await supabase
      .from('library_items')
      .select('*')
      .limit(3);

    if (sampleError) {
      console.error('❌ 데이터 조회 실패:', sampleError.message);
    } else {
      console.log('📊 현재 데이터 구조:');
      if (sampleData && sampleData.length > 0) {
        console.log('컬럼들:', Object.keys(sampleData[0]));
        console.table(sampleData);
      } else {
        console.log('테이블에 데이터가 없습니다.');
      }
    }

    // 2. 테이블 스키마 정보 확인 (PostgreSQL 시스템 테이블 조회)
    console.log('\n2️⃣ 테이블 스키마 정보:');
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = 'library_items' 
          ORDER BY ordinal_position;
        `
      });

    if (schemaError) {
      console.log('⚠️ 시스템 테이블 조회 불가 (정상적임)');
      
      // 대신 간단한 INSERT 테스트로 컬럼 존재 여부 확인
      console.log('\n3️⃣ isWishlist 컬럼 존재 여부 테스트:');
      const { error: testError } = await supabase
        .from('library_items')
        .select('isWishlist')
        .limit(1);

      if (testError) {
        if (testError.message.includes('isWishlist')) {
          console.log('❌ isWishlist 컬럼이 아직 없습니다.');
          console.log('에러:', testError.message);
        } else {
          console.log('⚠️ 다른 에러:', testError.message);
        }
      } else {
        console.log('✅ isWishlist 컬럼이 이미 존재합니다!');
      }
    } else {
      console.log('📋 테이블 스키마:');
      console.table(schemaData);
    }

    // 4. 현재 shelf_status 값들 확인
    console.log('\n4️⃣ 현재 shelf_status 분포:');
    const { data: statusData, error: statusError } = await supabase
      .from('library_items')
      .select('shelf_status');

    if (statusError) {
      console.error('❌ shelf_status 조회 실패:', statusError.message);
    } else {
      const statusCounts = {};
      statusData?.forEach(item => {
        const status = item.shelf_status || 'null';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      console.table(statusCounts);
    }

  } catch (error) {
    console.error('❌ 테이블 구조 확인 중 오류:', error);
  }
}

checkTableStructure();
