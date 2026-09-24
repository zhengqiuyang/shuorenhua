import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CATEGORIES } from '../lib/terms.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = join(ROOT, 'data')
const PUBLIC_DIR = join(ROOT, 'docs', 'public')

const REQUIRED_FIELDS = ['id', 'term', 'category', 'summary', 'detail', 'usage']

const terms = []
const errors = []

for (const file of readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))) {
  const list = JSON.parse(readFileSync(join(DATA_DIR, file), 'utf8'))
  if (!Array.isArray(list)) {
    errors.push(`${file} 顶层必须是数组`)
    continue
  }
  list.forEach((t, i) => {
    const at = `${file} 第 ${i + 1} 条`
    for (const field of REQUIRED_FIELDS) {
      if (!t[field] || String(t[field]).trim() === '') errors.push(`${at} 缺少必填字段 ${field}`)
    }
    if (t.id && !/^[a-z0-9][a-z0-9-]*$/.test(t.id)) errors.push(`${at} id 只能是小写字母、数字、连字符：${t.id}`)
    if (t.category && !CATEGORIES[t.category]) errors.push(`${at} category 非法：${t.category}（可用：${Object.keys(CATEGORIES).join(' / ')}）`)
    terms.push(t)
  })
}

const seen = new Set()
for (const t of terms) {
  if (seen.has(t.id)) errors.push(`id 重复：${t.id}`)
  seen.add(t.id)
}
for (const t of terms) {
  for (const r of t.related ?? []) {
    if (!seen.has(r)) errors.push(`${t.id} 的 related 引用了不存在的词条：${r}`)
  }
}

if (errors.length) {
  console.error(`数据校验失败，共 ${errors.length} 处：\n- ${errors.join('\n- ')}`)
  process.exit(1)
}

terms.sort((a, b) => a.term.localeCompare(b.term, 'zh'))

mkdirSync(PUBLIC_DIR, { recursive: true })
writeFileSync(
  join(PUBLIC_DIR, 'terms.json'),
  JSON.stringify({ updatedAt: new Date().toISOString(), count: terms.length, categories: CATEGORIES, terms }, null, 2)
)

console.log(`数据校验通过：共 ${terms.length} 个词条，已生成 docs/public/terms.json（供未来插件 / 机器人 / API 使用）`)
