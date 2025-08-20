import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, TrendingUp, Calendar, Tag, BarChart3, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import * as booksApi from '../../api/books';

interface CollectionResult {
  message: string;
  savedCount: number;
  totalFound?: number;
  error?: any;
}

const BookDataManager: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<CollectionResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [booksCount, setBooksCount] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<string>('');

  // 주요 카테고리 목록 (알라딘 기준)
  const categories = [
    { id: 1, name: '소설' },
    { id: 2, name: '시/에세이' },
    { id: 3, name: '예술/대중문화' },
    { id: 4, name: '사회과학' },
    { id: 5, name: '역사와 문화' },
    { id: 6, name: '종교/역학' },
    { id: 7, name: '자연과학' },
    { id: 8, name: '어학/사전' },
    { id: 9, name: '컴퓨터/인터넷' },
    { id: 13, name: '어린이' },
    { id: 74, name: '만화' },
    { id: 50, name: '경제경영' }
  ];

  useEffect(() => {
    fetchBooksCount();
  }, []);

  const fetchBooksCount = async () => {
    const { count } = await booksApi.getBooksCount();
    setBooksCount(count || 0);
  };

  const addResult = (result: CollectionResult) => {
    setResults(prev => [result, ...prev]);
    fetchBooksCount(); // 책 수 업데이트
  };

  const handleSearchAndSave = async () => {
    if (!searchQuery.trim()) return;

    setLoading('search');
    try {
      const result = await booksApi.searchAndSaveBooks(searchQuery, 20);
      addResult(result);
    } catch (error) {
      addResult({
        message: '검색 중 오류가 발생했습니다.',
        savedCount: 0,
        error
      });
    } finally {
      setLoading(null);
    }
  };

  const handleFetchBestSellers = async () => {
    setLoading('bestsellers');
    try {
      const result = await booksApi.fetchAndSaveBestSellers(50);
      addResult(result);
    } catch (error) {
      addResult({
        message: '베스트셀러 수집 중 오류가 발생했습니다.',
        savedCount: 0,
        error
      });
    } finally {
      setLoading(null);
    }
  };

  const handleFetchNewBooks = async () => {
    setLoading('newbooks');
    try {
      const result = await booksApi.fetchAndSaveNewBooks(50);
      addResult(result);
    } catch (error) {
      addResult({
        message: '신간 도서 수집 중 오류가 발생했습니다.',
        savedCount: 0,
        error
      });
    } finally {
      setLoading(null);
    }
  };

  const handleFetchByCategory = async () => {
    if (!categoryId) return;

    const categoryName = categories.find(cat => cat.id.toString() === categoryId)?.name || categoryId;
    setLoading('category');
    try {
      const result = await booksApi.fetchAndSaveBooksbyCategory(parseInt(categoryId), 50);
      addResult({
        ...result,
        message: `${categoryName} - ${result.message}`
      });
    } catch (error) {
      addResult({
        message: `${categoryName} 수집 중 오류가 발생했습니다.`,
        savedCount: 0,
        error
      });
    } finally {
      setLoading(null);
    }
  };

  const handleBulkCollection = async () => {
    setLoading('bulk');
    
    // 베스트셀러부터 시작
    await handleFetchBestSellers();
    await new Promise(resolve => setTimeout(resolve, 2000)); // API 제한 대응

    // 신간 도서
    await handleFetchNewBooks();
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 주요 카테고리별 수집
    for (const category of categories.slice(0, 6)) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      try {
        const result = await booksApi.fetchAndSaveBooksbyCategory(category.id, 30);
        addResult({
          ...result,
          message: `${category.name} - ${result.message}`
        });
      } catch (error) {
        addResult({
          message: `${category.name} 수집 실패`,
          savedCount: 0,
          error
        });
      }
    }

    setLoading(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 도서 데이터 수집 관리</h1>
      
      {/* 현재 상태 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">현재 데이터베이스</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {booksCount.toLocaleString()}권
          </div>
        </div>
      </div>

      {/* 수집 옵션들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* 검색어 수집 */}
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Search className="w-5 h-5 mr-2 text-blue-500" />
            키워드 검색 수집
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="검색할 키워드 입력"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              onKeyPress={(e) => e.key === 'Enter' && handleSearchAndSave()}
            />
            <button
              onClick={handleSearchAndSave}
              disabled={loading === 'search' || !searchQuery.trim()}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
            >
              {loading === 'search' ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              검색하고 저장
            </button>
          </div>
        </div>

        {/* 카테고리별 수집 */}
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Tag className="w-5 h-5 mr-2 text-green-500" />
            카테고리별 수집
          </h3>
          <div className="space-y-3">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-3 border rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
            >
              <option value="">카테고리 선택</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleFetchByCategory}
              disabled={loading === 'category' || !categoryId}
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center"
            >
              {loading === 'category' ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Tag className="w-4 h-4 mr-2" />
              )}
              카테고리 수집
            </button>
          </div>
        </div>

      </div>

      {/* 빠른 수집 버튼들 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={handleFetchBestSellers}
          disabled={loading === 'bestsellers'}
          className="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center"
        >
          {loading === 'bestsellers' ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <TrendingUp className="w-5 h-5 mr-2" />
          )}
          베스트셀러 수집
        </button>

        <button
          onClick={handleFetchNewBooks}
          disabled={loading === 'newbooks'}
          className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center justify-center"
        >
          {loading === 'newbooks' ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Calendar className="w-5 h-5 mr-2" />
          )}
          신간 도서 수집
        </button>

        <button
          onClick={handleBulkCollection}
          disabled={!!loading}
          className="bg-red-500 text-white p-4 rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center justify-center"
        >
          {loading === 'bulk' ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Download className="w-5 h-5 mr-2" />
          )}
          대량 수집 (주의!)
        </button>
      </div>

      {/* 안내 메시지 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-1">알라딘 API 사용 시 주의사항:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>API 호출 제한: 일일 5,000회 (무료 계정 기준)</li>
              <li>대량 수집 시 시간 간격을 두고 요청됩니다</li>
              <li>중복된 ISBN의 경우 자동으로 업데이트됩니다</li>
              <li>CORS 문제로 프록시 서버를 사용합니다</li>
              <li>⚠️ 범위 초과 값들은 자동으로 null 처리됩니다</li>
            </ul>
          </div>
        </div>
      </div>

      {/* smallint 오류 해결 안내 */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
          <div className="text-sm text-red-800">
            <p className="font-semibold mb-2">smallint 범위 오류 해결 방법:</p>
            <p className="mb-2">만약 "value is out of range for type smallint" 오류가 발생하면, Supabase에서 다음 SQL을 실행하세요:</p>
            <div className="bg-gray-800 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
              <div>ALTER TABLE book_external ALTER COLUMN price_standard TYPE integer;</div>
              <div>ALTER TABLE book_external ALTER COLUMN price_sales TYPE integer;</div>
              <div>ALTER TABLE book_external ALTER COLUMN customer_review_rank TYPE integer;</div>
              <div>ALTER TABLE book_external ALTER COLUMN category_id TYPE integer;</div>
            </div>
          </div>
        </div>
      </div>

      {/* 수집 결과 로그 */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">수집 결과 로그</h3>
        {results.length === 0 ? (
          <p className="text-gray-500 text-center py-8">아직 수집 작업이 없습니다.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg border-l-4 ${
                  result.error 
                    ? 'bg-red-50 border-red-500' 
                    : 'bg-green-50 border-green-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    {result.error ? (
                      <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-medium ${result.error ? 'text-red-800' : 'text-green-800'}`}>
                        {result.message}
                      </p>
                      {result.totalFound && (
                        <p className="text-xs text-gray-600 mt-1">
                          발견: {result.totalFound}개 | 저장: {result.savedCount}개
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${result.error ? 'text-red-600' : 'text-green-600'}`}>
                    +{result.savedCount}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDataManager;
