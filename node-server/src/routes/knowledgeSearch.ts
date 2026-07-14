/**
 * 知识搜索 — KnowledgeSearchController
 * GET /knowledge/search?q=xxx
 */
import { Router } from 'express';
import prisma from '../db.js';
import { ok } from '../utils/response.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const q = req.query.q as string;
    const subject = req.query.subject as string;
    if (!q) {
      ok(res, []);
      return;
    }
    const where: any = {
      status: 1,
      deleted: 0,
      OR: [
        { title: { contains: q } },
        { summary: { contains: q } },
      ],
    };
    if (subject) where.subject = subject;
    const results = await prisma.knowledgeNode.findMany({
      where,
      take: 20,
    });
    ok(res, results);
  } catch (e) {
    next(e);
  }
});

export default router;
