import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, message, Spin, Typography, Space, Modal, Upload, Statistic, Row, Col } from 'antd';
import { CloudUploadOutlined, DeleteOutlined, ReloadOutlined, DatabaseOutlined, FilePdfOutlined } from '@ant-design/icons';
import request from '@/api/request';

export default function DocumentsPage() {
  const [stats, setStats] = useState<{ count: number; sources: string[] }>({ count: 0, sources: [] });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await request.get<{ count: number; sources: string[] }>('/admin/documents/stats');
      setStats(res.data);
    } catch {
      setStats({ count: 0, sources: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await request.post('/admin/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000,
      });
      message.success(`"${file.name}" 上传并处理完成`);
      loadStats();
    } catch (e: any) {
      message.error('处理失败: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleReindex = async (source: string) => {
    Modal.confirm({
      title: '重新处理',
      content: `将重新处理 "${source}"，确定？`,
      onOk: async () => {
        try {
          await request.post('/admin/documents/reindex', { source });
          message.success('重新处理完成');
          loadStats();
        } catch (e: any) {
          message.error('失败: ' + e.message);
        }
      },
    });
  };

  const handleDelete = async (source: string) => {
    Modal.confirm({
      title: '删除文档',
      content: `将从向量库删除 "${source}" 的所有内容，确定？`,
      onOk: async () => {
        try {
          await request.delete('/admin/documents', { data: { source } });
          message.success('已删除');
          loadStats();
        } catch (e: any) {
          message.error('失败: ' + e.message);
        }
      },
    });
  };

  const columns = [
    { title: '文档名', dataIndex: 'name', key: 'name', ellipsis: true },
    {
      title: '操作', key: 'action', width: 180,
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" icon={<ReloadOutlined />} onClick={() => handleReindex(record.name)}>重处理</Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.name)}>删除</Button>
        </Space>
      ),
    },
  ];

  const dataSource = stats.sources.map((s, i) => ({ key: i, name: s }));

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={4}>📚 知识库文档管理</Typography.Title>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic title="向量总数" value={stats.count} prefix={<DatabaseOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="文档数" value={stats.sources.length} prefix={<FilePdfOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Upload
              accept=".pdf"
              showUploadList={false}
              beforeUpload={(file) => { handleUpload(file); return false; }}
              disabled={uploading}
            >
              <Button type="primary" icon={<CloudUploadOutlined />} loading={uploading} block>
                上传 PDF
              </Button>
            </Upload>
          </Card>
        </Col>
      </Row>

      <Card title="已处理文档" extra={<Button size="small" icon={<ReloadOutlined />} onClick={loadStats}>刷新</Button>}>
        {loading ? <Spin /> : (
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            locale={{ emptyText: '暂无文档，请上传 PDF' }}
          />
        )}
      </Card>
    </div>
  );
}
