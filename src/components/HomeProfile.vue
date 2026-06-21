<script setup lang="ts">
import { blogConfig } from '@/data/posts'
import { socialLinks } from '@/data/social'
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

        <div class="profile-social">
          <a
            v-for="link in socialLinks"
            :key="link.id"
            :href="link.url"
            class="profile-social-tag"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${link.label}：${link.tooltip}`"
          >
            <img
              :src="link.icon"
              :alt="`${link.label} icon`"
              class="profile-social-icon"
              width="18"
              height="18"
            />
            <span>{{ link.label }}</span>
            <span class="profile-social-tooltip" role="tooltip">{{ link.tooltip }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
