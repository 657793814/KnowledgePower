-- ============================================
-- MathVerse 数据库初始化
-- ============================================

CREATE DATABASE IF NOT EXISTS mathverse DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE mathverse;

-- 知识点表
CREATE TABLE IF NOT EXISTS knowledge_node (
    id              VARCHAR(32)     NOT NULL COMMENT '知识点编码，如 MATH-01-001',
    title           VARCHAR(200)    NOT NULL COMMENT '知识点名称',
    subtitle        VARCHAR(500)    DEFAULT NULL COMMENT '副标题/一句话定义',
    domain          VARCHAR(20)     NOT NULL COMMENT '所属领域',
    level           VARCHAR(10)     NOT NULL COMMENT '难度层级：初中/高中',
    difficulty      TINYINT         NOT NULL DEFAULT 1 COMMENT '难度 1-5',
    sort_order      INT             NOT NULL DEFAULT 0 COMMENT '领域内排序',
    visual_type     VARCHAR(50)     DEFAULT NULL COMMENT '可视化类型：canvas/svg/three/static',
    summary         TEXT            DEFAULT NULL COMMENT '一句话精髓',
    content_json    JSON            DEFAULT NULL COMMENT '知识点详细内容（结构化 JSON）',
    milestone_type  VARCHAR(20)     DEFAULT NULL COMMENT '总结节点类型：section_end/domain_end',
    deleted         TINYINT         NOT NULL DEFAULT 0 COMMENT '逻辑删除：0=正常 1=删除',
    status          TINYINT         NOT NULL DEFAULT 1 COMMENT '状态：0=草稿 1=发布',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_domain (domain),
    INDEX idx_level (level),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识点表';

-- 知识点关系表
CREATE TABLE IF NOT EXISTS knowledge_relation (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    from_node_id    VARCHAR(32)     NOT NULL COMMENT '前驱知识点编码',
    to_node_id      VARCHAR(32)     NOT NULL COMMENT '后继知识点编码',
    relation_type   VARCHAR(20)     NOT NULL COMMENT '关系类型：prerequisite/next/reference/summary_of',
    sort_order      INT             NOT NULL DEFAULT 0 COMMENT '排序',
    description     VARCHAR(500)    DEFAULT NULL COMMENT '关系描述',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_from (from_node_id),
    INDEX idx_to (to_node_id),
    INDEX idx_type (relation_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识点关系表';

-- 用户表
CREATE TABLE IF NOT EXISTS user (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(50)     NOT NULL UNIQUE,
    password        VARCHAR(255)    NULL COMMENT '密码（暂未启用认证）',
    nickname        VARCHAR(50)     DEFAULT NULL,
    avatar          VARCHAR(500)    DEFAULT NULL,
    role            VARCHAR(20)     NOT NULL DEFAULT 'user' COMMENT 'user/admin',
    status          TINYINT         NOT NULL DEFAULT 1,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
