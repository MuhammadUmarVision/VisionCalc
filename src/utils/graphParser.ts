import { GraphFunction } from '../types';

// Palette of distinct, high-contrast mathematical curve colors
export const GRAPH_COLORS = [
  '#2563EB', // Blue
  '#7C3AED', // Purple
  '#06B6D4', // Cyan
  '#10B981', // Emerald Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
];

// Clean and prepare mathematical formula for JS evaluator
export function cleanFunctionFormula(raw: string): string {
  let expr = raw.trim();
  // Strip "y =" or "f(x) =" or "g(x) ="
  expr = expr.replace(/^y\s*=\s*/i, '');
  expr = expr.replace(/^f\(x\)\s*=\s*/i, '');
  expr = expr.replace(/^g\(x\)\s*=\s*/i, '');

  // Handle square root symbols
  expr = expr.replace(/√([a-zA-Z0-9_]+)/g, 'sqrt($1)');
  expr = expr.replace(/√\(/g, 'sqrt(');

  // Handle functions without parentheses: e.g. sin x -> sin(x), cos x -> cos(x), ln x -> ln(x)
  expr = expr.replace(/\b(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|ln|log|sqrt|cbrt|exp|abs)\s+([a-zA-Z0-9_]+)/gi, '$1($2)');

  // Handle absolute value pipes |x| -> abs(x)
  expr = expr.replace(/\|([^|]+)\|/g, 'abs($1)');

  // Convert unicode & math symbols
  expr = expr.replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'Math.PI')
    .replace(/\be\b(?![a-zA-Z0-9_])/g, 'Math.E');

  // Insert implicit multiplication: e.g. 2x -> 2*x, 3sin(x) -> 3*sin(x), x(x+1) -> x*(x+1)
  expr = expr.replace(/(\d+)([a-zA-Z(])/g, '$1*$2');
  expr = expr.replace(/(\))([a-zA-Z0-9(])/g, '$1*$2');
  expr = expr.replace(/(x)(\()/g, '$1*$2');
  expr = expr.replace(/(\))(x)/g, '$1*$2');

  return expr;
}

// Validate function syntax and safety
export function validateFunctionExpression(raw: string): { isValid: boolean; errorMessage?: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { isValid: false, errorMessage: 'Please enter a function expression.' };
  }

  // Circle equation
  if (trimmed.includes('x^2 + y^2') || trimmed.includes('x² + y²') || trimmed.includes('x^2+y^2')) {
    const match = trimmed.match(/=\s*(\d+(?:\.\d+)?)/);
    if (match && parseFloat(match[1]) > 0) {
      return { isValid: true };
    }
  }

  const cleaned = cleanFunctionFormula(raw);

  let jsExpr = cleaned;
  // Protect unary minus on powers: -x^2 -> -(Math.pow(x,2))
  jsExpr = jsExpr.replace(/-([a-zA-Z0-9_.]+|\([^()]+\))\^([a-zA-Z0-9_.]+|\([^()]+\))/g, '-(Math.pow($1,$2))');

  // Replace ^ with Math.pow
  let prev = '';
  let iterations = 0;
  while (jsExpr.includes('^') && jsExpr !== prev && iterations < 15) {
    prev = jsExpr;
    iterations++;
    const powRegex = /([a-zA-Z0-9_.]+|\([^()]+\))\^([a-zA-Z0-9_.]+|\([^()]+\))/;
    if (!powRegex.test(jsExpr)) break;
    jsExpr = jsExpr.replace(powRegex, 'Math.pow($1,$2)');
  }

  // Handle standard math functions
  jsExpr = jsExpr.replace(/\bsin\(/g, 'Math.sin(');
  jsExpr = jsExpr.replace(/\bcos\(/g, 'Math.cos(');
  jsExpr = jsExpr.replace(/\btan\(/g, 'Math.tan(');
  jsExpr = jsExpr.replace(/\basin\(/g, 'Math.asin(');
  jsExpr = jsExpr.replace(/\bacos\(/g, 'Math.acos(');
  jsExpr = jsExpr.replace(/\batan\(/g, 'Math.atan(');
  jsExpr = jsExpr.replace(/\bsqrt\(/g, 'Math.sqrt(');
  jsExpr = jsExpr.replace(/\bcbrt\(/g, 'Math.cbrt(');
  jsExpr = jsExpr.replace(/\bln\(/g, 'Math.log(');
  jsExpr = jsExpr.replace(/\blog10\(/g, 'Math.log10(');
  jsExpr = jsExpr.replace(/\blog\(/g, 'Math.log10(');
  jsExpr = jsExpr.replace(/\bexp\(/g, 'Math.exp(');
  jsExpr = jsExpr.replace(/\babs\(/g, 'Math.abs(');

  try {
    const fn = new Function('x', 'Math', `return (${jsExpr});`);
    // Test basic values
    const testPoints = [0, 1, 2, 4, 9, 0.5, -1, -2];
    let hasFinite = false;
    for (const tx of testPoints) {
      try {
        const val = fn(tx, Math);
        if (typeof val === 'number' && Number.isFinite(val)) {
          hasFinite = true;
          break;
        }
      } catch {
        // continue test
      }
    }

    if (!hasFinite) {
      // Check if it produces NaN for all (e.g. invalid operation)
      // If no syntax error, we accept it if it executes
    }

    return { isValid: true };
  } catch {
    return { isValid: false, errorMessage: 'Invalid function. Please check your expression.' };
  }
}

// Evaluate function f(x) safely
export function createFunctionEvaluator(expression: string): (x: number) => number {
  const cleaned = cleanFunctionFormula(expression);
  
  let jsExpr = cleaned;

  // Protect unary minus on powers: -x^2 -> -(Math.pow(x,2))
  jsExpr = jsExpr.replace(/-([a-zA-Z0-9_.]+|\([^()]+\))\^([a-zA-Z0-9_.]+|\([^()]+\))/g, '-(Math.pow($1,$2))');

  // Replace ^ with Math.pow
  let prev = '';
  while (jsExpr.includes('^') && jsExpr !== prev) {
    prev = jsExpr;
    const powRegex = /([a-zA-Z0-9_.]+|\([^()]+\))\^([a-zA-Z0-9_.]+|\([^()]+\))/;
    if (!powRegex.test(jsExpr)) break;
    jsExpr = jsExpr.replace(powRegex, 'Math.pow($1,$2)');
  }

  // Handle standard math functions
  jsExpr = jsExpr.replace(/\bsin\(/g, 'Math.sin(');
  jsExpr = jsExpr.replace(/\bcos\(/g, 'Math.cos(');
  jsExpr = jsExpr.replace(/\btan\(/g, 'Math.tan(');
  jsExpr = jsExpr.replace(/\basin\(/g, 'Math.asin(');
  jsExpr = jsExpr.replace(/\bacos\(/g, 'Math.acos(');
  jsExpr = jsExpr.replace(/\batan\(/g, 'Math.atan(');
  jsExpr = jsExpr.replace(/\bsqrt\(/g, 'Math.sqrt(');
  jsExpr = jsExpr.replace(/√\(/g, 'Math.sqrt(');
  jsExpr = jsExpr.replace(/\bcbrt\(/g, 'Math.cbrt(');
  jsExpr = jsExpr.replace(/\bln\(/g, 'Math.log(');
  jsExpr = jsExpr.replace(/\blog10\(/g, 'Math.log10(');
  jsExpr = jsExpr.replace(/\blog\(/g, 'Math.log10(');
  jsExpr = jsExpr.replace(/\bexp\(/g, 'Math.exp(');
  jsExpr = jsExpr.replace(/\babs\(/g, 'Math.abs(');

  try {
    const fn = new Function('x', 'Math', `try { 
      const res = (${jsExpr});
      return typeof res === 'number' && isFinite(res) && !isNaN(res) ? res : NaN;
    } catch(e) { return NaN; }`);
    
    return (x: number) => {
      const val = fn(x, Math);
      return typeof val === 'number' && Number.isFinite(val) ? val : NaN;
    };
  } catch {
    return () => NaN;
  }
}

// Generate rich mathematical analysis and explanation for any given function
export function analyzeGraphFunction(rawInput: string): Omit<GraphFunction, 'id' | 'color' | 'isVisible'> {
  const normalized = rawInput.trim();
  const cleaned = cleanFunctionFormula(rawInput).toLowerCase().replace(/\s+/g, '');

  // 1. Circle Check: x^2 + y^2 = r^2
  if (normalized.includes('x^2 + y^2') || normalized.includes('x² + y²') || normalized.includes('x^2+y^2')) {
    const match = normalized.match(/=\s*(\d+(?:\.\d+)?)/);
    const r2 = match ? parseFloat(match[1]) : 25;
    const r = Math.sqrt(r2);
    const rFormatted = Number.isInteger(r) ? r.toString() : r.toFixed(2);
    return {
      rawInput,
      expression: `±√(${r2} - x²)`,
      type: 'Circle (Conic Section)',
      description: `Circle centered at origin (0, 0) with radius r = ${rFormatted}`,
      characteristics: [
        `Standard form: x² + y² = ${r2}`,
        `Radius: r = ${rFormatted} units`,
        'Center: (0, 0)',
        'Symmetric about x-axis, y-axis, and origin',
        'Implicit relation (produces 2 values of y for each x inside domain)'
      ],
      vertex: `Extrema at (±${rFormatted}, 0) and (0, ±${rFormatted})`,
      axisOfSymmetry: 'x = 0 and y = 0',
      opening: 'Closed conic curve',
      roots: `x = -${rFormatted}, x = +${rFormatted}`,
      yIntercept: `y = -${rFormatted}, y = +${rFormatted}`,
      domain: `[-${rFormatted}, ${rFormatted}]`,
      range: `[-${rFormatted}, ${rFormatted}]`,
      derivative: 'dy/dx = -x/y (implicit differentiation)'
    };
  }

  // 2. Quadratic Functions: e.g. y = ax^2 + bx + c, y = x^2, y = 3x^2 + 2x - 5, y = -x^2 + 4
  if (cleaned.includes('x^2') || cleaned.includes('x²')) {
    // Attempt standard polynomial extraction: ax^2 + bx + c
    // Pattern: ([+-]?\d*(?:\.\d+)?)x\^2(?:\s*([+-]\s*\d*(?:\.\d+)?)x)?(?:\s*([+-]\s*\d+(?:\.\d+)?))?
    let a = 1;
    let b = 0;
    let c = 0;

    // Check leading coefficient of x^2
    const aMatch = cleaned.match(/([+-]?\d*(?:\.\d+)?)\*?x\^?2/);
    if (aMatch) {
      const aStr = aMatch[1];
      if (aStr === '' || aStr === '+') a = 1;
      else if (aStr === '-') a = -1;
      else a = parseFloat(aStr);
    }

    // Check linear coefficient bx
    const bMatch = cleaned.match(/(?:x\^?2.*?)?([+-]\s*\d*(?:\.\d+)?)\*?x(?!\^)/);
    if (bMatch) {
      const bStr = bMatch[1].replace(/\s+/g, '');
      if (bStr === '' || bStr === '+') b = 1;
      else if (bStr === '-') b = -1;
      else b = parseFloat(bStr);
    }

    // Check constant term c
    const cMatch = cleaned.match(/(?:x\^?2.*?|x.*?)([+-]\s*\d+(?:\.\d+)?)$/);
    if (cMatch) {
      c = parseFloat(cMatch[1].replace(/\s+/g, ''));
    }

    if (isNaN(a) || a === 0) a = 1;
    if (isNaN(b)) b = 0;
    if (isNaN(c)) c = 0;

    const h = -b / (2 * a);
    const k = a * h * h + b * h + c;
    const discriminant = b * b - 4 * a * c;

    let rootsStr = 'No real roots (discriminant D < 0)';
    if (discriminant > 0) {
      const r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const r2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      const r1Formatted = Number.isInteger(r1) ? r1.toString() : r1.toFixed(2);
      const r2Formatted = Number.isInteger(r2) ? r2.toString() : r2.toFixed(2);
      rootsStr = `x = ${r1Formatted}, x = ${r2Formatted}`;
    } else if (discriminant === 0) {
      const r0 = -b / (2 * a);
      const r0Formatted = Number.isInteger(r0) ? r0.toString() : r0.toFixed(2);
      rootsStr = `x = ${r0Formatted} (single root)`;
    }

    const hFmt = Number.isInteger(h) ? h.toString() : h.toFixed(2);
    const kFmt = Number.isInteger(k) ? k.toString() : k.toFixed(2);
    const cFmt = Number.isInteger(c) ? c.toString() : c.toFixed(2);

    const isUpward = a > 0;
    const rangeStr = isUpward ? `[${kFmt}, +∞)` : `(-∞, ${kFmt}]`;
    const vertexType = isUpward ? 'Global Minimum' : 'Global Maximum';

    const derivTerms: string[] = [];
    const twoA = 2 * a;
    if (twoA === 1) derivTerms.push('x');
    else if (twoA === -1) derivTerms.push('-x');
    else derivTerms.push(`${twoA}x`);

    if (b > 0) derivTerms.push(`+ ${b}`);
    else if (b < 0) derivTerms.push(`- ${Math.abs(b)}`);

    return {
      rawInput,
      expression: cleanFunctionFormula(rawInput),
      type: 'Quadratic Function / Parabola',
      description: `Second-degree parabolic polynomial curve ${isUpward ? 'opening upward' : 'opening downward'}.`,
      characteristics: [
        `Parabola opening: ${isUpward ? 'Upward (a > 0, convex)' : 'Downward (a < 0, concave)'}`,
        `Vertex coordinate (${vertexType}): (${hFmt}, ${kFmt})`,
        `Axis of symmetry: x = ${hFmt}`,
        `Discriminant Δ = b² - 4ac = ${discriminant.toFixed(2)}`,
        'Continuous and differentiable across all ℝ'
      ],
      vertex: `(${hFmt}, ${kFmt})`,
      axisOfSymmetry: `x = ${hFmt}`,
      opening: isUpward ? 'Upward' : 'Downward',
      roots: rootsStr,
      yIntercept: `y = ${cFmt} at (0, ${cFmt})`,
      domain: '(-∞, ∞)',
      range: isUpward ? `[${kFmt}, ∞)` : `(-∞, ${kFmt}]`,
      derivative: `f'(x) = ${derivTerms.join(' ')}`
    };
  }

  // 3. Square Root (Radical) Function: y = sqrt(x)
  if (cleaned.includes('sqrt') || cleaned.includes('√')) {
    // Check horizontal shift: sqrt(x - h) + k
    let h = 0;
    let k = 0;
    const shiftMatch = cleaned.match(/sqrt\(x([+-]\d+(?:\.\d+)?)\)/);
    if (shiftMatch) {
      h = -parseFloat(shiftMatch[1]);
    }
    const hFmt = Number.isInteger(h) ? h.toString() : h.toFixed(2);
    const kFmt = Number.isInteger(k) ? k.toString() : k.toFixed(2);

    return {
      rawInput,
      expression: cleanFunctionFormula(rawInput),
      type: 'Square Root Function',
      description: 'Principal non-negative square root branch defined strictly on real numbers.',
      characteristics: [
        `Endpoint / Starting point: (${hFmt}, ${kFmt})`,
        'Strictly defined for non-negative radicand (radicand ≥ 0)',
        'Domain strictly excludes negative arguments on the real coordinate plane',
        'Strictly increasing with decreasing growth rate',
        'Inverse of the non-negative branch of a parabola'
      ],
      vertex: h === 0 && k === 0 ? '(0, 0)' : `(${hFmt}, ${kFmt})`,
      axisOfSymmetry: 'Not available for this function',
      opening: 'Extends to the right (+x direction)',
      roots: `x = ${hFmt}`,
      yIntercept: h <= 0 ? `y = ${Math.sqrt(-h).toFixed(2)}` : 'None (out of domain)',
      domain: `[${hFmt}, ∞)`,
      range: `[${kFmt}, ∞)`,
      derivative: "f'(x) = 1 / (2√(x))"
    };
  }

  // 4. Linear Functions: y = mx + b, y = 2x + 5, y = -3x
  if (!cleaned.includes('^') && !cleaned.includes('sin') && !cleaned.includes('cos') && !cleaned.includes('tan') && !cleaned.includes('log') && !cleaned.includes('ln') && !cleaned.includes('exp') && cleaned.includes('x') && !cleaned.includes('/x')) {
    let m = 1;
    let b = 0;

    const mMatch = cleaned.match(/([+-]?\d*(?:\.\d+)?)\*?x/);
    if (mMatch) {
      const mStr = mMatch[1];
      if (mStr === '' || mStr === '+') m = 1;
      else if (mStr === '-') m = -1;
      else m = parseFloat(mStr);
    }

    const bMatch = cleaned.match(/x([+-]\s*\d+(?:\.\d+)?)$/);
    if (bMatch) {
      b = parseFloat(bMatch[1].replace(/\s+/g, ''));
    }

    if (isNaN(m)) m = 1;
    if (isNaN(b)) b = 0;

    const rootX = m !== 0 ? -b / m : null;
    const rootStr = rootX !== null ? `x = ${Number.isInteger(rootX) ? rootX : rootX.toFixed(2)}` : b === 0 ? 'All real numbers' : 'No roots';
    const mFmt = Number.isInteger(m) ? m.toString() : m.toFixed(2);
    const bFmt = Number.isInteger(b) ? b.toString() : b.toFixed(2);

    return {
      rawInput,
      expression: cleanFunctionFormula(rawInput),
      type: 'Linear Function (Straight Line)',
      description: `First-degree linear equation with constant slope m = ${mFmt} and y-intercept (0, ${bFmt}).`,
      characteristics: [
        `Slope (gradient): m = ${mFmt} (${m > 0 ? 'increasing' : m < 0 ? 'decreasing' : 'horizontal'})`,
        `Y-intercept: (0, ${bFmt})`,
        `X-intercept (root): (${rootStr}, 0)`,
        'Constant rate of change across the entire real number line',
        'No curvature, local extrema, or inflection points'
      ],
      vertex: 'None (monotonic straight line)',
      axisOfSymmetry: 'None',
      opening: m > 0 ? 'Slopes upward from bottom-left to top-right' : 'Slopes downward from top-left to bottom-right',
      roots: rootStr,
      yIntercept: `y = ${bFmt} at (0, ${bFmt})`,
      domain: '(-∞, +∞)',
      range: m !== 0 ? '(-∞, +∞)' : `y = ${bFmt}`,
      derivative: `f'(x) = ${mFmt} (constant slope)`
    };
  }

  // 5. Rational Function: y = 1/x, y = a/x
  if (cleaned.includes('/x') || cleaned.includes('1/x')) {
    return {
      rawInput,
      expression: cleanFunctionFormula(rawInput),
      type: 'Rational Function (Hyperbola)',
      description: 'Reciprocal hyperbola function exhibiting horizontal and vertical asymptotic behavior.',
      characteristics: [
        'Vertical asymptote: x = 0 (undefined at origin)',
        'Horizontal asymptote: y = 0 (approaches 0 as x → ±∞)',
        'Odd function: f(-x) = -f(x)',
        'Discontinuous singular point at x = 0'
      ],
      vertex: 'Extrema at (1, 1) and (-1, -1) [hyperbolic branches]',
      axisOfSymmetry: 'y = x and y = -x',
      opening: 'First and third quadrants',
      roots: 'No real roots (curve never touches y = 0)',
      yIntercept: 'Undefined (vertical asymptote at x = 0)',
      domain: '(-∞, 0) ∪ (0, +∞)',
      range: '(-∞, 0) ∪ (0, +∞)',
      derivative: "f'(x) = -1/x²"
    };
  }

  // 6. Absolute Value: y = |x|, y = abs(x)
  if (cleaned.includes('abs(') || cleaned.includes('|x|')) {
    return {
      rawInput,
      expression: cleanFunctionFormula(rawInput),
      type: 'Absolute Value Function',
      description: 'V-shaped piecewise continuous function mapping inputs to non-negative distances.',
      characteristics: [
        'Vertex corner point at (0, 0)',
        'Even function: symmetric about the y-axis (x = 0)',
        'Piecewise linear: slope = +1 for x > 0, slope = -1 for x < 0',
        'Continuous everywhere, non-differentiable sharp corner at x = 0'
      ],
      vertex: '(0, 0) [Global Minimum]',
      axisOfSymmetry: 'x = 0',
      opening: 'Upward (V-shape)',
      roots: 'x = 0',
      yIntercept: 'y = 0 at (0, 0)',
      domain: '(-∞, +∞)',
      range: '[0, +∞)',
      derivative: "f'(x) = sgn(x) (undefined at x = 0)"
    };
  }

  // 7. Sine / Cosine / Tangent
  if (cleaned.includes('sin') || cleaned.includes('cos') || cleaned.includes('tan')) {
    const isSin = cleaned.includes('sin');
    const isCos = cleaned.includes('cos');
    return {
      rawInput,
      expression: cleanFunctionFormula(rawInput),
      type: isSin ? 'Sine Wave (Trigonometric)' : isCos ? 'Cosine Wave (Trigonometric)' : 'Tangent Function',
      description: 'Fundamental trigonometric periodic function oscillating with harmonic cycle.',
      characteristics: [
        isSin || isCos ? 'Fundamental period: T = 2π (~6.283 rad)' : 'Period: T = π (~3.1415 rad)',
        isSin ? 'Odd symmetry: sin(-x) = -sin(x)' : isCos ? 'Even symmetry: cos(-x) = cos(x)' : 'Vertical asymptotes at x = π/2 + kπ',
        isSin || isCos ? 'Bounded amplitude between -1 and +1' : 'Unbounded range spanning all real numbers',
        'Foundation of wave mechanics, acoustics, and signal processing'
      ],
      vertex: isSin ? 'Peak (π/2, 1), Trough (3π/2, -1)' : isCos ? 'Peak (0, 1), Trough (π, -1)' : 'Inflection points at (kπ, 0)',
      axisOfSymmetry: isCos ? 'x = 0' : 'None (periodic translation)',
      opening: 'Periodic oscillation',
      roots: isSin ? 'x = kπ for integer k (0, ±π, ±2π...)' : isCos ? 'x = π/2 + kπ (±π/2, ±3π/2...)' : 'x = kπ',
      yIntercept: isSin ? 'y = 0' : isCos ? 'y = 1' : 'y = 0',
      domain: isSin || isCos ? '(-∞, +∞)' : 'x ≠ π/2 + kπ',
      range: isSin || isCos ? '[-1, 1]' : '(-∞, +∞)',
      derivative: isSin ? "f'(x) = cos(x)" : isCos ? "f'(x) = -sin(x)" : "f'(x) = sec²(x)"
    };
  }

  // 8. Exponential: e^x, 2^x, exp(x)
  if (cleaned.includes('e^x') || cleaned.includes('exp(') || cleaned.includes('2^x') || cleaned.includes('10^x')) {
    return {
      rawInput,
      expression: cleanFunctionFormula(rawInput),
      type: 'Exponential Function',
      description: 'Nonlinear exponential curve characterized by a rate of growth proportional to its value.',
      characteristics: [
        'Strictly increasing with exponential growth for positive x',
        'Horizontal asymptote: y = 0 as x → -∞',
        'Special property: d/dx(e^x) = e^x',
        'Strictly positive outputs (y > 0) across entire real domain'
      ],
      vertex: 'None (strictly monotonic)',
      axisOfSymmetry: 'None',
      opening: 'Exponential upward divergence',
      roots: 'No real roots (approaches y = 0 asymptotically)',
      yIntercept: 'y = 1 at (0, 1)',
      domain: '(-∞, +∞)',
      range: '(0, +∞)',
      derivative: "f'(x) = e^x"
    };
  }

  // 9. Logarithmic: ln(x), log(x)
  if (cleaned.includes('ln') || cleaned.includes('log')) {
    return {
      rawInput,
      expression: cleanFunctionFormula(rawInput),
      type: 'Logarithmic Function',
      description: 'Inverse of the exponential function exhibiting steadily decelerating growth.',
      characteristics: [
        'Vertical asymptote: x = 0 (y → -∞ as x → 0⁺)',
        'Defined strictly for strictly positive real inputs (x > 0)',
        'Concave downward across the entire domain',
        'Passes through key point (1, 0) since ln(1) = 0'
      ],
      vertex: 'None (strictly monotonic)',
      axisOfSymmetry: 'None',
      opening: 'Logarithmic concave curve',
      roots: 'x = 1',
      yIntercept: 'Undefined (asymptote at x = 0)',
      domain: '(0, +∞)',
      range: '(-∞, +∞)',
      derivative: "f'(x) = 1/x"
    };
  }

  // 10. Cubic Polynomial: x^3, x^3 - 2x
  if (cleaned.includes('x^3') || cleaned.includes('x³')) {
    const hasLinear = cleaned.includes('-2x') || cleaned.includes('-x') || cleaned.includes('+');
    return {
      rawInput,
      expression: cleanFunctionFormula(rawInput),
      type: 'Cubic Polynomial (3rd Degree)',
      description: 'Odd-degree polynomial exhibiting rotational point symmetry and continuous range.',
      characteristics: [
        'Point of inflection where second derivative f"(x) = 0',
        'Continuous and smooth everywhere across ℝ',
        'Unbounded behavior: as x → +∞, y → +∞; as x → -∞, y → -∞',
        hasLinear ? 'Contains local maximum and local minimum extrema' : 'Strictly monotonic across domain'
      ],
      vertex: hasLinear ? 'Extrema at x = ±√(2/3)' : 'Inflection at (0, 0)',
      axisOfSymmetry: 'Rotational 180° symmetry around inflection point',
      opening: 'Extends from quadrant 3 to quadrant 1',
      roots: hasLinear ? 'x = 0, x = ±√2 (~±1.414)' : 'x = 0',
      yIntercept: 'y = 0 at (0, 0)',
      domain: '(-∞, +∞)',
      range: '(-∞, +∞)',
      derivative: hasLinear ? "f'(x) = 3x² - 2" : "f'(x) = 3x²"
    };
  }

  // 11. General Algebraic Function (Numerical & Approximate Analysis)
  const evaluator = createFunctionEvaluator(rawInput);
  const y0 = evaluator(0);
  const y0Str = !isNaN(y0) ? `y = ${y0.toFixed(2)} at (0, ${y0.toFixed(2)})` : 'Undefined at x = 0';

  return {
    rawInput,
    expression: cleanFunctionFormula(rawInput),
    type: 'Algebraic Function',
    description: `Mathematical curve defined by ${rawInput}`,
    characteristics: [
      'Continuous numerical sampling across coordinate grid',
      'Evaluated through standard algebraic operator precedence',
      'Plotted on Cartesian (X, Y) coordinate plane'
    ],
    vertex: 'Numerical evaluation across viewport',
    axisOfSymmetry: 'Numerical analysis',
    opening: 'Varies',
    roots: 'Numerical zero-crossings in viewport',
    yIntercept: y0Str,
    domain: 'Real numbers ℝ (excluding non-finite singularities)',
    range: 'Continuous image on ℝ',
    derivative: 'Numerical tangent dy/dx',
    isApproximate: true
  };
}

