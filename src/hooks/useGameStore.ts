import { create } from 'zustand';
import type { GameState, PlayerState, MapCell, QuizState, Grade } from '../types/game';

let quizTimer: NodeJS.Timeout | null = null;

// AI人名生成器 - 支持单一语言
const generateRandomName = (): string => {
  const nameType = Math.random(); // 决定使用哪种语言
  
  if (nameType < 0.6) {
    // 60% 概率生成中文姓名 (最多4个汉字)
    const surnames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '郑'];
    const names = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀英', '霞', '平', '刚', '玉兰', '萍', '飞', '建华', '爱华', '小燕', '志强', '海燕', '晨'];
    
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    
    // 随机决定2-3个字，确保不超过4个汉字
    if (Math.random() > 0.5 && surname.length + name.length <= 3) {
      const secondName = names[Math.floor(Math.random() * names.length)];
      // 确保总长度不超过4个汉字
      if (surname.length + name.length + secondName.length <= 4) {
        return surname + name + secondName;
      }
    }
    
    return surname + name;
  } else if (nameType < 0.9) {
    // 30% 概率生成英文姓名
    const firstNames = ['Alex', 'Emma', 'Jack', 'Sophia', 'Oliver', 'Mia', 'William', 'Charlotte', 'James', 'Amelia', 'Benjamin', 'Harper', 'Lucas', 'Evelyn', 'Henry', 'Abigail'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  } else {
    // 10% 概率生成其他语言姓名 (日语、韩语等)
    const japaneseNames = ['佐藤健', '鈴木花子', '高橋雄', '田中美咲', '伊藤誠', '渡辺愛'];
    const koreanNames = ['김민준', '이서연', '박지호', '최지아', '정하준', '강미나'];
    
    if (Math.random() > 0.5) {
      return japaneseNames[Math.floor(Math.random() * japaneseNames.length)];
    } else {
      return koreanNames[Math.floor(Math.random() * koreanNames.length)];
    }
  }
};

// 存储已使用的名字，避免重复
const usedNames = new Set<string>();

const getUniqueRandomName = (): string => {
  let name: string;
  let attempts = 0;
  
  do {
    name = generateRandomName();
    attempts++;
    
    // 如果尝试10次仍有重复，清空记录重新开始
    if (attempts > 10) {
      usedNames.clear();
      name = generateRandomName();
      break;
    }
  } while (usedNames.has(name));
  
  usedNames.add(name);
  return name;
};

// AI难度配置
interface AIDifficulty {
  name: string;
  accuracy: number; // 答题准确率 (0-1)
  minReactionTime: number; // 最快反应时间(毫秒)
  maxReactionTime: number; // 最慢反应时间(毫秒)
  thinkingVariance: number; // 思考时间变化幅度
  description: string; // 难度描述
}

const aiDifficulties: Record<string, AIDifficulty> = {
  beginner: {
    name: '初学者',
    accuracy: 0.45, // 45%准确率
    minReactionTime: 3000, // 3-8秒反应时间
    maxReactionTime: 8000,
    thinkingVariance: 2000,
    description: '刚刚开始学习，需要较多时间思考'
  },
  intermediate: {
    name: '进阶玩家',
    accuracy: 0.65, // 65%准确率
    minReactionTime: 2000, // 2-6秒反应时间
    maxReactionTime: 6000,
    thinkingVariance: 1500,
    description: '有一定基础，答题速度中等'
  },
  advanced: {
    name: '高手',
    accuracy: 0.80, // 80%准确率
    minReactionTime: 1500, // 1.5-4秒反应时间
    maxReactionTime: 4000,
    thinkingVariance: 1000,
    description: '英语基础扎实，反应迅速'
  },
  expert: {
    name: '学霸',
    accuracy: 0.92, // 92%准确率
    minReactionTime: 800, // 0.8-2.5秒反应时间
    maxReactionTime: 2500,
    thinkingVariance: 500,
    description: '英语达人，几乎秒答'
  }
};

// 随机选择AI难度 (根据正态分布，大部分对手是中等难度)
const getRandomAIDifficulty = (): keyof typeof aiDifficulties => {
  const rand = Math.random();
  if (rand < 0.15) return 'beginner';      // 15% 初学者
  if (rand < 0.55) return 'intermediate'; // 40% 进阶玩家  
  if (rand < 0.85) return 'advanced';     // 30% 高手
  return 'expert';                        // 15% 学霸
};

interface GameStore extends GameState {
  // Actions
  setGrade: (grade: Grade) => void;
  initializeMap: (size: number) => void;
  exploreCell: (row: number, col: number) => void;
  startQuiz: (treasureId: string) => void;
  answerQuestion: (answerIndex: number) => void;
  updateOpponentProgress: () => void; // 新增：更新AI对手进度
  useEnergy: (amount: number) => boolean;
  restoreEnergy: (amount: number) => void;
  updateLeaderboard: () => void;
  returnToMap: () => void;
  resetGame: () => void;
  // 新增：个性化设置相关
  setPlayerNickname: (nickname: string) => void;
  setPlayerEmblem: (emblem: import('../types/game').PlayerEmblem) => void;
  startGame: () => void;
  checkSetupComplete: () => boolean;
}

const initialPlayerState: PlayerState = {
  id: 'player-1',
  name: '玩家',
  nickname: '', // 用户需要设置的昵称
  emblem: {
    frame: 'classic',
    icon: 'star',
    color: '#4ECDC4',
    secondaryColor: '#44A3AA',
  },
  energy: 10,
  maxEnergy: 10,
  territory: 0,
  coins: 0,
  grade: 'grade4',
};

const generateMapGrid = (size: number): MapCell[][] => {
  const grid: MapCell[][] = [];
  
  for (let row = 0; row < size; row++) {
    grid[row] = [];
    for (let col = 0; col < size; col++) {
      const random = Math.random();
      let content = { type: 'empty' as const };
      
      if (random < 0.40) {
        // 40% 概率是宝藏
        content = {
          type: 'treasure' as const,
          treasureId: `treasure-${row}-${col}`,
        };
      } else if (random < 0.50) {
        // 10% 概率是道具
        content = {
          type: 'item' as const,
          value: Math.floor(Math.random() * 3) + 1, // 1-3个道具
        };
      } else if (random < 0.60) {
        // 10% 概率是金币
        content = {
          type: 'coins' as const,
          value: Math.floor(Math.random() * 50) + 10, // 10-60金币
        };
      }
      
      grid[row][col] = {
        id: `cell-${row}-${col}`,
        row,
        col,
        status: 'unexplored',
        content,
      };
    }
  }
  
  return grid;
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentGrade: 'grade4',
  mapSize: 50,
  mapGrid: [],
  playerState: initialPlayerState,
  quizState: null,
  gameState: 'setup', // 游戏从设置页面开始

  // Actions
  setGrade: (grade: Grade) => {
    set((state) => ({
      playerState: { ...state.playerState, grade },
    }));
  },

  initializeMap: (size: number) => {
    console.log(`初始化地图: ${size}x${size}`);
    const grid = generateMapGrid(size);
    console.log(`生成了 ${grid.length} 行地图数据`);
    set({
      mapSize: size,
      mapGrid: grid,
      gameState: 'map',
    });
    console.log('地图初始化完成，游戏状态已更新');
  },

  exploreCell: (row: number, col: number) => {
    const state = get();
    const cell = state.mapGrid[row][col];
    
    if (cell.status !== 'unexplored' || state.playerState.energy <= 0) {
      return;
    }

    // 消耗体力
    if (!state.useEnergy(1)) {
      return;
    }

    // 更新格子状态
    const newGrid = [...state.mapGrid];
    newGrid[row][col] = {
      ...cell,
      status: 'explored',
    };

    set({ mapGrid: newGrid });

    // 如果发现宝藏，开始答题
    if (cell.content.type === 'treasure') {
      state.startQuiz(cell.content.treasureId!);
    }
  },

  startQuiz: (treasureId: string) => {
    // 清除之前的计时器
    if (quizTimer) {
      clearInterval(quizTimer);
      quizTimer = null;
    }
    
    // 这里应该根据年级生成对应的题目
    const mockQuestions = [
      {
        id: 'q1',
        word: 'apple',
        options: ['苹果', '香蕉', '橙子', '葡萄'],
        correctAnswer: 0,
        difficulty: 'easy' as const,
      },
      {
        id: 'q2',
        word: 'book',
        options: ['桌子', '椅子', '书本', '电脑'],
        correctAnswer: 2,
        difficulty: 'easy' as const,
      },
      {
        id: 'q3',
        word: 'dog',
        options: ['狗', '猫', '兔子', '鸟'],
        correctAnswer: 0,
        difficulty: 'easy' as const,
      },
      {
        id: 'q4',
        word: 'happy',
        options: ['悲伤的', '快乐的', '生气的', '害怕的'],
        correctAnswer: 1,
        difficulty: 'easy' as const,
      },
      {
        id: 'q5',
        word: 'school',
        options: ['公园', '医院', '学校', '商店'],
        correctAnswer: 2,
        difficulty: 'easy' as const,
      },
      {
        id: 'q6',
        word: 'family',
        options: ['家庭', '朋友', '同事', '邻居'],
        correctAnswer: 0,
        difficulty: 'easy' as const,
      },
      {
        id: 'q7',
        word: 'water',
        options: ['水', '火', '土', '空气'],
        correctAnswer: 0,
        difficulty: 'easy' as const,
      },
      {
        id: 'q8',
        word: 'friend',
        options: ['敌人', '朋友', '陌生人', '老师'],
        correctAnswer: 1,
        difficulty: 'easy' as const,
      },
      {
        id: 'q9',
        word: 'teacher',
        options: ['学生', '家长', '老师', '医生'],
        correctAnswer: 2,
        difficulty: 'easy' as const,
      },
      {
        id: 'q10',
        word: 'student',
        options: ['老师', '家长', '学生', '校长'],
        correctAnswer: 2,
        difficulty: 'easy' as const,
      },
    ];

    const aiOpponentName = getUniqueRandomName();
    const aiDifficulty = getRandomAIDifficulty();
    
    const quizState: QuizState = {
      treasureId,
      questions: mockQuestions,
      currentQuestion: 0,
      timeLeft: 100, // 总共100秒完成10道题
      maxTime: 100,
      playerProgress: 0,
      opponentProgress: 0,
      opponentType: 'ai', // AI对手
      opponentName: aiOpponentName, // AI对手姓名
      opponentDifficulty: aiDifficulty, // AI难度级别
      status: 'active',
    };

    set({ quizState, gameState: 'quiz' });

    // 启动全局倒计时
    quizTimer = setInterval(() => {
      const currentState = get();
      if (!currentState.quizState || currentState.quizState.status !== 'active') {
        if (quizTimer) {
          clearInterval(quizTimer);
          quizTimer = null;
        }
        return;
      }

      const newTimeLeft = currentState.quizState.timeLeft - 1;
      
      if (newTimeLeft <= 0) {
        // 时间到，失败
        if (quizTimer) {
          clearInterval(quizTimer);
          quizTimer = null;
        }
        
        set({
          quizState: {
            ...currentState.quizState,
            timeLeft: 0,
            status: 'completed',
            winner: 'opponent', // 时间到算失败
          },
        });
      } else {
        // 更新剩余时间
        set({
          quizState: {
            ...currentState.quizState,
            timeLeft: newTimeLeft,
          },
        });
      }
    }, 1000);
  },

  answerQuestion: (answerIndex: number) => {
    const state = get();
    if (!state.quizState || state.quizState.status !== 'active') {
      return;
    }

    const { quizState } = state;
    const currentQuestion = quizState.questions[quizState.currentQuestion];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    if (isCorrect) {
      // 答对了，进入下一题
      const newProgress = quizState.playerProgress + 1;
      
      if (newProgress >= quizState.questions.length) {
        // 全部答对，获胜
        const updatedQuizState = {
          ...quizState,
          playerProgress: newProgress,
          status: 'completed' as const,
          winner: 'player',
        };
        
        // 占领格子
        const newGrid = [...state.mapGrid];
        for (let row = 0; row < state.mapSize; row++) {
          for (let col = 0; col < state.mapSize; col++) {
            if (newGrid[row][col].content.treasureId === quizState.treasureId) {
              newGrid[row][col] = {
                ...newGrid[row][col],
                status: 'owned',
                owner: state.playerState.id,
              };
            }
          }
        }

        set({
          quizState: updatedQuizState,
          mapGrid: newGrid,
          playerState: {
            ...state.playerState,
            territory: state.playerState.territory + 1,
            coins: state.playerState.coins + 20,
          },
        });
      } else {
        // 继续下一题
        set({
          quizState: {
            ...quizState,
            currentQuestion: quizState.currentQuestion + 1,
            playerProgress: newProgress,
          },
        });
      }
    } else {
      // 答错了，保持当前题目
      // 可以添加惩罚机制
    }
  },

  updateOpponentProgress: () => {
    const state = get();
    if (!state.quizState || state.quizState.status !== 'active') {
      return;
    }

    const { quizState } = state;
    const newOpponentProgress = quizState.opponentProgress + 1;
    
    // 检查AI是否完成了所有题目
    if (newOpponentProgress >= quizState.questions.length) {
      // AI获胜
      set({
        quizState: {
          ...quizState,
          opponentProgress: newOpponentProgress,
          status: 'completed',
          winner: 'opponent',
        },
      });
    } else {
      // 更新AI进度
      set({
        quizState: {
          ...quizState,
          opponentProgress: newOpponentProgress,
        },
      });
    }
  },

  useEnergy: (amount: number) => {
    const state = get();
    if (state.playerState.energy >= amount) {
      set({
        playerState: {
          ...state.playerState,
          energy: state.playerState.energy - amount,
        },
      });
      return true;
    }
    return false;
  },

  restoreEnergy: (amount: number) => {
    set((state) => ({
      playerState: {
        ...state.playerState,
        energy: Math.min(state.playerState.energy + amount, state.playerState.maxEnergy),
      },
    }));
  },

  updateLeaderboard: () => {
    // 更新排行榜逻辑
  },

  returnToMap: () => {
    // 清理答题计时器
    if (quizTimer) {
      clearInterval(quizTimer);
      quizTimer = null;
    }
    
    set((state) => ({
      ...state,
      quizState: null,
      gameState: 'map',
    }));
  },

  // 新增：个性化设置相关actions
  setPlayerNickname: (nickname: string) => {
    set((state) => ({
      ...state,
      playerState: {
        ...state.playerState,
        nickname: nickname.trim(),
        name: nickname.trim() || '玩家', // 如果没有昵称，使用默认名称
      },
    }));
  },

  setPlayerEmblem: (emblem) => {
    set((state) => ({
      ...state,
      playerState: {
        ...state.playerState,
        emblem: emblem,
      },
    }));
  },

  startGame: () => {
    // 检查设置是否完成
    const currentState = get();
    if (!currentState.playerState.nickname || currentState.playerState.nickname.trim().length < 2) {
      console.warn('昵称未设置或过短');
      return;
    }

    // 初始化地图并跳转到首页
    currentState.initializeMap(50);
    set((state) => ({
      ...state,
      gameState: 'home',
    }));
  },

  checkSetupComplete: () => {
    const state = get();
    return state.playerState.nickname.trim().length >= 2;
  },

  resetGame: () => {
    set({
      mapGrid: [],
      playerState: initialPlayerState,
      quizState: null,
      gameState: 'setup', // 重置到设置页面
    });
  },
}));