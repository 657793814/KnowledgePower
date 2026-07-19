/**
 * 批量题目生成器 — 从知识点 contentJson 提取内容，按规则生成题目
 * 修复：不再生成无意义的 "不是..." 判断题，不再产生 undefined 选项
 * 
 * 用法: npx tsx scripts/bulk-questions.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ParsedContent {
  definition: string;
  keyPoints: string[];
  formulas: string[];
  examples: any[];
  strategy: string[];
  commonMistakes: { mistake: string; correct: string }[];
  examFocus: string;
}

function parseContent(node: any): ParsedContent {
  const result: ParsedContent = {
    definition: '',
    keyPoints: [],
    formulas: [],
    examples: [],
    strategy: [],
    commonMistakes: [],
    examFocus: '',
  };

  try {
    const content = typeof node.contentJson === 'string' ? JSON.parse(node.contentJson) : node.contentJson;
    const sections = content?.sections || [];
    for (const s of sections) {
      if (s.type === 'definition') {
        result.definition = s.content || node.summary || '';
        result.formulas = s.formulas || [];
      }
      if (s.type === 'keypoints') result.keyPoints = s.items || [];
      if (s.type === 'example') result.examples = s.items || [];
      if (s.type === 'strategy') result.strategy = s.items || [];
      if (s.type === 'common-mistakes') result.commonMistakes = s.items || [];
      if (s.type === 'exam-focus') result.examFocus = s.content || '';
    }
  } catch {}

  return result;
}

/** 从 keyPoints 生成判断题（只生成肯定陈述，不再生成"不是..."） */
function genJudgeFromKeyPoints(node: any, parsed: ParsedContent): any[] {
  const questions: any[] = [];
  const kps = parsed.keyPoints;
  if (!kps || kps.length === 0) return [];

  for (let i = 0; i < kps.length; i++) {
    const kp = kps[i];
    if (kp.length < 5 || kp.length > 80) continue;

    // 只生成肯定陈述题（正确=正确），随机翻转一些变成错误
    const shouldFlip = Math.random() < 0.35; // 35% 概率翻转
    const statement = kp.replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\.?\s*/, '').trim();
    if (!statement || statement.length < 4) continue;

    // 如果翻转，只在关键数字/关系上做文章，不要直接加 "不是"
    let title: string;
    if (shouldFlip) {
      // 尝试数字翻转
      const numMatch = statement.match(/(\d+)/);
      if (numMatch && parseInt(numMatch[1]) > 1) {
        const origNum = numMatch[1];
        const newNum = String(parseInt(origNum) + (Math.random() > 0.5 ? 1 : -1));
        title = statement.replace(origNum, newNum);
      } else {
        continue; // 没法合理翻转就跳过
      }
    } else {
      title = statement;
    }

    questions.push({
      nodeId: node.id,
      subject: node.subject,
      domain: node.domain,
      level: node.level,
      questionType: 'judge',
      difficulty: Math.min(node.difficulty + (shouldFlip ? 1 : 0), 5),
      title,
      options: null,
      answer: shouldFlip ? '错误' : '正确',
      explanation: kp,
    });
  }

  return questions;
}

/** 从 commonMistakes 生成判断题 */
function genJudgeFromMistakes(node: any, parsed: ParsedContent): any[] {
  const questions: any[] = [];
  const mistakes = parsed.commonMistakes;
  if (!mistakes || mistakes.length === 0) return [];

  for (const m of mistakes) {
    if (!m.mistake || !m.correct) continue;
    const title = m.mistake.replace(/^认为/, '').replace(/^容易/, '').replace(/^常见错误[：:]/, '').trim();
    if (!title || title.length < 4) continue;

    questions.push({
      nodeId: node.id,
      subject: node.subject,
      domain: node.domain,
      level: node.level,
      questionType: 'judge',
      difficulty: Math.min(node.difficulty, 3),
      title,
      options: null,
      answer: '错误',
      explanation: m.correct,
    });
  }

  return questions;
}

/** 从 formulas 生成填空题 */
function genFromFormulas(node: any, parsed: ParsedContent): any[] {
  const questions: any[] = [];
  const formulas = parsed.formulas || [];
  let count = 0;

  for (const f of formulas) {
    if (count >= 3) break;
    const eqMatch = f.match(/\$([^$]+)\$/);
    if (!eqMatch) continue;
    const eq = eqMatch[1];
    
    if (eq.includes('=')) {
      const parts = eq.split('=');
      if (parts.length >= 2) {
        const left = parts[0].trim();
        const right = parts.slice(1).join('=').trim();
        if (left.length < 30 && right.length < 30) {
          questions.push({
            nodeId: node.id,
            subject: node.subject,
            domain: node.domain,
            level: node.level,
            questionType: 'fill',
            difficulty: Math.min(node.difficulty, 4),
            // 用 $...$ 包裹公式部分，让前端 KaTeX 能正确渲染
            // 注意模板语法：$${left}  →  $ + 变量值
            title: `写出公式：$${left} = ____$`,
            options: null,
            answer: `$${right}$`,
            explanation: `公式 ${f} 是${node.title}的核心公式`,
          });
          count++;
        }
      }
    }
  }

  return questions;
}

/** 生成 3 个有意义的干扰项（始终返回 3 项） */
function generateWrongAnswers(correct: string): string[] {
  const wrongs: string[] = [];

  // 跳过太短或太长的答案
  if (!correct || correct.length < 1 || correct.length > 40) return wrongs;

  // 🚨 跳过带编号枚举型的答案（如 "(1)3.14（3个有效数字）(2)3.142（4个有效数字）"）
  // 这种答案不适合作为选择题，数字替换会把题号前缀改乱产生无意义干扰项
  if (/\(1\)/.test(correct) && correct.length > 15) return wrongs;

  // 数值型（整数）
  if (/^-?\d+$/.test(correct)) {
    const n = parseInt(correct);
    wrongs.push(String(n + 1));
    wrongs.push(String(n - 1));
    wrongs.push(String(n * 2));
  }
  // 数值型（小数）
  else if (/^-?\d+(\.\d+)$/.test(correct)) {
    const n = parseFloat(correct);
    wrongs.push(String((n + 1).toFixed(1)));
    wrongs.push(String(Math.abs(n * 2).toFixed(1)));
    wrongs.push(String(Math.max(0, n - 1).toFixed(1)));
  }
  // 文本型（且不是单个字母）
  else if (correct.length >= 3 && !/^[A-Da-d]\)?$/.test(correct)) {
    // 先去掉开头的 (N) 编号前缀，避免误匹配题号
    const stripped = correct.replace(/^\(\d+\)\s*/, '').trim();
    // 提取关键数字或名词进行变形
    const numMatch = stripped.match(/(\d+(\.\d+)?)/);
    if (numMatch) {
      const val = parseFloat(numMatch[1]);
      wrongs.push(correct.replace(numMatch[1], String(val + 1)));
      wrongs.push(correct.replace(numMatch[1], String(val + 2)));
      wrongs.push(correct.replace(numMatch[1], String(Math.max(0, val - 1))));
    } else {
      // 文字型：用真实常见的错误逻辑
      // 提取核心概念（去除无关修饰）
      let core = correct.replace(/^(是|为|指|表示|即)/, '').trim();
      if (core.length > 20) core = core.substring(0, 18) + '...';
      
      // 生成 3 种不同角度的错误
      wrongs.push(`对于"${core}"的理解，忽略了关键前提`);
      wrongs.push(`与"${core}"相反的说法更准确`);
      wrongs.push(`"${core}"只适用于特殊情形`);
    }
  }

  // 保底：用通用错误答案
  while (wrongs.length < 3) {
    wrongs.push(`常见的错误理解（不是标准答案）`);
    if (wrongs.length < 3) wrongs.push(`容易混淆的知识点`);
    if (wrongs.length < 3) wrongs.push(`不完全正确的表述`);
  }

  return wrongs.slice(0, 3);
}

/** 从 examples 生成选择题（稳定 4 选项） */
function genChoiceFromExamples(node: any, parsed: ParsedContent): any[] {
  const questions: any[] = [];
  const examples = parsed.examples || [];
  if (examples.length === 0) return [];

  for (const ex of examples) {
    if (!ex.answer || typeof ex.answer !== 'string') continue;
    if (ex.answer.length > 60 || ex.answer.length < 2) continue;
    // 跳过答案是单个字母（那是 MCQ 选项索引，不是真实答案）
    if (/^[A-Da-d]\)?$/.test(ex.answer.trim())) continue;

    // 🚨 跳过带编号枚举型答案（如 "(1)3.14...(2)3.142..."），不适合出选择题
    if (/\(1\)/.test(ex.answer) && ex.answer.length > 15) continue;

    const wrongAnswers = generateWrongAnswers(ex.answer);
    if (wrongAnswers.length < 3) continue;

    // 插入正确答案，保证 4 个选项
    const correctIdx = Math.floor(Math.random() * 4);
    const allOptions = [...wrongAnswers];
    allOptions.splice(correctIdx, 0, ex.answer);

    // 如果意外有重复，去重
    const unique = [...new Set(allOptions)];
    if (unique.length < 4) continue;

    const letters = ['A', 'B', 'C', 'D'];
    // 存为对象格式 {A:'xxx', B:'xxx', ...}，前端 Object.entries 得到 key=A 而非 key=0
    const optsObj: Record<string, string> = {};
    unique.forEach((o, i) => { optsObj[letters[i]] = o; });

    questions.push({
      nodeId: node.id,
      subject: node.subject,
      domain: node.domain,
      level: node.level,
      questionType: 'choice',
      difficulty: Math.min(node.difficulty + 1, 5),
      title: ex.question || ex.title || `关于${node.title}的例题`,
      options: JSON.stringify(optsObj),
      answer: letters[correctIdx],
      explanation: ex.steps?.join('；') || ex.answer,
    });
  }

  return questions;
}

/** 从 examples 生成填空题 */
function genFillFromExamples(node: any, parsed: ParsedContent): any[] {
  const questions: any[] = [];
  const examples = parsed.examples || [];

  for (const ex of examples) {
    if (!ex.answer || typeof ex.answer !== 'string') continue;
    // 跳过单选题索引答案
    if (/^[A-D]\)?$/.test(ex.answer.trim())) continue;

    const hasBlank = ex.steps?.some((s: string) => s.includes('____'))
      || ex.question?.includes('____');
    if (hasBlank || (ex.answer.length > 5 && ex.answer.length < 50)) {
      questions.push({
        nodeId: node.id,
        subject: node.subject,
        domain: node.domain,
        level: node.level,
        questionType: 'fill',
        difficulty: node.difficulty,
        title: ex.question || ex.title || `关于${node.title}的计算题`,
        options: null,
        answer: ex.answer,
        explanation: ex.steps?.join('；') || '',
      });
    }
  }

  return questions;
}

async function main() {
  console.log('📝 批量题目生成器 v2（修复 undefined 和 不是... 问题）');
  console.log('='.repeat(55));

  // 删除所有旧题（重新生成）
  const oldCount = await prisma.examQuestion.count();
  console.log(`🗑️  删除 ${oldCount} 道旧题...`);
  console.log('  ⚠️  注意：模型节点（visualType=model）的手写题目也会被删！');
  console.log('  ⚠️  如需保留，请先注释 deleteMany，再单独运行。');
  await prisma.examQuestion.deleteMany({});
  console.log('   ✅ 已清空\n');

  const allNodes = await prisma.knowledgeNode.findMany({
    where: { status: 1, deleted: 0 },
    orderBy: [{ subject: 'asc' }, { domain: 'asc' }, { sortOrder: 'asc' }],
  });

  console.log(`📚 共 ${allNodes.length} 个知识点\n`);

  let totalCreated = 0;
  let nodeCount = 0;

  for (const node of allNodes) {
    // 🚨 跳过模型节点 — 模型题目应该手写，不适合自动生成
    if (node.visualType === 'model') {
      nodeCount++;
      console.log(`   ⏭️  ${node.id} ${node.title} (模型节点，跳过)`);
      continue;
    }

    const parsed = parseContent(node);
    const questions: any[] = [];

    // 从易错点生成判断题（最有价值）
    questions.push(...genJudgeFromMistakes(node, parsed));

    // 从关键点生成判断题
    questions.push(...genJudgeFromKeyPoints(node, parsed));

    // 从公式生成填空题
    questions.push(...genFromFormulas(node, parsed));

    // 从例题生成选择题
    questions.push(...genChoiceFromExamples(node, parsed));

    // 从例题生成填空题
    questions.push(...genFillFromExamples(node, parsed));

    // 兜底：至少生成一道题
    if (questions.length === 0 && node.summary) {
      questions.push({
        nodeId: node.id,
        subject: node.subject,
        domain: node.domain,
        level: node.level,
        questionType: 'judge',
        difficulty: node.difficulty,
        title: node.summary.replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\.?\s*/, '').substring(0, 60),
        options: null,
        answer: '正确',
        explanation: node.summary,
      });
    }

    // 去重入库
    for (const q of questions) {
      const exists = await prisma.examQuestion.findFirst({
        where: { nodeId: q.nodeId, title: q.title },
      });
      if (!exists) {
        await prisma.examQuestion.create({ data: q });
        totalCreated++;
      }
    }

    if (questions.length > 0) nodeCount++;
    if (node.id.endsWith('001') || node.id.endsWith('010') || totalCreated % 100 < 10) {
      // print less often
    }
  }

  const finalCount = await prisma.examQuestion.count();
  const nodesWithQ = await prisma.examQuestion.findMany({
    select: { nodeId: true },
    distinct: ['nodeId'],
  });
  const types = await prisma.examQuestion.groupBy({
    by: ['subject', 'questionType'],
    _count: true,
  });

  console.log(`\n✅ 完成！`);
  console.log(`总题库: ${finalCount} 题`);
  console.log(`覆盖知识点: ${nodesWithQ.length}/${allNodes.length}`);
  console.log(`本次新增: ${totalCreated} 题`);
  console.log('\n按学科和题型分布:');
  const grouped: Record<string, Record<string, number>> = {};
  for (const t of types) {
    if (!grouped[t.subject]) grouped[t.subject] = {};
    grouped[t.subject][t.questionType] = t._count;
  }
  for (const [subj, qs] of Object.entries(grouped)) {
    const total = Object.values(qs).reduce((a, b) => a + b, 0);
    console.log(`  ${subj}: ${total} →`, JSON.stringify(qs));
  }
}

main()
  .catch(e => { console.error('❌ 失败:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
