import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Props {
  model?: 'electric' | 'magnetic' | 'combined';
  width?: number;
  height?: number;
}

interface PhysicsParams {
  U: number;        // 板间电压 V
  B: number;        // 磁感应强度 T
  v0: number;       // 初速度 m/s
  q: number;        // 电荷量 C (×10^-19)
  m: number;        // 质量 kg (×10^-27)
}

const DEFAULT_PARAMS: PhysicsParams = {
  U: 500,
  B: 1.0,
  v0: 3.0,
  q: 1.0,
  m: 1.0,
};

const CHARGE_E = 1.602e-19;
const ELECTRON_MASS = 9.109e-31;
const PLATE_LENGTH = 400;      // 平板长度 (SVG 单位)
const PLATE_GAP = 200;         // 平板间距 (SVG 单位)
const PLATE_THICKNESS = 12;
const PARTICLE_RADIUS = 6;
const MARGIN = { top: 60, right: 80, bottom: 120, left: 80 };
const MAGNETIC_RADIUS = 220;   // 磁场区域半径
const WALL_OFFSET = 50;        // 左侧粒子发射位置偏移

const CANVAS_W = 900;
const CANVAS_H = 600;

function useAnimationFrame(callback: (dt: number) => void, active: boolean) {
  const cbRef = useRef(callback);
  cbRef.current = callback;
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      lastRef.current = 0;
      return;
    }
    const loop = (time: number) => {
      if (lastRef.current === 0) lastRef.current = time;
      const dt = Math.min((time - lastRef.current) / 1000, 0.05);
      lastRef.current = time;
      cbRef.current(dt);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);
}

/* ---------- 物理计算 ---------- */

function calcElectric(
  U: number, v0: number, q: number, m: number, timeSteps: number,
): { trajectory: { x: number; y: number }[]; yMax: number; vyExit: number; vExit: number; theta: number; E: number; a: number; tFlight: number } {
  const qReal = q * CHARGE_E;
  const mReal = m * ELECTRON_MASS;
  const d = PLATE_GAP;
  const L = PLATE_LENGTH;
  const E = U / d;                    // 电场强度 V/m
  const a = (qReal * E) / mReal;      // 加速度 m/s²
  const tFlight = L / (v0 * 1e6);     // 飞行时间 s (v0 单位 10^6 m/s)
  const yMax = 0.5 * a * tFlight * tFlight; // 偏转量 m

  // 映射到 SVG 坐标系
  // 1 m → pixels 缩放
  const scale = (d / 2) / Math.max(yMax, 0.01) * 0.8;
  const pixelsPerM = Math.min(scale, 150);

  const trajectory: { x: number; y: number }[] = [];
  const steps = timeSteps;
  const dt = tFlight / steps;
  for (let i = 0; i <= steps; i++) {
    const t = i * dt;
    const sx = v0 * 1e6 * t;
    const sy = 0.5 * a * t * t;
    trajectory.push({ x: sx * pixelsPerM, y: sy * pixelsPerM });
  }

  const vyExit = a * tFlight;
  const vExit = Math.sqrt((v0 * 1e6) ** 2 + vyExit ** 2);
  const theta = Math.atan2(vyExit, v0 * 1e6) * (180 / Math.PI);

  return { trajectory, yMax, vyExit, vExit, theta, E, a, tFlight };
}

function calcMagnetic(
  B: number, v0: number, q: number, m: number,
): { r: number; T: number; omega: number; trajectory: { x: number; y: number }[]; center: { x: number; y: number } } {
  const qReal = q * CHARGE_E;
  const mReal = m * ELECTRON_MASS;
  const v = v0 * 1e6;
  const r = (mReal * v) / (qReal * B);          // 回旋半径 m
  const omega = (qReal * B) / mReal;             // 角速度 rad/s
  const T = (2 * Math.PI) / omega;               // 周期 s

  // SVG 坐标映射
  const pixelScale = 30; // 像素/米
  const rPx = r * pixelScale;
  const limitedR = Math.min(rPx, MAGNETIC_RADIUS - 20);

  const trajectory: { x: number; y: number }[] = [];
  const steps = 120;
  const cx = WALL_OFFSET + 50;
  const cy = MARGIN.top + (CANVAS_H - MARGIN.top - MARGIN.bottom) / 2;
  const centerX = cx;
  const centerY = cy - limitedR;

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI;
    const px = centerX + limitedR * Math.sin(angle);
    const py = centerY + limitedR * (1 - Math.cos(angle));
    trajectory.push({ x: px, y: py });
  }

  return {
    r: r,
    T: T,
    omega: omega,
    trajectory,
    center: { x: centerX, y: centerY },
  };
}

function calcCombined(
  U: number, B: number, v0: number, q: number, m: number,
): {
  accelTraj: { x: number; y: number }[];
  deflectTraj: { x: number; y: number }[];
  v_accel: number;
  r: number;
  E: number;
  totalAngle: number;
  gap: number;
  center: { x: number; y: number };
} {
  const qReal = q * CHARGE_E;
  const mReal = m * ELECTRON_MASS;
  const d = PLATE_GAP;
  const L = PLATE_LENGTH;
  const E = U / d;
  const a = (qReal * E) / mReal;
  const t_flight = L / (v0 * 1e6);
  const v_accel = Math.sqrt((v0 * 1e6) ** 2 + 2 * a * L);
  const r = (mReal * v_accel) / (qReal * Math.max(B, 0.01));

  // SVG 坐标系
  const scale = 0.5;
  const accelTraj: { x: number; y: number }[] = [];
  const steps = 60;
  const dt = t_flight / steps;
  for (let i = 0; i <= steps; i++) {
    const t = i * dt;
    const sx = v0 * 1e6 * t;
    const sy = 0.5 * a * t * t;
    accelTraj.push({ x: sx * scale, y: sy * scale });
  }

  const startX = WALL_OFFSET + L * scale;
  const startY = accelTraj[accelTraj.length - 1].y;
  const gap = d * scale;

  const rPx = r * scale * 8;
  const limitedR = Math.min(rPx, 180);
  const deflectTraj: { x: number; y: number }[] = [];
  const half = (CANVAS_H - MARGIN.top - MARGIN.bottom) / 2;
  const centerX_val = startX;
  const centerY_val = MARGIN.top + half + startY + limitedR;
  const deflectSteps = 60;
  for (let i = 1; i <= deflectSteps; i++) {
    const angle = (i / deflectSteps) * Math.PI;
    const px = centerX_val - limitedR * Math.sin(angle);
    const py = centerY_val - limitedR * (1 - Math.cos(angle));
    deflectTraj.push({ x: px, y: py });
  }

  const totalAngle = 180;

  return {
    accelTraj,
    deflectTraj,
    v_accel,
    r,
    E,
    totalAngle,
    gap,
    center: { x: centerX_val, y: centerY_val },
  };
}

/* ---------- 格式化 ---------- */

function fmt(n: number, d: number = 2): string {
  return n.toFixed(d);
}

/* ---------- 组件 ---------- */

export default function ParticleDeflection({
  model: initialModel = 'electric',
  width = CANVAS_W,
  height = CANVAS_H,
}: Props) {
  const [model, setModel] = useState<'electric' | 'magnetic' | 'combined'>(initialModel);
  const [params, setParams] = useState<PhysicsParams>(DEFAULT_PARAMS);
  const [animProgress, setAnimProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressRef = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleParam = (key: keyof PhysicsParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(p => ({ ...p, [key]: parseFloat(e.target.value) }));
  };

  const togglePlay = () => setIsPlaying(p => !p);

  useAnimationFrame(
    useCallback((dt: number) => {
      progressRef.current = Math.min(progressRef.current + dt * 0.6, 1);
      setAnimProgress(progressRef.current);
      if (progressRef.current >= 1) {
        setIsPlaying(false);
        progressRef.current = 0;
        setAnimProgress(0);
      }
    }, []),
    isPlaying,
  );

  const resetAnim = () => {
    setIsPlaying(false);
    progressRef.current = 0;
    setAnimProgress(0);
  };

  /* 计算 */
  const electricResult = calcElectric(params.U, params.v0, params.q, params.m, 80);
  const magneticResult = calcMagnetic(params.B, params.v0, params.q, params.m);
  const combinedResult = calcCombined(params.U, params.B, params.v0, params.q, params.m);

  const halfH = (CANVAS_H - MARGIN.top - MARGIN.bottom) / 2;
  const fieldCenterY = MARGIN.top + halfH;

  /* ---- 粒子位置 ---- */
  const particlePos = (() => {
    if (model === 'electric') {
      const traj = electricResult.trajectory;
      const idx = Math.floor(animProgress * (traj.length - 1));
      const p = traj[idx] || traj[0];
      return {
        x: MARGIN.left + WALL_OFFSET + p.x,
        y: fieldCenterY + p.y,
      };
    }
    if (model === 'magnetic') {
      const traj = magneticResult.trajectory;
      if (traj.length === 0) return { x: MARGIN.left + WALL_OFFSET, y: fieldCenterY };
      // offset to align with trajectory start
      const baseOffsetX = traj[0].x;
      const baseOffsetY = traj[0].y;
      const idx = Math.floor(animProgress * (traj.length - 1));
      const p = traj[idx] || traj[0];
      return {
        x: (MARGIN.left + WALL_OFFSET) - baseOffsetX + p.x,
        y: fieldCenterY - baseOffsetY + p.y,
      };
    }
    // combined
    {
      const accel = combinedResult.accelTraj;
      const deflect = combinedResult.deflectTraj;
      const totalLen = accel.length + deflect.length;
      const idx = Math.floor(animProgress * (totalLen - 1));
      const baseX = MARGIN.left + WALL_OFFSET;
      if (idx < accel.length) {
        const p = accel[idx];
        return { x: baseX + p.x, y: fieldCenterY + p.y };
      } else {
        const di = idx - accel.length;
        const p = deflect[di] || deflect[deflect.length - 1];
        return { x: baseX + (deflect.length > 0 ? deflect[0].x + p.x : 0), y: fieldCenterY + p.y };
      }
    }
  })();

  const renderSharedMarkers = () => (
    <defs>
      <marker id="arrowRed" markerWidth="10" markerHeight="8" refX="10" refY="4" orient="auto">
        <path d="M0,0 L10,4 L0,8" fill="#ef4444" />
      </marker>
      <marker id="arrowBlue" markerWidth="10" markerHeight="8" refX="10" refY="4" orient="auto">
        <path d="M0,0 L10,4 L0,8" fill="#3b82f6" />
      </marker>
      <marker id="arrowGray" markerWidth="10" markerHeight="8" refX="10" refY="4" orient="auto">
        <path d="M0,0 L10,4 L0,8" fill="#a0a0a0" />
      </marker>
      <linearGradient id="trailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.1" />
        <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );

  /* 电场模式 */
  const renderElectric = () => {
    const traj = electricResult.trajectory;
    const startX = MARGIN.left + WALL_OFFSET;
    const centerY = fieldCenterY;
    const topY = centerY - PLATE_GAP / 2;
    const botY = centerY + PLATE_GAP / 2;

    // 轨迹点偏移
    const offsetTraj = traj.map(p => ({ x: startX + p.x, y: centerY + p.y }));

    // 绘制可见轨迹（截断到进度）
    const visibleCount = Math.max(1, Math.floor(animProgress * offsetTraj.length));
    const visibleTraj = offsetTraj.slice(0, visibleCount);
    const trajPath = visibleTraj.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

    // 出口速度箭头
    const lastP = offsetTraj[offsetTraj.length - 1];
    const prevP = offsetTraj[Math.max(0, offsetTraj.length - 5)];
    const arrLen = 50;
    let arrAngle = 0;
    if (lastP && prevP) {
      arrAngle = Math.atan2(lastP.y - prevP.y, lastP.x - prevP.x);
    }

    return (
      <>
        {renderSharedMarkers()}

        {/* 上极板 (正极) */}
        <rect
          x={startX} y={topY - PLATE_THICKNESS}
          width={PLATE_LENGTH} height={PLATE_THICKNESS}
          fill="#ef4444" rx="2"
        />
        <text x={startX + PLATE_LENGTH / 2} y={topY - PLATE_THICKNESS - 6}
          textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="600">
          + 正极板
        </text>

        {/* 下极板 (负极) */}
        <rect
          x={startX} y={botY}
          width={PLATE_LENGTH} height={PLATE_THICKNESS}
          fill="#3b82f6" rx="2"
        />
        <text x={startX + PLATE_LENGTH / 2} y={botY + PLATE_THICKNESS + 18}
          textAnchor="middle" fill="#3b82f6" fontSize="13" fontWeight="600">
          − 负极板
        </text>

        {/* 电场线 (中间虚线) */}
        {[0.2, 0.4, 0.6, 0.8].map(ratio => {
          const x = startX + PLATE_LENGTH * ratio;
          return (
            <line key={ratio} x1={x} y1={topY + 4} x2={x} y2={botY - 4}
              stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
          );
        })}

        {/* 电场方向标注 */}
        <line x1={startX + PLATE_LENGTH + 30} y1={topY + 10} x2={startX + PLATE_LENGTH + 30} y2={botY - 10}
          stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrowRed)" />
        <text x={startX + PLATE_LENGTH + 36} y={fieldCenterY}
          fill="#ef4444" fontSize="12" dominantBaseline="middle">E</text>

        {/* 轨迹 */}
        {trajPath && (
          <path d={trajPath} fill="none" stroke="url(#trailGrad)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* 粒子 */}
        {particlePos && (
          <>
            <circle cx={particlePos.x} cy={particlePos.y} r={PARTICLE_RADIUS + 3}
              fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0.4" filter="url(#glow)" />
            <circle cx={particlePos.x} cy={particlePos.y} r={PARTICLE_RADIUS}
              fill="#3b82f6" />
            <circle cx={particlePos.x} cy={particlePos.y} r={3}
              fill="#ffffff" opacity="0.8" />
          </>
        )}

        {/* 偏转量 y 标注 */}
        <line x1={startX + PLATE_LENGTH + 10} y1={centerY} x2={startX + PLATE_LENGTH + 10} y2={lastP?.y || centerY}
          stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrowGray)" />
        <text x={startX + PLATE_LENGTH + 16} y={(centerY + (lastP?.y || centerY)) / 2}
          fill="#f59e0b" fontSize="12" dominantBaseline="middle">y</text>

        {/* 速度标注 */}
        {lastP && prevP && (
          <>
            <line x1={lastP.x} y1={lastP.y}
              x2={lastP.x + arrLen * Math.cos(arrAngle)} y2={lastP.y + arrLen * Math.sin(arrAngle)}
              stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
            <text x={lastP.x + arrLen * Math.cos(arrAngle) + 5}
              y={lastP.y + arrLen * Math.sin(arrAngle) + 5}
              fill="#3b82f6" fontSize="11">v</text>
          </>
        )}

        {/* 初速度标注 */}
        <line x1={startX - 10} y1={centerY}
          x2={startX + 50} y2={centerY}
          stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowBlue)" opacity="0.7" />
        <text x={startX + 20} y={centerY - 8} fill="#3b82f6" fontSize="11">v₀</text>

        {/* 入口标注 */}
        <text x={startX - 8} y={centerY} fill="#6b7280" fontSize="11"
          textAnchor="end" dominantBaseline="middle">入射</text>
      </>
    );
  };

  /* 磁场模式 */
  const renderMagnetic = () => {
    const { trajectory: traj, center, r, T } = magneticResult;
    const startX = MARGIN.left + WALL_OFFSET;
    const centerY = fieldCenterY;

    if (traj.length === 0) return null;

    const baseX = traj[0].x;
    const baseY = traj[0].y;
    const offsetTraj = traj.map(p => ({
      x: startX - baseX + p.x,
      y: centerY - baseY + p.y,
    }));

    const visibleCount = Math.max(1, Math.floor(animProgress * offsetTraj.length));
    const visibleTraj = offsetTraj.slice(0, visibleCount);
    const trajPath = visibleTraj.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

    const centerOffX = startX - baseX + center.x;
    const centerOffY = centerY - baseY + center.y;

    // 磁场区域
    const fieldCX = startX - baseX + (traj[0]?.x || 0) + MAGNETIC_RADIUS / 2;
    const fieldCY = centerY;

    // 初速度箭头
    const entryX = offsetTraj[0]?.x || startX;
    const entryY = offsetTraj[0]?.y || centerY;

    // 出口速度箭头（最后几个点计算方向）
    const lastP = offsetTraj[offsetTraj.length - 1];
    const prevP = offsetTraj[Math.max(0, offsetTraj.length - 10)];

    return (
      <>
        {renderSharedMarkers()}

        {/* 磁场区域 */}
        <circle cx={fieldCX} cy={fieldCY} r={MAGNETIC_RADIUS}
          fill="#9ca3af" fillOpacity="0.08" stroke="#9ca3af" strokeWidth="1" strokeDasharray="6,4" />
        <text x={fieldCX} y={fieldCY} textAnchor="middle" dominantBaseline="middle"
          fill="#9ca3af" fontSize="14" fontWeight="600" opacity="0.5">
          匀强磁场 B
        </text>

        {/* 磁感应强度方向 (× 符号表示垂直纸面向里) */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const dist = MAGNETIC_RADIUS * 0.55;
          const x = fieldCX + dist * Math.cos(angle);
          const y = fieldCY + dist * Math.sin(angle);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central"
              fill="#9ca3af" fontSize="10" opacity="0.35">⊗</text>
          );
        })}

        {/* 轨迹 */}
        {trajPath && (
          <path d={trajPath} fill="none" stroke="url(#trailGrad)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* 圆心标注 */}
        <circle cx={centerOffX} cy={centerOffY} r="4" fill="#f59e0b" opacity="0.7" />
        <circle cx={centerOffX} cy={centerOffY} r="2" fill="#f59e0b" />
        <text x={centerOffX + 8} y={centerOffY - 4} fill="#f59e0b" fontSize="11"
          fontWeight="500">O</text>

        {/* 半径标注 */}
        <line x1={centerOffX} y1={centerOffY}
          x2={offsetTraj[Math.floor(offsetTraj.length / 2)]?.x || centerOffX}
          y2={offsetTraj[Math.floor(offsetTraj.length / 2)]?.y || centerOffY}
          stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" />
        <text x={(centerOffX + (offsetTraj[Math.floor(offsetTraj.length / 2)]?.x || centerOffX)) / 2 + 5}
          y={(centerOffY + (offsetTraj[Math.floor(offsetTraj.length / 2)]?.y || centerOffY)) / 2 - 5}
          fill="#f59e0b" fontSize="11">r</text>

        {/* 粒子 */}
        {particlePos && (
          <>
            <circle cx={particlePos.x} cy={particlePos.y} r={PARTICLE_RADIUS + 3}
              fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0.4" filter="url(#glow)" />
            <circle cx={particlePos.x} cy={particlePos.y} r={PARTICLE_RADIUS}
              fill="#3b82f6" />
            <circle cx={particlePos.x} cy={particlePos.y} r={3}
              fill="#ffffff" opacity="0.8" />
          </>
        )}

        {/* 初速度 */}
        <line x1={entryX - 60} y1={entryY} x2={entryX} y2={entryY}
          stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowBlue)" opacity="0.7" />
        <text x={entryX - 30} y={entryY - 8} fill="#3b82f6" fontSize="11"
          textAnchor="middle">v₀</text>

        {/* 洛伦兹力标注 */}
        {lastP && prevP && visibleCount > 10 && (
          (() => {
            const dx = lastP.x - prevP.x;
            const dy = lastP.y - prevP.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            // 指向圆心方向
            const toCenterX = centerOffX - lastP.x;
            const toCenterY = centerOffY - lastP.y;
            const cLen = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY) || 1;
            const fLen = 40;
            const fx = lastP.x + (toCenterX / cLen) * fLen;
            const fy = lastP.y + (toCenterY / cLen) * fLen;
            return (
              <line x1={lastP.x} y1={lastP.y} x2={fx} y2={fy}
                stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowRed)" opacity="0.8" />
            );
          })()
        )}
        {lastP && prevP && visibleCount > 10 && (
          <text x={lastP.x + 12} y={lastP.y - 10} fill="#ef4444" fontSize="10"
            fontWeight="500">F_L</text>
        )}

        {/* 入射标记 */}
        <text x={startX - 8} y={centerY} fill="#6b7280" fontSize="11"
          textAnchor="end" dominantBaseline="middle">入射</text>
      </>
    );
  };

  /* 组合模式 */
  const renderCombined = () => {
    const { accelTraj, deflectTraj, center } = combinedResult;
    const startX = MARGIN.left + WALL_OFFSET;
    const centerY = fieldCenterY;
    const halfW = CANVAS_W / 2;

    // 加速电场区
    const gapY = PLATE_GAP / 2;
    const accelEndX = startX + 200;

    // 偏移轨迹
    const offsetAccel = accelTraj.map(p => ({ x: startX + p.x, y: centerY + p.y }));
    const deflectOffsetX = offsetAccel[offsetAccel.length - 1]?.x || startX + 200;
    const deflectOffsetY = offsetAccel[offsetAccel.length - 1]?.y || centerY;
    const offsetDeflect = deflectTraj.map(p => ({
      x: p.x + deflectOffsetX - (deflectTraj[0]?.x || 0),
      y: p.y + deflectOffsetY - (deflectTraj[0]?.y || 0),
    }));

    const allTraj = [...offsetAccel, ...offsetDeflect];
    const visibleCount = Math.max(1, Math.floor(animProgress * allTraj.length));
    const visibleTraj = allTraj.slice(0, visibleCount);
    const trajPath = visibleTraj.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

    // exit velocity vector for combined mode
    const exitVec = offsetDeflect.length > 5 ? (() => {
      const last = offsetDeflect[offsetDeflect.length - 1];
      const prev = offsetDeflect[offsetDeflect.length - 10];
      if (!last || !prev) return null;
      const dx = last.x - prev.x;
      const dy = last.y - prev.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const arrowLen = 50;
      return {
        sx: last.x + (dx / len) * arrowLen,
        sy: last.y + (dy / len) * arrowLen,
      };
    })() : null;

    return (
      <>
        {renderSharedMarkers()}

        {/* 分隔线 */}
        <line x1={startX + 230} y1={MARGIN.top - 10} x2={startX + 230} y2={CANVAS_H - MARGIN.bottom + 10}
          stroke="#d1d5db" strokeWidth="1" strokeDasharray="6,4" />
        <text x={startX + 230} y={MARGIN.top - 18} textAnchor="middle" fill="#9ca3af" fontSize="12">加速区</text>

        {/* 加速电场板 */}
        <rect x={startX} y={centerY - gapY - PLATE_THICKNESS}
          width={180} height={PLATE_THICKNESS} fill="#ef4444" rx="2" />
        <text x={startX + 90} y={centerY - gapY - PLATE_THICKNESS - 6}
          textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="600">+</text>
        <rect x={startX} y={centerY + gapY}
          width={180} height={PLATE_THICKNESS} fill="#3b82f6" rx="2" />
        <text x={startX + 90} y={centerY + gapY + PLATE_THICKNESS + 18}
          textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="600">−</text>

        {/* 电场线 */}
        {[0.2, 0.5, 0.8].map(ratio => {
          const x = startX + 180 * ratio;
          return (
            <line key={ratio} x1={x} y1={centerY - gapY + 4} x2={x} y2={centerY + gapY - 4}
              stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" opacity="0.25" />
          );
        })}

        {/* 偏转区标注 */}
        <text x={halfW + 120} y={MARGIN.top - 18} textAnchor="middle" fill="#9ca3af" fontSize="12"
          opacity="0.6">组合偏转区</text>

        {/* 轨迹 */}
        {trajPath && (
          <path d={trajPath} fill="none" stroke="url(#trailGrad)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* 粒子 */}
        {particlePos && (
          <>
            <circle cx={particlePos.x} cy={particlePos.y} r={PARTICLE_RADIUS + 3}
              fill="none" stroke="#60a5fa" strokeWidth="2" opacity="0.4" filter="url(#glow)" />
            <circle cx={particlePos.x} cy={particlePos.y} r={PARTICLE_RADIUS}
              fill="#3b82f6" />
            <circle cx={particlePos.x} cy={particlePos.y} r={3}
              fill="#ffffff" opacity="0.8" />
          </>
        )}

        {/* 初速度 */}
        <line x1={startX - 40} y1={centerY} x2={startX} y2={centerY}
          stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowBlue)" opacity="0.7" />
        <text x={startX - 20} y={centerY - 8} fill="#3b82f6" fontSize="11"
          textAnchor="middle">v₀</text>

        {/* 出口速度 */}
        {exitVec && offsetDeflect.length > 5 && (() => {
          const last = offsetDeflect[offsetDeflect.length - 1];
          if (!last) return null;
          return (
            <>
              <line x1={last.x} y1={last.y} x2={exitVec.sx} y2={exitVec.sy}
                stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
              <text x={exitVec.sx + 5} y={exitVec.sy + 5} fill="#3b82f6" fontSize="11">v_out</text>
            </>
          );
        })()}

        {/* 入射标记 */}
        <text x={startX - 8} y={centerY} fill="#6b7280" fontSize="11"
          textAnchor="end" dominantBaseline="middle">入射</text>
      </>
    );
  };

  const renderElectricParams = () => {
    const r = electricResult;
    return (
      <div className="particle-deflection__info">
        <table className="particle-deflection__table">
          <thead><tr><th colSpan={2}>电场偏转 - 物理量</th></tr></thead>
          <tbody>
            <tr><td>板间电场 E</td><td>{fmt(r.E / 1e3, 1)} ×10³ V/m</td></tr>
            <tr><td>加速度 a</td><td>{fmt(r.a / 1e14, 2)} ×10¹⁴ m/s²</td></tr>
            <tr><td>飞行时间 t</td><td>{fmt(r.tFlight * 1e9, 1)} ns</td></tr>
            <tr><td>偏转量 y</td><td>{fmt(r.yMax * 1e3, 2)} mm</td></tr>
            <tr><td>出口速度 v</td><td>{fmt(r.vExit / 1e6, 3)} ×10⁶ m/s</td></tr>
            <tr><td>偏转角 θ</td><td>{fmt(r.theta, 1)}°</td></tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderMagneticParams = () => {
    const r = magneticResult;
    return (
      <div className="particle-deflection__info">
        <table className="particle-deflection__table">
          <thead><tr><th colSpan={2}>磁场偏转 - 物理量</th></tr></thead>
          <tbody>
            <tr><td>回旋半径 r</td><td>{fmt(r.r * 1e3, 2)} mm</td></tr>
            <tr><td>回旋周期 T</td><td>{fmt(r.T * 1e9, 2)} ns</td></tr>
            <tr><td>角速度 ω</td><td>{fmt(r.omega / 1e11, 3)} ×10¹¹ rad/s</td></tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderCombinedParams = () => {
    const r = combinedResult;
    return (
      <div className="particle-deflection__info">
        <table className="particle-deflection__table">
          <thead><tr><th colSpan={2}>组合偏转 - 物理量</th></tr></thead>
          <tbody>
            <tr><td>加速后速度 v</td><td>{fmt(r.v_accel / 1e6, 3)} ×10⁶ m/s</td></tr>
            <tr><td>电场强度 E</td><td>{fmt(r.E / 1e3, 1)} ×10³ V/m</td></tr>
            <tr><td>回旋半径 r</td><td>{fmt(r.r * 1e3, 2)} mm</td></tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderSlider = (
    label: string,
    key: keyof PhysicsParams,
    min: number,
    max: number,
    step: number,
    unit: string,
  ) => (
    <div className="particle-deflection__slider">
      <label>
        <span className="particle-deflection__slider-label">
          {label}: <strong>{params[key]}</strong> {unit}
        </span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={params[key]}
        onChange={handleParam(key)}
        className="particle-deflection__range"
      />
    </div>
  );

  return (
    <div className="particle-deflection" style={{ width, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* 模式切换 */}
      <div className="particle-deflection__toolbar" style={{
        display: 'flex', gap: 8, alignItems: 'center',
        padding: '10px 0', flexWrap: 'wrap',
      }}>
        {(['electric', 'magnetic', 'combined'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setModel(m); resetAnim(); }}
            className={`particle-deflection__btn ${model === m ? 'active' : ''}`}
            style={{
              padding: '6px 16px', border: '1px solid #d1d5db',
              borderRadius: 6, cursor: 'pointer', fontSize: 13,
              background: model === m ? '#3b82f6' : '#fff',
              color: model === m ? '#fff' : '#374151',
              fontWeight: model === m ? 600 : 400,
              transition: 'all 0.15s',
            }}
          >
            {m === 'electric' ? '电场偏转' : m === 'magnetic' ? '磁场偏转' : '组合偏转'}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={togglePlay}
          style={{
            padding: '6px 20px', border: '1px solid #10b981',
            borderRadius: 6, cursor: 'pointer', fontSize: 13,
            background: isPlaying ? '#fef3c7' : '#10b981',
            color: isPlaying ? '#92400e' : '#fff',
            fontWeight: 600, transition: 'all 0.15s',
          }}
        >
          {isPlaying ? '⏸ 暂停' : '▶ 播放'}
        </button>
        <button
          onClick={resetAnim}
          style={{
            padding: '6px 14px', border: '1px solid #d1d5db',
            borderRadius: 6, cursor: 'pointer', fontSize: 13,
            background: '#fff', color: '#374151',
          }}
        >
          ↺ 重置
        </button>
      </div>

      {/* SVG Canvas */}
      <div style={{ position: 'relative', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          style={{ width: '100%', height: 'auto', display: 'block', background: '#fafbfc' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 背景网格 */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {model === 'electric' && renderElectric()}
          {model === 'magnetic' && renderMagnetic()}
          {model === 'combined' && renderCombined()}
        </svg>
      </div>

      {/* 滑块参数 */}
      <div className="particle-deflection__controls" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '6px 18px',
        padding: '12px 0 4px',
      }}>
        {renderSlider('板间电压 U', 'U', 100, 1000, 10, 'V')}
        {renderSlider('磁感应强度 B', 'B', 0.1, 2.0, 0.1, 'T')}
        {renderSlider('初速度 v₀', 'v0', 0.5, 6.0, 0.1, '×10⁶ m/s')}
        {renderSlider('电荷量 q', 'q', 0.5, 3.0, 0.1, '× e')}
        {renderSlider('质量 m', 'm', 0.5, 4.0, 0.1, '× m_e')}
      </div>

      {/* 参数面板 */}
      {model === 'electric' && renderElectricParams()}
      {model === 'magnetic' && renderMagneticParams()}
      {model === 'combined' && renderCombinedParams()}
    </div>
  );
}
