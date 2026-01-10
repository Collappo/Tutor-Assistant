
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
  X
} from 'lucide-react';
import { Lesson, Student, ThemeColor } from '../types';
import { THEMES } from '../constants';

interface LessonsProps {
  lessons: Lesson[];
  students: Student[];
  onAddLesson: (lesson: Lesson) => void;
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const filteredLessons = lessons.filter(l => {
    const student = students.find(s => s.id === l.studentId);
    const matchesSearch = 
      (student?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       l.topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || l.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime());

  const handleOpenAddModal = () => {
    setEditingLessonId(null);
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
    setLessonFormData({
      studentId: lesson.studentId,
      date: lesson.date,
      time: lesson.time,
      duration: lesson.duration,
      topic: lesson.topic,
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
      onUpdateLesson(editingLessonId, lessonFormData);
    } else {
      onAddLesson({
        ...lessonFormData,
        id: Math.random().toString(36).substr(2, 9),
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteLesson(id);
    setOpenMenuId(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'cancelled': return <XCircle size={16} className="text-rose-500" />;
      default: return <Clock4 size={16} className="text-amber-500" />;
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
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Harmonogram</h2>
          <p className="text-zinc-400 text-sm md:text-base">Twoje nadchodzące zajęcia.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 ${theme.bgClass} hover:opacity-90 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-95 text-white`}
        >
          <Plus size={20} /> Nowa lekcja
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="text" 
            placeholder="Szukaj lekcji..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 md:flex-none bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-xs md:text-sm min-w-[120px]"
          >
            <option value="all">Wszystkie</option>
            <option value="planned">Zaplanowane</option>
            <option value="completed">Zakończone</option>
            <option value="cancelled">Anulowane</option>
          </select>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl relative">
        <div className="overflow-x-auto rounded-2xl">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Uczeń</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Data i Czas</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Temat</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Cena</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredLessons.map((lesson) => {
                const student = students.find(s => s.id === lesson.studentId);
                const isPlanned = lesson.status === 'planned';
                
                return (
                  <tr key={lesson.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${theme.bgClass} flex items-center justify-center text-[10px] font-bold text-white`}>
                          {student?.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{student?.name || 'Nieznany'}</p>
                          <p className="text-[10px] text-zinc-500">{student?.subject}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-xs text-zinc-300">
                          <Calendar size={12} className={theme.colorClass} />
                          <span>{lesson.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                          <Clock size={12} />
                          <span>{lesson.time} ({lesson.duration}m)</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs">
                        <BookOpen size={12} className="text-zinc-500 shrink-0" />
                        <span className="truncate max-w-[120px]">{lesson.topic}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <Wallet size={12} className="text-emerald-500" />
                        <span>{lesson.price} zł</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusStyles(lesson.status)}`}>
                        {getStatusIcon(lesson.status)}
                        {lesson.status === 'planned' ? 'Plan' : lesson.status === 'completed' ? 'Koniec' : 'X'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        {isPlanned && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); onUpdateLesson(lesson.id, { status: 'completed' }); }}
                            className="p-1.5 hover:bg-emerald-500/10 text-zinc-500 hover:text-emerald-500 rounded-lg transition-colors"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        <button 
                          onClick={(e) => handleDelete(lesson.id, e)}
                          className="p-1.5 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-500 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === lesson.id ? null : lesson.id);
                            }}
                            className={`p-1.5 hover:bg-zinc-800 text-zinc-500 rounded-lg ${openMenuId === lesson.id ? 'bg-zinc-800 text-zinc-100' : ''}`}
                          >
                            <MoreVertical size={16} />
                          </button>
                          {openMenuId === lesson.id && (
                            <div ref={menuRef} className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden origin-top-right">
                              <button onClick={(e) => { e.stopPropagation(); handleOpenEditModal(lesson); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800">
                                <Edit2 size={14} className={theme.colorClass} /> Edytuj
                              </button>
                              {isPlanned && (
                                <button onClick={(e) => { e.stopPropagation(); onUpdateLesson(lesson.id, { status: 'cancelled' }); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800">
                                  <XCircle size={14} className="text-rose-500" /> Anuluj
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-h-[90vh] overflow-y-auto max-w-md p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Calendar className={theme.colorClass} /> {editingLessonId ? 'Edytuj' : 'Planuj'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Uczeń</label>
                <select 
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
                  value={lessonFormData.studentId}
                  onChange={e => setLessonFormData({...lessonFormData, studentId: e.target.value})}
                >
                  <option value="">Wybierz...</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Data</label>
                  <input required type="date" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none text-sm" value={lessonFormData.date} onChange={e => setLessonFormData({...lessonFormData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Czas</label>
                  <input required type="time" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none text-sm" value={lessonFormData.time} onChange={e => setLessonFormData({...lessonFormData, time: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Cena (zł)</label>
                  <input required type="number" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none text-sm" value={lessonFormData.price} onChange={e => setLessonFormData({...lessonFormData, price: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Czas (min)</label>
                  <input required type="number" step="15" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none text-sm" value={lessonFormData.duration} onChange={e => setLessonFormData({...lessonFormData, duration: parseInt(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Temat</label>
                <input required type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none text-sm" value={lessonFormData.topic} onChange={e => setLessonFormData({...lessonFormData, topic: e.target.value})} />
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:flex-1 px-6 py-3 rounded-xl border border-zinc-800 font-semibold text-sm">Anuluj</button>
                <button type="submit" disabled={students.length === 0} className={`w-full sm:flex-1 px-6 py-3 rounded-xl ${theme.bgClass} font-semibold text-white shadow-lg text-sm disabled:opacity-50`}>{editingLessonId ? 'Zapisz' : 'Planuj'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lessons;
