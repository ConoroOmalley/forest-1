<script setup lang="ts">
import { computed } from 'vue'
import type { NotionEntry } from '@/types/notion'
import { parseNotionDate } from '@/lib/notion-mapper'
import CourseListItem from './CourseListItem.vue'

const props = defineProps<{
  courses: NotionEntry[]
  limit?: number
}>()

const sortedCourses = computed(() => {
  const sorted = [...props.courses].sort(
    (a, b) => parseNotionDate(b.date).getTime() - parseNotionDate(a.date).getTime()
  )
  return props.limit ? sorted.slice(0, props.limit) : sorted
})
</script>

<template>
  <div class="course-list">
    <CourseListItem
      v-for="course in sortedCourses"
      :key="course.id"
      :entry="course"
    />
  </div>
</template>
