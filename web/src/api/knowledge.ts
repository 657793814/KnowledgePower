import request from './request';
import type { KnowledgeGraphVO, KnowledgeNode, KnowledgeNodeDetailVO, PageResult } from '@/types';

/** 获取知识图谱 */
export const fetchGraph = (subject: string, domain?: string) => {
  let url = domain ? `/knowledge/graph/${encodeURIComponent(domain)}` : '/knowledge/graph';
  if (subject !== 'math') {
    url += (url.includes('?') ? '&' : '?') + `subject=${subject}`;
  }
  return request.get<KnowledgeGraphVO>(url).then(r => r.data);
}

/** 获取知识点详情 */
export const fetchKnowledgeDetail = (id: string) =>
  request.get<KnowledgeNodeDetailVO>(`/knowledge/nodes/${id}`)
    .then(r => r.data);

/** 知识点列表 */
export const fetchKnowledgeList = (params: {
  domain?: string;
  level?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}) => request.get<PageResult<KnowledgeNode>>('/knowledge/nodes', { params })
  .then(r => r.data);

/** 搜索知识点 */
export const searchKnowledge = (q: string, subject?: string) =>
  request.get<KnowledgeNode[]>('/knowledge/search', { params: { q, subject } })
    .then(r => r.data);

/** 新增知识点 */
export const createKnowledge = (data: any) =>
  request.post('/knowledge/nodes', data);

/** 更新知识点 */
export const updateKnowledge = (id: string, data: any) =>
  request.put(`/knowledge/nodes/${id}`, data);

/** 删除知识点 */
export const deleteKnowledge = (id: string) =>
  request.delete(`/knowledge/nodes/${id}`);
