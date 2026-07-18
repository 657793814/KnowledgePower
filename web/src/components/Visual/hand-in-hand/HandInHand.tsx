import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';

// ─── Type Definitions ────────────────────────────────────────────────────────────

interface Point {
  x: number;
  y: number;
}

interface Props {
  /** 全等模型 (congruent) 或 相似模型 (similar) */
  model?: 'congruent' | 'similar';
  /** SVG 画布宽度 */
  width?: number;
  /** SVG 画布高度 */
  height?: number;
}

// ─── Geometry Helpers ─────────────────────────────────────────────────────────────

/** 绕 origin 旋转一个点 (角度制) */
function rotatePoint(p: Point, deg: number, origin: Point = { x: 0, y: 0 }): Point {
  const rad = (deg * Math.PI) / 180;
  const dx = p.x - origin.x;
  const dy = p.y - origin.y;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: origin.x + dx * cos - dy * sin,
    y: origin.y + dx * sin + dy * cos,
  };
}

/** 两点距离 */
function dist(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/** 中点 */
function mid(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** 向量归一化 */
function normalize(v: Point): Point {
  const d = Math.sqrt(v.x * v.x + v.y * v.y);
  return d === 0 ? { x: 0, y: 0 } : { x: v.x / d, y: v.y / d };
}

/** 两点之间的角度 (弧度) */
function angleBetween(from: Point, to: Point): number {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

/** 点在圆内约束 */
function clampDistance(pt: Point, minR: number, maxR: number): Point {
  const d = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
  if (d === 0) return { x: maxR, y: 0 };
  if (d < minR) return { x: pt.x * (minR / d), y: pt.y * (minR / d) };
  if (d > maxR) return { x: pt.x * (maxR / d), y: pt.y * (maxR / d) };
  return pt;
}

// ─── Color Palette (Blue Theme) ────────────────────────────────────────────────────

const COLORS = {
  // Corresponding side pairs
  AB: { stroke: '#DC2626', light: '#FCA5A5', fill: '#FEE2E2' },
  AC: { stroke: '#16A34A', light: '#86EFAC', fill: '#DCFCE7' },
  BC: { stroke: '#2563EB', light: '#93C5FD', fill: '#DBEAFE' },

  // Triangle fills & strokes
  tri1Fill: 'rgba(37, 99, 235, 0.06)',
  tri1Stroke: '#2563EB',
  tri2Fill: 'rgba(124, 58, 237, 0.06)',
  tri2Stroke: '#7C3AED',

  // Visual elements
  vertex: '#1E293B',
  vertexStroke: '#FFFFFF',
  label: '#1E293B',
  label2: '#7C3AED',
  arc: '#F59E0B',
  arcFill: 'rgba(245, 158, 11, 0.10)',
  arcText: '#B45309',

  // UI
  panelBg: '#FFFFFF',
  panelBorder: '#E2E8F0',
  panelText: '#1E293B',
  mutedText: '#64748B',
  hintText: '#94A3B8',
};

// ─── SVG Arc Path Helper ───────────────────────────────────────────────────────────

function svgArc(
  center: Point,
  startAngleRad: number,
  endAngleRad: number,
  radius: number,
): string {
  const start: Point = {
    x: center.x + radius * Math.cos(startAngleRad),
    y: center.y + radius * Math.sin(startAngleRad),
  };
  const end: Point = {
    x: center.x + radius * Math.cos(endAngleRad),
    y: center.y + radius * Math.sin(endAngleRad),
  };
  const sweep = endAngleRad > startAngleRad ? 1 : 0;
  const largeArc = Math.abs(endAngleRad - startAngleRad) > Math.PI ? 1 : 0;

  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

// ─── Tick Mark SVG Path ────────────────────────────────────────────────────────────

function tickMark(at: Point, dir: Point, size = 6): string {
  const perp = { x: -dir.y, y: dir.x };
  const half = size / 2;
  const p1 = { x: at.x + perp.x * half, y: at.y + perp.y * half };
  const p2 = { x: at.x - perp.x * half, y: at.y - perp.y * half };
  return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
}

// ─── Side Relation Sub-component ───────────────────────────────────────────────────

function SideRelationRow({
  label,
  val1,
  val2,
  color,
  isSimilar,
}: {
  label: string;
  val1: number;
  val2: number;
  color: string;
  isSimilar: boolean;
}) {
  const ratio = isSimilar ? (val2 / val1) : 1;
  const diff = Math.abs(val1 - val2);
  const matched = !isSimilar && diff < 0.5;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '3px 0',
    }}>
      <span style={{ width: 72, fontSize: 12, color: '#475569', fontWeight: 500, flexShrink: 0 }}>
        {label}
      </span>

      {/* Progress bar */}
      <div style={{
        flex: 1,
        height: 6,
        borderRadius: 3,
        background: `${color}1A`,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          height: '100%',
          width: isSimilar
            ? `${Math.min(ratio / 2 * 100, 100)}%`
            : `${Math.min(val2 / val1 * 100, 100)}%`,
          borderRadius: 3,
          background: color,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Value display */}
      <span style={{
        fontSize: 12,
        color: matched ? '#16A34A' : color,
        fontWeight: matched || isSimilar ? 600 : 400,
        minWidth: 62,
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {isSimilar
          ? `${ratio.toFixed(2)}×`
          : matched
            ? '✓ 相等'
            : `${val1.toFixed(1)} / ${val2.toFixed(1)}`
        }
      </span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────────

export default function HandInHand({
  model = 'congruent',
  width = 800,
  height = 600,
}: Props) {
  // ── State ──────────────────────────────────────────────────────────────────────

  const [angle, setAngle] = useState(45);
  const [ratio, setRatio] = useState(1.5);
  const [isEquilateral, setIsEquilateral] = useState(true);
  const [dragB, setDragB] = useState<Point>({ x: 160, y: -70 });
  const [isDragging, setIsDragging] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);

  const isSimilar = model === 'similar';
  const svgW = width - 280;   // 520px for SVG when width=800
  const panelW = 270;

  // ── Computed Points ────────────────────────────────────────────────────────────

  const A: Point = useMemo(() => ({ x: 230, y: height / 2 }), [height]);

  const B_rel = dragB;

  const C_rel = useMemo<Point>(() => {
    if (isEquilateral) {
      // Rotate AB by -60° to get AC (equilateral triangle pointing up)
      return rotatePoint(B_rel, -60, { x: 0, y: 0 });
    }
    // General triangle: fixed shape offset
    return { x: 30, y: -150 };
  }, [isEquilateral, B_rel]);

  const B: Point = { x: A.x + B_rel.x, y: A.y + B_rel.y };
  const C: Point = { x: A.x + C_rel.x, y: A.y + C_rel.y };

  // Rotated & scaled points D, E
  const D: Point = useMemo(() => {
    const rotated = rotatePoint(B, angle, A);
    if (isSimilar) {
      return {
        x: A.x + (rotated.x - A.x) * ratio,
        y: A.y + (rotated.y - A.y) * ratio,
      };
    }
    return rotated;
  }, [A, B, angle, isSimilar, ratio]);

  const E: Point = useMemo(() => {
    const rotated = rotatePoint(C, angle, A);
    if (isSimilar) {
      return {
        x: A.x + (rotated.x - A.x) * ratio,
        y: A.y + (rotated.y - A.y) * ratio,
      };
    }
    return rotated;
  }, [A, C, angle, isSimilar, ratio]);

  // ── Side Lengths & Data ─────────────────────────────────────────────────────────

  const data = useMemo(() => {
    const ab = dist(A, B);
    const ac = dist(A, C);
    const bc = dist(B, C);
    const ad = dist(A, D);
    const ae = dist(A, E);
    const de = dist(D, E);

    // Congruence / Similarity judgment
    let judgment: string;
    let judgmentColor: string;

    if (isSimilar) {
      const k_ad = ad / ab;
      const k_ae = ae / ac;
      const k_de = bc > 0 ? de / bc : 1;
      const avgK = (k_ad + k_ae + k_de) / 3;
      const consistent =
        Math.abs(k_ad - avgK) < 0.05 &&
        Math.abs(k_ae - avgK) < 0.05 &&
        Math.abs(k_de - avgK) < 0.05;

      judgment = consistent
        ? `△ABC ∼ △ADE (SAS, k = ${avgK.toFixed(2)})`
        : `△ABC ∼ △ADE (SAS)`;
      judgmentColor = '#7C3AED';
    } else {
      const sidesMatch =
        Math.abs(ab - ad) < 0.5 &&
        Math.abs(ac - ae) < 0.5 &&
        Math.abs(bc - de) < 0.5;

      if (sidesMatch) {
        judgment = '△ABC ≅ △ADE (SAS)';
      } else {
        judgment = '△ABC ≅ △ADE';
      }
      judgmentColor = '#2563EB';
    }

    return {
      ab, ac, bc, ad, ae, de,
      judgment,
      judgmentColor,
    };
  }, [A, B, C, D, E, isSimilar]);

  // ── Arc path for rotation angle ──────────────────────────────────────────────────

  const arcRadius = 48;

  const angleArcInfo = useMemo(() => {
    if (angle === 0 || angle === 360) return null;

    const startRad = angleBetween(A, B);
    const endRad = startRad + (angle * Math.PI) / 180;
    const path = svgArc(A, startRad, endRad, arcRadius);
    const midRad = startRad + (angle * Math.PI) / 360;
    const labelPt: Point = {
      x: A.x + (arcRadius + 14) * Math.cos(midRad),
      y: A.y + (arcRadius + 14) * Math.sin(midRad),
    };

    // Tick marks at arc endpoints
    const tickStart: Point = {
      x: A.x + arcRadius * Math.cos(startRad),
      y: A.y + arcRadius * Math.sin(startRad),
    };
    const tickEnd: Point = {
      x: A.x + arcRadius * Math.cos(endRad),
      y: A.y + arcRadius * Math.sin(endRad),
    };
    const tickDir: Point = {
      x: Math.cos(startRad + Math.PI / 2),
      y: Math.sin(startRad + Math.PI / 2),
    };

    return { path, labelPt, tickStart, tickEnd, tickDir };
  }, [A, B, angle]);

  // ── Side midpoints for labels ────────────────────────────────────────────────────

  const midPoints = useMemo(() => ({
    ab: mid(A, B),
    ac: mid(A, C),
    bc: mid(B, C),
    ad: mid(A, D),
    ae: mid(A, E),
    de: mid(D, E),
  }), [A, B, C, D, E]);

  // ── Tick marks positions ─────────────────────────────────────────────────────────

  const tickMarks = useMemo(() => {
    const tickDirAB = normalize({ x: -B_rel.y, y: B_rel.x });
    const tickDirAC = normalize({ x: -C_rel.y, y: C_rel.x });
    const tickDirBC = normalize({ x: -(C.y - B.y), y: C.x - B.x });

    const oneTick = (p: Point, dir: Point) => tickMark(p, dir, 7);

    return {
      ab: oneTick(midPoints.ab, tickDirAB),
      ac: oneTick(midPoints.ac, tickDirAC),
      bc: oneTick(midPoints.bc, tickDirBC),
    };
  }, [B_rel, C_rel, B, C, midPoints]);

  // ── Pointer Handlers ─────────────────────────────────────────────────────────────

  const getLocalPt = useCallback((clientX: number, clientY: number): Point | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only start drag if near point B
    const pt = getLocalPt(e.clientX, e.clientY);
    if (!pt) return;
    if (dist(pt, B) > 20) return;

    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    svg.setPointerCapture(e.pointerId);
    setIsDragging(true);
  }, [A, B, getLocalPt]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const pt = getLocalPt(e.clientX, e.clientY);
    if (!pt) return;

    let relX = pt.x - A.x;
    let relY = pt.y - A.y;

    // Constrain: B must stay in upper-right quadrant (roughly) and within [60, 280] from A
    const constrained = clampDistance({ x: relX, y: relY }, 60, 280);
    // Keep B in upper half
    constrained.y = Math.min(constrained.y, -15);

    setDragB(constrained);
  }, [isDragging, A, getLocalPt]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    const svg = svgRef.current;
    if (svg) {
      try { svg.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    }
  }, []);

  // ── Wheel handler for fine angle control ────────────────────────────────────────

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!svgRef.current) return;
    e.preventDefault();
    setAngle(prev => Math.round(Math.max(0, Math.min(360, prev - e.deltaY * 0.2))));
  }, []);

  // ── Constrain B when toggling to equilateral (keep it reasonable) ───────────────

  useEffect(() => {
    if (isEquilateral) {
      // Ensure B is in a reasonable position for equilateral display
      setDragB(prev => {
        const c = clampDistance(prev, 80, 240);
        c.y = Math.min(c.y, -15);
        return c;
      });
    }
  }, [isEquilateral]);

  // ── Render ──────────────────────────────────────────────────────────────────────

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      padding: 16,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      maxWidth: width + 32,
    }}>
      {/* ─── Canvas + Panel Row ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>

        {/* ─── SVG Canvas ──────────────────────────────────────────────────── */}
        <svg
          ref={svgRef}
          width={svgW}
          height={height}
          style={{
            background: '#FAFBFC',
            borderRadius: 12,
            border: '1px solid #E2E8F0',
            cursor: isDragging ? 'grabbing' : 'default',
            overflow: 'hidden',
            display: 'block',
            userSelect: 'none',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        >
          {/* Grid pattern */}
          <defs>
            <pattern id="hih-grid" width={40} height={40} patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F1F5F9" strokeWidth={1} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hih-grid)" />

          {/* Legend / Notation — top-left of canvas */}
          <g transform="translate(16, 16)">
            <text x={0} y={0} fontSize={14} fontWeight={700} fill={isSimilar ? '#7C3AED' : '#2563EB'}>
              {isSimilar ? '△ABC ∼ △ADE' : '△ABC ≅ △ADE'}
            </text>
            {/* Color legend for side pairs */}
            {([
              { label: 'AB ↔ AD', color: COLORS.AB.stroke },
              { label: 'AC ↔ AE', color: COLORS.AC.stroke },
              { label: 'BC ↔ DE', color: COLORS.BC.stroke },
            ] as const).map((item, i) => (
              <g key={i} transform={`translate(0, ${24 + i * 20})`}>
                <line x1={0} y1={0} x2={22} y2={0} stroke={item.color} strokeWidth={3} strokeLinecap="round" />
                <text x={30} y={4} fontSize={11} fill="#64748B">{item.label}</text>
              </g>
            ))}
          </g>

          {/* ── Triangle ADE (rotated) ────────────────────────────────────────── */}
          {/* Using CSS transition on the g transform for smooth animation */}
          <g
            style={{
              transition: 'transform 0.35s ease-out',
            }}
            transform={`translate(${A.x}, ${A.y}) rotate(${angle}) scale(${isSimilar ? ratio : 1})`}
          >
            {/* ADE filled polygon */}
            <polygon
              points={`0,0 ${B_rel.x},${B_rel.y} ${C_rel.x},${C_rel.y}`}
              fill={COLORS.tri2Fill}
              stroke={COLORS.tri2Stroke}
              strokeWidth={2}
              strokeDasharray="6 3"
            />

            {/* Side AE (green) */}
            <line x1={0} y1={0} x2={C_rel.x} y2={C_rel.y} stroke={COLORS.AC.stroke} strokeWidth={3.5} />
            {/* Side AD (red) */}
            <line x1={0} y1={0} x2={B_rel.x} y2={B_rel.y} stroke={COLORS.AB.stroke} strokeWidth={3.5} />
            {/* Side DE (blue) */}
            <line x1={B_rel.x} y1={B_rel.y} x2={C_rel.x} y2={C_rel.y} stroke={COLORS.BC.stroke} strokeWidth={3.5} />

            {/* Vertex dots (D, E) — inside transformed group so they rotate with the triangle */}
            {/* Note: A's dot is rendered outside the group to avoid duplication */}
            <circle cx={B_rel.x} cy={B_rel.y} r={6} fill={COLORS.vertex} stroke={COLORS.vertexStroke} strokeWidth={2} />
            <circle cx={C_rel.x} cy={C_rel.y} r={6} fill={COLORS.vertex} stroke={COLORS.vertexStroke} strokeWidth={2} />

            {/* Vertex labels (D, E) */}
            <text
              x={B_rel.x + 10}
              y={B_rel.y - 10}
              fontSize={15}
              fontWeight={700}
              fill={COLORS.label2}
            >D</text>
            <text
              x={C_rel.x - 10}
              y={C_rel.y - 10}
              fontSize={15}
              fontWeight={700}
              fill={COLORS.label2}
              textAnchor="end"
            >E</text>

            {/* Tick marks on AD and AE */}
            {/* AD tick */}
            <path
              d={tickMarks.ab}
              stroke={COLORS.AB.stroke}
              strokeWidth={2}
              fill="none"
            />
            {/* AE tick */}
            <path
              d={tickMarks.ac}
              stroke={COLORS.AC.stroke}
              strokeWidth={2}
              fill="none"
            />
            {/* DE tick */}
            <path
              d={tickMarks.bc}
              stroke={COLORS.BC.stroke}
              strokeWidth={2}
              fill="none"
            />
          </g>

          {/* ── Triangle ABC (base, not rotated) ─────────────────────────────────── */}

          {/* ABC filled polygon */}
          <polygon
            points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
            fill={COLORS.tri1Fill}
            stroke={COLORS.tri1Stroke}
            strokeWidth={2.5}
          />

          {/* Side AC (green) */}
          <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke={COLORS.AC.stroke} strokeWidth={3.5} />
          {/* Side AB (red) */}
          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={COLORS.AB.stroke} strokeWidth={3.5} />
          {/* Side BC (blue) */}
          <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={COLORS.BC.stroke} strokeWidth={3.5} />

          {/* Tick marks */}
          <path d={tickMarks.ab} stroke={COLORS.AB.stroke} strokeWidth={2} fill="none" />
          <path d={tickMarks.ac} stroke={COLORS.AC.stroke} strokeWidth={2} fill="none" />
          <path d={tickMarks.bc} stroke={COLORS.BC.stroke} strokeWidth={2} fill="none" />

          {/* Vertex dots */}
          <circle cx={A.x} cy={A.y} r={7} fill={COLORS.vertex} stroke={COLORS.vertexStroke} strokeWidth={2.5} />
          <circle cx={B.x} cy={B.y} r={7} fill={COLORS.vertex} stroke={COLORS.vertexStroke} strokeWidth={2.5} />
          <circle cx={C.x} cy={C.y} r={7} fill={COLORS.vertex} stroke={COLORS.vertexStroke} strokeWidth={2.5} />

          {/* Invisible larger hit area for B drag */}
          <circle cx={B.x} cy={B.y} r={14} fill="transparent" style={{ cursor: 'grab' }} />

          {/* Vertex labels */}
          <text x={A.x - 16} y={A.y + 5} fontSize={15} fontWeight={700} fill={COLORS.label} textAnchor="end">
            A
          </text>
          <text x={B.x + 10} y={B.y - 10} fontSize={15} fontWeight={700} fill={COLORS.label}>
            B{isDragging ? '' : ''}
          </text>
          <text x={C.x - 10} y={C.y - 10} fontSize={15} fontWeight={700} fill={COLORS.label} textAnchor="end">
            C
          </text>

          {/* ── Angle Arc ────────────────────────────────────────────────────── */}
          {angleArcInfo && (
            <>
              <path
                d={angleArcInfo.path}
                fill="none"
                stroke={COLORS.arc}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              {/* Arc fill (sector) */}
              <path
                d={`M ${A.x} ${A.y} ${angleArcInfo.path} Z`}
                fill={COLORS.arcFill}
              />
              {/* Tick at arc start */}
              <line
                x1={angleArcInfo.tickStart.x}
                y1={angleArcInfo.tickStart.y}
                x2={angleArcInfo.tickStart.x + angleArcInfo.tickDir.x * 6}
                y2={angleArcInfo.tickStart.y + angleArcInfo.tickDir.y * 6}
                stroke={COLORS.arc}
                strokeWidth={1.5}
              />
              {/* Angle label */}
              <text
                x={angleArcInfo.labelPt.x}
                y={angleArcInfo.labelPt.y}
                fontSize={13}
                fontWeight={700}
                fill={COLORS.arcText}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {angle}°
              </text>
            </>
          )}

          {/* ── Side length labels ──────────────────────────────────────────────── */}
          {/* AB length */}
          <text
            x={midPoints.ab.x - 14}
            y={midPoints.ab.y - 8}
            fontSize={11}
            fill={COLORS.AB.stroke}
            fontWeight={600}
            textAnchor="end"
          >
            {data.ab.toFixed(1)}
          </text>
          {/* AC length */}
          <text
            x={midPoints.ac.x - 14}
            y={midPoints.ac.y + 4}
            fontSize={11}
            fill={COLORS.AC.stroke}
            fontWeight={600}
            textAnchor="end"
          >
            {data.ac.toFixed(1)}
          </text>
          {/* BC length */}
          <text
            x={midPoints.bc.x - 10}
            y={midPoints.bc.y - 10}
            fontSize={11}
            fill={COLORS.BC.stroke}
            fontWeight={600}
            textAnchor="end"
          >
            {data.bc.toFixed(1)}
          </text>

          {/* DE length (positions are relative to D and E which update dynamically) */}
          <g style={{ transition: 'transform 0.35s ease-out' }} transform={`translate(${midPoints.de.x}, ${midPoints.de.y})`}>
            <text
              x={12}
              y={-8}
              fontSize={11}
              fill={COLORS.BC.stroke}
              fontWeight={600}
            >
              {data.de.toFixed(1)}
            </text>
          </g>
          {/* AD length */}
          <g style={{ transition: 'transform 0.35s ease-out' }} transform={`translate(${midPoints.ad.x}, ${midPoints.ad.y})`}>
            <text
              x={14}
              y={-8}
              fontSize={11}
              fill={COLORS.AB.stroke}
              fontWeight={600}
            >
              {data.ad.toFixed(1)}
            </text>
          </g>
          {/* AE length */}
          <g style={{ transition: 'transform 0.35s ease-out' }} transform={`translate(${midPoints.ae.x}, ${midPoints.ae.y})`}>
            <text
              x={14}
              y={4}
              fontSize={11}
              fill={COLORS.AC.stroke}
              fontWeight={600}
            >
              {data.ae.toFixed(1)}
            </text>
          </g>
        </svg>

        {/* ─── Data Panel ───────────────────────────────────────────────────── */}
        <div style={{
          width: panelW,
          padding: '16px 20px',
          background: COLORS.panelBg,
          borderRadius: 12,
          border: `1px solid ${COLORS.panelBorder}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          fontSize: 14,
          flexShrink: 0,
        }}>
          {/* Title */}
          <div style={{
            fontWeight: 700,
            fontSize: 16,
            color: COLORS.panelText,
            borderBottom: `2px solid ${COLORS.panelBorder}`,
            paddingBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span>{isSimilar ? '🔷 相似模型' : '🔷 全等模型'}</span>
            <span style={{ fontSize: 13, color: COLORS.mutedText, fontWeight: 400 }}>
              — 手拉手
            </span>
          </div>

          {/* Angle display */}
          <div>
            <div style={{ color: COLORS.mutedText, fontSize: 12, marginBottom: 2 }}>当前旋转角度</div>
            <div style={{
              fontSize: 32,
              fontWeight: 700,
              color: COLORS.arcText,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {angle}°
            </div>
          </div>

          {/* Side relations */}
          <div>
            <div style={{ color: COLORS.mutedText, fontSize: 12, marginBottom: 6 }}>对应边关系</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <SideRelationRow label="AB ↔ AD" val1={data.ab} val2={data.ad} color={COLORS.AB.stroke} isSimilar={isSimilar} />
              <SideRelationRow label="AC ↔ AE" val1={data.ac} val2={data.ae} color={COLORS.AC.stroke} isSimilar={isSimilar} />
              <SideRelationRow label="BC ↔ DE" val1={data.bc} val2={data.de} color={COLORS.BC.stroke} isSimilar={isSimilar} />
            </div>
          </div>

          {/* Judgment */}
          <div>
            <div style={{ color: COLORS.mutedText, fontSize: 12, marginBottom: 4 }}>判定</div>
            <div style={{
              fontWeight: 600,
              color: data.judgmentColor,
              background: isSimilar ? '#F5F3FF' : '#EFF6FF',
              padding: '8px 12px',
              borderRadius: 8,
              fontSize: 13,
              lineHeight: 1.5,
            }}>
              {data.judgment}
            </div>
          </div>

          {/* Side lengths summary */}
          <div>
            <div style={{ color: COLORS.mutedText, fontSize: 12, marginBottom: 4 }}>边长</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2px 16px',
              fontSize: 12,
              fontVariantNumeric: 'tabular-nums',
            }}>
              <span style={{ color: COLORS.AB.stroke }}>AB = {data.ab.toFixed(1)}</span>
              <span style={{ color: COLORS.AB.stroke }}>AD = {data.ad.toFixed(1)}</span>
              <span style={{ color: COLORS.AC.stroke }}>AC = {data.ac.toFixed(1)}</span>
              <span style={{ color: COLORS.AC.stroke }}>AE = {data.ae.toFixed(1)}</span>
              <span style={{ color: COLORS.BC.stroke }}>BC = {data.bc.toFixed(1)}</span>
              <span style={{ color: COLORS.BC.stroke }}>DE = {data.de.toFixed(1)}</span>
            </div>
          </div>

          {/* Tips */}
          <div style={{
            borderTop: `1px solid ${COLORS.panelBorder}`,
            paddingTop: 10,
            marginTop: 'auto',
          }}>
            <div style={{ color: COLORS.mutedText, fontSize: 12, marginBottom: 4 }}>操作提示</div>
            <div style={{ color: COLORS.hintText, fontSize: 11, lineHeight: 1.7 }}>
              • 拖拽 B 点改变 △ABC 形状<br />
              • 滑动滑块控制旋转角度<br />
              • 滚轮可微调角度（步进 0.2°）
            </div>
          </div>
        </div>
      </div>

      {/* ─── Controls Bar ───────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        gap: 24,
        padding: '14px 20px',
        background: COLORS.panelBg,
        borderRadius: 12,
        border: `1px solid ${COLORS.panelBorder}`,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        {/* Angle slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 13, color: '#475569', fontWeight: 500, minWidth: 55, whiteSpace: 'nowrap' }}>
            旋转角
          </label>
          <input
            type="range"
            min={0}
            max={360}
            value={angle}
            onChange={e => setAngle(Number(e.target.value))}
            style={{
              width: 200,
              height: 4,
              accentColor: COLORS.arcText,
              cursor: 'pointer',
            }}
          />
          <span style={{
            fontSize: 13,
            color: COLORS.mutedText,
            minWidth: 38,
            textAlign: 'right',
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {angle}°
          </span>
        </div>

        {/* Separator */}
        <div style={{ width: 1, height: 28, background: COLORS.panelBorder }} />

        {/* Triangle type toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: 13, color: '#475569', fontWeight: 500, marginRight: 4, whiteSpace: 'nowrap' }}>
            三角形
          </label>
          {(['等边', '一般'] as const).map(label => {
            const active = label === '等边' ? isEquilateral : !isEquilateral;
            return (
              <button
                key={label}
                onClick={() => setIsEquilateral(label === '等边')}
                style={{
                  padding: '5px 14px',
                  borderRadius: 6,
                  border: `1px solid ${active ? '#2563EB' : '#CBD5E1'}`,
                  background: active ? '#2563EB' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#475569',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s ease',
                  lineHeight: 1.3,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Ratio slider (similar mode only) */}
        {isSimilar && (
          <>
            <div style={{ width: 1, height: 28, background: COLORS.panelBorder }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label style={{ fontSize: 13, color: '#475569', fontWeight: 500, minWidth: 50, whiteSpace: 'nowrap' }}>
                比例 k
              </label>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.01}
                value={ratio}
                onChange={e => setRatio(Number(e.target.value))}
                style={{
                  width: 150,
                  height: 4,
                  accentColor: '#7C3AED',
                  cursor: 'pointer',
                }}
              />
              <span style={{
                fontSize: 13,
                color: COLORS.mutedText,
                minWidth: 42,
                textAlign: 'right',
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {ratio.toFixed(2)}
              </span>
            </div>
          </>
        )}

        {/* Reset button */}
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={() => {
              setAngle(45);
              setRatio(1.5);
              setDragB({ x: 160, y: -70 });
            }}
            style={{
              padding: '5px 14px',
              borderRadius: 6,
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#475569',
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.15s ease',
            }}
          >
            重置
          </button>
        </div>
      </div>
    </div>
  );
}
