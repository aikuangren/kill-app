import { useEffect } from 'react';
import { useGameStore } from './useGameStore';

// 体力恢复的Hook
export const useEnergyRecovery = () => {
  const { restoreEnergy, playerState } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      // 每30秒恢复1点体力
      if (playerState.energy < playerState.maxEnergy) {
        restoreEnergy(1);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [restoreEnergy, playerState.energy, playerState.maxEnergy]);
};

// AI对手答题的Hook
export const useAIOpponent = () => {
  const { quizState } = useGameStore();

  useEffect(() => {
    if (!quizState || quizState.opponentType !== 'ai' || quizState.status !== 'active') {
      return;
    }

    // AI答题逻辑：随机延迟后答题
    const answerTime = Math.random() * 8000 + 2000; // 2-10秒随机答题

    const timer = setTimeout(() => {
      // 这里应该有AI答题的逻辑
      // 暂时简单模拟：50%概率答对
      const isCorrect = Math.random() > 0.5;
      
      if (isCorrect) {
        // AI答对，增加进度
        // 这里需要调用store的方法来更新AI进度
      }
    }, answerTime);

    return () => clearTimeout(timer);
  }, [quizState]);
};