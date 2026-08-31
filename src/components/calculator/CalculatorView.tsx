import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Delete, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Check, 
  Copy,
  Info,
  CornerDownLeft,
  Volume2
} from 'lucide-react';
import { AngleMode, CalculationRecord } from '../../types';
import { evaluateExpression, analyzeExpression, playKeyClickSound, CalculationInsight } from '../../utils/mathEngine';
import { VoiceMathModal } from './VoiceMathModal';

interface CalculatorViewProps {
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  onAddHistory: (record: Omit<CalculationRecord, 'id' | 'timestamp' | 'formattedTime'>) => void;
  onOpenHistory: () => void;
  onNavigateToCalculus: () => void;
  soundEnabled?: boolean;
  externalExpression?: string;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  angleMode,
  onToggleAngleMode,
  onAddHistory,
  onOpenHistory,
  onNavigateToCalculus,
  soundEnabled = true,
  externalExpression,
}) => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [lastAnswer, setLastAnswer] = useState('0');
  const [isSecondActive, setIsSecondActive] = useState(false);
  const [isHypActive, setIsHypActive] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [recentInsight, setRecentInsight] = useState<CalculationInsight | null>(null);
  const [copiedResult, setCopiedResult] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external expression (e.g. from history drawer insert)
  useEffect(() => {
    if (externalExpression !== undefined) {
      setExpression(externalExpression);
    }
  }, [externalExpression]);

  // Live preview calculation on typing
  useEffect(() => {
    if (!expression || expression.trim() === '') {
      setResult('0');
      return;
    }
    const evalRes = evaluateExpression(expression, angleMode);
    if (!evalRes.error && evalRes.result !== 'Error') {
      setResult(evalRes.result);
    }
  }, [expression, angleMode]);

  // Global Keyboard listener for native desktop feeling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a modal or text input outside calculator
      if (document.activeElement && (document.activeElement.tagName === 'TEXTAREA' || (document.activeElement.tagName === 'INPUT' && document.activeElement !== inputRef.current))) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleAppend(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        const symbolMap: Record<string, string> = { '*': '×', '/': '÷', '-': '−', '+': '+' };
        handleAppend(symbolMap[e.key] || e.key);
      } else if (e.key === '.') {
        handleAppend('.');
      } else if (e.key === '(' || e.key === ')') {
        handleAppend(e.key);
      } else if (e.key === '^') {
        handleAppend('^');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEvaluate();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, angleMode]);

  const handleKeyClick = (action: () => void, soundType: 'num' | 'op' | 'func' | 'equals' | 'clear' = 'num') => {
    if (soundEnabled) {
      playKeyClickSound(soundType);
    }
    action();
  };

  const handleAppend = (token: string) => {
    setExpression((prev) => {
      // Prevent consecutive redundant operators
      if (['+', '−', '×', '÷'].includes(token) && ['+', '−', '×', '÷'].includes(prev.slice(-1))) {
        return prev.slice(0, -1) + token;
      }
      return prev + token;
    });
  };

  const handleAppendFunction = (funcName: string) => {
    setExpression((prev) => prev + funcName + '(');
  };

  const handleClearAll = () => {
    setExpression('');
    setResult('0');
  };

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleEvaluate = () => {
    if (!expression || expression.trim() === '') return;

    const evalResult = evaluateExpression(expression, angleMode);
    
    if (evalResult.result !== 'Error') {
      setResult(evalResult.result);
      setLastAnswer(evalResult.result);

      // Save to History
      onAddHistory({
        originalInput: expression,
        expression,
        result: evalResult.result,
        angleMode,
      });

      // Analyze insight
      const insight = analyzeExpression(expression, evalResult.result, angleMode);
      setRecentInsight(insight);
    } else {
      setResult('Syntax Error');
    }
  };

  const handleApplyVoice = (expr: string, originalInput: string, evaluatedResult: string) => {
    setExpression(expr);
    setResult(evaluatedResult);
    setLastAnswer(evaluatedResult);

    onAddHistory({
      originalInput: originalInput || expr,
      expression: expr,
      result: evaluatedResult,
      angleMode,
    });

    const insight = analyzeExpression(expr, evaluatedResult, angleMode);
    setRecentInsight(insight);
  };

  const handleCopyResult = () => {
    navigator.clipboard.writeText(result);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 1500);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 lg:p-6 flex flex-col max-w-7xl mx-auto space-y-5">
      {/* Voice Math Modal */}
      <VoiceMathModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        angleMode={angleMode}
        onApplyExpression={handleApplyVoice}
      />

      {/* Main Grid: Calculator Module on Left, Mathematical Insight on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Col: Scientific Calculator Unit (Cols 1-7/8) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 sm:p-6 space-y-4">
          
          {/* Display Header Toolbar */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-1">
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleAngleMode}
                className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] transition-colors ${
                  angleMode === 'DEG'
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                }`}
              >
                {angleMode} MODE
              </button>
              {isSecondActive && (
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-bold">
                  2ND
                </span>
              )}
              {isHypActive && (
                <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 text-[10px] font-bold">
                  HYP
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenHistory}
                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="View History"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>History</span>
              </button>
            </div>
          </div>

          {/* Large Screen / Display Area */}
          <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-xl p-4 sm:p-5 shadow-inner border border-slate-800 space-y-2 relative group">
            {/* Expression line */}
            <div className="min-h-[28px] font-mono text-sm sm:text-base text-slate-400 overflow-x-auto whitespace-pre-wrap break-all text-right select-text">
              {expression || '0'}
            </div>

            {/* Evaluated Result Line */}
            <div className="flex items-baseline justify-between pt-1 border-t border-slate-800/80">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Result</span>
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="font-mono text-2xl sm:text-4xl font-bold tracking-tight text-right text-emerald-400 select-text">
                  {result}
                </span>
                <button
                  onClick={handleCopyResult}
                  className="p-1 rounded text-slate-500 hover:text-slate-200 transition-colors"
                  title="Copy result"
                >
                  {copiedResult ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Keypad Mode and Voice Bar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSecondActive(!isSecondActive)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  isSecondActive
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                2nd
              </button>

              <button
                onClick={() => setIsHypActive(!isHypActive)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  isHypActive
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                hyp
              </button>
            </div>

            {/* Prominent Voice / Microphone Button */}
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-95"
            >
              <Mic className="w-4 h-4 animate-pulse" />
              <span>Voice Math Command</span>
            </button>
          </div>

          {/* Scientific Keypad Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2">
            
            {/* Scientific Function Keys (Row 1) */}
            <button
              onClick={() => handleKeyClick(() => handleAppendFunction(isSecondActive ? 'asin' : isHypActive ? 'sinh' : 'sin'), 'func')}
              className="keypad-func-btn"
            >
              {isSecondActive ? 'sin⁻¹' : isHypActive ? 'sinh' : 'sin'}
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppendFunction(isSecondActive ? 'acos' : isHypActive ? 'cosh' : 'cos'), 'func')}
              className="keypad-func-btn"
            >
              {isSecondActive ? 'cos⁻¹' : isHypActive ? 'cosh' : 'cos'}
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppendFunction(isSecondActive ? 'atan' : isHypActive ? 'tanh' : 'tan'), 'func')}
              className="keypad-func-btn"
            >
              {isSecondActive ? 'tan⁻¹' : isHypActive ? 'tanh' : 'tan'}
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppendFunction('ln'), 'func')}
              className="keypad-func-btn"
            >
              ln
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppendFunction(isSecondActive ? 'log' : 'log10'), 'func')}
              className="keypad-func-btn"
            >
              {isSecondActive ? 'log₂' : 'log₁₀'}
            </button>
            <button
              onClick={() => handleKeyClick(handleClearAll, 'clear')}
              className="keypad-clear-btn"
            >
              AC
            </button>

            {/* Scientific Function Keys (Row 2) */}
            <button
              onClick={() => handleKeyClick(() => handleAppend('^2'), 'func')}
              className="keypad-func-btn"
            >
              x²
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('^'), 'func')}
              className="keypad-func-btn"
            >
              xʸ
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppendFunction('sqrt'), 'func')}
              className="keypad-func-btn"
            >
              √x
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppendFunction('cbrt'), 'func')}
              className="keypad-func-btn"
            >
              ∛x
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('!'), 'func')}
              className="keypad-func-btn"
            >
              x!
            </button>
            <button
              onClick={() => handleKeyClick(handleBackspace, 'clear')}
              className="keypad-action-btn text-amber-600 dark:text-amber-400"
              title="Backspace (Delete)"
            >
              <Delete className="w-4 h-4 mx-auto" />
            </button>

            {/* Row 3: Constants & Parentheses & Basic Math Numbers */}
            <button
              onClick={() => handleKeyClick(() => handleAppend('π'), 'func')}
              className="keypad-func-btn"
            >
              π
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('e'), 'func')}
              className="keypad-func-btn"
            >
              e
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('('), 'op')}
              className="keypad-action-btn font-mono"
            >
              (
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend(')'), 'op')}
              className="keypad-action-btn font-mono"
            >
              )
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('%'), 'op')}
              className="keypad-action-btn"
            >
              %
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('÷'), 'op')}
              className="keypad-operator-btn"
            >
              ÷
            </button>

            {/* Row 4: 7, 8, 9, × */}
            <button
              onClick={() => handleKeyClick(() => handleAppend('1/('), 'func')}
              className="keypad-func-btn"
            >
              1/x
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('7'), 'num')}
              className="keypad-number-btn"
            >
              7
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('8'), 'num')}
              className="keypad-number-btn"
            >
              8
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('9'), 'num')}
              className="keypad-number-btn"
            >
              9
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('EXP'), 'func')}
              className="keypad-func-btn text-xs font-mono"
            >
              EE
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('×'), 'op')}
              className="keypad-operator-btn"
            >
              ×
            </button>

            {/* Row 5: 4, 5, 6, − */}
            <button
              onClick={() => handleKeyClick(() => handleAppendFunction('abs'), 'func')}
              className="keypad-func-btn text-xs"
            >
              |x|
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('4'), 'num')}
              className="keypad-number-btn"
            >
              4
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('5'), 'num')}
              className="keypad-number-btn"
            >
              5
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('6'), 'num')}
              className="keypad-number-btn"
            >
              6
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend(lastAnswer), 'func')}
              className="keypad-func-btn text-xs font-mono"
            >
              Ans
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('−'), 'op')}
              className="keypad-operator-btn"
            >
              −
            </button>

            {/* Row 6: 1, 2, 3, + */}
            <button
              onClick={() => handleKeyClick(() => handleAppend('10^'), 'func')}
              className="keypad-func-btn text-xs font-mono"
            >
              10ˣ
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('1'), 'num')}
              className="keypad-number-btn"
            >
              1
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('2'), 'num')}
              className="keypad-number-btn"
            >
              2
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('3'), 'num')}
              className="keypad-number-btn"
            >
              3
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('.'), 'num')}
              className="keypad-number-btn font-bold text-lg"
            >
              .
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('+'), 'op')}
              className="keypad-operator-btn"
            >
              +
            </button>

            {/* Row 7: 0, and big Evaluate Button */}
            <button
              onClick={() => handleKeyClick(() => handleAppend('e^'), 'func')}
              className="keypad-func-btn text-xs font-mono"
            >
              eˣ
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('0'), 'num')}
              className="keypad-number-btn sm:col-span-2"
            >
              0
            </button>
            <button
              onClick={() => handleKeyClick(() => handleAppend('00'), 'num')}
              className="keypad-number-btn"
            >
              00
            </button>
            <button
              onClick={() => handleKeyClick(handleEvaluate, 'equals')}
              className="keypad-equals-btn col-span-2"
            >
              <span className="text-xl font-bold font-mono">=</span>
              <span className="text-xs font-normal opacity-80 hidden sm:inline">(Enter)</span>
            </button>
          </div>

          {/* Bottom Desktop shortcuts hint */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" />
              <span>Enter = Evaluate</span>
              <span className="mx-1.5">•</span>
              <span>Esc = Clear</span>
            </span>
            <span className="font-mono">Precision: 10 Decimals</span>
          </div>
        </div>

        {/* Right Col: Mathematical Step Insights & Quick Study Launchpad (Cols 9-12) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Step-by-Step Insight Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Mathematical Insights</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
                {recentInsight?.category || 'Active'}
              </span>
            </div>

            {recentInsight ? (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {recentInsight.type}
                  </h4>
                  <ol className="mt-2 space-y-1.5 list-decimal list-inside text-xs text-slate-600 dark:text-slate-400">
                    {recentInsight.steps.map((st, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <span>{st}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Properties & Identities
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    {recentInsight.properties.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-blue-500">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <Info className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 stroke-[1.5]" />
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Perform a calculation to see step-by-step mathematical logic and identity breakdowns.
                </p>
              </div>
            )}
          </div>

          {/* Calculus Basics Teaser Banner */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-300" />
              <h3 className="font-bold text-sm text-white">Calculus Study Library</h3>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Explore Limits, Derivatives (Product & Chain rules), and Integration formulas with interactive step walks.
            </p>
            <button
              onClick={onNavigateToCalculus}
              className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span>Explore Calculus Basics</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Tailwind Utility Helper Styles for Keypad Buttons */}
      <style>{`
        .keypad-number-btn {
          padding: 0.75rem 0.5rem;
          font-family: 'Fira Code', monospace;
          font-weight: 600;
          font-size: 1.125rem;
          border-radius: 0.75rem;
          background-color: var(--color-slate-100, #f1f5f9);
          color: var(--color-slate-900, #0f172a);
          border: 1px solid var(--color-slate-200, #e2e8f0);
          transition: all 0.1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        :is(.dark .keypad-number-btn) {
          background-color: var(--color-slate-800, #1e293b);
          color: var(--color-slate-100, #f8fafc);
          border-color: var(--color-slate-700, #334155);
        }
        .keypad-number-btn:hover {
          filter: brightness(0.95);
          transform: translateY(-1px);
        }
        .keypad-number-btn:active {
          transform: translateY(1px);
        }

        .keypad-operator-btn {
          padding: 0.75rem 0.5rem;
          font-family: 'Fira Code', monospace;
          font-weight: 700;
          font-size: 1.25rem;
          border-radius: 0.75rem;
          background-color: #2563eb;
          color: #ffffff;
          border: 1px solid #1d4ed8;
          transition: all 0.1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 2px rgba(37, 99, 235, 0.2);
        }
        .keypad-operator-btn:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }
        .keypad-operator-btn:active {
          transform: translateY(1px);
        }

        .keypad-func-btn {
          padding: 0.625rem 0.25rem;
          font-size: 0.8125rem;
          font-weight: 600;
          border-radius: 0.75rem;
          background-color: #f8fafc;
          color: #334155;
          border: 1px solid #e2e8f0;
          transition: all 0.1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        :is(.dark .keypad-func-btn) {
          background-color: #0f172a;
          color: #cbd5e1;
          border-color: #1e293b;
        }
        .keypad-func-btn:hover {
          background-color: #e2e8f0;
          color: #1e293b;
        }
        :is(.dark .keypad-func-btn:hover) {
          background-color: #1e293b;
          color: #ffffff;
        }

        .keypad-action-btn {
          padding: 0.625rem 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 0.75rem;
          background-color: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
          transition: all 0.1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        :is(.dark .keypad-action-btn) {
          background-color: #1e293b;
          color: #94a3b8;
          border-color: #334155;
        }
        .keypad-action-btn:hover {
          background-color: #e2e8f0;
        }
        :is(.dark .keypad-action-btn:hover) {
          background-color: #334155;
          color: #ffffff;
        }

        .keypad-clear-btn {
          padding: 0.625rem 0.5rem;
          font-weight: 700;
          font-size: 0.875rem;
          border-radius: 0.75rem;
          background-color: #fee2e2;
          color: #dc2626;
          border: 1px solid #fca5a5;
          transition: all 0.1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        :is(.dark .keypad-clear-btn) {
          background-color: rgba(127, 29, 29, 0.4);
          color: #fca5a5;
          border-color: #7f1d1d;
        }
        .keypad-clear-btn:hover {
          background-color: #fecaca;
        }
        :is(.dark .keypad-clear-btn:hover) {
          background-color: rgba(127, 29, 29, 0.7);
        }

        .keypad-equals-btn {
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background-color: #10b981;
          color: #ffffff;
          border: 1px solid #059669;
          transition: all 0.1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
        }
        .keypad-equals-btn:hover {
          background-color: #059669;
          transform: translateY(-1px);
        }
        .keypad-equals-btn:active {
          transform: translateY(1px);
        }
      `}</style>
    </div>
  );
};
