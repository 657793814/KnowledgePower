import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input, Spin, Empty, Pagination } from 'antd';
import { searchKnowledge } from '@/api';
import { KnowledgeCard } from '@/components';
import type { KnowledgeNode } from '@/types';
import { useSubjectStore } from '@/store/subjectStore';

export default function SearchPage() {
  const { currentSubject } = useSubjectStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<KnowledgeNode[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(q);

  useEffect(() => {
    if (!q) {
      setResults([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    const subject = currentSubject;
    searchKnowledge(q, subject, page, pageSize)
      .then((res: any) => {
        if (res && res.items) {
          setResults(res.items);
          setTotal(res.total);
        } else if (Array.isArray(res)) {
          // 兼容旧响应格式
          setResults(res);
          setTotal(res.length);
        }
      })
      .finally(() => setLoading(false));
  }, [q, currentSubject, page, pageSize]);

  const handleSearch = (value: string) => {
    if (value.trim()) {
      setPage(1);
      setSearchParams({ q: value });
    }
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h2 style={{ fontSize: 20, marginBottom: 16 }}>🔍 搜索</h2>
      <Input.Search
        placeholder="输入关键字搜索当前学科知识点..."
        allowClear
        size="large"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
      />
      {currentSubject && (
        <div style={{ marginBottom: 16, fontSize: 13, color: '#94a3b8' }}>
          当前学科：{currentSubject} {total > 0 && `（共 ${total} 条结果）`}
        </div>
      )}

      {loading ? (
        <Spin style={{ display: 'block', textAlign: 'center', padding: 40 }} />
      ) : q ? (
        results.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {results.map(node => (
                <KnowledgeCard key={node.id} node={node} />
              ))}
            </div>
            {total > pageSize && (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Pagination
                  current={page}
                  total={total}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showTotal={(t) => `共 ${t} 条结果`}
                />
              </div>
            )}
          </>
        ) : (
          <Empty description={`未找到与 "${q}" 相关的知识点`} />
        )
      ) : (
        <Empty description="输入关键词，搜索当前学科知识点" />
      )}
    </div>
  );
}
