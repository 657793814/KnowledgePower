import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Select, Space } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { registerUser } from '@/api/auth';
import { useAuth } from '@/components/Auth/AuthProvider';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values: { username: string; password: string; nickname?: string; role?: string }) => {
    setLoading(true);
    try {
      await registerUser(values);
      message.success(`用户 ${values.username} 创建成功`);
      form.resetFields();
    } catch (e: any) {
      message.error(e.message || '创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 480, margin: '40px auto' }}>
      <Button type="link" onClick={() => navigate('/admin')} icon={<ArrowLeftOutlined />} style={{ padding: 0, marginBottom: 16 }}>
        返回管理后台
      </Button>
      <Card>
        <Typography.Title level={4} style={{ marginBottom: 24 }}>创建新用户</Typography.Title>
        <Form form={form} onFinish={handleSubmit} layout="vertical" size="large">
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }, { min: 2, message: '至少 2 个字符' }]}>
            <Input prefix={<UserOutlined />} placeholder="登录用用户名" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '至少 6 个字符' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="初始密码" />
          </Form.Item>
          <Form.Item name="nickname" label="昵称">
            <Input placeholder="显示名称（选填）" />
          </Form.Item>
          <Form.Item name="role" label="角色" initialValue="user">
            <Select options={[
              { value: 'user', label: '👤 普通用户' },
              { value: 'admin', label: '🔧 管理员' },
            ]} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              创建用户
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
