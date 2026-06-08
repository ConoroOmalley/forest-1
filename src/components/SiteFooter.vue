<script setup lang="ts">
import { blogConfig } from '@/data/posts'
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer-bar">
      <span>Designed and coded with care.</span>
      <span>© {{ new Date().getFullYear() }} {{ blogConfig.label }}</span>
    </div>
  </footer>
</template>
