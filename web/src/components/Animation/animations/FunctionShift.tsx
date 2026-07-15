/**
 * FunctionShift — 二次函数平移动画
 *
 * 演示 y = x² → y = (x - h)² + k 的平移过程
 * 步骤：
 *   1. 画出基础抛物线 y = x²
 *   2. 向右平移 h 个单位
 *   3. 向上平移 k 个单位
 *   4. 完成
 */
import AnimationPlayer from '../AnimationPlayer';
import type { AnimationStep } from '../AnimationPlayer';

function gridLines(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 0.5;
  const ox = w / 2, oy = h / 2;
  for (let x = -200; x <= 200; x += 25) {
    ctx.beginPath();
    ctx.moveTo(ox + x, 10);
    ctx.lineTo(ox + x, h - 10);
    ctx.stroke();
  }
  for (let y = -200; y <= 200; y += 25) {
    ctx.beginPath();
    ctx.moveTo(10, oy + y);
    ctx.lineTo(w - 10, oy + y);
    ctx.stroke();
  }
}

function drawAxes(ctx: CanvasRenderingContext2D, w: number, h: number, scale: number) {
  const ox = w / 2, oy = h / 2;
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, oy);
  ctx.lineTo(w - 20, oy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ox, 20);
  ctx.lineTo(ox, h - 20);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('x', w - 25, oy + 20);
  ctx.fillText('y', ox + 20, 25);
  ctx.fillText('O', ox - 12, oy + 18);

  // Scale marks
  for (let i = -5; i <= 5; i++) {
    if (i === 0) continue;
    const x = ox + i * scale;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, oy - 4);
    ctx.lineTo(x, oy + 4);
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(i), x, oy + 16);

    const y = oy - i * scale;
    ctx.beginPath();
    ctx.moveTo(ox - 4, y);
    ctx.lineTo(ox + 4, y);
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'right';
    ctx.fillText(String(i), ox - 8, y + 4);
    ctx.textAlign = 'center';
  }
}

function plotParabola(
  ctx: CanvasRenderingContext2D,
  ox: number, oy: number, scale: number,
  hShift: number, vShift: number,
  color: string,
  alpha: number,
  label: string,
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  let first = true;
  for (let px = -scale * 5; px <= scale * 5; px += 2) {
    const x = px / scale;
    const y = (x - hShift) ** 2 + vShift;
    const sx = ox + x * scale;
    const sy = oy - y * scale;
    if (sy < 10 || sy > 380) { first = true; continue; }
    if (first) { ctx.moveTo(sx, sy); first = false; }
    else ctx.lineTo(sx, sy);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Label
  ctx.fillStyle = color;
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(label, ox + scale * 2.5, 30);
}

export default function FunctionShift() {
  const h = 2; // 向右平移 2
  const k = 3; // 向上平移 3
  const scale = 40;

  const steps: AnimationStep[] = [
    {
      title: '基础抛物线 y = x²',
      description: '先看原始曲线，顶点在原点',
      duration: 1200,
      draw: (ctx, w, hC) => {
        const ox = w / 2, oy = hC / 2;
        gridLines(ctx, w, hC);
        drawAxes(ctx, w, hC, scale);
        plotParabola(ctx, ox, oy, scale, 0, 0, '#10B981', 1, 'y = x²');
      },
    },
    {
      title: `向右平移 ${h} 个单位 y = (x - ${h})²`,
      description: 'h > 0 时抛物线向右平移',
      duration: 1500,
      draw: (ctx, w, hC, t) => {
        const ox = w / 2, oy = hC / 2;
        gridLines(ctx, w, hC);
        drawAxes(ctx, w, hC, scale);

        // 原始（淡）
        plotParabola(ctx, ox, oy, scale, 0, 0, '#94a3b8', 0.3, '');

        // 平移中的抛物线
        const currentH = h * ease(t);
        plotParabola(ctx, ox, oy, scale, currentH, 0, '#3B82F6', 1,
          t < 1 ? '' : `y = (x - ${h})²`);

        // 箭头指示平移方向
        if (t > 0 && t < 1) {
          const arrowY = oy - scale * 0.5;
          ctx.strokeStyle = '#3B82F6';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          ctx.moveTo(ox, arrowY);
          ctx.lineTo(ox + currentH * scale, arrowY);
          ctx.stroke();
          ctx.setLineDash([]);

          // 箭头
          const ax = ox + currentH * scale;
          ctx.fillStyle = '#3B82F6';
          ctx.beginPath();
          ctx.moveTo(ax, arrowY);
          ctx.lineTo(ax - 8, arrowY - 4);
          ctx.lineTo(ax - 8, arrowY + 4);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#3B82F6';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`h = ${(currentH).toFixed(1)}`, ox + currentH * scale / 2, arrowY - 10);
        }
      },
    },
    {
      title: `向上平移 ${k} 个单位 y = (x - ${h})² + ${k}`,
      description: 'k > 0 时抛物线向上平移',
      duration: 1500,
      draw: (ctx, w, hC, t) => {
        const ox = w / 2, oy = hC / 2;
        gridLines(ctx, w, hC);
        drawAxes(ctx, w, hC, scale);

        // 原始（淡）
        plotParabola(ctx, ox, oy, scale, 0, 0, '#94a3b8', 0.2, '');
        // 水平平移后的位置（淡）
        plotParabola(ctx, ox, oy, scale, h, 0, '#93c5fd', 0.3, '');

        // 最终位置
        const currentK = k * ease(t);
        plotParabola(ctx, ox, oy, scale, h, currentK, '#EF4444', 1,
          t < 1 ? '' : `y = (x - ${h})² + ${k}`);

        // 箭头指示垂直平移
        if (t > 0 && t < 1) {
          const arrowX = ox + h * scale;
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          ctx.moveTo(arrowX, oy);
          ctx.lineTo(arrowX, oy - currentK * scale);
          ctx.stroke();
          ctx.setLineDash([]);

          const ay = oy - currentK * scale;
          ctx.fillStyle = '#EF4444';
          ctx.beginPath();
          ctx.moveTo(arrowX, ay);
          ctx.lineTo(arrowX - 4, ay + 8);
          ctx.lineTo(arrowX + 4, ay + 8);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#EF4444';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`k = ${(currentK).toFixed(1)}`, arrowX + 25, oy - currentK * scale / 2);
        }
      },
    },
    {
      title: '完成！对比平移前后',
      description: `顶点从 (0,0) → (${h}, ${k})`,
      duration: 1000,
      draw: (ctx, w, hC) => {
        const ox = w / 2, oy = hC / 2;
        gridLines(ctx, w, hC);
        drawAxes(ctx, w, hC, scale);
        plotParabola(ctx, ox, oy, scale, 0, 0, '#94a3b8', 0.35, 'y = x²（原始）');
        plotParabola(ctx, ox, oy, scale, h, k, '#EF4444', 1, `y = (x - ${h})² + ${k}（平移后）`);

        // 顶点标记
        const vertices: [number, number, string, string][] = [
          [0, 0, '(0,0)', '#94a3b8'],
          [h, k, `(${h},${k})`, '#EF4444'],
        ];
        for (const [vx, vy, label, color] of vertices) {
          const px = ox + vx * scale, py = oy - vy * scale;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = color;
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(label, px, py - 12);
        }

        // 平移箭头
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + h * scale, oy - k * scale);
        ctx.stroke();
        ctx.setLineDash([]);
      },
    },
  ];

  return <AnimationPlayer steps={steps} width={560} height={400} />;
}

function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
