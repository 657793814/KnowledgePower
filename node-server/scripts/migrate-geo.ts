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

// Domain 1: 自然地理
async function seedGeo01() {
  const D = '自然地理';
  await sn('GEO-01-001', '地球与地图', 'Earth & Maps', 'geo', D, '初中', 1, 1, 'map',
    '地球是太阳系八大行星之一，地图是地理信息的重要表达方式。',
    buildContent('地球的形状、大小和运动是自然地理的基础',
      ['地球形状：两极稍扁、赤道略鼓的不规则球体', '地球大小：平均半径6371km，赤道周长约4万km', '经纬网：经线指示南北，纬线指示东西', '地图三要素：比例尺、方向、图例'],
      [],
      ['利用经纬度确定北京的位置(约40°N, 116°E)', '比例尺越大，表示范围越小，内容越详细']
    ));
  await sn('GEO-01-002', '地形与地貌', 'Topography & Landforms', 'geo', D, '初中', 1, 2, 'image',
    '地表形态是内力和外力共同作用的结果。',
    buildContent('内力造就地表骨架，外力塑造地表细节',
      ['内力作用：地壳运动、岩浆活动、变质作用（板块构造理论）', '外力作用：风化、侵蚀、搬运、堆积', '主要地形：平原、高原、山地、丘陵、盆地', '河流地貌：上游V型谷，下游三角洲'],
      [],
      ['喜马拉雅山脉由印度洋板块与亚欧板块碰撞形成', '黄土高原千沟万壑是流水侵蚀的结果']
    ));
  await sn('GEO-01-003', '大气与气候', 'Atmosphere & Climate', 'geo', D, '高中', 2, 3, 'mindmap',
    '大气的受热过程和各种气候类型是自然地理的核心内容。',
    buildContent('太阳辐射是大气运动的根本能量来源',
      ['大气的受热过程：太阳暖大地→大地暖大气→大气还大地', '热力环流：冷热不均引起空气垂直运动，进而水平运动', '气压带风带：赤道低气压带、副热带高气压带等', '主要气候类型：热带雨林、地中海、温带海洋性、季风气候'],
      [],
      ['海陆热力性质差异是季风气候形成的主要原因', '赤道地区终年高温多雨，两极终年寒冷干燥']
    ));
  await sn('GEO-01-004', '水循环与洋流', 'Water Cycle & Ocean Currents', 'geo', D, '高中', 2, 4, 'list',
    '水循环维持全球水量平衡，洋流影响气候和海洋生态。',
    buildContent('水循环是地球上最重要的物质循环之一',
      ['水循环环节：蒸发、水汽输送、降水、径流', '水循环类型：海陆间循环、陆地内循环、海上内循环', '洋流分布规律：北顺南逆（副热带海区），北逆南顺（副极地海区）', '洋流对气候的影响：暖流增温增湿，寒流降温减湿'],
      [],
      ['秘鲁寒流使沿岸形成沙漠景观', '北大西洋暖流使西欧形成温带海洋性气候']
    ));
  await sn('GEO-01-005', '自然资源与自然灾害', 'Natural Resources & Disasters', 'geo', D, '高中', 2, 5, 'list',
    '自然资源是人类生存发展的物质基础，自然灾害需要科学防范。',
    buildContent('合理利用资源，防灾减灾',
      ['自然资源分类：可再生资源（水、森林）和不可再生资源（矿产）', '中国资源特点：总量丰富但人均不足，空间分布不均', '主要灾害：地震、台风、洪涝、干旱、滑坡泥石流', '防灾减灾：监测预警、工程措施、非工程措施'],
      [],
      ['汶川地震(2008)：震级8.0级，造成重大损失', '台风的防御：关注预警、加固设施、转移人员']
    ));
}

// Domain 2: 人文地理
async function seedGeo02() {
  const D = '人文地理';
  await sn('GEO-02-001', '人口与城市', 'Population & Cities', 'geo', D, '高中', 2, 1, 'map',
    '人口分布受自然环境和社会经济因素影响，城市化是社会发展的必然趋势。',
    buildContent('人口增长模式和城市空间结构是人文地理的核心',
      ['人口增长模式：原始型→传统型→现代型（三低）', '人口迁移：推力因素和拉力因素', '城市化进程：起步→加速→后期成熟阶段', '城市空间结构：同心圆、扇形、多核心模式'],
      [],
      ['中国人口东多西少，黑河—腾冲线为界', '上海浦东新区的开发改变了城市空间结构']
    ));
  await sn('GEO-02-002', '农业与工业', 'Agriculture & Industry', 'geo', D, '高中', 2, 2, 'map',
    '农业和工业的区位选择直接影响区域经济发展。',
    buildContent('区位因素决定农业和工业的布局',
      ['农业区位：自然（气候、地形、土壤、水源）+社会经济（市场、交通、政策、科技）', '主要农业地域类型：季风水田农业、商品谷物农业、大牧场放牧业', '工业区位：原料、能源、市场、劳动力、技术、交通', '工业集聚和分散的原因及影响'],
      [],
      ['泰国水稻种植业：高温多雨的气候条件', '德国鲁尔区：丰富的煤炭资源和便利的水运']
    ));
  await sn('GEO-02-003', '交通运输', 'Transportation', 'geo', D, '高中', 2, 3, 'map',
    '交通运输是连接生产与消费的纽带，影响着区域发展。',
    buildContent('交通运输方式和布局对区域发展有重要影响',
      ['主要运输方式：铁路、公路、水路、航空、管道', '各运输方式特点：运量、速度、成本、灵活性比较', '交通线选址：考虑地形、地质、水文等自然因素', '交通枢纽：多种运输方式交汇的地方'],
      [],
      ['京沪高铁：缩短时空距离，促进沿线经济发展', '港珠澳大桥：粤港澳大湾区建设的关键工程']
    ));
  await sn('GEO-02-004', '区域发展', 'Regional Development', 'geo', D, '高中', 2, 4, 'map',
    '区域发展不平衡是普遍现象，协调发展是重要目标。',
    buildContent('区域发展需要因地制宜，发挥比较优势',
      ['区域差异：自然条件、资源禀赋、经济基础不同', '区域发展阶段：初期→成长→转型→再生', '产业转移：劳动力密集型产业从发达地区向欠发达地区转移', '区域合作：优势互补、互利共赢'],
      [],
      ['西部大开发战略：促进区域协调发展', '珠三角产业向粤东西北转移']
    ));
  await sn('GEO-02-005', '可持续发展', 'Sustainable Development', 'geo', D, '高中', 3, 5, 'list',
    '可持续发展要求经济、社会、环境协调统一。',
    buildContent('可持续发展是人类共同的发展理念',
      ['可持续发展的内涵：生态可持续、经济可持续、社会可持续', '三大原则：公平性、持续性、共同性', '中国实践：生态文明建设、绿色发展、碳达峰碳中和', '全球性问题：气候变化、生物多样性减少、环境污染'],
      [],
      ['"绿水青山就是金山银山"的生态理念', '巴黎协定：全球应对气候变化的里程碑']
    ));
}

// Domain 3: 区域地理
async function seedGeo03() {
  const D = '区域地理';
  await sn('GEO-03-001', '亚洲', 'Asia', 'geo', D, '初中', 1, 1, 'map',
    '亚洲是世界面积最大、人口最多的大洲，地理环境复杂多样。',
    buildContent('亚洲的自然和人文地理特征',
      ['位置：跨纬度最广、东西距离最长的大洲', '地形：中部高四周低，以高原山地为主', '气候：复杂多样，季风气候显著', '河流：多发源于中部，呈放射状流向四周'],
      [],
      ['青藏高原是世界最高的高原', '长江是亚洲第一长河']
    ));
  await sn('GEO-03-002', '欧洲', 'Europe', 'geo', D, '初中', 1, 2, 'map',
    '欧洲是世界上经济最发达的地区之一，地形以平原为主。',
    buildContent('欧洲的自然和人文地理特征',
      ['地形：以平原为主，地势低平', '气候：温带海洋性气候典型，受北大西洋暖流影响', '河流：航运价值高（莱茵河、多瑙河）', '经济：欧盟是重要的区域经济组织'],
      [],
      ['瑞士阿尔卑斯山旅游', '荷兰围海造田']
    ));
  await sn('GEO-03-003', '非洲', 'Africa', 'geo', D, '初中', 1, 3, 'map',
    '非洲被称为"富饶的大陆"，自然资源丰富但经济发展相对滞后。',
    buildContent('非洲的自然和人文地理特征',
      ['地形：以高原为主，被称为"高原大陆"', '气候：以赤道为中心南北对称分布', '自然资源：黄金、金刚石储量世界第一', '问题：人口、粮食、环境问题突出'],
      [],
      ['撒哈拉以南非洲是黑种人的故乡', '尼罗河是世界最长的河流']
    ));
  await sn('GEO-03-004', '美洲', 'Americas', 'geo', D, '初中', 1, 4, 'map',
    '美洲包括北美洲和南美洲，地理环境差异显著。',
    buildContent('美洲的自然和人文地理特征',
      ['北美洲：地形三大纵列带，温带大陆性气候为主', '南美洲：安第斯山脉、亚马逊平原、热带雨林', '美国：世界最大的经济体，高新技术产业发达', '巴西：热带雨林破坏是全球关注的问题'],
      [],
      ['美国硅谷：全球高新技术产业中心', '亚马逊热带雨林：地球之肺']
    ));
  await sn('GEO-03-005', '中国地理', 'China Geography', 'geo', D, '初中', 1, 5, 'map',
    '中国地理涵盖自然和人文各方面，是区域地理的核心内容。',
    buildContent('中国的地理位置、地形、气候、河流和资源',
      ['位置：东亚、太平洋西岸，海陆兼备', '地形：西高东低，三级阶梯', '气候：季风气候显著，雨热同期', '河流：长江、黄河是两大母亲河', '资源：种类齐全但人均不足'],
      [],
      ['秦岭—淮河线：南方北方的分界线', '长江经济带：沿长江的黄金水道']
    ));
}

// Domain 4: 地图与地理工具
async function seedGeo04() {
  const D = '地图与地理工具';
  await sn('GEO-04-001', '经纬网', 'Latitude & Longitude', 'geo', D, '初中', 1, 1, 'map',
    '经纬网是确定地球表面任何地点位置的坐标系统。',
    buildContent('经度和纬度构成了全球定位系统的基础',
      ['经线：连接南北两极，指示南北方向，共360条', '纬线：与赤道平行，指示东西方向，赤道最长', '本初子午线：0°经线，通过英国格林尼治天文台', '东西半球分界：20°W和160°E'],
      [],
      ['北京的经纬度约为(40°N, 116°E)', '赤道是南北半球的分界线']
    ));
  await sn('GEO-04-002', '等高线与地形图', 'Contour Lines & Topographic Maps', 'geo', D, '初中', 1, 2, 'map',
    '等高线是地图上表示地形起伏的重要方法。',
    buildContent('等高线密集表示坡陡，稀疏表示坡缓',
      ['等高线闭合：中间高四周低为山峰，中间低四周高为盆地', '等高线重叠：陡崖', '山脊：等高线向低处凸出', '山谷：等高线向高处凸出（可能有河流）'],
      [],
      ['在等高线图上判断登山路线：选等高线稀疏处', '山谷处易发育河流']
    ));
  await sn('GEO-04-003', 'GIS与遥感', 'GIS & Remote Sensing', 'geo', D, '高中', 2, 3, 'list',
    '地理信息技术（3S技术）是现代地理学研究的重要工具。',
    buildContent('3S技术：RS、GIS、GPS/GNSS的综合应用',
      ['遥感(RS)：获取地表信息，如卫星影像', '地理信息系统(GIS)：数据处理、分析和决策支持', '全球导航卫星系统(GNSS)：定位、导航', '3S集成：遥感获取数据→GIS分析→GNSS精确定位'],
      [],
      ['卫星云图预测天气变化', '手机导航使用GNSS定位和GIS路径规划']
    ));
  await sn('GEO-04-004', '地图阅读', 'Map Reading Skills', 'geo', D, '初中', 1, 4, 'map',
    '掌握地图阅读方法是学习地理的基本技能。',
    buildContent('地图阅读的基本方法和技巧',
      ['看图例：理解地图符号的含义', '看比例尺：判断实际距离', '看注记：文字说明提供关键信息', '综合分析：结合多种地图信息得出结论'],
      [],
      ['在中国政区图上查找省份位置', '在地形图上判断河流流向']
    ));
  await sn('GEO-04-005', '统计图表', 'Statistical Charts', 'geo', D, '高中', 2, 5, 'list',
    '统计图表是表达地理数据的重要方式。',
    buildContent('常见的地理统计图表及其解读方法',
      ['柱状图：比较不同类别的数据大小', '折线图：显示数据的变化趋势', '饼图：表示各部分占总体的比例', '等值线图：等温线、等降水量线、等压线'],
      [],
      ['读某地气温年变化曲线图判断气候类型', '读人口金字塔图分析人口年龄结构']
    ));
}

// Domain 5: 环境与可持续发展
async function seedGeo05() {
  const D = '环境与可持续发展';
  await sn('GEO-05-001', '环境问题', 'Environmental Problems', 'geo', D, '高中', 2, 1, 'list',
    '全球性环境问题威胁着人类的生存和发展。',
    buildContent('当前面临的主要环境问题及其成因',
      ['全球变暖：温室气体排放导致气温上升', '臭氧层破坏：氟氯烃等物质消耗臭氧', '酸雨：硫氧化物和氮氧化物排放', '水资源短缺和水污染', '生物多样性减少'],
      [],
      ['工业革命以来全球气温上升约1.1°C', '北极冰川融化导致海平面上升']
    ));
  await sn('GEO-05-002', '生态保护', 'Ecological Protection', 'geo', D, '高中', 2, 2, 'list',
    '保护生态环境是实现可持续发展的必要措施。',
    buildContent('生态系统具有自我调节能力但有限度',
      ['生态系统的组成：生产者、消费者、分解者、非生物环境', '食物链和食物网：能量流动和物质循环的渠道', '保护措施：建立自然保护区、退耕还林还草', '生态恢复：湿地保护、荒漠化治理'],
      [],
      ['三江源自然保护区：长江、黄河、澜沧江源头', '塞罕坝林场：荒漠变绿洲的奇迹']
    ));
  await sn('GEO-05-003', '资源利用', 'Resource Utilization', 'geo', D, '高中', 2, 3, 'list',
    '合理开发利用资源是实现可持续发展的关键。',
    buildContent('资源利用要兼顾经济效益和生态效益',
      ['矿产资源：不可再生，要节约使用和寻找替代品', '水资源：时空分布不均，要节约用水和合理调配', '土地资源：耕地红线，保护优质耕地', '新能源：太阳能、风能、核能等清洁能源'],
      [],
      ['南水北调工程：解决北方水资源短缺', '光伏发电：利用太阳能发电']
    ));
  await sn('GEO-05-004', '循环经济', 'Circular Economy', 'geo', D, '高中', 2, 4, 'list',
    '循环经济是以资源高效利用和循环利用为核心的经济模式。',
    buildContent('循环经济遵循3R原则：减量化、再利用、资源化',
      ['3R原则：Reduce(减量)、Reuse(复用)、Recycle(回收)', '与传统经济的区别：从"资源→产品→废物"到"资源→产品→再生资源"', '垃圾分类：提高资源回收利用率', '绿色消费：环保产品、低碳生活'],
      [],
      ['日本垃圾分类制度：细致分类提高回收率', '废旧电池回收：防止重金属污染']
    ));
  await sn('GEO-05-005', '全球环境治理', 'Global Environmental Governance', 'geo', D, '高中', 3, 5, 'list',
    '全球环境治理需要各国共同努力，承担共同但有区别的责任。',
    buildContent('国际合作是应对全球环境问题的必由之路',
      ['《巴黎协定》：控制全球升温在2°C以内', '共同但有区别的责任：发达国家承担更多义务', '中国承诺：碳达峰(2030)和碳中和(2060)', '绿色"一带一路"：推动国际环保合作'],
      [],
      ['联合国气候变化大会(COP)：年度全球气候谈判', '中国光伏产业：全球领先的技术和产能']
    ));
}

async function main() {
  const before = await prisma.knowledgeNode.count({ where: { subject: 'geo' } });
  console.log(`迁移前地理节点数: ${before}`);
  await seedGeo01();
  await seedGeo02();
  await seedGeo03();
  await seedGeo04();
  await seedGeo05();
  // Relations within each domain
  const domains = ['自然地理', '人文地理', '区域地理', '地图与地理工具', '环境与可持续发展'];
  for (let d = 0; d < domains.length; d++) {
    for (let i = 1; i < 5; i++) {
      const from = `GEO-0${d+1}-${String(i).padStart(3,'0')}`;
      const to = `GEO-0${d+1}-${String(i+1).padStart(3,'0')}`;
      await sr(from, to, 'prerequisite', i);
    }
  }
  const after = await prisma.knowledgeNode.count({ where: { subject: 'geo' } });
  console.log(`迁移完成: ${after} 节点`);
}
main().catch(e => { console.error('❌ 迁移失败:', e); process.exit(1); }).finally(() => prisma.$disconnect());
