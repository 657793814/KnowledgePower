import { PrismaClient } from '@prisma/client';
import mysql from 'mysql2/promise';

async function main() {
  const prisma = new PrismaClient();
  const conn = await mysql.createConnection({
    host: '127.0.0.1', port: 3306, user: 'root', password: 'root1234', database: 'mathverse',
    connectTimeout: 5000,
    charset: 'utf8mb4',
  });

  // Clear
  await conn.query('DELETE FROM knowledge_relation');
  await conn.query('DELETE FROM exam_answer');
  await conn.query('DELETE FROM exam_wrong_book');
  await conn.query('DELETE FROM exam_paper');
  await conn.query('DELETE FROM exam_question');
  await conn.query('DELETE FROM knowledge_node');
  await conn.query('DELETE FROM user');
  console.log('✅ Cleared');

  // Users
  const users = await prisma.user.findMany();
  if (users.length > 0) {
    await conn.query(
      'INSERT INTO user (id, username, password, nickname, avatar, role, created_at, updated_at) VALUES ?',
      [users.map(u => [u.id, u.username, u.password, u.nickname, u.avatar, u.role, u.createdAt, u.updatedAt])]
    );
  }
  console.log(`  → ${users.length} users`);

  // Nodes (batch insert 50 at a time)
  const nodes = await prisma.knowledgeNode.findMany({ orderBy: { sortOrder: 'asc' } });
  const nodeBatch = nodes.map(n => {
    const contentJson = typeof n.contentJson === 'string' ? n.contentJson : JSON.stringify(n.contentJson);
    return [n.id, n.title, n.subtitle, n.domain, n.subject, n.level, n.difficulty, n.sortOrder,
      n.visualType, n.summary, contentJson, n.milestoneType, (n as any).deleted ?? 0, n.status ?? 1,
      n.createdAt, n.updatedAt];
  });
  for (let i = 0; i < nodeBatch.length; i += 50) {
    const batch = nodeBatch.slice(i, i + 50);
    await conn.query(
      'INSERT INTO knowledge_node (id, title, subtitle, domain, subject, level, difficulty, sort_order, visual_type, summary, content_json, milestone_type, deleted, status, created_at, updated_at) VALUES ?',
      [batch]
    );
  }
  console.log(`  → ${nodes.length} nodes`);

  // Relations
  const relations = await prisma.knowledgeRelation.findMany();
  if (relations.length > 0) {
    const relBatch = relations.map(r => [r.id, r.fromNodeId, r.toNodeId, r.relationType, r.sortOrder, r.description, r.createdAt]);
    for (let i = 0; i < relBatch.length; i += 100) {
      await conn.query(
        'INSERT INTO knowledge_relation (id, from_node_id, to_node_id, relation_type, sort_order, description, created_at) VALUES ?',
        [relBatch.slice(i, i + 100)]
      );
    }
  }
  console.log(`  → ${relations.length} relations`);

  // Questions
  const questions = await prisma.examQuestion.findMany();
  if (questions.length > 0) {
    const qBatch = questions.map(q => [q.id, q.nodeId, q.subject, q.domain, q.level, q.questionType, q.difficulty, q.title, q.options, q.answer, q.explanation, q.createdAt, q.updatedAt]);
    for (let i = 0; i < qBatch.length; i += 100) {
      await conn.query(
        'INSERT INTO exam_question (id, node_id, subject, domain, level, question_type, difficulty, title, options, answer, explanation, created_at, updated_at) VALUES ?',
        [qBatch.slice(i, i + 100)]
      );
    }
  }
  console.log(`  → ${questions.length} questions`);

  await conn.end();
  await prisma.$disconnect();
  console.log('\n✅ Done!');
}

main().catch(e => {
  console.error('Failed:', e.message);
  process.exit(1);
});
