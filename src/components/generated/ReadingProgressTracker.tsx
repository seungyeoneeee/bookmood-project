"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Edit3, Save, X, Plus, Trash2, Clock, Target, Calendar, Play, Pause } from 'lucide-react';
import * as libraryApi from '../../api/library';
export interface ReadingProgress {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  totalPages: number;
  currentPage: number;
  startDate: Date;
  lastReadDate: Date;
  targetDate?: Date;
  notes: ReadingNote[];
  status: 'reading' | 'paused';
}
export interface ReadingNote {
  id: string;
  page: number;
  content: string;
  createdAt: Date;
}
interface ReadingProgressTrackerProps {
  bookData: {
    id: string;
    title: string;
    author: string;
    cover: string;
    pages: number;
  };
  onBack: () => void;
  onComplete?: (progress: ReadingProgress) => void;
  onProgressUpdate?: (isbn13: string, currentPage: number, totalPages: number, notes: ReadingNote[]) => void;
  user?: { id: string };
}
const ReadingProgressTracker: React.FC<ReadingProgressTrackerProps> = ({
  bookData,
  onBack,
  onComplete,
  onProgressUpdate,
  user
}) => {
  const [progress, setProgress] = useState<ReadingProgress>({
    id: Date.now().toString(),
    bookId: bookData.id,
    bookTitle: bookData.title,
    bookAuthor: bookData.author,
    bookCover: bookData.cover,
    totalPages: bookData.pages,
    currentPage: 0,
    startDate: new Date(),
    lastReadDate: new Date(),
    notes: [],
    status: 'reading'
  });
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [currentPageInput, setCurrentPageInput] = useState('0');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNotePage, setNewNotePage] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  // 기존 읽기 진행 상태 불러오기
  useEffect(() => {
    const loadExistingProgress = async () => {
      try {
        console.log('📖 기존 읽기 진행 상태 불러오는 중...', { bookId: bookData.id, userId: user?.id });
        
        if (!user?.id) {
          console.warn('❌ 사용자 인증 정보 없음');
          setIsLoadingProgress(false);
          return;
        }
        
        const { data: libraryItem } = await libraryApi.getLibraryItemByIsbn(bookData.id, user.id);
        
        if (libraryItem && !libraryItem.is_wishlist) {
          console.log('✅ 기존 진행 상태 발견:', {
            progress: libraryItem.progress,
            note: libraryItem.note?.substring(0, 50)
          });
          
          // 진행률에서 현재 페이지 계산
          const currentPage = Math.round((libraryItem.progress || 0) * bookData.pages / 100);
          
          // 메모 파싱 (저장된 형식: "[페이지수p] 내용")
          const notes = libraryItem.note ? 
            libraryItem.note.split('\n')
              .filter(line => line.trim().length > 0)
              .map((line, index) => {
                const match = line.match(/^\[(\d+)p\]\s*(.+)$/);
                return {
                  id: Date.now().toString() + index,
                  page: match ? parseInt(match[1]) : 1,
                  content: match ? match[2] : line,
                  createdAt: new Date(libraryItem.updated_at || libraryItem.created_at)
                };
              }) : [];
          
          setProgress(prev => ({
            ...prev,
            currentPage,
            startDate: new Date(libraryItem.started_at || libraryItem.created_at),
            lastReadDate: new Date(libraryItem.updated_at || libraryItem.created_at),
            notes,
            status: libraryItem.shelf_status === 'paused' ? 'paused' : 'reading'
          }));
          
          console.log(`📚 진행 상태 복원됨: ${currentPage}/${bookData.pages} (${libraryItem.progress}%) - 메모 ${notes.length}개`);
        } else {
          console.log('📖 새로운 책 읽기 시작');
        }
      } catch (error) {
        console.error('❌ 진행 상태 불러오기 실패:', error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadExistingProgress();
  }, [bookData.id, bookData.pages, user?.id]);

  useEffect(() => {
    setCurrentPageInput(progress.currentPage.toString());
  }, [progress.currentPage]);
  const progressPercentage = Math.round(progress.currentPage / progress.totalPages * 100);
  
  // 읽기 상태 변경 함수
  const toggleReadingStatus = async () => {
    const newStatus = progress.status === 'reading' ? 'paused' : 'reading';
    setProgress(prev => ({
      ...prev,
      status: newStatus,
      lastReadDate: new Date()
    }));
    
    // 상태 변경 시 데이터베이스에 직접 저장
    console.log('📊 읽기 상태 변경:', { from: progress.status, to: newStatus });
    
    if (!user?.id) {
      console.warn('❌ 사용자 인증 정보 없음');
      return;
    }
    
    try {
      // 현재 library item을 가져와서 상태만 업데이트
      const { data: currentItem } = await libraryApi.getLibraryItemByIsbn(bookData.id, user.id);
      
      if (currentItem) {
        const result = await libraryApi.updateLibraryItem(currentItem.id, {
          shelf_status: newStatus,
          progress: progress.currentPage ? Math.round((progress.currentPage / progress.totalPages) * 100) : currentItem.progress
        });
        
        if (result.error) {
          console.error('❌ 상태 변경 저장 실패:', result.error);
        } else {
          console.log(`✅ 읽기 상태 변경 저장 성공: ${newStatus}`);
        }
      }
    } catch (error) {
      console.error('❌ 상태 변경 처리 실패:', error);
    }
  };
  const updateCurrentPage = () => {
    const page = parseInt(currentPageInput);
    if (page >= 0 && page <= progress.totalPages) {
      const newProgress = {
        ...progress,
        currentPage: page,
        lastReadDate: new Date()
      };
      setProgress(newProgress);
      
      // 실시간으로 진행 상태를 데이터베이스에 저장
      console.log('🔄 페이지 업데이트 중:', { page, totalPages: progress.totalPages, notesCount: progress.notes.length });
      if (onProgressUpdate) {
        onProgressUpdate(bookData.id, page, progress.totalPages, progress.notes);
      } else {
        console.warn('❌ onProgressUpdate 콜백이 없음');
      }
    }
  };
  const addNote = () => {
    if (!newNoteContent.trim() || !newNotePage) return;
    const page = parseInt(newNotePage);
    if (page < 0 || page > progress.totalPages) return;
    const newNote: ReadingNote = {
      id: Date.now().toString(),
      page,
      content: newNoteContent.trim(),
      createdAt: new Date()
    };
    const updatedNotes = [...progress.notes, newNote].sort((a, b) => a.page - b.page);
    setProgress(prev => ({
      ...prev,
      notes: updatedNotes
    }));
    
    // 메모 추가 시에도 데이터베이스에 저장
    console.log('📝 메모 추가 중:', { currentPage: progress.currentPage, totalPages: progress.totalPages, notesCount: updatedNotes.length });
    if (onProgressUpdate) {
      onProgressUpdate(bookData.id, progress.currentPage, progress.totalPages, updatedNotes);
    } else {
      console.warn('❌ onProgressUpdate 콜백이 없음');
    }
    
    setNewNoteContent('');
    setNewNotePage('');
    setIsAddingNote(false);
  };
  const updateNote = (noteId: string) => {
    if (!editingNoteContent.trim()) return;
    const updatedNotes = progress.notes.map(note => note.id === noteId ? {
      ...note,
      content: editingNoteContent.trim()
    } : note);
    
    setProgress(prev => ({
      ...prev,
      notes: updatedNotes
    }));
    
    // 메모 수정 시에도 데이터베이스에 저장
    console.log('✏️ 메모 수정 중:', { noteId, currentPage: progress.currentPage, totalPages: progress.totalPages, notesCount: updatedNotes.length });
    if (onProgressUpdate) {
      onProgressUpdate(bookData.id, progress.currentPage, progress.totalPages, updatedNotes);
    } else {
      console.warn('❌ onProgressUpdate 콜백이 없음');
    }
    
    setEditingNoteId(null);
    setEditingNoteContent('');
  };
  const deleteNote = (noteId: string) => {
    const updatedNotes = progress.notes.filter(note => note.id !== noteId);
    
    setProgress(prev => ({
      ...prev,
      notes: updatedNotes
    }));
    
    // 메모 삭제 시에도 데이터베이스에 저장
    console.log('🗑️ 메모 삭제 중:', { noteId, currentPage: progress.currentPage, totalPages: progress.totalPages, notesCount: updatedNotes.length });
    if (onProgressUpdate) {
      onProgressUpdate(bookData.id, progress.currentPage, progress.totalPages, updatedNotes);
    } else {
      console.warn('❌ onProgressUpdate 콜백이 없음');
    }
  };
  const startEditingNote = (note: ReadingNote) => {
    setEditingNoteId(note.id);
    setEditingNoteContent(note.content);
  };
  const cancelEditingNote = () => {
    setEditingNoteId(null);
    setEditingNoteContent('');
  };
  const getProgressColor = () => {
    if (progressPercentage < 25) return 'from-red-400 to-red-500';
    if (progressPercentage < 50) return 'from-orange-400 to-orange-500';
    if (progressPercentage < 75) return 'from-yellow-400 to-yellow-500';
    if (progressPercentage < 100) return 'from-blue-400 to-blue-500';
    return 'from-green-400 to-green-500';
  };
  const getDaysReading = () => {
    const diffTime = Math.abs(new Date().getTime() - progress.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  const getAveragePagesPerDay = () => {
    const days = getDaysReading();
    return days > 0 ? Math.round(progress.currentPage / days) : 0;
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="min-h-screen">
      {isLoadingProgress ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-[#A8B5E8] border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-600">읽기 진행 상태를 불러오는 중...</span>
        </div>
      ) : (
      <div className="px-4 md:px-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">독서 진행률</h1>
          <div className="w-10" />
        </div>

        {/* Book Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex space-x-4 mb-6">
            <img src={progress.bookCover} alt={progress.bookTitle} className="w-20 h-28 object-cover rounded-xl shadow-lg" />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                {progress.bookTitle}
              </h2>
              <p className="text-gray-600 mb-3">{progress.bookAuthor}</p>
              <div className="text-sm text-gray-500 mb-3">
                <p>총 {progress.totalPages}페이지</p>
                <p>{getDaysReading()}일째 읽는 중</p>
              </div>
              
              {/* 읽기 상태 표시 및 변경 */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleReadingStatus}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    progress.status === 'reading'
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  {progress.status === 'reading' ? (
                    <>
                      <Play className="w-3 h-3" />
                      <span>읽는 중</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>잠시 멈춤</span>
                    </>
                  )}
                </button>
                <span className="text-xs text-gray-400">탭하여 상태 변경</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">진행률</span>
              <span className="text-sm font-bold text-gray-800">{progressPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div className={`h-full bg-gradient-to-r ${getProgressColor()}`} initial={{
              width: 0
            }} animate={{
              width: `${progressPercentage}%`
            }} transition={{
              duration: 0.8,
              ease: "easeOut"
            }} />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>0페이지</span>
              <span>{progress.totalPages}페이지</span>
            </div>
          </div>

          {/* Current Page Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 페이지
              </label>
              <div className="flex space-x-3">
                <input type="number" min="0" max={progress.totalPages} value={currentPageInput} onChange={e => setCurrentPageInput(e.target.value)} className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20" placeholder="페이지 번호" />
                <button onClick={updateCurrentPage} className="px-6 py-3 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-[#A8B5E8]/20 to-[#B5D4C8]/20 rounded-2xl p-4 border border-gray-100">
            <div className="text-center">
              <Clock className="w-5 h-5 text-[#A8B5E8] mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-800">{getDaysReading()}</div>
              <div className="text-xs text-gray-600">읽은 일수</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#B5D4C8]/20 to-[#F4E4B8]/20 rounded-2xl p-4 border border-gray-100">
            <div className="text-center">
              <Target className="w-5 h-5 text-[#B5D4C8] mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-800">{getAveragePagesPerDay()}</div>
              <div className="text-xs text-gray-600">일평균 페이지</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#F4E4B8]/20 to-[#A8B5E8]/20 rounded-2xl p-4 border border-gray-100">
            <div className="text-center">
              <BookOpen className="w-5 h-5 text-[#F4E4B8] mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-800">{progress.currentPage}</div>
              <div className="text-xs text-gray-600">현재 페이지</div>
            </div>
          </div>
        </div>

        {/* Reading Notes */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Edit3 className="w-5 h-5 mr-2" />
              독서 메모
            </h3>
            <button onClick={() => setIsAddingNote(true)} className="w-8 h-8 bg-[#A8B5E8] text-white rounded-lg flex items-center justify-center hover:bg-[#8BB5E8] transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Note Form */}
          <AnimatePresence>
            {isAddingNote && <motion.div initial={{
            opacity: 0,
            height: 0
          }} animate={{
            opacity: 1,
            height: 'auto'
          }} exit={{
            opacity: 0,
            height: 0
          }} className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      페이지 번호
                    </label>
                    <input type="number" min="0" max={progress.totalPages} value={newNotePage} onChange={e => setNewNotePage(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-[#A8B5E8]" placeholder="페이지 번호" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      메모 내용
                    </label>
                    <textarea value={newNoteContent} onChange={e => setNewNoteContent(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-[#A8B5E8] resize-none" rows={3} placeholder="이 부분에서 느낀 점이나 중요한 내용을 메모하세요..." />
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={addNote} disabled={!newNoteContent.trim() || !newNotePage} className="flex-1 py-2 bg-[#A8B5E8] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                      메모 추가
                    </button>
                    <button onClick={() => {
                  setIsAddingNote(false);
                  setNewNoteContent('');
                  setNewNotePage('');
                }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium text-sm">
                      취소
                    </button>
                  </div>
                </div>
              </motion.div>}
          </AnimatePresence>

          {/* Notes List */}
          <div className="space-y-3">
            {progress.notes.length === 0 ? <div className="text-center py-8">
                <Edit3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">아직 메모가 없습니다</p>
                <p className="text-gray-500 text-xs">읽으면서 중요한 내용을 메모해보세요</p>
              </div> : progress.notes.map((note, index) => <motion.div key={note.id} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-[#A8B5E8]/20 text-[#A8B5E8] text-xs font-medium rounded-full">
                        {note.page}p
                      </span>
                      <span className="text-xs text-gray-500">
                        {note.createdAt.toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <button onClick={() => startEditingNote(note)} className="p-1 text-gray-400 hover:text-[#A8B5E8] transition-colors">
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button onClick={() => deleteNote(note.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {editingNoteId === note.id ? <div className="space-y-2">
                      <textarea value={editingNoteContent} onChange={e => setEditingNoteContent(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-[#A8B5E8] resize-none text-sm" rows={3} />
                      <div className="flex space-x-2">
                        <button onClick={() => updateNote(note.id)} className="px-3 py-1 bg-[#A8B5E8] text-white rounded-lg text-xs font-medium">
                          저장
                        </button>
                        <button onClick={cancelEditingNote} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium">
                          취소
                        </button>
                      </div>
                    </div> : <p className="text-gray-700 text-sm leading-relaxed">
                      {note.content}
                    </p>}
                </motion.div>)}
          </div>
        </div>

        {/* Complete Reading Button */}
        {progressPercentage === 100 && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mt-6">
            <button onClick={() => onComplete?.(progress)} className="w-full py-4 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>독서 완료하기</span>
            </button>
          </motion.div>}
      </div>
      )}
    </motion.div>
};
export default ReadingProgressTracker;