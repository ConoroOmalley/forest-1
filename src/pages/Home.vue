<script setup lang="ts">
import { posts, projects, designBooks } from '@/data/posts'
import HeroIntro from '@/components/HeroIntro.vue'
import TitleListColumn from '@/components/TitleListColumn.vue'
</script>

<template>
  <div class="blog-page home-page">
    <section class="home-intro">
      <HeroIntro :show-statement="true" />
    </section>

    <section class="home-top">
      <TitleListColumn label="文章" :entries="posts" :limit="8" />
      <TitleListColumn label="项目" :entries="projects" :limit="8" />
      <TitleListColumn label="书籍" :entries="designBooks" :limit="8" />
    </section>
  </div>
</template>
