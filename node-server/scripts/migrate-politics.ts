import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function sn(id: string, title: string, subtitle: string, subject: string, domain: string, level: string, difficulty: number, sortOrder: number, visualType: string, summary: string, contentJson: string) {
  await prisma.knowledgeNode.upsert({
    where: { id }, update: { title, subtitle, subject, domain, level, difficulty, sortOrder, visualType, summary, contentJson, status: 1 },
    create: { id, title, subtitle, subject, domain, level, difficulty, sortOrder, visualType, summary, contentJson, status: 1 },
  });
}

async function sr(from: string, to: string, type: string, sortOrder: number) {
  const existing = await prisma.knowledgeRelation.findFirst({ where: { fromNodeId: from, toNodeId: to, relationType: type } });
  if (!existing) await prisma.knowledgeRelation.create({ data: { fromNodeId: from, toNodeId: to, relationType: type, sortOrder } });
}

function buildContent(def: string, keypoints: string[], formulas: string[], examples: string[]) {
  const sections: any[] = [{ type: 'definition', title: '定义', content: def }];
  if (keypoints.length) sections.push({ type: 'keypoints', title: '核心要点', items: keypoints });
  if (formulas.length) sections.push({ type: 'formula', title: '公式', formulas, content: formulas.join('；') });
  if (examples.length) sections.push({ type: 'example', title: '例题', items: examples });
  return JSON.stringify({ sections });
}

// Domain 1: 哲学
async function seedPolitics01() {
  const D = '哲学';
  await sn('POL-01-001', '唯物论与辩证法', 'Materialism & Dialectics', 'politics', D, '高中', 2, 1, 'mindmap',
    '唯物主义和辩证法是马克思主义哲学的两大基石。',
    buildContent('世界是物质的，物质决定意识；事物是普遍联系和永恒发展的',
      ['世界的本原是物质，物质决定意识，意识对物质具有能动作用', '规律的客观性：规律不以人的意志为转移，但人可以认识和利用规律', '辩证法的总特征：联系的观点、发展的观点', '唯物辩证法的三大规律：对立统一、质量互变、否定之否定'],
      [],
      ['"人不能两次踏进同一条河流"——赫拉克利特的发展观', '"巧妇难为无米之炊"——物质决定意识']
    ));
  await sn('POL-01-002', '认识论', 'Epistemology', 'history', D, '高中', 2, 2, 'mindmap',
    '认识论研究认识的来源、本质、过程和检验标准。',
    buildContent('实践是认识的基础，认识反作用于实践',
      ['实践是认识的来源、动力、目的和检验标准', '认识的两次飞跃：感性认识→理性认识→实践', '真理的客观性、具体性和条件性', '认识的反复性、无限性和上升性'],
      [],
      ['"纸上得来终觉浅，绝知此事要躬行"——实践是认识的来源', '"没有调查就没有发言权"——实践出真知']
    ));
  await sn('POL-01-003', '价值与价值观', 'Value & Values', 'politics', D, '高中', 2, 3, 'list',
    '价值是客体对主体的积极意义，价值观影响人们的行为选择。',
    buildContent('价值判断和价值选择具有社会历史性和阶级性',
      ['价值的含义：客体对主体的积极意义', '价值判断和价值选择的标准：自觉遵循客观规律、站在人民立场', '人生价值的两个方面：自我价值和社会价值', '实现人生价值的途径：劳动和奉献、个人与社会的统一'],
      [],
      ['"苟利国家生死以，岂因祸福避趋之"——正确的价值观', '价值判断和价值选择具有社会历史性']
    ));
  await sn('POL-01-004', '哲学基本问题', 'Basic Philosophical Questions', 'politics', D, '高中', 1, 4, 'list',
    '哲学的基本问题是思维和存在的关系问题。',
    buildContent('哲学基本问题包括两个方面：何者为第一性和有无同一性',
      ['第一方面：思维和存在何者为第一性（划分唯物主义和唯心主义的标准）', '唯物主义：物质是本原，先有物质后有意识', '唯心主义：意识是本原，分为主观唯心和客观唯心', '第二方面：思维和存在有无同一性（划分可知论和不可知论）'],
      [],
      ['"存在就是被感知"——贝克莱的主观唯心主义', '"理在事先"——朱熹的客观唯心主义']
    ));
  await sn('POL-01-005', '实践与认识关系', 'Practice & Knowledge', 'politics', D, '高中', 2, 5, 'list',
    '实践和认识是辩证统一的关系，实践决定认识，认识反作用于实践。',
    buildContent('实践是认识的基础，科学理论对实践具有指导作用',
      ['实践决定认识：来源、动力、目的、检验标准', '认识的能动反作用：正确促进、错误阻碍', '理论与实践相结合的重要性', '在实践中检验和发展真理'],
      [],
      ['"实践出真知"——认识来源于实践', '"没有革命的理论，就不会有革命的运动"——列宁']
    ));
}

// Domain 2: 经济
async function seedPolitics02() {
  const D = '经济';
  await sn('POL-02-001', '商品与货币', 'Commodities & Money', 'politics', D, '高中', 2, 1, 'list',
    '商品是用于交换的劳动产品，具有使用价值和价值两个基本属性。',
    buildContent('商品是使用价值和价值的统一体',
      ['使用价值：商品能够满足人们某种需要的属性（自然属性）', '价值：凝结在商品中的无差别的人类劳动（社会属性）', '货币的本质：一般等价物，职能：价值尺度、流通手段', '纸币：由国家发行并强制使用的货币符号'],
      [],
      ['一件衣服值20元：20元是货币执行价值尺度职能', '用100元买一本书：货币执行流通手段职能']
    ));
  await sn('POL-02-002', '价值规律', 'Law of Value', 'politics', D, '高中', 2, 2, 'list',
    '价值规律是商品经济的基本规律，内容：商品的价值量由社会必要劳动时间决定。',
    buildContent('价值规律的表现形式：价格围绕价值上下波动',
      ['社会必要劳动时间决定商品价值量', '供求影响价格：供不应求→价格上涨，供过于求→价格下跌', '价格变动调节生产规模和资源配置', '价值规律的作用：刺激技术进步、促进资源优化配置、优胜劣汰'],
      [],
      ['农产品价格季节性波动是价值规律的表现', '手机价格逐年下降是因为社会劳动生产率提高']
    ));
  await sn('POL-02-003', '资本主义经济制度', 'Capitalist Economic System', 'politics', D, '高中', 2, 3, 'list',
    '资本主义经济制度的本质是生产资料私有制和雇佣劳动。',
    buildContent('资本主义经济制度的基本矛盾是生产社会化与生产资料私人占有之间的矛盾',
      ['剩余价值理论：资本家无偿占有的超过劳动力价值的那部分价值', '资本主义的基本矛盾', '经济危机的根源：生产相对过剩', '垄断资本主义的形成与发展'],
      [],
      ['"资本来到世间，从头到脚每个毛孔都滴着血和肮脏的东西"——马克思', '1929年经济大危机是资本主义基本矛盾的集中爆发']
    ));
  await sn('POL-02-004', '社会主义市场经济', 'Socialist Market Economy', 'politics', D, '高中', 2, 4, 'list',
    '社会主义市场经济把社会主义基本制度和市场经济结合起来。',
    buildContent('社会主义市场经济既有市场经济的共性，又有社会主义制度的特色',
      ['社会主义市场经济的基本标志：公有制为主体', '社会主义市场经济的根本目标：共同富裕', '社会主义市场经济的基本特征：宏观调控有力', '市场在资源配置中起决定性作用，更好发挥政府作用'],
      [],
      ['改革开放40多年中国经济的快速发展', '供给侧结构性改革：提高供给体系质量']
    ));
  await sn('POL-02-005', '收入分配与社会保障', 'Income Distribution & Social Security', 'politics', D, '高中', 2, 5, 'list',
    '合理的收入分配制度是社会公平的重要体现。',
    buildContent('坚持按劳分配为主体、多种分配方式并存',
      ['初次分配：按劳分配为主体，多种分配方式并存', '再分配：税收、社会保障、转移支付调节收入差距', '三次分配：慈善事业等社会力量参与', '社会保障体系：养老保险、医疗保险、失业保险等'],
      [],
      ['最低工资标准保障劳动者基本权益', '精准扶贫：消除绝对贫困是中国的重要成就']
    ));
}

// Domain 3: 政治
async function seedPolitics03() {
  const D = '政治';
  await sn('POL-03-001', '国家与政府职能', 'State & Government Functions', 'politics', D, '高中', 2, 1, 'list',
    '国家是阶级统治的工具，政府是国家权力的执行机关。',
    buildContent('我国政府是人民的政府，坚持对人民负责的原则',
      ['国家的本质：阶级统治的工具', '我国的国家性质：人民民主专政的社会主义国家', '政府职能：政治、经济、文化、社会、生态', '政府工作的基本原则：对人民负责'],
      [],
      ['"为人民服务"是我国政府的根本宗旨', '政府履行市场监管职能维护公平竞争秩序']
    ));
  await sn('POL-03-002', '民主与法治', 'Democracy & Rule of Law', 'politics', D, '高中', 2, 2, 'list',
    '社会主义民主是最广泛、最真实、最管用的民主。',
    buildContent('依法治国是党领导人民治理国家的基本方略',
      ['社会主义民主的本质：人民当家作主', '我国的民主形式：选举民主和协商民主', '全面依法治国：科学立法、严格执法、公正司法、全民守法', '公民的政治权利和义务：选举权、监督权等'],
      [],
      ['人民代表大会制度是我国的根本政治制度', '基层群众自治制度：村委会、居委会']
    ));
  await sn('POL-03-003', '中国政党制度', 'Chinese Political Party System', 'politics', D, '高中', 2, 3, 'list',
    '中国共产党领导的多党合作和政治协商制度是我国的基本政治制度。',
    buildContent('中国共产党是执政党，各民主党派是参政党',
      ['中国共产党领导是中国特色社会主义最本质的特征', '多党合作的基本方针：长期共存、互相监督、肝胆相照、荣辱与共', '人民政协：爱国统一战线组织，履行政治协商、民主监督、参政议政职能', '中国共产党的领导方式是政治领导、思想领导、组织领导'],
      [],
      ['全国两会：全国人大和全国政协会议', '民主党派参政议政：参加国家政权、参与国家大政方针协商']
    ));
  await sn('POL-03-004', '民族与宗教政策', 'Ethnic & Religious Policies', 'politics', D, '高中', 2, 4, 'list',
    '我国实行民族区域自治制度和宗教信仰自由政策。',
    buildContent('各民族一律平等，共同团结奋斗、共同繁荣发展',
      ['处理民族关系的基本原则：民族平等、民族团结、各民族共同繁荣', '民族区域自治制度：在少数民族聚居地方实行区域自治', '宗教信仰自由政策：保护合法、制止非法、遏制极端、抵御渗透', '引导宗教与社会主义社会相适应'],
      [],
      ['西藏自治区成立60多年的发展成就', '各民族共同团结奋斗是中华民族复兴的重要保证']
    ));
  await sn('POL-03-005', '国际关系与国际组织', 'International Relations & Organizations', 'politics', D, '高中', 2, 5, 'list',
    '国际关系的决定性因素是国家利益，和平与发展是时代主题。',
    buildContent('中国坚持独立自主的和平外交政策，推动构建人类命运共同体',
      ['国际关系的决定性因素：国家利益（共同利益是合作基础，利益对立是冲突根源）', '和平与发展是当今时代的主题', '联合国：维护国际和平与安全的首要机构', '中国外交：独立自主的和平外交政策，构建人类命运共同体'],
      [],
      ['"一带一路"倡议：促进国际合作与发展', '中国在联合国维和行动中的贡献']
    ));
}

// Domain 4: 文化与生活
async function seedPolitics04() {
  const D = '文化与生活';
  await sn('POL-04-001', '文化的本质与传承', 'Nature & Inheritance of Culture', 'politics', D, '高中', 2, 1, 'list',
    '文化是人类社会实践的产物，具有继承性和发展性。',
    buildContent('文化作为一种精神力量，能够在人们认识世界和改造世界的过程中转化为物质力量',
      ['文化的内涵：人类全部精神活动及其产品', '传统文化的特点：相对稳定性、鲜明的民族性', '文化传承的方式：传统习俗、传统建筑、传统文艺、传统思想', '对待传统文化的态度：取其精华、去其糟粕，推陈出新'],
      [],
      ['春节、中秋节等传统习俗的文化意义', '"取其精华、去其糟粕"——对待传统文化的辩证态度']
    ));
  await sn('POL-04-002', '文化交流与传播', 'Cultural Exchange & Spread', 'politics', D, '高中', 2, 2, 'list',
    '文化交流促进了世界文化的繁荣和发展。',
    buildContent('文化交流是文化发展的重要动力',
      ['文化传播的途径：商业贸易、人口迁徙、教育', '大众传媒：现代文化传播的主要手段', '尊重文化多样性：认同本民族文化、尊重其他民族文化', '文化交流的意义：促进文化创新、增进相互理解'],
      [],
      ['孔子学院在全球的传播', '电影《流浪地球》的文化输出']
    ));
  await sn('POL-04-003', '文化创新与发展', 'Cultural Innovation & Development', 'politics', D, '高中', 2, 3, 'list',
    '文化创新的源泉和动力是社会实践。',
    buildContent('文化创新是推动文化繁荣发展的必由之路',
      ['文化创新的源泉和动力：社会实践', '文化创新的重要途径：继承传统推陈出新、面向世界博采众长', '文化创新的主体：人民群众', '坚持正确方向，反对错误倾向（守旧主义、封闭主义、民族虚无主义）'],
      [],
      ['故宫文创产品的成功——传统文化与现代创意结合', '网络文学的兴起——新媒体时代的文化创新']
    ));
  await sn('POL-04-004', '社会主义核心价值观', 'Core Socialist Values', 'politics', D, '高中', 1, 4, 'list',
    '社会主义核心价值观是当代中国精神的集中体现。',
    buildContent('富强、民主、文明、和谐是国家层面的价值目标',
      ['国家层面：富强、民主、文明、和谐', '社会层面：自由、平等、公正、法治', '个人层面：爱国、敬业、诚信、友善', '培育和践行社会主义核心价值观的路径：内化于心、外化于行'],
      [],
      ['"爱国"是公民最基本的道德要求', '诚信建设：社会信用体系']
    ));
  await sn('POL-04-005', '文化生活综合', 'Cultural Life Comprehensive', 'politics', D, '高中', 3, 5, 'list',
    '综合运用文化生活的知识分析现实问题。',
    buildContent('文化生活知识的综合运用',
      ['文化对人的影响：来源、表现、特点、优秀文化塑造人生', '文化消费与文化需求的关系', '文化产业与文化事业的区别', '文化自信的来源和重要性'],
      [],
      ['优秀文化作品对人的精神激励作用', '文化自信：道路自信、理论自信、制度自信、文化自信']
    ));
}

async function main() {
  const before = await prisma.knowledgeNode.count({ where: { subject: 'politics' } });
  console.log(`迁移前政治节点数: ${before}`);
  await seedPolitics01();
  await seedPolitics02();
  await seedPolitics03();
  await seedPolitics04();
  // Relations within each domain
  const domains = ['哲学', '经济', '政治', '文化与生活'];
  for (let d = 0; d < domains.length; d++) {
    for (let i = 1; i < 5; i++) {
      const from = `POL-0${d+1}-${String(i).padStart(3,'0')}`;
      const to = `POL-0${d+1}-${String(i+1).padStart(3,'0')}`;
      await sr(from, to, 'prerequisite', i);
    }
  }
  const after = await prisma.knowledgeNode.count({ where: { subject: 'politics' } });
  console.log(`迁移完成: ${after} 节点`);
}
main().catch(e => { console.error('❌ 迁移失败:', e); process.exit(1); }).finally(() => prisma.$disconnect());
