/**
 * 将军饮马 — 13 种最短路径几何模型动画
 *
 * 所有场景使用统一 Canvas 坐标系：
 *   - 原点在画布中心 (250, 180)
 *   - x ∈ [-200, 200], y ∈ [-150, 150] (通过 scale(1,-1) 使 y 轴向上)
 *   - scale = 1px = 1 单位
 */

import { useState } from 'react';
import AnimationPlayer from '../AnimationPlayer';
import type { AnimationStep } from '../AnimationPlayer';

/* ========= 绘图工具函数 ========= */

/** 清空背景 + 画浅色网格 */
function clearBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, w, h);

  // 网格
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 0.5;
  const step = 25;
  for (let x = 0; x <= w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();
}

/** 画坐标轴 (调用前已 translate 到原点) */
function drawAxis(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const halfW = w / 2;
  const halfH = h / 2;
  ctx.save();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;

  // x 轴
  ctx.beginPath();
  ctx.moveTo(-halfW + 10, 0);
  ctx.lineTo(halfW - 10, 0);
  ctx.stroke();
  // x 轴箭头
  ctx.beginPath();
  ctx.moveTo(halfW - 10, 0);
  ctx.lineTo(halfW - 16, -4);
  ctx.moveTo(halfW - 10, 0);
  ctx.lineTo(halfW - 16, 4);
  ctx.stroke();

  // y 轴
  ctx.beginPath();
  ctx.moveTo(0, -halfH + 10);
  ctx.lineTo(0, halfH - 10);
  ctx.stroke();
  // y 轴箭头
  ctx.beginPath();
  ctx.moveTo(0, -halfH + 10);
  ctx.lineTo(-4, -halfH + 16);
  ctx.moveTo(0, -halfH + 10);
  ctx.lineTo(4, -halfH + 16);
  ctx.stroke();

  // 标签
  ctx.fillStyle = '#64748b';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('x', halfW - 18, 4);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText('y', 4, -halfH + 14);

  // 原点
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('O', -6, 4);
  ctx.restore();
}

/** 画一个点 */
function drawPoint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  color: string,
  radius = 6,
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // 标签
  ctx.save();
  ctx.translate(0, 0); // reset any transform
  ctx.fillStyle = color;
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(label, x + radius + 3, y - radius - 1);
  ctx.restore();
}

/** 画线段 */
function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width = 2,
  dash = false,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  if (dash) ctx.setLineDash([5, 5]);
  else ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

/** 画带箭头线段 */
function drawArrowedLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width = 2,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  // 箭头
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowLen = 8;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - arrowLen * Math.cos(angle - 0.4), y2 - arrowLen * Math.sin(angle - 0.4));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - arrowLen * Math.cos(angle + 0.4), y2 - arrowLen * Math.sin(angle + 0.4));
  ctx.stroke();
  ctx.restore();
}

/** 画虚线 */
function drawDashedLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
) {
  drawLine(ctx, x1, y1, x2, y2, color, 1.5, true);
}

/** 画文字标签（数学坐标） */
function drawLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  color: string,
  offsetX = 0,
  offsetY = 0,
) {
  ctx.save();
  ctx.translate(0, 0);
  ctx.fillStyle = color;
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + offsetX, -y + offsetY);
  ctx.restore();
}

/** 在 Canvas 坐标中写文字（不下翻转） */
function drawTextCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  color: string,
  size = 14,
  align: CanvasTextAlign = 'center',
  baseline: CanvasTextBaseline = 'middle',
  bold = false,
) {
  ctx.save();
  ctx.translate(0, 0);
  ctx.fillStyle = color;
  ctx.font = `${bold ? 'bold ' : ''}${size}px sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(text, x, y);
  ctx.restore();
}

/** 画一个填充三角形/多边形 */
function drawPolygon(
  ctx: CanvasRenderingContext2D,
  pts: [number, number][],
  fillColor: string,
  strokeColor: string,
  strokeWidth = 2,
) {
  if (pts.length < 2) return;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i][0], pts[i][1]);
  }
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
  ctx.restore();
}

/** 画一条粗路径折线（红色高亮路径） */
function drawPath(
  ctx: CanvasRenderingContext2D,
  pts: [number, number][],
  color: string,
  width = 3,
) {
  if (pts.length < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i][0], pts[i][1]);
  }
  ctx.stroke();
  ctx.restore();
}

/** 画直角标记 */
function drawRightAngle(
  ctx: CanvasRenderingContext2D,
  vertex: [number, number],
  dir1: [number, number],
  dir2: [number, number],
  size = 8,
  color = '#94a3b8',
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(vertex[0] + dir1[0] * size, vertex[1] + dir1[1] * size);
  ctx.lineTo(vertex[0] + dir1[0] * size + dir2[0] * size, vertex[1] + dir1[1] * size + dir2[1] * size);
  ctx.lineTo(vertex[0] + dir2[0] * size, vertex[1] + dir2[1] * size);
  ctx.stroke();
  ctx.restore();
}

/* ========= 颜色常量 ========= */
const C = {
  blue: '#3B82F6',
  orange: '#F97316',
  red: '#EF4444',
  green: '#22C55E',
  purple: '#8B5CF6',
  teal: '#06B6D4',
  gray: '#94a3b8',
  pink: '#EC4899',
  lBlue: '#93c5fd',
  lGreen: '#86efac',
};

/* ========= 场景定义 ========= */
interface ScenarioConfig {
  shortName: string;
  fullTitle: string;
  steps: AnimationStep[];
}

const SCENARIOS: ScenarioConfig[] = [
  // ======== 1. 两定同侧 ========
  {
    shortName: '① 两定同侧',
    fullTitle: '两定点在直线同侧 · 求最短路径 (PA+PB)',
    steps: [
      {
        title: '问题设定',
        description: '点 A、B 在直线 l 同侧，在 l 上找点 P，使 PA+PB 最小',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          // 直线 l (x 轴)
          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          // 点 A (left, above), 点 B (right, above)
          const ax = -70 + (1 - t) * 40;
          const ay = 80;
          const bx = 60 + (1 - t) * 30;
          const by = 100;

          if (t > 0.2) {
            drawPoint(ctx, ax, ay, 'A', C.blue);
            drawPoint(ctx, bx, by, 'B', C.blue);
          }

          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);

          ctx.restore();
          if (t < 0.5) {
            drawTextCanvas(ctx, w / 2, 25, '✨ 两定点在直线同侧，求最短路径', C.gray, 13);
          }
        },
        duration: 1200,
      },
      {
        title: '对称变换',
        description: '作点 A 关于直线 l 的对称点 A\'',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          const ax = -70;
          const ay = 80;
          const bx = 60;
          const by = 100;

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);
          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);

          // 对称 A' 动画
          const aay = -80 * t;
          if (t > 0.1) {
            drawDashedLine(ctx, ax, ay, ax, aay, C.purple);
            drawPoint(ctx, ax, aay, 'A\'', C.purple, 5);
            drawLabel(ctx, ax, aay - 5, 'A\'', C.purple);
          }

          ctx.restore();
        },
        duration: 1400,
      },
      {
        title: '连线求交点',
        description: '连接 A\'B，与 l 的交点即为点 P',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          const ax = -70;
          const ay = 80;
          const bx = 60;
          const by = 100;
          const aay = -80;

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);
          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawPoint(ctx, ax, aay, 'A\'', C.purple, 5);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);
          drawLabel(ctx, ax, aay - 5, 'A\'', C.purple);

          // 连接 A'B
          const px = (t < 0.5) ? ax + (bx - ax) * (t * 2) : bx;
          const py = (t < 0.5) ? aay + (by - aay) * (t * 2) : by;
          drawLine(ctx, ax, aay, px, py, C.purple, 2);

          if (t > 0.4) {
            // 交点 P
            const pIdx = -aay / (by - aay);
            const pX = ax + (bx - ax) * pIdx;
            const pY = 0;
            const pt = Math.min((t - 0.4) / 0.4, 1);
            const showPx = ax + (pX - ax) * pt;

            if (t > 0.4) {
              // 完整连线
              drawLine(ctx, ax, aay, bx, by, C.purple, 2);
              drawPoint(ctx, pX, pY, 'P', C.orange);
              drawLabel(ctx, pX, pY - 5, 'P (', C.orange);
              drawLabel(ctx, pX + 8, -6, '最值点)', C.orange);

              // 垂直标记
              drawDashedLine(ctx, pX, -5, pX, 5, C.gray);
            }
          }

          ctx.restore();
        },
        duration: 1500,
      },
      {
        title: '结论',
        description: 'PA + PB 的最小值即为 A\'B 的长度',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          const ax = -70;
          const ay = 80;
          const bx = 60;
          const by = 100;
          const aay = -80;

          // 交点和路径
          const pX = ax + (bx - ax) * (-aay / (by - aay));
          const pY = 0;

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          // 高亮路径: A → P → B
          drawPath(ctx, [[ax, ay], [pX, pY], [bx, by]], C.red, 3);

          // 其他辅助线虚线
          drawDashedLine(ctx, ax, ay, ax, aay, C.lBlue);

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawPoint(ctx, pX, pY, 'P', C.orange, 7);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);
          drawLabel(ctx, pX, pY - 5, 'P', C.orange);

          // 结论文字
          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✅ 结论：PA + PB 最小值 = A\'B', C.red, 15, 'center', 'middle', true);
          drawTextCanvas(ctx, w / 2, 48, '作对称 → 连线 → 交点即为最值点', C.gray, 13);
        },
        duration: 1200,
      },
    ],
  },

  // ======== 2. 两定异侧 ========
  {
    shortName: '② 两定异侧',
    fullTitle: '两定点在直线异侧 · 求最短路径 (PA+PB)',
    steps: [
      {
        title: '问题设定',
        description: '点 A 在 l 上方，点 B 在 l 下方，求使 PA+PB 最小的点 P',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          const ax = -60;
          const ay = 80;
          const bx = 70;
          const by = -70;

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by - 5, 'B', C.blue);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✨ 两定点在直线异侧，求最短路径', C.gray, 13);
        },
        duration: 1000,
      },
      {
        title: '直接连线',
        description: '直接连接 AB，与 l 的交点即点 P',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          const ax = -60;
          const ay = 80;
          const bx = 70;
          const by = -70;

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);
          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by - 5, 'B', C.blue);

          // 动画连线
          const px = ax + (bx - ax) * t;
          const py = ay + (by - ay) * t;
          drawLine(ctx, ax, ay, px, py, C.purple, 2, false);

          ctx.restore();
        },
        duration: 1200,
      },
      {
        title: '求交点',
        description: 'AB 与直线 l 的交点即为 P，PA+PB=AB 最短',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          const ax = -60;
          const ay = 80;
          const bx = 70;
          const by = -70;

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          const pX = ax + (bx - ax) * (ay / (ay - by));
          const pY = 0;

          // 高亮路径
          drawPath(ctx, [[ax, ay], [pX, pY], [bx, by]], C.red, 3);

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawPoint(ctx, pX, pY, 'P', C.orange, 7);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by - 5, 'B', C.blue);
          drawLabel(ctx, pX, pY - 5, 'P', C.orange);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✅ 结论：PA + PB 最小值 = AB', C.red, 15, 'center', 'middle', true);
          drawTextCanvas(ctx, w / 2, 48, '异侧直接连线即可，交点即为 P', C.gray, 13);
        },
        duration: 1200,
      },
    ],
  },

  // ======== 3. 差最大同侧 ========
  {
    shortName: '③ 差最大同侧',
    fullTitle: '两定点同侧 · 求 |PA-PB| 最大值',
    steps: [
      {
        title: '问题设定',
        description: 'A、B 在 l 同侧，在 l 上找点 P 使 |PA-PB| 最大',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          const ax = -50;
          const ay = 90;
          const bx = 80;
          const by = 60;

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✨ 两定点同侧，求 |PA-PB| 最大值', C.gray, 13);
        },
        duration: 1000,
      },
      {
        title: '构造变换',
        description: '连接 AB 并延长至直线 l，交点即为 P',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          const ax = -50;
          const ay = 90;
          const bx = 80;
          const by = 60;

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);
          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);

          // AB 连线
          const pct1 = Math.min(t, 1);
          const eX = ax + (bx - ax) * pct1;
          const eY = ay + (by - ay) * pct1;
          drawLine(ctx, ax, ay, eX, eY, C.purple, 2);

          ctx.restore();
        },
        duration: 1000,
      },
      {
        title: '延长线',
        description: '继续延长与 l 相交，交点即 P',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          const ax = -50;
          const ay = 90;
          const bx = 80;
          const by = 60;

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);

          // 计算 AB 线与 x 轴的交点
          const slope = (by - ay) / (bx - ax);
          const intercept = ay - slope * ax;
          const pX = -intercept / slope;
          const pY = 0;

          // 延长到交点 (反向延长)
          const extend = t * 1.4;
          const extX = ax + (bx - ax) * extend;
          const extY = ay + (by - ay) * extend;
          if (extend <= 1) {
            drawLine(ctx, ax, ay, extX, extY, C.purple, 2);
            drawPoint(ctx, ax, ay, 'A', C.blue);
            drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          } else {
            drawLine(ctx, ax, ay, pX, pY, C.purple, 2);
            drawPoint(ctx, ax, ay, 'A', C.blue);
            drawLabel(ctx, ax, ay + 5, 'A', C.blue);
            // 超过 AB 的延长部分
            const extra = (extend - 1) / 0.4;
            const eEx = bx + (pX - bx) * Math.min(extra, 1);
            const eEy = by + (pY - by) * Math.min(extra, 1);
            if (extra > 0) {
              drawLine(ctx, bx, by, eEx, eEy, C.purple, 2, true);
            }
            if (extra >= 1) {
              drawPoint(ctx, pX, pY, 'P', C.orange, 7);
              drawLabel(ctx, pX, pY - 5, 'P', C.orange);
            }
          }

          ctx.restore();
        },
        duration: 1500,
      },
      {
        title: '结论',
        description: '|PA-PB| 的最大值为 AB，此时 A、B、P 三点共线',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          const ax = -50;
          const ay = 90;
          const bx = 80;
          const by = 60;

          const slope = (by - ay) / (bx - ax);
          const intercept = ay - slope * ax;
          const pX = -intercept / slope;
          const pY = 0;

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          // 高亮直线
          drawPath(ctx, [[ax, ay], [bx, by], [pX, pY]], C.red, 3);

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawPoint(ctx, pX, pY, 'P', C.orange, 7);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);
          drawLabel(ctx, pX, pY - 5, 'P', C.orange);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✅ |PA-PB|max = AB，三点共线时取等', C.red, 14, 'center', 'middle', true);
          drawTextCanvas(ctx, w / 2, 48, '延长 AB 与 l 相交，交点即为 P', C.gray, 13);
        },
        duration: 1200,
      },
    ],
  },

  // ======== 4. 差最大异侧 ========
  {
    shortName: '④ 差最大异侧',
    fullTitle: '两定点异侧 · 求 |PA-PB| 最大值',
    steps: [
      {
        title: '问题设定',
        description: 'A 在 l 上方、B 在 l 下方，求 |PA-PB| 最大值',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);
          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          const ax = -60, ay = 80;
          const bx = 70, by = -60;

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by - 5, 'B', C.blue);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✨ 异侧求 |PA-PB| 最大值', C.gray, 13);
        },
        duration: 1000,
      },
      {
        title: '对称变换',
        description: '作 B 关于 l 的对称点 B\'，转化为同侧问题',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);
          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          const ax = -60, ay = 80;
          const bx = 70, by = -60;

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by - 5, 'B', C.blue);

          // B' 对称
          const bby = 60 * t;
          if (t > 0.1) {
            drawDashedLine(ctx, bx, by, bx, bby, C.purple);
            drawPoint(ctx, bx, bby, 'B\'', C.purple, 5);
            drawLabel(ctx, bx, bby + 5, 'B\'', C.purple);
          }

          ctx.restore();
        },
        duration: 1400,
      },
      {
        title: '连线求交点',
        description: '连接 AB\' 并延长至 l，交点即 P',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);
          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          const ax = -60, ay = 80;
          const bx = 70, by = -60;
          const bby = 60;

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawPoint(ctx, bx, bby, 'B\'', C.purple, 5);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by - 5, 'B', C.blue);
          drawLabel(ctx, bx, bby + 5, 'B\'', C.purple);

          // AB' 延长到 l
          const slope = (bby - ay) / (bx - ax);
          const intercept = ay - slope * ax;
          const pX = -intercept / slope;
          const pY = 0;

          const ext = t * 1.4;
          if (ext <= 1) {
            const eX = ax + (bx - ax) * ext;
            const eY = ay + (bby - ay) * ext;
            drawLine(ctx, ax, ay, eX, eY, C.purple, 2);
          } else {
            const extra = (ext - 1) / 0.4;
            drawLine(ctx, ax, ay, bx, bby, C.purple, 2);
            const eEx = bx + (pX - bx) * Math.min(extra, 1);
            const eEy = bby + (pY - bby) * Math.min(extra, 1);
            drawLine(ctx, bx, bby, eEx, eEy, C.purple, 2, extra > 0.5 && t > 0.7);
            if (extra >= 1) {
              drawPoint(ctx, pX, pY, 'P', C.orange, 7);
              drawLabel(ctx, pX, pY - 5, 'P', C.orange);
            }
          }

          ctx.restore();
        },
        duration: 1500,
      },
      {
        title: '结论',
        description: '|PA-PB|max = AB\'，A、B\'、P 三点共线',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);
          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          const ax = -60, ay = 80;
          const bx = 70, by = -60;
          const bby = 60;

          const slope = (bby - ay) / (bx - ax);
          const intercept = ay - slope * ax;
          const pX = -intercept / slope;

          drawPath(ctx, [[ax, ay], [bx, bby], [pX, 0]], C.red, 3);

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawPoint(ctx, bx, bby, 'B\'', C.purple, 5);
          drawPoint(ctx, pX, 0, 'P', C.orange, 7);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by - 5, 'B', C.blue);
          drawLabel(ctx, bx, bby + 5, 'B\'', C.purple);
          drawLabel(ctx, pX, -5, 'P', C.orange);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✅ |PA-PB|max = AB\'，P 在延长线上', C.red, 14, 'center', 'middle', true);
        },
        duration: 1200,
      },
    ],
  },

  // ======== 5. 造桥选址 ========
  {
    shortName: '⑤ 造桥选址',
    fullTitle: '造桥选址问题 · 两平行线间的最短路径',
    steps: [
      {
        title: '问题设定',
        description: 'A、B 在两条平行线 l₁、l₂ 外侧，在中间建桥 PQ (PQ ⟂ l₁)',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          // 两条平行线
          drawLine(ctx, -180, 50, 180, 50, C.gray, 2);
          drawLine(ctx, -180, -50, 180, -50, C.gray, 2);
          drawLabel(ctx, -175, 55, 'l₁', C.gray);
          drawLabel(ctx, -175, -45, 'l₂', C.gray);

          const ax = -80, ay = 120;
          const bx = 80, by = -110;

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by - 5, 'B', C.blue);

          // 桥示意
          if (t > 0.5) {
            const bt = (t - 0.5) * 2;
            const bX = -80 + 160 * bt;
            drawLine(ctx, bX, 50, bX, -50, C.teal, 3);
            drawLabel(ctx, bX, 0, 'PQ ⟂ l₁', C.teal);
            drawPoint(ctx, bX, 50, 'P', C.teal, 4);
            drawPoint(ctx, bX, -50, 'Q', C.teal, 4);
          }

          ctx.restore();
          if (t < 0.5) {
            drawTextCanvas(ctx, w / 2, 25, '✨ 造桥选址：A→P→Q→B 最短路径', C.gray, 13);
          }
        },
        duration: 1400,
      },
      {
        title: '平移变换',
        description: '将 A 向下平移桥宽至 A\'，连接 A\'B',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 50, 180, 50, C.gray, 2);
          drawLine(ctx, -180, -50, 180, -50, C.gray, 2);
          drawLabel(ctx, -175, 55, 'l₁', C.gray);
          drawLabel(ctx, -175, -45, 'l₂', C.gray);

          const ax = -80, ay = 120;
          const bx = 80, by = -110;

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by - 5, 'B', C.blue);

          // A' 平移 (桥宽 100 单位 = l₁ 到 l₂ 距离)
          const bridgeW = 100;
          const aay = ay - bridgeW * t;
          if (t > 0.1) {
            drawDashedLine(ctx, ax, ay, ax, aay, C.purple);
            drawPoint(ctx, ax, aay, 'A\'', C.purple, 5);
            drawLabel(ctx, ax, aay - 5, 'A\'', C.purple);
          }

          // 连接 A'B
          if (t > 0.5) {
            const ct = (t - 0.5) / 0.5;
            const cx = ax + (bx - ax) * Math.min(ct, 1);
            const cy = aay + (by - aay) * Math.min(ct, 1);
            drawLine(ctx, ax, aay, cx, cy, C.purple, 2, ct > 0.8);
          }

          ctx.restore();
        },
        duration: 1500,
      },
      {
        title: '确定桥位置',
        description: "A'B 与 l₂ 交于 Q，过 Q 作垂线得 P",
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 50, 180, 50, C.gray, 2);
          drawLine(ctx, -180, -50, 180, -50, C.gray, 2);
          drawLabel(ctx, -175, 55, 'l₁', C.gray);
          drawLabel(ctx, -175, -45, 'l₂', C.gray);

          const ax = -80, ay = 120;
          const bx = 80, by = -110;
          const bridgeW = 100;
          const aay = ay - bridgeW;

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawPoint(ctx, ax, aay, 'A\'', C.purple, 5);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by - 5, 'B', C.blue);
          drawLabel(ctx, ax, aay - 5, 'A\'', C.purple);

          // 连接 A'B，与 l₂ 交点 Q
          drawLine(ctx, ax, aay, bx, by, C.purple, 2);
          const qX = ax + (bx - ax) * ((-50 - aay) / (by - aay));
          const qY = -50;
          const pX = qX;
          const pY = 50;

          drawPoint(ctx, qX, qY, 'Q', C.orange, 6);
          drawPoint(ctx, pX, pY, 'P', C.orange, 6);
          drawLabel(ctx, qX, qY - 5, 'Q', C.orange);
          drawLabel(ctx, pX, pY + 5, 'P', C.orange);

          // 桥 PQ
          drawLine(ctx, pX, pY, qX, qY, C.teal, 4);
          drawRightAngle(ctx, [qX, qY], [1, 0], [0, -1], 6, C.teal);

          ctx.restore();
        },
        duration: 1400,
      },
      {
        title: '结论',
        description: 'A→P→Q→B 是最短路径，桥 PQ ⟂ 河岸',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 50, 180, 50, C.gray, 2);
          drawLine(ctx, -180, -50, 180, -50, C.gray, 2);
          drawLabel(ctx, -175, 55, 'l₁', C.gray);
          drawLabel(ctx, -175, -45, 'l₂', C.gray);

          const ax = -80, ay = 120;
          const bx = 80, by = -110;
          const aay = ay - 100;
          const qX = ax + (bx - ax) * ((-50 - aay) / (by - aay));
          const qY = -50;
          const pX = qX;
          const pY = 50;

          // 高亮路径
          drawPath(ctx, [[ax, ay], [pX, pY], [qX, qY], [bx, by]], C.red, 3);

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawPoint(ctx, pX, pY, 'P', C.orange, 6);
          drawPoint(ctx, qX, qY, 'Q', C.orange, 6);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by - 5, 'B', C.blue);
          drawLabel(ctx, pX, pY + 5, 'P', C.orange);
          drawLabel(ctx, qX, qY - 5, 'Q', C.orange);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✅ 最短路径 = A→P→Q→B', C.red, 15, 'center', 'middle', true);
          drawTextCanvas(ctx, w / 2, 48, '平移桥宽 → 连线 → 垂直得桥位', C.gray, 13);
        },
        duration: 1200,
      },
    ],
  },

  // ======== 6. 一定两动（角内） ========
  {
    shortName: '⑥ 一定两动',
    fullTitle: '一定两动（角内）· 三角形周长最小',
    steps: [
      {
        title: '问题设定',
        description: 'A 在角 MON 内部，P 在 OM 上，Q 在 ON 上，求 △APQ 周长最小',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);

          // 角
          const angle1 = Math.PI * 0.6; // OM 方向
          const angle2 = Math.PI * 0.15; // ON 方向
          const len = 170;
          const oX = -50, oY = -30;

          drawLine(ctx, oX, oY, oX + len * Math.cos(angle1), oY + len * Math.sin(angle1), C.gray, 2);
          drawLine(ctx, oX, oY, oX + len * Math.cos(angle2), oY + len * Math.sin(angle2), C.gray, 2);
          drawLabel(ctx, oX - 10, oY - 5, 'O', C.gray);
          drawLabel(ctx, oX + len * Math.cos(angle1) + 5, oY + len * Math.sin(angle1), 'M', C.gray);
          drawLabel(ctx, oX + len * Math.cos(angle2) + 5, oY + len * Math.sin(angle2), 'N', C.gray);

          const ax = -30 + (1 - t) * 20;
          const ay = 50 + (1 - t) * 10;
          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);

          ctx.restore();
          if (t < 0.5) {
            drawTextCanvas(ctx, w / 2, 25, '✨ A 在∠MON 内，找 P、Q 使 △APQ 周长最小', C.gray, 12);
          }
        },
        duration: 1200,
      },
      {
        title: '两次对称',
        description: '作 A 关于 OM、ON 的对称点 A₁、A₂',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);

          const angle1 = Math.PI * 0.6;
          const angle2 = Math.PI * 0.15;
          const len = 170;
          const oX = -50, oY = -30;

          drawLine(ctx, oX, oY, oX + len * Math.cos(angle1), oY + len * Math.sin(angle1), C.gray, 2);
          drawLine(ctx, oX, oY, oX + len * Math.cos(angle2), oY + len * Math.sin(angle2), C.gray, 2);
          drawLabel(ctx, oX - 10, oY - 5, 'O', C.gray);
          drawLabel(ctx, oX + len * Math.cos(angle1) + 5, oY + len * Math.sin(angle1), 'M', C.gray);
          drawLabel(ctx, oX + len * Math.cos(angle2) + 5, oY + len * Math.sin(angle2), 'N', C.gray);

          const ax = -30, ay = 50;
          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);

          // 对称点 A1 (关于 OM)
          const aPos1: [number, number] = [ax - oX, ay - oY];
          const cos1 = Math.cos(angle1), sin1 = Math.sin(angle1);
          const d1 = aPos1[0] * cos1 + aPos1[1] * sin1;
          const proj1: [number, number] = [oX + d1 * cos1, oY + d1 * sin1];
          const a1x = 2 * proj1[0] - ax;
          const a1y = 2 * proj1[1] - ay;

          // 对称点 A2 (关于 ON)
          const cos2 = Math.cos(angle2), sin2 = Math.sin(angle2);
          const d2 = aPos1[0] * cos2 + aPos1[1] * sin2;
          const proj2: [number, number] = [oX + d2 * cos2, oY + d2 * sin2];
          const a2x = 2 * proj2[0] - ax;
          const a2y = 2 * proj2[1] - ay;

          if (t > 0.2) {
            const a1t = Math.min((t - 0.2) / 0.4, 1);
            const ca1x = ax + (a1x - ax) * a1t;
            const ca1y = ay + (a1y - ay) * a1t;
            drawDashedLine(ctx, ax, ay, ca1x, ca1y, C.purple);
            if (a1t >= 1) {
              drawPoint(ctx, a1x, a1y, 'A₁', C.purple, 5);
              drawLabel(ctx, a1x, a1y + 5, 'A₁', C.purple);
            }
          }

          if (t > 0.5) {
            const a2t = Math.min((t - 0.5) / 0.4, 1);
            const ca2x = ax + (a2x - ax) * a2t;
            const ca2y = ay + (a2y - ay) * a2t;
            drawDashedLine(ctx, ax, ay, ca2x, ca2y, C.pink);
            if (a2t >= 1) {
              drawPoint(ctx, a2x, a2y, 'A₂', C.pink, 5);
              drawLabel(ctx, a2x, a2y + 5, 'A₂', C.pink);
            }
          }

          ctx.restore();
        },
        duration: 1600,
      },
      {
        title: '连线',
        description: '连接 A₁A₂，与 OM、ON 交于 P、Q',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);

          const angle1 = Math.PI * 0.6;
          const angle2 = Math.PI * 0.15;
          const len = 170;
          const oX = -50, oY = -30;
          const ax = -30, ay = 50;

          drawLine(ctx, oX, oY, oX + len * Math.cos(angle1), oY + len * Math.sin(angle1), C.gray, 2);
          drawLine(ctx, oX, oY, oX + len * Math.cos(angle2), oY + len * Math.sin(angle2), C.gray, 2);
          drawLabel(ctx, oX - 10, oY - 5, 'O', C.gray);
          drawLabel(ctx, oX + len * Math.cos(angle1) + 5, oY + len * Math.sin(angle1), 'M', C.gray);
          drawLabel(ctx, oX + len * Math.cos(angle2) + 5, oY + len * Math.sin(angle2), 'N', C.gray);

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);

          const aPos1: [number, number] = [ax - oX, ay - oY];
          const cos1 = Math.cos(angle1), sin1 = Math.sin(angle1);
          const d1 = aPos1[0] * cos1 + aPos1[1] * sin1;
          const proj1: [number, number] = [oX + d1 * cos1, oY + d1 * sin1];
          const a1x = 2 * proj1[0] - ax;
          const a1y = 2 * proj1[1] - ay;

          const cos2 = Math.cos(angle2), sin2 = Math.sin(angle2);
          const d2 = aPos1[0] * cos2 + aPos1[1] * sin2;
          const proj2: [number, number] = [oX + d2 * cos2, oY + d2 * sin2];
          const a2x = 2 * proj2[0] - ax;
          const a2y = 2 * proj2[1] - ay;

          drawPoint(ctx, a1x, a1y, 'A₁', C.purple, 5);
          drawPoint(ctx, a2x, a2y, 'A₂', C.pink, 5);
          drawLabel(ctx, a1x, a1y + 5, 'A₁', C.purple);
          drawLabel(ctx, a2x, a2y + 5, 'A₂', C.pink);

          // 连线 A₁A₂
          const ct = Math.min(t * 1.2, 1);
          const cx = a1x + (a2x - a1x) * ct;
          const cy = a1y + (a2y - a1y) * ct;
          drawLine(ctx, a1x, a1y, cx, cy, C.green, 2);

          // 找交点 P (与 OM), Q (与 ON)
          if (ct > 0.8) {
            // 简化的交点计算
            // OM: (oX, oY) to (oX+len*cos1, oY+len*sin1)
            // A1A2 line
            const pX = a1x + (a2x - a1x) * 0.35;
            const pY = a1y + (a2y - a1y) * 0.35;
            const qX = a1x + (a2x - a1x) * 0.75;
            const qY = a1y + (a2y - a1y) * 0.75;

            drawPoint(ctx, pX, pY, 'P', C.orange, 5);
            drawPoint(ctx, qX, qY, 'Q', C.orange, 5);
            drawLabel(ctx, pX, pY + 5, 'P', C.orange);
            drawLabel(ctx, qX, qY + 5, 'Q', C.orange);
            drawDashedLine(ctx, pX, pY, qX, qY, C.green);
          }

          ctx.restore();
        },
        duration: 1500,
      },
      {
        title: '结论',
        description: '△APQ 的最小周长 = A₁A₂',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);

          const angle1 = Math.PI * 0.6;
          const angle2 = Math.PI * 0.15;
          const len = 170;
          const oX = -50, oY = -30;
          const ax = -30, ay = 50;

          drawLine(ctx, oX, oY, oX + len * Math.cos(angle1), oY + len * Math.sin(angle1), C.gray, 2);
          drawLine(ctx, oX, oY, oX + len * Math.cos(angle2), oY + len * Math.sin(angle2), C.gray, 2);
          drawLabel(ctx, oX - 10, oY - 5, 'O', C.gray);

          const aPos1: [number, number] = [ax - oX, ay - oY];
          const cos1 = Math.cos(angle1), sin1 = Math.sin(angle1);
          const d1 = aPos1[0] * cos1 + aPos1[1] * sin1;
          const proj1: [number, number] = [oX + d1 * cos1, oY + d1 * sin1];
          const a1x = 2 * proj1[0] - ax;
          const a1y = 2 * proj1[1] - ay;

          const cos2 = Math.cos(angle2), sin2 = Math.sin(angle2);
          const d2 = aPos1[0] * cos2 + aPos1[1] * sin2;
          const proj2: [number, number] = [oX + d2 * cos2, oY + d2 * sin2];
          const a2x = 2 * proj2[0] - ax;
          const a2y = 2 * proj2[1] - ay;

          const pX = a1x + (a2x - a1x) * 0.35;
          const pY = a1y + (a2y - a1y) * 0.35;
          const qX = a1x + (a2x - a1x) * 0.75;
          const qY = a1y + (a2y - a1y) * 0.75;

          // 高亮路径 A→P→Q→A
          drawPath(ctx, [[ax, ay], [pX, pY], [qX, qY], [ax, ay]], C.red, 3);

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, pX, pY, 'P', C.orange, 6);
          drawPoint(ctx, qX, qY, 'Q', C.orange, 6);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, pX, pY + 5, 'P', C.orange);
          drawLabel(ctx, qX, qY + 5, 'Q', C.orange);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✅ △APQ 周长最小值 = A₁A₂', C.red, 15, 'center', 'middle', true);
          drawTextCanvas(ctx, w / 2, 48, '两次对称 → 连线得交点 P、Q', C.gray, 13);
        },
        duration: 1200,
      },
    ],
  },

  // ======== 7. 四边形周长最小 ========
  {
    shortName: '⑦ 四边形最小',
    fullTitle: '四边形周长最小 · 两定两动',
    steps: [
      {
        title: '问题设定',
        description: 'A、B 固定，P 在 l₁，Q 在 l₂，求四边形 APQB 周长最小',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 40, 180, 40, C.gray, 2);
          drawLine(ctx, -180, -60, 180, -60, C.gray, 2);
          drawLabel(ctx, -175, 45, 'l₁', C.gray);
          drawLabel(ctx, -175, -55, 'l₂', C.gray);

          const ax = -80, ay = 110;
          const bx = 90, by = 100;

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✨ 两定两动：四边形周长最小', C.gray, 13);
        },
        duration: 1000,
      },
      {
        title: '对称变换',
        description: '反射 A 到 l₁ 下方，反射 B 到 l₂ 上方',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 40, 180, 40, C.gray, 2);
          drawLine(ctx, -180, -60, 180, -60, C.gray, 2);
          drawLabel(ctx, -175, 45, 'l₁', C.gray);
          drawLabel(ctx, -175, -55, 'l₂', C.gray);

          const ax = -80, ay = 110;
          const bx = 90, by = 100;

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);

          // A' 关于 l1 (y=40)
          const a1y = 40 - (ay - 40);
          if (t > 0.2) {
            const tt = Math.min((t - 0.2) / 0.35, 1);
            const cy = ay + (a1y - ay) * tt;
            drawDashedLine(ctx, ax, ay, ax, cy, C.purple);
            if (tt >= 1) {
              drawPoint(ctx, ax, a1y, 'A\'', C.purple, 5);
              drawLabel(ctx, ax, a1y - 5, 'A\'', C.purple);
            }
          }

          // B' 关于 l2 (y=-60)
          const b1y = -60 - (by + 60);
          if (t > 0.5) {
            const tt = Math.min((t - 0.5) / 0.4, 1);
            const cy = by + (b1y - by) * tt;
            drawDashedLine(ctx, bx, by, bx, cy, C.pink);
            if (tt >= 1) {
              drawPoint(ctx, bx, b1y, 'B\'', C.pink, 5);
              drawLabel(ctx, bx, b1y + 5, 'B\'', C.pink);
            }
          }

          ctx.restore();
        },
        duration: 1600,
      },
      {
        title: '连线',
        description: '连接 A\'B\'，与 l₁、l₂ 分别交于 P、Q',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 40, 180, 40, C.gray, 2);
          drawLine(ctx, -180, -60, 180, -60, C.gray, 2);
          drawLabel(ctx, -175, 45, 'l₁', C.gray);
          drawLabel(ctx, -175, -55, 'l₂', C.gray);

          const ax = -80, ay = 110;
          const bx = 90, by = 100;
          const a1y = 40 - (ay - 40);
          const b1y = -60 - (by + 60);

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawPoint(ctx, ax, a1y, 'A\'', C.purple, 5);
          drawPoint(ctx, bx, b1y, 'B\'', C.pink, 5);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);
          drawLabel(ctx, ax, a1y - 5, 'A\'', C.purple);
          drawLabel(ctx, bx, b1y + 5, 'B\'', C.pink);

          // 连线 A'B'
          const ct = Math.min(t * 1.3, 1);
          const cx = ax + (bx - ax) * ct;
          const cy = a1y + (b1y - a1y) * ct;
          drawLine(ctx, ax, a1y, cx, cy, C.green, 2);

          if (ct > 0.7) {
            // 交点 P (l1), Q (l2)
            const pX = ax + (bx - ax) * ((40 - a1y) / (b1y - a1y));
            const qX = ax + (bx - ax) * ((-60 - a1y) / (b1y - a1y));
            drawPoint(ctx, pX, 40, 'P', C.orange, 6);
            drawPoint(ctx, qX, -60, 'Q', C.orange, 6);
            drawLabel(ctx, pX, 45, 'P', C.orange);
            drawLabel(ctx, qX, -55, 'Q', C.orange);
          }

          ctx.restore();
        },
        duration: 1500,
      },
      {
        title: '结论',
        description: '四边形 APQB 的最小周长 = A\'B\'',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 40, 180, 40, C.gray, 2);
          drawLine(ctx, -180, -60, 180, -60, C.gray, 2);

          const ax = -80, ay = 110;
          const bx = 90, by = 100;
          const a1y = 40 - (ay - 40);
          const b1y = -60 - (by + 60);

          const pX = ax + (bx - ax) * ((40 - a1y) / (b1y - a1y));
          const qX = ax + (bx - ax) * ((-60 - a1y) / (b1y - a1y));

          // 高亮路径
          drawPath(ctx, [[ax, ay], [pX, 40], [qX, -60], [bx, by]], C.red, 3);

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawPoint(ctx, pX, 40, 'P', C.orange, 6);
          drawPoint(ctx, qX, -60, 'Q', C.orange, 6);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);
          drawLabel(ctx, pX, 45, 'P', C.orange);
          drawLabel(ctx, qX, -55, 'Q', C.orange);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✅ 四边形 APQB 周长最小值 = A\'B\'', C.red, 14, 'center', 'middle', true);
        },
        duration: 1200,
      },
    ],
  },

  // ======== 8. 三角形周长最小 ========
  {
    shortName: '⑧ 三角最小',
    fullTitle: '三角形周长最小 · 两动点在角的两边',
    steps: [
      {
        title: '问题设定',
        description: 'A 在角内部，P 在 l₁，Q 在 l₂，求 △APQ 周长最小',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);

          // 角
          const oX = -30, oY = -20;
          const a1 = Math.PI * 0.55;
          const a2 = Math.PI * 0.1;
          drawLine(ctx, oX, oY, oX + 200 * Math.cos(a1), oY + 200 * Math.sin(a1), C.gray, 2);
          drawLine(ctx, oX, oY, oX + 200 * Math.cos(a2), oY + 200 * Math.sin(a2), C.gray, 2);
          drawLabel(ctx, oX - 12, oY - 5, 'O', C.gray);

          const ax = 20, ay = 60;
          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✨ 角内一定点，两边上求动点 P、Q', C.gray, 13);
        },
        duration: 1000,
      },
      {
        title: '两次对称',
        description: '作 A 关于两条边的对称点 A₁、A₂',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);

          const oX = -30, oY = -20;
          const a1 = Math.PI * 0.55;
          const a2 = Math.PI * 0.1;
          drawLine(ctx, oX, oY, oX + 200 * Math.cos(a1), oY + 200 * Math.sin(a1), C.gray, 2);
          drawLine(ctx, oX, oY, oX + 200 * Math.cos(a2), oY + 200 * Math.sin(a2), C.gray, 2);
          drawLabel(ctx, oX - 12, oY - 5, 'O', C.gray);

          const ax = 20, ay = 60;
          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);

          // A1 关于 OM
          const vx = ax - oX, vy = ay - oY;
          const cos1 = Math.cos(a1), sin1 = Math.sin(a1);
          const d1 = vx * cos1 + vy * sin1;
          const a1x = 2 * (oX + d1 * cos1) - ax;
          const a1y = 2 * (oY + d1 * sin1) - ay;

          const cos2 = Math.cos(a2), sin2 = Math.sin(a2);
          const d2 = vx * cos2 + vy * sin2;
          const a2x = 2 * (oX + d2 * cos2) - ax;
          const a2y = 2 * (oY + d2 * sin2) - ay;

          if (t > 0.2) {
            const tt = Math.min((t - 0.2) / 0.35, 1);
            const cx = ax + (a1x - ax) * tt;
            const cy = ay + (a1y - ay) * tt;
            drawDashedLine(ctx, ax, ay, cx, cy, C.purple);
            if (tt >= 1) {
              drawPoint(ctx, a1x, a1y, 'A₁', C.purple, 5);
              drawLabel(ctx, a1x, a1y + 5, 'A₁', C.purple);
            }
          }

          if (t > 0.5) {
            const tt = Math.min((t - 0.5) / 0.4, 1);
            const cx = ax + (a2x - ax) * tt;
            const cy = ay + (a2y - ay) * tt;
            drawDashedLine(ctx, ax, ay, cx, cy, C.pink);
            if (tt >= 1) {
              drawPoint(ctx, a2x, a2y, 'A₂', C.pink, 5);
              drawLabel(ctx, a2x, a2y + 5, 'A₂', C.pink);
            }
          }

          ctx.restore();
        },
        duration: 1600,
      },
      {
        title: '连线',
        description: '连接 A₁A₂，交点 P、Q 即为所求',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);

          const oX = -30, oY = -20;
          const a1 = Math.PI * 0.55;
          const a2 = Math.PI * 0.1;
          drawLine(ctx, oX, oY, oX + 200 * Math.cos(a1), oY + 200 * Math.sin(a1), C.gray, 2);
          drawLine(ctx, oX, oY, oX + 200 * Math.cos(a2), oY + 200 * Math.sin(a2), C.gray, 2);
          drawLabel(ctx, oX - 12, oY - 5, 'O', C.gray);

          const ax = 20, ay = 60;
          const vx = ax - oX, vy = ay - oY;
          const cos1 = Math.cos(a1), sin1 = Math.sin(a1);
          const d1 = vx * cos1 + vy * sin1;
          const a1x = 2 * (oX + d1 * cos1) - ax;
          const a1y = 2 * (oY + d1 * sin1) - ay;

          const cos2 = Math.cos(a2), sin2 = Math.sin(a2);
          const d2 = vx * cos2 + vy * sin2;
          const a2x = 2 * (oX + d2 * cos2) - ax;
          const a2y = 2 * (oY + d2 * sin2) - ay;

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, a1x, a1y, 'A₁', C.purple, 5);
          drawPoint(ctx, a2x, a2y, 'A₂', C.pink, 5);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, a1x, a1y + 5, 'A₁', C.purple);
          drawLabel(ctx, a2x, a2y + 5, 'A₂', C.pink);

          const ct = Math.min(t * 1.2, 1);
          const cx = a1x + (a2x - a1x) * ct;
          const cy = a1y + (a2y - a1y) * ct;
          drawLine(ctx, a1x, a1y, cx, cy, C.green, 2);

          if (ct > 0.7) {
            const pX = a1x + (a2x - a1x) * 0.3;
            const pY = a1y + (a2y - a1y) * 0.3;
            const qX = a1x + (a2x - a1x) * 0.65;
            const qY = a1y + (a2y - a1y) * 0.65;
            drawPoint(ctx, pX, pY, 'P', C.orange, 5);
            drawPoint(ctx, qX, qY, 'Q', C.orange, 5);
            drawLabel(ctx, pX, pY + 5, 'P', C.orange);
            drawLabel(ctx, qX, qY + 5, 'Q', C.orange);
          }

          ctx.restore();
        },
        duration: 1500,
      },
      {
        title: '结论',
        description: '△APQ 的最小周长 = A₁A₂',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);

          const oX = -30, oY = -20;
          const a1 = Math.PI * 0.55;
          const a2 = Math.PI * 0.1;
          drawLine(ctx, oX, oY, oX + 200 * Math.cos(a1), oY + 200 * Math.sin(a1), C.gray, 2);
          drawLine(ctx, oX, oY, oX + 200 * Math.cos(a2), oY + 200 * Math.sin(a2), C.gray, 2);

          const ax = 20, ay = 60;
          const vx = ax - oX, vy = ay - oY;
          const cos1 = Math.cos(a1), sin1 = Math.sin(a1);
          const d1 = vx * cos1 + vy * sin1;
          const a1x = 2 * (oX + d1 * cos1) - ax;
          const a1y = 2 * (oY + d1 * sin1) - ay;

          const cos2 = Math.cos(a2), sin2 = Math.sin(a2);
          const d2 = vx * cos2 + vy * sin2;
          const a2x = 2 * (oX + d2 * cos2) - ax;
          const a2y = 2 * (oY + d2 * sin2) - ay;

          const pX = a1x + (a2x - a1x) * 0.3;
          const pY = a1y + (a2y - a1y) * 0.3;
          const qX = a1x + (a2x - a1x) * 0.65;
          const qY = a1y + (a2y - a1y) * 0.65;

          drawPath(ctx, [[ax, ay], [pX, pY], [qX, qY], [ax, ay]], C.red, 3);

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, pX, pY, 'P', C.orange, 6);
          drawPoint(ctx, qX, qY, 'Q', C.orange, 6);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, pX, pY + 5, 'P', C.orange);
          drawLabel(ctx, qX, qY + 5, 'Q', C.orange);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✅ △APQ 周长最小值 = A₁A₂', C.red, 15, 'center', 'middle', true);
          drawTextCanvas(ctx, w / 2, 48, '两次对称展开 → 折线变直线', C.gray, 13);
        },
        duration: 1200,
      },
    ],
  },

  // ======== 9. 定长平移型 ========
  {
    shortName: '⑨ 定长平移',
    fullTitle: '定长平移型 · PQ = 定值',
    steps: [
      {
        title: '问题设定',
        description: 'A、B 固定，PQ = 定长，P、Q 在直线 l 上',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          const ax = -70, ay = 90;
          const bx = 90, by = 80;

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);

          // 定长标记
          if (t > 0.5) {
            const lx = -30;
            drawLine(ctx, lx, -8, lx + 40, -8, C.teal, 3);
            drawLabel(ctx, lx + 20, -12, 'PQ = 定值 d', C.teal);
          }

          ctx.restore();
          if (t < 0.5) {
            drawTextCanvas(ctx, w / 2, 25, '✨ PQ = 定值，在 l 上滑动', C.gray, 13);
          }
        },
        duration: 1200,
      },
      {
        title: '先平移后对称',
        description: '将 A 平移定长至 A\'，再作 A\' 关于 l 的对称点 A"',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          const ax = -70, ay = 90;
          const bx = 90, by = 80;
          const d = 50; // 定长

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);

          // A' = A 向右平移 d
          const aax = ax + d;
          if (t > 0.2) {
            const tt = Math.min((t - 0.2) / 0.3, 1);
            const cx = ax + d * tt;
            drawDashedLine(ctx, ax, ay, cx, ay, C.purple);
            if (tt >= 1) {
              drawPoint(ctx, aax, ay, 'A\'', C.purple, 5);
              drawLabel(ctx, aax, ay + 5, 'A\'', C.purple);
            }
          }

          // A" = A' 关于 l 对称
          if (t > 0.5) {
            const tt = Math.min((t - 0.5) / 0.4, 1);
            const cy = ay * (1 - tt);
            drawDashedLine(ctx, aax, ay, aax, cy, C.pink);
            if (tt >= 1) {
              drawPoint(ctx, aax, -ay, 'A"', C.pink, 5);
              drawLabel(ctx, aax, -ay - 5, 'A"', C.pink);
            }
          }

          ctx.restore();
        },
        duration: 1600,
      },
      {
        title: '连线',
        description: '连接 A"B，与 l 交于 Q，向左平移定长得 P',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          const ax = -70, ay = 90;
          const bx = 90, by = 80;
          const d = 50;
          const aax = ax + d;
          const aay = -ay;

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawPoint(ctx, aax, ay, 'A\'', C.purple, 5);
          drawPoint(ctx, aax, aay, 'A"', C.pink, 5);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);
          drawLabel(ctx, aax, ay + 5, 'A\'', C.purple);
          drawLabel(ctx, aax, aay - 5, 'A"', C.pink);

          // 连线 A"B
          const ct = Math.min(t * 1.2, 1);
          const cx = aax + (bx - aax) * ct;
          const cy = aay + (by - aay) * ct;
          drawLine(ctx, aax, aay, cx, cy, C.green, 2);

          if (ct > 0.6) {
            // 交点 Q
            const qX = aax + (bx - aax) * (aay / (aay - by));
            const pX = qX - d;
            drawPoint(ctx, qX, 0, 'Q', C.orange, 6);
            drawPoint(ctx, pX, 0, 'P', C.orange, 6);
            drawLabel(ctx, qX, -5, 'Q', C.orange);
            drawLabel(ctx, pX, -5, 'P', C.orange);
            // 定长标记
            drawLine(ctx, pX, 8, qX, 8, C.teal, 2);
          }

          ctx.restore();
        },
        duration: 1600,
      },
      {
        title: '结论',
        description: 'A→P→Q→B 最短，其中 PQ = 定值',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          const ax = -70, ay = 90;
          const bx = 90, by = 80;
          const d = 50;
          const aax = ax + d;
          const aay = -ay;
          const qX = aax + (bx - aax) * (aay / (aay - by));
          const pX = qX - d;

          drawPath(ctx, [[ax, ay], [pX, 0], [qX, 0], [bx, by]], C.red, 3);

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawPoint(ctx, pX, 0, 'P', C.orange, 6);
          drawPoint(ctx, qX, 0, 'Q', C.orange, 6);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);
          drawLabel(ctx, pX, -5, 'P', C.orange);
          drawLabel(ctx, qX, -5, 'Q', C.orange);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✅ A→P→Q→B 最短路径', C.red, 15, 'center', 'middle', true);
          drawTextCanvas(ctx, w / 2, 48, '先平移定长 → 再对称 → 连线', C.gray, 13);
        },
        duration: 1200,
      },
    ],
  },

  // ======== 10. 三边型 ========
  {
    shortName: '⑩ 三边型',
    fullTitle: '三边型 · 三角形边上的动点',
    steps: [
      {
        title: '问题设定',
        description: '在 △ABC 中，P 在 BC 边上，求使 AP+PQ 最小的折线',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);

          // 三角形 ABC
          const pts: [number, number][] = [[-100, 70], [120, 60], [0, -90]];
          drawPolygon(ctx, pts, 'rgba(59,130,246,0.06)', C.blue, 2);

          drawPoint(ctx, pts[0][0], pts[0][1], 'A', C.blue);
          drawPoint(ctx, pts[1][0], pts[1][1], 'B', C.blue);
          drawPoint(ctx, pts[2][0], pts[2][1], 'C', C.blue);
          drawLabel(ctx, pts[0][0], pts[0][1] + 5, 'A', C.blue);
          drawLabel(ctx, pts[1][0], pts[1][1] + 5, 'B', C.blue);
          drawLabel(ctx, pts[2][0], pts[2][1] - 5, 'C', C.blue);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✨ △ABC 中找最短折线', C.gray, 13);
        },
        duration: 1000,
      },
      {
        title: '对称构造',
        description: '反射顶点构造折线展开',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);

          const pts: [number, number][] = [[-100, 70], [120, 60], [0, -90]];
          drawPolygon(ctx, pts, 'rgba(59,130,246,0.06)', C.blue, 2);

          drawPoint(ctx, pts[0][0], pts[0][1], 'A', C.blue);
          drawPoint(ctx, pts[1][0], pts[1][1], 'B', C.blue);
          drawPoint(ctx, pts[2][0], pts[2][1], 'C', C.blue);
          drawLabel(ctx, pts[0][0], pts[0][1] + 5, 'A', C.blue);
          drawLabel(ctx, pts[1][0], pts[1][1] + 5, 'B', C.blue);
          drawLabel(ctx, pts[2][0], pts[2][1] - 5, 'C', C.blue);

          // A' 关于 BC
          const bX = pts[1][0], bY = pts[1][1];
          const cX = pts[2][0], cY = pts[2][1];
          const aX = pts[0][0], aY = pts[0][1];

          // BC 向量
          const vx = cX - bX, vy = cY - bY;
          const len2 = vx * vx + vy * vy;
          const tParam = ((aX - bX) * vx + (aY - bY) * vy) / len2;
          const ppx = bX + tParam * vx;
          const ppy = bY + tParam * vy;
          const a1x = 2 * ppx - aX;
          const a1y = 2 * ppy - aY;

          if (t > 0.2) {
            const tt = Math.min((t - 0.2) / 0.6, 1);
            const cx = aX + (a1x - aX) * tt;
            const cy = aY + (a1y - aY) * tt;
            drawDashedLine(ctx, aX, aY, cx, cy, C.purple);
            if (tt >= 1) {
              drawPoint(ctx, a1x, a1y, 'A\'', C.purple, 5);
              drawLabel(ctx, a1x, a1y + 5, 'A\'', C.purple);
              // 连线 A'B 和 A'C
              drawLine(ctx, a1x, a1y, bX, bY, C.green, 1.5);
              drawLine(ctx, a1x, a1y, cX, cY, C.green, 1.5);
            }
          }

          ctx.restore();
        },
        duration: 1500,
      },
      {
        title: '折线展开',
        description: '对称点连线即为最短路径',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);

          const pts: [number, number][] = [[-100, 70], [120, 60], [0, -90]];
          drawPolygon(ctx, pts, 'rgba(59,130,246,0.06)', C.blue, 2);

          const bX = pts[1][0], bY = pts[1][1];
          const cX = pts[2][0], cY = pts[2][1];
          const aX = pts[0][0], aY = pts[0][1];
          const vx = cX - bX, vy = cY - bY;
          const len2 = vx * vx + vy * vy;
          const tParam = ((aX - bX) * vx + (aY - bY) * vy) / len2;
          const ppx = bX + tParam * vx;
          const ppy = bY + tParam * vy;
          const a1x = 2 * ppx - aX;
          const a1y = 2 * ppy - aY;

          // 找 P 点（在 BC 上的最优位置）
          const pX = ppx;
          const pY = ppy;

          // 高亮路径 A→P→A'
          drawPath(ctx, [[aX, aY], [pX, pY], [a1x, a1y]], C.red, 3);

          drawPoint(ctx, pts[0][0], pts[0][1], 'A', C.blue);
          drawPoint(ctx, pts[1][0], pts[1][1], 'B', C.blue);
          drawPoint(ctx, pts[2][0], pts[2][1], 'C', C.blue);
          drawPoint(ctx, pX, pY, 'P', C.orange, 7);
          drawPoint(ctx, a1x, a1y, 'A\'', C.purple, 5);
          drawLabel(ctx, pts[0][0], pts[0][1] + 5, 'A', C.blue);
          drawLabel(ctx, pts[1][0], pts[1][1] + 5, 'B', C.blue);
          drawLabel(ctx, pts[2][0], pts[2][1] - 5, 'C', C.blue);
          drawLabel(ctx, pX, pY - 5, 'P', C.orange);
          drawLabel(ctx, a1x, a1y + 5, 'A\'', C.purple);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✅ 折线路径最短 = AP + PA\' = AA\'', C.red, 14, 'center', 'middle', true);
        },
        duration: 1200,
      },
    ],
  },

  // ======== 11. 加权系数型 ========
  {
    shortName: '⑪ 加权系数',
    fullTitle: '加权系数型 · PA + k·PB (k≠1)',
    steps: [
      {
        title: '问题设定',
        description: '求 PA + k·PB 的最小值（k≠1），带加权系数',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          const ax = -60, ay = 80;
          const bx = 80, by = 90;

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);

          // 系数标记
          drawLabel(ctx, bx + 5, by - 10, '(权重 k)', C.purple);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✨ 加权系数：PA + k·PB 最小值', C.gray, 13);
        },
        duration: 1000,
      },
      {
        title: '三角构造',
        description: '利用三角函数构造 k 相关的旋转与缩放',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          const ax = -60, ay = 80;
          const bx = 80, by = 90;

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);

          // 构造旋转缩放
          if (t > 0.2) {
            const k = 1.5;
            const theta = Math.atan2(by, bx);

            // B 的变换路径
            const r = Math.sqrt(bx * bx + by * by) * (1 / k);
            const btx = r * Math.cos(theta);
            const bty = r * Math.sin(theta);

            const tt = Math.min((t - 0.2) / 0.6, 1);
            const cx = bx + (btx - bx) * tt;
            const cy = by + (bty - by) * tt;
            drawDashedLine(ctx, bx, by, cx, cy, C.purple);

            if (tt >= 1) {
              drawPoint(ctx, btx, bty, 'B\'', C.purple, 5);
              drawLabel(ctx, btx, bty + 5, 'B\'', C.purple);
              drawLine(ctx, ax, ay, btx, bty, C.green, 2);
            }

            // 角标记
            if (t > 0.6) {
              const arcR = 20;
              ctx.save();
              ctx.strokeStyle = C.teal;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(0, 0, arcR, 0, theta * tt, false);
              ctx.stroke();
              ctx.restore();
              drawLabel(ctx, arcR * Math.cos(theta * 0.4), arcR * Math.sin(theta * 0.4) - 3, 'θ', C.teal);
            }
          }

          ctx.restore();
          if (t < 0.3) {
            drawTextCanvas(ctx, w / 2, 25, '🔧 利用三角函数旋转缩放变换', C.gray, 12);
          }
        },
        duration: 1800,
      },
      {
        title: '求解',
        description: '构造后转化为普通最短路径问题',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, 0, 180, 0, C.gray, 2);

          const ax = -60, ay = 80;
          const bx = 80, by = 90;
          const k = 1.5;
          const theta = Math.atan2(by, bx);
          const r = Math.sqrt(bx * bx + by * by) * (1 / k);
          const btx = r * Math.cos(theta);
          const bty = r * Math.sin(theta);

          // 交点 P
          const pX = ax + (btx - ax) * (ay / (ay - bty));
          const pY = 0;

          drawPath(ctx, [[ax, ay], [pX, pY], [bx, by]], C.red, 3);

          drawPoint(ctx, ax, ay, 'A', C.blue);
          drawPoint(ctx, bx, by, 'B', C.blue);
          drawPoint(ctx, pX, pY, 'P', C.orange, 7);
          drawPoint(ctx, btx, bty, 'B\'', C.purple, 5);
          drawLabel(ctx, ax, ay + 5, 'A', C.blue);
          drawLabel(ctx, bx, by + 5, 'B', C.blue);
          drawLabel(ctx, pX, pY - 5, 'P', C.orange);
          drawLabel(ctx, btx, bty + 5, 'B\'', C.purple);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✅ PA + k·PB 的最小值', C.red, 15, 'center', 'middle', true);
          drawTextCanvas(ctx, w / 2, 48, '三角构造转化 → 普通对称求解', C.gray, 13);
        },
        duration: 1200,
      },
    ],
  },

  // ======== 12. 圆与最值 ========
  {
    shortName: '⑫ 圆与最值',
    fullTitle: '圆与最值 · 圆上点到直线的最短距离',
    steps: [
      {
        title: '问题设定',
        description: '圆 O 与直线 l 相离，求圆上点 P 到 l 上点 Q 的最短距离',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, -40, 180, -40, C.gray, 2);
          drawLabel(ctx, -175, -35, 'l', C.gray);

          // 圆
          const ox = 0, oy = 70, radius = 50;
          ctx.save();
          ctx.strokeStyle = C.blue;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ox, oy, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          drawPoint(ctx, ox, oy, 'O', C.blue);
          drawLabel(ctx, ox, oy + 5, 'O', C.blue);

          // 半径
          if (t > 0.4) {
            const ang = -Math.PI / 2 + t * 0.3;
            const px = ox + radius * Math.cos(ang);
            const py = oy + radius * Math.sin(ang);
            drawLine(ctx, ox, oy, px, py, C.lBlue, 1.5);
          }

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✨ 圆与直线距离最值', C.gray, 13);
        },
        duration: 1200,
      },
      {
        title: '垂线构造',
        description: '过圆心 O 作 l 的垂线，垂足为 H',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, -40, 180, -40, C.gray, 2);
          drawLabel(ctx, -175, -35, 'l', C.gray);

          const ox = 0, oy = 70, radius = 50;

          ctx.save();
          ctx.strokeStyle = C.blue;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ox, oy, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          drawPoint(ctx, ox, oy, 'O', C.blue);
          drawLabel(ctx, ox, oy + 5, 'O', C.blue);

          // 垂线 OH
          if (t > 0.2) {
            const tt = Math.min((t - 0.2) / 0.4, 1);
            const hy = oy + (-40 - oy) * tt;
            drawDashedLine(ctx, ox, oy, ox, hy, C.purple);
            drawRightAngle(ctx, [ox, -40], [1, 0], [0, 1], 6, C.purple);
            if (tt >= 1) {
              drawPoint(ctx, ox, -40, 'H', C.purple, 5);
              drawLabel(ctx, ox, -35, 'H', C.purple);
            }
          }

          ctx.restore();
        },
        duration: 1400,
      },
      {
        title: '找最值点',
        description: 'OH 与圆的交点 P₁（最近）和 P₂（最远）',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          drawLine(ctx, -180, -40, 180, -40, C.gray, 2);

          const ox = 0, oy = 70, radius = 50;

          ctx.save();
          ctx.strokeStyle = C.blue;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ox, oy, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          drawPoint(ctx, ox, oy, 'O', C.blue);
          drawLabel(ctx, ox, oy + 5, 'O', C.blue);

          // 垂线
          drawDashedLine(ctx, ox, oy, ox, -40, C.purple);

          // 两个交点
          const p1y = oy - radius;
          const p2y = oy + radius;

          drawPoint(ctx, ox, p1y, 'P₁', C.orange, 6);
          drawPoint(ctx, ox, p2y, 'P₂', C.orange, 6);
          drawPoint(ctx, ox, -40, 'H', C.purple, 5);
          drawLabel(ctx, ox, p1y - 5, 'P₁', C.orange);
          drawLabel(ctx, ox, p2y + 5, 'P₂', C.orange);
          drawLabel(ctx, ox, -35, 'H', C.purple);

          // 最短路径高亮: P₁→H
          drawPath(ctx, [[ox, p1y], [ox, -40]], C.red, 3);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✅ 最短距离 = |OH| - r', C.red, 15, 'center', 'middle', true);
          drawTextCanvas(ctx, w / 2, 48, '过圆心作垂线 → 圆上近点即最值点', C.gray, 13);
        },
        duration: 1200,
      },
    ],
  },

  // ======== 13. 二次函数与最值 ========
  {
    shortName: '⑬ 二次函数',
    fullTitle: '二次函数与最值 · 抛物线背景下的坐标最值',
    steps: [
      {
        title: '问题设定',
        description: '抛物线 y = ax² + bx + c 中，求某点到直线的最短距离',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          // 抛物线 y = 0.008x² - 30
          ctx.save();
          ctx.strokeStyle = C.blue;
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let px = -150; px <= 150; px += 2) {
            const py = 0.008 * px * px - 30;
            if (py < -140 || py > 140) continue;
            if (px === -150) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.restore();

          // 直线
          drawLine(ctx, -180, 60, 180, 60, C.gray, 2);
          drawLabel(ctx, -175, 65, 'l', C.gray);

          // 顶点
          drawPoint(ctx, 0, -30, 'V', C.blue, 5);
          drawLabel(ctx, 0, -25, 'V', C.blue);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✨ 抛物线与直线的最值问题', C.gray, 13);
        },
        duration: 1200,
      },
      {
        title: '平行切线法',
        description: '作直线 l 的平行线与抛物线相切，切点即最值点',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          // 抛物线
          ctx.save();
          ctx.strokeStyle = C.blue;
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let px = -150; px <= 150; px += 2) {
            const py = 0.008 * px * px - 30;
            if (py < -140 || py > 140) continue;
            if (px === -150) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.restore();

          drawLine(ctx, -180, 60, 180, 60, C.gray, 2);
          drawLabel(ctx, -175, 65, 'l', C.gray);

          // 平行切线（动画）
          if (t > 0.2) {
            const tt = Math.min((t - 0.2) / 0.5, 1);
            const yOff = 60 - (60 + 30) * tt;
            const ly = 60 + (yOff - 60) * tt;

            ctx.save();
            ctx.strokeStyle = C.purple;
            ctx.lineWidth = 2;
            if (tt < 1) ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(-180, ly);
            ctx.lineTo(180, ly);
            ctx.stroke();
            ctx.restore();

            // 切点
            if (tt >= 1) {
              const ty = -30;
              drawPoint(ctx, 0, ty, 'T', C.orange, 7);
              drawLabel(ctx, 0, ty + 5, 'T（切点）', C.orange);
              drawDashedLine(ctx, 0, ty, 0, 60, C.green);
            }
          }

          ctx.restore();
        },
        duration: 1600,
      },
      {
        title: '结论',
        description: '切线 T 到直线 l 的距离即为最小值',
        draw(ctx, w, h, t) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.scale(1, -1);
          clearBackground(ctx, w, h);
          drawAxis(ctx, w, h);

          // 抛物线
          ctx.save();
          ctx.strokeStyle = C.blue;
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let px = -150; px <= 150; px += 2) {
            const py = 0.008 * px * px - 30;
            if (py < -140 || py > 140) continue;
            if (px === -150) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.restore();

          drawLine(ctx, -180, 60, 180, 60, C.gray, 2);

          // 切线
          ctx.save();
          ctx.strokeStyle = C.purple;
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(-180, -30);
          ctx.lineTo(180, -30);
          ctx.stroke();
          ctx.restore();

          // 高亮垂线段
          drawPath(ctx, [[0, -30], [0, 60]], C.red, 3);

          drawPoint(ctx, 0, -30, 'T', C.orange, 7);
          drawPoint(ctx, 0, 60, 'Q', C.orange, 6);
          drawLabel(ctx, 0, -25, 'T', C.orange);
          drawLabel(ctx, 0, 65, 'Q', C.orange);

          ctx.restore();
          drawTextCanvas(ctx, w / 2, 25, '✅ 最小距离 = 切线到直线 l 的垂直距离', C.red, 14, 'center', 'middle', true);
          drawTextCanvas(ctx, w / 2, 48, '平行切线法 → 切点即抛物线上的最值点', C.gray, 12);
        },
        duration: 1200,
      },
    ],
  },
];

/* ========= 主组件 ========= */
export default function GeneralHorseDrinking() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scenario = SCENARIOS[activeIndex];

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* 场景选择器 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          marginBottom: 12,
          justifyContent: 'center',
        }}
      >
        {SCENARIOS.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            style={{
              padding: '4px 10px',
              fontSize: 12,
              fontWeight: i === activeIndex ? 600 : 400,
              border: `1px solid ${i === activeIndex ? '#3B82F6' : '#e2e8f0'}`,
              borderRadius: 6,
              background: i === activeIndex ? '#EFF6FF' : '#fff',
              color: i === activeIndex ? '#2563EB' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {s.shortName}
          </button>
        ))}
      </div>

      {/* 场景全称 */}
      <div
        style={{
          textAlign: 'center',
          fontSize: 14,
          fontWeight: 600,
          color: '#1e293b',
          marginBottom: 8,
        }}
      >
        {scenario.fullTitle}
      </div>

      {/* 动画播放器 */}
      <AnimationPlayer steps={scenario.steps} autoPlay={false} />
    </div>
  );
}
