<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { NotionEntry } from '@/types/notion'
import ResourceBoard from '@/components/ResourceBoard.vue'
import {
  formatTimelineEntryMeta,
  formatTimelineLocation,
  resolveCardMedia,
  resolveEntryLink,
  resolveResourceCategory,
  resolveResourceTitle,
  sortEntriesByDateDesc,
} from '@/lib/notion-mapper'

const props = defineProps<{
  posts: NotionEntry[]
  projects: NotionEntry[]
  books: NotionEntry[]
  materials: NotionEntry[]
  linkResources: NotionEntry[]
}>()

type TabKey = 'posts' | 'materials' | 'linkResources' | 'projects' | 'books'

const tabs = computed(() => {
  const result: { key: TabKey; label: string }[] = []
  if (props.posts.length) result.push({ key: 'posts', label: '文章' })
  if (props.materials.length) result.push({ key: 'materials', label: '资料' })
  if (props.linkResources.length) result.push({ key: 'linkResources', label: '资源' })
  if (props.projects.length) result.push({ key: 'projects', label: '项目' })
  if (props.books.length) result.push({ key: 'books', label: '书籍' })
  return result
})

const activeTab = ref<TabKey>('posts')

watch(tabs, (next) => {
  if (!next.some((tab) => tab.key === activeTab.value)) {
    activeTab.value = next[0]?.key ?? 'posts'
  }
}, { immediate: true })

const filteredEntries = computed(() => {
  if (activeTab.value === 'posts') return sortEntriesByDateDesc(props.posts)
  if (activeTab.value === 'projects') return sortEntriesByDateDesc(props.projects)
  if (activeTab.value === 'books') return sortEntriesByDateDesc(props.books)
  if (activeTab.value === 'materials') return sortEntriesByDateDesc(props.materials)
  return sortEntriesByDateDesc(props.linkResources)
})

function entryTitle(entry: NotionEntry) {
  if (entry.type === 'ziyuan' || entry.belong === '资源') {
    return resolveResourceTitle(entry)
  }
  return entry.title
}

function entryLocation(entry: NotionEntry) {
  if (entry.type === 'ziyuan' || entry.belong === '资源') {
    return resolveResourceCategory(entry)
  }
  return formatTimelineLocation(entry)
}

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
        <div v-if="tabs.length" class="feed-tabs" role="tablist">
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

    <ResourceBoard
      v-if="activeTab === 'linkResources' && filteredEntries.length"
      :entries="filteredEntries"
    />

    <ul v-else-if="filteredEntries.length" class="feed-grid">
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
            <h4 class="feed-card-title">{{ entryTitle(entry) }}</h4>
            <p v-if="entryLocation(entry)" class="feed-card-location">
              {{ entryLocation(entry) }}
            </p>
          </div>
        </component>
      </li>
    </ul>

    <p v-else class="feed-empty">暂无内容</p>
  </section>
</template>
