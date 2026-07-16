import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * AI 题目生成器
 * 对每个知识点，让 AI 生成 3-5 道高质量题目
 * 输出到 seeders/generated-questions.ts
 */

const prisma = new PrismaClient();

// 加载 AI 配置
const aiConfigPath = join(process.cwd(), '../config/ai-config.json');
const aiCfg = JSON.parse(readFileSync(aiConfigPath, 'utf-8'));

const TYPES = ['choice', 'multi_choice', 'fill', 'judge'];
const DIFFICULTIES = [1, 2, 3, 4, 5];

const SYSTEM_PROMPT = `你是一位经验丰富的中国中学理科教师（数学/物理/化学），擅长出题。

你的任务是：给定一个知识点信息，生成 3-4 道高质量的练习题。

要求：
1. 题型多样化：在 choice（单选）、multi_choice（多选）、fill（填空）、judge（判断）中混合
2. 难度分布合理：一般 1 道 easy + 1-2 道 medium + 1 道 hard
3. 选择题有 4 个选项（A/B/C/D），多选有 4-5 个选项
4. 每题有完整的答案解析
5. 贴近中考/高考风格
6. 尽量联系实际生活，让题目有趣
7. 涉及公式时用 $LaTeX$ 格式

严格输出 JSON 数组（不要 markdown 包裹）：
[
  {
    "questionType": "choice",
    "difficulty": 2,
    "title": "题目文本...",
    "options": {"A": "选项A", "B": "选项B", "C": "选项C", "D": "选项D"},
    "answer": "B",
    "explanation": "解析..."
  },
  ...
]`;

async function generateQuestionsForNode(node: any): Promise<any[]> {
  const prompt = `知识点信息：
ID: ${node.id}
标题: ${node.title}
副标题: ${node.subtitle || '无'}
学科: ${node.subject}
领域: ${node.domain}
学段: ${node.level}
摘要: ${node.summary || '无'}

请为这个知识点生成 3-4 道练习题。`;

  try {
    const resp = await axios.post(`${aiCfg.baseUrl}/chat/completions`, {
      model: aiCfg.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 8192,
    }, {
      headers: { 'Authorization': `Bearer ${aiCfg.apiKey}` },
      timeout: 60000,
    });

    const text = resp.data?.choices?.[0]?.message?.content || '';
    // 移除可能的 markdown 包裹
    const cleaned = text.replace(/^```json\n?/i, '').replace(/\n?```$/i, '').trim();
    const questions = JSON.parse(cleaned);
    return Array.isArray(questions) ? questions : [];
  } catch (e: any) {
    console.error(`  ❌ AI 请求失败: ${e.message}`);
    return [];
  }
}

async function main() {
  // 获取已有题目数量
  const existingCount = await prisma.examQuestion.count();
  console.log(`📊 现有题目: ${existingCount}`);

  // 获取所有知识点
  const nodes = await prisma.knowledgeNode.findMany({
    where: { status: 1, deleted: 0 },
    orderBy: [{ subject: 'asc' }, { domain: 'asc' }, { sortOrder: 'asc' }],
  });
  console.log(`📐 知识点总数: ${nodes.length}`);

  // 获取已有题目的 nodeId
  const existingQuestions = await prisma.examQuestion.findMany({
    where: { deleted: 0 },
    select: { nodeId: true },
  });
  const coveredNodes = new Set(existingQuestions.map(q => q.nodeId));
  console.log(`📝 已有题目的知识点: ${coveredNodes.size}`);

  // 选择还没有题目的知识点
  const targetNodes = nodes.filter(n => !coveredNodes.has(n.id));
  console.log(`🎯 需要出题的知识点: ${targetNodes.length}`);

  // 分批生成（避免 API 限流）
  const BATCH_SIZE = 3;
  let totalGenerated = 0;
  let totalNodes = 0;

  for (let i = 0; i < targetNodes.length; i += BATCH_SIZE) {
    const batch = targetNodes.slice(i, i + BATCH_SIZE);
    console.log(`\n--- 批次 ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(targetNodes.length / BATCH_SIZE)} ---`);

    for (const node of batch) {
      process.stdout.write(`  生成 ${node.id} (${node.title})... `);
      const questions = await generateQuestionsForNode(node);

      if (questions.length === 0) {
        console.log('跳过');
        continue;
      }

      // 写入数据库
      for (const q of questions) {
        try {
          await prisma.examQuestion.create({
            data: {
              nodeId: node.id,
              subject: node.subject,
              domain: node.domain,
              level: node.level,
              questionType: q.questionType || 'choice',
              difficulty: q.difficulty || 2,
              title: q.title,
              options: q.options ? JSON.stringify(q.options) : null,
              answer: q.answer || '',
              explanation: q.explanation || '',
              tags: JSON.stringify([node.domain]),
            },
          });
          totalGenerated++;
        } catch (e: any) {
          console.error(`\n    ❌ 写入失败: ${e.message}`);
        }
      }
      totalNodes++;
      console.log(`✅ ${questions.length} 题`);
    }
  }

  console.log(`\n🎉 完成！`);
  console.log(`   已处理知识点: ${totalNodes}`);
  console.log(`   新生成的题目: ${totalGenerated}`);
  console.log(`   总题目数: ${existingCount + totalGenerated}`);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
