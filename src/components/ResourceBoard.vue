<script setup lang="ts">
import { computed } from 'vue'
import type { NotionEntry } from '@/types/notion'
import { groupResourcesByCategory } from '@/lib/notion-mapper'
import ResourceLinkItem from './ResourceLinkItem.vue'

const props = defineProps<{
  entries: NotionEntry[]
}>()

const groups = computed(() => groupResourcesByCategory(props.entries))
</script>

<template>
  <div v-if="groups.length" class="resource-groups">
    <section v-for="group in groups" :key="group.category" class="resource-group">
      <h3 class="resource-group-title">{{ group.category }}</h3>
      <div class="resource-group-list">
        <ResourceLinkItem
          v-for="entry in group.entries"
          :key="entry.id"
          :entry="entry"
        />
      </div>
    </section>
  </div>

  <p v-else class="feed-empty">暂无资源</p>
</template>
