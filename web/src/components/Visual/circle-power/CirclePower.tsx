/**
 * CirclePower — 圆幂三大定理交互证明图
 *
 * 图示三种情形：
 *  ① 相交弦定理（P在圆内）：PA·PB = PC·PD
 *  ② 切割线定理（P在圆外+切线）：PT² = PA·PB
 *  ③ 割线定理（P在圆外）：PA·PB = PC·PD
 *
 * 通过 Canvas 画圆和辅助线，标注线段和角度
 */
import { useRef, useEffect, useState } from 'react';

type TheoremType = 'intersecting' | 'tangent' | 'secant';

interface Props {
  theorem?: TheoremType;
  /** 自动轮播所有三种 */
  autoRotate?: boolean;
}

const THEOREM_INFO: Record<TheoremType, { title: string; formula: string; desc: string }> = {
  intersecting: {
    title: '相交弦定理',
    formula: 'PA · PB = PC · PD',
    desc: '圆内两弦相交，交点分两弦所得线段之积相等',
  },
  tangent: {
    title: '切割线定理',
    formula: 'PT² = PA · PB',
    desc: '切线长是割线与圆外部分的比例中项',
  },
  secant: {
    title: '割线定理',
    formula: 'PA · PB = PC · PD',
    desc: '两条割线与圆相交，圆外部分之积相等',
  },
};

export default function CirclePower({ theorem = 'intersecting', autoRotate = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [current, setCurrent] = useState<TheoremType>(theorem);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    if (!autoRotate) return;
    const types: TheoremType[] = ['intersecting', 'tangent', 'secant'];
    let i = types.indexOf(current);
    const interval = setInterval(() => {
      i = (i + 1) % types.length;
      setCurrent(types[i]);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoRotate, current]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = 500, h = 400;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx = w / 2, cy = h / 2 - 20;
    const r = 130;
    let alpha = 0;
    const animate = () => {
      alpha = Math.min(alpha + 0.03, 1);
      draw(ctx, w, h, cx, cy, r, current, alpha);
      if (alpha < 1) animRef.current = requestAnimationFrame(animate);
    };
    alpha = 0;
    animate();

    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [current]);

  const info = THEOREM_INFO[current];

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef}
        style={{ width: 500, height: 400, maxWidth: '100%', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}
      />
      <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginTop: 8 }}>
        {info.title}
      </div>
      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#3B82F6', marginTop: 4 }}>
        {info.formula}
      </div>
      <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
        {info.desc}
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'center' }}>
        {(['intersecting', 'tangent', 'secant'] as TheoremType[]).map(t => (
          <button key={t} onClick={() => setCurrent(t)}
            style={{
              padding: '4px 12px', fontSize: 12, borderRadius: 6,
              border: `1px solid ${current === t ? '#3B82F6' : '#d1d5db'}`,
              background: current === t ? '#eff6ff' : '#fff',
              color: current === t ? '#3B82F6' : '#64748b',
              cursor: 'pointer', fontWeight: current === t ? 600 : 400,
            }}>
            {THEOREM_INFO[t].title}
          </button>
        ))}
      </div>
    </div>
  );
}

function draw(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  cx: number, cy: number, r: number,
  theorem: TheoremType,
  alpha: number,
) {
  ctx.clearRect(0, 0, w, h);
  ctx.globalAlpha = alpha;

  // 背景
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, w, h);

  // 坐标网格（淡）
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < w; x += 25) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 25) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;

  // 画圆
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // 圆心标注
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('O', cx, cy + 5);

  // 各种情形
  if (theorem === 'intersecting') {
    drawIntersecting(ctx, cx, cy, r);
  } else if (theorem === 'tangent') {
    drawTangent(ctx, cx, cy, r);
  } else {
    drawSecant(ctx, cx, cy, r);
  }
}

/** 相交弦定理：圆内两弦 AB、CD 交于 P */
function drawIntersecting(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  const angle1 = -Math.PI * 0.35;
  const angle2 = Math.PI * 0.55;
  const angle3 = Math.PI * 0.2;
  const angle4 = Math.PI * 0.7 + Math.PI;

  const ax = cx + r * Math.cos(angle1); const ay = cy + r * Math.sin(angle1);
  const bx = cx + r * Math.cos(angle2); const by = cy + r * Math.sin(angle2);
  const cx2 = cx + r * Math.cos(angle3); const cy2 = cy + r * Math.sin(angle3);
  const dx = cx + r * Math.cos(angle4); const dy = cy + r * Math.sin(angle4);

  // 交点 P (两弦交点)
  const px = (ax + bx + cx2 + dx) / 4;
  const py = (ay + by + cy2 + dy) / 4;

  // 弦 AB
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();

  // 弦 CD
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx2, cy2);
  ctx.lineTo(dx, dy);
  ctx.stroke();

  // 标注点
  drawLabel(ctx, ax, ay, 'A', '#3B82F6', 'right');
  drawLabel(ctx, bx, by, 'B', '#3B82F6', 'left');
  drawLabel(ctx, cx2, cy2, 'C', '#EF4444', 'left');
  drawLabel(ctx, dx, dy, 'D', '#EF4444', 'right');
  drawLabel(ctx, px, py, 'P', '#F59E0B', 'bottom');

  // 标注线段长度
  const paLen = dist(px, py, ax, ay).toFixed(1);
  const pbLen = dist(px, py, bx, by).toFixed(1);
  const pcLen = dist(px, py, cx2, cy2).toFixed(1);
  const pdLen = dist(px, py, dx, dy).toFixed(1);

  ctx.fillStyle = '#3B82F6';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`PA=${paLen}`, (px + ax) / 2 - 15, (py + ay) / 2 - 8);
  ctx.fillText(`PB=${pbLen}`, (px + bx) / 2 + 15, (py + by) / 2 - 8);
  ctx.fillStyle = '#EF4444';
  ctx.fillText(`PC=${pcLen}`, (px + cx2) / 2 - 8, (py + cy2) / 2 + 15);
  ctx.fillText(`PD=${pdLen}`, (px + dx) / 2 - 8, (py + dy) / 2 + 15);

  // 验证等式
  const left = (parseFloat(paLen) * parseFloat(pbLen)).toFixed(1);
  const right = (parseFloat(pcLen) * parseFloat(pdLen)).toFixed(1);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`PA·PB = ${left}   PC·PD = ${right}  ✅`, cx, cy + r + 40);
}

/** 切割线定理：圆外点 P，切线 PT，割线 PAB */
function drawTangent(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  // P 在圆外（左下方）
  const px = cx + 160;
  const py = cy + 110;

  // 切点 T（在圆上，PT 与圆相切）
  // PT 的方向从 P 到圆，切点满足 OT ⟂ PT
  const dx = px - cx, dy = py - cy;
  const d = Math.sqrt(dx * dx + dy * dy);
  const tx = cx + r * r / d * (dx / d);
  const ty = cy + r * r / d * (dy / d);

  // 割线与圆的交点 A、B
  const ba = Math.PI * 0.05;
  const bb = Math.PI * 0.55;
  const ax = cx + r * Math.cos(ba); const ay = cy + r * Math.sin(ba);
  const bx = cx + r * Math.cos(bb); const by = cy + r * Math.sin(bb);

  // 切线（从 P 到 T）
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(tx, ty);
  ctx.stroke();

  // 切线垂直标记
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  const rx = (tx - cx) * 8 / r, ry = (ty - cy) * 8 / r;
  ctx.beginPath();
  ctx.moveTo(tx + ry, ty - rx);
  ctx.lineTo(tx - ry + rx, ty + rx + ry);
  ctx.stroke();

  // 割线 PAB
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(ax, ay);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(bx, by);
  ctx.stroke();

  // 圆的 AB 弧（虚线）
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(cx, cy, r, ba, bb);
  ctx.stroke();
  ctx.setLineDash([]);

  // 标注
  drawLabel(ctx, px, py, 'P', '#1e293b', 'right');
  drawLabel(ctx, tx, ty - 15, 'T', '#F59E0B', 'center');
  drawLabel(ctx, ax, ay - 15, 'A', '#3B82F6', 'center');
  drawLabel(ctx, bx, by + 15, 'B', '#3B82F6', 'center');

  // 公式
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`PT² = PA · PB`, cx, cy + r + 40);
}

/** 割线定理：圆外点 P，两割线 PAB、PCD */
function drawSecant(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  // P 在圆外（下方）
  const px = cx + 40;
  const py = cy + r + 60;

  // 割线 1：PAB
  const a1 = -Math.PI * 0.5 - 0.6;
  const b1 = Math.PI * 0.1;
  const ax = cx + r * Math.cos(a1); const ay = cy + r * Math.sin(a1);
  const bx = cx + r * Math.cos(b1); const by = cy + r * Math.sin(b1);

  // 割线 2：PCD
  const a2 = -Math.PI * 0.5 + 0.4;
  const b2 = Math.PI * 0.4;
  const cx2 = cx + r * Math.cos(a2); const cy2 = cy + r * Math.sin(a2);
  const dx = cx + r * Math.cos(b2); const dy = cy + r * Math.sin(b2);

  // 割线 1
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(ax, ay);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(bx, by);
  ctx.stroke();

  // 割线 2
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(cx2, cy2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(dx, dy);
  ctx.stroke();

  // 标注
  drawLabel(ctx, px, py + 15, 'P', '#1e293b', 'center');
  drawLabel(ctx, ax, ay - 15, 'A', '#3B82F6', 'center');
  drawLabel(ctx, bx, by + 15, 'B', '#3B82F6', 'center');
  drawLabel(ctx, cx2, cy2 - 15, 'C', '#EF4444', 'center');
  drawLabel(ctx, dx, dy + 15, 'D', '#EF4444', 'center');

  // 等积标记
  ctx.fillStyle = '#059669';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`PA·PB = PC·PD`, cx, cy + r + 40);
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  label: string, color: string,
  pos: 'left' | 'right' | 'center' | 'bottom',
) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = 'bold 13px sans-serif';
  if (pos === 'left') ctx.textAlign = 'right';
  else if (pos === 'right') ctx.textAlign = 'left';
  else ctx.textAlign = 'center';

  const ox = pos === 'left' ? -12 : pos === 'right' ? 12 : 0;
  const oy = pos === 'bottom' ? 18 : pos === 'center' ? 0 : -15;
  ctx.fillText(label, x + ox, y + oy);
}

function dist(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
