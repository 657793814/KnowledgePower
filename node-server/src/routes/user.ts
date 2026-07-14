/**
 * 用户管理 — UserController
 * GET /user/info
 */
import { Router } from 'express';
import prisma from '../db.js';
import { ok, fail } from '../utils/response.js';

const router = Router();

// 获取当前用户信息（简化，暂未接入认证）
router.get('/info', async (_req, res, next) => {
  try {
    const user = await prisma.user.findFirst({ where: { status: 1 } });
    if (!user) {
      fail(res, 404, '未找到用户');
      return;
    }
    // 脱敏密码
    const { password, ...safe } = user;
    ok(res, safe);
  } catch (e) {
    next(e);
  }
});

export default router;
