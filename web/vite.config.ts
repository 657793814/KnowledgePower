import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Tauri 自定义协议下，crossorigin 会导致模块脚本加载失败（白屏）
function stripCrossoriginPlugin(): import('vite').Plugin {
  return {
    name: 'strip-crossorigin',
    transformIndexHtml(html) {
      return html.replace(/crossorigin\s*/g, '');
    },
  };
}

export default defineConfig({
  // Tauri v2 使用自定义协议，绝对路径 base 更可靠
  base: './',
  plugins: [react(), stripCrossoriginPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 8082,
    proxy: {
      '/api': {
        target: process.env.API_TARGET || 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
});
