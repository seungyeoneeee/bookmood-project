"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Edit3, Save, X, Plus, Trash2, Clock, Target, Calendar } from 'lucide-react';
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
  mpid?: string;
}
export interface ReadingNote {
  id: string;
  page: number;
  content: string;
  createdAt: Date;
  mpid?: string;
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
  mpid?: string;
}
const ReadingProgressTracker: React.FC<ReadingProgressTrackerProps> = ({
  bookData,
  onBack,
  onComplete
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
    notes: []
  });
  const [currentPageInput, setCurrentPageInput] = useState('0');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNotePage, setNewNotePage] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');
  useEffect(() => {
    setCurrentPageInput(progress.currentPage.toString());
  }, [progress.currentPage]);
  const progressPercentage = Math.round(progress.currentPage / progress.totalPages * 100);
  const updateCurrentPage = () => {
    const page = parseInt(currentPageInput);
    if (page >= 0 && page <= progress.totalPages) {
      setProgress(prev => ({
        ...prev,
        currentPage: page,
        lastReadDate: new Date()
      }));
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
    setProgress(prev => ({
      ...prev,
      notes: [...prev.notes, newNote].sort((a, b) => a.page - b.page)
    }));
    setNewNoteContent('');
    setNewNotePage('');
    setIsAddingNote(false);
  };
  const updateNote = (noteId: string) => {
    if (!editingNoteContent.trim()) return;
    setProgress(prev => ({
      ...prev,
      notes: prev.notes.map(note => note.id === noteId ? {
        ...note,
        content: editingNoteContent.trim()
      } : note)
    }));
    setEditingNoteId(null);
    setEditingNoteContent('');
  };
  const deleteNote = (noteId: string) => {
    setProgress(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== noteId)
    }));
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
  }} className="min-h-screen px-4 py-8" data-magicpath-id="0" data-magicpath-path="ReadingProgressTracker.tsx">
      <div className="max-w-sm mx-auto" data-magicpath-id="1" data-magicpath-path="ReadingProgressTracker.tsx">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-magicpath-id="2" data-magicpath-path="ReadingProgressTracker.tsx">
          <button onClick={onBack} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors" data-magicpath-id="3" data-magicpath-path="ReadingProgressTracker.tsx">
            <ArrowLeft className="w-5 h-5 text-gray-600" data-magicpath-id="4" data-magicpath-path="ReadingProgressTracker.tsx" />
          </button>
          <h1 className="text-xl font-bold text-gray-800" data-magicpath-id="5" data-magicpath-path="ReadingProgressTracker.tsx">독서 진행률</h1>
          <div className="w-10" data-magicpath-id="6" data-magicpath-path="ReadingProgressTracker.tsx" />
        </div>

        {/* Book Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6" data-magicpath-id="7" data-magicpath-path="ReadingProgressTracker.tsx">
          <div className="flex space-x-4 mb-6" data-magicpath-id="8" data-magicpath-path="ReadingProgressTracker.tsx">
            <img src={progress.bookCover} alt={progress.bookTitle} className="w-20 h-28 object-cover rounded-xl shadow-lg" data-magicpath-id="9" data-magicpath-path="ReadingProgressTracker.tsx" />
            <div className="flex-1" data-magicpath-id="10" data-magicpath-path="ReadingProgressTracker.tsx">
              <h2 className="text-lg font-bold text-gray-800 mb-2 leading-tight" data-magicpath-id="11" data-magicpath-path="ReadingProgressTracker.tsx">
                {progress.bookTitle}
              </h2>
              <p className="text-gray-600 mb-3" data-magicpath-id="12" data-magicpath-path="ReadingProgressTracker.tsx">{progress.bookAuthor}</p>
              <div className="text-sm text-gray-500" data-magicpath-id="13" data-magicpath-path="ReadingProgressTracker.tsx">
                <p data-magicpath-id="14" data-magicpath-path="ReadingProgressTracker.tsx">총 {progress.totalPages}페이지</p>
                <p data-magicpath-id="15" data-magicpath-path="ReadingProgressTracker.tsx">{getDaysReading()}일째 읽는 중</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6" data-magicpath-id="16" data-magicpath-path="ReadingProgressTracker.tsx">
            <div className="flex items-center justify-between mb-2" data-magicpath-id="17" data-magicpath-path="ReadingProgressTracker.tsx">
              <span className="text-sm font-medium text-gray-700" data-magicpath-id="18" data-magicpath-path="ReadingProgressTracker.tsx">진행률</span>
              <span className="text-sm font-bold text-gray-800" data-magicpath-id="19" data-magicpath-path="ReadingProgressTracker.tsx">{progressPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden" data-magicpath-id="20" data-magicpath-path="ReadingProgressTracker.tsx">
              <motion.div className={`h-full bg-gradient-to-r ${getProgressColor()}`} initial={{
              width: 0
            }} animate={{
              width: `${progressPercentage}%`
            }} transition={{
              duration: 0.8,
              ease: "easeOut"
            }} data-magicpath-id="21" data-magicpath-path="ReadingProgressTracker.tsx" />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500" data-magicpath-id="22" data-magicpath-path="ReadingProgressTracker.tsx">
              <span data-magicpath-id="23" data-magicpath-path="ReadingProgressTracker.tsx">0페이지</span>
              <span data-magicpath-id="24" data-magicpath-path="ReadingProgressTracker.tsx">{progress.totalPages}페이지</span>
            </div>
          </div>

          {/* Current Page Input */}
          <div className="space-y-4" data-magicpath-id="25" data-magicpath-path="ReadingProgressTracker.tsx">
            <div data-magicpath-id="26" data-magicpath-path="ReadingProgressTracker.tsx">
              <label className="block text-sm font-medium text-gray-700 mb-2" data-magicpath-id="27" data-magicpath-path="ReadingProgressTracker.tsx">
                현재 페이지
              </label>
              <div className="flex space-x-3" data-magicpath-id="28" data-magicpath-path="ReadingProgressTracker.tsx">
                <input type="number" min="0" max={progress.totalPages} value={currentPageInput} onChange={e => setCurrentPageInput(e.target.value)} className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#A8B5E8] focus:ring-2 focus:ring-[#A8B5E8]/20" placeholder="페이지 번호" data-magicpath-id="29" data-magicpath-path="ReadingProgressTracker.tsx" />
                <button onClick={updateCurrentPage} className="px-6 py-3 bg-gradient-to-r from-[#A8B5E8] to-[#8BB5E8] text-white rounded-xl font-medium hover:shadow-lg transition-shadow" data-magicpath-id="30" data-magicpath-path="ReadingProgressTracker.tsx">
                  <Save className="w-4 h-4" data-magicpath-id="31" data-magicpath-path="ReadingProgressTracker.tsx" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6" data-magicpath-id="32" data-magicpath-path="ReadingProgressTracker.tsx">
          <div className="bg-gradient-to-r from-[#A8B5E8]/20 to-[#B5D4C8]/20 rounded-2xl p-4 border border-gray-100" data-magicpath-id="33" data-magicpath-path="ReadingProgressTracker.tsx">
            <div className="text-center" data-magicpath-id="34" data-magicpath-path="ReadingProgressTracker.tsx">
              <Clock className="w-5 h-5 text-[#A8B5E8] mx-auto mb-2" data-magicpath-id="35" data-magicpath-path="ReadingProgressTracker.tsx" />
              <div className="text-lg font-bold text-gray-800" data-magicpath-id="36" data-magicpath-path="ReadingProgressTracker.tsx">{getDaysReading()}</div>
              <div className="text-xs text-gray-600" data-magicpath-id="37" data-magicpath-path="ReadingProgressTracker.tsx">읽은 일수</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#B5D4C8]/20 to-[#F4E4B8]/20 rounded-2xl p-4 border border-gray-100" data-magicpath-id="38" data-magicpath-path="ReadingProgressTracker.tsx">
            <div className="text-center" data-magicpath-id="39" data-magicpath-path="ReadingProgressTracker.tsx">
              <Target className="w-5 h-5 text-[#B5D4C8] mx-auto mb-2" data-magicpath-id="40" data-magicpath-path="ReadingProgressTracker.tsx" />
              <div className="text-lg font-bold text-gray-800" data-magicpath-id="41" data-magicpath-path="ReadingProgressTracker.tsx">{getAveragePagesPerDay()}</div>
              <div className="text-xs text-gray-600" data-magicpath-id="42" data-magicpath-path="ReadingProgressTracker.tsx">일평균 페이지</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#F4E4B8]/20 to-[#A8B5E8]/20 rounded-2xl p-4 border border-gray-100" data-magicpath-id="43" data-magicpath-path="ReadingProgressTracker.tsx">
            <div className="text-center" data-magicpath-id="44" data-magicpath-path="ReadingProgressTracker.tsx">
              <BookOpen className="w-5 h-5 text-[#F4E4B8] mx-auto mb-2" data-magicpath-id="45" data-magicpath-path="ReadingProgressTracker.tsx" />
              <div className="text-lg font-bold text-gray-800" data-magicpath-id="46" data-magicpath-path="ReadingProgressTracker.tsx">{progress.currentPage}</div>
              <div className="text-xs text-gray-600" data-magicpath-id="47" data-magicpath-path="ReadingProgressTracker.tsx">현재 페이지</div>
            </div>
          </div>
        </div>

        {/* Reading Notes */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" data-magicpath-id="48" data-magicpath-path="ReadingProgressTracker.tsx">
          <div className="flex items-center justify-between mb-4" data-magicpath-id="49" data-magicpath-path="ReadingProgressTracker.tsx">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center" data-magicpath-id="50" data-magicpath-path="ReadingProgressTracker.tsx">
              <Edit3 className="w-5 h-5 mr-2" data-magicpath-id="51" data-magicpath-path="ReadingProgressTracker.tsx" />
              독서 메모
            </h3>
            <button onClick={() => setIsAddingNote(true)} className="w-8 h-8 bg-[#A8B5E8] text-white rounded-lg flex items-center justify-center hover:bg-[#8BB5E8] transition-colors" data-magicpath-id="52" data-magicpath-path="ReadingProgressTracker.tsx">
              <Plus className="w-4 h-4" data-magicpath-id="53" data-magicpath-path="ReadingProgressTracker.tsx" />
            </button>
          </div>

          {/* Add Note Form */}
          <AnimatePresence data-magicpath-id="54" data-magicpath-path="ReadingProgressTracker.tsx">
            {isAddingNote && <motion.div initial={{
            opacity: 0,
            height: 0
          }} animate={{
            opacity: 1,
            height: 'auto'
          }} exit={{
            opacity: 0,
            height: 0
          }} className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200" data-magicpath-id="55" data-magicpath-path="ReadingProgressTracker.tsx">
                <div className="space-y-3" data-magicpath-id="56" data-magicpath-path="ReadingProgressTracker.tsx">
                  <div data-magicpath-id="57" data-magicpath-path="ReadingProgressTracker.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-1" data-magicpath-id="58" data-magicpath-path="ReadingProgressTracker.tsx">
                      페이지 번호
                    </label>
                    <input type="number" min="0" max={progress.totalPages} value={newNotePage} onChange={e => setNewNotePage(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-[#A8B5E8]" placeholder="페이지 번호" data-magicpath-id="59" data-magicpath-path="ReadingProgressTracker.tsx" />
                  </div>
                  <div data-magicpath-id="60" data-magicpath-path="ReadingProgressTracker.tsx">
                    <label className="block text-sm font-medium text-gray-700 mb-1" data-magicpath-id="61" data-magicpath-path="ReadingProgressTracker.tsx">
                      메모 내용
                    </label>
                    <textarea value={newNoteContent} onChange={e => setNewNoteContent(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-[#A8B5E8] resize-none" rows={3} placeholder="이 부분에서 느낀 점이나 중요한 내용을 메모하세요..." data-magicpath-id="62" data-magicpath-path="ReadingProgressTracker.tsx" />
                  </div>
                  <div className="flex space-x-2" data-magicpath-id="63" data-magicpath-path="ReadingProgressTracker.tsx">
                    <button onClick={addNote} disabled={!newNoteContent.trim() || !newNotePage} className="flex-1 py-2 bg-[#A8B5E8] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm" data-magicpath-id="64" data-magicpath-path="ReadingProgressTracker.tsx">
                      메모 추가
                    </button>
                    <button onClick={() => {
                  setIsAddingNote(false);
                  setNewNoteContent('');
                  setNewNotePage('');
                }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium text-sm" data-magicpath-id="65" data-magicpath-path="ReadingProgressTracker.tsx">
                      취소
                    </button>
                  </div>
                </div>
              </motion.div>}
          </AnimatePresence>

          {/* Notes List */}
          <div className="space-y-3" data-magicpath-id="66" data-magicpath-path="ReadingProgressTracker.tsx">
            {progress.notes.length === 0 ? <div className="text-center py-8" data-magicpath-id="67" data-magicpath-path="ReadingProgressTracker.tsx">
                <Edit3 className="w-12 h-12 text-gray-300 mx-auto mb-3" data-magicpath-id="68" data-magicpath-path="ReadingProgressTracker.tsx" />
                <p className="text-gray-600 text-sm" data-magicpath-id="69" data-magicpath-path="ReadingProgressTracker.tsx">아직 메모가 없습니다</p>
                <p className="text-gray-500 text-xs" data-magicpath-id="70" data-magicpath-path="ReadingProgressTracker.tsx">읽으면서 중요한 내용을 메모해보세요</p>
              </div> : progress.notes.map((note, index) => <motion.div key={note.id} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }} className="p-4 bg-gray-50 rounded-xl border border-gray-200" data-magicpath-id="71" data-magicpath-path="ReadingProgressTracker.tsx">
                  <div className="flex items-start justify-between mb-2" data-magicpath-id="72" data-magicpath-path="ReadingProgressTracker.tsx">
                    <div className="flex items-center space-x-2" data-magicpath-id="73" data-magicpath-path="ReadingProgressTracker.tsx">
                      <span className="px-2 py-1 bg-[#A8B5E8]/20 text-[#A8B5E8] text-xs font-medium rounded-full" data-magicpath-id="74" data-magicpath-path="ReadingProgressTracker.tsx">
                        {note.page}p
                      </span>
                      <span className="text-xs text-gray-500" data-magicpath-id="75" data-magicpath-path="ReadingProgressTracker.tsx">
                        {note.createdAt.toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <div className="flex space-x-1" data-magicpath-id="76" data-magicpath-path="ReadingProgressTracker.tsx">
                      <button onClick={() => startEditingNote(note)} className="p-1 text-gray-400 hover:text-[#A8B5E8] transition-colors" data-magicpath-id="77" data-magicpath-path="ReadingProgressTracker.tsx">
                        <Edit3 className="w-3 h-3" data-magicpath-id="78" data-magicpath-path="ReadingProgressTracker.tsx" />
                      </button>
                      <button onClick={() => deleteNote(note.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors" data-magicpath-id="79" data-magicpath-path="ReadingProgressTracker.tsx">
                        <Trash2 className="w-3 h-3" data-magicpath-id="80" data-magicpath-path="ReadingProgressTracker.tsx" />
                      </button>
                    </div>
                  </div>
                  
                  {editingNoteId === note.id ? <div className="space-y-2" data-magicpath-id="81" data-magicpath-path="ReadingProgressTracker.tsx">
                      <textarea value={editingNoteContent} onChange={e => setEditingNoteContent(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-[#A8B5E8] resize-none text-sm" rows={3} data-magicpath-id="82" data-magicpath-path="ReadingProgressTracker.tsx" />
                      <div className="flex space-x-2" data-magicpath-id="83" data-magicpath-path="ReadingProgressTracker.tsx">
                        <button onClick={() => updateNote(note.id)} className="px-3 py-1 bg-[#A8B5E8] text-white rounded-lg text-xs font-medium" data-magicpath-id="84" data-magicpath-path="ReadingProgressTracker.tsx">
                          저장
                        </button>
                        <button onClick={cancelEditingNote} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium" data-magicpath-id="85" data-magicpath-path="ReadingProgressTracker.tsx">
                          취소
                        </button>
                      </div>
                    </div> : <p className="text-gray-700 text-sm leading-relaxed" data-magicpath-id="86" data-magicpath-path="ReadingProgressTracker.tsx">
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
      }} className="mt-6" data-magicpath-id="87" data-magicpath-path="ReadingProgressTracker.tsx">
            <button onClick={() => onComplete?.(progress)} className="w-full py-4 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center space-x-2" data-magicpath-id="88" data-magicpath-path="ReadingProgressTracker.tsx">
              <BookOpen className="w-5 h-5" data-magicpath-id="89" data-magicpath-path="ReadingProgressTracker.tsx" />
              <span data-magicpath-id="90" data-magicpath-path="ReadingProgressTracker.tsx">독서 완료하기</span>
            </button>
          </motion.div>}
      </div>
    </motion.div>;
};
export default ReadingProgressTracker;