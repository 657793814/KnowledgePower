import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, InputNumber, Button, message, Spin, Card, Tabs } from 'antd';
import { fetchKnowledgeDetail, createKnowledge, updateKnowledge } from '@/api';

const { TextArea } = Input;

// 领域选项
const DOMAIN_OPTIONS = [
  { value: '数', label: '数' },
  { value: '式', label: '式' },
  { value: '方程与不等式', label: '方程与不等式' },
  { value: '函数', label: '函数' },
  { value: '几何', label: '几何' },
  { value: '排列组合与统计', label: '排列组合与统计' },
  { value: '数列与导数', label: '数列与导数' },
];

export default function KnowledgeEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!id && id !== 'create';

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      fetchKnowledgeDetail(id!)
        .then((data) => {
          form.setFieldsValue({
            id: data.id,
            title: data.title,
            subtitle: data.subtitle,
            domain: data.domain,
            level: data.level,
            difficulty: data.difficulty,
            sortOrder: data.sortOrder,
            visualType: data.visualType,
            summary: data.summary,
            contentJson: typeof data.contentJson === 'object'
              ? JSON.stringify(data.contentJson, null, 2)
              : data.contentJson,
            milestoneType: data.milestoneType,
            status: data.status,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // 解析 contentJson
      let contentJson = values.contentJson;
      if (contentJson && typeof contentJson === 'string') {
        try {
          JSON.parse(contentJson);
        } catch {
          message.error('contentJson 格式无效，请检查 JSON 语法');
          return;
        }
      }

      if (isEdit) {
        await updateKnowledge(id!, values);
        message.success('更新成功');
      } else {
        await createKnowledge(values);
        message.success('创建成功');
      }
      navigate('/admin');
    } catch (e: any) {
      if (e.message) message.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spin style={{ display: 'block', textAlign: 'center', padding: 80 }} />;
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2 style={{ fontSize: 20, marginBottom: 24 }}>
        {isEdit ? `编辑知识点：${id}` : '新增知识点'}
      </h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Card title="基本信息" style={{ marginBottom: 16 }}>
          <Form.Item name="id" label="编码" rules={[{ required: true }]}>
            <Input placeholder="如 MATH-01-001" disabled={isEdit} />
          </Form.Item>

          <Form.Item name="title" label="名称" rules={[{ required: true }]}>
            <Input placeholder="知识点名称" />
          </Form.Item>

          <Form.Item name="subtitle" label="副标题/一句话定义">
            <Input placeholder="如 i² = -1" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item name="domain" label="领域" rules={[{ required: true }]}>
              <Select options={DOMAIN_OPTIONS} />
            </Form.Item>
            <Form.Item name="level" label="层级" rules={[{ required: true }]}>
              <Select options={[
                { value: '初中', label: '初中' },
                { value: '高中', label: '高中' },
              ]} />
            </Form.Item>
            <Form.Item name="difficulty" label="难度 (1-5)">
              <InputNumber min={1} max={5} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="sortOrder" label="排序">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="visualType" label="可视化类型">
              <Select allowClear options={[
                { value: 'static', label: '静态文本' },
                { value: 'canvas', label: 'Canvas 交互' },
                { value: 'svg', label: 'SVG 示意图' },
                { value: 'three', label: '3D 场景' },
              ]} />
            </Form.Item>
          </div>

          <Form.Item name="milestoneType" label="总结类型">
            <Select allowClear placeholder="非总结节点">
              <Select.Option value="section_end">章节总结</Select.Option>
              <Select.Option value="domain_end">领域总结</Select.Option>
            </Select>
          </Form.Item>
        </Card>

        <Card title="内容" style={{ marginBottom: 16 }}>
          <Form.Item name="summary" label="一句话总结（图谱卡片显示）">
            <TextArea rows={2} placeholder="核心精髓" />
          </Form.Item>

          <Form.Item name="contentJson" label="详细内容 JSON">
            <TextArea rows={15} placeholder='{"text": "...", "sections": [...]}' />
          </Form.Item>
        </Card>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button onClick={() => navigate('/admin')}>取消</Button>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {isEdit ? '保存修改' : '创建知识点'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
