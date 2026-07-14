import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Tag, Popconfirm, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { fetchKnowledgeList, deleteKnowledge } from '@/api';
import type { KnowledgeNode } from '@/types';
import { DOMAIN_COLORS } from '@/types';
import { renderFormula } from '@/utils/renderFormula';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const data = await fetchKnowledgeList({ page, pageSize: 50 });
      setNodes(data.records);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteKnowledge(id);
      message.success('删除成功');
      loadData();
    } catch (e: any) {
      message.error(e.message);
    }
  };

  const columns = [
    {
      title: '编码',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      render: (id: string) => <code style={{ fontSize: 12 }}>{id}</code>,
    },
    {
      title: '名称',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: KnowledgeNode) => (
        <a onClick={() => navigate(`/knowledge/${record.id}`)} dangerouslySetInnerHTML={{ __html: renderFormula(title) }} />
      ),
    },
    {
      title: '领域',
      dataIndex: 'domain',
      key: 'domain',
      width: 100,
      render: (d: string) => <Tag color={DOMAIN_COLORS[d]}>{d}</Tag>,
    },
    {
      title: '层级',
      dataIndex: 'level',
      key: 'level',
      width: 70,
      render: (l: string) => <Tag color={l === '初中' ? 'green' : 'orange'}>{l}</Tag>,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 80,
      render: (d: number) => '★'.repeat(d) + '☆'.repeat(5 - d),
    },
    {
      title: '类型',
      dataIndex: 'milestoneType',
      key: 'milestoneType',
      width: 100,
      render: (t: string | null) => t ? <Tag color="purple">📌 总结</Tag> : <Tag>普通</Tag>,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 60,
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: any, record: KnowledgeNode) => (
        <Space>
          <Button size="small" icon={<EditOutlined />}
            onClick={() => navigate(`/admin/knowledge/edit/${record.id}`)} />
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, margin: 0 }}>📋 知识管理后台</h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => loadData()}>刷新</Button>
          <Button type="primary" icon={<PlusOutlined />}
            onClick={() => navigate('/admin/knowledge/create')}>
            新增知识点
          </Button>
        </Space>
      </div>

      <Table
        dataSource={nodes}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          total,
          pageSize: 50,
          showTotal: (t) => `共 ${t} 个知识点`,
        }}
        size="small"
        bordered
      />
    </div>
  );
}
