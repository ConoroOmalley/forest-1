<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPostBySlug } from '@/data/posts'
import {
  formatWorkMeta,
  resolveBackRouteFromQuery,
  resolveProjectExternalUrl,
} from '@/lib/notion-mapper'

const route = useRoute()
const router = useRouter()

const post = computed(() => {
  const slug = route.params.slug as string
  const id = typeof route.query.id === 'string' ? route.query.id : undefined
  return getPostBySlug(slug, id)
})
const metaLabel = computed(() => (post.value ? formatWorkMeta(post.value) : ''))

const externalUrl = computed(() =>
  post.value ? resolveProjectExternalUrl(post.value) : null
)

watch(
  externalUrl,
  (url) => {
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
    const from = typeof route.query.from === 'string' ? route.query.from : undefined
    router.replace(resolveBackRouteFromQuery(from, post.value))
  },
  { immediate: true }
)

function goBack() {
  const from = typeof route.query.from === 'string' ? route.query.from : undefined
  router.push(resolveBackRouteFromQuery(from, post.value))
}
</script>

<template>
  <div v-if="post && !externalUrl" class="blog-page blog-page--detail">
    <div class="post-detail-topbar">
      <button class="post-back-btn" @click="goBack">← 返回</button>
    </div>

    <header class="post-detail-header">
      <h1 class="post-detail-title">{{ post.title }}</h1>
      <p class="post-detail-meta">{{ metaLabel }}</p>
    </header>

    <div class="post-content" v-html="post.content ?? ''" />
  </div>

  <div v-else class="blog-page blog-page--detail">
    <div class="post-detail-topbar">
      <button class="post-back-btn" @click="goBack">← 返回</button>
    </div>
    <section class="empty-state">
      <p class="mb-4">内容不存在</p>
    </section>
  </div>
</template>
