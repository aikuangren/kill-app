import React from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import MapCellComponent from './MapCellComponent';

const GameMap: React.FC = () => {
  const { mapGrid, exploreCell, playerState } = useGameStore();

  const handleCellClick = (row: number, col: number) => {
    exploreCell(row, col);
  };

  if (mapGrid.length === 0) {
    return (
      <div className="map-container">
        <div className="flex items-center justify-center h-full">
          <div className="text-primary">地图加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      {/* 状态栏 */}
      <div className="map-header">
        <div className="status-bar">
          <div className="status-item">
            <span className="status-icon">⚡</span>
            <div className="status-info">
              <div className="status-label">体力</div>
              <div className="status-value">{playerState.energy}/{playerState.maxEnergy}</div>
            </div>
          </div>
          
          <div className="status-item">
            <span className="status-icon">🏆</span>
            <div className="status-info">
              <div className="status-label">领土</div>
              <div className="status-value">{playerState.territory}</div>
            </div>
          </div>
          
          <div className="status-item">
            <span className="status-icon">🪙</span>
            <div className="status-info">
              <div className="status-label">金币</div>
              <div className="status-value">{playerState.coins}</div>
            </div>
          </div>
          
          <div className="status-item">
            <div className="status-info">
              <div className="status-label">年级</div>
              <div className="status-value">四年级</div>
            </div>
          </div>
        </div>
      </div>

      {/* 地图内容 */}
      <div className="map-content">
        <div className="map-grid-wrapper">
          <div className="map-scroll-container">
            <div className="map-grid">
              {mapGrid.map((row) =>
                row.map((cell) => (
                  <MapCellComponent
                    key={cell.id}
                    cell={cell}
                    onClick={handleCellClick}
                    disabled={playerState.energy <= 0}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="map-footer">
        <div className="map-tips">
          <p>点击格子探索宝藏 • 占领更多领土</p>
        </div>
        
        {/* 地图拖动提示 */}
        <div className="map-scroll-hint">
          <span className="hint-icon">👆</span>
          <span>可拖动查看完整地图</span>
        </div>
        
        {playerState.energy <= 0 && (
          <div className="energy-warning">
            ⚡ 体力耗尽！
          </div>
        )}
      </div>
    </div>
  );
};

export default GameMap;