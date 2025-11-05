import type { EmblemFrame, EmblemIcon, ColorScheme, PlayerEmblem } from '../types/game';

// 徽章外框配置
export const emblemFrames: Record<EmblemFrame, string> = {
  classic: 'classic', // 经典圆形徽章
  modern: 'modern',   // 现代方形徽章
  ornate: 'ornate',   // 华丽装饰徽章
  minimal: 'minimal', // 简约线条徽章
  shield: 'shield',   // 盾形徽章
};

// 徽章图标配置
export const emblemIcons: Record<EmblemIcon, string> = {
  star: '⭐',     // 星星
  crown: '👑',    // 皇冠
  heart: '❤️',    // 爱心
  lightning: '⚡', // 闪电
  fire: '🔥',      // 火焰
  shield: '🛡️',    // 盾牌
  dragon: '🐉',    // 龙
  phoenix: '🦅',   // 凤凰（用鹰代替）
  tiger: '🐅',     // 老虎
  eagle: '🦅',     // 鹰
};

// 预设颜色方案
export const colorSchemes: ColorScheme[] = [
  { primary: '#FF6B6B', secondary: '#4ECDC4', name: '珊瑚绿' },
  { primary: '#4ECDC4', secondary: '#44A3AA', name: '深海蓝' },
  { primary: '#95E77E', secondary: '#68B684', name: '森林绿' },
  { primary: '#FFD93D', secondary: '#FCB845', name: '金黄橙' },
  { primary: '#C77DFF', secondary: '#9B5DE5', name: '梦幻紫' },
  { primary: '#FF9F40', secondary: '#FF6B6B', name: '夕阳红' },
  { primary: '#5E60CE', secondary: '#7400B8', name: '皇家紫' },
  { primary: '#64B5F6', secondary: '#1976D2', name: '天空蓝' },
  { primary: '#FFB700', secondary: '#FFA000', name: '琥珀金' },
  { primary: '#26A69A', secondary: '#00897B', name: '薄荷绿' },
];

// 生成默认徽章
export const createDefaultEmblem = (): PlayerEmblem => ({
  frame: 'classic',
  icon: 'star',
  color: '#4ECDC4',
  secondaryColor: '#44A3AA',
});

// 生成徽章的CSS类名
export const getEmblemClasses = (emblem: PlayerEmblem) => {
  return `emblem-frame-${emblem.frame} emblem-icon-${emblem.icon}`;
};

// 生成徽章的样式对象
export const getEmblemStyles = (emblem: PlayerEmblem) => {
  return {
    '--emblem-primary': emblem.color,
    '--emblem-secondary': emblem.secondaryColor,
  } as React.CSSProperties;
};