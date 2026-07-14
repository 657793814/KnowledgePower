import { useRef, useEffect, useState } from 'react';

/**
 * 几何互动演示 — 勾股定理面积证明 + 三角形分类探索
 */
export default function GeometryVisual({ mode = 'pythagorean' }: { mode?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [a_, setA] = useState(3);
  const [b_, setB] = useState(4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    if (mode === 'pythagorean') {
      const a = a_;
      const b = b_;
      const c = Math.sqrt(a * a + b * b);
      const cellSize = 28;

      // Background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      // Draw the classic "square on each side" proof
      const totalW = (a + b) * cellSize;
      const totalH = (a + b) * cellSize;
      const ox = cx - totalW / 2;
      const oy = cy - totalH / 2;

      // Outer square (a+b)²
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(ox, oy, totalW, totalH);

      // Inner lines to show the 4 triangles + inner square
      // Points of the rotated inner square
      const p1 = { x: ox + a * cellSize, y: oy };
      const p2 = { x: ox + totalW, y: oy + a * cellSize };
      const p3 = { x: ox + b * cellSize, y: oy + totalH };
      const p4 = { x: ox, y: oy + b * cellSize };

      // Draw 4 triangles
      const triColor = 'rgba(59, 130, 246, 0.2)';
      const drawTriangle = (pts: { x: number; y: number }[], color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.lineTo(pts[1].x, pts[1].y);
        ctx.lineTo(pts[2].x, pts[2].y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      };

      drawTriangle([{ x: ox, y: oy }, p1, p2], triColor);
      drawTriangle([p1, { x: ox + totalW, y: oy }, p2], triColor);
      drawTriangle([p2, p3, { x: ox + totalW, y: oy + totalH }], triColor);
      drawTriangle([p4, { x: ox, y: oy + totalH }, p3], triColor);

      // Inner square (c²)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';

      // a² label on bottom left
      const aLabelX = ox + a * cellSize / 2;
      const aLabelY = oy + totalH + 22;
      ctx.fillText(`a²`, aLabelX, aLabelY);
      ctx.font = '12px sans-serif';
      ctx.fillText(`(${a}²=${a * a})`, aLabelX, aLabelY + 16);

      // b² label on right
      ctx.font = 'bold 14px sans-serif';
      const bLabelX = ox + totalW + 22;
      const bLabelY = oy + a * cellSize + b * cellSize / 2;
      ctx.textAlign = 'left';
      ctx.fillText(`b²`, bLabelX - 15, bLabelY);
      ctx.font = '12px sans-serif';
      ctx.fillText(`(${b}²=${b * b})`, bLabelX - 15, bLabelY + 16);

      // c² label in center
      ctx.textAlign = 'center';
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`c²`, cx, cy + 20);
      ctx.font = '13px sans-serif';
      ctx.fillText(`(${c.toFixed(2)}²=${(c * c).toFixed(0)})`, cx, cy + 40);

      // Title
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`勾股定理证明：a² + b² = c²`, cx, 25);

      // Side labels
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#3B82F6';
      // a label on triangle
      const aMidX = (ox + ox + a * cellSize) / 2;
      const aMidY = oy + totalH + 8;
      ctx.fillText(`a=${a}`, aMidX, aMidY);

      // b label
      const bMidX = ox + totalW + 8;
      const bMidY = (oy + oy + a * cellSize) / 2;
      ctx.textAlign = 'center';
      ctx.fillText(`b=${b}`, bMidX, bMidY);

      // Right angle markers
      const drawRightAngle = (x: number, y: number, dirX: number, dirY: number) => {
        const s = 10;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + dirX * s, y);
        ctx.lineTo(x + dirX * s, y + dirY * s);
        ctx.stroke();
      };
      drawRightAngle(ox + a * cellSize, oy, 0, 1);
    } else if (mode === 'triangle-explorer') {
      // Triangle Explorer mode
      const a = a_;
      const b = b_;
      const c = Math.sqrt(a * a + b * b);

      const scale = 35;
      // Right triangle at origin
      const ox_ = cx - 120;
      const oy_ = cy + 80;

      // Draw triangle
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.beginPath();
      ctx.moveTo(ox_, oy_);
      ctx.lineTo(ox_ + a * scale, oy_);
      ctx.lineTo(ox_, oy_ - b * scale);
      ctx.closePath();
      ctx.fill();

      // Sides
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ox_, oy_);
      ctx.lineTo(ox_ + a * scale, oy_);
      ctx.stroke();
      ctx.strokeStyle = '#EF4444';
      ctx.beginPath();
      ctx.moveTo(ox_, oy_);
      ctx.lineTo(ox_, oy_ - b * scale);
      ctx.stroke();
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ox_ + a * scale, oy_);
      ctx.lineTo(ox_, oy_ - b * scale);
      ctx.stroke();

      // Right angle
      const s = 10;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ox_ + s, oy_);
      ctx.lineTo(ox_ + s, oy_ - s);
      ctx.lineTo(ox_, oy_ - s);
      ctx.stroke();

      // Labels
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#3B82F6';
      ctx.fillText(`a = ${a}`, ox_ + a * scale / 2, oy_ + 22);
      ctx.fillStyle = '#EF4444';
      ctx.fillText(`b = ${b}`, ox_ - 25, oy_ - b * scale / 2);
      ctx.fillStyle = '#10B981';
      ctx.fillText(`c = ${c.toFixed(2)}`, ox_ + a * scale / 2 + 10, oy_ - b * scale / 2 - 5);

      // Verify
      const sum = a * a + b * b;
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`${a}² + ${b}² = ${a * a} + ${b * b} = ${sum}`, cx, 30);
      ctx.fillStyle = '#10B981';
      ctx.fillText(`c² = ${(c * c).toFixed(2)}`, cx, 52);
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`${Math.abs(sum - c * c) < 0.01 ? '✅ 勾股定理成立！' : '❌ 不是直角三角形'}`, cx, 80);
    }

  }, [mode, a_, b_]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: 8, display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button onClick={() => { setA(3); setB(4); }}
          style={{ padding: '3px 10px', background: a_ === 3 && b_ === 4 ? '#3B82F6' : '#e2e8f0', color: a_ === 3 && b_ === 4 ? '#fff' : '#374151', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
          (3,4,5)
        </button>
        <button onClick={() => { setA(5); setB(12); }}
          style={{ padding: '3px 10px', background: a_ === 5 && b_ === 12 ? '#3B82F6' : '#e2e8f0', color: a_ === 5 && b_ === 12 ? '#fff' : '#374151', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
          (5,12,13)
        </button>
        <button onClick={() => { setA(6); setB(8); }}
          style={{ padding: '3px 10px', background: a_ === 6 && b_ === 8 ? '#3B82F6' : '#e2e8f0', color: a_ === 6 && b_ === 8 ? '#fff' : '#374151', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
          (6,8,10)
        </button>
        <span style={{ fontSize: 12, color: '#666', lineHeight: '24px' }}>
          a: <input type="range" min="2" max="10" step="1" value={a_}
            onChange={e => setA(parseInt(e.target.value))} style={{ width: 60, verticalAlign: 'middle' }} />{a_}
          b: <input type="range" min="2" max="10" step="1" value={b_}
            onChange={e => setB(parseInt(e.target.value))} style={{ width: 60, verticalAlign: 'middle' }} />{b_}
        </span>
      </div>
      <canvas ref={canvasRef} width={600} height={340}
        style={{ maxWidth: '100%', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }} />
    </div>
  );
}
