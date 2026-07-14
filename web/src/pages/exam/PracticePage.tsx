import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Card, Radio, Tag, Spin, Input, Select, Space, Divider, Alert } from 'antd';
import { PlayCircleOutlined, ReloadOutlined, RobotOutlined } from '@ant-design/icons';
import { fetchRandomQuestions, submitAnswers } from '@/api/exam';
import { aiExplain } from '@/api/ai';
import type { ExamQuestionVO, ExamResultVO } from '@/types';
import { DOMAIN_COLORS, SUBJECT_DOMAINS } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useSubjectStore } from '@/store/subjectStore';
import { renderFormula } from '@/utils/renderFormula';

const { TextArea } = Input;



export default function PracticePage() {
  const [questions, setQuestions] = useState<ExamQuestionVO[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { currentSubject } = useSubjectStore();
  const [domain, setDomain] = useState<string | undefined>(searchParams.get('domain') || undefined);
  const [count, setCount] = useState(10);
  const [result, setResult] = useState<ExamResultVO | null>(null);
  const [aiExplaining, setAiExplaining] = useState<Record<number, boolean>>({});
  const [aiExplanations, setAiExplanations] = useState<Record<number, string>>({});
  const navigate = useNavigate();

  const handleAiExplain = async (detail: any, question: ExamQuestionVO | undefined) => {
    const qId = detail.questionId;
    if (aiExplanations[qId]) return; // already loaded
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

  const startPractice = async () => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    try {
      const data = await fetchRandomQuestions(currentSubject, domain, undefined, count);
      setQuestions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startPractice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSubject]);

  const handleSubmit = async () => {
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
    } catch (e) {
      console.error(e);
    }
  };

  // Result view
  if (result) {
    return (
      <div className="exam-container" style={{ maxWidth: 800, margin: '0 auto', padding: '16px 16px 40px' }}>
        <Card style={{ textAlign: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>📊 练习结果</h2>
          <div style={{ fontSize: 48, fontWeight: 'bold', color: result.score >= 60 ? '#10B981' : '#EF4444' }}>
            {result.score.toFixed(1)}分
          </div>
          <div style={{ marginTop: 8, color: '#64748b' }}>
            正确 <span style={{ color: '#10B981', fontWeight: 'bold' }}>{result.correctCount}</span> /
            错误 <span style={{ color: '#EF4444', fontWeight: 'bold' }}>{result.wrongCount}</span> /
            共 <span style={{ fontWeight: 'bold' }}>{result.totalCount}</span> 题
          </div>
          <Space style={{ marginTop: 12 }}>
            <Button type="primary" icon={<ReloadOutlined />} onClick={startPractice}>再来一轮</Button>
            <Button onClick={() => navigate('/exam/stats')}>查看学习统计</Button>
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
              {d.explanation && <div style={{ marginTop: 6, fontSize: 13, color: '#8B5CF6', background: '#f5f3ff', padding: '6px 10px', borderRadius: 6 }}>💡 {d.explanation}</div>}

              {/* AI 深度解析 */}
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
      {/* Controls */}
      <Card size="small" style={{ marginBottom: 12 }}>
        <Space wrap>
          <span style={{ fontSize: 13 }}>领域：</span>
          <Select value={domain} onChange={setDomain} style={{ width: 160 }} allowClear placeholder="全部领域"
            options={Object.entries(SUBJECT_DOMAINS[currentSubject] || {}).map(([key, val]) => ({
              value: key,
              label: val,
            }))} />
          <span style={{ fontSize: 13 }}>题数：</span>
          <Select value={count} onChange={setCount} style={{ width: 80 }}
            options={[5, 10, 15, 20].map(n => ({ value: n, label: `${n}题` }))} />
          <Button type="primary" icon={<PlayCircleOutlined />} onClick={startPractice} loading={loading}>开始练习</Button>
          <Button onClick={() => navigate('/exam/stats')}>📈 学习统计</Button>
        </Space>
      </Card>

      <Spin spinning={loading}>
        {questions.map((q, i) => {
          let parsedOptions: Record<string, string> | null = null;
          try {
            if (q.options) parsedOptions = JSON.parse(q.options);
          } catch { /* ignore */ }

          const isChoice = q.questionType === 'choice';
          const isFill = q.questionType === 'fill';
          const isTrueFalse = q.questionType === 'true_false';

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
