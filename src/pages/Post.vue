<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPostBySlug, blogConfig } from '@/data/posts'
import { formatDateLabel, resolveCardMedia } from '@/lib/notion-mapper'

const route = useRoute()
const router = useRouter()

const post = computed(() => getPostBySlug(route.params.slug as string))
const media = computed(() => (post.value ? resolveCardMedia(post.value) : null))
const dateLabel = computed(() => (post.value ? formatDateLabel(post.value.date) : ''))

function goBack() {
  router.push('/')
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
        v-if="media?.mode === 'image' && media.coverImage"
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
        返回首页
      </button>
    </section>
  </div>
</template>
