<script setup lang="ts">
import type { BlogConfig } from '@/data/posts'

defineProps<{
  config: BlogConfig
}>()
</script>

<template>
  <article class="featured-profile">
    <img
      :src="config.avatar"
      alt="头像"
      width="56"
      height="56"
      class="featured-profile-avatar"
    />

    <div class="featured-profile-body">
      <h3 class="featured-profile-title">{{ config.label }}</h3>
      <p class="featured-profile-desc">{{ config.description }}</p>
    </div>
  </article>
</template>
