import { useParams, useNavigate, Link } from 'react-router-dom';
import { Spin, Tag, Button, Divider, Collapse } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, BranchesOutlined, AimOutlined } from '@ant-design/icons';
import { useKnowledgeDetail } from '@/hooks/useGraphData';
import { VisualContainer, AnimationContainer, ModelImage, ModelVideo } from '@/components';
import { NODE_ANIMATION_MAP } from '@/components/Animation/AnimationContainer';
import { DOMAIN_COLORS, LEVEL_COLORS, SUBJECT_LABELS } from '@/types';
import AiChatPanel from '@/components/ai/AiChatPanel';
import { useEffect, useState } from 'react';
import { renderFormula } from '@/utils/renderFormula';
import { fetchModelTrainQuestions } from '@/api/exam';
import type { ExamQuestionVO } from '@/types';
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

/** 在每个 section 底部渲染嵌入的图片/视频 */
function renderSectionMedia(section: any): React.ReactNode {
  return (
    <>
      {section.images?.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <ModelImage images={section.images} />
        </div>
      )}
      {section.video && (
        <div style={{ marginTop: 12 }}>
          <ModelVideo video={section.video} />
        </div>
      )}
    </>
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

    case 'animation':
      return (
        <div className="detail-section" key={index}>
          <h3>{'🎬 ' + (section.title || '动画演示')}</h3>
          {section.content && (
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#64748b', marginBottom: 12, whiteSpace: 'pre-line' }}
              dangerouslySetInnerHTML={{ __html: renderFormula(section.content) }} />
          )}
          <AnimationContainer
            type={section.animation}
            {...(section.config || {})}
          />
        </div>
      );

    case 'keypoints':
      return (
        <div className="detail-section" key={index}>
          <h3>{section.title || '📋 核心要点'}</h3>
          <ul style={{ paddingLeft: 20, lineHeight: 2.2 }}>
            {section.items?.map((item: string, i: number) => {
              const linkMatch = item.match(/\[([^\]]+)\]\(([^)]+)\)/);
              if (linkMatch) {
                const [, label, nodeId] = linkMatch;
                return (
                  <li key={i} style={{ fontSize: 14, color: '#374151' }}>
                    <Link to={`/knowledge/${nodeId}`} style={{ color: '#6366f1', textDecoration: 'none' }}>
                      {label}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={i} style={{ fontSize: 14, color: '#374151' }}>
                  {item}
                </li>
              );
            })}
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

    case 'derivation':
      return (
        <div className="detail-section" key={index} style={{ background: '#fefce8' }}>
          <h3 style={{ color: '#d97706' }}>{'📐 ' + (section.title || '推导证明')}</h3>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151' }}
            dangerouslySetInnerHTML={{ __html: renderFormula(section.content || '') }} />
          {section.steps?.length > 0 && (
            <div style={{ counterReset: 'step' }}>
              {section.steps.map((step: string, i: number) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, marginBottom: 8,
                  padding: '8px 12px', background: '#fefce8', borderRadius: 6,
                  borderLeft: '3px solid #d97706'
                }}>
                  <span style={{
                    background: '#d97706', color: '#fff', borderRadius: '50%',
                    width: 24, height: 24, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 14, lineHeight: 1.6, color: '#92400e', paddingTop: 2 }}
                    dangerouslySetInnerHTML={{ __html: renderFormula(step) }} />
                </div>
              ))}
            </div>
          )}
          {section.formulas?.length > 0 && section.formulas.map((f: string, i: number) => (
            <div key={i} style={{
              background: '#fff8e1', padding: '8px 14px', borderRadius: 6,
              marginTop: 6, textAlign: 'center', fontStyle: 'italic'
            }}
              dangerouslySetInnerHTML={{ __html: renderFormula(f) }} />
          ))}
          {section.result && (
            <div style={{
              marginTop: 12, padding: '10px 14px', background: '#f0fdf4',
              borderRadius: 6, border: '1px solid #86efac', textAlign: 'center'
            }}>
              <strong style={{ color: '#16a34a' }}>结论：</strong>
              <span dangerouslySetInnerHTML={{ __html: renderFormula(section.result) }} />
            </div>
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

    case 'extended-thinking':
      return (
        <div className="detail-section" key={index} style={{ background: '#f0f9ff' }}>
          <h3 style={{ color: '#0369a1' }}>{'🧩 ' + (section.title || '思维拓展')}</h3>
          {section.items?.length > 0 && (
            <div>
              {section.items.map((item: any, i: number) => (
                <div key={i} style={{
                  marginBottom: 10,
                  padding: '12px 14px',
                  background: '#fff',
                  borderRadius: 8,
                  border: '1px solid #bae6fd',
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: '#0c4a6e',
                }}>
                  <span style={{ color: '#0284c7', marginRight: 6 }}>✦</span>
                  <span dangerouslySetInnerHTML={{ __html: renderFormula(item.content || item) }} />
                </div>
              ))}
            </div>
          )}
          {section.content && (
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#0c4a6e', whiteSpace: 'pre-line' }}
              dangerouslySetInnerHTML={{ __html: renderFormula(section.content) }} />
          )}
        </div>
      );

    case 'history':
      return (
        <div className="detail-section" key={index} style={{ background: '#fffbeb' }}>
          <h3 style={{ color: '#b45309' }}>{'📜 ' + (section.title || '史话')}</h3>
          <div style={{
            fontSize: 14, lineHeight: 1.9, color: '#78350f', whiteSpace: 'pre-line',
            padding: '12px 16px', background: '#fff', borderRadius: 8,
            border: '1px solid #fde68a',
          }}
            dangerouslySetInnerHTML={{ __html: renderFormula(section.content) }} />
        </div>
      );

    case 'cross-domain':
      return (
        <div className="detail-section" key={index} style={{ background: '#ecfdf5' }}>
          <h3 style={{ color: '#0d9488' }}>{'🔗 ' + (section.title || '跨域链接')}</h3>
          {section.items?.length > 0 && (
            <div>
              {section.items.map((item: any, i: number) => (
                <div key={i} style={{
                  marginBottom: 10,
                  padding: '12px 14px',
                  background: '#fff',
                  borderRadius: 8,
                  border: '1px solid #a7f3d0',
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: '#134e4a',
                }}>
                  <span style={{ color: '#0d9488', marginRight: 6 }}>✦</span>
                  <span dangerouslySetInnerHTML={{ __html: renderFormula(item.content || item) }} />
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case 'model-intro':
      return (
        <div className="detail-section" key={index} style={{ background: '#f0f9ff' }}>
          <h3 style={{ color: '#0369a1' }}>{section.title || '🎯 模型定义'}</h3>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#0c4a6e' }}
            dangerouslySetInnerHTML={{ __html: renderFormula(section.content) }} />
          {section.formulas?.map((f: string, i: number) => (
            <FormulaBlock key={i} formula={f} />
          ))}
        </div>
      );

    case 'model-principle':
      return (
        <div className="detail-section" key={index} style={{ background: '#fefce8' }}>
          <h3 style={{ color: '#d97706' }}>{section.title || '⚙️ 核心原理'}</h3>
          <div style={{ fontSize: 14, lineHeight: 1.8, color: '#92400e' }}>
            {(section.content || '').split('\n').map((line: string, i: number) => (
              line.trim() ? <p key={i} style={{ marginBottom: 6 }} dangerouslySetInnerHTML={{ __html: renderFormula(line) }} /> : null
            ))}
          </div>
          {section.formulas?.map((f: string, i: number) => (
            <FormulaBlock key={i} formula={f} />
          ))}
        </div>
      );

    case 'recognition':
    case 'tips':
      return (
        <div className="detail-section" key={index} style={{ background: section.type === 'recognition' ? '#fdf4ff' : '#f0fdf4' }}>
          <h3 style={{ color: section.type === 'recognition' ? '#a21caf' : '#16a34a' }}>{section.title || '🔍 辨识特征'}</h3>
          <ul style={{ paddingLeft: 20, lineHeight: 2.4 }}>
            {section.items?.map((item: string, i: number) => (
              <li key={i} style={{ fontSize: 14, color: '#374151' }}
                dangerouslySetInnerHTML={{ __html: renderFormula(item) }} />
            ))}
          </ul>
        </div>
      );

    case 'standard-steps':
      return (
        <div className="detail-section" key={index} style={{ background: '#f8fafc' }}>
          <h3 style={{ color: '#1e40af' }}>{section.title || '📝 解题通法'}</h3>
          {section.items?.length > 0 && (
            <div style={{ counterReset: 'step' }}>
              {section.items.map((item: string, i: number) => {
                const colonIdx = item.indexOf('：');
                const label = colonIdx > 0 ? item.substring(0, colonIdx) : '';
                const desc = colonIdx > 0 ? item.substring(colonIdx + 1) : item;
                return (
                  <div key={i} style={{
                    display: 'flex', gap: 12, marginBottom: 8,
                    padding: '10px 14px', background: '#fff', borderRadius: 6,
                    borderLeft: '3px solid #3b82f6'
                  }}>
                    <span style={{
                      background: '#3b82f6', color: '#fff', borderRadius: '50%',
                      width: 24, height: 24, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0,
                      marginTop: 2,
                    }}>{i + 1}</span>
                    <div>
                      {label && <strong style={{ fontSize: 13 }}>{label}</strong>}
                      <span style={{ fontSize: 14, lineHeight: 1.6, color: '#1e293b', paddingTop: 2, marginLeft: label ? 6 : 0 }}
                        dangerouslySetInnerHTML={{ __html: renderFormula(desc) }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );

    case 'variant':
      return (
        <div className="detail-section" key={index}>
          <h3 style={{ color: '#7c3aed' }}>{'🔁 ' + (section.title || '变式拓展')}</h3>
          {section.items?.map((ex: any, i: number) => (
            <div key={i} className="practice-question" style={{ borderLeft: '3px solid #7c3aed', paddingLeft: 12, marginBottom: 12, background: '#faf5ff' }}>
              <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 14, color: '#4c1d95' }}
                dangerouslySetInnerHTML={{ __html: renderFormula(ex.question) }} />
              {ex.steps?.map((s: string, j: number) => (
                <div key={j} style={{ fontSize: 13, color: '#64748b', padding: '2px 0' }}
                  dangerouslySetInnerHTML={{ __html: renderFormula(s.startsWith('第') ? s : `第${j + 1}步：${s}`) }} />
              ))}
              {ex.answer && (
                <Tag color="purple" style={{ marginTop: 4 }}>答案：<span dangerouslySetInnerHTML={{ __html: renderFormula(ex.answer) }} /></Tag>
              )}
            </div>
          ))}
        </div>
      );

    case 'image':
      return (
        <div className="detail-section" key={index}>
          <h3>{section.title || '🖼️ 配图'}</h3>
          <ModelImage
            src={section.src}
            images={section.images}
            alt={section.alt}
            caption={section.caption}
          />
          {section.content && (
            <div style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', marginTop: 8 }}
              dangerouslySetInnerHTML={{ __html: renderFormula(section.content) }} />
          )}
        </div>
      );

    case 'video':
      return (
        <div className="detail-section" key={index}>
          <h3>{section.title || '🎬 视频'}</h3>
          <ModelVideo video={section.video || { url: section.src }} title={section.title} />
          {section.content && (
            <div style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', marginTop: 8 }}
              dangerouslySetInnerHTML={{ __html: renderFormula(section.content) }} />
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

  // ─── 模型题目 ───
  const [modelQuestions, setModelQuestions] = useState<ExamQuestionVO[]>([]);
  useEffect(() => {
    if (id && detail?.visualType === 'model') {
      fetchModelTrainQuestions(id, 50).then(setModelQuestions).catch(() => setModelQuestions([]));
    } else {
      setModelQuestions([]);
    }
  }, [id, detail?.visualType]);

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
          <Tag color={DOMAIN_COLORS[detail.domain]}>{SUBJECT_LABELS[detail.subject] || detail.subject} · {detail.domain}</Tag>
          <Tag color={detail.level === '初中' ? 'green' : 'orange'}>{detail.level}</Tag>
          {detail.milestoneType && <Tag color="purple">📌 {detail.milestoneType === 'domain_end' ? '领域总结' : '章节总结'}</Tag>}
          {detail.visualType === 'model' && (
            <Button type="primary" size="small" icon={<AimOutlined />} onClick={() => navigate(`/exam/model-train?nodeId=${detail.id}`)}>
              🎯 专题训练
            </Button>
          )}
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

      {/* 内容区块 — 每个 section 后自动渲染嵌入的图片/视频 */}
      {content?.sections?.map((section: any, i: number) => (
        <>
          <SectionRenderer section={section} index={i} />
          {renderSectionMedia(section)}
        </>
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

      {/* ─── 模型题目（题型模型的练习题） ─── */}
      {detail?.visualType === 'model' && modelQuestions.length > 0 && (
        <div className="detail-section" style={{ background: '#fffbeb' }}>
          <h3 style={{ color: '#d97706' }}>📝 模型练习题（{modelQuestions.length} 题）</h3>
          {modelQuestions.map((q) => {
            return (
            <div key={q.id} className="practice-question" style={{
              borderLeft: '3px solid #f59e0b', paddingLeft: 12, marginBottom: 12,
              padding: '10px 12px', background: 'rgba(255,255,255,0.6)', borderRadius: 8,
            }}>
              <div style={{ fontSize: 13, lineHeight: 1.8, color: '#374151' }}
                dangerouslySetInnerHTML={{ __html: renderFormula(q.title) }} />
              {q.options && (() => {
                try {
                  const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
                  if (typeof opts === 'object' && !Array.isArray(opts)) {
                    return Object.entries(opts).map(([k, v]) => (
                      <div key={k} style={{ fontSize: 12, color: '#4b5563', marginTop: 2 }}
                        dangerouslySetInnerHTML={{ __html: renderFormula(`${k}. ${v}`) }} />
                    ));
                  }
                  if (Array.isArray(opts)) {
                    return opts.map((o: string, i: number) => (
                      <div key={i} style={{ fontSize: 12, color: '#4b5563', marginTop: 2 }}
                        dangerouslySetInnerHTML={{ __html: renderFormula(o) }} />
                    ));
                  }
                } catch {}
                return null;
              })()}
              {/* 展开答案 */}
              <details style={{ marginTop: 4, cursor: 'pointer' }}>
                <summary style={{ color: '#999', fontSize: 11, userSelect: 'none' }}>
                  查看答案
                </summary>
                <div style={{ marginTop: 4 }}>
                  <Tag color="green" style={{ fontSize: 13, padding: '2px 8px', cursor: 'default' }}>
                    {q.answer}
                  </Tag>
                </div>
              </details>
            </div>
            );
          })}
        </div>
      )}

      {/* 动画演示（后备：如果知识点关联了动画，始终显示） */}
      {id && NODE_ANIMATION_MAP[id] && (
        <div className="detail-section" style={{ background: '#f0f9ff' }}>
          <h3 style={{ color: '#0369a1' }}>🎬 动画演示</h3>
          <AnimationContainer nodeId={id} />
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
