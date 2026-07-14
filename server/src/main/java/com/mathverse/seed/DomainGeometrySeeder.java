package com.mathverse.seed;

import com.mathverse.knowledge.entity.KnowledgeNode;
import com.mathverse.knowledge.entity.KnowledgeRelation;
import com.mathverse.knowledge.service.KnowledgeNodeService;
import com.mathverse.knowledge.service.KnowledgeRelationService;
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
                        "直线：两端无限延伸（用 $\\\\overleftrightarrow{AB}$ 表示）",
                        "射线：一个端点向一方无限延伸（用 $\\\\\\overrightarrow{AB}$ 表示）",
                        "线段：两个端点之间（用 $\\\\\\overline{AB}$ 表示）",
                        "两点确定一条直线",
                        "两点之间，线段最短（距离定义）"
                    ]},
                    {"type":"keypoints","title":"角","items":[
                        "角：从同一点出发的两条射线组成的图形",
                        "锐角：$0^\\\\\\circ<\\\\theta<90^\\\\\\circ$",
                        "直角：$\\\\theta=90^\\\\\\circ$",
                        "钝角：$90^\\\\\\circ<\\\\theta<180^\\\\\\circ$",
                        "平角：$\\\\theta=180^\\\\\\circ$，周角：$\\\\theta=360^\\\\\\circ$"
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
                    {"type":"definition","title":"定义","content":"由三条线段首尾顺次连接组成的封闭图形叫三角形。记作 $\\\\\\triangle ABC$。"},
                    {"type":"keypoints","title":"分类","items":[
                        "按角分：锐角三角形、直角三角形、钝角三角形",
                        "按边分：不等边三角形、等腰三角形、等边三角形",
                        "等腰三角形：两腰相等，两底角相等",
                        "等边三角形：三边相等，三角都是 $60^\\\\\\circ$"
                    ]},
                    {"type":"keypoints","title":"性质","items":[
                        "内角和：$\\\\\\angle A+\\\\\\angle B+\\\\\\angle C=180^\\\\\\circ$",
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
                    {"type":"definition","title":"定义","content":"两个三角形大小和形状完全相同，能够完全重合。记作 $\\\\\\triangle ABC\\\\\\cong\\\\\\triangle A'B'C'$。"},
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
                    {"type":"definition","title":"定义","content":"对应角相等、对应边成比例的三角形叫相似三角形。记作 $\\\\\\triangle ABC\\\\sim\\\\\\triangle A'B'C'$。相似比是对应边的比值。"},
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
                .summary("圆是到定点（圆心）距离等于定长（半径）的所有点的集合")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"定义","content":"平面上到定点 $O$ 的距离等于定长 $r$ 的所有点组成的图形叫圆。$O$ 是圆心，$r$ 是半径。"},
                    {"type":"keypoints","title":"基本元素","items":[
                        "弦：连接圆上任意两点的线段",
                        "直径：经过圆心的弦（最长的弦，$d=2r$）",
                        "弧：圆上任意两点间的部分（优弧 > 半圆 > 劣弧）",
                        "圆心角：顶点在圆心的角",
                        "圆周角：顶点在圆上、两边与圆相交的角"
                    ]},
                    {"type":"keypoints","title":"重要定理","items":[
                        "直径所对的圆周角是 $90^\\\\\\circ$",
                        "同弧所对的圆周角是圆心角的一半",
                        "垂径定理：垂直于弦的直径平分这条弦",
                        "切线性质：切线垂直于过切点的半径",
                        "切线长定理：从圆外一点引的两条切线长相等"
                    ]},
                    {"type":"keypoints","title":"圆的计算","items":[
                        "周长：$C=2\\\\pi r$",
                        "面积：$S=\\\\pi r^2$",
                        "弧长：$l=\\\\\\frac{n\\\\pi r}{180}$（$n$ 为圆心角度数）",
                        "扇形面积：$S=\\\\\\frac{n\\\\pi r^2}{360}$"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"直径为 10 的圆，圆心角为 60° 的弧长和扇形面积","steps":["r=5，n=60°","弧长 l=60×π×5/180=5π/3","扇形面积 S=60×π×25/360=25π/6"],"answer":"弧长 5π/3，面积 25π/6"}
                    ]}
                ]}""")
                .status(1).build());

        nodes.add(KnowledgeNode.builder()
                .id("MATH-05-010").title("圆幂定理").subtitle("相交弦、切割线、割线三定理的统一")
                .domain("几何").level("高中").difficulty(3).sortOrder(750)
                .visualType("static").milestoneType(null)
                .summary("圆幂定理是相交弦定理、切割线定理、割线定理的统一表达，核心是「圆幂」=\nOP²-r²")
                .contentJson("""
                {"sections":[
                    {"type":"definition","title":"圆幂的定义","content":"平面上一点 $P$ 对圆 $O$ 的幂定义为：$$\\\\text{幂}=OP^2-r^2$$ 其中 $r$ 为圆的半径。"},
                    {"type":"keypoints","title":"三大定理（圆幂定理的三种情形）","items":[
                        "相交弦定理：圆内两弦 $AB$、$CD$ 交于点 $P$，则 $PA\\\\cdot PB=PC\\\\cdot PD$（圆幂在圆内为负）",
                        "切割线定理：从圆外一点 $P$ 引切线 $PT$ 和割线 $PAB$，则 $PT^2=PA\\\\cdot PB$",
                        "割线定理：从圆外一点 $P$ 引两条割线分别交圆于 $A$、$B$ 和 $C$、$D$，则 $PA\\\\cdot PB=PC\\\\cdot PD$",
                        "统一表述：过定点 $P$ 作圆的任意弦（或割线），$P$ 到两交点的距离之积为定值，等于 $|OP^2-r^2|$"
                    ]},
                    {"type":"keypoints","title":"圆幂的正负","items":[
                        "$P$ 在圆外 $\\\\iff$ 幂 $>0$（切割线/割线定理适用）",
                        "$P$ 在圆上 $\\\\iff$ 幂 $=0$",
                        "$P$ 在圆内 $\\\\iff$ 幂 $<0$（相交弦定理适用）"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"圆中两弦 AB 和 CD 交于 P，PA=3，PB=6，PC=2，求 PD","steps":["相交弦定理：PA·PB=PC·PD","3×6=2×PD","PD=9"],"answer":"PD=9"},
                        {"question":"从圆外一点 P 引切线 PT=6，割线交圆于 A、B，若 PA=4，求 PB","steps":["切割线定理：PT²=PA·PB","36=4·PB","PB=9"],"answer":"PB=9"}
                    ]}
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
                        "柱体：$V=Sh$，$S_\\\\\\text{侧}=Ch$",
                        "锥体：$V=\\\\\\frac{1}{3}Sh$",
                        "球体：$V=\\\\\\frac{4}{3}\\\\pi r^3$，$S=4\\\\pi r^2$"
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
                        "两点式：$\\\\\\frac{y-y_1}{y_2-y_1}=\\\\\\frac{x-x_1}{x_2-x_1}$"
                    ]},
                    {"type":"keypoints","title":"圆的标准方程","items":[
                        "$(x-a)^2+(y-b)^2=r^2$，圆心 $(a,b)$，半径 $r$",
                        "一般式：$x^2+y^2+Dx+Ey+F=0$"
                    ]},
                    {"type":"keypoints","title":"距离公式","items":[
                        "两点距离：$d=\\\\\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$",
                        "点到直线：$d=\\\\\\frac{|Ax_0+By_0+C|}{\\\\\\sqrt{A^2+B^2}}$",
                        "平行线距离：$d=\\\\\\frac{|C_1-C_2|}{\\\\\\sqrt{A^2+B^2}}$"
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
                        "标准方程：$\\\\frac{x^2}{a^2}+\\\\frac{y^2}{b^2}=1$（$a>b>0$，焦点在 $x$ 轴）",
                        "关系：$c^2=a^2-b^2$，$e=\\\\frac{c}{a}<1$",
                        "顶点：$(\\\\pm a,0),(0,\\\\pm b)$，长轴 $2a$，短轴 $2b$",
                        "特殊情形：$a=b=r$ 时退化为圆 $x^2+y^2=r^2$"
                    ]},
                    {"type":"keypoints","title":"双曲线","items":[
                        "定义：到两焦点 $F_1,F_2$ 距离之差的绝对值为常数 $2a$（$<|F_1F_2|$）的点的轨迹",
                        "标准方程：$\\\\frac{x^2}{a^2}-\\\\frac{y^2}{b^2}=1$（焦点在 $x$ 轴）",
                        "关系：$c^2=a^2+b^2$，$e=\\\\frac{c}{a}>1$",
                        "渐近线：$y=\\\\pm\\\\frac{b}{a}x$（双曲线特有的直线）",
                        "顶点：$(\\\\pm a,0)$，实轴 $2a$，虚轴 $2b$"
                    ]},
                    {"type":"keypoints","title":"抛物线","items":[
                        "定义：到焦点 $F$ 距离等于到准线 $l$ 距离的点的轨迹",
                        "标准方程：$y^2=2px$（$p>0$，开口向右），$y^2=-2px$（向左）",
                        "$x^2=2py$（向上），$x^2=-2py$（向下）",
                        "焦点：$(\\\\frac{p}{2},0)$，准线：$x=-\\\\frac{p}{2}$（$y^2=2px$ 情形）",
                        "$e=1$（抛物线的离心率恒为 1）"
                    ]},
                    {"type":"keypoints","title":"三种曲线的对比","items":[
                        "椭圆 $e<1$，双曲线 $e>1$，抛物线 $e=1$",
                        "椭圆是封闭曲线，双曲线有两支，抛物线是开口曲线",
                        "共同点：都是二次曲线，都有焦点和准线",
                        "圆锥曲线的光学性质：椭圆（反射到另一焦点）、双曲线（反射到另一支焦点）、抛物线（反射到焦点方向）"
                    ]},
                    {"type":"example","title":"示例","items":[
                        {"question":"椭圆 $\\\\frac{x^2}{25}+\\\\frac{y^2}{16}=1$ 的 a、b、c、e 各是多少？","steps":["a²=25 ⇒ a=5","b²=16 ⇒ b=4","c²=a²-b²=9 ⇒ c=3","e=c/a=3/5=0.6"],"answer":"a=5,b=4,c=3,e=0.6"},
                        {"question":"双曲线 $\\\\frac{x^2}{9}-\\\\frac{y^2}{16}=1$ 的渐近线方程？","steps":["a²=9 ⇒ a=3","b²=16 ⇒ b=4","渐近线：y=±(b/a)x=±(4/3)x"],"answer":"y=±(4/3)x"}
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
