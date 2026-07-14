/**
 * 知识点关系管理 — KnowledgeRelationController
 * POST/DELETE /knowledge/relations[/:id]
 */
import { Router } from 'express';
import prisma from '../db.js';
import { ok, fail } from '../utils/response.js';

const router = Router();

// 新增关系
router.post('/', async (req, res, next) => {
  try {
    const { fromNodeId, toNodeId, relationType, description, sortOrder } = req.body;
    await prisma.knowledgeRelation.create({
      data: {
        fromNodeId,
        toNodeId,
        relationType,
        description: description || null,
        sortOrder: sortOrder || 0,
      },
    });
    ok(res, null);
  } catch (e) {
    next(e);
  }
});

// 删除关系
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.knowledgeRelation.delete({ where: { id } });
    ok(res, null);
  } catch (e: any) {
    if (e.code === 'P2025') {
      fail(res, 404, '关系不存在');
      return;
    }
    next(e);
  }
});

export default router;
