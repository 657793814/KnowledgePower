/* ------------------------------------------------------------------ */
/*   PathOptimization — 共享 SVG 组件与工具函数                          */
/* ------------------------------------------------------------------ */
import React from 'react';
import type { Point, ThemeColors } from './types';

export const PADDING = 30;
export const ARROW_SIZE = 7;
export const DOT_RADIUS = 6;
export const HIT_RADIUS = 12;

export const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export const dist = (a: Point, b: Point) =>
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

/** 点到线段的距离 */
export const pointToSegmentDist = (p: Point, a: Point, b: Point) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 < 0.0001) return dist(p, a);
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
  t = clamp(t, 0, 1);
  const proj: Point = { x: a.x + t * dx, y: a.y + t * dy };
  return dist(p, proj);
};

/** 获取深色模式调色板 */
export function useThemeColors(isDark: boolean): ThemeColors {
  return {
    bg: isDark ? '#1e1e2e' : '#fafafa',
    fg: isDark ? '#cdd6f4' : '#1e293b',
    grid: isDark ? '#313244' : '#e2e8f0',
    line: isDark ? '#585b70' : '#94a3b8',
    road: isDark ? '#6c7086' : '#64748b',
    accent: '#f97316',      // 橙色主色
    accentLight: '#fb923c',
    blue: '#3b82f6',
    green: '#10b981',
    orange: '#f59e0b',
    purple: '#8b5cf6',
    pink: '#ec4899',
    red: '#ef4444',
    gray: isDark ? '#585b70' : '#94a3b8',
    dim: isDark ? '#313244' : '#e2e8f0',
    label: isDark ? '#a6adc8' : '#64748b',
    surface: isDark ? '#313244' : '#f1f5f9',
    hover: isDark ? '#45475a' : '#e2e8f0',
    infoBg: isDark ? 'rgba(30,30,46,0.85)' : 'rgba(255,255,255,0.90)',
    infoText: isDark ? '#cdd6f4' : '#334155',
  };
}

/* ================================================================ */
/*  SVG 组件                                                        */
/* ================================================================ */

/** 带箭头的线 */
export function ArrowLine({
  x1, y1, x2, y2, color, strokeWidth = 2, dashArray, arrow = true, opacity = 1,
}: {
  x1: number; y1: number; x2: number; y2: number;
  color: string; strokeWidth?: number; dashArray?: string; arrow?: boolean; opacity?: number;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return null;
  const nx = dx / len;
  const ny = dy / len;
  const ax = x2 - nx * ARROW_SIZE * 1.5;
  const ay = y2 - ny * ARROW_SIZE * 1.5;
  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={dashArray ?? 'none'} strokeLinecap="round" />
      {arrow && (
        <polygon
          points={`${x2},${y2} ${ax - ny * ARROW_SIZE * 0.6},${ay + nx * ARROW_SIZE * 0.6} ${ax + ny * ARROW_SIZE * 0.6},${ay - nx * ARROW_SIZE * 0.6}`}
          fill={color} />
      )}
    </g>
  );
}

interface DraggableDotProps {
  cx: number; cy: number; color: string; label: string;
  labelOffset?: Point; dragId: string; hollow?: boolean; fontSize?: number;
  isDragging: boolean; isDark: boolean;
  onPointerDown: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void;
}

/** 可拖动的圆点 */
export function DraggableDot({
  cx, cy, color, label, labelOffset = { x: 0, y: -16 }, dragId,
  hollow = false, fontSize = 13, isDragging, isDark, onPointerDown,
}: DraggableDotProps) {
  const dragging = isDragging;
  return (
    <g style={{ cursor: 'grab', userSelect: 'none' }}
      onMouseDown={onPointerDown(dragId)}
      onTouchStart={onPointerDown(dragId)}>
      <circle cx={cx} cy={cy} r={HIT_RADIUS} fill="transparent" />
      {dragging && (
        <circle cx={cx} cy={cy} r={DOT_RADIUS + 4} fill={color} opacity={0.25} />
      )}
      <circle cx={cx} cy={cy} r={DOT_RADIUS}
        fill={hollow ? 'none' : color}
        stroke={hollow ? color : isDark ? '#1e1e2e' : '#fff'}
        strokeWidth={hollow ? 2 : 1.5} />
      <text x={cx + labelOffset.x} y={cy + labelOffset.y}
        fill={color} fontSize={fontSize} fontWeight={700}
        textAnchor="middle" style={{ pointerEvents: 'none' }}>
        {label}
      </text>
    </g>
  );
}

/** 网格背景 */
export function Grid({ width, height, color }: { width: number; height: number; color: string }) {
  const gap = 30;
  const lines: React.ReactNode[] = [];
  for (let x = PADDING; x <= width - PADDING; x += gap) {
    lines.push(<line key={`gv${x}`} x1={x} y1={PADDING} x2={x} y2={height - PADDING}
      stroke={color} strokeWidth={0.5} />);
  }
  for (let y = PADDING; y <= height - PADDING; y += gap) {
    lines.push(<line key={`gh${y}`} x1={PADDING} y1={y} x2={width - PADDING} y2={y}
      stroke={color} strokeWidth={0.5} />);
  }
  return <g opacity={0.6}>{lines}</g>;
}

/** 刻度标注 */
export function TickLabel({ x, y, value, color }: {
  x: number; y: number; value: string; color: string;
}) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + 8} stroke={color} strokeWidth={1} opacity={0.5} />
      <text x={x} y={y + 20} fill={color} fontSize={11} textAnchor="middle">{value}</text>
    </g>
  );
}

/** 直角标记 */
export function RightAngleMark({ x, y, dir = 'br', size = 6, color }: {
  x: number; y: number; dir?: 'br' | 'bl' | 'tr' | 'tl'; size?: number; color: string;
}) {
  const dx = dir.includes('r') ? size : -size;
  const dy = dir.includes('b') ? size : -size;
  return (
    <path d={`M${x - dx} ${y} L${x - dx} ${y + dy} L${x} ${y + dy}`}
      fill="none" stroke={color} strokeWidth={1} opacity={0.6} />
  );
}

/** 带阴影背景的文本标签 */
export function LabelBox({ x, y, text, color, bg, fontSize = 12 }: {
  x: number; y: number; text: string; color: string; bg: string; fontSize?: number;
}) {
  return (
    <g>
      <rect x={x - 4} y={y - fontSize + 2} width={text.length * fontSize * 0.58 + 8}
        height={fontSize + 4} rx={3} fill={bg} opacity={0.7} />
      <text x={x} y={y} fill={color} fontSize={fontSize} fontWeight={600}>{text}</text>
    </g>
  );
}

/** 两点连线与水平线/垂线的交点 */
export function lineIntersect(p1: Point, p2: Point, y: number): Point | null {
  if (Math.abs(p2.y - p1.y) < 0.001) return null;
  const t = (y - p1.y) / (p2.y - p1.y);
  return { x: p1.x + t * (p2.x - p1.x), y };
}

export function lineIntersectX(p1: Point, p2: Point, x: number): Point | null {
  if (Math.abs(p2.x - p1.x) < 0.001) return null;
  const t = (x - p1.x) / (p2.x - p1.x);
  return { x, y: p1.y + t * (p2.y - p1.y) };
}

/** 两直线交点 */
export function twoLineIntersect(
  p1: Point, p2: Point, p3: Point, p4: Point,
): Point | null {
  const d1x = p2.x - p1.x, d1y = p2.y - p1.y;
  const d2x = p4.x - p3.x, d2y = p4.y - p3.y;
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < 1e-10) return null;
  const t = ((p3.x - p1.x) * d2y - (p3.y - p1.y) * d2x) / denom;
  return { x: p1.x + t * d1x, y: p1.y + t * d1y };
}

/** 点关于水平线的对称 */
export function reflectY(p: Point, y: number): Point {
  return { x: p.x, y: 2 * y - p.y };
}

/** 点关于垂直线的对称 */
export function reflectX(p: Point, x: number): Point {
  return { x: 2 * x - p.x, y: p.y };
}

/** 在区间 [lo, hi] 上三分搜索函数最小值 */
export function ternarySearch(
  f: (x: number) => number, lo: number, hi: number, iterations = 80,
): number {
  let l = lo, h = hi;
  for (let i = 0; i < iterations; i++) {
    const m1 = l + (h - l) / 3;
    const m2 = h - (h - l) / 3;
    if (f(m1) < f(m2)) h = m2;
    else l = m1;
  }
  return (l + h) / 2;
}
