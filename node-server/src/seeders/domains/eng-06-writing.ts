/**
 * 📊 英语写作表达 — 段落结构、衔接技巧、各文体写作框架
 * 人教版教材同步 + 拓展 + 考点
 */
import { sn, sr, richContent } from '../helpers.js';

export async function seedEnglishWritingDomain() {
  console.log('  → 写作表达');

  // ===================================================================
  // ENG-06-001 段落结构与主题句
  // ===================================================================
  await sn('ENG-06-001', '段落结构与主题句', '段落结构组织与主题句/支撑句/结尾句的配合', 'eng', '写作表达', '高中', 3, 100, null,
    '掌握英语段落的基本结构和主题句的写法',
    richContent(
      '英语段落的核心结构是"主题句（Topic Sentence）+ 支撑句（Supporting Sentences）+ 结尾句（Concluding Sentence）"。主题句点明段落中心立意，支撑句提供论据、例子或细节来支持主题句，结尾句总结或过渡到下一段。这个结构是构建清晰、有说服力文章的基础。',
      [
        '主题句的位置：段首（最常用，开门见山）、段尾（先推理后总结）、段中（先铺垫），段首为最佳选择',
        '主题句的构成：主题（Topic）+ 控制思想（Controlling Idea），如"College life offers many opportunities for personal growth."',
        '好的主题句特征：具体不笼统、有明确重点、能为段落发展提供方向',
        '支撑句类型：事实数据（Facts）、例子（Examples）、细节（Details）、原因（Reasons）、引用（Quotations）',
        '支撑句的组织方式：时间顺序、空间顺序、重要程度（最强→最弱或最弱→最强）',
        '结尾句功能：总结段落内容、重新强调主题、过渡到下一段',
        '段落过渡技巧：使用however/furthermore/in addition/therefore等连接词',
        '一个完整段落的黄金长度：4-8个句子，100-150词',
        '段落内容的统一性：段落中所有句子都要围绕同一个主题，不包含无关内容',
      ],
      ['Topic Sentence: "Living in a big city has both advantages and disadvantages."', 'Supporting: "First, cities offer better job opportunities..." / "However, the cost of living is much higher..."'],
      [
        { title: '例1', question: '判断以下主题句是否合格：①"I want to talk about dogs." ②"Dogs are loyal companions, which is why many families keep them as pets."',
          steps: ['主题句①太笼统，"talk about dogs"没有控制思想，不知道段落方向', '主题句②包含主题（dogs）和控制思想（loyal companions → why many families keep them）', '好主题句应让读者预知段落中将要讨论的内容'],
          answer: '①不合格（太笼统）②合格（有明确重点和方向）' },
        { title: '例2', question: '给主题句"Smartphones have greatly changed the way we communicate." 写出三个支撑句。',
          steps: ['支撑句1：以事实说明变化——People now send messages through WeChat instead of making phone calls.', '支撑句2：用具体例子——Video calls allow families far apart to see each other regularly.', '支撑句3：补充细节——Social media platforms have made instant communication a daily habit.'],
          answer: '1) WeChat代替电话呼叫 2) 视频通话拉近距离 3) 社交媒体使即时通讯成为日常' },
      ],
      '段落结构是写作得分的核心标准之一。高考英语写作评分标准中"内容要点"和"篇章结构"各占重要比重。',
      ['1. 每段必须有且只有一个核心观点', '2. 主题句放在段首，让阅卷老师一眼看到段落中心', '3. 支撑句用2-3个具体例子或理由，避免空泛'],
      [
        { mistake: '段落内多个主题混杂', correct: '一个段落只讨论一个中心思想。如果要换话题，另起一段' },
        { mistake: '主题句太笼统/无实际内容', correct: '"There are many things about dogs" → 改为 "Dogs are known for their loyalty and companionship abilities"' },
      ],
      '英语的段落结构就像是"汉堡包"——上下两层面包（主题句+结尾句）包着中间的肉（支撑句）。这种结构清晰、好写、也好读。'
    )
  );

  // ===================================================================
  // ENG-06-002 衔接词与逻辑连接
  // ===================================================================
  await sn('ENG-06-002', '衔接词与逻辑连接', '词汇衔接与逻辑连接词的使用', 'eng', '写作表达', '高中', 4, 110, null,
    '掌握英语写作中各类逻辑连接词和衔接技巧，提升文章连贯性',
    richContent(
      '衔接词（Transitional Words）是将文章中的句子和段落有机连接起来的"粘合剂"。没有衔接词的文章就像一堆散落的珍珠，而有衔接词的文章才是一条完整的项链。高考高分作文的共同特征之一是合理使用衔接词，使文章逻辑清晰、层次分明。',
      [
        '表示递进/补充：furthermore, moreover, in addition, besides, what\'s more, not only...but also',
        '表示转折/对比：however, nevertheless, on the contrary, in contrast, while, whereas, on the other hand',
        '表示因果：therefore, thus, consequently, as a result, accordingly, for this reason, owing to',
        '表示顺序/列举：first/firstly, second/secondly, finally, to begin with, next, last but not least',
        '表示举例：for example, for instance, such as, take...as an example, to illustrate',
        '表示总结/归纳：in conclusion, to sum up, in summary, all in all, in a word, overall',
        '表示让步：admittedly, it is true that..., although, despite/in spite of, even though',
        '表示强调：indeed, undoubtedly, obviously, in fact, as a matter of fact, without doubt',
        '词汇衔接技巧：使用同义词替换避免重复、代词指代前文内容、上义词概括下义词',
        '衔接不等于堆砌——一个好的段落使用2-3个连接词就足够。过度使用反而显得生硬。',
      ],
      ['First, regular exercise improves physical health. Moreover, it also benefits mental well-being. Therefore, everyone should make exercise a habit.'],
      [
        { title: '例1', question: '请在以下段落中空白处填入恰当的连接词：___ (1), studying abroad broadens your horizons. ___ (2), it helps you become independent. ___ (3), it also comes with challenges like culture shock.',
          steps: ['第一句引出第一个论点→用First/Firstly/To begin with', '第二句补充论点→用Moreover/In addition/Furthermore', '第三句转折引出反面→用However/Nevertheless/On the other hand'],
          answer: '(1) First, (2) Moreover, (3) However' },
        { title: '例2', question: '以下连接词分别属于哪一类？therefore, however, in addition, for instance, in conclusion',
          steps: ['therefore→因果关系（所以/因此）', 'however→转折关系（然而）', 'in addition→递进关系（此外）', 'for instance→举例关系（例如）', 'in conclusion→总结关系（总之）'],
          answer: '因果-转折-递进-举例-总结' },
      ],
      '衔接词的使用是高考英语写作评分标准中"篇章结构"和"语言丰富性"的重要体现。一篇无衔接词的文章通常难以及格。',
      ['1. 根据逻辑关系选择正确的连接词', '2. 不同段落之间也需要过渡（In contrast to... / Building on this...）', '3. 同一种逻辑关系准备2-3个不同连接词替换使用'],
      [
        { mistake: '滥用however', correct: '一篇作文中使用1-2次however即可，更多时候可用nevertheless/yet/instead/on the other hand替代' },
        { mistake: '连接词位置错误', correct: 'however放句首用逗号隔开，也可以放句中用两个逗号隔开' },
      ],
      '衔接词看似是"技术活"，其实反映的是思维方式。中文写作讲求"文以气为主"，逻辑关系通过语意承接；英语写作则讲究"明接"，逻辑关系通过连接词显性标识。'
    )
  );

  // ===================================================================
  // ENG-06-003 应用文写作（书信/邮件）
  // ===================================================================
  await sn('ENG-06-003', '应用文写作（书信/邮件）', '书信、邮件、通知等常用应用文格式与模板', 'eng', '写作表达', '高中', 4, 120, null,
    '掌握英语应用文写作的格式规范和高分句型',
    richContent(
      '应用文（Practical Writing）是高考英语写作的必考题型。包括书信、邮件、通知、演讲稿、日记、报道等。应用文有固定的格式和惯用表达，掌握模板和句型是快速提分的关键。近年来新课标卷倾向于"情景写作"——在应用文中融入适当的内容描述。',
      [
        '书信/邮件基本格式：称呼（Dear...）+ 正文（开头+主体+结尾）+ 落款（Yours sincerely/truly, + 签名）',
        '开头常用句：I\'m writing to... / I\'m writing in response to... / Thank you for your letter...',
        '建议类：I\'d like to suggest that... / It would be a good idea to... / You might consider...',
        '邀请类：I\'d like to invite you to... / It would be an honor if you could join us...',
        '申请类：I\'m writing to apply for... / I believe I\'m qualified for... / I would appreciate it if...',
        '感谢类：I\'m writing to express my sincere gratitude... / I can\'t thank you enough for...',
        '道歉类：I\'m writing to apologize for... / I sincerely regret that... / Please accept my apologies.',
        '投诉类：I\'m writing to complain about... / I was disappointed to find... / I would appreciate it if...',
        '通知格式：标题（Notice/Announcement）+ 正文（时间地点人物事件）+ 落款（发布单位和日期）',
        '应用文注意要点：语气恰当（正式/非正式根据对象）、内容完整（覆盖所有题目要点）、格式正确',
      ],
      ['Dear Sir/Madam, I am writing to apply for the position of volunteer. (申请信开头)', 'I\'m writing to invite you to join our school\'s English Summer Camp. (邀请信开头)'],
      [
        { title: '例1', question: '写一封建议信的开头段，建议朋友如何学英语',
          steps: ['称呼：Dear Tom,', '点明写信目的：I\'m writing to offer you some advice on English learning.', '引出建议：First of all, you can watch English movies to improve your listening.', '连接下文：What\'s more, reading English books may also help.'],
          answer: 'Dear Tom, I\'m writing to offer you some advice on English learning.' },
        { title: '例2', question: '写一封感谢信的结尾段',
          steps: ['再次表达感谢：Once again, I\'d like to express my heartfelt thanks.', '表示回报意愿：I would be happy to return the favor when you need help.', '祝福语+落款：Best wishes! Yours sincerely, Li Hua'],
          answer: 'Once again, thank you for your generous help. I hope I can return the favor in the future. Best wishes! Yours sincerely, Li Hua' },
      ],
      '应用文写作占高考英语写作总分的50%（15分/30分）。格式正确是基本分（2-3分），内容要点完整（10分左右），语言表达（3-5分）。',
      ['1. 先确认文体和应用场景（正式/非正式）', '2. 使用标准模板开头结尾', '3. 正文覆盖全部题目要点，不要遗漏'],
      [
        { mistake: '称呼后误用标点', correct: '正式信函称呼后用逗号（Dear Sir,），非正式可用逗号或感叹号' },
        { mistake: '落款格式错误', correct: '正式信函用 Yours sincerely（知道姓名时）或 Yours faithfully（Dear Sir/Madam时），不要混用' },
      ],
      '应用文写作就像是请客吃饭——有固定的"礼仪"。知道什么时候握手、什么时候举杯、什么时候道别，就能轻松应对。'
    )
  );

  // ===================================================================
  // ENG-06-004 议论文写作框架
  // ===================================================================
  await sn('ENG-06-004', '议论文写作框架', '观点类和利弊类议论文的结构模板', 'eng', '写作表达', '高中', 5, 130, null,
    '掌握议论文的经典结构和论证方法',
    richContent(
      '议论文（Argumentative Essay）是高中英语写作中最具挑战性的文体。它要求作者提出明确观点，并用有力的论据和合理的逻辑来支持这一观点。高考议论文通常分为"观点类"（Do you agree or disagree?）和"利弊类"（Advantages and disadvantages）两种。',
      [
        '观点类议论文结构：引言（提出论点）→ 主体段1（论据1+例子）→ 主体段2（论据2+例子）→ 让步段（承认对立观点）→ 结论（重申观点升华主题）',
        '利弊类议论文结构：引言（引出话题）→ 优点段 → 缺点段 → 个人观点段 → 结论',
        '引言段关键：Hook（吸引注意）+ Background（背景信息）+ Thesis（明确观点）',
        'Hook技巧：反问句（Have you ever...?）、数据（According to...）、名言（As the saying goes...）',
        '论据展开方法：Topic sentence + Explanation + Example + Summary（TEES结构）',
        '让步段句式：Admittedly... / It is true that... / Despite these benefits, ... / Nevertheless...',
        '结论段句式：In conclusion / To sum up / From what has been discussed above...',
        '高分句型：倒装句（Not only...but also）、强调句（It is...that...）、从句链（what引导的主语从句等）',
        '论证方法：举例论证、因果论证、对比论证、引用论证、类比论证',
      ],
      ['In my opinion, studying abroad has more benefits than drawbacks. (明确的观点)', 'Admittedly, there are some disadvantages, but the advantages outweigh them. (让步+坚持观点)'],
      [
        { title: '例1', question: '写议论文"Should students be allowed to use smartphones in school?"的引言段，表明反对立场。',
          steps: ['Hook：用反问引起注意——"Are smartphones really necessary in the classroom?"', '背景：简要说明手机在学校存在的争议', 'Thesis阐明立场："In my opinion, smartphones should not be allowed in school classrooms."'],
          answer: 'Are smartphones really necessary in the classroom? While some argue that they are useful learning tools, I firmly believe that smartphones should not be allowed in school classrooms.' },
        { title: '例2', question: '写一个让步段——先承认手机也有优点，再坚持自己的观点。',
          steps: ['承认对立观点：Admittedly, smartphones provide quick access to information.', '然而……：However, this benefit comes at the cost of distraction and reduced face-to-face interaction.', '重申立场：Therefore, the disadvantages still outweigh the potential advantages.'],
          answer: 'Admittedly, smartphones can be used to look up information quickly during class. However, the temptation to browse social media or play games far outweighs this benefit. Therefore, I maintain my stance that smartphones should be banned in classrooms.' },
      ],
      '议论文是高考英语写作中区分度最高的文体。全国卷的"读后续写"新题型中也融合了议论文的逻辑思维能力。',
      ['1. 观点要鲜明——不要模棱两可', '2. 每个段落只讨论一个论据', '3. 论据要有具体例子支撑，不要空喊口号'],
      [
        { mistake: '观点不明确，摇摆不定', correct: '第一段就亮明观点，全文围绕这个观点论证。避免"Some think yes, some think no...I don\'t know"' },
        { mistake: '论据空泛无实例', correct: '"Smoking is bad." → "Smoking is harmful. For example, a study shows that smokers are 15 times more likely to develop lung cancer than non-smokers."' },
      ],
      '议论文就像是法庭辩论——你有立场（原告或被告），你需要证据（论据），你需要说服法官（阅卷老师）。清晰的结构和有力的论据是获胜的关键。'
    )
  );

  // ===================================================================
  // ENG-06-005 读后续写技巧
  // ===================================================================
  await sn('ENG-06-005', '读后续写技巧', '新题型"读后续写"的构思、衔接与表达技巧', 'eng', '写作表达', '高中', 5, 140, null,
    '掌握读后续写的构思方法、内容衔接和高分表达技巧',
    richContent(
      '读后续写（Continuation Writing）是新课标卷高考改革后新增的重要写作题型。考生需要先阅读一段约350词的故事性文本，然后在理解原文的基础上完成两个续写段落（约150词）。这一题型综合考查阅读理解、逻辑推理、创意表达和语言运用四大能力。',
      [
        '解题三步走：①读——理清人物关系、故事发展脉络和冲突点 ②想——构思续写内容，确定故事情节走向 ③写——用合适的语言续写两个段落',
        '关键原则"四个一致"：与原文人物性格一致、与原文情节发展方向一致、与原文语言风格一致、与原文时态一致（通常为一般过去时）',
        '续写第一段内容：承接原文末尾，描写事件发展和人物反应（多用动作描写和情感描写）',
        '续写第二段内容：故事高潮+结局+主题升华（常用感悟或哲理结尾）',
        '高分必备：动作描写（walked silently / clenched his fists / tears streaming down her face）',
        '高分必备：情感描写（overwhelmed with joy / filled with mixed feelings / a surge of disappointment）',
        '高分必备：环境描写（The sun was setting. / Dark clouds gathered. → 烘托人物心境）',
        '高分必备：对话描写（"I\'m sorry," he whispered. → 体现人物关系和性格）',
        '常见故事主题：成长与改变、勇气与坚持、善意与帮助、亲情友情、克服困难、顿悟与转变',
        '段落开头衔接技巧：用连接词或时间状语开头（Suddenly / To his surprise / At that moment / Hours later）',
      ],
      ['第一段开头：When they got home, it was already dark. → 接着描述回家后的情景', '第二段结尾：From that day on, Tom realized that true friendship was more valuable than any prize.'],
      [
        { title: '例1', question: '原文末尾："Peter looked at the empty stage and felt his heart sink. He had forgotten all his lines." 请构思续写第一段的内容。',
          steps: ['人物状态：Peter焦虑/恐慌', '情节发展方向：他需要克服这个危机', '建议内容：深呼吸冷静 + 回想排练内容 + 鼓起勇气上台', '融入动作描写+took a deep breath, closed his eyes'],
          answer: 'Peter took a deep breath and closed his eyes. "I can do this," he whispered to himself. Suddenly, all the lines he had practiced came flooding back. He walked onto the stage with confidence.' },
        { title: '例2', question: '给出句中的情感描写可以如何改写更生动？"Tom was very happy when he heard the news."',
          steps: ['用具体动作表现"开心"：Tom jumped up and down / a big smile spread across his face', '用面部描写：His eyes lit up with excitement.', '用感受描写：A warm feeling of joy washed over him.'],
          answer: 'Tom\'s face lit up with a broad smile as a warm feeling of joy washed over him.' },
      ],
      '读后续写占高考英语写作总分的50%（25分/满分150中的25分），是决定英语高分的关键。',
      ['1. 情节设计要合理但有一定意外性（让阅卷老师眼前一亮）', '2. 多用动作描写代替"said/felt/was"等泛泛之词', '3. 第二段结尾一定要有主题升华（让文章有"灵魂"）'],
      [
        { mistake: '续写情节完全天马行空，脱离原文设定', correct: '续写的两个段落必须紧接原文末尾，情节发展方向要与原文线索保持一致' },
        { mistake: '续写内容与原文逻辑矛盾', correct: '注意时间、地点、人物关系不能出错。如果原文是"The door was locked"，后续不能写某人直接推门进去。' },
      ],
      '读后续写的本质是"站在作者的角度想问题"。读懂了作者的意图和风格，你就可以成为那个故事的第二作者。练习时多思考"如果我是作者，我会怎么写下去"。'
    )
  );

  // ===================================================================
  // 建立知识点之间的关系
  // ===================================================================
  console.log('  → 建立关系...');
  await sr('ENG-06-001', 'ENG-06-002', 'prerequisite', 100);
  await sr('ENG-06-001', 'ENG-06-003', 'prerequisite', 100);
  await sr('ENG-06-001', 'ENG-06-004', 'prerequisite', 100);
  await sr('ENG-06-002', 'ENG-06-003', 'supports', 100);
  await sr('ENG-06-002', 'ENG-06-004', 'supports', 100);
  await sr('ENG-06-003', 'ENG-06-004', 'supports', 100);
  await sr('ENG-06-004', 'ENG-06-005', 'supports', 100);
  await sr('ENG-06-003', 'ENG-06-005', 'supports', 100);

  console.log('  ✓ 写作表达种子完成');
}
