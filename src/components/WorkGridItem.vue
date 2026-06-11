<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NotionEntry } from '@/types/notion'
import { formatWorkMeta, resolveCardMedia, resolveEntryLink } from '@/lib/notion-mapper'

const props = defineProps<{
  entry: NotionEntry
}>()

const imageFailed = ref(false)
const media = computed(() => resolveCardMedia(props.entry))
const showImage = computed(
  () => media.value.mode === 'image' && media.value.coverImage && !imageFailed.value
)
const thumbnail = computed(() => media.value.thumbnail || '📄')
const metaLabel = computed(() => formatWorkMeta(props.entry))

const postLink = computed(() => resolveEntryLink(props.entry))
</script>

<template>
  <a
    v-if="postLink.external"
    :href="postLink.href"
    class="work-card"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div v-if="showImage" class="work-card-cover">
      <img
        :src="media.coverImage"
        :alt="entry.title"
        loading="lazy"
        @error="imageFailed = true"
      />
    </div>
    <div v-else class="work-card-cover work-card-cover--placeholder">
      {{ thumbnail }}
    </div>

    <h3 class="work-card-title">{{ entry.title }}</h3>
    <p class="work-card-meta">{{ metaLabel }}</p>
  </a>
  <router-link v-else :to="postLink.route ?? postLink.href" class="work-card">
    <div v-if="showImage" class="work-card-cover">
      <img
        :src="media.coverImage"
        :alt="entry.title"
        loading="lazy"
        @error="imageFailed = true"
      />
    </div>
    <div v-else class="work-card-cover work-card-cover--placeholder">
      {{ thumbnail }}
    </div>

    <h3 class="work-card-title">{{ entry.title }}</h3>
    <p class="work-card-meta">{{ metaLabel }}</p>
  </router-link>
</template>
