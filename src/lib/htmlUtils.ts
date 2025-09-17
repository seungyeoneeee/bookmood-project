/**
 * HTML 엔티티를 디코딩하는 유틸리티 함수들
 */

/**
 * HTML 엔티티를 일반 텍스트로 변환
 * @param htmlString HTML 엔티티가 포함된 문자열
 * @returns 디코딩된 문자열
 */
export function decodeHtmlEntities(htmlString: string): string {
  if (!htmlString) return '';
  
  // HTML 엔티티 매핑
  const htmlEntities: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&hellip;': '…',
    '&mdash;': '—',
    '&ndash;': '–',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&bull;': '•',
    '&middot;': '·'
  };
  
  let decodedString = htmlString;
  
  // HTML 엔티티 치환
  Object.entries(htmlEntities).forEach(([entity, char]) => {
    decodedString = decodedString.replace(new RegExp(entity, 'g'), char);
  });
  
  // 숫자 HTML 엔티티 처리 (&#숫자; 형태)
  decodedString = decodedString.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(parseInt(dec, 10));
  });
  
  // 16진수 HTML 엔티티 처리 (&#x16진수; 형태)
  decodedString = decodedString.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
  
  return decodedString;
}

/**
 * 텍스트를 안전하게 표시하기 위한 함수
 * HTML 엔티티 디코딩 + 기본적인 정리
 * @param text 원본 텍스트
 * @returns 정리된 텍스트
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  // HTML 엔티티 디코딩
  let sanitized = decodeHtmlEntities(text);
  
  // 연속된 공백 정리
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  // 앞뒤 공백 제거
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * 책 소개 텍스트를 정리하는 특화 함수
 * @param summary 책 소개 텍스트
 * @returns 정리된 책 소개 텍스트
 */
export function cleanBookSummary(summary: string): string {
  if (!summary) return '';
  
  let cleaned = sanitizeText(summary);
  
  // 책 제목을 괄호로 감싸는 경우 정리
  cleaned = cleaned.replace(/《([^》]+)》/g, '《$1》');
  cleaned = cleaned.replace(/<([^>]+)>/g, '《$1》');
  
  // 문장 부호 정리
  cleaned = cleaned.replace(/\.{2,}/g, '…');
  
  return cleaned;
}
