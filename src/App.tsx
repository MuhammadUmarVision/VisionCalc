import React, { useState, useEffect } from 'react';
import { DesktopTitleBar } from './components/DesktopTitleBar';
import { SidebarNav, MainTab } from './components/SidebarNav';
import { CalculatorView } from './components/calculator/CalculatorView';
import { HistoryDrawer } from './components/calculator/HistoryDrawer';
import { GraphStudioView } from './components/graphs/GraphStudioView';
import { PomodoroView } from './components/pomodoro/PomodoroView';
import { AITutorView } from './components/tutor/AITutorView';
import { CalculusLibraryView } from './components/calculus/CalculusLibraryView';
import { StudyMaterialView } from './components/pdf/StudyMaterialView';
import { SettingsModal } from './components/settings/SettingsModal';
import { AngleMode, AppSettings, CalculationRecord } from './types';

export default function App() {
  // --- Dark Mode State ---
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('visioncalc_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('visioncalc_dark_mode', darkMode.toString());
  }, [darkMode]);

  // --- Active Tab Navigation ---
  const [activeTab, setActiveTab] = useState<MainTab>('calculator');
  const [insertedCalcExpr, setInsertedCalcExpr] = useState<string | undefined>(undefined);

  // --- Angle Mode State ---
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');

  // --- History Records ---
  const [history, setHistory] = useState<CalculationRecord[]>(() => {
    const saved = localStorage.getItem('visioncalc_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: 'hist-1',
        expression: 'sin(90) + cos(0)',
        result: '2',
        timestamp: Date.now() - 3600000,
        formattedTime: '1 hour ago',
        angleMode: 'DEG',
        isPinned: true,
      },
      {
        id: 'hist-2',
        expression: 'sqrt(144) * 5',
        result: '60',
        timestamp: Date.now() - 7200000,
        formattedTime: '2 hours ago',
        angleMode: 'DEG',
      },
      {
        id: 'hist-3',
        expression: 'ln(e^4)',
        result: '4',
        timestamp: Date.now() - 10800000,
        formattedTime: '3 hours ago',
        angleMode: 'RAD',
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('visioncalc_history', JSON.stringify(history));
  }, [history]);

  // --- Modals & Drawers ---
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- Pomodoro Background Tracker ---
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState('25:00');

  // --- App Settings ---
  const [settings, setSettings] = useState<AppSettings>({
    theme: darkMode ? 'dark' : 'light',
    angleMode: 'DEG',
    precision: 10,
    hapticFeedback: true,
    soundFeedback: true,
    fontSize: 'standard',
    thousandsSeparator: true,
  });

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleToggleAngleMode = () => {
    setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
  };

  const handleAddHistory = (record: Omit<CalculationRecord, 'id' | 'timestamp' | 'formattedTime'>) => {
    const newRecord: CalculationRecord = {
      id: `calc-${Date.now()}`,
      ...record,
      timestamp: Date.now(),
      formattedTime: 'Just now',
    };
    setHistory((prev) => [newRecord, ...prev]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleTogglePinRecord = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      )
    );
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    if (newSettings.angleMode) {
      setAngleMode(newSettings.angleMode);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans select-none antialiased">
      
      {/* Desktop Window Title Bar */}
      <DesktopTitleBar
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        angleMode={angleMode}
        onToggleAngleMode={handleToggleAngleMode}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCalculusLibrary={() => setActiveTab('calculus')}
        onOpenStudyMaterials={() => setActiveTab('materials')}
        activeSection={activeTab}
      />

      {/* Main App Canvas: Sidebar + Active View Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar Navigation */}
        <SidebarNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          pomodoroRunning={pomodoroRunning}
          pomodoroTime={pomodoroTime}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto relative bg-slate-50/50 dark:bg-slate-950 flex flex-col">
          <div className={activeTab === 'calculator' ? 'flex flex-col flex-1 h-full' : 'hidden'}>
            <CalculatorView
              angleMode={angleMode}
              onToggleAngleMode={handleToggleAngleMode}
              onAddHistory={handleAddHistory}
              onOpenHistory={() => setIsHistoryOpen(true)}
              onNavigateToCalculus={() => setActiveTab('calculus')}
              soundEnabled={settings.soundFeedback}
              externalExpression={insertedCalcExpr}
            />
          </div>

          <div className={activeTab === 'graphs' ? 'flex flex-col flex-1 h-full' : 'hidden'}>
            <GraphStudioView />
          </div>

          <div className={activeTab === 'pomodoro' ? 'flex flex-col flex-1 h-full' : 'hidden'}>
            <PomodoroView
              onTimerTick={(timeStr, isRunning) => {
                setPomodoroTime(timeStr);
                setPomodoroRunning(isRunning);
              }}
            />
          </div>

          <div className={activeTab === 'tutor' ? 'flex flex-col flex-1 h-full' : 'hidden'}>
            <AITutorView
              onNavigateToCalculus={() => setActiveTab('calculus')}
              onNavigateToMaterials={() => setActiveTab('materials')}
            />
          </div>

          <div className={activeTab === 'calculus' ? 'flex flex-col flex-1 h-full' : 'hidden'}>
            <CalculusLibraryView
              onNavigateToTutor={(prompt) => {
                setActiveTab('tutor');
              }}
              onNavigateToGraph={(expr) => {
                setActiveTab('graphs');
              }}
            />
          </div>

          <div className={activeTab === 'materials' ? 'flex flex-col flex-1 h-full' : 'hidden'}>
            <StudyMaterialView
              onNavigateToTutorWithDoc={(docName, prompt) => {
                setActiveTab('tutor');
              }}
            />
          </div>
        </main>
      </div>

      {/* Calculation History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectRecord={(rec) => {
          setInsertedCalcExpr(rec.expression);
          setActiveTab('calculator');
        }}
        onClearHistory={handleClearHistory}
        onTogglePinRecord={handleTogglePinRecord}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onClearHistory={handleClearHistory}
      />

    </div>
  );
}
