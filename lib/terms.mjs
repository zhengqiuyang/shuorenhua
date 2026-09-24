import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const CATEGORIES = {
  abbr: '中英缩写',
  jargon: '黑话行话',
  business: '业务与增长',
  engineering: '研发协作',
  culture: '职场文化',
  finance: '财务与经营',
  hr: '组织与人力',
  ai: 'AI 时代'
}

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '../data')

export function loadTerms() {
  const terms = []
  for (const file of readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))) {
    for (const t of JSON.parse(readFileSync(join(DATA_DIR, file), 'utf8'))) {
      terms.push(t)
    }
  }
  return terms.sort((a, b) => a.term.localeCompare(b.term, 'zh'))
}

export function termLink(t) {
  return `/terms/${t.category}/${t.id}`
}

// 生成一个词条的完整 markdown 页面（frontmatter + 正文），由 scripts/gen-pages.mjs 写入 docs/terms/
export function renderTermMarkdown(t, allTerms) {
  const catLabel = CATEGORIES[t.category]
  const meta = []
  if (t.expand) meta.push(`**全称**：${t.expand}`)
  if (t.aliases?.length) meta.push(`**别名**：${t.aliases.join('、')}`)
  meta.push(`**分类**：${catLabel}`)

  const fm = {
    title: `${t.term} 是什么？一句话人话解释`,
    description: t.summary,
    category: t.category,
    categoryLabel: catLabel,
    term: t.term
  }

  const lines = []
  lines.push('---')
  for (const [k, v] of Object.entries(fm)) {
    lines.push(`${k}: ${JSON.stringify(v)}`)
  }
  lines.push('---')
  lines.push('')
  lines.push(`# ${t.term}`)
  lines.push('')
  lines.push(meta.join('  \n'))
  lines.push('')
  lines.push('::: tip 💡 一句话解释')
  lines.push(t.summary)
  lines.push(':::')
  lines.push('')
  lines.push('## 详细解释')
  lines.push('')
  lines.push(t.detail)
  lines.push('')
  lines.push('## 会议室里会听到')
  lines.push('')
  lines.push(`> ${t.usage}`)
  if (t.note) {
    lines.push('')
    lines.push('## 注意 / 常见误解')
    lines.push('')
    lines.push(t.note)
  }
  const rel = (t.related ?? [])
    .map(id => allTerms.find(x => x.id === id))
    .filter(Boolean)
  if (rel.length) {
    lines.push('')
    lines.push('## 相关词条')
    lines.push('')
    lines.push(rel.map(r => `- [${r.term}](${termLink(r)})${r.summary ? ` —— ${r.summary}` : ''}`).join('\n'))
  }
  lines.push('')
  return lines.join('\n')
}
