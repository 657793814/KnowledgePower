import { useEffect, useState } from 'react';
import { fetchGraph, fetchKnowledgeDetail } from '@/api';
import type { KnowledgeGraphVO, KnowledgeNodeDetailVO } from '@/types';
import { useGraphStore } from '@/store/graphStore';
import { useSubjectStore } from '@/store/subjectStore';

export function useGraphData(domain?: string) {
  const { graphData, loading, setGraphData, setLoading } = useGraphStore();
  const { currentSubject } = useSubjectStore();

  useEffect(() => {
    setLoading(true);
    fetchGraph(currentSubject, domain)
      .then((data) => {
        setGraphData(data);
      })
      .finally(() => setLoading(false));
  }, [currentSubject, domain]);

  return { graphData, loading };
}

export function useKnowledgeDetail(id: string) {
  const [detail, setDetail] = useState<KnowledgeNodeDetailVO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchKnowledgeDetail(id)
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [id]);

  return { detail, loading };
}
