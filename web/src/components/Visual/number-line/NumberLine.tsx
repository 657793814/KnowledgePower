import { useRef, useEffect, useState } from 'react';

/** Canvas 数轴演示 — 正/负/反向概念 */
export default function NumberLine({ showNegative = true, showIrrational = false }: {
  showNegative?: boolean;
  showIrrational?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2 + 20;
    const scale = 60;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // 绘制数轴
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, cy);
      ctx.lineTo(w - 40, cy);
      ctx.stroke();

      // 箭头
      ctx.beginPath();
      ctx.moveTo(w - 40, cy);
      ctx.lineTo(w - 50, cy - 6);
      ctx.lineTo(w - 50, cy + 6);
      ctx.closePath();
      ctx.fillStyle = '#94a3b8';
      ctx.fill();

      // 刻度
      for (let x = -5; x <= 5; x++) {
        const px = cx + x * scale;
        ctx.beginPath();
        ctx.moveTo(px, cy - 6);
        ctx.lineTo(px, cy + 6);
        ctx.stroke();
        if (x !== 0) {
          ctx.fillStyle = '#64748b';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(String(x), px, cy + 22);
        }
      }

      // 原点
      ctx.fillStyle = '#3B82F6';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('0', cx, cy + 22);

      // 方向指示箭头
      const arrowEnd = cx + direction * scale * 3;
      ctx.strokeStyle = direction > 0 ? '#10B981' : '#EF4444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(arrowEnd, cy);
      ctx.stroke();

      // 箭头头
      const arrowTip = arrowEnd;
      ctx.beginPath();
      ctx.moveTo(arrowTip, cy);
      ctx.lineTo(arrowTip - direction * 10, cy - 6);
      ctx.lineTo(arrowTip - direction * 10, cy + 6);
      ctx.closePath();
      ctx.fillStyle = direction > 0 ? '#10B981' : '#EF4444';
      ctx.fill();

      // 标签
      ctx.fillStyle = direction > 0 ? '#10B981' : '#EF4444';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(direction > 0 ? '→ 正向 (×1)' : '← 反向 (×-1)', arrowEnd, cy - 20);

      // 显示负数和无理数标记
      if (showIrrational) {
        ctx.fillStyle = '#F59E0B';
        ctx.font = '11px sans-serif';
        ctx.fillText('√2', cx + 1.414 * scale, cy - 16);
        ctx.fillStyle = '#8B5CF6';
        ctx.fillText('π', cx + 3.14159 * scale, cy - 16);
      }
    };

    animate();
  }, [direction, showNegative, showIrrational]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={600} height={180} style={{ maxWidth: '100%' }} />
      <div style={{ marginTop: 12, display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button onClick={() => setDirection(1)}
          style={{ padding: '6px 20px', background: direction === 1 ? '#10B981' : '#e2e8f0', color: direction === 1 ? '#fff' : '#374151', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: direction === 1 ? 'bold' : 'normal' }}>
          ×1 正向 →
        </button>
        <button onClick={() => setDirection(-1)}
          style={{ padding: '6px 20px', background: direction === -1 ? '#EF4444' : '#e2e8f0', color: direction === -1 ? '#fff' : '#374151', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: direction === -1 ? 'bold' : 'normal' }}>
          ×(-1) 反向 ←
        </button>
      </div>
      <p style={{ marginTop: 8, color: '#666', fontSize: 13 }}>
        {direction === 1 ? '✕1 表示正向，保持方向不变' : '✕(-1) 表示反向，旋转 180°'}
      </p>
    </div>
  );
}
