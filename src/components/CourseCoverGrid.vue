<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NotionEntry } from '@/types/notion'
import { parseNotionDate, resolveCardMedia } from '@/lib/notion-mapper'

const props = defineProps<{
  courses: NotionEntry[]
  limit?: number
}>()

const failed = ref(new Set<string>())

const sortedCourses = computed(() => {
  const sorted = [...props.courses].sort(
    (a, b) => parseNotionDate(b.date).getTime() - parseNotionDate(a.date).getTime()
  )
  return props.limit ? sorted.slice(0, props.limit) : sorted
})

function cover(entry: NotionEntry) {
  return resolveCardMedia(entry)
}

function onError(id: string) {
  failed.value.add(id)
  failed.value = new Set(failed.value)
}

function showImage(entry: NotionEntry) {
  return cover(entry).coverImage && !failed.value.has(entry.id)
}
</script>

<template>
  <div class="course-cover-grid">
    <router-link
      v-for="course in sortedCourses"
      :key="course.id"
      :to="{ path: `/post/${course.slug}`, query: { from: 'courses' } }"
      class="course-cover-item"
      :aria-label="course.title"
    >
      <img
        v-if="showImage(course)"
        :src="cover(course).coverImage"
        :alt="course.title"
        loading="lazy"
        @error="onError(course.id)"
      />
      <span v-else class="course-cover-placeholder">{{ cover(course).thumbnail }}</span>
    </router-link>
  </div>
</template>
