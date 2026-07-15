/**
 * EquationBalance — 化学方程式配平动画
 *
 * 演示：H₂ + O₂ → H₂O 的配平过程
 * 步骤：写出反应 → 数原子 → 配系数 → 验证
 */
import AnimationPlayer from '../AnimationPlayer';
import type { AnimationStep } from '../AnimationPlayer';

export default function EquationBalance() {
  const steps: AnimationStep[] = [
    {
      title: '写出反应物和生成物',
      description: '氢气和氧气反应生成水',
      duration: 1000,
      draw: (ctx, w, h) => {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        // 分子模型
        const oy = 80;

        drawMolecule(ctx, w / 2 - 120, oy, 'H₂', [
          { x: -15, y: 0, color: '#3B82F6', label: 'H' },
          { x: 15, y: 0, color: '#3B82F6', label: 'H' },
        ]);

        drawMolecule(ctx, w / 2 - 10, oy, 'O₂', [
          { x: -15, y: 0, color: '#EF4444', label: 'O' },
          { x: 15, y: 0, color: '#EF4444', label: 'O' },
        ]);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('+', w / 2 - 65, oy + 6);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '24px sans-serif';
        ctx.fillText('→', w / 2 + 50, oy + 6);

        drawMolecule(ctx, w / 2 + 100, oy, 'H₂O', [
          { x: -20, y: 5, color: '#3B82F6', label: 'H' },
          { x: 0, y: -15, color: '#EF4444', label: 'O' },
          { x: 20, y: 5, color: '#3B82F6', label: 'H' },
        ]);

        // 配平规则
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('H₂ + O₂  →  H₂O', w / 2, oy + 60);

        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('❓ 配平前：原子个数不守恒', w / 2, oy + 90);

        // 不守恒提示
        ctx.fillStyle = '#64748b';
        ctx.font = '14px sans-serif';
        ctx.fillText('左边：H=2, O=2', w / 2 - 80, h / 2 + 60);
        ctx.fillText('右边：H=2, O=1', w / 2 + 80, h / 2 + 60);
        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('❌ 氧原子不守恒！', w / 2, h / 2 + 95);
      },
    },
    {
      title: '列出原子种类和数量',
      description: '统计 H 和 O 原子在左右两边的个数',
      duration: 1200,
      draw: (ctx, w, h) => {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        // 左边
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('左边（反应物）', w / 2 - 120, 50);
        ctx.fillText('右边（生成物）', w / 2 + 120, 50);

        // 表格
        const drawAtomTable = (label: string, atoms: { element: string; count: number; color: string }[], cx: number, cy: number) => {
          atoms.forEach((a, i) => {
            const y = cy + i * 50;
            ctx.fillStyle = '#f1f5f9';
            ctx.beginPath();
            ctx.roundRect(cx - 60, y, 120, 38, 6);
            ctx.fill();

            ctx.fillStyle = a.color;
            ctx.font = 'bold 18px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${a.element} : ${a.count}`, cx, y + 26);
          });
        };

        drawAtomTable('H₂ + O₂', [
          { element: 'H', count: 2, color: '#3B82F6' },
          { element: 'O', count: 2, color: '#EF4444' },
        ], w / 2 - 120, 90);

        drawAtomTable('H₂O', [
          { element: 'H', count: 2, color: '#3B82F6' },
          { element: 'O', count: 1, color: '#EF4444' },
        ], w / 2 + 120, 90);

        // 对比
        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('❌ O: 2 ≠ 1', w / 2, 200);

        ctx.fillStyle = '#10B981';
        ctx.font = '14px sans-serif';
        ctx.fillText('✅ H: 2 = 2', w / 2, 230);

        // 配平原则
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('📌 配平原则：在化学式前加系数，使两边原子总数相等', w / 2, h - 40);
        ctx.fillStyle = '#64748b';
        ctx.font = '13px sans-serif';
        ctx.fillText('不能改变化学式本身（不能改下标的数字）', w / 2, h - 18);
      },
    },
    {
      title: '配平步骤',
      description: '从最复杂的分子开始，确定系数',
      duration: 1800,
      draw: (ctx, w, h) => {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        const steps = [
          { label: '① 找最复杂分子', desc: 'H₂O 含 H 和 O 两种元素', color: '#F59E0B' },
          { label: '② 设其系数为 2', desc: '2H₂O → 右边 H=4, O=2', color: '#3B82F6' },
          { label: '③ 配平 O', desc: '右边 O=2 → 左边 O₂ 系数 1', color: '#EF4444' },
          { label: '④ 配平 H', desc: '右边 H=4 → 左边 H₂ 系数 2', color: '#10B981' },
        ];

        const equations = [
          { text: 'H₂ + O₂  →  H₂O', show: false },
          { text: 'H₂ + O₂  →  2H₂O', show: false },
          { text: 'H₂ + 1O₂  →  2H₂O', show: false },
          { text: '2H₂ + O₂  →  2H₂O', show: true },
        ];

        // 显示当前方程
        const eq = equations[3];
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`2H₂ + O₂  →  2H₂O`, w / 2, 65);

        // 验证
        ctx.fillStyle = '#10B981';
        ctx.font = '16px sans-serif';
        ctx.fillText('H: 4 = 4 ✅    O: 2 = 2 ✅', w / 2, 100);

        // 配平步骤
        steps.forEach((s, i) => {
          const y = 130 + i * 65;

          ctx.fillStyle = s.color;
          ctx.font = 'bold 15px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(s.label, 40, y);

          ctx.fillStyle = '#475569';
          ctx.font = '14px sans-serif';
          ctx.fillText(s.desc, 40, y + 24);
        });
      },
    },
    {
      title: '最终检查 — 质量守恒定律',
      description: '配平后的化学方程式满足质量守恒',
      duration: 1200,
      draw: (ctx, w, h) => {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        const oy = 60;

        // 配平后的分子
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('2H₂ + O₂  →  2H₂O', w / 2, oy + 10);

        // 分子图示
        // 左边：2 个 H₂ + 1 个 O₂
        drawMolecule(ctx, w / 2 - 140, oy + 40, '2H₂', [
          { x: -15, y: 0, color: '#3B82F6', label: 'H' },
          { x: 15, y: 0, color: '#3B82F6', label: 'H' },
        ]);
        drawMolecule(ctx, w / 2 - 100, oy + 95, '2H₂', [
          { x: -15, y: 0, color: '#3B82F6', label: 'H' },
          { x: 15, y: 0, color: '#3B82F6', label: 'H' },
        ]);
        drawMolecule(ctx, w / 2 - 30, oy + 65, 'O₂', [
          { x: -15, y: 0, color: '#EF4444', label: 'O' },
          { x: 15, y: 0, color: '#EF4444', label: 'O' },
        ]);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '20px sans-serif';
        ctx.fillText('→', w / 2 + 35, oy + 75);

        // 右边：2 个 H₂O
        drawMolecule(ctx, w / 2 + 70, oy + 40, '2H₂O', [
          { x: -18, y: 5, color: '#3B82F6', label: 'H' },
          { x: 0, y: -12, color: '#EF4444', label: 'O' },
          { x: 18, y: 5, color: '#3B82F6', label: 'H' },
        ]);
        drawMolecule(ctx, w / 2 + 70, oy + 105, '2H₂O', [
          { x: -18, y: 5, color: '#3B82F6', label: 'H' },
          { x: 0, y: -12, color: '#EF4444', label: 'O' },
          { x: 18, y: 5, color: '#3B82F6', label: 'H' },
        ]);

        // 验证结果
        const cy = h / 2 + 30;

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✅ 原子守恒验证', w / 2, cy);

        const checks = [
          { label: 'H', left: 4, right: 4, color: '#3B82F6' },
          { label: 'O', left: 2, right: 2, color: '#EF4444' },
        ];

        checks.forEach((c, i) => {
          const cx = i === 0 ? w / 2 - 80 : w / 2 + 80;
          ctx.fillStyle = c.color;
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText(`${c.label}: ${c.left} = ${c.right} ✅`, cx, cy + 35);
        });

        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('✨ 配平完成！质量守恒 ✨', w / 2, cy + 75);

        ctx.fillStyle = '#64748b';
        ctx.font = '13px sans-serif';
        ctx.fillText('2H₂ + O₂ = 2H₂O', w / 2, h - 20);
      },
    },
  ];

  return <AnimationPlayer steps={steps} width={560} height={420} />;
}

function drawMolecule(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  _label: string,
  atoms: { x: number; y: number; color: string; label: string }[],
) {
  atoms.forEach((a) => {
    const px = cx + a.x;
    const py = cy + a.y;

    // 原子球
    const grad = ctx.createRadialGradient(px - 3, py - 3, 2, px, py, 12);
    grad.addColorStop(0, lightenColor(a.color, 40));
    grad.addColorStop(1, a.color);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI * 2);
    ctx.fill();

    // 标签
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(a.label, px, py);
    ctx.textBaseline = 'alphabetic';
  });

  // 化学键
  if (atoms.length === 2) {
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx + atoms[0].x, cy + atoms[0].y);
    ctx.lineTo(cx + atoms[1].x, cy + atoms[1].y);
    ctx.stroke();
  } else if (atoms.length === 3) {
    // H-O-H 的键
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx + atoms[0].x, cy + atoms[0].y);
    ctx.lineTo(cx + atoms[1].x, cy + atoms[1].y);
    ctx.moveTo(cx + atoms[1].x, cy + atoms[1].y);
    ctx.lineTo(cx + atoms[2].x, cy + atoms[2].y);
    ctx.stroke();
  }
}

function lightenColor(hex: string, amt: number): string {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.min(255, r + amt);
  g = Math.min(255, g + amt);
  b = Math.min(255, b + amt);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
