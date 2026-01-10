
import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  GraduationCap,
  X,
  Github
} from 'lucide-react';
import { ThemeColor } from '../types';
import { THEMES } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentTheme: ThemeColor;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentTheme }) => {
  const theme = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'students', icon: Users, label: 'Uczniowie' },
    { id: 'lessons', icon: Calendar, label: 'Lekcje' },
    { id: 'settings', icon: Settings, label: 'Ustawienia' },
  ];

  return (
    <div className="w-64 h-full bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${theme.bgClass} text-white`}>
            <GraduationCap size={24} />
          </div>
          <h1 className="font-bold text-lg tracking-tight">Korepetycje</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${activeTab === item.id
                ? `${theme.bgClass} text-white shadow-lg`
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'}`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-white' : `group-hover:${theme.colorClass}`} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <a className="p-4 mt-auto border-t border-zinc-800" href='https://github.com/Collappo' target={'_blank'}>
        <div className="bg-zinc-950 p-4 rounded-xl  ">
          <p className="text-xs text-zinc-500 uppercase font-semibold mb-2">GitHub</p>
          <div className="flex items-center gap-2">
            <div className='flex items-center justify-center bg-white/20 w-6 h-6 rounded-md'>
              <Github className='w-4 h-4' />
            </div>
            <span className="text-sm font-medium">Collappo</span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default Sidebar;
