/**
 * KnowledgeGraph — 立体知识图谱
 *
 * - 领域色聚类（forceX/forceY 分簇布局）
 * - 渐变节点 + 外发光 + 阴影（立体感）
 * - 关系类型标签 on edges
 * - 悬停高亮：相连节点和边高亮，其余淡出
 * - 点击节点进入详情
 * - 滚轮缩放，拖拽平移，双击重置
 */
import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import type { GraphNodeVO, GraphEdgeVO } from '@/types';
import { DOMAIN_COLORS } from '@/types';

interface Props {
  nodes: GraphNodeVO[];
  edges: GraphEdgeVO[];
  width: number;
  height: number;
  selectedId?: string | null;
  onNodeClick?: (id: string) => void;
  focusOnSelect?: boolean;
}

interface SimNode extends GraphNodeVO {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface SimLink {
  source: string | SimNode;
  target: string | SimNode;
  index?: number;
  type: string;
  description?: string;
}

const RELATION_CONFIG: Record<string, { color: string; label: string; dash: string }> = {
  prerequisite: { color: '#60a5fa', label: '前置', dash: 'none' },
  next: { color: '#34d399', label: '后继', dash: 'none' },
  reference: { color: '#a78bfa', label: '关联', dash: '6,4' },
  summary_of: { color: '#f472b6', label: '总结', dash: '3,3' },
};

function getDomainColor(d: { domain?: string }): string {
  return DOMAIN_COLORS[d.domain || ''] || '#94a3b8';
}

/** 将 LaTeX 命令转为人类可读的纯文本（图谱标签用） */
function cleanLatex(s: string): string {
  if (!s) return '';
  const greek: Record<string, string> = {
    '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ', '\\delta': 'δ', '\\epsilon': 'ε',
    '\\zeta': 'ζ', '\\eta': 'η', '\\theta': 'θ', '\\iota': 'ι', '\\kappa': 'κ',
    '\\lambda': 'λ', '\\mu': 'μ', '\\nu': 'ν', '\\xi': 'ξ', '\\pi': 'π', '\\rho': 'ρ',
    '\\sigma': 'σ', '\\tau': 'τ', '\\upsilon': 'υ', '\\varphi': 'φ', '\\phi': 'φ',
    '\\chi': 'χ', '\\psi': 'ψ', '\\omega': 'ω',
    '\\Gamma': 'Γ', '\\Delta': 'Δ', '\\Theta': 'Θ', '\\Lambda': 'Λ', '\\Xi': 'Ξ',
    '\\Pi': 'Π', '\\Sigma': 'Σ', '\\Upsilon': 'Υ', '\\Phi': 'Φ', '\\Psi': 'Ψ', '\\Omega': 'Ω',
  };
  const funcs = ['\\sin', '\\cos', '\\tan', '\\log', '\\ln', '\\lim', '\\int', '\\sum', '\\prod'];
  return s
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(/\$([^$]+?)\$/g, (_, inner) => {
      let t = inner;
      funcs.forEach(f => { t = t.replaceAll(f, f.slice(1)); });
      Object.entries(greek).forEach(([k, v]) => { t = t.replaceAll(k, v); });
      t = t.replace(/\\([a-zA-Z]+)/g, '');
      t = t.replace(/[{}^_]/g, '');
      return t;
    })
    .replace(/[{}^_~$]/g, '')
    .trim() || s;
}

/**
 * 生成 SVG 径向渐变 defs
 */
function createGradients(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, colors: Map<string, string>) {
  const defs = svg.select('defs').empty()
    ? svg.append('defs')
    : svg.select('defs');

  colors.forEach((color, id) => {
    const grad = defs.append('radialGradient')
      .attr('id', `node-grad-${id}`)
      .attr('cx', '35%').attr('cy', '35%').attr('r', '65%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#ffffff').attr('stop-opacity', 0.5);
    grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 1);
  });

  // Glow filter
  defs.append('filter')
    .attr('id', 'node-glow')
    .attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%')
    .append('feDropShadow')
    .attr('dx', 0).attr('dy', 0).attr('stdDeviation', 3).attr('flood-color', 'currentColor').attr('flood-opacity', 0.45);

  // Shadow filter
  defs.append('filter')
    .attr('id', 'node-shadow')
    .attr('x', '-30%').attr('y', '-30%').attr('width', '160%').attr('height', '160%')
    .append('feDropShadow')
    .attr('dx', 1).attr('dy', 2).attr('stdDeviation', 2).attr('flood-color', '#000').attr('flood-opacity', 0.3);
}

export default function KnowledgeGraph({
  nodes, edges, width, height,
  selectedId, onNodeClick, focusOnSelect = false,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();
  // 稳定引用避免 useCallback 变化触发 effect
  const onNodeClickRef = useRef(onNodeClick);
  onNodeClickRef.current = onNodeClick;
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const handleNodeClick = useCallback((id: string) => {
    if (onNodeClickRef.current) onNodeClickRef.current(id);
    else navigateRef.current(`/knowledge/${id}`);
  }, []);

  const getConnected = useCallback((id: string): Set<string> => {
    const s = new Set<string>([id]);
    edges.forEach(e => {
      if (e.source === id) s.add(e.target);
      if (e.target === id) s.add(e.source);
    });
    return s;
  }, [edges]);

  // 领域聚类位置映射
  const domainClusters = useMemo(() => {
    const domains = [...new Set(nodes.map(n => n.domain).filter(Boolean))];
    const map = new Map<string, { x: number; y: number }>();
    const cols = Math.min(domains.length, 4);
    const cellW = width / cols;
    const cellH = height / Math.ceil(domains.length / cols);
    domains.forEach((d, i) => {
      map.set(d!, {
        x: cellW * (0.3 + (i % cols) * 1.0),
        y: cellH * (0.3 + Math.floor(i / cols) * 0.7),
      });
    });
    return map;
  }, [nodes, width, height]);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // ── 背景（带微网格）──
    const bg = svg.append('rect')
      .attr('width', width).attr('height', height)
      .attr('fill', '#0d1117');

    // 微网格
    const grid = svg.append('pattern')
      .attr('id', 'graph-grid').attr('width', 30).attr('height', 30)
      .attr('patternUnits', 'userSpaceOnUse');
    grid.append('path')
      .attr('d', 'M 30 0 L 0 0 0 30')
      .attr('fill', 'none').attr('stroke', '#1a2332').attr('stroke-width', 0.5);
    bg.attr('fill', 'url(#graph-grid)').attr('fill', '#0d1117');
    // 恢复背景色，网格用 overlay
    svg.select('pattern + rect')
      .attr('fill', '#0d1117');
    svg.insert('rect', 'g')
      .attr('width', width).attr('height', height)
      .attr('fill', 'url(#graph-grid)').attr('opacity', 0.3);

    const g = svg.append('g');
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.12, 6])
      .on('zoom', (e) => g.attr('transform', e.transform));
    svg.call(zoom);

    // ── 准备节点数据 ──
    const simNodes: SimNode[] = nodes.map(n => ({ ...n }));
    const links: SimLink[] = edges.map(e => ({ ...e }));

    // 按领域聚类初始位置
    const cx = width / 2, cy = height / 2;
    simNodes.forEach(n => {
      const cluster = n.domain ? domainClusters.get(n.domain) : null;
      if (cluster) {
        n.x = cluster.x + (Math.random() - 0.5) * 80;
        n.y = cluster.y + (Math.random() - 0.5) * 80;
      } else {
        n.x = cx + (Math.random() - 0.5) * width * 0.3;
        n.y = cy + (Math.random() - 0.5) * height * 0.3;
      }
    });

    // 收集所有节点颜色用于渐变
    const colorMap = new Map<string, string>();
    simNodes.forEach(n => {
      const c = n.isMilestone ? '#ffd700' : getDomainColor(n);
      colorMap.set(n.id, c);
    });
    createGradients(svg, colorMap);

    // ── 仿真 ──
    const simulation = d3.forceSimulation<SimNode>(simNodes)
      .force('link', d3.forceLink<SimNode, SimLink>(links)
        .id(d => d.id)
        .distance(d => {
          if (d.type === 'summary_of') return 50;
          if (d.type === 'reference') return 120;
          return 90;
        })
        .strength(d => {
          if (d.type === 'summary_of') return 0.3;
          if (d.type === 'reference') return 0.05;
          return 0.2;
        }))
      .force('charge', d3.forceManyBody().strength(d => (d as SimNode).isMilestone ? -400 : -280))
      .force('center', d3.forceCenter(cx, cy).strength(0.02))
      .force('collision', d3.forceCollide<SimNode>().radius(d => d.isMilestone ? 40 : 28))
      // 领域聚类力
      .force('cluster', (alpha: number) => {
        simNodes.forEach(n => {
          if (!n.domain) return;
          const c = domainClusters.get(n.domain);
          if (!c) return;
          n.vx = (n.vx || 0) + (c.x - (n.x || cx)) * 0.005 * alpha;
          n.vy = (n.vy || 0) + (c.y - (n.y || cy)) * 0.005 * alpha;
        });
      })
      .alpha(0.6)
      .alphaDecay(0.02)
      .alphaMin(0.001);

    // ── 边 ──
    const linkG = g.append('g').attr('class', 'links');

    const link = linkG.selectAll('line').data(links).join('line')
      .attr('stroke', d => RELATION_CONFIG[d.type]?.color || '#94a3b8')
      .attr('stroke-width', 0.8)
      .attr('stroke-dasharray', d => RELATION_CONFIG[d.type]?.dash || 'none')
      .attr('opacity', 0.25);

    // 边标签
    const linkLabel = linkG.selectAll('text').data(links).join('text')
      .text(d => RELATION_CONFIG[d.type]?.label || d.type)
      .attr('font-size', 9).attr('fill', '#4a5a6e')
      .attr('text-anchor', 'middle').attr('dy', -5)
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // ── 节点 ──
    const nodeG = g.append('g').attr('class', 'nodes');

    const nodeRadius = (d: SimNode) => d.isMilestone ? 8 : 5;
    const nodeColor = (d: SimNode) => d.isMilestone ? '#ffd700' : getDomainColor(d);

    const nodeGroup = nodeG.selectAll('g').data(simNodes).join('g')
      .style('cursor', 'pointer');

    // 外圈光晕（立体感）
    nodeGroup.append('circle')
      .attr('class', 'glow')
      .attr('r', d => nodeRadius(d) + 6)
      .attr('fill', 'none')
      .attr('stroke', d => nodeColor(d))
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.15)
      .style('pointer-events', 'none');

    // 主节点（渐变填充，有厚度感）
    nodeGroup.append('circle')
      .attr('class', 'node-circle')
      .attr('r', nodeRadius)
      .attr('fill', d => `url(#node-grad-${d.id})`)
      .attr('stroke', d => nodeColor(d))
      .attr('stroke-width', 1.5)
      .style('filter', 'url(#node-shadow)')
      .style('transition', 'stroke-width 0.15s, r 0.15s');

    // milestone 特殊标记：星形 highlight 圈
    nodeGroup.filter(d => d.isMilestone)
      .append('circle')
      .attr('r', d => nodeRadius(d) + 4)
      .attr('fill', 'none')
      .attr('stroke', '#ffd700')
      .attr('stroke-width', 2)
      .attr('opacity', 0.5)
      .attr('stroke-dasharray', '3,3')
      .style('pointer-events', 'none');

    // 节点标签
    nodeGroup.append('text')
      .text(d => cleanLatex(d.label || ''))
      .attr('font-size', 11)
      .attr('fill', '#94a3b8')
      .attr('text-anchor', 'middle')
      .attr('dy', d => nodeRadius(d) + 16)
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // ── 交互 ──
    nodeGroup
      .on('click', (event: any, d: SimNode) => {
        event.stopPropagation();
        handleNodeClick(d.id);
        // 点击聚焦
        const t = d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(1.8)
          .translate(-(d.x || cx), -(d.y || cy));
        svg.transition().duration(400).call(zoom.transform, t);
      })
      .on('mouseenter', function (this: any, _e: any, d: SimNode) {
        const ids = getConnected(d.id);
        const r = nodeRadius(d);
        // 节点放大 + 发光
        d3.select(this).select('.node-circle')
          .transition().duration(120)
          .attr('r', r + 3)
          .attr('stroke-width', 2.5)
          .style('filter', 'url(#node-glow)');
        d3.select(this).select('.glow')
          .transition().duration(120)
          .attr('opacity', 0.4)
          .attr('r', r + 9);

        nodeGroup.attr('opacity', nd => ids.has(nd.id) ? 1 : 0.12);
        link.attr('opacity', ed => {
          const sid = typeof ed.source === 'object' ? (ed.source as SimNode).id : ed.source;
          const tid = typeof ed.target === 'object' ? (ed.target as SimNode).id : ed.target;
          return ids.has(sid) && ids.has(tid) ? 0.75 : 0.03;
        });
        linkLabel.attr('opacity', ed => {
          const sid = typeof ed.source === 'object' ? (ed.source as SimNode).id : ed.source;
          const tid = typeof ed.target === 'object' ? (ed.target as SimNode).id : ed.target;
          return ids.has(sid) && ids.has(tid) ? 0.8 : 0.03;
        });
      })
      .on('mouseleave', function (this: any, _e: any, d: SimNode) {
        const r = nodeRadius(d);
        d3.select(this).select('.node-circle')
          .transition().duration(180)
          .attr('r', r)
          .attr('stroke-width', 1.5)
          .style('filter', 'url(#node-shadow)');
        d3.select(this).select('.glow')
          .transition().duration(180)
          .attr('opacity', 0.15)
          .attr('r', r + 6);

        nodeGroup.attr('opacity', 1);
        link.attr('opacity', 0.25);
        linkLabel.attr('opacity', 1);
      });

    // ── 仿真 tick ──
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as SimNode).x!)
        .attr('y1', d => (d.source as SimNode).y!)
        .attr('x2', d => (d.target as SimNode).x!)
        .attr('y2', d => (d.target as SimNode).y!);

      linkLabel
        .attr('x', d => ((d.source as SimNode).x! + (d.target as SimNode).x!) / 2)
        .attr('y', d => ((d.source as SimNode).y! + (d.target as SimNode).y!) / 2);

      nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // ── 双击重置 ──
    svg.on('dblclick.zoomReset', () => {
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    });

    // ⭐ 如果有 selectedId，自动聚焦
    if (selectedId) {
      const target = simNodes.find(n => n.id === selectedId);
      if (target && target.x != null && target.y != null) {
        const t = d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(1.8)
          .translate(-target.x, -target.y);
        svg.transition().duration(600).call(zoom.transform, t);
      }
    }

    return () => { simulation.stop(); };
  }, [nodes, edges, width, height, handleNodeClick, getConnected, domainClusters, selectedId, focusOnSelect]);

  return (
    <svg ref={svgRef} width={width} height={height}
      style={{ display: 'block', background: '#0d1117' }} />
  );
}
