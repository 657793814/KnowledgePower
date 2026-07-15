/**
 * AnimationPlayer — 通用分步动画播放器
 *
 * 将一段知识/题目的解题过程拆成动画步骤，逐帧播放。
 * 支持：手动翻页、自动播放、速度控制、循环。
 *
 * 使用方式：
 * ```
 * <AnimationPlayer steps={[
 *   { title: '第一步', draw: (ctx, w, h, t) => { ... } },  // t ∈ [0,1] 插值
 *   ...
 * ]} />
 * ```
 */
import { useRef, useEffect, useState, useCallback } from 'react';

export interface AnimationStep {
  /** 步骤标题（显示在下方） */
  title: string;
  /** 步骤描述/公式文本 */
  description?: string;
  /** Canvas 绘制函数 — t ∈ [0,1]，0=开始 1=完成 */
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number, t: number) => void;
  /** 本步骤持续时间 (ms)，默认 1000 */
  duration?: number;
}

interface Props {
  steps: AnimationStep[];
  width?: number;
  height?: number;
  /** 是否默认自动播放 */
  autoPlay?: boolean;
  /** 播放完是否循环 */
  loop?: boolean;
  /** 播放完回调 */
  onComplete?: () => void;
}

/** 缓动函数 — easeInOutCubic */
function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function AnimationPlayer({
  steps,
  width = 500,
  height = 360,
  autoPlay = false,
  loop = false,
  onComplete,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0); // [0,1] 当前步骤进度
  const [playing, setPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState(1); // 1x, 2x, 0.5x
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const stepStartRef = useRef<number>(0);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);

  // 重置
  const reset = useCallback(() => {
    setCurrentStep(0);
    setProgress(0);
    setPlaying(false);
    startTimeRef.current = 0;
    stepStartRef.current = 0;
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  // 跳到指定步骤
  const goToStep = useCallback((step: number) => {
    const s = Math.max(0, Math.min(steps.length - 1, step));
    setCurrentStep(s);
    setProgress(0);
    stepStartRef.current = performance.now();
  }, [steps.length]);

  // 上一/下一步
  const prevStep = useCallback(() => goToStep(currentStep - 1), [currentStep, goToStep]);
  const nextStep = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      onComplete?.();
      if (loop) {
        reset();
        setPlaying(true);
      } else {
        setPlaying(false);
      }
      return;
    }
    goToStep(currentStep + 1);
  }, [currentStep, steps.length, goToStep, onComplete, loop, reset]);

  // 绘制循环
  useEffect(() => {
    canvasElRef.current = canvasRef.current;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const step = steps[currentStep];
    if (!step) return;

    const duration = (step.duration || 1000) / speed;

    if (playing) {
      if (stepStartRef.current === 0) stepStartRef.current = performance.now();
      startTimeRef.current = performance.now();

      const animate = (now: number) => {
        const elapsed = now - stepStartRef.current;
        const rawT = Math.min(elapsed / duration, 1);
        const t = ease(rawT);

        ctx.clearRect(0, 0, width, height);

        // 背景
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, width, height);

        step.draw(ctx, width, height, t);

        // 步骤进度条（底部小进度）
        const barY = height - 6;
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(20, barY, width - 40, 4);
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(20, barY, (width - 40) * rawT, 4);

        setProgress(rawT);

        if (rawT < 1) {
          animRef.current = requestAnimationFrame(animate);
        } else {
          // 步骤完成
          ctx.fillStyle = '#3B82F6';
          ctx.fillRect(20, barY, width - 40, 4);
          setProgress(1);
          // 自动进入下一步
          setTimeout(() => nextStep(), 300 / speed);
        }
      };

      animRef.current = requestAnimationFrame(animate);
    } else {
      // 静态绘制
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);
      step.draw(ctx, width, height, progress);
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [currentStep, playing, speed, steps, width, height, nextStep, progress]);

  // 播放/暂停
  const togglePlay = () => {
    if (!playing) {
      if (currentStep >= steps.length - 1 && progress >= 1) reset();
      stepStartRef.current = performance.now();
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef}
        style={{
          width, height, maxWidth: '100%',
          background: '#f8fafc', borderRadius: 8,
          border: '1px solid #e2e8f0',
        }} />

      {/* 步骤标题 */}
      <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
        {currentStep + 1}/{steps.length} · {steps[currentStep]?.title}
      </div>
      {steps[currentStep]?.description && (
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
          {steps[currentStep].description}
        </div>
      )}

      {/* 控制栏 */}
      <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => { reset(); setPlaying(true); }}
          style={btnStyle()} title="重新播放">
          ⏮
        </button>
        <button onClick={prevStep} disabled={currentStep === 0}
          style={btnStyle(currentStep === 0)} title="上一步">
          ◀
        </button>
        <button onClick={togglePlay}
          style={{ ...btnStyle(), background: '#3B82F6', color: '#fff', minWidth: 60 }}>
          {playing ? '⏸ 暂停' : (progress > 0 && currentStep === steps.length - 1 ? '🔄 重播' : '▶ 播放')}
        </button>
        <button onClick={nextStep} disabled={!playing && currentStep >= steps.length - 1}
          style={btnStyle(!playing && currentStep >= steps.length - 1)} title="下一步">
          ▶
        </button>
        <button onClick={() => { reset(); }}
          style={btnStyle()} title="重置">
          🔄
        </button>

        {/* 速度切换 */}
        <select value={speed} onChange={e => setSpeed(Number(e.target.value))}
          style={{
            padding: '4px 8px', fontSize: 12, borderRadius: 4,
            border: '1px solid #d1d5db', background: '#fff',
            cursor: 'pointer', marginLeft: 8,
          }}>
          <option value={0.5}>0.5×</option>
          <option value={1}>1×</option>
          <option value={2}>2×</option>
        </select>

        {/* 步骤点 */}
        <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          {steps.map((_, i) => (
            <div key={i} onClick={() => { goToStep(i); setPlaying(false); }}
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i === currentStep ? '#3B82F6' : (i < currentStep ? '#93c5fd' : '#d1d5db'),
                cursor: 'pointer', transition: 'background 0.2s',
              }} />
          ))}
        </div>
      </div>

      {steps.length > 0 && (
        <div style={{ marginTop: 6, fontSize: 12, color: '#94a3b8' }}>
          步骤进度：{Math.round(progress * 100)}%
        </div>
      )}
    </div>
  );
}

function btnStyle(disabled = false): React.CSSProperties {
  return {
    padding: '4px 12px',
    background: disabled ? '#f1f5f9' : '#f8fafc',
    color: disabled ? '#cbd5e1' : '#374151',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 13,
    lineHeight: 1.4,
  };
}
