# Model-Train 题目选择优化方案

## 问题分析

### 当前行为
`GET /model-train?nodeId=MATH-04-014` 的逻辑：
1. 查该节点的 outbound 关系，收集关联节点 ID
2. 在「模型自身 + 所有关联节点」中随机取 N 道题
3. **完全随机**，不区分题目是否与模型特征相关

### 数据现状
| 指标 | 值 |
|------|-----|
| 总题目数 | 2,252 |
| 有 tags 的题目 | **0** (tags 字段全空) |
| 模型节点数 | ~60+ (visualType='model') |
| 模型节点直接题目 | 每个 3~13 道不等 |

### 根因
1. **tags 未使用** — `q()` helper 没有设置 tags 字段
2. **随机取题** — `Math.random() - 0.5` 排序后切片，完全不考虑语义相关性
3. **关联节点题目污染** — 关联节点可能是普通知识点节点，它们的题目不一定适合模型训练

## 优化方案

### Phase 1: 给题目补上模型标签（一次性数据修复）

**思路：** 遍历所有模型节点，从 `contentJson` 中提取关键词，给 nodeId 指向该模型的所有题目打上标签。

```typescript
// 从模型节点的 contentJson 提取关键词
function extractKeywords(contentJson: string): string[] {
  const content = JSON.parse(contentJson);
  const keywords: string[] = [];
  
  for (const section of content.sections) {
    // 识别方法 → 核心关键词
    if (section.type === 'recognition' && Array.isArray(section.items)) {
      for (const item of section.items) {
        // 提取短句中的关键术语（去掉标点、保留核心词）
        const terms = item.match(/[\u4e00-\u9fa5]{2,}/g) || [];
        keywords.push(...terms);
      }
    }
    // 核心原理 → 公式名、定理名
    if (section.type === 'model-principle' && section.content) {
      const terms = section.content.match(/[\u4e00-\u9fa5]{2,}/g) || [];
      keywords.push(...terms);
    }
  }
  
  // 去重 + 过滤太常见的词（的、了、是、在、可以等）
  const stopWords = new Set(['的', '了', '是', '在', '可以', '一个', '这种', '这个', '以及', '以及', '其中']);
  return [...new Set(keywords.filter(k => k.length >= 2 && !stopWords.has(k)))].slice(0, 30);
}
```

**执行脚本：** `scripts/fix-question-tags.ts`
- 读取所有 visualType='model' 的节点
- 对每个模型节点，找到所有 `nodeId=该模型ID` 的题目
- 提取关键词，更新题目的 tags 字段为 JSON 数组

### Phase 2: 优化 model-train 接口逻辑

**新的选择策略（三层优先级）：**

```
优先级1: nodeId == 模型节点自身 且 tags 包含模型关键词 → 权重 10
优先级2: nodeId == 模型节点自身 无 tags → 权重 5
优先级3: nodeId 属于关联节点 且 tags 包含模型关键词 → 权重 3
优先级4: nodeId 属于关联节点 无 tags → 权重 1
```

**实现伪代码：**

```typescript
router.get('/model-train', async (req, res, next) => {
  const { nodeId, count = '5' } = req.query;
  const cnt = Math.max(1, Math.min(20, parseInt(count as string, 10)));

  // 1. 获取模型节点信息
  const modelNode = await prisma.knowledgeNode.findUnique({ where: { id: String(nodeId) } });
  if (!modelNode) { fail(res, 404, '模型节点不存在'); return; }

  // 2. 从模型节点 contentJson 提取关键词
  const modelContent = JSON.parse(modelNode.contentJson || '{}');
  const keywords = extractKeywordsFromModel(modelContent); // 从 recognition/principle 提取

  // 3. 查关联节点
  const relations = await prisma.knowledgeRelation.findMany({
    where: { fromNodeId: String(nodeId) },
    select: { toNodeId: true, relationType: true },
  });
  const relatedNodeIds = new Set(relations.map(r => r.toNodeId));

  // 4. 批量查询所有候选题目
  const allQuestions = await prisma.examQuestion.findMany({
    where: {
      nodeId: { in: [String(nodeId), ...relatedNodeIds] },
      deleted: 0,
      status: 1,
    },
    select: { 
      id: true, nodeId: true, tags: true, 
      difficulty: true, questionType: true,
      title: true 
    },
  });

  // 5. 评分排序
  const scored = allQuestions.map(q => {
    let score = 0;
    const qTags = q.tags ? JSON.parse(q.tags) : [];
    
    // 层级分
    if (q.nodeId === String(nodeId)) score += 5;  // 模型自身
    else if (relatedNodeIds.has(q.nodeId)) score += 2;  // 关联节点
    
    // 关键词匹配分
    for (const kw of keywords) {
      if (qTags.includes(kw)) score += 8;  // tags 精确匹配
      if (q.title.includes(kw)) score += 3;  // 标题包含
    }
    
    // 难度偏好：优先选与模型难度接近的题目
    const diffGap = Math.abs((q.difficulty || 1) - (modelNode.difficulty || 1));
    score += Math.max(0, 3 - diffGap);  // 难度越接近分数越高
    
    return { ...q, score };
  });

  // 6. 按 score 降序，加权随机选取
  const selected = weightedRandom(scored, cnt);

  // 7. 返回完整题目
  const questions = await prisma.examQuestion.findMany({
    where: { id: { in: selected.map(q => q.id) } },
  });

  ok(res, questions);
});

// 加权随机：score 高的概率更大，但不是绝对
function weightedRandom(items: { score: number }[], n: number) {
  const totalScore = items.reduce((sum, i) => sum + Math.max(i.score, 1), 0);
  const selected = [];
  const remaining = [...items];
  
  while (selected.length < n && remaining.length > 0) {
    let r = Math.random() * totalScore;
    for (let i = 0; i < remaining.length; i++) {
      r -= Math.max(remaining[i].score, 1);
      if (r <= 0) {
        selected.push(remaining.splice(i, 1)[0]);
        break;
      }
    }
    // 重新计算总权重
    if (remaining.length > 0) {
      const newTotal = remaining.reduce((sum, i) => sum + Math.max(i.score, 1), 0);
      if (newTotal === 0) break; // 防止死循环
    }
  }
  return selected;
}
```

### Phase 3: 补充 tags 数据（长期）

在 seed 脚本的 `q()` helper 中增加自动标签功能：
- 根据 nodeId 查找对应模型节点
- 自动从模型的 recognition 字段提取标签写入题目
- 这样新插入的题目自带 tags

## 实施顺序

1. ✅ **Phase 1** — 写 `scripts/fix-question-tags.ts`，跑一次数据修复
2. ✅ **Phase 2** — 重写 `exam.ts` 中的 `/model-train` 接口
3. ✅ **Phase 3** — 修改 `helpers.ts` 的 `q()` 函数，自动打 tag
4. 🔄 前端验证 — 打开 model-train 页面确认题目质量提升

## 预期效果

| 维度 | 优化前 | 优化后 |
|------|--------|--------|
| 题目相关性 | 随机，可能与模型无关 | 高相关性（关键词匹配） |
| 难度匹配 | 完全随机 | 优先匹配模型难度 |
| 来源控制 | 关联节点题目混入 | 模型自身题目优先 |
| 多样性 | 完全随机 | 加权随机，保持一定多样性 |
