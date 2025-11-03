import React from 'react';
import { useGameStore } from '../hooks/useGameStore';
import type { Grade } from '../types/game';

const HomePage: React.FC = () => {
  const { setGrade, initializeMap } = useGameStore();

  const grades: Grade[] = ['grade1', 'grade2', 'grade3', 'grade4', 'grade5', 'grade6', 'grade7', 'grade8', 'grade9'];
  
  const gradeNames = {
    grade1: '小一',
    grade2: '小二', 
    grade3: '小三',
    grade4: '小四',
    grade5: '小五',
    grade6: '小六',
    grade7: '初一',
    grade8: '初二',
    grade9: '初三',
  };

  const [selectedGrade, setSelectedGrade] = React.useState<Grade>('grade4');

  const handleStartGame = () => {
    setGrade(selectedGrade);
    initializeMap(50); // 50x50 地图，在正方形容器中滚动显示
  };

  return (
    <div className="home-container">
      {/* 头部 Logo */}
      <div className="home-header">
        <div className="home-logo">
          <div className="text-6xl">📚</div>
          <div className="text-6xl">🗺️</div>
          <div className="text-6xl">💎</div>
        </div>
        
        <h1 className="home-title">词汇寻宝记</h1>
        
        <p className="home-subtitle">
          探索地图，学习词汇，成为领主！
        </p>
      </div>

  
      {/* 年级选择 - 核心内容 */}
      <div className="home-grade-selection-centered">
        <div className="grade-selection-title">
          <div className="font-bold text-primary">选择年级</div>
        </div>
        <div className="grade-grid-centered">
          {grades.map((grade) => (
            <button
              key={grade}
              className={`grade-button-centered ${selectedGrade === grade ? 'selected' : ''}`}
              onClick={() => setSelectedGrade(grade)}
            >
              <div className="grade-text-centered">{gradeNames[grade]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 操作区域 */}
      <div className="home-actions">
        <button 
          className="game-button"
          onClick={handleStartGame}
        >
          🚀 开始寻宝冒险
        </button>

        {/* 游戏规则 - 可折叠区域 */}
        <div className="home-rules">
          <div className="rules-title">🎯 游戏规则</div>
          <div className="rules-grid">
            <div className="rule-item">
              <span className="rule-number">1.</span>
              <span>点击格子探索宝藏</span>
            </div>
            <div className="rule-item">
              <span className="rule-number">2.</span>
              <span>答题PK占领领土</span>
            </div>
            <div className="rule-item">
              <span className="rule-number">3.</span>
              <span>消耗体力需要策略</span>
            </div>
            <div className="rule-item">
              <span className="rule-number">4.</span>
              <span>占领最多领土获胜</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;