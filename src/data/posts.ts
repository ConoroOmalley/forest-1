import type { BlogConfig, NotionEntry } from '@/types/notion'
import { isPublishedPost } from '@/lib/notion-mapper'
import notionCache from '@/data/notion-cache.json'

export type { BlogConfig, NotionEntry } from '@/types/notion'

export const blogConfig: BlogConfig = notionCache.blogConfig

export const notionEntries: NotionEntry[] = notionCache.entries as NotionEntry[]

/** 首页卡片列表：type=Post 且 status=Published */
export const posts = notionEntries.filter(isPublishedPost)

export function getPostBySlug(slug: string): NotionEntry | undefined {
  return notionEntries.find((entry) => entry.type === 'Post' && entry.slug === slug)
}

export function formatReadCount(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  }
  return String(count)
}
