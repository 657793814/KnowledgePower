import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { fetchGraph } from '@/api';
import { KnowledgeGraph, GraphControls } from '@/components';
import type { GraphNodeVO, GraphEdgeVO, KnowledgeGraphVO } from '@/types';
import { useSubjectStore } from '@/store/subjectStore';

export default function GraphPage() {
  const { domain } = useParams();
  const navigate = useNavigate();
  const { currentSubject } = useSubjectStore();
  // 不用 store 存图数据 — 每次 mount 都是新的，避免旧数据残留
  const [graphData, setGraphData] = useState<KnowledgeGraphVO | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });

  // 加载图数据
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setGraphData(null);

    fetchGraph(currentSubject, domain)
      .then((data) => {
        if (!cancelled) {
          setGraphData(data);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [currentSubject, domain]);

  // 响应式尺寸
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleDomainChange = (d: string | null) => {
    if (d) {
      navigate(`/graph/${encodeURIComponent(d)}`);
    } else {
      navigate('/');
    }
  };

  const handleNodeClick = (id: string) => {
    navigate(`/knowledge/${id}`);
  };

  // 过滤（useMemo 避免每次渲染生成新数组，防止 D3 重初始化）
  const filteredNodes = useMemo<GraphNodeVO[]>(
    () => graphData?.nodes.filter(n => !currentLevel || n.level === currentLevel) || [],
    [graphData?.nodes, currentLevel]
  );

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  const filteredEdges = useMemo<GraphEdgeVO[]>(
    () => graphData?.edges.filter(e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)) || [],
    [graphData?.edges, filteredNodeIds]
  );

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <GraphControls
        currentDomain={domain || null}
        currentLevel={currentLevel}
        onDomainChange={handleDomainChange}
        onLevelChange={setCurrentLevel}
        totalNodeCount={graphData?.nodes.length || 0}
      />
      <div ref={containerRef} style={{ flex: 1, position: 'relative' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spin size="large" tip="加载图谱..." />
          </div>
        ) : filteredNodes.length > 0 ? (
          <KnowledgeGraph
            key={domain || '__full__'}
            nodes={filteredNodes}
            edges={filteredEdges}
            width={size.width}
            height={size.height}
            onNodeClick={handleNodeClick}
          />
        ) : (
          <div style={{ textAlign: 'center', paddingTop: 100, color: '#94a3b8' }}>
            <p style={{ fontSize: 18 }}>暂无知识点数据</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>请先确保数据库已初始化种子数据</p>
          </div>
        )}
      </div>
    </div>
  );
}
