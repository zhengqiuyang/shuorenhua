# 说人话 · 职场黑话与术语词典

> 把 OKR、MVP、「对齐颗粒度」翻译成人话 —— 大厂新人的第一本职场词典。

一个新人进入大厂，往往要在「黑话考试」里裸考：会上听到「对齐一下颗粒度」「先找抓手再落地」，文档里满是 PRD、埋点、灰度、北极星指标——每个字都认识，连起来就听不懂。

**「说人话」收集并翻译这些术语和黑话，为职场新人提供一个可搜索、可共建的在线词典。**

## ✨ 特色

- **八大分类体系**：中英缩写（OKR/GMV）→ 黑话行话（抓手/闭环/拉通）→ 业务与增长（埋点/灰度/种草）→ 研发协作（提测/联调/降级）→ 职场文化（双月会/背锅/画饼）→ 财务与经营（毛利/烧钱率/LTV）→ 组织与人力（职级/竞业/N+1）→ AI 时代（幻觉/RAG/Token），按新人真实困惑组织。
- **结构化词条（当前 147 条）**：每个词条都有「一句话人话解释 + 详细解释 + 真实会议室例句 + 常见误解 + 相关词条」，不是一坨文字。
- **数据与产品分离**：词条存在 `data/*.json`，站点只是第一个展示壳。同一份数据可以直接被浏览器插件、飞书/企微机器人、API 复用（构建时导出 `docs/public/terms.json`）。
- **中文全文搜索**：基于 Intl.Segmenter 分词，搜「对齐」「灰度」都能命中。
- **人人可贡献**：发 Issue 就能收词，提 PR 就能上榜；校验脚本自动检查必填字段、id 冲突和 related 引用。

## 🚀 快速开始

```bash
npm install
npm run dev        # 本地开发 http://localhost:5173
npm run build      # 校验数据 + 构建静态站到 docs/.vitepress/dist
npm run preview    # 本地预览构建产物
npm run validate   # 只做数据校验，并导出 docs/public/terms.json
```

## 📖 在线访问

部署到 GitHub Pages 后在此处填写站点地址（`.github/workflows/deploy.yml` 已配好自动部署，见下方「部署」）。

## 🗂️ 项目结构

```
├── data/                  # 词条数据（核心资产）
│   ├── abbr.json          # 中英缩写：OKR、GMV、PRD……
│   ├── jargon.json        # 黑话行话：对齐、抓手、拉通……
│   ├── business.json      # 业务与增长：埋点、A/B 测试、种草……
│   ├── engineering.json   # 研发协作：提测、联调、降级……
│   ├── culture.json       # 职场文化：双月会、背锅、画饼……
│   ├── finance.json       # 财务与经营：毛利、烧钱率、LTV……
│   ├── hr.json            # 组织与人力：职级、竞业、N+1……
│   └── ai.json            # AI 时代：幻觉、RAG、Token……
├── docs/                  # VitePress 站点
│   ├── .vitepress/
│   │   ├── config.mts     # 站点配置（侧边栏从数据自动生成）
│   │   └── lib/terms.mjs  # 数据加载 + 词条页渲染
│   ├── terms/             # 词条页由动态路由自动生成，无需手写
│   └── public/terms.json  # 构建时导出的聚合数据（供插件/机器人复用）
├── scripts/validate.mjs   # 数据校验 + 导出
└── .github/               # Issue/PR 模板、Pages 自动部署
```

## 📝 词条 Schema

```json
{
  "id": "okr",             // 必填，URL 用
  "term": "OKR",           // 必填，展示名
  "expand": "Objectives and Key Results",  // 选填，英文全称
  "aliases": ["目标与关键结果"],            // 选填
  "category": "abbr",      // 必填：abbr / jargon / business / engineering / culture
  "summary": "一句话人话解释",              // 必填
  "detail": "详细解释",                    // 必填
  "usage": "会议室真实例句",                // 必填
  "note": "常见误解 / 注意",                // 选填
  "related": ["kpi"]       // 选填，校验器会检查引用存在
}
```

完整说明见 [贡献指南](./CONTRIBUTING.md)。

## 🤝 如何贡献

1. **收词**：[发一个「新增词条」Issue](https://github.com/zhengqiuyang/shuorenhua/issues/new/choose)，填 4 个字段即可。
2. **写词条**：Fork → 在 `data/` 对应文件添加词条 → `npm run validate` → 提 PR。
3. **纠错**：解释有误、例句不真实，直接提 Issue 或 PR。

## 🚢 部署

仓库已内置 GitHub Actions 工作流（`.github/workflows/deploy.yml`）：推送到 `main` 分支自动构建并发布到 GitHub Pages。只需在仓库设置里把 **Settings → Pages → Source** 改为 **GitHub Actions**。工作流会自动把站点 base 路径设置为仓库名，无需改配置。

## 🗺️ 路线图

- [x] 站点 + 中文全文搜索 + 词条动态生成
- [ ] 词条量到 200+：覆盖财务、法务、市场等更多职能
- [ ] 浏览器划词插件（复用 terms.json）
- [ ] 飞书 / 企业微信机器人
- [ ] 英文版（帮助外企新人理解中式黑话）
- [ ] 每周词条 newsletter

## 🙏 致谢与同类项目

- [nbnhhsh](https://github.com/itorr/nbnhhsh)：拼音缩写翻译，形态先驱
- [ali-words](https://github.com/justjavac/ali-words)：互联网黑话词汇表
- [chinese-internet-jargon](https://github.com/mcsrainbow/chinese-internet-jargon)：中文黑话解释词典

## License

[MIT](./LICENSE)
