<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PhotoItem } from '@/lib/notion-mapper'

const props = defineProps<{
  photos: PhotoItem[]
  compact?: boolean
}>()

const failed = ref(new Set<string>())

const visiblePhotos = computed(() =>
  props.photos.filter((photo) => !failed.value.has(photo.src))
)

function onError(src: string) {
  failed.value.add(src)
  failed.value = new Set(failed.value)
}
</script>

<template>
  <div class="photo-grid" :class="{ 'photo-grid--compact': compact }">
    <router-link
      v-for="(photo, index) in visiblePhotos"
      :key="`${photo.id}-${index}-${photo.src}`"
      :to="{
        path: `/post/${photo.slug}`,
        query: { from: 'photography', id: photo.id },
      }"
      class="photo-grid-item"
      :aria-label="photo.title"
    >
      <img
        :src="photo.src"
        :alt="photo.alt"
        loading="lazy"
        @error="onError(photo.src)"
      />
    </router-link>
  </div>
</template>
