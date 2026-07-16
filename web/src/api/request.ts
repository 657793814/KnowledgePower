import axios from 'axios';
import type { ApiResponse } from '@/types';

// 生产环境（Tauri 打包）用绝对 URL，开发环境用 Vite proxy
const API_BASE = import.meta.env.PROD ? 'http://localhost:3001' : '/api';

const request = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// 注入 Token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('zd_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err),
);

request.interceptors.response.use(
  (res) => {
    const data = res.data as ApiResponse<any>;
    // 401 → 清除 token 并跳转登录
    if (data.code === 401) {
      localStorage.removeItem('zd_token');
      localStorage.removeItem('zd_user');
      // 不强制跳转，留给组件处理
    }
    if (data.code !== 200) {
      return Promise.reject(new Error(data.msg || '请求失败'));
    }
    // 解包，让调用方直接拿到 data 字段
    res.data = data.data;
    return res;
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('zd_token');
      localStorage.removeItem('zd_user');
    }
    const msg = err.response?.data?.msg || err.message || '网络错误';
    return Promise.reject(new Error(msg));
  },
);

export default request;
