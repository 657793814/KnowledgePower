/**
 * 🎨 知识动力 (ZDKnowledge) — 主题预设定义
 *
 * 每套主题包含：
 * - AI 生成的概念背景图（public/assets/theme-bg/）
 * - tint 叠加色
 * - CSS 变量映射
 * - Ant Design token 覆盖
 */

export type ThemeId =
  | 'knowledge-blue'
  | 'jade-green'
  | 'warm-amber'
  | 'lilac-purple'
  | 'crimson-red';

export type ThemePreset = {
  id: ThemeId;
  name: string;
  emoji: string;
  description: string;
  /** 主题背景图片路径 (public/ 下) */
  bgImage: string;
  /** 背景 tint 色（叠加在图片上） */
  bgTint: string;
  /** CSS 变量注入 :root */
  cssVars: Record<string, string>;
  /** Ant Design ConfigProvider token 覆盖 */
  antdToken: Record<string, string | number>;
};

export const DEFAULT_THEME_ID: ThemeId = 'knowledge-blue';

const THEMES: ThemePreset[] = [
  // ── 1. 知识蓝 ──
  {
    id: 'knowledge-blue',
    name: '知识蓝',
    emoji: '🔵',
    description: '默认蓝色主题，清爽学习',
    bgImage: '/assets/theme-bg/knowledge-blue.png',
    bgTint: 'rgba(59, 130, 246, 0.18)',
    cssVars: {
      '--color-bg': '#f5f7fa',
      '--color-surface': 'rgba(255,255,255,0.85)',
      '--color-surface-solid': '#ffffff',
      '--color-surface-hover': '#f0f5ff',
      '--color-primary': '#3B82F6',
      '--color-primary-light': '#dbeafe',
      '--color-primary-text': '#ffffff',
      '--color-text': '#1a1a2e',
      '--color-text-secondary': '#4b5563',
      '--color-border': 'rgba(0,0,0,0.06)',
      '--color-border-strong': '#e2e8f0',
      '--color-header-bg': 'rgba(255,255,255,0.75)',
      '--color-sidebar-bg': 'rgba(255,255,255,0.80)',
      '--color-tooltip-bg': 'rgba(30,41,59,0.95)',
      '--color-tooltip-text': '#ffffff',
      '--color-code-bg': 'rgba(248,250,252,0.8)',
      '--color-glass-border': 'rgba(255,255,255,0.4)',
      '--color-glass-shadow': '0 8px 32px rgba(0,0,0,0.06)',
      '--color-scrollbar': '#93c5fd',
      '--color-scrollbar-hover': '#60a5fa',
    },
    antdToken: {
      colorPrimary: '#3B82F6',
      colorBgContainer: '#ffffff',
      colorBgLayout: 'transparent',
      colorText: '#1a1a2e',
      colorTextSecondary: '#64748b',
      colorBorder: '#f0f0f0',
      borderRadius: 8,
    },
  },

  // ── 2. 翡翠青 ──
  {
    id: 'jade-green',
    name: '翡翠青',
    emoji: '🌿',
    description: '护眼绿色调，长时间学习',
    bgImage: '/assets/theme-bg/jade-green.png',
    bgTint: 'rgba(5, 150, 105, 0.15)',
    cssVars: {
      '--color-bg': '#ecfdf5',
      '--color-surface': 'rgba(255,255,255,0.82)',
      '--color-surface-solid': '#ffffff',
      '--color-surface-hover': '#f0fdf4',
      '--color-primary': '#059669',
      '--color-primary-light': '#d1fae5',
      '--color-primary-text': '#ffffff',
      '--color-text': '#0f172a',
      '--color-text-secondary': '#64748b',
      '--color-border': 'rgba(0,0,0,0.06)',
      '--color-border-strong': '#cbd5e1',
      '--color-header-bg': 'rgba(255,255,255,0.72)',
      '--color-sidebar-bg': 'rgba(255,255,255,0.78)',
      '--color-tooltip-bg': 'rgba(5,150,105,0.95)',
      '--color-tooltip-text': '#ffffff',
      '--color-code-bg': 'rgba(240,253,244,0.8)',
      '--color-glass-border': 'rgba(255,255,255,0.35)',
      '--color-glass-shadow': '0 8px 32px rgba(5,150,105,0.08)',
      '--color-scrollbar': '#a7f3d0',
      '--color-scrollbar-hover': '#6ee7b7',
    },
    antdToken: {
      colorPrimary: '#059669',
      colorBgContainer: '#ffffff',
      colorBgLayout: 'transparent',
      colorText: '#0f172a',
      colorTextSecondary: '#64748b',
      colorBorder: '#e2e8f0',
      borderRadius: 8,
    },
  },

  // ── 3. 暖阳橙 ──
  {
    id: 'warm-amber',
    name: '暖阳橙',
    emoji: '☀️',
    description: '温暖色调，放松心情',
    bgImage: '/assets/theme-bg/warm-amber.png',
    bgTint: 'rgba(217, 119, 6, 0.12)',
    cssVars: {
      '--color-bg': '#fffbeb',
      '--color-surface': 'rgba(255,255,255,0.82)',
      '--color-surface-solid': '#ffffff',
      '--color-surface-hover': '#fef3c7',
      '--color-primary': '#D97706',
      '--color-primary-light': '#fde68a',
      '--color-primary-text': '#ffffff',
      '--color-text': '#1c1917',
      '--color-text-secondary': '#78716c',
      '--color-border': 'rgba(0,0,0,0.06)',
      '--color-border-strong': '#d6d3d1',
      '--color-header-bg': 'rgba(255,255,255,0.72)',
      '--color-sidebar-bg': 'rgba(255,255,255,0.78)',
      '--color-tooltip-bg': 'rgba(217,119,6,0.95)',
      '--color-tooltip-text': '#ffffff',
      '--color-code-bg': 'rgba(254,249,195,0.8)',
      '--color-glass-border': 'rgba(255,255,255,0.35)',
      '--color-glass-shadow': '0 8px 32px rgba(217,119,6,0.08)',
      '--color-scrollbar': '#fcd34d',
      '--color-scrollbar-hover': '#fbbf24',
    },
    antdToken: {
      colorPrimary: '#D97706',
      colorBgContainer: '#ffffff',
      colorBgLayout: 'transparent',
      colorText: '#1c1917',
      colorTextSecondary: '#78716c',
      colorBorder: '#e7e5e4',
      borderRadius: 8,
    },
  },

  // ── 4. 丁香紫 ──
  {
    id: 'lilac-purple',
    name: '丁香紫',
    emoji: '💜',
    description: '紫色调，优雅知性',
    bgImage: '/assets/theme-bg/lilac-purple.png',
    bgTint: 'rgba(124, 58, 237, 0.15)',
    cssVars: {
      '--color-bg': '#f5f3ff',
      '--color-surface': 'rgba(255,255,255,0.82)',
      '--color-surface-solid': '#ffffff',
      '--color-surface-hover': '#ede9fe',
      '--color-primary': '#7C3AED',
      '--color-primary-light': '#ddd6fe',
      '--color-primary-text': '#ffffff',
      '--color-text': '#1e1b4b',
      '--color-text-secondary': '#6d28d9',
      '--color-border': 'rgba(0,0,0,0.06)',
      '--color-border-strong': '#d4d4d8',
      '--color-header-bg': 'rgba(255,255,255,0.72)',
      '--color-sidebar-bg': 'rgba(255,255,255,0.78)',
      '--color-tooltip-bg': 'rgba(124,58,237,0.95)',
      '--color-tooltip-text': '#ffffff',
      '--color-code-bg': 'rgba(237,233,254,0.8)',
      '--color-glass-border': 'rgba(255,255,255,0.35)',
      '--color-glass-shadow': '0 8px 32px rgba(124,58,237,0.08)',
      '--color-scrollbar': '#c4b5fd',
      '--color-scrollbar-hover': '#a78bfa',
    },
    antdToken: {
      colorPrimary: '#7C3AED',
      colorBgContainer: '#ffffff',
      colorBgLayout: 'transparent',
      colorText: '#1e1b4b',
      colorTextSecondary: '#6d28d9',
      colorBorder: '#e4e4e7',
      borderRadius: 8,
    },
  },

  // ── 5. 赤焰红 ──
  {
    id: 'crimson-red',
    name: '赤焰红',
    emoji: '🔴',
    description: '红色系主题，热烈专注',
    bgImage: '/assets/theme-bg/crimson-red.png',
    bgTint: 'rgba(220, 38, 38, 0.12)',
    cssVars: {
      '--color-bg': '#fef2f2',
      '--color-surface': 'rgba(255,255,255,0.85)',
      '--color-surface-solid': '#ffffff',
      '--color-surface-hover': '#fee2e2',
      '--color-primary': '#DC2626',
      '--color-primary-light': '#fecaca',
      '--color-primary-text': '#ffffff',
      '--color-text': '#1c1917',
      '--color-text-secondary': '#78716c',
      '--color-border': 'rgba(0,0,0,0.06)',
      '--color-border-strong': '#e7e5e4',
      '--color-header-bg': 'rgba(255,255,255,0.75)',
      '--color-sidebar-bg': 'rgba(255,255,255,0.80)',
      '--color-tooltip-bg': 'rgba(220,38,38,0.95)',
      '--color-tooltip-text': '#ffffff',
      '--color-code-bg': 'rgba(254,242,242,0.8)',
      '--color-glass-border': 'rgba(255,255,255,0.4)',
      '--color-glass-shadow': '0 8px 32px rgba(220,38,38,0.08)',
      '--color-scrollbar': '#fca5a5',
      '--color-scrollbar-hover': '#f87171',
    },
    antdToken: {
      colorPrimary: '#DC2626',
      colorBgContainer: '#ffffff',
      colorBgLayout: 'transparent',
      colorText: '#1c1917',
      colorTextSecondary: '#78716c',
      colorBorder: '#e7e5e4',
      borderRadius: 8,
    },
  },
];

export default THEMES;

export function getThemeById(id: ThemeId): ThemePreset {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
