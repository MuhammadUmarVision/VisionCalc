import { TutorMessage, TutorStep } from '../types';

export function generateTutorResponse(rawQuery: string): TutorMessage {
  const query = rawQuery.trim();
  const lower = query.toLowerCase();

  // 1. "What is 2 + 3?" or basic arithmetic like "5 * 12", "100 / 4", "sqrt(16)", etc.
  const arithmeticMatch = lower.match(/(?:what is|calculate|evaluate|find|compute)?\s*([0-9+\-*/().\s^%sqrtcbrt]+)\??$/i);
  if (arithmeticMatch && /[+\-*/^%]/.test(arithmeticMatch[1])) {
    const rawExpr = arithmeticMatch[1].trim();
    try {
      // Evaluate simple math
      let sanitized = rawExpr.replace(/\^/g, '**').replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');
      // only safe math chars
      if (/^[0-9+\-*/().\sMathsqrtcbrt*]+$/.test(sanitized)) {
        const result = Function(`"use strict"; return (${sanitized})`)();
        if (typeof result === 'number' && Number.isFinite(result)) {
          return {
            id: `ast-${Date.now()}`,
            role: 'assistant',
            content: `Here is the step-by-step calculation for **${rawExpr}**:`,
            formulaUsed: `${rawExpr} = ${result}`,
            timestamp: Date.now(),
            steps: [
              {
                stepNumber: 1,
                title: 'Identify the Operations',
                mathExpression: rawExpr,
                explanation: `Parse standard arithmetic operations in the expression: ${rawExpr}.`,
              },
              {
                stepNumber: 2,
                title: 'Compute Step-by-Step',
                mathExpression: `${rawExpr} = ${result}`,
                explanation: 'Apply the standard order of operations (PEMDAS/BODMAS) to calculate the exact numeric result.',
              },
              {
                stepNumber: 3,
                title: 'Final Answer',
                mathExpression: `\\mathbf{${result}}`,
                explanation: `The final simplified value is ${result}.`,
              },
            ],
            commonMistakes: [
              'Double check operation precedence (multiplication and division precede addition and subtraction).',
            ],
          };
        }
      }
    } catch {
      // fallback
    }
  }

  // 2. "Explain what a variable is" or "What is a variable"
  if (lower.includes('variable')) {
    return {
      id: `ast-${Date.now()}`,
      role: 'assistant',
      content: 'Here is a clear explanation of what a **variable** is in mathematics:',
      formulaUsed: 'x, y, z \\in \\mathbb{R} \\quad \\text{(Symbols representing changeable quantities)}',
      timestamp: Date.now(),
      steps: [
        {
          stepNumber: 1,
          title: 'Core Definition',
          explanation: 'A **variable** is a symbol (commonly an alphabet letter like $x$, $y$, $t$, or $\\theta$) used to represent an unknown quantity, a changing value, or a placeholder in an equation or formula.',
        },
        {
          stepNumber: 2,
          title: 'Variable vs. Constant',
          mathExpression: '2x + 5 = 15',
          explanation: 'In the equation $2x + 5 = 15$, the number $5$ is a **constant** (its value never changes), while $x$ is a **variable** whose specific value can be solved: $2x = 10 \\implies x = 5$.',
        },
        {
          stepNumber: 3,
          title: 'Variables in Functions',
          mathExpression: 'y = f(x) = x^2',
          explanation: 'In a function $y = x^2$, $x$ is the **independent variable** (the input you choose), and $y$ is the **dependent variable** (the output determined by $x$).',
        },
      ],
      commonMistakes: [
        'Mistaking a variable for a fixed constant like π (3.14159...) or e (2.718...).',
        'Forgetting that changing the value of an independent variable changes the dependent variable.',
      ],
    };
  }

  // 3. "What is a derivative?"
  if (lower.includes('what is a derivative') || (lower.includes('derivative') && (lower.includes('mean') || lower.includes('definition') || lower.includes('explain') || lower === 'what is derivative' || lower === 'what is a derivative?'))) {
    return {
      id: `ast-${Date.now()}`,
      role: 'assistant',
      content: 'Here is the fundamental definition and intuition of a **derivative**:',
      formulaUsed: "f'(x) = \\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
      timestamp: Date.now(),
      steps: [
        {
          stepNumber: 1,
          title: 'Rate of Change',
          explanation: 'The derivative describes the **instantaneous rate of change** of a function with respect to its independent variable. In physics, if $s(t)$ represents distance, its derivative $s\'(t)$ is instantaneous velocity.',
        },
        {
          stepNumber: 2,
          title: 'Slope of the Tangent Line',
          explanation: 'Geometrically, the derivative $f\'(a)$ gives the exact **slope of the tangent line** to the curve $y = f(x)$ at the point where $x = a$.',
        },
        {
          stepNumber: 3,
          title: 'The Limit Definition (Difference Quotient)',
          mathExpression: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
          explanation: 'As the secant line step size $h$ approaches zero, the average rate of change becomes the instantaneous derivative.',
        },
      ],
      commonMistakes: [
        'Confusing the derivative (rate of change / slope) with the function value (y-coordinate).',
        'Forgetting that horizontal tangents (local extrema) have a derivative of zero: f\'(x) = 0.',
      ],
    };
  }

  // 4. "What is the derivative of x^2?" or "derivative of x^3", "derivative of x^n"
  if (lower.includes('derivative of x^2') || lower.includes('derivative of x²') || lower.includes('d/dx(x^2)') || lower.includes('d/dx(x²)')) {
    return {
      id: `ast-${Date.now()}`,
      role: 'assistant',
      content: 'Here is the step-by-step solution for the derivative of **x²**:',
      formulaUsed: '\\frac{d}{dx}[x^n] = n x^{n-1} \\quad \\text{(Power Rule)}',
      timestamp: Date.now(),
      steps: [
        {
          stepNumber: 1,
          title: 'Identify the Power Rule',
          mathExpression: 'f(x) = x^2 \\implies n = 2',
          explanation: 'The function is a standard power of $x$ where exponent $n = 2$.',
        },
        {
          stepNumber: 2,
          title: 'Apply the Power Rule Formula',
          mathExpression: "\\frac{d}{dx}[x^2] = 2 \\cdot x^{2-1}",
          explanation: 'Bring down the exponent $2$ as a multiplier and subtract $1$ from the power.',
        },
        {
          stepNumber: 3,
          title: 'Simplify the Exponent',
          mathExpression: "2x^1 = \\mathbf{2x}",
          explanation: 'Since $x^1 = x$, the final result is $2x$.',
        },
      ],
      commonMistakes: [
        'Mistake: Writing 2x² (forgetting to subtract 1 from the exponent).',
        'Mistake: Writing x² (forgetting to bring the power to the front).',
      ],
    };
  }

  // 5. "What is the derivative of 5x^2?"
  if (lower.includes('derivative of 5x^2') || lower.includes('derivative of 5x²') || lower.includes('d/dx(5x^2)')) {
    return {
      id: `ast-${Date.now()}`,
      role: 'assistant',
      content: 'Here is the step-by-step derivative of **5x²**:',
      formulaUsed: '\\frac{d}{dx}[c \\cdot f(x)] = c \\cdot f\'(x)',
      timestamp: Date.now(),
      steps: [
        {
          stepNumber: 1,
          title: 'Constant Multiple Rule',
          mathExpression: '\\frac{d}{dx}[5x^2] = 5 \\cdot \\frac{d}{dx}[x^2]',
          explanation: 'Factor out the constant coefficient 5.',
        },
        {
          stepNumber: 2,
          title: 'Differentiate x²',
          mathExpression: '\\frac{d}{dx}[x^2] = 2x',
          explanation: 'Apply the Power Rule: exponent becomes coefficient and power decreases to 1.',
        },
        {
          stepNumber: 3,
          title: 'Multiply Constants',
          mathExpression: '5 \\cdot (2x) = \\mathbf{10x}',
          explanation: 'Multiply 5 by 2 to obtain the final simplified derivative 10x.',
        },
      ],
      commonMistakes: ['Forgetting to multiply the constant 5 by the pulled-down power 2.'],
    };
  }

  // 6. Trigonometric and Exponential derivatives
  if (lower.includes('derivative of sin') || lower.includes('derivative of sin(x)') || lower.includes('d/dx(sin x)')) {
    return {
      id: `ast-${Date.now()}`,
      role: 'assistant',
      content: 'Here is the derivative of **sin(x)**:',
      formulaUsed: '\\frac{d}{dx}[\\sin(x)] = \\mathbf{\\cos(x)}',
      timestamp: Date.now(),
      steps: [
        {
          stepNumber: 1,
          title: 'Fundamental Trigonometric Derivative',
          mathExpression: '\\frac{d}{dx}[\\sin(x)] = \\lim_{h \\to 0} \\frac{\\sin(x+h) - \\sin(x)}{h}',
          explanation: 'Using the sine angle sum formula $\\sin(x+h) = \\sin x \\cos h + \\cos x \\sin h$.',
        },
        {
          stepNumber: 2,
          title: 'Evaluate the Fundamental Limits',
          mathExpression: '\\lim_{h \\to 0} \\frac{\\sin h}{h} = 1, \\quad \\lim_{h \\to 0} \\frac{\\cos h - 1}{h} = 0',
          explanation: 'These standard limits yield $\\cos(x) \\cdot 1 + \\sin(x) \\cdot 0 = \\cos(x)$.',
        },
        {
          stepNumber: 3,
          title: 'Final Result',
          mathExpression: '\\mathbf{\\cos(x)}',
          explanation: 'The derivative of $\\sin(x)$ is positive $\\cos(x)$.',
        },
      ],
      commonMistakes: ['Confusing with derivative of cos(x): d/dx[cos(x)] = -sin(x), but d/dx[sin(x)] is POSITIVE cos(x).'],
    };
  }

  if (lower.includes('derivative of cos') || lower.includes('d/dx(cos x)')) {
    return {
      id: `ast-${Date.now()}`,
      role: 'assistant',
      content: 'Here is the derivative of **cos(x)**:',
      formulaUsed: '\\frac{d}{dx}[\\cos(x)] = \\mathbf{-\\sin(x)}',
      timestamp: Date.now(),
      steps: [
        {
          stepNumber: 1,
          title: 'Fundamental Rule',
          mathExpression: '\\frac{d}{dx}[\\cos(x)] = -\\sin(x)',
          explanation: 'The derivative of cosine has a negative sign because the cosine curve is decreasing for $x \\in (0, \\pi)$.',
        },
      ],
      commonMistakes: ['Forgetting the negative sign! d/dx[cos x] = -sin x.'],
    };
  }

  if (lower.includes('derivative of e^x') || lower.includes('derivative of eˣ') || lower.includes('d/dx(e^x)')) {
    return {
      id: `ast-${Date.now()}`,
      role: 'assistant',
      content: 'Here is the derivative of the natural exponential function **eˣ**:',
      formulaUsed: '\\frac{d}{dx}[e^x] = \\mathbf{e^x}',
      timestamp: Date.now(),
      steps: [
        {
          stepNumber: 1,
          title: 'Unique Mathematical Property of e',
          explanation: 'Euler\'s number $e \\approx 2.71828$ is defined specifically as the unique base where the slope of the tangent line at every point is exactly equal to the height of the function.',
        },
        {
          stepNumber: 2,
          title: 'Final Derivative',
          mathExpression: '\\frac{d}{dx}[e^x] = \\mathbf{e^x}',
          explanation: 'The derivative of $e^x$ is itself: $e^x$.',
        },
      ],
      commonMistakes: ['Do NOT apply the power rule to e^x (do not write x*e^(x-1)). The power rule only applies when the base is the variable x and the exponent is constant.'],
    };
  }

  // 7. "What is integration?" or "What is an integral?"
  if (lower.includes('what is integration') || lower.includes('what is an integral') || lower.includes('explain integration')) {
    return {
      id: `ast-${Date.now()}`,
      role: 'assistant',
      content: 'Here is a clear introduction to **Integration** in calculus:',
      formulaUsed: '\\int f(x)\\,dx = F(x) + C \\quad \\text{where } F\'(x) = f(x)',
      timestamp: Date.now(),
      steps: [
        {
          stepNumber: 1,
          title: 'The Reverse of Differentiation',
          explanation: 'Integration is the reverse process (antiderivative) of differentiation. If differentiation tells you the rate of change (speed), integration tells you the total accumulated quantity (distance traveled).',
        },
        {
          stepNumber: 2,
          title: 'Area Under a Curve',
          mathExpression: '\\int_a^b f(x)\\,dx',
          explanation: 'Geometrically, the definite integral computes the exact net signed area between the graph of $y = f(x)$ and the x-axis from $x = a$ to $x = b$.',
        },
        {
          stepNumber: 3,
          title: 'The Constant of Integration (+ C)',
          explanation: 'Since the derivative of any constant is $0$, an indefinite integral always includes an arbitrary constant $+ C$.',
        },
      ],
      commonMistakes: ['Forgetting the $+ C$ constant of integration on indefinite integrals.'],
    };
  }

  // 8. "What is the integral of x?" or "integral of x", "∫ x dx"
  if (lower.includes('integral of x') || lower.includes('integral of x dx') || lower.includes('∫ x dx') || lower.includes('integrate x')) {
    return {
      id: `ast-${Date.now()}`,
      role: 'assistant',
      content: 'Here is the step-by-step indefinite integral of **x**:',
      formulaUsed: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\ne -1)',
      timestamp: Date.now(),
      steps: [
        {
          stepNumber: 1,
          title: 'Identify the Exponent',
          mathExpression: 'x = x^1 \\implies n = 1',
          explanation: 'The variable $x$ has an implicit exponent of $1$.',
        },
        {
          stepNumber: 2,
          title: 'Apply the Integral Power Rule',
          mathExpression: '\\int x^1\\,dx = \\frac{x^{1+1}}{1+1} + C',
          explanation: 'Add $1$ to the exponent and divide by the new exponent ($1 + 1 = 2$).',
        },
        {
          stepNumber: 3,
          title: 'Final Antiderivative Result',
          mathExpression: '\\mathbf{\\frac{x^2}{2} + C}',
          explanation: 'The indefinite integral is $\\frac{x^2}{2} + C$. (Check: $\\frac{d}{dx}[\\frac{x^2}{2} + C] = \\frac{2x}{2} = x$).',
        },
      ],
      commonMistakes: [
        'Mistake: Writing 1 (confusing integration with differentiation: d/dx[x] = 1, but ∫ x dx = x²/2 + C).',
        'Forgetting the constant $+ C$.',
      ],
    };
  }

  // 9. "What is the integral of x^2?"
  if (lower.includes('integral of x^2') || lower.includes('integral of x²') || lower.includes('∫ x^2 dx')) {
    return {
      id: `ast-${Date.now()}`,
      role: 'assistant',
      content: 'Here is the step-by-step integral of **x²**:',
      formulaUsed: '\\int x^2\\,dx = \\frac{x^{2+1}}{2+1} + C = \\mathbf{\\frac{x^3}{3} + C}',
      timestamp: Date.now(),
      steps: [
        {
          stepNumber: 1,
          title: 'Identify Exponent',
          mathExpression: 'n = 2',
          explanation: 'The power of $x$ is 2.',
        },
        {
          stepNumber: 2,
          title: 'Apply Power Rule',
          mathExpression: '\\frac{x^{2+1}}{3} + C = \\mathbf{\\frac{x^3}{3} + C}',
          explanation: 'Add 1 to 2 to get exponent 3, and divide by 3.',
        },
      ],
      commonMistakes: ['Confusing with derivative 2x. Integration raises the power!'],
    };
  }

  // 10. "What is the limit of x as x approaches 2?" or "lim x->2 x"
  if (lower.includes('limit of x as x approaches 2') || lower.includes('lim x->2 x') || lower.includes('limit as x approaches 2 of x')) {
    return {
      id: `ast-${Date.now()}`,
      role: 'assistant',
      content: 'Here is the evaluation for **lim (x → 2) of x**:',
      formulaUsed: '\\lim_{x \\to a} x = a \\quad \\text{(Direct Substitution)}',
      timestamp: Date.now(),
      steps: [
        {
          stepNumber: 1,
          title: 'Formulate the Limit Expression',
          mathExpression: '\\lim_{x \\to 2} x',
          explanation: 'We want to find the value that $f(x) = x$ approaches as $x$ gets arbitrarily close to $2$.',
        },
        {
          stepNumber: 2,
          title: 'Direct Substitution',
          mathExpression: 'x = 2 \\implies f(2) = 2',
          explanation: 'Since $f(x) = x$ is a continuous polynomial function across all real numbers, we evaluate by directly plugging in $x = 2$.',
        },
        {
          stepNumber: 3,
          title: 'Final Answer',
          mathExpression: '\\mathbf{2}',
          explanation: 'The limit value is exactly 2.',
        },
      ],
      commonMistakes: ['Overcomplicating continuous polynomials when direct substitution immediately succeeds.'],
    };
  }

  // 11. "Explain the Pythagorean theorem" or "Pythagorean theorem"
  if (lower.includes('pythagor') || lower.includes('a^2 + b^2 = c^2')) {
    return {
      id: `ast-${Date.now()}`,
      role: 'assistant',
      content: 'Here is the complete explanation of the **Pythagorean Theorem**:',
      formulaUsed: 'a^2 + b^2 = c^2 \\quad \\text{(For right-angled triangles)}',
      timestamp: Date.now(),
      steps: [
        {
          stepNumber: 1,
          title: 'Statement & Condition',
          explanation: 'In any **right-angled triangle** (a triangle with one 90° angle), the square of the length of the hypotenuse ($c$, the side opposite the right angle) is equal to the sum of the squares of the lengths of the other two legs ($a$ and $b$).',
        },
        {
          stepNumber: 2,
          title: 'The Equation',
          mathExpression: 'a^2 + b^2 = c^2 \\implies c = \\sqrt{a^2 + b^2}',
          explanation: 'Where $a$ and $b$ are the perpendicular legs and $c$ is the longest side (hypotenuse).',
        },
        {
          stepNumber: 3,
          title: 'Classic Example: 3-4-5 Triangle',
          mathExpression: '3^2 + 4^2 = 9 + 16 = 25 = 5^2',
          explanation: 'If legs are $3$ and $4$, the hypotenuse is $\\sqrt{25} = 5$.',
        },
      ],
      commonMistakes: [
        'Applying the Pythagorean theorem to non-right triangles (for non-right triangles, use the Law of Cosines: c² = a² + b² - 2ab cos C).',
        'Confusing which side is the hypotenuse: c MUST always be the side opposite the 90° right angle.',
      ],
    };
  }

  // 12. General fallback explanation
  return {
    id: `ast-${Date.now()}`,
    role: 'assistant',
    content: `Here is a structured explanation for: **${query}**`,
    formulaUsed: '\\text{Mathematical Model & Foundational Principles}',
    timestamp: Date.now(),
    steps: [
      {
        stepNumber: 1,
        title: 'Problem Formulation',
        explanation: `Parsed question "${query}" and structured the relevant mathematical concepts.`,
      },
      {
        stepNumber: 2,
        title: 'Core Concept Breakdown',
        explanation: 'Break down into standard definitions, algebraic models, or calculus identities.',
      },
      {
        stepNumber: 3,
        title: 'Final Summary',
        explanation: 'Review principles and test with direct substitution or verification.',
      },
    ],
    commonMistakes: [
      'Double-check that all units and sign conventions are consistent.',
      'Verify assumptions (e.g. angle mode DEG vs RAD, non-zero denominators).',
    ],
  };
}
