<script setup lang="ts">
import { courses } from '@/data/posts'
import WorkSectionLabel from '@/components/WorkSectionLabel.vue'
import WorkGrid from '@/components/WorkGrid.vue'
</script>

<template>
  <div class="blog-page">
    <section class="work-section">
      <WorkSectionLabel label="课程 ↓" />
      <WorkGrid v-if="courses.length" :entries="courses" />
      <section v-else class="empty-state">
        <p>暂无课程，请在 Notion 中将内容的 belong 设为「课程」</p>
      </section>
    </section>
  </div>
</template>
