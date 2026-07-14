/**
 * KnowledgeGraph — 知识图谱
 *
 * - 深色背景
 * - 圆点节点 + 连线 + 节点标签（title）
 * - 悬停高亮相连节点和边，其余变暗
 * - 悬停节点放大标签，点击进入详情页
 * - 滚轮缩放，拖拽平移，双击重置
 */
import { useEffect, useRef, useCallback } from 'react';
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

const RELATION_COLORS: Record<string, string> = {
  prerequisite: '#60a5fa',
  next: '#34d399',
  reference: '#a78bfa',
  summary_of: '#f472b6',
};

function getDomainColor(d: { domain?: string }): string {
  return DOMAIN_COLORS[d.domain || ''] || '#94a3b8';
}

export default function KnowledgeGraph({
  nodes, edges, width, height,
  selectedId, onNodeClick, focusOnSelect = false
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();

  const handleNodeClick = useCallback((id: string) => {
    if (onNodeClick) onNodeClick(id);
    else navigate(`/knowledge/${id}`);
  }, [navigate, onNodeClick]);

  const getConnected = useCallback((id: string): Set<string> => {
    const s = new Set<string>([id]);
    edges.forEach(e => {
      if (e.source === id) s.add(e.target);
      if (e.target === id) s.add(e.source);
    });
    return s;
  }, [edges]);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // ── 深色背景 ──
    svg.append('rect')
      .attr('width', width).attr('height', height)
      .attr('fill', '#0d1117');

    const g = svg.append('g');
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 5])
      .on('zoom', (e) => g.attr('transform', e.transform));
    svg.call(zoom);

    // ── 力导向布局 ──
    const simNodes: SimNode[] = nodes.map(n => ({ ...n }));
    const cx = width / 2, cy = height / 2;
    simNodes.forEach((n, i) => {
      const a = (2 * Math.PI * i) / Math.max(simNodes.length, 1);
      const r = Math.min(width, height) * 0.35;
      n.x = cx + r * Math.cos(a);
      n.y = cy + r * Math.sin(a);
    });

    const simulation = d3.forceSimulation(simNodes as any)
      .force('link', d3.forceLink(edges as any).id((d: any) => d.id)
        .distance((d: any) => d.type === 'summary_of' ? 60 : d.type === 'reference' ? 140 : 100)
        .strength(0.3))
      .force('charge', d3.forceManyBody().strength((d: any) => d.isMilestone ? -200 : -120))
      .force('center', d3.forceCenter(cx, cy))
      .force('collision', d3.forceCollide().radius((d: any) => 10 + (d.difficulty || 1) * 2))
      .alpha(0.08).alphaDecay(0.04);

    // ── 边 ──
    const link = g.append('g').selectAll('line').data(edges as any).join('line')
      .attr('stroke', (d: any) => RELATION_COLORS[d.type] || '#94a3b8')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', (d: any) => d.type === 'reference' ? '3,4' : 'none')
      .attr('opacity', 0.25);

    // ── 节点组 ──
    const nodeG = g.append('g').selectAll('g').data(simNodes as any).join('g')
      .style('cursor', 'pointer');

    const color = (d: any) => d.isMilestone ? '#ffd700' : getDomainColor(d);
    const radius = (d: any) => d.isMilestone ? 7 : 4 + (d.difficulty || 1) * 1.2;

    // 节点圆
    nodeG.append('circle')
      .attr('r', radius)
      .attr('fill', color)
      .attr('opacity', 0.85)
      .on('click', (event: any, d: any) => {
        event.stopPropagation();
        handleNodeClick(d.id);
        if (focusOnSelect) {
          const t = d3.zoomIdentity.translate(width / 2, height / 2).scale(1.5).translate(-d.x!, -d.y!);
          svg.transition().duration(500).call(zoom.transform, t);
        }
      })
      .on('mouseenter', function(this: any, _e: any, d: any) {
        const ids = getConnected(d.id);
        d3.select(this).transition().duration(150).attr('r', radius(d) + 3).attr('opacity', 1);
        nodeG.attr('opacity', (nd: any) => ids.has(nd.id) ? 1 : 0.12);
        link.attr('opacity', (ed: any) => {
          const sid = typeof ed.source === 'object' ? ed.source.id : ed.source;
          const tid = typeof ed.target === 'object' ? ed.target.id : ed.target;
          return ids.has(sid) && ids.has(tid) ? 0.7 : 0.03;
        });
      })
      .on('mouseleave', function(this: any, _e: any, d: any) {
        d3.select(this).transition().duration(200).attr('r', radius(d)).attr('opacity', 0.85);
        nodeG.attr('opacity', 0.85);
        link.attr('opacity', 0.25);
      });

    // ── 节点标签（title）—— SVG text 不支持 KaTeX，将 LaTeX 转为 Unicode 文本 ──
    const cleanLabel = (s: string) => s
      .replace(/\$\$([\s\S]*?)\$\$/g, (_, latex) => latex.replace(/\\[a-zA-Z]+/g, (m) => {
        const map: Record<string, string> = { '\\sin':'sin','\\alpha': 'α','\\beta': 'β', '\\gamma': 'γ', '\\delta': 'δ', '\\epsilon': 'ε', '\\zeta': 'ζ', '\\eta': 'η', '\\theta': 'θ', '\\iota': 'ι', '\\kappa': 'κ', '\\lambda': 'λ', '\\mu': 'μ', '\\nu': 'ν', '\\xi': 'ξ', '\\pi': 'π', '\\rho': 'ρ', '\\sigma': 'σ', '\\tau': 'τ', '\\upsilon': 'υ', '\\varphi':'φ', '\\phi': 'φ', '\\chi': 'χ', '\\psi': 'ψ', '\\omega': 'ω', '\\Gamma': 'Γ', '\\Delta': 'Δ', '\\Theta': 'Θ', '\\Lambda': 'Λ', '\\Xi': 'Ξ', '\\Pi': 'Π', '\\Sigma': 'Σ', '\\Upsilon': 'Υ', '\\Phi': 'Φ', '\\Psi': 'Ψ', '\\Omega': 'Ω' };
        return map[m] || m;
      }))
      .replace(/\$([^$]+)\$/g, (_, latex) => latex.replace(/\\[a-zA-Z]+/g, (m) => {
        const map: Record<string, string> = { '\\sin':'sin','\\alpha': 'α','\\beta': 'β', '\\gamma': 'γ', '\\delta': 'δ', '\\epsilon': 'ε', '\\zeta': 'ζ', '\\eta': 'η', '\\theta': 'θ', '\\iota': 'ι', '\\kappa': 'κ', '\\lambda': 'λ', '\\mu': 'μ', '\\nu': 'ν', '\\xi': 'ξ', '\\pi': 'π', '\\rho': 'ρ', '\\sigma': 'σ', '\\tau': 'τ', '\\upsilon': 'υ', '\\varphi':'φ', '\\phi': 'φ', '\\chi': 'χ', '\\psi': 'ψ','\\omega': 'ω', '\\Gamma': 'Γ', '\\Delta': 'Δ', '\\Theta': 'Θ', '\\Lambda': 'Λ', '\\Xi': 'Ξ', '\\Pi': 'Π', '\\Sigma': 'Σ', '\\Upsilon': 'Υ', '\\Phi': 'Φ', '\\Psi': 'Ψ', '\\Omega': 'Ω' };
        return map[m] || m;
      }));

    const label = nodeG.append('text')
      .text((d: any) => cleanLabel(d.label || ''))
      .attr('font-size', 10)
      .attr('fill', '#cbd5e1')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => -(radius(d) + 4))
      .attr('opacity', 0.9)
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // ── tick ──
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => (d.source as any).x).attr('y1', (d: any) => (d.source as any).y)
        .attr('x2', (d: any) => (d.target as any).x).attr('y2', (d: any) => (d.target as any).y);
      nodeG.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // 双击重置
    svg.on('dblclick.zoomReset', () => {
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    });

    return () => { simulation.stop(); };
  }, [nodes, edges, width, height, handleNodeClick, getConnected, focusOnSelect]);

  return (
    <svg ref={svgRef} width={width} height={height}
      style={{ display: 'block', background: '#0d1117' }} />
  );
}
