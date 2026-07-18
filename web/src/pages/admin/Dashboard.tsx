import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Tag, Popconfirm, message, Space, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { fetchKnowledgeList, deleteKnowledge } from '@/api';
import type { KnowledgeNode } from '@/types';
import { DOMAIN_COLORS, SUBJECT_LABELS, SUBJECT_DOMAINS, SUBJECT_KEYS } from '@/types';
import { renderFormula } from '@/utils/renderFormula';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [subject, setSubject] = useState<string | undefined>(undefined);
  const [domain, setDomain] = useState<string | undefined>(undefined);
  const [searchValue, setSearchValue] = useState('');

  // 当前科目对应的领域选项
  const domainOptions = useMemo(() => {
    if (!subject) return [];
    const domains = SUBJECT_DOMAINS[subject];
    if (!domains) return [];
    return Object.entries(domains).map(([value, label]) => ({ value, label }));
  }, [subject]);

  // 切换科目时，清空领域选择
  const handleSubjectChange = (val: string | undefined) => {
    setSubject(val);
    setDomain(undefined);
  };

  const loadData = useCallback(async (p = 1, kw = keyword, sbj = subject, dm = domain) => {
    setLoading(true);
    try {
      const data = await fetchKnowledgeList({
        page: p,
        pageSize: 50,
        keyword: kw || undefined,
        subject: sbj,
        domain: dm,
      });
      setNodes(data.records);
      setTotal(data.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, [keyword, subject, domain]);

  useEffect(() => {
    loadData(1, '', undefined, undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    loadData(1, searchValue, subject, domain);
    setKeyword(searchValue);
  };

  const handleReset = () => {
    setSearchValue('');
    setSubject(undefined);
    setDomain(undefined);
    setKeyword('');
    loadData(1, '', undefined, undefined);
  };

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
      render: (d: string, record: KnowledgeNode) => <Tag color={DOMAIN_COLORS[d]}>{SUBJECT_LABELS[record.subject] || record.subject} · {d}</Tag>,
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

      {/* 搜索栏 */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Input
          placeholder="搜索编码或名称…"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 280 }}
          allowClear
        />
        <Select
          value={subject}
          onChange={handleSubjectChange}
          placeholder="按科目筛选"
          allowClear
          style={{ width: 160 }}
          options={SUBJECT_KEYS.map(k => ({ value: k, label: SUBJECT_LABELS[k] }))}
        />
        <Select
          value={domain}
          onChange={setDomain}
          placeholder="按领域筛选"
          allowClear
          style={{ width: 160 }}
          disabled={!subject}
          options={domainOptions}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>搜索</Button>
        <Button onClick={handleReset}>重置</Button>
        {keyword && (
          <span style={{ fontSize: 12, color: '#64748b' }}>
            当前搜索：<strong>"{keyword}"</strong>，共 {total} 条结果
          </span>
        )}
      </div>

      <Table
        dataSource={nodes}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          total,
          pageSize: 50,
          showTotal: (t) => `共 ${t} 个知识点`,
          onChange: (p) => loadData(p),
        }}
        size="small"
        bordered
        locale={{ emptyText: keyword ? `未找到包含「${keyword}」的知识点` : '暂无数据' }}
      />
    </div>
  );
}
