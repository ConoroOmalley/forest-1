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
</script>

<template>
  <router-link :to="`/post/${post.slug}`" class="card-entry">
    <!-- 左侧：文字（title / summary / date ← Notion 列） -->
    <div class="card-entry-body flex flex-col min-h-[calc(72px+2.5rem)]">
      <h3 class="card-entry-title text-[15px] mb-2">
        {{ post.title }}
      </h3>

      <p class="text-[12px] text-neutral-500 leading-[1.55] line-clamp-2 flex-1">
        {{ post.summary }}
      </p>

      <span class="text-[12px] font-bold text-black mt-2">{{ dateLabel }}</span>
    </div>

    <!-- 右侧：icon / cover → 封面图或 emoji -->
    <div v-if="showImage" class="card-entry-media">
      <img
        :src="media.coverImage"
        :alt="post.title"
        class="w-full h-full object-cover"
        loading="lazy"
        @error="imageFailed = true"
      />
    </div>
    <div
      v-else
      class="card-entry-media flex items-center justify-center text-xl text-neutral-400"
    >
      {{ thumbnail }}
    </div>
  </router-link>
</template>
