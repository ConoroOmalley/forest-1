<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPostBySlug, blogConfig } from '@/data/posts'
import {
  formatDateLabel,
  resolveBackRouteFromQuery,
  resolveCardMedia,
  shouldShowDetailCover,
} from '@/lib/notion-mapper'

const route = useRoute()
const router = useRouter()

const post = computed(() => {
  const slug = route.params.slug as string
  const id = typeof route.query.id === 'string' ? route.query.id : undefined
  return getPostBySlug(slug, id)
})
const media = computed(() => (post.value ? resolveCardMedia(post.value) : null))
const showCover = computed(() => (post.value ? shouldShowDetailCover(post.value) : false))
const dateLabel = computed(() => (post.value ? formatDateLabel(post.value.date) : ''))
const backLabel = computed(() => {
  const from = typeof route.query.from === 'string' ? route.query.from : undefined
  if (from === 'photography') return '返回摄影'
  if (from === 'courses') return '返回课程'
  return '返回文章'
})

function goBack() {
  const from = typeof route.query.from === 'string' ? route.query.from : undefined
  router.push(resolveBackRouteFromQuery(from, post.value))
}
</script>

<template>
  <div v-if="post" class="blog-page">
    <section class="card-white">
      <div class="mb-4">
        <button class="icon-btn" @click="goBack">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <h1 class="text-[28px] font-bold text-black leading-[1.3] tracking-tight mb-2">
        {{ post.title }}
      </h1>

      <p class="text-[13px] text-[#aaaaaa] mb-4">{{ dateLabel }} · 阅读 {{ blogConfig.totalReads }}</p>

      <div
        v-if="showCover && media?.coverImage"
        class="aspect-square w-full overflow-hidden mb-5"
      >
        <img
          :src="media.coverImage"
          :alt="post.title"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="post-content" v-html="post.content ?? ''" />
    </section>
  </div>

  <div v-else class="blog-page">
    <section class="card-white text-center py-16">
      <p class="text-neutral-500 mb-4">文章不存在</p>
      <button class="tag-pill hover:bg-[#e0e0e0] transition-colors" @click="goBack">
        {{ backLabel }}
      </button>
    </section>
  </div>
</template>
