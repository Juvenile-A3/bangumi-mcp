# Bangumi MCP TS

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Cloudflare%20Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
  <img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" />
  <img src="https://img.shields.io/badge/MCP-111827?style=for-the-badge&logoColor=white" alt="Model Context Protocol" />
  <img src="https://img.shields.io/badge/Bangumi-FFD866?style=for-the-badge&logoColor=111827" alt="Bangumi API" />
</p>

一个部署在 Cloudflare Workers 上的 Bangumi MCP 服务器，提供对 Bangumi API 的程序化访问。

## 特性

- **11 个只读 MCP tools**：`search`、`get_subject`、`get_user_profile`、`get_user_collections`、`get_calendar`、`browse_subjects`、`get_collections`、`get_episode`、`get_image`、`get_person`、`get_character`
- **只读工具标注**：`tools/list` 中所有工具均返回 `annotations.readOnlyHint: true`
- **1 个 MCP resource**：内置 Bangumi OpenAPI 文档
- **1 个 MCP prompt**：Bangumi 使用提示
- **无状态设计**：每个请求单独携带 `Authorization: Bearer <token>`
- **Cloudflare Worker 运行**：适合公开部署和边缘访问

感谢 [Bangumi MCP](https://github.com/Ukenn2112/BangumiMCP) 为本项目提供的思路。功能一致，微调了tools的说明以压缩上下文。目标皆在将本地MCP服务器部署到 Cloudflare Workers 上。

![image](https://github.com/user-attachments/assets/f315ba06-d057-4e64-9699-895febe92ed9)

## 快速开始

部署此副本后，使用自己的 Worker HTTPS 地址加 `/mcp` 作为 MCP 端点。

bangumiTV 创建个人令牌地址：
[https://next.bgm.tv/demo/access-token/create](https://next.bgm.tv/demo/access-token/create)

因为可能需要传递个人令牌，基于cloudflare免费版本的使用量和安全考虑，请谨慎使用非官方提供的 MCP 服务器。**建议自行部署**，以下是部署指南。

需求：
- Cloudflare账号

### 一键部署

点击下面按钮即可

[![deploy](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Juvenile-A3/bangumi-mcp)

PS：也可以通过fork到自己的账户，cloudflare连接到github存储库

### 本地开发

```bash
bun install
bun run dev
```

默认会启动 Wrangler dev，入口为：

- `GET /`：状态信息
- `POST /mcp`：MCP JSON-RPC 入口

### 部署到 Cloudflare

```bash
bun run deploy
```

## 认证方式

公开收藏可按用户名查询。读取私密收藏等受限数据时，客户端需要在每次请求的 HTTP 头中提供 Bangumi 个人令牌。Worker 仅为当前请求转发令牌，无需配置 Worker Secret。

```http
Authorization: Bearer <your_token>
```

兼容 `AUTHTOKEN` 头。也可以使用以下认证方式：

```http
AUTHTOKEN: <your_token>
```

在 ChatGPT 中可用无认证连接测试公开收藏，例如查询 `juvenile_a` 最近看过的动画。如果连接界面无法发送 Bangumi Bearer 请求头，私密收藏可用支持自定义请求头的 MCP 客户端验证。

## 可用能力

### Tools

- `search`：聚合搜索条目、人物、角色，支持 `subject_type`/`nsfw_filter`/`career_filter` 筛选
- `get_subject`：条目详情；可用 `include=["persons","characters","relations","episodes"]` 展开，`episode_type` 筛选剧集类型，失败分段返回 `_error`
- `get_user_profile`：用户画像
- `get_user_collections`：按页返回作品信息、收藏状态与 Bangumi 提供的个人字段，包括评分、评价、标签、进度、更新时间和私密标记。用 `page_size`（20–50，默认 20）、`offset`、`subject_type` 和 `collection_type` 分页筛选，传 `subject_id` 查单条。旧值 `all` 按每页 50 条处理
- `get_calendar`：放送表
- `browse_subjects`：按类型浏览条目目录，支持 `cat`/`year`/`month`/`sort` 等筛选
- `get_collections`：人物/角色收藏查询，`target_type=person|character`，传 `person_id`/`character_id` 查单个
- `get_episode`：剧集详情 + 剧集收藏（`episode_id` 查详情，`subject_id+collection` 查收藏列表）
- `get_image`：统一图片 URL 获取，`target_type=subject|person|character|user`
- `get_person`：人物详情 + 作品/角色，分段返回 `_error`
- `get_character`：角色详情 + 出演作品/声优，分段返回 `_error`

### Resource

- `bangumi://openapi`：Bangumi OpenAPI 规范

### Prompt

- `bangumi-usage`：Bangumi MCP 使用提示

## 环境变量

| 变量 | 说明 |
|---|---|
| `BANGUMI_API_BASE` | Bangumi API 基础地址，默认 `https://api.bgm.tv` |
| `BANGUMI_USER_AGENT` | 请求使用的 User-Agent |

## 项目结构

```text
bangumiMCP-ts/
├── src/
│   ├── index.ts
│   ├── mcp.ts
│   ├── config.ts
│   ├── prompts.ts
│   ├── tools.ts
│   └── lib/
├── docs/
│   ├── requirements.md
│   └── bangumi-tv-api.json
└── wrangler.jsonc
```

## 说明

- 重点目标是保持 Worker 轻量、无状态、易部署

### 相关项目与致谢

- **[Ukenn2112/BangumiMCP](https://github.com/Ukenn2112/BangumiMCP)** - Local implementation of BangumiMCP
