<script setup lang="ts">
import type { BlogConfig } from '@/data/posts'

defineProps<{
  config: BlogConfig
}>()
</script>

<template>
  <div class="featured-grid">
    <article class="featured-card featured-card--static">
      <div class="featured-card-top">
        <img
          :src="config.avatar"
          alt="头像"
          width="44"
          height="44"
          class="featured-card-avatar"
        />
      </div>
      <h3 class="featured-card-title">{{ config.label }}</h3>
      <p class="featured-card-desc">{{ config.description }}</p>
    </article>
  </div>
</template>
