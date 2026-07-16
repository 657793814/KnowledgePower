/**
 * 试卷洞察路由 — PaperInsight
 * 
 * POST /insight/analyze    分析题目文本，匹配知识点
 * POST /insight/generate    基于洞察结果生成组卷
 */
import { Router } from 'express';
import prisma from '../db.js';
import { ok } from '../utils/response.js';
import { buildExamService } from '../services/examService.js';
import { buildAiService } from '../services/aiService.js';
import { getAiConfig } from '../config.js';
import axios from 'axios';

const router = Router();
const examService = buildExamService(prisma);
const aiService = buildAiService(prisma);

// ─── 关键词 → 知识点匹配规则 ───

const KEYWORD_MAP: Record<string, string[]> = {
  // 数学
  '勾股定理': ['MATH-05-005'],
  '三角函数|sin|cos|tan|正弦|余弦|正切': ['MATH-04-010', 'MATH-04-014'],
  '诱导公式|恒等变换|和差角|倍角': ['MATH-04-014'],
  '解三角形|正弦定理|余弦定理': ['MATH-05-010'],
  '二次函数|抛物线|顶点': ['MATH-04-004'],
  '指数|对数': ['MATH-04-007', 'MATH-04-008'],
  '导数|微分|求导': ['MATH-07-006', 'MATH-07-007', 'MATH-07-008'],
  '积分|定积分|微积分': ['MATH-07-010'],
  '极限|收敛|发散': ['MATH-07-011', 'MATH-07-012'],
  '数列|等差|等比': ['MATH-07-002', 'MATH-07-003'],
  '求和|裂项|错位相减': ['MATH-07-004', 'MATH-07-013'],
  '向量|点积|叉积': ['MATH-05-009'],
  '圆|椭圆|双曲线|抛物线|圆锥': ['MATH-05-014', 'MATH-05-007'],
  '直线方程|斜率|截距': ['MATH-05-013'],
  '立体几何|空间|三视图': ['MATH-05-011', 'MATH-05-012'],
  '概率|排列|组合|二项式': ['MATH-06-001', 'MATH-06-002', 'MATH-06-003', 'MATH-06-008', 'MATH-06-009'],
  '复数|虚数': ['MATH-02-012'],
  '不等式|均值|基本不等式': ['MATH-03-008', 'MATH-03-003'],
  '集合|子集|交集|并集': ['MATH-02-011'],
  '方程|一元二次': ['MATH-03-005'],
  '数学归纳': ['MATH-07-005'],
  '特征根|不动点|递推': ['MATH-07-014'],
  '因式分解|完全平方|立方|乘法公式': ['MATH-02-005', 'MATH-02-006', 'MATH-02-013'],

  // 物理
  '牛顿|力|加速度|F=ma': ['PHY-01-005', 'PHY-01-006', 'PHY-01-013'],
  '匀变速|自由落体|抛体': ['PHY-01-008', 'PHY-01-014'],
  '圆周|向心|万有引力': ['PHY-01-015', 'PHY-01-016'],
  '动量|碰撞|守恒': ['PHY-01-017'],
  '振动|简谐|单摆|弹簧振子': ['PHY-01-018'],
  '波|干涉|衍射|多普勒': ['PHY-01-019'],
  '功|能|机械能|动能|势能': ['PHY-01-011'],
  '电场|库仑|电荷|电势': ['PHY-03-002', 'PHY-03-003', 'PHY-03-004', 'PHY-03-005'],
  '电流|欧姆|电阻|电路': ['PHY-03-007', 'PHY-03-008'],
  '磁场|安培|洛伦兹': ['PHY-03-010', 'PHY-03-011', 'PHY-03-012'],
  '电磁感应|楞次|法拉第': ['PHY-03-013'],
  '交变电流|变压器': ['PHY-03-014'],
  '光的反射|折射|全反射|透镜': ['PHY-04-002', 'PHY-04-004', 'PHY-04-005', 'PHY-04-006'],
  '光的干涉|衍射|偏振': ['PHY-04-007', 'PHY-04-008', 'PHY-04-009'],
  '热力学|内能|温度|熵': ['PHY-02-004', 'PHY-02-005', 'PHY-02-006'],
  '气体|理想气体|状态方程': ['PHY-02-007', 'PHY-02-008'],
  '光电效应|波粒|量子|原子|核': ['PHY-06-001', 'PHY-06-002', 'PHY-06-003', 'PHY-06-006'],
  '声|音速|共鸣|超声': ['PHY-05-001', 'PHY-05-002', 'PHY-05-004'],
  '相对论|狭义相对论': ['PHY-06-008'],

  // 化学
  '元素周期|周期表|原子序数': ['CHEM-03-001', 'CHEM-03-002', 'CHEM-03-003'],
  '化学键|离子键|共价键|金属键': ['CHEM-01-010'],
  '氧化还原|电子转移': ['CHEM-02-004'],
  '原电池|电解|电化学': ['CHEM-02-011'],
  '化学反应速率|平衡|勒夏特列': ['CHEM-02-007', 'CHEM-02-008'],
  'pH|酸碱|中和|滴定': ['CHEM-04-006', 'CHEM-04-007'],
  '物质的量|摩尔|阿伏伽德罗': ['CHEM-06-001', 'CHEM-06-002', 'CHEM-06-003'],
  '有机|烷烃|烯烃|醇|醛|酸|酯': ['CHEM-05-002', 'CHEM-05-003', 'CHEM-05-005', 'CHEM-05-006', 'CHEM-05-007'],
  '同分异构': ['CHEM-05-011'],
  '官能团|取代|加成|消去': ['CHEM-05-012'],
  '溶液|溶解度|浓度': ['CHEM-04-001', 'CHEM-04-002', 'CHEM-04-004'],
  '原子结构|电子|质子|中子': ['CHEM-01-004'],
  '化合价|化学式|分子式': ['CHEM-01-005', 'CHEM-01-006'],

  // 生物
  '细胞|细胞学说|细胞膜|细胞质|细胞核|线粒体|叶绿体|核糖体|高尔基体|内质网|溶酶体': ['BIO-01-001', 'BIO-01-002', 'BIO-01-003', 'BIO-01-004'],
  '有丝分裂|减数分裂|细胞周期|染色体|染色质': ['BIO-01-005', 'BIO-01-006'],
  '孟德尔|分离定律|自由组合|基因型|表型|显性|隐性': ['BIO-02-001'],
  'DNA|双螺旋|脱氧核苷酸|碱基互补配对|半保留复制|基因表达': ['BIO-02-002', 'BIO-02-003'],
  '基因突变|染色体变异|缺失|重复|倒位|易位|诱变': ['BIO-02-004'],
  '自然选择|进化|种群基因频率|隔离|物种': ['BIO-02-005'],
  '遗传病|白化病|色盲|血友病|21三体|唐氏': ['BIO-02-006'],
  '消化|胃|小肠|肝脏|胰腺|胆汁|胃蛋白酶': ['BIO-03-001'],
  '循环|心脏|血管|体循环|肺循环|动脉|静脉': ['BIO-03-002'],
  '呼吸|肺|肺泡|膈肌|气体交换|氧气|二氧化碳': ['BIO-03-003'],
  '神经|反射|反射弧|神经元|突触|条件反射': ['BIO-03-004'],
  '免疫|抗体|抗原|B细胞|T细胞|疫苗|特异性免疫': ['BIO-03-005'],
  '激素|生长激素|甲状腺激素|胰岛素|内分泌|血糖': ['BIO-03-006'],
  '光合作用|叶绿体|光反应|暗反应|CO₂固定': ['BIO-04-001'],
  '呼吸作用|有氧呼吸|无氧呼吸|细胞呼吸|线粒体': ['BIO-04-002'],
  '植物激素|生长素|赤霉素|乙烯|顶端优势': ['BIO-04-003'],
  '蒸腾作用|气孔|保卫细胞|水分运输': ['BIO-04-005'],
  '种群|群落|生态|食物链|食物网|K值|环境容纳量': ['BIO-05-001', 'BIO-05-002', 'BIO-05-003'],
  '能量流动|物质循环|碳循环|传递效率|10%|20%': ['BIO-05-004'],
  '稳定性|抵抗力|恢复力|负反馈|自我调节': ['BIO-05-005'],
  '生物多样性|自然保护区|保护|濒危|就地保护': ['BIO-05-006'],
  '病毒|噬菌体|HIV|流感|细菌|真菌|酵母菌|发酵': ['BIO-06-001', 'BIO-06-002', 'BIO-06-003'],
  '基因工程|质粒|限制酶|DNA连接酶|转基因': ['BIO-06-004'],
  '培养基|灭菌|接种|平板划线|无菌|纯化': ['BIO-06-005'],
  '细胞工程|杂交瘤|单克隆抗体|核移植|克隆|组织培养': ['BIO-06-006'],

  // 英语
  '名词|代词|可数|不可数|人称代词|物主代词|指示代词': ['ENG-01-001', 'ENG-01-002'],
  '形容词|副词|比较级|最高级|多重定语': ['ENG-01-002'],
  '介词|连词|并列连词|从属连词': ['ENG-01-003'],
  '情态动词|can|must|should|may|could|might|need': ['ENG-01-004'],
  '构词法|前缀|后缀|派生|合成|转化': ['ENG-01-005'],
  '一般现在时|一般过去时|一般将来时': ['ENG-02-001'],
  '现在进行时|过去进行时|将来进行时': ['ENG-02-002'],
  '现在完成时|过去完成时|将来完成时|have done|had done': ['ENG-02-003'],
  '被动语态|be done|及物动词|双宾语': ['ENG-02-004'],
  '时态一致|宾语从句|条件从句': ['ENG-02-005'],
  '主谓一致|就近原则|意义一致': ['ENG-03-002'],
  '非谓语动词|不定式|动名词|分词|to do|doing|done': ['ENG-03-003'],
  '虚拟语气|if were|wish|suggest|recommend|should': ['ENG-03-004'],
  '倒装句|完全倒装|部分倒装|强调句|It is...that': ['ENG-03-005'],
  '主语从句|宾语从句|表语从句|同位语从句': ['ENG-04-001'],
  '定语从句|关系代词|关系副词|限制性|非限制性': ['ENG-04-002'],
  '状语从句|时间|条件|原因|让步|结果': ['ENG-04-003'],
  '省略|比较省略|从句省略': ['ENG-04-004'],
  '长难句分析|多层嵌套从句': ['ENG-04-005'],
  '主旨大意|主题句|归纳概括': ['ENG-05-001'],
  '细节理解|定位|同义替换': ['ENG-05-002'],
  '推理判断|作者态度|inferred|attitude': ['ENG-05-003'],
  '写作技巧|三段式|连接词|句式多样化': ['ENG-05-004'],
  '记叙文|议论文|说明文|应用文|书信': ['ENG-05-005'],
  '语法填空|冠词|词形变化': ['ENG-06-001'],
  '短文改错|时态错误|主谓不一致': ['ENG-06-002'],
  '完形填空|上下文语境|逻辑关系': ['ENG-06-003'],
  '固定搭配|短语动词|look after|depend on': ['ENG-06-004'],
  'say vs tell|rise vs raise|accept vs receive': ['ENG-06-005'],

  // 历史
  '夏商周|分封制|宗法制|世袭制|禅让制': ['HIS-01-001'],
  '春秋五霸|战国七雄|百家争鸣|孔子|孟子|老子|韩非子|墨子|商鞅变法': ['HIS-01-002'],
  '秦始皇|郡县制|汉武帝|罢黜百家|推恩令|盐铁专卖': ['HIS-01-003'],
  '三国鼎立|赤壁之战|八王之乱|淝水之战|孝文帝改革|民族融合': ['HIS-01-004'],
  '隋统一|科举制|贞观之治|开元盛世|安史之乱|丝绸之路': ['HIS-01-005'],
  '鸦片战争|南京条约|第二次鸦片战争|洋务运动|中体西用': ['HIS-02-001'],
  '辛亥革命|三民主义|武昌起义|临时约法|袁世凯': ['HIS-02-002'],
  '新文化运动|德先生赛先生|五四运动|马克思主义': ['HIS-02-003'],
  '中共一大|南昌起义|井冈山|长征|遵义会议|抗日战争': ['HIS-02-004'],
  '开国大典|三大改造|改革开放|十一届三中全会|经济特区': ['HIS-02-005'],
  '古埃及|金字塔|象形文字|法老|尼罗河': ['HIS-03-001'],
  '雅典民主|伯里克利|斯巴达|亚历山大|罗马法|十二铜表法': ['HIS-03-002'],
  '种姓制度|佛教|阿育王|玄奘取经|丝绸之路': ['HIS-03-003'],
  '伊斯兰教|阿拉伯帝国|阿拉伯数字|智慧宫': ['HIS-03-004'],
  '封君封臣|庄园经济|基督教会|骑士制度|大宪章': ['HIS-03-005'],
  '文艺复兴|人文主义|但丁|达芬奇|莎士比亚|马丁路德|九十五条论纲': ['HIS-04-001'],
  '新航路开辟|哥伦布|麦哲伦|三角贸易|殖民扩张': ['HIS-04-002'],
  '英国资产阶级革命|权利法案|美国独立战争|人权宣言|启蒙运动|伏尔泰|孟德斯鸠|卢梭': ['HIS-04-003'],
  '工业革命|蒸汽机|瓦特|电力|内燃机|马克思主义|帝国主义': ['HIS-04-004'],
  '一战|二战|凡尔赛华盛顿体系|雅尔塔体系|冷战|杜鲁门主义|北约华约': ['HIS-04-005'],

  // 政治
  '唯物论|辩证法|物质决定意识|规律|对立统一|质量互变|否定之否定': ['POL-01-001'],
  '认识论|实践|感性认识|理性认识|真理|反复性|无限性': ['POL-01-002'],
  '价值|价值观|人生价值|自我价值|社会价值|劳动奉献': ['POL-01-003'],
  '哲学基本问题|唯物主义|唯心主义|可知论|不可知论': ['POL-01-004'],
  '实践与认识|理论结合实践|认识反作用': ['POL-01-005'],
  '商品|货币|使用价值|价值|纸币|一般等价物': ['POL-02-001'],
  '价值规律|社会必要劳动时间|供求|价格波动': ['POL-02-002'],
  '剩余价值|资本主义基本矛盾|经济危机|垄断': ['POL-02-003'],
  '社会主义市场经济|公有制|共同富裕|宏观调控': ['POL-02-004'],
  '收入分配|再分配|社会保障|三次分配': ['POL-02-005'],
  '国家性质|政府职能|人民民主专政|对人民负责': ['POL-03-001'],
  '民主|法治|人民代表大会|选举权|监督权|协商民主': ['POL-03-002'],
  '多党合作|政协|长期共存|参政议政': ['POL-03-003'],
  '民族区域自治|宗教信仰自由|民族平等|民族团结': ['POL-03-004'],
  '国际关系|国家利益|和平与发展|联合国|人类命运共同体': ['POL-03-005'],
  '文化的本质|传统文化|继承|取其精华去其糟粕': ['POL-04-001'],
  '文化交流|传播|大众传媒|文化多样性': ['POL-04-002'],
  '文化创新|社会实践|推陈出新|博采众长': ['POL-04-003'],
  '社会主义核心价值观|富强|民主|文明|和谐|自由|平等|公正|法治|爱国|敬业|诚信|友善': ['POL-04-004'],
  '文化消费|文化产业|文化事业|文化自信': ['POL-04-005'],

  // 地理
  '地球形状|经纬网|本初子午线|东西半球|比例尺|地图三要素': ['GEO-01-001'],
  '地形|地貌|板块构造|内力作用|外力作用|等高线|V型谷|三角洲': ['GEO-01-002'],
  '大气受热|热力环流|气压带风带|季风气候|地中海气候|温带海洋性': ['GEO-01-003'],
  '水循环|洋流|暖流|寒流|海陆间循环': ['GEO-01-004'],
  '自然资源|可再生|不可再生|地震|台风|洪涝|防灾减灾': ['GEO-01-005'],
  '人口增长|城市化|城市空间结构|同心圆|扇形|多核心': ['GEO-02-001'],
  '农业区位|工业区位|季风水田|商品谷物|大牧场放牧业': ['GEO-02-002'],
  '交通运输|铁路|公路|水路|航空|港珠澳大桥|京沪高铁': ['GEO-02-003'],
  '区域发展|产业转移|西部大开发|比较优势': ['GEO-02-004'],
  '可持续发展|3R原则|碳达峰|碳中和|绿水青山': ['GEO-02-005'],
  '亚洲|欧洲|非洲|美洲|中国地理|秦岭淮河': ['GEO-03-001', 'GEO-03-002', 'GEO-03-003', 'GEO-03-004', 'GEO-03-005'],
  'RS遥感|GIS|GPS|全球导航卫星|3S技术': ['GEO-04-003'],
  '环境问题|全球变暖|臭氧层破坏|酸雨|生物多样性': ['GEO-05-001'],
  '生态保护|自然保护区|退耕还林|荒漠化治理': ['GEO-05-002'],
  '资源利用|矿产资源|水资源|新能源|南水北调': ['GEO-05-003'],
  '循环经济|减量化|再利用|资源化|垃圾分类': ['GEO-05-004'],
  '巴黎协定|共同但有区别的责任|碳达峰|碳中和': ['GEO-05-005'],
};

function matchKeywords(text: string): string[] {
  const matched = new Set<string>();
  for (const [pattern, nodeIds] of Object.entries(KEYWORD_MAP)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(text)) {
      nodeIds.forEach(id => matched.add(id));
    }
  }
  return Array.from(matched);
}

// ─── POST /insight/analyze ───

router.post('/analyze', async (req, res, next) => {
  try {
    const { questions, subject } = req.body as {
      questions: { text: string }[];
      subject?: string;
    };

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: '请提供题目列表' });
    }

    const matchedNodes = new Map<string, {
      nodeId: string;
      title: string;
      domain: string;
      count: number;
      questions: number[];
    }>();

    // 每条题目匹配知识点
    const questionResults = questions.map((q, idx) => {
      const nodeIds = matchKeywords(q.text);
      
      // 查找匹配的节点信息
      const matched = nodeIds.slice(0, 5); // 限制最多5个
      
      matched.forEach(nodeId => {
        if (!matchedNodes.has(nodeId)) {
          matchedNodes.set(nodeId, {
            nodeId,
            title: '',
            domain: '',
            count: 0,
            questions: [],
          });
        }
        matchedNodes.get(nodeId)!.count++;
        matchedNodes.get(nodeId)!.questions.push(idx + 1);
      });

      return {
        questionIndex: idx + 1,
        text: q.text.substring(0, 80) + (q.text.length > 80 ? '...' : ''),
        matchedNodes: matched,
      };
    });

    // 填充节点标题和领域
    const nodeIds = Array.from(matchedNodes.keys());
    if (nodeIds.length > 0) {
      const nodes = await prisma.knowledgeNode.findMany({
        where: { id: { in: nodeIds } },
        select: { id: true, title: true, domain: true, subject: true },
      });
      
      // 按领域分组统计
      const domainStats = new Map<string, { domain: string; count: number; nodes: string[]; coverage: number }>();
      const subjectNodes = new Map<string, number>();
      
      for (const node of nodes) {
        const info = matchedNodes.get(node.id);
        if (info) {
          info.title = node.title;
          info.domain = node.domain;
          
          // 领域统计
          if (!domainStats.has(node.domain)) {
            domainStats.set(node.domain, { domain: node.domain, count: 0, nodes: [], coverage: 50 });
          }
          domainStats.get(node.domain)!.count += info.count;
          domainStats.get(node.domain)!.nodes.push(node.title);

          // 学科统计
          subjectNodes.set(node.subject, (subjectNodes.get(node.subject) || 0) + 1);
        }
      }

      // 按覆盖率排序的领域结果
      const domainResults = Array.from(domainStats.values())
        .sort((a, b) => b.count - a.count);

      // 整体覆盖率评估
      const totalDomain = new Set(nodes.map(n => n.domain)).size;
      const totalQuestions = questions.length;
      const matchedQuestions = new Set(questionResults.filter(q => q.matchedNodes.length > 0).map(q => q.questionIndex));

      const coverage = {
        total: totalQuestions,
        matched: matchedQuestions.size,
        matchRate: Math.round((matchedQuestions.size / totalQuestions) * 100),
        domains: {
          total: totalDomain,
          covered: domainResults.length,
        },
      };

      return ok(res, {
        coverage,
        questionResults,
        domainResults,
        nodeResults: Array.from(matchedNodes.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 20),
      });
    }

    return ok(res, {
      coverage: { total: questions.length, matched: 0, matchRate: 0, domains: { total: 0, covered: 0 } },
      questionResults,
      domainResults: [],
      nodeResults: [],
    });
  } catch (e) {
    next(e);
  }
});

// ─── POST /insight/ocr — 图片文字提取 ───

router.post('/ocr', async (req, res, next) => {
  try {
    const { image } = req.body as { image?: string };
    if (!image) {
      return res.status(400).json({ error: '缺少图片数据' });
    }

    // 尝试用 AI 视觉模型提取文字
    try {
      const url = `${getAiConfig().baseUrl}/chat/completions`;
      const body = {
        model: getAiConfig().model,
        messages: [
          { role: 'system', content: '你是一个OCR助手。请从图片中提取出所有文字内容，保持原有的编号和格式。只返回提取的文字，不要任何额外说明。' },
          {
            role: 'user',
            content: [
              { type: 'text', text: '请提取这张图片中的所有文字，包括题号：' },
              { type: 'image_url', image_url: { url: image, detail: 'high' } },
            ],
          },
        ],
        stream: false,
        max_tokens: 4096,
        temperature: 0.1,
      };

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (getAiConfig().apiKey) headers['Authorization'] = `Bearer ${getAiConfig().apiKey}`;

      const resp = await axios.post(url, body, { headers, timeout: 120000 });
      const text = resp.data?.choices?.[0]?.message?.content || '';

      if (text.trim()) {
        return ok(res, { text: text.trim(), source: 'ai-vision' });
      }
    } catch (e) {
      console.warn('[insight] AI OCR 失败:', (e as Error).message);
    }

    // 降级返回
    return ok(res, { text: '', source: 'none' });
  } catch (e) {
    next(e);
  }
});

// ─── POST /insight/generate ───

router.post('/generate', async (req, res, next) => {
  try {
    const { nodeIds, subject, count = 10 } = req.body as {
      nodeIds?: string[];
      subject?: string;
      count?: number;
    };

    const paper = await examService.autoGenerate({
      domain: subject ? undefined : undefined,
      count,
      mode: 'auto',
    });

    ok(res, paper);
  } catch (e) {
    next(e);
  }
});

export default router;
