import { useState, useEffect, useCallback } from 'react';
import { BookExternal } from '../types/database';
import * as booksApi from '../api/books';

export function useBookSearch() {
  const [books, setBooks] = useState<BookExternal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBooks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setBooks([]);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: searchError } = await booksApi.searchBooks(query);
    
    if (searchError) {
      setError(typeof searchError === 'string' ? searchError : (searchError as Error)?.message || '검색 중 오류가 발생했습니다.');
      setBooks([]);
    } else {
      setBooks(data || []);
    }
    
    setLoading(false);
  }, []);

  const clearSearch = useCallback(() => {
    setBooks([]);
    setError(null);
  }, []);

  return {
    books,
    loading,
    error,
    searchBooks,
    clearSearch,
  };
}

// 스마트 검색 훅 (DB 우선, API 백업 + 자동 캐싱)
export function useRealtimeBookSearch() {
  const [books, setBooks] = useState<BookExternal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalFound, setTotalFound] = useState(0);

  const searchBooks = useCallback(async (query: string, maxResults = 200) => {
    if (!query.trim()) {
      setBooks([]);
      setTotalFound(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ 먼저 데이터베이스에서 검색
      const { data: dbData } = await booksApi.searchBooks(query, maxResults);
      
      if (dbData && dbData.length > 0) {
        console.log(`💾 DB에서 ${dbData.length}개 책 발견 (빠른 로딩)`);
        setBooks(dbData);
        setTotalFound(dbData.length);
        setLoading(false);
        return;
      }

      // 2️⃣ DB에 없으면 알라딘 API 검색 (자동 캐싱됨)
      console.log('🌐 DB에 결과 없음. 알라딘 API로 검색...');
      const { data, error: searchError, totalFound: found } = await booksApi.searchBooksRealtime(query, maxResults);
      
      if (searchError) {
        setError(typeof searchError === 'string' ? searchError : (searchError as Error)?.message || '검색 중 오류가 발생했습니다.');
        setBooks([]);
        setTotalFound(0);
      } else {
        setBooks((data as BookExternal[]) || []);
        setTotalFound(found || 0);
      }
    } catch (error) {
      setError('검색 중 오류가 발생했습니다.');
      setBooks([]);
      setTotalFound(0);
    }
    
    setLoading(false);
  }, []);

  const clearSearch = useCallback(() => {
    setBooks([]);
    setError(null);
    setTotalFound(0);
  }, []);

  return {
    books,
    loading,
    error,
    totalFound,
    searchBooks,
    clearSearch,
  };
}

export function useBook(isbn13?: string) {
  const [book, setBook] = useState<BookExternal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isbn13) return;

    const fetchBook = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await booksApi.getBookByIsbn(isbn13);
      
      if (fetchError) {
        setError((fetchError as Error)?.message || '책 정보를 가져오는 중 오류가 발생했습니다.');
        setBook(null);
      } else {
        setBook(data);
      }
      
      setLoading(false);
    };

    fetchBook();
  }, [isbn13]);

  return {
    book,
    loading,
    error,
  };
}

export function usePopularBooks() {
  const [books, setBooks] = useState<BookExternal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await booksApi.getPopularBooks();
      
      if (fetchError) {
        setError((fetchError as Error)?.message || '인기 도서를 가져오는 중 오류가 발생했습니다.');
        setBooks([]);
      } else {
        setBooks(data || []);
      }
      
      setLoading(false);
    };

    fetchBooks();
  }, []);

  return {
    books,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      // Re-run the fetch
    },
  };
}

export function useRecentBooks() {
  const [books, setBooks] = useState<BookExternal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await booksApi.getRecentBooks();
      
      if (fetchError) {
        setError((fetchError as Error)?.message || '최신 도서를 가져오는 중 오류가 발생했습니다.');
        setBooks([]);
      } else {
        setBooks(data || []);
      }
      
      setLoading(false);
    };

    fetchBooks();
  }, []);

  return {
    books,
    loading,
    error,
  };
}
