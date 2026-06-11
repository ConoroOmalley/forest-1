<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NotionEntry } from '@/types/notion'
import { parseNotionDate, resolveEntryLink } from '@/lib/notion-mapper'

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

const itemsWithLinks = computed(() =>
  items.value.map((entry) => ({
    entry,
    link: resolveEntryLink(entry),
  }))
)
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
        v-for="{ entry, link } in itemsWithLinks"
        :key="entry.id"
        class="title-column-item"
        @mouseenter="hoveredId = entry.id"
        @mouseleave="hoveredId = null"
      >
        <a
          v-if="link.external"
          :href="link.href"
          class="title-column-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="title-column-link-text">{{ entry.title }}</span>
        </a>
        <router-link v-else :to="link.route ?? link.href" class="title-column-link">
          <span class="title-column-link-text">{{ entry.title }}</span>
        </router-link>
      </li>
    </ul>
    <p v-else class="title-column-empty">暂无内容</p>
  </div>
</template>
