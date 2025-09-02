import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Loader2, Smile, Frown, Meh, Zap, Coffee, Flame, Droplets, Sun, Moon, Cloud, Rainbow, Snowflake, Leaf, Mountain, Waves, Star, Heart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import * as booksApi from '../../api/books';
import { BookExternal } from '../../types/database';

interface BookData {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
}

interface BookReviewPageProps {
  onReviewSubmit: (bookData: BookExternal, reviewText: string, selectedEmotions: string[]) => void;
  onBack: () => void;
}

interface EmotionCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  subcategories: string[];
}

const BookReviewPage: React.FC<BookReviewPageProps> = ({
  onReviewSubmit,
  onBack
}) => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  
  const [reviewText, setReviewText] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [book, setBook] = useState<BookExternal | null>(null);
  const [isLoadingBook, setIsLoadingBook] = useState(true);

  // 실제 책 데이터 불러오기
  useEffect(() => {
    const loadBookData = async () => {
      if (!bookId) return;
      
      setIsLoadingBook(true);
      try {
        // 1. 데이터베이스에서 먼저 조회
        const { data: dbBook } = await booksApi.getBookByIsbn(bookId);
        
        if (dbBook) {
          setBook(dbBook);
        } else {
          // 2. 데이터베이스에 없으면 알라딘 API 조회 (필요시)
          console.warn('책 데이터를 찾을 수 없습니다:', bookId);
        }
      } catch (error) {
        console.error('책 데이터 로딩 실패:', error);
      } finally {
        setIsLoadingBook(false);
      }
    };

    loadBookData();
  }, [bookId]);

  // Emotion categories
  const emotionCategories: EmotionCategory[] = [
    {
      id: 'joy',
      name: '기쁨',
      icon: <Smile className="w-4 h-4" />,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      subcategories: ['행복', '즐거움', '만족', '희열', '환희', '기대감', '설렘', '감동']
    },
    {
      id: 'sadness',
      name: '슬픔',
      icon: <Frown className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      subcategories: ['우울', '아쉬움', '그리움', '애잔함', '쓸쓸함', '허무', '절망', '안타까움']
    },
    {
      id: 'anger',
      name: '분노',
      icon: <Flame className="w-4 h-4" />,
      color: 'bg-red-100 text-red-700 border-red-200',
      subcategories: ['화남', '짜증', '분개', '억울함', '답답함', '불만', '격분', '원망']
    },
    {
      id: 'fear',
      name: '두려움',
      icon: <Cloud className="w-4 h-4" />,
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      subcategories: ['불안', '걱정', '긴장', '공포', '무서움', '경계', '조심스러움', '위축']
    },
    {
      id: 'surprise',
      name: '놀라움',
      icon: <Zap className="w-4 h-4" />,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      subcategories: ['충격', '당황', '의외', '기적', '신기함', '경이로움']
    },
    {
      id: 'disgust',
      name: '혐오',
      icon: <Meh className="w-4 h-4" />,
      color: 'bg-green-100 text-green-700 border-green-200',
      subcategories: ['역겨움', '싫음', '거부감', '불쾌', '멸시']
    },
    {
      id: 'anticipation',
      name: '기대',
      icon: <Star className="w-4 h-4" />,
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      subcategories: ['설렘', '기대감', '호기심', '관심', '간절함', '열망']
    },
    {
      id: 'trust',
      name: '신뢰',
      icon: <Heart className="w-4 h-4" />,
      color: 'bg-pink-100 text-pink-700 border-pink-200',
      subcategories: ['믿음', '의지', '확신', '안정감', '평온', '위안']
    }
  ];

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSubmit = async () => {
    if (!reviewText.trim() || reviewText.length < 30) {
      alert('감상문을 30자 이상 작성해주세요.');
      return;
    }

    if (!book) {
      alert('책 정보를 불러올 수 없습니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      // AI 감성 분석 시뮬레이션 (2초 딜레이)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      onReviewSubmit(book, reviewText, selectedEmotions);
      
      // 성공 알림
      alert('🎉 무드 카드가 생성되었습니다!\n아카이브에서 확인해보세요.');
    } catch (error) {
      console.error('리뷰 제출 실패:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`리뷰 제출에 실패했습니다: ${errorMessage}\n잠시 후 다시 시도해주세요.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 상태 처리
  if (isLoadingBook) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-screen"
      >
        <div className="px-4 md:px-0">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={onBack} 
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">감상문 작성</h1>
            <div className="w-10" />
          </div>
          
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#A8B5E8] border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-gray-600">책 정보를 불러오는 중...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!book) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-screen"
      >
        <div className="px-4 md:px-0">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={onBack} 
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">감상문 작성</h1>
            <div className="w-10" />
          </div>
          
          <div className="max-w-sm mx-auto text-center py-20">
            <h3 className="text-lg font-medium text-gray-800 mb-2">책을 찾을 수 없습니다</h3>
            <p className="text-gray-600 mb-4">해당 책의 정보를 불러올 수 없습니다.</p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-[#A8B5E8] text-white rounded-xl font-medium"
            >
              돌아가기
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }} 
      className="min-h-screen"
    >
      <div className="px-4 md:px-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack} 
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">감상문 작성</h1>
          <div className="w-10" />
        </div>

        {/* Book Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex space-x-4">
            <img 
              src={book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop'} 
              alt={book.title}
              className="w-16 h-22 object-cover rounded-xl flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 mb-1">{book.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{book.author || '작가 미상'}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{book.summary || '이 책에 대한 감상을 자유롭게 적어보세요.'}</p>
            </div>
          </div>
        </div>

        {/* Emotion Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">이 책을 읽으며 느낀 감정을 선택해주세요</h3>
          <div className="space-y-4">
            {emotionCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className={`inline-flex items-center px-3 py-2 rounded-full border text-sm font-medium mb-3 ${category.color}`}>
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {category.subcategories.map((emotion) => {
                    const isSelected = selectedEmotions.includes(emotion);
                    return (
                      <button
                        key={emotion}
                        onClick={() => toggleEmotion(emotion)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-[#A8B5E8] text-white border-[#A8B5E8] shadow-md'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {emotion}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Emotions Summary */}
          {selectedEmotions.length > 0 && (
            <div className="mt-6 bg-[#A8B5E8]/10 rounded-2xl p-4 border border-[#A8B5E8]/20">
              <h4 className="text-sm font-medium text-gray-800 mb-3">선택된 감정 ({selectedEmotions.length}개)</h4>
              <div className="flex flex-wrap gap-2">
                {selectedEmotions.map((emotion) => (
                  <span 
                    key={emotion}
                    className="px-3 py-1 bg-[#A8B5E8] text-white rounded-full text-sm font-medium"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Review Text */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">자세한 감상을 적어주세요</h3>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="이 책을 읽으며 어떤 감정을 느꼈는지, 어떤 부분이 인상깊었는지 자유롭게 적어주세요. AI가 당신의 감상을 분석하여 개인화된 무드 카드를 만들어드립니다."
              rows={8}
              className="w-full p-4 rounded-2xl border-0 focus:outline-none resize-none text-gray-800 placeholder-gray-400"
            />
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between text-sm">
                <span className={reviewText.length >= 30 ? 'text-green-600' : 'text-orange-500'}>
                  {reviewText.length < 30 ? '최소 30자 이상 작성해주세요' : '✅ 충분한 길이입니다!'}
                </span>
                <span className={`${reviewText.length >= 30 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                  {reviewText.length}/30
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="space-y-4">
          <button
            onClick={handleSubmit}
            disabled={reviewText.length < 30 || isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>AI가 감상을 분석하고 있어요...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>무드 카드 생성하기</span>
              </>
            )}
          </button>

          <div className="bg-[#A8B5E8]/10 rounded-2xl p-4 border border-[#A8B5E8]/20">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#A8B5E8] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">AI 무드 카드란?</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  당신의 감상문을 AI가 분석하여 개인화된 감정 분석 결과와 함께 아름다운 무드 카드를 생성해드립니다. 
                  이 카드는 당신만의 독서 기록이 되어 언제든 다시 볼 수 있어요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookReviewPage; 