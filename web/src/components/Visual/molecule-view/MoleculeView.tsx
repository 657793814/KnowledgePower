/**
 * 分子结构展示 — SVG 简易分子图
 * 支持水、甲烷、二氧化碳、氯化钠等常见分子
 */
import { useMemo } from 'react';

interface Atom {
  symbol: string;
  x: number;
  y: number;
  color: string;
  radius?: number;
}

interface Bond {
  from: number;
  to: number;
  type?: 'single' | 'double';
}

interface Props {
  /** 分子类型: water | methane | co2 | nacl | o2 | h2 */
  molecule?: string;
  /** 自定义原子 */
  atoms?: Atom[];
  /** 自定义化学键 */
  bonds?: Bond[];
  /** 标签 */
  showLabel?: boolean;
}

const MOLECULES: Record<string, { atoms: Atom[]; bonds: Bond[] }> = {
  water: {
    atoms: [
      { symbol: 'O', x: 80, y: 80, color: '#ef4444', radius: 18 },
      { symbol: 'H', x: 45, y: 45, color: '#3b82f6', radius: 12 },
      { symbol: 'H', x: 115, y: 45, color: '#3b82f6', radius: 12 },
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
    ],
  },
  methane: {
    atoms: [
      { symbol: 'C', x: 90, y: 80, color: '#333', radius: 16 },
      { symbol: 'H', x: 45, y: 50, color: '#3b82f6', radius: 12 },
      { symbol: 'H', x: 135, y: 50, color: '#3b82f6', radius: 12 },
      { symbol: 'H', x: 60, y: 120, color: '#3b82f6', radius: 12 },
      { symbol: 'H', x: 120, y: 120, color: '#3b82f6', radius: 12 },
    ],
    bonds: [
      { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 },
    ],
  },
  co2: {
    atoms: [
      { symbol: 'C', x: 100, y: 80, color: '#333', radius: 14 },
      { symbol: 'O', x: 50, y: 80, color: '#ef4444', radius: 16 },
      { symbol: 'O', x: 150, y: 80, color: '#ef4444', radius: 16 },
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2, type: 'double' },
    ],
  },
  nacl: {
    atoms: [
      { symbol: 'Na⁺', x: 60, y: 80, color: '#f59e0b', radius: 14 },
      { symbol: 'Cl⁻', x: 120, y: 80, color: '#10b981', radius: 18 },
    ],
    bonds: [
      { from: 0, to: 1 },
    ],
  },
};

export default function MoleculeView({ molecule = 'water', atoms: customAtoms, bonds: customBonds, showLabel = true }: Props) {
  const { atoms, bonds } = useMemo(() => {
    if (customAtoms) return { atoms: customAtoms, bonds: customBonds || [] };
    const mol = MOLECULES[molecule];
    if (!mol) return { atoms: MOLECULES.water.atoms, bonds: MOLECULES.water.bonds };
    return mol;
  }, [molecule, customAtoms, customBonds]);

  const labelMap: Record<string, string> = {
    water: 'H₂O 水分子',
    methane: 'CH₄ 甲烷',
    co2: 'CO₂ 二氧化碳',
    nacl: 'NaCl 氯化钠',
    o2: 'O₂ 氧气',
    h2: 'H₂ 氢气',
  };

  return (
    <div style={{ textAlign: 'center', margin: '8px 0' }}>
      <svg viewBox="0 0 200 160" width={200} height={160}
        style={{ maxWidth: '100%', height: 'auto' }}>
        <rect x={0} y={0} width={200} height={160} fill="#fafafa" rx={8} />
        {atoms.map((a, i) => (
          <circle key={`a-${i}`} cx={a.x} cy={a.y} r={a.radius || 16}
            fill={a.color} fillOpacity={0.85} stroke="#fff" strokeWidth={2} />
        ))}
        {bonds.map((b, i) => {
          const from = atoms[b.from];
          const to = atoms[b.to];
          if (!from || !to) return null;
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len === 0) return null;
          const ux = dx / len;
          const uy = dy / len;
          const r1 = (from.radius || 16) + 2;
          const r2 = (to.radius || 16) + 2;
          const x1 = from.x + ux * r1;
          const y1 = from.y + uy * r1;
          const x2 = to.x - ux * r2;
          const y2 = to.y - uy * r2;

          if (b.type === 'double') {
            const px = -uy * 3;
            const py = ux * 3;
            return (
              <g key={`b-${i}`}>
                <line x1={x1 + px} y1={y1 + py} x2={x2 + px} y2={y2 + py}
                  stroke="#94a3b8" strokeWidth={2.5} />
                <line x1={x1 - px} y1={y1 - py} x2={x2 - px} y2={y2 - py}
                  stroke="#94a3b8" strokeWidth={2.5} />
              </g>
            );
          }
          return (
            <line key={`b-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#94a3b8" strokeWidth={2.5} />
          );
        })}
        {atoms.map((a, i) => (
          <text key={`t-${i}`} x={a.x} y={a.y + 5}
            fill="#fff" fontSize={a.radius && a.radius >= 16 ? 14 : 11}
            fontWeight={700} textAnchor="middle" dominantBaseline="middle">
            {a.symbol}
          </text>
        ))}
      </svg>
      {showLabel && <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{labelMap[molecule] || molecule}</div>}
    </div>
  );
}
