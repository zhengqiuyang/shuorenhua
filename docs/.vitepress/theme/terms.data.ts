import { createContentLoader } from 'vitepress'

// 收集所有由动态路由生成的词条页，供术语总览页使用
export default createContentLoader('/terms/**/*.md', { render: false })
