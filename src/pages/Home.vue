<script setup lang="ts">
import { posts, projects, designBooks, resources } from '@/data/posts'
import HomeProfile from '@/components/HomeProfile.vue'
import ContentFeed from '@/components/ContentFeed.vue'
</script>

<template>
  <div class="blog-page home-page">
    <HomeProfile />
    <ContentFeed :posts="posts" :projects="projects" :books="designBooks" :resources="resources" />
  </div>
</template>
