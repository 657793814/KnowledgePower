import { useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '@/api/auth';
import { useAuth } from '@/components/Auth/AuthProvider';

const STAR_COUNT = 120;
const STARS = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 0.5 + Math.random() * 2.5,
  opacity: 0.15 + Math.random() * 0.6,
  duration: 2 + Math.random() * 4,
  delay: Math.random() * 5,
}));

const METEOR = { top: 12, left: 60, delay: 5 };

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginSuccess } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  const from = (location.state as any)?.from?.pathname || '/';

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * -10;
    const tiltY = (x - 0.5) * 10;
    cardRef.current.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  }, []);

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const result = await login(values.username, values.password);
      loginSuccess(result.token, result.user as any);
      message.success(`欢迎回来，${result.user.nickname || result.user.username}！`);
      navigate(from, { replace: true });
    } catch (e: any) {
      message.error(e.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 40%, #120a38 0%, #0a0a1e 40%, #04040e 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.4); }
        }
        @keyframes meteor {
          0% { transform: translateX(0) translateY(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateX(400px) translateY(400px); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes nebula1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
          50% { transform: translate(40px, -30px) scale(1.2); opacity: 0.18; }
        }
        @keyframes nebula2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.06; }
          50% { transform: translate(-30px, 40px) scale(1.15); opacity: 0.12; }
        }
        .login-star { position: absolute; border-radius: 50%; background: #fff; animation: twinkle var(--duration) ease-in-out infinite; animation-delay: var(--delay); }
        .login-meteor { position: absolute; width: 120px; height: 1.5px; background: linear-gradient(to right, transparent, rgba(255,255,255,0.7)); transform: rotate(35deg); animation: meteor 2s linear infinite; animation-delay: var(--delay); }
        .login-card { transition: transform 0.15s cubic-bezier(0.23, 1, 0.32, 1); will-change: transform; }
        .login-card:hover { box-shadow: 0 20px 80px rgba(99,102,241,0.2), 0 0 120px rgba(99,102,241,0.08) !important; }
        /* ⭐ 输入框样式修复：白色字体 + 白色边框 */
        .login-input { color: #ffffff !important; }
        .login-input::placeholder { color: rgba(255,255,255,0.35) !important; }
        .login-input:-webkit-autofill,
        .login-input:-webkit-autofill:hover,
        .login-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow: 0 0 0px 1000px rgba(255,255,255,0.06) inset !important;
          caret-color: #ffffff !important;
        }
        /* Ant Design Input.Password 内部 input */
        .ant-input-affix-wrapper .ant-input { color: #ffffff !important; }
        .ant-input-affix-wrapper .ant-input::placeholder { color: rgba(255,255,255,0.35) !important; }
        .ant-input-affix-wrapper { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.10) !important; }
        .ant-input-affix-wrapper:hover, .ant-input-affix-wrapper-focused {
          border-color: rgba(99,102,241,0.5) !important;
          box-shadow: 0 0 12px rgba(99,102,241,0.1) !important;
        }
      `}</style>

      {/* 星云层 */}
      <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', top: '5%', left: '-5%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)', animation: 'nebula1 20s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', bottom: '5%', right: '3%', background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 65%)', animation: 'nebula2 25s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', top: '40%', left: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)', animation: 'nebula1 18s ease-in-out infinite 8s', pointerEvents: 'none' }} />

      {/* 星星 */}
      {STARS.map(s => (
        <div key={s.id} className="login-star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity, '--duration': `${s.duration}s`, '--delay': `${s.delay}s` } as React.CSSProperties} />
      ))}
      <div className="login-meteor" style={{ top: `${METEOR.top}%`, left: `${METEOR.left}%`, '--delay': `${METEOR.delay}s` } as React.CSSProperties} />

      {/* 登录卡片 */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="login-card" style={{ width: 400, animation: 'fadeUp 0.8s ease-out' }}>
          <Card style={{
            borderRadius: 20,
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
            padding: '8px 0',
          }}>
            {/* Logo & 标题 */}
            <div style={{ textAlign: 'center', marginBottom: 28, paddingTop: 8 }}>
              <div style={{
                width: 72, height: 72, margin: '0 auto 16px',
                borderRadius: 18,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(99,102,241,0.15)',
              }}>
                <img src="/logo.png" alt="logo" style={{ width: 52, height: 52, borderRadius: 12 }} />
              </div>
              <Typography.Title level={3} style={{
                margin: 0,
                background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                fontSize: 24, letterSpacing: 2,
              }}>
                知识动力
              </Typography.Title>
              <Typography.Text style={{
                color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 6, display: 'block', letterSpacing: 4,
              }}>
                探索知识的宇宙
              </Typography.Text>
            </div>

            {/* 登录表单 */}
            <Form onFinish={handleSubmit} size="large" autoComplete="off" style={{ padding: '0 8px' }}>
              <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                <Input
                  prefix={<UserOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
                  placeholder="用户名"
                  className="login-input"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: 12,
                    height: 48,
                  }}
                />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password
                  prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
                  placeholder="密码"
                  className="login-input"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: 12,
                    height: 48,
                  }}
                />
              </Form.Item>
              <Form.Item style={{ marginTop: 4 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{
                    height: 48, borderRadius: 12, fontSize: 16, letterSpacing: 4,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                  }}
                >
                  登 录
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', paddingBottom: 4 }}>
              <Link to="/" style={{
                color: 'rgba(255,255,255,0.25)', fontSize: 13,
                transition: 'color 0.3s',
              }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.25)'}
              >
                ← 返回首页
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '2%', right: '3%', color: 'rgba(255,255,255,0.04)', fontSize: 9, letterSpacing: 2, pointerEvents: 'none' }}>
        KnowledgePower v0.1
      </div>
    </div>
  );
}
