import { CalculusTopic } from '../types';

export const CALCULUS_TOPICS: CalculusTopic[] = [
  // --- LIMITS ---
  {
    id: 'limits-intro',
    category: 'limits',
    title: 'Concept & Intuition of Limits',
    subtitle: 'Understanding behavior near a point without necessarily reaching it',
    formula: '\\lim_{x \\to a} f(x) = L',
    intuition: 'A limit describes what value a function approaches as the input gets closer and closer to some specific number. It answers: "Where is the function heading?" rather than "What is the function value right at that point?"',
    keyRules: [
      { name: 'Sum Rule', formula: '\\lim [f(x) + g(x)] = \\lim f(x) + \\lim g(x)', example: '\\lim (x + 3) = 2 + 3 = 5 \\text{ as } x \\to 2' },
      { name: 'Product Rule', formula: '\\lim [f(x) \\cdot g(x)] = [\\lim f(x)] \\cdot [\\lim g(x)]', example: '\\lim (x^2) = 2 \\cdot 2 = 4 \\text{ as } x \\to 2' },
      { name: 'Direct Substitution', formula: '\\lim_{x \\to a} P(x) = P(a)', example: 'For any continuous polynomial, simply plug in a.' }
    ],
    interactiveSteps: [
      { step: 1, prompt: 'Evaluate: $\\lim_{x \\to 3} (2x^2 - 4x + 1)$', result: 'Check for continuity: this is a polynomial, so direct substitution applies.', tip: 'No zero in denominator.' },
      { step: 2, prompt: 'Substitute $x = 3$ directly into the expression.', result: '$2(3)^2 - 4(3) + 1 = 2(9) - 12 + 1$', tip: 'Calculate terms in order.' },
      { step: 3, prompt: 'Perform final arithmetic.', result: '$18 - 12 + 1 = 7$', tip: 'Therefore, the limit is 7.' }
    ],
    practiceQuestion: {
      question: 'What is the limit of $f(x) = \\frac{x^2 - 9}{x - 3}$ as $x \\to 3$?',
      options: ['Undefined (0/0)', '3', '6', '9'],
      correctIndex: 2,
      explanation: 'Factor numerator: (x-3)(x+3)/(x-3) = x+3 (for x ≠ 3). Then evaluate lim as x→3 of (x+3) = 3 + 3 = 6.'
    }
  },
  {
    id: 'trig-limits',
    category: 'limits',
    title: 'Trigonometric Limits & Squeeze Theorem',
    subtitle: 'Essential trigonometric limits that unlock derivatives of sin and cos',
    formula: '\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1, \\quad \\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x} = 0',
    intuition: 'Near zero, the length of the arc x in radians is almost indistinguishable from the vertical line sin(x). Thus their ratio approaches exactly 1.',
    keyRules: [
      { name: 'Fundamental Sine Limit', formula: '\\lim_{\\theta \\to 0} \\frac{\\sin(k\\theta)}{k\\theta} = 1', example: '\\lim_{x \\to 0} \\frac{\\sin(5x)}{x} = 5' },
      { name: 'Cosine Difference Limit', formula: '\\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x} = 0', example: 'Key identity for proving (cos x)\' = -sin x' },
      { name: 'Squeeze Theorem', formula: 'g(x) \\le f(x) \\le h(x) \\implies \\lim f(x) = L', example: 'Used for proving \\lim_{x \\to 0} x^2 \\sin(1/x) = 0' }
    ],
    interactiveSteps: [
      { step: 1, prompt: 'Evaluate: $\\lim_{x \\to 0} \\frac{\\sin(4x)}{3x}$', result: 'Rewrite to match the form $\\frac{\\sin(\\theta)}{\\theta}$.', tip: 'Multiply and divide by 4.' },
      { step: 2, prompt: 'Factor out constants: $\\frac{4}{3} \\cdot \\lim_{x \\to 0} \\frac{\\sin(4x)}{4x}$', result: 'Since $4x \\to 0$ as $x \\to 0$, the trigonometric part equals 1.', tip: '$\\lim_{u \\to 0} \\frac{\\sin u}{u} = 1$.' },
      { step: 3, prompt: 'Multiply with the constant coefficient.', result: '$\\frac{4}{3} \\times 1 = \\frac{4}{3}$', tip: 'Answer is 4/3.' }
    ],
    practiceQuestion: {
      question: 'What is $\\lim_{x \\to 0} \\frac{\\tan(2x)}{x}$?',
      options: ['0', '1', '2', 'Does not exist'],
      correctIndex: 2,
      explanation: 'tan(2x)/x = [sin(2x)/x] * [1/cos(2x)] = 2 * [sin(2x)/(2x)] * [1/1] = 2 * 1 * 1 = 2.'
    }
  },

  // --- DERIVATIVES ---
  {
    id: 'derivatives-rules',
    category: 'derivatives',
    title: 'Core Derivative Rules (Power, Product, Quotient)',
    subtitle: 'The foundational mechanics for computing instantaneous rates of change',
    formula: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
    intuition: 'The derivative measures the exact instantaneous rate of change or the slope of the tangent line to a curve at any point x.',
    keyRules: [
      { name: 'Power Rule', formula: '\\frac{d}{dx}[x^n] = n x^{n-1}', example: '\\frac{d}{dx}[x^4] = 4x^3' },
      { name: 'Product Rule', formula: '(u \\cdot v)\' = u\'v + uv\'', example: '\\frac{d}{dx}[x \\sin x] = 1 \\cdot \\sin x + x \\cos x' },
      { name: 'Quotient Rule', formula: '\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}', example: 'Remember: "Low d-High minus High d-Low over Low-squared"' }
    ],
    interactiveSteps: [
      { step: 1, prompt: 'Find the derivative of $f(x) = 3x^4 - 5x^2 + 7x - 9$', result: 'Apply linearity and differentiate term by term.', tip: 'Use the Power Rule $n x^{n-1}$.' },
      { step: 2, prompt: 'Compute individual derivatives for each term.', result: '$3(4x^3) - 5(2x^1) + 7(1) - 0 = 12x^3 - 10x + 7$', tip: 'Derivative of any constant is 0.' },
      { step: 3, prompt: 'Combine into the final derivative formula.', result: '$f\'(x) = 12x^3 - 10x + 7$', tip: 'Verified polynomial derivative.' }
    ],
    practiceQuestion: {
      question: 'What is the derivative of $f(x) = x^3 \\ln(x)$?',
      options: ['3x^2 / x', '3x^2 \\ln(x) + x^2', '3x^2 \\ln(x) + x^3', 'x^2(3\\ln(x) + 2)'],
      correctIndex: 1,
      explanation: 'Using Product Rule: (x³)\' * ln(x) + x³ * (ln x)\' = 3x² ln(x) + x³*(1/x) = 3x² ln(x) + x².'
    }
  },
  {
    id: 'chain-rule',
    category: 'derivatives',
    title: 'The Chain Rule for Composite Functions',
    subtitle: 'Differentiating nested functions $f(g(x))$ ("derivative of outside times derivative of inside")',
    formula: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
    intuition: 'If gear A turns at 2x the rate of gear B, and gear B turns at 3x the rate of gear C, then gear A turns at (2 × 3) = 6x the rate of gear C.',
    keyRules: [
      { name: 'Standard Chain Rule', formula: '\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}', example: '\\frac{d}{dx}[\\sin(x^2)] = \\cos(x^2) \\cdot 2x' },
      { name: 'Generalized Power Rule', formula: '\\frac{d}{dx}[(g(x))^n] = n(g(x))^{n-1} g\'(x)', example: '\\frac{d}{dx}[(2x+1)^5] = 5(2x+1)^4 \\cdot 2 = 10(2x+1)^4' },
      { name: 'Exponential Chain Rule', formula: '\\frac{d}{dx}[e^{g(x)}] = e^{g(x)} g\'(x)', example: '\\frac{d}{dx}[e^{3x^2}] = 6x e^{3x^2}' }
    ],
    interactiveSteps: [
      { step: 1, prompt: 'Find the derivative of $y = \\sqrt{3x^2 + 1}$', result: 'Rewrite radical as power: $y = (3x^2 + 1)^{1/2}$.', tip: 'Identify inner function $u = 3x^2 + 1$.' },
      { step: 2, prompt: 'Differentiate outer function: $\\frac{1}{2}(3x^2 + 1)^{-1/2}$', result: 'Multiply by derivative of inner function: $\\frac{d}{dx}(3x^2 + 1) = 6x$.', tip: 'Inner derivative is $6x$.' },
      { step: 3, prompt: 'Simplify the combined product.', result: '$\\frac{1}{2} \\cdot 6x \\cdot (3x^2 + 1)^{-1/2} = \\frac{3x}{\\sqrt{3x^2 + 1}}$', tip: 'Final simplified derivative.' }
    ],
    practiceQuestion: {
      question: 'What is $\\frac{d}{dx}[\\cos(4x^3)]$',
      options: ['-sin(4x^3)', '-12x^2 \\sin(4x^3)', '12x^2 \\sin(4x^3)', '-12x \\cos(4x^3)'],
      correctIndex: 1,
      explanation: 'Derivative of cos(u) is -sin(u). Multiply by u\' = d/dx(4x³) = 12x². Result: -12x² sin(4x³).'
    }
  },

  // --- INTEGRATION ---
  {
    id: 'integration-basics',
    category: 'integration',
    title: 'Indefinite Integrals & Power Rule',
    subtitle: 'Reversing differentiation to find area under curves and total accumulation',
    formula: '\\int f(x)\\,dx = F(x) + C \\quad \\text{where } F\'(x) = f(x)',
    intuition: 'Integration is the mathematical inverse of differentiation. If the derivative tells you your instantaneous speedometer reading, integration sums up those speeds over time to calculate total distance traveled.',
    keyRules: [
      { name: 'Integral Power Rule', formula: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\; (n \\ne -1)', example: '\\int x^3\\,dx = \\frac{x^4}{4} + C' },
      { name: 'Reciprocal Log Rule', formula: '\\int \\frac{1}{x}\\,dx = \\ln|x| + C', example: 'Special case where n = -1' },
      { name: 'Exponential Rule', formula: '\\int e^{kx}\\,dx = \\frac{1}{k}e^{kx} + C', example: '\\int e^{2x}\\,dx = \\frac{1}{2}e^{2x} + C' }
    ],
    interactiveSteps: [
      { step: 1, prompt: 'Evaluate: $\\int (6x^2 - 4x + 5)\\,dx$', result: 'Split into separate integrals: $6\\int x^2\\,dx - 4\\int x\\,dx + 5\\int 1\\,dx$.', tip: 'Constant multiple rule applies.' },
      { step: 2, prompt: 'Apply Power Rule $\\frac{x^{n+1}}{n+1}$ to each term.', result: '$6\\left(\\frac{x^3}{3}\\right) - 4\\left(\\frac{x^2}{2}\\right) + 5x + C$', tip: 'Always add the constant of integration $+ C$.' },
      { step: 3, prompt: 'Simplify all numeric fractions.', result: '$2x^3 - 2x^2 + 5x + C$', tip: 'Final indefinite integral.' }
    ],
    practiceQuestion: {
      question: 'What is $\\int (3x^2 + \\frac{1}{x} + e^x)\\,dx$?',
      options: ['6x - 1/x^2 + e^x + C', 'x^3 + \\ln|x| + e^x + C', 'x^3 + \\ln(x) + xe^x + C', '3x^3 + \\ln|x| + e^x + C'],
      correctIndex: 1,
      explanation: 'Integral of 3x² is 3(x³/3) = x³. Integral of 1/x is ln|x|. Integral of e^x is e^x. Add + C.'
    }
  },
  {
    id: 'integration-by-parts',
    category: 'integration',
    title: 'Integration by Parts & Substitution',
    subtitle: 'Powerful techniques for integrating products and composite differentials',
    formula: '\\int u\\,dv = uv - \\int v\\,du',
    intuition: 'Integration by parts is simply the integral version of the Product Rule for derivatives, allowing you to transfer differentiation from an intractable factor $u$ to a simpler form.',
    keyRules: [
      { name: 'LIATE Priority for choosing u', formula: '\\text{Logarithmic, Inverse trig, Algebraic, Trig, Exponential}', example: 'For $\\int x e^x dx$, choose $u = x$ (Algebraic) and $dv = e^x dx$' },
      { name: 'U-Substitution', formula: '\\int f(g(x))g\'(x)\\,dx = \\int f(u)\\,du', example: 'Substitute $u = g(x)$ and $du = g\'(x)dx$' },
      { name: 'Fundamental Theorem of Calculus', formula: '\\int_a^b f(x)\\,dx = F(b) - F(a)', example: 'Computes exact net signed area between x=a and x=b' }
    ],
    interactiveSteps: [
      { step: 1, prompt: 'Evaluate $\\int x \\cos(x)\\,dx$ using Integration by Parts.', result: 'Choose $u = x$ (Algebraic) and $dv = \\cos(x)\\,dx$ (Trig).', tip: 'LIATE rule.' },
      { step: 2, prompt: 'Compute differentials: $du = dx$ and $v = \\int \\cos(x)\\,dx = \\sin(x)$.', result: 'Substitute into formula: $\\int u\\,dv = u v - \\int v\\,du = x\\sin(x) - \\int \\sin(x)\\,dx$.', tip: 'Be careful with signs.' },
      { step: 3, prompt: 'Evaluate the remaining integral $-\\int \\sin(x)\\,dx = +\\cos(x)$.', result: '$x\\sin(x) + \\cos(x) + C$', tip: 'Final verified antiderivative.' }
    ],
    practiceQuestion: {
      question: 'Evaluate the definite integral $\\int_0^2 3x^2\\,dx$.',
      options: ['6', '8', '12', '24'],
      correctIndex: 1,
      explanation: 'Antiderivative of 3x² is x³. Evaluating [x³] from 0 to 2 gives 2³ - 0³ = 8 - 0 = 8.'
    }
  }
];
