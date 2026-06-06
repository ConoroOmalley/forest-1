<template>
  <div class="blog-shell">
    <div class="blog-layout">
      <div class="blog-nav-slot">
        <BlogNav />
      </div>
      <main class="blog-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import BlogNav from '@/components/BlogNav.vue'
</script>
