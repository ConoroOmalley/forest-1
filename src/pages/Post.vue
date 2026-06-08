<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPostBySlug, blogConfig } from '@/data/posts'
import {
  formatWorkMeta,
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
const metaLabel = computed(() => (post.value ? formatWorkMeta(post.value) : ''))

function goBack() {
  const from = typeof route.query.from === 'string' ? route.query.from : undefined
  router.push(resolveBackRouteFromQuery(from, post.value))
}
</script>

<template>
  <div v-if="post" class="blog-page blog-page--detail">
    <button class="text-link mb-8" @click="goBack">← 返回</button>

    <header class="post-detail-header">
      <h1 class="post-detail-title">{{ post.title }}</h1>
      <p class="post-detail-meta">{{ metaLabel }}</p>
    </header>

    <div v-if="showCover && media?.coverImage" class="post-detail-cover">
      <img :src="media.coverImage" :alt="post.title" />
    </div>

    <div class="post-content" v-html="post.content ?? ''" />
  </div>

  <div v-else class="blog-page">
    <section class="empty-state">
      <p class="mb-4">内容不存在</p>
      <button class="text-link" @click="goBack">返回</button>
    </section>
  </div>
</template>
