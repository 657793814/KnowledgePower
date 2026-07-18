/**
 * 💻 数据库
 * 关系数据模型、SQL基础、单表多表查询、事务ACID、范式理论
 */
import { sn, sr, richContent } from '../helpers.js';

export async function seedCSDatabaseDomain() {
  console.log('  → 数据库');

  // ===================================================================
  // CMP-06-001 关系数据模型
  // ===================================================================
  await sn('CMP-06-001', '关系数据模型', '二维表与关系操作', 'cs', '数据库', '大学', 2, 100, null,
    '掌握关系数据模型的基本概念、关系操作和完整性约束',
    richContent(
      '关系数据模型是当前最主流的数据库模型，由E.F. Codd于1970年提出。关系模型用二维表（即关系）表示数据及其联系。表由行（元组/记录）和列（属性/字段）组成。候选键是可以唯一标识元组的属性集，主键（Primary Key）是选中的一个候选键。外键（Foreign Key）引用另一张表的主键，实现表间关联。完整性约束包括：实体完整性（主键不为空且唯一）、参照完整性（外键要么为空要么引用有效的主键）、用户自定义完整性。关系操作包括选择（σ）、投影（π）、连接（⨝）等。',
      [
        '关系 = 二维表  元组 = 行  属性 = 列',
        '度（Degree）：属性的个数；基数（Cardinality）：元组的个数',
        '候选键：能唯一标识元组的最小属性集',
        '主键：选中的一个候选键（NOT NULL + UNIQUE）',
        '外键：引用另一表主键的属性（维护表间引用完整性）',
        '实体完整性：主键非空且唯一',
        '参照完整性：外键值必须是被引用表中存在的主键值或NULL',
        '关系操作：σ选择（行筛选）、π投影（列筛选）、⋈连接（表关联）',
      ],
      ['关系代数符号：', 'σ_{条件}(R) — 从关系R中选择满足条件的元组', 'π_{列1,列2}(R) — 从关系R中投影指定列', 'R ⋈_{条件} S — R和S按条件连接'],
      [
        { title: '例1', question: '学生表Student(sid, name, age, dept)中sid是主键。如果插入一条sid为NULL的记录，违反了哪项完整性约束？',
          steps: ['主键不能为NULL → 实体完整性', '如果插入另一个已有相同sid → 唯一性约束（也是实体完整性的一部分）'],
          answer: '违反了实体完整性约束' },
        { title: '例2', question: '表A有外键fk引用表B的主键。如果删除表B中被引用的记录，应该如何处理？',
          steps: ['方法1：RESTRICT — 禁止删除', '方法2：CASCADE — 级联删除A中相关记录', '方法3：SET NULL — 将A中的外键值设为NULL', '方法4：NO ACTION — 不检查（不推荐）'],
          answer: '根据业务需求选择RESTRICT、CASCADE或SET NULL' },
      ],
      '面试常考：关系模型的基本术语（关系/元组/属性等）、键的概念、完整性约束、关系代数操作。RESTRICT/CASCADE/NOSET在删除时的行为也要区分。',
      ['1. 关系=表，元组=行，属性=列', '2. 主键=唯一标识（非空且唯一）', '3. 外键=表间引用（维护参照完整性）', '4. 实体完整性=主键约束；参照完整性=外键约束'],
      [
        { mistake: '混淆候选键和主键', correct: '候选键是唯一标识的所有可能选择，主键是其中被选中的一个。一个表可以有多个候选键，但只有一个主键' },
        { mistake: '认为外键必须与被引用表的主键同名', correct: '外键可以和被引用的主键不同名，只要数据类型相同、引用关系正确即可' },
      ],
      '关系模型革命性地将数据与结构分离——用户只需要声明"要什么"（用SQL），而不需要关心"怎么找"（物理存储和访问路径由DBMS自动优化）。这大大降低了数据管理复杂度。',
      '关系模型就像Excel表格——每个工作表（表）由行（记录）和列（字段）组成。多个工作表之间通过"员工ID"这样的关键列相互关联（外键），这就是关系数据库的核心。'
    )
  );

  // ===================================================================
  // CMP-06-002 SQL基础
  // ===================================================================
  await sn('CMP-06-002', 'SQL基础', 'DDL与DML', 'cs', '数据库', '大学', 2, 110, null,
    '掌握SQL的分类、DDL建表语句和DML增删改查操作',
    richContent(
      'SQL（结构化查询语言）是关系数据库的标准操作语言。SQL按功能分为：DDL（数据定义语言）、DML（数据操作语言）、DQL（数据查询语言，常归入DML）、DCL（数据控制语言）。DDL包括CREATE（创建表/数据库）、ALTER（修改表结构）、DROP（删除表/数据库）。DML包括INSERT（插入数据）、UPDATE（更新数据）、DELETE（删除数据）。SELECT是最核心的查询语句。约束条件：PRIMARY KEY、FOREIGN KEY、UNIQUE、NOT NULL、CHECK、DEFAULT。',
      [
        'DDL（数据定义）：CREATE、ALTER、DROP、TRUNCATE',
        'DML（数据操作）：INSERT、UPDATE、DELETE',
        'DQL（数据查询）：SELECT（最核心、最复杂）',
        'DCL（数据控制）：GRANT、REVOKE（权限管理）',
        'CREATE TABLE：定义列名、数据类型、约束',
        'ALTER TABLE：ADD/DROP/MODIFY列',
        'INSERT INTO 表 VALUES (...)  — 插入一条记录',
        'UPDATE 表 SET 列=值 WHERE 条件 — 更新记录',
        'DELETE FROM 表 WHERE 条件 — 删除记录',
      ],
      ['CREATE TABLE Student (', '  sid INT PRIMARY KEY,', '  name VARCHAR(50) NOT NULL,', '  age INT CHECK(age > 0),', '  dept VARCHAR(30) DEFAULT \'CS\'', ');'],
      [
        { title: '例1', question: '写出以下DDL语句：创建课程表Course(cid主键, cname非空, credits默认3)。',
          steps: ['CREATE TABLE Course (', '  cid INT PRIMARY KEY,', '  cname VARCHAR(100) NOT NULL,', '  credits INT DEFAULT 3', ');'],
          answer: '见SQL语句' },
        { title: '例2', question: '写出向Student表插入一条记录，然后将年龄更新为20的SQL。',
          steps: ['INSERT INTO Student(sid, name, age) VALUES (1, \'张三\', 18);', 'UPDATE Student SET age = 20 WHERE sid = 1;', '也可合并：先UPDATE再……但这是两步操作'],
          answer: 'INSERT→UPDATE' },
      ],
      '面试必考：手写SQL是最基础的能力要求。常考建表语句（含约束）、INSERT/SELECT/UPDATE/DELETE的基本写法。注意DELETE和TRUNCATE的区别。',
      ['1. DDL改结构（表/库），DML改数据（行）', '2. INSERT全字段可省略列名，否则需指定列名', '3. UPDATE/DELETE务必加WHERE（否则全表更新/删除！）', '4. DELETE逐行删除可回滚，TRUNCATE直接重置表不可回滚'],
      [
        { mistake: 'UPDATE或DELETE忘记加WHERE', correct: '不加WHERE会操作全表数据！这是最常见最严重的新手错误。养成习惯：先写WHERE再写UPDATE/DELETE' },
        { mistake: '混淆DELETE和DROP', correct: 'DELETE删除数据（表还在）；DROP删除整个表（结构和数据都没有）' },
      ],
      'SQL是一种"声明式"语言——你告诉数据库"想要什么"（SELECT什么FROM哪里WHERE条件），数据库自己决定"怎么找到"（索引、连接算法等）。这与过程式语言（C/Java）的思维方式完全不同。',
      'SQL就像在餐厅点菜——你对服务员说（SELECT）我要吃（FROM）你们的菜单上（WHERE）包含鸡肉的菜。你不需要关心厨房怎么做（数据库的执行计划），只管吃上就行。'
    )
  );

  // ===================================================================
  // CMP-06-003 单表查询与多表连接
  // ===================================================================
  await sn('CMP-06-003', '单表查询与多表连接', 'SELECT语句的核心用法', 'cs', '数据库', '大学', 3, 120, null,
    '掌握SELECT单表查询和JOIN多表连接的各种用法',
    richContent(
      'SELECT是SQL中最核心的查询语句。单表查询子句顺序：SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT。聚合函数：COUNT（计数）、SUM（求和）、AVG（平均）、MAX（最大）、MIN（最小）。GROUP BY分组查询常配合聚合函数使用。HAVING用于对分组结果进行过滤（WHERE不能使用聚合函数）。多表连接：INNER JOIN（内连接，只返回匹配的行）、LEFT JOIN（左连接，返回左表所有行）、RIGHT JOIN（右连接，返回右表所有行）、FULL OUTER JOIN（全外连接，返回两表所有行）。',
      [
        'WHERE：行级过滤（不能使用聚合函数）',
        'GROUP BY：按指定列分组，配合聚合函数使用',
        'HAVING：组级过滤（可以使用聚合函数）',
        'ORDER BY：排序（ASC升序/DESC降序）',
        'LIMIT：限制返回行数（MySQL）或TOP（SQL Server）/ROWNUM（Oracle）',
        'INNER JOIN：只返回两表都匹配的行',
        'LEFT JOIN：返回左表所有行，右表无匹配则为NULL',
        'JOIN关联条件：ON（推荐）或 WHERE',
      ],
      ['SELECT执行顺序：', 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT', '', '多表连接语法：', 'SELECT * FROM A INNER JOIN B ON A.id = B.aid'],
      [
        { title: '例1', question: '查询每个部门的学生人数，并筛选出人数大于2的部门，按人数降序排列。',
          steps: ['SELECT dept, COUNT(*) as cnt', 'FROM Student', 'GROUP BY dept', 'HAVING COUNT(*) > 2', 'ORDER BY cnt DESC;'],
          answer: '见SQL' },
        { title: '例2', question: '有Student(sid,name,dept)和Score(sid,course,score)两张表，查询每个学生的姓名和平均分。',
          steps: ['SELECT s.name, AVG(sc.score) as avg_score', 'FROM Student s', 'INNER JOIN Score sc ON s.sid = sc.sid', 'GROUP BY s.sid, s.name;'],
          answer: 'INNER JOIN + GROUP BY' },
      ],
      '面试必考手写SQL！多表连接（JOIN）、分组聚合（GROUP BY + HAVING）、子查询是最高频考点。理解SQL各子句的执行顺序对正确编写查询至关重要。',
      ['1. 理解执行顺序：FROM→WHERE→GROUP BY→HAVING→SELECT→ORDER BY→LIMIT', '2. WHERE在分组前过滤行，HAVING在分组后过滤组', '3. JOIN时注意驱动表和ON条件', '4. COUNT(列名)不统计NULL，COUNT(*)统计所有行'],
      [
        { mistake: 'WHERE中使用聚合函数', correct: 'WHERE不能使用聚合函数（如 COUNT(*) > 2），要用 HAVING 来过滤分组后的结果' },
        { mistake: 'LEFT JOIN后误用WHERE条件过滤右表', correct: 'LEFT JOIN后用WHERE条件过滤右表，会把右表为NULL的行也过滤掉——相当于变成了INNER JOIN。右表条件应写在ON中' },
      ],
      'SQL查询的威力在于它允许你通过简洁的语句完成复杂的数据关联和统计分析。JOIN是实现数据关联的核心——它将ER模型中分散到不同表的"事实"重新组合在一起。',
      'JOIN就像玩拼图——一张拼图（表A）中的每块碎片（行）需要找到另一张拼图（表B）中对应的碎片。INNER JOIN只找能完美对接的碎片；LEFT JOIN保证左边的所有碎片都能留在拼图中，右边有就拼上、没有就留空位。'
    )
  );

  // ===================================================================
  // CMP-06-004 事务与ACID
  // ===================================================================
  await sn('CMP-06-004', '事务与ACID', '数据库并发控制的基础', 'cs', '数据库', '大学', 3, 130, null,
    '掌握事务的ACID特性、隔离级别和并发问题',
    richContent(
      '事务（Transaction）是数据库执行的一个逻辑工作单元，要么全部成功，要么全部失败。事务的ACID特性：原子性（Atomicity）、一致性（Consistency）、隔离性（Isolation）、持久性（Durability）。并发事务可能产生的问题：脏读（读到未提交的数据）、不可重复读（同一事务两次读同一数据结果不同）、幻读（同一条件两次查询结果集不同）。SQL标准定义了四个隔离级别：READ UNCOMMITTED（最低级，都不防）、READ COMMITTED（防脏读）、REPEATABLE READ（防脏读+不可重复读）、SERIALIZABLE（全部防止，性能最差）。MVCC（多版本并发控制）是实现高并发隔离的常用技术。',
      [
        '原子性（A）：事务要么全部执行成功要么全部回滚——ALL or NOTHING',
        '一致性（C）：事务执行前后数据库保持一致状态（完整性约束不被破坏）',
        '隔离性（I）：并发执行的事务互不干扰',
        '持久性（D）：已提交的事务永久保存到数据库',
        '脏读：读到其他事务未提交的数据',
        '不可重复读：同一事务内两次读取同一数据不一致',
        '幻读：同一事务内两次查询结果集不同（新增/删除行）',
        '隔离级别对比：RU<RC<RR<SERIALIZABLE（安全性递增，性能递减）',
      ],
      ['事务操作：BEGIN / START TRANSACTION — 开始', 'COMMIT — 提交（持久化）', 'ROLLBACK — 回滚（撤销）', '', 'MySQL默认隔离级别：REPEATABLE READ', 'Oracle/PG默认隔离级别：READ COMMITTED'],
      [
        { title: '例1', question: '银行转账：A账户转100元给B账户。请描述事务保证ACID的过程。',
          steps: ['BEGIN', 'UPDATE account SET balance=balance-100 WHERE id=\'A\';', 'UPDATE account SET balance=balance+100 WHERE id=\'B\';', 'COMMIT;', '原子性：两步全部成功或全部回滚', '一致性：转账前后总金额不变', '隔离性：其他事务看不到中间状态', '持久性：COMMIT后数据永久保存'],
          answer: '见步骤' },
        { title: '例2', question: 'MySQL默认的隔离级别是什么？它防止了哪些并发问题？',
          steps: ['MySQL InnoDB默认隔离级别：REPEATABLE READ', '防止了：脏读 + 不可重复读', '但没有完全防止：幻读（InnoDB通过间隙锁/Gap Lock一定程度上防止了幻读）'],
          answer: 'REPEATABLE READ，防脏读+不可重复读' },
      ],
      '面试必考！ACID的理解、隔离级别及各自防止的并发问题、事务的实现方式（Undo Log/Redo Log）。常考：不同隔离级别下会出现的并发问题。',
      ['1. ACID：A=全有或全无、C=一致、I=隔离、D=持久', '2. 隔离级别从低到高：RU→RC→RR→S', '3. 各级别解决的问题：RU全不防、RC防脏读、RR防脏+不可重复、S防全部', '4. MVCC是RR/RC的常用实现机制'],
      [
        { mistake: '混淆不可重复读和幻读', correct: '不可重复读：同一数据行两次读取值不同（其他事务修改了该行）。幻读：两次查询结果集行数不同（其他事务插入/删除了行）' },
        { mistake: '认为隔离级别越高越好', correct: '隔离级别越高并发性能越差。SELECT...FOR UPDATE 会加锁影响并发。根据业务需求选择合适级别' },
      ],
      '事务是数据库保证数据正确性的核心机制。没有事务，银行转账可能在扣款后、存款前崩溃，导致钱凭空消失。Undo Log支持回滚和MVCC，Redo Log确保持久性——数据库崩溃后能恢复。',
      '事务就像一局游戏——要么你完整通关（COMMIT），要么从头再来（ROLLBACK）。不会有"保存到一半停电，存档损坏"的情况。几个人同时玩游戏（并发），游戏系统要确保每个人的操作互不影响（隔离性）。'
    )
  );

  // ===================================================================
  // CMP-06-005 范式理论
  // ===================================================================
  await sn('CMP-06-005', '范式理论', '数据库设计规范化', 'cs', '数据库', '大学', 3, 140, null,
    '掌握第一范式、第二范式、第三范式的定义和规范化过程',
    richContent(
      '范式（Normal Form）是关系数据库设计的规范化标准，用于减少数据冗余和避免更新异常。第一范式（1NF）：每个属性都是不可分割的基本数据项（原子值）；第二范式（2NF）：满足1NF且每个非主属性完全函数依赖于候选键；第三范式（3NF）：满足2NF且每个非主属性不传递依赖于候选键。函数依赖是范式理论的核心概念：X→Y表示X能唯一确定Y（Y依赖于X）。BCNF（鲍依斯-科得范式）比3NF更严格：每个决定因素都包含候选键。一般设计达到3NF即可。',
      [
        '1NF（第一范式）：列不可再分（即每列是原子值，不含集合/数组）',
        '2NF（第二范式）：1NF + 非主属性完全依赖于主键（消除部分依赖）',
        '3NF（第三范式）：2NF + 非主属性不传递依赖于主键（消除传递依赖）',
        '函数依赖：X→Y 表示X的值唯一确定Y的值',
        '完全函数依赖：X→Y且X的任意真子集都不能确定Y',
        '部分函数依赖：X的真子集就能确定Y',
        '传递函数依赖：X→Y, Y→Z, 且Y→/→X，则X→Z是传递依赖',
        '范式越高，冗余越少，但查询可能需更多JOIN——需权衡',
      ],
      ['范式递进：1NF → 2NF（消除部分依赖）→ 3NF（消除传递依赖）', '部分依赖判断：主键由多列组成时，某列依赖于主键的一部分', '传递依赖判断：A→B, B→C, 且B不是候选键'],
      [
        { title: '例1', question: '关系R(sid, sname, cid, cname, score)，主键(sid,cid)，判断满足第几范式？',
          steps: ['检查1NF：每个属性都是原子值，满足', '检查2NF：sname依赖于sid（主键的一部分），cname依赖于cid（主键的一部分）——存在部分依赖，不满足2NF', '所以只满足1NF'],
          answer: '1NF' },
        { title: '例2', question: '将上例的关系R规范化为3NF。',
          steps: ['消除部分依赖 → 分解为：', 'Student(sid, sname) 主键sid', 'Course(cid, cname) 主键cid', 'Score(sid, cid, score) 主键(sid,cid)', '检查2NF：每个表的非主属性都完全依赖于主键 ✓', '检查3NF：没有传递依赖 ✓'],
          answer: '分解为Student, Course, Score三张表' },
      ],
      '面试常考：各范式的定义和判断、给定关系判断满足第几范式、规范化分解。重点理解部分依赖和传递依赖的概念。范式的目的是消除冗余和更新异常。',
      ['1. 1NF：列不可分（最基本的）', '2. 2NF：非主属性完全依赖主键（消除部分依赖）', '3. 3NF：非主属性直接依赖主键（消除传递依赖）', '4. 范式分解：投影分解，保证无损连接和保持函数依赖', '5. 实际中一般达到3NF即可，BCNF以上可能损失函数依赖'],
      [
        { mistake: '认为范式越高越好', correct: '范式越高表越多，查询时JOIN越多，性能可能下降。实际应用中有时会保留某些冗余（反范式化）换取查询性能' },
        { mistake: '混淆部分依赖和传递依赖', correct: '部分依赖：A不是主键的子集，但非主属性B依赖于A（当A是复合主键的一部分时）。传递依赖：A→B, B→C，C通过B传递依赖于A' },
      ],
      '范式理论是数据库设计的"语法规则"。它告诉我们什么样的表结构是"好"的——冗余少、更新一致。但现实世界需要权衡——数据仓库和大数据分析中经常主动引入冗余（星型模型）来提高查询性能。',
      '范式就像整理衣柜——1NF是把所有衣服放进衣柜（不分内在外在）；2NF是把上衣和裤子分开挂（按类型）；3NF是进一步把黑白衣服分开（按颜色）。越高越规整，但找衣服时可能要走更多路。'
    )
  );

  // ===================================================================
  // 关系
  // ===================================================================
  await sr('CMP-06-001', 'CMP-06-002', 'prerequisite', 100);   // 关系模型→SQL基础
  await sr('CMP-06-002', 'CMP-06-003', 'prerequisite', 100);   // SQL基础→查询与连接
  await sr('CMP-06-001', 'CMP-06-004', 'prerequisite', 100);   // 关系模型→事务
  await sr('CMP-06-001', 'CMP-06-005', 'prerequisite', 100);   // 关系模型→范式
  await sr('CMP-06-002', 'CMP-06-005', 'reference', 100);      // SQL→范式（主键外键约束）
  await sr('CMP-06-003', 'CMP-06-004', 'reference', 100);      // 多表查询→事务（隔离级别影响查询结果）

  console.log('    ✓ 数据库: 5 节点');
}
