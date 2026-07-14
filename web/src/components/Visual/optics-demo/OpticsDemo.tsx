/**
 * 光学演示 — SVG 光的反射/折射示意图
 */
interface Props {
  /** 演示类型: reflection | refraction | lens */
  demo?: string;
  /** 入射角度（度） */
  angle?: number;
}

export default function OpticsDemo({ demo = 'reflection', angle = 45 }: Props) {
  const w = 280;
  const h = 240;

  const mirrorX = 140;
  const mirrorY = 40;

  // 反射
  if (demo === 'reflection') {
    const rad = (angle * Math.PI) / 180;
    const inLen = 70;
    const outLen = 70;
    const inEndX = mirrorX - inLen * Math.sin(rad);
    const inEndY = mirrorY + inLen * Math.cos(rad);
    const outEndX = mirrorX + outLen * Math.sin(rad);
    const outEndY = mirrorY + outLen * Math.cos(rad);

    return (
      <div style={{ textAlign: 'center', margin: '8px 0' }}>
        <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ maxWidth: '100%', height: 'auto' }}>
          <rect x={0} y={0} width={w} height={h} fill="#fafafa" rx={8} />
          {/* 镜面 */}
          <line x1={0} y1={mirrorY} x2={w} y2={mirrorY} stroke="#64748b" strokeWidth={3} />
          {/* 斜线表示镜面背部 */}
          <defs>
            <pattern id="hatch" width="8" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#cbd5e1" strokeWidth={1} />
            </pattern>
          </defs>
          <rect x={0} y={mirrorY - 6} width={w} height={6} fill="url(#hatch)" opacity={0.5} />
          {/* 法线 */}
          <line x1={mirrorX} y1={0} x2={mirrorX} y2={h} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,4" />
          <text x={mirrorX - 18} y={14} fill="#94a3b8" fontSize={11}>法线</text>
          {/* 入射光线 */}
          <line x1={inEndX} y1={inEndY} x2={mirrorX} y2={mirrorY}
            stroke="#3b82f6" strokeWidth={2} />
          <polygon
            points={`${inEndX},${inEndY} ${inEndX + 6 * Math.cos(rad + 0.4)},${inEndY + 6 * Math.sin(rad + 0.4)} ${inEndX + 6 * Math.cos(rad - 0.4)},${inEndY + 6 * Math.sin(rad - 0.4)}`}
            fill="#3b82f6" />
          {/* 反射光线 */}
          <line x1={mirrorX} y1={mirrorY} x2={outEndX} y2={outEndY}
            stroke="#f59e0b" strokeWidth={2} />
          <polygon
            points={`${outEndX},${outEndY} ${outEndX - 6 * Math.cos(rad + 0.4)},${outEndY - 6 * Math.sin(rad + 0.4)} ${outEndX - 6 * Math.cos(rad - 0.4)},${outEndY - 6 * Math.sin(rad - 0.4)}`}
            fill="#f59e0b" />
          {/* 角度弧 */}
          <path d={`M${mirrorX + 20} ${mirrorY} A 20 20 0 0 0 ${mirrorX + 20 * Math.cos(rad)} ${mirrorY + 20 * Math.sin(rad)}`}
            fill="none" stroke="#94a3b8" strokeWidth={1} />
          <path d={`M${mirrorX - 20} ${mirrorY} A 20 20 0 0 1 ${mirrorX - 20 * Math.cos(rad)} ${mirrorY + 20 * Math.sin(rad)}`}
            fill="none" stroke="#94a3b8" strokeWidth={1} />
          <text x={mirrorX + 22} y={mirrorY + 18} fill="#64748b" fontSize={12}>θ₁</text>
          <text x={mirrorX - 34} y={mirrorY + 18} fill="#64748b" fontSize={12}>θ₁'</text>
          {/* 标签 */}
          <text x={inEndX - 30} y={inEndY + 4} fill="#3b82f6" fontSize={12}>入射光</text>
          <text x={outEndX + 4} y={outEndY + 4} fill="#f59e0b" fontSize={12}>反射光</text>
          {/* 镜面标签 */}
          <text x={w - 60} y={mirrorY - 10} fill="#64748b" fontSize={12}>镜面</text>
        </svg>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
          反射定律：入射角 θ₁ = 反射角 θ₁'
        </div>
      </div>
    );
  }

  // 折射线
  if (demo === 'refraction') {
    const rad = (angle * Math.PI) / 180;
    const n1 = 1.0; // 空气
    const n2 = 1.33; // 水
    const refrRad = Math.asin((n1 / n2) * Math.sin(rad));
    if (isNaN(refrRad)) return null;

    const inLen = 70;
    const inEndX = mirrorX - inLen * Math.sin(rad);
    const inEndY = mirrorY - inLen * Math.cos(rad);
    const outLen = 80;
    const outEndX = mirrorX + outLen * Math.sin(refrRad);
    const outEndY = mirrorY + outLen * Math.cos(refrRad);

    return (
      <div style={{ textAlign: 'center', margin: '8px 0' }}>
        <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ maxWidth: '100%', height: 'auto' }}>
          <rect x={0} y={0} width={w} height={h} fill="#fafafa" rx={8} />
          {/* 空气(上) / 水(下) */}
          <rect x={0} y={mirrorY} width={w} height={h - mirrorY} fill="#e0f2fe" opacity={0.2} />
          <text x={10} y={20} fill="#64748b" fontSize={11}>空气 n₁=1.0</text>
          <text x={10} y={h - 10} fill="#0ea5e9" fontSize={11}>水 n₂=1.33</text>
          {/* 界面 */}
          <line x1={0} y1={mirrorY} x2={w} y2={mirrorY} stroke="#64748b" strokeWidth={3} />
          {/* 法线 */}
          <line x1={mirrorX} y1={0} x2={mirrorX} y2={h} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,4" />
          {/* 入射光线 */}
          <line x1={inEndX} y1={inEndY} x2={mirrorX} y2={mirrorY}
            stroke="#3b82f6" strokeWidth={2} />
          {/* 折射光线 */}
          <line x1={mirrorX} y1={mirrorY} x2={outEndX} y2={outEndY}
            stroke="#f59e0b" strokeWidth={2} />
          <polygon
            points={`${outEndX},${outEndY} ${outEndX - 6 * Math.cos(refrRad + 0.4)},${outEndY - 6 * Math.sin(refrRad + 0.4)} ${outEndX - 6 * Math.cos(refrRad - 0.4)},${outEndY - 6 * Math.sin(refrRad - 0.4)}`}
            fill="#f59e0b" />
          {/* 角度标注 */}
          <text x={mirrorX + 22} y={mirrorY + 18} fill="#64748b" fontSize={12}>θ₁</text>
          <text x={mirrorX + 30} y={mirrorY + 55} fill="#64748b" fontSize={12}>θ₂</text>
          {/* 公式 */}
          <text x={mirrorX - 60} y={h - 30} fill="#5B21B6" fontSize={12} fontStyle="italic">
            n₁sinθ₁ = n₂sinθ₂
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: 20, color: '#94a3b8' }}>
      光学演示组件待开发
    </div>
  );
}
