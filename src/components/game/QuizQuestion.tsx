import React, { useState, useEffect } from 'react';
import type { Question } from '../../types/game';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answerIndex: number) => void;
  disabled?: boolean;
  timeLeft: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  disabled = false,
  timeLeft,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // 当题目变化时重置选中状态
  useEffect(() => {
    console.log('Question changed, resetting selected answer'); // 调试日志
    setSelectedAnswer(null);
  }, [question?.word, questionNumber]); // 使用question.word确保在题目内容变化时重置

  // 额外的重置机制：在disabled变化时也重置（从处理状态回到可操作状态时）
  useEffect(() => {
    if (!disabled) {
      console.log('Disabled state changed to false, resetting selected answer'); // 调试日志
      setSelectedAnswer(null);
    }
  }, [disabled]);

  const handleAnswerClick = (answerIndex: number) => {
    if (disabled) return;
    
    setSelectedAnswer(answerIndex);
    onAnswer(answerIndex);
  };

  const getTimeColor = () => {
    if (timeLeft > 60) return 'text-green-500';
    if (timeLeft > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 进度和计时器 */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-lg font-bold text-gray-700">
          第 {questionNumber} / {totalQuestions} 题
        </div>
        
        <div className={`text-2xl font-bold ${getTimeColor()}`}>
          ⏰ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* 题目 */}
      <div className="game-card p-6 mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">请选择正确的中文意思：</div>
          <div className="text-3xl font-bold text-secondary mb-4 font-comic-new">
            {question.word}
          </div>
        </div>
      </div>

      {/* 选项 */}
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={`option-${index}`}
            className={`quiz-option ${
              selectedAnswer === index ? 'selected' : ''
            } ${disabled ? 'disabled' : ''}`}
            onClick={() => handleAnswerClick(index)}
            disabled={disabled}
          >
            <span className="text-lg font-medium">{option}</span>
          </button>
        ))}
      </div>

      {/* 提示信息 */}
      {disabled && (
        <div className="mt-4 text-center text-gray-500">
          {selectedAnswer !== null ? '正在判断答案...' : '请选择一个答案'}
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;