<script setup lang="ts">
import type { BlogPost } from '@/data/posts'

defineProps<{
  post: BlogPost
}>()
</script>

<template>
  <router-link :to="`/post/${post.id}`" class="card-entry">
    <!-- 左侧：文字 -->
    <div class="card-entry-body flex flex-col min-h-[calc(72px+2.5rem)]">
      <h3 class="card-entry-title text-[15px] mb-2">
        {{ post.title }}
      </h3>

      <p class="text-[12px] text-neutral-500 leading-[1.55] line-clamp-2 flex-1">
        {{ post.excerpt }}
      </p>

      <div class="flex items-center gap-2 mt-2">
        <span class="text-[12px] font-bold text-black">{{ post.dateLabel }}</span>
        <svg
          class="w-3.5 h-3.5 text-neutral-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          aria-hidden="true"
        >
          <path
            d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <!-- 右侧：图片（上、右间距与卡片 p-5 一致） -->
    <div
      v-if="post.cardType === 'image' && post.coverImage"
      class="card-entry-media"
    >
      <img
        :src="post.coverImage"
        :alt="post.title"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    <div
      v-else
      class="card-entry-media flex items-center justify-center text-xl text-neutral-400"
    >
      {{ post.thumbnail }}
    </div>
  </router-link>
</template>
