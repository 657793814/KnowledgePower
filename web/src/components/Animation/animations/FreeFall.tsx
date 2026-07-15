/**
 * FreeFall — 自由落体运动动画
 *
 * 演示：小球从静止释放，在重力作用下匀加速下落
 * 展示 s = ½gt², v = gt 的变化过程
 */
import AnimationPlayer from '../AnimationPlayer';
import type { AnimationStep } from '../AnimationPlayer';

export default function FreeFall() {
  const g = 9.8; // m/s²
  const maxH = 300; // 像素高度

  const steps: AnimationStep[] = [
    {
      title: '自由落体 — 从静止开始下落',
      description: '物体在只受重力作用下从静止开始下落的运动',
      duration: 800,
      draw: (ctx, w, h) => {
        const bx = w / 2, by = 60;
        const r = 16;

        // 顶架
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20, by);
        ctx.lineTo(w - 20, by);
        ctx.stroke();

        // 虚线
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx, by + 20);
        ctx.lineTo(bx, h - 30);
        ctx.stroke();
        ctx.setLineDash([]);

        // 球
        const grad = ctx.createRadialGradient(bx - 4, by + r - 4, 2, bx, by + r, r);
        grad.addColorStop(0, '#60a5fa');
        grad.addColorStop(1, '#2563eb');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by + r, r, 0, Math.PI * 2);
        ctx.fill();

        // 标签
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('小球（质量 m）', bx, by + r + 30);
        ctx.fillStyle = '#64748b';
        ctx.font = '13px sans-serif';
        ctx.fillText('v₀ = 0, a = g = 9.8 m/s²', bx, by + r + 52);
      },
    },
    {
      title: '下落过程 — 速度越来越快',
      description: 'v = gt，速度随时间线性增大',
      duration: 2000,
      draw: (ctx, w, h, t) => {
        const bx = w / 2;
        const topY = 60;
        const r = 14;
        const fallH = maxH * ease(t);
        const vy = (g * 2 * t).toFixed(1); // 粗略模拟
        const sy = (0.5 * g * 4 * t * t).toFixed(1);

        const ballY = topY + r + fallH;

        // 顶架
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, topY);
        ctx.lineTo(w - 30, topY);
        ctx.stroke();

        // 轨迹虚线
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx, topY + 10);
        ctx.lineTo(bx, ballY);
        ctx.stroke();
        ctx.setLineDash([]);

        // 地面
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 3;
        const groundY = topY + maxH + r + 10;
        ctx.beginPath();
        ctx.moveTo(30, groundY);
        ctx.lineTo(w - 30, groundY);
        ctx.stroke();
        ctx.fillStyle = '#d1fae5';
        ctx.fillRect(30, groundY, w - 60, 4);

        // 球（下落中带拖影）
        for (let i = 3; i >= 0; i--) {
          const prevT = Math.max(0, t - i * 0.03);
          const prevY = topY + r + maxH * ease(prevT);
          ctx.fillStyle = `rgba(37, 99, 235, ${0.12 * (1 - i / 4)})`;
          ctx.beginPath();
          ctx.arc(bx, prevY, r - i * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        const grad = ctx.createRadialGradient(bx - 3, ballY - 3, 2, bx, ballY, r);
        grad.addColorStop(0, '#60a5fa');
        grad.addColorStop(1, '#2563eb');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, ballY, r, 0, Math.PI * 2);
        ctx.fill();

        // 信息面板
        const panelX = 20, panelY = topY + 20;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.roundRect(panelX, panelY, 160, 72, 6);
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`v = ${vy} m/s`, panelX + 12, panelY + 22);
        ctx.fillStyle = '#64748b';
        ctx.font = '13px sans-serif';
        ctx.fillText(`s = ${sy} m`, panelX + 12, panelY + 44);
        ctx.fillText(`t = ${(t * 2).toFixed(1)} s`, panelX + 12, panelY + 62);
      },
    },
    {
      title: '自由落体公式',
      description: 'v = gt, s = ½gt², v² = 2gs',
      duration: 1500,
      draw: (ctx, w, h) => {
        const ox = w / 2;

        const formulas = [
          { expr: 'v = gt', color: '#3B82F6', desc: '速度与时间成正比' },
          { expr: 's = ½gt²', color: '#10B981', desc: '位移与时间的平方成正比' },
          { expr: 'v² = 2gs', color: '#F59E0B', desc: '速度平方与位移成正比（无时间公式）' },
        ];

        formulas.forEach((f, i) => {
          const y = 70 + i * 70;

          ctx.fillStyle = f.color;
          ctx.font = 'bold 20px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(f.expr, ox - 80, y);

          ctx.fillStyle = '#64748b';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(f.desc, ox + 60, y);
        });

        // 图例
        ctx.fillStyle = '#1e293b';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('v: 末速度 | g: 重力加速度 9.8 m/s² | t: 时间 | s: 位移', ox, h - 30);
      },
    },
    {
      title: '能量转化 — 重力势能 → 动能',
      description: 'mgh = ½mv²，机械能守恒',
      duration: 1200,
      draw: (ctx, w, h) => {
        const ox = w / 2;

        // 能量转化图
        ctx.fillStyle = '#3B82F6';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Eₚ = mgh', ox - 120, 80);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '20px sans-serif';
        ctx.fillText('⟶', ox, 80);
        ctx.fillStyle = '#F59E0B';
        ctx.fillText('Eₖ = ½mv²', ox + 120, 80);

        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('机械能守恒：mgh = ½mv²', ox, 130);

        // 柱子对比
        const barW = 40;
        const barMaxH = 150;
        // Ep 柱子（最高）
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(ox - 100, h / 2 - barMaxH, barW, barMaxH);

        // Ek 柱子（0）
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(ox + 60, h / 2 - 10, barW, 10);

        ctx.fillStyle = '#3B82F6';
        ctx.font = '13px sans-serif';
        ctx.fillText('Eₚ (最大)', ox - 80, h / 2 - barMaxH - 10);
        ctx.fillStyle = '#F59E0B';
        ctx.fillText('Eₖ = 0', ox + 80, h / 2 - 18);

        // 中间状态箭头
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('⬇ 下落过程', ox, h / 2 + 40);

        // 底部
        // 底部 Ep=0, Ek=最大
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(ox - 100, h - 80, barW, 10);
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(ox + 60, h - 80 - barMaxH, barW, barMaxH);

        ctx.fillStyle = '#3B82F6';
        ctx.font = '13px sans-serif';
        ctx.fillText('Eₚ = 0', ox - 80, h - 85);
        ctx.fillStyle = '#F59E0B';
        ctx.fillText('Eₖ (最大)', ox + 80, h - 80 - barMaxH - 10);

        ctx.fillStyle = '#64748b';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('顶部：Eₚ 最大, Eₖ = 0', ox, h - 55);
        ctx.fillText('底部：Eₚ = 0, Eₖ 最大', ox, h - 38);
        ctx.fillText('下落中：重力势能不断转化为动能', ox, h - 21);
      },
    },
  ];

  return <AnimationPlayer steps={steps} width={560} height={420} />;
}

function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
