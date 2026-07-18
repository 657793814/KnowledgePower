import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[React ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', background: '#0a0a1a', color: '#eee', fontFamily: 'sans-serif', padding: 40,
        }}>
          <h1 style={{ color: '#ef4444', marginBottom: 16 }}>⚠️ 页面渲染出错</h1>
          <pre style={{
            background: '#1a1a2e', padding: 20, borderRadius: 8, maxWidth: '90vw',
            overflow: 'auto', fontSize: 14, lineHeight: 1.5, color: '#f87171',
          }}>
            {this.state.error?.message || '未知错误'}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 20, padding: '10px 24px', background: '#3B82F6',
              color: '#fff', border: 'none', borderRadius: 6, fontSize: 16, cursor: 'pointer',
            }}
          >
            重新加载
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
