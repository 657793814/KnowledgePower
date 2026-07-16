import { useState, useEffect } from 'react';
import { Card, Form, Input, InputNumber, Switch, Button, message, Spin, Divider, Typography, Space, Slider, Tag } from 'antd';
import { SaveOutlined, ApiOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import request from '@/api/request';

interface AiConfigData {
  provider: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  maxContextChars: number;
  temperature: number;
  topP: number;
  ragEnabled: boolean;
  ragTopK: number;
  ragMinScore: number;
  embeddingModel: string;
  embeddingDim: number;
  ollamaBaseUrl: string;
}

export default function AiSettingsPage() {
  const [form] = Form.useForm();
  const [config, setConfig] = useState<AiConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; reply: string } | null>(null);

  useEffect(() => {
    request.get<AiConfigData>('/admin/ai-config')
      .then(r => {
        setConfig(r.data);
        form.setFieldsValue(r.data);
      })
      .catch(e => message.error('加载配置失败: ' + e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (values: any) => {
    setSaving(true);
    try {
      const res = await request.put<AiConfigData>('/admin/ai-config', values);
      setConfig(res.data);
      form.setFieldsValue(res.data);
      message.success('配置已保存并生效');
    } catch (e: any) {
      message.error('保存失败: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await request.post<{ success: boolean; reply: string }>('/admin/ai-config/test');
      setTestResult(res.data);
    } catch (e: any) {
      setTestResult({ success: false, reply: e.message });
    } finally {
      setTesting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <Typography.Title level={4}>🤖 AI 模型配置</Typography.Title>
      <Typography.Text type="secondary">配置 AI 提供商参数，修改后自动生效，无需重启服务</Typography.Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        style={{ marginTop: 24 }}
        initialValues={config || {}}
      >
        <Card title="模型连接" size="small" style={{ marginBottom: 16 }}>
          <Form.Item name="provider" label="提供商" rules={[{ required: true }]}>
            <Input placeholder="openai" />
          </Form.Item>
          <Form.Item name="baseUrl" label="API 地址" rules={[{ required: true }]}>
            <Input placeholder="https://apihub.agnes-ai.com/v1" />
          </Form.Item>
          <Form.Item name="apiKey" label="API Key">
            <Input.Password
              placeholder="输入新的 API Key（留空不修改）"
              visibilityToggle={false}
            />
          </Form.Item>
          <Form.Item name="model" label="模型名称" rules={[{ required: true }]}>
            <Input placeholder="agnes-2.0-flash" />
          </Form.Item>
          <Space size="large">
            <Form.Item name="maxTokens" label="最大 Token" style={{ marginBottom: 0 }}>
              <InputNumber min={256} max={32000} step={256} style={{ width: 140 }} />
            </Form.Item>
            <Form.Item name="temperature" label="温度" style={{ marginBottom: 0 }}>
              <InputNumber min={0} max={2} step={0.1} style={{ width: 100 }} />
            </Form.Item>
            <Form.Item name="topP" label="Top P" style={{ marginBottom: 0 }}>
              <InputNumber min={0} max={1} step={0.05} style={{ width: 100 }} />
            </Form.Item>
          </Space>
          <Form.Item name="maxContextChars" label="上下文截断长度（字符）" style={{ marginTop: 16 }}>
            <InputNumber min={500} max={20000} step={500} style={{ width: 180 }} />
          </Form.Item>
        </Card>

        <Card title="📚 RAG 知识库检索" size="small" style={{ marginBottom: 16 }}>
          <Form.Item name="ragEnabled" label="启用 RAG" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Space size="large">
            <Form.Item name="ragTopK" label="检索条数" style={{ marginBottom: 0 }}>
              <InputNumber min={1} max={20} style={{ width: 100 }} />
            </Form.Item>
            <Form.Item name="ragMinScore" label="最低分数" style={{ marginBottom: 0 }}>
              <InputNumber min={0} max={1} step={0.05} style={{ width: 100 }} />
            </Form.Item>
          </Space>
          <Space size="large" style={{ marginTop: 16 }}>
            <Form.Item name="ollamaBaseUrl" label="Ollama 地址">
              <Input placeholder="http://localhost:11434" style={{ width: 220 }} />
            </Form.Item>
            <Form.Item name="embeddingModel" label="嵌入模型">
              <Input placeholder="nomic-embed-text" style={{ width: 180 }} />
            </Form.Item>
            <Form.Item name="embeddingDim" label="嵌入维度">
              <InputNumber min={128} max={4096} style={{ width: 100 }} />
            </Form.Item>
          </Space>
        </Card>

        <Space size="middle">
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
            保存配置
          </Button>
          <Button icon={<ApiOutlined />} onClick={handleTest} loading={testing}>
            测试连接
          </Button>
        </Space>
      </Form>

      {testResult && (
        <Card size="small" style={{ marginTop: 16 }}>
          <Space>
            {testResult.success
              ? <Tag icon={<CheckCircleOutlined />} color="success">连接成功</Tag>
              : <Tag icon={<CloseCircleOutlined />} color="error">连接失败</Tag>}
            <span>{testResult.reply}</span>
          </Space>
        </Card>
      )}
    </div>
  );
}
