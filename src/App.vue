<template>
  <div class="blog-shell">
    <main class="blog-main">
      <router-view />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import SiteFooter from '@/components/SiteFooter.vue'
</script>
