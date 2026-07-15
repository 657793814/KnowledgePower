/**
 * NumberExpansion — 数的扩张动画
 *
 * 展示数的 5 次扩张：
 *   自然数 N → 整数 Z → 有理数 Q → 实数 R → 复数 C
 *
 * 每一次扩张都用一个"为什么不够用"的场景引入，
 * 最后在复平面上展示完整的数的宇宙。
 */
import AnimationPlayer from '../AnimationPlayer';
import type { AnimationStep } from '../AnimationPlayer';

export default function NumberExpansion() {
  const steps: AnimationStep[] = [
    // ── ① 自然数 N ──
    {
      title: '自然数 N = {1, 2, 3, …}',
      description: '从计数开始：1 个苹果、2 个人……自然数是最原始的数的概念',
      duration: 1500,
      draw: (ctx, w, h) => {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        // 标题
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';

        // 数轴
        drawNumberLine(ctx, w, h, [1, 2, 3, 4, 5, 6, 7, 8], '#3B82F6');

        // 卡片
        const cardY = 40;
        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.roundRect(w / 2 - 120, cardY, 240, 50, 10);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('🌿 自然数 N', w / 2, cardY + 32);

        ctx.fillStyle = '#64748b';
        ctx.font = '14px sans-serif';
        ctx.fillText('计数 → {1, 2, 3, 4, 5, …}', w / 2, h - 25);

        // 场景说明
        ctx.font = '15px sans-serif';
        ctx.fillStyle = '#475569';
        ctx.fillText('🌰 "我有 3 个苹果" "这里有 5 个人"', w / 2, h / 2 - 40);
      },
    },
    // ── ② 问题：减法不够用 ──
    {
      title: '减法不够用 → 负数诞生',
      description: '3 - 5 = ? 自然数不够用了，需要引入负数',
      duration: 1200,
      draw: (ctx, w, h) => {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💭 "今天温度 -3°C，比 0°C 还冷是什么数？"', w / 2, 60);

        ctx.font = '18px sans-serif';
        ctx.fillStyle = '#EF4444';
        ctx.fillText('3 − 5 = ❓', w / 2, 120);
        ctx.fillStyle = '#64748b';
        ctx.font = '15px sans-serif';
        ctx.fillText('自然数里没有答案……', w / 2, 150);

        // 数轴前半段
        drawNumberLine(ctx, w, h, [-2, -1, 0, 1, 2, 3], '#EF4444', -2, 3);

        // 引出箭头
        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('⟶ 需要「相反方向」的数', w / 2, h - 20);
      },
    },
    // ── ③ 整数 Z ──
    {
      title: '整数 Z = {…, -2, -1, 0, 1, 2, …}',
      description: '引入负数，×(-1) 就是方向反转！自然数 + 0 + 负整数 = 整数',
      duration: 1500,
      draw: (ctx, w, h) => {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        // 卡片
        const cardY = 30;
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.roundRect(w / 2 - 120, cardY, 240, 50, 10);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('➕ 整数 Z = {…, -2, -1, 0, 1, 2, …}', w / 2, cardY + 32);

        // 数轴
        drawNumberLine(ctx, w, h, [-4, -3, -2, -1, 0, 1, 2, 3, 4], '#EF4444', -4, 4);

        // 关键洞察
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔑 ×1 = 正向    ×(-1) = 反向（旋转 180°）', w / 2, h - 60);

        ctx.fillStyle = '#64748b';
        ctx.font = '14px sans-serif';
        ctx.fillText('自然数 N ∪ {0} ∪ 负整数 = 整数 Z', w / 2, h - 30);
      },
    },
    // ── ④ 除法不够用 → 有理数 ──
    {
      title: '除法不够用 → 有理数 Q',
      description: '3 ÷ 2 = 1.5，整数也不够用了，需要分数',
      duration: 1200,
      draw: (ctx, w, h) => {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💭 "把 1 个蛋糕分给 3 个人，每人多少？"', w / 2, 60);

        ctx.font = '18px sans-serif';
        ctx.fillStyle = '#EF4444';
        ctx.fillText('1 ÷ 3 = ❓', w / 2, 120);
        ctx.fillStyle = '#64748b';
        ctx.font = '15px sans-serif';
        ctx.fillText('整数里也没有答案……', w / 2, 150);

        // 分数可视化
        const pieX = w / 2 - 80;
        const pieY = h / 2 - 20;
        const pieR = 50;

        // 饼图 - 三等分
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.moveTo(pieX, pieY);
        ctx.arc(pieX, pieY, pieR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 / 3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.moveTo(pieX, pieY);
        ctx.arc(pieX, pieY, pieR, -Math.PI / 2 + Math.PI * 2 / 3, -Math.PI / 2 + Math.PI * 4 / 3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.moveTo(pieX, pieY);
        ctx.arc(pieX, pieY, pieR, -Math.PI / 2 + Math.PI * 4 / 3, -Math.PI / 2 + Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('1/3', pieX, pieY + 5);

        ctx.fillStyle = '#475569';
        ctx.font = '15px sans-serif';
        ctx.fillText('1 ÷ 3 = 1/3 → 需要分数！', w / 2 + 60, h / 2 + 8);

        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('⟶ 引入 p/q（q≠0）形式', w / 2, h - 20);
      },
    },
    // ── ⑤ 有理数 Q ──
    {
      title: '有理数 Q = {p/q | p,q∈Z, q≠0}',
      description: '引入分数和有限小数/无限循环小数，整数 + 分数 = 有理数',
      duration: 1500,
      draw: (ctx, w, h) => {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        // 卡片
        const cardY = 30;
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.roundRect(w / 2 - 140, cardY, 280, 50, 10);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📐 有理数 Q = {p/q | p,q∈Z, q≠0}', w / 2, cardY + 32);

        // 数轴
        drawNumberLine(ctx, w, h, [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2], '#F59E0B', -2, 2);

        // 运算律
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';

        const items = [
          ['交换律', 'a + b = b + a,  a × b = b × a'],
          ['结合律', '(a+b)+c = a+(b+c)'],
          ['分配律', 'a×(b+c) = a×b + a×c'],
        ];

        items.forEach(([name, formula], i) => {
          const y = h / 2 + 10 + i * 30;
          ctx.fillStyle = '#F59E0B';
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(name, w / 2 - 10, y);
          ctx.fillStyle = '#475569';
          ctx.font = '13px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(formula, w / 2 + 10, y);
        });

        ctx.fillStyle = '#64748b';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('整数 ∪ 分数 = 有理数', w / 2, h - 20);
      },
    },
    // ── ⑥ 平方不够用 → 无理数 ──
    {
      title: '平方不够用 → 无理数诞生',
      description: 'x² = 2，x = √2 … 有理数也写不出来！',
      duration: 1200,
      draw: (ctx, w, h) => {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💭 "边长为 1 的正方形，对角线多长？"', w / 2, 50);

        // 正方形
        const ox = w / 2 - 60, oy = 80, side = 80;
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.strokeRect(ox, oy, side, side);

        // 对角线
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + side, oy + side);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('1', ox + side / 2, oy + side + 20);
        ctx.fillText('1', ox - 15, oy + side / 2 + 4);

        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('√2 ≈ 1.414…', ox + side + 50, oy + side / 2 + 6);

        // √2 不是有理数的证明提示
        ctx.fillStyle = '#475569';
        ctx.font = '15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('1² + 1² = 2，所以对角线 = √2', w / 2, 190);

        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('√2 不是有理数（无法写成 p/q 形式）！', w / 2, h - 40);

        // 其他无理数
        ctx.fillStyle = '#64748b';
        ctx.font = '14px sans-serif';
        ctx.fillText('还有 π ≈ 3.14159…, e ≈ 2.718…', w / 2, h - 16);
      },
    },
    // ── ⑦ 实数 R ──
    {
      title: '实数 R = 有理数 ∪ 无理数',
      description: '数轴上的每一个点都对应一个实数，数轴是连续的',
      duration: 1500,
      draw: (ctx, w, h) => {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        // 卡片
        ctx.fillStyle = '#8B5CF6';
        ctx.beginPath();
        ctx.roundRect(w / 2 - 130, 30, 260, 50, 10);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔢 实数 R = 有理数 ∪ 无理数', w / 2, 62);

        // 数轴 - 连续的
        drawNumberLine(ctx, w, h, [-Math.PI, -2, -1, 0, 1, Math.E, Math.PI], '#8B5CF6', -4, 4);

        // 数值标注
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#8B5CF6';
        ctx.textAlign = 'center';

        // 标记特殊点
        const points = [
          { x: -Math.PI, label: '-π' },
          { x: -2, label: '-2' },
          { x: Math.E, label: 'e' },
          { x: Math.PI, label: 'π' },
        ];

        const axisY = h / 2 + 8;
        const axisX = w / 2;

        points.forEach(({ x, label }) => {
          const sx = axisX + x * 45;
          if (sx > 30 && sx < w - 30) {
            ctx.fillStyle = '#8B5CF6';
            ctx.fillRect(sx - 1, axisY - 5, 3, 10);
            ctx.fillStyle = '#8B5CF6';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText(label, sx, axisY + 25);
          }
        });

        // 核心洞察
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔑 实数 = 数轴上的每一个点 —— 连续！', w / 2, h - 60);

        ctx.fillStyle = '#64748b';
        ctx.font = '14px sans-serif';
        ctx.fillText('有理数 Q ∪ 无理数 = 实数 R', w / 2, h - 28);
      },
    },
    // ── ⑧ 负数平方根 → 复数 ──
    {
      title: '负数的平方根 → 复数 C',
      description: 'x² = -1，x = ? 实数也不够用了！引入虚数单位 i',
      duration: 1200,
      draw: (ctx, w, h) => {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💭 "x² = -1，x 等于多少？"', w / 2, 60);

        ctx.font = '17px sans-serif';
        ctx.fillStyle = '#EF4444';
        ctx.fillText('实数范围内没有解……', w / 2, 95);

        // 数轴
        drawNumberLine(ctx, w, h, [-2, -1, 0, 1, 2], '#94a3b8', -2, 2);

        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('⟶ 引入虚数单位 i：i² = -1', w / 2, h / 2 + 50);

        // 旋转示意
        ctx.fillStyle = '#64748b';
        ctx.font = '15px sans-serif';
        ctx.fillText('×1 = 正向    ×(-1) = 反向 180°    ×i = 旋转 90° ✨', w / 2, h / 2 + 85);

        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('⟶ 打开新维度！数的宇宙再次扩张', w / 2, h - 20);
      },
    },
    // ── ⑨ 复数 C + 全景总结 ──
    {
      title: '复数 C = {a+bi | a,b∈R}',
      description: '数的宇宙完整了：N ⊂ Z ⊂ Q ⊂ R ⊂ C',
      duration: 2000,
      draw: (ctx, w, h) => {
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, w, h);

        // 标题
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🌌 数的宇宙', w / 2, 40);

        // 复平面坐标轴
        const ox = w / 2, oy = h / 2 + 20;
        const scale = 65;

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(30, oy);
        ctx.lineTo(w - 30, oy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ox, 50);
        ctx.lineTo(ox, h - 10);
        ctx.stroke();

        // 标签（坐标）
        ctx.fillStyle = '#64748b';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Re', w - 35, oy + 18);
        ctx.fillText('Im', ox + 15, 55);

        // 集合套圆
        const drawSet = (label: string, r: number, color: string, textColor: string) => {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ox, oy, r, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = textColor;
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText(label, ox, oy);
        };

        // 从内到外绘制集合
        drawSet('C', 130, '#10B981', '#10B981');
        drawSet('R', 100, '#8B5CF6', '#8B5CF6');
        drawSet('Q', 72, '#F59E0B', '#F59E0B');
        drawSet('Z', 46, '#EF4444', '#EF4444');
        drawSet('N', 22, '#3B82F6', '#3B82F6');

        // 外层复平面点示例
        ctx.fillStyle = '#10B981';
        ctx.font = '12px sans-serif';
        ctx.fillText('z = a + bi', ox + 80, oy - 60);
        ctx.fillText('(在平面上)', ox + 80, oy - 44);

        // 底部总结
        ctx.fillStyle = '#64748b';
        ctx.font = '15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('N ⊂ Z ⊂ Q ⊂ R ⊂ C', w / 2, h - 50);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px sans-serif';
        ctx.fillText('自然数 → 整数 → 有理数 → 实数 → 复数', w / 2, h - 25);
      },
    },
  ];

  return <AnimationPlayer steps={steps} width={560} height={420} />;
}

/** 绘制数轴（支持选择显示哪些刻度值） */
function drawNumberLine(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  ticks: number[],
  color: string,
  min?: number,
  max?: number,
) {
  const axisY = h / 2;
  const axisX = w / 2;
  const scale = 50;
  const padding = 40;

  // 画数轴主线
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, axisY);
  ctx.lineTo(w - padding, axisY);
  ctx.stroke();

  // 箭头
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(w - padding, axisY);
  ctx.lineTo(w - padding - 10, axisY - 5);
  ctx.lineTo(w - padding - 10, axisY + 5);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(padding, axisY);
  ctx.lineTo(padding + 10, axisY - 5);
  ctx.lineTo(padding + 10, axisY + 5);
  ctx.closePath();
  ctx.fill();

  // 绘制刻度和标签
  const allTicks = min != null && max != null
    ? [...Array(max - min + 1)].map((_, i) => min + i).filter(t => ticks.includes(t))
    : ticks;

  allTicks.forEach((tick) => {
    const sx = axisX + tick * scale;
    if (sx < padding + 20 || sx > w - padding - 20) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx, axisY - 6);
    ctx.lineTo(sx, axisY + 6);
    ctx.stroke();

    // 数字标签
    const label = formatTickLabel(tick);
    ctx.fillStyle = color;
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, sx, axisY + 24);
  });

  // 原点标记
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('O', axisX, axisY + 24);
}

function formatTickLabel(n: number): string {
  if (Number.isInteger(n)) return String(n);
  // 特殊值处理
  if (Math.abs(n - Math.PI) < 0.001) return 'π';
  if (Math.abs(n + Math.PI) < 0.001) return '-π';
  if (Math.abs(n - Math.E) < 0.001) return 'e';
  if (Math.abs(n - 1.5) < 0.001) return '3/2';
  if (Math.abs(n + 1.5) < 0.001) return '-3/2';
  if (Math.abs(n - 0.5) < 0.001) return '1/2';
  if (Math.abs(n + 0.5) < 0.001) return '-1/2';
  if (Math.abs(n + 2.5) < 0.001) return '-5/2';
  return n.toFixed(1);
}
