import { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Spin, Alert, Typography } from 'antd';
import { SendOutlined, RobotOutlined, ReloadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { aiAsk } from '@/api/ai';
import { renderFormula } from '@/utils/renderFormula';

const { TextArea } = Input;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  nodeId: string;
  nodeTitle: string;
  context?: string;
}

const SUGGESTIONS = [
  '这个知识点在说什么？',
  '能给我举个生活中的例子吗？',
  '这个知识点和前面的有什么联系？',
  '这个知识点容易在哪些地方出错？',
  '能出个练习题考考我吗？',
];

function renderAnswer(text: string) {
  // 1. 先渲染 LaTeX 公式（用全局工具）
  let html = renderFormula(text);

  // 2. Markdown: heading
  html = html.replace(/## (.*?)(\n|$)/g, '<h4 style="margin:8px 0 4px;color:#1e293b">$1</h4>');

  // 3. Markdown: 加粗
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 4. 换行转 <br/>
  html = html.replace(/\n/g, '<br/>');

  return html;
}

export default function AiChatPanel({ nodeId, nodeTitle, context }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const q = (text || input).trim();
    if (!q) return;

    const userMsg: Message = { role: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-4).map(m => `${m.role === 'user' ? '学生' : '导师'}：${m.content}`);
      const res = await aiAsk(nodeId, q, context);
      const assistantMsg: Message = {
        role: 'assistant',
        content: res.success ? res.answer : '⚠️ ' + (res.error || 'AI 暂时不可用，请稍后再试。'),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e: any) {
      const errMsg = e?.message || 'AI 暂时不可用';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ ' + errMsg,
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!showPanel) {
    return (
      <Button
        type="dashed"
        icon={<RobotOutlined />}
        onClick={() => setShowPanel(true)}
        style={{ width: '100%', marginTop: 16, height: 44, fontSize: 15 }}
      >
        🤖 AI 导师 — 问任何关于这个知识点的问题
      </Button>
    );
  }

  return (
    <Card
      title={<><RobotOutlined style={{ color: '#8B5CF6' }} /> AI 导师</>}
      size="small"
      extra={<Button size="small" onClick={() => setShowPanel(false)}>收起</Button>}
      style={{ marginTop: 16, border: '1px solid #ddd6fe' }}
    >
      {/* 欢迎消息 */}
      {messages.length === 0 && (
        <div style={{ color: '#64748b', fontSize: 13, marginBottom: 12, padding: '8px 12px', background: '#f5f3ff', borderRadius: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 6, color: '#7c3aed' }}>👋 关于「{nodeTitle}」，你可以问我：</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SUGGESTIONS.map(s => (
              <Button key={s} size="small" type="text"
                onClick={() => handleSend(s)}
                style={{ color: '#7c3aed', background: '#ede9fe', fontSize: 12 }}>
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 对话记录 */}
      <div style={{ maxHeight: 400, overflow: 'auto', marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            marginBottom: 10,
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '85%',
              padding: '8px 12px',
              borderRadius: 12,
              background: m.role === 'user' ? '#7c3aed' : '#f1f5f9',
              color: m.role === 'user' ? '#fff' : '#1e293b',
              fontSize: 14,
              lineHeight: 1.6,
            }}>
              {m.role === 'assistant' ? (
                <div dangerouslySetInnerHTML={{ __html: renderAnswer(m.content) }} />
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: 'center', padding: 12 }}>
            <Spin size="small" /> <span style={{ marginLeft: 8, color: '#94a3b8', fontSize: 13 }}>AI 导师思考中…</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 输入框 */}
      <div style={{ display: 'flex', gap: 8 }}>
        <TextArea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="输入你的问题…"
          rows={2}
          onPressEnter={e => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={() => handleSend()}
          loading={loading}
          style={{ background: '#7c3aed', borderColor: '#7c3aed', height: 46 }}
        >
          发送
        </Button>
      </div>
    </Card>
  );
}
