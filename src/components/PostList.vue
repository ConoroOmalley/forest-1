<script setup lang="ts">
import { computed } from 'vue'
import type { NotionEntry } from '@/types/notion'
import { parseNotionDate } from '@/lib/notion-mapper'
import PostItem from './PostItem.vue'

const props = defineProps<{
  posts: NotionEntry[]
  limit?: number
}>()

const sortedPosts = computed(() => {
  const sorted = [...props.posts].sort(
    (a, b) => parseNotionDate(b.date).getTime() - parseNotionDate(a.date).getTime()
  )
  return props.limit ? sorted.slice(0, props.limit) : sorted
})
</script>

<template>
  <div class="events-grid">
    <PostItem v-for="post in sortedPosts" :key="post.id" :post="post" />
  </div>
</template>
