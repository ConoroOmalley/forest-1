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
  <header class="site-header">
    <div class="site-header-inner">
      <router-link to="/" class="site-identity">
        <img
          :src="blogConfig.avatar"
          :alt="blogConfig.label"
          width="40"
          height="40"
          class="site-identity-avatar"
        />
        <span class="site-identity-text">
          <span class="site-identity-name">{{ blogConfig.label }}</span>
          <span class="site-identity-role">{{ blogConfig.description }}</span>
        </span>
      </router-link>

      <nav class="site-nav" aria-label="主导航">
        <template v-for="item in navItems" :key="item.href + item.title">
          <a
            v-if="item.external"
            :href="item.href"
            class="site-nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ item.title }}
          </a>
          <router-link
            v-else
            :to="item.href"
            class="site-nav-link"
            :class="{ 'site-nav-link--active': isActive(item.href) }"
          >
            {{ item.title }}
          </router-link>
        </template>
      </nav>
    </div>
  </header>
</template>
