import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Spin, Button } from 'antd';
import { BookOutlined, CheckCircleOutlined, CloseCircleOutlined, TrophyOutlined, RobotOutlined } from '@ant-design/icons';
import { fetchStats } from '@/api/exam';
import { aiRecommend, aiGeneratePaper } from '@/api/ai';
import type { ExamStatsVO } from '@/types';
import { DOMAIN_COLORS } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useSubjectStore } from '@/store/subjectStore';

export default function StatsPage() {
  const { currentSubject } = useSubjectStore();
  const [stats, setStats] = useState<ExamStatsVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiRecommendResult, setAiRecommendResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [paperLoading, setPaperLoading] = useState(false);
  const navigate = useNavigate();

  const handleAiRecommend = async () => {
    if (!stats) return;
    setAiLoading(true);
    try {
      const res = await aiRecommend(
        stats.domainStats.map(d => ({ domain: d.domain, accuracyRate: d.accuracyRate }))
      );
      setAiRecommendResult(res.answer);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSmartPractice = async () => {
    if (!stats) return;
    setPaperLoading(true);
    try {
      const paper = await aiGeneratePaper(
        stats.domainStats.map(d => ({ domain: d.domain, accuracyRate: d.accuracyRate })),
        10
      );
      // 跳转到练习页，用 AI 推荐的领域
      navigate(`/exam/practice?domain=${encodeURIComponent(paper.domain || '')}`);
    } finally {
      setPaperLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(currentSubject !== 'math' ? currentSubject : undefined).then(setStats).finally(() => setLoading(false));
  }, [currentSubject]);

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;

  if (!stats || stats.totalAnswered === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <h2 style={{ color: '#94a3b8' }}>还没有答题记录</h2>
        <p style={{ color: '#94a3b8', marginBottom: 16 }}>先去练习几道题吧！</p>
        <Button type="primary" onClick={() => navigate('/exam/practice')}>去练习</Button>
      </div>
    );
  }

  const domainColumns = [
    {
      title: '领域', dataIndex: 'domain', key: 'domain',
      render: (d: string) => <><span style={{ color: DOMAIN_COLORS[d] }}>●</span> {d}</>,
    },
    { title: '答题数', dataIndex: 'answered', key: 'answered', width: 100 },
    { title: '正确数', dataIndex: 'correct', key: 'correct', width: 100 },
    {
      title: '正确率', dataIndex: 'accuracyRate', key: 'accuracyRate', width: 150,
      render: (rate: number) => (
        <Progress percent={Math.round(rate)} size="small" strokeColor={rate >= 60 ? '#10B981' : '#EF4444'} format={() => `${rate.toFixed(1)}%`} />
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 16px 40px' }}>
      <h2 style={{ fontSize: 22, marginBottom: 16 }}>📈 学习统计</h2>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card><Statistic title="总答题数" value={stats.totalAnswered} prefix={<BookOutlined />} suffix="题" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="总正确数" value={stats.totalCorrect} valueStyle={{ color: '#10B981' }} prefix={<CheckCircleOutlined />} suffix="题" /></Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总正确率"
              value={stats.accuracyRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: stats.accuracyRate >= 60 ? '#10B981' : '#EF4444' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="错题收藏"
              value={stats.wrongBookCount}
              valueStyle={{ color: stats.wrongBookCount > 0 ? '#F59E0B' : '#10B981' }}
              prefix={<CloseCircleOutlined />}
              suffix="题"
            />
            <Button type="link" size="small" onClick={() => navigate('/exam/wrong-book')}>查看错题本</Button>
          </Card>
        </Col>
      </Row>

      <Card title="各领域正确率" extra={
        <Button
          type="primary"
          icon={<RobotOutlined />}
          loading={paperLoading}
          onClick={handleSmartPractice}
          style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
        >
          🎯 AI 针对性练习
        </Button>
      }>
        <Table
          dataSource={stats.domainStats}
          columns={domainColumns}
          rowKey="domain"
          pagination={false}
          size="small"
        />
      </Card>

      {/* AI 学习推荐 */}
      <Card style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: aiRecommendResult ? 12 : 0 }}>
          <span style={{ fontWeight: 600 }}>🤖 AI 学习建议</span>
          <Button
            type="primary"
            icon={<RobotOutlined />}
            loading={aiLoading}
            onClick={handleAiRecommend}
            style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
          >
            {aiRecommendResult ? '重新生成' : '生成学习建议'}
          </Button>
        </div>
        {aiRecommendResult && (
          <div style={{ fontSize: 14, lineHeight: 1.8, color: '#1e293b', background: '#f5f3ff', padding: '12px 16px', borderRadius: 8 }}>
            {aiRecommendResult}
          </div>
        )}
      </Card>
    </div>
  );
}
