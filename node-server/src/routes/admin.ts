/**
 * Admin 管理路由 — AI 配置 / 系统管理 / 文档管理
 */
import { Router } from 'express';
import axios from 'axios';
import { ok, fail } from '../utils/response.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';
import { getAiConfig, setAiConfig, type AiConfig } from '../config.js';

const router = Router();

// 所有管理接口需要管理员权限
router.use(requireAuth, requireAdmin);

// ========================================================================
// AI 配置
// ========================================================================

// GET /admin/ai-config
router.get('/ai-config', (_req, res) => {
  const cfg = getAiConfig();
  const masked = {
    ...cfg,
    apiKey: cfg.apiKey ? cfg.apiKey.substring(0, 8) + '…' + cfg.apiKey.slice(-4) : '',
  };
  ok(res, masked);
});

// PUT /admin/ai-config
router.put('/ai-config', (req, res, next) => {
  try {
    const updated = setAiConfig(req.body as Partial<AiConfig>);
    const masked = {
      ...updated,
      apiKey: updated.apiKey ? updated.apiKey.substring(0, 8) + '…' + updated.apiKey.slice(-4) : '',
    };
    ok(res, masked);
  } catch (e) {
    next(e);
  }
});

// POST /admin/ai-config/test
router.post('/ai-config/test', async (req, res, next) => {
  try {
    const cfg = getAiConfig();
    const { baseUrl, apiKey, model } = cfg;
    if (!apiKey) { fail(res, 400, '请先配置 API Key'); return; }

    const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
    const resp = await axios.post(url, {
      model,
      messages: [
        { role: 'system', content: '你是一个测试助手。' },
        { role: 'user', content: '回复"连接成功"四个字。' },
      ],
      max_tokens: 20,
    }, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      timeout: 15000,
    });

    const text = resp.data?.choices?.[0]?.message?.content || '';
    ok(res, { success: true, reply: text });
  } catch (e: any) {
    const msg = e.response?.data?.error?.message || e.message || '连接失败';
    ok(res, { success: false, reply: msg });
  }
});

// ========================================================================
// 文档管理（向量库状态查看）
// ========================================================================

// GET /admin/documents/stats
router.get('/documents/stats', async (_req, res) => {
  try {
    const { getRagStats } = await import('../services/ragService.js');
    const stats = await getRagStats();
    ok(res, stats);
  } catch {
    ok(res, { count: 0, sources: [] });
  }
});

export default router;
