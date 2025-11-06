import type { PlayerIcon } from '../types/game';

// 10个默认领地图标
export const defaultIcons = [
  '👑', // 皇冠
  '🗡️', // 剑
  '🛡️', // 盾牌
  '🏰', // 城堡
  '⚔️', // 交叉剑
  '🎯', // 靶心
  '💎', // 钻石
  '🏆', // 奖杯
  '⭐', // 星星
  '🔮'  // 水晶球
];

// 生成默认图标
export const createDefaultIcon = (): PlayerIcon => ({
  type: 'default',
  data: defaultIcons[0], // 默认选择皇冠
});

// 文件转Base64函数
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // 移除data:image/...;base64,前缀，只保留base64数据
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// 验证文件大小和类型
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // 检查文件大小 (5MB = 5 * 1024 * 1024 bytes)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: '文件大小不能超过5MB' };
  }
  
  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: '只支持 JPG、PNG、GIF、WebP 格式的图片' };
  }
  
  return { valid: true };
};

// 获取完整的图片数据URL（用于显示）
export const getImageDataUrl = (icon: PlayerIcon): string => {
  if (icon.type === 'default') {
    return icon.data; // emoji直接返回
  } else {
    return `data:image/jpeg;base64,${icon.data}`; // 自定义图片需要加上前缀
  }
};