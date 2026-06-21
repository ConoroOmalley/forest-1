<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { blogConfig, menus } from '@/data/posts'
import { isExternalMenuHref, resolveMenuHref } from '@/lib/notion-mapper'

const route = useRoute()

const navItems = computed(() => {
  const items: { title: string; href: string; external: boolean }[] = []
  for (const item of menus) {
    const href = resolveMenuHref(item)
    if (href === '/') continue
    items.push({ title: item.title, href, external: isExternalMenuHref(href) })
  }
  return items
})

function isActive(href: string) {
  if (href === '/articles') {
    return route.path === '/articles' || route.path.startsWith('/post/')
  }
  return route.path === href || route.path.startsWith(`${href}/`)
}
</script>

<template>
  <header class="top-nav">
    <div class="top-nav-inner">
      <router-link to="/" class="top-nav-brand">{{ blogConfig.label }}</router-link>

      <nav class="top-nav-links" aria-label="主导航">
        <router-link to="/" class="top-nav-link" :class="{ 'top-nav-link--active': route.name === 'Home' }">
          首页
        </router-link>
        <template v-for="item in navItems" :key="item.href + item.title">
          <a
            v-if="item.external"
            :href="item.href"
            class="top-nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ item.title }}
          </a>
          <router-link
            v-else
            :to="item.href"
            class="top-nav-link"
            :class="{ 'top-nav-link--active': isActive(item.href) }"
          >
            {{ item.title }}
          </router-link>
        </template>
      </nav>
    </div>
  </header>
</template>
