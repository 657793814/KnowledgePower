import { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from 'antd';
import { SUBJECT_LABELS, SUBJECT_DOMAINS, DOMAIN_COLORS } from '@/types';
import type { SubjectKey } from '@/store/subjectStore';
import { useSubjectStore } from '@/store/subjectStore';
import { useSpaceCanvas } from '@/hooks/useSpaceCanvas';

// ─── 配色 ───
const C: Record<string, { main: string; glow: string; accent: string; highlight: string }> = {
  math:     { main: '#6366f1', glow: 'rgba(99,102,241,0.6)', accent: '#a5b4fc', highlight: '#818cf8' },
  physics:  { main: '#f59e0b', glow: 'rgba(245,158,11,0.6)', accent: '#fde68a', highlight: '#fbbf24' },
  chemistry:{ main: '#06b6d4', glow: 'rgba(6,182,212,0.6)', accent: '#67e8f9', highlight: '#22d3ee' },
  bio:      { main: '#ec4899', glow: 'rgba(236,72,153,0.6)', accent: '#f9a8d4', highlight: '#f472b6' },
  eng:      { main: '#eab308', glow: 'rgba(234,179,8,0.6)', accent: '#fde047', highlight: '#facc15' },
  history:  { main: '#e11d48', glow: 'rgba(225,29,72,0.6)', accent: '#fda4af', highlight: '#fb7185' },
  politics: { main: '#9333ea', glow: 'rgba(147,51,234,0.6)', accent: '#d8b4fe', highlight: '#c084fc' },
  geo:      { main: '#16a34a', glow: 'rgba(22,163,74,0.6)', accent: '#86efac', highlight: '#4ade80' },
  cs:       { main: '#0ea5e9', glow: 'rgba(14,165,233,0.6)', accent: '#7dd3fc', highlight: '#38bdf8' },
};

/** 视口百分比布局 — 0=最左/最上, 100=最右/最下 */
interface SC { leftPct: number; topPct: number; ps: number; spin: number }
const S: Record<SubjectKey, SC> = {
  // ── 右边缘 ──
  cs:       { leftPct: 92, topPct: 34, ps: 82,  spin: 14 },
  math:     { leftPct: 86, topPct: 58, ps: 74,  spin: 8 },
  geo:      { leftPct: 75, topPct: 72, ps: 58,  spin: 12 },

  // ── 左边缘 ──
  physics:  { leftPct: 5,  topPct: 44, ps: 78,  spin: 9 },
  eng:      { leftPct: 13, topPct: 28, ps: 66,  spin: 12 },
  bio:      { leftPct: 20, topPct: 68, ps: 62,  spin: 11 },

  // ── 中间散落 ──
  chemistry:{ leftPct: 62, topPct: 32, ps: 52,  spin: 10 },
  history:  { leftPct: 32, topPct: 42, ps: 48,  spin: 13 },
  politics: { leftPct: 48, topPct: 66, ps: 56,  spin: 13 },
};

// ─── 3D 领域小卫星 ───
function Spec({ color, r, dur, delay, size, tilt, orbitAngle }: {
  color: string; r: number; dur: number; delay: number; size: number; tilt: number; orbitAngle: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const startTime = performance.now() - delay * 1000;
    const tiltRad = (tilt * Math.PI) / 180;
    const omega = (2 * Math.PI) / (dur * 1000);
    const startAngle = (orbitAngle * Math.PI) / 180;

    let rafId: number;
    const animate = (t: number) => {
      const elapsed = t - startTime;
      const angle = startAngle - omega * elapsed;

      const x = Math.sin(angle) * r;
      const z = Math.cos(angle) * r;

      const projectedY = -z * Math.sin(tiltRad);
      const projectedZ = z * Math.cos(tiltRad);

      const scale = 0.4 + (0.6 * (1 + projectedZ / r));
      const opacity = 0.3 + (0.7 * (1 + projectedZ / r));

      el.style.transform = `translate(${x}px, ${projectedY}px) scale(${scale})`;
      el.style.opacity = String(opacity);

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [r, dur, delay, tilt, orbitAngle]);

  return (
    <div style={{
      position: 'absolute', left: '50%', top: '50%', width: 0, height: 0,
    }}>
      <div ref={ref} style={{
        position: 'absolute', left: -size / 2, top: -size / 2,
        width: size, height: size, borderRadius: '50%',
        background: `
          radial-gradient(circle at 35% 28%, ${color}ee 0%, ${color}99 40%, ${color}66 70%, ${color}44 100%)
        `,
        boxShadow: `
          inset -${size * 0.25}px -${size * 0.15}px ${size * 0.4}px rgba(0,0,0,0.5),
          0 0 ${size * 1.5}px ${color}cc,
          0 0 ${size * 3}px ${color}44
        `,
        pointerEvents: 'none',
        transformOrigin: 'center center',
      }} />
    </div>
  );
}

// ─── 学科星球 ───
function Planet({ sub }: { sub: SubjectKey }) {
  const navigate = useNavigate();
  const { setSubject } = useSubjectStore();
  const [h, setH] = useState(false);
  const co = C[sub], ps = S[sub].ps;
  const domains = Object.entries(SUBJECT_DOMAINS[sub] || []);

  return (
    <div
      onClick={() => { setSubject(sub); navigate('/graph'); }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: ps, height: ps, borderRadius: '50%', cursor: 'pointer', position: 'relative',
        transformStyle: 'preserve-3d',
        perspective: '800px',
        filter: h ? 'brightness(1.4) saturate(1.2)' : 'brightness(1) saturate(1)',
        transition: 'filter 0.3s',
      }}
    >
      {/* 球体表面（自转） */}
      <div style={{
        width: ps, height: ps, borderRadius: '50%', position: 'absolute', overflow: 'hidden',
        animation: `sp ${S[sub].spin}s linear infinite`,
        background: `
          radial-gradient(circle at 35% 25%, ${co.accent}aa 0%, transparent 50%),
          radial-gradient(circle at 65% 80%, rgba(0,0,0,0.35) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, ${co.main} 0%, ${co.main}bb 60%, ${co.main}77 100%)
        `,
        boxShadow: `
          inset -${ps * 0.15}px -${ps * 0.15}px ${ps * 0.35}px rgba(0,0,0,0.5),
          0 0 ${ps * 0.5}px ${co.glow},
          0 0 ${ps * 1.2}px ${co.glow.replace('0.6', '0.15')}
        `,
      }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: `${15 + i * 26}%`, left: '-25%', right: '-25%', height: '1.5px',
            background: `linear-gradient(90deg, transparent, ${co.highlight}55, transparent)`,
            transform: `rotate(${i * 28}deg)`, transformOrigin: 'center',
          }} />
        ))}
      </div>

      {/* 发光外环 */}
      <div style={{
        position: 'absolute', top: -3, left: -3, width: ps + 6, height: ps + 6,
        borderRadius: '50%', border: `1.5px solid ${co.glow}`,
        opacity: h ? 0.9 : 0.3, transition: 'opacity 0.3s', pointerEvents: 'none',
        boxShadow: h ? `0 0 ${ps * 0.3}px ${co.glow}` : 'none',
      }} />

      {/* 文字标签 */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{
          fontSize: Math.round(ps * 0.25), fontWeight: 700, color: '#fff',
          textShadow: `0 0 16px ${co.glow}, 0 0 32px rgba(0,0,0,0.9)`,
          letterSpacing: 1, textAlign: 'center', lineHeight: 1.1,
        }}>
          {((SUBJECT_LABELS[sub] || sub) as string).replace(/^[^\s]+\s/, '')}
        </span>
      </div>

      {/* ── 3D 轨道环 ── */}
      {[
        { r: ps * 0.38 + 4, ti: 68, rz: 10 },
        { r: ps * 0.55 + 6, ti: 54, rz: 55 },
        { r: ps * 0.75 + 8, ti: 60, rz: 120 },
      ].map((ring, ri) => (
        <div key={`or${ri}`} style={{
          position: 'absolute', left: '50%', top: '50%',
          width: ring.r * 2, height: ring.r * 2,
          transform: `translate(-50%,-50%) rotateX(${ring.ti}deg) rotateZ(${ring.rz}deg)`,
          pointerEvents: 'none',
        }}>
          <div style={{
            width: '100%', height: '100%', borderRadius: '50%',
            border: `2px solid ${co.glow}`,
            opacity: 0.12 + ri * 0.06,
            boxShadow: `
              0 0 8px ${co.glow.replace('0.6', '0.08')},
              0 0 24px ${co.glow.replace('0.6', '0.03')}
            `,
          }} />
          <div style={{
            position: 'absolute', inset: '-5px',
            borderRadius: '50%', border: `8px solid ${co.glow}`,
            opacity: 0.04, filter: 'blur(4px)',
          }} />
        </div>
      ))}

      {/* ── 光晕光环 ── */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: ps * 1.45, height: ps * 1.45,
        transform: 'translate(-50%,-50%) rotateX(60deg)',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${co.glow.replace('0.6', '0.10')} 0%, transparent 50%)`,
        filter: 'blur(14px)',
        pointerEvents: 'none',
      }} />

      {/* ── 领域卫星（3D 倾斜环绕） ── */}
      {domains.map(([dk], i) => {
        const n = domains.length;
        const baseR = ps * 0.44 + 6 + i * (ps * 0.50 / Math.max(n - 1, 1));
        const rr = baseR + (Math.random() - 0.5) * ps * 0.15;
        const tilt = 45 + Math.random() * 40;
        const satSize = ps * (0.07 + Math.random() * 0.06);
        const orbitAngle = (360 / n) * i + Math.random() * 60;
        return (
          <Spec key={dk} color={DOMAIN_COLORS[dk] || co.main}
            r={rr}
            dur={5 + Math.random() * 8}
            delay={Math.random() * 10}
            size={satSize}
            tilt={tilt}
            orbitAngle={orbitAngle} />
        );
      })}
    </div>
  );
}

// ─── 黑洞 ───
function BlackHole() {
  const ps = useMemo(() =>
    Array.from({ length: 60 }, () => ({
      r: 20 + Math.random() * 200, s: 1 + Math.random() * 2.5,
      dur: 8 + Math.random() * 35, del: Math.random() * 10,
    })), []);
  return (
    <div style={{ position: 'absolute', left: -220, top: -220, width: 440, height: 440, pointerEvents: 'none', zIndex: 5 }}>
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        width: 140, height: 140, borderRadius: '50%',
        background: 'radial-gradient(circle, #000 0%, #000 30%, rgba(100,80,255,0.1) 38%, rgba(200,150,50,0.08) 42%, transparent 48%, rgba(100,80,255,0.04) 53%, transparent 60%)',
        filter: 'blur(4px)', animation: 'lp 4s ease-in-out infinite',
      }} />
      {[
        { w: 120, h: 36, b: 5, o: 0.6, cs: ['#ff4500', '#ff8c00', '#ffd700'] },
        { w: 200, h: 52, b: 8, o: 0.4, cs: ['#ff8c00', '#a855f7', '#6366f1'] },
        { w: 300, h: 72, b: 12, o: 0.25, cs: ['#a855f7', '#6366f1', '#3b82f6'] },
        { w: 420, h: 110, b: 18, o: 0.1, cs: ['#6366f1', '#3b82f6', '#1d4ed8'] },
      ].map((l, i) => (
        <div key={`d${i}`} style={{
          position: 'absolute', left: '50%', top: '50%',
          width: l.w, height: l.h, borderRadius: '50%',
          background: `radial-gradient(ellipse, ${l.cs[0]}55 0%, ${l.cs[0]}33 25%, ${l.cs[1]}15 50%, transparent 80%)`,
          filter: `blur(${l.b}px)`, opacity: l.o,
          transform: `translate(-50%,-50%) rotateX(${68 + i * 2}deg)`,
        }} />
      ))}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) rotateX(70deg)',
        width: 420, height: 120, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)',
        filter: 'blur(25px)',
      }} />
      {ps.map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0 }}>
          <div style={{
            position: 'absolute', width: p.s, height: p.s, borderRadius: '50%',
            background: i % 3 === 0 ? 'rgba(165,180,252,0.35)' : i % 3 === 1 ? 'rgba(255,200,100,0.2)' : 'rgba(99,102,241,0.25)',
            animation: `sp ${p.dur}s linear infinite`, animationDelay: `${p.del}s`,
            transform: `translateX(${p.r}px)`,
          }} />
        </div>
      ))}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        width: 65, height: 65, borderRadius: '50%', background: '#000',
        boxShadow: '0 0 40px rgba(0,0,0,1), 0 0 80px rgba(0,0,0,0.9)',
      }} />
    </div>
  );
}

// ─── 搜索 ───
function SearchOverlay() {
  const navigate = useNavigate();
  const [active, setA] = useState(false);
  const [v, setV] = useState('');
  const ir = useRef<HTMLInputElement>(null);
  useEffect(() => { if (active && ir.current) ir.current.focus(); }, [active]);
  return (
    <>
      <div onClick={() => !active && setA(true)}
        style={{ position: 'absolute', left: -180, top: -21, width: 360, height: 42, zIndex: 14, cursor: 'pointer' }} />
      <div onClick={e => e.stopPropagation()} style={{
        position: 'absolute', top: -21, left: -180, width: 360, zIndex: 15,
        display: 'flex', alignItems: 'center', height: 42,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.1)', padding: '0 16px', gap: 8,
        opacity: active ? 1 : 0, pointerEvents: active ? 'auto' : 'none', transition: 'opacity 0.3s',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>🔍</span>
        <input ref={ir} value={v} onChange={e => setV(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && v.trim() && navigate('/search?q=' + encodeURIComponent(v.trim()))}
          placeholder="搜索知识…"
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 13 }} />
        {v && <span onClick={() => { setV(''); ir.current?.focus(); }}
          style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14, cursor: 'pointer' }}>✕</span>}
      </div>
      {active && <div onClick={() => { setA(false); setV(''); }}
        style={{ position: 'fixed', inset: 0, zIndex: -1, cursor: 'default' }} />}
    </>
  );
}

// ─── 星云光带 ─────
function NebulaBands() {
  const bands = useMemo(() => [
    { w: 1100, h: 280, rx: 74, op: 0.22, bl: 30, c: ['#6366f1', '#818cf8', '#a5b4fc', '#6366f1'], ang: 0 },
    { w: 850, h: 220, rx: 50, op: 0.26, bl: 25, c: ['#f59e0b', '#fb923c', '#fbbf24', '#f59e0b'], ang: 30 },
    { w: 620, h: 180, rx: 62, op: 0.24, bl: 20, c: ['#ec4899', '#f472b6', '#f9a8d4', '#ec4899'], ang: 15 },
    { w: 1000, h: 260, rx: 38, op: 0.20, bl: 35, c: ['#06b6d4', '#22d3ee', '#67e8f9', '#06b6d4'], ang: -20 },
    { w: 1200, h: 320, rx: 58, op: 0.18, bl: 40, c: ['#9333ea', '#a855f7', '#c084fc', '#9333ea'], ang: 10 },
    { w: 1400, h: 380, rx: 66, op: 0.12, bl: 50, c: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#0ea5e9'], ang: -10 },
  ], []);
  return (
    <>
      {bands.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: `translate(-50%,-50%) rotateX(${b.rx}deg) rotateZ(${b.ang}deg)`,
          width: b.w, height: b.h, borderRadius: '50%',
          background: `radial-gradient(ellipse, ${b.c[0]}88 0%, ${b.c[1]}44 25%, ${b.c[2]}22 50%, ${b.c[3]}0a 70%, transparent 90%)`,
          filter: `blur(${b.bl}px)`, opacity: b.op,
          pointerEvents: 'none', zIndex: 3,
        }} />
      ))}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%,-50%) rotateX(40deg)',
        width: 1800, height: 450, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.04) 25%, rgba(236,72,153,0.02) 50%, transparent 80%)',
        filter: 'blur(120px)', opacity: 0.6, pointerEvents: 'none', zIndex: 2,
      }} />
    </>
  );
}

// ─── 底部标签 ───
function Bar({ subs, onClick }: { subs: SubjectKey[]; onClick: (s: SubjectKey) => void }) {
  return (
    <div style={{ position: 'absolute', bottom: '8%', left: 0, right: 0, textAlign: 'center', zIndex: 50 }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', maxWidth: '90vw', margin: '0 auto' }}>
        {subs.map(s => (
          <span key={s} onClick={() => onClick(s)}
            style={{ color: C[s].accent, fontSize: 12, opacity: 0.5, cursor: 'pointer', transition: 'all 0.3s', letterSpacing: 1, padding: '3px 14px', borderRadius: 16, border: '1px solid transparent' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.opacity = '1'; (e.target as HTMLElement).style.borderColor = C[s].glow; (e.target as HTMLElement).style.background = C[s].glow.replace('0.6', '0.1'); }}
            onMouseLeave={e => { (e.target as HTMLElement).style.opacity = '0.5'; (e.target as HTMLElement).style.borderColor = 'transparent'; (e.target as HTMLElement).style.background = 'transparent'; }}>
            {SUBJECT_LABELS[s]}
          </span>
        ))}
      </div>
    </div>
  );
}

// ═══ 主页 ═══
export default function CosmicHome() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setSubject } = useSubjectStore();
  useSpaceCanvas(canvasRef);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const r = e.contentRect;
      setVp({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const subs: SubjectKey[] = ['cs', 'math', 'geo', 'physics', 'chemistry', 'bio', 'eng', 'history', 'politics'];

  // 按 y 从大到小（底部优先渲染，顶部后置渲染 = 盖住底部）
  // 根据视口尺寸计算行星的像素位置和深度
  const [vp, setVp] = useState({ w: 1920, h: 1080 });
  const planets = useMemo(() => {
    const w = vp.w, h = vp.h;
    return [...subs]
      .map(sub => {
        const cfg = S[sub];
        const px = w * cfg.leftPct / 100;
        const py = h * cfg.topPct / 100;
        // 靠下靠右 ≈ 离观察者近，更大更亮
        const dist = (px / w + py / h) / 2;
        const d = 0.7 + dist * 1.0;
        const clamped = Math.max(0.7, Math.min(1.8, d));
        const op = 0.3 + 0.7 * ((clamped - 0.7) / 1.1);
        return { sub, px, py, ps: cfg.ps, d: clamped, op };
      });
  }, [vp]);

  return (
    <div ref={rootRef} style={{
      position: 'fixed', inset: 0, overflow: 'hidden',
      fontFamily: "'Inter', sans-serif", cursor: 'default',
      background: 'radial-gradient(ellipse at 50% 50%, #0e0e24 0%, #080816 40%, #02020a 100%)',
    }}>
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block',
      }} />

      <style>{`
        @keyframes ti { from { opacity:0; transform:translateY(40px) scale(0.9); filter:blur(8px); } to { opacity:1; transform:translateY(0) scale(1); filter:blur(0); } }
        @keyframes si { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fi { from { opacity:0; } to { opacity:1; } }
        @keyframes fl { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
        @keyframes sp { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes lp { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
      `}</style>

      {/* 标题 */}
      <div style={{ position: 'absolute', top: '3%', left: 0, right: 0, textAlign: 'center', zIndex: 50, pointerEvents: 'none' }}>
        <div style={{ animation: 'ti 1.2s cubic-bezier(0.22,1,0.36,1) 0.1s both' }}>
          <Typography.Title level={1} style={{
            margin: 0, fontSize: 'clamp(28px,4.5vw,48px)', fontWeight: 800, letterSpacing: '0.15em',
            background: 'linear-gradient(135deg,#a5b4fc 0%,#c4b5fd 20%,#fde68a 45%,#6ee7b7 70%,#a5b4fc 90%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 40px rgba(99,102,241,0.3))', lineHeight: 1.2,
          }}>知识动力</Typography.Title>
        </div>
        <div style={{ animation: 'si 1s ease-out 1s both', marginTop: 10 }}>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 'clamp(10px,1vw,13px)', letterSpacing: '0.5em', textShadow: '0 0 20px rgba(0,0,0,0.8)' }}>
            探索知识的浩瀚宇宙
          </span>
        </div>
      </div>

      {/* ═══ 场景 ═══ */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* 黑洞居中 */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0 }}>
          <BlackHole />
          <SearchOverlay />
          <NebulaBands />
        </div>

        {/* 行星直接散布在全屏 */}
        {planets.map(({ sub, px, py, ps, d, op }) => (
          <div
            key={sub}
            style={{
              position: 'absolute',
              left: px - (ps * d) / 2,
              top: py - (ps * d) / 2,
              width: ps * d,
              height: ps * d,
              zIndex: Math.round(py) + 100,
              pointerEvents: 'auto',
              opacity: op,
              filter: `brightness(${0.4 + d * 0.6}) drop-shadow(0 0 ${6 + d * 24}px ${C[sub].glow.replace('0.6', `${0.04 + d * 0.22}`)})`,
            }}>
            <Planet sub={sub} />
          </div>
        ))}
      </div>

      {/* 底部 */}
      <div style={{ position: 'absolute', bottom: '3%', left: 0, right: 0, textAlign: 'center', zIndex: 50 }}>
        <div style={{ animation: 'fl 4s ease-in-out infinite' }}>
          <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11, letterSpacing: 5, fontWeight: 500, animation: 'fi 2s ease-out 1.5s both' }}>
            ✦  点击进入知识星系  ✦
          </span>
        </div>
      </div>

      <Bar subs={subs} onClick={(s) => { setSubject(s); navigate('/graph'); }} />

      <div style={{ position: 'absolute', bottom: '1.2%', right: '3%', color: 'rgba(255,255,255,0.04)', fontSize: 9, zIndex: 50, letterSpacing: 2, pointerEvents: 'none', animation: 'fi 3s ease-out 3s both' }}>
        KnowledgePower v0.2
      </div>
    </div>
  );
}
