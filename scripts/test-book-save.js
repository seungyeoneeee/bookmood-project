/**
 * 책 저장 기능 단독 테스트
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testBookSave() {
  try {
    console.log('📚 책 저장 기능 테스트 시작...\n');

    // 테스트할 책 데이터 (item_id를 숫자로)
    const testBook = {
      isbn13: '9788936434274',
      title: '테스트 책',
      author: '테스트 작가',
      cover_url: 'https://example.com/cover.jpg',
      summary: '테스트 요약',
      pub_date: '2024-01-01',
      publisher: '테스트 출판사',
      category_id: 1,
      category_name: '소설',
      customer_review_rank: 85,
      item_id: 123456 // 🆕 숫자로 변경
    };

    console.log('📝 테스트할 책:', testBook);

    // 1. 기존 데이터 확인
    console.log('\n1️⃣ 기존 데이터 확인:');
    const { data: existing, error: checkError } = await supabase
      .from('book_external')
      .select('*')
      .eq('isbn13', testBook.isbn13)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('❌ 기존 데이터 확인 실패:', checkError);
    } else if (existing) {
      console.log('📖 기존 데이터 존재:', existing.title);
      
      // 기존 데이터 삭제
      console.log('🗑️ 기존 데이터 삭제 중...');
      const { error: deleteError } = await supabase
        .from('book_external')
        .delete()
        .eq('isbn13', testBook.isbn13);
        
      if (deleteError) {
        console.error('❌ 삭제 실패:', deleteError);
      } else {
        console.log('✅ 기존 데이터 삭제됨');
      }
    } else {
      console.log('🆕 기존 데이터 없음');
    }

    // 2. 새 데이터 삽입 시도
    console.log('\n2️⃣ 새 데이터 삽입 시도:');
    const { data: insertResult, error: insertError } = await supabase
      .from('book_external')
      .insert(testBook)
      .select()
      .single();

    if (insertError) {
      console.error('❌ 삽입 실패:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
    } else {
      console.log('✅ 삽입 성공:', insertResult);
    }

    // 3. book_external 테이블 스키마 확인
    console.log('\n3️⃣ book_external 테이블 스키마 확인:');
    const { data: schema, error: schemaError } = await supabase
      .from('book_external')
      .select('*')
      .limit(1);

    if (schemaError) {
      console.error('❌ 스키마 확인 실패:', schemaError);
    } else {
      console.log('📋 테이블 구조 확인 완료');
    }

    console.log('\n🎯 테스트 완료!');

  } catch (error) {
    console.error('❌ 테스트 중 오류:', error);
  }
}

testBookSave();
