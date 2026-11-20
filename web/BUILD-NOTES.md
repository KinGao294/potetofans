# potetofans Web — 构建与本地启动说明

## 环境与技术栈
- **框架**：Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 3
- **图片资源**：已从 `/workspace/potetofans/assets/official/` 复制到 `public/images/`，代码仅引用本地路径，同时在 `src/data/site-data.ts` 保留原始公开出处 URL。
- **字体策略**：使用高可读本地/系统杂志衬线体与无衬线体字体栈，不依赖构建期拉取外部 Google Fonts，确保离线或受限网络环境下 `npm run build` 均可稳定通过。
- **状态与隐私**：无任何需要密钥的后端。学习打卡、每月 2,000 PR 挑战记录、应援墙待审留言均纯前端保存在浏览器 `localStorage`。

## 本地启动命令

```bash
cd /workspace/potetofans/web
npm install
npm run dev
```

启动后访问：`http://localhost:3000`

## 生产构建与预览

```bash
cd /workspace/potetofans/web
npm run build
npm run start
```

## 构建验证结果
- `npm install`：通过
- `npm run build`：通过（全部 8 个主路由静态预渲染成功，无 TypeScript / Lint 报错）
- HTTP 路由自检：`/`、`/gallery`、`/talks`、`/articles`、`/checkin`、`/challenge`、`/cheer`、`/about` 均返回 `200 OK`
