import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const p = new PrismaClient();

console.log('MATH-04-014 题目数:', await p.examQuestion.count({ where: { nodeId: 'MATH-04-014' } }));
console.log('MATH-09 集合节点数:', await p.node.count({ where: { nodeId: { startsWith: 'MATH-09-' } } }));

const models = await p.node.findMany({ 
  where: { visualType: 'model', domain: '函数' }, 
  select: { nodeId: true, title: true } 
});
for (const m of models) {
  const c = await p.examQuestion.count({ where: { nodeId: m.nodeId } });
  if (c > 0) console.log(m.nodeId, m.title, '→', c, '题');
}

await p.$disconnect();
