import { useState, useEffect } from 'react';
import { Review, CreateReviewInput, UpdateReviewInput } from '../types/database';
import { useAuth } from '../contexts/AuthContext';
import * as reviewsApi from '../api/reviews';

export function useReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await reviewsApi.getReviews(user.id);
    
    if (fetchError) {
      setError((fetchError as any)?.message || '리뷰를 가져오는 중 오류가 발생했습니다.');
      setReviews([]);
    } else {
      setReviews(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [user?.id]);

  const createReview = async (input: CreateReviewInput) => {
    if (!user) return { success: false, error: '로그인이 필요합니다.' };

    const { data, error: createError } = await reviewsApi.createReview(input);
    
    if (createError) {
      return { success: false, error: (createError as any)?.message || '리뷰 작성 중 오류가 발생했습니다.' };
    }

    if (data) {
      setReviews(prev => [data, ...prev]);
    }
    
    return { success: true, data };
  };

  const updateReview = async (id: string, input: UpdateReviewInput) => {
    const { data, error: updateError } = await reviewsApi.updateReview(id, input);
    
    if (updateError) {
      return { success: false, error: (updateError as any)?.message || '리뷰 수정 중 오류가 발생했습니다.' };
    }

    if (data) {
      setReviews(prev => prev.map(review => review.id === id ? data : review));
    }
    
    return { success: true, data };
  };

  const deleteReview = async (id: string) => {
    const { error: deleteError } = await reviewsApi.deleteReview(id);
    
    if (deleteError) {
      return { success: false, error: (deleteError as any)?.message || '리뷰 삭제 중 오류가 발생했습니다.' };
    }

    setReviews(prev => prev.filter(review => review.id !== id));
    return { success: true };
  };

  const updateReviewEmotions = async (reviewId: string, emotions: Array<{ emotion: string; score: number }>) => {
    const { data, error: updateError } = await reviewsApi.updateReviewEmotions(reviewId, emotions);
    
    if (updateError) {
      return { success: false, error: (updateError as any)?.message || '감정 업데이트 중 오류가 발생했습니다.' };
    }

    // 로컬 상태 업데이트
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, emotions: data || [] }
        : review
    ));
    
    return { success: true, data };
  };

  const updateReviewTopics = async (reviewId: string, topics: Array<{ keyword: string; weight: number }>) => {
    const { data, error: updateError } = await reviewsApi.updateReviewTopics(reviewId, topics);
    
    if (updateError) {
      return { success: false, error: (updateError as any)?.message || '주제 업데이트 중 오류가 발생했습니다.' };
    }

    // 로컬 상태 업데이트
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, topics: data || [] }
        : review
    ));
    
    return { success: true, data };
  };

  return {
    reviews,
    loading,
    error,
    createReview,
    updateReview,
    deleteReview,
    updateReviewEmotions,
    updateReviewTopics,
    refetch: fetchReviews,
  };
}

export function useReview(isbn13?: string) {
  const { user } = useAuth();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isbn13 || !user) return;

    const fetchReview = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await reviewsApi.getReviewByIsbn(isbn13, user.id);
      
      if (fetchError) {
        setError((fetchError as any)?.message || '리뷰를 가져오는 중 오류가 발생했습니다.');
        setReview(null);
      } else {
        setReview(data);
      }
      
      setLoading(false);
    };

    fetchReview();
  }, [isbn13, user?.id]);

  return {
    review,
    loading,
    error,
  };
}

export function useEmotionStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await reviewsApi.getEmotionStats(user.id);
      
      if (fetchError) {
        setError((fetchError as any)?.message || '감정 통계를 가져오는 중 오류가 발생했습니다.');
        setStats([]);
      } else {
        setStats(data || []);
      }
      
      setLoading(false);
    };

    fetchStats();
  }, [user?.id]);

  return {
    stats,
    loading,
    error,
  };
}
