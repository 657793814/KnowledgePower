/* ------------------------------------------------------------------ */
/*   情景组 3：系数加权 / 三角形内点最值 / 圆上动点 / 折线路径 / 综合型 */
/* ------------------------------------------------------------------ */
import React from 'react';
import type { Point, ThemeColors } from '../types';
import { PADDING, clamp, dist, reflectY, lineIntersect, ternarySearch, DraggableDot } from '../shared';

/* ================================================================ */
/*  情景 9 — 系数加权                                                */
/*  PA + k·PB (k ≠ 1)，P 在直线 l 上                                */
/*  使用三分搜索沿 l 求最小值                                         */
/* ================================================================ */
export interface Scene9State {
  a: Point;
  b: Point;
  k: number;
}

export function getDefaultScene9(width: number, height: number): Scene9State {
  const lineY = height * 0.55;
  return {
    a: { x: width * 0.2, y: lineY - 80 },
    b: { x: width * 0.8, y: lineY - 40 },
    k: 1.5,
  };
}

export function updateScene9Point(
  state: Scene9State, id: string, pt: Point, width: number, height: number,
): Scene9State {
  const p = { x: clamp(pt.x, PADDING, width - PADDING), y: clamp(pt.y, PADDING, height - PADDING) };
  if (id === 'a') return { ...state, a: p };
  if (id === 'b') return { ...state, b: p };
  return state;
}

export function renderScene9(
  state: Scene9State, C: ThemeColors, isDark: boolean, width: number, height: number,
  dragRef: string | null, onPointerDown: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void,
) {
  const lineY = height * 0.55;
  const { a, b, k } = state;

  const f = (x: number) => {
    const pt: Point = { x, y: lineY };
    return dist(a, pt) + k * dist(pt, b);
  };
  const bestX = ternarySearch(f, PADDING, width - PADDING);
  const p: Point = { x: bestX, y: lineY };

  const pa = dist(a, p);
  const pb = dist(p, b);
  const total = pa + k * pb;

  return (
    <g>
      <text x={width / 2} y={PADDING - 4} fill={C.fg} fontSize={15} fontWeight={700} textAnchor="middle">
        系数加权 — PA + k·PB 最小值（k = {k.toFixed(2)}）
      </text>

      <line x1={PADDING} y1={lineY} x2={width - PADDING} y2={lineY}
        stroke={C.road} strokeWidth={2.5} strokeDasharray="8,4" />
      <text x={width - PADDING + 4} y={lineY + 16} fill={C.label} fontSize={12}>l</text>

      {/* k·PB 段用紫色，PA 段用橙色 */}
      <line x1={a.x} y1={a.y} x2={p.x} y2={p.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={p.x} y1={p.y} x2={b.x} y2={b.y} stroke={C.purple} strokeWidth={2.5} strokeLinecap="round" />

      {/* 系数标注 */}
      <text x={(a.x + p.x) / 2} y={(a.y + p.y) / 2 - 8} fill={C.accent} fontSize={11} textAnchor="middle" fontWeight={600}>
        1
      </text>
      <text x={(p.x + b.x) / 2} y={(p.y + b.y) / 2 - 8} fill={C.purple} fontSize={11} textAnchor="middle" fontWeight={600}>
        k={k.toFixed(2)}
      </text>

      <circle cx={p.x} cy={p.y} r={4} fill={C.accent} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
      <text x={p.x + 10} y={p.y - 6} fill={C.accent} fontSize={13} fontWeight={700}>P</text>

      <DraggableDot cx={a.x} cy={a.y} color={C.blue} label="A" labelOffset={{ x: -8, y: -18 }}
        dragId="a" isDragging={dragRef === 'a'} isDark={isDark} onPointerDown={onPointerDown} />
      <DraggableDot cx={b.x} cy={b.y} color={C.green} label="B" labelOffset={{ x: 8, y: -18 }}
        dragId="b" isDragging={dragRef === 'b'} isDark={isDark} onPointerDown={onPointerDown} />
    </g>
  );
}

/* ================================================================ */
/*  情景 10 — 三角形内点最值                                         */
/*  三角形 ABC 内一点 P，使 PA + PB + PC 最小（费马点）              */
/*  使用梯度下降法求近似最优解                                       */
/* ================================================================ */
export interface Scene10State {
  triA: Point;
  triB: Point;
  triC: Point;
}

export function getDefaultScene10(width: number, height: number): Scene10State {
  return {
    triA: { x: width * 0.15, y: height * 0.65 },
    triB: { x: width * 0.85, y: height * 0.65 },
    triC: { x: width * 0.50, y: height * 0.15 },
  };
}

export function updateScene10Point(
  state: Scene10State, id: string, pt: Point, width: number, height: number,
): Scene10State {
  const p = { x: clamp(pt.x, PADDING, width - PADDING), y: clamp(pt.y, PADDING, height - PADDING) };
  if (id === 'triA') return { ...state, triA: p };
  if (id === 'triB') return { ...state, triB: p };
  if (id === 'triC') return { ...state, triC: p };
  return state;
}

/** 用梯度下降法找三角形内使 PA+PB+PC 最小的点（费马点近似） */
function findFermatPoint(triA: Point, triB: Point, triC: Point): Point {
  // 初始化：用重心
  let px = (triA.x + triB.x + triC.x) / 3;
  let py = (triA.y + triB.y + triC.y) / 3;
  const eps = 1e-6;
  const step = 0.5;
  for (let iter = 0; iter < 500; iter++) {
    const da = Math.sqrt((px - triA.x) ** 2 + (py - triA.y) ** 2) + eps;
    const db = Math.sqrt((px - triB.x) ** 2 + (py - triB.y) ** 2) + eps;
    const dc = Math.sqrt((px - triC.x) ** 2 + (py - triC.y) ** 2) + eps;
    // 梯度：各方向的单位向量之和
    const gx = (px - triA.x) / da + (px - triB.x) / db + (px - triC.x) / dc;
    const gy = (py - triA.y) / da + (py - triB.y) / db + (py - triC.y) / dc;
    const gNorm = Math.sqrt(gx * gx + gy * gy);
    if (gNorm < 0.001) break;
    px -= step * gx / gNorm;
    py -= step * gy / gNorm;
    // 限制在三角形区域内（简单约束）
    px = clamp(px, PADDING + 5, 1000);
    py = clamp(py, PADDING + 5, 1000);
  }
  return { x: px, y: py };
}

export function renderScene10(
  state: Scene10State, C: ThemeColors, isDark: boolean, width: number, height: number,
  dragRef: string | null, onPointerDown: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void,
) {
  const { triA, triB, triC } = state;
  const p = findFermatPoint(triA, triB, triC);

  const pa = dist(p, triA);
  const pb = dist(p, triB);
  const pc = dist(p, triC);
  const total = pa + pb + pc;

  return (
    <g>
      <text x={width / 2} y={PADDING - 4} fill={C.fg} fontSize={15} fontWeight={700} textAnchor="middle">
        三角形内点最值 — PA + PB + PC 最小（费马点）
      </text>

      {/* 三角形 */}
      <polygon points={`${triA.x},${triA.y} ${triB.x},${triB.y} ${triC.x},${triC.y}`}
        fill={C.accent} fillOpacity={0.06} stroke={C.line} strokeWidth={2} strokeLinejoin="round" />

      {/* 到三边的连线 */}
      <line x1={p.x} y1={p.y} x2={triA.x} y2={triA.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={p.x} y1={p.y} x2={triB.x} y2={triB.y} stroke={C.accentLight} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={p.x} y1={p.y} x2={triC.x} y2={triC.y} stroke={C.blue} strokeWidth={2.5} strokeLinecap="round" />

      {/* 120° 角标注 */}
      <text x={p.x + 14} y={p.y - 2} fill={C.label} fontSize={10} fontStyle="italic" opacity={0.7}>120°</text>

      {/* P 点 */}
      <circle cx={p.x} cy={p.y} r={5} fill={C.accent} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
      <text x={p.x + 10} y={p.y - 8} fill={C.accent} fontSize={14} fontWeight={700}>P</text>

      <DraggableDot cx={triA.x} cy={triA.y} color={C.blue} label="A" labelOffset={{ x: -10, y: 14 }}
        dragId="triA" isDragging={dragRef === 'triA'} isDark={isDark} onPointerDown={onPointerDown} />
      <DraggableDot cx={triB.x} cy={triB.y} color={C.green} label="B" labelOffset={{ x: 10, y: 14 }}
        dragId="triB" isDragging={dragRef === 'triB'} isDark={isDark} onPointerDown={onPointerDown} />
      <DraggableDot cx={triC.x} cy={triC.y} color={C.orange} label="C" labelOffset={{ x: 0, y: -18 }}
        dragId="triC" isDragging={dragRef === 'triC'} isDark={isDark} onPointerDown={onPointerDown} />
    </g>
  );
}

/* ================================================================ */
/*  情景 11 — 圆上动点                                               */
/*  P 在圆上运动，PA + PB 最小值（穿过圆心时取最值）                  */
/*  使用三分搜索沿圆弧求最小值                                       */
/* ================================================================ */
export interface Scene11State {
  a: Point;
  b: Point;
}

export function getDefaultScene11(width: number, height: number): Scene11State {
  return {
    a: { x: width * 0.18, y: height * 0.28 },
    b: { x: width * 0.82, y: height * 0.20 },
  };
}

export function updateScene11Point(
  state: Scene11State, id: string, pt: Point, width: number, height: number,
): Scene11State {
  const p = { x: clamp(pt.x, PADDING, width - PADDING), y: clamp(pt.y, PADDING, height - PADDING) };
  if (id === 'a') return { ...state, a: p };
  if (id === 'b') return { ...state, b: p };
  return state;
}

export function renderScene11(
  state: Scene11State, C: ThemeColors, isDark: boolean, width: number, height: number,
  dragRef: string | null, onPointerDown: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void,
) {
  const { a, b } = state;
  const cx = width / 2;
  const cy = height * 0.55;
  const radius = Math.min(width, height) * 0.16;

  // 三分搜索沿圆求最优点
  const f = (angle: number) => {
    const p: Point = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
    return dist(a, p) + dist(p, b);
  };
  const bestAngle = ternarySearch(f, 0, 2 * Math.PI, 100);
  const p: Point = {
    x: cx + radius * Math.cos(bestAngle),
    y: cy + radius * Math.sin(bestAngle),
  };
  // 还找一下最大值（对面的点）
  const worstAngle = (bestAngle + Math.PI) % (2 * Math.PI);
  const pMax: Point = {
    x: cx + radius * Math.cos(worstAngle),
    y: cy + radius * Math.sin(worstAngle),
  };

  const pa = dist(a, p);
  const pb = dist(p, b);
  const total = pa + pb;

  return (
    <g>
      <text x={width / 2} y={PADDING - 4} fill={C.fg} fontSize={15} fontWeight={700} textAnchor="middle">
        圆上动点 — P 在圆上，PA + PB 最小值
      </text>

      {/* 圆 */}
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={C.line} strokeWidth={2} strokeDasharray="6,3" />
      {/* 圆心 O */}
      <circle cx={cx} cy={cy} r={2.5} fill={C.label} />
      <text x={cx + 8} y={cy + 4} fill={C.label} fontSize={11}>O</text>

      {/* A→P→B 路径 */}
      <line x1={a.x} y1={a.y} x2={p.x} y2={p.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={p.x} y1={p.y} x2={b.x} y2={b.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />

      {/* 最大值路径（对径点，灰色虚线） */}
      <line x1={a.x} y1={a.y} x2={pMax.x} y2={pMax.y} stroke={C.gray} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.4} />
      <line x1={pMax.x} y1={pMax.y} x2={b.x} y2={b.y} stroke={C.gray} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.4} />

      {/* P 点 */}
      <circle cx={p.x} cy={p.y} r={5} fill={C.accent} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
      <text x={p.x + 12} y={p.y - 8} fill={C.accent} fontSize={14} fontWeight={700}>P</text>

      <DraggableDot cx={a.x} cy={a.y} color={C.blue} label="A" labelOffset={{ x: -10, y: -18 }}
        dragId="a" isDragging={dragRef === 'a'} isDark={isDark} onPointerDown={onPointerDown} />
      <DraggableDot cx={b.x} cy={b.y} color={C.green} label="B" labelOffset={{ x: 10, y: -18 }}
        dragId="b" isDragging={dragRef === 'b'} isDark={isDark} onPointerDown={onPointerDown} />
    </g>
  );
}

/* ================================================================ */
/*  情景 12 — 折线路径                                               */
/*  先经过 l1 再折向 l2 再折向 l3，多次反射                          */
/*  三反射法：逐次反射 A                                             */
/* ================================================================ */
export interface Scene12State {
  a: Point;
  b: Point;
}

export function getDefaultScene12(width: number, height: number): Scene12State {
  return {
    a: { x: width * 0.15, y: height * 0.12 },
    b: { x: width * 0.85, y: height * 0.12 },
  };
}

export function updateScene12Point(
  state: Scene12State, id: string, pt: Point, width: number, height: number,
): Scene12State {
  const p = { x: clamp(pt.x, PADDING, width - PADDING), y: clamp(pt.y, PADDING, height - PADDING) };
  if (id === 'a') return { ...state, a: p };
  if (id === 'b') return { ...state, b: p };
  return state;
}

function reflectAcrossLine3(p: Point, l1: Point, l2: Point): Point {
  const dx = l2.x - l1.x, dy = l2.y - l1.y;
  const len2 = dx * dx + dy * dy;
  if (len2 < 0.0001) return p;
  const t = ((p.x - l1.x) * dx + (p.y - l1.y) * dy) / len2;
  return { x: 2 * (l1.x + t * dx) - p.x, y: 2 * (l1.y + t * dy) - p.y };
}

function llIntersect(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
  const d1x = p2.x - p1.x, d1y = p2.y - p1.y;
  const d2x = p4.x - p3.x, d2y = p4.y - p3.y;
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < 1e-10) return null;
  const t = ((p3.x - p1.x) * d2y - (p3.y - p1.y) * d2x) / denom;
  return { x: p1.x + t * d1x, y: p1.y + t * d1y };
}

function scene12Lines(width: number, height: number) {
  // l1: 水平 (上方), l2: 斜线 (中), l3: 水平 (下方)
  const l1: Point[] = [{ x: PADDING, y: height * 0.35 }, { x: width - PADDING, y: height * 0.35 }];
  const l2: Point[] = [{ x: PADDING, y: height * 0.55 }, { x: width - PADDING, y: height * 0.45 }];
  const l3: Point[] = [{ x: PADDING, y: height * 0.72 }, { x: width - PADDING, y: height * 0.72 }];
  return { l1, l2, l3 };
}

export function renderScene12(
  state: Scene12State, C: ThemeColors, isDark: boolean, width: number, height: number,
  dragRef: string | null, onPointerDown: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void,
) {
  const { l1, l2, l3 } = scene12Lines(width, height);
  const { a, b } = state;

  // 三重反射
  const a1 = reflectAcrossLine3(a, l1[0], l1[1]);   // A 关于 l1
  const a2 = reflectAcrossLine3(a1, l2[0], l2[1]);  // A' 关于 l2
  const a3 = reflectAcrossLine3(a2, l3[0], l3[1]);  // A'' 关于 l3
  // A'''B 交 l3 于 P3
  const p3 = llIntersect(a3, b, l3[0], l3[1]);
  // P3A'' 交 l2 于 P2
  const p2 = p3 ? llIntersect(p3, a2, l2[0], l2[1]) : null;
  // P2A' 交 l1 于 P1
  const p1 = p2 ? llIntersect(p2, a1, l1[0], l1[1]) : null;

  const segs = [
    { from: a, to: p1 },
    { from: p1, to: p2 },
    { from: p2, to: p3 },
    { from: p3, to: b },
  ];
  const total = segs.reduce((sum, s) => s.from && s.to ? sum + dist(s.from, s.to) : sum, 0);

  return (
    <g>
      <text x={width / 2} y={PADDING - 4} fill={C.fg} fontSize={15} fontWeight={700} textAnchor="middle">
        折线路径 — 三次反射最短路径
      </text>

      {/* 三条反射线 */}
      <line x1={l1[0].x} y1={l1[0].y} x2={l1[1].x} y2={l1[1].y} stroke={C.road} strokeWidth={2.5} />
      <text x={l1[1].x + 4} y={l1[1].y - 4} fill={C.label} fontSize={12}>l₁</text>
      <line x1={l2[0].x} y1={l2[0].y} x2={l2[1].x} y2={l2[1].y} stroke={C.road} strokeWidth={2.5} />
      <text x={l2[1].x + 4} y={l2[1].y - 4} fill={C.label} fontSize={12}>l₂</text>
      <line x1={l3[0].x} y1={l3[0].y} x2={l3[1].x} y2={l3[1].y} stroke={C.road} strokeWidth={2.5} />
      <text x={l3[1].x + 4} y={l3[1].y + 14} fill={C.label} fontSize={12}>l₃</text>

      {/* 反射点 */}
      <circle cx={a1.x} cy={a1.y} r={3} fill="none" stroke={C.blue} strokeWidth={1.5} strokeDasharray="3,2" />
      <text x={a1.x + 6} y={a1.y - 6} fill={C.blue} fontSize={10} fontStyle="italic">A'</text>
      <circle cx={a2.x} cy={a2.y} r={3} fill="none" stroke={C.blue} strokeWidth={1.5} strokeDasharray="3,2" />
      <text x={a2.x + 6} y={a2.y - 6} fill={C.blue} fontSize={10} fontStyle="italic">A''</text>
      <circle cx={a3.x} cy={a3.y} r={3} fill="none" stroke={C.blue} strokeWidth={1.5} strokeDasharray="3,2" />
      <text x={a3.x + 6} y={a3.y - 6} fill={C.blue} fontSize={10} fontStyle="italic">A'''</text>

      {/* 辅助线 */}
      {a3 && b && (
        <line x1={a3.x} y1={a3.y} x2={b.x} y2={b.y}
          stroke={C.gray} strokeWidth={1.5} strokeDasharray="4,4" opacity={0.3} />
      )}

      {/* 路径 */}
      {segs.map((s, i) =>
        s.from && s.to ? (
          <line key={i} x1={s.from.x} y1={s.from.y} x2={s.to.x} y2={s.to.y}
            stroke={i === 1 ? C.accentLight : C.accent}
            strokeWidth={2.5} strokeLinecap="round" />
        ) : null
      )}

      {/* P1, P2, P3 */}
      {p1 && (
        <>
          <circle cx={p1.x} cy={p1.y} r={4} fill={C.orange} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
          <text x={p1.x + 10} y={p1.y - 8} fill={C.orange} fontSize={12} fontWeight={700}>P₁</text>
        </>
      )}
      {p2 && (
        <>
          <circle cx={p2.x} cy={p2.y} r={4} fill={C.purple} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
          <text x={p2.x + 10} y={p2.y - 6} fill={C.purple} fontSize={12} fontWeight={700}>P₂</text>
        </>
      )}
      {p3 && (
        <>
          <circle cx={p3.x} cy={p3.y} r={4} fill={C.pink} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
          <text x={p3.x + 10} y={p3.y - 6} fill={C.pink} fontSize={12} fontWeight={700}>P₃</text>
        </>
      )}

      <DraggableDot cx={a.x} cy={a.y} color={C.blue} label="A" labelOffset={{ x: -10, y: -18 }}
        dragId="a" isDragging={dragRef === 'a'} isDark={isDark} onPointerDown={onPointerDown} />
      <DraggableDot cx={b.x} cy={b.y} color={C.green} label="B" labelOffset={{ x: 10, y: -18 }}
        dragId="b" isDragging={dragRef === 'b'} isDark={isDark} onPointerDown={onPointerDown} />
    </g>
  );
}

/* ================================================================ */
/*  情景 13 — 综合型                                                 */
/*  结合对称 + 平移 + 反射的综合问题                                 */
/*  A 在直线 l 一侧，B 需跨过河流（l1∥l2）到对岸                    */
/*  路径：A → 反射 l 于 P → 跨河（Q 在 l1, R 在 l2）→ B            */
/* ================================================================ */
export interface Scene13State {
  a: Point;
  b: Point;
}

export function getDefaultScene13(width: number, height: number): Scene13State {
  return {
    a: { x: width * 0.25, y: height * 0.12 },
    b: { x: width * 0.75, y: height * 0.88 },
  };
}

export function updateScene13Point(
  state: Scene13State, id: string, pt: Point, width: number, height: number,
): Scene13State {
  const p = { x: clamp(pt.x, PADDING, width - PADDING), y: clamp(pt.y, PADDING, height - PADDING) };
  if (id === 'a') return { ...state, a: p };
  if (id === 'b') return { ...state, b: p };
  return state;
}

export function renderScene13(
  state: Scene13State, C: ThemeColors, isDark: boolean, width: number, height: number,
  dragRef: string | null, onPointerDown: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void,
) {
  const { a, b } = state;
  const reflectLineY = height * 0.30;
  const riverTopY = height * 0.50;
  const riverBottomY = height * 0.70;
  const bw = riverBottomY - riverTopY;

  // 综合解法：
  // 1. 反射 A 关于反射线得 A'
  const aPrime = reflectY(a, reflectLineY);
  // 2. 平移 B 向上河宽得 B'
  const bPrime: Point = { x: b.x, y: b.y - bw };
  // 3. A'B' 与反射线交于 P，与上河岸交于 Q
  const p = lineIntersect(aPrime, bPrime, reflectLineY);
  const q = lineIntersect(aPrime, bPrime, riverTopY);
  const pp: Point = p ? { x: clamp(p.x, PADDING, width - PADDING), y: reflectLineY }
    : { x: width / 2, y: reflectLineY };
  const qq: Point = q ? { x: clamp(q.x, PADDING, width - PADDING), y: riverTopY }
    : { x: width / 2, y: riverTopY };
  const rr: Point = { x: qq.x, y: riverBottomY };

  const ap = dist(a, pp);
  const ppq = dist(pp, qq);
  const qr = bw;
  const rb = dist(rr, b);
  const total = ap + ppq + qr + rb;

  return (
    <g>
      <text x={width / 2} y={PADDING - 4} fill={C.fg} fontSize={15} fontWeight={700} textAnchor="middle">
        综合型 — 反射 + 平移 + 造桥
      </text>

      {/* 反射线 l */}
      <line x1={PADDING} y1={reflectLineY} x2={width - PADDING} y2={reflectLineY}
        stroke={C.road} strokeWidth={2.5} strokeDasharray="8,4" />
      <text x={width - PADDING + 4} y={reflectLineY - 4} fill={C.label} fontSize={12}>l</text>

      {/* 河面 */}
      <rect x={PADDING} y={riverTopY} width={width - 2 * PADDING} height={bw}
        fill={isDark ? '#1e3a5f' : '#e0f2fe'} opacity={0.4} rx={2} />
      <text x={width / 2} y={(riverTopY + riverBottomY) / 2 + 4}
        fill={C.label} fontSize={12} textAnchor="middle" opacity={0.7}>🏞️ 河流</text>
      <line x1={PADDING} y1={riverTopY} x2={width - PADDING} y2={riverTopY} stroke={C.line} strokeWidth={2} />
      <text x={width - PADDING + 4} y={riverTopY - 4} fill={C.label} fontSize={12}>l₁</text>
      <line x1={PADDING} y1={riverBottomY} x2={width - PADDING} y2={riverBottomY} stroke={C.line} strokeWidth={2} />
      <text x={width - PADDING + 4} y={riverBottomY + 14} fill={C.label} fontSize={12}>l₂</text>

      {/* A'B' 辅助线 */}
      <line x1={aPrime.x} y1={aPrime.y} x2={bPrime.x} y2={bPrime.y}
        stroke={C.gray} strokeWidth={1.5} strokeDasharray="4,4" opacity={0.4} />

      {/* A', B' */}
      <circle cx={aPrime.x} cy={aPrime.y} r={3} fill="none" stroke={C.blue} strokeWidth={1.5} strokeDasharray="3,2" />
      <text x={aPrime.x + 8} y={aPrime.y - 6} fill={C.blue} fontSize={11} fontStyle="italic">A'</text>
      <circle cx={bPrime.x} cy={bPrime.y} r={3} fill="none" stroke={C.green} strokeWidth={1.5} strokeDasharray="3,2" />
      <text x={bPrime.x + 8} y={bPrime.y - 6} fill={C.green} fontSize={11} fontStyle="italic">B'</text>

      {/* 路径 A→P→Q→R→B */}
      <line x1={a.x} y1={a.y} x2={pp.x} y2={pp.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={pp.x} y1={pp.y} x2={qq.x} y2={qq.y} stroke={C.accentLight} strokeWidth={2.5} strokeLinecap="round" />
      {/* 桥 */}
      <line x1={qq.x - 3} y1={qq.y} x2={rr.x - 3} y2={rr.y} stroke={C.orange} strokeWidth={3} strokeLinecap="round" />
      <line x1={qq.x + 3} y1={qq.y} x2={rr.x + 3} y2={rr.y} stroke={C.orange} strokeWidth={3} strokeLinecap="round" />
      <line x1={rr.x} y1={rr.y} x2={b.x} y2={b.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />

      {/* P, Q, R */}
      <circle cx={pp.x} cy={pp.y} r={4} fill={C.orange} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
      <text x={pp.x + 10} y={pp.y - 6} fill={C.orange} fontSize={12} fontWeight={700}>P</text>
      <circle cx={qq.x} cy={qq.y} r={4} fill={C.purple} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
      <text x={qq.x + 10} y={qq.y - 6} fill={C.purple} fontSize={12} fontWeight={700}>Q</text>
      <circle cx={rr.x} cy={rr.y} r={4} fill={C.pink} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
      <text x={rr.x + 10} y={rr.y + 14} fill={C.pink} fontSize={12} fontWeight={700}>R</text>

      <DraggableDot cx={a.x} cy={a.y} color={C.blue} label="A" labelOffset={{ x: -8, y: -18 }}
        dragId="a" isDragging={dragRef === 'a'} isDark={isDark} onPointerDown={onPointerDown} />
      <DraggableDot cx={b.x} cy={b.y} color={C.green} label="B" labelOffset={{ x: 8, y: -18 }}
        dragId="b" isDragging={dragRef === 'b'} isDark={isDark} onPointerDown={onPointerDown} />
    </g>
  );
}
