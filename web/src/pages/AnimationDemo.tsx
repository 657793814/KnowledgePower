/**
 * AnimationDemo — 动画演示大厅
 *
 * 按当前学科分类展示所有动画。
 * 通过侧边栏"🎬 动画演示"入口访问。
 *
 * 路径：/animation/demo
 */
import { useState } from 'react';
import { Card, Tabs, Tag, Space, Alert, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSubjectStore } from '@/store/subjectStore';
import { SUBJECT_LABELS } from '@/types';
import { SUBJECT_ANIMATIONS, animationRegistry } from '@/components/Animation/AnimationContainer';
import type { TabsProps } from 'antd';

export default function AnimationDemo() {
  const { currentSubject } = useSubjectStore();
  const navigate = useNavigate();
  const animations = SUBJECT_ANIMATIONS[currentSubject] || [];

  if (animations.length === 0) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px 60px' }}>
        <Empty
          description={`${SUBJECT_LABELS[currentSubject]} 暂无动画演示`}
          style={{ paddingTop: 80 }}
        >
          <p style={{ fontSize: 14, color: '#94a3b8' }}>
            切换到数学或其他学科查看已有动画
          </p>
        </Empty>
      </div>
    );
  }

  const items: TabsProps['items'] = animations.map(anim => {
    const Component = animationRegistry[anim.type];

    return {
      key: anim.key,
      label: (
        <span>
          <span>{anim.icon}</span>
          <span style={{ marginLeft: 4 }}>{anim.label}</span>
        </span>
      ),
      children: (
        <Card
          size="small"
          style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
              {anim.description}
            </p>
            <Space style={{ marginTop: 8 }} wrap>
              {anim.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
              {anim.nodes && anim.nodes.length > 0 && (
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                  🏷️ 关联知识点：
                  {anim.nodes.map(id => (
                    <a key={id} href={`/knowledge/${id}`}
                      style={{ marginLeft: 4, fontSize: 12 }}>
                      {id}
                    </a>
                  ))}
                </span>
              )}
            </Space>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {Component ? <Component /> : (
              <Alert
                type="warning"
                message={`动画「${anim.type}」组件未注册`}
                showIcon
              />
            )}
          </div>
        </Card>
      ),
    };
  });

  const [activeKey, setActiveKey] = useState(items[0]?.key || '');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px 60px' }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 22, margin: 0 }}>
          🎬 动画演示{/* · {SUBJECT_LABELS[currentSubject]} */}
        </h2>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
          {SUBJECT_LABELS[currentSubject]}所有 Canvas 动画集中展示，点击播放体验效果
        </p>
      </div>

      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={items}
        tabBarStyle={{ marginBottom: 0 }}
      />

      <div style={{ marginTop: 32, padding: '16px 20px', background: '#f0f9ff', borderRadius: 8, border: '1px solid #bae6fd' }}>
        <h4 style={{ margin: '0 0 8px', color: '#0369a1', fontSize: 14 }}>💡 动画在知识点中的显示</h4>
        <p style={{ fontSize: 13, color: '#0c4a6e', lineHeight: 1.7, margin: 0 }}>
          动画演示会自动嵌入到对应知识点的详情页底部。<br />
          在练习错题时，如果该知识点有对应的动画，也会显示「动画演示」按钮。<br />
          新动画添加步骤：
          1️⃣ 在 <code>animations/</code> 下创建组件
          2️⃣ 在 <code>AnimationContainer.tsx</code> 注册
          3️⃣ 关联到知识点或通过 <code>SUBJECT_ANIMATIONS</code> 加入学科分类
        </p>
      </div>
    </div>
  );
}
