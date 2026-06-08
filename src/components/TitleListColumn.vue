<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NotionEntry } from '@/types/notion'
import { parseNotionDate } from '@/lib/notion-mapper'

const props = defineProps<{
  label: string
  entries: NotionEntry[]
  limit?: number
}>()

const hoveredId = ref<string | null>(null)

const items = computed(() => {
  const sorted = [...props.entries].sort(
    (a, b) => parseNotionDate(b.date).getTime() - parseNotionDate(a.date).getTime()
  )
  return props.limit ? sorted.slice(0, props.limit) : sorted
})

function entryLink(entry: NotionEntry) {
  if (entry.type === 'photo') {
    return {
      path: `/post/${entry.slug}`,
      query: { from: 'photography', id: entry.id },
    }
  }
  if (entry.belong === '课程') {
    return { path: `/post/${entry.slug}`, query: { from: 'courses' } }
  }
  return `/post/${entry.slug}`
}
</script>

<template>
  <div class="title-column">
    <h2 class="title-column-label">{{ label }}</h2>
    <ul
      v-if="items.length"
      class="title-column-list"
      :class="{ 'title-column-list--hovering': hoveredId }"
    >
      <li
        v-for="entry in items"
        :key="entry.id"
        class="title-column-item"
        @mouseenter="hoveredId = entry.id"
        @mouseleave="hoveredId = null"
      >
        <router-link :to="entryLink(entry)" class="title-column-link">
          <span class="title-column-link-text">{{ entry.title }}</span>
        </router-link>
      </li>
    </ul>
    <p v-else class="title-column-empty">暂无内容</p>
  </div>
</template>
