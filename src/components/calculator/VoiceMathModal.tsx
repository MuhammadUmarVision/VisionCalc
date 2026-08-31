import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, X, Volume2, ArrowRight, CheckCircle2, Edit3, Equal } from 'lucide-react';
import { AngleMode } from '../../types';
import { translateVoiceMathCommand, evaluateExpression } from '../../utils/mathEngine';

interface VoiceMathModalProps {
  isOpen: boolean;
  onClose: () => void;
  angleMode: AngleMode;
  onApplyExpression: (expression: string, originalInput: string, evaluatedResult: string) => void;
}

export const VoiceMathModal: React.FC<VoiceMathModalProps> = ({
  isOpen,
  onClose,
  angleMode,
  onApplyExpression,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedPreview, setParsedPreview] = useState<{ expression: string; description: string; shouldSolve: boolean } | null>(null);
  const [computedResult, setComputedResult] = useState<string>('');
  const [micError, setMicError] = useState<string | null>(null);

  const sampleCommands = [
    'Find the sine of 90 degrees',
    'Add 25 and 40',
    'Subtract 15 from 100',
    'Multiply 12 by 15',
    'Divide 100 by 4',
    'Square root of 144',
    '10 to the power of 4',
    'Cosine of 60 degrees',
    'Tangent of 45 degrees',
    'Solve 2x + 5 = 15',
    '25 percent of 200',
  ];

  // Process text whenever transcript changes
  const processTranscript = (text: string) => {
    setTranscript(text);
    if (!text.trim()) {
      setParsedPreview(null);
      setComputedResult('');
      return;
    }

    const parsed = translateVoiceMathCommand(text, angleMode);
    setParsedPreview(parsed);

    if (parsed.expression) {
      const evalRes = evaluateExpression(parsed.expression, angleMode);
      setComputedResult(evalRes.result);
    } else {
      setComputedResult('');
    }
  };

  // Web Speech Recognition API
  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setParsedPreview(null);
      setComputedResult('');
      setMicError(null);
      return;
    }

    setIsListening(true);
    setMicError(null);

    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
                              (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    let recognition: any = null;

    if (SpeechRecognition) {
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          processTranscript(text);
        };

        recognition.onerror = (e: any) => {
          setIsListening(false);
          if (e.error === 'not-allowed') {
            setMicError('Microphone permission was denied. You can type or pick a test prompt below.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch {
        setIsListening(false);
      }
    } else {
      setIsListening(false);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [isOpen, angleMode]);

  const handleSelectSample = (sample: string) => {
    processTranscript(sample);
  };

  const handleApply = () => {
    if (parsedPreview && parsedPreview.expression) {
      const finalResult = computedResult && computedResult !== 'Error' && computedResult !== 'Syntax Error'
        ? computedResult
        : evaluateExpression(parsedPreview.expression, angleMode).result;

      onApplyExpression(parsedPreview.expression, transcript || parsedPreview.description, finalResult);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Voice Calculator</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-mono text-[10px]">
                  {angleMode} MODE
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Speaks a natural calculation & automatically parses and solves it
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Voice Pulse & Spoken Input Box */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-3.5">
          <button
            onClick={() => {
              if (isListening) {
                setIsListening(false);
              } else {
                setIsListening(true);
                // Restart speech recognition if supported
                const SpeechRec = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
                                  (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;
                if (SpeechRec) {
                  try {
                    const r = new SpeechRec();
                    r.lang = 'en-US';
                    r.onresult = (ev: any) => {
                      const text = ev.results[0][0].transcript;
                      processTranscript(text);
                    };
                    r.onend = () => setIsListening(false);
                    r.start();
                  } catch {
                    setIsListening(false);
                  }
                }
              }
            }}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 ring-4 ring-blue-400/30 animate-pulse'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105'
            }`}
          >
            {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          <div className="w-full space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {isListening ? 'Listening for speech...' : 'Captured Spoken Command (Editable)'}
            </p>
            
            {/* Editable transcript input */}
            <div className="relative w-full">
              <input
                type="text"
                value={transcript}
                onChange={(e) => processTranscript(e.target.value)}
                placeholder='e.g. "Find the sine of 90 degrees", "Add 25 and 40", "Square root of 144"'
                className="w-full text-center px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Edit3 className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            
            {micError && (
              <p className="text-xs text-amber-500 pt-1">{micError}</p>
            )}
          </div>
        </div>

        {/* Complete Parsed & Calculated Solution Banner */}
        {parsedPreview && parsedPreview.expression && (
          <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Interpreted Expression
              </span>
              <span className="font-mono text-[11px] bg-blue-200/60 dark:bg-blue-900/60 px-2 py-0.5 rounded text-blue-800 dark:text-blue-200">
                {parsedPreview.description}
              </span>
            </div>

            {/* Expression + Live Result Display */}
            <div className="flex items-baseline justify-between gap-3 font-mono">
              <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {parsedPreview.expression}
              </div>
              <div className="flex items-baseline gap-1.5 text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                <Equal className="w-5 h-5 self-center text-slate-400" />
                <span>{computedResult || '...'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Sample Voice Prompts */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-blue-500" />
            Quick Test Commands (Click to simulate speech)
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            {sampleCommands.map((sample) => (
              <button
                key={sample}
                onClick={() => handleSelectSample(sample)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 text-slate-700 dark:text-slate-300 transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!parsedPreview || !parsedPreview.expression}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Apply & Evaluate to Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

