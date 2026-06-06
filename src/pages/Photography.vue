<script setup lang="ts">
import { computed } from 'vue'
import { photos } from '@/data/posts'
import { collectPhotosFromEntries } from '@/lib/notion-mapper'
import PhotoGrid from '@/components/PhotoGrid.vue'

const photoItems = computed(() => collectPhotosFromEntries(photos))
</script>

<template>
  <div class="blog-page">
    <PhotoGrid v-if="photoItems.length" :photos="photoItems" />
    <section v-else class="card-white py-12 text-center">
      <p class="text-[15px] text-neutral-500">暂无摄影，请在 Notion 中将内容的 type 设为「photo」并在正文中插入图片</p>
    </section>
  </div>
</template>
