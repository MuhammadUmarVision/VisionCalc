import { AngleMode } from '../types';

// Audio feedback helper using Web Audio API
let audioCtx: AudioContext | null = null;

export function playKeyClickSound(type: 'num' | 'op' | 'func' | 'equals' | 'clear' = 'num') {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    
    if (type === 'equals') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'clear') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.06);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'func') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(type === 'op' ? 440 : 380, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    }
  } catch {
    // Ignore audio autoplay restrictions gracefully
  }
}

// Calculate factorial
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // Max JS double
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

// Safe evaluation of scientific expressions
export function evaluateExpression(rawExpression: string, angleMode: AngleMode = 'DEG', precision = 10): { result: string; numericVal: number; error?: string } {
  if (!rawExpression || rawExpression.trim() === '') {
    return { result: '0', numericVal: 0 };
  }

  try {
    let expr = rawExpression;

    // Standardize unicode symbols
    expr = expr.replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'Math.PI')
      .replace(/e(?![a-zA-Z0-9_])/g, 'Math.E')
      .replace(/EXP/g, '*10^');

    // Handle percentage like "50%" -> "(50/100)" or "200 + 10%"
    expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // Handle factorials e.g. 5! -> factorial(5)
    expr = expr.replace(/(\d+(\.\d+)?|\([^)]+\))!/g, (_match, p1) => `factorial(${p1})`);

    // Handle powers e.g. 2^3 -> Math.pow(2,3)
    // Handle nested or multiple powers recursively
    while (expr.includes('^')) {
      const powRegex = /([a-zA-Z0-9_.]+|\([^()]+\))\^([a-zA-Z0-9_.]+|\([^()]+\))/;
      if (!powRegex.test(expr)) break;
      expr = expr.replace(powRegex, 'Math.pow($1,$2)');
    }

    // Handle roots: sqrt(x) -> Math.sqrt(x), cbrt(x) -> Math.cbrt(x)
    expr = expr.replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/√\(/g, 'Math.sqrt(')
      .replace(/cbrt\(/g, 'Math.cbrt(');

    // Handle logarithms: ln(x) -> Math.log(x), log(x) -> Math.log10(x)
    expr = expr.replace(/\bln\(/g, 'Math.log(');
    expr = expr.replace(/\blog10\(/g, 'Math.log10(');
    expr = expr.replace(/\blog\(/g, 'Math.log10(');

    // Handle Trig with AngleMode
    const toRad = angleMode === 'DEG' ? '(Math.PI/180)*' : '';
    const fromRad = angleMode === 'DEG' ? '*(180/Math.PI)' : '';

    // Inverse trig
    expr = expr.replace(/\basin\(/g, `(${fromRad}Math.asin(`);
    expr = expr.replace(/\bacos\(/g, `(${fromRad}Math.acos(`);
    expr = expr.replace(/\batan\(/g, `(${fromRad}Math.atan(`);

    // Direct trig
    expr = expr.replace(/\bsin\(/g, `Math.sin(${toRad}`);
    expr = expr.replace(/\bcos\(/g, `Math.cos(${toRad}`);
    expr = expr.replace(/\btan\(/g, `Math.tan(${toRad}`);

    // Hyperbolic trig
    expr = expr.replace(/\bsinh\(/g, 'Math.sinh(');
    expr = expr.replace(/\bcosh\(/g, 'Math.cosh(');
    expr = expr.replace(/\btanh\(/g, 'Math.tanh(');

    // Absolute
    expr = expr.replace(/\babs\(/g, 'Math.abs(');

    // Safe execution sandbox
    const scope = {
      Math,
      factorial,
    };

    // Construct safe function
    const fn = new Function('Math', 'factorial', `return (${expr});`);
    const val = fn(scope.Math, scope.factorial);

    if (val === undefined || Number.isNaN(val)) {
      return { result: 'Error: Undefined', numericVal: NaN, error: 'Undefined calculation result' };
    }

    if (!Number.isFinite(val)) {
      return { result: val > 0 ? 'Infinity' : '-Infinity', numericVal: val };
    }

    // Format output cleanly (handling float inaccuracies like 0.1 + 0.2 = 0.30000000000000004)
    let formatted: string;
    const rounded = Number(val.toPrecision(precision));
    
    // If integer or simple number
    if (Math.abs(rounded) >= 1e12 || (Math.abs(rounded) < 1e-6 && rounded !== 0)) {
      formatted = rounded.toExponential(6).replace('e+', 'e');
    } else {
      formatted = rounded.toString();
    }

    return { result: formatted, numericVal: val };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid Expression';
    return { result: 'Error', numericVal: NaN, error: message };
  }
}

// Generate mathematical breakdown / insight of a calculated expression
export interface CalculationInsight {
  type: string;
  steps: string[];
  properties: string[];
  category: 'Arithmetic' | 'Trigonometry' | 'Exponential' | 'Calculus' | 'Algebra';
}

export function analyzeExpression(expression: string, result: string, angleMode: AngleMode): CalculationInsight {
  const clean = expression.trim().toLowerCase();
  
  if (clean.includes('sin') || clean.includes('cos') || clean.includes('tan')) {
    return {
      type: 'Trigonometric Evaluation',
      category: 'Trigonometry',
      steps: [
        `Identified trigonometric operation in ${angleMode} mode.`,
        angleMode === 'DEG' ? 'Converted argument from degrees to radians ($x \\times \\frac{\\pi}{180}$).' : 'Evaluated in natural radian measurement.',
        `Evaluated precise functional value to ${result}.`
      ],
      properties: [
        `Angle Mode: ${angleMode}`,
        'Periodic function bounds: [-1, 1] for sine/cosine',
        'Useful identity: sin²(θ) + cos²(θ) = 1'
      ]
    };
  }

  if (clean.includes('^') || clean.includes('sqrt') || clean.includes('√')) {
    return {
      type: 'Exponential / Radical Operation',
      category: 'Algebra',
      steps: [
        'Parsed base and exponent/root operations.',
        'Applied power laws: $a^b$ or $\\sqrt[n]{a} = a^{1/n}$.',
        `Yielded final computed value: ${result}`
      ],
      properties: [
        'Inverse relationship: $(a^b)^{1/b} = a$',
        'Exponential growth / radical domain checks applied'
      ]
    };
  }

  if (clean.includes('log') || clean.includes('ln')) {
    return {
      type: 'Logarithmic Calculation',
      category: 'Algebra',
      steps: [
        clean.includes('ln') ? 'Natural logarithm with base Euler’s constant $e \\approx 2.71828$.' : 'Common logarithm with base 10.',
        'Evaluated logarithmic exponent $y = \\log_b(x) \\iff b^y = x$.',
        `Computed value: ${result}`
      ],
      properties: [
        'Domain requires strictly positive argument $(x > 0)$',
        'Log rule: $\\ln(ab) = \\ln(a) + \\ln(b)$'
      ]
    };
  }

  if (clean.includes('!')) {
    return {
      type: 'Factorial / Combinatorial Product',
      category: 'Arithmetic',
      steps: [
        'Recognized factorial operator $n! = n \\times (n-1) \\times \\dots \\times 1$.',
        'Computed continuous product across integer sequence.',
        `Result: ${result}`
      ],
      properties: [
        'Definition: $0! = 1$',
        'Fundamental in permutations $P(n, r)$ and combinations $C(n, r)$'
      ]
    };
  }

  return {
    type: 'Scientific Arithmetic',
    category: 'Arithmetic',
    steps: [
      'Parsed expression following PEMDAS/BODMAS operator precedence.',
      'Evaluated nested parentheses and primary operations.',
      `Computed result: ${result}`
    ],
    properties: [
      'Commutative & associative properties preserved',
      'Real number field $\\mathbb{R}$ representation'
    ]
  };
}

// Natural voice command translator with full pattern coverage
export function translateVoiceMathCommand(transcript: string, angleMode: AngleMode = 'DEG'): { expression: string; description: string; shouldSolve: boolean } {
  if (!transcript || transcript.trim() === '') {
    return { expression: '', description: '', shouldSolve: false };
  }

  const raw = transcript.trim();
  const lower = raw.toLowerCase()
    .replace(/\bdegrees?\b/g, '')
    .replace(/\bradians?\b/g, '')
    .replace(/\bwhat is\b/g, '')
    .replace(/\bcalculate\b/g, '')
    .replace(/\bfind\b/g, '')
    .replace(/\bthe\b/g, '')
    .replace(/\bvalue of\b/g, '')
    .replace(/\bevaluate\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. Trig: "sine of 90", "sin 90", "sine 90"
  let match = lower.match(/^(?:sin|sine)\s+(?:of\s+)?(\d+(?:\.\d+)?|\bpi\b|\be\b)/i);
  if (match) {
    const val = match[1].toLowerCase() === 'pi' ? 'π' : match[1];
    return {
      expression: `sin(${val})`,
      description: angleMode === 'DEG' ? `sin(${val}°)` : `sin(${val} rad)`,
      shouldSolve: true
    };
  }

  // 2. Cosine: "cosine of 60", "cos 60", "cosine 60"
  match = lower.match(/^(?:cos|cosine)\s+(?:of\s+)?(\d+(?:\.\d+)?|\bpi\b|\be\b)/i);
  if (match) {
    const val = match[1].toLowerCase() === 'pi' ? 'π' : match[1];
    return {
      expression: `cos(${val})`,
      description: angleMode === 'DEG' ? `cos(${val}°)` : `cos(${val} rad)`,
      shouldSolve: true
    };
  }

  // 3. Tangent: "tangent of 45", "tan 45", "tangent 45"
  match = lower.match(/^(?:tan|tangent)\s+(?:of\s+)?(\d+(?:\.\d+)?|\bpi\b|\be\b)/i);
  if (match) {
    const val = match[1].toLowerCase() === 'pi' ? 'π' : match[1];
    return {
      expression: `tan(${val})`,
      description: angleMode === 'DEG' ? `tan(${val}°)` : `tan(${val} rad)`,
      shouldSolve: true
    };
  }

  // 4. Inverse Trig: "inverse sine of 0.5", "arcsin 0.5", "asin 0.5"
  match = lower.match(/(?:inverse\s+sine|arcsin|asin)\s+(?:of\s+)?(-?\d+(?:\.\d+)?)/i);
  if (match) {
    return {
      expression: `asin(${match[1]})`,
      description: `arcsin(${match[1]})`,
      shouldSolve: true
    };
  }

  match = lower.match(/(?:inverse\s+cosine|arccos|acos)\s+(?:of\s+)?(-?\d+(?:\.\d+)?)/i);
  if (match) {
    return {
      expression: `acos(${match[1]})`,
      description: `arccos(${match[1]})`,
      shouldSolve: true
    };
  }

  match = lower.match(/(?:inverse\s+tangent|arctan|atan)\s+(?:of\s+)?(-?\d+(?:\.\d+)?)/i);
  if (match) {
    return {
      expression: `atan(${match[1]})`,
      description: `arctan(${match[1]})`,
      shouldSolve: true
    };
  }

  // 5. Square Root: "square root of 144", "sqrt 144", "root 144"
  match = lower.match(/(?:square\s*root|sqrt|root)\s+(?:of\s+)?(\d+(?:\.\d+)?)/i);
  if (match) {
    return {
      expression: `sqrt(${match[1]})`,
      description: `√(${match[1]})`,
      shouldSolve: true
    };
  }

  // 6. Cube Root: "cube root of 27", "cbrt 27"
  match = lower.match(/(?:cube\s*root|cbrt)\s+(?:of\s+)?(\d+(?:\.\d+)?)/i);
  if (match) {
    return {
      expression: `cbrt(${match[1]})`,
      description: `∛(${match[1]})`,
      shouldSolve: true
    };
  }

  // 7. Add: "add 25 and 40", "sum of 25 and 40"
  match = lower.match(/^(?:add|sum\s+of)\s+(\d+(?:\.\d+)?)\s+(?:and|\+|with|to)\s+(\d+(?:\.\d+)?)/i);
  if (match) {
    return {
      expression: `${match[1]} + ${match[2]}`,
      description: `Add ${match[1]} and ${match[2]}`,
      shouldSolve: true
    };
  }

  // 8. Subtract: "subtract 15 from 100", "difference between 100 and 15"
  match = lower.match(/(?:subtract)\s+(\d+(?:\.\d+)?)\s+from\s+(\d+(?:\.\d+)?)/i);
  if (match) {
    return {
      expression: `${match[2]} - ${match[1]}`,
      description: `Subtract ${match[1]} from ${match[2]}`,
      shouldSolve: true
    };
  }

  match = lower.match(/(?:difference\s+between)\s+(\d+(?:\.\d+)?)\s+and\s+(\d+(?:\.\d+)?)/i);
  if (match) {
    return {
      expression: `${match[1]} - ${match[2]}`,
      description: `Difference: ${match[1]} - ${match[2]}`,
      shouldSolve: true
    };
  }

  // 9. Multiply: "multiply 12 by 15", "multiply 12 and 15", "product of 12 and 15"
  match = lower.match(/^(?:multiply|product\s+of)\s+(\d+(?:\.\d+)?)\s+(?:by|and|\*|times)\s+(\d+(?:\.\d+)?)/i);
  if (match) {
    return {
      expression: `${match[1]} * ${match[2]}`,
      description: `Multiply ${match[1]} by ${match[2]}`,
      shouldSolve: true
    };
  }

  // 10. Divide: "divide 100 by 4", "100 over 4", "quotient of 100 and 4"
  match = lower.match(/^(?:divide|quotient\s+of)\s+(\d+(?:\.\d+)?)\s+(?:by|over|\/|and)\s+(\d+(?:\.\d+)?)/i);
  if (match) {
    return {
      expression: `${match[1]} / ${match[2]}`,
      description: `Divide ${match[1]} by ${match[2]}`,
      shouldSolve: true
    };
  }

  // 11. Powers: "10 to the power of 4", "10 to the power 4", "10 raised to 4", "10 power 4", "10 to the 4th"
  match = lower.match(/(\d+(?:\.\d+)?)\s+(?:to the power of|to the power|raised to the power of|raised to|power of|power|to the)\s+(\d+(?:\.\d+)?)(?:st|nd|rd|th)?/i);
  if (match) {
    return {
      expression: `${match[1]}^${match[2]}`,
      description: `${match[1]}^${match[2]}`,
      shouldSolve: true
    };
  }

  // "5 squared" / "5 cubed"
  match = lower.match(/(\d+(?:\.\d+)?)\s+squared/i);
  if (match) {
    return {
      expression: `${match[1]}^2`,
      description: `${match[1]}²`,
      shouldSolve: true
    };
  }

  match = lower.match(/(\d+(?:\.\d+)?)\s+cubed/i);
  if (match) {
    return {
      expression: `${match[1]}^3`,
      description: `${match[1]}³`,
      shouldSolve: true
    };
  }

  // 12. Percentage: "25 percent of 200", "25% of 200"
  match = lower.match(/(\d+(?:\.\d+)?)\s*(?:percent of|% of)\s*(\d+(?:\.\d+)?)/i);
  if (match) {
    return {
      expression: `(${match[1]} / 100) * ${match[2]}`,
      description: `${match[1]}% of ${match[2]}`,
      shouldSolve: true
    };
  }

  // 13. Logarithms: "log of 100", "log 100", "natural log of 5", "ln of 5", "ln 5"
  match = lower.match(/(?:natural log|ln)\s+(?:of\s+)?(\d+(?:\.\d+)?|\be\b)/i);
  if (match) {
    const val = match[1].toLowerCase() === 'e' ? 'e' : match[1];
    return {
      expression: `ln(${val})`,
      description: `ln(${val})`,
      shouldSolve: true
    };
  }

  match = lower.match(/\blog\s+(?:of\s+)?(\d+(?:\.\d+)?)/i);
  if (match) {
    return {
      expression: `log(${match[1]})`,
      description: `log₁₀(${match[1]})`,
      shouldSolve: true
    };
  }

  // 14. Factorials: "5 factorial", "factorial of 5"
  match = lower.match(/(?:factorial\s+of\s+(\d+)|\b(\d+)\s+factorial\b)/i);
  if (match) {
    const n = match[1] || match[2];
    return {
      expression: `${n}!`,
      description: `${n}!`,
      shouldSolve: true
    };
  }

  // 15. Linear Equation Solving: e.g. "solve 2x + 5 = 15" or "2x + 5 = 15"
  match = lower.match(/(?:solve\s+)?([+-]?\d*(?:\.\d+)?)\s*x\s*([+-]\s*\d+(?:\.\d+)?)\s*=\s*([+-]?\d+(?:\.\d+)?)/i);
  if (match) {
    const aStr = match[1].replace(/\s+/g, '');
    const a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
    const b = parseFloat(match[2].replace(/\s+/g, ''));
    const c = parseFloat(match[3]);
    if (!isNaN(a) && a !== 0 && !isNaN(b) && !isNaN(c)) {
      const xSol = (c - b) / a;
      return {
        expression: `(${c} - (${b})) / ${a}`,
        description: `Solve ${a}x + (${b}) = ${c}  ⟹  x = ${xSol}`,
        shouldSolve: true
      };
    }
  }

  // 16. General natural math expressions: e.g. "12 times 15", "25 plus 40", "100 minus 15", "100 divided by 4"
  let parsed = lower
    .replace(/\bplus\b/g, '+')
    .replace(/\bminus\b/g, '-')
    .replace(/\btimes\b|\bmultiplied by\b/g, '*')
    .replace(/\bdivided by\b|\bover\b/g, '/')
    .replace(/\bpercent\b/g, '%')
    .replace(/\bpi\b/g, 'π')
    .replace(/\bequals\b/g, '=')
    .replace(/[^0-9+\-*/^().,%πe!]/g, '')
    .trim();

  if (parsed.length > 0) {
    return {
      expression: parsed,
      description: `Expression: ${parsed}`,
      shouldSolve: true
    };
  }

  return {
    expression: raw,
    description: `Spoken: "${raw}"`,
    shouldSolve: false
  };
}
