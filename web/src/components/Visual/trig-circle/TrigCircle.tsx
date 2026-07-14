import { useRef, useEffect, useState } from 'react';

/**
 * 单位圆上的三角函数演示 — 展示 sin, cos, tan 的几何意义
 */
export default function TrigCircle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(45);
  const [autoPlay, setAutoPlay] = useState(false);

  const rad = angle * Math.PI / 180;
  const cosVal = Math.cos(rad).toFixed(3);
  const sinVal = Math.sin(rad).toFixed(3);
  const tanVal = Math.tan(rad).toFixed(3);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setAngle(a => (a + 2) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [autoPlay]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = 140;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let x = -160; x <= 160; x += 20) {
      ctx.beginPath();
      ctx.moveTo(cx + x, 10);
      ctx.lineTo(cx + x, h - 10);
      ctx.stroke();
    }
    for (let y = -160; y <= 160; y += 20) {
      ctx.beginPath();
      ctx.moveTo(10, cy + y);
      ctx.lineTo(w - 10, cy + y);
      ctx.stroke();
    }

    // Axes
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
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('cos (实)', w - 55, cy + 18);
    ctx.fillText('sin (虚)', cx + 18, 22);
    ctx.fillText('O', cx - 14, cy + 18);

    // Unit circle
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Angle arc
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.2, cy);
    ctx.arc(cx, cy, r * 0.2, 0, -rad, true);
    ctx.stroke();

    // Angle label
    ctx.fillStyle = '#8B5CF6';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    const labelAngle = rad / 2;
    ctx.fillText(`${angle}°`, cx + r * 0.35 * Math.cos(labelAngle), cy - r * 0.35 * Math.sin(labelAngle));

    // Point on circle
    const px = cx + r * Math.cos(rad);
    const py = cy - r * Math.sin(rad);

    // Radius line
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();

    // Point
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.stroke();

    // sin line (vertical)
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(px, cy);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // cos line (horizontal)
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // tan line (tangent)
    if (Math.abs(Math.cos(rad)) > 0.01) {
      const tanX = cx + r;
      const tanY = cy - r * Math.tan(rad);
      if (tanY > -2000 && tanY < 2000) {
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(cx + r, cy);
        ctx.lineTo(cx + r, tanY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Labels
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'left';

    // sin label
    ctx.fillStyle = '#EF4444';
    const sinMidX = px + 22;
    const sinMidY = (cy + py) / 2;
    ctx.fillText(`sin=${sinVal}`, sinMidX, sinMidY + 5);

    // cos label
    ctx.fillStyle = '#3B82F6';
    const cosMidY = cy + 18;
    const cosMidX = (cx + px) / 2;
    ctx.textAlign = 'center';
    ctx.fillText(`cos=${cosVal}`, cosMidX, cosMidY);

    // tan label
    if (Math.abs(Math.cos(rad)) > 0.05) {
      ctx.fillStyle = '#F59E0B';
      ctx.textAlign = 'left';
      ctx.fillText(`tan=${tanVal}`, cx + r + 8, cy + 5);
    }

    // Legend
    const legendY = h - 55;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(15, legendY, 14, 3);
    ctx.fillText('sin（正弦）', 33, legendY + 5);
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(130, legendY, 14, 3);
    ctx.fillText('cos（余弦）', 148, legendY + 5);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(250, legendY, 14, 3);
    ctx.fillText('tan（正切）', 268, legendY + 5);

  }, [angle, autoPlay]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={500} height={400}
        style={{ maxWidth: '100%', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }} />

      <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12 }}>
          角度：
          <input type="range" min="0" max="360" step="1" value={angle}
            onChange={e => setAngle(parseInt(e.target.value))}
            style={{ width: 180, verticalAlign: 'middle' }} />
          <span style={{ display: 'inline-block', minWidth: 30, fontWeight: 'bold' }}>{angle}°</span>
          <span style={{ marginLeft: 8, color: '#EF4444' }}>sin={sinVal}</span>
          <span style={{ marginLeft: 8, color: '#3B82F6' }}>cos={cosVal}</span>
          <span style={{ marginLeft: 8, color: '#F59E0B' }}>tan={tanVal}</span>
        </span>
        <button onClick={() => setAutoPlay(!autoPlay)}
          style={{ padding: '4px 14px', background: autoPlay ? '#EF4444' : '#8B5CF6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
          {autoPlay ? '⏹ 停止' : '▶ 自动旋转'}
        </button>
      </div>
      <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
        拖拽滑块或点击自动旋转，观察 sin/cos/tan 在单位圆上的几何意义
      </p>
    </div>
  );
}
