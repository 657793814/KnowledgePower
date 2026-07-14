import { Select, Space, Tag, Typography } from 'antd';
import { SUBJECT_DOMAINS, LEVEL_COLORS } from '@/types';
import { useSubjectStore } from '@/store/subjectStore';

interface Props {
  currentDomain: string | null;
  currentLevel: string | null;
  onDomainChange: (domain: string | null) => void;
  onLevelChange: (level: string | null) => void;
  totalNodeCount: number;
}

export default function GraphControls({ currentDomain, currentLevel, onDomainChange, onLevelChange, totalNodeCount }: Props) {
  const { currentSubject } = useSubjectStore();
  const domainLabels = SUBJECT_DOMAINS[currentSubject] || {};

  const domainOptions = [
    { value: '', label: '全部领域' },
    ...Object.entries(domainLabels).map(([key, label]) => ({
      value: key,
      label: String(label),
    })),
  ];

  return (
    <div style={{
      padding: '12px 24px',
      background: '#fff',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
        领域筛选：
      </Typography.Text>
      <Select
        value={currentDomain || ''}
        onChange={(val) => onDomainChange(val || null)}
        options={domainOptions}
        style={{ width: 200 }}
      />
      <Select
        value={currentLevel || ''}
        onChange={(val) => onLevelChange(val || null)}
        options={[
          { value: '', label: '全部学段' },
          { value: '初中', label: '初中' },
          { value: '高中', label: '高中' },
        ]}
        style={{ width: 120 }}
      />
      <div style={{ flex: 1 }} />
      <Tag color="default">{totalNodeCount} 个知识点</Tag>
    </div>
  );
}
