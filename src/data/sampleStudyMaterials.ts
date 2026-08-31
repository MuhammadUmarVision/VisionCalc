import { StudyDocument } from '../types';

export const SAMPLE_STUDY_MATERIALS: StudyDocument[] = [
  {
    id: 'doc-stewart-calc',
    name: 'Stewart_Calculus_Early_Transcendentals_Ch3.pdf',
    size: '4.2 MB',
    pageCount: 68,
    uploadDate: 'Today at 10:30 AM',
    extractedTopics: [
      '3.1 Derivatives and Rates of Change',
      '3.2 The Derivative as a Function',
      '3.3 Differentiation Formulas',
      '3.4 Derivatives of Trigonometric Functions',
      '3.5 The Chain Rule & Implicit Differentiation',
      '3.6 Rates of Change in Natural and Social Sciences',
      '3.7 Related Rates and Optimization Modeling'
    ],
    summary: 'Comprehensive treatment of differential calculus, covering tangent slopes, limits of difference quotients, derivative computational rules, product and quotient mechanics, trigonometric derivatives, and chain rule.'
  },
  {
    id: 'doc-linear-algebra',
    name: 'Strang_Linear_Algebra_Core_Foundations.pdf',
    size: '3.8 MB',
    pageCount: 52,
    uploadDate: 'Yesterday',
    extractedTopics: [
      '1.1 Vectors and Linear Combinations',
      '1.2 Dot Products and Orthogonality',
      '2.1 Solving Linear Equations with Matrices',
      '2.2 Gaussian Elimination and Pivot Selection',
      '3.1 Vector Spaces and Subspaces',
      '3.2 Column Space and Nullspace of A'
    ],
    summary: 'Introduction to vector arithmetic, geometric linear combinations, matrix transformations, row reduction algorithms, and fundamental subspaces.'
  },
  {
    id: 'doc-precalc-graphs',
    name: 'PreCalculus_Functions_and_Coordinate_Geometry.pdf',
    size: '2.4 MB',
    pageCount: 34,
    uploadDate: 'Aug 24, 2026',
    extractedTopics: [
      '2.1 Functions and Graphs',
      '2.2 Linear & Quadratic Models',
      '2.3 Transformations of Functions (Shifts & Stretches)',
      '2.4 Inverse Functions and Logarithms',
      '3.1 Polynomial & Rational Curve Behaviors'
    ],
    summary: 'Foundational review of function families, coordinate geometry, transformations of graphs, asymptotic behaviors, and algebraic modeling.'
  }
];
