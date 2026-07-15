import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Input, Select, Typography } from 'antd';
import {
  BookOutlined, SearchOutlined, BarChartOutlined,
  EditOutlined, PieChartOutlined, DeleteOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { SUBJECT_LABELS, SUBJECT_DOMAINS, LEVEL_COLORS } from '@/types';
import { useSubjectStore } from '@/store/subjectStore';
import type { SubjectKey } from '@/store/subjectStore';

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentSubject, setSubject } = useSubjectStore();
  const [searchText, setSearchText] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  // 获取当前学科下的领域菜单
  const domainLabels = SUBJECT_DOMAINS[currentSubject] || {};

  // 当学科切换时，如果在旧学科的领域页面上，回到首页
  useEffect(() => {
    // 如果路径是 /graph/:domain，但 domain 不在当前学科的领域列表中，回首页
    const match = location.pathname.match(/^\/graph\/(.+)/);
    if (match) {
      const domain = decodeURIComponent(match[1]);
      if (!domainLabels[domain]) {
        navigate('/');
      }
    }
  }, [currentSubject, location.pathname]);

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  const handleSubjectChange = (value: SubjectKey) => {
    setSubject(value);
    navigate('/');
  };

  const domainMenuItems: { key: string; icon: JSX.Element; label: string; onClick: () => void }[] = Object.entries(domainLabels).map(([key, label]) => ({
    key,
    icon: <BookOutlined />,
    label: label as string,
    onClick: () => navigate(`/graph/${encodeURIComponent(key)}`),
  }));

  // 当前选中的领域（如果有）
  const match = location.pathname.match(/^\/graph\/(.+)/);
  const currentDomain = match ? decodeURIComponent(match[1]) : undefined;
  // 如果是知识详情页，选中第一个匹配的领域
  const selectedKey = currentDomain && domainLabels[currentDomain] ? currentDomain : undefined;

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Header style={{
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        borderBottom: '1px solid #f0f0f0',
        flexShrink: 0,
        gap: 16,
      }}>
        <Typography.Title level={4} style={{ margin: 0, cursor: 'pointer', whiteSpace: 'nowrap' }}
          onClick={() => navigate('/')}>
          📐 知识动力
        </Typography.Title>

        <Select
          value={currentSubject}
          onChange={handleSubjectChange}
          style={{ width: 140 }}
          options={Object.entries(SUBJECT_LABELS).map(([value, label]) => ({
            value,
            label: <span style={{ fontSize: 14 }}>{String(label)}</span>,
          }))}
        />

        <Input.Search
          placeholder="搜索知识点..."
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={handleSearch}
          style={{ width: 320 }}
          prefix={<SearchOutlined />}
        />
        <div style={{ flex: 1 }} />
      </Header>
      <Layout style={{ flex: 1, overflow: 'hidden' }}>
        <Sider
          width={220}
          collapsed={collapsed}
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
            overflow: 'auto',
            flexShrink: 0,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={selectedKey ? [selectedKey] : []}
            style={{ border: 'none', marginTop: 8 }}
            items={domainMenuItems}
          />
          <div style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />
          <Menu
            mode="inline"
            selectable={false}
            items={[
              {
                key: 'practice',
                icon: <EditOutlined />,
                label: '📝 随堂练习',
                onClick: () => navigate('/exam/practice'),
              },
              {
                key: 'stats',
                icon: <PieChartOutlined />,
                label: '📈 学习统计',
                onClick: () => navigate('/exam/stats'),
              },
              {
                key: 'wrongbook',
                icon: <DeleteOutlined />,
                label: '📕 错题本',
                onClick: () => navigate('/exam/wrong-book'),
              },
            ]}
          />
          <div style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />
          <Menu
            mode="inline"
            selectable={false}
            items={[
              {
                key: 'animation-demo',
                icon: <PlayCircleOutlined />,
                label: '🎬 动画演示',
                onClick: () => navigate('/animation/demo'),
              },
            ]}
          />
          <div style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />
          <Menu
            mode="inline"
            selectable={false}
            items={[
              {
                key: 'admin',
                icon: <BarChartOutlined />,
                label: '🏗️ 管理后台',
                onClick: () => navigate('/admin'),
              },
            ]}
          />
        </Sider>
        <Content style={{ background: '#f5f7fa', overflow: 'auto', height: '100%' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
