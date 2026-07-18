import { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Spin, Button, Tag, Tooltip, Divider, Typography, Collapse, Space } from 'antd';
import {
  BookOutlined, CheckCircleOutlined, CloseCircleOutlined, TrophyOutlined,
  RobotOutlined, ArrowRightOutlined, RiseOutlined, StarOutlined,
  WarningOutlined, FireOutlined, AimOutlined, ThunderboltOutlined,
} from '@ant-design/icons';
import { fetchStats, fetchWrongBook } from '@/api/exam';
import { aiRecommend } from '@/api/ai';
import type { ExamStatsVO, DomainStat } from '@/types';
import { SUBJECT_LABELS, SUBJECT_EMOJI } from '@/types';
import { DOMAIN_COLORS } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useSubjectStore } from '@/store/subjectStore';

const { Panel } = Collapse;

// ─── 领域图标 ───
const DOMAIN_EMOJI: Record<string, string> = {
  '数': '🔢', '式': '📝', '方程与不等式': '⚖️',
  '函数': '📈', '几何': '📐', '排列组合与统计': '🎲',
  '数列与导数': '📊',
  '力学': '⚙️', '热学': '🔥', '电磁学': '⚡',
  '光学': '💡', '声学': '🔊', '近代物理': '⚛️',
  '物质结构与分类': '🧬', '化学反应': '🧪',
  '元素周期表': '📋', '溶液': '🧫',
  '有机化学基础': '🧴', '化学计算': '📟',
};

// ─── 领域建议 ───
function getDomainAdvice(domain: string, rate: number): { text: string; color: string; icon: any; action: string } {
  if (rate >= 80) return { text: '掌握良好', color: '#16a34a', icon: <TrophyOutlined />, action: '保持练习，挑战更难题型' };
  if (rate >= 60) return { text: '基本掌握', color: '#ca8a04', icon: <StarOutlined />, action: '加强薄弱环节的针对性练习' };
  if (rate >= 40) return { text: '需要加强', color: '#ea580c', icon: <WarningOutlined />, action: '建议回到知识点详情页重新学习' };
  return { text: '急需巩固', color: '#dc2626', icon: <FireOutlined />, action: '优先从基础知识开始，逐步提升' };
}

export default function StatsPage() {
  const { currentSubject } = useSubjectStore();
  const [stats, setStats] = useState<ExamStatsVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiRecommendResult, setAiRecommendResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchStats(currentSubject !== 'math' ? currentSubject : undefined)
      .then(setStats)
      .finally(() => setLoading(false));
  }, [currentSubject]);

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

  // 按正确率排序的领域
  const sortedDomains = useMemo(() => {
    if (!stats?.domainStats) return [];
    return [...stats.domainStats].sort((a, b) => a.accuracyRate - b.accuracyRate);
  }, [stats]);

  // 薄弱领域（正确率 < 60%）
  const weakDomains = useMemo(() => {
    return sortedDomains.filter(d => d.accuracyRate < 60);
  }, [sortedDomains]);

  // 强项领域（正确率 >= 80%）
  const strongDomains = useMemo(() => {
    return sortedDomains.filter(d => d.accuracyRate >= 80);
  }, [sortedDomains]);

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" tip="加载统计数据..." /></div>;

  if (!stats || stats.totalAnswered === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
        <h2 style={{ color: '#94a3b8' }}>还没有答题记录</h2>
        <p style={{ color: '#94a3b8', marginBottom: 16 }}>先去练习几道题，统计页面会展示你的学习进度。</p>
        <Button type="primary" icon={<BookOutlined />} onClick={() => navigate('/exam/practice')}>去练习</Button>
      </div>
    );
  }

  const domainColumns = [
    {
      title: '领域', dataIndex: 'domain', key: 'domain', width: 180,
      render: (d: string) => (
        <span>
          {DOMAIN_EMOJI[d] || '📌'} {d}
          <Tag color={DOMAIN_COLORS[d]} style={{ marginLeft: 6, fontSize: 10, border: 'none', opacity: 0 }}> </Tag>
        </span>
      ),
    },
    { title: '答题数', dataIndex: 'answered', key: 'answered', width: 90, align: 'center' as const },
    { title: '正确数', dataIndex: 'correct', key: 'correct', width: 90, align: 'center' as const },
    {
      title: '正确率', dataIndex: 'accuracyRate', key: 'accuracyRate', width: 200,
      render: (rate: number, record: DomainStat) => {
        const advice = getDomainAdvice(record.domain, rate);
        return (
          <Tooltip title={advice.action}>
            <Progress
              percent={Math.round(rate)}
              size="small"
              strokeColor={rate >= 80 ? '#10B981' : rate >= 60 ? '#eab308' : rate >= 40 ? '#f97316' : '#EF4444'}
              format={() => `${rate.toFixed(1)}%`}
            />
          </Tooltip>
        );
      },
    },
    {
      title: '状态', key: 'status', width: 120,
      render: (_: any, record: DomainStat) => {
        const advice = getDomainAdvice(record.domain, record.accuracyRate);
        return (
          <Tooltip title={advice.action}>
            <Tag icon={advice.icon} color={
              record.accuracyRate >= 80 ? 'success' :
              record.accuracyRate >= 60 ? 'warning' :
              record.accuracyRate >= 40 ? 'orange' : 'error'
            } style={{ fontSize: 12 }}>
              {advice.text}
            </Tag>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '16px 16px 40px' }}>
      {/* 标题 */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            📈 学习统计
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {SUBJECT_EMOJI[currentSubject] || '📐'} {SUBJECT_LABELS[currentSubject]?.replace(/^[^ ]+ /, '') || currentSubject}
          </Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<ThunderboltOutlined />}
          onClick={() => navigate('/exam/practice')}
          style={{ borderRadius: 8 }}
        >
          继续练习
        </Button>
      </div>

      {/* 概览卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic title="总答题数" value={stats.totalAnswered} prefix={<BookOutlined />} suffix="题" valueStyle={{ fontSize: 28 }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic title="总正确数" value={stats.totalCorrect} valueStyle={{ color: '#10B981', fontSize: 28 }} prefix={<CheckCircleOutlined />} suffix="题" />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title="总正确率"
              value={stats.accuracyRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: stats.accuracyRate >= 60 ? '#10B981' : '#EF4444', fontSize: 28 }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 12, textAlign: 'center' }}>
            <Statistic
              title="错题收藏"
              value={stats.wrongBookCount}
              valueStyle={{ color: stats.wrongBookCount > 0 ? '#F59E0B' : '#10B981', fontSize: 28 }}
              prefix={<CloseCircleOutlined />}
              suffix="题"
            />
            {stats.wrongBookCount > 0 && (
              <Button type="link" size="small" onClick={() => navigate('/exam/wrong-book')} style={{ marginTop: 4 }}>
                查看错题本 →
              </Button>
            )}
          </Card>
        </Col>
      </Row>

      {/* 薄弱领域提醒 */}
      {weakDomains.length > 0 && (
        <Card
          style={{
            borderRadius: 12, marginBottom: 20,
            borderLeft: '4px solid #EF4444', background: '#fef2f2',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FireOutlined style={{ fontSize: 24, color: '#EF4444' }} />
            <div>
              <span style={{ fontWeight: 600, fontSize: 15 }}>需要重点加强的领域</span>
              <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                {weakDomains.map((d, i) => (
                  <Tag key={d.domain} color="#EF4444" style={{ marginTop: 4 }}>
                    {DOMAIN_EMOJI[d.domain] || '📌'} {d.domain}（{d.accuracyRate.toFixed(1)}%）
                  </Tag>
                ))}
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <Button
              type="primary"
              ghost
              icon={<AimOutlined />}
              onClick={() => navigate(`/exam/practice?domain=${encodeURIComponent(weakDomains[0].domain)}`)}
              style={{ borderRadius: 8, borderColor: '#EF4444', color: '#EF4444' }}
            >
              针对练习
            </Button>
          </div>
        </Card>
      )}

      {/* 强项领域 */}
      {strongDomains.length > 0 && (
        <Card
          style={{
            borderRadius: 12, marginBottom: 20,
            borderLeft: '4px solid #10B981', background: '#f0fdf4',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <TrophyOutlined style={{ fontSize: 24, color: '#10B981' }} />
            <span style={{ fontWeight: 600, fontSize: 15 }}>掌握良好的领域</span>
            {strongDomains.map(d => (
              <Tag key={d.domain} color="success" style={{ marginTop: 4 }}>
                {DOMAIN_EMOJI[d.domain] || '📌'} {d.domain}（{d.accuracyRate.toFixed(1)}%）
              </Tag>
            ))}
          </div>
        </Card>
      )}

      {/* 领域正确率表格 */}
      <Card
        title={<span style={{ fontWeight: 600 }}>📊 各领域掌握度</span>}
        extra={
          <Space>
            <Button
              icon={<RobotOutlined />}
              loading={aiLoading}
              onClick={handleAiRecommend}
              style={{ borderRadius: 8 }}
            >
              🤖 AI 学习建议
            </Button>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={() => navigate('/exam/practice')}
              style={{ borderRadius: 8 }}
            >
              智能练习
            </Button>
          </Space>
        }
        style={{ borderRadius: 12, marginBottom: 20 }}
      >
        <Table
          dataSource={stats.domainStats}
          columns={domainColumns}
          rowKey="domain"
          pagination={false}
          size="small"
        />

        {/* 领域熟练度可视化 */}
        {sortedDomains.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <Typography.Text strong style={{ display: 'block', marginBottom: 12, fontSize: 14 }}>
              领域熟练度排序
            </Typography.Text>
            {sortedDomains.map((d, i) => {
              const advice = getDomainAdvice(d.domain, d.accuracyRate);
              return (
                <div key={d.domain} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13 }}>
                      {DOMAIN_EMOJI[d.domain] || '📌'} {d.domain}
                    </span>
                    <span style={{ fontSize: 12, color: '#666' }}>
                      {d.answered} 题 · <span style={{ color: d.accuracyRate >= 60 ? '#10B981' : '#EF4444' }}>{d.accuracyRate.toFixed(1)}%</span>
                    </span>
                  </div>
                  <Progress
                    percent={Math.round(d.accuracyRate)}
                    strokeColor={d.accuracyRate >= 80 ? '#10B981' : d.accuracyRate >= 60 ? '#eab308' : d.accuracyRate >= 40 ? '#f97316' : '#EF4444'}
                    trailColor="#f0f0f0"
                    size="small"
                    format={() => ''}
                  />
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* 学习路径建议 */}
      {weakDomains.length > 0 && (
        <Card
          title={<span><RiseOutlined style={{ marginRight: 8 }} />推荐学习路径</span>}
          style={{ borderRadius: 12, marginBottom: 20 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {weakDomains.slice(0, 3).map((d, i) => {
              const advice = getDomainAdvice(d.domain, d.accuracyRate);
              return (
                <div key={d.domain} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '12px 16px', background: '#f8fafc', borderRadius: 10,
                  border: '1px solid #e5e7eb',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: advice.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14, flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                      {DOMAIN_EMOJI[d.domain] || '📌'} {d.domain}
                      <span style={{ marginLeft: 8, fontSize: 12, color: advice.color }}>
                        {d.accuracyRate.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {advice.action} · 已答 {d.answered} 题
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/graph/${encodeURIComponent(d.domain)}`)}
                      style={{ borderRadius: 6 }}
                    >
                      复习知识
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => navigate(`/exam/practice?domain=${encodeURIComponent(d.domain)}`)}
                      style={{ borderRadius: 6 }}
                    >
                      练习
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* AI 学习建议 */}
      <Card style={{ borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontWeight: 600 }}>🤖 AI 学习建议</span>
          <Button
            type="primary"
            icon={<RobotOutlined />}
            loading={aiLoading}
            onClick={handleAiRecommend}
            style={{ borderRadius: 8, background: '#7c3aed', borderColor: '#7c3aed' }}
          >
            {aiRecommendResult ? '重新生成' : '生成建议'}
          </Button>
        </div>
        {aiRecommendResult ? (
          <div style={{
            fontSize: 14, lineHeight: 1.9, color: '#1e293b',
            background: '#f5f3ff', padding: '16px 20px', borderRadius: 8,
            border: '1px solid #ede9fe',
          }}>
            {aiRecommendResult}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: 13 }}>
            点击上方按钮，AI 将根据你的学习数据生成个性化学习建议
          </div>
        )}
      </Card>
    </div>
  );
}
