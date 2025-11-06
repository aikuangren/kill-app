import React, { useState, useRef } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import type { PlayerIcon } from '../types/game';
import { defaultIcons, fileToBase64, validateFile } from '../utils/iconConfig';

type SetupStep = 'nickname' | 'icon';

const SetupPage: React.FC = () => {
  const { playerState, setPlayerNickname, setPlayerIcon, startGame } = useGameStore();
  
  const [currentStep, setCurrentStep] = useState<SetupStep>('nickname');
  const [nickname, setNickname] = useState(playerState.nickname || '');
  const [selectedIcon, setSelectedIcon] = useState<string>(defaultIcons[0]);
  const [customIcon, setCustomIcon] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setNickname(value);
    }
  };
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // 重置错误状态
    setUploadError('');
    setIsUploading(true);
    
    // 验证文件
    const validation = validateFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || '文件验证失败');
      setIsUploading(false);
      return;
    }
    
    try {
      // 转换为base64
      const base64Data = await fileToBase64(file);
      setCustomIcon(base64Data);
      setSelectedIcon(''); // 清除默认图标选择
    } catch (error) {
      setUploadError('文件处理失败，请重试');
      console.error('文件处理错误:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDefaultIconSelect = (icon: string) => {
    setSelectedIcon(icon);
    setCustomIcon(''); // 清除自定义图标
    setUploadError('');
  };
  
  const handleNext = () => {
    if (currentStep === 'nickname') {
      if (nickname.trim().length < 2) {
        alert('请输入至少2个字符的昵称');
        return;
      }
      setCurrentStep('icon');
    } else if (currentStep === 'icon') {
      handleCompleteSetup();
    }
  };
  
  const handleBack = () => {
    if (currentStep === 'icon') {
      setCurrentStep('nickname');
    }
  };
  
  const handleCompleteSetup = () => {
    // 创建玩家图标
    let playerIcon: PlayerIcon;
    
    if (customIcon) {
      // 使用自定义上传的图片
      playerIcon = {
        type: 'custom',
        data: customIcon,
      };
    } else if (selectedIcon) {
      // 使用默认图标
      playerIcon = {
        type: 'default',
        data: selectedIcon,
      };
    } else {
      // 使用默认的皇冠图标
      playerIcon = {
        type: 'default',
        data: defaultIcons[0],
      };
    }
    
    setPlayerNickname(nickname.trim());
    setPlayerIcon(playerIcon);
    startGame();
  };
  
  const getStepTitle = () => {
    switch (currentStep) {
      case 'nickname':
        return '📝 设置你的昵称';
      case 'icon':
        return '🎯 选择你的领地图标';
    }
  };
  
  const getStepSubtitle = () => {
    switch (currentStep) {
      case 'nickname':
        return '这是你在游戏中显示的名字';
      case 'icon':
        return '选择代表你领地的标志';
    }
  };
  
  const getProgress = () => {
    const steps: SetupStep[] = ['nickname', 'icon'];
    return steps.indexOf(currentStep) + 1;
  };
  
  const getTotalSteps = () => {
    return 2;
  };

  // 昵称设置页面
  const renderNicknameStep = () => (
    <div className="step-content">
      <div className="step-form">
        <div className="input-group">
          <input
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="输入你的昵称（最多20个字符）"
            className="nickname-input-large"
            maxLength={20}
            autoFocus
          />
          <div className="char-count-large">
            {nickname.length}/20
          </div>
        </div>
        
        <div className="tips">
          <div className="tip-title">💡 小贴士</div>
          <div className="tip-text">
            • 昵称将显示在地图上你的领地中<br/>
            • 可以使用中文、英文或数字<br/>
            • 昵称长度为2-20个字符
          </div>
        </div>
      </div>
    </div>
  );

  // 图标选择页面
  const renderIconStep = () => (
    <div className="step-content">
      <div className="icon-showcase">
        <div className="current-icon-preview">
          <div className="preview-title">当前选择</div>
          <div className="icon-display-large">
            {(customIcon || selectedIcon) && (
              customIcon ? (
                <img 
                  src={`data:image/jpeg;base64,${customIcon}`}
                  alt="自定义图标"
                  className="custom-icon-preview"
                />
              ) : (
                <span className="emoji-icon-large">{selectedIcon || defaultIcons[0]}</span>
              )
            )}
          </div>
        </div>
      </div>
      
      <div className="icon-selection-area">
        <div className="selection-section">
          <div className="section-title">默认图标</div>
          <div className="default-icons-grid">
            {defaultIcons.map((icon, index) => (
              <button
                key={index}
                className={`icon-option ${selectedIcon === icon && !customIcon ? 'selected' : ''}`}
                onClick={() => handleDefaultIconSelect(icon)}
              >
                <span className="icon-emoji">{icon}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="selection-section">
          <div className="section-title">自定义上传</div>
          <div className="upload-section">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            <button
              className="upload-button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? '上传中...' : '📁 选择图片文件'}
            </button>
            
            <div className="upload-tips">
              支持 JPG、PNG、GIF、WebP 格式<br/>
              文件大小不超过 5MB
            </div>
            
            {uploadError && (
              <div className="upload-error">
                ❌ {uploadError}
              </div>
            )}
            
            {customIcon && (
              <div className="upload-success">
                ✅ 自定义图标已上传
                <button
                  className="remove-custom-btn"
                  onClick={() => {
                    setCustomIcon('');
                    setSelectedIcon(defaultIcons[0]);
                    setUploadError('');
                  }}
                >
                  移除
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'nickname':
        return renderNicknameStep();
      case 'icon':
        return renderIconStep();
      default:
        return renderNicknameStep();
    }
  };

  return (
    <div className="step-container">
      {/* 头部 */}
      <div className="step-header">
        <div className="progress-indicator">
          步骤 {getProgress()} / {getTotalSteps()}
        </div>
        <div className="step-title">{getStepTitle()}</div>
        <div className="step-subtitle">{getStepSubtitle()}</div>
      </div>

      {/* 内容区域 */}
      <div className="step-content-area">
        {renderCurrentStep()}
      </div>

      {/* 底部操作区 */}
      <div className="step-actions">
        <button
          className="step-button secondary"
          onClick={handleBack}
          disabled={currentStep === 'nickname'}
        >
          上一步
        </button>
        
        <button
          className="step-button primary"
          onClick={handleNext}
        >
          {currentStep === 'icon' ? '🚀 开始冒险' : '下一步'}
        </button>
      </div>
    </div>
  );
};

export default SetupPage;