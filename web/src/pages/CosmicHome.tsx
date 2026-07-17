import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from 'antd';
import { SUBJECT_LABELS, SUBJECT_DOMAINS, DOMAIN_COLORS } from '@/types';
import type { SubjectKey } from '@/store/subjectStore';
import { useSubjectStore } from '@/store/subjectStore';
import { useSpaceCanvas } from '@/hooks/useSpaceCanvas';

// ─── 学科配色 ───
const SUBJECT_COLORS: Record<SubjectKey, {
  main: string; glow: string; accent: string; ring: string;
}> = {
  math:     { main: '#6366f1', glow: 'rgba(99,102,241,0.5)', accent: '#a5b4fc', ring: 'rgba(165,180,252,0.2)' },
  physics:  { main: '#f59e0b', glow: 'rgba(245,158,11,0.5)', accent: '#fde68a', ring: 'rgba(253,230,138,0.2)' },
  chemistry:{ main: '#10b981', glow: 'rgba(16,185,129,0.5)', accent: '#6ee7b7', ring: 'rgba(110,231,183,0.2)' },
  bio:      { main: '#ec4899', glow: 'rgba(236,72,153,0.5)', accent: '#f9a8d4', ring: 'rgba(249,168,212,0.2)' },
  eng:      { main: '#FF9800', glow: 'rgba(255,152,0,0.5)', accent: '#ffcc80', ring: 'rgba(255,204,128,0.2)' },
  history:  { main: '#8D6E63', glow: 'rgba(141,110,99,0.5)', accent: '#bcaaa4', ring: 'rgba(188,170,164,0.2)' },
  politics: { main: '#7B1FA2', glow: 'rgba(123,31,162,0.5)', accent: '#ce93d8', ring: 'rgba(206,147,216,0.2)' },
  geo:      { main: '#43A047', glow: 'rgba(67,160,71,0.5)', accent: '#a5d6a7', ring: 'rgba(165,214,167,0.2)' },
};

// ─── 单个领域星球（3D 旋涡星系风格） ───
function DomainPlanet({ domainKey, domainLabel, color, orbitRadius, orbitDuration, orbitDelay }: {
  domainKey: string; domainLabel: string; color: string;
  orbitRadius: number; orbitDuration: number; orbitDelay: number;
}) {
  const [showLabel, setShowLabel] = useState(false);
  const shortLabel = String(domainLabel).replace(/^[^\s]+\s/, '');

  // 生成旋涡臂颜色
  const armColor1 = color;
  const armColor2 = color + '88';
  const coreColor = '#ffffff';

  return (
    <div
      style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 0, height: 0,
        animation: `orbit ${orbitDuration}s linear infinite`,
        animationDelay: `${orbitDelay}s`,
        pointerEvents: 'none',
      } as React.CSSProperties}
    >
      {/* 轨道圆环 */}
      <div style={{
        position: 'absolute', top: -orbitRadius, left: -orbitRadius,
        width: orbitRadius * 2, height: orbitRadius * 2,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.06)',
        pointerEvents: 'none',
      }} />

      <div
        style={{
          position: 'absolute',
          transform: `translateX(${orbitRadius}px)`,
          transformOrigin: '0 0',
        }}
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
      >
        {/* 旋涡星系主体 */}
        <div style={{
          width: 28,
          height: 28,
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          pointerEvents: 'auto',
          transform: 'rotate(-30deg)',
        }}>
          {/* 旋涡臂 */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `
              radial-gradient(circle at 50% 50%, ${coreColor} 0%, ${coreColor}44 15%, transparent 30%),
              conic-gradient(from 0deg, ${armColor1}88, ${armColor2}44, ${armColor1}66, ${armColor2}33, ${armColor1}88)
            `,
            filter: 'blur(2px)',
            opacity: 0.9,
          }} />
          
          {/* 第二层旋涡臂 */}
          <div style={{
            position: 'absolute',
            inset: '4px',
            borderRadius: '50%',
            background: `conic-gradient(from 180deg, ${armColor1}66, ${armColor2}33, ${armColor1}55, ${armColor2}22, ${armColor1}66)`,
            filter: 'blur(1.5px)',
            opacity: 0.7,
          }} />
          
          {/* 核心亮点 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${coreColor}, ${armColor1})`,
            boxShadow: `0 0 8px ${armColor1}, 0 0 16px ${armColor1}88`,
          }} />
          
          {/* 光晕 */}
          <div style={{
            position: 'absolute',
            inset: -8,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${armColor1}22 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
        </div>

        {/* 标签 */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 32,
          transform: 'translateX(-50%)',
          opacity: showLabel ? 1 : 0,
          transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          padding: '3px 10px',
          borderRadius: 6,
          border: `1px solid ${color}44`,
        }}>
          <span style={{
            fontSize: 11, color: '#fff', fontWeight: 500,
            textShadow: '0 0 8px rgba(0,0,0,0.8)',
          }}>
            {shortLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── 星系网格单元（3D 行星+旋涡星系风格） ───
function GalaxyCell({ subject, row, col, cellSize }: {
  subject: SubjectKey; row: number; col: number; cellSize: number;
}) {
  const navigate = useNavigate();
  const { setSubject } = useSubjectStore();
  const colors = SUBJECT_COLORS[subject];
  const domains = Object.entries(SUBJECT_DOMAINS[subject] || {});
  const isLarge = row === 0;
  const planetSize = isLarge ? 72 : 56; // 增大星球尺寸

  const orbitCfgs = [
    { baseR: 52, stepR: 18, dur: 18, durStep: 2 },
    { baseR: 40, stepR: 14, dur: 14, durStep: 1.5 },
  ];
  const oc = orbitCfgs[row];

  const handleEnterSubject = () => {
    setSubject(subject);
    navigate('/graph');
  };

  // 入场动画延迟：理科第一行稍快，文科第二行稍慢
  const appearDelay = 0.1 + row * 3 + col * 0.15;

  return (
    <div
      onClick={handleEnterSubject}
      style={{
        width: cellSize,
        height: cellSize,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        // 用 opacity 做入场，transform scale 只做 hover 缩放 — 避免与 CSS animation 冲突
        opacity: 0,
        animation: `coreAppear 0.8s cubic-bezier(0.22,1,0.36,1) ${appearDelay}s forwards`,
        willChange: 'transform',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 60px ${colors.glow}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* 中心星球 — 3D 行星效果 */}
      <div style={{
        width: planetSize,
        height: planetSize,
        borderRadius: '50%',
        position: 'absolute',
        zIndex: 10,
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* 星球主体 */}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 30% 25%, ${colors.accent} 0%, transparent 50%),
            radial-gradient(circle at 70% 75%, ${colors.main}44 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, ${colors.main}cc 0%, ${colors.main}88 60%, ${colors.main}66 100%)
          `,
          boxShadow: `
            inset -${Math.round(planetSize * 0.15)}px -${Math.round(planetSize * 0.15)}px ${Math.round(planetSize * 0.3)}px rgba(0,0,0,0.5),
            inset ${Math.round(planetSize * 0.1)}px ${Math.round(planetSize * 0.1)}px ${Math.round(planetSize * 0.2)}px rgba(255,255,255,0.1),
            0 0 ${planetSize * 0.6}px ${colors.glow},
            0 0 ${planetSize}px ${colors.glow.replace('0.5', '0.2')}
          `,
        }} />
        
        {/* 行星光环（部分科目有） */}
        {(subject === 'math' || subject === 'physics' || subject === 'geo') && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotateX(75deg)',
            width: planetSize * 2,
            height: planetSize * 2,
            borderRadius: '50%',
            border: `2px solid ${colors.ring}`,
            boxShadow: `0 0 ${planetSize * 0.3}px ${colors.glow}`,
            pointerEvents: 'none',
          }} />
        )}
        
        {/* 表面纹理线 */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${25 + i * 25}%`,
              left: '0',
              right: '0',
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${colors.accent}33, transparent)`,
              transform: `rotate(${i * 15}deg)`,
              transformOrigin: 'center',
            }} />
          ))}
        </div>
      </div>

      {/* 光晕 — hover 显示 */}
      <div style={{
        position: 'absolute', inset: -16,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.glow.replace('0.5', '0.06')} 0%, transparent 70%)`,
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity 0.6s ease',
      }}
        className="ring-glow"
      />

      {/* 科目名称标签 — 悬浮显示 */}
      <div style={{
        position: 'absolute',
        bottom: -32,
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: 0,
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: 3,
        color: colors.accent,
        textShadow: `0 0 20px ${colors.glow}`,
      }}
        className="core-label"
      >
        {SUBJECT_LABELS[subject]}
      </div>

      {/* 领域星球 — 每个科目有自己的轨道系统 */}
      {domains.map(([dk, dl], di) => (
        <DomainPlanet
          key={dk} domainKey={dk} domainLabel={dl}
          color={DOMAIN_COLORS[dk] || colors.main}
          orbitRadius={oc.baseR + (di % 3) * oc.stepR}
          orbitDuration={oc.dur + di * oc.durStep}
          // 负延迟让星球初始位置均匀分散在轨道上，不扎堆
          orbitDelay={-(di * oc.dur / domains.length)}
        />
      ))}
    </div>
  );
}

// ─── 主组件 ───
export default function CosmicHome() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [hoveredSubject, setHoveredSubject] = useState<SubjectKey | null>(null);

  useSpaceCanvas(canvasRef, () => setEntered(true));

  const subjects: SubjectKey[] = ['math', 'physics', 'chemistry', 'bio', 'eng', 'history', 'politics', 'geo'];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        cursor: 'default',
      }}
    >
      {/* ═══ Canvas 深空背景 ═══ */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%', display: 'block',
        }}
      />

      <style>{`
        @keyframes titleReveal {
          from { opacity: 0; transform: translateY(40px) scale(0.9); filter: blur(8px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes subtitleReveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes introFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        /* 核心入场动画 — 从中心放大出现，不含 translate 位移 */
        @keyframes coreAppear {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes floatHint {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-6px); }
        }

        .domain-dot:hover {
          transform: scale(1.4) !important;
          filter: brightness(1.4);
        }
      `}</style>

      {/* ═══ 标题 ═══ */}
      <div style={{
        position: 'absolute', top: '4%', left: 0, right: 0,
        textAlign: 'center', zIndex: 50, pointerEvents: 'none',
      }}>
        <div style={{ animation: 'titleReveal 1.2s cubic-bezier(0.22,1,0.36,1) 0.1s both' }}>
          <Typography.Title level={1} style={{
            margin: 0,
            fontSize: 'clamp(34px, 5.5vw, 56px)',
            fontWeight: 800,
            letterSpacing: '0.15em',
            background: 'linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 20%, #fde68a 45%, #6ee7b7 70%, #a5b4fc 90%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 50px rgba(99,102,241,0.3))',
            lineHeight: 1.2,
          }}>
            知识动力
          </Typography.Title>
        </div>
        <div style={{ animation: 'subtitleReveal 1s ease-out 1s both', marginTop: 12 }}>
          <span style={{
            color: 'rgba(255,255,255,0.25)',
            fontSize: 'clamp(11px, 1.1vw, 14px)',
            letterSpacing: '0.6em',
            textShadow: '0 0 20px rgba(0,0,0,0.8)',
          }}>
            探索知识的浩瀚宇宙
          </span>
        </div>
      </div>

      {/* ═══ 8个学科星系（2行×4列网格）═══ */}
      {/* 用 CSS calc 做居中定位，完全不依赖 JS 读取 window 尺寸，杜绝位移 */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, min(22vw, 200px))',
        gridTemplateRows: 'repeat(2, min(22vw, 200px))',
        gap: '40px',
        zIndex: 10,
      }}>
        {subjects.map((subject, idx) => {
          const row = idx < 4 ? 0 : 1;
          const col = idx % 4;
          const cellSize = Math.min(window.innerWidth * 0.22, 200);
          return (
            <GalaxyCell
              key={subject}
              subject={subject}
              row={row}
              col={col}
              cellSize={cellSize}
            />
          );
        })}
      </div>

      {/* ═══ 底部导航 ═══ */}
      <div style={{
        position: 'absolute', bottom: '3%', left: 0, right: 0,
        textAlign: 'center', zIndex: 50,
        animation: 'introFadeIn 2s ease-out 2s both',
      }}>
        <div style={{ animation: 'floatHint 4s ease-in-out infinite' }}>
          <div style={{
            color: 'rgba(255,255,255,0.10)', fontSize: 11, letterSpacing: 5,
            marginBottom: 16,
          }}>
            ✦  点击学科核心进入知识星系  ✦
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          {subjects.map(s => {
            const colors = SUBJECT_COLORS[s];
            return (
              <span
                key={s}
                style={{
                  color: colors.accent, fontSize: 13, opacity: 0.35,
                  cursor: 'pointer', transition: 'all 0.4s',
                  letterSpacing: 2, padding: '4px 14px', borderRadius: 20,
                  border: '1px solid transparent',
                  pointerEvents: 'auto',
                }}
                onClick={() => {
                  const { setSubject } = useSubjectStore.getState();
                  setSubject(s);
                  window.location.href = '/graph';
                }}
                onMouseEnter={e => {
                  (e.target as HTMLElement).style.opacity = '0.8';
                  (e.target as HTMLElement).style.borderColor = colors.glow;
                  (e.target as HTMLElement).style.background = colors.glow.replace('0.5', '0.08');
                }}
                onMouseLeave={e => {
                  (e.target as HTMLElement).style.opacity = '0.35';
                  (e.target as HTMLElement).style.borderColor = 'transparent';
                  (e.target as HTMLElement).style.background = 'transparent';
                }}
              >
                ✦ {String(SUBJECT_LABELS[s])}
              </span>
            );
          })}
        </div>
      </div>

      {/* ═══ 版本号 ═══ */}
      <div style={{
        position: 'absolute', bottom: '1.2%', right: '3%',
        color: 'rgba(255,255,255,0.04)', fontSize: 9, zIndex: 50,
        letterSpacing: 2, pointerEvents: 'none',
        animation: 'introFadeIn 3s ease-out 3s both',
      }}>
        KnowledgePower v0.1
      </div>
    </div>
  );
}
