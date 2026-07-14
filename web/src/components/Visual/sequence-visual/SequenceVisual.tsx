import { useRef, useEffect, useState } from 'react';

/**
 * 数列互动演示 — 等差数列 + 等比数列可视化
 */
export default function SequenceVisual({ mode = 'demo' }: { mode?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [seqType, setSeqType] = useState<'arithmetic' | 'geometric'>('arithmetic');
  const [a1, setA1] = useState(3);
  const [d, setD] = useState(2);
  const [q, setQ] = useState(1.5);
  const [n, setN] = useState(10);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const padding = { left: 60, right: 30, top: 40, bottom: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);

    // Generate sequence values
    const values: number[] = [];
    let maxVal = 0;
    for (let i = 0; i < n; i++) {
      let val: number;
      if (seqType === 'arithmetic') {
        val = a1 + i * d;
      } else {
        val = a1 * Math.pow(q, i);
      }
      values.push(val);
      if (Math.abs(val) > maxVal) maxVal = Math.abs(val);
    }

    // Compute sum
    let sum = 0;
    if (seqType === 'arithmetic') {
      sum = n * (a1 + a1 + (n - 1) * d) / 2;
    } else {
      if (Math.abs(q - 1) > 0.001) {
        sum = a1 * (1 - Math.pow(q, n)) / (1 - q);
      } else {
        sum = n * a1;
      }
    }

    maxVal = Math.max(maxVal, 1);
    const scaleY = chartH / (maxVal * 1.3);
    const barWidth = chartW / n * 0.7;
    const gap = chartW / n * 0.3;

    // Draw axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.stroke();

    // Y-axis label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('aₙ', 30, padding.top + 14);

    // Title
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    const title = seqType === 'arithmetic' ? '等差数列' : '等比数列';
    ctx.fillText(title, w / 2, 22);

    // Formula
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#64748b';
    const formula = seqType === 'arithmetic'
      ? `a₁=${a1}, d=${d}  |  aₙ=${a1}+(n-1)×(${d})  |  Sₙ=${sum.toFixed(1)}`
      : `a₁=${a1}, q=${q.toFixed(1)}  |  aₙ=${a1}×(${q.toFixed(1)})ⁿ⁻¹  |  Sₙ=${sum.toFixed(1)}`;
    ctx.fillText(formula, w / 2, h - 10);

    // Draw bars
    for (let i = 0; i < n; i++) {
      const x = padding.left + i * (barWidth + gap) + gap / 2;
      const barH = values[i] * scaleY;
      const y = padding.top + chartH - barH;

      // Bar
      const hue = seqType === 'arithmetic' ? 210 : 150;
      const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH);
      gradient.addColorStop(0, `hsl(${hue}, 60%, 55%)`);
      gradient.addColorStop(1, `hsl(${hue}, 60%, 75%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barH);

      // Value label on top
      ctx.fillStyle = '#374151';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(values[i].toFixed(0), x + barWidth / 2, y - 5);

      // X label (n)
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.fillText(`n=${i + 1}`, x + barWidth / 2, padding.top + chartH + 15);

      // Connect with line for geometric sequence
      if (i > 0) {
        const prevX = padding.left + (i - 1) * (barWidth + gap) + gap / 2 + barWidth / 2;
        const prevY = padding.top + chartH - values[i - 1] * scaleY;
        const curX = x + barWidth / 2;
        const curY = y;
        ctx.strokeStyle = `hsla(${hue}, 60%, 45%, 0.3)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(curX, curY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

  }, [seqType, a1, d, q, n]);

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Controls */}
      <div style={{ marginBottom: 8, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', fontSize: 12 }}>
        <select value={seqType} onChange={e => setSeqType(e.target.value as any)}
          style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', fontSize: 12 }}>
          <option value="arithmetic">等差数列</option>
          <option value="geometric">等比数列</option>
        </select>

        <label>a₁=
          <input type="range" min="1" max="10" step="1" value={a1}
            onChange={e => setA1(parseInt(e.target.value))}
            style={{ width: 60, verticalAlign: 'middle' }} />{a1}
        </label>

        {seqType === 'arithmetic' ? (
          <label>d=
            <input type="range" min="-5" max="8" step="1" value={d}
              onChange={e => setD(parseInt(e.target.value))}
              style={{ width: 60, verticalAlign: 'middle' }} />{d}
          </label>
        ) : (
          <label>q=
            <input type="range" min="0.2" max="2.5" step="0.1" value={q}
              onChange={e => setQ(parseFloat(e.target.value))}
              style={{ width: 60, verticalAlign: 'middle' }} />{q.toFixed(1)}
          </label>
        )}

        <label>项数=
          <input type="range" min="4" max="20" step="1" value={n}
            onChange={e => setN(parseInt(e.target.value))}
            style={{ width: 60, verticalAlign: 'middle' }} />{n}
        </label>
      </div>

      <canvas ref={canvasRef} width={640} height={300}
        style={{ maxWidth: '100%', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }} />
    </div>
  );
}
