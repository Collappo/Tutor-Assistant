
import React, { useState, useEffect, useRef } from 'react';
// Added X to imports
import { Plus, Search, MoreVertical, UserPlus, Mail, BookOpen, GraduationCap, Edit2, Trash2, X } from 'lucide-react';
import { Student, ThemeColor } from '../types';
import { THEMES } from '../constants';

interface StudentsProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (id: string, updates: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
  theme: ThemeColor;
}

const Students: React.FC<StudentsProps> = ({ students, onAddStudent, onUpdateStudent, onDeleteStudent, theme: currentTheme }) => {
  const theme = THEMES.find(t => t.id === currentTheme) || THEMES[0];
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [studentFormData, setStudentFormData] = useState({
    name: '',
    subject: '',
    contact: '',
    level: 'Liceum'
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

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingStudentId(null);
    setStudentFormData({ name: '', subject: '', contact: '', level: 'Liceum' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudentId(student.id);
    setStudentFormData({
      name: student.name,
      subject: student.subject,
      contact: student.contact,
      level: student.level
    });
    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudentId) {
      onUpdateStudent(editingStudentId, studentFormData);
    } else {
      onAddStudent({
        ...studentFormData,
        id: Math.random().toString(36).substr(2, 9),
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteStudent(id);
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Twoi Uczniowie</h2>
          <p className="text-zinc-400 text-sm md:text-base">Zarządzaj listą swoich podopiecznych.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 ${theme.bgClass} hover:opacity-90 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-95 text-white`}
        >
          <Plus size={20} /> Dodaj ucznia
        </button>
      </div>

      <div className="relative flex items-center">
        <Search className="absolute translate-x-1/2 text-zinc-500" size={20} />
        <input
          type="text"
          placeholder="Szukaj ucznia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-zinc-900   rounded-2xl p-5 md:p-6 hover:border-zinc-700 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-20 h-20 ${theme.bgClass} opacity-[0.03] rounded-full -mr-6 -mt-6`}></div>
            <div className="flex justify-between items-start mb-4 relative">
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${theme.bgClass} flex items-center justify-center text-lg md:text-xl font-bold text-white shadow-inner`}>
                {student.name.charAt(0)}
              </div>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === student.id ? null : student.id);
                  }}
                  className={`text-zinc-500 hover:text-zinc-300 transition-colors p-2 hover:bg-zinc-800 rounded-lg ${openMenuId === student.id ? 'bg-zinc-800 text-zinc-100' : ''}`}
                >
                  <MoreVertical size={20} />
                </button>

                {openMenuId === student.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-48 bg-zinc-900   rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right"
                  >
                    <div className="py-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenEditModal(student); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                      >
                        <Edit2 size={16} className={theme.colorClass} /> Edytuj dane
                      </button>
                      <button
                        onClick={(e) => handleDelete(student.id, e)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors font-medium"
                      >
                        <Trash2 size={16} /> Usuń ucznia
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-3 truncate">{student.name}</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-zinc-400 text-xs md:text-sm">
                <BookOpen size={16} className={theme.colorClass} />
                <span>{student.subject}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400 text-xs md:text-sm">
                <GraduationCap size={16} className={theme.colorClass} />
                <span>{student.level}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400 text-xs md:text-sm">
                <Mail size={16} className={theme.colorClass} />
                <span className="truncate">{student.contact}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredStudents.length === 0 && (
          <div className="col-span-full py-20 text-center text-zinc-500 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl">
            <UserPlus size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-sm">Brak uczniów w bazie.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-zinc-900   rounded-2xl w-full max-h-[90vh] overflow-y-auto max-w-md p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                <UserPlus className={theme.colorClass} /> {editingStudentId ? 'Edytuj' : 'Dodaj'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Imię i Nazwisko</label>
                <input
                  required
                  type="text"
                  className="w-full bg-zinc-950   rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
                  value={studentFormData.name}
                  onChange={e => setStudentFormData({ ...studentFormData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Przedmiot</label>
                <input
                  required
                  type="text"
                  className="w-full bg-zinc-950   rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
                  value={studentFormData.subject}
                  onChange={e => setStudentFormData({ ...studentFormData, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Kontakt (email/tel)</label>
                <input
                  required
                  type="text"
                  className="w-full bg-zinc-950   rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
                  value={studentFormData.contact}
                  onChange={e => setStudentFormData({ ...studentFormData, contact: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Poziom</label>
                <select
                  className="w-full bg-zinc-950   rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
                  value={studentFormData.level}
                  onChange={e => setStudentFormData({ ...studentFormData, level: e.target.value })}
                >
                  <option>Szkoła Podstawowa</option>
                  <option>Liceum</option>
                  <option>Matura</option>
                  <option>Studia</option>
                </select>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:flex-1 px-6 py-3 rounded-xl   font-semibold hover:bg-zinc-800 transition-colors text-sm"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className={`w-full sm:flex-1 px-6 py-3 rounded-xl ${theme.bgClass} font-semibold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all text-sm`}
                >
                  {editingStudentId ? 'Zapisz' : 'Dodaj'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
