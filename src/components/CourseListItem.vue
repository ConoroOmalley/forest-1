<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NotionEntry } from '@/types/notion'
import { blogConfig } from '@/data/posts'
import { formatEventDate, resolveCardMedia } from '@/lib/notion-mapper'

const props = defineProps<{
  entry: NotionEntry
}>()

const imageFailed = ref(false)
const media = computed(() => resolveCardMedia(props.entry))
const showImage = computed(
  () => media.value.mode === 'image' && media.value.coverImage && !imageFailed.value
)
const thumbnail = computed(() => media.value.thumbnail || '📚')
const eventDate = computed(() => formatEventDate(props.entry.date))
const metaLabel = computed(() => {
  if (props.entry.category[0]) return props.entry.category[0]
  if (props.entry.summary) return props.entry.summary
  return props.entry.belong || ''
})

const postLink = computed(() => ({
  path: `/post/${props.entry.slug}`,
  query: { from: 'courses' },
}))
</script>

<template>
  <router-link :to="postLink" class="course-item">
    <div v-if="showImage" class="course-item-thumb">
      <img
        :src="media.coverImage"
        :alt="entry.title"
        loading="lazy"
        @error="imageFailed = true"
      />
    </div>
    <div v-else class="course-item-thumb course-item-thumb--placeholder">
      {{ thumbnail }}
    </div>

    <div class="course-item-body">
      <p class="course-item-date">{{ eventDate }}</p>
      <h3 class="course-item-title">{{ entry.title }}</h3>
      <div class="course-item-host">
        <img
          :src="blogConfig.avatar"
          alt=""
          width="20"
          height="20"
          class="course-item-host-avatar"
        />
        <span>由 {{ blogConfig.label }} 主办</span>
      </div>
      <p v-if="metaLabel" class="course-item-meta">{{ metaLabel }}</p>
    </div>
  </router-link>
</template>
