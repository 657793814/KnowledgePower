/**
 * 领域总结根结点 — 每个领域的入口/目录页
 * 里程碑类型: domain-summary
 * sortOrder: 50（排在所有知识点之前）
 * visualType: 'index'（索引/目录）
 *
 * v2: 领域重新规划后更新所有目录
 */
import { prisma, sn, sr } from '../helpers.js';

// 领域定义: subject, domain, id, title, nodes (knowledge), models
const DOMAINS = [
  // ═══ 数的世界 ═══
  {
    id: 'MATH-01-000', subject: 'math', domain: '数的世界', title: '数的世界 · 目录',
    summary: '从自然数到复数的演绎之路，涵盖数的概念、运算、性质与推理',
    kps: [
      { id: 'MATH-01-001', title: '自然数与整数' },
      { id: 'MATH-01-002', title: '有理数' },
      { id: 'MATH-01-003', title: '无理数与实数' },
      { id: 'MATH-01-004', title: '因数与倍数' },
      { id: 'MATH-01-005', title: '分数与小数' },
      { id: 'MATH-01-006', title: '百分数与比例' },
      { id: 'MATH-01-007', title: '绝对值与相反数' },
      { id: 'MATH-01-008', title: '数轴' },
      { id: 'MATH-01-009', title: '数的运算Ⅰ（加减乘除）' },
      { id: 'MATH-01-012', title: '复数' },
      { id: 'MATH-02-012', title: '复数代数形式' },
    ],
    models: [
      { id: 'MATH-01-010', title: '24点游戏模型' },
      { id: 'MATH-01-011', title: '数字推理与巧算模型' },
    ],
  },
  // ═══ 式 ═══
  {
    id: 'MATH-02-000', subject: 'math', domain: '式', title: '式与代数 · 目录',
    summary: '从字母表达到代数变换，掌握代数式的化简、变形与转化',
    kps: [
      { id: 'MATH-02-001', title: '代数式与代数式的值' },
      { id: 'MATH-02-002', title: '整式（单项式与多项式）' },
      { id: 'MATH-02-003', title: '整式的加减' },
      { id: 'MATH-02-004', title: '幂的运算' },
      { id: 'MATH-02-005', title: '乘法公式' },
      { id: 'MATH-02-006', title: '因式分解' },
      { id: 'MATH-02-007', title: '分式' },
      { id: 'MATH-02-008', title: '二次根式' },
      { id: 'MATH-02-009', title: '指数与指数运算' },
      { id: 'MATH-02-010', title: '对数与对数运算' },
    ],
    models: [
      { id: 'MATH-02-013', title: '因式分解全方法模型' },
      { id: 'MATH-02-014', title: '配方法与判别式法模型' },
      { id: 'MATH-02-015', title: '换元法综合模型' },
      { id: 'MATH-02-017', title: '分式拆分与裂项求和模型' },
      { id: 'MATH-02-018', title: '多项式除法模型（长除法与综合除法）' },
      { id: 'MATH-02-019', title: '整体代入与对称式模型' },
      { id: 'MATH-02-020', title: '判别式法求值域模型' },
      { id: 'MATH-02-021', title: '主元法模型（变更主元）' },
    ],
  },
  // ═══ 方程与不等式 ═══
  {
    id: 'MATH-03-000', subject: 'math', domain: '方程与不等式', title: '方程与不等式 · 目录',
    summary: '从一次方程到高次不等式，构建方程（组）与不等式（组）的系统解法',
    kps: [
      { id: 'MATH-03-001', title: '一元一次方程' },
      { id: 'MATH-03-002', title: '二元一次方程组' },
      { id: 'MATH-03-003', title: '不等式的基本性质' },
      { id: 'MATH-03-004', title: '一元一次不等式与不等式组' },
      { id: 'MATH-03-005', title: '一元二次方程' },
      { id: 'MATH-03-006', title: '分式方程' },
      { id: 'MATH-03-007', title: '一元二次不等式' },
      { id: 'MATH-03-008', title: '基本不等式' },
      { id: 'MATH-03-009', title: '不等式证明' },
      { id: 'MATH-03-010', title: '线性规划' },
    ],
    models: [
      { id: 'MATH-02-016', title: '韦达定理应用模型' },
      { id: 'MATH-03-011', title: '一元二次方程根的分布模型' },
      { id: 'MATH-03-012', title: '含参方程讨论模型' },
      { id: 'MATH-03-013', title: '基本不等式应用技巧模型' },
      { id: 'MATH-03-014', title: '含绝对值方程与不等式模型' },
      { id: 'MATH-03-015', title: '不等式证明方法总结模型' },
      { id: 'MATH-03-016', title: '穿针引线法模型（序轴标根法）' },
      { id: 'MATH-03-017', title: '绝对值最值模型（三角不等式）' },
      { id: 'MATH-03-018', title: '含参不等式分类讨论模型' },
      { id: 'MATH-04-021', title: '方程根的个数讨论模型（数形结合）' },
    ],
  },
  // ═══ 函数 ═══
  {
    id: 'MATH-04-000', subject: 'math', domain: '函数', title: '函数 · 目录',
    summary: '从集合对应到图像变换，函数是描述世界动态变化的数学语言，数形结合的核心载体',
    kps: [
      { id: 'MATH-02-011', title: '集合' },
      { id: 'MATH-09-001', title: '集合的概念与表示' },
      { id: 'MATH-09-002', title: '集合间的基本关系' },
      { id: 'MATH-09-003', title: '集合的基本运算' },
      { id: 'MATH-09-004', title: 'Venn图与数轴法' },
      { id: 'MATH-09-005', title: '集合中的含参问题' },
      { id: 'MATH-09-006', title: '容斥原理' },
      { id: 'MATH-04-001', title: '函数的概念' },
      { id: 'MATH-04-002', title: '正比例函数与一次函数' },
      { id: 'MATH-04-003', title: '反比例函数' },
      { id: 'MATH-04-004', title: '二次函数' },
      { id: 'MATH-04-005', title: '函数的单调性' },
      { id: 'MATH-04-006', title: '函数的奇偶性' },
      { id: 'MATH-04-007', title: '指数函数' },
      { id: 'MATH-04-008', title: '对数函数' },
      { id: 'MATH-04-009', title: '幂函数' },
      { id: 'MATH-04-010', title: '三角函数（三角比）' },
      { id: 'MATH-04-011', title: '正弦型函数' },
      { id: 'MATH-04-012', title: '函数图像变换' },
      { id: 'MATH-04-013', title: '函数与方程' },
      { id: 'MATH-04-023', title: '对勾函数' },
      { id: 'MATH-04-024', title: '复合函数' },
      { id: 'MATH-04-025', title: '抽象函数' },
      { id: 'MATH-04-026', title: '函数图像与数形结合' },
    ],
    models: [
      { id: 'MATH-04-014', title: '二次函数存在性问题模型' },
      { id: 'MATH-04-015', title: '二次函数面积最值模型' },
      { id: 'MATH-04-016', title: '二次函数与线段最值模型' },
      { id: 'MATH-04-017', title: '分段函数应用题模型' },
      { id: 'MATH-04-018', title: '一次函数与反比例综合模型' },
      { id: 'MATH-04-019', title: '恒成立与存在性问题模型' },
      { id: 'MATH-04-020', title: '函数图像变换总结模型' },
      { id: 'MATH-04-022', title: '构造函数法解题模型' },
      { id: 'MATH-03-019', title: '双曲线/对勾函数性质模型' },
    ],
  },
  // ═══ 几何 ═══
  {
    id: 'MATH-05-000', subject: 'math', domain: '几何', title: '几何 · 目录',
    summary: '从点线面到空间推理，几何是培养逻辑思维和空间想象力的基石',
    kps: [
      { id: 'MATH-05-001', title: '点、线、面与角' },
      { id: 'MATH-05-002', title: '三角形' },
      { id: 'MATH-05-003', title: '全等三角形' },
      { id: 'MATH-05-004', title: '相似三角形' },
      { id: 'MATH-05-005', title: '直角三角形与勾股定理' },
      { id: 'MATH-05-006', title: '四边形' },
      { id: 'MATH-05-007', title: '圆' },
      { id: 'MATH-05-008', title: '平移、对称与旋转' },
      { id: 'MATH-05-009', title: '向量' },
      { id: 'MATH-05-010', title: '解三角形' },
      { id: 'MATH-05-011', title: '空间几何' },
      { id: 'MATH-05-012', title: '空间向量与立体几何' },
      { id: 'MATH-05-013', title: '直线与圆的方程' },
      { id: 'MATH-05-014', title: '圆锥曲线' },
      { id: 'MATH-05-015', title: '圆幂定理' },
    ],
    models: [
      { id: 'MATH-05-016', title: '将军饮马模型' },
      { id: 'MATH-05-017', title: '手拉手模型' },
      { id: 'MATH-05-018', title: '胡不归模型' },
      { id: 'MATH-05-019', title: '阿氏圆模型' },
      { id: 'MATH-05-020', title: '费马点模型' },
      { id: 'MATH-05-021', title: '瓜豆原理模型' },
      { id: 'MATH-05-022', title: '隐圆模型' },
      { id: 'MATH-05-023', title: '一线三等角模型' },
      { id: 'MATH-05-024', title: '倍长中线模型' },
      { id: 'MATH-05-025', title: '截长补短模型' },
      { id: 'MATH-05-026', title: '半角模型' },
      { id: 'MATH-05-027', title: '三角形五心模型' },
      { id: 'MATH-05-028', title: '十字模型' },
      { id: 'MATH-05-029', title: '面积法与弦图模型' },
      { id: 'MATH-05-030', title: '折叠（翻折）模型' },
    ],
  },
  // ═══ 排列组合与统计 ═══
  {
    id: 'MATH-06-000', subject: 'math', domain: '排列组合与统计', title: '排列组合与统计 · 目录',
    summary: '从计数原理到概率统计，用数学工具理解和分析不确定性',
    kps: [
      { id: 'MATH-06-001', title: '分类加法与分步乘法' },
      { id: 'MATH-06-002', title: '排列' },
      { id: 'MATH-06-003', title: '组合' },
      { id: 'MATH-06-004', title: '二项式定理' },
      { id: 'MATH-06-005', title: '统计图与数据收集' },
      { id: 'MATH-06-006', title: '平均数、中位数、众数' },
      { id: 'MATH-06-007', title: '方差与标准差' },
      { id: 'MATH-06-008', title: '概率初步' },
      { id: 'MATH-06-009', title: '古典概型' },
      { id: 'MATH-06-010', title: '条件概率与全概率公式' },
      { id: 'MATH-06-011', title: '随机变量及分布' },
      { id: 'MATH-06-012', title: '正态分布' },
    ],
    models: [
      { id: 'MATH-06-013', title: '排列组合解题方法总结模型' },
      { id: 'MATH-06-014', title: '分组分配问题模型' },
      { id: 'MATH-06-015', title: '涂色问题模型' },
      { id: 'MATH-06-016', title: '二项式定理应用总结模型' },
    ],
  },
  // ═══ 数列与导数 ═══
  {
    id: 'MATH-07-000', subject: 'math', domain: '数列与导数', title: '数列与导数 · 目录',
    summary: '从等差等比到函数极限，数列描述离散变化，导数刻画连续变化',
    kps: [
      { id: 'MATH-07-001', title: '数列的概念' },
      { id: 'MATH-07-002', title: '等差数列' },
      { id: 'MATH-07-003', title: '等比数列' },
      { id: 'MATH-07-004', title: '数列求和' },
      { id: 'MATH-07-005', title: '数学归纳法' },
      { id: 'MATH-07-006', title: '导数的概念' },
      { id: 'MATH-07-007', title: '导数的运算' },
      { id: 'MATH-07-008', title: '导数的应用（单调性与极值）' },
      { id: 'MATH-07-009', title: '导数与最值优化' },
      { id: 'MATH-07-010', title: '定积分与微积分基本定理' },
      { id: 'MATH-07-011', title: '极限的概念与运算' },
      { id: 'MATH-07-012', title: '数列极限与递推数列' },
    ],
    models: [
      { id: 'MATH-07-013', title: '数列通项公式求法总结模型' },
      { id: 'MATH-07-014', title: '数列求和方法总结模型' },
      { id: 'MATH-07-015', title: '数列放缩法模型' },
      { id: 'MATH-07-016', title: '递推数列归纳模型' },
      { id: 'MATH-07-017', title: '导数含参讨论模型' },
      { id: 'MATH-07-018', title: '导数构造函数技巧模型' },
    ],
  },
];

function buildContentJson(d: typeof DOMAINS[0]): string {
  const sections: any[] = [
    { type: 'definition', title: '📖 领域概览', content: d.summary },
  ];

  sections.push({
    type: 'keypoints',
    title: '📌 知识点',
    items: d.kps.map(kp => `[${kp.title}](${kp.id})`),
  });

  if (d.models.length > 0) {
    sections.push({
      type: 'keypoints',
      title: '🔧 题型模型',
      items: d.models.map(m => `[${m.title}](${m.id})`),
    });
  }

  sections.push({
    type: 'tips',
    title: '💡 使用提示',
    content: '点击上方链接进入知识点详情，或在知识图谱中查看完整的知识关联网络。',
  });

  return JSON.stringify({ sections });
}

export async function seedDomainSummaries() {
  console.log('📋 领域总结根结点...');

  for (const d of DOMAINS) {
    const contentJson = buildContentJson(d);
    await sn(d.id, d.title, null, d.subject, d.domain, '', 1, 50, 'index', d.summary, contentJson, 'domain-summary');

    for (const kp of d.kps) {
      await sr(d.id, kp.id, 'contains', 10, `知识点：${kp.title}`);
    }
    for (const m of d.models) {
      await sr(d.id, m.id, 'contains', 10, `模型：${m.title}`);
    }

    console.log(`  ✓ ${d.id} ${d.title}`);
  }

  console.log('✅ 领域总结根结点完成');
}

const isMain = process.argv[1] && process.argv[1].endsWith('math-domain-summaries.ts');
if (isMain) {
  seedDomainSummaries().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}
