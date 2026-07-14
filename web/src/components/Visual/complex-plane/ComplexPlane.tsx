import { useRef, useEffect, useState } from 'react';

/** Canvas 复平面旋转演示 — ×i = 旋转 90° */
export default function ComplexPlane({ draggable = false }: { draggable?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [step, setStep] = useState(0);

  const steps = [
    { label: '1', vector: [1, 0], color: '#3B82F6', desc: '1 = 向右（正向）' },
    { label: '1×i = i', vector: [0, 1], color: '#10B981', desc: '×i = 旋转 90° ↑' },
    { label: 'i×i = -1', vector: [-1, 0], color: '#EF4444', desc: '再 ×i = 旋转 90° ←' },
    { label: '-1×i = -i', vector: [0, -1], color: '#F59E0B', desc: '再 ×i = 旋转 90° ↓' },
    { label: '-i×i = 1', vector: [1, 0], color: '#8B5CF6', desc: '再 ×i = 回到起点！' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 120;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // 背景网格
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      for (let x = -5; x <= 5; x++) {
        ctx.beginPath();
        ctx.moveTo(cx + x * 40, 20);
        ctx.lineTo(cx + x * 40, h - 20);
        ctx.stroke();
      }
      for (let y = -5; y <= 5; y++) {
        ctx.beginPath();
        ctx.moveTo(20, cy + y * 40);
        ctx.lineTo(w - 20, cy + y * 40);
        ctx.stroke();
      }

      // 坐标轴
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, cy);
      ctx.lineTo(w - 40, cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, 20);
      ctx.lineTo(cx, h - 20);
      ctx.stroke();

      // 轴标签
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Re (实轴)', w - 60, cy + 20);
      ctx.fillText('Im (虚轴)', cx + 20, 30);

      // 原点标签
      ctx.fillText('O', cx - 15, cy + 20);

      // 当前向量
      if (step > 0 && step <= steps.length) {
        const s = steps[step - 1];
        const vecX = s.vector[0] * scale;
        const vecY = -(s.vector[1] * scale); // Canvas y 向下为正

        // 向量
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + vecX, cy + vecY);
        ctx.stroke();

        // 箭头
        const angle = Math.atan2(vecY, vecX);
        ctx.beginPath();
        ctx.moveTo(cx + vecX, cy + vecY);
        ctx.lineTo(cx + vecX - 12 * Math.cos(angle - 0.4), cy + vecY - 12 * Math.sin(angle - 0.4));
        ctx.lineTo(cx + vecX - 12 * Math.cos(angle + 0.4), cy + vecY - 12 * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fillStyle = s.color;
        ctx.fill();

        // 终点标签
        ctx.fillStyle = s.color;
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(s.label, cx + vecX + (vecX > 0 ? 20 : -20), cy + vecY + (vecY > 0 ? 24 : -8));

        // 描述文字
        ctx.fillStyle = '#374151';
        ctx.font = '14px sans-serif';
        ctx.fillText(s.desc, cx, h - 20);
      }
    };

    animate();
  }, [step]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={500} height={380} style={{ maxWidth: '100%', background: '#fff', borderRadius: 8 }} />
      <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => {
            if (i === step) {
              setStep(0);
            } else {
              setStep(i + 1);
            }
          }}
            style={{
              padding: '6px 14px',
              background: step === i + 1 ? s.color : '#f0f0f0',
              color: step === i + 1 ? '#fff' : '#374151',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
            }}>
            {i === 0 ? '初始' : `×i（第${i}次）`}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
        <button onClick={() => setStep(0)}
          style={{ padding: '4px 12px', background: '#e2e8f0', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
          重置
        </button>
        <button onClick={() => {
          setStep(0);
          const interval = setInterval(() => {
            setStep(prev => {
              if (prev >= steps.length) {
                clearInterval(interval);
                return 0;
              }
              return prev + 1;
            });
          }, 1200);
        }}
          style={{ padding: '4px 12px', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
          ▶ 自动演示
        </button>
      </div>
      <p style={{ marginTop: 8, color: '#666', fontSize: 13 }}>
        每次乘以 i 相当于逆时针旋转 90°，四次回到原点
      </p>
    </div>
  );
}

// 复数平面（可拖动版本）
export function ComplexPlaneDraggable() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [point, setPoint] = useState({ x: 1, y: 0.5 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 100;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // 网格
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      for (let x = -6; x <= 6; x++) {
        ctx.beginPath();
        ctx.moveTo(cx + x * 40, 20);
        ctx.lineTo(cx + x * 40, h - 20);
        ctx.stroke();
      }
      for (let y = -6; y <= 6; y++) {
        ctx.beginPath();
        ctx.moveTo(20, cy + y * 40);
        ctx.lineTo(w - 20, cy + y * 40);
        ctx.stroke();
      }

      // 轴
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, cy);
      ctx.lineTo(w - 40, cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, 20);
      ctx.lineTo(cx, h - 20);
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Re', w - 40, cy + 20);
      ctx.fillText('Im', cx + 20, 30);

      // 向量
      const px = cx + point.x * scale;
      const py = cy - point.y * scale;

      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();

      // 箭头
      const angle = Math.atan2(cy - py, px - cx);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - 10 * Math.cos(angle - 0.4), py + 10 * Math.sin(angle - 0.4));
      ctx.lineTo(px - 10 * Math.cos(angle + 0.4), py + 10 * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fillStyle = '#3B82F6';
      ctx.fill();

      // 点的坐标标签
      ctx.fillStyle = '#1a1a2e';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`${point.x >= 0 ? '' : ''}${point.x.toFixed(2)}${point.y >= 0 ? '+' : ''}${point.y.toFixed(2)}i`, px + 20, py - 10);

      // 模和辐角
      const mod = Math.sqrt(point.x ** 2 + point.y ** 2);
      const arg = Math.atan2(point.y, point.x) * 180 / Math.PI;
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`|z| = ${mod.toFixed(2)}`, 20, h - 40);
      ctx.fillText(`arg(z) = ${arg.toFixed(1)}°`, 20, h - 20);
    };

    draw();
  }, [point]);

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const scale = 100;
    const x = (e.clientX - rect.left - cx) / scale;
    const y = -(e.clientY - rect.top - cy) / scale;
    setPoint({ x: Math.max(-5, Math.min(5, x)), y: Math.max(-5, Math.min(5, y)) });
  };

  // 自动演示效果: 在复平面上转圈
  const [autoMode, setAutoMode] = useState(false);
  useEffect(() => {
    if (!autoMode) return;
    let angle = 0;
    const interval = setInterval(() => {
      angle += 0.05;
      setPoint({ x: Math.cos(angle), y: Math.sin(angle) });
      if (angle > Math.PI * 4) {
        setAutoMode(false);
        setPoint({ x: 1, y: 0.5 });
      }
    }, 30);
    return () => clearInterval(interval);
  }, [autoMode]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={500} height={380}
        style={{ maxWidth: '100%', background: '#fff', borderRadius: 8, cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
      <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button onClick={() => setAutoMode(!autoMode)}
          style={{ padding: '4px 14px', background: autoMode ? '#EF4444' : '#3B82F6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
          {autoMode ? '⏹ 停止' : '▶ 演示 e^(iθ)'}
        </button>
        <span style={{ fontSize: 12, color: '#666', lineHeight: '28px' }}>
          拖拽复平面上的向量试试
        </span>
      </div>
    </div>
  );
}
