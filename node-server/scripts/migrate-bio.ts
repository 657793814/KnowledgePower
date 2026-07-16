/**
 * 生物学科迁移脚本（幂等插入）
 * 直接使用种子数据插入，使用 upsert 避免冲突
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function sn(
  id: string, title: string, subtitle: string | null,
  subject: string, domain: string, level: string,
  difficulty: number, sortOrder: number, visualType: string | null, summary: string,
  contentJson: string, milestoneType: string | null = null
) {
  await prisma.knowledgeNode.upsert({
    where: { id },
    update: { title, subtitle, subject, domain, level, difficulty, sortOrder, visualType, summary, contentJson, milestoneType, status: 1 },
    create: { id, title, subtitle, subject, domain, level, difficulty, sortOrder, visualType, summary, contentJson, milestoneType, status: 1 },
  });
}

async function sr(from: string, to: string, type: string, sortOrder: number, description?: string) {
  const existing = await prisma.knowledgeRelation.findFirst({
    where: { fromNodeId: from, toNodeId: to, relationType: type },
  });
  if (!existing) {
    await prisma.knowledgeRelation.create({
      data: { fromNodeId: from, toNodeId: to, relationType: type, sortOrder, description: description || null },
    });
  }
}

function q(
  nodeId: string, subject: string, domain: string, level: string, qtype: string, diff: number,
  title: string, answer: string, explanation: string, options?: string | null
) {
  let normalized = options || null;
  if (normalized) {
    try {
      const parsed = JSON.parse(normalized);
      if (Array.isArray(parsed)) {
        const obj: Record<string, string> = {};
        for (const item of parsed) {
          const match = item.match(/^([A-Da-d])[.．、]\s*(.+)/);
          if (match) obj[match[1].toUpperCase()] = match[2];
        }
        if (Object.keys(obj).length > 0) normalized = JSON.stringify(obj);
      }
    } catch {}
  }
  return { nodeId, subject, domain, level, questionType: qtype, difficulty: diff, title, options: normalized, answer, explanation };
}

function richContent(
  def: string,
  keypoints: string[],
  formulas: string[] = [],
  examples: { title: string; question: string; hint?: string; steps?: string[]; answer: string; solution?: string }[] = [],
): string {
  const sections = [{ type: 'definition', title: '📖 核心定义', content: def }];
  if (keypoints.length) sections.push({ type: 'keypoints', title: '核心要点', items: keypoints });
  if (formulas.length) sections.push({ type: 'formula', title: '公式与定理', formulas, content: formulas.join('；') });
  if (examples.length) sections.push({ type: 'example', title: '典型例题', items: examples });
  return JSON.stringify({ sections });
}

// ─── 数据 ───

async function seedCell() {
  console.log('  → 细胞生物学');
  await sn('BIO-01-001', '细胞学说', '细胞理论的历史与核心内容', 'bio', '细胞生物学', '高中', 1, 100, null,
    '细胞学说指出：所有生物都由一个或多个细胞组成，细胞是生命的基本结构和功能单位，所有细胞都来自已存在的细胞',
    richContent('细胞学说由施莱登和施旺提出，核心：所有生物由细胞构成、细胞是基本单位、细胞来自已有细胞。', [
      '所有生物由细胞构成（病毒除外）', '细胞是生物体结构和功能的基本单位', '新细胞由已存在细胞分裂产生', '细胞学说揭示了生物界的统一性',
    ], [], [
      { title: '例1', question: '下列哪项不是细胞学说的内容？\nA. 细胞是基本单位\nB. 所有生物都由细胞构成\nC. 细胞来自已存在细胞\nD. 细胞是遗传物质的基本单位', answer: 'D' },
    ]),
  );
  await sr('BIO-01-001', 'BIO-01-002', 'next', 1);

  await sn('BIO-01-002', '细胞膜的结构与功能', '流动镶嵌模型与物质运输', 'bio', '细胞生物学', '高中', 2, 200, null,
    '细胞膜由磷脂双分子层和蛋白质构成，具有选择透过性',
    richContent('细胞膜主要由磷脂和蛋白质组成。流动镶嵌模型：磷脂双分子层为基本骨架。细胞膜具有选择透过性。物质运输：自由扩散、协助扩散、主动运输、胞吞胞吐。', [
      '细胞膜主要由磷脂和蛋白质组成', '流动镶嵌模型：磷脂双分子层为基本骨架', '糖蛋白参与细胞识别', '细胞膜具有选择透过性',
    ], [], [
      { title: '例1', question: '细胞膜的基本骨架是什么？', answer: '磷脂双分子层' },
    ]),
  );
  await sr('BIO-01-002', 'BIO-01-003', 'next', 1);

  await sn('BIO-01-003', '细胞质与细胞器', '主要细胞器的结构与功能', 'bio', '细胞生物学', '高中', 2, 300, null,
    '细胞质中包含多种细胞器：线粒体（有氧呼吸）、叶绿体（光合作用）、内质网、高尔基体等',
    richContent('主要细胞器功能：线粒体—有氧呼吸（动力车间）；叶绿体—光合作用（植物）；内质网—蛋白质加工；高尔基体—分泌；溶酶体—消化；核糖体—蛋白质合成。', [
      '线粒体：有氧呼吸，产生ATP', '叶绿体：光合作用（植物特有）', '内质网：蛋白质加工', '高尔基体：蛋白质加工运输', '核糖体：蛋白质合成',
    ], [], [
      { title: '例1', question: '被称为细胞"动力车间"的是？', answer: '线粒体' },
    ]),
  );
  await sr('BIO-01-003', 'BIO-01-004', 'next', 1);

  await sn('BIO-01-004', '细胞核', '细胞核的结构与功能', 'bio', '细胞生物学', '高中', 1, 400, null,
    '细胞核是遗传信息库，是细胞代谢和遗传的控制中心',
    richContent('细胞核结构：核膜（双层膜、有核孔）、核仁（rRNA合成）、染色质（DNA+蛋白质）。核孔是mRNA、蛋白质进出通道。', [
      '细胞核是遗传信息库', '核膜：双层膜，有核孔', '核仁：与rRNA合成有关', '染色质：DNA+蛋白质',
    ], [], [
      { title: '例1', question: '细胞核的功能是？', answer: '遗传信息库，细胞代谢和遗传的控制中心' },
    ]),
  );
  await sr('BIO-01-004', 'BIO-01-005', 'next', 1);

  await sn('BIO-01-005', '有丝分裂', '细胞分裂的过程与意义', 'bio', '细胞生物学', '高中', 3, 500, null,
    '有丝分裂分为间期、前期、中期、后期、末期，保证子细胞遗传信息一致',
    richContent('细胞周期：间期（G₁→S→G₂，DNA复制）→分裂期。前期（染色质→染色体）；中期（排列在赤道板，最佳观察期）；后期（着丝粒分裂）；末期（染色体解旋）。有丝分裂保证了遗传信息的稳定性。', [
      '间期：DNA复制，蛋白质合成', '前期：染色质→染色体，核膜消失', '中期：排列赤道板（最佳观察）', '后期：着丝粒分裂，染色体移向两极', '末期：染色体解旋，核膜重新形成',
    ], [], [
      { title: '例1', question: '观察染色体形态数目的最佳时期是？', answer: '有丝分裂中期' },
    ]),
  );
  await sr('BIO-01-005', 'BIO-01-006', 'next', 1);

  await sn('BIO-01-006', '减数分裂', '减数分裂的过程与意义', 'bio', '细胞生物学', '高中', 3, 600, null,
    '减数分裂是生殖细胞形成时的特殊分裂，染色体复制一次、细胞分裂两次，子细胞染色体数目减半',
    richContent('减数分裂：减Ⅰ（同源染色体联会、分离）→减Ⅱ（类似有丝分裂）。结果：染色体数目减半（2n→n）。意义：维持染色体数目恒定，增加遗传多样性。', [
      '减Ⅰ：同源染色体联会、分离', '同源染色体交叉互换（基因重组）', '非同源染色体自由组合', '结果：染色体数目减半',
    ], [], [
      { title: '例1', question: '同源染色体分离发生在哪个时期？', answer: '减数第一次分裂后期' },
    ]),
  );
  console.log('  ✓ 细胞生物学');
}

async function seedGenetics() {
  console.log('  → 遗传与进化');
  await sn('BIO-02-001', '孟德尔遗传定律', '分离定律与自由组合定律', 'bio', '遗传与进化', '高中', 3, 100, null,
    '分离定律：等位基因在配子形成时分离。自由组合定律：非等位基因自由组合',
    richContent('孟德尔通过豌豆实验提出分离定律和自由组合定律。分离定律：等位基因在形成配子时分离。自由组合定律：非同源染色体上的非等位基因自由组合。', [
      '分离定律：等位基因在配子形成时分离', '自由组合定律：非等位基因自由组合', '表型=基因型+环境', '测交：与隐性纯合子交配检验基因型',
    ], [], [
      { title: '例1', question: 'F₂的性状分离比是？', answer: '3:1' },
    ]),
  );
  await sr('BIO-02-001', 'BIO-02-002', 'next', 1);

  await sn('BIO-02-002', 'DNA结构与复制', '双螺旋结构与半保留复制', 'bio', '遗传与进化', '高中', 3, 200, null,
    'DNA由两条反向平行的脱氧核苷酸链以双螺旋结构存在，通过半保留方式进行复制',
    richContent('DNA双螺旋由沃森和克里克提出。基本单位：脱氧核苷酸。配对：A=T、C≡G。复制特点：半保留复制、边解旋边复制。需要解旋酶和DNA聚合酶。', [
      'DNA基本单位：脱氧核苷酸', '双螺旋：反向平行、碱基互补配对', 'A=T（两个氢键），C≡G（三个氢键）', '半保留复制：每条母链作为模板',
    ], [], [
      { title: '例1', question: 'A+T=40%，C=？', answer: '30%' },
    ]),
  );
  await sr('BIO-02-002', 'BIO-02-003', 'next', 1);

  await sn('BIO-02-003', '基因的表达', '转录与翻译', 'bio', '遗传与进化', '高中', 3, 300, null,
    '基因的表达包括转录（DNA→mRNA）和翻译（mRNA→蛋白质）两个过程',
    richContent('中心法则：DNA→转录→mRNA→翻译→蛋白质。转录在细胞核以DNA为模板合成mRNA。翻译在核糖体以mRNA为模板合成蛋白质。密码子：mRNA上三个碱基对应一种氨基酸。', [
      '转录：DNA→mRNA（细胞核）', '翻译：mRNA→蛋白质（核糖体）', '密码子：mRNA上三个碱基', 'tRNA携带氨基酸识别密码子', '密码子简并性',
    ], [], [
      { title: '例1', question: '转录的产物是？', answer: 'mRNA' },
    ]),
  );
  await sr('BIO-02-003', 'BIO-02-004', 'next', 1);

  await sn('BIO-02-004', '基因突变与染色体变异', '突变类型及其对生物的影响', 'bio', '遗传与进化', '高中', 2, 400, null,
    '基因突变：DNA序列中碱基对的替换、增添或缺失。染色体变异包括结构变异和数目变异',
    richContent('基因突变特点：普遍、随机、低频、多害少利。染色体结构变异：缺失、重复、倒位、易位。数目变异：整倍体和非整倍体。', [
      '基因突变：碱基对替换、增添、缺失', '突变特点：普遍、随机、低频', '染色体结构变异：缺失、重复、倒位、易位',
    ], [], [
      { title: '例1', question: '光学显微镜可见的是基因突变还是染色体变异？', answer: '染色体变异' },
    ]),
  );
  await sr('BIO-02-004', 'BIO-02-005', 'next', 1);

  await sn('BIO-02-005', '自然选择与进化', '达尔文进化论与现代进化理论', 'bio', '遗传与进化', '高中', 2, 500, null,
    '自然选择是生物进化的主要机制，进化的实质是种群基因频率的改变',
    richContent('达尔文自然选择：过度繁殖→生存斗争→遗传变异→适者生存。现代进化理论：种群是进化的基本单位，进化的实质是基因频率改变。', [
      '种群是进化的基本单位', '基因频率改变是进化的实质', '突变和基因重组提供原材料', '自然选择决定进化方向', '隔离是物种形成的必要条件',
    ], [], [
      { title: '例1', question: '生物进化的基本单位？', answer: '种群' },
    ]),
  );
  await sr('BIO-02-005', 'BIO-02-006', 'next', 1);

  await sn('BIO-02-006', '人类遗传病', '遗传病的类型与预防', 'bio', '遗传与进化', '高中', 2, 600, null,
    '人类遗传病分单基因、多基因、染色体异常三类，可通过产前诊断和遗传咨询预防',
    richContent('单基因遗传病：白化病（常隐）、色盲（X隐）。多基因：冠心病、糖尿病。染色体：21三体综合征。预防：遗传咨询和产前诊断。', [
      '单基因：白化病、色盲', '多基因：冠心病、糖尿病', '染色体：21三体综合征', '禁止近亲结婚', '产前诊断是主要预防措施',
    ], [], [
      { title: '例1', question: '哪项属于多基因遗传病？\nA.白化病 B.色盲 C.冠心病 D.血友病', answer: 'C' },
    ]),
  );
  console.log('  ✓ 遗传与进化');
}

async function seedHumanBody() {
  console.log('  → 人体生理');
  await sn('BIO-03-001', '消化系统', '消化与吸收', 'bio', '人体生理', '初中', 2, 100, null,
    '消化系统由消化道和消化腺组成，将大分子食物分解为小分子物质吸收',
    richContent('消化道：口腔→咽→食管→胃→小肠→大肠。消化腺：唾液腺、胃腺、肝脏（胆汁）、胰腺（胰液）。小肠是主要吸收场所。', [
      '淀粉：口腔→麦芽糖→小肠→葡萄糖', '蛋白质：胃→多肽→小肠→氨基酸', '脂肪：胆汁乳化→胰脂酶→脂肪酸+甘油', '小肠是主要吸收场所',
    ], [], [
      { title: '例1', question: '人体消化吸收的主要器官？', answer: '小肠' },
    ]),
  );
  await sr('BIO-03-001', 'BIO-03-002', 'next', 1);
  await sn('BIO-03-002', '循环系统', '血液循环与心脏', 'bio', '人体生理', '初中', 2, 200, null,
    '循环系统由心脏和血管组成，负责运输氧气、营养物质和废物',
    richContent('心脏四腔：左心房、左心室（壁最厚）、右心房、右心室。体循环：左心室→全身→右心房。肺循环：右心室→肺→左心房。', [
      '心脏四个腔：左心室壁最厚', '体循环：左心室→全身→右心房', '肺循环：右心室→肺→左心房', '毛细血管是物质交换场所',
    ], [], [
      { title: '例1', question: '体循环起点是？', answer: '左心室' },
    ]),
  );
  await sr('BIO-03-002', 'BIO-03-003', 'next', 1);
  await sn('BIO-03-003', '呼吸系统', '呼吸运动与气体交换', 'bio', '人体生理', '初中', 2, 300, null,
    '呼吸系统由呼吸道和肺组成，负责气体交换',
    richContent('吸气：膈肌收缩→胸廓扩大→肺扩张。呼气：膈肌舒张→胸廓缩小。肺泡壁极薄，外有毛细血管，利于气体交换。气体扩散作用。', [
      '吸气：膈肌收缩，胸廓扩大', '呼气：膈肌舒张，胸廓缩小', '肺泡壁薄利于气体交换', '气体交换通过扩散作用',
    ], [], [
      { title: '例1', question: '气体交换的基本原理？', answer: '气体的扩散作用' },
    ]),
  );
  await sr('BIO-03-003', 'BIO-03-004', 'next', 1);
  await sn('BIO-03-004', '神经系统', '神经调节的基本方式', 'bio', '人体生理', '初中', 2, 400, null,
    '神经系统通过反射弧实现神经调节，反射是神经调节的基本方式',
    richContent('反射弧：感受器→传入神经→神经中枢→传出神经→效应器。非条件反射：先天性的。条件反射：后天习得的。', [
      '神经元是神经系统基本单位', '反射是神经调节基本方式', '反射弧五个环节', '非条件反射：先天', '条件反射：后天习得',
    ], [], [
      { title: '例1', question: '神经调节的基本方式是？', answer: '反射' },
    ]),
  );
  await sr('BIO-03-004', 'BIO-03-005', 'next', 1);
  await sn('BIO-03-005', '免疫系统', '免疫的类型与机制', 'bio', '人体生理', '高中', 3, 500, null,
    '免疫系统通过非特异性免疫和特异性免疫防御病原体入侵',
    richContent('非特异性免疫：第一道防线（皮肤黏膜）、第二道防线（吞噬细胞）。特异性免疫：体液免疫（B细胞→抗体）和细胞免疫（T细胞）。', [
      '非特异性免疫：先天性', '特异性免疫：后天性', '体液免疫：B细胞产生抗体', '细胞免疫：T细胞攻击靶细胞', '疫苗产生记忆细胞',
    ], [], [
      { title: '例1', question: '接种疫苗属于哪种免疫？', answer: '人工自动免疫（特异性免疫）' },
    ]),
  );
  await sr('BIO-03-005', 'BIO-03-006', 'next', 1);
  await sn('BIO-03-006', '内分泌系统', '激素调节', 'bio', '人体生理', '高中', 2, 600, null,
    '内分泌系统通过分泌激素调节生长、发育、代谢等生命活动',
    richContent('主要激素：生长激素（促进生长）、甲状腺激素（促进代谢）、胰岛素（降血糖）、胰高血糖素（升血糖）、肾上腺素（心跳加快）。', [
      '激素是微量高效的调节物质', '生长激素：促进生长', '甲状腺激素：促进代谢', '胰岛素降血糖，胰高血糖素升血糖', '负反馈调节',
    ], [], [
      { title: '例1', question: '胰岛素分泌不足导致？', answer: '糖尿病' },
    ]),
  );
  console.log('  ✓ 人体生理');
}

async function seedPlants() {
  console.log('  → 植物学');
  await sn('BIO-04-001', '光合作用', '光合作用的原理与过程', 'bio', '植物学', '高中', 3, 100, null,
    '光合作用利用光能将CO₂和H₂O合成有机物，分为光反应和暗反应',
    richContent('光反应（类囊体膜）：水光解产生O₂、ATP和NADPH。暗反应（基质）：CO₂固定和C₃还原。影响因子：光照、CO₂浓度、温度。', [
      '光合作用场所：叶绿体', '光反应：水光解，产生O₂', '暗反应：CO₂固定和C₃还原', '光照强度影响光反应', 'CO₂浓度影响暗反应',
    ], [], [
      { title: '例1', question: '光合作用释放的O₂来自？', answer: '水（H₂O的光解）' },
    ]),
  );
  await sr('BIO-04-001', 'BIO-04-002', 'next', 1);
  await sn('BIO-04-002', '呼吸作用', '细胞呼吸的原理', 'bio', '植物学', '高中', 2, 200, null,
    '细胞呼吸在有氧或无氧条件下分解有机物释放能量',
    richContent('有氧呼吸三阶段：细胞质基质→线粒体基质→线粒体内膜（大量ATP）。无氧呼吸：乳酸（动物）或酒精+CO₂（植物/酵母）。', [
      '有氧呼吸三个阶段', '无氧呼吸产物：乳酸或酒精', '有氧呼吸释放大量能量', '线粒体是有氧呼吸主要场所',
    ], [], [
      { title: '例1', question: '哪阶段产生ATP最多？', answer: '第三阶段（线粒体内膜）' },
    ]),
  );
  await sr('BIO-04-002', 'BIO-04-003', 'next', 1);
  await sn('BIO-04-003', '植物激素', '生长素及其他植物激素', 'bio', '植物学', '高中', 2, 300, null,
    '植物激素包括生长素、赤霉素、细胞分裂素、脱落酸、乙烯',
    richContent('生长素：两重性（低促进高抑制）。赤霉素：促进细胞伸长。细胞分裂素：促进细胞分裂。脱落酸：促进衰老。乙烯：催熟。', [
      '生长素：两重性', '赤霉素：促进细胞伸长', '细胞分裂素：促进分裂', '脱落酸：促进衰老', '乙烯：催熟',
    ], [], [
      { title: '例1', question: '生长素作用特点？', answer: '两重性：低浓度促进，高浓度抑制' },
    ]),
  );
  await sr('BIO-04-003', 'BIO-04-004', 'next', 1);
  await sn('BIO-04-004', '植物结构', '根茎叶的结构与功能', 'bio', '植物学', '初中', 1, 400, null,
    '高等植物有根、茎、叶、花、果实、种子六大器官',
    richContent('根：吸收水分和无机盐。茎：运输和支持。叶：光合作用和蒸腾作用。根尖：根冠→分生区→伸长区→成熟区（根毛）。', [
      '根：吸收水分和无机盐', '茎：运输和支持', '叶：光合作用和蒸腾作用',
    ], [], [
      { title: '例1', question: '植物吸收水分的主要部位？', answer: '根尖成熟区（根毛）' },
    ]),
  );
  await sr('BIO-04-004', 'BIO-04-005', 'next', 1);
  await sn('BIO-04-005', '蒸腾作用', '水分在植物体内的运输', 'bio', '植物学', '初中', 1, 500, null,
    '蒸腾作用是水分通过气孔散失到大气中的过程，是水分运输的动力',
    richContent('蒸腾拉力是水分向上运输的动力。气孔由保卫细胞控制开闭。影响因素：光照、温度、湿度、风速。', [
      '蒸腾作用通过气孔进行', '蒸腾拉力是水分运输动力', '促进无机盐运输', '气孔由保卫细胞控制',
    ], [], [
      { title: '例1', question: '蒸腾作用主要器官？', answer: '叶片（通过气孔）' },
    ]),
  );
  await sr('BIO-04-004', 'BIO-04-005', 'next', 2);
  await sn('BIO-04-006', '植物的繁殖', '有性生殖与无性生殖', 'bio', '植物学', '初中', 1, 600, null,
    '植物可通过有性生殖（种子）和无性生殖（扦插、嫁接、组织培养）繁殖',
    richContent('双受精是被子植物特有（两个精子：与卵结合→受精卵，与极核结合→受精极核）。无性生殖：扦插、嫁接、组织培养。', [
      '有性生殖：通过种子繁殖', '双受精是被子植物特有', '无性生殖：扦插、嫁接', '组织培养利用细胞全能性',
    ], [], [
      { title: '例1', question: '被子植物特有的受精方式？', answer: '双受精' },
    ]),
  );
  console.log('  ✓ 植物学');
}

async function seedEcology() {
  console.log('  → 生态学');
  await sn('BIO-05-001', '种群的特征', '种群的数量特征与动态变化', 'bio', '生态学', '高中', 2, 100, null,
    '种群密度是基本数量特征，年龄组成预测变化趋势',
    richContent('种群特征：种群密度（最基本）、出生率死亡率、迁入迁出率、年龄组成（增长/稳定/衰退）、性别比例。调查：样方法、标志重捕法。', [
      '种群密度是最基本特征', '年龄组成预测变化趋势', '样方法调查植物', '标志重捕法调查动物', 'K值：环境容纳量',
    ], [], [
      { title: '例1', question: '预测种群变化趋势的依据？', answer: '年龄组成' },
    ]),
  );
  await sr('BIO-05-001', 'BIO-05-002', 'next', 1);
  await sn('BIO-05-002', '群落的结构', '种间关系与群落演替', 'bio', '生态学', '高中', 2, 200, null,
    '群落有垂直结构和水平结构，种间关系包括互利共生、捕食、竞争、寄生',
    richContent('垂直结构：分层。水平结构：镶嵌。种间关系：互利共生、捕食、竞争、寄生。演替：初生演替（裸岩）和次生演替（弃耕农田）。', [
      '垂直结构：分层', '水平结构：镶嵌分布', '互利共生：双方受益', '捕食：一方受益', '竞争：双方受损',
    ], [], [
      { title: '例1', question: '豆科植物与根瘤菌的关系？', answer: '互利共生' },
    ]),
  );
  await sr('BIO-05-002', 'BIO-05-003', 'next', 1);
  await sn('BIO-05-003', '生态系统的结构', '生态系统的组成与营养结构', 'bio', '生态学', '高中', 2, 300, null,
    '生态系统由生物群落和无机环境组成，通过食物链形成营养结构',
    richContent('组成：非生物成分、生产者（基石）、消费者、分解者。营养结构：食物链和食物网。', [
      '生产者：生态系统的基石', '消费者：加速物质循环', '分解者：有机物→无机物', '能量沿食物链单向流动，逐级递减',
    ], [], [
      { title: '例1', question: '生态系统最重要的成分？', answer: '生产者' },
    ]),
  );
  await sr('BIO-05-003', 'BIO-05-004', 'next', 1);
  await sn('BIO-05-004', '生态系统的功能', '能量流动与物质循环', 'bio', '生态学', '高中', 3, 400, null,
    '能量流动单向逐级递减（10-20%），物质循环具有全球性',
    richContent('能量传递效率10%-20%。碳循环：CO₂→光合→有机物→呼吸/燃烧→CO₂。能量流动是物质循环的动力。', [
      '能量沿食物链单向流动', '传递效率10%-20%', '碳循环：光合作用→呼吸', '信息传递调节种间关系',
    ], [], [
      { title: '例1', question: '能量流动的特点？', answer: '单向流动、逐级递减' },
    ]),
  );
  await sr('BIO-05-004', 'BIO-05-005', 'next', 1);
  await sn('BIO-05-005', '生态系统的稳定性', '抵抗力稳定性和恢复力稳定性', 'bio', '生态学', '高中', 2, 500, null,
    '生态系统具有自我调节能力，生物多样性越高抵抗力越强',
    richContent('抵抗力：抵抗干扰保持原状的能力。恢复力：恢复原状的能力。负反馈是自我调节的基础。', [
      '抵抗力：抵抗干扰', '恢复力：恢复原状', '生物多样性越高抵抗力越强', '自我调节能力有限',
    ], [], [
      { title: '例1', question: '为什么热带雨林抵抗力比草原强？', answer: '生物多样性更高，营养结构更复杂' },
    ]),
  );
  await sr('BIO-05-005', 'BIO-05-006', 'next', 1);
  await sn('BIO-05-006', '生物多样性保护', '生物多样性的价值与保护', 'bio', '生态学', '初中', 1, 600, null,
    '生物多样性包括遗传、物种、生态系统多样性，建立自然保护区是最有效措施',
    richContent('三个层次：遗传（基因）多样性、物种多样性、生态系统多样性。价值：直接、间接（更大）、潜在。保护：就地保护（最有效）、迁地保护。', [
      '生物多样性的三个层次', '间接价值远大于直接价值', '自然保护区是最有效措施',
    ], [], [
      { title: '例1', question: '保护生物多样性最有效措施？', answer: '就地保护（建立自然保护区）' },
    ]),
  );
  console.log('  ✓ 生态学');
}

async function seedBiotech() {
  console.log('  → 微生物与生物技术');
  await sn('BIO-06-001', '病毒', '病毒的结构与生活史', 'bio', '微生物与生物技术', '高中', 2, 100, null,
    '病毒是非细胞结构微生物，由核酸和蛋白质组成，在活细胞内寄生',
    richContent('病毒无细胞结构（核酸+蛋白质）。必须寄生在活细胞内。分类：动物病毒（HIV）、植物病毒、噬菌体（细菌病毒）。', [
      '病毒无细胞结构', '必须寄生在活细胞', '噬菌体：细菌DNA病毒', 'HIV：RNA逆转录病毒',
    ], [], [
      { title: '例1', question: '病毒是否属于生物？', answer: '属于，能繁殖，有遗传变异' },
    ]),
  );
  await sr('BIO-06-001', 'BIO-06-002', 'next', 1);
  await sn('BIO-06-002', '细菌与真菌', '原核生物与真核微生物', 'bio', '微生物与生物技术', '初中', 2, 200, null,
    '细菌是原核生物（无核膜），真菌是真核生物（有核膜）',
    richContent('细菌：原核，无成形细胞核，细胞壁（肽聚糖），二分裂。真菌：真核，细胞壁（几丁质），孢子繁殖。酵母菌：兼性厌氧。', [
      '细菌：原核（无核膜）', '细菌细胞壁：肽聚糖', '真菌：真核', '酵母菌：兼性厌氧',
    ], [], [
      { title: '例1', question: '细菌和真菌主要区别？', answer: '细菌无成形细胞核（原核），真菌有（真核）' },
    ]),
  );
  await sr('BIO-06-002', 'BIO-06-003', 'next', 1);
  await sn('BIO-06-003', '发酵工程', '微生物发酵在生产中的应用', 'bio', '微生物与生物技术', '高中', 2, 300, null,
    '发酵工程利用微生物代谢活动大规模生产有用产物',
    richContent('传统发酵：酿酒（酵母菌）、制醋（醋酸菌）、泡菜（乳酸菌）。现代发酵需控制温度、pH、溶氧。', [
      '酵母菌：酿酒', '醋酸菌：制醋', '乳酸菌：泡菜', '青霉菌：青霉素',
    ], [], [
      { title: '例1', question: '制作泡菜利用哪种微生物？', answer: '乳酸菌' },
    ]),
  );
  await sr('BIO-06-003', 'BIO-06-004', 'next', 1);
  await sn('BIO-06-004', '基因工程', '基因工程的基本原理与操作', 'bio', '微生物与生物技术', '高中', 3, 400, null,
    '基因工程在分子水平操作DNA，将目的基因导入受体细胞并使其表达',
    richContent('工具：限制酶（DNA剪刀）、DNA连接酶（针线）、质粒（载体）。步骤：提取→连接→导入→检测。', [
      '限制酶：DNA剪刀', 'DNA连接酶：DNA针线', '质粒是最常用载体', '四步：提取→连接→导入→检测',
    ], [], [
      { title: '例1', question: '基因工程最常用载体？', answer: '质粒' },
    ]),
  );
  await sr('BIO-06-004', 'BIO-06-005', 'next', 1);
  await sn('BIO-06-005', '微生物的实验室培养', '培养基、无菌操作与纯化', 'bio', '微生物与生物技术', '高中', 2, 500, null,
    '微生物培养需要配制培养基，在无菌条件下接种纯化',
    richContent('培养基：固体（加琼脂）、液体、选择培养基、鉴别培养基。灭菌方法：高压蒸汽（121℃）、灼烧、干热。接种方法：平板划线法、稀释涂布法。', [
      '培养基提供营养', '固体培养基加琼脂', '高压蒸汽灭菌：121℃', '平板划线法纯化微生物',
    ], [], [
      { title: '例1', question: '固体培养基凝固剂？', answer: '琼脂' },
    ]),
  );
  await sr('BIO-06-005', 'BIO-06-006', 'next', 1);
  await sn('BIO-06-006', '细胞工程', '细胞培养、融合与核移植', 'bio', '微生物与生物技术', '高中', 3, 600, null,
    '细胞工程在细胞水平改造生物，包括组织培养、体细胞杂交、核移植、单克隆抗体',
    richContent('植物组织培养：利用细胞全能性。单克隆抗体：B细胞+骨髓瘤细胞→杂交瘤细胞。核移植：动物克隆。', [
      '植物组织培养利用细胞全能性', '杂交瘤细胞：B细胞+骨髓瘤', '单克隆抗体用于诊断治疗',
    ], [], [
      { title: '例1', question: '单克隆抗体制备使用的细胞？', answer: '杂交瘤细胞' },
    ]),
  );
  console.log('  ✓ 微生物与生物技术');
}

async function main() {
  console.log('========================================');
  console.log('  生物学科迁移脚本（幂等 upsert）');
  console.log('========================================\n');

  const before = await prisma.knowledgeNode.count({ where: { subject: 'bio' } });
  console.log(`迁移前生物节点数: ${before}\n`);

  console.log('🧬 生物\n');
  await seedCell();
  await seedGenetics();
  await seedHumanBody();
  await seedPlants();
  await seedEcology();
  await seedBiotech();

  const after = await prisma.knowledgeNode.count({ where: { subject: 'bio' } });
  const relCount = await prisma.knowledgeRelation.count({
    where: { OR: [{ fromNodeId: { startsWith: 'BIO-' } }, { toNodeId: { startsWith: 'BIO-' } }] },
  });
  const totalNodes = await prisma.knowledgeNode.count();
  console.log(`\n✅ 完成！`);
  console.log(`  生物节点: ${before} → ${after}（新增 ${after - before}）`);
  console.log(`  生物关系: ${relCount}`);
  console.log(`  系统总计: ${totalNodes} 节点`);
}

main()
  .catch(e => { console.error('❌ 迁移失败:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
