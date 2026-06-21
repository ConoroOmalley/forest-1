<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NotionEntry } from '@/types/notion'
import {
  formatTimelineEntryMeta,
  formatTimelineLocation,
  parseNotionDate,
  resolveCardMedia,
  resolveEntryLink,
} from '@/lib/notion-mapper'

const props = defineProps<{
  posts: NotionEntry[]
  projects: NotionEntry[]
  books: NotionEntry[]
}>()

type TabKey = 'all' | 'posts' | 'projects' | 'books'

const activeTab = ref<TabKey>('all')

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'posts', label: '文章' },
  { key: 'projects', label: '项目' },
  { key: 'books', label: '书籍' },
]

const filteredEntries = computed(() => {
  let list: NotionEntry[] = []
  if (activeTab.value === 'posts') list = props.posts
  else if (activeTab.value === 'projects') list = props.projects
  else if (activeTab.value === 'books') list = props.books
  else list = [...props.posts, ...props.projects, ...props.books]

  return [...list].sort(
    (a, b) => parseNotionDate(b.date).getTime() - parseNotionDate(a.date).getTime()
  )
})

function entryMedia(entry: NotionEntry) {
  return resolveCardMedia(entry)
}

function entryLink(entry: NotionEntry) {
  const link = resolveEntryLink(entry)
  if (link.external || !link.route) return link

  return {
    ...link,
    route: {
      ...link.route,
      query: { ...link.route.query, from: 'home' },
    },
  }
}
</script>

<template>
  <section class="content-feed">
    <div class="feed-header">
      <h2 class="feed-title">内容</h2>
      <div class="feed-toolbar">
        <div class="feed-tabs" role="tablist">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            role="tab"
            class="feed-tab"
            :class="{ 'feed-tab--active': activeTab === tab.key }"
            :aria-selected="activeTab === tab.key"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <ul v-if="filteredEntries.length" class="feed-grid">
      <li v-for="entry in filteredEntries" :key="entry.id" class="feed-grid-item">
        <component
          :is="entryLink(entry).external ? 'a' : 'router-link'"
          v-bind="
            entryLink(entry).external
              ? {
                  href: entryLink(entry).href,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                }
              : { to: entryLink(entry).route ?? entryLink(entry).href }
          "
          class="feed-card"
        >
          <div class="feed-card-thumb">
            <img
              v-if="entryMedia(entry).mode === 'image' && entryMedia(entry).coverImage"
              :src="entryMedia(entry).coverImage!"
              :alt="entry.title"
              loading="lazy"
            />
            <span v-else class="feed-card-thumb-emoji">{{ entryMedia(entry).thumbnail }}</span>
          </div>

          <div class="feed-card-body">
            <p class="feed-card-meta">{{ formatTimelineEntryMeta(entry) }}</p>
            <h4 class="feed-card-title">{{ entry.title }}</h4>
            <p v-if="formatTimelineLocation(entry)" class="feed-card-location">
              {{ formatTimelineLocation(entry) }}
            </p>
          </div>
        </component>
      </li>
    </ul>

    <p v-else class="feed-empty">暂无内容</p>
  </section>
</template>
