<script setup lang="ts">
import { photos } from '@/data/posts'
import WorkSectionLabel from '@/components/WorkSectionLabel.vue'
import WorkGrid from '@/components/WorkGrid.vue'
</script>

<template>
  <div class="blog-page">
    <section class="work-section">
      <WorkSectionLabel label="摄影 ↓" />
      <WorkGrid v-if="photos.length" :entries="photos" />
      <section v-else class="empty-state">
        <p>暂无摄影，请在 Notion 中将内容的 type 设为「photo」</p>
      </section>
    </section>
  </div>
</template>
