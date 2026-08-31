import React from 'react';
import { VisionLogo } from './VisionLogo';
import { 
  Sun, 
  Moon, 
  Settings, 
  Clock, 
  BookOpen, 
  Minus, 
  Square, 
  X,
  Compass,
  FileText
} from 'lucide-react';
import { AngleMode } from '../types';

interface DesktopTitleBarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenCalculusLibrary: () => void;
  onOpenStudyMaterials: () => void;
  activeSection: string;
}

export const DesktopTitleBar: React.FC<DesktopTitleBarProps> = ({
  darkMode,
  onToggleDarkMode,
  angleMode,
  onToggleAngleMode,
  onOpenHistory,
  onOpenSettings,
  onOpenCalculusLibrary,
  onOpenStudyMaterials,
  activeSection,
}) => {
  return (
    <header className="h-12 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 select-none flex-shrink-0 z-30 transition-colors">
      {/* Left branding & current workspace indicator */}
      <div className="flex items-center gap-3">
        <VisionLogo size="sm" />
        
        <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{activeSection}</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-400">Desktop Pro</span>
        </div>
      </div>

      {/* Middle quick utilities */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Quick Angle Mode Toggle Button */}
        <button
          onClick={onToggleAngleMode}
          className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md border transition-all flex items-center gap-1.5 ${
            angleMode === 'DEG'
              ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300'
              : 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300'
          }`}
          title={`Angle Calculation Mode: Click to switch to ${angleMode === 'DEG' ? 'Radians (RAD)' : 'Degrees (DEG)'}`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{angleMode}</span>
        </button>

        {/* Quick Calculus Library Button */}
        <button
          onClick={onOpenCalculusLibrary}
          className={`px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 hidden md:flex items-center gap-1.5 ${
            activeSection === 'calculus' ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300' : ''
          }`}
          title="Calculus Basics & Formulas"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span>Calculus</span>
        </button>

        {/* Quick Study Material (PDF) Button */}
        <button
          onClick={onOpenStudyMaterials}
          className={`px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 hidden md:flex items-center gap-1.5 ${
            activeSection === 'materials' ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300' : ''
          }`}
          title="Study Material & PDF Hub"
        >
          <FileText className="w-3.5 h-3.5 text-blue-500" />
          <span>PDFs</span>
        </button>

        {/* Calculation History button */}
        <button
          onClick={onOpenHistory}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors relative"
          title="Calculation History (Ctrl+H)"
        >
          <Clock className="w-4 h-4" />
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          title="Settings & Preferences"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Right side: Native-styled desktop window controls */}
      <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
        <button
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded transition-colors"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded transition-colors"
          title="Maximize"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white rounded transition-colors"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
