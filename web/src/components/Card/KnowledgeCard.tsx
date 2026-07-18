import { useNavigate } from 'react-router-dom';
import { Tag } from 'antd';
import { DOMAIN_COLORS, SUBJECT_LABELS } from '@/types';
import type { KnowledgeNode } from '@/types';
import { renderFormula } from '@/utils/renderFormula';

interface Props {
  node: KnowledgeNode;
}

export default function KnowledgeCard({ node }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/knowledge/${node.id}`)}
      style={{
        background: '#fff',
        borderRadius: 10,
        padding: 16,
        cursor: 'pointer',
        border: '1px solid #f0f0f0',
        transition: 'all 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Tag color={DOMAIN_COLORS[node.domain] || '#94a3b8'} style={{ fontSize: 11, margin: 0 }}>
          {SUBJECT_LABELS[node.subject] || node.subject} · {node.domain}
        </Tag>
        <Tag color={node.level === '初中' ? 'green' : 'orange'} style={{ fontSize: 11, margin: 0 }}>
          {node.level}
        </Tag>
        {node.milestoneType && (
          <Tag color="purple" style={{ fontSize: 11, margin: 0 }}>📌 总结</Tag>
        )}
      </div>
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }} dangerouslySetInnerHTML={{ __html: renderFormula(node.title) }} />
      {node.subtitle && (
        <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }} dangerouslySetInnerHTML={{ __html: renderFormula(node.subtitle) }} />
      )}
      {node.summary && (
        <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: renderFormula(node.summary) }} />
      )}
      <div style={{ marginTop: 8, fontSize: 12, color: '#bbb' }}>
        {'★'.repeat(node.difficulty)}{'☆'.repeat(5 - node.difficulty)}
      </div>
    </div>
  );
}
