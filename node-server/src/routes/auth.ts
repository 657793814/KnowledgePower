/**
 * Auth 路由 — 登录 / 注册 / 用户管理
 * POST /auth/login         — 公开：用户名密码登录
 * POST /auth/register      — 管理员：创建用户
 * GET  /auth/profile       — 登录用户：获取个人信息
 * PUT  /auth/profile       — 登录用户：修改昵称
 * GET  /auth/users         — 管理员：用户列表
 * PUT  /auth/users/:id     — 管理员：修改用户角色/状态
 */
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db.js';
import { ok, fail } from '../utils/response.js';
import { signToken, requireAuth, requireAdmin, optionalAuth } from '../middlewares/auth.js';

const router = Router();

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      fail(res, 400, '用户名和密码不能为空');
      return;
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || user.status !== 1) {
      fail(res, 401, '用户名或密码错误');
      return;
    }

    const valid = await bcrypt.compare(password, user.password || '');
    if (!valid) {
      fail(res, 401, '用户名或密码错误');
      return;
    }

    const payload = { userId: user.id, username: user.username, role: user.role as 'admin' | 'user' };
    const token = signToken(payload);

    ok(res, {
      token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
});

// POST /auth/register — 管理员创建用户
router.post('/register', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { username, password, nickname, role } = req.body;
    if (!username || !password) {
      fail(res, 400, '用户名和密码不能为空');
      return;
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      fail(res, 400, '用户名已存在');
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashed,
        nickname: nickname || username,
        role: role || 'user',
      },
    });

    ok(res, {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      role: user.role,
    });
  } catch (e) {
    next(e);
  }
});

// GET /auth/profile
router.get('/profile', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) {
      fail(res, 404, '用户不存在');
      return;
    }
    const { password, ...safe } = user;
    ok(res, safe);
  } catch (e) {
    next(e);
  }
});

// PUT /auth/profile
router.put('/profile', requireAuth, async (req, res, next) => {
  try {
    const { nickname, avatar } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(nickname !== undefined && { nickname }),
        ...(avatar !== undefined && { avatar }),
      },
    });
    const { password, ...safe } = updated;
    ok(res, safe);
  } catch (e) {
    next(e);
  }
});

// GET /auth/users — 管理员列表
router.get('/users', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, nickname: true, avatar: true, role: true, status: true, createdAt: true, updatedAt: true },
      orderBy: { id: 'asc' },
    });
    ok(res, users);
  } catch (e) {
    next(e);
  }
});

// PUT /auth/users/:id — 管理员修改用户
router.put('/users/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { role, status } = req.body;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      fail(res, 404, '用户不存在');
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(role !== undefined && { role }),
        ...(status !== undefined && { status }),
      },
      select: { id: true, username: true, nickname: true, role: true, status: true },
    });
    ok(res, updated);
  } catch (e) {
    next(e);
  }
});

export default router;
