import React from 'react';
import type { MapCell } from '../../types/game';
import { useGameStore } from '../../hooks/useGameStore';
import PlayerFlag from './PlayerFlag';

interface MapCellComponentProps {
  cell: MapCell;
  onClick: (row: number, col: number) => void;
  disabled?: boolean;
}

const MapCellComponent: React.FC<MapCellComponentProps> = ({ 
  cell, 
  onClick, 
  disabled = false 
}) => {
  const { playerState } = useGameStore();

  const getCellContent = () => {
    if (cell.status === 'unexplored') {
      return (
        <div className="flex items-center justify-center h-full">
          <span className="cell-icon">❓</span>
        </div>
      );
    }

    if (cell.status === 'explored') {
      switch (cell.content.type) {
        case 'treasure':
          return (
            <div className="flex items-center justify-center h-full text-yellow-500">
              <span className="cell-icon treasure-glow">💎</span>
            </div>
          );
        case 'coins':
          return (
            <div className="flex items-center justify-center h-full text-yellow-600">
              <span className="cell-icon">🪙</span>
            </div>
          );
        case 'item':
          return (
            <div className="flex items-center justify-center h-full text-blue-500">
              <span className="cell-icon">⚡</span>
            </div>
          );
        default:
          return (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span className="cell-icon">•</span>
            </div>
          );
      }
    }

    if (cell.status === 'owned') {
      return (
        <div className="flex items-center justify-center h-full">
          <PlayerFlag emblem={playerState.emblem} size="small" />
        </div>
      );
    }

    if (cell.status === 'enemy') {
      return (
        <div className="flex items-center justify-center h-full text-white">
          <span className="cell-icon">🏴</span>
        </div>
      );
    }

    return null;
  };

  const getCellClass = () => {
    let baseClass = 'map-cell';
    
    if (disabled) {
      baseClass += ' opacity-50 cursor-not-allowed';
    } else if (cell.status === 'unexplored') {
      baseClass += ' hover:bg-gray-400 cursor-pointer';
    }

    switch (cell.status) {
      case 'owned':
        baseClass += ' owned';
        break;
      case 'enemy':
        baseClass += ' enemy';
        break;
      case 'explored':
        baseClass += ' explored';
        break;
    }

    return baseClass;
  };

  const handleClick = () => {
    if (!disabled && cell.status === 'unexplored') {
      onClick(cell.row, cell.col);
    }
  };

  return (
    <div 
      className={getCellClass()}
      style={{
        left: `${cell.col * 44}px`,
        top: `${cell.row * 44}px`
      }}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {getCellContent()}
      
      {/* 添加动画效果 */}
      {cell.status === 'explored' && cell.content.type === 'treasure' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-yellow-300 opacity-20 animate-ping" />
        </div>
      )}
    </div>
  );
};

export default MapCellComponent;