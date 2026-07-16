/**
 * 📊 英语语法基础 — 词汇、句法与时态
 * 人教版教材同步 + 拓展 + 考点
 */
import { sn, sr, richContent } from '../helpers.js';

export async function seedEnglishGrammarDomain() {
  console.log('  → 英语语法基础');

  // ===================================================================
  // ENG-01-001 词法基础 — 名词、动词、形容词、副词
  // ===================================================================
  await sn('ENG-01-001', '词法基础', '四大词类：名词、动词、形容词、副词', 'eng', '语法基础', '初中', 3, 100, null,
    '掌握英语四大基本词类的功能与用法',
    richContent(
      '英语有八大词类，其中四种是最基础的：名词（Noun）、动词（Verb）、形容词（Adjective）、副词（Adverb）。名词表示人、事物、地点或抽象概念；动词表示动作或状态；形容词修饰名词；副词修饰动词、形容词或其他副词。',
      [
        '名词分为可数名词和不可数名词，可数名词有单复数变化',
        '动词是人称和时态的核心，分为实义动词、系动词和助动词',
        '形容词一般放在名词前作定语，或放在系动词后作表语',
        '副词通常放在它所修饰的词后面，也可放在句首或句末',
        '词类转换是英语重要能力：quick (adj.) → quickly (adv.), beauty (n.) → beautiful (adj.)',
      ],
      ['The cat sat on the mat.', 'She is a beautiful girl.', 'He runs very quickly.'],
      [
        { title: '例1', question: '判断下列句子中划线词的词类：The quick brown fox jumps over the lazy dog.',
          steps: ['quick 修饰 brown fox → 形容词', 'jumps 表示动作 → 动词', 'lazy 修饰 dog → 形容词'],
          answer: 'quick→形容词, jumps→动词, lazy→形容词' },
        { title: '例2', question: '将下列词转换为副词：quick, careful, happy',
          steps: ['quick → quickly（直接加-ly）', 'careful → carefully（直接加-ly）', 'happy → happily（y变i再加-ly）'],
          answer: 'quickly, carefully, happily' },
      ],
      '词法是英语学习的基石。中考必考词性转换和选词填空。',
      ['1. 熟记常见词类及其功能', '2. 掌握词类转换规则', '3. 通过例句理解词类在句中的作用'],
      [
        { mistake: '把形容词当副词用', correct: '"She sings beautiful" 错误，应为 "She sings beautifully"' },
        { mistake: '可数名词忘记变复数', correct: '"I have two child" 错误，应为 "I have two children"' },
      ],
      '英语词法与汉语差异很大。汉语没有词形变化，而英语必须根据语法要求改变词的形式。这是中国学生最需要适应的地方。'
    )
  );

  // ===================================================================
  // ENG-01-002 时态系统 — 16种时态概览
  // ===================================================================
  await sn('ENG-01-002', '时态系统', '一般现在、现在进行、现在完成三大时态体系', 'eng', '语法基础', '初中', 3, 110, null,
    '掌握英语时态的基本框架和标志词',
    richContent(
      '英语时态由"时间"（现在/过去/将来）和"体"（一般/进行/完成/完成进行）组合而成，共16种时态。初中阶段重点掌握8种：一般现在时、现在进行时、一般过去时、一般将来时、现在完成时等。',
      [
        '一般现在时：表示习惯、真理，标志词 always, usually, often',
        '现在进行时：表示正在进行的动作，结构 be + doing',
        '一般过去时：表示过去的动作，动词用过去式',
        '一般将来时：表示将来的动作，will/shall do 或 be going to do',
        '现在完成时：表示过去发生但对现在有影响的动作，have/has + done',
        '完成进行时：强调动作持续到现在，have/has been + doing',
      ],
      ['I go to school every day. (一般现在)', 'I am reading now. (现在进行)', 'I have finished my homework. (现在完成)'],
      [
        { title: '例1', question: '用括号内动词的正确形式填空：She ___ (study) English for three years.',
          steps: ['for three years 表示持续到现在 → 现在完成时', '主语 She → has', 'study 的过去分词是 studied'],
          answer: 'has studied' },
        { title: '例2', question: '区分 I lost my key 和 I have lost my key 的含义差异',
          steps: ['I lost my key → 一般过去时，只陈述过去事实', 'I have lost my key → 现在完成时，暗含"我现在没有钥匙"', '关键区别：是否强调对现在的影响'],
          answer: '前者只说过去丢了，后者强调现在没钥匙' },
      ],
      '时态是英语考试的重中之重。完形填空和语法填空中大量考查时态选择。',
      ['1. 先确定时间（过去/现在/将来）', '2. 再确定体（一般/进行/完成）', '3. 找标志词辅助判断'],
      [
        { mistake: '混淆一般过去时和现在完成时', correct: '一般过去时强调"什么时候发生的"，现在完成时强调"对现在的影响"' },
        { mistake: '现在进行时误用状态动词', correct: 'know, believe, belong 等状态动词一般不用于进行时' },
      ],
      '时态是英语区别于汉语最大的语法特征之一。汉语靠时间副词（昨天、明天）表达时间概念，英语则通过动词变形来体现。'
    )
  );

  // ===================================================================
  // ENG-01-003 句子结构 — 主谓宾、从句入门
  // ===================================================================
  await sn('ENG-01-003', '句子结构', '五大基本句型与从句初步', 'eng', '语法基础', '高中', 3, 120, null,
    '理解英语句子的基本骨架和复合句结构',
    richContent(
      '英语句子有五大基本句型：SV（主谓）、SVO（主谓宾）、SVC（主系表）、SVOO（主谓双宾）、SVOC（主谓宾补）。从句则是把一个句子嵌入另一个句子中，分为名词性从句、定语从句和状语从句。',
      [
        '五大基本句型是分析所有句子的基础',
        '主语和谓语是句子的核心，缺一不可',
        '定语从句修饰名词，由 which/that/who 引导',
        '宾语从句放在动词或介词后面，由 that/if/whether 引导',
        '状语从句表示时间、条件、原因、结果等',
        '强调句：It is/was ... that ...',
      ],
      ['She sings. (SVC)', 'I love you. (SVO)', 'The book that I bought is interesting. (定语从句)'],
      [
        { title: '例1', question: '分析句子成分：The boy who lives next door is a student.',
          steps: ['主语：The boy', '定语从句：who lives next door（修饰 boy）', '系动词：is', '表语：a student'],
          answer: '主系表结构，含一个定语从句' },
        { title: '例2', question: '合并两个句子：I know something. You are working hard.',
          steps: ['something 是 know 的宾语', 'You are working hard 是宾语从句内容', '用 that 引导宾语从句'],
          answer: 'I know that you are working hard.' },
      ],
      '句子结构分析是阅读理解长难句的关键。高考阅读中的长句几乎都包含从句。',
      ['1. 先找主干（主谓宾/主系表）', '2. 再识别从句类型', '3. 最后分析修饰关系'],
      [
        { mistake: '分不清定语从句和状语从句', correct: '定语从句修饰名词，状语从句修饰整个句子（时间/条件/原因）' },
        { mistake: '忽略主谓一致', correct: '定语从句的谓语要与先行词保持一致：The boy who IS... / The boys who ARE...' },
      ],
      '英语是"树状语言"——主干清晰，枝叶丰富。学会拆解句子结构，阅读长难句就不再是难题。'
    )
  );

  // ===================================================================
  // ENG-01-004 阅读理解策略
  // ===================================================================
  await sn('ENG-01-004', '阅读理解策略', 'Skimming, Scanning 与推理判断', 'eng', '语法基础', '高中', 3, 130, null,
    '掌握高效阅读的方法和技巧',
    richContent(
      '阅读理解是英语考试分值最高的部分。有效的阅读策略包括略读（Skimming）抓主旨、扫读（Scanning）找细节、推理判断（Inference）理解隐含意思。',
      [
        '略读：快速浏览首段和每段首句，把握文章主旨',
        '扫读：根据题目关键词在文中定位具体信息',
        '推理题：答案不在原文中直接出现，需要结合上下文推断',
        '词义猜测：通过上下文线索推测生词含义',
        '文章结构：常见的有总分总、因果、对比、问题解决等',
      ],
      ['Skim the first paragraph to get the main idea.', 'Scan for keywords related to each question.', 'Infer the author\'s attitude from word choices.'],
      [
        { title: '例1', question: '阅读文章后，问 "What is the main idea?" 应使用什么策略？',
          steps: ['主旨题需要用略读（Skimming）', '重点看首段、尾段和各段首句', '注意高频词汇和转折词后的内容'],
          answer: '使用略读策略，关注首尾段和各段主题句' },
        { title: '例2', question: '文章中 "The scientist was overjoyed when..." 暗示了作者怎样的态度？',
          steps: ['overjoyed 是强烈正面情绪词', '作者选用这个词表明对科学家持正面态度', '通过感情色彩词推断作者立场'],
          answer: '作者持正面/赞赏态度' },
      ],
      '阅读理解占高考英语分值约40%。掌握策略比逐字翻译效率高得多。',
      ['1. 先读题目再读文章（带着问题读）', '2. 略读抓主旨，扫读找细节', '3. 注意连接词（however, therefore, but）'],
      [
        { mistake: '逐词翻译，阅读速度极慢', correct: '学会意群阅读，一次看2-3个词而不是一个词' },
        { mistake: '看到生词就卡住', correct: '根据上下文猜测词义，或暂时跳过继续读' },
      ],
      '阅读理解的本质不是"翻译"，而是"理解信息"。就像你读中文新闻时不会逐字翻译一样。'
    )
  );

  // ===================================================================
  // ENG-01-005 写作表达 — 书信、议论文与记叙文
  // ===================================================================
  await sn('ENG-01-005', '写作表达', '三种常用文体与高分技巧', 'eng', '语法基础', '高中', 3, 140, null,
    '掌握英语写作的结构和常用表达',
    richContent(
      '英语写作主要考查三种文体：应用文（书信、通知等）、议论文（观点论述）和记叙文（故事叙述）。高分写作的关键在于结构清晰、语言准确、有一定复杂度。',
      [
        '应用文结构：称呼+正文（目的+细节+结尾）+落款',
        '议论文结构：引言（提出观点）+主体（论据支持）+结论（总结重申）',
        '记叙文六要素：Who, When, Where, What, Why, How',
        '使用连接词提升连贯性：first, moreover, however, in conclusion',
        '适当使用从句和非谓语动词增加句式多样性',
      ],
      ['Dear Sir/Madam, I am writing to...', 'In my opinion, ... For one thing... For another...', 'Once upon a time...'],
      [
        { title: '例1', question: '写一封申请志愿者活动的邮件，开头怎么写？',
          steps: ['称呼：Dear Volunteer Coordinator,', '说明目的：I am writing to apply for the volunteer position at...', '简要介绍自己：I am a Grade 11 student who is passionate about helping others.'],
          answer: 'Dear Volunteer Coordinator, I am writing to apply for...' },
        { title: '例2', question: '议论文 "Should students use smartphones in school?" 的论点怎么写？',
          steps: ['明确立场：While smartphones offer convenience, they should not be allowed in classrooms.', '给出理由：First, they distract students. Second, they may lead to cheating.', '反驳对立观点：Although some argue that phones aid learning, proper supervision is needed.'],
          answer: '立场鲜明 + 至少两个论据 + 反驳对立观点' },
      ],
      '写作是输出能力的综合体现。平时要多积累句型模板和高分表达。',
      ['1. 先列提纲（确定结构和要点）', '2. 写好开头和结尾', '3. 检查语法和拼写'],
      [
        { mistake: '通篇简单句，缺乏变化', correct: '交替使用简单句、复合句和非谓语结构' },
        { mistake: '中式英语表达', correct: '"I very like it" 错误 → "I really like it" 或 "I like it very much"' },
      ],
      '写作不是堆砌大词，而是清晰准确地表达思想。好的英语写作像好的中文写作一样——言之有物，条理分明。'
    )
  );

  // ===================================================================
  // 建立知识点之间的关系
  // ===================================================================
  console.log('  → 建立关系...');
  await sr('ENG-01-001', 'ENG-01-002', 'prerequisite', 100);
  await sr('ENG-01-002', 'ENG-01-003', 'prerequisite', 100);
  await sr('ENG-01-003', 'ENG-01-004', 'supports', 100);
  await sr('ENG-01-003', 'ENG-01-005', 'supports', 100);
  await sr('ENG-01-002', 'ENG-01-005', 'supports', 100);

  console.log('  ✓ 英语语法基础种子完成');
}
