/**
 * 考试/练习模块 — ExamController 完整翻译
 * 包括题库管理、自动组卷、提交批改、错题本、学习统计
 */
import { Router } from 'express';
import prisma from '../db.js';
import { ok, fail } from '../utils/response.js';
import { buildExamService } from '../services/examService.js';

const router = Router();
const examService = buildExamService(prisma);

const DEFAULT_USER_ID = 1;

// ========== 题库管理 ==========

router.get('/questions', async (req, res, next) => {
  try {
    const { page = '1', pageSize = '20', domain, type, nodeId } = req.query;
    const p = Math.max(1, parseInt(page as string, 10));
    const ps = Math.min(100, Math.max(1, parseInt(pageSize as string, 10)));

    const where: any = { status: 1, deleted: 0 };
    if (domain) where.domain = domain;
    if (type) where.questionType = type;
    if (nodeId) where.nodeId = String(nodeId);

    const [list, total] = await Promise.all([
      prisma.examQuestion.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (p - 1) * ps,
        take: ps,
      }),
      prisma.examQuestion.count({ where }),
    ]);

    ok(res, { records: list, total, current: p, size: ps });
  } catch (e) {
    next(e);
  }
});

router.get('/questions/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const q = await prisma.examQuestion.findUnique({ where: { id } });
    if (!q || q.deleted === 1) {
      fail(res, 404, '题目不存在');
      return;
    }
    ok(res, q);
  } catch (e) {
    next(e);
  }
});

router.post('/questions', async (req, res, next) => {
  try {
    const data = req.body;
    await prisma.examQuestion.create({ data });
    ok(res, null);
  } catch (e) {
    next(e);
  }
});

router.put('/questions/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.examQuestion.update({ where: { id }, data: req.body });
    ok(res, null);
  } catch (e: any) {
    if (e.code === 'P2025') {
      fail(res, 404, '题目不存在');
      return;
    }
    next(e);
  }
});

router.delete('/questions/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.examQuestion.update({ where: { id }, data: { deleted: 1 } });
    ok(res, null);
  } catch (e: any) {
    if (e.code === 'P2025') {
      fail(res, 404, '题目不存在');
      return;
    }
    next(e);
  }
});

// ========== 自动组卷 ==========

router.post('/generate', async (req, res, next) => {
  try {
    const paper = await examService.autoGenerate(req.body);
    ok(res, paper);
  } catch (e) {
    next(e);
  }
});

router.get('/paper/:paperId', async (req, res, next) => {
  try {
    const paperId = parseInt(req.params.paperId, 10);
    const paper = await examService.getPaper(paperId);
    if (!paper) {
      fail(res, 404, '试卷不存在');
      return;
    }
    ok(res, paper);
  } catch (e) {
    next(e);
  }
});

// ========== 自由练习 ==========

router.get('/random', async (req, res, next) => {
  try {
    const { subject, domain, level, count = '10' } = req.query;
    const questions = await examService.getRandomQuestions(
      subject as string | undefined,
      domain as string | undefined,
      level as string | undefined,
      parseInt(count as string, 10),
    );
    ok(res, questions);
  } catch (e) {
    next(e);
  }
});

// ========== 提交批改 ==========

router.post('/submit', async (req, res, next) => {
  try {
    const result = await examService.submitAnswers(DEFAULT_USER_ID, req.body);
    ok(res, result);
  } catch (e) {
    next(e);
  }
});

// ========== 错题本 ==========

router.get('/wrong-book', async (req, res, next) => {
  try {
    const { page = '1', pageSize = '20' } = req.query;
    const p = Math.max(1, parseInt(page as string, 10));
    const ps = Math.min(100, Math.max(1, parseInt(pageSize as string, 10)));
    const result = await examService.getWrongBook(DEFAULT_USER_ID, p, ps);
    ok(res, result);
  } catch (e) {
    next(e);
  }
});

router.delete('/wrong-book/:questionId', async (req, res, next) => {
  try {
    const questionId = parseInt(req.params.questionId, 10);
    await examService.removeFromWrongBook(DEFAULT_USER_ID, questionId);
    ok(res, null);
  } catch (e) {
    next(e);
  }
});

router.post('/wrong-book/:questionId/review', async (req, res, next) => {
  try {
    const questionId = parseInt(req.params.questionId, 10);
    await examService.markReviewed(DEFAULT_USER_ID, questionId);
    ok(res, null);
  } catch (e) {
    next(e);
  }
});

// ========== 学习统计 ==========

router.get('/stats', async (req, res, next) => {
  try {
    const { subject } = req.query;
    const stats = await examService.getStats(DEFAULT_USER_ID, subject as string | undefined);
    ok(res, stats);
  } catch (e) {
    next(e);
  }
});

export default router;
