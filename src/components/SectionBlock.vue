<script setup lang="ts">
defineProps<{
  title: string
  location?: string
  actionLabel?: string
  actionTo?: string
}>()
</script>

<template>
  <section class="section-block">
    <div class="section-header">
      <div class="section-header-left">
        <h2 class="section-title">{{ title }}</h2>
        <span v-if="location" class="section-location">{{ location }}</span>
      </div>
      <router-link v-if="actionLabel && actionTo" :to="actionTo" class="section-action">
        {{ actionLabel }}
        <span aria-hidden="true"> ›</span>
      </router-link>
    </div>
    <div class="section-body">
      <slot />
    </div>
  </section>
</template>
