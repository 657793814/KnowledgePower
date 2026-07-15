/**
 * AnimationContainer — 动画演示注册表与容器
 *
 * 根据知识点/题目类型自动选择对应的动画演示组件。
 * 动画比"互动演示"更进一步：它是时间驱动的、自动播放的step-by-step过程。
 *
 * VisualContainer → 用户交互驱动的演示（拖拽/点击/滑块）
 * AnimationContainer → 时间驱动的自动播放动画（自动播放解题过程）
 *
 * 在知识点详情页和练习结果页使用：
 * ```tsx
 * <AnimationContainer type="function-shift" />
 * <AnimationContainer questionId={123} />  // 自动匹配题目对应动画
 * ```
 */
import React from 'react';
import FunctionShift from './animations/FunctionShift';
import EquationSolve from './animations/EquationSolve';
import NumberExpansion from './animations/NumberExpansion';
import FreeFall from './animations/FreeFall';
import EquationBalance from './animations/EquationBalance';
import ComplexPlane from '@/components/Visual/complex-plane/ComplexPlane';

/** 动画组件注册表 */
export const animationRegistry: Record<string, React.FC<any>> = {
  'function-shift': FunctionShift,
  'equation-solve': EquationSolve,
  'number-expansion': NumberExpansion,
  'free-fall': FreeFall,
  'equation-balance': EquationBalance,
  'complex-rotation': ComplexPlane,
  'complex-plane-draggable': ComplexPlane,
};

/** 知识点→动画映射（哪些知识点可以触发哪个动画）
 * 导出供其他组件检查知识点是否有动画 */
export const NODE_ANIMATION_MAP: Record<string, string> = {
  // 数的世界
  'MATH-01-001': 'number-expansion',   // 自然数 → 数的扩张
  'MATH-01-002': 'number-expansion',   // 整数与负数
  'MATH-01-003': 'number-expansion',   // 有理数
  'MATH-01-004': 'number-expansion',   // 实数
  'MATH-01-005': 'complex-rotation',
  'MATH-01-005-01': 'complex-rotation',
  'MATH-01-005-03': 'complex-plane-draggable',
  'MATH-01-099': 'number-expansion',   // 数的世界总结

  // 式
  'MATH-02-002': 'equation-solve',     // 整式运算
  'MATH-02-003': 'equation-solve',     // 因式分解

  // 方程与不等式
  'MATH-03-001': 'equation-solve',     // 一元一次方程
  'MATH-03-002': 'equation-solve',     // 一元二次方程
  'MATH-03-003': 'equation-solve',     // 方程组
  'MATH-03-004': 'equation-solve',     // 方程组

  // 函数
  'MATH-04-004': 'function-shift',     // 二次函数 → 平移动画
  'MATH-04-005': 'function-shift',     // 函数的变换
};

/** 题目→动画映射（部分题目可以关联动画演示） */
const QUESTION_ANIMATION_MAP: Record<number, string> = {
  // 可以根据题目ID关联对应的动画演示
};

/** 学科→动画列表（用于动画演示大厅按学科筛选）
 * key: 学科 subjectKey, value: { type, label, desc, tags, nodes }[]
 */
export const SUBJECT_ANIMATIONS: Record<string, {
  key: string;
  label: string;
  icon: string;
  type: string;
  description: string;
  tags: string[];
  nodes?: string[];
}[]> = {
  math: [
    { key: 'number-expansion', label: '数的扩张', icon: '🔢', type: 'number-expansion',
      description: '从自然数到复数，5 次扩张完整 9 步动画',
      tags: ['数', 'N→Z→Q→R→C'],
      nodes: ['MATH-01-001', 'MATH-01-002', 'MATH-01-003', 'MATH-01-004', 'MATH-01-099'] },
    { key: 'function-shift', label: '函数平移', icon: '📈', type: 'function-shift',
      description: '二次函数 y=x² → y=(x-2)²+3 平移过程',
      tags: ['函数', '二次函数', '平移'],
      nodes: ['MATH-04-004', 'MATH-04-005'] },
    { key: 'equation-solve', label: '方程求解', icon: '📝', type: 'equation-solve',
      description: '一元二次方程 ax²+bx+c=0 的五步求解动画',
      tags: ['方程', '二次方程', '求根公式'],
      nodes: ['MATH-03-001', 'MATH-03-002', 'MATH-03-003', 'MATH-03-004'] },
    { key: 'complex-rotation', label: '复数旋转', icon: '🌀', type: 'complex-rotation',
      description: '复平面上的旋转演示 ×i = 旋转 90°',
      tags: ['复数', '旋转', '复平面'],
      nodes: ['MATH-01-005', 'MATH-01-005-01'] },
  ],
  physics: [
    { key: 'free-fall', label: '自由落体运动', icon: '🏋️', type: 'free-fall',
      description: '小球在重力作用下匀加速下落的完整过程',
      tags: ['力学', '匀加速', '能量守恒'],
      nodes: [] },
  ],
  chemistry: [
    { key: 'equation-balance', label: '化学方程式配平', icon: '🧪', type: 'equation-balance',
      description: 'H₂ + O₂ → H₂O 配平过程，展示质量守恒',
      tags: ['化学反应', '配平', '质量守恒'],
      nodes: [] },
  ],
};

interface Props {
  /** 动画类型名称（从注册表查找） */
  type?: string;
  /** 知识点 ID → 自动匹配对应动画 */
  nodeId?: string;
  /** 题目 ID → 自动匹配对应动画 */
  questionId?: number;
  [key: string]: any;
}

export default function AnimationContainer({ type, nodeId, questionId, ...rest }: Props) {
  // 优先级：type > questionId > nodeId
  let resolvedType = type;

  if (!resolvedType && questionId != null) {
    resolvedType = QUESTION_ANIMATION_MAP[questionId];
  }
  if (!resolvedType && nodeId) {
    resolvedType = NODE_ANIMATION_MAP[nodeId];
  }

  if (!resolvedType) {
    return null;
  }

  const Component = animationRegistry[resolvedType];

  if (!Component) {
    return (
      <div style={{
        padding: 40, color: '#94a3b8', textAlign: 'center',
        background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0',
      }}>
        <p style={{ fontSize: 16 }}>动画「{resolvedType}」待开发 🚧</p>
        <p style={{ fontSize: 13, marginTop: 4 }}>开发者可添加新的动画到 animationRegistry</p>
      </div>
    );
  }

  return (
    <div className="animation-container">
      <Component {...rest} />
    </div>
  );
}
