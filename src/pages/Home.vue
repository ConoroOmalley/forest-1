<script setup lang="ts">
import { blogConfig, posts } from '@/data/posts'
import BlogHeader from '@/components/BlogHeader.vue'
import PostList from '@/components/PostList.vue'
</script>

<template>
  <div class="blog-page">
    <BlogHeader :config="blogConfig" />
    <PostList :posts="posts" />
  </div>
</template>
