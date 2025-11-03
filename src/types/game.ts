// 游戏核心类型定义

export type Grade = 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5' | 'grade6' | 'grade7' | 'grade8' | 'grade9';

export interface GameState {
  currentGrade: Grade;
  mapSize: number;
  mapGrid: MapCell[][];
  playerState: PlayerState;
  quizState: QuizState | null;
  gameState: 'home' | 'map' | 'quiz' | 'result';
}

export interface MapCell {
  id: string;
  row: number;
  col: number;
  status: 'unexplored' | 'explored' | 'owned' | 'enemy';
  content: CellContent;
  owner?: string;
}

export interface CellContent {
  type: 'empty' | 'treasure' | 'item' | 'coins';
  value?: number;
  treasureId?: string;
}

export interface PlayerState {
  id: string;
  name: string;
  energy: number;
  maxEnergy: number;
  territory: number;
  coins: number;
  grade: Grade;
}

export interface QuizState {
  treasureId: string;
  questions: Question[];
  currentQuestion: number;
  timeLeft: number;
  maxTime: number;
  playerProgress: number;
  opponentProgress: number;
  opponentType: 'human' | 'ai' | 'empty';
  opponentId?: string;
  opponentName?: string; // AI对手的姓名
  opponentDifficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert'; // AI难度级别
  status: 'waiting' | 'active' | 'completed';
  winner?: string;
}

export interface Question {
  id: string;
  word: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  territory: number;
  grade: Grade;
  isPlayer?: boolean;
}

export const GRADE_CONFIG = {
  grade1: { name: '小学一年级', vocabularySize: 200 },
  grade2: { name: '小学二年级', vocabularySize: 400 },
  grade3: { name: '小学三年级', vocabularySize: 600 },
  grade4: { name: '小学四年级', vocabularySize: 800 },
  grade5: { name: '小学五年级', vocabularySize: 1000 },
  grade6: { name: '小学六年级', vocabularySize: 1500 },
  grade7: { name: '初中一年级', vocabularySize: 2000 },
  grade8: { name: '初中二年级', vocabularySize: 2500 },
  grade9: { name: '初中三年级', vocabularySize: 3500 },
} as const;