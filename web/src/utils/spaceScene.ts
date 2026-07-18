/**
 * 🚀 动漫级宇宙场景 — Canvas 渲染引擎 (v3)
 * 
 * 视觉参考：君の名は。/ 天気の子 / すずめの戸締まり
 * 
 * 功能：
 * - 3D 景深星场（2000 星，多层深度）
 * - 星云（高密度彩色云团，屏幕叠加混合，动漫级浓郁感）
 * - 极光（动态飘动透明彩色光幕）
 * - 流星（偶发拖尾）
 * - 光尘（悬浮微粒，浮游感）
 * - 渐变晕影 + 色调映射 + 辉光
 * - 中心黑洞引力透镜（爱因斯坦环 + 星体拉扯放大）
 */

// ─── 类型 ───

export interface SceneConfig {
  width: number;
  height: number;
  dpr: number;
  time: number;
}

interface Star {
  x: number; y: number; z: number;
  size: number; brightness: number;
  twinkleSpeed: number; twinklePhase: number;
  /** 原始坐标（用于透镜重计算） */
  origX: number; origY: number; origZ: number;
}

interface NebulaCloud {
  x: number; y: number;
  radiusX: number; radiusY: number;
  stops: { pos: number; color: string }[];
  speedX: number; speedY: number;
  phase: number; opacity: number;
}

interface Aurora {
  points: { x: number; y: number }[];
  color: string; opacity: number;
  speed: number; phase: number; width: number;
}

interface Mote {
  x: number; y: number;
  size: number; speedY: number; speedX: number;
  opacity: number; phase: number;
}

interface ShootingStar {
  x: number; y: number; speed: number; angle: number;
  length: number; life: number; maxLife: number;
  active: boolean; trail: { x: number; y: number }[];
}

// ─── 全局参数 ───

const STAR_COUNT = 2000;
const NEBULA_COUNT = 14;
const AURORA_COUNT = 3;
const MOTE_COUNT = 100;
const SHOOTING_STAR_COUNT = 3;

// ─── 场景 ───

export class SpaceScene {
  private ctx: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private nebula: NebulaCloud[] = [];
  private aurora: Aurora[] = [];
  private motes: Mote[] = [];
  private shootingStars: ShootingStar[] = [];
  private time = 0;
  private lastShootingStarTime = 0;
  private w = 0;
  private h = 0;

  // ─── 引力透镜参数 ───
  private lensActive = false;
  private lensCx = 0;
  private lensCy = 0;
  /** 透镜强度（越大效果越强） */
  private lensStrength = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  // ═══════════════════════════════════════════════
  //  引力透镜控制
  // ═══════════════════════════════════════════════

  /** 设置或关闭中心黑洞引力透镜 */
  setGravitationalLensing(active: boolean, strength = 0) {
    this.lensActive = active;
    this.lensCx = this.w / 2;
    this.lensCy = this.h / 2;
    this.lensStrength = active ? strength : 0;
  }

  /**
   * 应用引力透镜：将屏幕坐标周围的星辰扭曲
   * 模拟爱因斯坦环效果
   */
  private applyLens(sx: number, sy: number, size: number, brightness: number):
    { sx: number; sy: number; sizeMult: number; brightMult: number } {
    if (!this.lensActive || this.lensStrength <= 0) {
      return { sx, sy, sizeMult: 1, brightMult: 1 };
    }

    const dx = sx - this.lensCx;
    const dy = sy - this.lensCy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // 透镜影响范围：10px ~ 400px
    const minDist = 8;
    const maxDist = 400;
    if (dist < minDist || dist > maxDist) {
      return { sx, sy, sizeMult: 1, brightMult: 1 };
    }

    // 爱因斯坦环半径 = sqrt(透镜强度)，在这附近产生最强烈扭曲
    const ringRadius = Math.sqrt(this.lensStrength) * 20;

    // 强度随距离衰减 — 在爱因斯坦环处最强
    const distRatio = dist / ringRadius;
    const lensForce = Math.exp(-Math.pow(distRatio - 1, 2) / 0.3) * 0.8
      + Math.exp(-Math.pow(distRatio, 2) / 0.8) * 0.3;

    // 偏移角度 — 产生切向扭曲（模拟旋转黑洞的 frame dragging）
    const twistAngle = Math.sin(dist / 30 + this.time * 0.3) * 0.15;

    // 径向位移：星体被向外推（形成环）
    const displacement = lensForce * this.lensStrength * 0.08;
    const dispFactor = displacement / Math.max(dist, 1);

    // 切向偏移
    const angle = Math.atan2(dy, dx) + twistAngle;

    // 新位置 = 沿径向向外 + 切向偏移
    const newDist = dist + displacement;
    const radialFactor = newDist / dist;
    let newSx = this.lensCx + dx * radialFactor;
    let newSy = this.lensCy + dy * radialFactor;

    // 再加一点切向扭曲
    newSx += Math.cos(angle + Math.PI / 2) * lensForce * 6;
    newSy += Math.sin(angle + Math.PI / 2) * lensForce * 6;

    // 放大倍数：环处最大
    const magnification = 1 + lensForce * 1.5;
    // 亮度增加
    const brightMult = 1 + lensForce * 1.2;

    return {
      sx: newSx,
      sy: newSy,
      sizeMult: magnification,
      brightMult,
    };
  }

  init(width: number, height: number, _dpr: number) {
    this.w = width;
    this.h = height;
    this.lensCx = width / 2;
    this.lensCy = height / 2;
    this.createStars();
    this.createNebula();
    this.createAurora();
    this.createMotes();
    this.createShootingStars();
  }

  resize(width: number, height: number) {
    this.w = width;
    this.h = height;
    this.lensCx = width / 2;
    this.lensCy = height / 2;
    this.createStars();
    this.createMotes();
  }

  // ═══════════════════════════════════════════════
  //  星星
  // ═══════════════════════════════════════════════

  private createStars() {
    this.stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const x = (Math.random() - 0.5) * 2.4;
      const y = (Math.random() - 0.5) * 2.4;
      const z = 0.5 + Math.random() * 3.5;
      this.stars.push({
        x, y, z,
        origX: x, origY: y, origZ: z,
        size: 0.3 + Math.random() * 2.0,
        brightness: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.3 + Math.random() * 2.5,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  private drawStars() {
    const ctx = this.ctx;
    const { w, h } = this;

    for (const star of this.stars) {
      const depth = 1 / star.z;
      const sx = w * 0.5 + star.x * w * 0.5 * depth;
      const sy = h * 0.5 + star.y * h * 0.5 * depth;

      if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) continue;

      // ─── 引力透镜 ───
      const lensed = this.applyLens(sx, sy, star.size * depth, star.brightness);

      const finalSx = lensed.sx;
      const finalSy = lensed.sy;
      const sizeMult = lensed.sizeMult;
      const brightMult = lensed.brightMult;

      // 裁剪超出屏幕的
      if (finalSx < -20 || finalSx > w + 20 || finalSy < -20 || finalSy > h + 20) continue;

      const twinkle = Math.sin(this.time * star.twinkleSpeed + star.twinklePhase) * 0.5 + 0.5;
      const alpha = star.brightness * (0.3 + twinkle * 0.7) * brightMult;
      const size = star.size * depth * sizeMult;

      // 小星星直接画点
      if (size < 0.6) {
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`;
        ctx.fillRect(finalSx, finalSy, 1, 1);
        continue;
      }

      // 大星星带色彩变化
      if (brightMult > 1.2 && size > 1.5) {
        // 透镜放大区 — 带暖色光晕
        ctx.fillStyle = `rgba(255, ${Math.round(230 + twinkle * 25)}, ${Math.round(200 - twinkle * 60)}, ${Math.min(1, alpha * 1.2)})`;
      } else if (star.brightness > 0.7 && size > 1.0) {
        const warm = Math.min(1, twinkle * 1.5);
        ctx.fillStyle = `rgba(255, ${Math.round(230 + warm * 25)}, ${Math.round(220 - warm * 50)}, ${alpha * 0.9})`;
      } else if (star.brightness < 0.4 && size > 1.0) {
        ctx.fillStyle = `rgba(200, ${Math.round(210 + twinkle * 30)}, 255, ${alpha * 0.8})`;
      } else {
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      }

      ctx.beginPath();
      ctx.arc(finalSx, finalSy, size, 0, Math.PI * 2);
      ctx.fill();

      // 辉光
      const glowSize = size * 5 * (brightMult > 1.2 ? brightMult : 1);
      if (size > 1.2 && alpha > 0.6) {
        const g = ctx.createRadialGradient(finalSx, finalSy, 0, finalSx, finalSy, glowSize);
        g.addColorStop(0, `rgba(255,255,255,${alpha * 0.25 * brightMult})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(finalSx, finalSy, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // 透镜高亮标记 — 环上星星额外光晕
      if (brightMult > 1.8) {
        const ringGlow = ctx.createRadialGradient(finalSx, finalSy, 0, finalSx, finalSy, size * 12);
        ringGlow.addColorStop(0, `rgba(200,220,255,${alpha * 0.15 * brightMult})`);
        ringGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = ringGlow;
        ctx.beginPath();
        ctx.arc(finalSx, finalSy, size * 12, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ═══════════════════════════════════════════════
  //  星云（动漫级高密度彩色云团）
  // ═══════════════════════════════════════════════

  private createNebula() {
    this.nebula = [];

    // 三层结构：
    // 1) 大背景晕（大面积低密度）
    // 2) 主色云团（中等大小，高密度）
    // 3) 点缀亮核（小面积，极高密度）

    const bgDefs = [
      { x: 0.5, y: 0.35, rx: 0.5, ry: 0.35, stops: [
        [0, 'rgba(120,60,220,0.20)'], [0.4, 'rgba(60,20,120,0.10)'], [1, 'transparent'],
      ]},
      { x: 0.2, y: 0.6, rx: 0.35, ry: 0.25, stops: [
        [0, 'rgba(200,80,160,0.18)'], [0.5, 'rgba(150,40,100,0.08)'], [1, 'transparent'],
      ]},
      { x: 0.8, y: 0.25, rx: 0.3, ry: 0.2, stops: [
        [0, 'rgba(160,100,220,0.15)'], [0.4, 'rgba(80,40,180,0.06)'], [1, 'transparent'],
      ]},
      { x: 0.35, y: 0.7, rx: 0.25, ry: 0.2, stops: [
        [0, 'rgba(100,180,255,0.12)'], [0.5, 'rgba(40,100,200,0.06)'], [1, 'transparent'],
      ]},
    ];

    const mainDefs = [
      { x: 0.45, y: 0.3, rx: 0.25, ry: 0.18, stops: [
        [0, 'rgba(140,80,255,0.35)'], [0.3, 'rgba(100,50,200,0.20)'], [0.6, 'rgba(60,20,140,0.08)'], [1, 'transparent'],
      ]},
      { x: 0.55, y: 0.4, rx: 0.2, ry: 0.15, stops: [
        [0, 'rgba(255,180,60,0.30)'], [0.3, 'rgba(220,130,30,0.18)'], [0.7, 'rgba(180,80,10,0.05)'], [1, 'transparent'],
      ]},
      { x: 0.35, y: 0.45, rx: 0.18, ry: 0.14, stops: [
        [0, 'rgba(60,220,160,0.28)'], [0.3, 'rgba(30,160,110,0.15)'], [0.6, 'rgba(10,100,70,0.06)'], [1, 'transparent'],
      ]},
      { x: 0.7, y: 0.35, rx: 0.2, ry: 0.14, stops: [
        [0, 'rgba(220,100,200,0.25)'], [0.3, 'rgba(180,60,150,0.12)'], [0.7, 'rgba(120,30,100,0.04)'], [1, 'transparent'],
      ]},
    ];

    const coreDefs = [
      { x: 0.5, y: 0.38, rx: 0.08, ry: 0.06, stops: [
        [0, 'rgba(200,160,255,0.50)'], [0.3, 'rgba(140,80,255,0.25)'], [0.7, 'rgba(80,40,200,0.08)'], [1, 'transparent'],
      ]},
      { x: 0.42, y: 0.33, rx: 0.05, ry: 0.04, stops: [
        [0, 'rgba(100,220,255,0.40)'], [0.5, 'rgba(60,160,220,0.15)'], [1, 'transparent'],
      ]},
    ];

    // 筛选随机位置
    const allDefs = [...bgDefs, ...mainDefs, ...coreDefs];

    for (const def of allDefs) {
      const offsetX = (Math.random() - 0.5) * 0.08;
      const offsetY = (Math.random() - 0.5) * 0.06;
      this.nebula.push({
        x: def.x + offsetX,
        y: def.y + offsetY,
        radiusX: def.rx * (0.85 + Math.random() * 0.3),
        radiusY: def.ry * (0.85 + Math.random() * 0.3),
        stops: def.stops.map(item => ({ pos: item[0] as number, color: String(item[1]) })),
        speedX: (Math.random() - 0.5) * 0.004,
        speedY: (Math.random() - 0.5) * 0.004,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.7 + Math.random() * 0.3,
      });
    }
  }

  private drawNebula() {
    const ctx = this.ctx;
    const { w, h } = this;

    for (const n of this.nebula) {
      // 漂移
      const x = (n.x + Math.sin(this.time * n.speedX + n.phase) * 0.02) * w;
      const y = (n.y + Math.cos(this.time * n.speedY + n.phase) * 0.02) * h;
      const rx = n.radiusX * w * (0.9 + Math.sin(this.time * 0.15 + n.phase) * 0.1);
      const ry = n.radiusY * h * (0.9 + Math.cos(this.time * 0.12 + n.phase) * 0.1);

      // ─── 星云引力透镜效果 ───
      let finalX = x;
      let finalY = y;
      if (this.lensActive && this.lensStrength > 0) {
        const dx = x - this.lensCx;
        const dy = y - this.lensCy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 20 && dist < this.lensStrength * 4) {
          const lensForce = Math.exp(-dist / (this.lensStrength * 1.5)) * 0.4;
          const displacement = lensForce * 60;
          const factor = (dist + displacement) / dist;
          finalX = this.lensCx + dx * factor;
          finalY = this.lensCy + dy * factor;
        }
      }

      // 使用多层径向渐变实现动漫风格云团
      const grad = ctx.createRadialGradient(finalX, finalY, 0, finalX, finalY, rx);
      for (const stop of n.stops) {
        grad.addColorStop(stop.pos, stop.color.replace(/[\d.]+\)$/, m => {
          const opacity = parseFloat(m.replace(')', ''));
          return `${opacity * n.opacity})`;
        }));
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(finalX, finalY, rx, 0, Math.PI * 2);
      ctx.fill();

      // 第二层细调
      if (n.stops.length >= 3 && parseFloat(n.stops[0].color.match(/[\d.]+$/)?.[0] || '0') > 0.2) {
        const coreGrad = ctx.createRadialGradient(finalX, finalY, 0, finalX, finalY, rx * 0.3);
        coreGrad.addColorStop(0, n.stops[0].color.replace(/[\d.]+\)$/, m => {
          const opacity = parseFloat(m.replace(')', ''));
          return `${opacity * 1.5 * n.opacity})`;
        }));
        coreGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(finalX, finalY, rx * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ═══════════════════════════════════════════════
  //  极光
  // ═══════════════════════════════════════════════

  private createAurora() {
    this.aurora = [];
    const colors = [
      { c: 'rgba(100,200,255,', o: 0.15 },
      { c: 'rgba(180,80,255,', o: 0.10 },
      { c: 'rgba(60,255,180,', o: 0.08 },
    ];
    for (const a of colors) {
      const pts: { x: number; y: number }[] = [];
      const count = 8;
      for (let i = 0; i <= count; i++) {
        pts.push({ x: i / count, y: 0.08 + Math.random() * 0.12 });
      }
      this.aurora.push({
        points: pts, color: a.c, opacity: a.o,
        speed: 0.2 + Math.random() * 0.3, phase: Math.random() * Math.PI * 2,
        width: 0.03 + Math.random() * 0.03,
      });
    }
  }

  private drawAurora() {
    const ctx = this.ctx;
    const { w, h } = this;

    for (const a of this.aurora) {
      const pts = a.points.map((p, i) => {
        const wave = Math.sin(this.time * a.speed + a.phase + i * 1.8) * 0.06;
        return {
          x: (p.x + wave) * w,
          y: p.y * h + Math.sin(this.time * a.speed * 0.6 + a.phase + i * 0.7) * 20,
        };
      });

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const xc = (pts[i].x + pts[i + 1].x) / 2;
        const yc = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y + h * a.width);
      ctx.lineTo(pts[0].x, pts[pts.length - 1].y + h * a.width);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, pts[0].y, 0, pts[0].y + h * a.width);
      grad.addColorStop(0, `${a.color}${a.opacity})`);
      grad.addColorStop(0.4, `${a.color}${a.opacity * 0.7})`);
      grad.addColorStop(1, `${a.color}0)`);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  // ═══════════════════════════════════════════════
  //  光尘
  // ═══════════════════════════════════════════════

  private createMotes() {
    this.motes = [];
    for (let i = 0; i < MOTE_COUNT; i++) {
      this.motes.push({
        x: Math.random(), y: Math.random(),
        size: 0.4 + Math.random() * 1.2,
        speedY: -(0.05 + Math.random() * 0.15),
        speedX: (Math.random() - 0.5) * 0.08,
        opacity: 0.03 + Math.random() * 0.10,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  private drawMotes() {
    const ctx = this.ctx;
    const { w, h } = this;

    for (const m of this.motes) {
      m.y += m.speedY * 0.01;
      m.x += m.speedX * 0.01 + Math.sin(this.time * 0.3 + m.phase) * 0.001;
      m.opacity = 0.03 + Math.abs(Math.sin(this.time * 0.2 + m.phase)) * 0.08;

      if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
      if (m.x < -0.02) m.x = 1.02;
      if (m.x > 1.02) m.x = -0.02;

      const px = m.x * w;
      const py = m.y * h;

      // ─── 光尘透镜 ───
      let finalPx = px;
      let finalPy = py;
      if (this.lensActive && this.lensStrength > 0) {
        const dx = px - this.lensCx;
        const dy = py - this.lensCy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 10 && dist < 300) {
          const lensForce = Math.exp(-dist / 150) * 0.5;
          finalPx = this.lensCx + dx * (1 + lensForce * 0.3);
          finalPy = this.lensCy + dy * (1 + lensForce * 0.3);
        }
      }

      ctx.fillStyle = `rgba(200, 180, 255, ${m.opacity})`;
      ctx.beginPath();
      ctx.arc(finalPx, finalPy, m.size, 0, Math.PI * 2);
      ctx.fill();

      if (m.size > 0.8) {
        ctx.fillStyle = `rgba(200, 180, 255, ${m.opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(finalPx, finalPy, m.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ═══════════════════════════════════════════════
  //  流星
  // ═══════════════════════════════════════════════

  private createShootingStars() {
    this.shootingStars = [];
    for (let i = 0; i < SHOOTING_STAR_COUNT; i++) {
      this.shootingStars.push({
        x: 0, y: 0, speed: 8, angle: 30, length: 100,
        life: 0, maxLife: 80, active: false, trail: [],
      });
    }
    this.lastShootingStarTime = -60;
  }

  private drawShootingStars() {
    const ctx = this.ctx;
    const { w, h } = this;

    for (const s of this.shootingStars) {
      if (!s.active) {
        if (this.time - this.lastShootingStarTime > 8 + Math.random() * 12) {
          s.active = true;
          s.life = 0;
          s.x = 0.2 + Math.random() * 0.3 * w;
          s.y = 0.02 + Math.random() * 0.12 * h;
          s.speed = 15 + Math.random() * 10;
          s.length = 120 + Math.random() * 80;
          s.angle = 20 + Math.random() * 30;
          s.trail = [];
          this.lastShootingStarTime = this.time;
        }
        continue;
      }

      s.life++;
      const rad = s.angle * Math.PI / 180;
      s.x += Math.cos(rad) * s.speed;
      s.y += Math.sin(rad) * s.speed;

      s.trail.push({ x: s.x, y: s.y });
      if (s.trail.length > 20) s.trail.shift();

      const progress = s.life / s.maxLife;
      const alpha = 1 - progress;

      // 拖尾
      if (s.trail.length > 1) {
        for (let i = 1; i < s.trail.length; i++) {
          const t = i / s.trail.length;
          const a = alpha * t * 0.5;
          const w2 = (i / s.trail.length) * 2.5;
          ctx.strokeStyle = `rgba(255,255,255,${a})`;
          ctx.lineWidth = w2;
          ctx.beginPath();
          ctx.moveTo(s.trail[i - 1].x, s.trail[i - 1].y);
          ctx.lineTo(s.trail[i].x, s.trail[i].y);
          ctx.stroke();
        }
      }

      // 流星头
      if (alpha > 0) {
        const hs = 2.5 * alpha;
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, hs * 8);
        g.addColorStop(0, `rgba(255,255,255,${alpha * 0.9})`);
        g.addColorStop(0.2, `rgba(200,220,255,${alpha * 0.5})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, hs * 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, hs, 0, Math.PI * 2);
        ctx.fill();
      }

      if (s.life > s.maxLife || s.x > w * 1.5 || s.y > h * 1.5) {
        s.active = false;
      }
    }
  }

  // ═══════════════════════════════════════════════
  //  晕影 / 色调映射
  // ═══════════════════════════════════════════════

  private drawVignette() {
    const ctx = this.ctx;
    const { w, h } = this;
    const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.1, w / 2, h / 2, h * 0.9);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(0.4, 'rgba(0,0,0,0)');
    g.addColorStop(0.7, 'rgba(10,5,25,0.12)');
    g.addColorStop(1, 'rgba(10,5,25,0.55)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  private drawAtmoGlow() {
    const ctx = this.ctx;
    const { w, h } = this;
    const g = ctx.createRadialGradient(w / 2, h * 1.1, 0, w / 2, h * 1.1, h * 0.7);
    g.addColorStop(0, 'rgba(40,20,80,0.06)');
    g.addColorStop(0.5, 'rgba(20,10,40,0.03)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  // ═══════════════════════════════════════════════
  //  主渲染循环
  // ═══════════════════════════════════════════════

  render(time: number) {
    const ctx = this.ctx;
    const { w, h } = this;

    // 背景
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.3, h * 1.3);
    bg.addColorStop(0, '#1a0a40');
    bg.addColorStop(0.25, '#10082e');
    bg.addColorStop(0.5, '#090420');
    bg.addColorStop(0.75, '#050210');
    bg.addColorStop(1, '#020108');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    this.time = time;

    this.drawNebula();
    this.drawAurora();
    this.drawStars();
    this.drawMotes();
    this.drawShootingStars();
    this.drawAtmoGlow();
    this.drawVignette();
  }
}
