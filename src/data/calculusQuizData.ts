export type QuizCategory = 'limits' | 'derivatives' | 'integration' | 'mixed';
export type QuizDifficulty = 'all' | 'easy' | 'medium' | 'hard';
export type QuizQuestionType = 'mcq' | 'true_false' | 'formula' | 'concept';

export interface QuizQuestion {
  id: string;
  category: 'limits' | 'derivatives' | 'integration';
  difficulty: 'easy' | 'medium' | 'hard';
  isImportant?: boolean;
  type: QuizQuestionType;
  questionPrompt: string;
  questionMath?: string;
  options: {
    id: string;
    text?: string;
    math?: string;
  }[];
  correctOptionId: string;
  explanationMath?: string;
  explanationText: string;
}

export interface QuizProgressRecord {
  totalAttempted: number;
  totalCorrect: number;
  bestExamScore: {
    score: number;
    total: number;
    percentage: number;
    category: string;
    difficulty: string;
    date: string;
  } | null;
}

export const VERIFIED_CALCULUS_QUESTIONS: QuizQuestion[] = [
  // ==========================================
  // LIMITS — EASY
  // ==========================================
  {
    id: 'lim-e-1',
    category: 'limits',
    difficulty: 'easy',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Evaluate the basic identity limit by direct substitution:',
    questionMath: '\\lim_{x \\to 2} x',
    options: [
      { id: 'a', math: '0' },
      { id: 'b', math: '2' },
      { id: 'c', math: '4' },
      { id: 'd', math: '\\text{Undefined}' }
    ],
    correctOptionId: 'b',
    explanationMath: '\\lim_{x \\to 2} x = 2',
    explanationText: 'By direct substitution, replacing x with 2 directly gives 2.'
  },
  {
    id: 'lim-e-2',
    category: 'limits',
    difficulty: 'easy',
    isImportant: false,
    type: 'mcq',
    questionPrompt: 'Evaluate the limit of a constant value:',
    questionMath: '\\lim_{x \\to 5} 9',
    options: [
      { id: 'a', math: '5' },
      { id: 'b', math: '45' },
      { id: 'c', math: '9' },
      { id: 'd', math: '0' }
    ],
    correctOptionId: 'c',
    explanationMath: '\\lim_{x \\to a} c = c \\implies \\lim_{x \\to 5} 9 = 9',
    explanationText: 'The limit of a constant function is always that constant.'
  },
  {
    id: 'lim-e-3',
    category: 'limits',
    difficulty: 'easy',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Evaluate the linear polynomial limit:',
    questionMath: '\\lim_{x \\to 3} (2x + 1)',
    options: [
      { id: 'a', math: '6' },
      { id: 'b', math: '7' },
      { id: 'c', math: '8' },
      { id: 'd', math: '5' }
    ],
    correctOptionId: 'b',
    explanationMath: '\\lim_{x \\to 3} (2x + 1) = 2(3) + 1 = 6 + 1 = 7',
    explanationText: 'Substitute x = 3 directly: 2(3) + 1 = 7.'
  },
  {
    id: 'lim-e-4',
    category: 'limits',
    difficulty: 'easy',
    type: 'true_false',
    questionPrompt: 'True or False: If a function f(x) is continuous at x = a, then the limit equals f(a).',
    questionMath: '\\lim_{x \\to a} f(x) = f(a)',
    options: [
      { id: 'a', text: 'True' },
      { id: 'b', text: 'False' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\lim_{x \\to a} f(x) = f(a)',
    explanationText: 'This is the exact mathematical definition of continuity at x = a.'
  },
  {
    id: 'lim-e-5',
    category: 'limits',
    difficulty: 'easy',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Evaluate the limit of a quadratic term as x approaches 4:',
    questionMath: '\\lim_{x \\to 4} (x^2 - 6)',
    options: [
      { id: 'a', math: '10' },
      { id: 'b', math: '8' },
      { id: 'c', math: '16' },
      { id: 'd', math: '2' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\lim_{x \\to 4} (x^2 - 6) = 4^2 - 6 = 16 - 6 = 10',
    explanationText: 'Substitute x = 4: (4)² - 6 = 16 - 6 = 10.'
  },
  {
    id: 'lim-e-6',
    category: 'limits',
    difficulty: 'easy',
    type: 'formula',
    questionPrompt: 'What is the sum rule for limits?',
    options: [
      { id: 'a', math: '\\lim_{x \\to a} [f(x) + g(x)] = \\lim_{x \\to a} f(x) + \\lim_{x \\to a} g(x)' },
      { id: 'b', math: '\\lim_{x \\to a} [f(x) + g(x)] = \\lim_{x \\to a} f(x) \\cdot \\lim_{x \\to a} g(x)' },
      { id: 'c', math: '\\lim_{x \\to a} [f(x) + g(x)] = f(a) \\cdot g(a)' },
      { id: 'd', math: '\\lim_{x \\to a} [f(x) + g(x)] = 0' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\lim_{x \\to a}[f(x) + g(x)] = \\lim_{x \\to a}f(x) + \\lim_{x \\to a}g(x)',
    explanationText: 'The limit of a sum equals the sum of the individual limits.'
  },
  {
    id: 'lim-e-7',
    category: 'limits',
    difficulty: 'easy',
    isImportant: false,
    type: 'mcq',
    questionPrompt: 'Evaluate the basic rational limit by direct substitution:',
    questionMath: '\\lim_{x \\to 1} \\frac{3x + 5}{x + 1}',
    options: [
      { id: 'a', math: '4' },
      { id: 'b', math: '8' },
      { id: 'c', math: '2' },
      { id: 'd', math: '\\text{Undefined}' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\frac{3(1) + 5}{1 + 1} = \\frac{8}{2} = 4',
    explanationText: 'Since the denominator is non-zero (1+1=2), direct substitution gives 8/2 = 4.'
  },
  {
    id: 'lim-e-8',
    category: 'limits',
    difficulty: 'easy',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Evaluate the limit of 1/x as x approaches infinity:',
    questionMath: '\\lim_{x \\to \\infty} \\frac{1}{x}',
    options: [
      { id: 'a', math: '0' },
      { id: 'b', math: '1' },
      { id: 'c', math: '\\infty' },
      { id: 'd', math: '-1' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\lim_{x \\to \\infty} \\frac{1}{x} = 0',
    explanationText: 'As the denominator grows arbitrarily large, the fraction approaches 0.'
  },

  // ==========================================
  // LIMITS — MEDIUM (INTERMEDIATE)
  // ==========================================
  {
    id: 'lim-m-1',
    category: 'limits',
    difficulty: 'medium',
    isImportant: true,
    type: 'formula',
    questionPrompt: 'What is the value of the fundamental trigonometric limit (with x in radians)?',
    questionMath: '\\lim_{x \\to 0} \\frac{\\sin x}{x}',
    options: [
      { id: 'a', math: '0' },
      { id: 'b', math: '1' },
      { id: 'c', math: '\\infty' },
      { id: 'd', math: '\\pi' }
    ],
    correctOptionId: 'b',
    explanationMath: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
    explanationText: 'This standard trigonometric limit equals 1 when x is measured in radians.'
  },
  {
    id: 'lim-m-2',
    category: 'limits',
    difficulty: 'medium',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Evaluate the limit by factoring the indeterminate 0/0 form:',
    questionMath: '\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}',
    options: [
      { id: 'a', math: '0' },
      { id: 'b', math: '2' },
      { id: 'c', math: '4' },
      { id: 'd', math: '\\text{Does not exist}' }
    ],
    correctOptionId: 'c',
    explanationMath: '\\lim_{x \\to 2} \\frac{(x - 2)(x + 2)}{x - 2} = \\lim_{x \\to 2} (x + 2) = 2 + 2 = 4',
    explanationText: 'Factor numerator as difference of squares (x-2)(x+2), cancel (x-2), and substitute x=2.'
  },
  {
    id: 'lim-m-3',
    category: 'limits',
    difficulty: 'medium',
    type: 'mcq',
    questionPrompt: 'Evaluate the quadratic limit as x approaches -1:',
    questionMath: '\\lim_{x \\to -1} (3x^2 - 2x + 4)',
    options: [
      { id: 'a', math: '9' },
      { id: 'b', math: '5' },
      { id: 'c', math: '7' },
      { id: 'd', math: '1' }
    ],
    correctOptionId: 'a',
    explanationMath: '3(-1)^2 - 2(-1) + 4 = 3(1) + 2 + 4 = 9',
    explanationText: 'Substitute x = -1 into each term: 3(1) + 2 + 4 = 9.'
  },
  {
    id: 'lim-m-4',
    category: 'limits',
    difficulty: 'medium',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Evaluate the algebraic limit by factoring:',
    questionMath: '\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}',
    options: [
      { id: 'a', math: '3' },
      { id: 'b', math: '6' },
      { id: 'c', math: '0' },
      { id: 'd', math: '9' }
    ],
    correctOptionId: 'b',
    explanationMath: '\\lim_{x \\to 3} \\frac{(x-3)(x+3)}{x-3} = \\lim_{x \\to 3} (x+3) = 3 + 3 = 6',
    explanationText: 'Cancel the common factor (x - 3) and evaluate x + 3 at x = 3 to get 6.'
  },
  {
    id: 'lim-m-5',
    category: 'limits',
    difficulty: 'medium',
    type: 'mcq',
    questionPrompt: 'Evaluate the rational limit at infinity:',
    questionMath: '\\lim_{x \\to \\infty} \\frac{4x^2 + 5}{2x^2 - 1}',
    options: [
      { id: 'a', math: '2' },
      { id: 'b', math: '4' },
      { id: 'c', math: '0' },
      { id: 'd', math: '\\infty' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\lim_{x \\to \\infty} \\frac{4 + 5/x^2}{2 - 1/x^2} = \\frac{4}{2} = 2',
    explanationText: 'Divide numerator and denominator by highest power x²: 4/2 = 2.'
  },
  {
    id: 'lim-m-6',
    category: 'limits',
    difficulty: 'medium',
    isImportant: true,
    type: 'formula',
    questionPrompt: 'What is the limit of (1 - cos x)/x as x approaches 0?',
    questionMath: '\\lim_{x \\to 0} \\frac{1 - \\cos x}{x}',
    options: [
      { id: 'a', math: '0' },
      { id: 'b', math: '1' },
      { id: 'c', math: '\\frac{1}{2}' },
      { id: 'd', math: '\\infty' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\lim_{x \\to 0} \\frac{1 - \\cos x}{x} = 0',
    explanationText: 'This is a standard trigonometric limit result equal to 0.'
  },

  // ==========================================
  // LIMITS — HARD
  // ==========================================
  {
    id: 'lim-h-1',
    category: 'limits',
    difficulty: 'hard',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Evaluate the trigonometric limit:',
    questionMath: '\\lim_{x \\to 0} \\frac{\\sin(3x)}{x}',
    options: [
      { id: 'a', math: '1' },
      { id: 'b', math: '3' },
      { id: 'c', math: '\\frac{1}{3}' },
      { id: 'd', math: '0' }
    ],
    correctOptionId: 'b',
    explanationMath: '\\lim_{x \\to 0} 3 \\cdot \\frac{\\sin(3x)}{3x} = 3 \\cdot 1 = 3',
    explanationText: 'Multiply and divide by 3: 3 × (sin(3x)/3x) → 3 × 1 = 3.'
  },
  {
    id: 'lim-h-2',
    category: 'limits',
    difficulty: 'hard',
    type: 'mcq',
    questionPrompt: 'Evaluate the limit involving rationalization:',
    questionMath: '\\lim_{x \\to 0} \\frac{\\sqrt{x + 4} - 2}{x}',
    options: [
      { id: 'a', math: '\\frac{1}{2}' },
      { id: 'b', math: '\\frac{1}{4}' },
      { id: 'c', math: '1' },
      { id: 'd', math: '0' }
    ],
    correctOptionId: 'b',
    explanationMath: '\\frac{(\\sqrt{x+4}-2)(\\sqrt{x+4}+2)}{x(\\sqrt{x+4}+2)} = \\frac{x}{x(\\sqrt{x+4}+2)} = \\frac{1}{\\sqrt{4}+2} = \\frac{1}{4}',
    explanationText: 'Multiply by conjugate (√(x+4)+2), simplify to 1/(√(x+4)+2), yielding 1/4.'
  },
  {
    id: 'lim-h-3',
    category: 'limits',
    difficulty: 'hard',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Evaluate the trigonometric limit ratio:',
    questionMath: '\\lim_{x \\to 0} \\frac{\\tan(5x)}{\\sin(2x)}',
    options: [
      { id: 'a', math: '\\frac{5}{2}' },
      { id: 'b', math: '\\frac{2}{5}' },
      { id: 'c', math: '1' },
      { id: 'd', math: '0' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\lim_{x \\to 0} \\frac{\\frac{\\tan(5x)}{5x} \\cdot 5}{\\frac{\\sin(2x)}{2x} \\cdot 2} = \\frac{1 \\cdot 5}{1 \\cdot 2} = \\frac{5}{2}',
    explanationText: 'Divide numerator and denominator by x and apply standard trigonometric limit theorems.'
  },
  {
    id: 'lim-h-4',
    category: 'limits',
    difficulty: 'hard',
    type: 'mcq',
    questionPrompt: 'Evaluate the Euler constant exponential limit:',
    questionMath: '\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n',
    options: [
      { id: 'a', math: '1' },
      { id: 'b', math: 'e' },
      { id: 'c', math: '\\infty' },
      { id: 'd', math: '0' }
    ],
    correctOptionId: 'b',
    explanationMath: '\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n = e \\approx 2.71828',
    explanationText: 'This is the classical definition of the mathematical constant e.'
  },

  // ==========================================
  // DERIVATIVES — EASY
  // ==========================================
  {
    id: 'der-e-1',
    category: 'derivatives',
    difficulty: 'easy',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Find the derivative using the basic Power Rule:',
    questionMath: '\\frac{d}{dx}(x^2)',
    options: [
      { id: 'a', math: 'x' },
      { id: 'b', math: '2x' },
      { id: 'c', math: 'x^2' },
      { id: 'd', math: '2' }
    ],
    correctOptionId: 'b',
    explanationMath: '\\frac{d}{dx}(x^2) = 2x^{2-1} = 2x',
    explanationText: 'Power rule d/dx(xⁿ) = n·xⁿ⁻¹ gives 2x.'
  },
  {
    id: 'der-e-2',
    category: 'derivatives',
    difficulty: 'easy',
    isImportant: false,
    type: 'mcq',
    questionPrompt: 'Find the derivative of the constant function:',
    questionMath: '\\frac{d}{dx}(14)',
    options: [
      { id: 'a', math: '14' },
      { id: 'b', math: '1' },
      { id: 'c', math: '0' },
      { id: 'd', math: '14x' }
    ],
    correctOptionId: 'c',
    explanationMath: '\\frac{d}{dx}(c) = 0 \\implies \\frac{d}{dx}(14) = 0',
    explanationText: 'The derivative of any constant is zero.'
  },
  {
    id: 'der-e-3',
    category: 'derivatives',
    difficulty: 'easy',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Find the derivative of the linear function:',
    questionMath: '\\frac{d}{dx}(5x)',
    options: [
      { id: 'a', math: '5' },
      { id: 'b', math: '5x' },
      { id: 'c', math: '0' },
      { id: 'd', math: 'x' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\frac{d}{dx}(5x) = 5 \\cdot 1 = 5',
    explanationText: 'The slope of y = 5x is constantly 5.'
  },
  {
    id: 'der-e-4',
    category: 'derivatives',
    difficulty: 'easy',
    type: 'formula',
    questionPrompt: 'Which rule states that the derivative of a sum is the sum of derivatives?',
    options: [
      { id: 'a', math: '\\frac{d}{dx}[f(x) + g(x)] = f\'(x) + g\'(x)' },
      { id: 'b', math: '\\frac{d}{dx}[f(x) \\cdot g(x)] = f\'(x) + g\'(x)' },
      { id: 'c', math: '\\frac{d}{dx}[f(g(x))] = f\'(x)g\'(x)' },
      { id: 'd', math: '\\frac{d}{dx}[f(x)/g(x)] = f\'(x)/g\'(x)' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\frac{d}{dx}[f(x) + g(x)] = f\'(x) + g\'(x)',
    explanationText: 'The sum rule permits term-by-term differentiation.'
  },
  {
    id: 'der-e-5',
    category: 'derivatives',
    difficulty: 'easy',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Differentiate the cubic term x³:',
    questionMath: '\\frac{d}{dx}(x^3)',
    options: [
      { id: 'a', math: '3x^2' },
      { id: 'b', math: '3x^3' },
      { id: 'c', math: 'x^2' },
      { id: 'd', math: '6x' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\frac{d}{dx}(x^3) = 3x^{3-1} = 3x^2',
    explanationText: 'Bring down 3 and reduce power by 1: 3x².'
  },
  {
    id: 'der-e-6',
    category: 'derivatives',
    difficulty: 'easy',
    type: 'concept',
    questionPrompt: 'Geometrically, what does the derivative f\'(x) represent at a point?',
    options: [
      { id: 'a', text: 'The slope of the tangent line to the curve at that point.' },
      { id: 'b', text: 'The total area under the curve.' },
      { id: 'c', text: 'The x-intercept of the function.' },
      { id: 'd', text: 'The length of the curve from the origin.' }
    ],
    correctOptionId: 'a',
    explanationMath: 'f\'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h} = \\text{Tangent Slope}',
    explanationText: 'The derivative represents the instantaneous rate of change and slope of the tangent line.'
  },
  {
    id: 'der-e-7',
    category: 'derivatives',
    difficulty: 'easy',
    isImportant: false,
    type: 'mcq',
    questionPrompt: 'Differentiate the quadratic expression:',
    questionMath: '\\frac{d}{dx}(x^2 + 4x - 9)',
    options: [
      { id: 'a', math: '2x + 4' },
      { id: 'b', math: '2x - 9' },
      { id: 'c', math: 'x + 4' },
      { id: 'd', math: '2x^2 + 4' }
    ],
    correctOptionId: 'a',
    explanationMath: '2x + 4 - 0 = 2x + 4',
    explanationText: 'Differentiate term by term: d/dx(x²) = 2x, d/dx(4x) = 4, d/dx(-9) = 0.'
  },

  // ==========================================
  // DERIVATIVES — MEDIUM (INTERMEDIATE)
  // ==========================================
  {
    id: 'der-m-1',
    category: 'derivatives',
    difficulty: 'medium',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Differentiate the polynomial expression:',
    questionMath: '\\frac{d}{dx}(3x^3 - 4x^2 + 7x - 2)',
    options: [
      { id: 'a', math: '9x^2 - 8x + 7' },
      { id: 'b', math: '9x^3 - 8x^2 + 7' },
      { id: 'c', math: '3x^2 - 4x + 7' },
      { id: 'd', math: '9x^2 - 8x' }
    ],
    correctOptionId: 'a',
    explanationMath: '3(3x^2) - 4(2x) + 7(1) - 0 = 9x^2 - 8x + 7',
    explanationText: 'Apply the power rule to each term individually.'
  },
  {
    id: 'der-m-2',
    category: 'derivatives',
    difficulty: 'medium',
    isImportant: true,
    type: 'formula',
    questionPrompt: 'What is the derivative of the sine function?',
    questionMath: '\\frac{d}{dx}(\\sin x)',
    options: [
      { id: 'a', math: '-\\cos x' },
      { id: 'b', math: '\\cos x' },
      { id: 'c', math: '-\\sin x' },
      { id: 'd', math: '\\tan x' }
    ],
    correctOptionId: 'b',
    explanationMath: '\\frac{d}{dx}(\\sin x) = \\cos x',
    explanationText: 'The derivative of sin(x) is cos(x).'
  },
  {
    id: 'der-m-3',
    category: 'derivatives',
    difficulty: 'medium',
    isImportant: true,
    type: 'formula',
    questionPrompt: 'What is the derivative of the cosine function?',
    questionMath: '\\frac{d}{dx}(\\cos x)',
    options: [
      { id: 'a', math: '\\sin x' },
      { id: 'b', math: '-\\sin x' },
      { id: 'c', math: '-\\cos x' },
      { id: 'd', math: '\\sec^2 x' }
    ],
    correctOptionId: 'b',
    explanationMath: '\\frac{d}{dx}(\\cos x) = -\\sin x',
    explanationText: 'The derivative of cos(x) is -sin(x).'
  },
  {
    id: 'der-m-4',
    category: 'derivatives',
    difficulty: 'medium',
    type: 'mcq',
    questionPrompt: 'Differentiate the natural exponential function:',
    questionMath: '\\frac{d}{dx}(e^x)',
    options: [
      { id: 'a', math: 'x e^{x-1}' },
      { id: 'b', math: 'e^x' },
      { id: 'c', math: '\\frac{1}{e^x}' },
      { id: 'd', math: '\\ln(x)' }
    ],
    correctOptionId: 'b',
    explanationMath: '\\frac{d}{dx}(e^x) = e^x',
    explanationText: 'The exponential function e^x is its own derivative.'
  },
  {
    id: 'der-m-5',
    category: 'derivatives',
    difficulty: 'medium',
    isImportant: true,
    type: 'formula',
    questionPrompt: 'What is the derivative of the natural logarithm ln(x) for x > 0?',
    questionMath: '\\frac{d}{dx}(\\ln x)',
    options: [
      { id: 'a', math: '\\frac{1}{x}' },
      { id: 'b', math: 'e^x' },
      { id: 'c', math: '-\\frac{1}{x^2}' },
      { id: 'd', math: '\\frac{1}{\\ln x}' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\frac{d}{dx}(\\ln x) = \\frac{1}{x}',
    explanationText: 'The derivative of ln(x) is 1/x.'
  },
  {
    id: 'der-m-6',
    category: 'derivatives',
    difficulty: 'medium',
    type: 'mcq',
    questionPrompt: 'Differentiate the square root function using power rule:',
    questionMath: '\\frac{d}{dx}(\\sqrt{x}) = \\frac{d}{dx}(x^{1/2})',
    options: [
      { id: 'a', math: '\\frac{1}{2\\sqrt{x}}' },
      { id: 'b', math: '\\frac{1}{\\sqrt{x}}' },
      { id: 'c', math: '2\\sqrt{x}' },
      { id: 'd', math: '\\frac{1}{2}x' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\frac{1}{2}x^{-1/2} = \\frac{1}{2\\sqrt{x}}',
    explanationText: 'Power rule: (1/2) x^(1/2 - 1) = (1/2) x^(-1/2) = 1 / (2√x).'
  },

  // ==========================================
  // DERIVATIVES — HARD
  // ==========================================
  {
    id: 'der-h-1',
    category: 'derivatives',
    difficulty: 'hard',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Find the derivative using the Product Rule for f(x) = x · sin(x):',
    questionMath: '\\frac{d}{dx}(x \\sin x)',
    options: [
      { id: 'a', math: '\\cos x' },
      { id: 'b', math: '\\sin x + x \\cos x' },
      { id: 'c', math: 'x \\cos x' },
      { id: 'd', math: '\\sin x - x \\cos x' }
    ],
    correctOptionId: 'b',
    explanationMath: '\\frac{d}{dx}(u \\cdot v) = u\'v + uv\' \\implies (1)(\\sin x) + (x)(\\cos x) = \\sin x + x\\cos x',
    explanationText: 'By product rule: (1)·sin(x) + x·cos(x) = sin(x) + x cos(x).'
  },
  {
    id: 'der-h-2',
    category: 'derivatives',
    difficulty: 'hard',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Differentiate using the Chain Rule:',
    questionMath: '\\frac{d}{dx}\\left(\\sin(3x)\\right)',
    options: [
      { id: 'a', math: '3\\cos(3x)' },
      { id: 'b', math: '\\cos(3x)' },
      { id: 'c', math: '-3\\cos(3x)' },
      { id: 'd', math: '3\\sin(3x)' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\frac{d}{dx}[\\sin(u)] = \\cos(u) \\cdot \\frac{du}{dx} \\implies \\cos(3x) \\cdot 3 = 3\\cos(3x)',
    explanationText: 'Differentiate outer sin() to cos(3x), then multiply by inner derivative 3.'
  },
  {
    id: 'der-h-3',
    category: 'derivatives',
    difficulty: 'hard',
    type: 'mcq',
    questionPrompt: 'Differentiate using the Quotient Rule for f(x) = x / (x + 1):',
    questionMath: '\\frac{d}{dx}\\left(\\frac{x}{x + 1}\\right)',
    options: [
      { id: 'a', math: '\\frac{1}{(x + 1)^2}' },
      { id: 'b', math: '\\frac{2x + 1}{(x + 1)^2}' },
      { id: 'c', math: '\\frac{1}{x + 1}' },
      { id: 'd', math: '1' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\frac{(1)(x+1) - (x)(1)}{(x+1)^2} = \\frac{x+1-x}{(x+1)^2} = \\frac{1}{(x+1)^2}',
    explanationText: 'Quotient rule (u\'v - uv\') / v² yields 1 / (x + 1)².'
  },
  {
    id: 'der-h-4',
    category: 'derivatives',
    difficulty: 'hard',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Find the second derivative f\'\'(x) of f(x) = x⁴ - 2x³:',
    questionMath: '\\frac{d^2}{dx^2}(x^4 - 2x^3)',
    options: [
      { id: 'a', math: '12x^2 - 12x' },
      { id: 'b', math: '4x^3 - 6x^2' },
      { id: 'c', math: '24x - 12' },
      { id: 'd', math: '12x^3 - 12x^2' }
    ],
    correctOptionId: 'a',
    explanationMath: 'f\'(x) = 4x^3 - 6x^2 \\implies f\'\'(x) = 12x^2 - 12x',
    explanationText: 'Differentiate twice: first derivative is 4x³ - 6x², second derivative is 12x² - 12x.'
  },

  // ==========================================
  // INTEGRATION — EASY
  // ==========================================
  {
    id: 'int-e-1',
    category: 'integration',
    difficulty: 'easy',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Evaluate the basic power integral:',
    questionMath: '\\int x\\,dx',
    options: [
      { id: 'a', math: 'x^2 + C' },
      { id: 'b', math: '\\frac{x^2}{2} + C' },
      { id: 'c', math: '1 + C' },
      { id: 'd', math: '\\frac{x}{2} + C' }
    ],
    correctOptionId: 'b',
    explanationMath: '\\int x^1\\,dx = \\frac{x^{1+1}}{1+1} + C = \\frac{x^2}{2} + C',
    explanationText: 'Add 1 to the power and divide by the new power: (x²)/2 + C.'
  },
  {
    id: 'int-e-2',
    category: 'integration',
    difficulty: 'easy',
    isImportant: false,
    type: 'mcq',
    questionPrompt: 'Evaluate the integral of a constant:',
    questionMath: '\\int 4\\,dx',
    options: [
      { id: 'a', math: '4x + C' },
      { id: 'b', math: '0 + C' },
      { id: 'c', math: '4 + C' },
      { id: 'd', math: '2x^2 + C' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\int k\\,dx = kx + C \\implies \\int 4\\,dx = 4x + C',
    explanationText: 'The antiderivative of any constant k is kx + C.'
  },
  {
    id: 'int-e-3',
    category: 'integration',
    difficulty: 'easy',
    isImportant: true,
    type: 'concept',
    questionPrompt: 'Why is + C added to every indefinite integral?',
    options: [
      { id: 'a', text: 'Because differentiation of any constant produces zero, so any constant shift is valid.' },
      { id: 'b', text: 'It stands for calculus calculation speed.' },
      { id: 'c', text: 'Because the integral always equals zero.' },
      { id: 'd', text: 'It is only required when x is negative.' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\frac{d}{dx}[F(x) + C] = F\'(x) + 0 = f(x)',
    explanationText: 'C is the constant of integration representing the infinite family of antiderivatives.'
  },
  {
    id: 'int-e-4',
    category: 'integration',
    difficulty: 'easy',
    isImportant: false,
    type: 'mcq',
    questionPrompt: 'Evaluate the integral of x³:',
    questionMath: '\\int x^3\\,dx',
    options: [
      { id: 'a', math: '\\frac{x^4}{4} + C' },
      { id: 'b', math: '3x^2 + C' },
      { id: 'c', math: '\\frac{x^3}{3} + C' },
      { id: 'd', math: 'x^4 + C' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\int x^3\\,dx = \\frac{x^{3+1}}{3+1} + C = \\frac{x^4}{4} + C',
    explanationText: 'Power rule for integrals: x^(3+1)/(3+1) + C = (x⁴)/4 + C.'
  },
  {
    id: 'int-e-5',
    category: 'integration',
    difficulty: 'easy',
    type: 'mcq',
    questionPrompt: 'Integrate the linear binomial:',
    questionMath: '\\int (2x + 3)\\,dx',
    options: [
      { id: 'a', math: 'x^2 + 3x + C' },
      { id: 'b', math: '2x^2 + 3x + C' },
      { id: 'c', math: 'x^2 + C' },
      { id: 'd', math: '2 + C' }
    ],
    correctOptionId: 'a',
    explanationMath: '2\\left(\\frac{x^2}{2}\\right) + 3x + C = x^2 + 3x + C',
    explanationText: 'Integrate term by term: 2(x²/2) + 3x + C = x² + 3x + C.'
  },

  // ==========================================
  // INTEGRATION — MEDIUM (INTERMEDIATE)
  // ==========================================
  {
    id: 'int-m-1',
    category: 'integration',
    difficulty: 'medium',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Evaluate the quadratic power integral:',
    questionMath: '\\int x^2\\,dx',
    options: [
      { id: 'a', math: '2x + C' },
      { id: 'b', math: '\\frac{x^3}{3} + C' },
      { id: 'c', math: 'x^3 + C' },
      { id: 'd', math: '\\frac{x^2}{3} + C' }
    ],
    correctOptionId: 'b',
    explanationMath: '\\int x^2\\,dx = \\frac{x^{2+1}}{2+1} + C = \\frac{x^3}{3} + C',
    explanationText: 'Power rule for integration: (x³)/3 + C.'
  },
  {
    id: 'int-m-2',
    category: 'integration',
    difficulty: 'medium',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Evaluate the integral with a constant coefficient:',
    questionMath: '\\int 5x^2\\,dx',
    options: [
      { id: 'a', math: '10x + C' },
      { id: 'b', math: '\\frac{5x^3}{3} + C' },
      { id: 'c', math: '5x^3 + C' },
      { id: 'd', math: '\\frac{5x^2}{2} + C' }
    ],
    correctOptionId: 'b',
    explanationMath: '5 \\int x^2\\,dx = 5 \\left(\\frac{x^3}{3}\\right) + C = \\frac{5x^3}{3} + C',
    explanationText: 'Factor out 5, integrate x² to get x³/3, yielding (5x³)/3 + C.'
  },
  {
    id: 'int-m-3',
    category: 'integration',
    difficulty: 'medium',
    isImportant: true,
    type: 'formula',
    questionPrompt: 'What is the indefinite integral of the sine function?',
    questionMath: '\\int \\sin x\\,dx',
    options: [
      { id: 'a', math: '\\cos x + C' },
      { id: 'b', math: '-\\cos x + C' },
      { id: 'c', math: '-\\sin x + C' },
      { id: 'd', math: '\\tan x + C' }
    ],
    correctOptionId: 'b',
    explanationMath: '\\int \\sin x\\,dx = -\\cos x + C',
    explanationText: 'Since d/dx[-cos(x)] = sin(x), the integral of sin(x) is -cos(x) + C.'
  },
  {
    id: 'int-m-4',
    category: 'integration',
    difficulty: 'medium',
    isImportant: true,
    type: 'formula',
    questionPrompt: 'What is the indefinite integral of the cosine function?',
    questionMath: '\\int \\cos x\\,dx',
    options: [
      { id: 'a', math: '\\sin x + C' },
      { id: 'b', math: '-\\sin x + C' },
      { id: 'c', math: '\\cos x + C' },
      { id: 'd', math: '-\\cos x + C' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\int \\cos x\\,dx = \\sin x + C',
    explanationText: 'The antiderivative of cos(x) is positive sin(x) + C.'
  },
  {
    id: 'int-m-5',
    category: 'integration',
    difficulty: 'medium',
    isImportant: true,
    type: 'formula',
    questionPrompt: 'What is the integral of 1/x for x > 0?',
    questionMath: '\\int \\frac{1}{x}\\,dx',
    options: [
      { id: 'a', math: '\\ln(x) + C' },
      { id: 'b', math: '-\\frac{1}{x^2} + C' },
      { id: 'c', math: 'e^x + C' },
      { id: 'd', math: '\\frac{x^0}{0} + C' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\int \\frac{1}{x}\\,dx = \\ln|x| + C',
    explanationText: 'The power rule does not apply when n = -1; the integral of 1/x is ln|x| + C.'
  },

  // ==========================================
  // INTEGRATION — HARD
  // ==========================================
  {
    id: 'int-h-1',
    category: 'integration',
    difficulty: 'hard',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Integrate the polynomial term-by-term:',
    questionMath: '\\int (3x^2 - 2x + 1)\\,dx',
    options: [
      { id: 'a', math: 'x^3 - x^2 + x + C' },
      { id: 'b', math: '6x - 2 + C' },
      { id: 'c', math: '3x^3 - 2x^2 + x + C' },
      { id: 'd', math: 'x^3 - 2x^2 + C' }
    ],
    correctOptionId: 'a',
    explanationMath: '3\\left(\\frac{x^3}{3}\\right) - 2\\left(\\frac{x^2}{2}\\right) + 1(x) + C = x^3 - x^2 + x + C',
    explanationText: 'Integrate each term: 3(x³/3) - 2(x²/2) + x + C = x³ - x² + x + C.'
  },
  {
    id: 'int-h-2',
    category: 'integration',
    difficulty: 'hard',
    type: 'formula',
    questionPrompt: 'Evaluate the integral of the natural exponential function:',
    questionMath: '\\int e^x\\,dx',
    options: [
      { id: 'a', math: 'e^x + C' },
      { id: 'b', math: '\\frac{e^{x+1}}{x+1} + C' },
      { id: 'c', math: 'x e^x + C' },
      { id: 'd', math: '\\ln(x) + C' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\int e^x\\,dx = e^x + C',
    explanationText: 'The integral of e^x is simply e^x + C.'
  },
  {
    id: 'int-h-3',
    category: 'integration',
    difficulty: 'hard',
    isImportant: true,
    type: 'mcq',
    questionPrompt: 'Evaluate the exponential integral with a linear argument:',
    questionMath: '\\int e^{4x}\\,dx',
    options: [
      { id: 'a', math: '\\frac{1}{4}e^{4x} + C' },
      { id: 'b', math: '4e^{4x} + C' },
      { id: 'c', math: 'e^{4x} + C' },
      { id: 'd', math: '\\frac{e^{5x}}{5} + C' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\int e^{kx}\\,dx = \\frac{1}{k}e^{kx} + C \\implies \\frac{1}{4}e^{4x} + C',
    explanationText: 'By substitution u = 4x, du = 4 dx, the integral is (1/4) e^(4x) + C.'
  },
  {
    id: 'int-h-4',
    category: 'integration',
    difficulty: 'hard',
    type: 'mcq',
    questionPrompt: 'Evaluate the definite integral:',
    questionMath: '\\int_{0}^{2} 3x^2\\,dx',
    options: [
      { id: 'a', math: '8' },
      { id: 'b', math: '12' },
      { id: 'c', math: '24' },
      { id: 'd', math: '6' }
    ],
    correctOptionId: 'a',
    explanationMath: '\\left[ x^3 \\right]_{0}^{2} = 2^3 - 0^3 = 8',
    explanationText: 'Antiderivative is x³. Evaluating from 0 to 2 gives 2³ - 0 = 8.'
  }
];

// Helper: Shuffle array randomly
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Procedural generator to guarantee exact question count from 1 to 50
export function generateCalculusQuizQuestions(
  category: QuizCategory,
  difficulty: QuizDifficulty,
  count: number,
  onlyImportant: boolean
): QuizQuestion[] {
  // 1. Filter existing verified static bank
  let filtered = VERIFIED_CALCULUS_QUESTIONS.filter((q) => {
    if (category !== 'mixed' && q.category !== category) return false;
    if (difficulty !== 'all' && q.difficulty !== difficulty) return false;
    if (onlyImportant && !q.isImportant) return false;
    return true;
  });

  // If filtered is empty (e.g. onlyImportant had no items for a narrow combination), fallback to without onlyImportant
  if (filtered.length === 0) {
    filtered = VERIFIED_CALCULUS_QUESTIONS.filter((q) => {
      if (category !== 'mixed' && q.category !== category) return false;
      if (difficulty !== 'all' && q.difficulty !== difficulty) return false;
      return true;
    });
  }

  // Shuffle existing verified questions
  const shuffled = shuffleArray(filtered);

  // If we already have enough, take count
  if (shuffled.length >= count) {
    return shuffled.slice(0, count);
  }

  // If more questions are needed (e.g. user requested 20, 25, 30 or custom 50),
  // generate verified mathematical variations with unique parameters.
  const result: QuizQuestion[] = [...shuffled];
  let genIndex = 1;

  const targetCategoryList: ('limits' | 'derivatives' | 'integration')[] = 
    category === 'mixed' 
      ? ['limits', 'derivatives', 'integration']
      : [category];

  const targetDiffList: ('easy' | 'medium' | 'hard')[] = 
    difficulty === 'all'
      ? ['easy', 'medium', 'hard']
      : [difficulty];

  while (result.length < count && genIndex <= 200) {
    const cat = targetCategoryList[Math.floor(Math.random() * targetCategoryList.length)];
    const diff = targetDiffList[Math.floor(Math.random() * targetDiffList.length)];
    const id = `gen-${cat}-${diff}-${genIndex++}`;

    let q: QuizQuestion | null = null;

    if (cat === 'limits') {
      if (diff === 'easy') {
        const a = 2 + Math.floor(Math.random() * 6);
        const m = 2 + Math.floor(Math.random() * 4);
        const c = 1 + Math.floor(Math.random() * 8);
        const ans = m * a + c;
        q = {
          id,
          category: 'limits',
          difficulty: 'easy',
          isImportant: genIndex % 3 === 0,
          type: 'mcq',
          questionPrompt: 'Evaluate the linear polynomial limit:',
          questionMath: `\\lim_{x \\to ${a}} (${m}x + ${c})`,
          options: shuffleArray([
            { id: 'a', math: `${ans}` },
            { id: 'b', math: `${ans + m}` },
            { id: 'c', math: `${ans - 2}` },
            { id: 'd', math: `${ans + 4}` }
          ]),
          correctOptionId: 'a',
          explanationMath: `\\lim_{x \\to ${a}} (${m}x + ${c}) = ${m}(${a}) + ${c} = ${ans}`,
          explanationText: `Substitute x = ${a} directly into the polynomial.`
        };
      } else if (diff === 'medium') {
        const a = 2 + Math.floor(Math.random() * 5);
        const sq = a * a;
        const ans = 2 * a;
        q = {
          id,
          category: 'limits',
          difficulty: 'medium',
          isImportant: true,
          type: 'mcq',
          questionPrompt: 'Evaluate the indeterminate 0/0 limit by factoring difference of squares:',
          questionMath: `\\lim_{x \\to ${a}} \\frac{x^2 - ${sq}}{x - ${a}}`,
          options: shuffleArray([
            { id: 'a', math: `${ans}` },
            { id: 'b', math: `${a}` },
            { id: 'c', math: `${sq}` },
            { id: 'd', math: '0' }
          ]),
          correctOptionId: 'a',
          explanationMath: `\\lim_{x \\to ${a}} \\frac{(x - ${a})(x + ${a})}{x - ${a}} = \\lim_{x \\to ${a}} (x + ${a}) = ${a} + ${a} = ${ans}`,
          explanationText: `Factor the numerator as (x - ${a})(x + ${a}), cancel (x - ${a}), and evaluate x = ${a}.`
        };
      } else {
        const k = 2 + Math.floor(Math.random() * 5);
        q = {
          id,
          category: 'limits',
          difficulty: 'hard',
          isImportant: true,
          type: 'mcq',
          questionPrompt: 'Evaluate the trigonometric limit:',
          questionMath: `\\lim_{x \\to 0} \\frac{\\sin(${k}x)}{x}`,
          options: shuffleArray([
            { id: 'a', math: `${k}` },
            { id: 'b', math: '1' },
            { id: 'c', math: `\\frac{1}{${k}}` },
            { id: 'd', math: '0' }
          ]),
          correctOptionId: 'a',
          explanationMath: `\\lim_{x \\to 0} ${k} \\cdot \\frac{\\sin(${k}x)}{${k}x} = ${k} \\cdot 1 = ${k}`,
          explanationText: `Multiply and divide by ${k} to apply the standard trigonometric limit theorem.`
        };
      }
    } else if (cat === 'derivatives') {
      if (diff === 'easy') {
        const n = 3 + Math.floor(Math.random() * 5);
        const k = 2 + Math.floor(Math.random() * 4);
        const coeff = k * n;
        const newPow = n - 1;
        q = {
          id,
          category: 'derivatives',
          difficulty: 'easy',
          isImportant: genIndex % 2 === 0,
          type: 'mcq',
          questionPrompt: 'Differentiate using the Power Rule:',
          questionMath: `\\frac{d}{dx}(${k}x^${n})`,
          options: shuffleArray([
            { id: 'a', math: `${coeff}x^{${newPow}}` },
            { id: 'b', math: `${k}x^{${newPow}}` },
            { id: 'c', math: `${coeff}x^{${n}}` },
            { id: 'd', math: `${n}x^{${newPow}}` }
          ]),
          correctOptionId: 'a',
          explanationMath: `\\frac{d}{dx}(${k}x^${n}) = ${k} \\cdot ${n}x^{${n}-1} = ${coeff}x^{${newPow}}`,
          explanationText: `Bring down the exponent ${n} and multiply by ${k}, reducing the power by 1.`
        };
      } else if (diff === 'medium') {
        const a = 2 + Math.floor(Math.random() * 4);
        const b = 2 + Math.floor(Math.random() * 6);
        q = {
          id,
          category: 'derivatives',
          difficulty: 'medium',
          isImportant: true,
          type: 'mcq',
          questionPrompt: 'Differentiate the quadratic polynomial:',
          questionMath: `\\frac{d}{dx}(${a}x^2 + ${b}x - 7)`,
          options: shuffleArray([
            { id: 'a', math: `${2 * a}x + ${b}` },
            { id: 'b', math: `${a}x + ${b}` },
            { id: 'c', math: `${2 * a}x^2 + ${b}` },
            { id: 'd', math: `${2 * a}x - 7` }
          ]),
          correctOptionId: 'a',
          explanationMath: `\\frac{d}{dx}(${a}x^2) + \\frac{d}{dx}(${b}x) - 0 = ${2 * a}x + ${b}`,
          explanationText: `Differentiate term-by-term using power and constant rules.`
        };
      } else {
        const k = 2 + Math.floor(Math.random() * 4);
        q = {
          id,
          category: 'derivatives',
          difficulty: 'hard',
          isImportant: true,
          type: 'mcq',
          questionPrompt: 'Differentiate using the Chain Rule:',
          questionMath: `\\frac{d}{dx}\\left(\\cos(${k}x)\\right)`,
          options: shuffleArray([
            { id: 'a', math: `-${k}\\sin(${k}x)` },
            { id: 'b', math: `${k}\\sin(${k}x)` },
            { id: 'c', math: `-\\sin(${k}x)` },
            { id: 'd', math: `-${k}\\cos(${k}x)` }
          ]),
          correctOptionId: 'a',
          explanationMath: `\\frac{d}{dx}[\\cos(u)] = -\\sin(u) \\cdot \\frac{du}{dx} \\implies -\\sin(${k}x) \\cdot ${k} = -${k}\\sin(${k}x)`,
          explanationText: `Differentiate outer cosine to -sin(${k}x) and multiply by inner derivative ${k}.`
        };
      }
    } else {
      // cat === 'integration'
      if (diff === 'easy') {
        const k = 2 + Math.floor(Math.random() * 6);
        q = {
          id,
          category: 'integration',
          difficulty: 'easy',
          isImportant: genIndex % 2 === 0,
          type: 'mcq',
          questionPrompt: 'Evaluate the basic linear integral:',
          questionMath: `\\int ${k}x\\,dx`,
          options: shuffleArray([
            { id: 'a', math: `\\frac{${k}x^2}{2} + C` },
            { id: 'b', math: `${k}x^2 + C` },
            { id: 'c', math: `${k} + C` },
            { id: 'd', math: `\\frac{x^2}{2} + C` }
          ]),
          correctOptionId: 'a',
          explanationMath: `${k}\\int x\\,dx = ${k}\\left(\\frac{x^2}{2}\\right) + C = \\frac{${k}x^2}{2} + C`,
          explanationText: `Integrate x to get (x²)/2 and multiply by coefficient ${k}, adding + C.`
        };
      } else if (diff === 'medium') {
        const n = 3 + Math.floor(Math.random() * 3);
        const newN = n + 1;
        q = {
          id,
          category: 'integration',
          difficulty: 'medium',
          isImportant: true,
          type: 'mcq',
          questionPrompt: 'Evaluate the power rule integral:',
          questionMath: `\\int x^${n}\\,dx`,
          options: shuffleArray([
            { id: 'a', math: `\\frac{x^{${newN}}}{${newN}} + C` },
            { id: 'b', math: `${n}x^{${n - 1}} + C` },
            { id: 'c', math: `\\frac{x^${n}}{${n}} + C` },
            { id: 'd', math: `x^{${newN}} + C` }
          ]),
          correctOptionId: 'a',
          explanationMath: `\\int x^${n}\\,dx = \\frac{x^{${n}+1}}{${n}+1} + C = \\frac{x^{${newN}}}{${newN}} + C`,
          explanationText: `Add 1 to exponent ${n} to get ${newN}, and divide by ${newN}.`
        };
      } else {
        const k = 2 + Math.floor(Math.random() * 4);
        q = {
          id,
          category: 'integration',
          difficulty: 'hard',
          isImportant: true,
          type: 'mcq',
          questionPrompt: 'Evaluate the trigonometric integral with linear coefficient:',
          questionMath: `\\int \\cos(${k}x)\\,dx`,
          options: shuffleArray([
            { id: 'a', math: `\\frac{1}{${k}}\\sin(${k}x) + C` },
            { id: 'b', math: `-${k}\\sin(${k}x) + C` },
            { id: 'c', math: `\\sin(${k}x) + C` },
            { id: 'd', math: `-\\frac{1}{${k}}\\sin(${k}x) + C` }
          ]),
          correctOptionId: 'a',
          explanationMath: `\\int \\cos(kx)\\,dx = \\frac{1}{k}\\sin(kx) + C \\implies \\frac{1}{${k}}\\sin(${k}x) + C`,
          explanationText: `Antiderivative of cos(kx) is (1/k) sin(kx) + C.`
        };
      }
    }

    if (q) {
      result.push(q);
    }
  }

  return result.slice(0, count);
}
