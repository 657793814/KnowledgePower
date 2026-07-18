import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Props {
  model?: 'rope' | 'rod';
  width?: number;
  height?: number;
}

// ── Physics constants ──────────────────────────────────────────────
const G = 10;                        // gravity (m/s²)
const R_REAL = 1;                    // model radius (m)
const MASS = 1;                      // mass (kg)
const V_MAX = 6;                     // max slider speed (m/s)
const V_CRITICAL = Math.sqrt(G * R_REAL); // √(g·r) ≈ 3.162 m/s

// ── Visual constants ───────────────────────────────────────────────
const VIS_R = 140;      // px
const ARROW_MG_PX = 58;
const ARROW_VEL_PX = 48;
const ARROW_CENT_PX = 34;

const C = {
  track:       '#ffffff',
  trackStroke: 'rgba(255,255,255,0.28)',
  ball:        '#ffffff',
  ballGlow:    'rgba(255,255,255,0.25)',
  gravity:     '#ef4444',
  tension:     '#3b82f6',   // blue — inward pull
  rodSupport:  '#f97316',   // orange — outward push
  velocity:    '#22c55e',
  centripetal: '#a855f7',
  critical:    '#f59e0b',
  detached:    '#ef4444',
  label:       'rgba(255,255,255,0.65)',
  formula:     '#ffffff',
  eKe:         '#3b82f6',
  ePe:         '#22c55e',
  eBg:         'rgba(255,255,255,0.05)',
};

// ── Helpers ────────────────────────────────────────────────────────

/** SVG arc segment from θ₁ to θ₂ (radians, 0=bottom, CCW).
 *  Draws the arc in the direction of increasing θ (CCW in our convention).
 *  In SVG space this is the decreasing-φ direction (sweep=0 = CCW). */
function arcPath(cx: number, cy: number, r: number, t1: number, t2: number): string {
  // Our θ → SVG angle φ (0° = right, CW):  φ = 90° − θ·180/π
  const svgDeg = (rad: number) => 90 - rad * 180 / Math.PI;
  const d2r = (d: number) => d * Math.PI / 180;

  const s = svgDeg(t1);  // SVG degrees at start
  const e = svgDeg(t2);  // SVG degrees at end

  const x1 = cx + r * Math.cos(d2r(s));
  const y1 = cy + r * Math.sin(d2r(s));
  const x2 = cx + r * Math.cos(d2r(e));
  const y2 = cy + r * Math.sin(d2r(e));

  // As θ increases (our CCW), φ decreases (SVG CCW = sweep 0)
  // We want to go from φ₁ to φ₂ in the decreasing direction.
  let span = s - e;          // positive when s > e (usual case for t2 > t1)
  if (span < 0) span += 360; // wrap if needed
  const large = span > 180 ? 1 : 0;
  const sweep = 0;           // CCW in SVG = decreasing φ

  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`;
}

/** Vertical stacked energy bar (SVG fragment). */
function EnergyBar(
  x: number, y: number, h: number, w: number,
  KE: number, PE: number, total: number,
) {
  if (total < 1e-9) return null;
  const kh = (KE / total) * h;
  const ph = (PE / total) * h;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4}
            fill={C.eBg} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
      {kh > 2 && (
        <rect x={x} y={y + h - kh} width={w} height={kh}
              rx={2} fill={C.eKe} opacity={0.85} />
      )}
      {ph > 2 && (
        <rect x={x} y={y + h - kh - ph} width={w} height={ph}
              rx={2} fill={C.ePe} opacity={0.75} />
      )}
      <text x={x + w + 6} y={y + h / 2}
            fill={C.label} fontSize={10}
            textAnchor="start" dominantBaseline="middle">
        能量
      </text>
      {/* tiny legend */}
      <rect x={x + w + 4} y={y + 2} width={6} height={6} rx={1} fill={C.eKe} />
      <text x={x + w + 12} y={y + 7} fill={C.label} fontSize={8}>Ek</text>
      <rect x={x + w + 4} y={y + 16} width={6} height={6} rx={1} fill={C.ePe} />
      <text x={x + w + 12} y={y + 21} fill={C.label} fontSize={8}>Ep</text>
    </g>
  );
}

function Chip({ label, value, color }: {
  label: string; value: string; color: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{label}:</span>
      <span style={{
        color, fontSize: 13, fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
      }}>{value}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Component
// ═══════════════════════════════════════════════════════════════════

export default function CircularMotion({
  model: propModel = 'rope',
  width = 700,
  height = 650,
}: Props) {
  // ── state ──
  const [model, setModel] = useState<'rope' | 'rod'>(propModel);
  const [v, setV] = useState(3);
  const [angle, setAngle] = useState(0);  // rad, 0 = bottom, CCW
  const [playing, setPlaying] = useState(false);
  const [showForces, setShowForces] = useState(true);

  const animRef = useRef<number>(0);
  const lastT = useRef<number>(0);
  const angleRef = useRef<number>(0);

  // keep ref in sync so animation reads latest
  useEffect(() => { angleRef.current = angle; }, [angle]);

  // ── geometry ──
  const cx = width / 2;
  const cy = height * 0.46;

  // Ball position in SVG coords (y-down).
  //   x = r·sinθ, y = r·cosθ    (θ=0 → bottom)
  const sinA = Math.sin(angle);
  const cosA = Math.cos(angle);
  const bx = cx + VIS_R * sinA;
  const by = cy + VIS_R * cosA;

  // ── physics ──
  const omega = v / R_REAL;                  // rad/s
  const centripetal = MASS * v * v / R_REAL; // mv²/r (N)
  const gravity = MASS * G;                  // mg (N)

  // T = mv²/r - mg·cosθ  (positive = pulling toward centre)
  // T = mv²/r + mg·cosθ  (θ = 0 at bottom, CCW)
  // At bottom (+mg) tension is max; at top (−mg) tension is min (critical).
  const Tnet = centripetal + gravity * cosA;

  // Height above bottom
  const h = R_REAL * (1 - cosA);
  const KE = 0.5 * MASS * v * v;
  const PE = MASS * G * h;
  const totalE = KE + PE;

  // ---- rope detachment ----
  const isRopeDetached = model === 'rope' && v < V_CRITICAL;
  // T=0 → cosθ = −v²/gr  →  θ = arccos(−v²/gr) ∈ [π/2, π]
  const critAngle = isRopeDetached
    ? Math.acos(Math.max(-v * v / (G * R_REAL), -1))
    : null;
  const inDetachedZone = model === 'rope' && critAngle !== null &&
    angle > critAngle && angle < 2 * Math.PI - critAngle;

  // ---- rod normal direction ----
  const isSupport = model === 'rod' && Tnet < 0;
  const tensionLabel = model === 'rope' ? 'T' : 'N';

  // ▸  Unit vectors at ball position:
  //     radial inward (ball → centre) = (−sinθ, −cosθ)
  //     tangent CCW                    = ( cosθ, −sinθ)
  const rx = -sinA;
  const ry = -cosA;
  const tx = cosA;
  const ty = -sinA;

  // Arrow pixel lengths
  const tensionPx = Math.min(Math.abs(Tnet) / gravity * 56 + 14, 78);

  // ── animation tick ──
  const tick = useCallback((ts: number) => {
    if (!lastT.current) lastT.current = ts;
    const dt = Math.min((ts - lastT.current) / 1000, 0.05);
    lastT.current = ts;

    if (playing && !inDetachedZone) {
      angleRef.current += omega * dt;
      if (angleRef.current > 2 * Math.PI) angleRef.current -= 2 * Math.PI;
      else if (angleRef.current < 0) angleRef.current += 2 * Math.PI;
      setAngle(angleRef.current);
    }
    animRef.current = requestAnimationFrame(tick);
  }, [playing, omega, inDetachedZone]);

  useEffect(() => {
    if (playing) {
      lastT.current = 0;
      animRef.current = requestAnimationFrame(tick);
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [playing, tick]);

  // ── arrow renderer ──
  const arrow = (
    fromX: number, fromY: number,
    dx: number, dy: number, color: string,
    pixelLen: number, label?: string,
  ) => {
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1e-6 || pixelLen < 2) return null;
    const nx = dx / len;
    const ny = dy / len;
    const hh = 10;
    const tox = fromX + nx * pixelLen;
    const toy = fromY + ny * pixelLen;
    const a = Math.atan2(ny, nx);
    return (
      <g>
        <line x1={fromX} y1={fromY} x2={tox} y2={toy}
              stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        <polygon
          points={`${tox},${toy} ${tox - hh * Math.cos(a - 0.4)},${toy - hh * Math.sin(a - 0.4)} ${tox - hh * Math.cos(a + 0.4)},${toy - hh * Math.sin(a + 0.4)}`}
          fill={color} />
        {label && (
          <text x={tox + nx * 16} y={toy + ny * 16}
                fill={color} fontSize={12} fontWeight="bold"
                textAnchor="middle" dominantBaseline="middle">
            {label}
          </text>
        )}
      </g>
    );
  };

  // ═══════════════════ RENDER ═══════════════════

  return (
    <div style={{
      background: 'linear-gradient(135deg,#0a0a1a 0%,#1a1a3e 100%)',
      borderRadius: 16, padding: 20,
      fontFamily: "'Segoe UI',system-ui,-apple-system,sans-serif",
      width: width + 40, userSelect: 'none',
    }}>
      <svg width={width} height={height} style={{ display: 'block' }}>
        {/* ── track ── */}
        <circle cx={cx} cy={cy} r={VIS_R}
                fill="none" stroke={C.trackStroke} strokeWidth={3} />

        {/* detached arc (rope) */}
        {isRopeDetached && critAngle !== null && (
          <path d={arcPath(cx, cy, VIS_R, critAngle, 2 * Math.PI - critAngle)}
                fill="none" stroke={C.detached} strokeWidth={3}
                strokeDasharray="6,4" opacity={0.5} />
        )}

        {/* reference lines */}
        <line x1={cx} y1={cy - VIS_R - 18} x2={cx} y2={cy + VIS_R + 18}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4,4" />
        <line x1={cx - VIS_R - 18} y1={cy + VIS_R + 10}
              x2={cx + VIS_R + 18} y2={cy + VIS_R + 10}
              stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

        {/* top / bottom markers */}
        <circle cx={cx} cy={cy - VIS_R} r={5} fill={C.critical} opacity={0.7} />
        <text x={cx} y={cy - VIS_R - 14} fill={C.critical}
              fontSize={11} textAnchor="middle" fontWeight="bold">最高点</text>

        <circle cx={cx} cy={cy + VIS_R} r={3} fill={C.trackStroke} opacity={0.4} />
        <text x={cx} y={cy + VIS_R + 22} fill={C.label}
              fontSize={11} textAnchor="middle">最低点</text>

        {/* radius annotation */}
        <text x={cx + VIS_R / 2 + 10} y={cy - 2} fill={C.label}
              fontSize={11} textAnchor="start">r = {R_REAL} m</text>

        {/* ── ball ── */}
        <circle cx={bx} cy={by} r={16} fill={C.ballGlow} opacity={0.2} />
        <circle cx={bx} cy={by} r={12} fill={C.ball}
                stroke={inDetachedZone ? C.detached : C.track} strokeWidth={2} />
        <circle cx={bx} cy={by} r={2} fill="#1a1a3e" />

        {inDetachedZone && (
          <text x={bx} y={by + 30} fill={C.detached}
                fontSize={13} fontWeight="bold" textAnchor="middle">
            脱离轨道⚠
          </text>
        )}

        {/* connection line (rope / rod) */}
        <line x1={cx} y1={cy} x2={bx} y2={by}
              stroke={inDetachedZone
                ? 'rgba(239,68,68,0.25)'
                : model === 'rope'
                  ? 'rgba(255,255,255,0.15)'
                  : 'rgba(255,255,255,0.12)'
              }
              strokeWidth={model === 'rope' ? 1.5 : 4}
              strokeDasharray={model === 'rope' ? 'none' : 'none'}
              strokeLinecap="round" />

        {/* ── forces ── */}
        {showForces && !inDetachedZone && (
          <>
            {arrow(bx, by, 0, 1, C.gravity, ARROW_MG_PX, 'mg')}
            {Math.abs(Tnet) > 0.01 &&
              arrow(bx, by,
                isSupport ? -rx : rx,
                isSupport ? -ry : ry,
                isSupport ? C.rodSupport : C.tension,
                tensionPx,
                tensionLabel,
              )}
            {arrow(bx, by, tx, ty, C.velocity, ARROW_VEL_PX, 'v')}

            {/* dashed centripetal reference */}
            <g opacity={0.3}>
              <line x1={bx} y1={by}
                    x2={bx + rx * ARROW_CENT_PX}
                    y2={by + ry * ARROW_CENT_PX}
                    stroke={C.centripetal} strokeWidth={1.5} strokeDasharray="4,3" />
              <text x={bx + rx * (ARROW_CENT_PX + 14)}
                    y={by + ry * (ARROW_CENT_PX + 14)}
                    fill={C.centripetal} fontSize={10}
                    textAnchor="middle" dominantBaseline="middle">
                mv²/r
              </text>
            </g>
          </>
        )}

        {/* ── energy bar ── */}
        {EnergyBar(width - 56, cy - VIS_R, VIS_R * 2, 14, KE, PE, totalE)}
      </svg>

      {/* ─── controls ─── */}
      <div style={{ padding: '0 8px 4px' }}>
        {/* model toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          {(['rope', 'rod'] as const).map(m => {
            const active = m === model;
            return (
              <button key={m} onClick={() => { setModel(m); setPlaying(false); }}
                      style={{
                        padding: '6px 22px', borderRadius: 20,
                        border: `2px solid ${active ? '#3b82f6' : 'rgba(255,255,255,0.2)'}`,
                        background: active ? 'rgba(59,130,246,0.2)' : 'transparent',
                        color: active ? '#3b82f6' : C.label,
                        cursor: 'pointer', fontSize: 13,
                        fontWeight: active ? 600 : 400,
                        transition: 'all 0.2s',
                      }}>
                {m === 'rope' ? '绳模型' : '杆模型'}
              </button>
            );
          })}
        </div>

        {/* slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <span style={{ color: C.label, fontSize: 13, minWidth: 48 }}>速度 v</span>
          <input type="range" min={0} max={V_MAX} step={0.05} value={v}
                 onChange={e => setV(parseFloat(e.target.value))}
                 style={{ flex: 1, accentColor: C.velocity, height: 4 }} />
          <span style={{
            color: C.velocity, fontSize: 14, fontWeight: 600,
            fontVariantNumeric: 'tabular-nums', minWidth: 54, textAlign: 'right',
          }}>
            {v.toFixed(1)}
          </span>
        </div>

        {/* slider landmarks */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 11, color: C.label,
          marginBottom: 12, padding: '0 50px 0 62px',
        }}>
          <span>0</span>
          <span style={{ color: C.critical, fontWeight: 500 }}>
            √(gr) = {V_CRITICAL.toFixed(2)}
          </span>
          <span>{V_MAX}</span>
        </div>

        {/* action buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 10 }}>
          <button onClick={() => setPlaying(p => !p)}
                  style={{
                    padding: '8px 28px', borderRadius: 24,
                    border: `2px solid ${playing ? '#f59e0b' : '#22c55e'}`,
                    background: playing ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
                    color: playing ? '#f59e0b' : '#22c55e',
                    cursor: 'pointer', fontSize: 14, fontWeight: 600,
                    transition: 'all 0.2s',
                  }}>
            {playing ? '⏸ 暂停' : '▶ 播放'}
          </button>
          <button onClick={() => setShowForces(f => !f)}
                  style={{
                    padding: '8px 20px', borderRadius: 24,
                    border: `2px solid ${showForces ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
                    background: showForces ? 'rgba(255,255,255,0.06)' : 'transparent',
                    color: showForces ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.35)',
                    cursor: 'pointer', fontSize: 13,
                    transition: 'all 0.2s',
                  }}>
            {showForces ? '🔽 隐藏受力' : '🔼 显示受力'}
          </button>
        </div>
      </div>

      {/* ─── info panel ─── */}
      <div style={{
        background: 'rgba(255,255,255,0.05)', borderRadius: 12,
        padding: '12px 20px', margin: '4px 8px 0',
        display: 'flex', flexWrap: 'wrap', gap: 14,
        justifyContent: 'center', alignItems: 'center',
      }}>
        <Chip label="θ" value={`${(angle * 180 / Math.PI).toFixed(0)}°`} color="#a78bfa" />
        <Chip label="h" value={`${h.toFixed(2)} m`} color="#f59e0b" />
        <Chip label="v" value={`${v.toFixed(2)} m/s`} color={C.velocity} />
        <Chip label={tensionLabel}
              value={`${Math.abs(Tnet).toFixed(2)} N ${model === 'rod' ? (isSupport ? '↑推' : '↓拉') : (Tnet >= 0 ? '拉' : '—')}`}
              color={isSupport ? C.rodSupport : C.tension} />
        <Chip label="E" value={`${totalE.toFixed(2)} J`} color="#e2e8f0" />
      </div>

      {/* ─── formula panel ─── */}
      <div style={{
        background: 'rgba(255,255,255,0.05)', borderRadius: 12,
        padding: '10px 20px', margin: '6px 8px 0',
        display: 'flex', flexWrap: 'wrap', gap: 12,
        justifyContent: 'center', alignItems: 'center',
      }}>
        {/* main formula */}
        <div style={{
          color: C.formula, fontSize: 14,
          fontStyle: 'italic', padding: '4px 14px',
          background: 'rgba(255,255,255,0.06)', borderRadius: 8,
          whiteSpace: 'nowrap',
        }}>
          <span style={{ color: C.gravity }}>mg</span>
          {' + '}
          <span style={{ color: model === 'rope' || Tnet >= 0 ? C.tension : C.rodSupport }}>
            {tensionLabel}
          </span>
          {' = '}
          <span style={{ color: C.centripetal }}>mv²/r</span>
          {model === 'rope' && (
            <span style={{ marginLeft: 16, fontSize: 12, color: C.critical }}>
              v_min = √(gr) = {V_CRITICAL.toFixed(2)}
            </span>
          )}
        </div>

        {/* specific formula */}
        <div style={{ color: C.label, fontSize: 12 }}>
          {model === 'rope' && (
            <>
              最高点：<span style={{ color: C.tension }}>T</span> = mv²/r − mg
              {v >= V_CRITICAL ? ' ≥ 0 ✓' : ' < 0 ✗'}
            </>
          )}
          {model === 'rod' && (
            <>
              最高点：<span style={{ color: C.rodSupport }}>N</span> = mv²/r − mg
              {' | '}v={' '}
              <span style={{ color: v < V_CRITICAL ? C.critical : C.label }}>
                {v < V_CRITICAL ? '<' : '≥'}
              </span>
              {' '}√(gr) →{' '}
              <span style={{ color: isSupport ? C.rodSupport : C.tension }}>
                {v < V_CRITICAL ? '支持力' : v > V_CRITICAL ? '拉力' : 'N = 0'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ─── footer note ─── */}
      <div style={{
        color: C.label, fontSize: 12, textAlign: 'center',
        marginTop: 6, lineHeight: 1.5,
      }}>
        {model === 'rope'
          ? '绳模型：最高点 v ≥ √(gr) 时绳有拉力；v < √(gr) 时小球无法到达最高点'
          : '杆模型：v = 0 时杆提供支持力；v = √(gr) 时 N = 0；v > √(gr) 时杆表现为拉力'
        }
        <span style={{ marginLeft: 10, opacity: 0.4 }}>
          (g = {G} m/s², r = {R_REAL} m, m = {MASS} kg)
        </span>
      </div>
    </div>
  );
}
