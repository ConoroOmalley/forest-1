<script setup lang="ts">
import { computed } from 'vue'
import type { NotionEntry } from '@/types/notion'
import { sortEntriesByDateDesc } from '@/lib/notion-mapper'
import WorkGridItem from './WorkGridItem.vue'

const props = defineProps<{
  entries: NotionEntry[]
  limit?: number
}>()

const sortedEntries = computed(() => {
  const sorted = sortEntriesByDateDesc(props.entries)
  return props.limit ? sorted.slice(0, props.limit) : sorted
})
</script>

<template>
  <div class="work-grid">
    <WorkGridItem
      v-for="entry in sortedEntries"
      :key="entry.id"
      :entry="entry"
    />
  </div>
</template>
