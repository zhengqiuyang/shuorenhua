import { defineConfig } from 'vitepress'
import { loadTerms, CATEGORIES, termLink } from '../../lib/terms.mjs'

const terms = loadTerms()
const REPO = 'https://github.com/your-name/shuorenhua'

// 词条分组的侧边栏（构建时从 data/ 目录生成，无需手动维护）
const termSidebar = Object.entries(CATEGORIES).map(([key, label]) => ({
  text: label,
  collapsed: false,
  items: terms
    .filter(t => t.category === key)
    .map(t => ({ text: t.term, link: termLink(t) }))
}))

// 中文分词的全文搜索：用 Intl.Segmenter 把句子切成词再建索引。
// 注意：VitePress 会把 themeConfig 中的函数序列化后在浏览器端用 new Function 复活，
// 闭包变量会丢失，所以这里必须完全自包含（segmenter 缓存在 globalThis 上）。
function tokenize(text: string): string[] {
  if (!text) return []
  const g = globalThis as any
  g.__zhSegmenter ??= new Intl.Segmenter('zh-CN', { granularity: 'word' })
  const words = Array.from(g.__zhSegmenter.segment(text))
    .filter((s: any) => s.isWordLike)
    .map((s: any) => s.segment.toLowerCase())
  return Array.from(new Set(words))
}

export default defineConfig({
  lang: 'zh-CN',
  title: '说人话',
  description:
    '把 OKR、MVP、「对齐颗粒度」翻译成人话 —— 大厂新人的第一本职场黑话与术语词典',
  base: process.env.BASE || '/',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { property: 'og:title', content: '说人话 · 职场黑话与术语词典' }],
    [
      'meta',
      {
        property: 'og:description',
        content: '为职场新人准备的术语词典：中英缩写、大厂黑话、业务概念，用人话解释，配真实会议室例句。'
      }
    ],
    ['meta', { property: 'og:type', content: 'website' }]
  ],
  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '术语库', link: '/terms/' },
      { text: '贡献指南', link: '/contributing/' },
      { text: '关于', link: '/about/' }
    ],
    sidebar: {
      '/terms/': [{ text: '📚 全部词条', link: '/terms/' }, ...termSidebar],
      '/': [
        { text: '首页', link: '/' },
        { text: '术语库', link: '/terms/' },
        { text: '贡献指南', link: '/contributing/' },
        { text: '关于', link: '/about/' }
      ]
    },
    socialLinks: [{ icon: 'github', link: REPO }],
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: { tokenize },
          searchOptions: { tokenize }
        },
        translations: {
          button: { buttonText: '搜索词条', buttonAriaLabel: '搜索词条' },
          modal: {
            noResultsText: '没有找到相关词条',
            resetButtonTitle: '清空搜索',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    },
    outline: { level: [2, 3], label: '本页内容' },
    footer: {
      message: '基于 MIT 协议开源，欢迎参与贡献',
      copyright: '说人话 · 由社区共同维护'
    },
    docFooter: { prev: '上一个词条', next: '下一个词条' }
  }
})
