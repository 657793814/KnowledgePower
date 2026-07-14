// ===== 学科定义 =====
export const SUBJECT_LABELS: Record<string, string> = {
  math: '📐 数学',
  physics: '⚡ 物理',
  chemistry: '🧪 化学',
};

export const SUBJECT_KEYS = Object.keys(SUBJECT_LABELS);

// ===== 各学科下的领域 =====
export const SUBJECT_DOMAINS: Record<string, Record<string, string>> = {
  math: {
    '数的世界': '🔢 数的世界',
    '式': '📝 式',
    '方程与不等式': '⚖️ 方程与不等式',
    '函数': '📈 函数',
    '几何': '📐 几何',
    '排列组合与统计': '🎲 排列组合与统计',
    '数列与导数': '📊 数列与导数',
  },
  physics: {
    '力学': '🏋️ 力学',
    '热学': '🔥 热学',
    '电磁学': '⚡ 电磁学',
    '光学': '💡 光学',
    '声学': '🔊 声学',
    '近代物理': '⚛️ 近代物理',
  },
  chemistry: {
    '物质结构与分类': '🧬 物质结构与分类',
    '化学反应': '🧪 化学反应',
    '元素周期表': '📋 元素周期表',
    '溶液': '💧 溶液',
    '有机化学基础': '🧫 有机化学基础',
    '化学计算': '📊 化学计算',
  },
};

// ===== 领域主题色 =====
export const DOMAIN_COLORS: Record<string, string> = {
  '数': '#3B82F6',
  '数的世界': '#3B82F6',
  '式': '#10B981',
  '方程与不等式': '#F59E0B',
  '函数': '#8B5CF6',
  '几何': '#EF4444',
  '排列组合与统计': '#EC4899',
  '数列与导数': '#06B6D4',
  '力学': '#FF6B35',
  '热学': '#E74C3C',
  '电磁学': '#2ECC71',
  '光学': '#F39C12',
  '声学': '#9B59B6',
  '近代物理': '#1ABC9C',
  '物质结构与分类': '#3498DB',
  '化学反应': '#E67E22',
  '元素周期表': '#2ECC71',
  '溶液': '#00BCD4',
  '有机化学基础': '#8E44AD',
  '化学计算': '#FF5722',
};

export const LEVEL_COLORS: Record<string, string> = {
  '初中': '#52c41a',
  '高中': '#fa8c16',
};

// ===== API 基础路径 =====
export const API_BASE = '/api';
