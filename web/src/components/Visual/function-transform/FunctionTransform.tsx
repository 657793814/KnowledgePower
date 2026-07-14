import { useRef, useEffect, useState } from 'react';

/**
 * 函数变换演示 — 二次函数参数调节 + 方程组交点
 * 展示 y = a(x-h)² + k 的图像，以及直线方程组
 */
export default function FunctionTransform({ mode = 'quadratic', a = 1, b = 0, c = 0 }: {
  mode?: string;
  a?: number;
  b?: number;
  c?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 参数状态
  const [params, setParams] = useState({ a: 1, h: 0, k: 0 });
  const [showOrigin, setShowOrigin] = useState(false);
  const [mode_, setMode_] = useState(mode);

  // 直线方程组模式
  const [lineParams, setLineParams] = useState({ a1: 1, b1: -1, c1: 2, a2: 2, b2: 1, c2: 7 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 30;

    const drawGrid = () => {
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      for (let x = -12; x <= 12; x++) {
        ctx.beginPath();
        ctx.moveTo(cx + x * scale, 10);
        ctx.lineTo(cx + x * scale, h - 10);
        ctx.stroke();
      }
      for (let y = -10; y <= 10; y++) {
        ctx.beginPath();
        ctx.moveTo(10, cy + y * scale);
        ctx.lineTo(w - 10, cy + y * scale);
        ctx.stroke();
      }
    };

    const drawAxes = () => {
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
      ctx.fillText('x', w - 30, cy + 18);
      ctx.fillText('y', cx + 15, 28);
      ctx.fillText('O', cx - 14, cy + 18);

      // 刻度标记
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#94a3b8';
      for (let x = -10; x <= 10; x++) {
        if (x === 0) continue;
        const px = cx + x * scale;
        ctx.beginPath();
        ctx.moveTo(px, cy - 4);
        ctx.lineTo(px, cy + 4);
        ctx.stroke();
        ctx.fillText(String(x), px, cy + 16);
      }
      for (let y = -8; y <= 8; y++) {
        if (y === 0) continue;
        const py = cy - y * scale;
        ctx.beginPath();
        ctx.moveTo(cx - 4, py);
        ctx.lineTo(cx + 4, py);
        ctx.stroke();
        ctx.textAlign = 'right';
        ctx.fillText(String(y), cx - 8, py + 4);
        ctx.textAlign = 'center';
      }
    };

    ctx.clearRect(0, 0, w, h);
    drawGrid();
    drawAxes();

    if (mode_ === 'quadratic' || mode_ === 'quadratic-roots') {
      // 二次函数 y = a(x-h)² + k = ax² - 2ahx + (ah²+k)
      const { a, h, k } = params;
      const A = a;
      const H = h;
      const K = k;
      const xMin = -10;
      const xMax = 10;
      const step = 0.05;

      // 主曲线
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let first = true;
      for (let x = xMin; x <= xMax; x += step) {
        const y = A * (x - H) ** 2 + K;
        const px = cx + x * scale;
        const py = cy - y * scale;
        if (py < -500 || py > 500) { first = true; continue; }
        if (first) { ctx.moveTo(px, py); first = false; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // 顶点标注
      const vx = cx + H * scale;
      const vy = cy - K * scale;
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(vx, vy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`顶点 (${H.toFixed(1)}, ${K.toFixed(1)})`, vx + 10, vy - 5);

      // 对称轴
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(vx, 20);
      ctx.lineTo(vx, h - 20);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#EF4444';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`x=${H.toFixed(1)}`, vx, h - 25);

      // 根标记（二次方程模式）
      if (mode_ === 'quadratic-roots') {
        const disc = A !== 0 ? H * H - K / A : 0;
        const sA = A;
        if (sA !== 0) {
          // y = a(x-h)² + k = 0 → a(x-h)² = -k → (x-h)² = -k/a
          const rhs = -K / sA;
          if (rhs >= 0) {
            const rootOffset = Math.sqrt(rhs);
            const root1 = H - rootOffset;
            const root2 = H + rootOffset;
            const r1x = cx + root1 * scale;
            const r2x = cx + root2 * scale;

            ctx.fillStyle = '#10B981';
            ctx.beginPath();
            ctx.arc(r1x, cy, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(r2x, cy, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#10B981';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`x₁=${root1.toFixed(2)}`, r1x, cy + 22);
            ctx.fillText(`x₂=${root2.toFixed(2)}`, r2x, cy + 22);
          } else {
            ctx.fillStyle = '#64748b';
            ctx.font = '13px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('无实数根（Δ<0）', cx, h - 50);
          }
        }
      }

      if (showOrigin) {
        // y=x² 参考线
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        first = true;
        for (let x = xMin; x <= xMax; x += step) {
          const y = x * x;
          const px = cx + x * scale;
          const py = cy - y * scale;
          if (py < -500 || py > 500) { first = true; continue; }
          if (first) { ctx.moveTo(px, py); first = false; }
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '11px sans-serif';
        ctx.fillText('y = x²', cx + 6.5 * scale, cy - 43 * scale);
      }
    } else if (mode_ === 'linear-system') {
      // 直线方程组
      const { a1, b1, c1, a2, b2, c2 } = lineParams;
      const xMin = -10;
      const xMax = 10;
      const step = 0.05;

      // 直线 1: a1*x + b1*y = c1 → y = (c1 - a1*x)/b1
      const drawLine = (a: number, b: number, c: number, color: string, label: string) => {
        if (b === 0) {
          // 竖直线 x = c/a
          const px = cx + (c / a) * scale;
          ctx.strokeStyle = color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(px, 20);
          ctx.lineTo(px, h - 20);
          ctx.stroke();
          ctx.fillStyle = color;
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(label, px, 40);
          return null;
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        let first = true;
        for (let x = xMin; x <= xMax; x += step) {
          const y = (c - a * x) / b;
          const px = cx + x * scale;
          const py = cy - y * scale;
          if (py < -500 || py > 500) { first = true; continue; }
          if (first) { ctx.moveTo(px, py); first = false; }
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'left';
        const endX = 8;
        const endY = (c - a * endX) / b;
        ctx.fillText(label, cx + endX * scale + 8, cy - endY * scale - 5);
        return { a, b, c };
      };

      drawLine(a1, b1, c1, '#3B82F6', 'L₁: ' + `${a1}x+${b1}y=${c1}`);
      drawLine(a2, b2, c2, '#EF4444', 'L₂: ' + `${a2}x+${b2}y=${c2}`);

      // 计算交点
      const det = a1 * b2 - a2 * b1;
      if (Math.abs(det) > 0.001) {
        const ix = (c1 * b2 - c2 * b1) / det;
        const iy = (a1 * c2 - a2 * c1) / det;
        const px = cx + ix * scale;
        const py = cy - iy * scale;

        // 交点标记
        ctx.fillStyle = '#8B5CF6';
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#1a1a2e';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`交点 (${ix.toFixed(2)}, ${iy.toFixed(2)})`, px + 14, py + 5);
      } else {
        // 平行
        ctx.fillStyle = '#64748b';
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('两条直线平行，无交点', cx, 35);
      }
    }
  }, [params, showOrigin, mode_, lineParams]);

  return (
    <div style={{ textAlign: 'center' }}>
      {/* 模式切换 */}
      <div style={{ marginBottom: 8, display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button onClick={() => setMode_('quadratic')}
          style={{ padding: '4px 12px', background: mode_ === 'quadratic' ? '#3B82F6' : '#e2e8f0', color: mode_ === 'quadratic' ? '#fff' : '#374151', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
          📈 二次函数
        </button>
        <button onClick={() => setMode_('quadratic-roots')}
          style={{ padding: '4px 12px', background: mode_ === 'quadratic-roots' ? '#10B981' : '#e2e8f0', color: mode_ === 'quadratic-roots' ? '#fff' : '#374151', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
          📊 二次方程求根
        </button>
        <button onClick={() => setMode_('linear-system')}
          style={{ padding: '4px 12px', background: mode_ === 'linear-system' ? '#8B5CF6' : '#e2e8f0', color: mode_ === 'linear-system' ? '#fff' : '#374151', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
          🔀 方程组交点
        </button>
      </div>

      <canvas ref={canvasRef} width={700} height={400}
        style={{ maxWidth: '100%', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }} />

      {/* 参数滑块 */}
      {(mode_ === 'quadratic' || mode_ === 'quadratic-roots') && (
        <div style={{ marginTop: 8, maxWidth: 500, margin: '8px auto' }}>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <label style={{ fontSize: 12 }}>a =
              <input type="range" min="-3" max="3" step="0.1" value={params.a}
                onChange={e => setParams(p => ({ ...p, a: parseFloat(e.target.value) }))}
                style={{ width: 100, verticalAlign: 'middle', marginLeft: 4 }} />
              <span style={{ display: 'inline-block', minWidth: 30, textAlign: 'right' }}>{params.a.toFixed(1)}</span>
            </label>
            <label style={{ fontSize: 12 }}>h =
              <input type="range" min="-5" max="5" step="0.1" value={params.h}
                onChange={e => setParams(p => ({ ...p, h: parseFloat(e.target.value) }))}
                style={{ width: 100, verticalAlign: 'middle', marginLeft: 4 }} />
              <span style={{ display: 'inline-block', minWidth: 30, textAlign: 'right' }}>{params.h.toFixed(1)}</span>
            </label>
            <label style={{ fontSize: 12 }}>k =
              <input type="range" min="-5" max="5" step="0.1" value={params.k}
                onChange={e => setParams(p => ({ ...p, k: parseFloat(e.target.value) }))}
                style={{ width: 100, verticalAlign: 'middle', marginLeft: 4 }} />
              <span style={{ display: 'inline-block', minWidth: 30, textAlign: 'right' }}>{params.k.toFixed(1)}</span>
            </label>
          </div>
          <div style={{ marginTop: 4 }}>
            <label style={{ fontSize: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={showOrigin} onChange={e => setShowOrigin(e.target.checked)} /> 显示 y=x² 参考线
            </label>
          </div>
          <p style={{ fontSize: 13, color: '#3B82F6', marginTop: 4 }}>
            y = {params.a.toFixed(1)}(x {params.h >= 0 ? '-' : '+'} {Math.abs(params.h).toFixed(1)})² {params.k >= 0 ? '+' : '-'} {Math.abs(params.k).toFixed(1)}
          </p>
          <p style={{ fontSize: 12, color: '#666' }}>
            拖拽滑块调节参数，观察图像实时变化 | a 控制开口方向和宽窄，h 控制左右平移，k 控制上下平移
          </p>
        </div>
      )}

      {/* 直线参数滑块 */}
      {mode_ === 'linear-system' && (
        <div style={{ marginTop: 8, maxWidth: 600, margin: '8px auto' }}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', fontSize: 12 }}>
            <span>L₁:
              <input type="range" min="-5" max="5" step="0.5" value={lineParams.a1}
                onChange={e => setLineParams(p => ({ ...p, a1: parseFloat(e.target.value) }))}
                style={{ width: 60 }} />{lineParams.a1.toFixed(1)}x
              <input type="range" min="-5" max="5" step="0.5" value={lineParams.b1}
                onChange={e => setLineParams(p => ({ ...p, b1: parseFloat(e.target.value) }))}
                style={{ width: 60 }} />{lineParams.b1.toFixed(1)}y=
              <input type="range" min="-10" max="10" step="1" value={lineParams.c1}
                onChange={e => setLineParams(p => ({ ...p, c1: parseFloat(e.target.value) }))}
                style={{ width: 60 }} />{lineParams.c1.toFixed(0)}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', fontSize: 12, marginTop: 4 }}>
            <span>L₂:
              <input type="range" min="-5" max="5" step="0.5" value={lineParams.a2}
                onChange={e => setLineParams(p => ({ ...p, a2: parseFloat(e.target.value) }))}
                style={{ width: 60 }} />{lineParams.a2.toFixed(1)}x
              <input type="range" min="-5" max="5" step="0.5" value={lineParams.b2}
                onChange={e => setLineParams(p => ({ ...p, b2: parseFloat(e.target.value) }))}
                style={{ width: 60 }} />{lineParams.b2.toFixed(1)}y=
              <input type="range" min="-10" max="10" step="1" value={lineParams.c2}
                onChange={e => setLineParams(p => ({ ...p, c2: parseFloat(e.target.value) }))}
                style={{ width: 60 }} />{lineParams.c2.toFixed(0)}
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            拖拽滑块调节两条直线的参数，交点即为方程组的解
          </p>
        </div>
      )}
    </div>
  );
}
