<script setup lang="ts">
import { blogConfig } from '@/data/posts'
</script>

<template>
  <section class="profile-hero">
    <div class="profile-banner" aria-hidden="true">
      <img
        v-if="blogConfig.banner"
        :src="blogConfig.banner"
        :alt="`${blogConfig.label} banner`"
        class="profile-banner-image"
        fetchpriority="high"
        decoding="async"
      />
    </div>

    <div class="profile-panel">
      <div class="profile-avatar-wrap">
        <img
          :src="blogConfig.avatar"
          :alt="blogConfig.label"
          width="96"
          height="96"
          class="profile-avatar"
        />
      </div>

      <div class="profile-details">
        <h1 class="profile-title">{{ blogConfig.label }}</h1>

        <p v-if="blogConfig.description" class="profile-bio">{{ blogConfig.description }}</p>
      </div>
    </div>
  </section>
</template>
