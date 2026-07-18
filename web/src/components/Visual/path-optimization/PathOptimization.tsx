/**
 * PathOptimization — 将军饮马 13 种情景交互可视化组件
 *
 * 支持情景切换、关键点拖拽、自动计算最优路径、数值显示。
 * 使用 SVG 纯前端渲染，无第三方依赖，支持深色模式。
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Point, ScenarioId } from './types';
import { SCENARIO_LABELS } from './types';
import { PADDING, clamp, dist, useThemeColors, Grid } from './shared';

/* ---- 导入各情景渲染函数 ---- */
import {
  getDefaultScene1, updateScene1Point, renderScene1,
} from './scenarios/group1';
import type { Scene1State } from './scenarios/group1';
import {
  getDefaultScene2, updateScene2Point, renderScene2,
} from './scenarios/group1';
import type { Scene2State } from './scenarios/group1';
import {
  getDefaultScene3, updateScene3Point, renderScene3,
} from './scenarios/group1';
import type { Scene3State } from './scenarios/group1';
import {
  getDefaultScene4, updateScene4Point, renderScene4,
} from './scenarios/group1';
import type { Scene4State } from './scenarios/group1';

import {
  getDefaultScene5, updateScene5Point, renderScene5,
} from './scenarios/group2';
import type { Scene5State } from './scenarios/group2';
import {
  getDefaultScene6, updateScene6Point, renderScene6,
} from './scenarios/group2';
import type { Scene6State } from './scenarios/group2';
import {
  getDefaultScene7, updateScene7Point, renderScene7,
} from './scenarios/group2';
import type { Scene7State } from './scenarios/group2';
import {
  getDefaultScene8, updateScene8Point, renderScene8,
} from './scenarios/group2';
import type { Scene8State } from './scenarios/group2';

import {
  getDefaultScene9, updateScene9Point, renderScene9,
} from './scenarios/group3';
import type { Scene9State } from './scenarios/group3';
import {
  getDefaultScene10, updateScene10Point, renderScene10,
} from './scenarios/group3';
import type { Scene10State } from './scenarios/group3';
import {
  getDefaultScene11, updateScene11Point, renderScene11,
} from './scenarios/group3';
import type { Scene11State } from './scenarios/group3';
import {
  getDefaultScene12, updateScene12Point, renderScene12,
} from './scenarios/group3';
import type { Scene12State } from './scenarios/group3';
import {
  getDefaultScene13, updateScene13Point, renderScene13,
} from './scenarios/group3';
import type { Scene13State } from './scenarios/group3';

/* ================================================================ */
/*  Props                                                           */
/* ================================================================ */
interface Props {
  model?: 'general' | 'hubugui' | 'bridge'; // 向后兼容
  scenario?: ScenarioId;
  showGrid?: boolean;
  width?: number;
  height?: number;
}

/* ================================================================ */
/*  组件                                                             */
/* ================================================================ */
export default function PathOptimization({
  model,
  scenario: initialScenario,
  showGrid = false,
  width = 420,
  height = 380,
}: Props) {
  /* ---- 深色模式 ---- */
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const C = useThemeColors(isDark);

  /* ---- 情景选择 ---- */
  // 向后兼容：将旧的 model prop 映射到 scenario
  const modelToScenario: Record<string, ScenarioId> = {
    general: '1',
    hubugui: '9',     // 系数加权 ≈ 胡不归
    bridge: '6',      // 造桥选址
  };

  const [currentScenario, setCurrentScenario] = useState<ScenarioId>(
    initialScenario ?? modelToScenario[model ?? ''] ?? '1',
  );

  /* ---- 各情景状态 ---- */
  const [s1, setS1] = useState<Scene1State>(() => getDefaultScene1(width, height));
  const [s2, setS2] = useState<Scene2State>(() => getDefaultScene2(width, height));
  const [s3, setS3] = useState<Scene3State>(() => getDefaultScene3(width, height));
  const [s4, setS4] = useState<Scene4State>(() => getDefaultScene4(width, height));
  const [s5, setS5] = useState<Scene5State>(() => getDefaultScene5(width, height));
  const [s6, setS6] = useState<Scene6State>(() => getDefaultScene6(width, height));
  const [s7, setS7] = useState<Scene7State>(() => getDefaultScene7(width, height));
  const [s8, setS8] = useState<Scene8State>(() => getDefaultScene8(width, height));
  const [s9, setS9] = useState<Scene9State>(() => getDefaultScene9(width, height));
  const [s10, setS10] = useState<Scene10State>(() => getDefaultScene10(width, height));
  const [s11, setS11] = useState<Scene11State>(() => getDefaultScene11(width, height));
  const [s12, setS12] = useState<Scene12State>(() => getDefaultScene12(width, height));
  const [s13, setS13] = useState<Scene13State>(() => getDefaultScene13(width, height));

  /* ---- 参数状态（k、distance） ---- */
  const [kVal, setKVal] = useState(1.5);
  const [distVal, setDistVal] = useState(50);

  // 保持 kVal / distVal 与状态同步
  useEffect(() => { setS9(prev => ({ ...prev, k: kVal })); }, [kVal]);
  useEffect(() => { setS5(prev => ({ ...prev, distance: distVal })); }, [distVal]);

  /* ---- 拖动状态 ---- */
  const [dragRef, setDrag] = useState<string | null>(null);

  /* ---- SVG 坐标转换 ---- */
  const svgPoint = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const svg = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: ((clientX - svg.left) / svg.width) * width,
        y: ((clientY - svg.top) / svg.height) * height,
      };
    },
    [width, height],
  );

  /* ---- 拖动事件 ---- */
  const handlePointerDown = useCallback(
    (id: string) => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setDrag(id);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!dragRef) return;
      const pt = svgPoint(e);
      const bounded = { x: clamp(pt.x, PADDING, width - PADDING), y: clamp(pt.y, PADDING, height - PADDING) };

      switch (currentScenario) {
        case '1': setS1(prev => updateScene1Point(prev, dragRef, bounded, width, height)); break;
        case '2': setS2(prev => updateScene2Point(prev, dragRef, bounded, width, height)); break;
        case '3': setS3(prev => updateScene3Point(prev, dragRef, bounded, width, height)); break;
        case '4': setS4(prev => updateScene4Point(prev, dragRef, bounded, width, height)); break;
        case '5': setS5(prev => updateScene5Point(prev, dragRef, bounded, width, height)); break;
        case '6': setS6(prev => updateScene6Point(prev, dragRef, bounded, width, height)); break;
        case '7': setS7(prev => updateScene7Point(prev, dragRef, bounded, width, height)); break;
        case '8': setS8(prev => updateScene8Point(prev, dragRef, bounded, width, height)); break;
        case '9': setS9(prev => updateScene9Point(prev, dragRef, bounded, width, height)); break;
        case '10': setS10(prev => updateScene10Point(prev, dragRef, bounded, width, height)); break;
        case '11': setS11(prev => updateScene11Point(prev, dragRef, bounded, width, height)); break;
        case '12': setS12(prev => updateScene12Point(prev, dragRef, bounded, width, height)); break;
        case '13': setS13(prev => updateScene13Point(prev, dragRef, bounded, width, height)); break;
      }
    },
    [dragRef, svgPoint, currentScenario, width, height],
  );

  const handlePointerUp = useCallback(() => setDrag(null), []);

  /* ---- 情景切换处理 ---- */
  const handleScenarioChange = (sc: ScenarioId) => {
    setCurrentScenario(sc);
    setDrag(null);
  };

  /* ---- 计算当前场景的值 ---- */
  const currentInfo = useMemo(() => {
    const empty = { values: [] as { label: string; value: string; color: string }[], hint: '' };
    try {
      switch (currentScenario) {
        case '1': {
          const { a, b } = s1;
          const lineY = height * 0.55;
          const bPrime = { x: b.x, y: 2 * lineY - b.y };
          const t = (lineY - a.y) / (bPrime.y - a.y);
          const p = { x: a.x + t * (bPrime.x - a.x), y: lineY };
          const ap = dist(a, p), pb = dist(p, b);
          return { values: [{ label: 'AP', value: ap.toFixed(2), color: C.accent }, { label: 'PB', value: pb.toFixed(2), color: C.accent }, { label: '最短总长', value: (ap + pb).toFixed(2), color: C.red }], hint: '拖动 A、B 改变位置' };
        }
        case '2': {
          const { a, b } = s2;
          const l1_p1: Point = { x: PADDING, y: height * 0.45 }, l1_p2: Point = { x: width - PADDING, y: height * 0.65 };
          const l2_p1: Point = { x: PADDING, y: height * 0.75 }, l2_p2: Point = { x: width - PADDING, y: height * 0.35 };
          const dx1 = l1_p2.x - l1_p1.x, dy1 = l1_p2.y - l1_p1.y, len2_1 = dx1 * dx1 + dy1 * dy1;
          const t1 = ((a.x - l1_p1.x) * dx1 + (a.y - l1_p1.y) * dy1) / len2_1;
          const aPrime: Point = { x: 2 * (l1_p1.x + t1 * dx1) - a.x, y: 2 * (l1_p1.y + t1 * dy1) - a.y };
          const dx2 = l2_p2.x - l2_p1.x, dy2 = l2_p2.y - l2_p1.y, len2_2 = dx2 * dx2 + dy2 * dy2;
          const t2 = ((b.x - l2_p1.x) * dx2 + (b.y - l2_p1.y) * dy2) / len2_2;
          const bPrime: Point = { x: 2 * (l2_p1.x + t2 * dx2) - b.x, y: 2 * (l2_p1.y + t2 * dy2) - b.y };
          const total = dist(a, bPrime); // 近似
          return { values: [{ label: '最短总长', value: total.toFixed(2), color: C.accent }], hint: '拖动 A、B 改变位置' };
        }
        case '3': {
          const { a } = s3;
          const l1_p1: Point = { x: PADDING, y: height * 0.55 }, l1_p2 = { x: width - PADDING, y: height * 0.75 };
          const l2_p1: Point = { x: PADDING, y: height * 0.75 }, l2_p2 = { x: width - PADDING, y: height * 0.55 };
          const dx1 = l1_p2.x - l1_p1.x, dy1 = l1_p2.y - l1_p1.y, len2_1 = dx1 * dx1 + dy1 * dy1;
          const t1 = ((a.x - l1_p1.x) * dx1 + (a.y - l1_p1.y) * dy1) / len2_1;
          const aP: Point = { x: 2 * (l1_p1.x + t1 * dx1) - a.x, y: 2 * (l1_p1.y + t1 * dy1) - a.y };
          const dx2 = l2_p2.x - l2_p1.x, dy2 = l2_p2.y - l2_p1.y, len2_2 = dx2 * dx2 + dy2 * dy2;
          const t2 = ((a.x - l2_p1.x) * dx2 + (a.y - l2_p1.y) * dy2) / len2_2;
          const aPP: Point = { x: 2 * (l2_p1.x + t2 * dx2) - a.x, y: 2 * (l2_p1.y + t2 * dy2) - a.y };
          const total = dist(aP, aPP);
          return { values: [{ label: '最短总长', value: total.toFixed(2), color: C.accent }], hint: '拖动 A 改变位置' };
        }
        case '4': {
          const { a, b } = s4;
          const lineY4 = height * 0.55;
          const ab = dist(a, b);
          const bPrime4 = { x: b.x, y: 2 * lineY4 - b.y };
          const t4 = (lineY4 - a.y) / (bPrime4.y - a.y);
          const p4 = { x: clamp(a.x + t4 * (bPrime4.x - a.x), PADDING, width - PADDING), y: lineY4 };
          const pa4 = dist(a, p4), pb4 = dist(p4, b);
          const perimeter = pa4 + pb4 + ab;
          return { values: [
            { label: 'PA', value: pa4.toFixed(2), color: C.accent },
            { label: 'PB', value: pb4.toFixed(2), color: C.accent },
            { label: 'AB（固定）', value: ab.toFixed(2), color: C.label },
            { label: '周长最小值', value: perimeter.toFixed(2), color: C.red },
          ], hint: '拖动 A、B · AB 固定，△PAB 周长 = PA + PB + AB' };
        }
        case '5': {
          const { a, b } = s5;
          const lineY5 = height * 0.55;
          // 平移 + 反射
          const a1: Point = { x: a.x + distVal, y: a.y };
          const a1Prime = { x: a1.x, y: 2 * lineY5 - a1.y };
          const t5 = (lineY5 - a1Prime.y) / (b.y - a1Prime.y);
          const qX = clamp(a1Prime.x + t5 * (b.x - a1Prime.x), PADDING, width - PADDING);
          const q5: Point = { x: qX, y: lineY5 };
          const p5: Point = { x: clamp(qX - distVal, PADDING, width - PADDING), y: lineY5 };
          const ap5 = dist(a, p5), qb5 = dist(q5, b);
          const total5 = ap5 + distVal + qb5;
          return { values: [
            { label: 'AP', value: ap5.toFixed(2), color: C.accent },
            { label: 'PQ', value: distVal.toFixed(0), color: C.orange },
            { label: 'QB', value: qb5.toFixed(2), color: C.accent },
            { label: '最短总长', value: total5.toFixed(2), color: C.red },
          ], hint: '拖动 A、B · 滑块调整 PQ 距离' };
        }
        case '6': {
          const { a, b } = s6;
          const bw = height * 0.28;
          const bPrime: Point = { x: b.x, y: b.y - bw };
          const t = ((height * 0.36) - a.y) / (bPrime.y - a.y);
          const p = { x: clamp(a.x + t * (bPrime.x - a.x), PADDING, width - PADDING), y: height * 0.36 };
          const q = { x: p.x, y: height * 0.64 };
          const ap = dist(a, p), qb = dist(q, b);
          return { values: [{ label: 'AP', value: ap.toFixed(2), color: C.accent }, { label: 'QB', value: qb.toFixed(2), color: C.accent }, { label: '最短总长', value: (ap + bw + qb).toFixed(2), color: C.red }], hint: '拖动 A、B · 桥始终垂直于河岸' };
        }
        case '7': {
          const { a, b } = s7;
          const l1_p1_7: Point = { x: PADDING, y: height * 0.45 }, l1_p2_7: Point = { x: width - PADDING, y: height * 0.45 };
          const l2_p1_7: Point = { x: PADDING, y: height * 0.70 }, l2_p2_7: Point = { x: width - PADDING, y: height * 0.50 };
          const dx7 = l1_p2_7.x - l1_p1_7.x, dy7 = l1_p2_7.y - l1_p1_7.y;
          const t7 = ((a.x - l1_p1_7.x) * dx7 + (a.y - l1_p1_7.y) * dy7) / (dx7 * dx7 + dy7 * dy7);
          const aP7: Point = { x: 2 * (l1_p1_7.x + t7 * dx7) - a.x, y: 2 * (l1_p1_7.y + t7 * dy7) - a.y };
          const dx7b = l2_p2_7.x - l2_p1_7.x, dy7b = l2_p2_7.y - l2_p1_7.y;
          const t7b = ((aP7.x - l2_p1_7.x) * dx7b + (aP7.y - l2_p1_7.y) * dy7b) / (dx7b * dx7b + dy7b * dy7b);
          const aPP7: Point = { x: 2 * (l2_p1_7.x + t7b * dx7b) - aP7.x, y: 2 * (l2_p1_7.y + t7b * dy7b) - aP7.y };
          const denom7 = (aPP7.x - b.x) * (l2_p2_7.y - l2_p1_7.y) - (aPP7.y - b.y) * (l2_p2_7.x - l2_p1_7.x);
          let total7 = dist(a, aPP7);
          if (Math.abs(denom7) > 1e-10) total7 = dist(a, aPP7);
          return { values: [{ label: '最短总长（A→A")', value: total7.toFixed(2), color: C.accent }], hint: '拖动 A、B · 双反射路径' };
        }
        case '8': {
          const { a, b } = s8;
          const ab = dist(a, b);
          return { values: [{ label: '最大值 |PA−PB|', value: ab.toFixed(2), color: C.purple }, { label: 'AB', value: `${ab.toFixed(2)}（当 P 在 AB 延长线上）`, color: C.label }], hint: '拖动 A、B · |PA−PB| ≤ AB' };
        }
        case '9': {
          const lineY = height * 0.55;
          const f = (x: number) => { const pt: Point = { x, y: lineY }; return dist(s9.a, pt) + kVal * dist(pt, s9.b); };
          let lo = PADDING, hi = width - PADDING;
          for (let i = 0; i < 80; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (f(m1) < f(m2)) hi = m2; else lo = m1; }
          const bestX = (lo + hi) / 2, p = { x: bestX, y: lineY };
          const total = dist(s9.a, p) + kVal * dist(p, s9.b);
          return { values: [{ label: 'PA', value: dist(s9.a, p).toFixed(2), color: C.accent }, { label: `k·PB (k=${kVal.toFixed(2)})`, value: (kVal * dist(p, s9.b)).toFixed(2), color: C.purple }, { label: '最小值', value: total.toFixed(2), color: C.red }], hint: '拖动 A、B · 滑块调节系数 k' };
        }
        case '10': {
          const { triA, triB, triC } = s10;
          // 梯度下降求费马点
          let px10 = (triA.x + triB.x + triC.x) / 3, py10 = (triA.y + triB.y + triC.y) / 3;
          for (let i = 0; i < 500; i++) {
            const da10 = Math.sqrt((px10 - triA.x) ** 2 + (py10 - triA.y) ** 2) + 1e-8;
            const db10 = Math.sqrt((px10 - triB.x) ** 2 + (py10 - triB.y) ** 2) + 1e-8;
            const dc10 = Math.sqrt((px10 - triC.x) ** 2 + (py10 - triC.y) ** 2) + 1e-8;
            const gx10 = (px10 - triA.x) / da10 + (px10 - triB.x) / db10 + (px10 - triC.x) / dc10;
            const gy10 = (py10 - triA.y) / da10 + (py10 - triB.y) / db10 + (py10 - triC.y) / dc10;
            const gn10 = Math.sqrt(gx10 * gx10 + gy10 * gy10);
            if (gn10 < 0.001) break;
            px10 -= 0.5 * gx10 / gn10; py10 -= 0.5 * gy10 / gn10;
          }
          const fp10: Point = { x: px10, y: py10 };
          const pa10 = dist(fp10, triA), pb10 = dist(fp10, triB), pc10 = dist(fp10, triC);
          const total10 = pa10 + pb10 + pc10;
          return { values: [
            { label: 'PA', value: pa10.toFixed(2), color: C.accent },
            { label: 'PB', value: pb10.toFixed(2), color: C.accentLight },
            { label: 'PC', value: pc10.toFixed(2), color: C.blue },
            { label: '最小值', value: total10.toFixed(2), color: C.red },
          ], hint: '拖动三角形顶点 A、B、C · 费马点近似' };
        }
        case '11': {
          const cx = width / 2, cy = height * 0.55, r = Math.min(width, height) * 0.16;
          const ff = (ang: number) => { const pp = { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) }; return dist(s11.a, pp) + dist(pp, s11.b); };
          let lo = 0, hi = 2 * Math.PI;
          for (let i = 0; i < 100; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (ff(m1) < ff(m2)) hi = m2; else lo = m1; }
          const ang = (lo + hi) / 2, pp = { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) };
          const total = dist(s11.a, pp) + dist(pp, s11.b);
          return { values: [{ label: 'PA+PB 最小值', value: total.toFixed(2), color: C.accent }], hint: '拖动 A、B · P 沿圆运动取最值' };
        }
        case '12': {
          const { a, b } = s12;
          const l1_12a: Point = { x: PADDING, y: height * 0.35 }, l1_12b: Point = { x: width - PADDING, y: height * 0.35 };
          const l2_12a: Point = { x: PADDING, y: height * 0.55 }, l2_12b: Point = { x: width - PADDING, y: height * 0.45 };
          const l3_12a: Point = { x: PADDING, y: height * 0.72 }, l3_12b: Point = { x: width - PADDING, y: height * 0.72 };
          // 逐次反射
          const rf = (p: Point, la: Point, lb: Point) => {
            const dx = lb.x - la.x, dy = lb.y - la.y, l2 = dx * dx + dy * dy;
            if (l2 < 0.0001) return p;
            const t = ((p.x - la.x) * dx + (p.y - la.y) * dy) / l2;
            return { x: 2 * (la.x + t * dx) - p.x, y: 2 * (la.y + t * dy) - p.y };
          };
          const a1_12 = rf(a, l1_12a, l1_12b);
          const a2_12 = rf(a1_12, l2_12a, l2_12b);
          const a3_12 = rf(a2_12, l3_12a, l3_12b);
          const total12 = dist(a, a3_12);
          return { values: [{ label: '最短总长（A→A"")', value: total12.toFixed(2), color: C.accent }], hint: '拖动 A、B · 逐次反射法' };
        }
        case '13': {
          const bw2 = height * 0.20;
          const aPrime = { x: s13.a.x, y: 2 * height * 0.30 - s13.a.y };
          const bPrime = { x: s13.b.x, y: s13.b.y - bw2 };
          const t = (height * 0.30 - aPrime.y) / (bPrime.y - aPrime.y);
          const pp = { x: aPrime.x + t * (bPrime.x - aPrime.x), y: height * 0.30 };
          const q = { x: pp.x, y: height * 0.50 };
          const total = dist(s13.a, pp) + dist(pp, q) + bw2 + dist({ x: q.x, y: height * 0.70 }, s13.b);
          return { values: [{ label: '综合最短路径', value: total.toFixed(2), color: C.accent }], hint: '拖动 A、B · 反射 + 平移 + 造桥综合' };
        }
      }
    } catch {
      return { values: [{ label: '计算中…', value: '', color: C.label }], hint: '' };
    }
  }, [currentScenario, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, kVal, distVal, C, width, height]);

  /* ---- 渲染当前场景 SVG ---- */
  const renderCurrentScene = () => {
    const baseArgs = { C, isDark, width, height, dragRef, onPointerDown: handlePointerDown } as const;
    switch (currentScenario) {
      case '1': return renderScene1(s1, C, isDark, width, height, dragRef, handlePointerDown);
      case '2': return renderScene2(s2, C, isDark, width, height, dragRef, handlePointerDown);
      case '3': return renderScene3(s3, C, isDark, width, height, dragRef, handlePointerDown);
      case '4': return renderScene4(s4, C, isDark, width, height, dragRef, handlePointerDown);
      case '5': return renderScene5(s5, C, isDark, width, height, dragRef, handlePointerDown);
      case '6': return renderScene6(s6, C, isDark, width, height, dragRef, handlePointerDown);
      case '7': return renderScene7(s7, C, isDark, width, height, dragRef, handlePointerDown);
      case '8': return renderScene8(s8, C, isDark, width, height, dragRef, handlePointerDown);
      case '9': return renderScene9(s9, C, isDark, width, height, dragRef, handlePointerDown);
      case '10': return renderScene10(s10, C, isDark, width, height, dragRef, handlePointerDown);
      case '11': return renderScene11(s11, C, isDark, width, height, dragRef, handlePointerDown);
      case '12': return renderScene12(s12, C, isDark, width, height, dragRef, handlePointerDown);
      case '13': return renderScene13(s13, C, isDark, width, height, dragRef, handlePointerDown);
      default: return renderScene1(s1, C, isDark, width, height, dragRef, handlePointerDown);
    }
  };

  /* ================================================================ */
  /*  Render                                                        */
  /* ================================================================ */
  return (
    <div
      style={{
        textAlign: 'center',
        margin: '12px 0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* -------- 情景选择器 -------- */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'center',
          marginBottom: 10,
          padding: '6px 10px',
          background: C.infoBg,
          borderRadius: 8,
        }}
      >
        <select
          value={currentScenario}
          onChange={(e) => handleScenarioChange(e.target.value as ScenarioId)}
          style={{
            padding: '7px 14px',
            borderRadius: 6,
            border: `1.5px solid ${C.accent}`,
            background: isDark ? '#2a2a3e' : '#fff',
            color: C.fg,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            outline: 'none',
            minWidth: 220,
          }}
          aria-label="选择情景"
        >
          {(Object.entries(SCENARIO_LABELS) as [ScenarioId, string][]).map(([id, label]) => (
            <option key={id} value={id}>
              {id}. {label}
            </option>
          ))}
        </select>
      </div>

      {/* -------- SVG -------- */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, boxShadow: `0 2px 12px rgba(0,0,0,${isDark ? 0.3 : 0.08})` }}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        role="img"
        aria-label={`将军饮马场景 — ${SCENARIO_LABELS[currentScenario]}`}
      >
        <rect x={0} y={0} width={width} height={height} fill={C.bg} rx={8} />
        {showGrid && <Grid width={width} height={height} color={C.grid} />}
        {renderCurrentScene()}
      </svg>

      {/* -------- 信息面板 -------- */}
      <div
        style={{
          marginTop: 8,
          padding: '8px 14px',
          borderRadius: 8,
          background: C.infoBg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {/* 情景说明 */}
        <div style={{ fontSize: 13, color: C.label, fontWeight: 500, lineHeight: 1.5 }}>
          {currentScenario === '1' && '两定点 A、B 在直线 l 同侧，在 l 上找点 P 使 PA + PB 最小。作对称点 B\'，连接 AB\' 与 l 的交点即 P。'}
          {currentScenario === '2' && 'P 在直线 l₁ 上，Q 在直线 l₂ 上，求 AP + PQ + QB 最小值。作 A 关于 l₁ 的对称点 A\'，B 关于 l₂ 的对称点 B\'，A\'B\' 即最短路径。'}
          {currentScenario === '3' && '一定点 A，P 在 l₁，Q 在 l₂，使 AP + PQ + QA 最小。作 A 关于 l₁ 的对称 A\'，关于 l₂ 的对称 A\'\'，A\'A\'\' 即最短路径。'}
          {currentScenario === '4' && '△PAB 周长 = PA + PB + AB。AB 固定，等价于基础型求 PA + PB 最小值。'}
          {currentScenario === '5' && 'A、B 固定，P、Q 在直线 l 上且 PQ = d，求 AP + PQ + QB 最小值。平移 + 对称法求解。'}
          {currentScenario === '6' && '河两岸 l₁ ∥ l₂，P ⟂ 河岸，PQ 为桥。将 B 向上平移河宽得 B\'，用对称法求 P。'}
          {currentScenario === '7' && '光线经 l₁、l₂ 两次反射从 A 到 B。逐次反射法：A→A\'（关于 l₁）→A\'\'（关于 l₂），A\'\'B 交 l₂ 于 Q，QA\' 交 l₁ 于 P。'}
          {currentScenario === '8' && '|PA − PB| 最大值。当 A、B、P 共线时取最大值 AB。P 为直线 AB 与 l 的交点。'}
          {currentScenario === '9' && 'PA + k·PB 最小值（k ≠ 1），P 在直线 l 上。三分搜索法沿 l 求最优 P。'}
          {currentScenario === '10' && '三角形内一点 P 到三顶点距离和最小（费马点问题）。梯度下降法求解。'}
          {currentScenario === '11' && 'P 在圆上运动，求 PA + PB 最小值。三分搜索法沿圆弧求最优 P。'}
          {currentScenario === '12' && '经 l₁→l₂→l₃ 三次反射的最短折线路径。三重反射法求解。'}
          {currentScenario === '13' && '综合运用反射+平移+造桥的综合型最短路径问题。'}
        </div>

        {/* 参数滑块 */}
        {currentScenario === '5' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: C.label }}>
            <span>PQ 距离</span>
            <input type="range" min={20} max={120} step={1} value={distVal}
              onChange={(e) => setDistVal(Number(e.target.value))}
              style={{ width: 140, accentColor: C.orange }} aria-label="PQ 距离" />
            <span style={{ fontWeight: 700, color: C.orange, minWidth: 28 }}>{distVal}</span>
          </div>
        )}
        {currentScenario === '9' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: C.label }}>
            <span>系数 k</span>
            <input type="range" min={0.3} max={3} step={0.01} value={kVal}
              onChange={(e) => setKVal(Number(e.target.value))}
              style={{ width: 160, accentColor: C.purple }} aria-label="系数 k" />
            <span style={{ fontWeight: 700, color: C.purple, minWidth: 32 }}>{kVal.toFixed(2)}</span>
          </div>
        )}

        {/* 数值显示 */}
        <div style={{ fontSize: 13, color: C.fg, lineHeight: 1.6 }}>
          {currentInfo.values.map((v, i) => (
            <span key={i}>
              {i > 0 && <span style={{ color: C.label }}> · </span>}
              <span style={{ color: C.label }}>{v.label}：</span>
              <span style={{ color: v.color, fontWeight: 700 }}>{v.value}</span>
            </span>
          ))}
        </div>

        {/* 操作提示 */}
        <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>
          {currentInfo.hint}
        </div>
      </div>
    </div>
  );
}
