-- ============================================
-- MathVerse Phase 4 — 训练考试系统
-- ============================================

USE mathverse;

-- 题目表
CREATE TABLE IF NOT EXISTS exam_question (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    node_id         VARCHAR(32)     NOT NULL COMMENT '关联知识点编码',
    domain          VARCHAR(20)     NOT NULL COMMENT '所属领域',
    level           VARCHAR(10)     NOT NULL COMMENT '难度层级',
    question_type   VARCHAR(20)     NOT NULL COMMENT '题型：choice/fill/true_false/short_answer',
    difficulty      TINYINT         NOT NULL DEFAULT 1 COMMENT '难度 1-5',
    title           TEXT            NOT NULL COMMENT '题目内容（支持 KaTeX）',
    options         JSON            DEFAULT NULL COMMENT '选择题选项：{A:..., B:..., C:..., D:...}',
    answer          TEXT            NOT NULL COMMENT '正确答案',
    explanation     TEXT            DEFAULT NULL COMMENT '答案解析',
    tags            VARCHAR(500)    DEFAULT NULL COMMENT '标签（逗号分隔）',
    status          TINYINT         NOT NULL DEFAULT 1 COMMENT '0=草稿 1=发布',
    deleted         TINYINT         NOT NULL DEFAULT 0,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_node (node_id),
    INDEX idx_domain (domain),
    INDEX idx_type (question_type),
    INDEX idx_difficulty (difficulty),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题目表';

-- 试卷表
CREATE TABLE IF NOT EXISTS exam_paper (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(200)    NOT NULL COMMENT '试卷名称',
    domain          VARCHAR(20)     DEFAULT NULL COMMENT '限定领域（null=全领域）',
    level           VARCHAR(10)     DEFAULT NULL COMMENT '限定层级',
    mode            VARCHAR(20)     NOT NULL DEFAULT 'practice' COMMENT '模式：practice/exam',
    question_count  INT             NOT NULL DEFAULT 0 COMMENT '题目数量',
    time_limit      INT             DEFAULT NULL COMMENT '限时（分钟，null=不限）',
    allow_retry     TINYINT         NOT NULL DEFAULT 1 COMMENT '是否允许重试',
    question_ids    TEXT            NOT NULL COMMENT '组合的题目 ID 列表（逗号分隔）',
    created_by      BIGINT          DEFAULT NULL COMMENT '创建人',
    status          TINYINT         NOT NULL DEFAULT 1 COMMENT '0=草稿 1=发布',
    deleted         TINYINT         NOT NULL DEFAULT 0,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_domain (domain),
    INDEX idx_mode (mode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='试卷表';

-- 答题记录表
CREATE TABLE IF NOT EXISTS exam_answer (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT          NOT NULL COMMENT '答题用户',
    paper_id        BIGINT          DEFAULT NULL COMMENT '试卷 ID（null=自由练习）',
    question_id     BIGINT          NOT NULL COMMENT '题目 ID',
    node_id         VARCHAR(32)     NOT NULL COMMENT '关联知识点',
    user_answer     TEXT            DEFAULT NULL COMMENT '用户答案',
    is_correct      TINYINT         DEFAULT NULL COMMENT '是否正确：0=错 1=对',
    score           DECIMAL(5,1)    DEFAULT NULL COMMENT '得分',
    time_spent      INT             DEFAULT NULL COMMENT '用时（秒）',
    submitted_at    DATETIME        DEFAULT NULL COMMENT '提交时间',
    INDEX idx_user (user_id),
    INDEX idx_paper (paper_id),
    INDEX idx_question (question_id),
    INDEX idx_node (node_id),
    INDEX idx_correct (is_correct)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='答题记录表';

-- 错题本（从答题记录中标记收藏的错题）
CREATE TABLE IF NOT EXISTS exam_wrong_book (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT          NOT NULL COMMENT '用户',
    question_id     BIGINT          NOT NULL COMMENT '题目',
    node_id         VARCHAR(32)     NOT NULL COMMENT '知识点',
    review_count    INT             NOT NULL DEFAULT 0 COMMENT '复习次数',
    last_review_at  DATETIME        DEFAULT NULL COMMENT '最后复习时间',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_question (user_id, question_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='错题本';
