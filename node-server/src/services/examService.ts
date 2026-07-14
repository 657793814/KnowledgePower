/**
 * ExamService — 考试模块业务逻辑
 * 对应 Java 侧的 ExamService.java
 */
import { PrismaClient, ExamQuestion } from '@prisma/client';

export function buildExamService(prisma: PrismaClient) {

  // ========== 自动组卷 ==========

  async function autoGenerate(req: {
    domain?: string;
    level?: string;
    count: number;
    mode: string;
    timeLimit?: number;
  }) {
    const where: any = { status: 1, deleted: 0 };
    if (req.domain) where.domain = req.domain;
    if (req.level) where.level = req.level;

    const all = await prisma.examQuestion.findMany({ where });
    // Fisher-Yates shuffle
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }

    const count = Math.min(req.count, all.length);
    const picked = all.slice(0, count);

    // 创建试卷
    const questionIds = picked.map(q => q.id).join(',');

    const paper = await prisma.examPaper.create({
      data: {
        title: req.domain
          ? `${req.domain} · ${req.mode === 'exam' ? '考试' : '练习'}`
          : `综合${req.mode === 'exam' ? '考试' : '练习'}`,
        domain: req.domain || null,
        level: req.level || null,
        mode: req.mode,
        questionCount: count,
        timeLimit: req.timeLimit || null,
        allowRetry: req.mode === 'practice' ? 1 : 0,
        questionIds,
      },
    });

    // 构建 VO（不含答案）
    const questionsVO = await Promise.all(picked.map(q => toQuestionVO(q)));

    return {
      id: paper.id,
      title: paper.title,
      domain: paper.domain,
      level: paper.level,
      mode: paper.mode,
      questionCount: count,
      timeLimit: paper.timeLimit,
      allowRetry: paper.allowRetry,
      questions: questionsVO,
    };
  }

  // ========== 获取试卷（不含答案） ==========

  async function getPaper(paperId: number) {
    const paper = await prisma.examPaper.findUnique({ where: { id: paperId } });
    if (!paper) return null;

    const qIds = paper.questionIds.split(',').map(Number);
    const questions = await prisma.examQuestion.findMany({
      where: { id: { in: qIds } },
    });
    // 保持原顺序
    const sorted = qIds.map(id => questions.find(q => q.id === id)!).filter(Boolean);
    const questionsVO = await Promise.all(sorted.map(q => toQuestionVO(q)));

    return {
      id: paper.id,
      title: paper.title,
      domain: paper.domain,
      level: paper.level,
      mode: paper.mode,
      questionCount: paper.questionCount,
      timeLimit: paper.timeLimit,
      allowRetry: paper.allowRetry,
      questions: questionsVO,
    };
  }

  async function toQuestionVO(q: ExamQuestion) {
    let nodeTitle: string | undefined;
    if (q.nodeId) {
      const node = await prisma.knowledgeNode.findUnique({ where: { id: q.nodeId } });
      nodeTitle = node?.title || q.nodeId;
    }
    return {
      id: q.id,
      nodeId: q.nodeId,
      nodeTitle,
      domain: q.domain,
      level: q.level,
      questionType: q.questionType,
      difficulty: q.difficulty,
      title: q.title,
      options: q.options,
      explanation: q.explanation,
      tags: q.tags,
    };
  }

  // ========== 自由练习（随机出题） ==========

  async function getRandomQuestions(subject?: string, domain?: string, level?: string, count: number = 10) {
    const where: any = { status: 1, deleted: 0 };
    if (subject) where.subject = subject;
    if (domain) where.domain = domain;
    if (level) where.level = level;

    const all = await prisma.examQuestion.findMany({ where });
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    const n = Math.min(count, all.length);
    return Promise.all(all.slice(0, n).map(q => toQuestionVO(q)));
  }

  // ========== 提交批改 ==========

  async function submitAnswers(userId: number, req: {
    paperId?: number;
    answers: { questionId: number; userAnswer: string }[];
  }) {
    const qIds = req.answers.map(a => a.questionId);
    const questions = await prisma.examQuestion.findMany({
      where: { id: { in: qIds } },
    });
    const qMap = new Map(questions.map(q => [q.id, q]));

    let correct = 0;
    const details: any[] = [];

    for (const a of req.answers) {
      const eq = qMap.get(a.questionId);
      if (!eq) continue;

      const isCorrect = eq.answer.trim().toLowerCase() === a.userAnswer.trim().toLowerCase();
      if (isCorrect) correct++;

      // 记录答题
      await prisma.examAnswer.create({
        data: {
          userId,
          paperId: req.paperId || null,
          questionId: a.questionId,
          nodeId: eq.nodeId || null,
          userAnswer: a.userAnswer,
          isCorrect: isCorrect ? 1 : 0,
          score: isCorrect ? 100.0 / req.answers.length : 0,
          submittedAt: new Date(),
        },
      });

      details.push({
        questionId: a.questionId,
        userAnswer: a.userAnswer,
        correctAnswer: eq.answer,
        correct: isCorrect,
        explanation: eq.explanation,
      });

      // 错题自动加入错题本
      if (!isCorrect) {
        await addToWrongBook(userId, a.questionId, eq.nodeId || undefined);
      }
    }

    return {
      paperId: req.paperId || null,
      totalCount: req.answers.length,
      correctCount: correct,
      wrongCount: req.answers.length - correct,
      score: (correct / req.answers.length) * 100,
      details,
    };
  }

  // ========== 错题本 ==========

  async function addToWrongBook(userId: number, questionId: number, nodeId?: string) {
    const existing = await prisma.examWrongBook.findFirst({
      where: { userId, questionId },
    });
    if (!existing) {
      await prisma.examWrongBook.create({
        data: { userId, questionId, nodeId: nodeId || null, reviewCount: 0 },
      });
    }
  }

  async function getWrongBook(userId: number, page: number, pageSize: number) {
    const where = { userId };
    const [list, total] = await Promise.all([
      prisma.examWrongBook.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.examWrongBook.count({ where }),
    ]);

    const vos = await Promise.all(list.map(async (wb) => {
      const q = await prisma.examQuestion.findUnique({ where: { id: wb.questionId } });
      if (!q) return null;
      let nodeTitle: string | undefined;
      if (q.nodeId) {
        const node = await prisma.knowledgeNode.findUnique({ where: { id: q.nodeId } });
        nodeTitle = node?.title || q.nodeId;
      }
      return {
        questionId: q.id,
        title: q.title,
        questionType: q.questionType,
        nodeId: q.nodeId,
        nodeTitle,
        domain: q.domain,
        correctAnswer: q.answer,
        explanation: q.explanation,
        reviewCount: wb.reviewCount,
      };
    }));

    return {
      records: vos.filter(Boolean),
      total,
      current: page,
      size: pageSize,
    };
  }

  async function removeFromWrongBook(userId: number, questionId: number) {
    await prisma.examWrongBook.deleteMany({
      where: { userId, questionId },
    });
  }

  async function markReviewed(userId: number, questionId: number) {
    const wb = await prisma.examWrongBook.findFirst({
      where: { userId, questionId },
    });
    if (wb) {
      await prisma.examWrongBook.update({
        where: { id: wb.id },
        data: {
          reviewCount: wb.reviewCount + 1,
          lastReviewAt: new Date(),
        },
      });
    }
  }

  // ========== 学习统计 ==========

  async function getStats(userId: number, subject?: string) {
    const answerWhere: any = { userId };
    if (subject) {
      const subjQuestions = await prisma.examQuestion.findMany({
        where: { subject, status: 1, deleted: 0 },
        select: { id: true },
      });
      answerWhere.questionId = { in: subjQuestions.map(q => q.id) };
    }
    const allAnswers = await prisma.examAnswer.findMany({ where: answerWhere });

    const total = allAnswers.length;
    const correct = allAnswers.filter(a => a.isCorrect === 1).length;
    const wrongBookWhere: any = { userId };
    if (subject) {
      const subjQuestions = await prisma.examQuestion.findMany({
        where: { subject, status: 1, deleted: 0 },
        select: { id: true },
      });
      wrongBookWhere.questionId = { in: subjQuestions.map(q => q.id) };
    }
    const wrongBookCount = await prisma.examWrongBook.count({ where: wrongBookWhere });

    // 按领域统计
    const qIds = [...new Set(allAnswers.map(a => a.questionId))];
    const questions = await prisma.examQuestion.findMany({
      where: { id: { in: qIds } },
    });
    const qDomainMap = new Map(questions.map(q => [q.id, q.domain || '未知']));

    const domainMap = new Map<string, { answered: number; correct: number }>();
    for (const a of allAnswers) {
      const domain = qDomainMap.get(a.questionId) || '未知';
      const entry = domainMap.get(domain) || { answered: 0, correct: 0 };
      entry.answered++;
      if (a.isCorrect === 1) entry.correct++;
      domainMap.set(domain, entry);
    }

    const domainStats = Array.from(domainMap.entries()).map(([domain, s]) => ({
      domain,
      answered: s.answered,
      correct: s.correct,
      accuracyRate: s.answered > 0 ? Math.round((s.correct / s.answered) * 1000) / 10 : 0,
    }));

    return {
      totalAnswered: total,
      totalCorrect: correct,
      accuracyRate: total > 0 ? Math.round((correct / total) * 1000) / 10 : 0,
      wrongBookCount,
      domainStats,
    };
  }

  return {
    autoGenerate,
    getPaper,
    getRandomQuestions,
    submitAnswers,
    getWrongBook,
    removeFromWrongBook,
    markReviewed,
    getStats,
  };
}
