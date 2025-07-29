"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, Calendar, BookOpen, ArrowLeft, Filter, Search, Trash2, Check, Plus } from 'lucide-react';
export interface WishlistBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  rating?: number;
  publishedYear?: string;
  genre?: string;
  pages?: number;
  addedAt: Date;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  notes?: string;
  mpid?: string;
}
interface WishlistManagerProps {
  onBack: () => void;
  onBookSelect?: (book: WishlistBook) => void;
  mpid?: string;
}
type SortType = 'recent' | 'priority' | 'title' | 'author';
type FilterType = 'all' | 'high' | 'medium' | 'low';
const WishlistManager: React.FC<WishlistManagerProps> = ({
  onBack,
  onBookSelect
}) => {
  const [wishlistBooks, setWishlistBooks] = useState<WishlistBook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('recent');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Mock wishlist data
  useEffect(() => {
    const mockWishlist: WishlistBook[] = [{
      id: '1',
      title: '클린 코드',
      author: '로버트 C. 마틴',
      cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop',
      description: '애자일 소프트웨어 장인 정신에 대한 핸드북. 좋은 코드와 나쁜 코드를 구분하는 방법을 배우고, 좋은 코드를 작성하는 방법과 나쁜 코드를 좋은 코드로 바꾸는 방법을 익힌다.',
      rating: 4.6,
      publishedYear: '2008',
      genre: '프로그래밍',
      pages: 464,
      addedAt: new Date('2024-01-10'),
      priority: 'high',
      tags: ['개발', '코딩', '실무'],
      notes: '팀 리더가 추천한 필독서',
      mpid: "d2d4b409-32aa-4f89-8d3b-41825809b656"
    }, {
      id: '2',
      title: '사피엔스',
      author: '유발 하라리',
      cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
      description: '인류의 역사를 거시적 관점에서 조망한 베스트셀러. 호모 사피엔스가 어떻게 지구의 지배자가 되었는지를 흥미진진하게 풀어낸다.',
      rating: 4.4,
      publishedYear: '2011',
      genre: '역사',
      pages: 636,
      addedAt: new Date('2024-01-15'),
      priority: 'medium',
      tags: ['역사', '인문학', '철학'],
      notes: '친구가 강력 추천',
      mpid: "1cdf2947-b5e5-4646-a25b-9859b971f17a"
    }, {
      id: '3',
      title: '원피스 1권',
      author: '오다 에이치로',
      cover: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
      description: '해적왕을 꿈꾸는 소년 루피의 모험이 시작되는 대서사시. 동료들과 함께 그랜드라인을 항해하며 꿈을 향해 나아간다.',
      rating: 4.8,
      publishedYear: '1997',
      genre: '만화',
      pages: 200,
      addedAt: new Date('2024-01-20'),
      priority: 'low',
      tags: ['만화', '모험', '우정'],
      notes: '휴식용 독서',
      mpid: "c81dbcac-f1f3-46dc-b8e0-69b318c3d185"
    }, {
      id: '4',
      title: '데미안',
      author: '헤르만 헤세',
      cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop',
      description: '한 소년의 성장과 자아 발견의 여정을 그린 고전 소설. 선악의 경계를 넘나들며 진정한 자아를 찾아가는 이야기.',
      rating: 4.3,
      publishedYear: '1919',
      genre: '고전문학',
      pages: 248,
      addedAt: new Date('2024-01-25'),
      priority: 'high',
      tags: ['고전', '성장', '철학'],
      notes: '고등학교 때 읽다가 중단한 책',
      mpid: "ca187785-3b94-415e-ba93-40babca1608a"
    }, {
      id: '5',
      title: '아토믹 해빗',
      author: '제임스 클리어',
      cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
      description: '작은 변화가 만드는 놀라운 결과에 대한 실용적인 가이드. 좋은 습관을 만들고 나쁜 습관을 끊는 과학적인 방법을 제시한다.',
      rating: 4.5,
      publishedYear: '2018',
      genre: '자기계발',
      pages: 320,
      addedAt: new Date('2024-02-01'),
      priority: 'medium',
      tags: ['습관', '자기계발', '실용'],
      notes: '새해 목표 달성을 위해',
      mpid: "a9100b2d-4e59-4ecb-a3e9-0aaebb93a68c"
    }];
    setWishlistBooks(mockWishlist);
  }, []);
  const filteredAndSortedBooks = React.useMemo(() => {
    let filtered = wishlistBooks;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase()) || book.genre?.toLowerCase().includes(searchQuery.toLowerCase()) || book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    }

    // Priority filter
    if (filterType !== 'all') {
      filtered = filtered.filter(book => book.priority === filterType);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortType) {
        case 'recent':
          return b.addedAt.getTime() - a.addedAt.getTime();
        case 'priority':
          const priorityOrder = {
            high: 3,
            medium: 2,
            low: 1
          };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        default:
          return 0;
      }
    });
    return filtered;
  }, [wishlistBooks, searchQuery, sortType, filterType]);
  const toggleBookSelection = (bookId: string) => {
    setSelectedBooks(prev => prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]);
  };
  const removeFromWishlist = (bookId: string) => {
    setWishlistBooks(prev => prev.filter(book => book.id !== bookId));
    setSelectedBooks(prev => prev.filter(id => id !== bookId));
  };
  const removeSelectedBooks = () => {
    setWishlistBooks(prev => prev.filter(book => !selectedBooks.includes(book.id)));
    setSelectedBooks([]);
    setIsSelectionMode(false);
  };
  const togglePriority = (bookId: string) => {
    setWishlistBooks(prev => prev.map(book => {
      if (book.id === bookId) {
        const priorities: ('high' | 'medium' | 'low')[] = ['low', 'medium', 'high'];
        const currentIndex = priorities.indexOf(book.priority);
        const nextIndex = (currentIndex + 1) % priorities.length;
        return {
          ...book,
          priority: priorities[nextIndex]
        };
      }
      return book;
    }));
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '높음';
      case 'medium':
        return '보통';
      case 'low':
        return '낮음';
      default:
        return '보통';
    }
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="min-h-screen px-4 py-8" data-magicpath-id="0" data-magicpath-path="WishlistManager.tsx">
      <div className="max-w-sm mx-auto" data-magicpath-id="1" data-magicpath-path="WishlistManager.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-magicpath-id="2" data-magicpath-path="WishlistManager.tsx">
          <button onClick={onBack} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors" data-magicpath-id="3" data-magicpath-path="WishlistManager.tsx">
            <ArrowLeft className="w-5 h-5 text-gray-600" data-magicpath-id="4" data-magicpath-path="WishlistManager.tsx" />
          </button>
          <div className="text-center" data-magicpath-id="5" data-magicpath-path="WishlistManager.tsx">
            <h1 className="text-xl font-bold text-gray-800" data-magicpath-id="6" data-magicpath-path="WishlistManager.tsx">찜한 책</h1>
            <p className="text-sm text-gray-600" data-magicpath-id="7" data-magicpath-path="WishlistManager.tsx">{wishlistBooks.length}권의 책</p>
          </div>
          <button onClick={() => setIsSelectionMode(!isSelectionMode)} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors" data-magicpath-id="8" data-magicpath-path="WishlistManager.tsx">
            {isSelectionMode ? <X className="w-5 h-5 text-gray-600" data-magicpath-id="9" data-magicpath-path="WishlistManager.tsx" /> : <Filter className="w-5 h-5 text-gray-600" data-magicpath-id="10" data-magicpath-path="WishlistManager.tsx" />}
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6" data-magicpath-id="11" data-magicpath-path="WishlistManager.tsx">
          {/* Search */}
          <div className="relative" data-magicpath-id="12" data-magicpath-path="WishlistManager.tsx">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="책 제목, 작가, 장르로 검색..." className="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20" data-magicpath-id="13" data-magicpath-path="WishlistManager.tsx" />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" data-magicpath-id="14" data-magicpath-path="WishlistManager.tsx" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2" data-magicpath-id="15" data-magicpath-path="WishlistManager.tsx">
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" data-magicpath-id="16" data-magicpath-path="WishlistManager.tsx" />
              </button>}
          </div>

          {/* Sort and Filter Controls */}
          <div className="flex space-x-3" data-magicpath-id="17" data-magicpath-path="WishlistManager.tsx">
            <select value={sortType} onChange={e => setSortType(e.target.value as SortType)} className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#A8B5E8]" data-magicpath-id="18" data-magicpath-path="WishlistManager.tsx">
              <option value="recent" data-magicpath-id="19" data-magicpath-path="WishlistManager.tsx">최근 추가순</option>
              <option value="priority" data-magicpath-id="20" data-magicpath-path="WishlistManager.tsx">우선순위순</option>
              <option value="title" data-magicpath-id="21" data-magicpath-path="WishlistManager.tsx">제목순</option>
              <option value="author" data-magicpath-id="22" data-magicpath-path="WishlistManager.tsx">작가순</option>
            </select>

            <select value={filterType} onChange={e => setFilterType(e.target.value as FilterType)} className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#A8B5E8]" data-magicpath-id="23" data-magicpath-path="WishlistManager.tsx">
              <option value="all" data-magicpath-id="24" data-magicpath-path="WishlistManager.tsx">모든 우선순위</option>
              <option value="high" data-magicpath-id="25" data-magicpath-path="WishlistManager.tsx">높음</option>
              <option value="medium" data-magicpath-id="26" data-magicpath-path="WishlistManager.tsx">보통</option>
              <option value="low" data-magicpath-id="27" data-magicpath-path="WishlistManager.tsx">낮음</option>
            </select>
          </div>
        </div>

        {/* Selection Mode Actions */}
        {isSelectionMode && <motion.div initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-[#A8B5E8]/10 border border-[#A8B5E8]/20 rounded-2xl p-4 mb-6" data-magicpath-id="28" data-magicpath-path="WishlistManager.tsx">
            <div className="flex items-center justify-between" data-magicpath-id="29" data-magicpath-path="WishlistManager.tsx">
              <p className="text-sm text-gray-700" data-magicpath-id="30" data-magicpath-path="WishlistManager.tsx">
                {selectedBooks.length}권 선택됨
              </p>
              <div className="flex space-x-2" data-magicpath-id="31" data-magicpath-path="WishlistManager.tsx">
                <button onClick={() => setSelectedBooks(filteredAndSortedBooks.map(book => book.id))} className="px-3 py-1 text-xs bg-[#A8B5E8] text-white rounded-lg hover:bg-[#8BB5E8] transition-colors" data-magicpath-id="32" data-magicpath-path="WishlistManager.tsx">
                  전체 선택
                </button>
                {selectedBooks.length > 0 && <button onClick={removeSelectedBooks} className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-1" data-magicpath-id="33" data-magicpath-path="WishlistManager.tsx">
                    <Trash2 className="w-3 h-3" data-magicpath-id="34" data-magicpath-path="WishlistManager.tsx" />
                    <span data-magicpath-id="35" data-magicpath-path="WishlistManager.tsx">삭제</span>
                  </button>}
              </div>
            </div>
          </motion.div>}

        {/* Books List */}
        <div className="space-y-4" data-magicpath-id="36" data-magicpath-path="WishlistManager.tsx">
          <AnimatePresence data-magicpath-id="37" data-magicpath-path="WishlistManager.tsx">
            {filteredAndSortedBooks.map((book, index) => <motion.div key={book.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            x: -100
          }} transition={{
            delay: index * 0.05
          }} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="38" data-magicpath-path="WishlistManager.tsx">
                <div className="flex space-x-4" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="39" data-magicpath-path="WishlistManager.tsx">
                  {/* Selection Checkbox */}
                  {isSelectionMode && <div className="flex items-start pt-2" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="40" data-magicpath-path="WishlistManager.tsx">
                      <button onClick={() => toggleBookSelection(book.id)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selectedBooks.includes(book.id) ? 'bg-[#A8B5E8] border-[#A8B5E8] text-white' : 'border-gray-300 hover:border-[#A8B5E8]'}`} data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="41" data-magicpath-path="WishlistManager.tsx">
                        {selectedBooks.includes(book.id) && <Check className="w-3 h-3" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="42" data-magicpath-path="WishlistManager.tsx" />}
                      </button>
                    </div>}

                  {/* Book Cover */}
                  <div className="relative" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="43" data-magicpath-path="WishlistManager.tsx">
                    <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded-lg shadow-sm" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="cover:unknown" data-magicpath-id="44" data-magicpath-path="WishlistManager.tsx" />
                    <button onClick={() => togglePriority(book.id)} className={`absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(book.priority)}`} data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="priority:unknown" data-magicpath-id="45" data-magicpath-path="WishlistManager.tsx">
                      {getPriorityText(book.priority)}
                    </button>
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 space-y-2" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="46" data-magicpath-path="WishlistManager.tsx">
                    <div data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="47" data-magicpath-path="WishlistManager.tsx">
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="title:unknown" data-magicpath-id="48" data-magicpath-path="WishlistManager.tsx">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-xs" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="author:unknown" data-magicpath-id="49" data-magicpath-path="WishlistManager.tsx">{book.author}</p>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-gray-500" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="50" data-magicpath-path="WishlistManager.tsx">
                      {book.rating && <div className="flex items-center" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="51" data-magicpath-path="WishlistManager.tsx">
                          <Star className="w-3 h-3 text-[#F4E4B8] fill-current mr-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="52" data-magicpath-path="WishlistManager.tsx" />
                          <span data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="rating:unknown" data-magicpath-id="53" data-magicpath-path="WishlistManager.tsx">{book.rating}</span>
                        </div>}
                      {book.publishedYear && <div className="flex items-center" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="54" data-magicpath-path="WishlistManager.tsx">
                          <Calendar className="w-3 h-3 mr-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="55" data-magicpath-path="WishlistManager.tsx" />
                          <span data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="publishedYear:unknown" data-magicpath-id="56" data-magicpath-path="WishlistManager.tsx">{book.publishedYear}</span>
                        </div>}
                      {book.pages && <div className="flex items-center" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="57" data-magicpath-path="WishlistManager.tsx">
                          <BookOpen className="w-3 h-3 mr-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="58" data-magicpath-path="WishlistManager.tsx" />
                          <span data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="pages:unknown" data-magicpath-id="59" data-magicpath-path="WishlistManager.tsx">{book.pages}p</span>
                        </div>}
                    </div>

                    <p className="text-gray-700 text-xs line-clamp-2 leading-relaxed" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="description:unknown" data-magicpath-id="60" data-magicpath-path="WishlistManager.tsx">
                      {book.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="61" data-magicpath-path="WishlistManager.tsx">
                      {book.tags.slice(0, 3).map((tag, idx) => <span key={idx} className="px-2 py-0.5 text-xs bg-[#B5D4C8]/20 text-[#B5D4C8] rounded-full border border-[#B5D4C8]/30" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="62" data-magicpath-path="WishlistManager.tsx">
                          {tag}
                        </span>)}
                    </div>

                    {/* Notes */}
                    {book.notes && <p className="text-xs text-gray-500 italic" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="notes:unknown" data-magicpath-id="63" data-magicpath-path="WishlistManager.tsx">
                        "{book.notes}"
                      </p>}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="64" data-magicpath-path="WishlistManager.tsx">
                      <p className="text-xs text-gray-400" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="65" data-magicpath-path="WishlistManager.tsx">
                        {book.addedAt.toLocaleDateString('ko-KR')} 추가
                      </p>
                      <div className="flex items-center space-x-2" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="66" data-magicpath-path="WishlistManager.tsx">
                        {onBookSelect && <button onClick={() => onBookSelect(book)} className="px-3 py-1 text-xs bg-[#A8B5E8] text-white rounded-lg hover:bg-[#8BB5E8] transition-colors" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="67" data-magicpath-path="WishlistManager.tsx">
                            읽기 시작
                          </button>}
                        {!isSelectionMode && <button onClick={() => removeFromWishlist(book.id)} className="p-1 text-red-400 hover:text-red-500 transition-colors" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="68" data-magicpath-path="WishlistManager.tsx">
                            <Heart className="w-4 h-4 fill-current" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="69" data-magicpath-path="WishlistManager.tsx" />
                          </button>}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>)}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredAndSortedBooks.length === 0 && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} className="text-center py-16" data-magicpath-id="70" data-magicpath-path="WishlistManager.tsx">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" data-magicpath-id="71" data-magicpath-path="WishlistManager.tsx" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2" data-magicpath-id="72" data-magicpath-path="WishlistManager.tsx">
              {searchQuery || filterType !== 'all' ? '검색 결과가 없습니다' : '찜한 책이 없습니다'}
            </h3>
            <p className="text-gray-600 text-sm" data-magicpath-id="73" data-magicpath-path="WishlistManager.tsx">
              {searchQuery || filterType !== 'all' ? '다른 조건으로 검색해보세요' : '마음에 드는 책을 찜해보세요'}
            </p>
          </motion.div>}

        {/* Stats */}
        {wishlistBooks.length > 0 && <div className="mt-8 bg-gradient-to-r from-[#A8B5E8]/10 to-[#B5D4C8]/10 rounded-2xl p-6 border border-gray-100" data-magicpath-id="74" data-magicpath-path="WishlistManager.tsx">
            <h3 className="text-lg font-semibold text-gray-800 mb-4" data-magicpath-id="75" data-magicpath-path="WishlistManager.tsx">찜 통계</h3>
            <div className="grid grid-cols-3 gap-4" data-magicpath-id="76" data-magicpath-path="WishlistManager.tsx">
              <div className="text-center" data-magicpath-id="77" data-magicpath-path="WishlistManager.tsx">
                <div className="text-2xl font-bold text-[#A8B5E8] mb-1" data-magicpath-id="78" data-magicpath-path="WishlistManager.tsx">
                  {wishlistBooks.filter(book => book.priority === 'high').length}
                </div>
                <div className="text-gray-600 text-xs" data-magicpath-id="79" data-magicpath-path="WishlistManager.tsx">높은 우선순위</div>
              </div>
              <div className="text-center" data-magicpath-id="80" data-magicpath-path="WishlistManager.tsx">
                <div className="text-2xl font-bold text-[#B5D4C8] mb-1" data-magicpath-id="81" data-magicpath-path="WishlistManager.tsx">
                  {wishlistBooks.filter(book => book.priority === 'medium').length}
                </div>
                <div className="text-gray-600 text-xs" data-magicpath-id="82" data-magicpath-path="WishlistManager.tsx">보통 우선순위</div>
              </div>
              <div className="text-center" data-magicpath-id="83" data-magicpath-path="WishlistManager.tsx">
                <div className="text-2xl font-bold text-[#F4E4B8] mb-1" data-magicpath-id="84" data-magicpath-path="WishlistManager.tsx">
                  {wishlistBooks.filter(book => book.priority === 'low').length}
                </div>
                <div className="text-gray-600 text-xs" data-magicpath-id="85" data-magicpath-path="WishlistManager.tsx">낮은 우선순위</div>
              </div>
            </div>
          </div>}
      </div>
    </motion.div>;
};
export default WishlistManager;