import type { BlogConfig, NotionEntry } from '@/types/notion'
import {
  getEntriesByBelong,
  getPhotoEntries,
  isPublishedContent,
  isPublishedMenu,
  parseNotionDate,
} from '@/lib/notion-mapper'
import notionCache from '@/data/notion-cache.json'

export type { BlogConfig, NotionEntry } from '@/types/notion'

export const blogConfig: BlogConfig = notionCache.blogConfig

export const notionEntries: NotionEntry[] = notionCache.entries as NotionEntry[]

/** 文章菜单内容：belong = 文章 */
export const posts = getEntriesByBelong(notionEntries, '文章')

/** 课程菜单内容：belong = 课程 */
export const courses = getEntriesByBelong(notionEntries, '课程')

/** 项目：belong = 项目 */
export const projects = getEntriesByBelong(notionEntries, '项目')

/** 设计书籍：belong = 书籍 */
export const designBooks = getEntriesByBelong(notionEntries, '书籍')

/** 资料：belong = 资料 */
export const resources = getEntriesByBelong(notionEntries, '资料')

/** 摄影菜单内容：type = photo */
export const photos = getPhotoEntries(notionEntries)

/** 左侧导航：type=Menu 且 status=Published，按 Notion date 升序 */
export const menus = notionEntries
  .filter(isPublishedMenu)
  .sort((a, b) => parseNotionDate(a.date).getTime() - parseNotionDate(b.date).getTime())

export function getPostBySlug(slug: string, id?: string): NotionEntry | undefined {
  if (id) {
    const byId = notionEntries.find(
      (entry) => isPublishedContent(entry) && entry.id === id
    )
    if (byId) return byId
  }

  return notionEntries.find(
    (entry) => isPublishedContent(entry) && entry.slug === slug
  )
}

export function formatReadCount(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  }
  return String(count)
}
