import React from 'react';
import type { PlayerIcon } from '../../types/game';
import { getImageDataUrl } from '../../utils/iconConfig';

interface PlayerIconComponentProps {
  icon: PlayerIcon;
  size?: 'small' | 'medium' | 'large' | 'full';
}

const PlayerIconComponent: React.FC<PlayerIconComponentProps> = ({ icon, size = 'medium' }) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { container: 16, icon: 12 };
      case 'large':
        return { container: 32, icon: 24 };
      case 'full':
        return { container: 40, icon: 32 }; // 地图格子44px，留2px边距
      default:
        return { container: 24, icon: 18 };
    }
  };

  const { container: containerSize, icon: iconSize } = getSize();
  const imageDataUrl = getImageDataUrl(icon);

  const renderIcon = () => {
    if (icon.type === 'default') {
      // 显示emoji图标
      return (
        <div 
          className="player-icon-container"
          style={{ 
            width: `${containerSize}px`, 
            height: `${containerSize}px`,
            fontSize: `${iconSize}px`,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
          }}
        >
          {icon.data}
        </div>
      );
    } else {
      // 显示自定义图片
      return (
        <img 
          src={imageDataUrl}
          alt="玩家图标"
          className="player-icon-image"
          style={{
            width: `${containerSize}px`,
            height: `${containerSize}px`,
            borderRadius: '4px',
            objectFit: 'cover',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
          }}
        />
      );
    }
  };

  return (
    <div className="player-icon-wrapper" style={{ width: `${containerSize}px`, height: `${containerSize}px` }}>
      {renderIcon()}
    </div>
  );
};

export default PlayerIconComponent;