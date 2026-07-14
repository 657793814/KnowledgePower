/**
 * 知识图谱查询 — KnowledgeGraphController
 * GET /knowledge/graph[/:domain]
 */
import { Router } from 'express';
import prisma from '../db.js';
import { ok } from '../utils/response.js';

const router = Router();

// 获取全量知识图谱
router.get('/', async (req, res, next) => {
  try {
    const { subject } = req.query;
    const where: any = { status: 1, deleted: 0 };
    if (subject) where.subject = subject;

    const nodes = await prisma.knowledgeNode.findMany({
      where,
      orderBy: [{ subject: 'asc' }, { domain: 'asc' }, { sortOrder: 'asc' }],
    });
    const nodeIds = nodes.map(n => n.id);

    const edges = nodeIds.length > 0
      ? await prisma.knowledgeRelation.findMany({
          where: {
            OR: [
              { fromNodeId: { in: nodeIds } },
              { toNodeId: { in: nodeIds } },
            ],
          },
        })
      : [];

    ok(res, {
      nodes: nodes.map(n => ({
        id: n.id,
        label: n.title,
        subject: n.subject,
        domain: n.domain,
        level: n.level,
        difficulty: n.difficulty,
        visualType: n.visualType,
        summary: n.summary,
        isMilestone: n.milestoneType !== null,
        sortOrder: n.sortOrder,
      })),
      edges: edges.map(e => ({
        source: e.fromNodeId,
        target: e.toNodeId,
        type: e.relationType,
        description: e.description,
      })),
    });
  } catch (e) {
    next(e);
  }
});

// 按领域获取知识图谱
router.get('/:domain', async (req, res, next) => {
  try {
    const { domain } = req.params;
    const { subject } = req.query;
    const where: any = { domain, status: 1, deleted: 0 };
    if (subject) where.subject = subject;
    const nodes = await prisma.knowledgeNode.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    const nodeIds = nodes.map(n => n.id);

    const edges = nodeIds.length > 0
      ? await prisma.knowledgeRelation.findMany({
          where: {
            OR: [
              { fromNodeId: { in: nodeIds } },
              { toNodeId: { in: nodeIds } },
            ],
          },
        })
      : [];

    ok(res, {
      nodes: nodes.map(n => ({
        id: n.id,
        label: n.title,
        subject: n.subject,
        domain: n.domain,
        level: n.level,
        difficulty: n.difficulty,
        visualType: n.visualType,
        summary: n.summary,
        isMilestone: n.milestoneType !== null,
        sortOrder: n.sortOrder,
      })),
      edges: edges.map(e => ({
        source: e.fromNodeId,
        target: e.toNodeId,
        type: e.relationType,
        description: e.description,
      })),
    });
  } catch (e) {
    next(e);
  }
});

export default router;
