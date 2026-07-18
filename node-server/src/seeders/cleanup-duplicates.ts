import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function cleanup() {
  const allRelations = await prisma.knowledgeRelation.findMany({
    select: { id: true, fromNodeId: true, toNodeId: true, relationType: true, sortOrder: true },
  });

  const groups = {};
  for (const r of allRelations) {
    const key = r.fromNodeId + '|' + r.toNodeId + '|' + r.relationType;
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  }

  let removed = 0;
  for (const rels of Object.values(groups)) {
    if (rels.length > 1) {
      const best = rels.reduce((a, b) => (a.sortOrder > b.sortOrder ? a : b));
      for (const r of rels) {
        if (r.id !== best.id) {
          await prisma.knowledgeRelation.delete({ where: { id: r.id } });
          removed++;
        }
      }
    }
  }

  console.log('✅ 清理了', removed, '条重复关系');
  const after = await prisma.knowledgeRelation.count();
  console.log('剩余关系:', after);
  await prisma.$disconnect();
}

cleanup().catch(e => { console.error(e); process.exit(1); });
