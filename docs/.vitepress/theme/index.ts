import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import TermList from './components/TermList.vue'
import SearchEnhancer from './components/SearchEnhancer.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  // layout-bottom 槽位挂载零结果搜索增强组件（不渲染可见内容，纯行为注入）
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(SearchEnhancer)
    }),
  enhanceApp({ app }) {
    app.component('TermList', TermList)
  }
}
