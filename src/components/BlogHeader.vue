<script setup lang="ts">
import type { BlogConfig } from '@/data/posts'

defineProps<{
  config: BlogConfig
}>()
</script>

<template>
  <section class="intro-block">
    <img
      :src="config.avatar"
      alt="头像"
      width="575"
      height="1024"
      class="intro-avatar block w-[100px] h-auto"
    />

    <p class="text-[22px] font-bold leading-[1.45] text-black">
      {{ config.description }}
    </p>
  </section>
</template>
