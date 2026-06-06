<script setup lang="ts">
import { courses } from '@/data/posts'
import PostList from '@/components/PostList.vue'
</script>

<template>
  <div class="blog-page">
    <PostList v-if="courses.length" :posts="courses" />
    <section v-else class="card-white py-12 text-center">
      <p class="text-[15px] text-neutral-500">暂无课程，请在 Notion 中将内容的 belong 设为「课程」</p>
    </section>
  </div>
</template>
