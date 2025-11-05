import React from 'react';
import type { PlayerEmblem } from '../../types/game';
import { emblemFrames, emblemIcons } from '../../utils/emblemConfig';

interface PlayerFlagProps {
  emblem: PlayerEmblem;
  size?: 'small' | 'medium' | 'large';
}

const PlayerFlag: React.FC<PlayerFlagProps> = ({ emblem, size = 'medium' }) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { container: 16, icon: 12 };
      case 'large':
        return { container: 32, icon: 24 };
      default:
        return { container: 24, icon: 18 };
    }
  };

  const { container: containerSize, icon: iconSize } = getSize();

  const renderFlag = () => {
    const flagStyle: React.CSSProperties = {
      '--emblem-primary': emblem.color,
      '--emblem-secondary': emblem.secondaryColor,
      width: `${containerSize}px`,
      height: `${containerSize}px`,
    } as React.CSSProperties;

    switch (emblem.frame) {
      case 'classic':
        return (
          <div 
            className="player-flag classic"
            style={flagStyle}
          >
            <div className="flag-icon">
              {emblemIcons[emblem.icon]}
            </div>
          </div>
        );

      case 'modern':
        return (
          <div 
            className="player-flag modern"
            style={flagStyle}
          >
            <div className="flag-icon">
              {emblemIcons[emblem.icon]}
            </div>
          </div>
        );

      case 'ornate':
        return (
          <div 
            className="player-flag ornate"
            style={flagStyle}
          >
            <div className="flag-icon">
              {emblemIcons[emblem.icon]}
            </div>
            <div className="ornate-border" />
          </div>
        );

      case 'minimal':
        return (
          <div 
            className="player-flag minimal"
            style={flagStyle}
          >
            <div className="flag-icon">
              {emblemIcons[emblem.icon]}
            </div>
          </div>
        );

      case 'shield':
        return (
          <div 
            className="player-flag shield"
            style={flagStyle}
          >
            <div className="flag-icon">
              {emblemIcons[emblem.icon]}
            </div>
          </div>
        );

      default:
        return (
          <div 
            className="player-flag classic"
            style={flagStyle}
          >
            <div className="flag-icon">
              {emblemIcons[emblem.icon]}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="player-flag-container" style={{ width: `${containerSize}px`, height: `${containerSize}px` }}>
      {renderFlag()}
    </div>
  );
};

export default PlayerFlag;