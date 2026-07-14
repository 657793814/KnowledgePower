import request from './request';
import type { ExamQuestionVO, ExamPaperVO, ExamResultVO, ExamStatsVO, WrongBookVO, PageResult } from '@/types';

/** 获取随机题目（自由练习） */
export const fetchRandomQuestions = (subject?: string, domain?: string, level?: string, count = 10) =>
  request.get<ExamQuestionVO[]>('/exam/random', { params: { subject, domain, level, count } })
    .then(r => r.data);

/** 自动组卷 */
export const generatePaper = (data: { subject?: string; domain?: string; level?: string; count: number; mode: string; timeLimit?: number }) =>
  request.post<ExamPaperVO>('/exam/generate', data).then(r => r.data);

/** 获取试卷（不含答案） */
export const fetchPaper = (paperId: number) =>
  request.get<ExamPaperVO>(`/exam/paper/${paperId}`).then(r => r.data);

/** 提交答案并批改 */
export const submitAnswers = (data: { paperId?: number; answers: { questionId: number; userAnswer: string }[] }) =>
  request.post<ExamResultVO>('/exam/submit', data).then(r => r.data);

/** 获取学习统计 */
export const fetchStats = (subject?: string) =>
  request.get<ExamStatsVO>('/exam/stats', { params: { subject } }).then(r => r.data);

/** 获取错题本 */
export const fetchWrongBook = (page = 1, pageSize = 20) =>
  request.get<PageResult<WrongBookVO>>('/exam/wrong-book', { params: { page, pageSize } })
    .then(r => r.data);

/** 从错题本移除 */
export const removeFromWrongBook = (questionId: number) =>
  request.delete(`/exam/wrong-book/${questionId}`);

/** 标记错题已复习 */
export const markReviewed = (questionId: number) =>
  request.post(`/exam/wrong-book/${questionId}/review`);
