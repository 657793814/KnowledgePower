/**
 * 受力分析图 — SVG 可视化
 * 支持展示斜面上物体、悬吊物体、自由落体等常见受力场景
 */
import { useMemo } from 'react';

interface ForceArrow {
  label: string;
  dx: number;
  dy: number;
  color: string;
}

interface Props {
  /** 场景类型: incline | hanging | horizontal | freefall */
  scene?: string;
  /** 斜面角度（度） */
  angle?: number;
  /** 是否显示坐标轴 */
  showAxes?: boolean;
  /** 自定义标注 */
  annotations?: string[];
  /** 物体标签 */
  objectLabel?: string;
}

const COLORS = {
  gravity: '#ef4444',
  normal: '#3b82f6',
  friction: '#f59e0b',
  tension: '#8b5cf6',
  applied: '#10b981',
  net: '#ec4899',
};

export default function ForceDiagram({ scene = 'incline', angle = 30, showAxes = false, annotations, objectLabel = '物体' }: Props) {
  const width = 300;
  const height = 280;
  const cx = 150;
  const cy = 140;
  const boxSize = 40;

  const { forces, bgElements } = useMemo(() => {
    const f: ForceArrow[] = [];
    const bg: any[] = [];

    switch (scene) {
      case 'incline': {
        const rad = (angle * Math.PI) / 180;
        // 斜面
        const tipX = cx + 120;
        const tipY = cy + 80;
        bg.push(
          <line key="incline" x1={cx - 100} y1={cy + 60} x2={tipX} y2={tipY} stroke="#94a3b8" strokeWidth={3} />,
          <text key="angle-label" x={cx - 60} y={cy + 50} fill="#64748b" fontSize={13}>θ={angle}°</text>,
          <path key="angle-arc" d={`M${cx - 60} ${cy + 50} A 30 30 0 0 0 ${cx - 37} ${cy + 27}`} fill="none" stroke="#94a3b8" strokeWidth={1} />,
        );
        // 物体
        const bx = cx + 30 * Math.cos(rad);
        const by = cy - 30 * Math.sin(rad);
        bg.push(
          <rect key="box" x={bx - boxSize/2} y={by - boxSize/2} width={boxSize} height={boxSize}
            fill="#e2e8f0" stroke="#64748b" strokeWidth={2} rx={4} />,
        );
        // 重力 (竖直向下)
        f.push({ label: 'G=mg', dx: 0, dy: 50, color: COLORS.gravity });
        // 支持力 (垂直斜面向上)
        f.push({ label: 'N', dx: -30 * Math.sin(rad), dy: -30 * Math.cos(rad), color: COLORS.normal });
        // 摩擦力 (沿斜面向上)
        f.push({ label: 'f', dx: -40 * Math.cos(rad), dy: -40 * Math.sin(rad), color: COLORS.friction });
        break;
      }
      case 'hanging': {
        // 天花板
        bg.push(
          <rect key="ceiling" x={cx - 80} y={10} width={160} height={8} fill="#94a3b8" rx={2} />,
        );
        // 绳子
        bg.push(
          <line key="rope" x1={cx} y1={18} x2={cx} y2={cy - boxSize/2} stroke="#64748b" strokeWidth={2} strokeDasharray="4,3" />,
        );
        // 物体
        bg.push(
          <rect key="box" x={cx - boxSize/2} y={cy - boxSize/2} width={boxSize} height={boxSize}
            fill="#e2e8f0" stroke="#64748b" strokeWidth={2} rx={4} />,
        );
        f.push({ label: 'G=mg', dx: 0, dy: 50, color: COLORS.gravity });
        f.push({ label: 'T', dx: 0, dy: -45, color: COLORS.tension });
        break;
      }
      case 'horizontal': {
        bg.push(
          <line key="surface" x1={cx - 100} y1={cy + boxSize/2} x2={cx + 100} y2={cy + boxSize/2}
            stroke="#94a3b8" strokeWidth={2} />,
          <rect key="box" x={cx - boxSize/2} y={cy - boxSize/2} width={boxSize} height={boxSize}
            fill="#e2e8f0" stroke="#64748b" strokeWidth={2} rx={4} />,
        );
        f.push({ label: 'G=mg', dx: 0, dy: 50, color: COLORS.gravity });
        f.push({ label: 'N', dx: 0, dy: -50, color: COLORS.normal });
        f.push({ label: 'F', dx: 55, dy: 0, color: COLORS.applied });
        f.push({ label: 'f', dx: -45, dy: 0, color: COLORS.friction });
        break;
      }
      case 'freefall': {
        bg.push(
          <line key="ground" x1={cx - 100} y1={cy + 70} x2={cx + 100} y2={cy + 70} stroke="#94a3b8" strokeWidth={3} />,
          <circle key="ball" cx={cx} cy={cy} r={18} fill="#e2e8f0" stroke="#64748b" strokeWidth={2} />,
        );
        f.push({ label: 'G=mg', dx: 0, dy: 65, color: COLORS.gravity });
        break;
      }
    }

    return { forces: f, bgElements: bg };
  }, [scene, angle, cx, cy, boxSize]);

  // 绘制箭头辅助函数
  const renderArrow = (arrow: ForceArrow, i: number) => {
    const originX = cx;
    const originY = cy;
    const endX = originX + arrow.dx;
    const endY = originY + arrow.dy;
    const len = Math.sqrt(arrow.dx ** 2 + arrow.dy ** 2);
    const ang = Math.atan2(arrow.dy, arrow.dx);
    const headSize = 8;

    return (
      <g key={`force-${i}`}>
        <line x1={originX} y1={originY} x2={endX} y2={endY}
          stroke={arrow.color} strokeWidth={2.5} />
        <polygon
          points={`${endX},${endY} ${endX - headSize * Math.cos(ang - 0.4)},${endY - headSize * Math.sin(ang - 0.4)} ${endX - headSize * Math.cos(ang + 0.4)},${endY - headSize * Math.sin(ang + 0.4)}`}
          fill={arrow.color} />
        <text x={endX + (arrow.dx > 0 ? 8 : -8)} y={endY + (arrow.dy > 0 ? 16 : -8)}
          fill={arrow.color} fontSize={13} fontWeight={600}
          textAnchor={arrow.dx > 0 ? 'start' : 'end'}>
          {arrow.label}
        </text>
      </g>
    );
  };

  return (
    <div style={{ textAlign: 'center', margin: '12px 0' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}
        style={{ maxWidth: '100%', height: 'auto' }}>
        <rect x={0} y={0} width={width} height={height} fill="#fafafa" rx={8} />
        {/* 背景元素 */}
        {bgElements}
        {/* 坐标轴 */}
        {showAxes && (
          <>
            <line x1={cx - 80} y1={cy} x2={cx + 80} y2={cy} stroke="#d1d5db" strokeWidth={1} />
            <text x={cx + 80} y={cy + 14} fill="#d1d5db" fontSize={11}>x</text>
            <line x1={cx} y1={cy - 80} x2={cx} y2={cy + 80} stroke="#d1d5db" strokeWidth={1} />
            <text x={cx - 12} y={cy - 75} fill="#d1d5db" fontSize={11}>y</text>
          </>
        )}
        {/* 力箭头 */}
        {forces.map((f, i) => renderArrow(f, i))}
        {/* 标注 */}
        {annotations?.map((ann, i) => (
          <text key={`ann-${i}`} x={cx} y={height - 15 - i * 18}
            fill="#64748b" fontSize={12} textAnchor="middle">{ann}</text>
        ))}
      </svg>
    </div>
  );
}
