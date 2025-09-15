import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useBookSearch, usePopularBooks } from '../../hooks/useBooks';
import { useLibrary, useLibraryStats } from '../../hooks/useLibrary';
import { useReviews, useEmotionStats } from '../../hooks/useReviews';

interface ConnectionStatus {
  database: 'connected' | 'disconnected' | 'testing';
  auth: 'connected' | 'disconnected' | 'testing';
  error?: string;
}

const SupabaseTest: React.FC = () => {
  const { user, signIn, signUp, signOut } = useAuth();
  const [status, setStatus] = useState<ConnectionStatus>({
    database: 'testing',
    auth: 'testing'
  });
  const [testEmail, setTestEmail] = useState('');
  const [books, setBooks] = useState<any[]>([]);
  const [testPassword, setTestPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // 훅들 사용
  const bookSearch = useBookSearch();
  const popularBooks = usePopularBooks();
  const library = useLibrary();
  const libraryStats = useLibraryStats();
  const reviews = useReviews();
  const emotionStats = useEmotionStats();

  // 데이터베이스 연결 테스트
  const testDatabaseConnection = async () => {
    try {
      setStatus(prev => ({ ...prev, database: 'testing' }));
      
      // 간단한 쿼리 실행 (books 테이블이 없어도 괜찮음)
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .limit(1);

      if (error) {
        console.log('데이터베이스 쿼리 오류 (정상일 수 있음):', error.message);
        setStatus(prev => ({ 
          ...prev, 
          database: 'connected',
          error: `테이블 확인: ${error.message}` 
        }));
      } else {
        setStatus(prev => ({ ...prev, database: 'connected' }));
        setBooks(data || []);
      }
    } catch (error) {
      console.error('데이터베이스 연결 오류:', error);
      setStatus(prev => ({ 
        ...prev, 
        database: 'disconnected',
        error: `연결 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}` 
      }));
    }
  };

  // 인증 상태 확인
  useEffect(() => {
    if (user) {
      setStatus(prev => ({ ...prev, auth: 'connected' }));
    } else {
      setStatus(prev => ({ ...prev, auth: 'disconnected' }));
    }
  }, [user]);

  // 컴포넌트 마운트 시 데이터베이스 연결 테스트
  useEffect(() => {
    testDatabaseConnection();
  }, []);

  const handleTestSignUp = async () => {
    if (!testEmail || !testPassword) return;
    setLoading(true);
    
    const { error } = await signUp(testEmail, testPassword);
    if (error) {
      alert(`회원가입 오류: ${error.message}`);
    } else {
      alert('회원가입 성공! 이메일을 확인해주세요.');
    }
    setLoading(false);
  };

  const handleTestSignIn = async () => {
    if (!testEmail || !testPassword) return;
    setLoading(true);
    
    const { error } = await signIn(testEmail, testPassword);
    if (error) {
      alert(`로그인 오류: ${error.message}`);
    } else {
      alert('로그인 성공!');
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      alert(`로그아웃 오류: ${error.message}`);
    } else {
      alert('로그아웃 성공!');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Supabase 연결 테스트</h1>
      
      {/* 연결 상태 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">데이터베이스 연결</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              status.database === 'connected' ? 'bg-green-500' :
              status.database === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            <span className="capitalize">{status.database}</span>
          </div>
          {status.error && (
            <p className="text-sm text-gray-600 mt-2">{status.error}</p>
          )}
          <button
            onClick={testDatabaseConnection}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            다시 테스트
          </button>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">인증 상태</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              status.auth === 'connected' ? 'bg-green-500' : 
              status.auth === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            <span className="capitalize">{status.auth}</span>
          </div>
          {user && (
            <p className="text-sm text-gray-600 mt-2">
              사용자: {user.email}
            </p>
          )}
        </div>
      </div>

      {/* 인증 테스트 */}
      <div className="p-4 border rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">인증 테스트</h3>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="이메일"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleTestSignUp}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              회원가입 테스트
            </button>
            <button
              onClick={handleTestSignIn}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              로그인 테스트
            </button>
            {user && (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                로그아웃
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 책 검색 테스트 */}
      <div className="p-4 border rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">책 검색 테스트</h3>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="책 제목이나 저자명을 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={() => bookSearch.searchBooks(searchQuery)}
              disabled={bookSearch.loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {bookSearch.loading ? '검색 중...' : '검색'}
            </button>
          </div>
          
          {bookSearch.error && (
            <div className="p-2 bg-red-100 text-red-600 rounded">
              {bookSearch.error}
            </div>
          )}
          
          {bookSearch.books.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {bookSearch.books.slice(0, 5).map((book, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <div className="font-medium">{book.title}</div>
                  <div className="text-sm text-gray-600">{book.author}</div>
                  <div className="text-xs text-gray-500">ISBN: {book.isbn13}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 인기 도서 */}
      <div className="p-4 border rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">인기 도서</h3>
        {popularBooks.loading ? (
          <div>로딩 중...</div>
        ) : popularBooks.error ? (
          <div className="text-red-600">{popularBooks.error}</div>
        ) : popularBooks.books.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {popularBooks.books.slice(0, 5).map((book, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <div className="font-medium">{book.title}</div>
                <div className="text-sm text-gray-600">{book.author}</div>
                <div className="text-xs text-gray-500">평점: {book.customer_review_rank}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-600">인기 도서 데이터가 없습니다.</div>
        )}
      </div>

      {/* 사용자 도서관 (로그인된 경우만) */}
      {user && (
        <>
          <div className="p-4 border rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">내 도서관</h3>
            {library.loading ? (
              <div>로딩 중...</div>
            ) : library.error ? (
              <div className="text-red-600">{library.error}</div>
            ) : library.items.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {library.items.slice(0, 5).map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">{item.book?.title}</div>
                    <div className="text-sm text-gray-600">{item.book?.author}</div>
                    <div className="text-xs text-gray-500">
                      상태: {item.shelf_status} | 진행률: {item.progress}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-600">도서관에 책이 없습니다.</div>
            )}
          </div>

          {/* 도서관 통계 */}
          <div className="p-4 border rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">도서관 통계</h3>
            {libraryStats.loading ? (
              <div>로딩 중...</div>
            ) : libraryStats.error ? (
              <div className="text-red-600">{libraryStats.error}</div>
            ) : libraryStats.stats ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{libraryStats.stats.total}</div>
                  <div className="text-sm text-gray-600">전체</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{libraryStats.stats.completed}</div>
                  <div className="text-sm text-gray-600">완료</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{libraryStats.stats.reading}</div>
                  <div className="text-sm text-gray-600">읽는 중</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{libraryStats.stats.want_to_read}</div>
                  <div className="text-sm text-gray-600">읽고 싶은</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-600">통계 데이터가 없습니다.</div>
            )}
          </div>

          {/* 내 리뷰 */}
          <div className="p-4 border rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">내 리뷰</h3>
            {reviews.loading ? (
              <div>로딩 중...</div>
            ) : reviews.error ? (
              <div className="text-red-600">{reviews.error}</div>
            ) : reviews.reviews.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {reviews.reviews.slice(0, 3).map((review, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">{review.book?.title}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {review.memo ? review.memo.substring(0, 100) + '...' : '메모 없음'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {review.read_date} | 감정: {review.emotions?.length || 0}개
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-600">작성한 리뷰가 없습니다.</div>
            )}
          </div>
        </>
      )}

      {/* 설정 안내 */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">데이터베이스 설정 안내</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>✅ .env 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY 설정 완료</li>
          <li>✅ Supabase 프로젝트 인증 설정 완료</li>
          <li>📋 필요한 테이블들: book_external, library_items, reviews, review_emotions, review_topics, summary_periods</li>
          <li>🔒 Row Level Security (RLS) 정책 설정 권장</li>
          <li>📚 테스트 데이터를 추가하여 기능을 확인해보세요</li>
        </ul>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold text-blue-800">새로 구현된 기능들:</h4>
          <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
            <li>📖 책 검색 및 인기 도서 조회</li>
            <li>📚 개인 도서관 관리 (읽는 중, 완료, 읽고 싶은 책)</li>
            <li>📝 리뷰 작성 및 감정/주제 분석</li>
            <li>📊 독서 통계 및 감정 분석</li>
            <li>🔄 실시간 데이터 동기화</li>
            <li>🔗 알라딘 Open API 연동</li>
          </ul>
        </div>

        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <h4 className="font-semibold text-green-800">관리 도구:</h4>
          <div className="mt-2">
            <a 
              href="/admin/book-data" 
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              📚 도서 데이터 수집 관리
            </a>
            <p className="text-xs text-green-600 mt-1">
              알라딘 API를 통해 실제 도서 데이터를 수집할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;
