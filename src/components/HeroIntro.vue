<script setup lang="ts">
import { computed } from 'vue'
import { blogConfig, menus } from '@/data/posts'
import { isExternalMenuHref, resolveMenuHref } from '@/lib/notion-mapper'

defineProps<{
  showStatement?: boolean
}>()

const menuHrefMap = computed(() => {
  const map = new Map<string, { href: string; external: boolean }>()
  for (const item of menus) {
    const href = resolveMenuHref(item)
    map.set(item.title, { href, external: isExternalMenuHref(href) })
  }
  return map
})

function menuMeta(label: string) {
  return menuHrefMap.value.get(label)
}
</script>

<template>
  <section v-if="showStatement" class="hero-statement">
    <p class="hero-statement-text">
      <template v-for="(line, lineIndex) in blogConfig.navIntro" :key="lineIndex">
        <template v-for="(part, partIndex) in line" :key="`${lineIndex}-${partIndex}`">
          <span v-if="part.kind === 'text'">{{ part.value }}</span>
          <template v-else-if="part.kind === 'menu' && menuMeta(part.value)">
            <a
              v-if="menuMeta(part.value)!.external"
              :href="menuMeta(part.value)!.href"
              class="hero-statement-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ part.value }}
            </a>
            <router-link v-else :to="menuMeta(part.value)!.href" class="hero-statement-link">
              {{ part.value }}
            </router-link>
          </template>
          <span v-else-if="part.kind === 'menu'">{{ part.value }}</span>
        </template>
      </template>
    </p>
  </section>
</template>
