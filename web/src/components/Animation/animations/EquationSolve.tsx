/**
 * EquationSolve — 方程求解分步动画
 *
 * 演示一元二次方程 ax² + bx + c = 0 的求解过程
 * 步骤：描述 → 公式 → 代入 → 计算 → 结果
 */
import { useState } from 'react';
import AnimationPlayer from '../AnimationPlayer';
import type { AnimationStep } from '../AnimationPlayer';

interface Props {
  a?: number;
  b?: number;
  c?: number;
}

/** 一元二次方程求解动画 —— 通用方程以配置参数传入 */
export default function EquationSolve({ a = 1, b = -5, c = 6 }: Props) {
  const steps: AnimationStep[] = generateSolveSteps(a, b, c);
  return <AnimationPlayer steps={steps} width={560} height={380} />;
}

function generateSolveSteps(a: number, b: number, c: number): AnimationStep[] {
  const disc = b * b - 4 * a * c;
  const discSqrt = Math.sqrt(Math.max(0, disc));
  const x1 = (-b + discSqrt) / (2 * a);
  const x2 = (-b - discSqrt) / (2 * a);

  return [
    {
      title: `${formatNum(a)}x² ${formatNum(b, true)}x ${formatNum(c, true)} = 0`,
      description: '这是一个一元二次方程，我们用求根公式来解',
      duration: 800,
      draw: (ctx, w, h) => {
        const ox = w / 2, oy = h / 2;
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${formatNum(a)}x² ${formatNum(b, true)}x ${formatNum(c, true)} = 0`, ox, oy - 20);

        ctx.fillStyle = '#64748b';
        ctx.font = '15px sans-serif';
        ctx.fillText('求根公式：', ox, oy + 25);

        ctx.fillStyle = '#3B82F6';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('x = (-b ± √(b² - 4ac)) / 2a', ox, oy + 55);
      },
    },
    {
      title: '确定系数',
      description: `a = ${a}, b = ${b}, c = ${c}`,
      duration: 1000,
      draw: (ctx, w, h) => {
        const ox = w / 2;
        drawCard(ctx, w, h, [
          { label: 'a =', value: String(a), color: '#3B82F6' },
          { label: 'b =', value: String(b), color: '#EF4444' },
          { label: 'c =', value: String(c), color: '#10B981' },
        ]);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('识别系数：二次项系数 a，一次项系数 b，常数项 c', ox, h - 30);
      },
    },
    {
      title: '计算判别式 Δ = b² - 4ac',
      description: `Δ = ${b}² - 4·${a}·${c} = ${b * b} - ${4 * a * c} = ${disc}`,
      duration: 1500,
      draw: (ctx, w, h) => {
        const ox = w / 2, oy = h / 2;

        // Δ 计算步骤
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Δ = b² - 4ac`, ox, oy - 60);

        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#374151';
        ctx.fillText(`= ${b}² - 4 × ${a} × ${c}`, ox, oy - 25);

        ctx.fillText(`= ${b * b} - ${4 * a * c}`, ox, oy + 10);

        // 结果
        const yPos = oy + 50;
        ctx.fillStyle = disc >= 0 ? '#10B981' : '#EF4444';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`Δ = ${disc}`, ox, yPos);

        ctx.fillStyle = '#64748b';
        ctx.font = '14px sans-serif';
        const desc = disc > 0
          ? 'Δ > 0，方程有两个不相等的实数根'
          : disc === 0
            ? 'Δ = 0，方程有两个相等的实数根'
            : 'Δ < 0，方程没有实数根（复数根）';
        ctx.fillText(desc, ox, yPos + 30);
      },
    },
    {
      title: '代入求根公式',
      description: `x = (${-b < 0 ? -b : '+ ' + (-b)} ± √${disc}) / ${2 * a}`,
      duration: 1500,
      draw: (ctx, w, h) => {
        const ox = w / 2, oy = h / 2 - 20;

        // 公式
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`x = (-b ± √Δ) / 2a`, ox, oy - 30);
        ctx.fillText(`= (-(${b}) ± √${disc}) / (2 × ${a})`, ox, oy + 5);
        ctx.fillText(`= (${-b} ± ${discSqrt.toFixed(2)}) / ${2 * a}`, ox, oy + 40);

        // 两个根的分支
        if (disc >= 0) {
          ctx.fillStyle = '#3B82F6';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText(`x₁ = (${-b} + ${discSqrt.toFixed(2)}) / ${2 * a}`, ox - 100, oy + 85);
          ctx.fillStyle = '#EF4444';
          ctx.fillText(`x₂ = (${-b} - ${discSqrt.toFixed(2)}) / ${2 * a}`, ox + 100, oy + 85);
        }
      },
    },
    {
      title: `得到解：x₁ = ${formatNum(x1)}, x₂ = ${formatNum(x2)}`,
      description: `${formatNum(a)}x² ${formatNum(b, true)}x ${formatNum(c, true)} = 0 的解集为 {${formatNum(x1)}, ${formatNum(x2)}}`,
      duration: 1200,
      draw: (ctx, w, h) => {
        const ox = w / 2, oy = h / 2 - 30;

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('验证：将解代入原方程', ox, oy - 20);

        // x₁ 验证
        const c1 = a * x1 * x1 + b * x1 + c;
        ctx.fillStyle = '#10B981';
        ctx.font = '15px sans-serif';
        ctx.fillText(`x₁ = ${formatNum(x1)}：${formatNum(a)}·${formatNum(x1)}² ${formatNum(b, true)}·${formatNum(x1)} ${formatNum(c, true)} = ${formatNum(c1)} ✓`, ox, oy + 20);

        // x₂ 验证
        if (Math.abs(x1 - x2) > 0.001) {
          const c2 = a * x2 * x2 + b * x2 + c;
          ctx.fillStyle = '#3B82F6';
          ctx.fillText(`x₂ = ${formatNum(x2)}：${formatNum(a)}·${formatNum(x2)}² ${formatNum(b, true)}·${formatNum(x2)} ${formatNum(c, true)} = ${formatNum(c2)} ✓`, ox, oy + 55);
        }

        // 完成标记
        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('✅ 求解完成！', ox, oy + 110);
      },
    },
  ];
}

function formatNum(n: number, withSign = false): string {
  if (n === 0) return '0';
  if (Number.isInteger(n)) {
    if (withSign) return n > 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
    return String(n);
  }
  const s = n.toFixed(2);
  if (withSign) return n > 0 ? `+ ${s}` : `- ${Math.abs(n).toFixed(2)}`;
  return s;
}

function drawCard(ctx: CanvasRenderingContext2D, w: number, h: number, items: { label: string; value: string; color: string }[]) {
  const cardW = 300;
  const cardH = 40 * items.length + 20;
  const ox = (w - cardW) / 2;
  const oy = (h - cardH) / 2;

  // Card background
  ctx.fillStyle = '#fff';
  ctx.shadowColor = 'rgba(0,0,0,0.08)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 2;
  ctx.beginPath();
  ctx.roundRect(ox, oy, cardW, cardH, 8);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Items
  items.forEach((item, i) => {
    const y = oy + 15 + i * 40;

    ctx.fillStyle = item.color;
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(item.label, ox + 80, y);

    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'left';
    ctx.font = '18px sans-serif';
    ctx.fillText(item.value, ox + 95, y);

    // 分隔线
    if (i < items.length - 1) {
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ox + 15, y + 16);
      ctx.lineTo(ox + cardW - 15, y + 16);
      ctx.stroke();
    }
  });
}
