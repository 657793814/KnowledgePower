/* ------------------------------------------------------------------ */
/*   情景组 1：基础型 / 两动点型 / 一定两动 / 三角形周长最小              */
/* ------------------------------------------------------------------ */
import React from 'react';
import type { Point, ThemeColors } from '../types';
import { PADDING, clamp, dist, reflectY, lineIntersect, DraggableDot, RightAngleMark } from '../shared';

/* ================================================================ */
/*  情景 1 — 基础型（两定点一线对称最短路径）                          */
/* ================================================================ */
export interface Scene1State {
  a: Point;
  b: Point;
}

export function getDefaultScene1(width: number, height: number): Scene1State {
  const lineY = height * 0.55;
  return {
    a: { x: width * 0.28, y: lineY - 75 },
    b: { x: width * 0.72, y: lineY - 55 },
  };
}

export function updateScene1Point(
  state: Scene1State, id: string, pt: Point, width: number, height: number,
): Scene1State {
  const p = { x: clamp(pt.x, PADDING, width - PADDING), y: clamp(pt.y, PADDING, height - PADDING) };
  if (id === 'a') return { ...state, a: p };
  if (id === 'b') return { ...state, b: p };
  return state;
}

export function renderScene1(
  state: Scene1State, C: ThemeColors, isDark: boolean, width: number, height: number,
  dragRef: string | null, onPointerDown: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void,
) {
  const lineY = height * 0.55;
  const { a, b } = state;
  const sameSide = (a.y - lineY) * (b.y - lineY) > 0;
  const bPrime = reflectY(b, lineY);

  // 交点 P
  let p: Point;
  if (sameSide) {
    const int = lineIntersect(a, bPrime, lineY);
    p = int || { x: (a.x + bPrime.x) / 2, y: lineY };
  } else {
    const int = lineIntersect(a, b, lineY);
    p = int || { x: (a.x + b.x) / 2, y: lineY };
  }
  p = { x: clamp(p.x, PADDING, width - PADDING), y: lineY };

  const ap = dist(a, p);
  const pb = dist(p, b);
  const total = ap + pb;
  const ab = dist(a, b);

  return (
    <g>
      <text x={width / 2} y={PADDING - 4} fill={C.fg} fontSize={15} fontWeight={700} textAnchor="middle">
        基础型 — PA + PB 最小值
      </text>

      {/* 直线 l */}
      <line x1={PADDING} y1={lineY} x2={width - PADDING} y2={lineY}
        stroke={C.road} strokeWidth={2.5} strokeDasharray="8,4" />
      <text x={width - PADDING + 4} y={lineY + 16} fill={C.label} fontSize={12}>l</text>

      {/* 对称辅助线 A→B' */}
      {sameSide && (
        <line x1={a.x} y1={a.y} x2={bPrime.x} y2={bPrime.y}
          stroke={C.gray} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.5} />
      )}

      {/* 最短路径 A→P→B */}
      <line x1={a.x} y1={a.y} x2={p.x} y2={p.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={p.x} y1={p.y} x2={b.x} y2={b.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />

      {/* B' 标注 */}
      {sameSide && (
        <>
          <line x1={b.x} y1={b.y} x2={bPrime.x} y2={bPrime.y} stroke={C.dim} strokeWidth={1} strokeDasharray="3,3" />
          <circle cx={bPrime.x} cy={bPrime.y} r={5} fill="none" stroke={C.gray} strokeWidth={1.5} strokeDasharray="3,2" />
          <text x={bPrime.x + 10} y={bPrime.y + 4} fill={C.gray} fontSize={12} fontStyle="italic">B'</text>
          <RightAngleMark x={b.x} y={lineY} dir={b.y > lineY ? 'br' : 'tr'} color={C.dim} />
        </>
      )}

      {/* P 点 */}
      <circle cx={p.x} cy={p.y} r={4} fill={C.accent} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
      <text x={p.x + 10} y={p.y - 6} fill={C.accent} fontSize={13} fontWeight={700}>P</text>

      <DraggableDot cx={a.x} cy={a.y} color={C.blue} label="A" labelOffset={{ x: -8, y: -18 }}
        dragId="a" isDragging={dragRef === 'a'} isDark={isDark} onPointerDown={onPointerDown} />
      <DraggableDot cx={b.x} cy={b.y} color={C.green} label="B" labelOffset={{ x: 8, y: -18 }}
        dragId="b" isDragging={dragRef === 'b'} isDark={isDark} onPointerDown={onPointerDown} />
    </g>
  );
}

export function infoScene1(state: Scene1State, C: ThemeColors) {
  const lineY = 200; // not used for calc
  const { a, b } = state;
  const bPrime = reflectY(b, 200);
  const p = lineIntersect(a, bPrime, 200) || { x: (a.x + bPrime.x) / 2, y: 200 };
  const ap = dist(a, p), pb = dist(p, b);
  return {
    values: [
      { label: 'AP', value: ap.toFixed(2), color: C.accent },
      { label: 'PB', value: pb.toFixed(2), color: C.accent },
      { label: '最短总长', value: (ap + pb).toFixed(2), color: C.red },
    ],
    hint: '拖动 A、B 改变位置 · P 为反射点',
  };
}

/* ================================================================ */
/*  情景 2 — 两动点型                                                */
/*  两条相交直线 l1, l2，P 在 l1 上，Q 在 l2 上                     */
/*  求 AP + PQ + QB 最小值（反射法：A' 为 A 关于 l1 的对称点，       */
/*  B' 为 B 关于 l2 的对称点，A'B' 与 l1、l2 交点即 P、Q）          */
/* ================================================================ */
export interface Scene2State {
  a: Point;
  b: Point;
}

export function getDefaultScene2(width: number, height: number): Scene2State {
  return {
    a: { x: width * 0.18, y: height * 0.18 },
    b: { x: width * 0.82, y: height * 0.20 },
  };
}

export function updateScene2Point(
  state: Scene2State, id: string, pt: Point, width: number, height: number,
): Scene2State {
  const p = { x: clamp(pt.x, PADDING, width - PADDING), y: clamp(pt.y, PADDING, height - PADDING) };
  if (id === 'a') return { ...state, a: p };
  if (id === 'b') return { ...state, b: p };
  return state;
}

/** 两条线的交点 O */
function scene2Lines(width: number, height: number) {
  // l1：经过点 (PADDING, height*0.45) 和 (width-PADDING, height*0.65) 的斜线
  const l1_p1: Point = { x: PADDING, y: height * 0.45 };
  const l1_p2: Point = { x: width - PADDING, y: height * 0.65 };
  // l2：经过点 (PADDING, height*0.75) 和 (width-PADDING, height*0.35) 的斜线（相交）
  const l2_p1: Point = { x: PADDING, y: height * 0.75 };
  const l2_p2: Point = { x: width - PADDING, y: height * 0.35 };
  return { l1_p1, l1_p2, l2_p1, l2_p2 };
}

/** 点关于任意直线的对称点（直线由两点定义） */
function reflectAcrossLine(p: Point, l1: Point, l2: Point): Point {
  const dx = l2.x - l1.x;
  const dy = l2.y - l1.y;
  const len2 = dx * dx + dy * dy;
  if (len2 < 0.0001) return p;
  // 投影参数 t
  const t = ((p.x - l1.x) * dx + (p.y - l1.y) * dy) / len2;
  const proj: Point = { x: l1.x + t * dx, y: l1.y + t * dy };
  return { x: 2 * proj.x - p.x, y: 2 * proj.y - p.y };
}

export function renderScene2(
  state: Scene2State, C: ThemeColors, isDark: boolean, width: number, height: number,
  dragRef: string | null, onPointerDown: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void,
) {
  const { l1_p1, l1_p2, l2_p1, l2_p2 } = scene2Lines(width, height);
  const { a, b } = state;

  const aPrime = reflectAcrossLine(a, l1_p1, l1_p2);
  const bPrime = reflectAcrossLine(b, l2_p1, l2_p2);

  // A'B' 与 l1、l2 的交点
  const p = intersectSegLine(aPrime, bPrime, l1_p1, l1_p2);
  const q = intersectSegLine(aPrime, bPrime, l2_p1, l2_p2);

  const ap = p ? dist(a, p) : 0;
  const pq = p && q ? dist(p, q) : 0;
  const qb = q ? dist(q, b) : 0;
  const total = ap + pq + qb;

  return (
    <g>
      <text x={width / 2} y={PADDING - 4} fill={C.fg} fontSize={15} fontWeight={700} textAnchor="middle">
        两动点型 — AP + PQ + QB 最小值
      </text>

      {/* 两条直线 */}
      <line x1={l1_p1.x} y1={l1_p1.y} x2={l1_p2.x} y2={l1_p2.y} stroke={C.road} strokeWidth={2.5} />
      <text x={l1_p2.x + 4} y={l1_p2.y - 4} fill={C.label} fontSize={12}>l₁</text>
      <line x1={l2_p1.x} y1={l2_p1.y} x2={l2_p2.x} y2={l2_p2.y} stroke={C.road} strokeWidth={2.5} />
      <text x={l2_p2.x + 4} y={l2_p2.y + 14} fill={C.label} fontSize={12}>l₂</text>

      {/* A'B' 辅助线 */}
      <line x1={aPrime.x} y1={aPrime.y} x2={bPrime.x} y2={bPrime.y}
        stroke={C.gray} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.5} />

      {/* 对称点 A', B' */}
      <circle cx={aPrime.x} cy={aPrime.y} r={4} fill="none" stroke={C.blue} strokeWidth={1.5} strokeDasharray="3,2" />
      <text x={aPrime.x + 8} y={aPrime.y - 4} fill={C.blue} fontSize={11} fontStyle="italic">A'</text>
      <circle cx={bPrime.x} cy={bPrime.y} r={4} fill="none" stroke={C.green} strokeWidth={1.5} strokeDasharray="3,2" />
      <text x={bPrime.x + 8} y={bPrime.y - 4} fill={C.green} fontSize={11} fontStyle="italic">B'</text>

      {/* 最短路径 A→P→Q→B */}
      {p && (
        <line x1={a.x} y1={a.y} x2={p.x} y2={p.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />
      )}
      {p && q && (
        <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={C.accentLight} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="6,3" />
      )}
      {q && (
        <line x1={q.x} y1={q.y} x2={b.x} y2={b.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />
      )}

      {/* P、Q 点 */}
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

/** 线段 (seg_p1, seg_p2) 与无限直线的交点（交点限制在线段范围内） */
function intersectSegLine(sp1: Point, sp2: Point, lp1: Point, lp2: Point): Point | null {
  const d1x = sp2.x - sp1.x, d1y = sp2.y - sp1.y;
  const d2x = lp2.x - lp1.x, d2y = lp2.y - lp1.y;
  const denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < 1e-10) return null;
  const t = ((lp1.x - sp1.x) * d2y - (lp1.y - sp1.y) * d2x) / denom;
  const x = sp1.x + t * d1x;
  const y = sp1.y + t * d1y;
  return { x: clamp(x, PADDING, 1000), y: clamp(y, PADDING, 1000) };
}

/* ================================================================ */
/*  情景 3 — 一定两动                                                */
/*  一个定点 A，P 在 l1，Q 在 l2，求 AP + PQ + QA 最小值            */
/*  反射法：A' 为 A 关于 l1 的对称，A'' 为 A 关于 l2 的对称          */
/* ================================================================ */
export interface Scene3State {
  a: Point;
}

export function getDefaultScene3(width: number, height: number): Scene3State {
  return { a: { x: width * 0.5, y: height * 0.28 } };
}

export function updateScene3Point(
  state: Scene3State, id: string, pt: Point, width: number, height: number,
): Scene3State {
  if (id === 'a') {
    return { a: { x: clamp(pt.x, PADDING, width - PADDING), y: clamp(pt.y, PADDING, height - PADDING) } };
  }
  return state;
}

function scene3Lines(width: number, height: number) {
  // l1: 左上到右下
  const l1_p1: Point = { x: PADDING, y: height * 0.55 };
  const l1_p2: Point = { x: width - PADDING, y: height * 0.75 };
  // l2: 右上到左下
  const l2_p1: Point = { x: PADDING, y: height * 0.75 };
  const l2_p2: Point = { x: width - PADDING, y: height * 0.55 };
  return { l1_p1, l1_p2, l2_p1, l2_p2 };
}

export function renderScene3(
  state: Scene3State, C: ThemeColors, isDark: boolean, width: number, height: number,
  dragRef: string | null, onPointerDown: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void,
) {
  const { l1_p1, l1_p2, l2_p1, l2_p2 } = scene3Lines(width, height);
  const { a } = state;

  const aPrime = reflectAcrossLine(a, l1_p1, l1_p2);  // A' on l1
  const aDouble = reflectAcrossLine(a, l2_p1, l2_p2); // A'' on l2

  const p = intersectSegLine(aPrime, aDouble, l1_p1, l1_p2);
  const q = intersectSegLine(aPrime, aDouble, l2_p1, l2_p2);

  const ap = p ? dist(a, p) : 0;
  const pq = p && q ? dist(p, q) : 0;
  const qa = q ? dist(q, a) : 0;
  const total = ap + pq + qa;

  return (
    <g>
      <text x={width / 2} y={PADDING - 4} fill={C.fg} fontSize={15} fontWeight={700} textAnchor="middle">
        一定两动 — AP + PQ + QA 最小值
      </text>

      <line x1={l1_p1.x} y1={l1_p1.y} x2={l1_p2.x} y2={l1_p2.y} stroke={C.road} strokeWidth={2.5} />
      <text x={l1_p2.x + 4} y={l1_p2.y - 4} fill={C.label} fontSize={12}>l₁</text>
      <line x1={l2_p1.x} y1={l2_p1.y} x2={l2_p2.x} y2={l2_p2.y} stroke={C.road} strokeWidth={2.5} />
      <text x={l2_p2.x + 4} y={l2_p2.y + 14} fill={C.label} fontSize={12}>l₂</text>

      {/* A'A'' 辅助线 */}
      <line x1={aPrime.x} y1={aPrime.y} x2={aDouble.x} y2={aDouble.y}
        stroke={C.gray} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.5} />

      {/* A', A'' */}
      <circle cx={aPrime.x} cy={aPrime.y} r={4} fill="none" stroke={C.blue} strokeWidth={1.5} strokeDasharray="3,2" />
      <text x={aPrime.x + 8} y={aPrime.y - 4} fill={C.blue} fontSize={11} fontStyle="italic">A'</text>
      <circle cx={aDouble.x} cy={aDouble.y} r={4} fill="none" stroke={C.blue} strokeWidth={1.5} strokeDasharray="3,2" />
      <text x={aDouble.x + 8} y={aDouble.y - 4} fill={C.blue} fontSize={11} fontStyle="italic">A''</text>

      {/* 路径 A→P→Q→A */}
      {p && <line x1={a.x} y1={a.y} x2={p.x} y2={p.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />}
      {p && q && <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={C.accentLight} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="6,3" />}
      {q && <line x1={q.x} y1={q.y} x2={a.x} y2={a.y} stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" />}

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

      <DraggableDot cx={a.x} cy={a.y} color={C.blue} label="A" labelOffset={{ x: 0, y: -18 }}
        dragId="a" isDragging={dragRef === 'a'} isDark={isDark} onPointerDown={onPointerDown} />
    </g>
  );
}

/* ================================================================ */
/*  情景 4 — 三角形周长最小                                           */
/*  A、B 在直线 l 同侧，P 在 l 上，最小化 △PAB 周长                  */
/*  AB 固定，等价于最小化 PA + PB，同基础型                          */
/* ================================================================ */
export interface Scene4State {
  a: Point;
  b: Point;
}

export function getDefaultScene4(width: number, height: number): Scene4State {
  const lineY = height * 0.55;
  return {
    a: { x: width * 0.25, y: lineY - 80 },
    b: { x: width * 0.75, y: lineY - 60 },
  };
}

export function updateScene4Point(
  state: Scene4State, id: string, pt: Point, width: number, height: number,
): Scene4State {
  const p = { x: clamp(pt.x, PADDING, width - PADDING), y: clamp(pt.y, PADDING, height - PADDING) };
  if (id === 'a') return { ...state, a: p };
  if (id === 'b') return { ...state, b: p };
  return state;
}

export function renderScene4(
  state: Scene4State, C: ThemeColors, isDark: boolean, width: number, height: number,
  dragRef: string | null, onPointerDown: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void,
) {
  const lineY = height * 0.55;
  const { a, b } = state;

  const bPrime = reflectY(b, lineY);
  const int = lineIntersect(a, bPrime, lineY);
  const p: Point = int ? { x: clamp(int.x, PADDING, width - PADDING), y: lineY } : { x: (a.x + bPrime.x) / 2, y: lineY };
  const pp = p;

  const ap = dist(a, pp);
  const pb = dist(pp, b);
  const ab = dist(a, b);
  const perimeter = ap + pb + ab;

  return (
    <g>
      <text x={width / 2} y={PADDING - 4} fill={C.fg} fontSize={15} fontWeight={700} textAnchor="middle">
        三角形周长最小 — △PAB 周长最小值
      </text>

      {/* 直线 l */}
      <line x1={PADDING} y1={lineY} x2={width - PADDING} y2={lineY}
        stroke={C.road} strokeWidth={2.5} strokeDasharray="8,4" />
      <text x={width - PADDING + 4} y={lineY + 16} fill={C.label} fontSize={12}>l</text>

      {/* B' */}
      <line x1={b.x} y1={b.y} x2={bPrime.x} y2={bPrime.y} stroke={C.dim} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
      <circle cx={bPrime.x} cy={bPrime.y} r={4} fill="none" stroke={C.gray} strokeWidth={1.5} strokeDasharray="3,2" />
      <text x={bPrime.x + 10} y={bPrime.y + 4} fill={C.gray} fontSize={11} fontStyle="italic">B'</text>

      {/* 三角形 PAB */}
      <polygon points={`${a.x},${a.y} ${pp.x},${pp.y} ${b.x},${b.y}`}
        fill={C.accent} fillOpacity={0.08} stroke={C.accent} strokeWidth={2.5} strokeLinejoin="round" />

      {/* 对称辅助线 */}
      <line x1={a.x} y1={a.y} x2={bPrime.x} y2={bPrime.y}
        stroke={C.gray} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.4} />

      {/* P 点 */}
      <circle cx={pp.x} cy={pp.y} r={4} fill={C.accent} stroke={isDark ? '#1e1e2e' : '#fff'} strokeWidth={2} />
      <text x={pp.x + 10} y={pp.y - 6} fill={C.accent} fontSize={13} fontWeight={700}>P</text>

      {/* 边长标注 */}
      <text x={(a.x + pp.x) / 2} y={(a.y + pp.y) / 2 - 6} fill={C.accent} fontSize={11} textAnchor="middle">PA</text>
      <text x={(pp.x + b.x) / 2} y={(pp.y + b.y) / 2 - 6} fill={C.accent} fontSize={11} textAnchor="middle">PB</text>
      <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 8} fill={C.label} fontSize={11} textAnchor="middle">AB</text>

      <DraggableDot cx={a.x} cy={a.y} color={C.blue} label="A" labelOffset={{ x: -8, y: -18 }}
        dragId="a" isDragging={dragRef === 'a'} isDark={isDark} onPointerDown={onPointerDown} />
      <DraggableDot cx={b.x} cy={b.y} color={C.green} label="B" labelOffset={{ x: 8, y: -18 }}
        dragId="b" isDragging={dragRef === 'b'} isDark={isDark} onPointerDown={onPointerDown} />
    </g>
  );
}
