export interface TextbookRule {
  id: string;
  name: string;
  formula: string;
  description: string;
  exampleMath?: string;
  exampleNote?: string;
}

export interface TextbookExample {
  id: string;
  questionMath: string;
  questionText: string;
  method: string;
  steps: {
    stepNumber: number;
    title: string;
    math?: string;
    explanation: string;
  }[];
  finalAnswerMath: string;
  finalAnswerText?: string;
}

export interface TextbookPractice {
  id: string;
  questionPrompt: string;
  questionMath: string;
  options: {
    id: string;
    math: string;
    label?: string;
  }[];
  correctOptionId: string;
  explanationText: string;
  explanationMath: string;
}

export interface CalculusCategoryData {
  id: 'limits' | 'derivatives' | 'integration';
  title: string;
  shortDescription: string;
  featuredFormula: string;
  
  // Section A: Basic Idea
  basicIdea: {
    heading: string;
    definition: string;
    primaryFormula: string;
    intuition: string;
    keyConceptBox?: {
      title: string;
      text: string;
      math?: string;
    };
  };

  // Section B: Notation (for derivatives/integration) or Basic Examples (for limits)
  notationSection?: {
    heading: string;
    description: string;
    notations: {
      name: string;
      math: string;
      meaning: string;
    }[];
  };

  // Section C: Rules
  rulesHeading: string;
  rulesDescription: string;
  rules: TextbookRule[];

  // Section D: Trigonometric / Special
  specialSection: {
    heading: string;
    description: string;
    importantNote?: string;
    formulas: TextbookRule[];
  };

  // Section E: Step-by-Step Examples
  examplesHeading: string;
  examples: TextbookExample[];

  // Section F: Practice
  practiceHeading: string;
  practiceQuestions: TextbookPractice[];
}

export const CALCULUS_TEXTBOOK_DATA: Record<'limits' | 'derivatives' | 'integration', CalculusCategoryData> = {
  // ==========================================
  // 1. LIMITS
  // ==========================================
  limits: {
    id: 'limits',
    title: 'LIMITS',
    shortDescription: 'Understand how a function behaves as a value approaches a point.',
    featuredFormula: '\\lim_{x \\to a} f(x)',

    basicIdea: {
      heading: 'What is a Limit?',
      definition: 'A limit describes the value that a function approaches as the input x gets closer and closer to a particular point, regardless of whether the function is defined at that exact point.',
      primaryFormula: '\\lim_{x \\to 2} x = 2',
      intuition: 'Imagine walking along the graph of f(x) = x toward x = 2 from both the left and right sides. The height y of the function gets closer and closer to 2.',
      keyConceptBox: {
        title: 'Core Concept: Behavior Near a Point',
        text: 'A limit asks: "Where is the function heading?" rather than simply "What is the function value right at that point?"',
        math: '\\lim_{x \\to a} f(x) = L'
      }
    },

    rulesHeading: 'Fundamental Limit Rules',
    rulesDescription: 'When taking limits of continuous and well-behaved functions, these foundational algebraic rules allow us to evaluate limits term by term.',
    rules: [
      {
        id: 'lim-const',
        name: 'Constant Rule',
        formula: '\\lim_{x \\to a} c = c',
        description: 'The limit of a constant value is simply the constant itself.',
        exampleMath: '\\lim_{x \\to 5} 7 = 7',
        exampleNote: 'The number 7 remains constant regardless of what x approaches.'
      },
      {
        id: 'lim-ident',
        name: 'Identity Rule',
        formula: '\\lim_{x \\to a} x = a',
        description: 'As x approaches a, the variable x simply approaches the value a.',
        exampleMath: '\\lim_{x \\to 2} x = 2',
        exampleNote: 'Directly substitutes the target value.'
      },
      {
        id: 'lim-sum',
        name: 'Sum Rule',
        formula: '\\lim_{x \\to a} [f(x) + g(x)] = \\lim_{x \\to a} f(x) + \\lim_{x \\to a} g(x)',
        description: 'The limit of a sum is equal to the sum of the individual limits.',
        exampleMath: '\\lim_{x \\to 2} (x + 3) = \\lim_{x \\to 2} x + \\lim_{x \\to 2} 3 = 2 + 3 = 5',
        exampleNote: 'Split into separate limits and add.'
      },
      {
        id: 'lim-diff',
        name: 'Difference Rule',
        formula: '\\lim_{x \\to a} [f(x) - g(x)] = \\lim_{x \\to a} f(x) - \\lim_{x \\to a} g(x)',
        description: 'The limit of a difference is equal to the difference of the individual limits.',
        exampleMath: '\\lim_{x \\to 4} (x - 1) = 4 - 1 = 3',
        exampleNote: 'Subtract the individual limits.'
      },
      {
        id: 'lim-const-mult',
        name: 'Constant Multiple Rule',
        formula: '\\lim_{x \\to a} [c \\cdot f(x)] = c \\cdot \\lim_{x \\to a} f(x)',
        description: 'A constant multiplier can be pulled outside the limit.',
        exampleMath: '\\lim_{x \\to 3} (4x) = 4 \\cdot \\lim_{x \\to 3} x = 4 \\cdot 3 = 12',
        exampleNote: 'Factor out the constant 4.'
      },
      {
        id: 'lim-prod',
        name: 'Product Rule',
        formula: '\\lim_{x \\to a} [f(x) \\cdot g(x)] = \\left[\\lim_{x \\to a} f(x)\\right] \\cdot \\left[\\lim_{x \\to a} g(x)\\right]',
        description: 'The limit of a product is the product of the individual limits.',
        exampleMath: '\\lim_{x \\to 2} (x \\cdot x) = 2 \\cdot 2 = 4',
        exampleNote: 'Multiply the individual limit values.'
      },
      {
        id: 'lim-quot',
        name: 'Quotient Rule',
        formula: '\\lim_{x \\to a} \\left[\\frac{f(x)}{g(x)}\\right] = \\frac{\\lim_{x \\to a} f(x)}{\\lim_{x \\to a} g(x)} \\quad \\left(\\text{when } \\lim_{x \\to a} g(x) \\ne 0\\right)',
        description: 'The limit of a quotient is the quotient of the limits, provided the denominator limit is not zero.',
        exampleMath: '\\lim_{x \\to 3} \\left(\\frac{x + 1}{x - 1}\\right) = \\frac{3 + 1}{3 - 1} = \\frac{4}{2} = 2',
        exampleNote: 'Valid when denominator is non-zero.'
      }
    ],

    specialSection: {
      heading: 'Basic Trigonometric Limits',
      description: 'Trigonometric limits are fundamental for defining the rates of change and derivatives of circular functions.',
      importantNote: 'This standard limit is written with x measured in radians.',
      formulas: [
        {
          id: 'trig-lim-sin',
          name: 'Fundamental Sine Limit',
          formula: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
          description: 'As the angle x approaches 0 radians, the chord sin(x) and arc length x approach an identical 1:1 ratio.',
          exampleMath: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
          exampleNote: 'Note: x MUST be in radians. (If measured in degrees, the limit would equal π/180 ≈ 0.01745).'
        },
        {
          id: 'trig-lim-cos',
          name: 'Cosine Difference Limit',
          formula: '\\lim_{x \\to 0} \\frac{1 - \\cos x}{x} = 0',
          description: 'The deviation of cosine from 1 vanishes much faster than x near zero.',
          exampleMath: '\\lim_{x \\to 0} \\frac{1 - \\cos x}{x} = 0',
          exampleNote: 'Used extensively in proving the derivative of cosine.'
        },
        {
          id: 'trig-lim-cos-direct',
          name: 'Standard Cosine Limit',
          formula: '\\lim_{x \\to 0} \\cos x = 1',
          description: 'Since cos(x) is continuous everywhere, evaluate directly at x = 0.',
          exampleMath: '\\lim_{x \\to 0} \\cos(0) = 1',
          exampleNote: 'Direct substitution yields cos(0) = 1.'
        }
      ]
    },

    examplesHeading: 'Step-by-Step Limit Examples',
    examples: [
      {
        id: 'lim-ex-1',
        questionMath: '\\lim_{x \\to 2} x',
        questionText: 'Find the limit of x as x approaches 2.',
        method: 'Direct Substitution / Identity Rule',
        steps: [
          {
            stepNumber: 1,
            title: 'Identify the Function',
            math: 'f(x) = x',
            explanation: 'The function f(x) = x is a continuous identity polynomial across all real numbers.'
          },
          {
            stepNumber: 2,
            title: 'Substitute x = 2',
            math: 'x = 2 \\implies f(2) = 2',
            explanation: 'Plug the target value x = 2 directly into the expression.'
          }
        ],
        finalAnswerMath: '2',
        finalAnswerText: 'The limit is 2.'
      },
      {
        id: 'lim-ex-2',
        questionMath: '\\lim_{x \\to 2} (x + 3)',
        questionText: 'Evaluate the limit of (x + 3) as x approaches 2.',
        method: 'Sum Rule & Direct Substitution',
        steps: [
          {
            stepNumber: 1,
            title: 'Substitute x = 2',
            math: 'x = 2',
            explanation: 'Since (x + 3) is continuous, substitute x = 2 directly into the binomial.'
          },
          {
            stepNumber: 2,
            title: 'Compute the Arithmetic',
            math: '2 + 3 = 5',
            explanation: 'Add the constant 3 to 2 to get 5.'
          }
        ],
        finalAnswerMath: '5',
        finalAnswerText: 'The limit is 5.'
      },
      {
        id: 'lim-ex-3',
        questionMath: '\\lim_{x \\to 0} \\frac{\\sin x}{x}',
        questionText: 'Evaluate the standard trigonometric limit as x approaches 0 (where x is in radians).',
        method: 'Standard Trigonometric Limit Identity',
        steps: [
          {
            stepNumber: 1,
            title: 'Verify Angle Units in Radians',
            explanation: 'Confirm that x is measured in radians. Under radian measure, the arc length x and vertical sine height sin(x) converge at the same rate near zero.'
          },
          {
            stepNumber: 2,
            title: 'Apply Standard Geometric Limit',
            math: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1',
            explanation: 'Using the fundamental trigonometric limit property.'
          }
        ],
        finalAnswerMath: '1',
        finalAnswerText: 'The standard limit is 1.'
      }
    ],

    practiceHeading: 'Limits Practice',
    practiceQuestions: [
      {
        id: 'lim-prac-1',
        questionPrompt: 'Evaluate the following algebraic limit:',
        questionMath: '\\lim_{x \\to 4} (x + 5)',
        options: [
          { id: 'a', math: '4' },
          { id: 'b', math: '9' },
          { id: 'c', math: '20' },
          { id: 'd', math: '1' }
        ],
        correctOptionId: 'b',
        explanationText: 'Substitute x = 4 directly: 4 + 5 = 9.',
        explanationMath: '\\lim_{x \\to 4} (x + 5) = 4 + 5 = 9'
      },
      {
        id: 'lim-prac-2',
        questionPrompt: 'What is the value of the standard limit (with x in radians)?',
        questionMath: '\\lim_{x \\to 0} \\frac{\\sin x}{x}',
        options: [
          { id: 'a', math: '0' },
          { id: 'b', math: '1' },
          { id: 'c', math: '\\infty' },
          { id: 'd', math: '\\pi' }
        ],
        correctOptionId: 'b',
        explanationText: 'This is the standard fundamental trigonometric limit in radians.',
        explanationMath: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1'
      },
      {
        id: 'lim-prac-3',
        questionPrompt: 'Evaluate the limit of the constant function:',
        questionMath: '\\lim_{x \\to 3} 8',
        options: [
          { id: 'a', math: '3' },
          { id: 'b', math: '8' },
          { id: 'c', math: '24' },
          { id: 'd', math: '0' }
        ],
        correctOptionId: 'b',
        explanationText: 'By the Constant Rule, the limit of a constant c is always c.',
        explanationMath: '\\lim_{x \\to a} c = c \\implies \\lim_{x \\to 3} 8 = 8'
      }
    ]
  },

  // ==========================================
  // 2. DERIVATIVES
  // ==========================================
  derivatives: {
    id: 'derivatives',
    title: 'DERIVATIVES',
    shortDescription: 'Learn how to find the rate of change and slope of a function.',
    featuredFormula: '\\frac{dy}{dx}',

    basicIdea: {
      heading: 'What is a Derivative?',
      definition: 'A derivative describes how quickly a quantity changes. Geometrically, it represents the exact slope of the tangent line to a curve at a given point.',
      primaryFormula: 'y = x^2 \\implies \\frac{dy}{dx} = 2x',
      intuition: 'If you graph a curve like y = x², it curves upward. The derivative 2x tells you the exact steepness (slope) of the curve at any x coordinate you choose. For example, at x = 3, the slope is 2(3) = 6.',
      keyConceptBox: {
        title: 'Geometrical Meaning: Tangent Slope',
        text: 'The derivative turns a curve into an instantaneous slope formula. In physics, if s(t) is position, the derivative is instantaneous velocity.',
        math: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}'
      }
    },

    notationSection: {
      heading: 'Textbook Derivative Notations',
      description: 'Mathematicians use different standard notations depending on context. All of them mean the exact same operation:',
      notations: [
        {
          name: 'Leibniz Notation',
          math: '\\frac{d}{dx}(x^2) \\quad \\text{or} \\quad \\frac{dy}{dx}',
          meaning: 'Reads "the derivative with respect to x". Emphasizes the ratio of an infinitesimal change in y over x.'
        },
        {
          name: 'Lagrange (Prime) Notation',
          math: 'f\'(x) \\quad \\text{or} \\quad y\'',
          meaning: 'Reads "f-prime of x". Very concise and convenient for evaluating derivatives at points like f\'(2).'
        },
        {
          name: 'Operator Notation',
          math: '\\frac{d}{dx}[f(x)]',
          meaning: 'Treats d/dx as a mathematical operator acting on the function expression.'
        }
      ]
    },

    rulesHeading: 'Basic Derivative Rules',
    rulesDescription: 'These fundamental rules allow you to differentiate algebraic equations without needing to calculate limits every time.',
    rules: [
      {
        id: 'deriv-const',
        name: 'Constant Rule',
        formula: '\\frac{d}{dx}(c) = 0',
        description: 'The derivative of any constant number is always zero, because a constant does not change (a flat line has 0 slope).',
        exampleMath: '\\frac{d}{dx}(7) = 0',
        exampleNote: 'The derivative of 7, π, or 100 is 0.'
      },
      {
        id: 'deriv-power',
        name: 'Power Rule',
        formula: '\\frac{d}{dx}(x^n) = n x^{n-1}',
        description: 'Bring the existing exponent n down to the front as a multiplier, and subtract 1 from the power.',
        exampleMath: '\\frac{d}{dx}(x^2) = 2x^{2-1} = 2x',
        exampleNote: 'Example: d/dx(x³) = 3x²'
      },
      {
        id: 'deriv-const-mult',
        name: 'Constant Multiple Rule',
        formula: '\\frac{d}{dx}[c \\cdot f(x)] = c \\cdot f\'(x)',
        description: 'When a function is multiplied by a constant number c, keep the constant and differentiate the function.',
        exampleMath: '\\frac{d}{dx}(5x^3) = 5 \\cdot (3x^2) = 15x^2',
        exampleNote: 'Multiply 5 by 3 to get 15x².'
      },
      {
        id: 'deriv-sum',
        name: 'Sum & Difference Rule',
        formula: '\\frac{d}{dx}[f(x) \\pm g(x)] = f\'(x) \\pm g\'(x)',
        description: 'Differentiate each term in a polynomial individually.',
        exampleMath: '\\frac{d}{dx}(x^2 + 3x) = 2x + 3',
        exampleNote: 'Differentiate term by term.'
      }
    ],

    specialSection: {
      heading: 'Basic Trigonometric & Exponential Derivatives',
      description: 'Standard derivative formulas for transcendental functions that appear frequently in science and mathematics.',
      formulas: [
        {
          id: 'deriv-sin',
          name: 'Sine Derivative',
          formula: '\\frac{d}{dx}(\\sin x) = \\cos x',
          description: 'The rate of change of the sine function is positive cosine.',
          exampleMath: '\\frac{d}{dx}(\\sin x) = \\cos x',
          exampleNote: 'Slope of sin(x) at x = 0 is cos(0) = 1.'
        },
        {
          id: 'deriv-cos',
          name: 'Cosine Derivative',
          formula: '\\frac{d}{dx}(\\cos x) = -\\sin x',
          description: 'The rate of change of cosine is negative sine (because cosine decreases after x = 0).',
          exampleMath: '\\frac{d}{dx}(\\cos x) = -\\sin x',
          exampleNote: 'Remember the negative sign!'
        },
        {
          id: 'deriv-exp',
          name: 'Natural Exponential Derivative',
          formula: '\\frac{d}{dx}(e^x) = e^x',
          description: 'Euler\'s number e is the unique base whose derivative is exactly equal to the function itself.',
          exampleMath: '\\frac{d}{dx}(e^x) = e^x',
          exampleNote: 'The slope at any point equals the function height.'
        },
        {
          id: 'deriv-ln',
          name: 'Natural Logarithm Derivative',
          formula: '\\frac{d}{dx}(\\ln x) = \\frac{1}{x} \\quad (x > 0)',
          description: 'The derivative of ln(x) is the reciprocal function 1/x.',
          exampleMath: '\\frac{d}{dx}(\\ln x) = \\frac{1}{x}',
          exampleNote: 'Defined strictly for positive arguments x > 0.'
        }
      ]
    },

    examplesHeading: 'Step-by-Step Derivative Examples',
    examples: [
      {
        id: 'deriv-ex-1',
        questionMath: 'y = x^2',
        questionText: 'Find the derivative of y = x².',
        method: 'Power Rule',
        steps: [
          {
            stepNumber: 1,
            title: 'Apply the Power Rule',
            math: '\\frac{d}{dx}(x^n) = n x^{n-1} \\implies n = 2',
            explanation: 'Identify the exponent n = 2.'
          },
          {
            stepNumber: 2,
            title: 'Differentiate and Simplify',
            math: '\\frac{d}{dx}(x^2) = 2 \\cdot x^{2-1} = 2x^1 = 2x',
            explanation: 'Bring down 2 in front, decrease power to 1.'
          }
        ],
        finalAnswerMath: '\\frac{dy}{dx} = 2x',
        finalAnswerText: 'The derivative is 2x.'
      },
      {
        id: 'deriv-ex-2',
        questionMath: 'y = 5x^3',
        questionText: 'Find the derivative of y = 5x³.',
        method: 'Constant Multiple Rule & Power Rule',
        steps: [
          {
            stepNumber: 1,
            title: 'Factor Out the Constant',
            math: '\\frac{d}{dx}(5x^3) = 5 \\cdot \\frac{d}{dx}(x^3)',
            explanation: 'Keep the multiplier 5 and differentiate x³ using the Power Rule.'
          },
          {
            stepNumber: 2,
            title: 'Differentiate x³ and Multiply',
            math: '5 \\cdot (3x^2) = 15x^2',
            explanation: 'The derivative of x³ is 3x². Multiply 5 by 3 to obtain 15x².'
          }
        ],
        finalAnswerMath: '\\frac{dy}{dx} = 15x^2',
        finalAnswerText: 'The derivative is 15x².'
      },
      {
        id: 'deriv-ex-3',
        questionMath: 'y = \\sin x',
        questionText: 'Find the derivative of y = sin x.',
        method: 'Standard Trigonometric Rule',
        steps: [
          {
            stepNumber: 1,
            title: 'Apply the Standard Derivative',
            math: '\\frac{d}{dx}(\\sin x) = \\cos x',
            explanation: 'The instantaneous slope of the sine function at any angle x is given by cos(x).'
          }
        ],
        finalAnswerMath: '\\frac{dy}{dx} = \\cos x',
        finalAnswerText: 'The derivative is cos x.'
      }
    ],

    practiceHeading: 'Derivatives Practice',
    practiceQuestions: [
      {
        id: 'deriv-prac-1',
        questionPrompt: 'Find the derivative using the Power Rule:',
        questionMath: '\\frac{d}{dx}(x^3)',
        options: [
          { id: 'a', math: '3x^2' },
          { id: 'b', math: 'x^2' },
          { id: 'c', math: '3x^3' },
          { id: 'd', math: '2x' }
        ],
        correctOptionId: 'a',
        explanationText: 'By the Power Rule, bring down 3 and reduce the power to 2.',
        explanationMath: '\\frac{d}{dx}(x^3) = 3x^{3-1} = 3x^2'
      },
      {
        id: 'deriv-prac-2',
        questionPrompt: 'What is the derivative of the sine function?',
        questionMath: '\\frac{d}{dx}(\\sin x)',
        options: [
          { id: 'a', math: '-\\cos x' },
          { id: 'b', math: '\\cos x' },
          { id: 'c', math: '\\sin x' },
          { id: 'd', math: '1' }
        ],
        correctOptionId: 'b',
        explanationText: 'The derivative of sin(x) is positive cos(x).',
        explanationMath: '\\frac{d}{dx}(\\sin x) = \\cos x'
      },
      {
        id: 'deriv-prac-3',
        questionPrompt: 'Find the derivative of the constant function:',
        questionMath: '\\frac{d}{dx}(9)',
        options: [
          { id: 'a', math: '9' },
          { id: 'b', math: '0' },
          { id: 'c', math: '1' },
          { id: 'd', math: '9x' }
        ],
        correctOptionId: 'b',
        explanationText: 'The derivative of any constant number is always 0.',
        explanationMath: '\\frac{d}{dx}(c) = 0 \\implies \\frac{d}{dx}(9) = 0'
      }
    ]
  },

  // ==========================================
  // 3. INTEGRATION
  // ==========================================
  integration: {
    id: 'integration',
    title: 'INTEGRATION',
    shortDescription: 'Learn how integration is used to find accumulated quantities and areas.',
    featuredFormula: '\\int f(x)\\,dx',

    basicIdea: {
      heading: 'What is Integration?',
      definition: 'Integration can be understood as the reverse process of differentiation in many basic cases. Geometrically, it also calculates the total accumulated area under a curve.',
      primaryFormula: '\\int x\\,dx = \\frac{x^2}{2} + C',
      intuition: 'If differentiation tells you your instantaneous speed at every second, integration sums up those tiny speed increments to find the total distance traveled.',
      keyConceptBox: {
        title: 'The Constant of Integration (+ C)',
        text: 'Because the derivative of any constant number is 0, when we reverse differentiation we must include an arbitrary constant + C to account for all possible vertical shifts.',
        math: '\\int f(x)\\,dx = F(x) + C \\quad \\text{where } F\'(x) = f(x)'
      }
    },

    notationSection: {
      heading: 'Textbook Integral Notation',
      description: 'The standard anatomy of an indefinite integral:',
      notations: [
        {
          name: 'Integral Sign (∫)',
          math: '\\int',
          meaning: 'An elongated "S" (originally chosen by Leibniz for Latin "Summa"), representing a continuous sum of infinitesimal quantities.'
        },
        {
          name: 'Integrand f(x)',
          math: 'f(x)',
          meaning: 'The function to be integrated (the height of the curve).'
        },
        {
          name: 'Differential dx',
          math: 'dx',
          meaning: 'Indicates the variable of integration and represents an infinitesimally thin width along the x-axis.'
        },
        {
          name: 'Constant of Integration (+ C)',
          math: '+ C',
          meaning: 'Represents an arbitrary constant constant added to every indefinite integral.'
        }
      ]
    },

    rulesHeading: 'Basic Integration Rules',
    rulesDescription: 'These rules reverse the standard derivative rules to compute antiderivatives directly.',
    rules: [
      {
        id: 'int-power',
        name: 'Power Rule for Integration',
        formula: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\ne -1)',
        description: 'Add 1 to the exponent and divide by the new exponent (for any power except n = -1).',
        exampleMath: '\\int x^2\\,dx = \\frac{x^{2+1}}{2+1} + C = \\frac{x^3}{3} + C',
        exampleNote: 'Increases the power and divides by the new power.'
      },
      {
        id: 'int-const',
        name: 'Constant Rule',
        formula: '\\int k\\,dx = kx + C',
        description: 'The integral of a constant number k is simply kx + C.',
        exampleMath: '\\int 4\\,dx = 4x + C',
        exampleNote: 'Since d/dx(4x + C) = 4.'
      },
      {
        id: 'int-const-mult',
        name: 'Constant Multiple Rule',
        formula: '\\int c \\cdot f(x)\\,dx = c \\int f(x)\\,dx',
        description: 'A constant multiplier can be factored out in front of the integral sign.',
        exampleMath: '\\int 5x^2\\,dx = 5 \\int x^2\\,dx = 5 \\left(\\frac{x^3}{3}\\right) + C = \\frac{5x^3}{3} + C',
        exampleNote: 'Factor out 5, integrate x², then multiply.'
      },
      {
        id: 'int-sum',
        name: 'Sum & Difference Rule',
        formula: '\\int [f(x) \\pm g(x)]\\,dx = \\int f(x)\\,dx \\pm \\int g(x)\\,dx',
        description: 'Integrate a multi-term polynomial term by term.',
        exampleMath: '\\int (x + 2)\\,dx = \\frac{x^2}{2} + 2x + C',
        exampleNote: 'Integrate each piece separately.'
      }
    ],

    specialSection: {
      heading: 'Basic Trigonometric & Exponential Integrals',
      description: 'Standard antiderivative formulas for transcendental functions.',
      formulas: [
        {
          id: 'int-sin',
          name: 'Sine Integral',
          formula: '\\int \\sin x\\,dx = -\\cos x + C',
          description: 'The antiderivative of sin(x) is -cos(x) + C (because d/dx[-cos x] = +sin x).',
          exampleMath: '\\int \\sin x\\,dx = -\\cos x + C',
          exampleNote: 'Notice the negative sign in -cos(x)!'
        },
        {
          id: 'int-cos',
          name: 'Cosine Integral',
          formula: '\\int \\cos x\\,dx = \\sin x + C',
          description: 'The antiderivative of cos(x) is positive sin(x) + C.',
          exampleMath: '\\int \\cos x\\,dx = \\sin x + C',
          exampleNote: 'Since d/dx[sin x] = cos x.'
        },
        {
          id: 'int-exp',
          name: 'Natural Exponential Integral',
          formula: '\\int e^x\\,dx = e^x + C',
          description: 'The integral of e^x is itself: e^x + C.',
          exampleMath: '\\int e^x\\,dx = e^x + C',
          exampleNote: 'Unchanged under integration.'
        },
        {
          id: 'int-recip',
          name: 'Reciprocal (Logarithmic) Integral',
          formula: '\\int \\frac{1}{x}\\,dx = \\ln|x| + C \\quad (x \\ne 0)',
          description: 'Special case of the power rule when n = -1.',
          exampleMath: '\\int \\frac{1}{x}\\,dx = \\ln|x| + C',
          exampleNote: 'Uses absolute value |x| to encompass negative real numbers.'
        }
      ]
    },

    examplesHeading: 'Step-by-Step Integration Examples',
    examples: [
      {
        id: 'int-ex-1',
        questionMath: '\\int x\\,dx',
        questionText: 'Evaluate the indefinite integral of x.',
        method: 'Power Rule with n = 1',
        steps: [
          {
            stepNumber: 1,
            title: 'Identify the Exponent',
            math: 'x = x^1 \\implies n = 1',
            explanation: 'The variable x has an implicit power of 1.'
          },
          {
            stepNumber: 2,
            title: 'Apply the Integral Power Rule',
            math: '\\int x^1\\,dx = \\frac{x^{1+1}}{1+1} + C = \\frac{x^2}{2} + C',
            explanation: 'Add 1 to the exponent (1 + 1 = 2) and divide by the new exponent 2. Append the constant + C.'
          }
        ],
        finalAnswerMath: '\\frac{x^2}{2} + C',
        finalAnswerText: 'The integral is x²/2 + C.'
      },
      {
        id: 'int-ex-2',
        questionMath: '\\int x^2\\,dx',
        questionText: 'Evaluate the indefinite integral of x².',
        method: 'Power Rule with n = 2',
        steps: [
          {
            stepNumber: 1,
            title: 'Add 1 to the Power',
            math: 'n = 2 \\implies n + 1 = 3',
            explanation: 'The exponent increases from 2 to 3.'
          },
          {
            stepNumber: 2,
            title: 'Divide by the New Power',
            math: '\\int x^2\\,dx = \\frac{x^3}{3} + C',
            explanation: 'Divide x³ by 3 and add + C.'
          }
        ],
        finalAnswerMath: '\\frac{x^3}{3} + C',
        finalAnswerText: 'The integral is x³/3 + C.'
      },
      {
        id: 'int-ex-3',
        questionMath: '\\int 5x^2\\,dx',
        questionText: 'Evaluate the indefinite integral of 5x².',
        method: 'Constant Multiple Rule & Power Rule',
        steps: [
          {
            stepNumber: 1,
            title: 'Factor Out the Constant',
            math: '\\int 5x^2\\,dx = 5 \\int x^2\\,dx',
            explanation: 'Pull the constant 5 outside the integral sign.'
          },
          {
            stepNumber: 2,
            title: 'Integrate x² and Multiply',
            math: '5 \\cdot \\left(\\frac{x^3}{3}\\right) + C = \\frac{5x^3}{3} + C',
            explanation: 'Apply the power rule to x² to get x³/3, then multiply by 5.'
          }
        ],
        finalAnswerMath: '\\frac{5x^3}{3} + C',
        finalAnswerText: 'The integral is 5x³/3 + C.'
      }
    ],

    practiceHeading: 'Integration Practice',
    practiceQuestions: [
      {
        id: 'int-prac-1',
        questionPrompt: 'Evaluate the indefinite integral:',
        questionMath: '\\int x^3\\,dx',
        options: [
          { id: 'a', math: '\\frac{x^4}{4} + C' },
          { id: 'b', math: '3x^2 + C' },
          { id: 'c', math: '\\frac{x^3}{3} + C' },
          { id: 'd', math: '4x^4 + C' }
        ],
        correctOptionId: 'a',
        explanationText: 'Add 1 to the power (3 + 1 = 4) and divide by 4.',
        explanationMath: '\\int x^3\\,dx = \\frac{x^{3+1}}{3+1} + C = \\frac{x^4}{4} + C'
      },
      {
        id: 'int-prac-2',
        questionPrompt: 'What is the integral of the cosine function?',
        questionMath: '\\int \\cos x\\,dx',
        options: [
          { id: 'a', math: '-\\sin x + C' },
          { id: 'b', math: '\\sin x + C' },
          { id: 'c', math: '\\cos x + C' },
          { id: 'd', math: '-\\cos x + C' }
        ],
        correctOptionId: 'b',
        explanationText: 'The antiderivative of cos(x) is positive sin(x) + C.',
        explanationMath: '\\int \\cos x\\,dx = \\sin x + C'
      },
      {
        id: 'int-prac-3',
        questionPrompt: 'Evaluate the integral of the linear term:',
        questionMath: '\\int x\\,dx',
        options: [
          { id: 'a', math: '1 + C' },
          { id: 'b', math: '\\frac{x^2}{2} + C' },
          { id: 'c', math: 'x^2 + C' },
          { id: 'd', math: '2x + C' }
        ],
        correctOptionId: 'b',
        explanationText: 'By the Power Rule with n = 1, we get x²/2 + C.',
        explanationMath: '\\int x\\,dx = \\frac{x^2}{2} + C'
      }
    ]
  }
};
