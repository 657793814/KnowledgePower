/**
 * 知识搜索 — KnowledgeSearchController
 * GET /knowledge/search?q=xxx&subject=math&page=1&pageSize=20
 */
import { Router } from 'express';
import prisma from '../db.js';
import { ok } from '../utils/response.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const q = req.query.q as string;
    const subject = req.query.subject as string;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize as string) || 20));
    
    if (!q || !q.trim()) {
      ok(res, { items: [], total: 0, page: 1, pageSize });
      return;
    }

    const where: any = {
      status: 1,
      deleted: 0,
      OR: [
        { title: { contains: q.trim() } },
        { summary: { contains: q.trim() } },
      ],
    };
    if (subject) where.subject = subject;

    const [items, total] = await Promise.all([
      prisma.knowledgeNode.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      }),
      prisma.knowledgeNode.count({ where }),
    ]);

    ok(res, { items, total, page, pageSize });
  } catch (e) {
    next(e);
  }
});

export default router;
