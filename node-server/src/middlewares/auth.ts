/**
 * Auth 中间件 — JWT 校验 + 角色权限
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { fail } from '../utils/response.js';

const JWT_SECRET = process.env.JWT_SECRET || 'zd-knowledgepower-secret-key-2026';
const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
  userId: number;
  username: string;
  role: 'admin' | 'user' | 'guest';
}

// 扩展 Express Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 必须登录 — 未登录返回 401
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    fail(res, 401, '请先登录');
    return;
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET) as JwtPayload;
    next();
  } catch {
    fail(res, 401, 'Token 已过期，请重新登录');
  }
}

/**
 * 可选登录 — 有 token 则解析，没有则 req.user = { role: 'guest' }
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET) as JwtPayload;
      next();
      return;
    } catch {
      // token 无效，继续当游客
    }
  }
  req.user = { userId: 0, username: 'guest', role: 'guest' };
  next();
}

/**
 * 管理员权限校验（需先经过 requireAuth）
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    fail(res, 403, '权限不足');
    return;
  }
  next();
}
