import React, { useState } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import type { EmblemFrame, EmblemIcon, ColorScheme } from '../types/game';
import { emblemFrames, emblemIcons, colorSchemes, createDefaultEmblem } from '../utils/emblemConfig';

const SetupPage: React.FC = () => {
  const { playerState, setPlayerNickname, setPlayerEmblem, startGame } = useGameStore();
  
  const [nickname, setNickname] = useState(playerState.nickname || '');
  const [selectedFrame, setSelectedFrame] = useState<EmblemFrame>(playerState.emblem?.frame || 'classic');
  const [selectedIcon, setSelectedIcon] = useState<EmblemIcon>(playerState.emblem?.icon || 'star');
  const [selectedColorScheme, setSelectedColorScheme] = useState(0);
  
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setNickname(value);
    }
  };
  
  const handleColorSchemeSelect = (index: number) => {
    setSelectedColorScheme(index);
  };
  
  const handleCompleteSetup = () => {
    if (nickname.trim().length < 2) {
      alert('请输入至少2个字符的昵称');
      return;
    }
    
    const colorScheme = colorSchemes[selectedColorScheme];
    const emblem = {
      frame: selectedFrame,
      icon: selectedIcon,
      color: colorScheme.primary,
      secondaryColor: colorScheme.secondary,
    };
    
    setPlayerNickname(nickname.trim());
    setPlayerEmblem(emblem);
    startGame();
  };
  
  const getEmblemPreview = () => {
    const colorScheme = colorSchemes[selectedColorScheme];
    return (
      <div 
        className="emblem-preview"
        style={{
          '--emblem-primary': colorScheme.primary,
          '--emblem-secondary': colorScheme.secondary,
        } as React.CSSProperties}
      >
        <div className={`emblem-frame-${selectedFrame}`}>
          <div className="emblem-background">
            <div className="emblem-center">
              <span className="emblem-icon-display">{emblemIcons[selectedIcon]}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="setup-container">
      {/* 头部 */}
      <div className="setup-header">
        <div className="setup-title">🎮 创建你的领主身份</div>
        <div className="setup-subtitle">设置昵称和旗帜，开启寻宝冒险！</div>
      </div>

      {/* 昵称设置 */}
      <div className="setup-section">
        <div className="section-title">✨ 你的昵称</div>
        <div className="nickname-input-container">
          <input
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="输入你的昵称（最多20个字符）"
            className="nickname-input"
            maxLength={20}
          />
          <div className="char-count">
            {nickname.length}/20
          </div>
        </div>
      </div>

      {/* 徽章选择 */}
      <div className="setup-section">
        <div className="section-title">🏅 选择旗帜徽章</div>
        
        {/* 预览区域 */}
        <div className="emblem-preview-section">
          <div className="preview-container">
            <div className="preview-title">徽章预览</div>
            {getEmblemPreview()}
          </div>
        </div>

        {/* 外框选择 */}
        <div className="choice-section">
          <div className="choice-title">外框样式</div>
          <div className="frame-options">
            {Object.entries(emblemFrames).map(([frameType, _]) => (
              <button
                key={frameType}
                className={`frame-option ${selectedFrame === frameType ? 'selected' : ''}`}
                onClick={() => setSelectedFrame(frameType as EmblemFrame)}
              >
                <div className={`frame-preview-${frameType}`}>
                  <span className="mini-icon">⭐</span>
                </div>
                <span className="option-label">
                  {frameType === 'classic' && '经典'}
                  {frameType === 'modern' && '现代'}
                  {frameType === 'ornate' && '华丽'}
                  {frameType === 'minimal' && '简约'}
                  {frameType === 'shield' && '盾形'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 图标选择 */}
        <div className="choice-section">
          <div className="choice-title">核心图案</div>
          <div className="icon-options">
            {Object.entries(emblemIcons).map(([iconType, icon]) => (
              <button
                key={iconType}
                className={`icon-option ${selectedIcon === iconType ? 'selected' : ''}`}
                onClick={() => setSelectedIcon(iconType as EmblemIcon)}
              >
                <span className="icon-display">{icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 颜色方案选择 */}
        <div className="choice-section">
          <div className="choice-title">配色方案</div>
          <div className="color-options">
            {colorSchemes.map((scheme, index) => (
              <button
                key={index}
                className={`color-option ${selectedColorScheme === index ? 'selected' : ''}`}
                onClick={() => handleColorSchemeSelect(index)}
              >
                <div 
                  className="color-preview"
                  style={{
                    background: `linear-gradient(135deg, ${scheme.primary}, ${scheme.secondary})`,
                  }}
                />
                <span className="color-name">{scheme.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 开始按钮 */}
      <div className="setup-actions">
        <button
          className="start-button"
          onClick={handleCompleteSetup}
          disabled={nickname.trim().length < 2}
        >
          🚀 开始寻宝冒险
        </button>
      </div>
    </div>
  );
};

export default SetupPage;