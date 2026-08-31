import React from 'react';
import { 
  Calculator, 
  LineChart, 
  Timer, 
  Bot, 
  BookOpen, 
  FileText, 
  History, 
  Settings as SettingsIcon,
  Sparkles,
  Play
} from 'lucide-react';

export type MainTab = 'calculator' | 'graphs' | 'pomodoro' | 'tutor' | 'calculus' | 'materials';

interface SidebarNavProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  pomodoroRunning?: boolean;
  pomodoroTime?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenHistory,
  onOpenSettings,
  pomodoroRunning = false,
  pomodoroTime = '25:00',
}) => {
  const primaryNavItems: { id: MainTab; label: string; icon: React.ReactNode; badge?: string; color: string }[] = [
    {
      id: 'calculator',
      label: 'Calculator',
      icon: <Calculator className="w-5 h-5" />,
      color: 'hover:text-blue-600 dark:hover:text-blue-400',
    },
    {
      id: 'graphs',
      label: 'Graphs',
      icon: <LineChart className="w-5 h-5" />,
      color: 'hover:text-cyan-600 dark:hover:text-cyan-400',
    },
    {
      id: 'pomodoro',
      label: 'Pomodoro',
      icon: <Timer className="w-5 h-5" />,
      badge: pomodoroRunning ? pomodoroTime : undefined,
      color: 'hover:text-emerald-600 dark:hover:text-emerald-400',
    },
    {
      id: 'tutor',
      label: 'AI Tutor',
      icon: <Bot className="w-5 h-5" />,
      badge: 'AI',
      color: 'hover:text-purple-600 dark:hover:text-purple-400',
    },
  ];

  const studyModules: { id: MainTab; label: string; icon: React.ReactNode; subtitle: string }[] = [
    {
      id: 'calculus',
      label: 'Calculus Basics',
      subtitle: 'Limits, Derivatives, Integrals',
      icon: <BookOpen className="w-4 h-4 text-indigo-500" />,
    },
    {
      id: 'materials',
      label: 'PDF & Materials',
      subtitle: 'Document-grounded study',
      icon: <FileText className="w-4 h-4 text-blue-500" />,
    },
  ];

  return (
    <aside className="w-64 bg-slate-50/80 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-3 select-none flex-shrink-0 transition-colors">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Primary Navigation Tabs */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Core Tools
          </div>
          <nav className="space-y-1">
            {primaryNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : `text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 ${item.color}`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-current'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold flex items-center gap-1 ${
                        isActive
                          ? 'bg-blue-700/80 text-blue-100'
                          : item.id === 'pomodoro' && pomodoroRunning
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 animate-pulse'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                      }`}
                    >
                      {item.id === 'pomodoro' && pomodoroRunning && (
                        <Play className="w-2.5 h-2.5 fill-current" />
                      )}
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Study Companion Section */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span>Study Companion</span>
            <Sparkles className="w-3 h-3 text-purple-500" />
          </div>
          <nav className="space-y-1">
            {studyModules.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="p-1 rounded bg-white dark:bg-slate-800 shadow-xs">
                    {item.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold truncate leading-tight">{item.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{item.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Secondary Navigation (History & Settings) */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <button
          onClick={onOpenHistory}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
        >
          <History className="w-4 h-4 text-slate-400" />
          <span>Calculation History</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
        >
          <SettingsIcon className="w-4 h-4 text-slate-400" />
          <span>Preferences & Shortcuts</span>
        </button>

        {/* VisionCalc Tagline */}
        <div className="px-3 pt-2 text-[10px] text-slate-400 dark:text-slate-600 text-center font-mono">
          Calculate → Graph → Learn → Focus
        </div>
      </div>
    </aside>
  );
};
