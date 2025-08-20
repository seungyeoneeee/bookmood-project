import { useState, useEffect } from 'react';
import { LibraryItem, CreateLibraryItemInput, UpdateLibraryItemInput, ShelfStatus } from '../types/database';
import { useAuth } from '../contexts/AuthContext';
import * as libraryApi from '../api/library';

export function useLibrary() {
  const { user } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLibrary = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await libraryApi.getLibraryItems(user.id);
    
    if (fetchError) {
      setError(fetchError.message || '도서관 정보를 가져오는 중 오류가 발생했습니다.');
      setItems([]);
    } else {
      setItems(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchLibrary();
  }, [user?.id]);

  const addToLibrary = async (input: CreateLibraryItemInput) => {
    if (!user) return { success: false, error: '로그인이 필요합니다.' };

    const { data, error: addError } = await libraryApi.addToLibrary(input);
    
    if (addError) {
      return { success: false, error: addError.message || '도서관에 추가하는 중 오류가 발생했습니다.' };
    }

    if (data) {
      setItems(prev => [data, ...prev]);
    }
    
    return { success: true, data };
  };

  const updateItem = async (id: string, input: UpdateLibraryItemInput) => {
    const { data, error: updateError } = await libraryApi.updateLibraryItem(id, input);
    
    if (updateError) {
      return { success: false, error: updateError.message || '업데이트 중 오류가 발생했습니다.' };
    }

    if (data) {
      setItems(prev => prev.map(item => item.id === id ? data : item));
    }
    
    return { success: true, data };
  };

  const removeFromLibrary = async (id: string) => {
    const { error: removeError } = await libraryApi.removeFromLibrary(id);
    
    if (removeError) {
      return { success: false, error: removeError.message || '삭제 중 오류가 발생했습니다.' };
    }

    setItems(prev => prev.filter(item => item.id !== id));
    return { success: true };
  };

  return {
    items,
    loading,
    error,
    addToLibrary,
    updateItem,
    removeFromLibrary,
    refetch: fetchLibrary,
  };
}

export function useLibraryItem(isbn13?: string) {
  const { user } = useAuth();
  const [item, setItem] = useState<LibraryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isbn13 || !user) return;

    const fetchItem = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await libraryApi.getLibraryItemByIsbn(isbn13, user.id);
      
      if (fetchError) {
        setError(fetchError.message || '도서관 아이템을 가져오는 중 오류가 발생했습니다.');
        setItem(null);
      } else {
        setItem(data);
      }
      
      setLoading(false);
    };

    fetchItem();
  }, [isbn13, user?.id]);

  return {
    item,
    loading,
    error,
  };
}

export function useLibraryByStatus(shelfStatus: ShelfStatus) {
  const { user } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await libraryApi.getLibraryItems(user.id, shelfStatus);
      
      if (fetchError) {
        setError(fetchError.message || '도서 목록을 가져오는 중 오류가 발생했습니다.');
        setItems([]);
      } else {
        setItems(data || []);
      }
      
      setLoading(false);
    };

    fetchItems();
  }, [user?.id, shelfStatus]);

  return {
    items,
    loading,
    error,
  };
}

export function useLibraryStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await libraryApi.getLibraryStats(user.id);
      
      if (fetchError) {
        setError(fetchError.message || '통계를 가져오는 중 오류가 발생했습니다.');
        setStats(null);
      } else {
        setStats(data);
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
