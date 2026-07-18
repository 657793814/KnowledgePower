/**
 * 📊 英语词汇与构词 — 词根词缀、合成派生、搭配辨析
 * 人教版教材同步 + 拓展 + 考点
 */
import { sn, sr, richContent } from '../helpers.js';

export async function seedEnglishVocabularyDomain() {
  console.log('  → 词汇与构词');

  // ===================================================================
  // ENG-02-001 词根词缀
  // ===================================================================
  await sn('ENG-02-001', '词根词缀', '词根决定核心意义，前缀后缀改变词性或意义', 'eng', '词汇与构词', '初中', 3, 100, null,
    '掌握英语词根和常见词缀的构词规律，实现词汇量的指数级增长',
    richContent(
      '英语中约60%的词汇源于拉丁语和希腊语，由词根（Root）、前缀（Prefix）和后缀（Suffix）构成。词根是单词的核心部分，决定基本含义；前缀改变单词的方向或程度；后缀通常改变词性。掌握常见词根词缀相当于拥有了破解生词的钥匙。',
      [
        '前缀改变词义：un-（不）, re-（再/重新）, pre-（前）, dis-（否定）, mis-（错误）',
        '否定前缀家族：in-（→ il-/im-/ir- 根据首字母变化）, un-, dis-, non-, a(n)-',
        '后缀决定词性：-tion/-sion（名词）, -ful/ -less（形容词）, -ly（副词）, -ize/-ify（动词）',
        '常见词根：-spect-（看→inspect/respect/prospect）, -dict-（说→predict/dictate/contradict）',
        '词根 -port-（携带→export/import/transport/report）, -duct-（引导→conduct/introduce/produce）',
        '词根 -scribe/-script-（写→describe/prescribe/transcript）, -struct-（建造→construct/destruct/instruct）',
        '词根 -ject-（投掷→project/reject/inject/subject）, -tract-（拉→attract/extract/contract/distract）',
        '同一词根+不同词缀衍生不同词性和含义：act → action/active/react/reactor/interact',
      ],
      ['predict = pre(前) + dict(说) = 预言', 'unexpected = un(不) + expect(期待) + ed(形容词后缀) = 意外的'],
      [
        { title: '例1', question: '已知词根 -aud- 表示"听"，猜测 audience / audible / audit 的含义',
          steps: ['audience：audi(听) + ence(名词后缀) → 听众', 'audible：audi(听) + ible(能…的) → 听得见的', 'audit：audi(听) → 审计/旁听（听报告）'],
          answer: 'audience=听众, audible=听得见的, audit=审计/旁听' },
        { title: '例2', question: '用前缀 re-（再/重新） 和 de-（向下/去除） 改写以下词：build, construct, code, activate',
          steps: ['re + build = rebuild（重建）', 'de + construct = deconstruct（解构）', 're + code = recode（重新编码）', 'de + activate = deactivate（停用/关闭）'],
          answer: 'rebuild, deconstruct, recode, deactivate' },
      ],
      '高考考纲词汇约3500词，通过词根词缀可以理解记忆其中70%以上。构词法也是语法填空的考查重点。',
      ['1. 每次学新词时主动拆解前缀/词根/后缀', '2. 制作词根卡片，用已知词根记忆相关词汇', '3. 注意同义前缀的替换（如否定前缀 in-/un-/dis-）'],
      [
        { mistake: '认为所有单词都有词根词缀', correct: '基础词汇如 go/come/big/hot 等日耳曼词源大多无词缀结构，需单独记忆' },
        { mistake: '混淆相似前缀', correct: 'ante-(前) vs anti-(反对): antecedent(先例) vs antibiotic(抗生素)' },
      ],
      '词根词缀是英语词汇的"偏旁部首"。一个词根平均能帮你记忆5-10个相关词汇。从 -spect-（看）可以记住 respect（尊重=反复看）、inspect（检查=往里看）、prospect（前景=向前看）、retrospect（回顾=向后看）等。'
    )
  );

  // ===================================================================
  // ENG-02-002 合成法与派生法
  // ===================================================================
  await sn('ENG-02-002', '合成法与派生法', '复合单词与词性转换的规律', 'eng', '词汇与构词', '初中', 3, 110, null,
    '掌握英语合成词和派生词的构成规则，提升词汇量和语感',
    richContent(
      '合成法（Compounding）是将两个或多个独立词组合成一个新词，如 blackboard = black + board；派生法（Derivation）是通过添加词缀构成新词，如 happiness = happy + ness。两种方法是英语扩充词汇最重要的手段。',
      [
        '合成名词：名词+名词（bookstore）、形容词+名词（greenhouse）、动词+名词（breakfast）',
        '合成形容词：数词+名词单数（five-year）、名词+ed（heartbroken）、形容词+名词（high-class）',
        '合成动词：名词+动词（sunbathe）、副词+动词（overcome）、形容词+动词（whitewash）',
        '派生名词规律：动词+tion/sion（education）、动词+ment（development）、形容词+ness（kindness）',
        '派生形容词规律：名词+y（cloudy）、名词+ful（careful）、名词+less（homeless）、动词+ing/ed（interesting/interested）',
        '派生副词规律：形容词+ly（quickly, fortunately, recently）、形容词+wards（backwards, forwards）',
        '派生动词规律：名词+ize（modernize）、形容词+en（widen）、名词+ify（beautify）',
        '注意拼写变化：happy→happiness（y→i）, true→truth（去掉e）, admire→admirable（去掉e）',
      ],
      ['textbook = text(课本) + book(书) = 教科书', 'unforgettable = un(不) + forget(忘记) + able(能) = 难忘的'],
      [
        { title: '例1', question: '将下列单词转化为名词：develop, achieve, argue, improve',
          steps: ['develop + ment = development（发展）', 'achieve + ment = achievement（成就）', 'argue去掉e + ment = argument（争论）', 'improve + ment = improvement（改善）'],
          answer: 'development, achievement, argument, improvement' },
        { title: '例2', question: '用合成法写出下列含义：1) 一个十岁的女孩 2) 闻名世界的 3) 含糖的饮料',
          steps: ['十岁的女孩 = ten-year-old girl（注意year用单数，加连字符）', '闻名世界 = world-famous（名词+形容词合成）', '含糖的饮料 = sugary drink（sugar + y变成形容词）'],
          answer: 'ten-year-old girl, world-famous, sugary drink' },
      ],
      '合成词和派生词在阅读中频繁出现。考试中的语法填空和短文改错专门考查派生词和词性转换。',
      ['1. 注意固定搭配中的派生形式：make a decision (decide→decision)', '2. 合成词定语中名词用单数：a five-year plan 而非 a five-years plan', '3. 区分 -ful（充满）和 -less（没有）：hopeful / hopeless'],
      [
        { mistake: '合成词中名词定语误加复数', correct: 'a ten-year-old boy（year不加s）/ a five-minute walk（minute不加s）' },
        { mistake: '拼写变化错误', correct: 'true → truly（去e+ly）, 不是 truely' },
      ],
      '英语合成词和汉语"偏正式"结构非常相似。比如"黑板"=黑+板，英语blackboard=black+board。这种跨语言的相似性可以帮助理解和记忆。'
    )
  );

  // ===================================================================
  // ENG-02-003 核心动词搭配
  // ===================================================================
  await sn('ENG-02-003', '核心动词搭配', 'take/make/do/have/get/go 五大高频动词的常用搭配', 'eng', '词汇与构词', '高中', 4, 120, null,
    '精通常见高频动词的固定搭配和短语用法，提高语言准确度',
    richContent(
      '英语中有一些动词出现频率极高，搭配能力极强，是考试考查的绝对重点。take、make、do、have、get、go 这六个动词与不同介词/副词/名词搭配产生截然不同的含义。掌握这些搭配是突破英语词汇瓶颈的关键。',
      [
        'take系列：take care(照顾), take place(发生), take part in(参加), take advantage of(利用), take turns(轮流), take off(起飞/脱下), take over(接管)',
        'make系列：make a difference(有影响), make progress(取得进步), make a decision(做决定), make sense(有意义), make up(编造/弥补/化妆), make use of(利用)',
        'do系列：do a favor(帮忙), do harm to(对…有害), do one\'s best(尽力), do research(做研究), do with(处理/应付)',
        'have系列：have a rest(休息), have a try(尝试), have a word with(和…谈话), have access to(有机会使用), have trouble doing(做某事困难)',
        'get系列：get along with(与…相处), get rid of(摆脱), get through(完成/接通电话), get used to(习惯), get across(传达), get over(克服)',
        'go系列：go on(继续), go through(经历/仔细检查), go over(复习), go in for(参加/喜欢), go without(没有…也行), go by(流逝/遵循)',
        '词义丰富的under: go under(沉没/破产), under construction(建设中), under discussion(讨论中)',
        'out系列：work out(解决/锻炼), figure out(弄清楚), carry out(执行), point out(指出), turn out(结果是)',
      ],
      ['take care of the baby = 照顾婴儿', 'make a difference to society = 对社会有影响', 'get along well with classmates = 和同学相处融洽'],
      [
        { title: '例1', question: '选择正确的搭配填空：It took me a month to ___ (get over / get through / get along) the bad cold.',
          steps: ['get through 偏重"完成/通过"', 'get along 是"相处/进展"', 'get over 表示"从疾病/困难中恢复"', '感冒恢复应该用 get over'],
          answer: 'get over' },
        { title: '例2', question: '用 take / make / have 填空并说明理由：1) ___ a look  2) ___ a promise  3) ___ a bath',
          steps: ['take a look = 看一眼（固定搭配）', 'make a promise = 承诺（make+抽象名词）', 'have a bath = 洗澡（have+动作名词）'],
          answer: 'take a look, make a promise, have a bath' },
      ],
      '动词短语是高考完形填空和单项选择的必考点。掌握核心动词搭配可以提升15-20%的阅读速度和准确度。',
      ['1. 以核心动词为线索，系统学习搭配', '2. 注意一词多义：make up可表示"编造/化妆/弥补/组成"', '3. 通过上下文语境判断具体含义'],
      [
        { mistake: '混淆 take place 和 take the place of', correct: 'take place = 发生；take the place of = 代替（相当于replace）' },
        { mistake: 'make up one\'s mind vs make a decision', correct: 'make up one\'s mind强调下定决心的过程；make a decision强调作出的决定' },
      ],
      '高频动词搭配就像中文的"打"字——打牌、打水、打招呼、打酱油……看似用法繁多，但每个搭配都有规律可循。'
    )
  );

  // ===================================================================
  // ENG-02-004 易混近义词辨析
  // ===================================================================
  await sn('ENG-02-004', '易混近义词辨析', '形近词与义近词的精准区分', 'eng', '词汇与构词', '高中', 4, 130, null,
    '精准区分英语中常见的易混近义词和形近词，避免失分',
    richContent(
      '英语中有大量词义相近或拼写相似的词汇，是各类考试的失分重灾区。如affect/effect、sensible/sensitive、principle/principal等。准确辨析这些词汇需要理解词源、搭配和语境差异。',
      [
        'affect vs effect：affect是动词"影响"；effect是名词"效果，影响"，做动词时意为"使发生"',
        'sensible vs sensitive：sensible是"明智的，合理的"；sensitive是"敏感的，灵敏的"',
        'principle vs principal：principle是"原则，原理"；principal是"校长，主要的"',
        'beside vs besides：beside是"在…旁边"；besides是"除…之外（还）"',
        'rise vs raise vs arise：rise是不及物动词"上升/起身"；raise是及物动词"举起/提高"；arise是不及物动词"出现/产生"',
        'lie vs lay：lie可表示"躺"（过去式lay）或"说谎"（过去式lied）；lay是"放置/下蛋"（过去式laid）',
        'worth vs worthy vs worthwhile：worth接价值或动名词（be worth doing）；worthy接of或to do；worthwhile可作定语',
        'sometime vs sometimes vs some time vs some times：sometime某时；sometimes有时；some time一段时间；some times几次',
        'used to do vs be used to doing vs be used to do：used to do过去常常；be used to doing习惯做；be used to do被用来做',
        'too much vs much too：too much修饰不可数名词"太多"；much too修饰形容词/副词"太"',
      ],
      ['The new policy affects the economy.（动词） / The effect is significant.（名词）', 'She is sensible enough to make a wise decision. / She is sensitive to criticism.'],
      [
        { title: '例1', question: '选择affect/effect填空并说明理由：The medicine had an immediate ___ on my headache.',
          steps: ['had an (形容词) ___ 这个位置需要名词', 'affect是动词，effect是名词', '固定搭配：have an effect on...'],
          answer: 'effect (名词) — 药物对我的头痛有立竿见影的效果' },
        { title: '例2', question: '用rise/raise/arise填空：The sun ___ in the east. The government plans to ___ taxes.',
          steps: ['太阳"自动升起"→使用不及物动词rise', '政府"提高"税收→需要及物动词raise（后接宾语taxes）', 'rise的过去式rose，raise的过去式raised'],
          answer: 'The sun rises / rose in the east. The government plans to raise taxes.' },
      ],
      '近义词辨析是高考语法填空、短文改错和完形填空的高频考点。尤其完形填空中常出现形近词的混淆选项。',
      ['1. 优先区分词性（及物vs不及物，名词vs动词）', '2. 记忆固定搭配和固定句型', '3. 通过词源理解差异（如affect→affectus情感上的影响）'],
      [
        { mistake: '用principle表示校长', correct: '校长是principal，principle是原则。"The principal of our school lives by strict principles."' },
        { mistake: '混淆lie的两种过去式', correct: '躺：lie→lay→lain；说谎：lie→lied→lied。注意原形相同但变化不同' },
      ],
      '近义词辨析往往是英语水平的"分水岭"。掌握这些细微差别，不仅考试提分，而且你的语言表达也会从"正确"升华为"地道"。'
    )
  );

  // ===================================================================
  // ENG-02-005 短语动词
  // ===================================================================
  await sn('ENG-02-005', '短语动词', '动词+介词/副词构成的短语动词及其用法', 'eng', '词汇与构词', '高中', 4, 140, null,
    '掌握英语短语动词的构成规律和用法，提升表达的丰富性和准确性',
    richContent(
      '短语动词（Phrasal Verbs）是由动词 + 介词或副词构成的固定搭配，其整体含义往往不同于各个部分字面含义之和。如 give up 表示"放弃"，不是"给+上"。英语中有超过5000个常用短语动词，掌握它们是进阶英语的关键。',
      [
        '短语动词的三种类型：不及物型（get up起床）、及物可分隔型（take off the jacket / take the jacket off）、及物不可分隔型（look after the baby）',
        '常见介词/副词的语义：up(向上/完成→give up/clean up), down(向下/减少→calm down/break down), out(外出/消失→find out/run out), off(离开/关闭→set off/turn off)',
        '多义短语动词：take off可以有"脱下/起飞/休假/流行"等多种含义',
        '核心短语动词系列：break(break down/out/up/into), come(come up/out/across/over), turn(turn on/off/up/down/out/in)',
        'put系列：put on(穿上/上演), put off(推迟), put out(扑灭), put up(张贴/搭建), put up with(忍受), put forward(提出)',
        'look系列：look after(照顾), look into(调查), look down upon(看不起), look forward to(期待), look through(浏览/审核)',
        '注意代词位置：及物可分隔型短语动词中，代词必须放在中间：pick it up（√）, pick up it（×）',
        '双介词短语动词：put up with(忍受), look forward to(期待), catch up with(赶上), get along with(与…相处)',
      ],
      ['Give up smoking = 戒烟', 'She came across an old friend = 偶然遇到', 'The car broke down on the highway = 抛锚', 'They put off the meeting = 推迟'],
      [
        { title: '例1', question: '用适当的介词/副词填空并写出含义：1) bring ___ (养育/提出)  2) carry ___ (执行)  3) turn ___ (结果是)',
          steps: ['bring up = 养育/提出（up表示向上/出现）', 'carry out = 执行/完成（out表示彻底/完成）', 'turn out = 结果是/生产（out表示出现/显露）'],
          answer: 'bring up, carry out, turn out' },
        { title: '例2', question: '改正句子中的错误：I picked up it from the floor. / She looked the information up.',
          steps: ['第一句：it是代词，必须放在动词和副词之间 → picked it up', '第二句：the information是名词，可以放在中间或后面→look up the information / look the information up皆可（本句已正确）'],
          answer: '第一句改为 I picked it up from the floor. 第二句正确。' },
      ],
      '短语动词在完形填空中几乎必考（2-3题），阅读中也频繁出现。学会根据上下文推断短语含义是重要能力。',
      ['1. 按核心动词分组学习（put/get/take/look各一组）', '2. 注意介词/副词对核心含义的修饰作用', '3. 代词一定要放在动词和副词之间'],
      [
        { mistake: '及物型短语动词忘记带宾语', correct: '不能说"I looked at."，需要说"I looked at the picture."' },
        { mistake: '不可分隔型短语动词强行分隔', correct: 'look after(照顾)不可分隔：look after him（√），look him after（×）' },
      ],
      '短语动词是英语口语和写作中极高频的表达方式。一篇英语文章中平均每100词就会出现1-2个短语动词。用短语动词替代单个动词能让表达更自然地道。'
    )
  );

  // ===================================================================
  // 建立知识点之间的关系
  // ===================================================================
  console.log('  → 建立关系...');
  await sr('ENG-02-001', 'ENG-02-002', 'prerequisite', 100);
  await sr('ENG-02-001', 'ENG-02-004', 'supports', 100);
  await sr('ENG-02-002', 'ENG-02-003', 'prerequisite', 100);
  await sr('ENG-02-002', 'ENG-02-005', 'supports', 100);
  await sr('ENG-02-003', 'ENG-02-005', 'supports', 100);
  await sr('ENG-02-004', 'ENG-02-005', 'supports', 100);

  console.log('  ✓ 词汇与构词种子完成');
}
