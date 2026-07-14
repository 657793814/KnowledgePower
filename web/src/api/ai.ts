import axios from 'axios';
import type { AiAskResp, ExamPaperVO } from '@/types';

// AI 请求专用实例 — 超时 60 秒，因为远程 API 响应慢
const aiRequest = axios.create({
  baseURL: '/api',
  timeout: 60000,
});

aiRequest.interceptors.response.use(
  (res) => {
    const data = res.data as any;
    if (data.code !== 200) {
      return Promise.reject(new Error(data.msg || '请求失败'));
    }
    res.data = data.data;
    return res;
  },
  (err) => {
    const msg = err.response?.data?.msg
      || (err.code === 'ECONNABORTED' ? '远程 AI 响应超时，请稍后重试' : null)
      || err.message || '网络错误';
    return Promise.reject(new Error(msg));
  },
);

/** AI 知识点问答 */
export const aiAsk = (nodeId: string, question: string, context?: string) =>
  aiRequest.post<AiAskResp>('/ai/ask', { nodeId, question, context }).then(r => r.data);

/** AI 错题解析 */
export const aiExplain = (data: {
  questionTitle: string;
  userAnswer: string;
  correctAnswer: string;
  nodeId?: string;
}) => aiRequest.post<AiAskResp>('/ai/explain', data).then(r => r.data);

/** AI 学习推荐 */
export const aiRecommend = (domainStats: { domain: string; accuracyRate: number }[]) =>
  aiRequest.post<AiAskResp>('/ai/recommend', { domainStats }).then(r => r.data);

/** AI 智能组卷 — 按薄弱领域生成针对性试卷 */
export const aiGeneratePaper = (domainStats: { domain: string; accuracyRate: number }[], count = 10) =>
  aiRequest.post<ExamPaperVO>('/ai/generate-paper', { domainStats, count }).then(r => r.data);
