<script setup lang="ts">
import { linkResources } from '@/data/posts'
import WorkSectionLabel from '@/components/WorkSectionLabel.vue'
import ResourceBoard from '@/components/ResourceBoard.vue'
</script>

<template>
  <div class="blog-page">
    <section class="work-section">
      <WorkSectionLabel label="资源 ↓" />
      <ResourceBoard v-if="linkResources.length" :entries="linkResources" />
      <section v-else class="empty-state">
        <p>暂无资源，请在 Notion 中将内容的 belong 设为「资源」</p>
      </section>
    </section>
  </div>
</template>
