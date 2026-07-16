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

// Domain 1: 词法与构词
async function seedEng01() {
  const D = '词法与构词';
  await sn('ENG-01-001', '名词与代词', 'Nouns & Pronouns', 'eng', D, '高中', 2, 1, 'list',
    '名词是表示人、事物、地点或抽象概念的词。代词用来替代名词以避免重复。英语名词有可数/不可数之分，代词有人称、格、数的变化。',
    buildContent('名词表示人或事物，代词替代名词',
      ['可数名词有单复数变化：book→books, child→children', '不可数名词无复数形式：water, information, advice', '人称代词主格(I/we/you/he/she/it/they)与宾格(me/us/you/him/her/it/them)', '物主代词：形容词性(my/your) vs 名词性(mine/yours)', '指示代词(this/that/these/those)和不定代词(some/any/every/nothing)'],
      [],
      ['She gave me a book.（"a book"是可数名词单数）', 'Information is important.（"information"不可数，谓语用单数）']
    ));
  await sn('ENG-01-002', '形容词与副词', 'Adjectives & Adverbs', 'eng', D, '高中', 2, 2, 'list',
    '形容词修饰名词，副词修饰动词/形容词/其他副词。两者都有比较级和最高级形式，规则和不规则变化需要掌握。',
    buildContent('形容词修饰名词，副词修饰动词、形容词或其他副词',
      ['形容词位置：前置定语(a beautiful girl) 或 表语(The sky is blue)', '副词位置：动词前、be动词后、句首/句末', '比较级：good→better→best, fast→faster→fastest', '副词构成：大多数形容词+ly→quickly, slowly, carefully', '多重定语顺序：大小→形状→年龄→颜色→来源→材料→用途'],
      [],
      ['She is the most talented student in our class.（最高级）', 'He runs very quickly.（副词修饰动词）']
    ));
  await sn('ENG-01-003', '介词与连词', 'Prepositions & Conjunctions', 'eng', D, '高中', 2, 3, 'list',
    '介词用于名词/代词前，表示时间、地点、方式等关系。连词连接词、短语或句子，分为并列连词和从属连词。',
    buildContent('介词引出名词/代词构成介词短语，连词连接词语或句子',
      ['时间介词：in(月份/年), on(具体日期), at(具体时刻)', '地点介词：in(内部), on(表面), at(某点)', '并列连词：and, but, or, so, yet', '从属连词：because, although, if, when, while, since', '固定搭配：depend on, look forward to, be interested in'],
      [],
      ['I will arrive at 3pm on Monday.（at+时刻, on+星期）', 'Although it rained, we went out.（although引导让步状语从句）']
    ));
  await sn('ENG-01-004', '动词分类与情态动词', 'Verb Types & Modal Verbs', 'eng', D, '高中', 2, 4, 'list',
    '动词分为实义动词、系动词、助动词。情态动词表达能力、可能性、许可等情态意义，无人称和数的变化。',
    buildContent('情态动词表达说话人的态度、能力、许可、推测等',
      ['can/could：能力、请求, could语气更委婉', 'may/might：可能性、许可, might可能性更小', 'must：必须、一定推测, mustn't：禁止', 'should/ought to：应该, need/dare：需要/敢'],
      [],
      ['You must wear a seatbelt.（义务）', 'It might rain tomorrow.（推测）']
    ));
  await sn('ENG-01-005', '构词法', 'Word Formation', 'eng', D, '高中', 2, 5, 'list',
    '英语单词可通过派生（加前后缀）、合成、转化等方式构成。掌握构词法有助于扩大词汇量。',
    buildContent('通过加前缀/后缀、合成、转化来创造新词',
      ['前缀改变词义：un-(unhappy), re-(rewrite), dis-(disagree)', '后缀改变词性：-tion(nation→national), -ful(beauty→beautiful)', '合成词：black+board=blackboard, note+book=notebook', '转化：名词→动词(book a room), 形容词→动词(clean the room)'],
      [],
      ['unhappy = un- + happy（前缀改变词义）', 'teach(动词) → teacher(名词，-er后缀)']
    ));
}

// Domain 2: 动词时态与语态
async function seedEng02() {
  const D = '动词时态与语态';
  await sn('ENG-02-001', '一般时态', 'Simple Tenses', 'eng', D, '高中', 2, 1, 'list',
    '一般现在时表习惯/真理，一般过去时表过去发生的动作，一般将来时表将来计划或预测。',
    buildContent('一般时态表示经常性动作、客观事实或将来计划',
      ['一般现在时：I go to school every day.（习惯）/ The earth revolves around the sun.（真理）', '一般过去时：I visited Beijing last year.（过去时间标志）', '一般将来时：I will help you. / I am going to study.（will表意愿, be going to表计划）', '注意：there be句型的一般时态变化'],
      [],
      ['She speaks three languages.（一般现在时表能力）', 'They built this house in 1990.（一般过去时）']
    ));
  await sn('ENG-02-002', '进行时态', 'Continuous Tenses', 'eng', D, '高中', 2, 2, 'list',
    '进行时态表示在某一时刻正在进行的动作，由be+doing构成。',
    buildContent('进行时态强调动作在某一时刻正在进行或持续',
      ['现在进行时：am/is/are + doing, I am reading now.', '过去进行时：was/were + doing, I was sleeping at 10pm yesterday.', '将来进行时：will be doing, I will be waiting for you.', '进行时不用于的动词：know, believe, belong, own, love, hate'],
      [],
      ['At this time tomorrow, I will be flying to Shanghai.（将来进行）', 'She was cooking when I called.（过去进行时）']
    ));
  await sn('ENG-02-003', '完成时态', 'Perfect Tenses', 'eng', D, '高中', 2, 3, 'list',
    '完成时态表示动作在某一时间点之前已经完成或对现在有影响。',
    buildContent('完成时态表示"过去的过去"或动作对现在的影响',
      ['现在完成时：have/has + done, I have lived here for 5 years.', '过去完成时：had + done, I had finished before he arrived.', '将来完成时：will have + done, By next year I will have graduated.', '现在完成 vs 一般过去：完成时强调影响, 过去时强调时间'],
      [],
      ['I have already eaten lunch.（对现在的影响：不饿了）', 'She had left before I got there.（过去完成时）']
    ));
  await sn('ENG-02-004', '被动语态', 'Passive Voice', 'eng', D, '高中', 2, 4, 'list',
    '被动语态强调动作的承受者而非执行者，结构为be+done。',
    buildContent('被动语态将动作承受者置于主语位置',
      ['基本结构：be + 过去分词（done）', '各时态被动：is done / was done / has been done / will be done', '含情态动词被动：can be done, should be completed', '双宾语被动：He was given a book. / A book was given to him.'],
      [],
      ['The book was written by Lu Xun.（被动语态）', 'English is spoken all over the world.（一般现在时被动）']
    ));
  await sn('ENG-02-005', '时态一致与语态综合', 'Tense Consistency & Voice', 'eng', D, '高中', 2, 5, 'list',
    '叙述中时态要保持一致，根据语境灵活切换。主动与被动的选择取决于强调重点。',
    buildContent('时态一致原则：主从句时态需协调配合',
      ['宾语从句时态一致：He said he was tired.', '时间/条件状语从句：用一般现在时代替将来时', '一般过去时叙事中穿插过去完成时', '语态转换：主动变被动需注意保留双宾语'],
      [],
      ['If it rains tomorrow, we will stay home.（条件从句用一般现在时）', 'The teacher told us that the earth moves around the sun.（客观真理永远一般现在时）']
    ));
}

// Domain 3: 句法
async function seedEng03() {
  const D = '句法';
  await sn('ENG-03-001', '基本句型', 'Basic Sentence Patterns', 'eng', D, '高中', 2, 1, 'list',
    '英语五大基本句型：SV、SVP、SVO、SVOO、SVOC。',
    buildContent('英语有五种基本句型，掌握它们是分析复杂句的基础',
      ['主谓(SV)：Birds fly.', '主系表(SVP)：She is happy.（系动词：be, seem, become, feel）', '主谓宾(SVO)：I love music.', '主谓双宾(SVOO)：He gave me a gift.', '主谓宾补(SVOC)：We elected him monitor.'],
      [],
      ['The soup tastes delicious.（主系表句型）', 'My mother made me a sweater.（主谓双宾）']
    ));
  await sn('ENG-03-002', '主谓一致', 'Subject-Verb Agreement', 'eng', D, '高中', 2, 2, 'list',
    '谓语动词在人称和数上要与主语保持一致。',
    buildContent('主语和谓语动词在人称和数上保持一致',
      ['语法一致：单数主语+单数动词, 复数主语+复数动词', '意义一致：集合名词(family/class)视整体/成员而定', '就近原则：either...or, neither...nor, not only...but also', '远距原则：as well as, together with, along with'],
      [],
      ['Neither the teacher nor the students were present.（就近原则）', 'The family is large.（family视为整体用单数）']
    ));
  await sn('ENG-03-003', '非谓语动词', 'Non-finite Verbs', 'eng', D, '高中', 2, 3, 'list',
    '非谓语动词包括不定式(to do)、动名词(doing)、分词(done/doing)，不能单独作谓语。',
    buildContent('非谓语动词包括不定式、动名词和分词三种形式',
      ['不定式(to do)：表目的、将来, I want to go.', '动名词(doing)：表习惯、已发生, I enjoy swimming.', '现在分词(doing)：表主动、进行, The running boy is my brother.', '过去分词(done)：表被动、完成, The broken window needs fixing.'],
      [],
      ['To pass the exam, he studied hard.（不定式表目的）', 'She avoids making mistakes.（avoid后接动名词）']
    ));
  await sn('ENG-03-004', '虚拟语气', 'Subjunctive Mood', 'eng', D, '高中', 2, 4, 'list',
    '虚拟语气表示假设、愿望或与事实相反的情况。',
    buildContent('虚拟语气表示假设、愿望或与事实不符的情况',
      ['if条件句虚拟：与现在相反(were/did), 与过去相反(had done), 与将来相反(were to/did)]', 'wish从句：wish+过去完成时(与过去相反)', 'suggest/recommend/insist等后的宾语从句用(should)+do', 'It is time that... 后用过去时或should+do'],
      [],
      ['If I were you, I would accept the offer.（与现在相反）', 'I wish I had studied harder.（与过去相反）']
    ));
  await sn('ENG-03-005', '倒装与强调', 'Inversion & Emphasis', 'eng', D, '高中', 2, 5, 'list',
    '倒装句将部分或全部谓语提前。强调句用It is...that...结构。',
    buildContent('倒装是将谓语或部分谓语提到主语之前，强调是用It is...that...',
      ['完全倒装：Here comes the bus. / There goes the bell.', '部分倒装：否定词开头(Never have I seen...), only+状语', 'so/neither/nor倒装：So do I. / Neither can she.', '强调句：It is/was + 被强调部分 + that/who + 其余部分'],
      [],
      ['Never have I been to Paris.（否定词开头部分倒装）', 'It was Tom who broke the window.（强调主语）']
    ));
}

// Domain 4: 从句
async function seedEng04() {
  const D = '从句';
  await sn('ENG-04-001', '名词性从句', 'Noun Clauses', 'eng', D, '高中', 2, 1, 'list',
    '名词性从句包括主语从句、宾语从句、表语从句、同位语从句，在句中起名词作用。',
    buildContent('名词性从句在句中充当主语、宾语、表语或同位语',
      ['主语从句：What he said is true. / That he passed is certain.', '宾语从句：I know that he is honest.（that可省略）', '表语从句：The problem is that we lack money.', '同位语从句：The news that he won excited everyone.（解释news内容）'],
      [],
      ['Whether he comes doesn\'t matter.（主语从句）', 'I wonder if she will join us.（宾语从句）']
    ));
  await sn('ENG-04-002', '定语从句', 'Relative Clauses', 'eng', D, '高中', 2, 2, 'list',
    '定语从句修饰名词或代词，由关系代词(who/whom/which/that)或关系副词(where/when/why)引导。',
    buildContent('定语从句修饰先行词，由关系词引导',
      ['关系代词：which(物), that(人/物), who/whom(人)', '关系副词：where(地点), when(时间), why(原因)', '限制性 vs 非限制性：非限制性用逗号隔开，that不可引导非限制性', '介词+which：the house in which I live'],
      [],
      ['The book that/which I bought is interesting.（限制性定语从句）', 'Beijing, where I was born, is a great city.（非限制性定语从句）']
    ));
  await sn('ENG-04-003', '状语从句', 'Adverbial Clauses', 'eng', D, '高中', 2, 3, 'list',
    '状语从句在句中作状语，表示时间、地点、原因、条件、目的、结果、让步等。',
    buildContent('状语从句修饰动词、形容词或整个句子，表示各种逻辑关系',
      ['时间：when, while, as, before, after, until, as soon as', '条件：if, unless, provided that, as long as', '原因：because, since, as, now that', '让步：although, though, even if, no matter how', '结果：so...that..., such...that...'],
      [],
      ['Although it was raining, we continued walking.（让步状语从句）', 'He worked so hard that he passed the exam.（结果状语从句）']
    ));
  await sn('ENG-04-004', '省略结构', 'Ellipsis', 'eng', D, '高中', 2, 4, 'list',
    '某些情况下可以省略句子中的某些成分而不影响理解。',
    buildContent('在特定结构中省略某些成分使语言简洁',
      ['状语从句中：when(being) young, if possible, while walking', '比较句中：than I (do), as big as he (is)', '宾语从句中：I think (that)... that常省略', '不定式中：too...to..., enough to (省略to)'],
      [],
      ['He is taller than I (am).（比较从句省略）', 'Try to finish your homework before you leave.（before you leave中主语与主句一致时可省略]
    ));
  await sn('ENG-04-005', '从句综合', 'Clause Comprehensive', 'eng', D, '高中', 2, 5, 'list',
    '综合运用各类从句分析复杂句子结构。',
    buildContent('综合运用名词性从句、定语从句、状语从句分析长难句',
      ['识别从句类型：看从句在句中的作用', '多层嵌套从句的拆解方法', '长难句分析：找主干→析从句→理逻辑', '写作中合理运用从句提升表达水平'],
      [],
      ['The fact that he succeeded surprised everyone.（同位语从句+主句）', 'I know the boy who lives next door.（宾语从句+定语从句）']
    ));
}

// Domain 5: 阅读与写作
async function seedEng05() {
  const D = '阅读与写作';
  await sn('ENG-05-001', '主旨大意', 'Main Idea', 'eng', D, '高中', 3, 1, 'list',
    '主旨大意题要求把握文章的中心思想，通常出现在段首、段尾或通过归纳得出。',
    buildContent('主旨大意是文章的核心思想和中心论点',
      ['首段/末段往往点明主旨', '主题句(topic sentence)通常在段落开头', '高频词汇往往暗示文章主题', '排除细节描述和举例内容'],
      [],
      ['What is the main idea of the passage?（主旨题）', 'Which best summarizes the text?（概括题）']
    ));
  await sn('ENG-05-002', '细节理解', 'Detail Comprehension', 'eng', D, '高中', 2, 2, 'list',
    '细节理解题考查对文章中具体信息的查找和理解能力。',
    buildContent('细节题需要在原文中找到对应信息并准确理解',
      ['定位关键词：人名、地名、数字、专有名词', '同义替换：答案常用原文的同义词或 paraphrase', '注意否定词和转折词(a but, however, although)', '排除干扰项：偷换概念、过度推断、无中生有'],
      [],
      ['According to the passage, when did the event happen?（细节题）', 'What does the word "it" refer to?（指代题）']
    ));
  await sn('ENG-05-003', '推理判断', 'Inference', 'eng', D, '高中', 3, 3, 'list',
    '推理判断题需要根据文章信息进行合理推断，不能脱离文本。',
    buildContent('基于原文信息进行逻辑推理，得出隐含结论',
      ['作者态度题：positive/negative/neutral/objective', '推断作者意图：inform/persuade/entertain/criticize', '根据上下文推断词义', '推断事件因果关系和发展趋势'],
      [],
      ['What can be inferred from the passage?（推理题）', 'The author\'s attitude towards... is ___.（态度题）']
    ));
  await sn('ENG-05-004', '写作技巧', 'Writing Skills', 'eng', D, '高中', 3, 4, 'list',
    '英语写作需要结构清晰、语言准确、逻辑连贯。',
    buildContent('英语写作的基本技巧和策略',
      ['三段式结构：引言(Introduction)+正文(Body)+结论(Conclusion)', '使用连接词：first, moreover, however, therefore, in conclusion', '句式多样化：简单句+复合句+非谓语结构', '避免重复：使用同义词替换'],
      [],
      ['Write an essay about your favorite hobby.（话题作文）', 'Write a letter to your friend inviting him to...（应用文）']
    ));
  await sn('ENG-05-005', '常见写作文体', 'Common Writing Types', 'eng', D, '高中', 3, 5, 'list',
    '高考英语常见文体：记叙文、议论文、说明文、应用文。',
    buildContent('不同文体有不同的写作要求和格式',
      ['记叙文：按时间顺序叙述事件，注意时态一致', '议论文：提出观点→论证→结论，使用论据支持', '说明文：客观说明事物特征、功能、原理', '应用文：书信、通知、邮件等，注意格式和用语'],
      [],
      ['Dear Tom, I\'m writing to invite you to...（邀请信开头）', 'In my opinion, ... / I firmly believe that...（议论文开头）']
    ));
}

// Domain 6: 语法综合
async function seedEng06() {
  const D = '语法综合';
  await sn('ENG-06-001', '语法填空', 'Grammar Cloze', 'eng', D, '高中', 3, 1, 'list',
    '语法填空题考查在语境中运用语法知识的能力。',
    buildContent('语法填空需要在语境中准确判断词形变化和语法结构',
      ['动词题：时态、语态、非谓语', '名词题：单复数、所有格', '形容词/副词题：比较级、词性转换', '冠词题：a/an/the/零冠词', '代词题：人称、物主、反身'],
      [],
      ['The (beautiful) flower smells sweet. → beautiful（形容词修饰名词）', 'She (go) to school every day. → goes（一般现在时第三人称单数）']
    ));
  await sn('ENG-06-002', '短文改错', 'Error Correction', 'eng', D, '高中', 3, 2, 'list',
    '短文改错考查发现并纠正语法错误的能力。',
    buildContent('短文改错常见的错误类型',
      ['时态错误：现在/过去/完成时混淆', '主谓不一致：单复数错误', '冠词误用：多余或缺少冠词', '介词搭配错误：in/on/at用法不当', '代词指代不清或形式错误'],
      [],
      ['He don\'t like apples. → doesn\'t（主谓一致）', 'I have been there since last year. → since改为for（since+时间点, for+时间段）']
    ));
  await sn('ENG-06-003', '完形填空技巧', 'Cloze Test Skills', 'eng', D, '高中', 3, 3, 'list',
    '完形填空需要在语境中选择最合适的词语，考查词汇和语法综合运用。',
    buildContent('完形填空需要结合上下文语境选择最佳选项',
      ['先通读全文把握主旨', '注意上下文的逻辑关系（因果、转折、递进）', '关注固定搭配和习惯用语', '注意词义辨析和语境含义'],
      [],
      ['The boy was ______, but he didn\'t give up.（but表转折→frustrated/tired等）', 'She was ______ happy when she heard the news.（very/extremely修饰形容词）']
    ));
  await sn('ENG-06-004', '固定搭配与短语', 'Fixed Phrases', 'eng', D, '高中', 2, 4, 'list',
    '英语中有大量固定搭配和短语动词，需要记忆和积累。',
    buildContent('固定搭配和短语动词是英语表达的重要组成部分',
      ['动词+介词：look after, depend on, refer to', '动词+副词：give up, turn off, put on', '形容词+介词：be afraid of, be interested in', '名词+介词：in front of, on behalf of'],
      [],
      ['I look forward to hearing from you.（固定搭配）', 'She gave up smoking last year.（动词+副词）']
    ));
  await sn('ENG-06-005', '易混语法辨析', 'Common Grammar Confusions', 'eng', D, '高中', 3, 5, 'list',
    '英语中有些语法点容易混淆，需要仔细辨析。',
    buildContent('易混淆语法点的辨析',
      ['say vs tell vs speak vs talk：say(说内容), tell(告诉), speak(讲语言), talk(交谈)', 'already vs yet vs still：already(已完成), yet(尚未, 疑问否定), still(仍然)', 'rise vs raise：rise(不及物), raise(及物)', 'accept vs receive：accept(接受, 主观), receive(收到, 客观)'],
      [],
      ['He said that he would come.（say+that从句）', 'Please tell me the truth.（tell+间接宾语+直接宾语）']
    ));
}

async function main() {
  const before = await prisma.knowledgeNode.count({ where: { subject: 'eng' } });
  console.log(`迁移前英语节点数: ${before}`);
  await seedEng01();
  await seedEng02();
  await seedEng03();
  await seedEng04();
  await seedEng05();
  await seedEng06();
  // Relations within each domain
  const domains = ['词法与构词', '动词时态与语态', '句法', '从句', '阅读与写作', '语法综合'];
  for (let d = 0; d < domains.length; d++) {
    for (let i = 1; i < 5; i++) {
      const from = `ENG-0${d+1}-${String(i).padStart(3,'0')}`;
      const to = `ENG-0${d+1}-${String(i+1).padStart(3,'0')}`;
      await sr(from, to, 'prerequisite', i);
    }
  }
  const after = await prisma.knowledgeNode.count({ where: { subject: 'eng' } });
  console.log(`迁移完成: ${after} 节点`);
}
main().catch(e => { console.error('❌ 迁移失败:', e); process.exit(1); }).finally(() => prisma.$disconnect());
