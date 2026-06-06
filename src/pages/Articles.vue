<script setup lang="ts">
import { posts } from '@/data/posts'
import PostList from '@/components/PostList.vue'
</script>

<template>
  <div class="blog-page">
    <PostList v-if="posts.length" :posts="posts" />
    <section v-else class="card-white py-12 text-center">
      <p class="text-[15px] text-neutral-500">暂无文章，请在 Notion 中将内容的 belong 设为「文章」</p>
    </section>
  </div>
</template>
