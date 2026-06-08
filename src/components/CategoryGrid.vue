<script setup lang="ts">
import { posts, courses, photos } from '@/data/posts'

const categories = [
  { title: '文章', count: posts.length, to: '/articles', suffix: '篇', icon: '📝' },
  { title: '课程', count: courses.length, to: '/courses', suffix: '门', icon: '📚' },
  { title: '摄影', count: photos.length, to: '/photography', suffix: '张', icon: '📷' },
]
</script>

<template>
  <div class="category-grid">
    <router-link
      v-for="category in categories"
      :key="category.title"
      :to="category.to"
      class="category-card"
    >
      <span class="category-card-icon">{{ category.icon }}</span>
      <span class="category-card-text">
        <span class="category-card-title">{{ category.title }}</span>
        <span class="category-card-count">{{ category.count }} {{ category.suffix }}</span>
      </span>
    </router-link>
  </div>
</template>
