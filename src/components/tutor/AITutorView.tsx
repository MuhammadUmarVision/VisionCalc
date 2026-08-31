import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Image as ImageIcon, 
  Mic, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  Copy, 
  Check, 
  Upload, 
  BookOpen, 
  X,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { TutorMessage, TutorStep } from '../../types';
import { generateTutorResponse } from '../../utils/tutorEngine';
import { MathView } from '../common/MathView';

interface AITutorViewProps {
  onNavigateToCalculus: () => void;
  onNavigateToMaterials: () => void;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  onNavigateToCalculus,
  onNavigateToMaterials,
}) => {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: "Hello! I'm your **VisionCalc AI Tutor**. I'm here to guide you through mathematical proofs, calculus steps, algebraic simplifications, and problem-solving concepts. Ask me a question, upload a problem photo, or pick a study topic below.",
      timestamp: Date.now(),
      steps: [
        {
          stepNumber: 1,
          title: 'Problem Framing',
          explanation: 'Break down givens, unknowns, and appropriate mathematical models.',
        },
        {
          stepNumber: 2,
          title: 'Sequential Steps',
          explanation: 'Clear algebraic and calculus transformations with line-by-line justification.',
        },
        {
          stepNumber: 3,
          title: 'Mistake Diagnostics',
          explanation: 'Identify tricky traps like sign flips, chain rule omissions, or integration constant + C.',
        },
      ],
    },
    {
      id: 'sample-solution',
      role: 'assistant',
      content: 'Here is an example of how I break down a calculus derivative step-by-step:',
      timestamp: Date.now() + 1000,
      formulaUsed: "\\frac{d}{dx}[u \\cdot v] = u'v + uv' \\quad \\text{(Product Rule)}",
      steps: [
        {
          stepNumber: 1,
          title: 'Identify Function Components',
          mathExpression: 'f(x) = x^2 \\cdot \\sin(x)',
          explanation: 'Let u = x² and v = sin(x). Both factors depend on x, so we must use the Product Rule rather than differentiating each factor independently.',
        },
        {
          stepNumber: 2,
          title: 'Compute Individual Derivatives',
          mathExpression: "u' = \\frac{d}{dx}[x^2] = 2x, \\quad v' = \\frac{d}{dx}[\\sin(x)] = \\cos(x)",
          explanation: 'Apply the power rule to u and standard trigonometric derivative to v.',
        },
        {
          stepNumber: 3,
          title: 'Assemble Using Product Rule Formula',
          mathExpression: "f'(x) = (2x)(\\sin x) + (x^2)(\\cos x)",
          explanation: 'Substitute u, u\', v, and v\' into the identity.',
        },
        {
          stepNumber: 4,
          title: 'Factor & Present Final Result',
          mathExpression: "f'(x) = x(2\\sin(x) + x\\cos(x))",
          explanation: 'Factor out the common factor x for standard simplified form.',
        },
      ],
      commonMistakes: [
        'Mistake: Differentiating each term as 2x * cos(x). (Never multiply individual derivatives without the product sum!)',
        'Mistake: Forgetting that the derivative of sin(x) is positive cos(x), whereas d/dx[cos(x)] = -sin(x).',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedStep, setCopiedStep] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Explain the Chain Rule with an intuitive example',
    'How do I evaluate limits with 0/0 indeterminate forms?',
    'Step-by-step: Find the derivative of f(x) = ln(3x² + 1)',
    'Explain Integration by Parts (LIATE rule)',
    'Why is derivative of e^x equal to e^x?',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSendMessage = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() && !selectedImage) return;

    const userMessage: TutorMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: Date.now(),
      imageAttachment: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setSelectedImage(null);
    setIsProcessing(true);

    // Generate response using mathematical tutor engine
    setTimeout(() => {
      const reply = generateTutorResponse(q);
      setMessages((prev) => [...prev, reply]);
      setIsProcessing(false);
    }, 400);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyMath = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(id);
    setTimeout(() => setCopiedStep(null), 1500);
  };

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col max-w-6xl mx-auto p-4 lg:p-6 space-y-4">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>AI Math Study Tutor</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                Step-by-Step
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Type or speak a question, or upload a photo of a textbook problem.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onNavigateToCalculus}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Calculus Library</span>
          </button>
          <button
            onClick={onNavigateToMaterials}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>PDF Materials</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 space-y-3 ${
                  isUser
                    ? 'bg-blue-600 text-white shadow-md rounded-tr-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-tl-xs text-slate-900 dark:text-slate-100'
                }`}
              >
                {/* Image attachment preview */}
                {msg.imageAttachment && (
                  <div className="rounded-xl overflow-hidden max-h-48 border border-white/20 mb-2">
                    <img src={msg.imageAttachment} alt="Math Problem" className="w-full object-cover" />
                  </div>
                )}

                {/* Main Message Text */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Formula Highlight Card */}
                {msg.formulaUsed && (
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                      Core Formula & Rule
                    </span>
                    <div className="py-1 text-purple-900 dark:text-purple-200">
                      <MathView math={msg.formulaUsed} block size="base" />
                    </div>
                  </div>
                )}

                {/* Step-by-Step Breakdown Cards */}
                {msg.steps && msg.steps.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Solution Steps:
                    </span>

                    {msg.steps.map((st) => (
                      <div
                        key={st.stepNumber}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px]">
                              {st.stepNumber}
                            </span>
                            <span>{st.title}</span>
                          </span>

                          {st.mathExpression && (
                            <button
                              onClick={() => handleCopyMath(`${msg.id}-${st.stepNumber}`, st.mathExpression || '')}
                              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                              title="Copy math expression"
                            >
                              {copiedStep === `${msg.id}-${st.stepNumber}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>

                        {st.mathExpression && (
                          <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
                            <MathView math={st.mathExpression} block size="sm" />
                          </div>
                        )}

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {st.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Common Mistakes & Warnings */}
                {msg.commonMistakes && msg.commonMistakes.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Common Pitfalls & Mistakes to Avoid
                    </span>
                    <ul className="space-y-1 text-xs text-amber-900 dark:text-amber-300">
                      {msg.commonMistakes.map((mis, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{mis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Timestamp */}
                <div className={`text-[10px] text-right ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-1 font-bold text-xs">
                  You
                </div>
              )}
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2 shadow-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-500" />
              <span>Analyzing formula, computing steps, and generating explanation...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs flex-shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-500" />
          Prompts:
        </span>
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => handleSendMessage(p)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-purple-400 text-xs whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Upload Preview if image selected */}
      {selectedImage && (
        <div className="relative inline-flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0">
          <img src={selectedImage} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
          <div className="text-xs">
            <span className="font-semibold block text-slate-800 dark:text-slate-200">Problem Image Attached</span>
            <span className="text-slate-400 text-[10px]">Will be analyzed with step-by-step solver</span>
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="p-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-500 hover:text-white transition-colors ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input Box Footer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shadow-md flex items-center gap-2 flex-shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Attach Photo Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title="Upload or drop photo of math problem"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Ask any math question (e.g. 'Solve 2x + 5 = 15', 'Explain limits', or upload a problem)..."
          className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none px-2"
        />

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputQuery.trim() && !selectedImage}
          className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 transition-all shadow-sm shadow-purple-500/20"
          title="Send Question"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
