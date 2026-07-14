# MathVerse 数理世界

📐 交互式数学知识图谱 + 训练系统 + AI 导师

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Tech Stack](https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen) ![Tech Stack](https://img.shields.io/badge/Node.js-18-green) ![Tech Stack](https://img.shields.io/badge/SQLite-blue) ![Tech Stack](https://img.shields.io/badge/MySQL-8.0-orange) ![Tech Stack](https://img.shields.io/badge/Tauri-v2-purple)

---

## 项目结构

```
math-knowledge/
├── server/          # 🟢 Java 后端 (Spring Boot + MySQL)
├── node-server/     # 🟡 Node.js 后端 (Express + SQLite)
├── web/             # 🔵 前端 (React + Vite + Ant Design)
├── src-tauri/       # ⚪ Tauri v2 桌面壳 (macOS)
├── scripts/         # 打包脚本
└── start.sh         # 一键启动（可切换后端）
```

## 快速开始

### 环境要求

| 工具 | 最低版本 |
|------|---------|
| Node.js | 18.x |
| pnpm | 8.x (或 npm) |
| Java | 21 (Java 后端) |
| Docker | VNC (Java 后端) |

### 启动开发环境

```bash
# Node.js 后端 (推荐 — 无需 MySQL)
./start.sh node

# 或 Java 后端 (需要 MySQL Docker)
./start.sh java
```

启动后访问:
- **前端**: http://localhost:8082
- **Node.js 后端**: http://localhost:3001
- **Java 后端**: http://localhost:8080

### 后端切换说明

```
./start.sh node     # Node.js + SQLite (默认)
./start.sh java     # Java + MySQL (需先启动 Docker 中间件)
./start.sh java frontend  # 只启动前端，后端已在其它地方运行
```

> **node 模式** 是零依赖模式，SQLite 数据库自动创建和初始化种子数据。
> **java 模式** 需要先启动 Docker 中的 MySQL。

### 各模块独立启动

```bash
# Node 后端
cd node-server && npx tsx src/index.ts

# Java 后端
cd server && mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 前端 (默认代理 Java :8080)
cd web && npm run dev

# 前端 (代理 Node :3001)
cd web && API_TARGET=http://localhost:3001 npm run dev
```

---

## 双后端架构

### 为什么做双后端？

- **零依赖开发**: Node.js + SQLite 无需 Docker、MySQL 即可运行
- **渐进迁移**: Java 代码零改动，两套后端并存，按需切换
- **打包简化**: SQLite 单文件，无需外置数据库服务

### 架构对比

| 特性 | Java 后端 | Node.js 后端 |
|------|-----------|-------------|
| 运行时 | JDK 21 | Node.js 18+ |
| 端口 | 8080 | 3001 |
| 数据库 | MySQL 8.0 (Docker) | SQLite (文件) |
| ORM | MyBatis-Plus | Prisma |
| AI 引擎 | OpenAI + Ollama 可选 | OpenAI 兼容 API |
| 种子数据 | MySQL 初始化脚本 | 自动 seed |
| Tauri 打包 | JAR 嵌入 | server.js 打包 |

### API 兼容性

两套后端对外暴露完全相同的 REST API 接口，响应格式统一为：

```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

前端无需修改任何代码即可切换后端引擎。

---

## 后端 API

### 用户

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/user/info` | 当前用户信息 |
| POST | `/user/register` | 注册 |

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
| GET | `/exam/random?count=N` | 随机出题 |
| POST | `/exam/submit` | 提交作答 |
| GET | `/exam/stats` | 学习统计 |
| GET | `/exam/wrong-book` | 错题本 |
| POST | `/exam/wrong-book/remove` | 移除错题 |
| POST | `/exam/auto-generate` | AI 智能组卷 |

### AI

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/ai/ask` | 知识问答 |
| POST | `/ai/explain` | 错题解析 |
| POST | `/ai/recommend` | 学习建议 |

---

## 数据库

### Java 后端 (MySQL)

```bash
# 启动 MySQL
docker compose -f /path/to/dockerProject/mysql-docker-compose.yml up -d

# 建库
mysql -h 127.0.0.1 -u root -p -e "CREATE DATABASE mathverse DEFAULT CHARSET utf8mb4"
mysql -h 127.0.0.1 -u root -p mathverse < server/src/main/resources/db/init.sql
```

### Node.js 后端 (SQLite)

数据库文件: `node-server/prisma/mathverse.db`

```bash
# 初始化 (如果数据库不存在会自动创建并 seed)
cd node-server && npx prisma db push --skip-generate
npx tsx src/seeders/index.ts

# 或者直接用 start.sh (自动处理)
cd .. && ./start.sh node
```

#### 使用 Prisma Studio 编辑数据

Prisma Studio 提供可视化数据库管理界面，可直接编辑知识点、题目等数据：

```bash
cd node-server
npx prisma studio
```

启动后访问 http://localhost:5555，选择对应表（KnowledgeNode / ExamQuestion）找到记录直接修改保存。

> **注意**：`contentJson` 字段存储的是 JSON 字符串，在 Prisma Studio 中需以 JSON 格式编辑。如需重新运行全部种子数据，需先清空数据库：
> ```bash
> cd node-server && rm -f prisma/mathverse.db
> npx prisma db push --skip-generate
> npx tsx src/seeders/index.ts
> ```

### 实体关系概览

```
知识节点 (KnowledgeNode) ◄── 知识关系 (KnowledgeRelation) ──► 知识节点
        │
    belongs_to (domain)
        │
        ▼
    考试题目 (ExamQuestion)
        │
    作答记录 (ExamAnswer)
    考卷      (ExamPaper)
    错题本   (ExamWrongBook)
```

---

## 桌面端 (Tauri v2)

```bash
# 开发模式
cd web && npm run tauri dev

# 打包 .dmg
cd web && npm run tauri build

# 编译脚本（全自动）
./scripts/build.sh        # Java JAR 打包
./scripts/build.sh node   # Node.js 打包
```

Tauri 桌面壳支持通过环境变量 `BACKEND=node|java` 切换后端引擎。

---

## 知识领域

| # | 领域 | 知识点 | 关系 | 难度 |
|---|------|--------|------|------|
| ① | 数 | 9 | 20 | 初中 → 高中 |
| ② | 式 | 8 | 20 | 初中 → 高中 |
| ③ | 方程与不等式 | 7 | 18 | 初中 → 高中 |
| ④ | 函数 | 9 | 18 | 初中 → 高中 |
| ⑤ | 几何 | 10 | 22 | 初中 → 高中 |
| ⑥ | 排列组合与统计 | 7 | 13 | 初中 → 高中 |
| ⑦ | 数列与导数 | 8 | 19 | 高中 |
| | **合计** | **58** | **130** | |

---

## 技术栈

| 层 | 技术 |
|----|------|
| **前端** | React 18, TypeScript, Vite, Ant Design 5, D3.js, KaTeX |
| **Java 后端** | Spring Boot 3.3, MyBatis-Plus, JDK 21 |
| **Node.js 后端** | Express 4, Prisma ORM, TypeScript, tsx |
| **数据库** | MySQL 8.0 / SQLite |
| **AI 引擎** | OpenAI 兼容 API (agnes-2.0-flash) |
| **桌面壳** | Tauri v2 (Rust) |
| **状态管理** | Zustand |
| **路由** | React Router v6 |
