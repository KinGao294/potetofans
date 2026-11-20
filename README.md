# potetofans

非官方粉丝站（Unofficial fan site）。

为 [@poteto](https://x.com/poteto) / 土豆女神打 Call。

本仓库与本人及所属机构无关，仅为粉丝自发站点，不代表官方立场。这不是官网、不是官方活动，也不是官方商店或会员系统。

## 本地预览

```bash
cd web
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

生产构建：

```bash
cd web
npm run build
npm run start
```

## 第一期页面

首页、美照馆、演讲、文章、学习打卡、挑战区、应援墙、关于。

学习打卡、PR 挑战记录和应援待审留言只保存在访问者的浏览器里（localStorage）。没有登录，也没有需要密钥的后端。

「每月 2000 个 PR」是粉丝发起的非官方挑战（Unofficial Fan Challenge），不是本人或公司下达的官方 KPI。

## 内容原则

- 只收录可公开引用的照片、演讲和文章，并标注来源。
- 不转载文章全文，不重托管视频。
- 不使用 AI 生成仿真人像。
- 如本人希望修改或下架内容，请通过本仓库 Issues 告知，我们会配合处理。

## 文档与数据

- 产品需求：[docs/PRD-potetofans-carbon-v1.1.md](docs/PRD-potetofans-carbon-v1.1.md)
- 内容种子（事实源）：[content/seed.json](content/seed.json)
- 公开图片原件：[assets/official/](assets/official/)
