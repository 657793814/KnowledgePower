// ===== 知识点相关类型 =====
export interface KnowledgeNode {
  id: string;
  title: string;
  subtitle?: string;
  subject: string;
  domain: string;
  level: string;
  difficulty: number;
  sortOrder: number;
  visualType: string;
  summary: string;
  contentJson: any;
  milestoneType: string | null;
  status: number;
  deleted: number;
  createdAt: string;
  updatedAt: string;
}

export interface GraphNodeVO {
  id: string;
  label: string;
  subject: string;
  domain: string;
  level: string;
  difficulty: number;
  isMilestone: boolean;
}

export interface GraphEdgeVO {
  source: string;
  target: string;
  type: string;
  description?: string;
}

export interface KnowledgeGraphVO {
  nodes: GraphNodeVO[];
  edges: GraphEdgeVO[];
}

export interface RelationVO {
  nodeId: string;
  title: string;
  relationType: string;
  description?: string;
}

export interface KnowledgeNodeDetailVO {
  id: string;
  title: string;
  subtitle?: string;
  subject: string;
  domain: string;
  level: string;
  difficulty: number;
  sortOrder: number;
  visualType?: string;
  summary?: string;
  contentJson: any;
  milestoneType?: string | null;
  status?: number;
  prerequisites: RelationVO[];
  nextNodes: RelationVO[];
  references: RelationVO[];
}

export interface PageResult<T> {
  total: number;
  page: number;
  pageSize: number;
  records: T[];
}

export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface VisualConfig {
  type: 'canvas' | 'three' | 'svg';
  component: string;
  config: Record<string, any>;
}

// ===== 考试系统类型 =====
export interface ExamQuestionVO {
  id: number;
  nodeId: string;
  nodeTitle: string;
  subject: string;
  domain: string;
  level: string;
  questionType: string;
  difficulty: number;
  title: string;
  options?: string;  // JSON string
  answer: string;
  explanation?: string;
  tags?: string;
}

export interface ExamPaperVO {
  id: number;
  title: string;
  domain?: string;
  level?: string;
  mode: string;
  questionCount: number;
  timeLimit?: number;
  allowRetry: number;
  questions: ExamQuestionVO[];
}

export interface ExamResultVO {
  paperId?: number;
  totalCount: number;
  correctCount: number;
  wrongCount: number;
  score: number;
  totalTimeSpent?: number;
  details: AnswerResult[];
}

export interface AnswerResult {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  correct: boolean;
  explanation: string;
}

export interface ExamStatsVO {
  totalAnswered: number;
  totalCorrect: number;
  accuracyRate: number;
  wrongBookCount: number;
  domainStats: DomainStat[];
}

export interface DomainStat {
  domain: string;
  answered: number;
  correct: number;
  accuracyRate: number;
}

export interface AiAskResp {
  answer: string;
  success: boolean;
  error?: string;
}

export interface WrongBookVO {
  questionId: number;
  title: string;
  questionType: string;
  nodeId: string;
  nodeTitle: string;
  domain: string;
  correctAnswer: string;
  explanation: string;
  reviewCount: number;
}
