/**
 * 📊 英语句法与从句 — 句子结构、各类从句与非谓语动词
 * 人教版教材同步 + 拓展 + 考点
 */
import { sn, sr, richContent } from '../helpers.js';

export async function seedEnglishSyntaxDomain() {
  console.log('  → 句法与从句');

  // ===================================================================
  // ENG-04-001 句子成分与结构
  // ===================================================================
  await sn('ENG-04-001', '句子成分与结构', '五大基本句型与句子成分分析', 'eng', '句法与从句', '高中', 3, 100, null,
    '掌握英语句子的基本成分和五大基本句型，为复杂句分析打下基础',
    richContent(
      '英语句子由不同成分构成：主语（S）、谓语（V）、宾语（O）、表语（C）、定语（Attr）、状语（Adv）、补语（OC）。五大基本句型是所有英语句子的根基——任何一个复杂的句子都可以简化到这五种结构之一。',
      [
        '句型一：SV（主谓）— Birds fly. / The sun rises in the east.',
        '句型二：SVO（主谓宾）— I love music. / She bought a book.',
        '句型三：SVC（主系表）— He is tall. / The soup tastes delicious.',
        '句型四：SVOO（主谓双宾）— He gave me a gift. / She told us the news.',
        '句型五：SVOC（主谓宾宾补）— We made him captain. / I found the book interesting.',
        '句子成分识别：主语是动作发出者，谓语是动作本身，宾语是动作承受者',
        '定语修饰名词（the tall boy），状语修饰动词/形容词/整个句子（He runs fast）',
        '同位语对名词补充说明（Mr. Smith, our teacher, is kind）',
        '插入语独立于句子结构（However, to be honest, I disagree）',
        '句子的扩展方式：并列句（and/but/or）+ 复合句（从句）+ 修饰语',
      ],
      ['She dances. (SV)', 'He gave her a ring. (SVOO)', 'I found the exam easy. (SVOC)'],
      [
        { title: '例1', question: '分析句子成分：She told him the truth yesterday morning.',
          steps: ['主语：She', '谓语：told', '间接宾语：him', '直接宾语：the truth', '状语：yesterday morning'],
          answer: 'SVOO（主谓双宾）结构，句末附带时间状语' },
        { title: '例2', question: '判断句型并说明理由：The story made everyone laugh.',
          steps: ['主语：The story', '谓语：made', '宾语：everyone', '宾补：laugh（省to不定式作补足语）', '句型：SVOC（主语+谓语+宾语+宾补）'],
          answer: 'SVOC——everyone是宾语，laugh补充说明宾语的行为' },
      ],
      '句子成分分析是阅读理解长难句的基础。高考阅读中出现的长句通常是由多种修饰成分叠加而成的复杂句。',
      ['1. 先找到谓语动词（一个分句只有一个谓语动词）', '2. 根据动词类型判断句型（及物/不及物/系动词）', '3. 定语和状语都是"锦上添花"，去掉后句子主干不变'],
      [
        { mistake: '分不清双宾语和宾语+宾补', correct: 'SVOO"给了他一个礼物"→He gave him a gift; SVOC"让他做了这件事"→He made him do it（宾补表行为）' },
        { mistake: '把定语当谓语', correct: '"The book bought is interesting."中bought是定语修饰book，is是谓语' },
      ],
      '英语句法分析就像解构一个建筑——先认清主梁（主谓宾），再看装饰（定状补）。掌握了这个分析方法，再长的句子也能读懂。'
    )
  );

  // ===================================================================
  // ENG-04-002 定语从句
  // ===================================================================
  await sn('ENG-04-002', '定语从句', '关系代词与关系副词引导的定语从句', 'eng', '句法与从句', '高中', 4, 110, null,
    '掌握定语从句中关系词的选择规则和限制性/非限制性的区别',
    richContent(
      '定语从句（Attributive Clause）是放在名词后面对其进行修饰的句子，由关系代词（who/whom/whose/which/that）或关系副词（when/where/why）引导。定语从句是英语中最重要也是使用频率最高的一类从句，贯穿从初中到高考的整个英语学习过程。',
      [
        '关系代词选择规则：who/whom(人), which(物), that(人+物), whose(所属关系)',
        '前置词为"人"时：主语用who/that，宾语用whom/who/that，所属用whose',
        '前置词为"物"时：主语用which/that，宾语用which/that，所属用whose/of which',
        '关系副词：when(先行词为时间), where(先行词为地点), why(先行词为reason)',
        '限制性定语从句：紧跟在先行词后，去掉后意思不完整（无逗号）',
        '非限制性定语从句：用逗号隔开，去掉后主句意思仍然完整（不能用that）',
        '"介词+关系词"结构：The man to whom you spoke ... / The house in which I live ...',
        '只用that的情况：先行词含序数词、最高级、不定代词、人和物共存',
        '只用which的情况：非限制性定语从句、介词之后',
        'as引导定语从句：the same...as, such...as, as we all know',
      ],
      ['The boy who is standing there is my brother.（限制性，who作主语）', 'I visited Beijing, which is the capital of China.（非限制性，which代表Beijing）'],
      [
        { title: '例1', question: '用适当的关系词填空：Do you know the man ___ car was stolen yesterday?',
          steps: ['先行词是the man（人）', 'car和man是所属关系→man\'s car', '所属关系的关系词用whose'],
          answer: 'whose' },
        { title: '例2', question: '判断能否用that替换：He passed the exam, ___ made his parents happy.',
          steps: ['逗号后的从句是非限制性定语从句', '非限制性定语从句不能用that引导', '只能用which'],
          answer: '不能替换。必须用which（非限制性定语从句不能用that）' },
      ],
      '定语从句是高考语法填空和短文改错的必考内容。每年全国卷中定语从句相关内容至少出现2-3题。',
      ['1. 先判断先行词是人还是物', '2. 再看关系词在从句中的成分（主/宾/定/状）', '3. 最后看是否有限制性/非限制性的特殊要求'],
      [
        { mistake: '非限制性从句中误用that', correct: '非限制性定语从句只能用which/who/whom，绝不能用that' },
        { mistake: '介词后使用that/who', correct: '介词后用whom（人）或which（物），不用that/who：The man with whom...' },
      ],
      '定语从句的本质是将两个有关联的句子合并成一个。"I know the boy + The boy won the prize"→"I know the boy who won the prize."'
    )
  );

  // ===================================================================
  // ENG-04-003 名词性从句
  // ===================================================================
  await sn('ENG-04-003', '名词性从句', '主语/宾语/表语/同位语从句', 'eng', '句法与从句', '高中', 4, 120, null,
    '掌握名词性从句的四大类型及其引导词的用法区别',
    richContent(
      '名词性从句（Noun Clauses）是在句子中充当名词功能的从句，包括主语从句、宾语从句、表语从句和同位语从句。它们在句中分别充当主语、宾语、表语和同位语。涉及的重要语法点包括引导词选择、语序（陈述语序）和时态呼应。',
      [
        '主语从句（在句中作主语）：That he passed the exam is true. / Whether we go matters little.',
        '宾语从句（在句中作宾语）：I think (that) he is right. / I wonder if/whether he will come.',
        '表语从句（系动词后作表语）：The problem is that we lack experience. / That\'s what I want to say.',
        '同位语从句（解释名词的内容）：The news that our team won is exciting. / I have no idea when he will arrive.',
        '引导词分类：that(无含义), if/whether(是否), 疑问词(who/what/which/where/when/why/how)',
        'that在宾语从句中可省略，其他从句中不可省略',
        'whether和if区别：whether可用于所有名词性从句，if仅用于宾语从句；whether可与or not连用，if不能',
        '疑问词引导的从句：保持陈述语序"主语+谓语"（不用疑问句倒装）',
        'it作形式主语/宾语代替名词性从句：It is important that... / I find it necessary that...',
        '时态呼应：主句为过去时，从句也需用相应的过去时（但客观真理用一般现在时）',
      ],
      ['What he said is not true.（主语从句）', 'I know that he is honest.（宾语从句）', 'The truth is that we were wrong.（表语从句）'],
      [
        { title: '例1', question: '填空并判断从句类型：___ he will come or not is still unknown.',
          steps: ['空格引导的从句在句中作主语→主语从句', '"是否"用whether（主语从句不能用if）', '有or not → 必须用whether'],
          answer: 'Whether（主语从句）' },
        { title: '例2', question: '改正语序错误：I don\'t know what did he say.',
          steps: ['宾语从句需用陈述语序', '"what did he say"是疑问语序', '改为陈述语序：what he said'],
          answer: 'I don\'t know what he said.' },
      ],
      '名词性从句是高考英语综合能力的重要考查点。特别关注what引导的名词性从句（what = the thing that）。',
      ['1. 判断从句在句中的语法功能（主/宾/表/同位）', '2. 选择引导词（关注that/whether/疑问词）', '3. 检查语序（永远是陈述语序）'],
      [
        { mistake: '主语从句用if代替whether', correct: '主语从句只能用whether：Whether he comes...（√）, If he comes...（×）' },
        { mistake: '同位语从句和定语从句混淆', correct: '同位语从句that在从句中不作成分，解释名词的内容；定语从句that在从句中充当成分' },
      ],
      '名词性从句的掌握是英语水平的"分水岭"。初中阶段只学宾语从句，高中阶段全面扩展到其他三种。掌握后就能灵活表达复杂思想。'
    )
  );

  // ===================================================================
  // ENG-04-004 状语从句
  // ===================================================================
  await sn('ENG-04-004', '状语从句', '时间/条件/原因/目的/结果/让步/比较/地点状语从句', 'eng', '句法与从句', '高中', 4, 130, null,
    '掌握九类状语从句的引导词和使用注意事项',
    richContent(
      '状语从句（Adverbial Clauses）在句中作状语，修饰主句动词或整个句子。按功能分为九种：时间、条件、原因、目的、结果、让步、比较、地点、方式。每种都有其特定的引导词和用法特征。状语从句与主句之间用从属连词连接。',
      [
        '时间状语从句：when, while, as, before, after, until, since, as soon as, once—注意时态"主将从现"',
        '条件状语从句：if, unless (=if not), as long as, provided that—同样遵循"主将从现"',
        '原因状语从句：because, since, as (语气递减), now that (既然)—注意because不能与so同时使用',
        '目的状语从句：so that, in order that (为了一般目的)；in case (以防)—从句常用may/might/can/could',
        '结果状语从句：so...that, such...that—注意 so + 形容词/副词 vs such + 名词',
        '让步状语从句：though/although(虽然), even if/even though(即使), no matter + wh-/wh-ever',
        '比较状语从句：as...as, not so/as...as, than, the + 比较级 + the + 比较级',
        '地点状语从句：where, wherever—Where there is a will, there is a way.',
        '方式状语从句：as（按照）, as if/as though（好像）—as if从句可用虚拟语气',
      ],
      ['I\'ll call you when I arrive. (时间)", "If it rains tomorrow, we\'ll stay at home. (条件), "He studies hard so that he can get a scholarship. (目的)'],
      [
        { title: '例1', question: '用though/although或because/so填空并说明理由：___ it rained heavily, he still went out.',
          steps: ['后半句"仍然出去"和"倾盆大雨"是让步关系', '让步状语从句用though/although', '不能用because（因果关系）也不能用but（though和but不能连用）'],
          answer: 'Though/Although it rained heavily, he still went out. (让步状语从句)' },
        { title: '例2', question: '完成"主将从现"练习：If she ___ (come) tomorrow, I ___ (tell) her the truth.',
          steps: ['条件状语从句中将来时用一般现在时代替', 'come用一般现在时（三单变化→comes）', '主句用一般将来时→will tell'],
          answer: 'If she comes tomorrow, I will tell her the truth.' },
      ],
      '状语从句在写作中至关重要。灵活运用多种状语从句可以让文章逻辑关系更清晰，句式更丰富。',
      ['1. 判断主从句的逻辑关系（时间/条件/因果等）', '2. 选择正确的引导词', '3. 注意"主将从现"和连词成对出现的问题（because/so不能共存, although/but不能共存）'],
      [
        { mistake: 'because 和 so 连用', correct: '"Because he is ill, so he is absent." → 去掉because或去掉so，二选一' },
        { mistake: '时间/条件状语从句中误用将来时', correct: 'I will call you when I will arrive（×）→ I will call you when I arrive（√）' },
      ],
      '汉语没有从句这个概念，所有关系都用逗号表达。而英语用连词把逻辑关系清晰地标记出来。这也是为什么英语句子结构像"一棵树"——有主干，有枝叶。'
    )
  );

  // ===================================================================
  // ENG-04-005 非谓语动词
  // ===================================================================
  await sn('ENG-04-005', '非谓语动词', '动名词/不定式/分词的形式与功能', 'eng', '句法与从句', '高中', 5, 140, null,
    '掌握非谓语动词的三种形式及在句中充当不同成分的用法',
    richContent(
      '非谓语动词（Non-finite Verbs）是在句子中不能独立作谓语的动词形式，包括动名词（doing）、不定式（to do）和分词（doing/done）。它们可以充当主语、宾语、表语、定语、状语和补足语。非谓语动词是英语语法中综合难度最高的板块之一。',
      [
        '不定式（to do）的功能：作主语(To learn English is important)、宾语(I want to go)、定语(I have a book to read)、状语(He came to help)、宾补(I ask him to go)',
        '动名词（doing）的功能：作主语(Reading is fun)、宾语(I enjoy reading)、表语(My hobby is reading)、定语(reading room)',
        '现在分词（doing）的功能：作定语(developing country)、状语(Seeing this, he laughed)、补语(I saw him coming)',
        '过去分词（done）的功能：作定语(developed country)、状语(Exhausted, he lay down)、补语(I had my car repaired)',
        '时态和语态变化：to do(一般主动)/to be done(被动)/to have done(完成)/to have been done(完成被动)；doing/being done/having done/having been done',
        '固定搭配：只能接不定式作宾语：want/decide/refuse/hope/expect/plan/agree/promise',
        '固定搭配：只能接动名词作宾语：enjoy/suggest/finish/avoid/mind/keep/practice/admit',
        '既可接不定式也可接动名词但意义不同的动词：remember/forget/stop/try/regret/go on/mean',
        '感官动词后宾补：see/watch/hear/notice + sb + do(全过程)/doing(正在进行)',
        '独立主格结构：逻辑主语+非谓语(Weather permitting, we\'ll go out.)',
      ],
      ['To see is to believe.（不定式作主语和表语）', 'I enjoy reading novels.（动名词作宾语）', 'The boy sitting there is my brother.（现在分词作定语）'],
      [
        { title: '例1', question: '用括号内动词的非谓语形式填空：I remember ___ (lock) the door, but I can\'t find the key.',
          steps: ['remember + doing 表示"记得做过某事"', 'remember + to do 表示"记得要做某事"', '结合后文"找不到钥匙"→已经做过lock的动作', '用remember locking'],
          answer: 'locking（动名词）' },
        { title: '例2', question: '区分两种形式的含义：I stopped to smoke. / I stopped smoking.',
          steps: ['stopped to smoke：stop后接不定式→停下来(手头的事)去抽烟', 'stopped smoking：stop后接动名词→停止抽烟(再也不抽了)', '动词+不定式 vs 动词+动名词 meaning differ'],
          answer: 'stopped to smoke = 停下来去抽烟；stopped smoking = 戒烟' },
      ],
      '非谓语动词是高考试卷中覆盖面最广的语法点。语法填空必考（1-2题），写作中使用非谓语动词也是高分标配。',
      ['1. 区分非谓语在句中作什么成分', '2. 判断主被动关系（逻辑主语与非谓语的关系）', '3. 记忆固定搭配（哪些动词后接doing，哪些接to do）'],
      [
        { mistake: '非谓语动词缺少自己的逻辑主语', correct: '"Seeing from the hill, the city is beautiful."→逻辑主语错误。应为"Seen from the hill, the city is beautiful."或"Looking from the hill, I..."' },
        { mistake: '混淆现在分词和动名词作定语', correct: 'a sleeping bag(动名词, 用途=用于睡)→a sleeping boy(分词, 状态=正在睡的)' },
      ],
      '非谓语动词是英语是"形态语言"的集中体现——动词通过不同形式承担不同语法功能。掌握了非谓语动词，你就掌握了英语句法的半壁江山。'
    )
  );

  // ===================================================================
  // 建立知识点之间的关系
  // ===================================================================
  console.log('  → 建立关系...');
  await sr('ENG-04-001', 'ENG-04-002', 'prerequisite', 100);
  await sr('ENG-04-001', 'ENG-04-003', 'prerequisite', 100);
  await sr('ENG-04-001', 'ENG-04-004', 'prerequisite', 100);
  await sr('ENG-04-001', 'ENG-04-005', 'prerequisite', 100);
  await sr('ENG-04-002', 'ENG-04-003', 'supports', 100);
  await sr('ENG-04-003', 'ENG-04-004', 'supports', 100);
  await sr('ENG-04-005', 'ENG-04-002', 'supports', 100);
  await sr('ENG-04-005', 'ENG-04-003', 'supports', 100);

  console.log('  ✓ 句法与从句种子完成');
}
