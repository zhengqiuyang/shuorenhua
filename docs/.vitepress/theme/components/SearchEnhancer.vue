<script setup>
// 零结果搜索闭环：VitePress 本地搜索弹窗查不到词时，注入「问 AI / 贡献词条」引导，
// 并把零结果词记录到 localStorage（维护者可用 window.__srZeroResults() 导出，作为内容路线图）。
import { onMounted, onBeforeUnmount } from 'vue'

const LS_KEY = 'sr-zero-result-searches'
const REPO = 'zhengqiuyang/shuorenhua'

let bodyObserver = null
let boxObserver = null
let checkTimer = null

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]))
}

function aiUrl(q) {
  const prompt = `请用大白话解释职场术语「${q}」：它是什么（30~60字）、一个真实的会议室例句、和相近概念的区别。如果这不是一个真实存在的职场黑话或术语，请直接说明。`
  return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`
}

function issueUrl(q) {
  return (
    `https://github.com/${REPO}/issues/new?template=add-term.yml` +
    `&title=${encodeURIComponent(`新增词条：${q}`)}` +
    `&term=${encodeURIComponent(q)}`
  )
}

function record(q) {
  try {
    const list = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    if (!list.includes(q)) {
      list.push(q)
      localStorage.setItem(LS_KEY, JSON.stringify(list.slice(-100)))
    }
  } catch { /* localStorage 不可用时静默跳过 */ }
}

function buildBlock(q) {
  const el = document.createElement('div')
  el.className = 'sr-zero-result'
  const p = document.createElement('p')
  p.append('没有找到「')
  const b = document.createElement('b')
  b.textContent = q
  p.append(b, '」，可以：')
  const actions = document.createElement('div')
  actions.className = 'sr-actions'
  const ai = document.createElement('a')
  ai.className = 'sr-btn sr-ai'
  ai.href = aiUrl(q)
  ai.target = '_blank'
  ai.rel = 'noopener'
  ai.textContent = '🤖 先问 AI'
  const issue = document.createElement('a')
  issue.className = 'sr-btn sr-issue'
  issue.href = issueUrl(q)
  issue.target = '_blank'
  issue.rel = 'noopener'
  issue.textContent = '✍️ 贡献这个词条'
  actions.append(ai, issue)
  el.append(p, actions)
  return el
}

function updateUrl(el, q) {
  const [ai, issue] = el.querySelectorAll('.sr-btn')
  ai.href = aiUrl(q)
  issue.href = issueUrl(q)
}

function check(box) {
  const input = box.querySelector('input')
  const results = box.querySelector('ul.results')
  if (!input || !results) return
  const q = input.value.trim()
  // VitePress 零结果时会在 ul.results 里渲染 li.no-results 占位，要排除它
  const empty = results.querySelectorAll('li:not(.no-results)').length === 0
  let block = box.querySelector('.sr-zero-result')

  if (q && empty) {
    if (!block) {
      block = buildBlock(q)
      results.insertAdjacentElement('afterend', block)
    } else {
      const b = block.querySelector('b')
      if (b.textContent !== q) {
        b.textContent = q
        updateUrl(block, q)
      }
    }
    record(q)
  } else if (block) {
    block.remove()
  }
}

function attach(box, retries = 0) {
  // 弹窗根节点先插入、子内容后渲染，这里等子节点就绪；节点已脱离文档则放弃
  const results = box.querySelector('ul.results')
  const input = box.querySelector('input')
  if (!results || !input) {
    if (!box.isConnected || retries > 60) return
    requestAnimationFrame(() => attach(box, retries + 1))
    return
  }
  box.dataset.srEnhanced = '1'
  boxObserver = new MutationObserver(() => {
    clearTimeout(checkTimer)
    checkTimer = setTimeout(() => check(box), 250)
  })
  boxObserver.observe(results, { childList: true })
  input.addEventListener('input', () => {
    clearTimeout(checkTimer)
    checkTimer = setTimeout(() => check(box), 250)
  })
}

onMounted(() => {
  try {
    window.__srZeroResults = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]')
  } catch { /* ignore */ }
  bodyObserver = new MutationObserver(() => {
    const box = document.querySelector('.VPLocalSearchBox')
    if (box && !box.dataset.srEnhanced) attach(box)
  })
  bodyObserver.observe(document.body, { childList: true, subtree: true })
})

onBeforeUnmount(() => {
  bodyObserver?.disconnect()
  boxObserver?.disconnect()
  clearTimeout(checkTimer)
})
</script>

<template>
  <!-- 纯 DOM 增强，不渲染内容 -->
  <span style="display: none" aria-hidden="true"></span>
</template>
