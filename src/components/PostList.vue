<script setup lang="ts">
import { ref, computed } from 'vue'
import type { NotionEntry } from '@/types/notion'
import { parseNotionDate } from '@/lib/notion-mapper'
import PostItem from './PostItem.vue'

const props = defineProps<{
  posts: NotionEntry[]
}>()

type SortOrder = 'asc' | 'desc'

const sortOrder = ref<SortOrder>('desc')

const sortedPosts = computed(() => {
  const list = [...props.posts]
  list.sort((a, b) => {
    const diff = parseNotionDate(a.date).getTime() - parseNotionDate(b.date).getTime()
    return sortOrder.value === 'asc' ? diff : -diff
  })
  return list
})

const sortLabel = computed(() => (sortOrder.value === 'asc' ? '正序' : '倒序'))

function toggleSort() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between gap-4 px-1">
      <h2 class="text-[26px] font-bold text-black tracking-tight">文章</h2>
      <button class="icon-btn" :title="sortLabel" @click="toggleSort">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <PostItem v-for="post in sortedPosts" :key="post.slug" :post="post" />
  </div>
</template>
