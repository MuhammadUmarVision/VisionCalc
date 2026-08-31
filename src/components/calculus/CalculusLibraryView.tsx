import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Info, 
  Check, 
  RotateCcw,
  Compass,
  LineChart,
  Bot,
  Layers,
  GraduationCap,
  Award,
  Star,
  FileQuestion
} from 'lucide-react';
import { MathView } from '../common/MathView';
import { 
  CALCULUS_TEXTBOOK_DATA, 
  CalculusCategoryData, 
  TextbookExample,
  TextbookPractice
} from '../../data/calculusTextbookData';
import { CalculusQuizView } from './CalculusQuizView';

interface CalculusLibraryViewProps {
  onNavigateToTutor: (prefillPrompt?: string) => void;
  onNavigateToGraph: (expression?: string) => void;
}

type SubSectionTab = 'idea' | 'rules' | 'trig' | 'examples' | 'practice';

export const CalculusLibraryView: React.FC<CalculusLibraryViewProps> = ({
  onNavigateToTutor,
  onNavigateToGraph,
}) => {
  // Top-level mode: 'lessons' | 'quiz'
  const [viewMode, setViewMode] = useState<'lessons' | 'quiz'>('lessons');

  // Navigation State
  // selectedCategory: null means we are at the home screen (3 big cards)
  const [selectedCategoryId, setSelectedCategoryId] = useState<'limits' | 'derivatives' | 'integration' | null>(null);
  const [activeTab, setActiveTab] = useState<SubSectionTab>('idea');

  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState<Record<string, boolean>>({});

  const currentCategoryData: CalculusCategoryData | null = selectedCategoryId 
    ? CALCULUS_TEXTBOOK_DATA[selectedCategoryId] 
    : null;

  const handleSelectCategory = (catId: 'limits' | 'derivatives' | 'integration') => {
    setSelectedCategoryId(catId);
    setActiveTab('idea');
    setViewMode('lessons');
  };

  const handleBackToHome = () => {
    setSelectedCategoryId(null);
    setActiveTab('idea');
  };

  const handleOpenQuiz = () => {
    setViewMode('quiz');
  };

  const handleSelectPracticeOption = (questionId: string, optionId: string) => {
    if (practiceSubmitted[questionId]) return;
    setPracticeAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitPractice = (questionId: string) => {
    if (!practiceAnswers[questionId]) return;
    setPracticeSubmitted((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleResetPractice = (questionId: string) => {
    setPracticeAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setPracticeSubmitted((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const tabList: { id: SubSectionTab; label: string }[] = [
    { id: 'idea', label: '1. Basic Idea' },
    { id: 'rules', label: '2. Rules & Notation' },
    { id: 'trig', label: '3. Special & Trig' },
    { id: 'examples', label: '4. Step Examples' },
    { id: 'practice', label: '5. Practice' },
  ];

  // If Quiz view is active, render CalculusQuizView
  if (viewMode === 'quiz') {
    return (
      <CalculusQuizView
        onNavigateToLessons={(categoryId) => {
          setViewMode('lessons');
          if (categoryId) {
            setSelectedCategoryId(categoryId);
            setActiveTab('idea');
          }
        }}
        onNavigateToTutor={onNavigateToTutor}
      />
    );
  }

  // ==========================================
  // VIEW 1: CALCULUS BASICS HOME (3 CLEAN CARDS + QUIZ SHORTCUT)
  // ==========================================
  if (!selectedCategoryId || !currentCategoryData) {
    return (
      <div className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-10 flex flex-col max-w-5xl mx-auto space-y-8">
        
        {/* Textbook Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Interactive Mathematics Textbook</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Calculus Basics
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Master the core foundations of calculus with clear, textbook-formatted notation, visual intuition, and step-by-step guidance.
          </p>

          {/* Mode Switcher Buttons */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mt-2">
            <button
              onClick={() => setViewMode('lessons')}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs flex items-center gap-1.5 transition-all"
            >
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>Textbook Lessons</span>
            </button>
            <button
              onClick={() => setViewMode('quiz')}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Examination Quiz</span>
            </button>
          </div>
        </div>

        {/* 3 Major Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          
          {/* Card 1: LIMITS */}
          <div 
            onClick={() => handleSelectCategory('limits')}
            className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer text-center"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-100 dark:border-indigo-900/50">
                lim
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  LIMITS
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Understand how a function behaves as a value approaches a point.
                </p>
              </div>

              {/* Textbook Math Notation Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800/80 my-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Example
                </span>
                <MathView math="\lim_{x \to a} f(x)" block size="xl" />
              </div>
            </div>

            <div className="pt-5">
              <button 
                onClick={() => handleSelectCategory('limits')}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all group-hover:scale-[1.02]"
              >
                <span>Learn Limits</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: DERIVATIVES */}
          <div 
            onClick={() => handleSelectCategory('derivatives')}
            className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer text-center"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-lg border border-cyan-100 dark:border-cyan-900/50">
                dy/dx
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  DERIVATIVES
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Learn how to find the rate of change and slope of a function.
                </p>
              </div>

              {/* Textbook Math Notation Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800/80 my-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Example
                </span>
                <MathView math="\frac{dy}{dx}" block size="xl" />
              </div>
            </div>

            <div className="pt-5">
              <button 
                onClick={() => handleSelectCategory('derivatives')}
                className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all group-hover:scale-[1.02]"
              >
                <span>Learn Derivatives</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: INTEGRATION */}
          <div 
            onClick={() => handleSelectCategory('integration')}
            className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer text-center"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-100 dark:border-emerald-900/50 font-serif">
                ∫
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  INTEGRATION
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Learn how integration is used to find accumulated quantities and areas.
                </p>
              </div>

              {/* Textbook Math Notation Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800/80 my-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Example
                </span>
                <MathView math="\int f(x)\,dx" block size="xl" />
              </div>
            </div>

            <div className="pt-5">
              <button 
                onClick={() => handleSelectCategory('integration')}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all group-hover:scale-[1.02]"
              >
                <span>Learn Integration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Examination Quiz Banner */}
        <div 
          onClick={handleOpenQuiz}
          className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border-2 border-amber-300 dark:border-amber-700/60 hover:border-amber-500 dark:hover:border-amber-500 transition-all cursor-pointer flex flex-col md:flex-row items-center justify-between gap-5 shadow-xs"
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                  Exam-Focused Calculus Quiz & Practice
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  ⭐ Exam Prep
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
                Test concepts across Limits, Derivatives, and Integration with MCQs, True/False, formulas, and full Examination Mode with mistake review.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenQuiz}
            className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs sm:text-sm shadow-md hover:scale-105 transition-all shrink-0 flex items-center gap-2"
          >
            <span>Launch Exam Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Textbook Companion Banner */}
        <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Textbook-Accurate Math Formatting
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All formulas are rendered using standard typography with fractions, roots, integral signs, and superscripts.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTutor('Explain the core difference between derivatives and integrals with an example')}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4 text-indigo-500" />
            <span>Ask AI Tutor</span>
          </button>
        </div>

      </div>
    );
  }

  // ==========================================
  // VIEW 2: CATEGORY STUDY PROGRESSION
  // ==========================================
  return (
    <div className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col max-w-5xl mx-auto space-y-6">
      
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleBackToHome}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Back to All Topics"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">All Topics</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Calculus Basics
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-xs font-extrabold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                {currentCategoryData.title}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentCategoryData.title}
            </h2>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
          {(['limits', 'derivatives', 'integration'] as const).map((catId) => (
            <button
              key={catId}
              onClick={() => handleSelectCategory(catId)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                selectedCategoryId === catId
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {catId}
            </button>
          ))}
        </div>

      </div>

      {/* Structured Topic Progression Tabs (1. Basic Idea -> 2. Rules -> 3. Special -> 4. Examples -> 5. Practice) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-100 dark:border-slate-800/60">
        {tabList.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREA */}
      <div className="space-y-6">

        {/* ---------------------------------------------------- */}
        {/* TAB 1: BASIC IDEA                                    */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'idea' && (
          <div className="space-y-6">
            
            {/* Primary Explanation Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  Concept Overview
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {currentCategoryData.basicIdea.heading}
                </h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                  {currentCategoryData.basicIdea.definition}
                </p>
              </div>

              {/* Textbook Primary Formula Showcase */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Textbook Mathematical Statement
                </span>
                <div className="py-2">
                  <MathView math={currentCategoryData.basicIdea.primaryFormula} block size="2xl" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic max-w-lg mx-auto">
                  {currentCategoryData.basicIdea.intuition}
                </p>
              </div>

              {/* Concept Callout Box */}
              {currentCategoryData.basicIdea.keyConceptBox && (
                <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>{currentCategoryData.basicIdea.keyConceptBox.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                    {currentCategoryData.basicIdea.keyConceptBox.text}
                  </p>
                  {currentCategoryData.basicIdea.keyConceptBox.math && (
                    <div className="pt-2 text-center">
                      <MathView math={currentCategoryData.basicIdea.keyConceptBox.math} block size="lg" />
                    </div>
                  )}
                </div>
              )}

              {/* Quick Jump Action */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onNavigateToGraph(selectedCategoryId === 'derivatives' ? 'x^2' : 'x')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <LineChart className="w-4 h-4 text-cyan-600" />
                  <span>Plot in Graph Studio</span>
                </button>

                <button
                  onClick={() => setActiveTab('rules')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>Continue to Rules & Notation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: RULES & NOTATION                              */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'rules' && (
          <div className="space-y-6">

            {/* Optional Notation Section (for derivatives & integration) */}
            {currentCategoryData.notationSection && (
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                    Notation Guide
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {currentCategoryData.notationSection.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {currentCategoryData.notationSection.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {currentCategoryData.notationSection.notations.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
                    >
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                        {item.name}
                      </span>
                      <div className="py-2 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <MathView math={item.math} block size="lg" />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                        {item.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Rules Section */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  Fundamental Formulas
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {currentCategoryData.rulesHeading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {currentCategoryData.rulesDescription}
                </p>
              </div>

              {/* Rules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {currentCategoryData.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white block">
                        {rule.name}
                      </span>
                      
                      {/* Formula Card */}
                      <div className="py-3 px-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
                        <MathView math={rule.formula} block size="xl" />
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {rule.description}
                      </p>
                    </div>

                    {rule.exampleMath && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Example:
                        </span>
                        <div className="bg-slate-100 dark:bg-slate-900/60 p-2 rounded-lg text-center">
                          <MathView math={rule.exampleMath} block size="sm" />
                        </div>
                        {rule.exampleNote && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                            {rule.exampleNote}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Next Navigation */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setActiveTab('trig')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>Continue to Special & Trig Forms</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: SPECIAL & TRIGONOMETRIC FORMS                 */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'trig' && (
          <div className="space-y-6">

            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                  Circular & Transcendental Mathematics
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {currentCategoryData.specialSection.heading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {currentCategoryData.specialSection.description}
                </p>
              </div>

              {/* Crucial Radians / Mathematical Note Callout */}
              {currentCategoryData.specialSection.importantNote && (
                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                      Crucial Mathematical Condition:
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-300 leading-relaxed">
                      {currentCategoryData.specialSection.importantNote}
                    </p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400">
                      Calculus geometric derivations rely strictly on arc length in radians (<MathView math="s = r\theta" size="sm" />). In degree mode, an extra factor of <MathView math="\frac{\pi}{180}" size="sm" /> appears.
                    </p>
                  </div>
                </div>
              )}

              {/* Special Formulas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentCategoryData.specialSection.formulas.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white block">
                        {item.name}
                      </span>
                      
                      <div className="py-3 px-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
                        <MathView math={item.formula} block size="xl" />
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {item.exampleNote && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                          💡 {item.exampleNote}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Next Navigation */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setActiveTab('examples')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>Continue to Step-by-Step Examples</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: STEP-BY-STEP EXAMPLES                         */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'examples' && (
          <div className="space-y-6">

            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  Worked Textbook Solutions
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {currentCategoryData.examplesHeading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Follow the exact methodical process used by mathematicians to solve these standard baseline problems.
                </p>
              </div>

              {/* Examples List */}
              <div className="space-y-6">
                {currentCategoryData.examples.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {ex.questionText}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        Method: {ex.method}
                      </span>
                    </div>

                    {/* Question Math Display */}
                    <div className="py-2 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                        Question
                      </span>
                      <MathView math={ex.questionMath} block size="xl" />
                    </div>

                    {/* Steps Walk */}
                    <div className="space-y-3 pt-1">
                      {ex.steps.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                              Step {step.stepNumber}:
                            </span>
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {step.title}
                            </span>
                          </div>

                          {step.math && (
                            <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg text-center font-serif">
                              <MathView math={step.math} block size="base" />
                            </div>
                          )}

                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {step.explanation}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Final Answer Banner */}
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                        Final Answer:
                      </span>
                      <div className="text-emerald-900 dark:text-emerald-100 font-bold">
                        <MathView math={ex.finalAnswerMath} size="xl" />
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Next Navigation */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setActiveTab('practice')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>Continue to Practice</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: PRACTICE                                      */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'practice' && (
          <div className="space-y-6">

            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                    Interactive Checkpoints
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {currentCategoryData.practiceHeading}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Test your understanding of {currentCategoryData.title.toLowerCase()}. Receive immediate feedback and textbook explanations.
                  </p>
                </div>
              </div>

              {/* Practice Questions List */}
              <div className="space-y-6">
                {currentCategoryData.practiceQuestions.map((q, idx) => {
                  const selectedOpt = practiceAnswers[q.id];
                  const isSubmitted = practiceSubmitted[q.id];
                  const isCorrect = isSubmitted && selectedOpt === q.correctOptionId;

                  return (
                    <div
                      key={q.id}
                      className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4"
                    >
                      {/* Question Header */}
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                          {q.questionPrompt}
                        </span>
                      </div>

                      {/* Question Formula in KaTeX */}
                      <div className="py-4 px-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                        <MathView math={q.questionMath} block size="xl" />
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt) => {
                          const isOptionSelected = selectedOpt === opt.id;
                          const isThisOptionCorrect = opt.id === q.correctOptionId;

                          let style = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600';

                          if (isSubmitted) {
                            if (isThisOptionCorrect) {
                              style = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                            } else if (isOptionSelected) {
                              style = 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-200';
                            }
                          } else if (isOptionSelected) {
                            style = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold';
                          }

                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleSelectPracticeOption(q.id, opt.id)}
                              disabled={isSubmitted}
                              className={`p-4 rounded-xl border text-center transition-all flex items-center justify-center cursor-pointer ${style}`}
                            >
                              <MathView math={opt.math} size="lg" />
                            </button>
                          );
                        })}
                      </div>

                      {/* Submit / Reset Actions & Feedback */}
                      <div className="pt-2">
                        {!isSubmitted ? (
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleSubmitPractice(q.id)}
                              disabled={!selectedOpt}
                              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-40 transition-all cursor-pointer"
                            >
                              Submit Answer
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3 animate-in fade-in duration-200">
                            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                              isCorrect 
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' 
                                : 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300'
                            }`}>
                              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                                {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                                <span>{isCorrect ? 'Correct! Excellent understanding.' : 'Try Again! Review the explanation below:'}</span>
                              </div>
                              <button
                                onClick={() => handleResetPractice(q.id)}
                                className="text-xs underline font-semibold cursor-pointer hover:opacity-80 flex items-center gap-1"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Retry</span>
                              </button>
                            </div>

                            {/* Detailed Explanation */}
                            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                                Solution Walkthrough:
                              </span>
                              <div className="py-1 text-center font-serif">
                                <MathView math={q.explanationMath} block size="base" />
                              </div>
                              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {q.explanationText}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Completion Banner */}
              <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="font-bold text-xs sm:text-sm text-indigo-900 dark:text-indigo-200">
                    Finished studying {currentCategoryData.title.toLowerCase()}?
                  </span>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                    Explore other calculus chapters or ask the AI Tutor for custom derivations.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleOpenQuiz}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Take {currentCategoryData.title} Quiz</span>
                  </button>
                  <button
                    onClick={handleBackToHome}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                  >
                    All Topics
                  </button>
                  <button
                    onClick={() => onNavigateToTutor(`Give me a practice problem on ${currentCategoryData.title.toLowerCase()}`)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
                  >
                    AI Tutor
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
