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
 * API 키 유효성 검사
 */
export function validateOpenAIKey(): boolean {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  return !!(apiKey && apiKey.startsWith('sk-'));
}
