<script setup lang="ts">
import { blogConfig } from '@/data/posts'
import BlogHeader from '@/components/BlogHeader.vue'
</script>

<template>
  <div class="blog-page">
    <BlogHeader :config="blogConfig" />
  </div>
</template>
