import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import QuizQuestion from './QuizQuestion';

// AI难度配置 - 从store复制过来避免循环依赖
const aiDifficulties = {
  beginner: {
    name: '初学者',
    accuracy: 0.45,
    minReactionTime: 3000,
    maxReactionTime: 8000,
    thinkingVariance: 2000,
    description: '刚刚开始学习，需要较多时间思考'
  },
  intermediate: {
    name: '进阶玩家',
    accuracy: 0.65,
    minReactionTime: 2000,
    maxReactionTime: 6000,
    thinkingVariance: 1500,
    description: '有一定基础，答题速度中等'
  },
  advanced: {
    name: '高手',
    accuracy: 0.80,
    minReactionTime: 1500,
    maxReactionTime: 4000,
    thinkingVariance: 1000,
    description: '英语基础扎实，反应迅速'
  },
  expert: {
    name: '学霸',
    accuracy: 0.92,
    minReactionTime: 800,
    maxReactionTime: 2500,
    thinkingVariance: 500,
    description: '英语达人，几乎秒答'
  }
} as const;

const QuizGame: React.FC = () => {
  const { quizState, answerQuestion, returnToMap, updateOpponentProgress } = useGameStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [opponentStatus, setOpponentStatus] = useState<'thinking' | 'answered' | 'wrong'>('thinking');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  // 直接使用游戏状态中的时间，不再独立管理
  const timeLeft = quizState?.timeLeft ?? 0;

  // 监听题目变化，AI立即开始答题
  useEffect(() => {
    if (quizState && quizState.status === 'active' && quizState.opponentType === 'ai') {
      // 题目出现时，AI立即开始思考
      setOpponentStatus('thinking');
      
      // AI开始独立答题，不等待用户
      startAIOpponentAnswer();
    }
  }, [quizState?.currentQuestion]); // 监听题目序号变化

  // AI独立答题逻辑
  const startAIOpponentAnswer = () => {
    if (!quizState || !quizState.opponentDifficulty) return;
    
    // 根据AI难度获取配置
    const difficulty = aiDifficulties[quizState.opponentDifficulty];
    
    // 计算答题延迟：基础时间 + 随机变化
    const baseDelay = Math.random() * (difficulty.maxReactionTime - difficulty.minReactionTime) + difficulty.minReactionTime;
    const variance = (Math.random() - 0.5) * 2 * difficulty.thinkingVariance;
    const answerDelay = Math.max(500, baseDelay + variance);
    
    // 根据准确率决定是否答对
    const isCorrect = Math.random() < difficulty.accuracy;
    
    setTimeout(() => {
      if (isCorrect) {
        setOpponentStatus('answered');
        // 使用专门的action更新AI对手进度
        updateOpponentProgress();
        
        // 连续答题逻辑：高手可能会连续快速答题
        if (difficulty.name === '高手' || difficulty.name === '学霸') {
          setTimeout(() => {
            const currentState = useGameStore.getState();
            if (currentState.quizState && 
                currentState.quizState.opponentProgress < currentState.quizState.questions.length * 0.7 && 
                Math.random() < 0.3) {
              startAIOpponentAnswer(); // 30%概率连续答题
            }
          }, difficulty.minReactionTime / 2);
        }
      } else {
        setOpponentStatus('wrong');
        // 根据难度决定思考状态持续时间
        const recoveryTime = difficulty.name === '初学者' ? 3000 : 2000;
        setTimeout(() => {
          // 只有在答题还在进行时才恢复思考状态
          const currentState = useGameStore.getState();
          if (currentState.quizState && currentState.quizState.status === 'active') {
            setOpponentStatus('thinking');
            // 可以选择立即开始下一轮答题
            setTimeout(() => {
              if (Math.random() < 0.5) { // 50%概率继续答题
                startAIOpponentAnswer();
              }
            }, recoveryTime / 2);
          }
        }, recoveryTime);
      }
    }, answerDelay);
  };

  if (!quizState) {
    return (
      <div className="quiz-container">
        <div className="flex items-center justify-center h-full">
          <div className="text-white">题目加载中...</div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    if (isProcessing || quizState.status !== 'active') return;
    
    setIsProcessing(true);
    setLastAnswerCorrect(null);
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    // 用户答题，AI继续独立答题，不触发新的AI答题
    answerQuestion(answerIndex);
    
    setTimeout(() => {
      setLastAnswerCorrect(isCorrect);
      setIsProcessing(false);
    }, 1500);
  };

  
  const getOpponentInfo = () => {
    if (quizState.opponentType === 'ai') {
      const difficulty = quizState.opponentDifficulty ? aiDifficulties[quizState.opponentDifficulty] : null;
      const difficultyText = difficulty ? ` (${difficulty.name})` : '';
      
      return {
        name: (quizState.opponentName || 'AI对手') + difficultyText, // 显示难度信息
        avatar: '👤', // 真人头像
        progress: quizState.opponentProgress,
        difficulty: difficulty?.name || '未知',
      };
    }
    
    if (quizState.opponentType === 'empty') {
      return {
        name: '无对手',
        avatar: '👻',
        progress: quizState.opponentProgress,
        difficulty: '无',
      };
    }
    
    return {
      name: quizState.opponentName || '真人对手',
      avatar: '👤',
      progress: quizState.opponentProgress,
      difficulty: '真人',
    };
  };

  const opponentInfo = getOpponentInfo();

  if (quizState.status === 'completed') {
    return (
      <div className="quiz-container">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {quizState.winner === 'player' ? '🎉' : '😔'}
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-white">
              {quizState.winner === 'player' ? '恭喜获胜！' : '再试一次！'}
            </h2>
            
            {quizState.winner === 'player' && (
              <div className="text-lg mb-4 text-green-300">
                成功占领领土！
              </div>
            )}
            
            <button 
              className="game-button"
              onClick={returnToMap}
            >
              返回地图
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {/* 标题区域 */}
      <div className="quiz-header">
        <div className="quiz-title">⚔️ 知识对决</div>
        
        {/* 倒计时 */}
        <div className="quiz-timer">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* 主要内容 */}
      <div className="quiz-content">
        {/* 对战双方 */}
        <div className="players-section">
          {/* 玩家 */}
          <div className={`player-card ${lastAnswerCorrect === true ? 'pk-player-answered' : lastAnswerCorrect === false ? 'pk-player-wrong' : ''}`}>
            <div className="player-avatar">👤</div>
            <div className="player-name">玩家</div>
            <div className="player-score">{quizState.playerProgress}</div>
            <div className="player-progress">
              <div 
                className="progress-bar"
                style={{ width: `${(quizState.playerProgress / quizState.questions.length) * 100}%` }}
              />
            </div>
            {lastAnswerCorrect !== null && (
              <div className={`player-status ${lastAnswerCorrect ? 'answered' : 'wrong'}`}>
                {lastAnswerCorrect ? '✅ 正确' : '❌ 错误'}
              </div>
            )}
          </div>

          {/* VS分隔 */}
          <div className="vs-divider">VS</div>

          {/* 对手 */}
          <div className={`player-card ${opponentStatus === 'thinking' ? 'pk-player-thinking' : opponentStatus === 'answered' ? 'pk-player-answered' : 'pk-player-wrong'}`}>
            <div className="player-avatar">{opponentInfo.avatar}</div>
            <div className="player-name">{opponentInfo.name}</div>
            <div className="player-score">{opponentInfo.progress}</div>
            <div className="player-progress">
              <div 
                className="progress-bar"
                style={{ width: `${(opponentInfo.progress / quizState.questions.length) * 100}%` }}
              />
            </div>
            <div className={`player-status ${opponentStatus}`}>
              {opponentStatus === 'thinking' && '💭 思考中...'}
              {opponentStatus === 'answered' && '✅ 答对了'}
              {opponentStatus === 'wrong' && '❌ 答错了'}
            </div>
          </div>
        </div>

        {/* 题目区域 */}
        <div className="question-section">
          <div className="question-card">
            {currentQuestion && (
              <>
                <div className="question-text">
                  {currentQuestion.word}
                </div>
                <div className="question-options">
                  <QuizQuestion
                    key={`question-${quizState.currentQuestion}`}
                    question={currentQuestion}
                    questionNumber={quizState.currentQuestion + 1}
                    totalQuestions={quizState.questions.length}
                    onAnswer={handleAnswer}
                    disabled={isProcessing}
                    timeLeft={timeLeft}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 时间警告 */}
      {timeLeft <= 10 && timeLeft > 0 && (
        <div className="text-center text-white font-bold animate-pulse">
          ⏰ 时间不多了！
        </div>
      )}
    </div>
  );
};

export default QuizGame;