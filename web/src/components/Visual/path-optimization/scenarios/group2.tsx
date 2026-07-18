/* ------------------------------------------------------------------ */
/*   情景组 2：四边形周长最小 / 造桥选址 / 台球反射 / 线段差最大值      */
/* ------------------------------------------------------------------ */
import React from 'react';
import type { Point, ThemeColors } from '../types';
import { PADDING, clamp, dist, reflectY, lineIntersect, DraggableDot } from '../shared';

/* ================================================================ */
/*  情景 5 — 四边形周长最小                                           */
/*  A、B 固定，P、Q 在直线 l 上，PQ = d（固定距离）                   */
/*  最小化 AP + PQ + QB → 平移法：A 沿 l 方向平移 d 得 A'，再对称反射 */
/* ================================================================ */
export interface Scene5State {
  a: Point;
  b: Point;
  distance: number;
}

export function getDefaultScene5(width: number, height: number): Scene5State {
  return {
    a: { x: width * 0.2, y: height * 0.2 },
    b: { x: width * 0.8, y: height * 0.2 },
    distance: 50,
  };
}

export function updateScene5Point(
  state: Scene5State, id: string, pt: Point, width: number, height: number,
): Scene5State {
  const p = { x: clamp(pt.x, PADDING, width - PADDING), y: clamp(pt.y, PADDING, height - PADDING) };
  if (id === 'a') return { ...state, a: p };
  if (id === 'b') return { ...state, b: p };
  return state;
}

export function renderScene5(
  state: Scene5State, C: ThemeColors, isDark: boolean, width: number, height: number,
  dragRef: string | null, onPointerDown: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void,
) {
  const lineY = height * 0.55;
  const { a, b, distance: d } = state;

  // 将 A 沿 l 向右平移距离 d 得 A1
  const a1: Point = { x: a.x + d, y: a.y };
  // 反射 A1 关于 l
  const a1Prime = reflectY(a1, lineY);
  // A1'B 与 l 的交点即 Q
  const qInt = lineIntersect(a1Prime, b, lineY);
  const q: Point = qInt ? { x: clamp(qInt.x, PADDING, width - PADDING), y: lineY } : { x: (a1Prime.x + b.x) / 2, y: lineY };
  // P = Q 向左平移 d
  const p: Point = { x: clamp(q.x - d, PADDING, width - PADDING), y: lineY };

  const ap = dist(a, p);
  const pq = dist(p, q);
  const qb = dist(q, b);
  const total = ap + pq + qb;

  return (
    <g>
      <text x={width / 2} y={PADDING - 4} fill={C.fg} fontSize={15} fontWeight={700} textAnchor="middle">
        四边形周长最小 — AP + PQ + QB 最小值（PQ={d.toFixed(0)}）
      </text>

      <line x1={PADDING} y1={lineY} x2={width - PADDING} y2={lineY}
        stroke={C.road} strokeWidth={2.5} strokeDasharray="8,4" />
      <text x={width - PADDING + 4} y={lineY + 16} fill={C.label} fontSize={12}>l</text>

      {/* A1'B 辅助线 */}
      <line x1={a1Prime.x} y1={a1Prime.y} x2={b.x} y2={b.y}
        stroke={C.gray} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.4} />

      {/* A1 (平移后的 A) */}
      <circle cx={a1.x} cy={a1.y} r={3} fill="none" stroke={C.blue} strokeWidth={1.5} opacity={0.5} />
      <text x={a1.x + 6} y={a1.y - 4} fill={C.blue} fontSize={10} fontStyle="italic" opacity={0.6}>A₁</text>

      {/* A1' (反射点) */}
      <circle cx={a1Prime.x} cy={a1Prime.y} r={3} fill="none" stroke={C.gray} strokeWidth={1.5} strokeDasharray="3,2" />
      <text x={a1Prime.x + 6} y={a1Prime.y - 4} fill={C.gray} fontSize={10} fontStyle="italic">A₁'</text>

      {/* 路径 A→P→Q→B */}
      <line x1={a.x} y1={a.y} x2={p.x} y2={p.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={C.accentLight} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={q.x} y1={q.y} x2={b.x} y2={b.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />

      {/* PQ 距离标注 */}
      <text x={(p.x + q.x) / 2} y={lineY + 28} fill={C.orange} fontSize={11} textAnchor="middle" fontWeight={600}>
        PQ={d.toFixed(0)}
      </text>

      {/* P、Q */}
      <circle cx={p.x} cy={p.y} r={4} fill={C.orange} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
      <text x={p.x - 14} y={p.y - 8} fill={C.orange} fontSize={13} fontWeight={700}>P</text>
      <circle cx={q.x} cy={q.y} r={4} fill={C.purple} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
      <text x={q.x + 10} y={q.y - 8} fill={C.purple} fontSize={13} fontWeight={700}>Q</text>

      <DraggableDot cx={a.x} cy={a.y} color={C.blue} label="A" labelOffset={{ x: -10, y: -18 }}
        dragId="a" isDragging={dragRef === 'a'} isDark={isDark} onPointerDown={onPointerDown} />
      <DraggableDot cx={b.x} cy={b.y} color={C.green} label="B" labelOffset={{ x: 10, y: -18 }}
        dragId="b" isDragging={dragRef === 'b'} isDark={isDark} onPointerDown={onPointerDown} />
    </g>
  );
}

/* ================================================================ */
/*  情景 6 — 造桥选址                                                */
/*  河两岸 l1 ∥ l2，P 在 l1，Q 在 l2，PQ ⟂ l1                      */
/*  AP + PQ + QB 最小（将军饮马 + 平移）                             */
/* ================================================================ */
export interface Scene6State {
  a: Point;
  b: Point;
}

export function getDefaultScene6(width: number, height: number): Scene6State {
  return {
    a: { x: width * 0.3, y: height * 0.18 },
    b: { x: width * 0.7, y: height * 0.88 },
  };
}

export function updateScene6Point(
  state: Scene6State, id: string, pt: Point, width: number, height: number,
): Scene6State {
  const p = { x: clamp(pt.x, PADDING, width - PADDING), y: clamp(pt.y, PADDING, height - PADDING) };
  if (id === 'a') return { ...state, a: p };
  if (id === 'b') return { ...state, b: p };
  return state;
}

export function renderScene6(
  state: Scene6State, C: ThemeColors, isDark: boolean, width: number, height: number,
  dragRef: string | null, onPointerDown: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void,
) {
  const riverTopY = height * 0.36;
  const riverBottomY = height * 0.64;
  const riverMidY = (riverTopY + riverBottomY) / 2;
  const bw = riverBottomY - riverTopY; // 河宽
  const { a, b } = state;

  // 将 B 向上平移河宽得 B'，用基础型方法
  const bPrime: Point = { x: b.x, y: b.y - bw };
  const pInt = lineIntersect(a, bPrime, riverTopY);
  const p: Point = pInt ? { x: clamp(pInt.x, PADDING, width - PADDING), y: riverTopY }
    : { x: (a.x + bPrime.x) / 2, y: riverTopY };
  const q: Point = { x: p.x, y: riverBottomY };

  const ap = dist(a, p);
  const pq = bw;
  const qb = dist(q, b);
  const total = ap + pq + qb;

  return (
    <g>
      <text x={width / 2} y={PADDING - 4} fill={C.fg} fontSize={15} fontWeight={700} textAnchor="middle">
        造桥选址 — AP + PQ + QB 最小值
      </text>

      {/* 河面 */}
      <rect x={PADDING} y={riverTopY} width={width - 2 * PADDING} height={bw}
        fill={isDark ? '#1e3a5f' : '#e0f2fe'} opacity={0.4} rx={2} />
      <text x={width / 2} y={riverMidY + 4} fill={C.label} fontSize={12} textAnchor="middle" opacity={0.7}>
        🏞️ 河流
      </text>

      <line x1={PADDING} y1={riverTopY} x2={width - PADDING} y2={riverTopY} stroke={C.line} strokeWidth={2.5} />
      <text x={width - PADDING + 4} y={riverTopY - 4} fill={C.label} fontSize={12}>l₁</text>
      <line x1={PADDING} y1={riverBottomY} x2={width - PADDING} y2={riverBottomY} stroke={C.line} strokeWidth={2.5} />
      <text x={width - PADDING + 4} y={riverBottomY + 14} fill={C.label} fontSize={12}>l₂</text>

      {/* A→B' 辅助线 */}
      <line x1={a.x} y1={a.y} x2={bPrime.x} y2={bPrime.y}
        stroke={C.gray} strokeWidth={1.5} strokeDasharray="4,4" opacity={0.4} />

      {/* B' */}
      <circle cx={bPrime.x} cy={bPrime.y} r={3} fill="none" stroke={C.green} strokeWidth={1.5} strokeDasharray="3,2" />
      <text x={bPrime.x + 8} y={bPrime.y - 4} fill={C.green} fontSize={11} fontStyle="italic">B'</text>

      {/* A→P→Q→B */}
      <line x1={a.x} y1={a.y} x2={p.x} y2={p.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />
      {/* 桥面 */}
      <line x1={p.x - 3} y1={p.y} x2={q.x - 3} y2={q.y} stroke={C.orange} strokeWidth={3} strokeLinecap="round" />
      <line x1={p.x + 3} y1={p.y} x2={q.x + 3} y2={q.y} stroke={C.orange} strokeWidth={3} strokeLinecap="round" />
      <line x1={q.x} y1={q.y} x2={b.x} y2={b.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />

      <text x={p.x + 16} y={riverMidY + 4} fill={C.orange} fontSize={12} fontWeight={600}>桥</text>

      <circle cx={p.x} cy={p.y} r={4} fill={C.orange} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
      <text x={p.x + 8} y={p.y - 8} fill={C.orange} fontSize={13} fontWeight={700}>P</text>
      <circle cx={q.x} cy={q.y} r={4} fill={C.orange} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
      <text x={q.x + 8} y={q.y + 14} fill={C.orange} fontSize={13} fontWeight={700}>Q</text>

      <DraggableDot cx={a.x} cy={a.y} color={C.blue} label="A" labelOffset={{ x: -8, y: -18 }}
        dragId="a" isDragging={dragRef === 'a'} isDark={isDark} onPointerDown={onPointerDown} />
      <DraggableDot cx={b.x} cy={b.y} color={C.green} label="B" labelOffset={{ x: 8, y: -18 }}
        dragId="b" isDragging={dragRef === 'b'} isDark={isDark} onPointerDown={onPointerDown} />
    </g>
  );
}

/* ================================================================ */
/*  情景 7 — 台球反射                                                */
/*  光线从 A 射出，经过 l1、l2 两次反射到达 B                        */
/*  双反射法：A' 关于 l1 对称，A'' 关于 l2 对称，A''B 交 l2 于 Q，   */
/*  QA' 交 l1 于 P                                                   */
/* ================================================================ */
export interface Scene7State {
  a: Point;
  b: Point;
}

export function getDefaultScene7(width: number, height: number): Scene7State {
  return {
    a: { x: width * 0.2, y: height * 0.15 },
    b: { x: width * 0.8, y: height * 0.15 },
  };
}

export function updateScene7Point(
  state: Scene7State, id: string, pt: Point, width: number, height: number,
): Scene7State {
  const p = { x: clamp(pt.x, PADDING, width - PADDING), y: clamp(pt.y, PADDING, height - PADDING) };
  if (id === 'a') return { ...state, a: p };
  if (id === 'b') return { ...state, b: p };
  return state;
}

/** 计算点关于任意直线的对称点 */
function reflectAcrossLine2(p: Point, l1: Point, l2: Point): Point {
  const dx = l2.x - l1.x, dy = l2.y - l1.y;
  const len2 = dx * dx + dy * dy;
  if (len2 < 0.0001) return p;
  const t = ((p.x - l1.x) * dx + (p.y - l1.y) * dy) / len2;
  return { x: 2 * (l1.x + t * dx) - p.x, y: 2 * (l1.y + t * dy) - p.y };
}

/** 线段所在直线与另一线段的交点 */
function lineLineIntersect(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
  const d1x = p2.x - p1.x, d1y = p2.y - p1.y;
  const d2x = p4.x - p3.x, d2y = p4.y - p3.y;
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < 1e-10) return null;
  const t = ((p3.x - p1.x) * d2y - (p3.y - p1.y) * d2x) / denom;
  return { x: p1.x + t * d1x, y: p1.y + t * d1y };
}

function scene7Lines(width: number, height: number) {
  // l1: 水平线（上方），l2: 斜线（下方）
  const l1: Point[] = [{ x: PADDING, y: height * 0.45 }, { x: width - PADDING, y: height * 0.45 }];
  const l2: Point[] = [{ x: PADDING, y: height * 0.70 }, { x: width - PADDING, y: height * 0.50 }];
  return { l1_p1: l1[0], l1_p2: l1[1], l2_p1: l2[0], l2_p2: l2[1] };
}

export function renderScene7(
  state: Scene7State, C: ThemeColors, isDark: boolean, width: number, height: number,
  dragRef: string | null, onPointerDown: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void,
) {
  const { l1_p1, l1_p2, l2_p1, l2_p2 } = scene7Lines(width, height);
  const { a, b } = state;

  // 双反射：A' 关于 l1，A'' 关于 l2
  const aPrime = reflectAcrossLine2(a, l1_p1, l1_p2);
  const aDouble = reflectAcrossLine2(aPrime, l2_p1, l2_p2);

  // A''B 交 l2 于 Q
  const q = lineLineIntersect(aDouble, b, l2_p1, l2_p2);
  // QA' 交 l1 于 P
  const p = q ? lineLineIntersect(q, aPrime, l1_p1, l1_p2) : null;

  const ap = p ? dist(a, p) : 0;
  const pq = p && q ? dist(p, q) : 0;
  const qb = q ? dist(q, b) : 0;
  const total = ap + pq + qb;

  return (
    <g>
      <text x={width / 2} y={PADDING - 4} fill={C.fg} fontSize={15} fontWeight={700} textAnchor="middle">
        台球反射 — 两次反射最短路径
      </text>

      {/* 反射墙壁 */}
      <line x1={l1_p1.x} y1={l1_p1.y} x2={l1_p2.x} y2={l1_p2.y} stroke={C.road} strokeWidth={3} />
      <text x={l1_p2.x + 4} y={l1_p2.y - 4} fill={C.label} fontSize={12}>壁①</text>
      <line x1={l2_p1.x} y1={l2_p1.y} x2={l2_p2.x} y2={l2_p2.y} stroke={C.road} strokeWidth={3} />
      <text x={l2_p2.x + 4} y={l2_p2.y + 14} fill={C.label} fontSize={12}>壁②</text>

      {/* A, A', A'' */}
      <circle cx={aPrime.x} cy={aPrime.y} r={3} fill="none" stroke={C.blue} strokeWidth={1.5} strokeDasharray="3,2" />
      <text x={aPrime.x + 8} y={aPrime.y - 6} fill={C.blue} fontSize={11} fontStyle="italic">A'</text>
      <circle cx={aDouble.x} cy={aDouble.y} r={3} fill="none" stroke={C.blue} strokeWidth={1.5} strokeDasharray="3,2" />
      <text x={aDouble.x + 8} y={aDouble.y - 6} fill={C.blue} fontSize={11} fontStyle="italic">A''</text>

      {/* A''B 辅助线 */}
      <line x1={aDouble.x} y1={aDouble.y} x2={b.x} y2={b.y}
        stroke={C.gray} strokeWidth={1.5} strokeDasharray="4,4" opacity={0.4} />

      {/* 路径 A→P→Q→B */}
      {p && <line x1={a.x} y1={a.y} x2={p.x} y2={p.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />}
      {p && q && <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={C.accentLight} strokeWidth={2.5} strokeLinecap="round" />}
      {q && <line x1={q.x} y1={q.y} x2={b.x} y2={b.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />}

      {/* 反射角标注 */}
      {p && (
        <text x={p.x + 12} y={p.y - 10} fill={C.accent} fontSize={10} fontStyle="italic">θ₁</text>
      )}
      {q && (
        <text x={q.x + 12} y={q.y - 10} fill={C.accentLight} fontSize={10} fontStyle="italic">θ₂</text>
      )}

      {p && (
        <>
          <circle cx={p.x} cy={p.y} r={4} fill={C.orange} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
          <text x={p.x + 10} y={p.y - 6} fill={C.orange} fontSize={13} fontWeight={700}>P</text>
        </>
      )}
      {q && (
        <>
          <circle cx={q.x} cy={q.y} r={4} fill={C.purple} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
          <text x={q.x + 10} y={q.y - 6} fill={C.purple} fontSize={13} fontWeight={700}>Q</text>
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
/*  情景 8 — 线段差最大值                                            */
/*  |PA - PB| 最大值，P 在直线 l 上                                  */
/*  当 A、B、P 共线时取最大值 AB                                     */
/* ================================================================ */
export interface Scene8State {
  a: Point;
  b: Point;
}

export function getDefaultScene8(width: number, height: number): Scene8State {
  const lineY = height * 0.55;
  return {
    a: { x: width * 0.25, y: lineY - 70 },
    b: { x: width * 0.75, y: lineY - 30 },
  };
}

export function updateScene8Point(
  state: Scene8State, id: string, pt: Point, width: number, height: number,
): Scene8State {
  const p = { x: clamp(pt.x, PADDING, width - PADDING), y: clamp(pt.y, PADDING, height - PADDING) };
  if (id === 'a') return { ...state, a: p };
  if (id === 'b') return { ...state, b: p };
  return state;
}

export function renderScene8(
  state: Scene8State, C: ThemeColors, isDark: boolean, width: number, height: number,
  dragRef: string | null, onPointerDown: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void,
) {
  const lineY = height * 0.55;
  const { a, b } = state;

  // P 为直线 AB 与 l 的交点（使 A、B、P 共线）
  const pInt = lineIntersect(a, b, lineY);
  const p: Point = pInt ? { x: clamp(pInt.x, PADDING, width - PADDING), y: lineY }
    : { x: (a.x + b.x) / 2, y: lineY };

  const pa = dist(a, p);
  const pb = dist(p, b);
  const diff = Math.abs(pa - pb);
  const ab = dist(a, b);

  return (
    <g>
      <text x={width / 2} y={PADDING - 4} fill={C.fg} fontSize={15} fontWeight={700} textAnchor="middle">
        线段差最大值 — |PA − PB| 最大值
      </text>

      <line x1={PADDING} y1={lineY} x2={width - PADDING} y2={lineY}
        stroke={C.road} strokeWidth={2.5} strokeDasharray="8,4" />
      <text x={width - PADDING + 4} y={lineY + 16} fill={C.label} fontSize={12}>l</text>

      {/* AB 延长线 */}
      <line x1={a.x} y1={a.y} x2={p.x} y2={p.y} stroke={C.purple} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
      <line x1={p.x} y1={p.y} x2={b.x} y2={b.y} stroke={C.purple} strokeWidth={2} strokeLinecap="round" opacity={0.7} />

      {/* PA、PB 标注 */}
      <text x={(a.x + p.x) / 2} y={(a.y + p.y) / 2 - 8} fill={C.blue} fontSize={11} textAnchor="middle">PA</text>
      <text x={(p.x + b.x) / 2} y={(p.y + b.y) / 2 - 8} fill={C.green} fontSize={11} textAnchor="middle">PB</text>

      {/* P 点 */}
      <circle cx={p.x} cy={p.y} r={5} fill={C.accent} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
      <text x={p.x + 12} y={p.y - 8} fill={C.accent} fontSize={14} fontWeight={700}>P</text>

      <DraggableDot cx={a.x} cy={a.y} color={C.blue} label="A" labelOffset={{ x: -8, y: -18 }}
        dragId="a" isDragging={dragRef === 'a'} isDark={isDark} onPointerDown={onPointerDown} />
      <DraggableDot cx={b.x} cy={b.y} color={C.green} label="B" labelOffset={{ x: 8, y: -18 }}
        dragId="b" isDragging={dragRef === 'b'} isDark={isDark} onPointerDown={onPointerDown} />
    </g>
  );
}
