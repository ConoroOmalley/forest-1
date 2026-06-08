<script setup lang="ts">
import { posts } from '@/data/posts'
import WorkSectionLabel from '@/components/WorkSectionLabel.vue'
import WorkGrid from '@/components/WorkGrid.vue'
</script>

<template>
  <div class="blog-page">
    <section class="work-section">
      <WorkSectionLabel label="文章 ↓" />
      <WorkGrid v-if="posts.length" :entries="posts" />
      <section v-else class="empty-state">
        <p>暂无文章，请在 Notion 中将内容的 belong 设为「文章」</p>
      </section>
    </section>
  </div>
</template>
