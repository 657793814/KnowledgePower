import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Tag, Button, Divider } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, BranchesOutlined } from '@ant-design/icons';
import { useKnowledgeDetail } from '@/hooks/useGraphData';
import { VisualContainer } from '@/components';
import { DOMAIN_COLORS, LEVEL_COLORS } from '@/types';
import AiChatPanel from '@/components/ai/AiChatPanel';
import { useEffect, useState } from 'react';
import { renderFormula } from '@/utils/renderFormula';
import './KnowledgeDetail.css';

function FormulaBlock({ formula }: { formula: string }) {
  return (
    <div style={{
      background: '#f3f0ff', padding: '12px 16px', borderRadius: 8,
      marginTop: 8, textAlign: 'center', overflowX: 'auto',
    }}
      dangerouslySetInnerHTML={{ __html: renderFormula(formula) }} />
  );
}

function SectionRenderer({ section, index }: { section: any; index: number }) {
  switch (section.type) {
    case 'definition':
      return (
        <div className="detail-section" key={index}>
          <h3>{section.title || '📖 核心定义'}</h3>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#374151' }}
            dangerouslySetInnerHTML={{ __html: renderFormula(section.content) }} />
          {section.formulas?.map((f: string, i: number) => (
            <FormulaBlock key={i} formula={f} />
          ))}
        </div>
      );

    case 'formula':
      return (
        <div className="detail-section" key={index} style={{ background: '#f8fafc' }}>
          <h3 style={{ color: '#1e40af' }}>{'📐 ' + (section.title || '公式与定理')}</h3>
          {section.formulas?.map((f: string, i: number) => (
            <FormulaBlock key={i} formula={f} />
          ))}
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', marginTop: 8 }}
            dangerouslySetInnerHTML={{ __html: renderFormula(section.content || '') }} />
        </div>
      );

    case 'visualization':
      return (
        <div className="detail-section" key={index}>
          <h3>{section.title || '🎨 直观理解'}</h3>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#64748b', whiteSpace: 'pre-line' }}
            dangerouslySetInnerHTML={{ __html: renderFormula(section.content) }} />
          {section.visual && (
            <VisualContainer
              visualType={section.visual.type}
              visualConfig={section.visual}
            />
          )}
        </div>
      );

    case 'keypoints':
      return (
        <div className="detail-section" key={index}>
          <h3>{section.title || '📋 核心要点'}</h3>
          <ul style={{ paddingLeft: 20, lineHeight: 2.2 }}>
            {section.items?.map((item: string, i: number) => (
              <li key={i} style={{ fontSize: 14, color: '#374151' }}
                dangerouslySetInnerHTML={{ __html: renderFormula(item) }} />
            ))}
          </ul>
        </div>
      );

    case 'example':
      return (
        <div className="detail-section" key={index}>
          <h3>{'✏️ ' + (section.title || '典型例题')}</h3>
          {section.items?.map((ex: any, i: number) => (
            <div key={i} className="practice-question" style={{ borderLeft: '3px solid #3B82F6', paddingLeft: 12, marginBottom: 12 }}>
              <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 14, color: '#1e293b' }}
                dangerouslySetInnerHTML={{ __html: renderFormula(ex.question) }} />
              {ex.hint && (
                <div style={{ background: '#f0f9ff', padding: '6px 10px', borderRadius: 4, marginBottom: 6, fontSize: 13, color: '#0369a1' }}>
                  💡 {ex.hint}
                </div>
              )}
              {ex.steps && (
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>
                  {ex.steps.map((s: string, j: number) => (
                    <div key={j} style={{ padding: '2px 0' }}
                      dangerouslySetInnerHTML={{ __html: renderFormula(s.startsWith('第') ? s : `第${j + 1}步：${s}`) }} />
                  ))}
                </div>
              )}
              <div>
                <Tag color="green">答案：<span dangerouslySetInnerHTML={{ __html: renderFormula(ex.answer) }} /></Tag>
                {ex.solution && <Tag color="blue" style={{ whiteSpace: 'pre-wrap' }}>{ex.solution}</Tag>}
              </div>
            </div>
          ))}
          {section.content && !section.items && (
            <>
              <p style={{ fontSize: 14, lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{ __html: renderFormula(section.content) }} />
              {section.solution && (
                <div style={{ background: '#f0fdf4', padding: '10px 16px', borderRadius: 8, marginTop: 8 }}>
                  <strong style={{ color: '#16a34a' }}>解答：</strong>
                  <span dangerouslySetInnerHTML={{ __html: renderFormula(section.solution) }} />
                </div>
              )}
            </>
          )}
        </div>
      );

    case 'exam-focus':
      return (
        <div className="detail-section" key={index} style={{ background: '#fff7ed' }}>
          <h3 style={{ color: '#c2410c' }}>{'🎯 ' + (section.title || '考点分析')}</h3>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#7c2d12', whiteSpace: 'pre-line' }}
            dangerouslySetInnerHTML={{ __html: renderFormula(section.content) }} />
          {section.items?.length > 0 && (
            <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
              {section.items.map((item: string, i: number) => (
                <li key={i} style={{ fontSize: 14, color: '#7c2d12' }}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      );

    case 'strategy':
      return (
        <div className="detail-section" key={index} style={{ background: '#f0fdf4' }}>
          <h3 style={{ color: '#16a34a' }}>{'💡 ' + (section.title || '解题思路')}</h3>
          {section.items?.length > 0 && (
            <div style={{ counterReset: 'step' }}>
              {section.items.map((item: string, i: number) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, marginBottom: 8,
                  padding: '8px 12px', background: '#f8fafc', borderRadius: 6,
                  borderLeft: '3px solid #22c55e'
                }}>
                  <span style={{
                    background: '#22c55e', color: '#fff', borderRadius: '50%',
                    width: 24, height: 24, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 14, lineHeight: 1.6, color: '#166534', paddingTop: 2 }}
                    dangerouslySetInnerHTML={{ __html: renderFormula(item) }} />
                </div>
              ))}
            </div>
          )}
          {section.content && (
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#166534', whiteSpace: 'pre-line' }}
              dangerouslySetInnerHTML={{ __html: renderFormula(section.content) }} />
          )}
        </div>
      );

    case 'common-mistakes':
      return (
        <div className="detail-section" key={index} style={{ background: '#fef2f2' }}>
          <h3 style={{ color: '#dc2626' }}>{'⚠️ ' + (section.title || '易错点辨析')}</h3>
          {section.items?.length > 0 && (
            <div>
              {section.items.map((item: string | { mistake: string; correct: string }, i: number) => (
                <div key={i} style={{
                  marginBottom: 10, padding: '10px 14px',
                  background: '#fff', borderRadius: 6,
                  border: '1px solid #fecaca'
                }}>
                  {typeof item === 'string' ? (
                    <span style={{ fontSize: 14 }} dangerouslySetInnerHTML={{ __html: renderFormula(item) }} />
                  ) : (
                    <>
                      <div style={{ fontSize: 14, color: '#dc2626', marginBottom: 4 }}>
                        ❌ 错误：<span dangerouslySetInnerHTML={{ __html: renderFormula(item.mistake) }} />
                      </div>
                      <div style={{ fontSize: 14, color: '#16a34a' }}>
                        ✅ 正确：<span dangerouslySetInnerHTML={{ __html: renderFormula(item.correct) }} />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case 'analogy':
      return (
        <div className="detail-section" key={index} style={{ background: '#fefce8' }}>
          <h3 style={{ color: '#d97706' }}>{'💡 ' + (section.title || '类比理解')}</h3>
          <p style={{ fontSize: 14, lineHeight: 2, color: '#92400e', whiteSpace: 'pre-line' }}
            dangerouslySetInnerHTML={{ __html: renderFormula(section.content) }} />
        </div>
      );

    case 'extended':
      return (
        <div className="detail-section" key={index} style={{ background: '#f5f3ff' }}>
          <h3 style={{ color: '#7c3aed' }}>{'🚀 ' + (section.title || '拓展延伸')}</h3>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#4c1d95', whiteSpace: 'pre-line' }}
            dangerouslySetInnerHTML={{ __html: renderFormula(section.content) }} />
          {section.items?.length > 0 && (
            <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
              {section.items.map((item: string, i: number) => (
                <li key={i} style={{ fontSize: 14, color: '#4c1d95' }}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      );

    default:
      return (
        <div className="detail-section" key={index}>
          <h3>{section.title || ''}</h3>
          <div style={{ fontSize: 14, lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: renderFormula(section.content || '') }} />
        </div>
      );
  }
}

export default function KnowledgeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { detail, loading } = useKnowledgeDetail(id!);

  // ⚠️ 必须放在所有条件渲染之前：React Hooks 不能条件调用
  const [showBackTop, setShowBackTop] = useState(false);
  useEffect(() => {
    const handler = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" tip="加载知识点..." />
      </div>
    );
  }

  if (!detail) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <p style={{ fontSize: 18, color: '#94a3b8' }}>知识点不存在</p>
        <Button onClick={() => navigate('/')} style={{ marginTop: 16 }}>返回图谱</Button>
      </div>
    );
  }

  const content = typeof detail.contentJson === 'string'
    ? JSON.parse(detail.contentJson)
    : detail.contentJson;

  return (
    <div className="detail-container">
      {/* 头部 */}
      <div style={{ marginBottom: 16 }}>
        <Button type="link" onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />} style={{ padding: 0, marginBottom: 8 }}>
          返回
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }} dangerouslySetInnerHTML={{ __html: renderFormula(detail.title) }} />
          <Tag color={DOMAIN_COLORS[detail.domain]}>{detail.domain}</Tag>
          <Tag color={detail.level === '初中' ? 'green' : 'orange'}>{detail.level}</Tag>
          {detail.milestoneType && <Tag color="purple">📌 {detail.milestoneType === 'domain_end' ? '领域总结' : '章节总结'}</Tag>}
        </div>
        {detail.subtitle && (
          <p style={{ fontSize: 16, color: '#64748b', margin: 0 }} dangerouslySetInnerHTML={{ __html: renderFormula(detail.subtitle) }} />
        )}
        {detail.summary && (
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 8, fontStyle: 'italic' }}>
            💡 <span dangerouslySetInnerHTML={{ __html: renderFormula(detail.summary) }} />
          </p>
        )}
        <div style={{ marginTop: 4, fontSize: 13, color: '#bbb' }}>
          难度：{'★'.repeat(detail.difficulty)}{'☆'.repeat(5 - detail.difficulty)}
        </div>
      </div>

      {/* 内容区块 */}
      {content?.sections?.map((section: any, i: number) => (
        <SectionRenderer key={i} section={section} index={i} />
      ))}

      <Divider />

      {/* 前置知识 */}
      {detail.prerequisites?.length > 0 && (
        <div className="detail-section" style={{ background: '#f0fdf4' }}>
          <h3 style={{ color: '#16a34a' }}>📖 前置知识 — 先理解这些</h3>
          <div>
            {detail.prerequisites.map((rel) => (
              <span key={rel.nodeId} className="relation-card" onClick={() => navigate(`/knowledge/${rel.nodeId}`)}>
                <span dangerouslySetInnerHTML={{ __html: renderFormula(rel.title) }} />
                <span className="relation-type-badge">前置</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 后继知识 */}
      {detail.nextNodes?.length > 0 && (
        <div className="detail-section" style={{ background: '#fef2f2' }}>
          <h3 style={{ color: '#dc2626' }}>🎯 后继知识 — 然后学这些</h3>
          <div>
            {detail.nextNodes.map((rel) => (
              <span key={rel.nodeId} className="relation-card" onClick={() => navigate(`/knowledge/${rel.nodeId}`)}>
                <span dangerouslySetInnerHTML={{ __html: renderFormula(rel.title) }} />
                <span className="relation-type-badge">后继</span>
                <ArrowRightOutlined style={{ fontSize: 10 }} />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 参考关联 */}
      {detail.references?.length > 0 && (
        <div className="detail-section" style={{ background: '#f5f3ff' }}>
          <h3 style={{ color: '#7c3aed' }}>🔗 相关知识点</h3>
          <div>
            {detail.references.map((rel) => (
              <span key={rel.nodeId} className="relation-card" onClick={() => navigate(`/knowledge/${rel.nodeId}`)}>
                <span dangerouslySetInnerHTML={{ __html: renderFormula(rel.title) }} />
                <span className="relation-type-badge">关联</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI 导师 */}
      <AiChatPanel nodeId={id!} nodeTitle={detail.title} />

      {/* 管理按钮 */}
      <div style={{ textAlign: 'center', padding: '16px 0 40px' }}>
        <Button type="dashed" icon={<BranchesOutlined />} onClick={() => navigate('/')}>
          查看知识图谱
        </Button>
        <Button type="link" style={{ marginLeft: 8 }} onClick={() => navigate(`/admin/knowledge/edit/${detail.id}`)}>
          编辑知识点
        </Button>
      </div>

      {/* 返回顶部 */}
      <div
        className={'back-to-top' + (showBackTop ? ' visible' : '')}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Button shape="circle" size="large" icon={<ArrowLeftOutlined style={{ transform: 'rotate(90deg)' }} />} />
      </div>
    </div>
  );
}
