import { create } from 'zustand';
import type { KnowledgeGraphVO } from '@/types';

interface GraphStore {
  graphData: KnowledgeGraphVO | null;
  loading: boolean;
  currentDomain: string | null;
  selectedNodeId: string | null;
  setGraphData: (data: KnowledgeGraphVO) => void;
  setLoading: (loading: boolean) => void;
  setCurrentDomain: (domain: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
}

export const useGraphStore = create<GraphStore>((set) => ({
  graphData: null,
  loading: false,
  currentDomain: null,
  selectedNodeId: null,
  setGraphData: (data) => set({ graphData: data }),
  setLoading: (loading) => set({ loading }),
  setCurrentDomain: (domain) => set({ currentDomain: domain }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
}));
