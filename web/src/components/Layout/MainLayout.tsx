import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Input, Select, Typography, Dropdown, Button, Space } from 'antd';
import {
  BookOutlined, SearchOutlined, BarChartOutlined,
  EditOutlined, PieChartOutlined, DeleteOutlined,
  PlayCircleOutlined, UserOutlined, LogoutOutlined,
  LoginOutlined, UserAddOutlined, SettingOutlined,
} from '@ant-design/icons';
import { SUBJECT_LABELS, SUBJECT_DOMAINS, LEVEL_COLORS } from '@/types';
import { useSubjectStore } from '@/store/subjectStore';
import type { SubjectKey } from '@/store/subjectStore';
import { useAuth } from '@/components/Auth/AuthProvider';

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentSubject, setSubject } = useSubjectStore();
  const [searchText, setSearchText] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const { user, isLoggedIn, isAdmin, logout } = useAuth();

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/logo.png" alt="logo" style={{ width: 28, height: 28 }} />
          <Typography.Title level={4} style={{ margin: 0, whiteSpace: 'nowrap' }}>
            知识动力
          </Typography.Title>
        </div>

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

        {/* 用户区 */}
        {isLoggedIn ? (
          <Dropdown menu={{
            items: [
              ...(isAdmin ? [{
                key: 'admin',
                icon: <SettingOutlined />,
                label: '管理后台',
                onClick: () => navigate('/admin'),
              }, {
                key: 'create-user',
                icon: <UserAddOutlined />,
                label: '创建用户',
                onClick: () => navigate('/admin/users/create'),
              }] : []),
              { type: 'divider' as const },
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: '退出登录',
                onClick: () => { logout(); navigate('/'); },
              },
            ],
          }}>
            <Button type="text" style={{ height: 48, display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserOutlined style={{ fontSize: 16 }} />
              <span>{user?.nickname || user?.username}</span>
            </Button>
          </Dropdown>
        ) : (
          <Space size="small">
            <Button type="text" icon={<LoginOutlined />} onClick={() => navigate('/login')}>
              登录
            </Button>
          </Space>
        )}
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
              ...(isLoggedIn ? [{
                key: 'wrongbook',
                icon: <DeleteOutlined />,
                label: '📕 错题本',
                onClick: () => navigate('/exam/wrong-book'),
              }] : []),
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
          {isAdmin && <>
            <div style={{ borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />
            <Menu
              mode="inline"
              selectable={false}
              items={[
                {
                  key: 'admin-dashboard',
                  icon: <BarChartOutlined />,
                  label: '🏗️ 管理后台',
                  onClick: () => navigate('/admin'),
                },
                {
                  key: 'admin-users',
                  icon: <UserOutlined />,
                  label: '👥 用户管理',
                  onClick: () => navigate('/admin/users'),
                },
              ]}
            />
          </>}
        </Sider>
        <Content style={{ background: '#f5f7fa', overflow: 'auto', height: '100%' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
