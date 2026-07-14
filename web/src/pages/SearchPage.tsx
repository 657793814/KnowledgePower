import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input, Spin, Empty } from 'antd';
import { searchKnowledge } from '@/api';
import { KnowledgeCard } from '@/components';
import type { KnowledgeNode } from '@/types';
import { useSubjectStore } from '@/store/subjectStore';

export default function SearchPage() {
  const { currentSubject } = useSubjectStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<KnowledgeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(q);

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchKnowledge(q, currentSubject !== 'math' ? currentSubject : undefined)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [q, currentSubject]);

  const handleSearch = (value: string) => {
    if (value.trim()) {
      setSearchParams({ q: value });
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h2 style={{ fontSize: 20, marginBottom: 16 }}>🔍 搜索知识点</h2>
      <Input.Search
        placeholder="输入关键字搜索..."
        allowClear
        size="large"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onSearch={handleSearch}
        style={{ marginBottom: 24 }}
      />

      {loading ? (
        <Spin style={{ display: 'block', textAlign: 'center', padding: 40 }} />
      ) : q ? (
        results.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {results.map(node => (
              <KnowledgeCard key={node.id} node={node} />
            ))}
          </div>
        ) : (
          <Empty description={`未找到与 "${q}" 相关的知识点`} />
        )
      ) : (
        <Empty description="输入关键词，搜索数学知识点" />
      )}
    </div>
  );
}
