<template>
  <div class="blog-shell" :class="{ 'blog-shell--home': isHome }">
    <SiteHeader v-if="!isHome" />
    <main class="blog-main" :class="{ 'blog-main--home': isHome }">
      <router-view />
    </main>
    <SiteFooter v-if="!isHome" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'

const route = useRoute()
const isHome = computed(() => route.name === 'Home')
</script>
