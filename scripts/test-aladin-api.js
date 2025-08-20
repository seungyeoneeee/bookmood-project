#!/usr/bin/env node

/**
 * 🔍 알라딘 API 테스트 스크립트
 * API 호출이 제대로 작동하는지 확인
 */

import fetch from 'node-fetch';

// 알라딘 API 테스트 (실제 사용 중인 키)
const ALADIN_API_KEY = 'ttbdlstjr201944002';
const ALADIN_BASE_URL = 'http://www.aladin.co.kr/ttb/api/ItemList.aspx';

async function testAladinAPI() {
  console.log('🚀 알라딘 API 테스트 시작...');
  
  try {
    // 베스트셀러 목록 호출
    const params = new URLSearchParams({
      ttbkey: ALADIN_API_KEY,
      QueryType: 'Bestseller',
      MaxResults: '10',
      start: '1',
      SearchTarget: 'Book',
      output: 'js',
      Version: '20131101'
    });

    const url = `${ALADIN_BASE_URL}?${params}`;
    console.log('📡 요청 URL:', url);
    
    const response = await fetch(url);
    console.log('📊 응답 상태:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text(); // 먼저 텍스트로 받아서 확인
    console.log('📦 응답 데이터 (처음 500자):', data.substring(0, 500));
    
    // JSON 파싱 시도
    try {
      const jsonData = JSON.parse(data);
      console.log('✅ JSON 파싱 성공!');
      console.log('📚 총 아이템 수:', jsonData.item ? jsonData.item.length : '없음');
      
      if (jsonData.item && jsonData.item.length > 0) {
        console.log('📖 첫 번째 책:', {
          title: jsonData.item[0].title,
          author: jsonData.item[0].author,
          isbn13: jsonData.item[0].isbn13
        });
      }
      
      return jsonData;
    } catch (parseError) {
      console.error('❌ JSON 파싱 실패:', parseError.message);
      console.log('📄 원본 응답:', data);
      return null;
    }
    
  } catch (error) {
    console.error('💥 API 호출 실패:', error.message);
    return null;
  }
}

// 여러 쿼리 타입 테스트
async function testMultipleQueries() {
  const queries = [
    { type: 'Bestseller', name: '베스트셀러' },
    { type: 'ItemNewAll', name: '신간 전체' },
    { type: 'ItemNewSpecial', name: '신간 주목할만한' }
  ];

  for (const query of queries) {
    console.log(`\n🔍 ${query.name} 테스트 중...`);
    
    try {
      const params = new URLSearchParams({
        ttbkey: ALADIN_API_KEY,
        QueryType: query.type,
        MaxResults: '5',
        start: '1',
        SearchTarget: 'Book',
        output: 'js',
        Version: '20131101'
      });

      const response = await fetch(`${ALADIN_BASE_URL}?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${query.name}: ${data.item ? data.item.length : 0}권`);
      } else {
        console.log(`❌ ${query.name}: HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${query.name}: ${error.message}`);
    }
    
    // API 호출 제한 방지
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// 스크립트 실행
console.log('🔍 알라딘 API 연결 테스트');
console.log('============================');

testAladinAPI()
  .then(result => {
    if (result) {
      console.log('\n🎉 기본 API 호출 성공! 추가 테스트 진행...');
      return testMultipleQueries();
    } else {
      console.log('\n❌ 기본 API 호출 실패. 문제를 해결해야 합니다.');
    }
  })
  .then(() => {
    console.log('\n📋 테스트 완료!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 테스트 실패:', error);
    process.exit(1);
  });
