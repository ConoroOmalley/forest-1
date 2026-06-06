<script setup lang="ts">
import { computed } from 'vue'
import type { NotionEntry } from '@/types/notion'
import { parseNotionDate } from '@/lib/notion-mapper'
import PostItem from './PostItem.vue'

const props = defineProps<{
  posts: NotionEntry[]
}>()

const sortedPosts = computed(() => {
  return [...props.posts].sort(
    (a, b) => parseNotionDate(b.date).getTime() - parseNotionDate(a.date).getTime()
  )
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <PostItem v-for="post in sortedPosts" :key="post.slug" :post="post" />
  </div>
</template>
