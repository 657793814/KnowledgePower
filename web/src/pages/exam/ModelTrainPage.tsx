import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Card, Radio, Tag, Spin, Input, Space, Divider, Alert, Checkbox, Select } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined, RobotOutlined, AimOutlined } from '@ant-design/icons';
import { fetchModelTrainQuestions, submitAnswers } from '@/api/exam';
import { aiExplain } from '@/api/ai';
import type { ExamQuestionVO, ExamResultVO } from '@/types';
import { DOMAIN_COLORS } from '@/types';
import { renderFormula } from '@/utils/renderFormula';
import { AnimationContainer } from '@/components';

export default function ModelTrainPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const nodeId = searchParams.get('nodeId');

  const [questions, setQuestions] = useState<ExamQuestionVO[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExamResultVO | null>(null);
  const [aiExplaining, setAiExplaining] = useState<Record<number, boolean>>({});
  const [aiExplanations, setAiExplanations] = useState<Record<number, string>>({});

  const loadQuestions = async () => {
    if (!nodeId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setAnswers({});
    setAiExplanations({});
    try {
      const data = await fetchModelTrainQuestions(nodeId, 5);
      setQuestions(data);
    } catch (e: any) {
      setError(e.message || '加载题目失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId]);

  const handleAiExplain = async (detail: any, question: ExamQuestionVO | undefined) => {
    const qId = detail.questionId;
    if (aiExplanations[qId]) return;
    setAiExplaining(prev => ({ ...prev, [qId]: true }));
    try {
      const res = await aiExplain({
        questionTitle: question?.title || '',
        userAnswer: detail.userAnswer,
        correctAnswer: detail.correctAnswer,
        nodeId: question?.nodeId,
      });
      setAiExplanations(prev => ({ ...prev, [qId]: res.answer }));
    } finally {
      setAiExplaining(prev => ({ ...prev, [qId]: false }));
    }
  };

  const handleSubmit = async () => {
    if (!nodeId) return;
    const ansList = Object.entries(answers).map(([qId, userAnswer]) => ({
      questionId: Number(qId),
      userAnswer,
    }));
    if (ansList.length < questions.length) {
      const confirmed = window.confirm(`还有 ${questions.length - ansList.length} 道题未作答，确定提交吗？`);
      if (!confirmed) return;
    }
    try {
      const res = await submitAnswers({ answers: ansList });
      setResult(res);
    } catch (e: any) {
      setError(e.message || '提交失败');
    }
  };

  // 无 nodeId 参数时显示提示
  if (!nodeId) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
        <Alert message="缺少参数" description="请从知识点详情页进入专题训练" type="warning" showIcon />
        <Button type="link" onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />} style={{ marginTop: 16 }}>
          返回
        </Button>
      </div>
    );
  }

  // 结果页
  if (result) {
    return (
      <div className="exam-container" style={{ maxWidth: 800, margin: '0 auto', padding: '16px 16px 40px' }}>
        <Card style={{ textAlign: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>🎯 专题训练结果</h2>
          <div style={{ fontSize: 48, fontWeight: 'bold', color: result.score >= 60 ? '#10B981' : '#EF4444' }}>
            {result.score.toFixed(1)}分
          </div>
          <div style={{ marginTop: 8, color: '#64748b' }}>
            正确 <span style={{ color: '#10B981', fontWeight: 'bold' }}>{result.correctCount}</span> /
            错误 <span style={{ color: '#EF4444', fontWeight: 'bold' }}>{result.wrongCount}</span> /
            共 <span style={{ fontWeight: 'bold' }}>{result.totalCount}</span> 题
          </div>
          <Space style={{ marginTop: 12 }}>
            <Button type="primary" icon={<ReloadOutlined />} onClick={loadQuestions}>再来一轮</Button>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/knowledge/${nodeId}`)}>
              返回知识点
            </Button>
          </Space>
        </Card>

        <Divider>逐题解析</Divider>

        {result.details.map((d, i) => {
          const q = questions.find(q => q.id === d.questionId);
          return (
            <Card key={d.questionId} size="small" style={{ marginBottom: 8, borderLeft: `4px solid ${d.correct ? '#10B981' : '#EF4444'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>第 {i + 1} 题 {d.correct ? '✅' : '❌'}</span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{q?.nodeTitle}</span>
              </div>
              <div style={{ margin: '8px 0', fontSize: 14 }} dangerouslySetInnerHTML={{ __html: renderFormula(q?.title || '') }} />
              <div style={{ fontSize: 13, color: '#64748b' }}>
                你的答案：<span style={{ color: d.correct ? '#10B981' : '#EF4444', fontWeight: 600 }}>{d.userAnswer || '（未作答）'}</span>
                {!d.correct && <> | 正确答案：<span style={{ color: '#10B981', fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: renderFormula(d.correctAnswer) }} /></>}
              </div>
              {d.explanation && (
                <div style={{ marginTop: 6, fontSize: 13, color: '#8B5CF6', background: '#f5f3ff', padding: '6px 10px', borderRadius: 6 }}>
                  💡 {d.explanation}
                </div>
              )}

              {!d.correct && q?.nodeId && (
                <div style={{ marginTop: 4 }}>
                  <AnimationContainer nodeId={q.nodeId} />
                </div>
              )}

              {!d.correct && (
                <>
                  {aiExplanations[d.questionId] ? (
                    <div style={{ marginTop: 8, fontSize: 13, background: '#f0f9ff', padding: '8px 12px', borderRadius: 8, border: '1px solid #bae6fd' }}>
                      <div style={{ fontWeight: 600, color: '#0369a1', marginBottom: 4 }}>🤖 AI 深度解析</div>
                      <div style={{ lineHeight: 1.7, color: '#1e293b' }}>{aiExplanations[d.questionId]}</div>
                    </div>
                  ) : (
                    <Button
                      size="small"
                      type="link"
                      icon={<RobotOutlined />}
                      loading={aiExplaining[d.questionId]}
                      onClick={() => handleAiExplain(d, q)}
                      style={{ marginTop: 4, color: '#0369a1' }}
                    >
                      {aiExplaining[d.questionId] ? 'AI 分析中…' : '🤖 AI 深度解析错题'}
                    </Button>
                  )}
                </>
              )}
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="exam-container" style={{ maxWidth: 800, margin: '0 auto', padding: '16px 16px 40px' }}>
      {/* 顶部导航 */}
      <div style={{ marginBottom: 16 }}>
        <Button type="link" onClick={() => navigate(`/knowledge/${nodeId}`)} icon={<ArrowLeftOutlined />} style={{ padding: 0, marginBottom: 8 }}>
          返回知识点
        </Button>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
          <AimOutlined style={{ color: '#8B5CF6', marginRight: 8 }} />
          模型专题训练
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
          针对该知识点进行专项练习，巩固理解
        </p>
      </div>

      {error && (
        <Alert message="加载失败" description={error} type="error" showIcon closable onClose={() => setError(null)} style={{ marginBottom: 16 }} />
      )}

      <Spin spinning={loading}>
        {questions.length === 0 && !loading && (
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <p style={{ fontSize: 16 }}>暂无专题训练题目</p>
              <Button type="primary" onClick={loadQuestions}>重新加载</Button>
            </div>
          </Card>
        )}

        {questions.map((q, i) => {
          let parsedOptions: any = null;
          try {
            if (q.options) parsedOptions = JSON.parse(q.options);
            if (Array.isArray(parsedOptions)) {
              const obj: Record<string, string> = {};
              for (const item of parsedOptions) {
                const match = item.match(/^([A-Da-d])[.．、]\s*(.+)/);
                if (match) obj[match[1].toUpperCase()] = match[2];
              }
              if (Object.keys(obj).length > 0) parsedOptions = obj;
            }
          } catch { /* ignore */ }

          const isChoice = q.questionType === 'choice';
          const isMultiChoice = q.questionType === 'multi_choice';
          const isFill = q.questionType === 'fill';
          const isTrueFalse = q.questionType === 'true_false' || q.questionType === 'judge';

          return (
            <Card key={q.id} size="small" style={{ marginBottom: 12, borderLeft: `4px solid ${DOMAIN_COLORS[q.domain] || '#94a3b8'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Space size={4}>
                  <Tag color={DOMAIN_COLORS[q.domain]}>{q.domain}</Tag>
                  <Tag>{q.level}</Tag>
                  <Tag color="orange">{'★'.repeat(q.difficulty)}{'☆'.repeat(5 - q.difficulty)}</Tag>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{q.nodeTitle}</span>
                </Space>
              </div>

              <div style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 12 }}
                dangerouslySetInnerHTML={{ __html: renderFormula(`**${i + 1}.** ${q.title}`) }} />

              {isChoice && parsedOptions && (
                <Radio.Group value={answers[q.id]} onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {Object.entries(parsedOptions).map(([key, val]) => (
                      <Radio key={key} value={key} style={{ fontSize: 14, padding: '4px 0' }}>
                        <span dangerouslySetInnerHTML={{ __html: renderFormula(`${key}. ${val}`) }} />
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              )}

              {isFill && (
                <Input
                  value={answers[q.id] || ''}
                  onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                  placeholder="输入答案…"
                  style={{ maxWidth: 400 }}
                />
              )}

              {isTrueFalse && (
                <Radio.Group value={answers[q.id]} onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}>
                  <Radio value="对">对</Radio>
                  <Radio value="错">错</Radio>
                </Radio.Group>
              )}

              {isMultiChoice && parsedOptions && (
                <Checkbox.Group
                  value={(answers[q.id] || '').split(',').filter(Boolean)}
                  onChange={vals => setAnswers(a => ({ ...a, [q.id]: vals.join(',') }))}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {Object.entries(parsedOptions).map(([key, val]) => (
                      <Checkbox key={key} value={key} style={{ fontSize: 14, padding: '4px 0' }}>
                        <span dangerouslySetInnerHTML={{ __html: renderFormula(`${key}. ${val}`) }} />
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              )}
            </Card>
          );
        })}

        {questions.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button type="primary" size="large" onClick={handleSubmit}
              style={{ background: '#10B981', borderColor: '#10B981' }}>
              ✅ 提交批改
            </Button>
          </div>
        )}
      </Spin>
    </div>
  );
}
