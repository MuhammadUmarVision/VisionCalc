export type AngleMode = 'DEG' | 'RAD';

export interface CalculationRecord {
  id: string;
  originalInput?: string;   // e.g. "Find the sine of 90 degrees" or user's spoken/typed query
  expression: string;      // interpreted math expression, e.g. "sin(90)"
  result: string;          // evaluated answer, e.g. "1"
  timestamp: number;
  formattedTime: string;
  angleMode: AngleMode;
  notes?: string;
  isPinned?: boolean;
}

export interface GraphFunction {
  id: string;
  expression: string; // e.g. "x^2", "sin(x)", "2*x + 3"
  rawInput: string;   // e.g. "y = x^2"
  color: string;
  isVisible: boolean;
  type: string;
  description: string;
  characteristics: string[];
  vertex?: string;
  axisOfSymmetry?: string;
  opening?: string;
  roots?: string;
  yIntercept?: string;
  domain?: string;
  range?: string;
  derivative?: string;
  isApproximate?: boolean;
}

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  focusTime: number;      // minutes
  shortBreakTime: number; // minutes
  longBreakTime: number;  // minutes
  autoStartBreaks: boolean;
  soundEnabled: boolean;
}

export interface TutorStep {
  stepNumber: number;
  title: string;
  mathExpression?: string;
  explanation: string;
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  steps?: TutorStep[];
  formulaUsed?: string;
  commonMistakes?: string[];
  imageAttachment?: string;
  pdfReference?: string;
}

export interface CalculusTopic {
  id: string;
  category: 'limits' | 'derivatives' | 'integration';
  title: string;
  subtitle: string;
  formula: string;
  intuition: string;
  keyRules: { name: string; formula: string; example: string }[];
  interactiveSteps: { step: number; prompt: string; result: string; tip: string }[];
  practiceQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface StudyDocument {
  id: string;
  name: string;
  size: string;
  pageCount: number;
  uploadDate: string;
  extractedTopics: string[];
  summary: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  angleMode: AngleMode;
  precision: number;
  hapticFeedback: boolean;
  soundFeedback: boolean;
  fontSize: 'compact' | 'standard' | 'large';
  thousandsSeparator: boolean;
}
