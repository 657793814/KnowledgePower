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

// Domain 1: 中国古代史
async function seedHistory01() {
  const D = '中国古代史';
  await sn('HIS-01-001', '夏商周与分封制', 'Xia-Shang-Zhou & Feudal System', 'history', D, '高中', 2, 1, 'timeline',
    '夏商周三代是中国早期国家形成与发展的重要阶段，分封制和宗法制构成了西周政治制度的核心。',
    buildContent('夏商周三代奠定了中国古代政治制度的基础',
      ['夏朝：中国第一个王朝（约前2070年），禹建立，世袭制取代禅让制', '商朝：青铜文明鼎盛，甲骨文是最早的成熟文字', '西周分封制：天子→诸侯→卿大夫→士，层层分封', '宗法制：嫡长子继承制为核心，家国同构'],
      [],
      ['分封制下，诸侯对天子有纳贡、出兵等义务', '宗法制保证了权力的稳定传承']
    ));
  await sn('HIS-01-002', '春秋战国与百家争鸣', 'Spring-Autumn & Hundred Schools', 'history', D, '高中', 2, 2, 'mindmap',
    '春秋战国是大变革时代，诸侯争霸、百家争鸣深刻影响了中国历史走向。',
    buildContent('春秋战国是社会大变革和文化大繁荣的时代',
      ['春秋五霸：齐桓公、晋文公等，尊王攘夷', '战国七雄：齐楚秦燕赵魏韩，兼并战争激烈', '百家争鸣：儒(孔子/孟子)、道(老子/庄子)、法(韩非子)、墨(墨子)', '变法运动：商鞅变法使秦国最强盛'],
      [],
      ['孔子主张"仁"和"礼"，创办私学', '商鞅变法：废井田、开阡陌、奖励耕战']
    ));
  await sn('HIS-01-003', '秦汉大一统', 'Qin-Han Unification', 'history', D, '高中', 2, 3, 'timeline',
    '秦始皇统一六国建立中央集权制度，汉武帝巩固大一统格局。',
    buildContent('秦汉时期建立了中国历史上第一个大一统帝国',
      ['秦统一：前221年灭六国，皇帝制度、郡县制、书同文车同轨', '秦灭亡：暴政导致陈胜吴广起义，项羽刘邦灭秦', '汉初休养生息：文景之治，黄老思想', '汉武帝大一统：罢黜百家独尊儒术、推恩令、盐铁专卖'],
      [],
      ['郡县制 vs 分封制：中央集权的关键制度创新', '董仲舒新儒学：天人感应、君权神授']
    ));
  await sn('HIS-01-004', '三国两晋南北朝', 'Three Kingdoms to Northern/Southern Dynasties', 'history', D, '高中', 2, 4, 'timeline',
    '这是一个分裂动荡但民族融合的重要时期。',
    buildContent('魏晋南北朝是政权分立与民族大融合的时期',
      ['三国鼎立：魏蜀吴三分天下，赤壁之战是关键转折', '西晋短暂统一后八王之乱、永嘉之乱导致南迁', '东晋南朝：江南经济开发，门阀政治盛行', '北魏孝文帝改革：迁都洛阳、汉化政策促进民族融合'],
      [],
      ['淝水之战：前秦苻坚败于东晋，北方再度分裂', '孝文帝改革：改汉姓、穿汉服、说汉语']
    ));
  await sn('HIS-01-005', '隋唐盛世', 'Sui-Tang Golden Age', 'history', D, '高中', 2, 5, 'timeline',
    '隋唐是中国古代最辉煌的时期之一，开创了开放包容的大国气象。',
    buildContent('隋唐时期是中国封建社会的鼎盛阶段',
      ['隋的统一：结束近400年分裂，创立科举制', '唐太宗贞观之治：纳谏任贤、轻徭薄赋', '唐玄宗开元盛世：唐朝国力达到顶峰', '安史之乱：由盛转衰的转折点'],
      [],
      ['科举制打破门阀垄断，促进社会流动', '丝绸之路在唐代达到鼎盛']
    ));
}

// Domain 2: 中国近现代史
async function seedHistory02() {
  const D = '中国近现代史';
  await sn('HIS-02-001', '鸦片战争与近代探索', 'Opium War & Early Modernization', 'history', D, '高中', 2, 1, 'timeline',
    '鸦片战争打开了中国大门，先进中国人开始探索救国道路。',
    buildContent('鸦片战争是中国近代史的开端',
      ['鸦片战争(1840-1842)：林则徐虎门销烟为导火索，签订《南京条约》', '第二次鸦片战争(1856-1860)：火烧圆明园', '洋务运动：师夷长技以自强，中体西用', '早期维新思想：郑观应等主张君主立宪'],
      [],
      ['《南京条约》：割香港岛、赔款2100万银元、五口通商', '洋务派代表人物：曾国藩、李鸿章、左宗棠']
    ));
  await sn('HIS-02-002', '辛亥革命与民国建立', 'Xinhai Revolution', 'history', D, '高中', 2, 2, 'timeline',
    '孙中山领导的辛亥革命推翻了封建帝制，建立了亚洲第一个共和国。',
    buildContent('辛亥革命结束了中国两千多年的君主专制制度',
      ['三民主义：民族、民权、民生', '武昌起义(1911.10.10)：辛亥革命的开端', '中华民国建立(1912.1.1)：孙中山就任临时大总统', '《临时约法》：中国第一部资产阶级宪法性文件'],
      [],
      ['辛亥革命的历史意义：推翻帝制、建立共和', '袁世凯窃取革命果实，民主共和道路曲折']
    ));
  await sn('HIS-02-003', '新文化运动与五四运动', 'New Culture & May Fourth', 'history', D, '高中', 2, 3, 'mindmap',
    '新文化运动掀起思想解放潮流，五四运动标志着新民主主义革命的开端。',
    buildContent('新文化运动和五四运动是中国近代思想解放的重要里程碑',
      ['新文化运动：德先生(民主)和赛先生(科学)', '代表人物：陈独秀、李大钊、胡适、鲁迅', '五四运动(1919)：巴黎和会外交失败引发', '五四精神：爱国、进步、民主、科学'],
      [],
      ['《新青年》杂志：新文化运动的主要阵地', '马克思主义在中国开始传播']
    ));
  await sn('HIS-02-004', '中国共产党成立与革命道路', 'CPC Founding & Revolutionary Path', 'history', D, '高中', 2, 4, 'timeline',
    '中国共产党诞生后，开辟了农村包围城市、武装夺取政权的革命道路。',
    buildContent('中国共产党领导中国人民进行了艰苦卓绝的斗争',
      ['中共一大(1921)：上海召开，标志党的成立', '第一次国共合作：北伐战争基本推翻北洋军阀', '南昌起义(1927)：武装反抗国民党反动派的第一枪', '井冈山道路：农村包围城市，武装夺取政权', '长征(1934-1936)：遵义会议是生死攸关的转折点'],
      [],
      ['遵义会议确立了毛泽东在党和红军中的领导地位', '抗日战争：中国共产党成为全民族抗战的中流砥柱']
    ));
  await sn('HIS-02-005', '新中国成立与社会主义建设', 'PRC Founding & Socialist Construction', 'history', D, '高中', 2, 5, 'timeline',
    '新中国成立后，经历了社会主义改造和改革开放的伟大历程。',
    buildContent('新中国成立以来经历了从站起来到富起来的伟大飞跃',
      ['开国大典(1949.10.1)：中华人民共和国成立', '三大改造(1953-1956)：农业、手工业、资本主义工商业社会主义改造', '改革开放(1978)：十一届三中全会开启新时期', '中国特色社会主义：邓小平理论指导下的发展道路'],
      [],
      ['家庭联产承包责任制：农村改革的突破口', '经济特区：深圳、珠海、汕头、厦门']
    ));
}

// Domain 3: 世界古代史
async function seedHistory03() {
  const D = '世界古代史';
  await sn('HIS-03-001', '古埃及文明', 'Ancient Egypt', 'history', D, '初中', 1, 1, 'image',
    '古埃及文明发源于尼罗河流域，以其金字塔、象形文字和法老制度闻名于世。',
    buildContent('古埃及是人类最早诞生的文明之一',
      ['尼罗河：埃及文明的摇篮，定期泛滥带来肥沃土壤', '金字塔：法老的陵墓，吉萨金字塔群最著名', '象形文字：商博良破译，记载在莎草纸上', '法老制度：神权与王权结合'],
      [],
      ['胡夫金字塔是现存最大的金字塔', '罗塞塔石碑帮助破译了象形文字']
    ));
  await sn('HIS-03-002', '古希腊罗马文明', 'Ancient Greece & Rome', 'history', D, '初中', 1, 2, 'mindmap',
    '古希腊是西方文明的摇篮，罗马帝国则奠定了西方法律和政治制度的基础。',
    buildContent('希腊罗马文明是西方文明的源头',
      ['雅典民主政治：伯里克利时代达到顶峰', '斯巴达：军事化城邦，崇尚武力', '亚历山大东征：希腊文化传播到东方', '罗马法：《十二铜表法》到《查士丁尼法典》', '罗马帝国：屋大维建立元首制，后分裂为东西罗马'],
      [],
      ['雅典民主：公民大会是最高权力机关', '罗马法的核心原则：私有财产神圣不可侵犯']
    ));
  await sn('HIS-03-003', '印度文明与佛教传播', 'Indian Civilization & Buddhism', 'history', D, '初中', 1, 3, 'image',
    '古印度文明创造了独特的文化和宗教体系，佛教从中国传播到东亚各国。',
    buildContent('古印度文明和佛教对亚洲文化影响深远',
      ['种姓制度：婆罗门、刹帝利、吠舍、首陀罗', '释迦牟尼创立佛教：四圣谛、八正道', '阿育王：佛教成为国教并向外传播', '佛教传入中国：西汉末东汉初，经丝绸之路'],
      [],
      ['佛教四大圣地：蓝毗尼、菩提伽耶、鹿野苑、拘尸那罗', '玄奘西行取经：著有《大唐西域记》']
    ));
  await sn('HIS-03-004', '阿拉伯帝国与伊斯兰文明', 'Arab Empire & Islamic Civilization', 'history', D, '初中', 1, 4, 'image',
    '阿拉伯帝国是连接东西方文化的桥梁，伊斯兰文明在数学、医学、天文等领域成就辉煌。',
    buildContent('阿拉伯帝国和伊斯兰文明在历史上发挥了重要的桥梁作用',
      ['穆罕默德创立伊斯兰教(7世纪初)', '阿拉伯帝国：四大哈里发时期和倭马亚王朝', '阿拉伯数字：实际发明于印度，经阿拉伯人传播', '学术贡献：花拉子米(代数)、伊本·西那(医学)'],
      [],
      ['《一千零一夜》：阿拉伯民间故事集', '巴格达智慧宫：翻译运动保存了大量古典文献']
    ));
  await sn('HIS-03-005', '中世纪欧洲封建制度', 'Medieval European Feudalism', 'history', D, '初中', 1, 5, 'mindmap',
    '中世纪欧洲形成了以封君封臣制度和庄园经济为基础的封建体系。',
    buildContent('中世纪欧洲封建制度是社会结构和政治组织的基本形式',
      ['封君封臣制：我的附庸的附庸不是我的附庸', '庄园经济：自给自足的农业经济单位', '基督教会：中世纪欧洲最大的土地所有者和精神权威', '骑士制度：封建社会的军事阶层'],
      [],
      ['《大宪章》(1215年)：限制王权的重要文件', '大学的兴起：巴黎大学、牛津大学等']
    ));
}

// Domain 4: 世界近现代史
async function seedHistory04() {
  const D = '世界近现代史';
  await sn('HIS-04-001', '文艺复兴与宗教改革', 'Renaissance & Reformation', 'history', D, '高中', 2, 1, 'mindmap',
    '文艺复兴是一场思想文化运动，宗教改革打破了天主教会的统治。',
    buildContent('文艺复兴和宗教改革是欧洲思想解放的重要运动',
      ['文艺复兴起源：14世纪意大利，核心是人文主义', '代表人物：但丁、达·芬奇、米开朗基罗、莎士比亚', '宗教改革：马丁·路德发表《九十五条论纲》', '宗教改革的影响：打破天主教会的精神垄断'],
      [],
      ['人文主义核心：以人为中心而不是以神为中心', '印刷术的传播推动了文艺复兴和宗教改革']
    ));
  await sn('HIS-04-002', '新航路开辟与殖民扩张', 'Age of Discovery & Colonialism', 'history', D, '高中', 2, 2, 'map',
    '新航路的开辟改变了世界格局，开启了全球化和殖民扩张的时代。',
    buildContent('新航路开辟是世界从分散走向整体的关键事件',
      ['迪亚士：到达好望角(1488)', '达·伽马：到达印度(1498)', '哥伦布：发现美洲(1492)', '麦哲伦船队：完成环球航行(1519-1522)', '殖民扩张：西班牙、葡萄牙、荷兰、英国、法国'],
      [],
      ['三角贸易：欧洲→非洲→美洲→欧洲的奴隶贸易', '殖民掠夺加速了欧洲资本原始积累']
    ));
  await sn('HIS-04-003', '资产阶级革命与启蒙运动', 'Bourgeois Revolutions & Enlightenment', 'history', D, '高中', 2, 3, 'timeline',
    '英法美三国资产阶级革命确立了资本主义制度，启蒙运动为其提供了思想武器。',
    buildContent('资产阶级革命和启蒙运动奠定了现代资本主义政治制度的基础',
      ['英国资产阶级革命(1640-1688)：《权利法案》确立君主立宪', '美国独立战争(1775-1783)：《独立宣言》《1787年宪法》', '法国大革命(1789)：《人权宣言》', '启蒙运动：伏尔泰、孟德斯鸠、卢梭、康德'],
      [],
      ['三权分立：孟德斯鸠提出的政治学说', '社会契约论：卢梭的政治哲学核心']
    ));
  await sn('HIS-04-004', '工业革命与资本主义发展', 'Industrial Revolution', 'history', D, '高中', 2, 4, 'timeline',
    '工业革命彻底改变了人类的生产方式和社会结构。',
    buildContent('工业革命是人类历史上最伟大的生产力变革',
      ['第一次工业革命：蒸汽机(瓦特)，英国率先完成', '第二次工业革命：电力、内燃机、化学工业', '工人阶级崛起：马克思主义诞生(1848)', '帝国主义：19世纪末20世纪初资本主义进入垄断阶段'],
      [],
      ['蒸汽时代 → 电气时代 → 信息时代', '城市化进程加速：农村人口向城市转移']
    ));
  await sn('HIS-04-005', '两次世界大战与冷战', 'World Wars & Cold War', 'history', D, '高中', 2, 5, 'timeline',
    '20世纪经历了两次世界大战和长达半个世纪的冷战格局。',
    buildContent('两次世界大战和冷战塑造了20世纪的世界格局',
      ['一战(1914-1918)：凡尔赛-华盛顿体系', '二战(1939-1945)：雅尔塔体系确立两极格局', '冷战：杜鲁门主义、马歇尔计划、北约vs华约', '多极化趋势：欧盟、日本崛起、不结盟运动'],
      [],
      ['联合国成立(1945)：维护世界和平的国际组织', '柏林墙倒塌(1989)：冷战结束的标志之一']
    ));
}

async function main() {
  const before = await prisma.knowledgeNode.count({ where: { subject: 'history' } });
  console.log(`迁移前历史节点数: ${before}`);
  await seedHistory01();
  await seedHistory02();
  await seedHistory03();
  await seedHistory04();
  // Relations within each domain
  const domains = ['中国古代史', '中国近现代史', '世界古代史', '世界近现代史'];
  for (let d = 0; d < domains.length; d++) {
    for (let i = 1; i < 5; i++) {
      const from = `HIS-0${d+1}-${String(i).padStart(3,'0')}`;
      const to = `HIS-0${d+1}-${String(i+1).padStart(3,'0')}`;
      await sr(from, to, 'prerequisite', i);
    }
  }
  const after = await prisma.knowledgeNode.count({ where: { subject: 'history' } });
  console.log(`迁移完成: ${after} 节点`);
}
main().catch(e => { console.error('❌ 迁移失败:', e); process.exit(1); }).finally(() => prisma.$disconnect());
