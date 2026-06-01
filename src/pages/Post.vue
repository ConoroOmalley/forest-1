<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPostById, blogConfig } from '@/data/posts'

const route = useRoute()
const router = useRouter()

const post = computed(() => getPostById(route.params.id as string))

function renderMarkdown(content: string): string {
  return content
    .split('\n\n')
    .map((block) => {
      if (block.startsWith('## ')) {
        return `<h2>${block.slice(3)}</h2>`
      }
      if (block.startsWith('> ')) {
        return `<blockquote>${block.slice(2)}</blockquote>`
      }
      if (block.startsWith('```')) {
        const code = block.replace(/```\w*\n?/, '').replace(/```$/, '')
        return `<pre><code>${code.trim()}</code></pre>`
      }
      if (block.match(/^[\d]+\. /m)) {
        const items = block
          .split('\n')
          .map((line) => `<li>${line.replace(/^[\d]+\. /, '')}</li>`)
          .join('')
        return `<ol>${items}</ol>`
      }
      if (block.startsWith('- ')) {
        const items = block
          .split('\n')
          .map((line) => `<li>${line.slice(2)}</li>`)
          .join('')
        return `<ul>${items}</ul>`
      }
      return `<p>${block.replace(/`([^`]+)`/g, '<code>$1</code>')}</p>`
    })
    .join('')
}

const htmlContent = computed(() => {
  if (!post.value) return ''
  return renderMarkdown(post.value.content)
})

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

      <p class="text-[13px] text-[#aaaaaa] mb-4">{{ post.dateLabel }} · 阅读 {{ blogConfig.totalReads }}</p>

      <div
        v-if="post.cardType === 'image' && post.coverImage"
        class="aspect-square w-full overflow-hidden mb-5"
      >
        <img
          :src="post.coverImage"
          :alt="post.title"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="post-content" v-html="htmlContent" />
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
