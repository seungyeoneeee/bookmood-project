import { supabase } from '../lib/supabase';
import { Review, CreateReviewInput, UpdateReviewInput, ReviewEmotion, ReviewTopic } from '../types/database';

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
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        isbn13: input.isbn13,
        read_date: input.read_date,
        memo: input.memo,
      })
      .select(`
        *,
        book:book_external!reviews_isbn13_fkey(*)
      `)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating review:', error);
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
      ? data?.filter(item => item.reviews?.user_id === userId)
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
