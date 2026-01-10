
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  BookOpen, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock4,
  Trash2,
  Edit2,
  Wallet,
  X,
  RefreshCcw,
  ChevronRight
} from 'lucide-react';
import { Lesson, Student, ThemeColor } from '../types';
import { THEMES } from '../constants';

interface LessonsProps {
  lessons: Lesson[];
  students: Student[];
  onAddLesson: (lesson: Lesson | Lesson[]) => void;
  onUpdateLesson: (id: string, updates: Partial<Lesson>) => void;
  onDeleteLesson: (id: string) => void;
  theme: ThemeColor;
}

const Lessons: React.FC<LessonsProps> = ({ lessons, students, onAddLesson, onUpdateLesson, onDeleteLesson, theme: currentTheme }) => {
  const theme = THEMES.find(t => t.id === currentTheme) || THEMES[0];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isRecurring, setIsRecurring] = useState(false);
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  });

  const [lessonFormData, setLessonFormData] = useState<{
    studentId: string;
    date: string;
    time: string;
    duration: number;
    topic: string;
    price: number;
    status: 'planned' | 'completed' | 'cancelled';
  }>({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    time: '16:00',
    duration: 60,
    topic: '',
    price: 60,
    status: 'planned'
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sortowanie: najbliższe daty pierwsze
  const sortedLessons = [...lessons].sort((a, b) => {
    const dateTimeA = new Date(`${a.date} ${a.time}`).getTime();
    const dateTimeB = new Date(`${b.date} ${b.time}`).getTime();
    return dateTimeA - dateTimeB;
  });

  const filteredLessons = sortedLessons.filter(l => {
    const student = students.find(s => s.id === l.studentId);
    const matchesSearch = 
      (student?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       (l.topic?.toLowerCase() || '').includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || l.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Grupowanie lekcji po dacie
  const groupedLessons = filteredLessons.reduce((acc, lesson) => {
    if (!acc[lesson.date]) acc[lesson.date] = [];
    acc[lesson.date].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const handleOpenAddModal = () => {
    setEditingLessonId(null);
    setIsRecurring(false);
    setLessonFormData({
      studentId: '',
      date: new Date().toISOString().split('T')[0],
      time: '16:00',
      duration: 60,
      topic: '',
      price: 60,
      status: 'planned'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setIsRecurring(false);
    setLessonFormData({
      studentId: lesson.studentId,
      date: lesson.date,
      time: lesson.time,
      duration: lesson.duration,
      topic: lesson.topic || '',
      price: lesson.price || 60,
      status: lesson.status
    });
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonFormData.studentId) return;
    
    if (editingLessonId) {
      onUpdateLesson(editingLessonId, {
        ...lessonFormData,
        topic: lessonFormData.topic || undefined
      });
    } else {
      if (isRecurring) {
        const lessonsToAdd: Lesson[] = [];
        const start = new Date(lessonFormData.date);
        const end = new Date(endDate);
        const groupId = Math.random().toString(36).substr(2, 9);
        let current = new Date(start);
        while (current <= end) {
          lessonsToAdd.push({
            ...lessonFormData,
            id: Math.random().toString(36).substr(2, 9),
            date: current.toISOString().split('T')[0],
            topic: lessonFormData.topic || undefined,
            groupId: groupId
          });
          current.setDate(current.getDate() + 7);
        }
        onAddLesson(lessonsToAdd);
      } else {
        onAddLesson({
          ...lessonFormData,
          id: Math.random().toString(36).substr(2, 9),
          topic: lessonFormData.topic || undefined
        });
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteLesson(id);
    setOpenMenuId(null);
  };

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return 'Dzisiaj';
    
    return d.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'cancelled': return <XCircle size={14} className="text-rose-500" />;
      default: return <Clock4 size={14} className="text-amber-500" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-24 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Harmonogram</h2>
          <p className="text-zinc-400 text-sm">Przeglądaj plan zajęć dzień po dniu.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 ${theme.bgClass} hover:opacity-90 px-5 py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-95 text-white text-sm`}
        >
          <Plus size={18} /> Nowa lekcja
        </button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-3 px-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Szukaj lekcji..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-xs md:text-sm"
        >
          <option value="all">Wszystkie statusy</option>
          <option value="planned">Zaplanowane</option>
          <option value="completed">Zakończone</option>
          <option value="cancelled">Anulowane</option>
        </select>
      </div>

      {/* Grouped Lessons List */}
      <div className="space-y-8 px-2">
        {Object.keys(groupedLessons).length > 0 ? (
          Object.keys(groupedLessons).map((date) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 shrink-0">
                  {formatDateLabel(date)}
                </h3>
                <div className="h-px bg-zinc-800 w-full opacity-50"></div>
              </div>
              <div className="space-y-2">
                {groupedLessons[date].map((lesson) => {
                  const student = students.find(s => s.id === lesson.studentId);
                  const isPlanned = lesson.status === 'planned';
                  
                  return (
                    <div 
                      key={lesson.id} 
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 md:p-4 hover:border-zinc-700 transition-all group flex items-center gap-3 md:gap-4"
                    >
                      {/* Time & Duration */}
                      <div className="flex flex-col items-center justify-center min-w-[50px] md:min-w-[60px] py-1 border-r border-zinc-800 pr-3 md:pr-4">
                        <span className="text-sm font-bold text-zinc-200">{lesson.time}</span>
                        <span className="text-[10px] text-zinc-500">{lesson.duration}m</span>
                      </div>

                      {/* Student & Topic */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-sm md:text-base truncate">{student?.name || 'Nieznany'}</span>
                          {/* Wrap icon in span to provide tooltip via 'title' attribute since Lucide icons don't support it directly */}
                          {lesson.groupId && (
                            <span title="Cykliczna">
                              <RefreshCcw size={10} className="text-zinc-600" />
                            </span>
                          )}
                        </div>
                        {lesson.topic ? (
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 italic truncate">
                            <BookOpen size={12} className="shrink-0" />
                            <span>{lesson.topic}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-600">Brak tematu</span>
                        )}
                      </div>

                      {/* Price & Status Badge */}
                      <div className="hidden sm:flex flex-col items-end gap-1 px-2">
                        <span className="text-xs font-bold text-emerald-500">{lesson.price} zł</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusStyles(lesson.status)}`}>
                          {lesson.status === 'planned' ? 'PLAN' : lesson.status === 'completed' ? 'OK' : 'X'}
                        </span>
                      </div>

                      {/* Mobile Price */}
                      <div className="sm:hidden text-xs font-bold text-emerald-500">
                        {lesson.price}zł
                      </div>

                      {/* Actions Menu */}
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === lesson.id ? null : lesson.id);
                          }}
                          className={`p-2 hover:bg-zinc-800 text-zinc-500 rounded-lg transition-colors ${openMenuId === lesson.id ? 'bg-zinc-800 text-zinc-100' : ''}`}
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {openMenuId === lesson.id && (
                          <div 
                            ref={menuRef} 
                            className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right"
                          >
                            {isPlanned && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); onUpdateLesson(lesson.id, { status: 'completed' }); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-emerald-500 hover:bg-zinc-800 transition-colors font-medium"
                              >
                                <CheckCircle2 size={16} /> Oznacz: Wykonana
                              </button>
                            )}
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleOpenEditModal(lesson); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
                            >
                              <Edit2 size={16} className={theme.colorClass} /> Edytuj szczegóły
                            </button>
                            {isPlanned && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); onUpdateLesson(lesson.id, { status: 'cancelled' }); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-rose-400 hover:bg-zinc-800 transition-colors"
                              >
                                <XCircle size={16} /> Odwołaj zajęcia
                              </button>
                            )}
                            <div className="h-px bg-zinc-800 my-1"></div>
                            <button 
                              onClick={(e) => handleDelete(lesson.id, e)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-rose-500 hover:bg-rose-500/10 transition-colors font-medium"
                            >
                              <Trash2 size={16} /> Usuń całkowicie
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
            <Calendar size={48} className="text-zinc-800 mb-4" />
            <h3 className="text-lg font-bold text-zinc-400">Pusto tutaj</h3>
            <p className="text-zinc-500 text-sm max-w-[200px]">Nie znaleziono żadnych lekcji w tym widoku.</p>
          </div>
        )}
      </div>

      {/* Modal - optimized for mobile scrolling */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-4 md:py-10">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-h-[90vh] overflow-y-auto max-w-md p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 scrollbar-hide">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-zinc-900 py-1 z-10">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Calendar className={theme.colorClass} /> {editingLessonId ? 'Edytuj' : 'Planuj'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Wybierz Ucznia</label>
                <select 
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
                  value={lessonFormData.studentId}
                  onChange={e => setLessonFormData({...lessonFormData, studentId: e.target.value})}
                >
                  <option value="">-- wybierz --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              {!editingLessonId && (
                <div className="flex items-center gap-3 p-4 bg-zinc-950 rounded-2xl border border-zinc-800 group cursor-pointer" onClick={() => setIsRecurring(!isRecurring)}>
                  <input 
                    type="checkbox" 
                    id="isRecurring"
                    className="w-4 h-4 rounded accent-violet-500 cursor-pointer"
                    checked={isRecurring}
                    onChange={e => setIsRecurring(e.target.checked)}
                  />
                  <div>
                    <label htmlFor="isRecurring" className="text-sm font-semibold text-zinc-300 cursor-pointer">Lekcja cykliczna</label>
                    <p className="text-[10px] text-zinc-500">Powtarzaj automatycznie co tydzień</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">{isRecurring ? 'Start' : 'Data'}</label>
                  <input required type="date" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none text-sm" value={lessonFormData.date} onChange={e => setLessonFormData({...lessonFormData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Godzina</label>
                  <input required type="time" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none text-sm" value={lessonFormData.time} onChange={e => setLessonFormData({...lessonFormData, time: e.target.value})} />
                </div>
              </div>

              {isRecurring && !editingLessonId && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Koniec cyklu (data)</label>
                  <input required type="date" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none text-sm border-violet-500/20" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Cena (zł)</label>
                  <input required type="number" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none text-sm" value={lessonFormData.price} onChange={e => setLessonFormData({...lessonFormData, price: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Czas (min)</label>
                  <input required type="number" step="15" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none text-sm" value={lessonFormData.duration} onChange={e => setLessonFormData({...lessonFormData, duration: parseInt(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Temat (opcjonalnie)</label>
                <input type="text" placeholder="Np. Powtórka z algebry" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none text-sm" value={lessonFormData.topic} onChange={e => setLessonFormData({...lessonFormData, topic: e.target.value})} />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-zinc-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:flex-1 px-6 py-3 rounded-xl border border-zinc-800 font-semibold text-sm hover:bg-zinc-800 transition-colors">Anuluj</button>
                <button type="submit" disabled={students.length === 0} className={`w-full sm:flex-1 px-6 py-3 rounded-xl ${theme.bgClass} font-semibold text-white shadow-lg text-sm disabled:opacity-50 active:scale-95 transition-all`}>
                  {editingLessonId ? 'Zapisz zmiany' : (isRecurring ? 'Generuj serię' : 'Zapisz')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lessons;
