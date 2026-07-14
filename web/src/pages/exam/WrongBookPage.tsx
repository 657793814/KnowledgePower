import { useState, useEffect } from 'react';
import { Card, Tag, Button, Spin, Empty, Modal, Pagination, message } from 'antd';
import { DeleteOutlined, CheckOutlined, BookOutlined } from '@ant-design/icons';
import { fetchWrongBook, removeFromWrongBook, markReviewed } from '@/api/exam';
import type { WrongBookVO } from '@/types';
import { DOMAIN_COLORS } from '@/types';
import { useNavigate } from 'react-router-dom';
import { renderFormula } from '@/utils/renderFormula';

export default function WrongBookPage() {
  const [data, setData] = useState<WrongBookVO[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async (p: number) => {
    setLoading(true);
    try {
      const res = await fetchWrongBook(p);
      setData(res.records);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page); }, [page]);

  const handleRemove = (qId: number) => {
    Modal.confirm({
      title: '确认移出错题本？',
      content: '移出后仍可在练习中遇到此题',
      onOk: async () => {
        await removeFromWrongBook(qId);
        message.success('已移出错题本');
        load(page);
      },
    });
  };

  const handleReview = async (qId: number) => {
    await markReviewed(qId);
    message.success('标记为已复习');
    load(page);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px 16px 40px' }}>
      <h2 style={{ fontSize: 22, marginBottom: 16 }}>
        📕 错题本 <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 400 }}>共 {total} 题</span>
      </h2>

      <Spin spinning={loading}>
        {data.length === 0 ? (
          <Empty description="还没有错题，继续加油！" style={{ padding: 60 }}>
            <Button type="primary" onClick={() => navigate('/exam/practice')}>去练习</Button>
          </Empty>
        ) : (
          <>
            {data.map((item) => (
              <Card key={item.questionId} size="small" style={{ marginBottom: 8, borderLeft: '4px solid #F59E0B' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 6 }}>
                      <Tag color={DOMAIN_COLORS[item.domain]}>{item.domain}</Tag>
                      <Tag>{item.nodeTitle}</Tag>
                      <Tag color="purple">{item.questionType === 'choice' ? '选择题' : item.questionType === 'fill' ? '填空题' : '判断题'}</Tag>
                      {item.reviewCount > 0 && <Tag color="green">复习 {item.reviewCount} 次</Tag>}
                    </div>

                    <div style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 6 }}
                      dangerouslySetInnerHTML={{ __html: renderFormula(item.title) }} />

                    <div style={{ fontSize: 13, color: '#64748b' }}>
                      正确答案：<span style={{ color: '#10B981', fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: renderFormula(item.correctAnswer) }} />
                    </div>

                    {item.explanation && (
                      <div style={{ marginTop: 6, fontSize: 13, color: '#8B5CF6', background: '#f5f3ff', padding: '6px 10px', borderRadius: 6 }}>
                        💡 {item.explanation}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <Button size="small" icon={<CheckOutlined />} onClick={() => handleReview(item.questionId)}>
                    标记复习
                  </Button>
                  <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleRemove(item.questionId)}>
                    移出
                  </Button>
                </div>
              </Card>
            ))}

            {total > 20 && (
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Pagination current={page} total={total} pageSize={20} onChange={setPage} />
              </div>
            )}
          </>
        )}
      </Spin>
    </div>
  );
}
