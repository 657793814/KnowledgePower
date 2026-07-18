/**
 * 📊 英语时态与语态 — 时态体系、被动、虚拟语气
 * 人教版教材同步 + 拓展 + 考点
 */
import { sn, sr, richContent } from '../helpers.js';

export async function seedEnglishTenseDomain() {
  console.log('  → 时态与语态');

  // ===================================================================
  // ENG-03-001 一般现在与一般过去
  // ===================================================================
  await sn('ENG-03-001', '一般现在与一般过去', '最基础的两个时间维度的时态用法', 'eng', '时态与语态', '初中', 3, 100, null,
    '掌握一般现在时和一般过去时的构成规则和使用场景',
    richContent(
      '一般现在时（Simple Present）表示习惯性动作、客观真理和当前状态；一般过去时（Simple Past）表示过去某个时间发生的动作或状态。两者是英语时态体系的基础，标志性差异在于动词形式——现在时用原形/三单，过去时用过去式。',
      [
        '一般现在时构成：主语+动词原形（三单+s/es），否定用do/does+not，疑问用Do/Does开头',
        '三单变化规则：一般+s（works），以s/x/sh/ch/o结尾+es（goes），辅音+y变i+es（studies）',
        '一般现在时标志词：always, usually, often, sometimes, seldom, never, every day/week, on Sundays',
        '一般过去时构成：主语+动词过去式，否定用did+not+原形，疑问用Did开头+原形',
        '规则动词过去式变化：+ed（played），以e结尾+d（lived），辅音+y变i+ed（studied），重读闭音节双写+ed（stopped）',
        '不规则动词过去式需单独记忆：go→went, do→did, have→had, take→took, see→saw, eat→ate',
        '一般过去时标志词：yesterday, last week/month, in 2020, two days ago, just now, the other day',
        '两者对比：一般现在时表目前的习惯（I live here now），一般过去时表过去的居住（I lived there before）',
      ],
      ['I go to school by bus every day. (一般现在)', 'She went to Beijing last summer. (一般过去)'],
      [
        { title: '例1', question: '用所给动词的正确形式填空：He ___ (study) English every evening. / He ___ (study) hard last night.',
          steps: ['第一句 every evening 表示习惯 → 一般现在时', '主语 He 是第三人称单数 → study 加 es（辅音+y）', '第二句 last night 表示过去时间 → 一般过去时', 'study 规则变化 → y变i+ed = studied'],
          answer: 'studies (一般现在), studied (一般过去)' },
        { title: '例2', question: '将下列句子改为一般疑问句并否定回答：Tom visited the museum yesterday.',
          steps: ['含有过去式 visited → 借助 did', '一般疑问句：Did + 主语 + 动词原形？', '否定回答：No, he didn\'t.', '肯定回答：Yes, he did.'],
          answer: 'Did Tom visit the museum yesterday? — No, he didn\'t.' },
      ],
      '一般现在时和一般过去时是初中阶段最核心的两种时态，每年中考必考。完形填空中时段信息是判断时态的关键。',
      ['1. 先找时间标志词确定时态', '2. 注意主谓一致（三单）', '3. 熟记不规则动词过去式，特别是高频词'],
      [
        { mistake: '主语三单时动词忘了加s', correct: 'He like → He likes / She go → She goes' },
        { mistake: '动词过去式和过去分词混淆', correct: '一般过去时用过去式（went/did/saw），完成时用过去分词（gone/done/seen）' },
      ],
      '英语的"时"（Tense）通过动词形态变化体现时间概念，这与汉语用"了、过、在、着"等动态助词完全不同。'
    )
  );

  // ===================================================================
  // ENG-03-002 现在完成时
  // ===================================================================
  await sn('ENG-03-002', '现在完成时', '连接过去与现在的桥梁时态', 'eng', '时态与语态', '初中', 4, 110, null,
    '掌握现在完成时的构成、用法以及与一般过去时的区别',
    richContent(
      '现在完成时（Present Perfect）是连接过去和现在的桥梁时态。它表示过去发生的动作对现在造成影响，或者过去开始的动作持续到现在。这是中国学生最容易混淆的时态之一，因为汉语中没有对应的时态概念。',
      [
        '构成：主语 + have/has + 过去分词（done）',
        '用法一（已完成）：过去发生但对现在有影响，强调现在的结果 I have lost my key.（现在没钥匙了）',
        '用法二（未完成）：过去开始一直持续到现在，常与for/since连用 He has lived here for five years. (=到现在还住在这里)',
        '标志词区分：already(已经), yet(尚未), ever(曾经), never(从未), just(刚刚), recently(最近), lately(近来)',
        '常见错误：不与具体的过去时间状语连用！不能说 I have bought it yesterday.',
        'have been to vs have gone to vs have been in/at：去过已回/去了未回/一直待在',
        '持续性动词与短暂性动词转换：borrow→keep, buy→have, leave→be away, die→be dead, join→be a member of',
        '现在完成时 VS 一般过去时：H做过某事（现在完成）vs 什么时候做（一般过去）',
      ],
      ['I have finished my homework.（已完成，现在是"做完"的结果）', 'She has studied English since 2018.（未完成，一直持续到现在）', 'Have you ever been to Shanghai?（你曾经去过上海吗？去过已回）'],
      [
        { title: '例1', question: '用for/since填空：He has worked here ___ 2015. / He has worked here ___ ten years.',
          steps: ['2015是时间点（since+点时间）', 'ten years是一段时间（for+段时间）', 'since也可引导从句：since he graduated'],
          answer: 'since 2015, for ten years' },
        { title: '例2', question: '下面句子错在哪？如何改正？—I have bought this book for two years.',
          steps: ['buy是短暂性动词（瞬间动作）', '不能与for表示的一段时间连用', '改为持续性表达：have had this book for two years'],
          answer: '改为 I have had this book for two years.（buy→have）' },
      ],
      '现在完成时是高考语法填空的高频考点（约30%的时态考点出现现在完成时）。尤其注意与一般过去时的区分。',
      ['1. 判断"是否强调对现在的意义"', '2. 看标志词（already/yet/ever/just）', '3. 注意短暂性动词不能与段时间连用（for/since）'],
      [
        { mistake: '与具体的过去时间状语连用', correct: '"I have seen him yesterday" 错误，应为 "I saw him yesterday"（一般过去时）' },
        { mistake: '混淆 have been to 和 have gone to', correct: 'have been to 曾经去过（已回来）；have gone to 去了（还没回来）' },
      ],
      '现在完成时的本质是"双重时间"——它既提到过去（动作发生），又关联现在（结果或持续）。关键在"对现在的影响"这个判断点上。'
    )
  );

  // ===================================================================
  // ENG-03-003 进行时体系
  // ===================================================================
  await sn('ENG-03-003', '进行时体系', '现在/过去/将来进行时的结构与应用', 'eng', '时态与语态', '初中', 3, 120, null,
    '掌握进行时体系的结构、意义和标志性用法',
    richContent(
      '进行时（Continuous/Progressive Tenses）表示在某一时刻或某段时间"正在发生"的动作。核心结构是 be + doing。分为现在进行时、过去进行时和将来进行时三种。进行时与一般时的核心区别在于"动作的阶段性"——进行时强调动作在持续中。',
      [
        '现在进行时：am/is/are + doing，表示此刻正在进行的动作',
        '现在进行时的特殊用法：①表示近期安排（I\'m leaving tomorrow）②与always连用表情感色彩（He\'s always complaining）',
        '过去进行时：was/were + doing，表示过去某时刻正在进行的动作，常与一般过去时搭配使用',
        '过去进行时高频句型：when引导的时间状语从句（长动作was doing + 短动作did）',
        '将来进行时：will be + doing，表示将来某时刻正在进行的动作，语气更自然客观',
        '进行时标志词：now, at this moment, these days, at 8 o\'clock last night, when/while + 过去进行',
        '不用于进行时的动词：状态动词（know, believe, belong），感官动词（see, hear, taste），情感动词（like, hate, love）',
        '进行时 vs 一般时：She teaches English. (职业/习惯) vs She is teaching English now. (此刻动作)',
      ],
      ['I am reading a book now. (现在进行)', 'I was watching TV when he called. (过去进行 + 一般过去)', 'At 9pm tomorrow, I will be flying to London. (将来进行)'],
      [
        { title: '例1', question: '用括号内动词的正确时态填空：I ___ (cook) dinner when the phone ___ (ring).',
          steps: ['"我正在做饭"是过去某时刻的持续动作 → was cooking', '"电话响了"是打断进行中的动作 → rang（一般过去时）', '句型：was doing + when + did'],
          answer: 'was cooking, rang' },
        { title: '例2', question: '以下句子是否可以用进行时？说明理由。I ___ (know) the answer now. / You ___ (always leave) your shoes there!',
          steps: ['know是状态动词，一般不用于进行时 → I know the answer', 'always+进行时表示情感色彩（抱怨）→ You are always leaving', '进行时+always并非表示"一直在做"，而是强调"老是/总是"'],
          answer: 'know不用于进行时（保持原形know）；leave可以用进行时表示抱怨（are always leaving）' },
      ],
      '进行时在听力题中常作为干扰项出现。阅读中也常考进行时与一般时在含义上的细微差别。',
      ['1. 进行时强调"正在发生"，一般时强调"习惯/事实"', '2. 注意when和while引导的从句时态不同', '3. 状态动词不用于进行时' ],
      [
        { mistake: '将状态动词用于进行时', correct: '"I am knowing" 错误 → "I know"。类似动词：believe, belong, own, understand' },
        { mistake: '混淆 when 和 while 的用法', correct: 'when+短暂动作/长动作；while+长动作（常用进行时）' },
      ],
      '进行时就像摄像机的"录像模式"，捕捉动作正在进行的过程；而一般时就像"拍照模式"，捕捉动作完成的状态。不妨试试用这个比喻来感受两种时态的区别。'
    )
  );

  // ===================================================================
  // ENG-03-004 被动语态
  // ===================================================================
  await sn('ENG-03-004', '被动语态', 'be+done结构与不同时态的被动形式', 'eng', '时态与语态', '高中', 4, 130, null,
    '掌握被动语态的构成、各种时态对应形式以及使用场景',
    richContent(
      '被动语态（Passive Voice）表示主语是动作的承受者，而不是执行者。核心结构是 be + 过去分词。在学术英语和正式文体中被动语态使用极为频繁。英语有10种常用时态的被动形式，考试中常考的约6种。',
      [
        '被动语态构成：be（及时态变化）+ 过去分词（done）',
        '一般现在时被动：am/is/are + done（English is spoken worldwide.）',
        '一般过去时被动：was/were + done（The bridge was built in 1990.）',
        '现在进行时被动：am/is/are + being + done（The road is being repaired.）',
        '过去进行时被动：was/were + being + done（The house was being painted.）',
        '现在完成时被动：have/has + been + done（The work has been finished.）',
        '一般将来时被动：will be + done（The exam will be held next week.）',
        '含情态动词的被动：情态动词 + be + done（This must be done immediately.）',
        '主动变被动的步骤：宾语变主语 + 动词变be+done + 原主语变by+宾语',
        '主动表被动的特殊情况：need doing = need to be done, be worth doing',
      ],
      ['The story was written by Mark Twain.（过去时被动）', 'A new hospital is being built in our city.（现在进行被动）', 'The problem has been solved.（完成时被动）'],
      [
        { title: '例1', question: '将主动句改为被动句：The students cleaned the classroom yesterday.',
          steps: ['宾语 the classroom 变主语', '动词 cleaned 变 was + cleaned（过去时）', '原主语 the students 变 by the students'],
          answer: 'The classroom was cleaned by the students yesterday.' },
        { title: '例2', question: '用正确的被动语态填空：The book ___ (translate) into 20 languages so far.',
          steps: ['so far 表示「至今」 → 现在完成时', 'book 是「被翻译」 → 被动语态', '现在完成被动：has been translated'],
          answer: 'has been translated' },
      ],
      '被动语态在高考语法填空中几乎是必考点（每年约1-2题）。尤其注意完成时和进行时的被动形式。',
      ['1. 判断主语是动作的执行者还是承受者', '2. 被动语态的时态体现在be的变化上', '3. 注意by短语可以省略（执行者不明显时）'],
      [
        { mistake: '被动语态缺少be动词', correct: '"The work finished" 错误（是主动），应为 "The work was finished"（被动）' },
        { mistake: '进行时被动写成 being + been', correct: '现在完成被动是 have been + done（没有being），进行时被动才是 being + done' },
      ],
      '中文用"被、由、受到"表达被动概念，但英文必须通过"be+过去分词"的结构完整表达。很多中文的主动句在英语中实际需要用被动语态（如"据说…"→It is said that…）。'
    )
  );

  // ===================================================================
  // ENG-03-005 虚拟语气
  // ===================================================================
  await sn('ENG-03-005', '虚拟语气', '与事实相反的假设与表达', 'eng', '时态与语态', '高中', 5, 140, null,
    '掌握虚拟语气的三种时态体系和特殊句型中的用法',
    richContent(
      '虚拟语气（Subjunctive Mood）用于表达与事实相反的假设、愿望、建议等。这是英语语法中较难的部分，因为它涉及"时态后退"的概念——在虚拟语境中，时态需要向前推移一个步骤（现在→过去，过去→过去完成）。',
      [
        '与现在事实相反：If + 主语 + did/were, 主语 + would/could/might + do',
        '与过去事实相反：If + 主语 + had + done, 主语 + would/could/might + have + done',
        '与将来事实相反：If + 主语 + did/were to do/should + do, 主语 + would/could/might + do',
        '错综时间虚拟条件句：主从句时间不一致，各自使用对应时间的虚拟形式',
        '省略if的虚拟倒装：If I were you → Were I you... / If I had known → Had I known...',
        'wish后宾语从句虚拟：wish + did(与现在相反)/had done(与过去相反)/would do(与将来相反)',
        'as if/as though从句虚拟：与现实相反时用法同wish',
        '名词性从句虚拟：在suggest/advise/order/require等动词后，用(should)+do',
        'It is (high) time that + 主语 + did（虚拟过去式）/ should do',
        'would rather + 主语 + did(对现在或将来虚拟)/had done(对过去虚拟)',
      ],
      ['If I were you, I would accept the offer.（与现在相反——事实：我并不是你）', 'If I had studied harder, I would have passed the exam.（与过去相反——事实：我当初没努力学习）'],
      [
        { title: '例1', question: '用虚拟语气完成句子：If I ___ (have) enough money, I ___ (buy) that car now.',
          steps: ['与现在事实相反→从句用过去时', 'have的过去时→had', '主句用would + 原形→would buy', '"我现在没有足够的钱买车"'],
          answer: 'If I had enough money, I would buy that car.' },
        { title: '例2', question: '完成wish从句：I wish I ___ (know) the answer yesterday.',
          steps: ['wish从句与过去事实相反', '用过去完成时 → had known', '完整：I wish I had known the answer yesterday.'],
          answer: 'had known' },
      ],
      '虚拟语气是高考英语的高难度考点，主要出现在单项选择题和语法填空中。分值虽不高（1-2题），但区分度高。',
      ['1. 先判断"是真是假"——虚拟语气用于与事实相反的情况', '2. 熟记三种时间框架的公式', '3. 注意suggest后从句省略should的情况'],
      [
        { mistake: 'if虚拟条件句中用 would', correct: 'if从句中不能出现would/should（省略倒装除外）→ If I had time...（√）, If I would have time...（×）' },
        { mistake: '混淆suggest表"建议"（虚拟）和"暗示"（陈述语气）', correct: 'suggest表建议：I suggest (that) he go（用原形）；suggest表暗示：His tone suggested he was satisfied（用一般时）' },
      ],
      '虚拟语气反映了英语中"时间表达与事实判断"的分离——英语通过"时态后退"这一独特的语法手段来表达与现实的距离感。这是英语语法思维灵活性的集中体现。'
    )
  );

  // ===================================================================
  // 建立知识点之间的关系
  // ===================================================================
  console.log('  → 建立关系...');
  await sr('ENG-03-001', 'ENG-03-002', 'prerequisite', 100);
  await sr('ENG-03-001', 'ENG-03-003', 'prerequisite', 100);
  await sr('ENG-03-002', 'ENG-03-004', 'prerequisite', 100);
  await sr('ENG-03-003', 'ENG-03-004', 'prerequisite', 100);
  await sr('ENG-03-001', 'ENG-03-005', 'prerequisite', 100);
  await sr('ENG-03-002', 'ENG-03-005', 'supports', 100);
  await sr('ENG-03-004', 'ENG-03-005', 'supports', 100);

  console.log('  ✓ 时态与语态种子完成');
}
