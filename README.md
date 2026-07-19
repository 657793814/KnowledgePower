# KnowledgePower 知识动力

交互式知识图谱 + 训练系统 + AI 导师 + RAG 知识库

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Tech Stack](https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen) ![Tech Stack](https://img.shields.io/badge/Node.js-18-green) ![Tech Stack](https://img.shields.io/badge/SQLite-blue) ![Tech Stack](https://img.shields.io/badge/MySQL-8.0-orange) ![Tech Stack](https://img.shields.io/badge/Tauri-v2-purple)

---

## 📸 截图

![知识动力 主界面](docs/screenshots/image.png)

![知识动力 科目知识目录](docs/screenshots/image2.png)

![知识动力 题型模型](docs/screenshots/image3.png)

![知识动力 题型模型](docs/screenshots/image4.png)

---

## 项目结构

```
KnowledgePower/
├── config/                     # ⚙️ 配置文件
│   ├── ai-config.json          # AI 配置（已忽略，见 .example）
│   └── ai-config.json.example  # AI 配置样例
├── node-server/                # 🟡 Node.js 后端 (Express + SQLite + Prisma)
│   ├── prisma/                 # Prisma ORM 配置与数据库
│   └── src/
│       ├── routes/             # REST API 路由
│       │   ├── ai.ts           # AI 问答/解析/推荐/组卷
│       │   ├── admin.ts        # 管理员配置管理
│       │   ├── exam.ts         # 考试/练习/错题本
│       │   ├── knowledgeNodes.ts    # 知识点 CRUD
│       │   ├── knowledgeRelations.ts # 知识点关系
│       │   ├── knowledgeGraph.ts    # 知识图谱
│       │   ├── knowledgeSearch.ts   # 全文搜索
│       │   ├── auth.ts         # 认证
│       │   └── user.ts         # 用户
│       ├── services/           # 业务服务层
│       │   ├── aiService.ts    # AI 核心服务（含 RAG 检索）
│       │   ├── examService.ts  # 考试服务
│       │   └── ragService.ts   # RAG 向量检索服务
│       ├── seeders/            # 数据种子（数学/物理/化学共 20+ 领域）
│       ├── middlewares/        # 中间件（认证、管理员权限）
│       └── utils/              # 工具函数
├── web/                        # 🔵 前端 (React + Vite + TypeScript)
│   └── src/
│       ├── api/                # API 接口层
│       ├── components/         # UI 组件库
│       │   ├── Graph/          # 知识图谱可视化
│       │   ├── Visual/         # 可视化组件（几何、复数平面、三角函数等）
│       │   ├── Animation/      # 数学动画（方程平衡、函数变换等）
│       │   ├── ai/             # AI 对话面板
│       │   └── Card/           # 卡片组件
│       ├── pages/              # 页面视图
│       │   ├── admin/          # 管理员页面（知识点管理、AI 设置、文档管理）
│       │   │   ├── Dashboard.tsx      # 知识点列表管理
│       │   │   ├── KnowledgeEdit.tsx  # 知识点编辑
│       │   │   ├── AiSettingsPage.tsx # AI 配置管理
│       │   │   └── DocumentsPage.tsx  # RAG 文档统计
│       │   ├── exam/           # 练习/统计/错题本
│       │   ├── auth/           # 登录/注册
│       │   ├── GraphPage.tsx   # 知识图谱可视化
│       │   ├── KnowledgeDetail.tsx    # 知识点详情
│       │   ├── SearchPage.tsx  # 全文搜索
│       │   └── AnimationDemo.tsx      # 动画演示
│       ├── store/              # 状态管理（Zustand）
│       └── types/              # TypeScript 类型定义
├── server/                     # 🟢 Java 后端 (Spring Boot + MySQL)
├── src-tauri/                  # ⚪ Tauri v2 桌面壳 (Rust)
├── knowledge-base/             # 📚 知识库 Markdown 文档 + RAG 嵌入脚本
│   ├── embeddings/             # 向量嵌入模块（Ollama）
│   ├── parsers/                # 文档解析模块（PDF/Markdown）
│   ├── vector_store/           # 向量存储模块（Milvus）
│   └── ingest.py               # RAG 数据导入脚本
├── doc/                        # 📖 项目文档
├── docker/                     # 🐳 Docker 配置
├── scripts/                    # 📦 打包脚本
└── start.sh                    # 🚀 一键启动
```

### 模块职责说明

| 模块 | 职责 | 核心功能 |
|------|------|----------|
| **config** | AI 配置管理 | AI 服务商、模型参数、RAG 开关 |
| **node-server** | Node.js 后端服务 | REST API、AI 集成、RAG 检索 |
| **web** | 前端应用 | 知识图谱可视化、AI 聊天、练习系统、管理后台 |
| **server** | Java 后端服务 | 备用后端（MySQL + Redis） |
| **src-tauri** | 桌面端壳 | 跨平台桌面应用打包 |
| **knowledge-base** | 知识库内容 | Markdown 文档 + RAG 向量数据导入 |

---

## 快速开始

### 环境要求

| 工具 | 最低版本 |
|------|---------|
| Node.js | 18.x |
| pnpm | 8.x (或 npm) |
| Java | 21 (Java 后端) |
| Docker | 可选（MySQL/Milvus） |
| Ollama | 可选（RAG 嵌入） |
| Milvus | 可选（RAG 向量库） |

### 启动开发环境

```bash
# 第一步：安装依赖
cd node-server && npm install
cd ../web && npm install

# 第二步：配置 AI（复制样例文件并填写 API Key）
cp config/ai-config.json.example config/ai-config.json
# 编辑 config/ai-config.json，填入你的 API Key

# 第三步：启动服务（Node.js + SQLite，零依赖）
./start.sh node
```

启动后访问:
- **前端**: http://localhost:8082
- **Node.js 后端**: http://localhost:3001

### 后端切换说明

```bash
./start.sh node     # Node.js + SQLite (推荐，零依赖)
./start.sh java     # Java + MySQL (需先启动 Docker)
./start.sh frontend # 只启动前端（后端已在其他地方运行）
```

---

## AI 配置

### 配置文件

AI 配置存储在 `config/ai-config.json`，支持运行时热重载，无需重启服务。

**样例文件**: [ai-config.json.example](file:///Users/liuzuodong/Documents/workspace/ZDKnowledge/config/ai-config.json.example)

### 配置项说明

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `provider` | string | `openai` | AI 服务商类型 |
| `baseUrl` | string | Agnes API | OpenAI 兼容 API 地址 |
| `apiKey` | string | - | API 密钥（敏感信息，不要提交） |
| `model` | string | `agnes-2.0-flash` | 聊天模型名称 |
| `maxTokens` | number | 4096 | 单次请求最大 token 数 |
| `maxContextChars` | number | 3000 | 上下文截断阈值 |
| `temperature` | number | 0.7 | 温度参数（控制随机性） |
| `topP` | number | 0.9 | 核采样参数 |
| `ragEnabled` | boolean | false | 是否启用 RAG（知识库检索增强） |
| `ragTopK` | number | 5 | RAG 返回条数 |
| `ragMinScore` | number | 0.65 | RAG 最低匹配分数 |
| `embeddingModel` | string | `nomic-embed-text` | 向量嵌入模型（Ollama） |
| `embeddingDim` | number | 768 | 嵌入向量维度 |
| `ollamaBaseUrl` | string | `http://localhost:11434` | Ollama 本地服务地址 |

### 配置管理

管理员可通过前端管理页面或 API 动态修改配置：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/admin/ai-config` | GET | 获取当前配置（API Key 脱敏显示） |
| `/admin/ai-config` | PUT | 更新配置（自动写入 JSON 文件并热重载） |
| `/admin/ai-config/test` | POST | 测试 AI 连接 |

### Java 后端配置方式

Java 后端通过 `start.sh` 脚本自动读取 `config/ai-config.json`，并将配置注入为环境变量传递给 Spring Boot：

```bash
# 启动 Java 后端时，脚本会自动读取配置
./start.sh java
# 输出示例: 📖 加载 AI 配置...
#          Provider: openai | Model: agnes-2.0-flash | API Key: sk-TLbyiq...
```

配置映射关系：

| JSON 配置项 | Java 环境变量 | Spring Boot 配置 |
|-------------|--------------|------------------|
| `provider` | `AGNES_PROVIDER` | `ai.provider` |
| `baseUrl` | `AGNES_API_BASE_URL` | `ai.api-base-url` |
| `apiKey` | `AGNES_API_KEY` | `ai.api-key` |
| `model` | `AGNES_MODEL` | `ai.model` |
| `maxTokens` | `AGNES_MAX_TOKENS` | `ai.max-tokens` |
| `maxContextChars` | `AGNES_MAX_CONTEXT_CHARS` | `ai.max-context-chars` |

> **注意**：Java 后端不支持运行时热重载配置，修改配置后需重启服务生效。

### RAG 知识库配置

启用 RAG 需要额外部署：

```bash
# 1. 启动 Ollama（向量嵌入）
ollama run nomic-embed-text

# 2. 启动 Milvus（向量数据库，使用 Docker）
./scripts/milvus.sh start

# 3. 导入知识库（Markdown → 向量）
./scripts/ingest.sh

# 4. 在配置中启用 RAG
# 修改 config/ai-config.json: "ragEnabled": true
```

---

## 核心功能

### 知识图谱
- 知识点节点管理、关系维护（前置/后续/关联）
- 交互式图谱可视化（D3.js）
- 按领域分组浏览
- 全文搜索 + 过滤

### AI 导师
- 智能知识问答（支持 LaTeX 公式）
- 错题解析（分析错误原因 + 变式题）
- 学习路径推荐（基于正确率统计）
- AI 智能组卷（针对性练习）
- RAG 增强（结合教材文档）

### 练习系统
- 随机出题、智能组卷
- 答题评分、实时反馈
- 错题本管理
- 学习统计（各领域正确率）

### 可视化组件

**数学可视化**
- 几何图形可视化（GeometryVisual）
- 复数平面（ComplexPlane）
- 三角函数圆（TrigCircle）
- 函数变换动画（FunctionTransform）
- 方程平衡动画（EquationBalance）
- 数列可视化（SequenceVisual）
- 幂函数圆（CirclePower）
- 数轴（NumberLine）

**物理可视化**
- 受力分析图（ForceDiagram）
- 光学演示（OpticsDemo）
- 自由落体动画（FreeFall）

**化学可视化**
- 分子结构视图（MoleculeView）

---

## 后端 API

### 认证
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/auth/login` | 登录 |
| POST | `/auth/register` | 注册（需管理员） |
| GET | `/auth/profile` | 获取个人信息（需登录） |
| PUT | `/auth/profile` | 修改昵称/头像（需登录） |
| GET | `/auth/users` | 用户列表（需管理员） |
| PUT | `/auth/users/:id` | 修改用户角色/状态（需管理员） |

### 用户
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/user/info` | 当前用户信息 |

### 知识点
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/knowledge/nodes` | 分页列表 |
| GET | `/knowledge/nodes/:id` | 详情（含前后关系） |
| POST | `/knowledge/nodes` | 创建 |
| PUT | `/knowledge/nodes/:id` | 更新 |
| DELETE | `/knowledge/nodes/:id` | 删除 |
| GET | `/knowledge/nodes/by-domain` | 按领域分组统计 |
| GET | `/knowledge/search?q=xxx` | 搜索 |

### 知识图谱
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/knowledge/graph` | 全量图谱（节点+边） |

### 知识点关系
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/knowledge/relations` | 关系列表 |
| POST | `/knowledge/relations` | 创建 |
| PUT | `/knowledge/relations/:id` | 更新 |
| DELETE | `/knowledge/relations/:id` | 删除 |

### 考试/练习
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/exam/random?count=N&domain=xxx` | 随机出题（支持学科/领域/难度筛选） |
| POST | `/exam/submit` | 提交作答 |
| GET | `/exam/stats` | 学习统计（需登录） |
| GET | `/exam/wrong-book` | 错题本（需登录） |
| DELETE | `/exam/wrong-book/:questionId` | 移除错题（需登录） |
| POST | `/exam/wrong-book/:questionId/review` | 标记已复习（需登录） |
| POST | `/exam/generate` | 规则组卷 |
| POST | `/exam/auto-generate` | AI 智能组卷 |
| GET | `/exam/paper/:paperId` | 获取试卷详情 |

### 题库管理
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/exam/questions` | 题库列表（支持筛选） |
| GET | `/exam/questions/:id` | 题目详情 |
| POST | `/exam/questions` | 创建题目 |
| PUT | `/exam/questions/:id` | 更新题目 |
| DELETE | `/exam/questions/:id` | 删除题目（软删除） |

### AI
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/ai/ask` | 知识问答 |
| POST | `/ai/explain` | 错题解析 |
| POST | `/ai/recommend` | 学习建议 |
| POST | `/ai/generate-paper` | AI 智能组卷 |

### 管理员
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/ai-config` | 获取 AI 配置 |
| PUT | `/admin/ai-config` | 更新 AI 配置 |
| POST | `/admin/ai-config/test` | 测试 AI 连接 |
| GET | `/admin/documents/stats` | RAG 文档统计 |

### 健康检查
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 服务健康检查 |

---

## 数据库

### Node.js 后端 (SQLite)

数据库文件: `node-server/prisma/knowledgepower.db`

```bash
# 初始化（自动创建并 seed）
cd node-server && npx prisma db push --skip-generate
npx tsx src/seeders/index.ts

# Prisma Studio 可视化管理
npx prisma studio
```

### Java 后端 (MySQL)

```bash
# 启动 MySQL
docker compose -f docker/docker-compose.yml up -d

# 建库
mysql -h 127.0.0.1 -u root -p -e "CREATE DATABASE knowledgepower DEFAULT CHARSET utf8mb4"
mysql -h 127.0.0.1 -u root -p knowledgepower < server/src/main/resources/db/init.sql
```

---

## 桌面端 (Tauri v2)

```bash
# 开发模式
cd web && npm run tauri dev

# 打包
cd web && npm run tauri build
```

---

## 技术栈

| 层 | 技术 |
|----|------|
| **前端** | React 18, TypeScript, Vite, Ant Design 5, D3.js, KaTeX |
| **Node.js 后端** | Express 4, Prisma ORM, TypeScript, tsx |
| **Java 后端** | Spring Boot 3.3, MyBatis-Plus, JDK 21 |
| **数据库** | SQLite / MySQL 8.0 |
| **AI 引擎** | OpenAI 兼容 API (Agnes AI) |
| **RAG** | Ollama (嵌入) + Milvus (向量库) |
| **桌面壳** | Tauri v2 (Rust) |
| **状态管理** | Zustand |
| **路由** | React Router v6 |

---

## 知识领域

| # | 学科 | 领域 | 难度 |
|---|------|------|------|
| ① | 数学 | 数的世界 | 初中 → 高中 |
| ② | 数学 | 式 | 初中 → 高中 |
| ③ | 数学 | 方程与不等式 | 初中 → 高中 |
| ④ | 数学 | 函数 | 初中 → 高中 |
| ⑤ | 数学 | 几何 | 初中 → 高中 |
| ⑥ | 数学 | 排列组合与统计 | 初中 → 高中 |
| ⑦ | 数学 | 数列与导数 | 高中 |
| ⑧ | 物理 | 力学 | 初中 → 高中 |
| ⑨ | 物理 | 热学 | 初中 → 高中 |
| ⑩ | 物理 | 电磁学 | 初中 → 高中 |
| ⑪ | 物理 | 光学 | 初中 → 高中 |
| ⑫ | 物理 | 声学 | 初中 → 高中 |
| ⑬ | 物理 | 近代物理 | 高中 |
| ⑭ | 化学 | 物质结构 | 初中 → 高中 |
| ⑮ | 化学 | 化学反应 | 初中 → 高中 |
| ⑯ | 化学 | 元素周期律 | 初中 → 高中 |
| ⑰ | 化学 | 溶液 | 初中 → 高中 |
| ⑱ | 化学 | 有机化学 | 高中 |
| ⑲ | 化学 | 化学计算 | 高中 |