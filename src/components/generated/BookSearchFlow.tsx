import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Book, Star, User, Calendar, Sparkles, Send, Loader2, X } from 'lucide-react';
interface BookData {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  isbn?: string;
  publishedYear?: string;
  rating?: number;
  mpid?: string;
}
interface BookSearchFlowProps {
  onReviewSubmit: (bookData: BookData, reviewText: string) => void;
  onBack: () => void;
  mpid?: string;
}
type FlowStep = 'search' | 'book-detail' | 'review';
const BookSearchFlow: React.FC<BookSearchFlowProps> = ({
  onReviewSubmit,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookData[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock book data - in real app, this would come from Aladdin API
  const mockBooks: BookData[] = [{
    id: '1',
    title: '달러구트 꿈 백화점',
    author: '이미예',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    description: '잠들어야만 입장할 수 있는 신비한 꿈 백화점에서 벌어지는 따뜻하고 환상적인 이야기',
    publishedYear: '2020',
    rating: 4.5,
    mpid: "b1b0ece5-95a2-4280-9047-05c0315172e3"
  }, {
    id: '2',
    title: '아몬드',
    author: '손원평',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
    description: '감정을 느끼지 못하는 소년 윤재의 성장 이야기를 통해 인간의 감정과 공감에 대해 탐구하는 소설',
    publishedYear: '2017',
    rating: 4.7,
    mpid: "5c2d8506-c2e0-46d8-ac30-f4f49468c1b7"
  }, {
    id: '3',
    title: '미드나이트 라이브러리',
    author: '매트 헤이그',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop',
    description: '삶과 죽음 사이에 존재하는 도서관에서 다양한 인생의 가능성을 탐험하는 철학적 소설',
    publishedYear: '2020',
    rating: 4.3,
    mpid: "88253506-6a9f-4669-8356-5130cb70618d"
  }];
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Filter mock books based on search query
    const results = mockBooks.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase()));
    setSearchResults(results);
    setIsSearching(false);
  };
  const handleBookSelect = (book: BookData) => {
    setSelectedBook(book);
    setCurrentStep('book-detail');
  };
  const handleProceedToReview = () => {
    setCurrentStep('review');
  };
  const handleSubmitReview = async () => {
    if (!selectedBook || !reviewText.trim()) return;
    setIsSubmitting(true);

    // Mock AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    onReviewSubmit(selectedBook, reviewText);
    setIsSubmitting(false);
  };
  const renderSearchStep = () => <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} className="min-h-screen bg-white px-4 py-8" data-magicpath-id="0" data-magicpath-path="BookSearchFlow.tsx">
      <div className="max-w-sm mx-auto" data-magicpath-id="1" data-magicpath-path="BookSearchFlow.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-magicpath-id="2" data-magicpath-path="BookSearchFlow.tsx">
          <button onClick={onBack} className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20" data-magicpath-id="3" data-magicpath-path="BookSearchFlow.tsx">
            <ArrowLeft className="w-5 h-5 text-white" data-magicpath-id="4" data-magicpath-path="BookSearchFlow.tsx" />
          </button>
          <h1 className="text-xl font-bold text-white" data-magicpath-id="5" data-magicpath-path="BookSearchFlow.tsx">책 검색</h1>
          <div className="w-10" data-magicpath-id="6" data-magicpath-path="BookSearchFlow.tsx" />
        </div>

        {/* Search Input */}
        <div className="relative mb-8" data-magicpath-id="7" data-magicpath-path="BookSearchFlow.tsx">
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSearch()} placeholder="책 제목이나 작가를 검색하세요" className="w-full px-4 py-4 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white/40" data-magicpath-id="8" data-magicpath-path="BookSearchFlow.tsx" />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" data-magicpath-id="9" data-magicpath-path="BookSearchFlow.tsx" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2" data-magicpath-id="10" data-magicpath-path="BookSearchFlow.tsx">
              <X className="w-5 h-5 text-white/60" data-magicpath-id="11" data-magicpath-path="BookSearchFlow.tsx" />
            </button>}
        </div>

        <button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} className="w-full py-4 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-8" data-magicpath-id="12" data-magicpath-path="BookSearchFlow.tsx">
          {isSearching ? <div className="flex items-center justify-center space-x-2" data-magicpath-id="13" data-magicpath-path="BookSearchFlow.tsx">
              <Loader2 className="w-5 h-5 animate-spin" data-magicpath-id="14" data-magicpath-path="BookSearchFlow.tsx" />
              <span data-magicpath-id="15" data-magicpath-path="BookSearchFlow.tsx">검색 중...</span>
            </div> : '검색하기'}
        </button>

        {/* Search Results */}
        {searchResults.length > 0 && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="space-y-4" data-magicpath-id="16" data-magicpath-path="BookSearchFlow.tsx">
            <h2 className="text-lg font-semibold text-white mb-4" data-magicpath-id="17" data-magicpath-path="BookSearchFlow.tsx">검색 결과</h2>
            {searchResults.map((book, index) => <motion.div key={book.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} onClick={() => handleBookSelect(book)} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 active:scale-95 transition-transform" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="18" data-magicpath-path="BookSearchFlow.tsx">
                <div className="flex space-x-4" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="19" data-magicpath-path="BookSearchFlow.tsx">
                  <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded-xl" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="cover:unknown" data-magicpath-id="20" data-magicpath-path="BookSearchFlow.tsx" />
                  <div className="flex-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="21" data-magicpath-path="BookSearchFlow.tsx">
                    <h3 className="font-semibold text-white mb-1 text-sm" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="title:unknown" data-magicpath-id="22" data-magicpath-path="BookSearchFlow.tsx">
                      {book.title}
                    </h3>
                    <p className="text-white/70 text-xs mb-2" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="author:unknown" data-magicpath-id="23" data-magicpath-path="BookSearchFlow.tsx">
                      {book.author}
                    </p>
                    {book.rating && <div className="flex items-center mb-2" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="24" data-magicpath-path="BookSearchFlow.tsx">
                        <Star className="w-3 h-3 text-[#F4E4B8] fill-current mr-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="25" data-magicpath-path="BookSearchFlow.tsx" />
                        <span className="text-white/70 text-xs" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="rating:unknown" data-magicpath-id="26" data-magicpath-path="BookSearchFlow.tsx">{book.rating}</span>
                      </div>}
                    <p className="text-white/60 text-xs line-clamp-2" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="description:unknown" data-magicpath-id="27" data-magicpath-path="BookSearchFlow.tsx">
                      {book.description}
                    </p>
                  </div>
                </div>
              </motion.div>)}
          </motion.div>}

        {searchQuery && searchResults.length === 0 && !isSearching && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} className="text-center py-12" data-magicpath-id="28" data-magicpath-path="BookSearchFlow.tsx">
            <Book className="w-16 h-16 text-white/40 mx-auto mb-4" data-magicpath-id="29" data-magicpath-path="BookSearchFlow.tsx" />
            <h3 className="text-lg font-semibold text-white mb-2" data-magicpath-id="30" data-magicpath-path="BookSearchFlow.tsx">검색 결과가 없습니다</h3>
            <p className="text-white/70" data-magicpath-id="31" data-magicpath-path="BookSearchFlow.tsx">다른 키워드로 검색해보세요</p>
          </motion.div>}
      </div>
    </motion.div>;
  const renderBookDetailStep = () => <motion.div initial={{
    opacity: 0,
    x: 20
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -20
  }} className="min-h-screen bg-white px-4 py-8" data-magicpath-id="32" data-magicpath-path="BookSearchFlow.tsx">
      <div className="max-w-sm mx-auto" data-magicpath-id="33" data-magicpath-path="BookSearchFlow.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-magicpath-id="34" data-magicpath-path="BookSearchFlow.tsx">
          <button onClick={() => setCurrentStep('search')} className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20" data-magicpath-id="35" data-magicpath-path="BookSearchFlow.tsx">
            <ArrowLeft className="w-5 h-5 text-white" data-magicpath-id="36" data-magicpath-path="BookSearchFlow.tsx" />
          </button>
          <h1 className="text-xl font-bold text-white" data-magicpath-id="37" data-magicpath-path="BookSearchFlow.tsx">책 정보</h1>
          <div className="w-10" data-magicpath-id="38" data-magicpath-path="BookSearchFlow.tsx" />
        </div>

        {selectedBook && <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8" data-magicpath-id="39" data-magicpath-path="BookSearchFlow.tsx">
            <div className="text-center mb-6" data-magicpath-id="40" data-magicpath-path="BookSearchFlow.tsx">
              <img src={selectedBook.cover} alt={selectedBook.title} className="w-32 h-48 object-cover rounded-xl shadow-lg mx-auto mb-4" data-magicpath-id="41" data-magicpath-path="BookSearchFlow.tsx" />
              <h1 className="text-xl font-bold text-white mb-2" data-magicpath-id="42" data-magicpath-path="BookSearchFlow.tsx">{selectedBook.title}</h1>
              <p className="text-white/70 mb-4" data-magicpath-id="43" data-magicpath-path="BookSearchFlow.tsx">{selectedBook.author}</p>
              
              <div className="flex items-center justify-center space-x-4 mb-4" data-magicpath-id="44" data-magicpath-path="BookSearchFlow.tsx">
                {selectedBook.publishedYear && <div className="flex items-center text-white/60" data-magicpath-id="45" data-magicpath-path="BookSearchFlow.tsx">
                    <Calendar className="w-4 h-4 mr-1" data-magicpath-id="46" data-magicpath-path="BookSearchFlow.tsx" />
                    <span className="text-sm" data-magicpath-id="47" data-magicpath-path="BookSearchFlow.tsx">{selectedBook.publishedYear}</span>
                  </div>}
                {selectedBook.rating && <div className="flex items-center" data-magicpath-id="48" data-magicpath-path="BookSearchFlow.tsx">
                    <Star className="w-4 h-4 text-[#F4E4B8] fill-current mr-1" data-magicpath-id="49" data-magicpath-path="BookSearchFlow.tsx" />
                    <span className="text-white/70 text-sm" data-magicpath-id="50" data-magicpath-path="BookSearchFlow.tsx">{selectedBook.rating}/5</span>
                  </div>}
              </div>
            </div>

            <p className="text-white/80 text-sm leading-relaxed mb-6 text-center" data-magicpath-id="51" data-magicpath-path="BookSearchFlow.tsx">
              {selectedBook.description}
            </p>

            <button onClick={handleProceedToReview} className="w-full py-4 bg-gradient-to-r from-[#B5D4C8] to-[#A8D4C8] text-white rounded-2xl font-medium flex items-center justify-center space-x-2" data-magicpath-id="52" data-magicpath-path="BookSearchFlow.tsx">
              <Sparkles className="w-5 h-5" />
              <span data-magicpath-id="53" data-magicpath-path="BookSearchFlow.tsx">감상문 작성하기</span>
            </button>
          </div>}
      </div>
    </motion.div>;
  const renderReviewStep = () => <motion.div initial={{
    opacity: 0,
    x: 20
  }} animate={{
    opacity: 1,
    x: 0
  }} exit={{
    opacity: 0,
    x: -20
  }} className="min-h-screen bg-white px-4 py-8" data-magicpath-id="54" data-magicpath-path="BookSearchFlow.tsx">
      <div className="max-w-sm mx-auto" data-magicpath-id="55" data-magicpath-path="BookSearchFlow.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-magicpath-id="56" data-magicpath-path="BookSearchFlow.tsx">
          <button onClick={() => setCurrentStep('book-detail')} className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20" data-magicpath-id="57" data-magicpath-path="BookSearchFlow.tsx">
            <ArrowLeft className="w-5 h-5 text-white" data-magicpath-id="58" data-magicpath-path="BookSearchFlow.tsx" />
          </button>
          <h1 className="text-xl font-bold text-white" data-magicpath-id="59" data-magicpath-path="BookSearchFlow.tsx">감상문 작성</h1>
          <div className="w-10" data-magicpath-id="60" data-magicpath-path="BookSearchFlow.tsx" />
        </div>

        {selectedBook && <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-6" data-magicpath-id="61" data-magicpath-path="BookSearchFlow.tsx">
            <div className="flex items-center space-x-3" data-magicpath-id="62" data-magicpath-path="BookSearchFlow.tsx">
              <img src={selectedBook.cover} alt={selectedBook.title} className="w-12 h-18 object-cover rounded-lg" data-magicpath-id="63" data-magicpath-path="BookSearchFlow.tsx" />
              <div data-magicpath-id="64" data-magicpath-path="BookSearchFlow.tsx">
                <h3 className="font-semibold text-white text-sm" data-magicpath-id="65" data-magicpath-path="BookSearchFlow.tsx">{selectedBook.title}</h3>
                <p className="text-white/70 text-xs" data-magicpath-id="66" data-magicpath-path="BookSearchFlow.tsx">{selectedBook.author}</p>
              </div>
            </div>
          </div>}

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6" data-magicpath-id="67" data-magicpath-path="BookSearchFlow.tsx">
          <label className="block text-sm font-medium text-white mb-4" data-magicpath-id="68" data-magicpath-path="BookSearchFlow.tsx">
            이 책을 읽고 느낀 감정을 자유롭게 적어주세요
          </label>
          <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="이 책을 읽으면서 어떤 감정을 느꼈나요? 어떤 장면이 가장 인상 깊었나요? 자유롭게 감상을 적어주세요..." className="w-full h-40 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 resize-none text-sm" data-magicpath-id="69" data-magicpath-path="BookSearchFlow.tsx" />
          
          <div className="mt-6" data-magicpath-id="70" data-magicpath-path="BookSearchFlow.tsx">
            <p className="text-xs text-white/60 mb-4 text-center" data-magicpath-id="71" data-magicpath-path="BookSearchFlow.tsx">
              AI가 당신의 감상을 분석해서 감성 카드를 만들어드려요
            </p>
            <button onClick={handleSubmitReview} disabled={!reviewText.trim() || isSubmitting} className="w-full py-4 bg-gradient-to-r from-[#F4E4B8] to-[#F0E4B8] text-white rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2" data-magicpath-id="72" data-magicpath-path="BookSearchFlow.tsx">
              {isSubmitting ? <>
                  <Loader2 className="w-5 h-5 animate-spin" data-magicpath-id="73" data-magicpath-path="BookSearchFlow.tsx" />
                  <span data-magicpath-id="74" data-magicpath-path="BookSearchFlow.tsx">무드 카드 생성 중...</span>
                </> : <>
                  <Send className="w-5 h-5" data-magicpath-id="75" data-magicpath-path="BookSearchFlow.tsx" />
                  <span data-magicpath-id="76" data-magicpath-path="BookSearchFlow.tsx">감상문 제출하기</span>
                </>}
            </button>
          </div>
        </div>
      </div>
    </motion.div>;
  return <AnimatePresence mode="wait" data-magicpath-id="77" data-magicpath-path="BookSearchFlow.tsx">
      {currentStep === 'search' && renderSearchStep()}
      {currentStep === 'book-detail' && renderBookDetailStep()}
      {currentStep === 'review' && renderReviewStep()}
    </AnimatePresence>;
};
export default BookSearchFlow;