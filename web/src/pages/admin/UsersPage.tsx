import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Tag, Switch, Modal, Input, Select, message, Space, Card, Typography } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { fetchUsers, updateUser } from '@/api/auth';
import type { UserInfo } from '@/api/auth';

export default function UsersPage() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (e: any) {
      message.error(e.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (id: number, role: string) => {
    try {
      await updateUser(id, { role });
      message.success('角色已更新');
      load();
    } catch (e: any) {
      message.error(e.message || '更新失败');
    }
  };

  const handleStatusToggle = async (id: number, currentStatus: number) => {
    try {
      await updateUser(id, { status: currentStatus === 1 ? 0 : 1 });
      message.success(currentStatus === 1 ? '已禁用' : '已启用');
      load();
    } catch (e: any) {
      message.error(e.message || '操作失败');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (v: string | null) => v || '-',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string, record: UserInfo) => (
        <Select
          size="small"
          value={role}
          style={{ width: 100 }}
          onChange={(val) => handleRoleChange(record.id, val)}
          options={[
            { value: 'user', label: '👤 用户' },
            { value: 'admin', label: '🔧 管理员' },
          ]}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number, record: UserInfo) => (
        <Switch
          checked={status === 1}
          checkedChildren="正常"
          unCheckedChildren="禁用"
          onChange={() => handleStatusToggle(record.id, status)}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => new Date(v).toLocaleDateString('zh-CN'),
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '16px 16px 40px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            <UserOutlined /> 用户管理
          </Typography.Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/users/create')}>
            创建用户
          </Button>
        </div>
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
}
