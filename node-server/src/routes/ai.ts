/**
 * AI 模块 — AiController 完整翻译
 * POST /ai/ask, /ai/explain, /ai/recommend, /ai/generate-paper
 * 只实现 OpenAI 兼容接口，去掉 Ollama 分支
 */
import { Router } from 'express';
import prisma from '../db.js';
import { ok } from '../utils/response.js';
import { buildAiService } from '../services/aiService.js';
import { buildExamService } from '../services/examService.js';

const router = Router();
const aiService = buildAiService(prisma);
const examService = buildExamService(prisma);

// AI 知识问答
router.post('/ask', async (req, res, next) => {
  try {
    const result = await aiService.ask(req.body);
    ok(res, result);
  } catch (e) {
    next(e);
  }
});

// AI 错题解析
router.post('/explain', async (req, res, next) => {
  try {
    const result = await aiService.explainMistake(req.body);
    ok(res, result);
  } catch (e) {
    next(e);
  }
});

// AI 学习推荐
router.post('/recommend', async (req, res, next) => {
  try {
    const result = await aiService.recommend(req.body);
    ok(res, result);
  } catch (e) {
    next(e);
  }
});

// AI 智能组卷
router.post('/generate-paper', async (req, res, next) => {
  try {
    // 1. AI 分析薄弱领域
    const suggestion = await aiService.generatePaper(req.body);

    // 2. 选出最薄弱领域
    let focusDomain = suggestion.focusDomain;
    if (!focusDomain && suggestion.allocations?.length) {
      focusDomain = suggestion.allocations[0].domain;
    }

    // 3. ExamService 出卷
    const paper = await examService.autoGenerate({
      domain: focusDomain,
      count: req.body.count || 10,
      mode: 'practice',
    });
    ok(res, paper);
  } catch (e) {
    next(e);
  }
});

export default router;
