# 贡献指南

欢迎给「说人话」添砖加瓦！有三种参与方式，从轻到重：

## 方式一：发 Issue 收词（最轻量）

看到听不懂的词？去 [Issues](../../issues/new/choose) 用「新增词条」模板提交，只需要填：词条名、分类、一句话解释、会议室例句。维护者会整理入库。

## 方式二：提 PR 新增 / 改进词条

1. Fork 仓库后，在 `data/` 目录选择对应分类的 JSON 文件：

   | 文件 | 分类 | 例子 |
   |---|---|---|
   | `abbr.json` | 中英缩写 | OKR、GMV、PRD |
   | `jargon.json` | 黑话行话 | 对齐、抓手、拉通 |
   | `business.json` | 业务与增长 | 埋点、灰度、种草 |
   | `engineering.json` | 研发协作 | 提测、联调、降级 |
   | `culture.json` | 职场文化 | 双月会、背锅、画饼 |
   | `finance.json` | 财务与经营 | 毛利、烧钱率、LTV |
   | `hr.json` | 组织与人力 | 职级、竞业、N+1 |
   | `ai.json` | AI 时代 | 幻觉、RAG、Token |

2. 按下面的 Schema 添加一个词条对象。
3. 运行 `npm run validate` 通过校验。
4. 提交 PR，描述里写一句你为什么觉得这个词重要。

## 方式三：改进产品

站点、搜索、导出数据的质量问题都欢迎提 Issue 或 PR。

## 词条 Schema

```json
{
  "id": "okr",                    // 必填。小写字母/数字/连字符，作为 URL
  "term": "OKR",                  // 必填。展示名称
  "aliases": ["目标与关键结果"],   // 选填。常见别名或中文叫法
  "expand": "Objectives and Key Results", // 选填。英文全称
  "category": "abbr",             // 必填。abbr / jargon / business / engineering / culture
  "tags": ["管理", "目标"],        // 选填。标签
  "summary": "...",               // 必填。一句话人话解释（30~60 字最佳）
  "detail": "...",                // 必填。详细解释，2~4 句，说清「它是什么 + 和相近词的区别」
  "usage": "...",                 // 必填。真实会议室例句，带引号的口语
  "note": "...",                  // 选填。常见误解 / 使用注意 / 吐槽
  "related": ["kpi", "shuangyue"] // 选填。相关词条的 id，校验器会检查存在性
}
```

## 写作风格要求

- **说人话**：像给刚入职的朋友解释，不要百科腔、不要套娃黑话（用「抓手」解释「抓手」不行）。
- **有场景**：例句必须像真的会在会议室里听到的话。
- **实事求是**：不编造词源，拿不准就标注「存在多种说法」。
- **克制吐槽**：职场文化类词条可以有趣，但不人身攻击、不贩卖焦虑。

## 本地开发

```bash
npm install
npm run dev      # 本地预览
npm run validate # 数据校验 + 导出 terms.json
npm run build    # 校验 + 构建静态站
```
