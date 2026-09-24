<script setup>
import { computed } from 'vue'
import { data as pages } from '../terms.data'

const ORDER = ['abbr', 'jargon', 'business', 'engineering', 'culture']

const groups = computed(() => {
  const list = pages.filter(p => p.frontmatter?.category)
  return ORDER.map(cat => {
    const items = list
      .filter(p => p.frontmatter.category === cat)
      .sort((a, b) => a.frontmatter.term.localeCompare(b.frontmatter.term, 'zh'))
    return { cat, label: items[0]?.frontmatter.categoryLabel ?? cat, items }
  }).filter(g => g.items.length)
})
</script>

<template>
  <section v-for="g in groups" :key="g.cat" class="term-group">
    <h2>{{ g.label }}<span class="count">{{ g.items.length }}</span></h2>
    <ul class="term-list">
      <li v-for="p in g.items" :key="p.url">
        <a class="term-card" :href="p.url">
          <div class="term-head">
            <strong>{{ p.frontmatter.term }}</strong>
            <span v-if="p.frontmatter.expand" class="expand">{{ p.frontmatter.expand }}</span>
          </div>
          <p>{{ p.frontmatter.description }}</p>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.term-group h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 1.25rem;
}
.count {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 1px 8px;
  font-weight: 500;
}
.term-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}
.term-card {
  display: block;
  height: 100%;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s;
}
.term-card:hover {
  border-color: var(--vp-c-brand-1);
  text-decoration: none;
  transform: translateY(-1px);
}
.term-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}
.expand {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}
.term-card p {
  margin: 6px 0 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  text-decoration: none;
}
.term-card strong,
.term-card .expand {
  text-decoration: none;
}
</style>
