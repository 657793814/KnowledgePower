/**
 * 📊 英语阅读策略 — 阅读技巧、推理判断与题型策略
 * 人教版教材同步 + 拓展 + 考点
 */
import { sn, sr, richContent } from '../helpers.js';

export async function seedEnglishReadingDomain() {
  console.log('  → 阅读策略');

  // ===================================================================
  // ENG-05-001 略读与扫读
  // ===================================================================
  await sn('ENG-05-001', '略读与扫读', '快速定位主旨和关键信息的阅读策略', 'eng', '阅读策略', '高中', 3, 100, null,
    '掌握略读（Skimming）和扫读（Scanning）两种高效阅读策略',
    richContent(
      '略读（Skimming）和扫读（Scanning）是两种最实用的快速阅读策略，也是应对英语考试时间压力的重要技能。略读用于快速把握文章的主旨大意，扫读用于精确定位特定信息。两者配合使用，可以在有限时间内获取最有效的信息。',
      [
        '略读（Skimming）：快速浏览全文，重点读首段、尾段、每段首句和末句',
        '略读时关注标题、副标题、图片说明等非文本信息',
        '略读时注意转折词（but, however, yet）后面的内容，往往有重要信息',
        '扫读（Scanning）：带着明确的关键词在文中定位具体信息',
        '扫读时眼睛呈Z字形扫描，不要逐词阅读',
        '扫读目标：人名、地名、数字、日期、大写字母开头词',
        '先读题后读文（Skim first, then Scan for each question）',
        '考试策略：先用SKIM2分钟把握主旨，再逐题SCAN定位',
        '注意：略读后应在脑中形成文章框架图（总分总/问题解决/因果等）',
      ],
      ['Skim the first and last paragraphs for the main idea.', 'Scan for "price" to find the cost information.', 'Use keywords from the questions to locate answers.'],
      [
        { title: '例1', question: '一篇关于"AI在医疗中的应用"的文章，如何用SKIM快速获取主旨？',
          steps: ['读标题（AI Applications in Healthcare）→主题', '读首段末句→可能点明文章目的', '读每个段落的主题句（通常首句）→了解各段内容', '读尾段→总结或展望'],
          answer: '1) 标题确定主题 2) 首段了解背景 3) 各段首句勾勒结构 4) 尾段了解结论' },
        { title: '例2', question: '题目问"When was the company founded?" 你应该用什么策略？',
          steps: ['题目问"成立时间"→关键词founded/year/date', 'Scan时眼睛快速扫过数字（特别是年份）', '找到含数字的句子后仔细阅读确认'],
          answer: '扫读策略——在文中定位含年份/日期信息的句子' },
      ],
      '高考英语阅读要求35分钟内完成4篇文章约2000词的阅读和15道题，平均每篇不到9分钟。不掌握阅读策略很难完成。',
      ['1. 考试中先花1-2分钟SKIM全文', '2. 每道题先划关键词再SCAN定位', '3. 遇到生词不纠结，继续扫读关键信息'],
      [
        { mistake: '逐词阅读全文，速度极慢', correct: '不要求理解每个词，SKIM只求70-80%的理解度即可开始做题' },
        { mistake: '扫读时忘记关键词导致反复阅读', correct: '先确认题目问什么，选择2-3个独特关键词（如大写/数字/生僻词）再扫读' },
      ],
      '略读和扫读不是"偷懒"，而是选择性注意——就像你在超市找东西时不会每样货架都仔细看一遍一样。'
    )
  );

  // ===================================================================
  // ENG-05-002 词义猜测技巧
  // ===================================================================
  await sn('ENG-05-002', '词义猜测技巧', '利用上下文线索推测生词含义', 'eng', '阅读策略', '高中', 4, 110, null,
    '掌握利用上下文线索推测陌生词汇含义的五种核心技巧',
    richContent(
      '阅读中遇到生词是常态。掌握词义猜测技巧不仅能够减少查词典的频率、提高阅读效率，也是阅读理解考查的重要能力之一。高考阅读中专门设有猜测词义的题目。根据上下文逻辑关系和构词法线索，大多数生词含义都可以准确推测。',
      [
        '线索一：定义法——通过is/are/means/refers to或同位语获得单词含义（A predator is an animal that hunts others.）',
        '线索二：对比法——通过转折词but/although/however/while获取反义词线索（Unlike his frugal brother, John was very extravagant.→挥霍的）',
        '线索三：举例法——通过such as/for example/like/including从例子推测类别含义',
        '线索四：因果法——通过because/so/therefore/thus从因果关系中推断含义',
        '线索五：构词法——利用词根、前缀、后缀推测含义（unprecedented=un(不)+precede(前)+ed(的)→前所未有的）',
        '线索六：下义词线索——上下文重复出现的同义替换或近义表达',
        '线索七：标点符号——逗号破折号括号内的内容是解释说明',
        '综合判断：将猜测的单词含义代入原句，检查语义是否通顺合理',
      ],
      ['He is a philanthropist, a person who gives money to help others. (定义法)', 'Unlike her talkative brother, she was taciturn. (对比法→沉默寡言的)'],
      [
        { title: '例1', question: '根据上下文推测划线词的含义：The old house was dilapidated, with broken windows and crumbling walls.',
          steps: ['逗号后"窗户破了，墙壁倒塌"是描述', '这些描述是dilapidated的具体表现', '综合判断 → 破败的/年久失修的'],
          answer: 'dilapidated = 破败的/年久失修的' },
        { title: '例2', question: '用构词法推测：What does "misunderstanding" mean?',
          steps: ['前缀mis-表示"错误"', 'understand = 理解', '后缀-ing 名词形式', 'mis + understand + ing = 误解'],
          answer: 'misunderstanding = 误解（前缀mis-表示"错误地"）' },
      ],
      '高考阅读理解中每年至少有一道"猜测词义"题。掌握技巧比词典更重要——考场上没有词典可用。',
      ['1. 优先看生词所在的整句话（而不是只盯着这个词）', '2. 寻找is/are/means/because/but/such as等线索词', '3. 猜测后代入原文验证是否通顺'],
      [
        { mistake: '看到生词就害怕，停下来查词典', correct: '继续往下读，往往下文有解释说明。整段读完再判断是否需要查词典' },
        { mistake: '只凭词根就断定含义', correct: '词根词缀提供线索但可能有例外，一定要放入上下文验证' },
      ],
      '成熟的读者不是词汇量大到没有生词，而是掌握了应对生词的策略。就像你读中文时遇到生僻字也不会卡住一样。'
    )
  );

  // ===================================================================
  // ENG-05-003 主旨大意推断
  // ===================================================================
  await sn('ENG-05-003', '主旨大意推断', '把握文章中心思想和段落主题的技巧', 'eng', '阅读策略', '高中', 4, 120, null,
    '掌握归纳文章主旨大意和挑选最佳标题的方法',
    richContent(
      '主旨大意题（Main Idea）是阅读理解的必考题型。要求考生把握文章或段落的中心思想。主旨题不同于细节题——理解全文大意后才能做对，不能仅凭一个句子或一个段落的信息判断。高考中主旨题通常占阅读题量的20-25%。',
      [
        '常见题型：What is the main idea? / What is the best title? / The passage mainly talks about...',
        '解题步骤：通读全文 → 把握结构 → 识别主题句 → 概括中心思想',
        '主题句位置：段首（最多见）、段尾（归纳总结）、段中（先铺垫后揭示）、隐含（需要自己概括）',
        '文章的常见结构：总分总、问题-解决、原因-结果、对比-分析、时间顺序',
        '如何找到主题句：反复出现的词（高频词）往往与主旨相关',
        '标题选择技巧：标题必须覆盖全文内容，不能太宽泛也不能太窄',
        '区分主旨和细节：如果选项是文章中的具体事实，通常是细节而非主旨',
        '排除法：排除太宽泛的选项，排除太具体的选项，排除原文未提及的选项',
        '注意"but/however/yet"之后的观点——往往是作者真正的态度或主旨',
      ],
      ['"This passage mainly discusses..." → 主旨常见设问方式', '"The best title for this passage may be..." → 标题类设问'],
      [
        { title: '例1', question: '文章首段讲"全球变暖的危害"，第二三段讲"各国采取的措施"，第四段讲"个人如何做"。问文章主旨是什么？',
          steps: ['首段讲危害：引出问题', '二三段讲国家措施：应对措施之一', '四段讲个人行动：应对措施之二', '文章结构为"问题+解决措施"，主旨应涵盖两方面'],
          answer: '全球变暖的危害及应对措施（涵盖问题的提出和解决方案）' },
        { title: '例2', question: '文章高频词为"smart cities""technology""efficiency""sustainability"，问最合适的标题是？',
          steps: ['高频率词汇与核心主题相关', 'smart cities 出现最多 → 主题是smart city', 'technology/efficiency/sustainability 描述的是特点', '最佳标题应包含smart city和其技术特征'],
          answer: 'Technology-Driven Smart Cities: Building a Sustainable Future' },
      ],
      '主旨大意题是阅读理解中最容易被低估难度的题型。高分学生与普通学生的关键区别之一就是对主旨的把握能力。',
      ['1. 读完第一段后先预测全文主旨', '2. 读完每段后在一句话内概括段意', '3. 读完全文后将各段大意串联形成宏观理解'],
      [
        { mistake: '把段落主题句当全文主旨', correct: '段落主题只覆盖一个方面，全文主旨必须涵盖所有段落' },
        { mistake: '选择某个段落的细节作为主旨', correct: '正确的主旨应该是对全文的抽象概括，而非某个具体事实' },
      ],
      '主旨是大树的"主干"，细节是"枝叶"。能准确区分主干和枝叶，是成熟阅读者的标志。'
    )
  );

  // ===================================================================
  // ENG-05-004 细节理解与推理
  // ===================================================================
  await sn('ENG-05-004', '细节理解与推理', '细节题和推理判断题的解题方法', 'eng', '阅读策略', '高中', 4, 130, null,
    '掌握事实细节题和推理判断题的解题策略',
    richContent(
      '细节理解题（Detail Questions）和推理判断题（Inference Questions）是高考试卷中占比最高的两类题型（合计约60-70%）。细节题考查对文中具体信息的捕捉能力，需要精确"定位+匹配"；推理题考查基于文中信息进行逻辑推断的能力，"答案未明说但可以推出"。',
      [
        '细节题分类：①事实细节题（直接问who/what/when/where）②是非判断题（Which is TRUE/NOT TRUE?）③数字计算题（需要简单计算）',
        '细节题解题步骤：①读题划关键词 ②扫读定位原文 ③比对选项与原文 ④排除干扰项',
        '细节题干扰项特征：张冠李戴、无中生有、扩大范围、偷换概念、正反颠倒',
        '推理题分类：①隐含含义推理 ②作者态度推理 ③文章出处推理 ④后续内容推理',
        '推理题关键词：infer(推断), imply(暗示), suggest(暗示), conclude(得出结论), indicate(表明)',
        '推理题解题原则：基于原文推理，不过度推理，不脱离原文自由想象',
        '作者态度判断：积极正向词（positive/optimistic/approving）、消极负向词（negative/critical）、中立客观词（objective/neutral）',
        '词义来源题：直接从文章的字里行间或上下文引出，属于细节理解或简单推理',
        '细节和推理的区别：细节题的答案原文有明确对应；推理题的答案需要基于原文信息进行合理推断',
      ],
      ['Detail: "The park was built in 1998." → When was the park built? → 1998 (直接找到)', 'Inference: "He looked at the floor, avoiding eye contact." → How did he feel? → Nervous/embarrassed (需要推断)'],
      [
        { title: '例1', question: '原文："After three months of training, Tom could run 10km without stopping." 问以下哪个是正确的？A. Tom has been training for a year. B. Tom can now run 10km. C. Tom never stops during training.',
          steps: ['A选项: three months vs a year → 偷换时间概念，排除', 'B选项: could run 10km与原文一致 → 正确', 'C选项: never stops 绝对化，原文是说跑10km不停，但训练中可能停 → 排除'],
          answer: 'B (细节理解+排除干扰项)' },
        { title: '例2', question: '原文："The scientist sighed deeply before announcing the results." 问作者暗示了什么？',
          steps: ['sighed(叹气)表示失望/沮丧', 'before announcing the results(在宣布结果前叹气)', '暗示：研究结果可能不理想/不符合预期', '这是基于动词语气的推理（sighed不是直接说结果不好）'],
          answer: '研究结果可能令人失望或不如预期' },
      ],
      '细节题约占总分的40%，推理题约20%。做好细节题靠细心，做好推理题靠逻辑。两者是阅读理解得高分的两大支柱。',
      ['1. 细节题：精确比对各选型与原文（注意范围副词如all/every/some/most）', '2. 推理题：答案一定源于原文，但需要一步合理推断', '3. 排除绝对化选项（always/never/all）——通常过于绝对的是干扰项'],
      [
        { mistake: '推理题过度推理', correct: '根据原文信息+常识做合理推断，不要自己脑补。"他脸红了"可以推断"他害羞"，不能推断"他做错了事"' },
        { mistake: '细节题被同义替换迷惑', correct: '做细节题时注意同义替换（change→modify→shift），选项通常用不同词表达相同含义' },
      ],
      '阅读理解的本质是"作者和读者之间的默契"——作者写出的每个词都有用意，读者的任务就是理解和推断这些用意。'
    )
  );

  // ===================================================================
  // ENG-05-005 七选五与完形填空策略
  // ===================================================================
  await sn('ENG-05-005', '七选五与完形填空策略', '补齐阅读理解的两类特殊题型解题方法', 'eng', '阅读策略', '高中', 5, 140, null,
    '掌握七选五（新题型）和完形填空的解题策略和技巧',
    richContent(
      '七选五（Seven-out-of-Five）和完形填空（Cloze Test）是两类在阅读理解基础上进一步考查语言综合运用能力的题型。七选五侧重篇章衔接与逻辑连贯，完形填空侧重词汇辨析和上下文语义连贯。两类题是高考英语的中等偏难题型。',
      [
        '七选五解题步骤：①通读全文把握大意→②读选项划关键词→③逐空分析逻辑→④回填检查',
        '七选五的线索：代词线索(It/They/This/These前文必有对应)、逻辑连接词(however/therefore/first)、上下文复现',
        '七选五常见错误选项特征：和文章内容相关但不匹配逻辑位置、看似正确但缺少承上启下的连接',
        '完形填空解题步骤：①跳过空格通读全文→②逐空选择（优先语义→其次搭配→最后语法）→③回读检查',
        '完形填空考查重点：动词短语及搭配（30%）、上下文语义推理（40%）、近义词辨析（15%）、语法（15%）',
        '完形填空的上下文线索：前文暗示（上文已出现）、后文提示（下文解释说明）、转折提示（but/however表反义）',
        '完形填空的三遍法：第一遍读大意（不看选项），第二遍结合选项填空，第三遍回读检查',
        '七选五解题技巧：优先选择有明显代词或逻辑连接词的选项，填完后通读看是否语意通顺',
        '常见的篇章逻辑关系：递进（What\'s more）、转折（However）、因果（Therefore）、举例（For example）、总结（In conclusion）',
      ],
      ['七选五：一段给出 ---G--- 信息，然后说明原因。需要选出承上启下的句子。', '完形填空：The teacher walked into the classroom and ___ her book on the desk. A. lied B. laid C. lay D. lain → laid(放置)'],
      [
        { title: '例1', question: '完形填空：I was very ___ when I heard the news. A. surprising B. surprised C. surprise D. surprises',
          steps: ['主语I（人）→ 用-ed形容词表示"感到…的"', 'surprising是"令人惊讶的"修饰物', 'surprised是"感到惊讶的"修饰人', 'be surprised to hear...是固定搭配'],
          answer: 'B. surprised——人感到惊讶用-ed形式' },
        { title: '例2', question: '七选五策略：一段末尾说"However, not everyone agrees with this view." 下一段开头最可能的内容是什么？',
          steps: ['However表示转折', '前文讲的是某个被多数人接受的观点', '转折后→列出不同意见或反对的理由', '下一段应介绍持不同意见者的论据'],
          answer: '接下来应介绍与主流观点不同的意见或批评性论述' },
      ],
      '七选五和完形填空合计占高考英语30分（满分150），是所有阅读类题型中单题分值最高的。',
      ['1. 完形填空第一遍不填空只读大意，培养整体语感', '2. 七选五先确定空格前后逻辑关系', '3. 两个题型都重视"回读检查"环节'],
      [
        { mistake: '完形填空只看空格不看上下文', correct: '一道题的答案往往在上文或下文句子中，至少看前后各一句' },
        { mistake: '七选五选了和逻辑矛盾但看起来"像样"的选项', correct: '不仅要语义通顺，还要检查逻辑连接（代词所指、逻辑关系词）是否匹配' },
      ],
      '七选五和完形填空是"有空隙的阅读理解"——你需要根据对整体的理解来填补局部。这就像拼图，一边看大局一边找合适的碎片。'
    )
  );

  // ===================================================================
  // 建立知识点之间的关系
  // ===================================================================
  console.log('  → 建立关系...');
  await sr('ENG-05-001', 'ENG-05-002', 'prerequisite', 100);
  await sr('ENG-05-001', 'ENG-05-003', 'prerequisite', 100);
  await sr('ENG-05-001', 'ENG-05-004', 'prerequisite', 100);
  await sr('ENG-05-002', 'ENG-05-003', 'supports', 100);
  await sr('ENG-05-003', 'ENG-05-004', 'supports', 100);
  await sr('ENG-05-001', 'ENG-05-005', 'prerequisite', 100);
  await sr('ENG-05-003', 'ENG-05-005', 'supports', 100);
  await sr('ENG-05-004', 'ENG-05-005', 'supports', 100);

  console.log('  ✓ 阅读策略种子完成');
}
