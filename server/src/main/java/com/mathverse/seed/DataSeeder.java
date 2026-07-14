package com.mathverse.seed;

import com.mathverse.common.exception.BusinessException;
import com.mathverse.common.exception.ErrorCode;
import com.mathverse.knowledge.entity.KnowledgeNode;
import com.mathverse.knowledge.entity.KnowledgeRelation;
import com.mathverse.knowledge.service.KnowledgeNodeService;
import com.mathverse.knowledge.service.KnowledgeRelationService;
import com.mathverse.user.entity.User;
import com.mathverse.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final KnowledgeNodeService nodeService;
    private final KnowledgeRelationService relationService;
    private final UserService userService;
    private final DomainExpressionSeeder domainExpressionSeeder;
    private final DomainEquationSeeder domainEquationSeeder;
    private final DomainFunctionSeeder domainFunctionSeeder;
    private final DomainGeometrySeeder domainGeometrySeeder;
    private final DomainCombinatoricsSeeder domainCombinatoricsSeeder;
    private final DomainSequenceSeeder domainSequenceSeeder;
    private final ExamQuestionSeeder examQuestionSeeder;

    @Override
    public void run(String... args) {
        log.info("开始初始化种子数据...");
        seedUsers();
        seedNodes();
        seedRelations();
        domainExpressionSeeder.seed();
        domainEquationSeeder.seed();
        domainFunctionSeeder.seed();
        domainGeometrySeeder.seed();
        domainCombinatoricsSeeder.seed();
        domainSequenceSeeder.seed();
        examQuestionSeeder.seed();
        log.info("种子数据初始化完成！");
    }

    private void seedUsers() {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword("admin123");
        admin.setNickname("管理员");
        admin.setRole("admin");
        userService.save(admin);
        log.info("→ 创建管理员用户");
    }

    private void seedNodes() {
        // ====== 数的世界 ======
        saveNode("MATH-01-001", "自然数", "1, 2, 3, ... 用于计数", "数", "初中", 1, 100, "static",
                "自然数是人类最早认识的数，用于计数物体的个数", """
                {
                    "text": "自然数是人类最早认识的数，用于计数物体的个数。",
                    "sections": [
                        {"type": "definition", "title": "定义", "content": "自然数是从人类计数需求中产生的数：1, 2, 3, 4, ...（有些定义包含 0）"},
                        {"type": "keypoints", "title": "核心要点", "items": [
                            "自然数从 1 开始（部分教材包含 0）",
                            "加法、乘法运算封闭：两个自然数相加或相乘仍得自然数",
                            "减法、除法不封闭：1-2、3÷2 的结果不是自然数"
                        ]},
                        {"type": "keypoints", "title": "质数与合数", "items": [
                            "质数：只有 1 和本身两个因数（如 2, 3, 5, 7, 11, 13）",
                            "合数：有超过两个因数（如 4, 6, 8, 9, 10, 12）",
                            "1：既不是质数也不是合数"
                        ]}
                    ]
                }
                """, null);

        saveNode("MATH-01-002", "整数与负数", "自然数 + 0 + 负整数", "数", "初中", 1, 200, "canvas",
                "整数包括自然数、零和负整数，负数是“相反方向”的数", """
                {
                    "text": "整数包括自然数、零和负整数：...-3, -2, -1, 0, 1, 2, 3...",
                    "sections": [
                        {"type": "definition", "title": "定义", "content": "正整数（自然数）、0、负整数统称为整数"},
                        {"type": "visualization", "title": "直观理解", "content": "正负数可以理解为方向相反的两个量",
                            "visual": {"type": "canvas", "component": "number-line", "config": {"showNegative": true}}},
                        {"type": "keypoints", "title": "核心洞察", "items": [
                            "×1 表示正向（保持方向）",
                            "×(-1) 表示反向（旋转 180°）",
                            "相反数：a 和 -a 互为相反数，在数轴上关于原点对称",
                            "绝对值 |a|：表示 a 到原点的距离"
                        ]},
                        {"type": "analogy", "title": "生活类比", "content": "• 温度：零上 5°C 和零下 5°C\\n• 海拔：海平面以上 100m 和以下 50m\\n• 方向：向东走 3 步和向西走 3 步"}
                    ]
                }
                """, null);

        saveNode("MATH-01-003", "有理数", "可以写成 p/q（q≠0）形式的数", "数", "初中", 2, 300, "static",
                "有理数是可以写成 p/q 形式的数，包括整数、有限小数和无限循环小数", """
                {
                    "text": "有理数是可以写成 p/q（q≠0）形式的数。",
                    "sections": [
                        {"type": "definition", "title": "定义", "content": "有理数 = {x | x = p/q, p∈Z, q∈Z, q≠0}"},
                        {"type": "keypoints", "title": "分类", "items": [
                            "整数：...-2, -1, 0, 1, 2...",
                            "分数：1/2, 3/4, -5/3 ...",
                            "有限小数：0.5, 3.14 ...",
                            "无限循环小数：0.333..., 1.666... ..."
                        ]},
                        {"type": "keypoints", "title": "运算律", "items": [
                            "交换律：a+b=b+a, a×b=b×a",
                            "结合律：(a+b)+c=a+(b+c), (a×b)×c=a×(b×c)",
                            "分配律：a×(b+c)=a×b+a×c"
                        ]}
                    ]
                }
                """, null);

        saveNode("MATH-01-004", "实数", "有理数和无理数的总称", "数", "初中", 2, 400, "canvas",
                "实数包括有理数和无理数，对应数轴上的每一个点", """
                {
                    "text": "实数是数学中最基本的数集，包括有理数和无理数。",
                    "sections": [
                        {"type": "definition", "title": "定义", "content": "实数 = 有理数 ∪ 无理数"},
                        {"type": "keypoints", "title": "无理数", "items": [
                            "无限不循环小数",
                            "常见无理数：π（圆周率）、√2、√3、e（自然常数）",
                            "无理数不能写成 p/q 的形式"
                        ]},
                        {"type": "visualization", "title": "数轴", "content": "每个实数都对应数轴上唯一的一个点，数轴是连续的",
                            "visual": {"type": "canvas", "component": "number-line", "config": {"showIrrational": true}}},
                        {"type": "keypoints", "title": "平方根与立方根", "items": [
                            "√a：a 的平方根，x²=a → x=±√a",
                            "∛a：a 的立方根，x³=a → x=∛a",
                            "负数没有实数平方根（但复数领域有！）"
                        ]}
                    ]
                }
                """, null);

        saveNode("MATH-01-005", "复数入门", "数的最后一次扩张：a+bi", "数", "高中", 3, 500, "canvas",
                "复数 = 实数 + 虚数，形式为 a+bi，在复平面上表示", """
                {
                    "text": "复数是数的领域最后一次大的扩张，形式为 a+bi。",
                    "sections": [
                        {"type": "definition", "title": "定义", "content": "复数 z = a + bi，其中 a=实部(Re)，b=虚部(Im)，i²=-1"},
                        {"type": "visualization", "title": "复平面", "content": "复平面：横轴为实轴(Re)，纵轴为虚轴(Im)，每个复数对应一个点或向量",
                            "visual": {"type": "canvas", "component": "complex-plane", "config": {"showGrid": true, "showPoint": true}}},
                        {"type": "keypoints", "title": "核心洞察", "items": [
                            "×1 = 保持方向（正向）",
                            "×(-1) = 旋转 180°（反向）",
                            "×i = 旋转 90°（打开新维度！）",
                            "i² = -1 意味着：连续旋转两次 90° = 旋转 180°"
                        ]}
                    ]
                }
                """, null);

        // 复数子知识点
        saveNode("MATH-01-005-01", "虚数单位 i", "i² = -1，乘以 i = 旋转 90°", "数", "高中", 3, 510, "canvas",
                "虚数单位 i 是复数系统的核心，满足 i²=-1，乘以 i 相当于逆时针旋转 90°", """
                {
                    "text": "虚数单位 i 是复数系统的核心。",
                    "sections": [
                        {"type": "definition", "title": "定义", "content": "i² = -1，i 不是实数"},
                        {"type": "visualization", "title": "旋转演示", "content": "在复平面上：\\n1 × i = i（旋转 90°）\\ni × i = -1（再旋转 90°）\\n-1 × i = -i（继续旋转 90°）\\n-i × i = 1（旋转 360°，回到起点）",
                            "visual": {"type": "canvas", "component": "complex-rotation", "config": {"steps": [
                                {"label": "1", "vector": [1, 0]},
                                {"label": "1×i=i", "vector": [0, 1]},
                                {"label": "i×i=-1", "vector": [-1, 0]},
                                {"label": "-1×i=-i", "vector": [0, -1]}
                            ]}}},
                        {"type": "keypoints", "title": "i 的幂循环", "items": [
                            "i¹ = i",
                            "i² = -1",
                            "i³ = -i",
                            "i⁴ = 1",
                            "每 4 次一个循环！"
                        ]},
                        {"type": "example", "title": "示例", "items": [
                            {"question": "计算 (3i) × (2i)", "steps": ["(3i)(2i) = 6i²", "i² = -1", "= -6"], "answer": "-6"}
                        ]},
                        {"type": "analogy", "title": "方向类比", "content": "• ×1：向前走（正向）\\n• ×(-1)：向后转（反向）\\n• ×i：向左转 90°（旋转）"}
                    ],
                    "tags": ["复数", "虚数", "旋转"]
                }
                """, null);

        saveNode("MATH-01-005-02", "复数运算", "加减乘除 a+bi", "数", "高中", 3, 520, "static",
                "复数的加减乘除运算规则", """
                {
                    "text": "复数的四则运算。",
                    "sections": [
                        {"type": "keypoints", "title": "运算法则", "items": [
                            "加法：(a+bi)+(c+di) = (a+c)+(b+d)i",
                            "减法：(a+bi)-(c+di) = (a-c)+(b-d)i",
                            "乘法：(a+bi)(c+di) = (ac-bd)+(ad+bc)i",
                            "除法：乘以共轭复数，分子分母同乘 (c-di)"
                        ]},
                        {"type": "keypoints", "title": "共轭复数", "items": [
                            "z = a+bi 的共轭复数 z̄ = a-bi",
                            "实部相同，虚部互为相反数",
                            "z × z̄ = a² + b²（得到实数）"
                        ]}
                    ]
                }
                """, null);

        saveNode("MATH-01-005-03", "复数的几何意义", "复平面上的点与向量", "数", "高中", 4, 530, "canvas",
                "复数在复平面上对应一个点或向量，模和辐角描述其位置", """
                {
                    "text": "每个复数都对应复平面上的一个点（或向量）。",
                    "sections": [
                        {"type": "definition", "title": "模与辐角", "content": "模 |z| = √(a²+b²)，表示到原点的距离\\n辐角 θ = arctan(b/a)，表示与实轴正方向的夹角"},
                        {"type": "visualization", "title": "复数与向量", "content": "拖动复平面上的点，观察实部、虚部、模和辐角的变化",
                            "visual": {"type": "canvas", "component": "complex-plane", "config": {"draggable": true}}},
                        {"type": "keypoints", "title": "极坐标表示", "items": [
                            "z = r(cosθ + i sinθ)，其中 r=|z|, θ=Arg(z)",
                            "欧拉公式：e^(iθ) = cosθ + i sinθ",
                            "z = r·e^(iθ)（指数形式）"
                        ]}
                    ]
                }
                """, null);

        // 总结节点
        saveNode("MATH-01-099", "数的世界 · 全景总结", "从自然数到复数的完整旅程", "数", "高中", 1, 999, "static",
                "数的世界全景总结：自然数→整数→有理数→实数→复数", """
                {
                    "text": "从自然数到复数，数的世界经历了五次大的扩张。",
                    "sections": [
                        {"type": "definition", "title": "数的扩张脉络", "content": "自然数 → 整数（引入负数，×-1=反向）→ 有理数（引入分数）→ 实数（引入无理数）→ 复数（引入虚数，×i=旋转）"},
                        {"type": "keypoints", "title": "核心洞察", "items": [
                            "每一次扩张都是为了解决“不够用”的问题",
                            "减法不够用 → 引入负数",
                            "除法不够用 → 引入分数",
                            "平方不够用 → 引入无理数",
                            "负数的平方根不够用 → 引入虚数",
                            "×1=正向，×(-1)=反向，×i=旋转90°"
                        ]},
                        {"type": "keypoints", "title": "易错点", "items": [
                            "0 既不是正数也不是负数",
                            "1 既不是质数也不是合数",
                            "π 是无理数（不是有理数）",
                            "i² = -1，不是 i = √(-1)"
                        ]}
                    ],
                    "tags": ["总结", "数的世界"]
                }
                """, "domain_end");

        log.info("→ 创建 {} 个知识点节点", 9);
    }

    private void seedRelations() {
        saveRelation("MATH-01-001", "MATH-01-002", "next", 1, "自然数是理解负数的基础");
        saveRelation("MATH-01-001", "MATH-01-002", "prerequisite", 1, "先认识自然数");
        saveRelation("MATH-01-002", "MATH-01-003", "next", 2, "整数扩展到有理数");
        saveRelation("MATH-01-002", "MATH-01-003", "prerequisite", 1, "先理解负数");
        saveRelation("MATH-01-003", "MATH-01-004", "next", 3, "有理数扩展到实数");
        saveRelation("MATH-01-003", "MATH-01-004", "prerequisite", 1, "先理解有理数");
        saveRelation("MATH-01-004", "MATH-01-005", "next", 4, "实数扩展到复数");
        saveRelation("MATH-01-004", "MATH-01-005", "prerequisite", 1, "需要理解平方根与无理数");
        saveRelation("MATH-01-005", "MATH-01-005-01", "next", 1, "先从虚数单位开始");
        saveRelation("MATH-01-005", "MATH-01-005-01", "prerequisite", 1, "先了解复数是什么");
        saveRelation("MATH-01-005-01", "MATH-01-005-02", "next", 2, "理解 i 之后学习运算");
        saveRelation("MATH-01-005-01", "MATH-01-005-02", "prerequisite", 1, "先理解虚数单位 i");
        saveRelation("MATH-01-005-02", "MATH-01-005-03", "next", 3, "学习运算后理解几何意义");
        saveRelation("MATH-01-005-02", "MATH-01-005-03", "prerequisite", 1, "先掌握复数运算");

        // 总结节点关系
        saveRelation("MATH-01-099", "MATH-01-001", "summary_of", 1, "涵盖自然数");
        saveRelation("MATH-01-099", "MATH-01-002", "summary_of", 2, "涵盖整数与负数");
        saveRelation("MATH-01-099", "MATH-01-003", "summary_of", 3, "涵盖有理数");
        saveRelation("MATH-01-099", "MATH-01-004", "summary_of", 4, "涵盖实数");
        saveRelation("MATH-01-099", "MATH-01-005", "summary_of", 5, "涵盖复数");

        // 跨领域引用
        saveRelation("MATH-01-004", "MATH-04-001", "reference", 1, "平方根是函数的基础");
        saveRelation("MATH-01-005-03", "MATH-04-003", "reference", 1, "三角形式和三角函数关联");

        log.info("→ 创建 {} 条知识点关系", 17);
    }

    private void saveNode(String id, String title, String subtitle, String domain, String level,
                          int difficulty, int sortOrder, String visualType, String summary,
                          String contentJson, String milestoneType) {
        KnowledgeNode node = new KnowledgeNode();
        node.setId(id);
        node.setTitle(title);
        node.setSubtitle(subtitle);
        node.setDomain(domain);
        node.setLevel(level);
        node.setDifficulty(difficulty);
        node.setSortOrder(sortOrder);
        node.setVisualType(visualType);
        node.setSummary(summary);
        node.setContentJson(contentJson);
        node.setMilestoneType(milestoneType);
        node.setStatus(1);
        nodeService.save(node);
    }

    private void saveRelation(String from, String to, String type, int sortOrder, String desc) {
        KnowledgeRelation relation = new KnowledgeRelation();
        relation.setFromNodeId(from);
        relation.setToNodeId(to);
        relation.setRelationType(type);
        relation.setSortOrder(sortOrder);
        relation.setDescription(desc);
        relationService.save(relation);
    }
}
