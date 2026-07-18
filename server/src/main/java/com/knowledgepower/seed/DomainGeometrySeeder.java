package com.knowledgepower.seed;

import com.knowledgepower.knowledge.entity.KnowledgeNode;
import com.knowledgepower.knowledge.entity.KnowledgeRelation;
import com.knowledgepower.knowledge.service.KnowledgeNodeService;
import com.knowledgepower.knowledge.service.KnowledgeRelationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * 领域五：几何
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DomainGeometrySeeder {

    private final KnowledgeNodeService nodeService;
    private final KnowledgeRelationService relationService;

    public void seed() {
        List<KnowledgeNode> nodes = new ArrayList<>();
        List<KnowledgeRelation> relations = new ArrayList<>();

        // ══════════════════════════════
        //  知识点
        // ══════════════════════════════

        nodes.add(KnowledgeNode.builder()
                .id("MATH-05-001").title("点、线、面、体").subtitle("几何世界的基本元素")
                .domain("几何").level("初中").difficulty(1).sortOrder(100)
                .visualType("static").milestoneType(null)
                .summary("点动成线，线动成面，面动成体——几何世界的【原子】")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"基本元素","content":"点：位置，没有大小（几何中最基本的元素）\\n线：点运动的轨迹，分为直线、射线、线段\\n面：线运动的轨迹，有平面和曲面\\n体：面运动的轨迹，有体积"},
                    {"type":"keypoints","title":"直线、射线、线段","items":[
                        "直线：两端无限延伸（用 $\\overleftrightarrow{AB}$ 表示）",
                        "射线：一个端点向一方无限延伸（用 $\\overrightarrow{AB}$ 表示）",
                        "线段：两个端点之间（用 $\\overline{AB}$ 表示）",
                        "两点确定一条直线",
                        "两点之间，线段最短（距离定义）"
                    ]},
                    {"type":"keypoints","title":"角","items":[
                        "角：从同一点出发的两条射线组成的图形",
                        "锐角：$0^\\circ<\\theta<90^\\circ$",
                        "直角：$\\theta=90^\\circ$",
                        "钝角：$90^\\circ<\\theta<180^\\circ$",
                        "平角：$\\theta=180^\\circ$，周角：$\\theta=360^\\circ$"
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-05-002").title("三角形").subtitle("最稳定的多边形")
                .domain("几何").level("初中").difficulty(2).sortOrder(200)
                .visualType("canvas").milestoneType(null)
                .summary("三角形是最基本的多边形，内角和 180°，稳定性是它的核心特质")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"由三条线段首尾顺次连接组成的封闭图形叫三角形。记作 $\\triangle ABC$。"},
                    {"type":"keypoints","title":"分类","items":[
                        "按角分：锐角三角形、直角三角形、钝角三角形",
                        "按边分：不等边三角形、等腰三角形、等边三角形",
                        "等腰三角形：两腰相等，两底角相等",
                        "等边三角形：三边相等，三角都是 $60^\\circ$"
                    ]},
                    {"type":"keypoints","title":"性质","items":[
                        "内角和：$\\angle A+\\angle B+\\angle C=180^\\circ$",
                        "任意两边之和大于第三边",
                        "任意两边之差小于第三边",
                        "大边对大角，大角对大边",
                        "三角形的稳定性：三边确定则形状唯一"
                    ]},
                    {"type":"keypoints","title":"重要线段","items":[
                        "高：从顶点向对边作垂线",
                        "中线：连接顶点和对边中点（重心在心）",
                        "角平分线：平分内角（内心在心）",
                        "中位线：两边中点连线（平行于第三边且等于其一半）"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"三角形两边分别为 5 和 8，第三边 x 的范围？","steps":["两边之和 > 第三边：5+8>x → x<13","两边之差 < 第三边：8-5<x → x>3","∴ 3<x<13"],"answer":"3<x<13"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-05-003").title("全等三角形").subtitle("形状大小完全相同的三角形")
                .domain("几何").level("初中").difficulty(2).sortOrder(300)
                .visualType("static").milestoneType(null)
                .summary("全等三角形：大小、形状完全一样，可以完全重叠")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"两个三角形大小和形状完全相同，能够完全重合。记作 $\\triangle ABC\\cong\\triangle A'B'C'$。"},
                    {"type":"keypoints","title":"全等判定定理","items":[
                        "SSS（边边边）：三边对应相等",
                        "SAS（边角边）：两边及其夹角对应相等",
                        "ASA（角边角）：两角及其夹边对应相等",
                        "AAS（角角边）：两角及其中一角的对边对应相等",
                        "HL（斜边直角边）：直角三角形专用的完美判定"
                    ]},
                    {"type":"keypoints","title":"全等的性质","items":[
                        "对应边相等",
                        "对应角相等",
                        "对应中线、高、角平分线也相等",
                        "面积相等"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"AB=AC，D 在 BC 上，且 AD⊥BC，求证 △ABD≌△ACD","steps":["AB=AC（已知）","AD=AD（公共边）","HL：∠ADB=∠ADC=90°","∴ △ABD≅△ACD（HL）"],"answer":"由 HL 判定得证"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-05-004").title("相似三角形").subtitle("形状相同，大小成比例")
                .domain("几何").level("初中").difficulty(3).sortOrder(400)
                .visualType("static").milestoneType(null)
                .summary("相似三角形：形状一样但大小不同，对应边成比例，对应角相等")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"对应角相等、对应边成比例的三角形叫相似三角形。记作 $\\triangle ABC\\sim\\triangle A'B'C'$。相似比是对应边的比值。"},
                    {"type":"keypoints","title":"相似判定","items":[
                        "AA（角角）：两角对应相等（第三角自动相等）",
                        "SAS：两边成比例且夹角相等",
                        "SSS：三边对应成比例"
                    ]},
                    {"type":"keypoints","title":"相似的性质","items":[
                        "对应角相等",
                        "对应边成比例（相似比 $k$）",
                        "周长比 = 相似比 $k$",
                        "面积比 = $k^2$（平方关系！）",
                        "对应高、中线、角平分线比 = $k$"
                    ]},
                    {"type":"keypoints","title":"经典模型","items":[
                        "A 字型：DE∥BC → △ADE∼△ABC",
                        "8 字型：AB∥CD → △AOB∼△COD",
                        "射影定理：直角三角形斜边上的高 → 三个两两相似"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"△ABC∼△DEF，AB=3，DE=6，△ABC面积=8，求△DEF面积","steps":["相似比 k=AB/DE=3/6=0.5","面积比=k²=0.25","S_DEF=S_ABC÷0.25=32"],"answer":"32"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-05-005").title("勾股定理").subtitle("a²+b²=c²，最伟大的定理之一")
                .domain("几何").level("初中").difficulty(2).sortOrder(500)
                .visualType("canvas").milestoneType(null)
                .summary("直角三角形两条直角边的平方和等于斜边的平方——毕达哥拉斯定理")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定理","content":"在直角三角形中，两条直角边 $a$、$b$ 的平方和等于斜边 $c$ 的平方：$$a^2+b^2=c^2$$"},
                    {"type":"visualization","title":"面积证明","content":"用四个全等直角三角形拼成正方形，通过面积相等直观证明勾股定理",
                        "visual":{"type":"canvas","component":"geometry-visual","config":{"mode":"pythagorean"}}},
                    {"type":"keypoints","title":"经典勾股数","items":[
                        "$3^2+4^2=5^2$ → (3,4,5)",
                        "$5^2+12^2=13^2$ → (5,12,13)",
                        "$8^2+15^2=17^2$ → (8,15,17)",
                        "$7^2+24^2=25^2$ → (7,24,25)"
                    ]},
                    {"type":"keypoints","title":"逆定理","items":[
                        "若 $a^2+b^2=c^2$，则三角形为直角三角形",
                        "这是判定直角的重要方法"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"直角三角形两直角边为 6、8，求斜边","steps":["c²=6²+8²=36+64=100","c=10"],"answer":"10"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-05-006").title("四边形").subtitle("平行四边形到梯形的家族")
                .domain("几何").level("初中").difficulty(2).sortOrder(600)
                .visualType("static").milestoneType(null)
                .summary("四边形家族：平行四边形 → 矩形/菱形 → 正方形（集大成者）")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"四条线段首尾顺次连接组成的封闭图形。"},
                    {"type":"keypoints","title":"平行四边形","items":[
                        "对边平行且相等",
                        "对角相等，邻角互补",
                        "对角线互相平分",
                        "判定：一组对边平行且相等 → 平行四边形"
                    ]},
                    {"type":"keypoints","title":"特殊平行四边形","items":[
                        "矩形：平行四边形 + 一角为直角 → 对角线相等",
                        "菱形：平行四边形 + 邻边相等 → 对角线垂直平分",
                        "正方形：矩形 + 菱形（兼具二者所有性质）"
                    ]},
                    {"type":"keypoints","title":"梯形","items":[
                        "一组对边平行，另一组不平行",
                        "等腰梯形：两腰相等，底角相等，对角线相等"
                    ]},
                    {"type":"keypoints","title":"面积公式","items":[
                        "平行四边形：底 × 高",
                        "矩形：长 × 宽",
                        "菱形：对角线乘积 ÷ 2",
                        "梯形：(上底+下底) × 高 ÷ 2"
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-05-007").title("圆").subtitle("完美的对称图形")
                .domain("几何").level("初中").difficulty(3).sortOrder(700)
                .visualType("canvas").milestoneType(null)
                .summary("圆是到定点（圆心）距离等于定长（半径）的所有点的集合。从圆出发，可以打开几何宇宙的半壁江山")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"平面上到定点 $O$ 的距离等于定长 $r$ 的所有点组成的图形叫圆。$O$ 是圆心，$r$ 是半径。\\n\\n💡 **直觉理解**：用圆规画圆——固定的一脚是圆心，两脚间距是半径，旋转一周就得到一个完美的圆。"},
                    {"type":"keypoints","title":"基础·基本元素","items":[
                        "弦：连接圆上任意两点的线段",
                        "直径：经过圆心的弦（最长的弦，$d=2r$）",
                        "弧：圆上任意两点间的部分（优弧 > 半圆 > 劣弧）",
                        "圆心角：顶点在圆心的角（度数等于所对弧的度数）",
                        "圆周角：顶点在圆上、两边与圆相交的角"
                    ]},
                    {"type":"derivation","title":"提升·圆周角定理的证明","content":"圆周角定理：同弧所对的圆周角是圆心角的一半。证明需要构造等腰三角形和利用外角定理。",
                        "steps":[
                            "如图，$\\angle ACB$ 是 $\\widehat{AB}$ 所对的圆周角，$\\angle AOB$ 是圆心角",
                            "连接 $OC$，$\\triangle AOC$ 和 $\\triangle BOC$ 都是等腰三角形（$OA=OC=OB=r$）",
                            "设 $\\angle ACO=\\angle CAO=\\alpha$，$\\angle BCO=\\angle CBO=\\beta$",
                            "$\\angle AOB=180^\\circ-(\\angle OAB+\\angle OBA)$",
                            "$=180^\\circ-((90^\\circ-\\alpha)+(90^\\circ-\\beta))=\\alpha+\\beta$",
                            "$\\angle ACB=\\alpha+\\beta$，$\\therefore \\angle ACB=\\frac{1}{2}\\angle AOB$，得证！"
                        ],
                        "result":"同弧所对的圆周角 $\\theta$ 等于圆心角 $\\Theta$ 的一半：$\\theta = \\frac{1}{2}\\Theta$",
                        "formulas":["$\\angle ACB = \\frac{1}{2}\\angle AOB$"]
                    },
                    {"type":"derivation","title":"提升·圆周角定理的推论","content":"圆周角定理有若干重要的推论，是解题的利器。",
                        "steps":[
                            "直径所对的圆周角是 $90^\\circ$（半圆上的圆周角）",
                            "证明：直径对应的圆心角为 $180^\\circ$，圆周角是它的一半 $=90^\\circ$",
                            "同弧所对的圆周角相等",
                            "相等的圆周角所对的弧相等"
                        ],
                        "formulas":["$\\angle ACB=90^\\circ \\iff AB$ 是直径"]
                    },
                    {"type":"derivation","title":"提升·垂径定理的证明","content":"垂直于弦的直径平分这条弦。这是圆的对称性的体现。",
                        "steps":[
                            "设直径 $CD\\perp AB$ 于 $P$，求证 $AP=PB$",
                            "连接 $OA$、$OB$，则 $\\triangle OAP\\cong\\triangle OBP$",
                            "$\\because OA=OB=r$（同圆半径相等）",
                            "$OP=OP$（公共边），$\\angle OPA=\\angle OPB=90^\\circ$",
                            "$\\therefore \\triangle OAP\\cong\\triangle OBP$（HL）",
                            "$\\therefore AP=PB$，$CD$ 平分 $AB$，得证！"
                        ],
                        "result":"$CD\\perp AB \\iff CD$ 平分 $AB$（垂径定理）"
                    },
                    {"type":"keypoints","title":"提升·圆内接四边形","items":[
                        "圆内接四边形：四个顶点都在圆上的四边形",
                        "对角互补：$\\angle A + \\angle C = 180^\\circ$，$\\angle B + \\angle D = 180^\\circ$",
                        "外角等于内对角：外角等于不相邻的内角",
                        "托勒密定理：$AC\\cdot BD = AB\\cdot CD + AD\\cdot BC$（拓展）"
                    ]},
                    {"type":"keypoints","title":"提升·切线性质证明","items":[
                        "切线的判定：过半径外端且垂直于半径的直线是圆的切线",
                        "切线的性质：圆的切线垂直于过切点的半径",
                        "证明（反证法）：假设切线不垂直于半径，则可作垂线推出矛盾",
                        "切线长定理：从圆外一点引的两条切线长相等",
                        "证明：连接 $PO$、$PA$、$PB$，$\\triangle PAO\\cong\\triangle PBO$（HL）"
                    ]},
                    {"type":"keypoints","title":"提升·圆的计算","items":[
                        "周长：$C=2\\pi r$（$\\pi\\approx3.14159\\ldots$ 是无理数）",
                        "面积：$S=\\pi r^2$（$\\pi$ 的由来——古希腊的穷竭法）",
                        "弧长：$l=\\frac{n\\pi r}{180}$（$n$ 为圆心角度数）",
                        "扇形面积：$S=\\frac{n\\pi r^2}{360}$",
                        "弓形面积：扇形 $\\pm$ 三角形（看弓形是否含圆心）"
                    ]},
                    {"type":"example","title":"例题·基础","items":[
                        {"question":"直径为 10 的圆，圆心角为 60° 的弧长和扇形面积","steps":["$r=5$，$n=60^\\circ$","弧长 $l=\\frac{60\\times\\pi\\times5}{180}=\\frac{5\\pi}{3}$","扇形面积 $S=\\frac{60\\times\\pi\\times25}{360}=\\frac{25\\pi}{6}$"],"answer":"弧长 $5\\pi/3$，面积 $25\\pi/6$"}
                    ]},
                    {"type":"example","title":"例题·提升","items":[
                        {"question":"如图，$AB$ 是 $\\odot O$ 的直径，$\\angle CAB=25^\\circ$，求 $\\angle ABC$","steps":["$AB$ 是直径 → $\\angle ACB=90^\\circ$（直径所对圆周角为直角）","$\\angle ABC=180^\\circ-90^\\circ-25^\\circ=65^\\circ$（内角和定理）"],"answer":"$\\angle ABC=65^\\circ$","solution":"圆周角定理+内角和的经典应用"},
                        {"question":"$\\odot O$ 中弦 $AB$ 长为 8，圆心到 $AB$ 的距离为 3，求半径","steps":["连接 $OA$，作 $OC\\perp AB$ 于 $C$","$AC=AB/2=4$（垂径定理）","$OC=3$，由勾股定理：$r=OA=\\sqrt{4^2+3^2}=5$"],"answer":"半径 $r=5$"}
                    ]},
                    {"type":"keypoints","title":"拓展·托勒密定理（圆内接四边形）","items":[
                        "托勒密定理：圆内接四边形中，两条对角线之积等于两组对边之积的和",
                        "公式：$AC \\times BD = AB \\times CD + AD \\times BC$",
                        "这是几何中非常漂亮的等式，将四边形的边和对角线联系起来",
                        "应用：已知四边求对角线、证明几何等式"
                    ]},
                    {"type":"keypoints","title":"拓展·阿波罗尼斯圆","items":[
                        "到两定点 $A$、$B$ 距离之比为定值 $k$（$k>0$，$k\\neq 1$）的点的轨迹是一个圆",
                        "这个圆叫阿波罗尼斯圆（简称阿氏圆）",
                        "圆心在线段 $AB$ 上，半径与 $k$ 和 $AB$ 长度有关",
                        "这是从「圆」到「轨迹」的跨越，是解析几何中圆的又一维度"
                    ]},
                    {"type":"keypoints","title":"拓展·圆在实际中的应用","items":[
                        "🚗 车轮：圆形的轮子保证车轴高度恒定（圆心到地面的距离不变）",
                        "🛰️ 圆形轨道：卫星绕地球的近似圆形轨道",
                        "🏛️ 罗马万神殿：穹顶的完美圆形结构",
                        "🥏 飞盘的设计：圆形在空气动力学中的优势",
                        "🎵 CD 光盘：同心圆轨道存储数据"
                    ]},
                    {"type":"strategy","title":"思维训练·解题策略","items":[
                        "遇到圆的问题，先找圆心和半径——它们是圆的『身份证』",
                        "有直径 → 考虑圆周角定理（直径对直角）",
                        "有弦 → 考虑垂径定理（作弦心距）",
                        "有切线 → 连半径（半径垂直切线）",
                        "有圆内接四边形 → 对角互补",
                        "多解问题：圆是对称图形，注意多种可能性（如弦的位置）",
                        "💡 核心思想：圆的问题，本质是三角形的问题（连半径造等腰）"
                    ]},
                    {"type":"common-mistakes","title":"易错点辨析","items":[
                        {"mistake":"在所有弧中，圆周角都是圆心角的一半","correct":"只有同弧（或等弧）所对的圆周角和圆心角才满足此关系"},
                        {"mistake":"垂直于弦的直线平分这条弦","correct":"过圆心的直线垂直于弦才平分（垂径定理的条件：直径⊥弦）"},
                        {"mistake":"所有切线都相等","correct":"切线长相等指从同一点出发的两条切线是相等的"}
                    ]},
                    {"type":"analogy","title":"类比理解·圆与生命","content":"圆无处不在：\\n🌅 日出日落——太阳的圆形\\n🌳 树的年轮——一圈圈同心圆\\n💧 水滴涟漪——水面的圆形波纹\\n🪐 行星公转——近似的圆周运动\\n\\n数学之美在于：自然界的『圆』正是数学定义的『到定点距离为定长的点的集合』。当你理解了圆的定义，你就理解了🌌半个宇宙的几何。"}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-05-010").title("圆幂定理").subtitle("相交弦·切割线·割线三大定理的统一证明")
                .domain("几何").level("高中").difficulty(3).sortOrder(750)
                .visualType("canvas").milestoneType(null)
                .summary("圆幂定理是相交弦定理、切割线定理、割线定理的统一表达，核心是圆幂 OP²−r²")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"圆幂的定义","content":"平面上一点 $P$ 对圆 $O$ 的幂定义为：$$\\text{圆幂}=OP^2-r^2$$ 其中 $r$ 为圆的半径。\\n\\n💡 **直观理解**：$P$ 到圆的「影响力」——$P$ 离圆越远，圆幂越大；$P$ 在圆上时圆幂为 0；$P$ 在圆内时圆幂为负。"},"
                    {"type":"keypoints","title":"【一】相交弦定理","items":[
                        "情形：$P$ 在圆内，$AB$、$CD$ 是过 $P$ 的两条弦",
                        "结论：$PA \\times PB = PC \\times PD$",
                        "几何意义：交点分两弦所得线段之积相等"
                    ]},
                    {"type":"derivation","title":"相交弦定理的证明（相似三角形法）","content":"利用圆周角定理构造相似三角形。",
                        "steps":[
                            "连接 $AD$、$BC$，构造 $\\triangle APD$ 和 $\\triangle CPB$",
                            "$\\because \\angle ADP = \\angle CBP$（同弧 $\\widehat{AC}$ 所对的圆周角相等）",
                            "$\\because \\angle APD = \\angle CPB$（对顶角相等）",
                            "$\\therefore \\triangle APD \\sim \\triangle CPB$（AA 判定）",
                            "$\\therefore \\frac{PA}{PC} = \\frac{PD}{PB}$（对应边成比例）",
                            "交叉相乘得：$PA \\times PB = PC \\times PD$ ✅"
                        ],
                        "formulas":["$\\triangle APD \\sim \\triangle CPB \\implies PA\\cdot PB = PC\\cdot PD$"]
                    },
                    {"type":"keypoints","title":"【二】切割线定理","items":[
                        "情形：$P$ 在圆外，$PT$ 是切线（切点 $T$），$PAB$ 是割线",
                        "结论：$PT^2 = PA \\times PB$",
                        "几何意义：切线长是圆外部分与整个割线的比例中项"
                    ]},
                    {"type":"derivation","title":"切割线定理的证明（相似三角形法）",
                        "steps":[
                            "连接 $AT$、$BT$",
                            "$\\because \\angle PTA = \\angle PBT$（弦切角定理：弦切角等于所夹弧对的圆周角）",
                            "$\\because \\angle APT = \\angle TPB$（公共角）",
                            "$\\therefore \\triangle PAT \\sim \\triangle PTB$（AA 判定）",
                            "$\\therefore \\frac{PT}{PA} = \\frac{PB}{PT}$（对应边成比例）",
                            "交叉相乘得：$PT^2 = PA \\times PB$ ✅"
                        ],
                        "formulas":["$\\triangle PAT \\sim \\triangle PTB \\implies PT^2 = PA\\cdot PB$"]
                    },
                    {"type":"keypoints","title":"【三】割线定理","items":[
                        "情形：$P$ 在圆外，$PAB$、$PCD$ 是两条割线",
                        "结论：$PA \\times PB = PC \\times PD$",
                        "与相交弦定理形式相同，但 $P$ 在圆外"
                    ]},
                    {"type":"derivation","title":"割线定理的证明",
                        "steps":[
                            "连接 $AD$、$BC$",
                            "$\\because \\angle PAD = \\angle PCB$（圆内接四边形的外角等于内对角，$A$、$B$、$C$、$D$ 四点共圆）",
                            "$\\because \\angle APD = \\angle CPB$（公共角）",
                            "$\\therefore \\triangle PAD \\sim \\triangle PCB$（AA 判定）",
                            "$\\therefore \\frac{PA}{PC} = \\frac{PD}{PB}$",
                            "交叉相乘得：$PA \\times PB = PC \\times PD$ ✅"
                        ],
                        "formulas":["$\\triangle PAD \\sim \\triangle PCB \\implies PA\\cdot PB = PC\\cdot PD$"]
                    },
                    {"type":"visualization","title":"🎨 圆幂三大定理交互演示","content":"切换三个按钮查看不同情形的几何图示，观察线段乘积的相等关系。",
                        "visual":{"type":"canvas","component":"circle-power","config":{}}}
                    ,{"type":"keypoints","title":"拓展·圆幂的统一表述","items":[
                        "三种定理可以统一为：过定点 $P$ 的直线与圆交于 $X$、$Y$，则 $PX \\times PY = |OP^2 - r^2|$（定值）",
                        "这个定值就是「圆幂」的绝对值",
                        "$P$ 在圆外 $\\iff$ 幂 $>0$，适用切割线/割线定理",
                        "$P$ 在圆上 $\\iff$ 幂 $=0$",
                        "$P$ 在圆内 $\\iff$ 幂 $<0$，适用相交弦定理",
                        "💡 **极线概念**：$P$ 关于圆的极线方程可直接从圆幂推导"
                    ]},
                    {"type":"strategy","title":"思维训练·解题策略","items":[
                        "遇到圆内两弦相交 → 相交弦定理（找等积）",
                        "遇到切线和割线 → 切割线定理（切线平方 = 乘积）",
                        "遇到圆外两条割线 → 割线定理（外积相等）",
                        "三步法：① 确定 $P$ 的位置（圆内/圆外）② 确定使用的定理 ③ 列出等积方程",
                        "💡 核心心法：圆幂定理的本质是『相似三角形』，每次用之前思考：哪两个三角形相似？"
                    ]},
                    {"type":"example","title":"例题·基础应用","items":[
                        {"question":"圆中两弦 AB 和 CD 交于 P，PA=3，PB=6，PC=2，求 PD","steps":["相交弦定理：$PA\\cdot PB=PC\\cdot PD$","$3\\times6=2\\times PD$","$PD=9$"],"answer":"$PD=9$"},
                        {"question":"从圆外一点 P 引切线 PT=6，割线交圆于 A、B，若 PA=4，求 PB","steps":["切割线定理：$PT^2=PA\\cdot PB$","$36=4\\cdot PB$","$PB=9$"],"answer":"$PB=9$"}
                    ]},
                    {"type":"common-mistakes","title":"易错点辨析","items":[
                        {"mistake":"相交弦定理中，PA·PB=PC·PD，P 随便取哪条弦都行","correct":"P 必须是两条弦的交点，且 PA·PB 是同一条弦被 P 分的两段之积"},
                        {"mistake":"切割线定理中 PT²=PA·PB，A 和 B 随意放哪都可以","correct":"A 必须是近端点（离 P 近的交点），B 是远端点"}
                    ]},
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-05-008").title("立体几何初步").subtitle("从平面到空间的跃进")
                .domain("几何").level("高中").difficulty(3).sortOrder(800)
                .visualType("static").milestoneType(null)
                .summary("立体几何研究三维空间中的几何体，核心是空\n间中的位置关系")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"研究三维空间中几何体的形状、大小、位置关系的学科。"},
                    {"type":"keypoints","title":"空间中的位置关系","items":[
                        "直线与直线：平行、相交、异面",
                        "直线与平面：平行、相交（垂直）、在平面内",
                        "平面与平面：平行、相交（二面角）"
                    ]},
                    {"type":"keypoints","title":"常见几何体","items":[
                        "棱柱：上下底面平行全等，侧面是平行四边形",
                        "棱锥：一个底面，侧面是三角形",
                        "圆柱：矩形绕一边旋转而成",
                        "圆锥：直角三角形绕直角边旋转而成",
                        "球：半圆绕直径旋转而成"
                    ]},
                    {"type":"keypoints","title":"体积与表面积","items":[
                        "柱体：$V=Sh$，$S_\\text{侧}=Ch$",
                        "锥体：$V=\\frac{1}{3}Sh$",
                        "球体：$V=\\frac{4}{3}\\pi r^3$，$S=4\\pi r^2$"
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-05-009").title("解析几何初步").subtitle("代数方法研究几何")
                .domain("几何").level("高中").difficulty(4).sortOrder(900)
                .visualType("static").milestoneType(null)
                .summary("坐标系中的几何——用方程描述图形")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"用代数方法（坐标系、方程）研究几何问题的学科。笛卡尔的伟大创举。"},
                    {"type":"keypoints","title":"直线方程","items":[
                        "一般式：$Ax+By+C=0$",
                        "斜截式：$y=kx+b$（$k$ 斜率，$b$ 截距）",
                        "点斜式：$y-y_1=k(x-x_1)$",
                        "两点式：$\\frac{y-y_1}{y_2-y_1}=\\frac{x-x_1}{x_2-x_1}$"
                    ]},
                    {"type":"keypoints","title":"圆的标准方程","items":[
                        "$(x-a)^2+(y-b)^2=r^2$，圆心 $(a,b)$，半径 $r$",
                        "一般式：$x^2+y^2+Dx+Ey+F=0$"
                    ]},
                    {"type":"keypoints","title":"距离公式","items":[
                        "两点距离：$d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$",
                        "点到直线：$d=\\frac{|Ax_0+By_0+C|}{\\sqrt{A^2+B^2}}$",
                        "平行线距离：$d=\\frac{|C_1-C_2|}{\\sqrt{A^2+B^2}}$"
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-05-011").title("圆锥曲线总论").subtitle("椭圆、双曲线、抛物线——三种二次曲线的统一")
                .domain("几何").level("高中").difficulty(4).sortOrder(950)
                .visualType("static").milestoneType(null)
                .summary("圆锥曲线是平面截圆锥所得的曲线，包括椭圆（含圆）、双曲线、抛物线三大类")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"圆锥曲线的起源","content":"用不同角度的平面去截一个圆锥面，得到三种曲线：椭圆（截平面倾斜角小于母线角）、抛物线（平行于母线）、双曲线（倾斜角大于母线角）。"},
                    {"type":"keypoints","title":"椭圆","items":[
                        "定义：到两焦点 $F_1,F_2$ 距离之和为常数 $2a$（$>|F_1F_2|$）的点的轨迹",
                        "标准方程：$\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1$（$a>b>0$，焦点在 $x$ 轴）",
                        "关系：$c^2=a^2-b^2$，$e=\\frac{c}{a}<1$",
                        "顶点：$(\\pm a,0),(0,\\pm b)$，长轴 $2a$，短轴 $2b$",
                        "特殊情形：$a=b=r$ 时退化为圆 $x^2+y^2=r^2$"
                    ]},
                    {"type":"keypoints","title":"双曲线","items":[
                        "定义：到两焦点 $F_1,F_2$ 距离之差的绝对值为常数 $2a$（$<|F_1F_2|$）的点的轨迹",
                        "标准方程：$\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1$（焦点在 $x$ 轴）",
                        "关系：$c^2=a^2+b^2$，$e=\\frac{c}{a}>1$",
                        "渐近线：$y=\\pm\\frac{b}{a}x$（双曲线特有的直线）",
                        "顶点：$(\\pm a,0)$，实轴 $2a$，虚轴 $2b$"
                    ]},
                    {"type":"keypoints","title":"抛物线","items":[
                        "定义：到焦点 $F$ 距离等于到准线 $l$ 距离的点的轨迹",
                        "标准方程：$y^2=2px$（$p>0$，开口向右），$y^2=-2px$（向左）",
                        "$x^2=2py$（向上），$x^2=-2py$（向下）",
                        "焦点：$(\\frac{p}{2},0)$，准线：$x=-\\frac{p}{2}$（$y^2=2px$ 情形）",
                        "$e=1$（抛物线的离心率恒为 1）"
                    ]},
                    {"type":"keypoints","title":"三种曲线的对比","items":[
                        "椭圆 $e<1$，双曲线 $e>1$，抛物线 $e=1$",
                        "椭圆是封闭曲线，双曲线有两支，抛物线是开口曲线",
                        "共同点：都是二次曲线，都有焦点和准线",
                        "圆锥曲线的光学性质：椭圆（反射到另一焦点）、双曲线（反射到另一支焦点）、抛物线（反射到焦点方向）"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"椭圆 $\\frac{x^2}{25}+\\frac{y^2}{16}=1$ 的 a、b、c、e 各是多少？","steps":["a²=25 ⇒ a=5","b²=16 ⇒ b=4","c²=a²-b²=9 ⇒ c=3","e=c/a=3/5=0.6"],"answer":"a=5,b=4,c=3,e=0.6"},
                        {"question":"双曲线 $\\frac{x^2}{9}-\\frac{y^2}{16}=1$ 的渐近线方程？","steps":["a²=9 ⇒ a=3","b²=16 ⇒ b=4","渐近线：y=±(b/a)x=±(4/3)x"],"answer":"y=±(4/3)x"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-05-099").title("几何 · 全景总结").subtitle("从点线面到空间坐标")
                .domain("几何").level("高中").difficulty(1).sortOrder(999)
                .visualType("static").milestoneType("domain_end")
                .summary("几何是研究空间形状和位置关系的学科")
                .contentJson("""
                {"sections":[
                    {"type":"keypoints","title":"几何发展的脉络","items":[
                        "欧氏几何基础：点线面 → 三角形 → 全等/相似",
                        "度量几何：勾股定理 → 圆 → 面积体积",
                        "空间几何：从平面到立体",
                        "解析几何：坐标系 + 代数 = 几何的新语言",
                        "圆锥曲线：平面截圆锥 → 椭圆/双曲线/抛物线"
                    ]},
                    {"type":"keypoints","title":"跨领域联系","items":[
                        "三角形 → 三角函数（边角关系）",
                        "圆 → 圆周运动 → 三角函数",
                        "圆幂定理 → 相交弦/切割线/割线统一",
                        "圆锥曲线 → 二次方程 → 判别式",
                        "解析几何 → 函数图像（坐标系）",
                        "立体几何 → 空间向量 → 导数与优化"
                    ]}
                ]}""")
                .status(1).build());

        for (KnowledgeNode node : nodes) nodeService.save(node);
        log.info("→ 创建 {} 个「几何」知识点节点", nodes.size());

        // ══════════════════════════════
        //  关系
        // ══════════════════════════════

        relations.add(relation("MATH-05-001", "MATH-05-002", "next", 1, "从基本元素到三角形"));
        relations.add(relation("MATH-05-002", "MATH-05-001", "prerequisite", 1, ""));

        relations.add(relation("MATH-05-002", "MATH-05-003", "next", 2, "学三角形后学全等"));
        relations.add(relation("MATH-05-003", "MATH-05-002", "prerequisite", 1, ""));

        relations.add(relation("MATH-05-003", "MATH-05-004", "next", 3, "从全等到相似"));
        relations.add(relation("MATH-05-004", "MATH-05-003", "prerequisite", 1, ""));

        relations.add(relation("MATH-05-002", "MATH-05-005", "next", 4, "直角三角形的特殊定理"));
        relations.add(relation("MATH-05-005", "MATH-05-002", "prerequisite", 1, "勾股定理需要直角三角形概念"));

        relations.add(relation("MATH-05-002", "MATH-05-006", "next", 5, "从三边到四边"));
        relations.add(relation("MATH-05-006", "MATH-05-002", "prerequisite", 1, ""));

        relations.add(relation("MATH-05-002", "MATH-05-007", "next", 6, "从直线形到曲线形"));
        relations.add(relation("MATH-05-007", "MATH-05-002", "prerequisite", 1, ""));

        // 圆幂定理：圆的有力推论
        relations.add(relation("MATH-05-007", "MATH-05-010", "next", 7, "从圆的基本性质到圆幂定理"));
        relations.add(relation("MATH-05-010", "MATH-05-007", "prerequisite", 1, "圆幂定理需要圆的基本概念"));

        relations.add(relation("MATH-05-002", "MATH-05-008", "next", 8, "从平面到空间"));
        relations.add(relation("MATH-05-008", "MATH-05-002", "prerequisite", 1, ""));

        relations.add(relation("MATH-05-007", "MATH-05-009", "next", 9, "从圆到圆的方程"));
        relations.add(relation("MATH-05-009", "MATH-05-007", "prerequisite", 1, ""));
        relations.add(relation("MATH-05-009", "MATH-04-002", "prerequisite", 1, "需要一次函数基础"));

        // 圆锥曲线：解析几何的延续
        relations.add(relation("MATH-05-009", "MATH-05-011", "next", 10, "从圆到一般的二次曲线"));
        relations.add(relation("MATH-05-011", "MATH-05-009", "prerequisite", 1, "圆锥曲线需要圆的方程基础"));

        // 跨领域
        relations.add(relation("MATH-04-008", "MATH-05-002", "reference", 1, "三角函数的三角形定义"));
        relations.add(relation("MATH-01-003", "MATH-05-005", "reference", 1, "平方运算"));
        // 圆锥曲线 ↔ 二次函数
        relations.add(relation("MATH-04-004", "MATH-05-011", "reference", 1, "二次函数的图像是抛物线"));

        // 全景总结
        relations.add(relation("MATH-05-099", "MATH-05-001", "summary_of", 1, ""));
        relations.add(relation("MATH-05-099", "MATH-05-002", "summary_of", 2, ""));
        relations.add(relation("MATH-05-099", "MATH-05-003", "summary_of", 3, ""));
        relations.add(relation("MATH-05-099", "MATH-05-004", "summary_of", 4, ""));
        relations.add(relation("MATH-05-099", "MATH-05-005", "summary_of", 5, ""));
        relations.add(relation("MATH-05-099", "MATH-05-006", "summary_of", 6, ""));
        relations.add(relation("MATH-05-099", "MATH-05-007", "summary_of", 7, ""));
        relations.add(relation("MATH-05-099", "MATH-05-010", "summary_of", 8, ""));
        relations.add(relation("MATH-05-099", "MATH-05-008", "summary_of", 9, ""));
        relations.add(relation("MATH-05-099", "MATH-05-009", "summary_of", 10, ""));
        relations.add(relation("MATH-05-099", "MATH-05-011", "summary_of", 11, ""));

        for (KnowledgeRelation r : relations) relationService.save(r);
        log.info("→ 创建 {} 条「几何」知识点关系", relations.size());
    }

    private KnowledgeRelation relation(String from, String to, String type, int sort, String desc) {
        return KnowledgeRelation.builder()
                .fromNodeId(from).toNodeId(to)
                .relationType(type).sortOrder(sort).description(desc)
                .build();
    }
}
