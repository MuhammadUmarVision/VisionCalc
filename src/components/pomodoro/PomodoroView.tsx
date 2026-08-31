import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  Sparkles, 
  CheckCircle2, 
  Circle,
  Coffee, 
  Flame, 
  Volume2, 
  VolumeX,
  Plus,
  SkipForward,
  Settings2,
  Trash2
} from 'lucide-react';
import { PomodoroMode } from '../../types';

interface PomodoroViewProps {
  onTimerTick?: (timeStr: string, isRunning: boolean) => void;
}

interface MathTask {
  id: string;
  text: string;
  isDone: boolean;
}

export type TimerStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';

export const PomodoroView: React.FC<PomodoroViewProps> = ({ onTimerTick }) => {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('IDLE');
  const [focusDuration, setFocusDuration] = useState<number>(25);
  const [shortBreakDuration, setShortBreakDuration] = useState<number>(5);
  const [longBreakDuration, setLongBreakDuration] = useState<number>(15);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // In seconds
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Math Study Checklist
  const [tasks, setTasks] = useState<MathTask[]>([
    { id: '1', text: 'Solve 5 Quadratic & Polynomial Equations', isDone: false },
    { id: '2', text: 'Plot and Analyze Sine & Cosine Waves in Graph Studio', isDone: false },
    { id: '3', text: 'Practice Chain Rule & Product Rule Derivatives', isDone: false },
  ]);
  const [newTaskInput, setNewTaskInput] = useState<string>('');

  const modeDurations: Record<PomodoroMode, number> = {
    focus: focusDuration * 60,
    shortBreak: shortBreakDuration * 60,
    longBreak: longBreakDuration * 60,
  };

  // Web Audio chime generator
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      // Gentle bell harmonic
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.08, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 1.3);
      });
    } catch {
      // Audio autoplay limitations handled
    }
  };

  // Robust Single-Timer Countdown Effect
  useEffect(() => {
    if (timerStatus !== 'RUNNING') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerStatus('COMPLETED');
          playChime();
          if (mode === 'focus') {
            setCompletedSessions((c) => c + 1);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timerStatus, mode, soundEnabled]);

  // Format Time Helper
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Notify parent of timer for sidebar pulse
  useEffect(() => {
    if (onTimerTick) {
      onTimerTick(formattedTime, timerStatus === 'RUNNING');
    }
  }, [formattedTime, timerStatus, onTimerTick]);

  // Mode switching
  const handleSwitchMode = (newMode: PomodoroMode) => {
    setTimerStatus('IDLE');
    setMode(newMode);
    setTimeLeft(modeDurations[newMode]);
  };

  // START action
  const handleStart = () => {
    if (timerStatus === 'COMPLETED' || timeLeft === 0) {
      setTimeLeft(modeDurations[mode]);
    }
    setTimerStatus('RUNNING');
  };

  // PAUSE action
  const handlePause = () => {
    if (timerStatus === 'RUNNING') {
      setTimerStatus('PAUSED');
    }
  };

  // RESUME action
  const handleResume = () => {
    if (timerStatus === 'PAUSED') {
      setTimerStatus('RUNNING');
    }
  };

  // RESET action: returns to selected session's original duration
  const handleReset = () => {
    setTimerStatus('IDLE');
    setTimeLeft(modeDurations[mode]);
  };

  // Skip to next session mode
  const handleSkipToNext = () => {
    setTimerStatus('IDLE');
    if (mode === 'focus') {
      const nextMode = (completedSessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      setCompletedSessions((c) => c + 1);
      setMode(nextMode);
      setTimeLeft(modeDurations[nextMode]);
    } else {
      setMode('focus');
      setTimeLeft(modeDurations.focus);
    }
  };

  const handleApplyDurationSettings = (f: number, s: number, l: number) => {
    setFocusDuration(f);
    setShortBreakDuration(s);
    setLongBreakDuration(l);
    setTimerStatus('IDLE');
    if (mode === 'focus') setTimeLeft(f * 60);
    if (mode === 'shortBreak') setTimeLeft(s * 60);
    if (mode === 'longBreak') setTimeLeft(l * 60);
    setShowSettings(false);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t)));
  };

  const handleAddTask = () => {
    if (!newTaskInput.trim()) return;
    setTasks((prev) => [...prev, { id: `task-${Date.now()}`, text: newTaskInput.trim(), isDone: false }]);
    setNewTaskInput('');
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Circular Progress calculation
  const totalDuration = modeDurations[mode];
  const progressPercent = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const modeTheme = {
    focus: {
      color: '#10b981', // Emerald green
      badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      activeBtn: 'bg-emerald-600 text-white',
      title: 'FOCUS',
      desc: 'Focus exclusively on your mathematical exercises, derivations, or problem sets.',
    },
    shortBreak: {
      color: '#06b6d4', // Cyan
      badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
      activeBtn: 'bg-cyan-600 text-white',
      title: 'SHORT BREAK',
      desc: 'Step away from the screen, stretch, drink water, and let concepts consolidate.',
    },
    longBreak: {
      color: '#8b5cf6', // Purple
      badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      activeBtn: 'bg-purple-600 text-white',
      title: 'LONG BREAK',
      desc: 'Great work! Take a break to recharge before your next study session.',
    },
  }[mode];

  const currentSessionNumber = mode === 'focus' ? completedSessions + 1 : completedSessions;

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 lg:p-8 flex flex-col max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pomodoro Study Focus</h2>
            <p className="text-xs text-slate-500">
              Structured study cycles designed for mathematical retention & deep focus.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showSettings
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-600'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
            title="Timer Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {/* Sound toggle button */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
            title={soundEnabled ? 'Completion Sound Enabled' : 'Sound Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Chime On' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Optional Timer Configuration Drawer */}
      {showSettings && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Custom Duration Settings (Minutes)
            </span>
            <button
              onClick={() => setShowSettings(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-500 block mb-1">Focus (min)</label>
              <input
                type="number"
                min={1}
                max={90}
                value={focusDuration}
                onChange={(e) => handleApplyDurationSettings(Math.max(1, parseInt(e.target.value) || 25), shortBreakDuration, longBreakDuration)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Short Break (min)</label>
              <input
                type="number"
                min={1}
                max={30}
                value={shortBreakDuration}
                onChange={(e) => handleApplyDurationSettings(focusDuration, Math.max(1, parseInt(e.target.value) || 5), longBreakDuration)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Long Break (min)</label>
              <input
                type="number"
                min={1}
                max={60}
                value={longBreakDuration}
                onChange={(e) => handleApplyDurationSettings(focusDuration, shortBreakDuration, Math.max(1, parseInt(e.target.value) || 15))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 gap-1">
          <button
            onClick={() => handleSwitchMode('focus')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              mode === 'focus'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Focus ({focusDuration}m)</span>
          </button>

          <button
            onClick={() => handleSwitchMode('shortBreak')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              mode === 'shortBreak'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Short Break ({shortBreakDuration}m)</span>
          </button>

          <button
            onClick={() => handleSwitchMode('longBreak')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              mode === 'longBreak'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Long Break ({longBreakDuration}m)</span>
          </button>
        </div>
      </div>

      {/* Main Focus Dial Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
        
        {/* Circular Progress Timer Display */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
            {/* Background ring */}
            <circle
              cx="130"
              cy="130"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800"
            />
            {/* Progress ring */}
            <circle
              cx="130"
              cy="130"
              r={radius}
              stroke={modeTheme.color}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Time digits centered */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {modeTheme.title}
            </span>
            <span className="font-mono text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter my-0.5">
              {formattedTime}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Session {currentSessionNumber}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 mt-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
              {timerStatus}
            </span>
          </div>
        </div>

        {/* Action Controls (Reset / Start / Pause / Resume / Skip) */}
        <div className="flex items-center gap-3">
          {/* RESET Button */}
          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-xs flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Reset Timer to Default"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">RESET</span>
          </button>

          {/* Dynamic Action Button (START / PAUSE / RESUME / NEXT) */}
          {timerStatus === 'IDLE' && (
            <button
              onClick={handleStart}
              className="px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2.5 transition-all shadow-lg hover:scale-105 active:scale-95 text-white bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START FOCUS</span>
            </button>
          )}

          {timerStatus === 'RUNNING' && (
            <button
              onClick={handlePause}
              className="px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2.5 transition-all shadow-lg hover:scale-105 active:scale-95 text-white bg-amber-500 hover:bg-amber-600 shadow-amber-500/30 cursor-pointer"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>PAUSE</span>
            </button>
          )}

          {timerStatus === 'PAUSED' && (
            <button
              onClick={handleResume}
              className="px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2.5 transition-all shadow-lg hover:scale-105 active:scale-95 text-white bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>RESUME</span>
            </button>
          )}

          {timerStatus === 'COMPLETED' && (
            <button
              onClick={handleSkipToNext}
              className="px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2.5 transition-all shadow-lg hover:scale-105 active:scale-95 text-white bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30 cursor-pointer"
            >
              <SkipForward className="w-5 h-5" />
              <span>START NEXT SESSION</span>
            </button>
          )}

          {/* SKIP Button */}
          <button
            onClick={handleSkipToNext}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-xs flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Skip to next session"
          >
            <SkipForward className="w-4 h-4" />
            <span className="hidden sm:inline">SKIP</span>
          </button>
        </div>

        {/* Completed Sessions Indicator */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs font-semibold text-slate-400">Cycles Completed:</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((idx) => {
              const isFilled = completedSessions % 4 >= idx || (completedSessions > 0 && completedSessions % 4 === 0);
              return (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full border transition-all ${
                    isFilled
                      ? 'bg-emerald-500 border-emerald-600 ring-2 ring-emerald-300/40'
                      : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                  }`}
                  title={`Round ${idx}`}
                />
              );
            })}
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 ml-1">
            ({completedSessions} Total)
          </span>
        </div>

      </div>

      {/* Interactive Mathematics Study Checklist & Goals */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Study Problem Sets & Checklist ({tasks.filter((t) => t.isDone).length}/{tasks.length})
          </span>
        </div>

        {/* Add new task input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTaskInput}
            onChange={(e) => setNewTaskInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTask();
            }}
            placeholder="Add new math practice topic or problem set..."
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={handleAddTask}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Task list */}
        <div className="space-y-1.5 pt-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                task.isDone
                  ? 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {task.isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                )}
                <span className="font-medium">{task.text}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task.id);
                }}
                className="p-1 text-slate-400 hover:text-red-500"
                title="Remove task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

