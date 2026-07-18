/**
 * 修复模型题目 tags — 从模型节点的 contentJson 提取关键词，更新关联题目的 tags 字段
 * 
 * 运行: cd node-server && npx tsx scripts/fix-question-tags.ts
 */

import { PrismaClient } from '../node_modules/.prisma/client/default.js';

const prisma = new PrismaClient();

// 常见停用词，过滤掉无意义的词
const STOP_WORDS = new Set([
  '的', '了', '是', '在', '可以', '一个', '这种', '这个', '以及', '其中',
  '通过', '进行', '需要', '应该', '可以', '能够', '可能', '要', '有',
  '没有', '什么', '怎么', '如何', '为什么', '因为', '所以', '但是',
  '如果', '当', '就', '都', '也', '还', '更', '最', '非常',
]);

function extractKeywords(contentJson: string): string[] {
  try {
    const content = JSON.parse(contentJson);
    if (!content.sections || !Array.isArray(content.sections)) return [];

    const keywords: string[] = [];
    for (const section of content.sections) {
      // 识别方法 → 核心关键词
      if (section.type === 'recognition' && Array.isArray(section.items)) {
        for (const item of section.items) {
          const terms = extractTerms(String(item));
          keywords.push(...terms);
        }
      }
      // 核心原理
      if ((section.type === 'model-principle' || section.type === 'definition') && section.content) {
        const terms = extractTerms(String(section.content));
        keywords.push(...terms);
      }
      // 解题通法
      if (section.type === 'standard-steps' && Array.isArray(section.items)) {
        for (const item of section.items) {
          const terms = extractTerms(String(item));
          keywords.push(...terms);
        }
      }
      // 易错点
      if (section.type === 'common-mistakes' && Array.isArray(section.items)) {
        for (const item of section.items) {
          if (typeof item === 'object' && item.mistake) {
            const terms = extractTerms(item.mistake);
            keywords.push(...terms);
          }
        }
      }
    }

    // 去重 + 过滤
    const filtered = [...new Set(keywords)].filter(k => k.length >= 2 && !STOP_WORDS.has(k));
    // 按出现频率排序，取前 30
    return filtered.slice(0, 30);
  } catch {
    return [];
  }
}

function extractTerms(text: string): string[] {
  // 提取中文术语（2字以上），同时保留英文关键词
  const chineseTerms = text.match(/[\u4e00-\u9fa5]{2,}/g) || [];
  // 提取英文专业术语
  const englishTerms = text.match(/[A-Z][a-z]+(?:[A-Z][a-z]+)*/g) || [];
  return [...chineseTerms, ...englishTerms];
}

async function main() {
  console.log('🔧 开始修复模型题目 tags...\n');

  // 1. 找出所有模型节点
  const modelNodes = await prisma.knowledgeNode.findMany({
    where: { visualType: 'model', deleted: 0 },
    select: { id: true, title: true, contentJson: true },
  });

  console.log(`找到 ${modelNodes.length} 个模型节点\n`);

  let totalUpdated = 0;

  for (const node of modelNodes) {
    const keywords = extractKeywords(node.contentJson || '{}');
    if (keywords.length === 0) continue;

    // 2. 找到该模型节点关联的所有题目
    const questions = await prisma.examQuestion.findMany({
      where: { nodeId: node.id, deleted: 0, status: 1 },
      select: { id: true, tags: true, title: true },
    });

    if (questions.length === 0) {
      console.log(`  ⚠️  ${node.id} (${node.title}): 无题目，跳过`);
      continue;
    }

    // 3. 更新每道题的 tags
    for (const q of questions) {
      const existingTags = q.tags ? JSON.parse(q.tags) : [];
      const merged = [...new Set([...existingTags, ...keywords])];
      
      if (merged.length > 0 && JSON.stringify(merged) !== q.tags) {
        await prisma.examQuestion.update({
          where: { id: q.id },
          data: { tags: JSON.stringify(merged) },
        });
        totalUpdated++;
      }
    }

    console.log(`  ✅ ${node.id} (${node.title}): ${questions.length} 题 → ${keywords.length} 个标签`);
  }

  console.log(`\n✅ 完成！共更新 ${totalUpdated} 道题目`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
