import DefaultTheme from 'vitepress/theme'
import TermList from './components/TermList.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('TermList', TermList)
  }
}
