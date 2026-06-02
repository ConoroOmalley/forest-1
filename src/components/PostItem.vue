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

      <span class="text-[12px] font-bold text-black mt-2">{{ post.dateLabel }}</span>
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
