/* ------------------------------------------------------------------ */
/*   PathOptimization — 共享类型定义                                     */
/* ------------------------------------------------------------------ */

export interface Point {
  x: number;
  y: number;
}

export type ScenarioId =
  | '1'  // 基础型（两定一线）
  | '2'  // 两动点型
  | '3'  // 一定两动
  | '4'  // 三角形周长最小
  | '5'  // 四边形周长最小
  | '6'  // 造桥选址
  | '7'  // 台球反射
  | '8'  // 线段差最大值
  | '9'  // 系数加权 PA + k·PB
  | '10' // 三角形内点最值
  | '11' // 圆上动点
  | '12' // 折线路径
  | '13'; // 综合型

export const SCENARIO_LABELS: Record<ScenarioId, string> = {
  '1': '基础型 — 两定一线',
  '2': '两动点型 — 两条线上动点',
  '3': '一定两动 — 一定点两动点',
  '4': '三角形周长最小',
  '5': '四边形周长最小',
  '6': '造桥选址',
  '7': '台球反射',
  '8': '线段差最大值',
  '9': '系数加权 PA+k·PB',
  '10': '三角形内点最值',
  '11': '圆上动点',
  '12': '折线路径',
  '13': '综合型',
};

export interface ThemeColors {
  bg: string;
  fg: string;
  grid: string;
  line: string;
  road: string;
  accent: string;   // 橙色主色调
  accentLight: string;
  blue: string;
  green: string;
  orange: string;
  purple: string;
  pink: string;
  red: string;
  gray: string;
  dim: string;
  label: string;
  surface: string;
  hover: string;
  infoBg: string;
  infoText: string;
}
