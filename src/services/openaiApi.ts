// OpenAI GPT API를 사용한 감성 분석 서비스
import OpenAI from 'openai';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // 클라이언트 사이드에서 사용하기 위해 (실제 운영시에는 서버 사이드 권장)
});

export interface EmotionAnalysisResult {
  dominantEmotions: string[];
  emotionScores: Record<string, number>;
  sentiment: 'positive' | 'negative' | 'neutral';
  moodSummary: string;
  personalizedInsight?: string; // 🆕 개인화된 인사이트
  bookEmotions: string[];
  emotionalJourney?: string; // 🆕 감정적 여정
  themes: string[];
  rating: number;
  recommendedBooks?: string[]; // 🆕 추천 도서
}

// 🆕 책 줄거리 감정 분석 결과
export interface BookEmotionAnalysis {
  emotions: Record<string, number>; // 감정별 점수 (0-1)
  dominantEmotions: string[]; // 주요 감정들
  themes: string[]; // 주요 테마
  mood: 'uplifting' | 'melancholic' | 'intense' | 'peaceful' | 'mysterious' | 'romantic' | 'adventurous';
  readingExperience: string; // 독서 경험 설명
}

/**
 * 사용자 감상문과 책 줄거리를 종합 분석하여 감정을 추출
 */
export async function analyzeEmotionsWithGPT(
  reviewText: string, 
  selectedEmotions: string[], 
  bookSummary: string = '',
  bookTitle: string = ''
): Promise<EmotionAnalysisResult> {
  
  // API 키 유효성 검사
  if (!validateOpenAIKey()) {
    console.warn('⚠️ OpenAI API 키가 유효하지 않음');
    throw new Error('Invalid OpenAI API key');
  }

  // 사용량 한도 체크 (간단한 rate limiting)
  const now = Date.now();
  const lastRequest = localStorage.getItem('lastOpenAIRequest');
  if (lastRequest && now - parseInt(lastRequest) < 3000) {
    console.warn('⚡ 요청 간격 제한 (3초)');
    throw new Error('Request too frequent');
  }

  try {
    localStorage.setItem('lastOpenAIRequest', now.toString());
    
    const prompt = createEmotionAnalysisPrompt(reviewText, selectedEmotions, bookSummary, bookTitle);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 비용 효율적인 모델
      messages: [
        {
          role: "system",
          content: "당신은 한국어 문학 감상 및 감정 분석 전문가입니다. 사용자의 독후감과 책 정보를 분석하여 정확한 감정 데이터를 추출해주세요."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const result = response.choices[0]?.message?.content;
    
    if (!result) {
      throw new Error('GPT API 응답이 비어있습니다');
    }

    return parseGPTResponse(result);
    
  } catch (error) {
    console.error('🚨 OpenAI API 호출 실패:', error);
    
    // 429 에러 (Too Many Requests) 체크
    if (error && typeof error === 'object' && 'status' in error && error.status === 429) {
      console.warn('⚡ OpenAI API 사용량 한도 초과');
    }
    
    // 폴백: 기본 키워드 분석으로 대체
    throw error; // 에러를 상위로 전달해서 AppRouter에서 fallback 처리하도록
  }
}

/**
 * GPT에게 보낼 프롬프트 생성
 */
function createEmotionAnalysisPrompt(
  reviewText: string, 
  selectedEmotions: string[], 
  bookSummary: string, 
  bookTitle: string
): string {
  return `
당신은 독서 심리 분석 전문가입니다. 사용자의 감상문과 책의 내용을 종합하여, 마치 사용자와 깊은 대화를 나눈 것처럼 자연스럽고 따뜻한 감정 분석을 해주세요.

📖 **분석 대상 책:**
- 제목: "${bookTitle}"
- 줄거리: "${bookSummary || '줄거리 정보 없음'}"

💭 **사용자의 솔직한 감상:**
"${reviewText}"

🎨 **사용자가 느꼈다고 표현한 감정:**
${selectedEmotions.length > 0 ? selectedEmotions.join(', ') : '특별히 선택하지 않음'}

---

🎯 **분석 목표:**
이 책을 읽으면서 사용자가 실제로 경험했을 감정의 여정을 재구성해주세요. 
책의 스토리와 사용자의 감상을 융합하여, 마치 사용자가 책 속 인물과 함께 감정을 경험한 것처럼 분석해주세요.

📋 **응답 형식 (JSON):**
{
  "dominantEmotions": ["감정1", "감정2", "감정3", "감정4", "감정5"],
  "emotionScores": {
    "감정1": 0.9,
    "감정2": 0.8,
    "감정3": 0.7,
    "감정4": 0.6,
    "감정5": 0.5
  },
  "sentiment": "positive|negative|neutral",
  "moodSummary": "독자님은 이 책을 통해... (자연스럽고 따뜻한 톤으로 2-3문장)",
  "personalizedInsight": "책의 [구체적 부분]에서 특히 [감정]을 느끼셨을 것 같아요. (책 내용과 연결된 구체적 인사이트)",
  "bookEmotions": ["책에서 느껴지는 감정들"],
  "emotionalJourney": "이 책을 읽는 동안의 감정적 여정을 3-4단계로 설명",
  "themes": ["핵심 테마들"],
  "rating": 4.2,
  "recommendedBooks": ["비슷한 감정을 느낄 수 있는 추천도서 2-3권"]
}

💡 **분석 가이드라인:**
1. **자연스러운 언어**: "~했을 것 같다", "~셨을 것 같다" 등 추측 표현 사용
2. **구체적 연결**: 책의 특정 상황이나 인물과 사용자 감정을 연결
3. **감정의 깊이**: 표면적 감정뿐만 아니라 깊은 내면의 변화도 포착
4. **개인화**: 사용자만의 독특한 독서 경험처럼 표현
5. **따뜻함**: 판단하지 않고 공감하는 톤으로 작성

🎨 **감정 카테고리:**
기본감정: 기쁨, 슬픔, 분노, 두려움, 놀라움, 혐오, 기대, 신뢰
독서감정: 감동, 성찰, 호기심, 만족감, 그리움, 희망, 사랑, 성장, 공감, 위안, 영감, 깨달음, 향수, 경외, 평온
`.trim();
}

/**
 * GPT 응답을 파싱하여 EmotionAnalysisResult 형태로 변환
 */
function parseGPTResponse(gptResponse: string): EmotionAnalysisResult {
  try {
    const parsed = JSON.parse(gptResponse);
    
    return {
      dominantEmotions: parsed.dominantEmotions || [],
      emotionScores: parsed.emotionScores || {},
      sentiment: parsed.sentiment || 'neutral',
      moodSummary: parsed.moodSummary || '독서 경험을 분석했습니다.',
      personalizedInsight: parsed.personalizedInsight || '', // 🆕
      bookEmotions: parsed.bookEmotions || [],
      emotionalJourney: parsed.emotionalJourney || '', // 🆕
      themes: parsed.themes || [],
      rating: parsed.rating || 3.0,
      recommendedBooks: parsed.recommendedBooks || [] // 🆕
    };
  } catch (error) {
    console.error('GPT 응답 파싱 실패:', error);
    throw new Error('GPT 응답 형식이 올바르지 않습니다');
  }
}

/**
 * API 실패 시 사용할 폴백 분석 (기존 키워드 기반)
 */
function getFallbackAnalysis(
  reviewText: string, 
  selectedEmotions: string[], 
  bookSummary: string
): EmotionAnalysisResult {
  console.warn('🔄 GPT API 실패로 폴백 분석 사용');
  
  // 기본 키워드 기반 분석 (기존 로직)
  const positiveKeywords = ['좋', '훌륭', '감동', '재미', '흥미', '사랑', '행복', '즐거', '만족'];
  const negativeKeywords = ['아쉬', '지루', '실망', '어려', '복잡', '슬프', '우울', '화나'];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveKeywords.forEach(word => {
    if (reviewText.includes(word)) positiveScore++;
  });
  
  negativeKeywords.forEach(word => {
    if (reviewText.includes(word)) negativeScore++;
  });
  
  return {
    dominantEmotions: selectedEmotions.length > 0 ? selectedEmotions : ['성찰', '호기심'],
    emotionScores: {
      '성찰': 0.7,
      '호기심': 0.6
    },
    sentiment: positiveScore > negativeScore ? 'positive' : negativeScore > positiveScore ? 'negative' : 'neutral',
    moodSummary: '책을 통한 의미 있는 독서 경험이었습니다.',
    bookEmotions: [],
    themes: ['독서', '성찰'],
    rating: 3.0 + (positiveScore - negativeScore) * 0.5
  };
}

/**
 * 책 줄거리를 분석해서 감정 점수 추출
 * @param bookTitle 책 제목
 * @param bookSummary 책 줄거리
 * @param author 저자
 * @param genre 장르
 * @returns 감정 분석 결과
 */
export async function analyzeBookEmotions(
  bookTitle: string,
  bookSummary: string,
  author?: string,
  genre?: string
): Promise<BookEmotionAnalysis> {
  
  // API 키 유효성 검사
  if (!validateOpenAIKey()) {
    console.warn('⚠️ OpenAI API 키가 유효하지 않음');
    return getFallbackBookEmotions(bookTitle, bookSummary, genre);
  }

  // 사용량 한도 체크 및 OpenAI 상태 확인
  const now = Date.now();
  const lastRequest = localStorage.getItem('lastBookAnalysisRequest');
  const lastOpenAIError = localStorage.getItem('lastOpenAIError');
  
  // 최근에 OpenAI 에러가 있었다면 폴백 사용
  if (lastOpenAIError) {
    const errorTime = parseInt(lastOpenAIError);
    if (now - errorTime < 30000) { // 30초 동안 폴백 사용
      console.warn('⚠️ OpenAI 에러로 인해 폴백 시스템 사용중');
      return getFallbackBookEmotions(bookTitle, bookSummary, genre);
    } else {
      localStorage.removeItem('lastOpenAIError'); // 30초 지났으면 에러 기록 삭제
    }
  }
  
  if (lastRequest && now - parseInt(lastRequest) < 5000) {
    console.warn('⚡ 책 분석 요청 간격 제한 (5초)');
    return getFallbackBookEmotions(bookTitle, bookSummary, genre);
  }

  try {
    localStorage.setItem('lastBookAnalysisRequest', now.toString());
    
    const prompt = `다음 책의 줄거리를 분석해서 독자가 느낄 수 있는 감정들을 점수로 매겨주세요.

**책 정보:**
- 제목: ${bookTitle}
- 저자: ${author || '미상'}
- 장르: ${genre || '일반'}
- 줄거리: ${bookSummary || '줄거리 없음'}

**분석 요청:**
1. 다음 감정들에 대해 0-1 점수로 평가: 행복, 슬픔, 흥미, 평온, 영감, 긴장, 로맨스, 모험, 성찰, 유머
2. 이 책의 주요 감정 3개 선택
3. 주요 테마/키워드 3-5개
4. 전체적인 분위기 (uplifting/melancholic/intense/peaceful/mysterious/romantic/adventurous 중 선택)
5. 독서 경험을 한 줄로 요약

**응답 형식 (JSON):**
{
  "emotions": {
    "행복": 0.7,
    "슬픔": 0.3,
    "흥미": 0.8,
    "평온": 0.4,
    "영감": 0.6,
    "긴장": 0.5,
    "로맨스": 0.2,
    "모험": 0.3,
    "성찰": 0.7,
    "유머": 0.1
  },
  "dominantEmotions": ["흥미", "영감", "행복"],
  "themes": ["성장", "우정", "꿈", "도전", "희망"],
  "mood": "uplifting",
  "readingExperience": "마음을 따뜻하게 해주는 감동적인 성장 이야기"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '당신은 책과 문학 감정 분석 전문가입니다. 책의 내용을 바탕으로 독자가 경험할 수 있는 감정들을 정확하게 분석해주세요.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error('No response from OpenAI');
    }

    // JSON 파싱 시도
    try {
      const parsedResult = JSON.parse(result);
      
      // 결과 검증 및 정규화
      const normalizedResult: BookEmotionAnalysis = {
        emotions: parsedResult.emotions || {},
        dominantEmotions: Array.isArray(parsedResult.dominantEmotions) ? parsedResult.dominantEmotions.slice(0, 5) : [],
        themes: Array.isArray(parsedResult.themes) ? parsedResult.themes.slice(0, 5) : [],
        mood: ['uplifting', 'melancholic', 'intense', 'peaceful', 'mysterious', 'romantic', 'adventurous'].includes(parsedResult.mood) 
          ? parsedResult.mood 
          : 'peaceful',
        readingExperience: typeof parsedResult.readingExperience === 'string' 
          ? parsedResult.readingExperience.substring(0, 200)
          : '흥미로운 독서 경험을 선사하는 책'
      };

      console.log('✅ AI 책 감정 분석 완료:', bookTitle);
      return normalizedResult;
      
    } catch (parseError) {
      console.warn('❌ AI 응답 JSON 파싱 실패:', parseError);
      return getFallbackBookEmotions(bookTitle, bookSummary, genre);
    }

  } catch (error) {
    console.error('❌ OpenAI 책 감정 분석 실패:', error);
    
    // OpenAI 에러 시간 기록 (일시적으로 폴백 시스템 사용하기 위해)
    localStorage.setItem('lastOpenAIError', Date.now().toString());
    
    // 에러 종류별 사용자 친화적 메시지
    const apiError = error as { status?: number };
    if (apiError.status === 429) {
      console.warn('⚠️ OpenAI API 사용량 한도 초과 - 폴백 시스템으로 전환');
    } else if (apiError.status === 401) {
      console.warn('⚠️ OpenAI API 키 문제 - 폴백 시스템으로 전환');
    } else {
      console.warn('⚠️ OpenAI API 연결 문제 - 폴백 시스템으로 전환');
    }
    
    return getFallbackBookEmotions(bookTitle, bookSummary, genre);
  }
}

/**
 * AI 분석 실패 시 폴백 감정 분석 (강화된 버전)
 */
function getFallbackBookEmotions(bookTitle: string, bookSummary: string, genre?: string): BookEmotionAnalysis {
  const title = bookTitle.toLowerCase();
  const summary = (bookSummary || '').toLowerCase();
  const genreStr = (genre || '').toLowerCase();
  const combinedText = `${title} ${summary} ${genreStr}`;
  
  console.log('🔄 키워드 기반 폴백 감정 분석 시작:', bookTitle.substring(0, 20) + '...');
  
  // 기본 감정 점수
  const emotions: Record<string, number> = {
    '행복': 0.3,
    '슬픔': 0.2,
    '흥미': 0.5,
    '평온': 0.3,
    '영감': 0.4,
    '긴장': 0.2,
    '로맨스': 0.1,
    '모험': 0.2,
    '성찰': 0.4,
    '유머': 0.2
  };
  
  // 강화된 키워드 분석
  const emotionKeywords = {
    '행복': ['행복', '기쁨', '즐거', '웃음', '밝', '희망', '따뜻', '상쾌', '활기', '유쾌', '달콤', '사랑스러운'],
    '슬픔': ['슬픔', '눈물', '아픔', '이별', '상실', '비극', '애도', '그리움', '아련', '쓸쓸', '멜랑콜리', '우울'],
    '흥미': ['흥미', '재미', '신기', '놀라', '호기심', '궁금', '매력', '스릴', '신비', '흥분', '관심', '집중'],
    '평온': ['평온', '고요', '안정', '힐링', '휴식', '차분', '평화', '조용', '고즈넉', '여유', '편안', '따스'],
    '영감': ['영감', '깨달음', '통찰', '지혜', '성장', '동기', '희망', '꿈', '비전', '각성', '계시', '발견'],
    '긴장': ['긴장', '스릴', '서스펜스', '미스터리', '추리', '범죄', '액션', '위험', '모험', '전투', '갈등'],
    '로맨스': ['사랑', '로맨스', '연애', '결혼', '데이트', '연인', '애정', '로맨틱', '달콤', '키스', '결혼'],
    '모험': ['모험', '여행', '탐험', '도전', '여정', '탐사', '발견', '용기', '모험가', '원정', '탐구'],
    '성찰': ['성찰', '철학', '사색', '명상', '깊이', '의미', '인생', '생각', '고민', '반성', '내면', '진리'],
    '유머': ['유머', '웃음', '코미디', '재미', '농담', '유쾌', '익살', '풍자', '해학', '위트', '재치']
  };
  
  // 각 감정별로 키워드 매칭 점수 계산
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    let score = emotions[emotion];
    let matchCount = 0;
    
    keywords.forEach(keyword => {
      if (combinedText.includes(keyword)) {
        matchCount++;
        if (title.includes(keyword)) score += 0.3;
        else if (summary.includes(keyword)) score += 0.2;
        else if (genreStr.includes(keyword)) score += 0.1;
      }
    });
    
    // 매칭된 키워드가 많을수록 보너스
    if (matchCount > 1) score += matchCount * 0.1;
    
    emotions[emotion] = Math.min(score, 1.0);
  });
  
  // 장르별 특별 처리
  const genreAdjustments = {
    '로맨': { '로맨스': 0.9, '행복': 0.7, '슬픔': 0.4 },
    '추리': { '긴장': 0.8, '흥미': 0.9, '성찰': 0.6 },
    '미스터리': { '긴장': 0.8, '흥미': 0.9 },
    '판타지': { '모험': 0.8, '흥미': 0.7, '영감': 0.6 },
    '호러': { '긴장': 0.9, '슬픔': 0.3 },
    '코미디': { '유머': 0.9, '행복': 0.8 },
    '드라마': { '슬픔': 0.7, '성찰': 0.6 },
    '자기계발': { '영감': 0.9, '성찰': 0.8, '평온': 0.6 },
    '에세이': { '성찰': 0.8, '평온': 0.7, '영감': 0.6 },
    '여행': { '모험': 0.8, '평온': 0.6, '흥미': 0.7 },
    '요리': { '행복': 0.7, '평온': 0.6 },
    '역사': { '흥미': 0.7, '성찰': 0.6 },
    '과학': { '흥미': 0.8, '영감': 0.6 }
  };
  
  Object.entries(genreAdjustments).forEach(([genreKeyword, adjustments]) => {
    if (genreStr.includes(genreKeyword)) {
      Object.entries(adjustments).forEach(([emotion, score]) => {
        emotions[emotion] = Math.max(emotions[emotion], score);
      });
    }
  });
  
  // 상위 3개 감정 찾기
  const sortedEmotions = Object.entries(emotions)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([emotion]) => emotion);
  
  // 테마 결정
  let themes: string[] = [];
  if (genreStr.includes('소설') || genreStr.includes('문학')) {
    themes = ['인간관계', '성장', '삶', '감정'];
  } else if (genreStr.includes('자기계발')) {
    themes = ['성장', '동기부여', '목표달성', '자아계발'];
  } else if (genreStr.includes('경제') || genreStr.includes('경영')) {
    themes = ['성공', '전략', '리더십', '투자'];
  } else if (genreStr.includes('과학') || genreStr.includes('기술')) {
    themes = ['혁신', '발견', '미래', '지식'];
  } else {
    themes = ['학습', '성찰', '지식', '통찰'];
  }
  
  // 분위기 결정
  let mood: BookEmotionAnalysis['mood'];
  if (emotions['행복'] > 0.6) mood = 'uplifting';
  else if (emotions['슬픔'] > 0.6) mood = 'melancholic';
  else if (emotions['긴장'] > 0.6) mood = 'intense';
  else if (emotions['로맨스'] > 0.6) mood = 'romantic';
  else if (emotions['모험'] > 0.6) mood = 'adventurous';
  else if (emotions['평온'] > 0.5) mood = 'peaceful';
  else mood = 'peaceful';
  
  const result = {
    emotions,
    dominantEmotions: sortedEmotions,
    themes,
    mood,
    readingExperience: `${sortedEmotions.join(', ')}을 느낄 수 있는 의미 있는 독서 (키워드 기반 분석)`
  };
  
  console.log('✅ 폴백 감정 분석 완료:', { 
    dominantEmotions: sortedEmotions, 
    mood,
    topScores: sortedEmotions.map(e => `${e}:${emotions[e].toFixed(2)}`).join(', ')
  });
  
  return result;
}

/**
 * API 키 유효성 검사
 */
export function validateOpenAIKey(): boolean {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  return !!(apiKey && apiKey.startsWith('sk-'));
}
