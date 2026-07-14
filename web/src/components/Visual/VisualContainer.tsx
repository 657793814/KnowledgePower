import React from 'react';
import type { VisualConfig } from '@/types';
import NumberLine from './number-line/NumberLine';
import ComplexPlane, { ComplexPlaneDraggable } from './complex-plane/ComplexPlane';
import FunctionTransform from './function-transform/FunctionTransform';
import GeometryVisual from './geometry-visual/GeometryVisual';
import SequenceVisual from './sequence-visual/SequenceVisual';
import TrigCircle from './trig-circle/TrigCircle';
import ForceDiagram from './force-diagram/ForceDiagram';
import MoleculeView from './molecule-view/MoleculeView';
import OpticsDemo from './optics-demo/OpticsDemo';

interface Props {
  visualType?: string;
  visualConfig?: VisualConfig | VisualConfig[];
}

/**
 * 互动演示注册表 — 根据 component 名称动态渲染对应的 Canvas 演示组件
 */
const visualRegistry: Record<string, React.FC<any>> = {
  'number-line': NumberLine,
  'complex-plane': ComplexPlane,
  'complex-rotation': ComplexPlane,      // 复用 ComplexPlane（step 模式）
  'complex-plane-draggable': ComplexPlaneDraggable,
  'function-transform': FunctionTransform,
  'geometry-visual': GeometryVisual,
  'sequence-visual': SequenceVisual,
  'trig-circle': TrigCircle,
  'force-diagram': ForceDiagram,
  'molecule-view': MoleculeView,
  'optics-demo': OpticsDemo,
};

/** 互动演示容器 — 根据配置自动选择对应演示组件 */
export default function VisualContainer({ visualType, visualConfig }: Props) {
  if (!visualType || visualType === 'static') {
    return null;
  }

  const configs = visualConfig
    ? (Array.isArray(visualConfig) ? visualConfig : [visualConfig])
    : [];

  if (configs.length === 0) {
    return null;
  }

  return (
    <div className="detail-section">
      <h3>🎨 互动演示</h3>
      <div className="visual-area">
        {configs.map((cfg, i) => {
          const Component = visualRegistry[cfg.component];
          return Component ? (
            <div key={i} style={{ width: '100%', marginBottom: 16 }}>
              <Component {...cfg.config} />
            </div>
          ) : (
            <div key={i} style={{ padding: 40, color: '#94a3b8', textAlign: 'center' }}>
              <p style={{ fontSize: 16 }}>演示组件「{cfg.component}」待开发</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
