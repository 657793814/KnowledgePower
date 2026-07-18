/**
 * Database Auto-Initialization
 *
 * 首次启动时自动创建表结构和种子数据（作为 Rust 侧复制预置数据库的 fallback）。
 * 幂等运行，支持重复调用。
 */
import prisma from './db.js';
import bcrypt from 'bcryptjs';

async function tableExists(name: string): Promise<boolean> {
  try {
    const result = await prisma.$queryRawUnsafe<{ count: number }[]>(
      `SELECT COUNT(*) AS count FROM sqlite_master WHERE type='table' AND name=?`,
      name
    );
    return result[0]?.count > 0;
  } catch {
    return false;
  }
}

async function ensureTable(name: string, ddl: string): Promise<boolean> {
  const exists = await tableExists(name);
  if (!exists) {
    try {
      await prisma.$executeRawUnsafe(ddl);
      console.log(`[init-db] ✓ 创建表: ${name}`);
      return true;
    } catch (e) {
      console.warn(`[init-db] ✗ 创建表失败: ${name}`, e);
      return false;
    }
  }
  return false;
}

export async function initializeDatabase(): Promise<void> {
  console.log('[init-db] 检查数据库状态...');

  // ===== 创建表结构 =====
  await ensureTable('User', `
    CREATE TABLE IF NOT EXISTS "User" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "username" TEXT NOT NULL UNIQUE,
      "password" TEXT,
      "nickname" TEXT,
      "avatar" TEXT,
      "role" TEXT NOT NULL DEFAULT 'user',
      "status" INTEGER NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureTable('KnowledgeNode', `
    CREATE TABLE IF NOT EXISTS "KnowledgeNode" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "subtitle" TEXT,
      "subject" TEXT NOT NULL DEFAULT 'math',
      "domain" TEXT NOT NULL,
      "level" TEXT NOT NULL,
      "difficulty" INTEGER NOT NULL DEFAULT 1,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "visualType" TEXT,
      "summary" TEXT,
      "contentJson" TEXT,
      "milestoneType" TEXT,
      "deleted" INTEGER NOT NULL DEFAULT 0,
      "status" INTEGER NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureTable('KnowledgeRelation', `
    CREATE TABLE IF NOT EXISTS "KnowledgeRelation" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "fromNodeId" TEXT NOT NULL,
      "toNodeId" TEXT NOT NULL,
      "relationType" TEXT NOT NULL,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "description" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureTable('ExamQuestion', `
    CREATE TABLE IF NOT EXISTS "ExamQuestion" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "nodeId" TEXT,
      "subject" TEXT NOT NULL DEFAULT 'math',
      "domain" TEXT,
      "level" TEXT,
      "questionType" TEXT NOT NULL,
      "difficulty" INTEGER NOT NULL DEFAULT 1,
      "title" TEXT NOT NULL,
      "options" TEXT,
      "answer" TEXT NOT NULL,
      "explanation" TEXT,
      "tags" TEXT,
      "deleted" INTEGER NOT NULL DEFAULT 0,
      "status" INTEGER NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureTable('ExamPaper', `
    CREATE TABLE IF NOT EXISTS "ExamPaper" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "title" TEXT NOT NULL,
      "domain" TEXT,
      "level" TEXT,
      "mode" TEXT NOT NULL,
      "questionCount" INTEGER NOT NULL,
      "timeLimit" INTEGER,
      "allowRetry" INTEGER NOT NULL DEFAULT 0,
      "questionIds" TEXT NOT NULL,
      "createdBy" INTEGER,
      "deleted" INTEGER NOT NULL DEFAULT 0,
      "status" INTEGER NOT NULL DEFAULT 1,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureTable('ExamAnswer', `
    CREATE TABLE IF NOT EXISTS "ExamAnswer" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "userId" INTEGER NOT NULL,
      "paperId" INTEGER,
      "questionId" INTEGER NOT NULL,
      "nodeId" TEXT,
      "userAnswer" TEXT NOT NULL,
      "isCorrect" INTEGER NOT NULL DEFAULT 0,
      "score" REAL,
      "timeSpent" INTEGER,
      "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureTable('ExamWrongBook', `
    CREATE TABLE IF NOT EXISTS "ExamWrongBook" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "userId" INTEGER NOT NULL,
      "questionId" INTEGER NOT NULL,
      "nodeId" TEXT,
      "reviewCount" INTEGER NOT NULL DEFAULT 0,
      "lastReviewAt" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // ===== 种子数据：管理员用户 =====
  const userCount = await prisma.user.count();
  console.log(`[init-db] 用户数: ${userCount}`);

  if (userCount === 0) {
    const hashed = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashed,
        nickname: '管理员',
        role: 'admin',
      },
    });
    console.log('[init-db] ✓ 创建管理员用户 (admin / admin123)');
  }

  // ===== 种子数据：知识点概览 =====
  const nodeCount = await prisma.knowledgeNode.count();
  console.log(`[init-db] 知识点数: ${nodeCount}`);

  if (nodeCount === 0) {
    console.log('[init-db] 知识点为空，请运行 npm run seed 初始化完整数据');
    console.log('[init-db] 目前仅有管理员用户可用，知识点数据需要手动初始化');
  }

  console.log('[init-db] ✅ 数据库初始化完成');
}
