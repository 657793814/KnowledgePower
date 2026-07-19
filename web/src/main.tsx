import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './themes/ThemeContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <ConfigProvider locale={zhCN}>
      <HashRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </HashRouter>
    </ConfigProvider>
  </ThemeProvider>,
);
