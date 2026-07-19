# KnowledgePower 知识动力

交互式知识图谱 + 训练系统 + AI 导师 + RAG 知识库

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Tech Stack](https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen) ![Tech Stack](https://img.shields.io/badge/Node.js-20-green) ![Tech Stack](https://img.shields.io/badge/SQLite-blue) ![Tech Stack](https://img.shields.io/badge/MySQL-8.0-orange) ![Tech Stack](https://img.shields.io/badge/Tauri-v2-purple)

---

## 📸 截图

![知识动力 主界面](docs/screenshots/image.png)

![知识动力 科目知识目录](docs/screenshots/image2.png)

![知识动力 题型模型](docs/screenshots/image3.png)

![知识动力 题型模型](docs/screenshots/image4.png)

![知识动力 AI导师](docs/screenshots/image5.png)

---

## 项目结构

```
KnowledgePower/
├── config/                     # ⚙️ 配置文件
│   ├── ai-config.json          # AI 配置（已忽略，见 .example）
│   └── ai-config.json.example  # AI 配置样例
├── node-server/                # 🟡 Node.js 后端 (Express + SQLite + Prisma)
│   ├── prisma/                 # Prisma ORM 配置与数据库
│   ├── scripts/                # 数据维护脚本
│   └── src/
│       ├── routes/             # REST API 路由
│       │   ├── ai.ts           # AI 问答/解析/推荐/组卷
│       │   ├── admin.ts        # 管理员配置管理
│       │   ├── exam.ts         # 考试/练习/错题本
│       │   ├── insight.ts      # 学习洞察
│       │   ├── knowledgeNodes.ts    # 知识点 CRUD
│       │   ├── knowledgeRelations.ts # 知识点关系
│       │   ├── knowledgeGraph.ts    # 知识图谱
│       │   ├── knowledgeSearch.ts   # 全文搜索
│       │   ├── auth.ts         # 认证
│       │   ├── upload.ts       # 文件上传
│       │   └── user.ts         # 用户
│       ├── services/           # 业务服务层
│       │   ├── aiService.ts    # AI 核心服务（含 RAG 检索）
│       │   ├── examService.ts  # 考试服务
│       │   ├── minioService.ts # MinIO 文件服务
│       │   └── ragService.ts   # RAG 向量检索服务
│       ├── seeders/            # 数据种子（数学/物理/化学/生物/英语/历史/政治/地理/计算机）
│       ├── middlewares/        # 中间件（认证、管理员权限）
│       └── utils/              # 工具函数
├── web/                        # 🔵 前端 (React + Vite + TypeScript)
│   └── src/
│       ├── api/                # API 接口层
│       ├── components/         # UI 组件库
│       │   ├── Graph/          # 知识图谱可视化
│       │   ├── Visual/         # 可视化组件（几何、复数平面、三角函数等）
│       │   ├── Animation/      # 数学动画（方程平衡、函数变换、将军饮马等）
│       │   ├── ai/             # AI 对话面板
│       │   ├── Layout/         # 布局组件
│       │   └── Card/           # 卡片组件
│       ├── pages/              # 页面视图
│       │   ├── admin/          # 管理员页面（知识点管理、AI 设置、文档管理、用户管理）
│       │   ├── exam/           # 练习/统计/错题本/模型训练
│       │   ├── auth/           # 登录/注册
│       │   ├── CosmicHome.tsx  # 宇宙首页（3D 动画）
│       │   ├── GraphPage.tsx   # 知识图谱可视化
│       │   ├── KnowledgeDetail.tsx    # 知识点详情（含动画演示）
│       │   ├── SearchPage.tsx  # 全文搜索
│       │   ├── InsightPage.tsx # 学习洞察
│       │   └── AnimationDemo.tsx      # 动画演示
│       ├── hooks/              # 自定义 Hooks
│       ├── store/              # 状态管理（Zustand）
│       └── types/              # TypeScript 类型定义
├── server/                     # 🟢 Java 后端 (Spring Boot + MySQL)
├── src-tauri/                  # ⚪ Tauri v2 桌面壳 (Rust)
├── knowledge-base/             # 📚 知识库 Markdown 文档 + RAG 嵌入脚本
│   ├── embeddings/             # 向量嵌入模块（Ollama）
│   ├── parsers/                # 文档解析模块（PDF/Markdown）
│   ├── vector_store/           # 向量存储模块（Milvus）
│   └── ingest.py               # RAG 数据导入脚本
├── docker/                     # 🐳 Docker 配置（MySQL、Redis、Milvus、Attu、MinIO、etcd）
├── scripts/                    # 📦 打包脚本
└── start.sh                    # 🚀 一键启动
```

### 模块职责说明

| 模块 | 职责 | 核心功能 |
|------|------|----------|
| **config** | AI 配置管理 | AI 服务商、模型参数、RAG 开关 |
| **node-server** | Node.js 后端服务 | REST API、AI 集成、RAG 检索、文件上传 |
| **web** | 前端应用 | 知识图谱可视化、AI 聊天、练习系统、管理后台、宇宙首页、学习洞察 |
| **server** | Java 后端服务 | 备用后端（MySQL + Redis） |
| **src-tauri** | 桌面端壳 | 跨平台桌面应用打包 |
| **knowledge-base** | 知识库内容 | Markdown 文档 + RAG 向量数据导入 |
| **docker** | 容器服务 | MySQL、Redis、Milvus、Attu、MinIO、etcd |

---

## 快速开始

### 环境要求

| 工具 | 最低版本 |
|------|---------|
| Node.js | 20.x |
| pnpm | 8.x (或 npm) |
| Java | 21 (Java 后端) |
| Docker | 推荐（MySQL/Milvus/Redis/MinIO） |
| Ollama | 可选（RAG 嵌入） |

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

### Docker 服务启动

```bash
# 启动所有依赖服务（MySQL、Redis、Milvus、Attu、MinIO、etcd）
docker compose -f docker/docker-compose.yml up -d

# 查看服务状态
docker compose -f docker/docker-compose.yml ps
```

---

## AI 配置

### 配置文件

AI 配置存储在 `config/ai-config.json`，支持运行时热重载，无需重启服务。

**样例文件**: [ai-config.json.example](config/ai-config.json.example)

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
docker compose -f docker/docker-compose.yml up -d

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
- 宇宙首页（3D 科目星球环绕动画）

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
- 模型专题训练（每个题型模型配套练习题）

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
- 将军饮马动画（GeneralHorseDrinking）
- 路径优化（PathOptimization）
- 圆周运动（CircularMotion）

**物理可视化**
- 受力分析图（ForceDiagram）
- 光学演示（OpticsDemo）
- 自由落体动画（FreeFall）
- 粒子偏转（ParticleDeflection）

**化学可视化**
- 分子结构视图（MoleculeView）

**其他**
- 概率模拟（ProbabilitySim）
- 携手并进动画（HandInHand）

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
| GET | `/exam/model-questions/:modelId` | 获取模型专题练习题 |

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

### 学习洞察
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/insight/weak-points` | 薄弱知识点分析 |
| GET | `/insight/learning-path` | 学习路径建议 |

### 管理员
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/ai-config` | 获取 AI 配置 |
| PUT | `/admin/ai-config` | 更新 AI 配置 |
| POST | `/admin/ai-config/test` | 测试 AI 连接 |
| GET | `/admin/documents/stats` | RAG 文档统计 |

### 文件上传
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/upload/image` | 上传图片 |

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

## Docker 服务

Docker Compose 包含以下服务：

| 服务 | 端口 | 说明 |
|------|------|------|
| MySQL | 3306 | 关系型数据库 |
| Redis | 6379 | 缓存 |
| Milvus | 19530 | 向量数据库 |
| Attu | 8000 | Milvus 管理界面 |
| MinIO | 9000 | 对象存储 |
| etcd | 2379 | Milvus 元数据存储 |

```bash
# 启动所有服务
docker compose -f docker/docker-compose.yml up -d

# 停止所有服务
docker compose -f docker/docker-compose.yml down

# 查看日志
docker compose -f docker/docker-compose.yml logs -f
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
| **前端** | React 18, TypeScript, Vite, Ant Design 5, D3.js, KaTeX, Canvas API |
| **Node.js 后端** | Express 4, Prisma ORM, TypeScript, tsx |
| **Java 后端** | Spring Boot 3.3, MyBatis-Plus, JDK 21 |
| **数据库** | SQLite / MySQL 8.0 |
| **缓存** | Redis |
| **对象存储** | MinIO |
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
| ⑳ | 生物 | 细胞生物学 | 初中 → 高中 |
| ㉑ | 生物 | 遗传与进化 | 初中 → 高中 |
| ㉒ | 生物 | 人体生理 | 初中 → 高中 |
| ㉓ | 生物 | 植物学 | 初中 → 高中 |
| ㉔ | 生物 | 生态学 | 初中 → 高中 |
| ㉕ | 生物 | 微生物与生物技术 | 高中 |
| ㉖ | 英语 | 语法基础 | 初中 → 高中 |
| ㉗ | 英语 | 词汇与构词 | 初中 → 高中 |
| ㉘ | 英语 | 时态与语态 | 初中 → 高中 |
| ㉙ | 英语 | 句法与从句 | 初中 → 高中 |
| ㉚ | 英语 | 阅读策略 | 初中 → 高中 |
| ㉛ | 英语 | 写作表达 | 初中 → 高中 |
| ㉜ | 历史 | 中国古代史 | 初中 → 高中 |
| ㉝ | 历史 | 中国近现代史 | 初中 → 高中 |
| ㉞ | 历史 | 世界古代史 | 初中 → 高中 |
| ㉟ | 历史 | 世界近现代史 | 初中 → 高中 |
| ㊱ | 政治 | 思想政治基础 | 初中 → 高中 |
| ㊲ | 政治 | 思想政治扩展 | 初中 → 高中 |
| ㊳ | 地理 | 地理基础 | 初中 → 高中 |
| ㊴ | 地理 | 区域地理 | 初中 → 高中 |
| ㊵ | 地理 | 地图与地理工具 | 初中 → 高中 |
| ㊶ | 地理 | 环境与可持续发展 | 高中 |
| ㊷ | 计算机 | 计算机基础 | 初中 → 高中 |
| ㊸ | 计算机 | 程序设计基础 | 初中 → 高中 |
| ㊹ | 计算机 | 数据结构 | 高中 |
| ㊺ | 计算机 | 算法 | 高中 |
| ㊻ | 计算机 | 计算机网络 | 高中 |
| ㊼ | 计算机 | 数据库 | 高中 |
| ㊽ | 计算机 | 操作系统 | 高中 |

---

## 题型模型

### 数学模型（60+）
- **几何模型**：将军饮马、胡不归、阿氏圆、费马点、瓜豆原理、手拉手全等/相似等
- **函数模型**：对勾函数、主元法、构造函数法、判别式法求值域等
- **方程模型**：穿针引线法、多项式除法、绝对值最值、参数不等式分类讨论等
- **数列模型**：裂项相消、错位相减、构造等差/等比数列等
- **代数模型**：整体代入、对称式、韦达定理应用等

### 物理模型（16+）
- **力学模型**：滑块模型、传送带模型、圆周运动模型、平抛运动模型等

### 化学模型（11+）
- 化学反应速率模型、化学平衡模型、溶液配制模型等

### 生物模型（8+）
- 细胞分裂模型、遗传定律模型等

---

## 开发命令

### 前端
```bash
cd web
npm run dev          # 开发模式
npm run build        # 生产构建
npm run lint         # 代码检查
npm run tauri dev    # Tauri 开发
npm run tauri build  # Tauri 打包
```

### Node.js 后端
```bash
cd node-server
npm run dev          # 开发模式（自动重启）
npm run build        # 生产构建
npm run seed         # 数据种子
npx prisma studio    # 数据库可视化
```

### Java 后端
```bash
cd server
mvn spring-boot:run  # 开发模式
mvn clean package    # 生产构建
java -jar target/knowledge-power-1.0.0.jar  # 运行
```

---

## 项目统计

- **知识点总数**: 472+
- **关系总数**: 798+
- **题目总数**: 2327+
- **题型模型**: 95+
- **知识领域**: 49 个
- **学科**: 9 门（数学、物理、化学、生物、英语、历史、政治、地理、计算机）

---

## 许可证

本项目采用 **个人非商业用途许可协议**。

- ✅ 个人学习、研究、非商业项目可自由使用、修改、分发
- ❌ 商业用途（销售、租赁、SaaS、企业使用等）需联系作者获得授权

详情请查看 [LICENSE](LICENSE) 文件。

**商业授权咨询**：
- 项目仓库：https://github.com/657793814/KnowledgePower
- 作者邮箱：657793814@qq.com