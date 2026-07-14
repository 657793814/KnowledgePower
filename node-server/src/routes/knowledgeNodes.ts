/**
 * 知识点管理 — KnowledgeNodeController
 * GET/POST/PUT/DELETE /knowledge/nodes[/:id]
 */
import { Router } from 'express';
import prisma from '../db.js';
import { ok, fail } from '../utils/response.js';

const router = Router();

// 知识点列表（分页）
router.get('/', async (req, res, next) => {
  try {
    const { subject, domain, level, keyword, page = '1', pageSize = '20' } = req.query;
    const p = Math.max(1, parseInt(page as string, 10));
    const ps = Math.min(100, Math.max(1, parseInt(pageSize as string, 10)));

    const where: any = { status: 1, deleted: 0 };
    if (subject) where.subject = subject;
    if (domain) where.domain = domain;
    if (level) where.level = level;
    if (keyword) {
      const kw = keyword as string;
      where.OR = [
        { title: { contains: kw } },
        { summary: { contains: kw } },
      ];
    }

    const [list, total] = await Promise.all([
      prisma.knowledgeNode.findMany({
        where,
        orderBy: [{ domain: 'asc' }, { sortOrder: 'asc' }],
        skip: (p - 1) * ps,
        take: ps,
      }),
      prisma.knowledgeNode.count({ where }),
    ]);

    ok(res, {
      records: list,
      total,
      current: p,
      size: ps,
    });
  } catch (e) {
    next(e);
  }
});

// 知识点搜索
router.get('/search', async (req, res, next) => {
  try {
    const q = req.query.q as string;
    if (!q) {
      ok(res, []);
      return;
    }
    const list = await prisma.knowledgeNode.findMany({
      where: {
        status: 1,
        deleted: 0,
        OR: [
          { title: { contains: q } },
          { summary: { contains: q } },
          { domain: { contains: q } },
        ],
      },
      orderBy: [{ domain: 'asc' }, { sortOrder: 'asc' }],
    });
    ok(res, list);
  } catch (e) {
    next(e);
  }
});

// 知识点详情
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const node = await prisma.knowledgeNode.findUnique({ where: { id } });
    if (!node || node.deleted === 1) {
      fail(res, 404, '知识点不存在');
      return;
    }

    // 查询关系
    const allRelations = await prisma.knowledgeRelation.findMany({
      where: {
        OR: [{ fromNodeId: id }, { toNodeId: id }],
      },
    });

    // 解析关系
    const nodeIds = new Set<string>();
    allRelations.forEach(r => {
      if (r.fromNodeId !== id) nodeIds.add(r.fromNodeId);
      if (r.toNodeId !== id) nodeIds.add(r.toNodeId);
    });
    const relatedNodes = await prisma.knowledgeNode.findMany({
      where: { id: { in: Array.from(nodeIds) } },
    });
    const nodeMap = new Map(relatedNodes.map(n => [n.id, n.title]));

    const toRelationVO = (r: { [key: string]: any }, nodeId: string) => ({
      nodeId,
      title: nodeMap.get(nodeId) || '未知',
      relationType: r.relationType,
      description: r.description,
    });

    const prerequisites = allRelations
      .filter(r => r.relationType === 'prerequisite' && id === r.toNodeId)
      .map(r => toRelationVO(r, r.fromNodeId));

    const nextNodes = allRelations
      .filter(r => r.relationType === 'next' && id === r.fromNodeId)
      .map(r => toRelationVO(r, r.toNodeId));

    const references = allRelations
      .filter(r => r.relationType === 'reference')
      .map(r => {
        const otherId = id === r.fromNodeId ? r.toNodeId : r.fromNodeId;
        return toRelationVO(r, otherId);
      });

    // 解析 contentJson
    let contentJson: any = node.contentJson;
    if (node.contentJson) {
      try {
        contentJson = JSON.parse(node.contentJson);
      } catch {
        // 解析失败保持原字符串
        contentJson = node.contentJson;
      }
    }

    ok(res, {
      id: node.id,
      title: node.title,
      subtitle: node.subtitle,
      subject: node.subject,
      domain: node.domain,
      level: node.level,
      difficulty: node.difficulty,
      sortOrder: node.sortOrder,
      visualType: node.visualType,
      summary: node.summary,
      contentJson,
      milestoneType: node.milestoneType,
      status: node.status,
      prerequisites,
      nextNodes,
      references,
    });
  } catch (e) {
    next(e);
  }
});


// 新增知识点
router.post('/', async (req, res, next) => {
  try {
    const dto = req.body;
    const existing = await prisma.knowledgeNode.findUnique({ where: { id: dto.id } });
    if (existing) {
      fail(res, 400, '知识点 ID 已存在');
      return;
    }
    await prisma.knowledgeNode.create({
      data: {
        id: dto.id,
        title: dto.title,
        subtitle: dto.subtitle || null,
        domain: dto.domain,
        level: dto.level,
        difficulty: dto.difficulty || 1,
        sortOrder: dto.sortOrder || 0,
        visualType: dto.visualType || null,
        summary: dto.summary || null,
        contentJson: typeof dto.contentJson === 'object' ? JSON.stringify(dto.contentJson) : dto.contentJson || null,
        milestoneType: dto.milestoneType || null,
        status: dto.status ?? 1,
      },
    });
    ok(res, null);
  } catch (e) {
    next(e);
  }
});

// 更新知识点
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.knowledgeNode.findUnique({ where: { id } });
    if (!existing || existing.deleted === 1) {
      fail(res, 404, '知识点不存在');
      return;
    }
    const dto = req.body;
    await prisma.knowledgeNode.update({
      where: { id },
      data: {
        title: dto.title,
        subtitle: dto.subtitle || null,
        domain: dto.domain,
        level: dto.level,
        difficulty: dto.difficulty,
        sortOrder: dto.sortOrder,
        visualType: dto.visualType || null,
        summary: dto.summary || null,
        contentJson: typeof dto.contentJson === 'object' ? JSON.stringify(dto.contentJson) : dto.contentJson || null,
        milestoneType: dto.milestoneType || null,
        status: dto.status,
      },
    });
    ok(res, null);
  } catch (e) {
    next(e);
  }
});

// 删除知识点
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.knowledgeNode.findUnique({ where: { id } });
    if (!existing || existing.deleted === 1) {
      fail(res, 404, '知识点不存在');
      return;
    }
    // 逻辑删除
    await prisma.knowledgeNode.update({
      where: { id },
      data: { deleted: 1 },
    });
    // 同时删除相关关系
    await prisma.knowledgeRelation.deleteMany({
      where: {
        OR: [{ fromNodeId: id }, { toNodeId: id }],
      },
    });
    ok(res, null);
  } catch (e) {
    next(e);
  }
});

export default router;
