import { mkdirSync, writeFileSync, rmSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadTerms, renderTermMarkdown, CATEGORIES } from '../lib/terms.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const TERMS_DIR = join(ROOT, 'docs', 'terms')

// 词条页由数据生成：每次生成前清空旧的分类目录（index.md 是手写的，保留）
const terms = loadTerms()

for (const entry of readdirSync(TERMS_DIR, { withFileTypes: true })) {
  if (entry.isDirectory()) {
    rmSync(join(TERMS_DIR, entry.name), { recursive: true, force: true })
  }
}

let count = 0
for (const t of terms) {
  const dir = join(TERMS_DIR, t.category)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, `${t.id}.md`), renderTermMarkdown(t, terms))
  count++
}

const expected = Object.keys(CATEGORIES).length
console.log(`已生成 ${count} 个词条页到 docs/terms/<分类>/<id>.md`)
if (count === 0) {
  console.error('警告：没有生成任何词条页，请检查 data/ 目录')
  process.exit(1)
}
if (!existsSync(join(TERMS_DIR, 'index.md'))) {
  console.error('警告：docs/terms/index.md 缺失（术语总览页）')
  process.exit(1)
}
