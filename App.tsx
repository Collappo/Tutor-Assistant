
import React, { useState, useEffect } from 'react';
import { AppState, Student, Lesson, ThemeColor } from './types';
import { APP_STORAGE_KEY, THEMES } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Lessons from './components/Lessons';
import { Palette, Github, Heart, Menu, X, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(APP_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      students: [],
      lessons: [],
      theme: 'violet'
    };
  });

  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addStudent = (student: Student) => {
    setState(prev => ({ ...prev, students: [...prev.students, student] }));
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const deleteStudent = (id: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć tego ucznia? Wszystkie powiązane z nim lekcje zostaną również usunięte z bazy danych.')) {
      setState(prev => ({
        ...prev,
        students: prev.students.filter(s => s.id !== id),
        lessons: prev.lessons.filter(l => l.studentId !== id)
      }));
    }
  };

  const addLesson = (lesson: Lesson) => {
    setState(prev => ({ ...prev, lessons: [...prev.lessons, lesson] }));
  };

  const updateLesson = (id: string, updates: Partial<Lesson>) => {
    setState(prev => ({
      ...prev,
      lessons: prev.lessons.map(l => l.id === id ? { ...l, ...updates } : l)
    }));
  };

  const deleteLesson = (id: string) => {
    if (window.confirm('Czy na pewno chcesz bezpowrotnie usunąć tę lekcję z harmonogramu?')) {
      setState(prev => ({
        ...prev,
        lessons: prev.lessons.filter(l => l.id !== id)
      }));
    }
  };

  const changeTheme = (theme: ThemeColor) => {
    setState(prev => ({ ...prev, theme }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard students={state.students} lessons={state.lessons} theme={state.theme} />;
      case 'students':
        return (
          <Students 
            students={state.students} 
            onAddStudent={addStudent} 
            onUpdateStudent={updateStudent}
            onDeleteStudent={deleteStudent}
            theme={state.theme} 
          />
        );
      case 'lessons':
        return (
          <Lessons 
            lessons={state.lessons} 
            students={state.students} 
            onAddLesson={addLesson} 
            onUpdateLesson={updateLesson}
            onDeleteLesson={deleteLesson}
            theme={state.theme} 
          />
        );
      case 'settings':
        const currentThemeData = THEMES.find(t => t.id === state.theme) || THEMES[0];
        return (
          <div className="max-w-3xl space-y-10 animate-in fade-in duration-500 pb-20">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Ustawienia Wyglądu</h2>
              <p className="text-zinc-400">Spersonalizuj swój asystent pracy.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Palette size={16} /> Kolor Przewodni
                </label>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-4">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => changeTheme(theme.id)}
                      className={`relative flex items-center justify-center gap-2 px-4 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${state.theme === theme.id ? `border-${theme.id}-500 bg-zinc-950` : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'}`}
                    >
                      <div className={`w-6 h-6 rounded-full ${theme.bgClass}`}></div>
                      <span className="font-medium text-sm">{theme.label}</span>
                      {state.theme === theme.id && (
                         <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${theme.bgClass} shadow-[0_0_10px_${theme.id}]`}></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
              <div className="flex items-center gap-2 text-zinc-400">
                 Made with <Heart size={16} className="text-red-500 fill-red-500" /> for Tutors
              </div>
              <a href="#" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors">
                <div className="flex items-center gap-1"><Github size={20} /> v1.0.6</div>
              </a>
            </div>
          </div>
        );
      default:
        return <Dashboard students={state.students} lessons={state.lessons} theme={state.theme} />;
    }
  };

  const theme = THEMES.find(t => t.id === state.theme) || THEMES[0];

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop fixed, Mobile drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-[100] transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }} 
          currentTheme={state.theme} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">
        {/* Mobile Header */}
        <header className="sticky top-0 z-[80] flex md:hidden items-center justify-between px-4 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${theme.bgClass} text-white`}>
              <GraduationCap size={20} />
            </div>
            <span className="font-bold text-lg">Korepetycje</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-10 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
