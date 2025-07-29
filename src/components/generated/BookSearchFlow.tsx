import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Book, Star, User, Calendar, Sparkles, Send, Loader2 } from 'lucide-react';
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
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    description: 'A reclusive Hollywood icon finally tells her story to a young journalist, revealing secrets about her glamorous and scandalous life.',
    publishedYear: '2017',
    rating: 4.5,
    mpid: "c0ee7070-9f81-45e8-b47f-d177da567b0c"
  }, {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
    description: 'A comprehensive guide to building good habits and breaking bad ones through small, incremental changes.',
    publishedYear: '2018',
    rating: 4.7,
    mpid: "141e6736-73c1-47c1-91b4-d21b8fca16f1"
  }, {
    id: '3',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop',
    description: 'A philosophical novel about a library that exists between life and death, where every book represents a different life you could have lived.',
    publishedYear: '2020',
    rating: 4.3,
    mpid: "c3e34a4f-16a3-47a4-917a-01f17ad97de6"
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
  }} className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-primary/5 p-4" data-magicpath-id="0" data-magicpath-path="BookSearchFlow.tsx">
      <div className="max-w-4xl mx-auto pt-8" data-magicpath-id="1" data-magicpath-path="BookSearchFlow.tsx">
        <div className="flex items-center mb-8" data-magicpath-id="2" data-magicpath-path="BookSearchFlow.tsx">
          <button onClick={onBack} className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors" data-magicpath-id="3" data-magicpath-path="BookSearchFlow.tsx">
            <ArrowLeft className="w-5 h-5" data-magicpath-id="4" data-magicpath-path="BookSearchFlow.tsx" />
            <span data-magicpath-id="5" data-magicpath-path="BookSearchFlow.tsx">Back</span>
          </button>
        </div>

        <div className="text-center mb-12" data-magicpath-id="6" data-magicpath-path="BookSearchFlow.tsx">
          <h1 className="text-4xl font-bold text-foreground mb-4" data-magicpath-id="7" data-magicpath-path="BookSearchFlow.tsx">Find Your Next Read</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-magicpath-id="8" data-magicpath-path="BookSearchFlow.tsx">
            Search for books and capture the emotional journey of your reading experience
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12" data-magicpath-id="9" data-magicpath-path="BookSearchFlow.tsx">
          <div className="relative" data-magicpath-id="10" data-magicpath-path="BookSearchFlow.tsx">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSearch()} placeholder="Search by title or author..." className="w-full px-6 py-4 pl-14 text-lg bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" data-magicpath-id="11" data-magicpath-path="BookSearchFlow.tsx" />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" data-magicpath-id="12" data-magicpath-path="BookSearchFlow.tsx" />
            <button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" data-magicpath-id="13" data-magicpath-path="BookSearchFlow.tsx">
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" data-magicpath-id="14" data-magicpath-path="BookSearchFlow.tsx" /> : 'Search'}
            </button>
          </div>
        </div>

        {searchResults.length > 0 && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-magicpath-id="15" data-magicpath-path="BookSearchFlow.tsx">
            {searchResults.map((book, index) => <motion.div key={book.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} onClick={() => handleBookSelect(book)} className="group cursor-pointer" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="16" data-magicpath-path="BookSearchFlow.tsx">
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="17" data-magicpath-path="BookSearchFlow.tsx">
                  <div className="flex space-x-4 mb-4" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="18" data-magicpath-path="BookSearchFlow.tsx">
                    <img src={book.cover} alt={book.title} className="w-20 h-28 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="cover:unknown" data-magicpath-id="19" data-magicpath-path="BookSearchFlow.tsx" />
                    <div className="flex-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="20" data-magicpath-path="BookSearchFlow.tsx">
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="title:unknown" data-magicpath-id="21" data-magicpath-path="BookSearchFlow.tsx">
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2 flex items-center" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="author:unknown" data-magicpath-id="22" data-magicpath-path="BookSearchFlow.tsx">
                        <User className="w-3 h-3 mr-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="23" data-magicpath-path="BookSearchFlow.tsx" />
                        {book.author}
                      </p>
                      {book.publishedYear && <p className="text-xs text-muted-foreground flex items-center mb-2" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="publishedYear:unknown" data-magicpath-id="24" data-magicpath-path="BookSearchFlow.tsx">
                          <Calendar className="w-3 h-3 mr-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="25" data-magicpath-path="BookSearchFlow.tsx" />
                          {book.publishedYear}
                        </p>}
                      {book.rating && <div className="flex items-center" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="26" data-magicpath-path="BookSearchFlow.tsx">
                          <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-id="27" data-magicpath-path="BookSearchFlow.tsx" />
                          <span className="text-xs text-muted-foreground" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="rating:unknown" data-magicpath-id="28" data-magicpath-path="BookSearchFlow.tsx">{book.rating}</span>
                        </div>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3" data-magicpath-uuid={(book as any)["mpid"] ?? "unsafe"} data-magicpath-field="description:unknown" data-magicpath-id="29" data-magicpath-path="BookSearchFlow.tsx">
                    {book.description}
                  </p>
                </div>
              </motion.div>)}
          </motion.div>}

        {searchQuery && searchResults.length === 0 && !isSearching && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} className="text-center py-12" data-magicpath-id="30" data-magicpath-path="BookSearchFlow.tsx">
            <Book className="w-16 h-16 text-muted-foreground mx-auto mb-4" data-magicpath-id="31" data-magicpath-path="BookSearchFlow.tsx" />
            <h3 className="text-xl font-semibold text-foreground mb-2" data-magicpath-id="32" data-magicpath-path="BookSearchFlow.tsx">No books found</h3>
            <p className="text-muted-foreground" data-magicpath-id="33" data-magicpath-path="BookSearchFlow.tsx">Try searching with different keywords</p>
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
  }} className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-accent/5 p-4" data-magicpath-id="34" data-magicpath-path="BookSearchFlow.tsx">
      <div className="max-w-4xl mx-auto pt-8" data-magicpath-id="35" data-magicpath-path="BookSearchFlow.tsx">
        <div className="flex items-center mb-8" data-magicpath-id="36" data-magicpath-path="BookSearchFlow.tsx">
          <button onClick={() => setCurrentStep('search')} className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors" data-magicpath-id="37" data-magicpath-path="BookSearchFlow.tsx">
            <ArrowLeft className="w-5 h-5" data-magicpath-id="38" data-magicpath-path="BookSearchFlow.tsx" />
            <span data-magicpath-id="39" data-magicpath-path="BookSearchFlow.tsx">Back to Search</span>
          </button>
        </div>

        {selectedBook && <div className="bg-card border border-border rounded-xl p-8 mb-8" data-magicpath-id="40" data-magicpath-path="BookSearchFlow.tsx">
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8" data-magicpath-id="41" data-magicpath-path="BookSearchFlow.tsx">
              <div className="flex-shrink-0" data-magicpath-id="42" data-magicpath-path="BookSearchFlow.tsx">
                <img src={selectedBook.cover} alt={selectedBook.title} className="w-48 h-72 object-cover rounded-lg shadow-lg mx-auto md:mx-0" data-magicpath-id="43" data-magicpath-path="BookSearchFlow.tsx" />
              </div>
              <div className="flex-1" data-magicpath-id="44" data-magicpath-path="BookSearchFlow.tsx">
                <h1 className="text-3xl font-bold text-foreground mb-4" data-magicpath-id="45" data-magicpath-path="BookSearchFlow.tsx">{selectedBook.title}</h1>
                <p className="text-xl text-muted-foreground mb-4 flex items-center" data-magicpath-id="46" data-magicpath-path="BookSearchFlow.tsx">
                  <User className="w-5 h-5 mr-2" data-magicpath-id="47" data-magicpath-path="BookSearchFlow.tsx" />
                  {selectedBook.author}
                </p>
                
                <div className="flex items-center space-x-6 mb-6" data-magicpath-id="48" data-magicpath-path="BookSearchFlow.tsx">
                  {selectedBook.publishedYear && <div className="flex items-center text-muted-foreground" data-magicpath-id="49" data-magicpath-path="BookSearchFlow.tsx">
                      <Calendar className="w-4 h-4 mr-2" data-magicpath-id="50" data-magicpath-path="BookSearchFlow.tsx" />
                      <span data-magicpath-id="51" data-magicpath-path="BookSearchFlow.tsx">{selectedBook.publishedYear}</span>
                    </div>}
                  {selectedBook.rating && <div className="flex items-center" data-magicpath-id="52" data-magicpath-path="BookSearchFlow.tsx">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-2" data-magicpath-id="53" data-magicpath-path="BookSearchFlow.tsx" />
                      <span className="text-muted-foreground" data-magicpath-id="54" data-magicpath-path="BookSearchFlow.tsx">{selectedBook.rating}/5</span>
                    </div>}
                </div>

                <p className="text-muted-foreground leading-relaxed mb-8" data-magicpath-id="55" data-magicpath-path="BookSearchFlow.tsx">
                  {selectedBook.description}
                </p>

                <button onClick={handleProceedToReview} className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors" data-magicpath-id="56" data-magicpath-path="BookSearchFlow.tsx">
                  <Sparkles className="w-5 h-5" />
                  <span data-magicpath-id="57" data-magicpath-path="BookSearchFlow.tsx">Write Your Review</span>
                </button>
              </div>
            </div>
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
  }} className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-secondary/5 p-4" data-magicpath-id="58" data-magicpath-path="BookSearchFlow.tsx">
      <div className="max-w-3xl mx-auto pt-8" data-magicpath-id="59" data-magicpath-path="BookSearchFlow.tsx">
        <div className="flex items-center mb-8" data-magicpath-id="60" data-magicpath-path="BookSearchFlow.tsx">
          <button onClick={() => setCurrentStep('book-detail')} className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors" data-magicpath-id="61" data-magicpath-path="BookSearchFlow.tsx">
            <ArrowLeft className="w-5 h-5" data-magicpath-id="62" data-magicpath-path="BookSearchFlow.tsx" />
            <span data-magicpath-id="63" data-magicpath-path="BookSearchFlow.tsx">Back to Book</span>
          </button>
        </div>

        <div className="text-center mb-8" data-magicpath-id="64" data-magicpath-path="BookSearchFlow.tsx">
          <h1 className="text-3xl font-bold text-foreground mb-4" data-magicpath-id="65" data-magicpath-path="BookSearchFlow.tsx">Share Your Reading Experience</h1>
          <p className="text-lg text-muted-foreground" data-magicpath-id="66" data-magicpath-path="BookSearchFlow.tsx">
            Tell us about your emotional journey with this book
          </p>
        </div>

        {selectedBook && <div className="bg-card border border-border rounded-xl p-6 mb-8" data-magicpath-id="67" data-magicpath-path="BookSearchFlow.tsx">
            <div className="flex items-center space-x-4" data-magicpath-id="68" data-magicpath-path="BookSearchFlow.tsx">
              <img src={selectedBook.cover} alt={selectedBook.title} className="w-16 h-24 object-cover rounded-lg" data-magicpath-id="69" data-magicpath-path="BookSearchFlow.tsx" />
              <div data-magicpath-id="70" data-magicpath-path="BookSearchFlow.tsx">
                <h3 className="font-semibold text-foreground" data-magicpath-id="71" data-magicpath-path="BookSearchFlow.tsx">{selectedBook.title}</h3>
                <p className="text-muted-foreground" data-magicpath-id="72" data-magicpath-path="BookSearchFlow.tsx">{selectedBook.author}</p>
              </div>
            </div>
          </div>}

        <div className="bg-card border border-border rounded-xl p-8" data-magicpath-id="73" data-magicpath-path="BookSearchFlow.tsx">
          <label className="block text-sm font-medium text-foreground mb-4" data-magicpath-id="74" data-magicpath-path="BookSearchFlow.tsx">
            Your Review & Emotional Response
          </label>
          <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="How did this book make you feel? What emotions did it evoke? Share your thoughts and feelings about the story, characters, or themes..." className="w-full h-48 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" data-magicpath-id="75" data-magicpath-path="BookSearchFlow.tsx" />
          
          <div className="flex items-center justify-between mt-6" data-magicpath-id="76" data-magicpath-path="BookSearchFlow.tsx">
            <p className="text-sm text-muted-foreground" data-magicpath-id="77" data-magicpath-path="BookSearchFlow.tsx">
              Our AI will analyze your review to create a personalized mood card
            </p>
            <button onClick={handleSubmitReview} disabled={!reviewText.trim() || isSubmitting} className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" data-magicpath-id="78" data-magicpath-path="BookSearchFlow.tsx">
              {isSubmitting ? <>
                  <Loader2 className="w-5 h-5 animate-spin" data-magicpath-id="79" data-magicpath-path="BookSearchFlow.tsx" />
                  <span data-magicpath-id="80" data-magicpath-path="BookSearchFlow.tsx">Creating Mood Card...</span>
                </> : <>
                  <Send className="w-5 h-5" data-magicpath-id="81" data-magicpath-path="BookSearchFlow.tsx" />
                  <span data-magicpath-id="82" data-magicpath-path="BookSearchFlow.tsx">Submit Review</span>
                </>}
            </button>
          </div>
        </div>
      </div>
    </motion.div>;
  return <AnimatePresence mode="wait" data-magicpath-id="83" data-magicpath-path="BookSearchFlow.tsx">
      {currentStep === 'search' && renderSearchStep()}
      {currentStep === 'book-detail' && renderBookDetailStep()}
      {currentStep === 'review' && renderReviewStep()}
    </AnimatePresence>;
};
export default BookSearchFlow;