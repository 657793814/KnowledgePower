import { useCallback, useEffect, useRef } from 'react';
import { SpaceScene } from '@/utils/spaceScene';

/**
 * 连接 Canvas 元素到 SpaceScene 渲染引擎
 * 纯视觉背景，不处理鼠标交互（鼠标视差已移除）
 */
export function useSpaceCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onReady?: () => void,
) {
  const sceneRef = useRef<SpaceScene | null>(null);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const readyRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scene = new SpaceScene(ctx);
    sceneRef.current = scene;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      scene.init(w, h, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const loop = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const t = (timestamp - startTimeRef.current) / 1000;
      scene.render(t);
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);

    if (!readyRef.current) {
      readyRef.current = true;
      onReady?.();
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef]);

  return { sceneRef };
}
