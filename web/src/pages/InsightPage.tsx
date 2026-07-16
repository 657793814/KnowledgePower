/**
 * 试卷洞察 — Paper Insight Page
 * 支持文本粘贴、PDF 上传解析、图片上传
 */
import { useState, useRef } from 'react';
import {
  Card, Button, Input, Tag, Spin, Progress, Space, Typography, Divider,
  Statistic, Row, Col, Empty, Alert, Collapse, message, Upload, Tabs
} from 'antd';
import {
  FileTextOutlined, AimOutlined, ExperimentOutlined, ThunderboltOutlined,
  ReloadOutlined, CheckCircleOutlined, WarningOutlined, BarChartOutlined,
  UploadOutlined, FilePdfOutlined, PictureOutlined,
} from '@ant-design/icons';
import { fetchRandomQuestions } from '@/api/exam';
import { useNavigate } from 'react-router-dom';
import { useSubjectStore } from '@/store/subjectStore';
import type { UploadFile } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Dragger } = Upload;

interface Coverage {
  total: number; matched: number; matchRate: number;
  domains: { total: number; covered: number };
}

interface DomainResult {
  domain: string; count: number; nodes: string[]; coverage: number;
}

interface NodeResult {
  nodeId: string; title: string; domain: string; count: number; questions: number[];
}

interface InsightResult {
  coverage: Coverage;
  questionResults: { questionIndex: number; text: string; matchedNodes: string[] }[];
  domainResults: DomainResult[];
  nodeResults: NodeResult[];
}

const DOMAIN_EMOJI: Record<string, string> = {
  '数': '🔢', '式': '📝', '方程与不等式': '⚖️',
  '函数': '📈', '几何': '📐', '排列组合与统计': '🎲',
  '数列与导数': '📊',
  '力学': '⚙️', '热学': '🔥', '电磁学': '⚡',
  '光学': '💡', '声学': '🔊', '近代物理': '⚛️',
  '物质结构与分类': '🧬', '化学反应': '🧪',
  '元素周期表': '📋', '溶液': '🧫',
  '有机化学基础': '🧴', '化学计算': '📟',
  '细胞生物学': '🔬', '遗传与进化': '🧬',
  '人体生理': '❤️', '植物学': '🌿',
  '生态学': '🌍', '微生物与生物技术': '🧫',
};

const EXAMPLE_QUESTIONS = `1. 已知函数 f(x)=x²-4x+3，求 f(x) 在区间 [0,3] 上的最大值和最小值。
2. 在△ABC中，a=5，b=7，sinA=3/5，求sinB的值。
3. 求数列 {2n-1} 的前n项和 Sₙ。
4. 用错位相减法求 Sₙ = 1×2 + 3×2² + 5×2³ + ... + (2n-1)×2ⁿ。
5. 已知 f(x)=ln(x+1)-x，求函数 f(x) 的单调区间。`;

/** 用 FileReader 读取文件文本 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}

/** 用 FileReader 读取文件为 DataURL (Base64) */
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('图片读取失败'));
    reader.readAsDataURL(file);
  });
}

export default function InsightPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [screenOcrLoading] = useState(false);
  const [result, setResult] = useState<InsightResult | null>(null);
  const navigate = useNavigate();
  const { currentSubject } = useSubjectStore();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const analyze = async () => {
    if (!text.trim()) {
      message.warning('请先粘贴题目或上传文件');
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const lines = text.split('\n').filter(l => l.trim());
      const questions = lines.map(line => ({
        text: line.replace(/^\d+[.、．\s]+/, '').trim(),
      }));

      const res = await fetch('/api/insight/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions, subject: currentSubject }),
      });

      if (!res.ok) throw new Error('分析失败');
      const data = await res.json();
      setResult(data.data);
    } catch (e: any) {
      message.error(e.message || '分析出错');
    } finally {
      setLoading(false);
    }
  };

  const generatePractice = async () => {
    if (!result?.nodeResults?.length) {
      message.warning('请先完成分析');
      return;
    }
    setGenerating(true);
    try {
      const weakestNodes = result.nodeResults
        .sort((a, b) => a.count - b.count)
        .slice(0, 5)
        .map(n => n.nodeId);

      const questions = await fetchRandomQuestions(
        currentSubject, undefined, undefined, weakestNodes.length * 2
      );

      if (questions.length > 0) {
        navigate('/exam/practice', { state: { questions } });
      } else {
        message.info('没有找到匹配的题目，进入自由练习模式');
        navigate('/exam/practice');
      }
    } catch (e: any) {
      message.error('生成练习失败');
    } finally {
      setGenerating(false);
    }
  };

  const applyExample = () => setText(EXAMPLE_QUESTIONS);

  // ─── PDF 解析 ───
  const handlePdfUpload = async (file: File) => {
    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/6.1.200/pdf.worker.min.mjs';

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

      let fullText = '';
      for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      if (fullText.trim()) {
        setText(prev => (prev ? prev + '\n' : '') + fullText.trim());
        message.success(`已从 PDF 提取 ${fullText.split('\n').length} 行文本`);
      } else {
        message.warning('未能从 PDF 提取到有效文本');
      }
    } catch (e: any) {
      message.error('PDF 解析失败：' + e.message);
    }
    return false; // 阻止 Upload 默认上传
  };

  // ─── OCR 识别 ───
  const handleImageUpload = async (file: File) => {
    try {
      const dataUrl = await readFileAsDataURL(file);
      setUploadedImage(dataUrl);

      // 尝试 AI OCR
      const res = await fetch('/api/insight/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data?.text?.trim()) {
          setText(prev => (prev ? prev + '\n' : '') + data.data.text.trim());
          message.success('图片文字已提取');
        } else {
          message.info('图片未识别到文字，已在左侧预览');
        }
      } else {
        message.info('OCR 暂不可用，图片已预览，请手动输入题目');
      }
    } catch {
      message.info('图片已上传，请手动输入题目文字');
    }
    return false;
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px 60px' }}>
      <Typography.Title level={3} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <AimOutlined style={{ color: '#7c3aed' }} /> 试卷洞察
      </Typography.Title>
      <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        粘贴或上传题目 → AI 分析考点覆盖 → 发现知识漏洞 → 生成针对性练习
      </Typography.Text>

      {/* ─── 输入区 ─── */}
      <Card style={{ borderRadius: 12, marginBottom: 24, border: '1px solid #e5e7eb' }}>
        <Tabs
          defaultActiveKey="text"
          items={[
            {
              key: 'text',
              label: <span><FileTextOutlined /> 文本输入</span>,
              children: (
                <>
                  <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>粘贴题目</span>
                    <Button size="small" onClick={applyExample} style={{ fontSize: 12 }}>加载示例</Button>
                  </div>
                  <TextArea
                    rows={8}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="在此粘贴试卷题目...&#10;可以输入题目编号（如 1. 2. 3.）&#10;系统会自动匹配知识点"
                    style={{ borderRadius: 8, fontSize: 14, marginBottom: 16 }}
                  />
                </>
              ),
            },
            {
              key: 'upload',
              label: <span><UploadOutlined /> 上传文件</span>,
              children: (
                <div>
                  <Dragger
                    multiple={false}
                    showUploadList={false}
                    beforeUpload={(file) => {
                      const isPDF = file.type === 'application/pdf';
                      const isImage = file.type.startsWith('image/');
                      if (!isPDF && !isImage) {
                        message.error('仅支持 PDF 和图片格式');
                        return false;
                      }
                      if (isPDF) handlePdfUpload(file);
                      if (isImage) handleImageUpload(file);
                      return false;
                    }}
                    style={{ borderRadius: 8, marginBottom: 12 }}
                  >
                    <p className="ant-upload-drag-icon">
                      <FilePdfOutlined style={{ fontSize: 36, color: '#7c3aed' }} />
                    </p>
                    <p style={{ fontSize: 15, color: '#1e293b', marginBottom: 4 }}>
                      点击或拖拽文件到此区域
                    </p>
                    <p style={{ fontSize: 12, color: '#94a3b8' }}>
                      支持 PDF 文档（自动提取文字）和图片（JPG/PNG，尝试 OCR 识别）
                    </p>
                  </Dragger>

                  {uploadedImage && (
                    <div style={{ marginTop: 12, textAlign: 'center' }}>
                      <img src={uploadedImage} alt="预览" style={{
                        maxWidth: '100%', maxHeight: 200, borderRadius: 8,
                        border: '1px solid #e5e7eb',
                      }} />
                      <div style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>
                        图片预览 — OCR 结果已填入上方输入框
                      </div>
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />

        <Button
          type="primary"
          icon={<ThunderboltOutlined />}
          onClick={analyze}
          loading={loading}
          size="large"
          style={{ borderRadius: 8, background: '#7c3aed', borderColor: '#7c3aed', marginTop: 12 }}
        >
          开始分析
        </Button>
      </Card>

      {/* 结果区 */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" tip="AI 正在分析知识点覆盖..." />
        </div>
      )}

      {result && !loading && (
        <>
          <Card style={{ borderRadius: 12, marginBottom: 20, border: '1px solid #e5e7eb' }}>
            <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 20 }}>
              <BarChartOutlined style={{ marginRight: 8 }} />覆盖率分析
            </Typography.Title>
            <Row gutter={24}>
              <Col span={8}>
                <Card style={{ textAlign: 'center', borderRadius: 10, background: '#f5f3ff', border: 'none' }}>
                  <Statistic title="题目总数" value={result.coverage.total} prefix={<FileTextOutlined />} valueStyle={{ color: '#7c3aed' }} />
                </Card>
              </Col>
              <Col span={8}>
                <Card style={{ textAlign: 'center', borderRadius: 10, background: '#f0fdf4', border: 'none' }}>
                  <Statistic title="已匹配" value={result.coverage.matched} suffix={` / ${result.coverage.total}`} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#16a34a' }} />
                </Card>
              </Col>
              <Col span={8}>
                <Card style={{
                  textAlign: 'center', borderRadius: 10,
                  background: result.coverage.matchRate >= 70 ? '#f0fdf4' : '#fef2f2', border: 'none',
                }}>
                  <Statistic title="匹配率" value={result.coverage.matchRate} suffix="%"
                    prefix={result.coverage.matchRate >= 70 ? <CheckCircleOutlined /> : <WarningOutlined />}
                    valueStyle={{ color: result.coverage.matchRate >= 70 ? '#16a34a' : '#dc2626' }}
                  />
                </Card>
              </Col>
            </Row>
            {result.coverage.matchRate < 60 && (
              <Alert message="匹配率较低" description="部分题目未能匹配到知识点。请检查题目描述是否完整，或系统暂未收录相关知识点。" type="warning" showIcon style={{ marginTop: 16, borderRadius: 8 }} />
            )}
            {result.coverage.matchRate >= 80 && (
              <Alert message="匹配良好" description="题目知识点映射完整，分析结果可靠。" type="success" showIcon style={{ marginTop: 16, borderRadius: 8 }} />
            )}
          </Card>

          {result.domainResults.length > 0 && (
            <Card style={{ borderRadius: 12, marginBottom: 20, border: '1px solid #e5e7eb' }}>
              <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>知识点领域分布</Typography.Title>
              {result.domainResults.map((d, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span>{DOMAIN_EMOJI[d.domain] || '📌'} {d.domain}</span>
                    <span style={{ fontSize: 13, color: '#666' }}>{d.count} 题 · {d.nodes.slice(0, 3).join('、')}</span>
                  </div>
                  <Progress percent={Math.min(d.count * 25, 100)} showInfo={false}
                    strokeColor={['#6366f1', '#8b5cf6', '#a78bfa'][i % 3]} trailColor="#f0f0f0" size="small" />
                </div>
              ))}
            </Card>
          )}

          {result.nodeResults.length > 0 && (
            <Card style={{ borderRadius: 12, marginBottom: 20, border: '1px solid #e5e7eb' }}>
              <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>匹配知识点列表</Typography.Title>
              {result.nodeResults.slice(0, 15).map((n, i) => (
                <div key={n.nodeId} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: i < result.nodeResults.length - 1 ? '1px solid #f3f4f6' : 'none',
                  cursor: 'pointer',
                }}
                  onClick={() => navigate(`/knowledge/${n.nodeId}`)}
                >
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{n.title}</span>
                    <Tag style={{ marginLeft: 8, fontSize: 11 }}>{n.domain}</Tag>
                  </div>
                  <div>
                    <Tag color="blue">{n.count} 题匹配</Tag>
                    <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>#{n.questions.join('、')}</span>
                  </div>
                </div>
              ))}
            </Card>
          )}

          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <Button type="primary" icon={<ExperimentOutlined />} onClick={generatePractice} loading={generating}
              size="large" style={{ borderRadius: 8, flex: 1, height: 48, background: 'linear-gradient(135deg, #7c3aed, #6366f1)', border: 'none' }}>
              基于漏洞生成练习
            </Button>
            <Button icon={<ReloadOutlined />} onClick={analyze} size="large" style={{ borderRadius: 8, height: 48 }}>
              重新分析
            </Button>
          </div>
        </>
      )}

      {!result && !loading && (
        <Card style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
            <div>
              <p>粘贴或上传你想分析的试卷</p>
              <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>支持数学、物理、化学、生物 300+ 知识点自动匹配</p>
            </div>
          } />
        </Card>
      )}
    </div>
  );
}
