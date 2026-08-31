import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  Filter,
  BarChart3,
  Star,
  Check,
  Layers,
  GraduationCap,
  FileQuestion,
  HelpCircle,
  ChevronRight,
  Hash,
  Clock,
  Play
} from 'lucide-react';
import { MathView } from '../common/MathView';
import {
  generateCalculusQuizQuestions,
  QuizQuestion,
  QuizCategory,
  QuizDifficulty,
  QuizProgressRecord
} from '../../data/calculusQuizData';

interface CalculusQuizViewProps {
  onNavigateToLessons: (categoryId?: 'limits' | 'derivatives' | 'integration') => void;
  onNavigateToTutor: (prompt?: string) => void;
}

type QuestionCountPreset = 5 | 10 | 15 | 20 | 25 | 30 | 'custom';

export const CalculusQuizView: React.FC<CalculusQuizViewProps> = ({
  onNavigateToLessons,
  onNavigateToTutor
}) => {
  // Setup state
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory>('derivatives');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty>('all');
  const [onlyImportant, setOnlyImportant] = useState<boolean>(false);
  const [mode, setMode] = useState<'practice' | 'exam'>('exam');
  
  // Question Count state
  const [questionCountPreset, setQuestionCountPreset] = useState<QuestionCountPreset>(10);
  const [customCountInput, setCustomCountInput] = useState<string>('18');

  // Quiz active state
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Answers recorded: questionId -> optionId
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  // In practice mode, record if question has been checked
  const [checkedInPractice, setCheckedInPractice] = useState<Record<string, boolean>>({});
  
  // Exam complete state
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);
  const [showMistakesOnly, setShowMistakesOnly] = useState<boolean>(false);

  // Overall Stats persistence
  const [stats, setStats] = useState<QuizProgressRecord>(() => {
    try {
      const saved = localStorage.getItem('visioncalc_quiz_stats');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      totalAttempted: 0,
      totalCorrect: 0,
      bestExamScore: null
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('visioncalc_quiz_stats', JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Compute validated effective question count
  const effectiveQuestionCount = useMemo(() => {
    if (questionCountPreset === 'custom') {
      const parsed = parseInt(customCountInput, 10);
      if (isNaN(parsed) || parsed < 1) return 1;
      if (parsed > 50) return 50;
      return parsed;
    }
    return questionCountPreset;
  }, [questionCountPreset, customCountInput]);

  // Start Quiz with exact randomized question count
  const handleStartQuiz = () => {
    const questions = generateCalculusQuizQuestions(
      selectedCategory,
      selectedDifficulty,
      effectiveQuestionCount,
      onlyImportant
    );

    setActiveQuizQuestions(questions);
    setUserAnswers({});
    setCheckedInPractice({});
    setCurrentIndex(0);
    setIsExamCompleted(false);
    setShowMistakesOnly(false);
    setIsQuizActive(true);
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (mode === 'practice' && checkedInPractice[questionId]) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    if (mode === 'practice') {
      // In practice mode, immediately check
      setCheckedInPractice((prev) => ({ ...prev, [questionId]: true }));
      const q = activeQuizQuestions.find((item) => item.id === questionId);
      const isCorrect = q && q.correctOptionId === optionId;
      setStats((prev) => ({
        ...prev,
        totalAttempted: prev.totalAttempted + 1,
        totalCorrect: isCorrect ? prev.totalCorrect + 1 : prev.totalCorrect
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < activeQuizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Submit Exam
  const handleSubmitExam = () => {
    let correctCount = 0;
    activeQuizQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctOptionId) {
        correctCount++;
      }
    });

    const total = activeQuizQuestions.length;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    // update stats
    setStats((prev) => {
      const isNewBest = !prev.bestExamScore || percentage > prev.bestExamScore.percentage;
      return {
        totalAttempted: prev.totalAttempted + total,
        totalCorrect: prev.totalCorrect + correctCount,
        bestExamScore: isNewBest ? {
          score: correctCount,
          total,
          percentage,
          category: selectedCategory,
          difficulty: selectedDifficulty,
          date: new Date().toLocaleDateString()
        } : prev.bestExamScore
      };
    });

    setIsExamCompleted(true);
  };

  const handleResetQuiz = () => {
    setIsQuizActive(false);
    setActiveQuizQuestions([]);
    setUserAnswers({});
    setCheckedInPractice({});
    setCurrentIndex(0);
    setIsExamCompleted(false);
    setShowMistakesOnly(false);
  };

  // Exam summary metrics
  const examResults = useMemo(() => {
    if (!isExamCompleted) return null;
    let correct = 0;
    const mistakes: { question: QuizQuestion; userAnswerId?: string }[] = [];

    activeQuizQuestions.forEach((q) => {
      const uAns = userAnswers[q.id];
      if (uAns === q.correctOptionId) {
        correct++;
      } else {
        mistakes.push({ question: q, userAnswerId: uAns });
      }
    });

    const total = activeQuizQuestions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return {
      correct,
      incorrect: total - correct,
      total,
      percentage,
      mistakes
    };
  }, [isExamCompleted, activeQuizQuestions, userAnswers]);

  const currentQuestion: QuizQuestion | undefined = activeQuizQuestions[currentIndex];

  // ==========================================
  // VIEW 1: QUIZ CONFIGURATION & SETUP SCREEN
  // ==========================================
  if (!isQuizActive) {
    const accuracy = stats.totalAttempted > 0 
      ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100) 
      : 0;

    const topicLabel = 
      selectedCategory === 'limits' ? 'Limits' :
      selectedCategory === 'derivatives' ? 'Derivatives' :
      selectedCategory === 'integration' ? 'Integration' : 'Mixed Calculus';

    const diffLabel = 
      selectedDifficulty === 'easy' ? 'Easy' :
      selectedDifficulty === 'medium' ? 'Intermediate' :
      selectedDifficulty === 'hard' ? 'Hard' : 'Mixed (All Levels)';

    return (
      <div className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col max-w-5xl mx-auto space-y-6">
        
        {/* Header banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Calculus Examination System</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Calculus Examination Quiz
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Configure topics, difficulty, and question counts with full textbook step-by-step verification.
            </p>
          </div>

          <button
            onClick={() => onNavigateToLessons()}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>Textbook Lessons</span>
          </button>
        </div>

        {/* Exam Score & Progress Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Questions Attempted
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalAttempted}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Correct Answers
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.totalCorrect}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Overall Accuracy
            </span>
            <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {accuracy}%
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Best Exam Score
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
              {stats.bestExamScore ? `${stats.bestExamScore.percentage}%` : '—'}
            </div>
          </div>
        </div>

        {/* 1. SELECT TOPIC CATEGORY */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              1. Choose Topic Category
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Card: LIMITS */}
            <div
              onClick={() => setSelectedCategory('limits')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedCategory === 'limits'
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/50 border-indigo-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400">
                    LIMITS
                  </span>
                  {selectedCategory === 'limits' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <div className="py-2 text-center">
                  <MathView math="\lim_{x \to a} f(x)" size="base" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Direct substitution, 0/0 factoring, trigonometric limit theorems.
                </p>
              </div>
            </div>

            {/* Card: DERIVATIVES */}
            <div
              onClick={() => setSelectedCategory('derivatives')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedCategory === 'derivatives'
                  ? 'bg-cyan-50/70 dark:bg-cyan-950/50 border-cyan-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-400">
                    DERIVATIVES
                  </span>
                  {selectedCategory === 'derivatives' && <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
                </div>
                <div className="py-2 text-center">
                  <MathView math="\frac{dy}{dx} = 2x" size="base" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Power rule, product & quotient rules, chain rule, trigonometric & exp derivatives.
                </p>
              </div>
            </div>

            {/* Card: INTEGRATION */}
            <div
              onClick={() => setSelectedCategory('integration')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedCategory === 'integration'
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
                    INTEGRATION
                  </span>
                  {selectedCategory === 'integration' && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <div className="py-2 text-center">
                  <MathView math="\int x\,dx = \frac{x^2}{2} + C" size="base" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Indefinite & definite integrals, constant of integration + C, substitution basics.
                </p>
              </div>
            </div>

            {/* Card: MIXED CALCULUS */}
            <div
              onClick={() => setSelectedCategory('mixed')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedCategory === 'mixed'
                  ? 'bg-purple-50/70 dark:bg-purple-950/50 border-purple-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-purple-600 dark:text-purple-400">
                    MIXED CALCULUS
                  </span>
                  {selectedCategory === 'mixed' && <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                </div>
                <div className="py-2 text-center">
                  <MathView math="\lim, \, \frac{d}{dx}, \, \int" size="base" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Comprehensive examination covering all 3 major calculus branches.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 2. DIFFICULTY & NUMBER OF QUESTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Difficulty Tier */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              2. Select Difficulty
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'Mixed' },
                { id: 'easy', label: 'Easy' },
                { id: 'medium', label: 'Interm.' },
                { id: 'hard', label: 'Hard' }
              ].map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id as QuizDifficulty)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDifficulty === diff.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {selectedDifficulty === 'easy' && 'Focuses on foundational formulas and direct substitutions.'}
              {selectedDifficulty === 'medium' && 'Focuses on multi-step calculations and intermediate rule applications.'}
              {selectedDifficulty === 'hard' && 'Focuses on multi-step reasoning, product/chain rules, and standard theorems.'}
              {selectedDifficulty === 'all' && 'Combines Easy, Intermediate, and Hard questions in balanced proportion.'}
            </p>
          </div>

          {/* NUMBER OF QUESTIONS */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-indigo-500" />
                <span>3. Number of Questions</span>
              </span>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                {effectiveQuestionCount} Questions
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {([5, 10, 15, 20, 25, 30] as const).map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setQuestionCountPreset(cnt)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    questionCountPreset === cnt
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cnt}
                </button>
              ))}

              <button
                onClick={() => setQuestionCountPreset('custom')}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  questionCountPreset === 'custom'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Custom
              </button>
            </div>

            {/* Custom Input Field */}
            {questionCountPreset === 'custom' && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                <label htmlFor="custom-q-count" className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                  How many questions? (1–50):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="custom-q-count"
                    type="number"
                    min={1}
                    max={50}
                    value={customCountInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Disallow negative sign or decimal
                      if (val === '' || /^\d+$/.test(val)) {
                        setCustomCountInput(val);
                      }
                    }}
                    className="w-20 px-3 py-1.5 text-center text-sm font-bold rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    placeholder="18"
                  />
                  <span className="text-xs text-slate-400 font-semibold">Q's</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* 4. MODE & FOCUS */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            4. Quiz Mode & Focus
          </span>
          <div className="flex flex-wrap items-center gap-3">
            
            <button
              onClick={() => setMode('exam')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'exam'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Exam Mode (Scored & Review)</span>
            </button>

            <button
              onClick={() => setMode('practice')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'practice'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Practice Mode (Instant Feedback)</span>
            </button>

            <button
              onClick={() => setOnlyImportant(!onlyImportant)}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                onlyImportant
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-800 dark:text-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Star className={`w-4 h-4 ${onlyImportant ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
              <span>⭐ Important Questions Only</span>
            </button>

          </div>
        </div>

        {/* 5. QUIZ CONFIGURATION SUMMARY & START BUTTON */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 dark:bg-slate-950 text-white space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quiz Configuration Summary
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" /> Ready to Launch
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Topic:</span>
              <span className="font-extrabold text-sm text-white">{topicLabel}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Difficulty:</span>
              <span className="font-extrabold text-sm text-indigo-300">{diffLabel}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions:</span>
              <span className="font-extrabold text-sm text-emerald-400">{effectiveQuestionCount} Questions</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Mode:</span>
              <span className="font-extrabold text-sm text-amber-300">
                {mode === 'exam' ? 'Exam Simulation' : 'Practice'}
              </span>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>START QUIZ ({effectiveQuestionCount} QUESTIONS)</span>
          </button>
        </div>

      </div>
    );
  }

  // ==========================================
  // VIEW 2: EXAM COMPLETED SUMMARY & REVIEW MISTAKES
  // ==========================================
  if (isExamCompleted && examResults) {
    const topicLabel = 
      selectedCategory === 'limits' ? 'Limits' :
      selectedCategory === 'derivatives' ? 'Derivatives' :
      selectedCategory === 'integration' ? 'Integration' : 'Mixed Calculus';

    const diffLabel = 
      selectedDifficulty === 'easy' ? 'Easy' :
      selectedDifficulty === 'medium' ? 'Intermediate' :
      selectedDifficulty === 'hard' ? 'Hard' : 'Mixed (All Levels)';

    return (
      <div className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col max-w-4xl mx-auto space-y-6">
        
        {/* Exam Score Summary Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-5">
          
          <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Examination Results
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Score: {examResults.correct} / {examResults.total}
            </h2>
            <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
              Percentage: {examResults.percentage}%
            </div>
          </div>

          {/* Config Details */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Topic: <strong className="text-slate-900 dark:text-white">{topicLabel}</strong></span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-semibold text-slate-600 dark:text-slate-400">Difficulty: <strong className="text-slate-900 dark:text-white">{diffLabel}</strong></span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-semibold text-slate-600 dark:text-slate-400">Questions: <strong className="text-slate-900 dark:text-white">{examResults.total}</strong></span>
          </div>

          {/* Quick breakdown metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                Correct
              </span>
              <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                {examResults.correct}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60">
              <span className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400 block">
                Incorrect
              </span>
              <span className="text-xl font-black text-red-700 dark:text-red-300">
                {examResults.incorrect}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Performance
              </span>
              <span className="text-xl font-black text-slate-800 dark:text-slate-200">
                {examResults.percentage >= 80 ? 'Distinction' : examResults.percentage >= 60 ? 'Pass' : 'Review Needed'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {examResults.incorrect > 0 && (
              <button
                onClick={() => setShowMistakesOnly(!showMistakesOnly)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  showMistakesOnly
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900'
                }`}
              >
                <span>{showMistakesOnly ? 'Showing Mistakes Only' : `REVIEW MISTAKES (${examResults.incorrect})`}</span>
              </button>
            )}

            <button
              onClick={handleStartQuiz}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>TRY AGAIN</span>
            </button>

            <button
              onClick={handleResetQuiz}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <span>NEW QUIZ</span>
            </button>
          </div>

        </div>

        {/* Review Questions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              {showMistakesOnly ? 'Reviewing Incorrect Answers' : 'Full Examination Review'}
            </h3>
            <span className="text-xs text-slate-400">
              {showMistakesOnly ? `${examResults.mistakes.length} mistakes` : `${activeQuizQuestions.length} total questions`}
            </span>
          </div>

          <div className="space-y-4">
            {(showMistakesOnly ? examResults.mistakes.map((m) => m.question) : activeQuizQuestions).map((q, idx) => {
              const uAnsId = userAnswers[q.id];
              const isCorrect = uAnsId === q.correctOptionId;

              const uOption = q.options.find((o) => o.id === uAnsId);
              const cOption = q.options.find((o) => o.id === q.correctOptionId);

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border space-y-3 ${
                    isCorrect
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      : 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                        {q.questionPrompt}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {q.isImportant && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                          ⭐ Important
                        </span>
                      )}
                      {isCorrect ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )}
                    </div>
                  </div>

                  {q.questionMath && (
                    <div className="py-2.5 px-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                      <MathView math={q.questionMath} block size="lg" />
                    </div>
                  )}

                  {/* Answers Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className={`p-2.5 rounded-xl border ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900' : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900'}`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                        Your Answer:
                      </span>
                      <div className="font-semibold pt-0.5">
                        {uOption ? (
                          uOption.math ? <MathView math={uOption.math} size="sm" /> : uOption.text
                        ) : (
                          <span className="italic text-slate-400">Unanswered</span>
                        )}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70 text-emerald-800 dark:text-emerald-300">
                        Correct Answer:
                      </span>
                      <div className="font-semibold text-emerald-900 dark:text-emerald-200 pt-0.5">
                        {cOption?.math ? <MathView math={cOption.math} size="sm" /> : cOption?.text}
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">
                      Textbook Solution & Mathematical Derivation:
                    </span>
                    {q.explanationMath && (
                      <div className="py-1 text-center">
                        <MathView math={q.explanationMath} block size="sm" />
                      </div>
                    )}
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {q.explanationText}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    );
  }

  // ==========================================
  // VIEW 3: ACTIVE QUIZ QUESTIONS (EXAM & PRACTICE)
  // ==========================================
  if (!currentQuestion) {
    return null;
  }

  const selectedOpt = userAnswers[currentQuestion.id];
  const isPracticeChecked = mode === 'practice' && checkedInPractice[currentQuestion.id];
  const isCorrectInPractice = isPracticeChecked && selectedOpt === currentQuestion.correctOptionId;

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col max-w-4xl mx-auto space-y-6">
      
      {/* Top Quiz Navigation & Progress Bar */}
      <div className="space-y-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <button
            onClick={handleResetQuiz}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Quiz</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {mode === 'exam' ? 'Exam Mode' : 'Practice Mode'}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Question {currentIndex + 1} of {activeQuizQuestions.length}
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / activeQuizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {currentQuestion.category}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
              currentQuestion.difficulty === 'easy'
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : currentQuestion.difficulty === 'medium'
                ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>

          {currentQuestion.isImportant && (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>⭐ Important Question</span>
            </span>
          )}
        </div>

        {/* Question Prompt */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.questionPrompt}
          </h3>

          {currentQuestion.questionMath && (
            <div className="py-4 px-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <MathView math={currentQuestion.questionMath} block size="xl" />
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedOpt === opt.id;
            const isCorrect = opt.id === currentQuestion.correctOptionId;

            let buttonStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600';

            if (mode === 'practice' && isPracticeChecked) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
              } else if (isSelected) {
                buttonStyle = 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-200';
              }
            } else if (isSelected) {
              buttonStyle = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-900 dark:text-indigo-200 font-bold';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                disabled={mode === 'practice' && isPracticeChecked}
                className={`p-4 rounded-2xl border text-center transition-all flex items-center justify-center cursor-pointer min-h-[60px] ${buttonStyle}`}
              >
                {opt.math ? (
                  <MathView math={opt.math} size="lg" />
                ) : (
                  <span className="font-semibold text-xs sm:text-sm">{opt.text}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback (Practice Mode) */}
        {mode === 'practice' && isPracticeChecked && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className={`p-4 rounded-xl border flex items-center gap-2 font-bold text-xs sm:text-sm ${
              isCorrectInPractice 
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' 
                : 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}>
              {isCorrectInPractice ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
              <span>{isCorrectInPractice ? '✓ Correct' : '✗ Incorrect'}</span>
            </div>

            {/* Explanation card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Textbook Explanation:
              </span>
              {currentQuestion.explanationMath && (
                <div className="py-1 text-center">
                  <MathView math={currentQuestion.explanationMath} block size="base" />
                </div>
              )}
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentQuestion.explanationText}
              </p>
            </div>
          </div>
        )}

        {/* Navigation / Next Question Buttons */}
        <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex < activeQuizQuestions.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            mode === 'exam' ? (
              <button
                onClick={handleSubmitExam}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Submit Examination</span>
              </button>
            ) : (
              <button
                onClick={handleResetQuiz}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Complete Practice</span>
              </button>
            )
          )}
        </div>

      </div>

    </div>
  );
};
