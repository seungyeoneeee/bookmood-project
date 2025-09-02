import { supabase } from '../lib/supabase';
import { LibraryItem, CreateLibraryItemInput, UpdateLibraryItemInput, ShelfStatus } from '../types/database';

// 사용자의 도서관 목록 조회
export async function getLibraryItems(userId?: string, shelfStatus?: ShelfStatus) {
  try {
    let query = supabase
      .from('library_items')
      .select(`
        *,
        book:book_external!library_items_isbn13_fkey(*)
      `)
      .order('updated_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (shelfStatus) {
      query = query.eq('shelf_status', shelfStatus);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching library items:', error);
    return { data: null, error };
  }
}

// 특정 책이 사용자 도서관에 있는지 확인
export async function getLibraryItemByIsbn(isbn13: string, userId?: string) {
  try {
    let query = supabase
      .from('library_items')
      .select(`
        *,
        book:book_external!library_items_isbn13_fkey(*)
      `)
      .eq('isbn13', isbn13);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching library item:', error);
    return { data: null, error };
  }
}

// 도서관에 책 추가
export async function addToLibrary(input: CreateLibraryItemInput) {
  try {
    console.log('💾 addToLibrary 실행 중:', input);
    
    // 현재 사용자 ID 가져오기
    const userId = await getCurrentUserId();
    console.log('👤 사용자 ID:', userId);
    
    if (!userId) {
      throw new Error('사용자 인증이 필요합니다');
    }

    const insertData = {
      user_id: userId,
      isbn13: input.isbn13,
      is_wishlist: input.is_wishlist, // 🆕 위시리스트 여부
      shelf_status: input.is_wishlist ? null : input.shelf_status, // 위시리스트면 null
      progress: input.is_wishlist ? 0 : (input.progress || 0), // 위시리스트면 0
      started_at: input.started_at,
      note: input.note,
    };

    console.log('📝 삽입할 데이터:', insertData);
    
    const { data, error } = await supabase
      .from('library_items')
      .insert(insertData)
      .select(`
        *,
        book:book_external!library_items_isbn13_fkey(*)
      `)
      .single();

    if (error) {
      console.error('❌ Supabase 삽입 실패:', error);
      throw error;
    }

    console.log('✅ Supabase 삽입 성공:', data);
    return { data, error: null };
  } catch (error) {
    console.error('❌ addToLibrary 오류:', error);
    return { data: null, error };
  }
}

// 도서관 아이템 추가 또는 업데이트 (Upsert)
export async function addLibraryItem(input: CreateLibraryItemInput) {
  try {
    console.log('📝 addLibraryItem 호출됨:', input);
    
    // 현재 사용자 ID 확인
    const userId = await getCurrentUserId();
    console.log('👤 현재 사용자 ID:', userId);
    
    if (!userId) {
      throw new Error('사용자 인증이 필요합니다');
    }

    // 1. 먼저 기존 레코드가 있는지 확인
    console.log('🔍 기존 레코드 확인 중...');
    const { data: existingItem, error: checkError } = await supabase
      .from('library_items')
      .select('id, is_wishlist, shelf_status')
      .eq('isbn13', input.isbn13)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('❌ 기존 레코드 확인 실패:', checkError);
      throw checkError;
    }

    console.log('📄 기존 레코드:', existingItem);

    if (existingItem) {
      // 2. 기존 레코드가 있으면 업데이트
      console.log('🔄 기존 레코드 업데이트 중...');
      // is_wishlist는 업데이트할 수 없음 (CreateLibraryItemInput에만 존재)
      return await updateLibraryItem(existingItem.id, {
        shelf_status: input.shelf_status,
        progress: input.progress,
        started_at: input.started_at,
        finished_at: input.finished_at,
        note: input.note,
      });
    } else {
      // 3. 기존 레코드가 없으면 새로 생성
      console.log('➕ 새 레코드 생성 중...');
      return await addToLibrary(input);
    }
  } catch (error) {
    console.error('❌ addLibraryItem 오류:', error);
    return { data: null, error };
  }
}

// 현재 사용자 ID 가져오기 (내부 함수)
async function getCurrentUserId(): Promise<string> {
  console.log('🔍 현재 사용자 인증 상태 확인 중...');
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  console.log('👤 인증 결과:', {
    user: user ? {
      id: user.id,
      email: user.email,
      created_at: user.created_at
    } : null,
    error: error
  });
  
  if (error) {
    console.error('❌ 인증 확인 중 오류:', error);
    throw new Error(`인증 확인 실패: ${error.message}`);
  }
  
  if (!user) {
    console.error('❌ 사용자가 인증되지 않음');
    throw new Error('User not authenticated');
  }
  
  console.log('✅ 사용자 인증 확인됨:', user.id);
  return user.id;
}

// 도서관 아이템 수정
export async function updateLibraryItem(id: string, input: UpdateLibraryItemInput) {
  try {
    const updateData: Record<string, string | number | boolean> = {
      ...input,
      updated_at: new Date().toISOString(),
    };

    // 진행률이 100%가 되면 완료 날짜 자동 설정
    if (input.progress === 100 && input.shelf_status === 'completed') {
      updateData.finished_at = new Date().toISOString().split('T')[0];
    }

    const { data, error } = await supabase
      .from('library_items')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        book:book_external!library_items_isbn13_fkey(*)
      `)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating library item:', error);
    return { data: null, error };
  }
}

// 도서관에서 책 제거
export async function removeFromLibrary(id: string) {
  try {
    const { error } = await supabase
      .from('library_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error removing from library:', error);
    return { error };
  }
}

// 읽고 있는 책 목록 (reading + paused 포함)
export async function getCurrentlyReading(userId?: string) {
  try {
    let query = supabase
      .from('library_items')
      .select(`
        *,
        book:book_external!library_items_isbn13_fkey(*)
      `)
      .eq('is_wishlist', false) // 🆕 실제 읽고 있는 책만
      .in('shelf_status', ['reading', 'paused']) // 🆕 읽는 중과 잠시 멈춤 모두 포함
      .order('updated_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching currently reading:', error);
    return { data: null, error };
  }
}

// 🆕 완독한 책 목록 조회
export async function getCompletedBooks(userId?: string) {
  try {
    let query = supabase
      .from('library_items')
      .select(`
        *,
        book:book_external!library_items_isbn13_fkey(*)
      `)
      .eq('is_wishlist', false)
      .eq('shelf_status', 'completed')
      .order('finished_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching completed books:', error);
    return { data: null, error };
  }
}

// (중복 제거됨 - 위에 더 자세한 구현이 있음)

// 읽고 싶은 책 목록 (위시리스트)
export async function getWishlist(userId?: string) {
  try {
    let query = supabase
      .from('library_items')
      .select(`
        *,
        book:book_external!library_items_isbn13_fkey(*)
      `)
      .eq('is_wishlist', true) // 🆕 위시리스트 필터
      .order('updated_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return { data: null, error };
  }
}

// 도서관 통계
export async function getLibraryStats(userId?: string) {
  try {
    let query = supabase
      .from('library_items')
      .select('shelf_status');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      reading: data?.filter(item => item.shelf_status === 'reading').length || 0,
      completed: data?.filter(item => item.shelf_status === 'completed').length || 0,
      want_to_read: data?.filter(item => item.shelf_status === 'want_to_read').length || 0,
      paused: data?.filter(item => item.shelf_status === 'paused').length || 0,
      dropped: data?.filter(item => item.shelf_status === 'dropped').length || 0,
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error fetching library stats:', error);
    return { data: null, error };
  }
}
