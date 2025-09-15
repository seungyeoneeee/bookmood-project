import { supabase } from '../lib/supabase';
import { Review, CreateReviewInput, UpdateReviewInput, ReviewEmotion, ReviewTopic } from '../types/database';

// 모든 리뷰 조회 (디버깅용)
export async function getAllReviews() {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    return { data: null, error };
  }
}

// 사용자의 리뷰 목록 조회
export async function getReviews(userId?: string) {
  try {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        book:book_external!reviews_isbn13_fkey(*),
        emotions:review_emotions(*),
        topics:review_topics(*)
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return { data: null, error };
  }
}

// 특정 책의 리뷰 조회
export async function getReviewByIsbn(isbn13: string, userId?: string) {
  try {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        book:book_external!reviews_isbn13_fkey(*),
        emotions:review_emotions(*),
        topics:review_topics(*)
      `)
      .eq('isbn13', isbn13);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching review:', error);
    return { data: null, error };
  }
}

// 리뷰 작성
export async function createReview(input: CreateReviewInput) {
  try {
    console.log('🔍 리뷰 생성 시작:', input);

    // 현재 인증된 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('👤 현재 사용자:', user?.id);

    if (authError || !user) {
      throw new Error('사용자 인증이 필요합니다.');
    }

    // user_id 필수 확인 및 설정
    const userId = input.user_id || user.id;
    if (!userId) {
      throw new Error('사용자 ID가 필요합니다.');
    }

    // 기본 리뷰 데이터 구성
    const insertData = {
      user_id: userId, // 필수 필드
      isbn13: input.isbn13,
      read_date: input.read_date || new Date().toISOString(),
      memo: input.memo,
    };

    console.log('💾 저장할 데이터:', insertData);
    console.log('🔍 입력 데이터 검증:', {
      userId: userId,
      userIdType: typeof userId,
      isbn13: input.isbn13,
      isbn13Type: typeof input.isbn13,
      memo: input.memo ? input.memo.substring(0, 50) + '...' : null
    });

    const { data, error } = await supabase
      .from('reviews')
      .insert(insertData)
      .select(`
        *,
        book:book_external!reviews_isbn13_fkey(*)
      `)
      .single();

    if (error) {
      console.error('❌ 리뷰 저장 실패:', error);
      // RLS 정책 에러 확인
      if (error.message?.includes('row-level security') || error.code === '42501') {
        throw new Error('리뷰 작성 권한이 없습니다. 로그인 상태를 확인해주세요.');
      }
      throw error;
    }

    console.log('✅ 리뷰 저장 성공:', data);

    // 📊 감정 데이터가 있으면 별도 테이블에 저장
    if (data && input.emotions && Array.isArray(input.emotions) && input.emotions.length > 0) {
      try {
        console.log('💭 감정 데이터 저장 중:', input.emotions);
        
        const emotionInserts = input.emotions
          .filter(emotion => emotion && emotion.trim()) // 빈 값 제거
          .map((emotion: string) => ({
            review_id: data.id,
            emotion: emotion.trim(),
            score: 1, // 기본 점수
            source: 'ai' // AI 분석 결과
          }));

        if (emotionInserts.length > 0) {
          const { error: emotionError } = await supabase
            .from('review_emotions')
            .insert(emotionInserts);
          
          if (emotionError) {
            console.warn('감정 데이터 저장 실패:', emotionError);
          } else {
            console.log('✅ 감정 데이터 저장 성공');
          }
        }
      } catch (emotionError) {
        console.warn('감정 데이터 저장 예외:', emotionError);
        // 감정 저장 실패해도 리뷰는 성공으로 처리
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('❌ createReview 예외:', error);
    return { data: null, error };
  }
}

// 리뷰 수정
export async function updateReview(id: string, input: UpdateReviewInput) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        book:book_external!reviews_isbn13_fkey(*),
        emotions:review_emotions(*),
        topics:review_topics(*)
      `)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating review:', error);
    return { data: null, error };
  }
}

// 리뷰 삭제
export async function deleteReview(id: string) {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting review:', error);
    return { error };
  }
}

// 리뷰에 감정 추가
export async function addReviewEmotion(reviewId: string, emotion: string, score: number, source = 'user') {
  try {
    const { data, error } = await supabase
      .from('review_emotions')
      .insert({
        review_id: reviewId,
        emotion,
        score,
        source,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding review emotion:', error);
    return { data: null, error };
  }
}

// 리뷰에 주제/키워드 추가
export async function addReviewTopic(reviewId: string, keyword: string, weight: number, source = 'user') {
  try {
    const { data, error } = await supabase
      .from('review_topics')
      .insert({
        review_id: reviewId,
        keyword,
        weight,
        source,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding review topic:', error);
    return { data: null, error };
  }
}

// 리뷰 감정 일괄 업데이트
export async function updateReviewEmotions(reviewId: string, emotions: Array<{ emotion: string; score: number }>) {
  try {
    // 기존 감정 삭제
    await supabase
      .from('review_emotions')
      .delete()
      .eq('review_id', reviewId)
      .eq('source', 'user');

    // 새 감정 추가
    if (emotions.length > 0) {
      const { data, error } = await supabase
        .from('review_emotions')
        .insert(
          emotions.map(({ emotion, score }) => ({
            review_id: reviewId,
            emotion,
            score,
            source: 'user',
          }))
        )
        .select();

      if (error) throw error;
      return { data, error: null };
    }

    return { data: [], error: null };
  } catch (error) {
    console.error('Error updating review emotions:', error);
    return { data: null, error };
  }
}

// 리뷰 주제 일괄 업데이트
export async function updateReviewTopics(reviewId: string, topics: Array<{ keyword: string; weight: number }>) {
  try {
    // 기존 주제 삭제
    await supabase
      .from('review_topics')
      .delete()
      .eq('review_id', reviewId)
      .eq('source', 'user');

    // 새 주제 추가
    if (topics.length > 0) {
      const { data, error } = await supabase
        .from('review_topics')
        .insert(
          topics.map(({ keyword, weight }) => ({
            review_id: reviewId,
            keyword,
            weight,
            source: 'user',
          }))
        )
        .select();

      if (error) throw error;
      return { data, error: null };
    }

    return { data: [], error: null };
  } catch (error) {
    console.error('Error updating review topics:', error);
    return { data: null, error };
  }
}

// 감정별 리뷰 통계
export async function getEmotionStats(userId?: string) {
  try {
    const query = supabase
      .from('review_emotions')
      .select(`
        emotion,
        score,
        reviews!review_emotions_review_id_fkey(user_id)
      `);

    const { data, error } = await query;

    if (error) throw error;

    // 사용자별 필터링
    const filteredData = userId 
      ? data?.filter(item => item.reviews && item.reviews.length > 0 && item.reviews[0].user_id === userId)
      : data;

    // 감정별 통계 계산
    const emotionStats = filteredData?.reduce((acc: any, item) => {
      const emotion = item.emotion;
      if (!acc[emotion]) {
        acc[emotion] = {
          emotion,
          count: 0,
          totalScore: 0,
          averageScore: 0,
        };
      }
      acc[emotion].count += 1;
      acc[emotion].totalScore += item.score || 0;
      acc[emotion].averageScore = acc[emotion].totalScore / acc[emotion].count;
      return acc;
    }, {});

    return { data: Object.values(emotionStats || {}), error: null };
  } catch (error) {
    console.error('Error fetching emotion stats:', error);
    return { data: null, error };
  }
}
