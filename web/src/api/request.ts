import axios from 'axios';
import type { ApiResponse } from '@/types';

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

request.interceptors.response.use(
  (res) => {
    const data = res.data as ApiResponse<any>;
    if (data.code !== 200) {
      return Promise.reject(new Error(data.msg || '请求失败'));
    }
    // 解包，让调用方直接拿到 data 字段
    res.data = data.data;
    return res;
  },
  (err) => {
    const msg = err.response?.data?.msg || err.message || '网络错误';
    return Promise.reject(new Error(msg));
  },
);

export default request;
