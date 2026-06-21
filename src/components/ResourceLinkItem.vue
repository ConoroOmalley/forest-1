<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NotionEntry } from '@/types/notion'
import {
  resolveResourceFavicon,
  resolveResourceTitle,
  resolveResourceUrl,
} from '@/lib/notion-mapper'

const props = defineProps<{
  entry: NotionEntry
}>()

const iconFailed = ref(false)

const href = computed(() => resolveResourceUrl(props.entry) ?? '#')
const title = computed(() => resolveResourceTitle(props.entry))
const favicon = computed(() => resolveResourceFavicon(props.entry))
</script>

<template>
  <a
    :href="href"
    class="resource-chip"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span class="resource-chip-icon-wrap">
      <img
        v-if="favicon && !iconFailed"
        :src="favicon"
        :alt="`${title} icon`"
        class="resource-chip-icon"
        loading="lazy"
        @error="iconFailed = true"
      />
      <span v-else class="resource-chip-icon-fallback">{{ title.slice(0, 1).toUpperCase() }}</span>
    </span>
    <span class="resource-chip-title">{{ title }}</span>
    <span class="resource-chip-arrow" aria-hidden="true">↗</span>
  </a>
</template>
