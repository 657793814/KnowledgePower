import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Input, Typography, Dropdown, Button, Space } from 'antd';
import {
  BookOutlined, SearchOutlined, BarChartOutlined,
  EditOutlined, PieChartOutlined, DeleteOutlined,
  PlayCircleOutlined, UserOutlined, LogoutOutlined,
  LoginOutlined, UserAddOutlined, SettingOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import { SUBJECT_DOMAINS } from '@/types';
import { useSubjectStore } from '@/store/subjectStore';
import { useAuth } from '@/components/Auth/AuthProvider';
import { useTheme } from '@/themes/ThemeContext';
import type { ThemeId } from '@/themes/theme-presets';

const { Header, Sider, Content } = Layout;

import { AimOutlined } from '@ant-design/icons';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentSubject, setSubject } = useSubjectStore();
  const [searchText, setSearchText] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { themeId, themes, setTheme } = useTheme();

  const domainLabels = SUBJECT_DOMAINS[currentSubject] || {};

  useEffect(() => {
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

  const domainMenuItems: { key: string; icon: JSX.Element; label: string; onClick: () => void }[] = Object.entries(domainLabels).map(([key, label]) => ({
    key,
    icon: <BookOutlined />,
    label: label as string,
    onClick: () => navigate(`/graph/${encodeURIComponent(key)}`),
  }));

  const match = location.pathname.match(/^\/graph\/(.+)/);
  const currentDomain = match ? decodeURIComponent(match[1]) : undefined;
  const selectedKey = currentDomain && domainLabels[currentDomain] ? currentDomain : undefined;

  const themeMenuItems = themes.map((t) => ({
    key: t.id,
    icon: (
      <span
        style={{
          display: 'inline-block',
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: t.cssVars['--color-primary'],
          marginRight: 4,
        }}
      />
    ),
    label: `${t.emoji} ${t.name}`,
    onClick: () => setTheme(t.id as ThemeId),
  }));

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden', background: 'transparent' }}>
      <Header style={{
        background: 'var(--color-header-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        borderBottom: '1px solid var(--color-border)',
        flexShrink: 0,
        gap: 16,
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/logo.png" alt="logo" style={{ width: 28, height: 28 }} />
          <Typography.Title level={4} style={{ margin: 0, whiteSpace: 'nowrap', color: 'var(--color-text)' }}>
            知识动力
          </Typography.Title>
        </div>

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

        <Dropdown menu={{ items: themeMenuItems }} trigger={['click']}>
          <Button
            type="text"
            style={{
              height: 48,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--color-text-secondary)',
            }}
            title="切换主题"
          >
            <BgColorsOutlined style={{ fontSize: 16 }} />
          </Button>
        </Dropdown>

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
            <Button type="text" style={{ height: 48, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text)' }}>
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
      <Layout style={{ flex: 1, overflow: 'hidden', background: 'transparent' }}>
        <Sider
          width={220}
          collapsed={collapsed}
          style={{
            background: 'var(--color-sidebar-bg)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRight: '1px solid var(--color-border)',
            overflow: 'auto',
            flexShrink: 0,
            transition: 'background 0.3s ease, border-color 0.3s ease',
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={selectedKey ? [selectedKey] : []}
            style={{ border: 'none', marginTop: 8, background: 'transparent' }}
            items={domainMenuItems}
          />
          <div style={{ borderTop: '1px solid var(--color-border)', margin: '8px 0' }} />
          <Menu
            mode="inline"
            selectable={false}
            style={{ background: 'transparent' }}
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
          <div style={{ borderTop: '1px solid var(--color-border)', margin: '8px 0' }} />
          <Menu
            mode="inline"
            selectable={false}
            style={{ background: 'transparent' }}
            items={[
              {
                key: 'insight',
                icon: <AimOutlined />,
                label: '🎯 试卷洞察',
                onClick: () => navigate('/insight'),
              },
              {
                key: 'animation-demo',
                icon: <PlayCircleOutlined />,
                label: '🎬 动画演示',
                onClick: () => navigate('/animation/demo'),
              },
            ]}
          />
          {isAdmin && <>
            <div style={{ borderTop: '1px solid var(--color-border)', margin: '8px 0' }} />
            <Menu
              mode="inline"
              selectable={false}
              style={{ background: 'transparent' }}
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
        <Content style={{
          background: 'transparent',
          overflow: 'auto',
          height: '100%',
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
