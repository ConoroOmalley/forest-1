<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NotionEntry } from '@/types/notion'
import { formatDateLabel, resolveCardMedia } from '@/lib/notion-mapper'

const props = defineProps<{
  post: NotionEntry
}>()

const imageFailed = ref(false)
const media = computed(() => resolveCardMedia(props.post))
const dateLabel = computed(() => formatDateLabel(props.post.date))
const showImage = computed(
  () => media.value.mode === 'image' && media.value.coverImage && !imageFailed.value
)
const thumbnail = computed(() => media.value.thumbnail || '📄')
const venueLabel = computed(() => {
  if (props.post.category[0]) return props.post.category[0]
  if (props.post.tags[0]) return props.post.tags[0]
  if (props.post.belong) return props.post.belong
  if (props.post.type === 'photo') return '摄影'
  return ''
})

const postLink = computed(() => {
  if (props.post.type === 'photo') {
    return {
      path: `/post/${props.post.slug}`,
      query: { from: 'photography', id: props.post.id },
    }
  }
  return `/post/${props.post.slug}`
})
</script>

<template>
  <router-link :to="postLink" class="card-event">
    <div v-if="showImage" class="card-event-thumb">
      <img
        :src="media.coverImage"
        :alt="post.title"
        loading="lazy"
        @error="imageFailed = true"
      />
    </div>
    <div v-else class="card-event-thumb card-event-thumb--placeholder">
      {{ thumbnail }}
    </div>

    <div class="card-event-body">
      <p class="card-event-date">{{ dateLabel }}</p>
      <h3 class="card-event-title">{{ post.title }}</h3>
      <p v-if="venueLabel" class="card-event-venue">{{ venueLabel }}</p>
    </div>
  </router-link>
</template>
