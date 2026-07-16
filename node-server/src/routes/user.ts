/**
 * 用户管理（旧占位路由 — 已迁移到 auth.ts）
 * 保留此文件仅用于兼容，所有功能已移到 routes/auth.ts
 */
import { Router } from 'express';
import prisma from '../db.js';
import { ok, fail } from '../utils/response.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// 简化的当前用户信息（旧版兼容）
router.get('/info', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) {
      fail(res, 404, '未找到用户');
      return;
    }
    const { password, ...safe } = user;
    ok(res, safe);
  } catch (e) {
    next(e);
  }
});

export default router;
