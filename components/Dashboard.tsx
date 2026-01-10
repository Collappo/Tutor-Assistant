
import React from 'react';
import {
  Users,
  CalendarCheck,
  Wallet,
  Clock,
  ArrowUpRight,
  TrendingUp,
  History
} from 'lucide-react';
import { Student, Lesson, ThemeColor } from '../types';
import { THEMES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  students: Student[];
  lessons: Lesson[];
  theme: ThemeColor;
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ students, lessons, theme: currentTheme, setActiveTab }) => {
  const theme = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  const totalEarnings = lessons
    .filter(l => l.status === 'completed')
    .reduce((acc, curr) => acc + (curr.price || 0), 0);

  const upcomingLessonsCount = lessons.filter(l => l.status === 'planned').length;

  const getWeeklyData = () => {
    const days = ['Niedz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'];
    const result = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const dailySum = lessons
        .filter(l => l.status === 'completed' && l.date === dateStr)
        .reduce((sum, lesson) => sum + (lesson.price || 0), 0);

      result.push({
        name: days[d.getDay()],
        amount: dailySum,
        date: dateStr
      });
    }
    return result;
  };

  const chartData = getWeeklyData();
  const weeklyEarningsSum = chartData.reduce((acc, curr) => acc + curr.amount, 0);

  const stats = [
    { id: 'students', label: 'Uczniowie', value: students.length, icon: Users, color: 'text-blue-500' },
    { id: 'earnings_total', label: 'Suma Zarobków', value: `${totalEarnings} zł`, icon: History, color: 'text-emerald-500', noRedirect: true },
    { id: 'earnings_week', label: 'Zarobki (7 dni)', value: `${weeklyEarningsSum} zł`, icon: Wallet, color: 'text-amber-500', noRedirect: true },
    { id: 'lessons', label: 'Zaplanowane', value: upcomingLessonsCount, icon: CalendarCheck, color: 'text-violet-500' },
  ];

  const handleStatClick = (statId: string) => {
    if (statId === 'students') setActiveTab('students');
    if (statId === 'lessons') setActiveTab('lessons');
  };

  const getThemeHexColor = () => {
    switch (theme.id) {
      case 'blue': return '#3b82f6';
      case 'emerald': return '#10b981';
      case 'amber': return '#f59e0b';
      case 'violet': return '#8b5cf6';
      default: return '#8b5cf6';
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-10 px-1 md:px-0">
      <header>
        <h2 className="text-2xl md:text-3xl font-bold">Witaj ponownie! 👋</h2>
        <p className="text-zinc-400 mt-1 text-sm md:text-base">Oto podsumowanie Twoich działań.</p>
      </header>

      {/* Zmieniono grid-cols-1 na grid-cols-2 dla mobile (2x2) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            onClick={() => !stat.noRedirect && handleStatClick(stat.id)}
            className={`bg-zinc-900 p-4 md:p-6 rounded-2xl  transition-all group ${!stat.noRedirect ? 'cursor-pointer hover:border-zinc-700 hover:scale-[1.02] active:scale-95' : ''}`}
          >
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className={`p-2 rounded-xl bg-zinc-950 group-hover:${theme.borderClass} transition-colors`}>
                <stat.icon size={18} className={`${stat.color} md:w-5 md:h-5`} />
              </div>
              {!stat.noRedirect && (
                <span className="hidden xs:flex items-center text-[8px] md:text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  Zobacz <ArrowUpRight size={8} className="ml-1 md:w-2.5 md:h-2.5" />
                </span>
              )}
            </div>
            <h3 className="text-zinc-400 text-[10px] md:text-sm font-medium">{stat.label}</h3>
            <p className="text-lg md:text-2xl font-bold mt-0.5 md:mt-1 truncate">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 rounded-2xl p-5 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                Zarobki (7 dni) <TrendingUp size={20} className={theme.colorClass} />
              </h3>
              <p className="text-xs md:text-sm text-zinc-400">Podsumowanie zakończonych lekcji.</p>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block mb-0.5">Suma tygodnia</span>
              <span className={`text-lg md:text-xl font-bold ${theme.colorClass}`}>{weeklyEarningsSum} zł</span>
            </div>
          </div>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value > 0 ? `${value}zł` : ''}
                />
                <Tooltip
                  cursor={{ fill: '#18181b' }}
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', border: '1px solid #3f3f46' }}
                  itemStyle={{ color: '#f4f4f5', fontSize: '12px' }}
                  labelStyle={{ color: '#71717a', marginBottom: '4px', fontSize: '10px' }}
                  formatter={(value: number) => [`${value} zł`, 'Zarobek']}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={30}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.amount > 0 ? getThemeHexColor() : 'transparent'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-5 md:p-6">
          <h3 className="text-lg font-bold mb-4">Nadchodzące lekcje</h3>
          <div className="space-y-3">
            {lessons
              .filter(l => l.status === 'planned')
              .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
              .slice(0, 5)
              .map((lesson, idx) => {
                const student = students.find(s => s.id === lesson.studentId);
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 hover:border-zinc-800 transition-colors group">
                    <div className={`w-9 h-9 rounded-full ${theme.bgClass} flex items-center justify-center font-bold text-white shrink-0 text-sm`}>
                      {student?.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-white transition-colors">{student?.name}</p>
                      <p className="text-[10px] md:text-xs text-zinc-500 truncate">{lesson.time} • {lesson.topic || 'Bez tematu'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-semibold text-zinc-500">{lesson.date.split('-').slice(1).reverse().join('.')}</p>
                    </div>
                  </div>
                );
              })}
            {lessons.filter(l => l.status === 'planned').length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-zinc-500 text-center">
                <CalendarCheck size={40} className="mb-2 opacity-10" />
                <p className="text-xs">Brak zaplanowanych lekcji</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
