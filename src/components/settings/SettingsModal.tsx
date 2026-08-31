import React from 'react';
import { 
  X, 
  Settings, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Compass, 
  Keyboard, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { AngleMode, AppSettings } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 - 9', desc: 'Enter numbers' },
    { key: '+ - * /', desc: 'Arithmetic operators (+, −, ×, ÷)' },
    { key: '^', desc: 'Exponentiation / Power (xʸ)' },
    { key: '( )', desc: 'Parentheses' },
    { key: 'Enter or =', desc: 'Evaluate expression' },
    { key: 'Backspace', desc: 'Delete last character' },
    { key: 'Escape', desc: 'Clear entire expression (AC)' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">VisionCalc Settings</h3>
              <p className="text-xs text-slate-500">Customize calculations, sound, and appearance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-4">
          
          {/* Angle Calculation Mode */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-500" />
                <span>Trigonometric Angle Mode</span>
              </span>
              <p className="text-[11px] text-slate-500">Sets trigonometric functions input interpretation</p>
            </div>
            <div className="inline-flex p-1 rounded-xl bg-slate-200 dark:bg-slate-800">
              {(['DEG', 'RAD'] as AngleMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onUpdateSettings({ angleMode: mode })}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
                    settings.angleMode === mode
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Precision Settings */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Decimal Precision
              </span>
              <p className="text-[11px] text-slate-500">Maximum decimal places evaluated</p>
            </div>
            <select
              value={settings.precision}
              onChange={(e) => onUpdateSettings({ precision: parseInt(e.target.value) })}
              className="px-3 py-1.5 text-xs font-mono font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="4">4 Decimals</option>
              <option value="6">6 Decimals</option>
              <option value="8">8 Decimals</option>
              <option value="10">10 Decimals</option>
              <option value="12">12 Decimals</option>
            </select>
          </div>

          {/* Sound Feedback */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                {settings.soundFeedback ? <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                <span>Keypad Sound Feedback</span>
              </span>
              <p className="text-[11px] text-slate-500">Subtle audio click tones when pressing scientific keys</p>
            </div>
            <button
              onClick={() => onUpdateSettings({ soundFeedback: !settings.soundFeedback })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.soundFeedback ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundFeedback ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Keyboard Shortcuts Cheat Sheet */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-purple-500" />
              <span>Desktop Keyboard Shortcuts</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
              {shortcuts.map((sc, i) => (
                <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{sc.key}</span>
                  <span className="text-slate-500 text-[10px]">{sc.desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              if (window.confirm('Clear all stored calculation history?')) {
                onClearHistory();
              }
            }}
            className="text-xs font-medium text-red-500 hover:text-red-700"
          >
            Clear Stored History
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
