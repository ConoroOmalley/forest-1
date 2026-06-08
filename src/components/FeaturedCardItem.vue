<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NotionEntry } from '@/types/notion'
import { formatDateLabel, resolveCardMedia } from '@/lib/notion-mapper'

const props = defineProps<{
  entry: NotionEntry
}>()

const imageFailed = ref(false)
const media = computed(() => resolveCardMedia(props.entry))
const showImage = computed(
  () => media.value.mode === 'image' && media.value.coverImage && !imageFailed.value
)
const thumbnail = computed(() => media.value.thumbnail || '📚')
const metaLabel = computed(() => {
  if (props.entry.category[0]) return props.entry.category[0]
  if (props.entry.belong) return props.entry.belong
  return formatDateLabel(props.entry.date)
})

const postLink = computed(() => ({
  path: `/post/${props.entry.slug}`,
  query: { from: 'courses' },
}))
</script>

<template>
  <router-link :to="postLink" class="featured-card">
    <div class="featured-card-top">
      <div v-if="showImage" class="featured-card-avatar-wrap">
        <img
          :src="media.coverImage"
          :alt="entry.title"
          class="featured-card-avatar"
          loading="lazy"
          @error="imageFailed = true"
        />
      </div>
      <div v-else class="featured-card-avatar-wrap featured-card-avatar-wrap--placeholder">
        {{ thumbnail }}
      </div>
      <span class="featured-card-action">查看</span>
    </div>

    <h3 class="featured-card-title">{{ entry.title }}</h3>
    <p v-if="metaLabel" class="featured-card-meta">{{ metaLabel }}</p>
    <p v-if="entry.summary" class="featured-card-desc">{{ entry.summary }}</p>
  </router-link>
</template>
