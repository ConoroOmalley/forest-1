import type { NotionEntry } from '@/types/notion'

/** 解析 Notion date 列（YYYY/MM/DD 或 YYYY-MM-DD） */
export function parseNotionDate(dateStr: string): Date {
  const normalized = dateStr.replace(/\//g, '-')
  const [y, m, d] = normalized.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** 卡片底部日期展示 */
export function formatDateLabel(dateStr: string): string {
  const date = parseNotionDate(dateStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (target.getTime() === today.getTime()) {
    return '今天'
  }

  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${mm}/${dd}`
}

/** 活动/课程列表日期：3月22日周日 */
export function formatEventDate(dateStr: string): string {
  const date = parseNotionDate(dateStr)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${date.getMonth() + 1}月${date.getDate()}日${weekdays[date.getDay()]}`
}

/** 作品卡片元信息：分类, 年份 */
export function formatWorkMeta(entry: NotionEntry): string {
  const category = entry.category[0] || entry.belong || 'Work'
  const year = parseNotionDate(entry.date).getFullYear()
  return `${category}, ${year}`
}

function extractLeadingEmoji(text: string): string | undefined {
  const match = text.match(/^(\p{Extended_Pictographic}+)/u)
  return match?.[1]
}

export interface CardMedia {
  mode: 'image' | 'text'
  coverImage?: string
  thumbnail: string
}

/**
 * icon 列 → 卡片右侧媒体
 * - URL / 本地路径 → 图片卡片
 * - 空 → 从 title 提取 emoji，否则默认 📄
 */
export function resolveCardMedia(entry: NotionEntry): CardMedia {
  const icon = entry.icon?.trim()
  if (icon && (icon.startsWith('http') || icon.startsWith('/'))) {
    return { mode: 'image', coverImage: icon, thumbnail: '' }
  }

  const thumbnail = icon || extractLeadingEmoji(entry.title) || '📄'
  return { mode: 'text', thumbnail }
}

/** 详情页是否额外展示 icon 封面（避免与正文图片重复） */
export function shouldShowDetailCover(entry: NotionEntry): boolean {
  const media = resolveCardMedia(entry)
  if (media.mode !== 'image' || !media.coverImage) return false
  if (entry.type === 'photo') return false

  return !extractImagesFromContent(entry.content ?? '').some(
    (img) => img.src === media.coverImage
  )
}

/** 不在菜单内容区展示的类型 */
const NON_CONTENT_TYPES = new Set(['Menu', 'SubMenu', 'Config', 'Notice'])

/** belong 列 → 归属菜单（文章 / 课程 / 摄影…） */
export function resolveBelong(entry: NotionEntry): string | undefined {
  return entry.belong || undefined
}

/** 可出现在菜单内容列表的条目 */
export function isPublishedContent(entry: NotionEntry): boolean {
  return entry.status === 'Published' && !NON_CONTENT_TYPES.has(entry.type)
}

/** 按 belong 筛选菜单下的内容，按 date 降序 */
export function getEntriesByBelong(entries: NotionEntry[], belong: string): NotionEntry[] {
  return entries
    .filter((entry) => isPublishedContent(entry) && resolveBelong(entry) === belong)
    .sort((a, b) => parseNotionDate(b.date).getTime() - parseNotionDate(a.date).getTime())
}

/** 摄影页：type=photo 且 status=Published，按 date 降序 */
export function getPhotoEntries(entries: NotionEntry[]): NotionEntry[] {
  return entries
    .filter((entry) => entry.status === 'Published' && entry.type === 'photo')
    .sort((a, b) => parseNotionDate(b.date).getTime() - parseNotionDate(a.date).getTime())
}
export function isPublishedMenu(entry: NotionEntry): boolean {
  return entry.type === 'Menu' && entry.status === 'Published'
}

/**
 * Menu.slug → 站内路由
 * - `/` → 首页
 * - `#` → 按 title 映射（文章/课程等）
 * - `/search` → 摄影页
 * - 外链 → 原样返回
 */
export function resolveMenuHref(entry: NotionEntry): string {
  const slug = entry.slug?.trim() || ''
  const title = entry.title.trim()

  if (slug.startsWith('http://') || slug.startsWith('https://')) {
    return slug
  }

  const titleRoutes: Record<string, string> = {
    首页: '/',
    文章: '/articles',
    课程: '/courses',
    摄影: '/photography',
  }

  if (titleRoutes[title]) {
    return titleRoutes[title]
  }

  if (slug === '/' || slug === '') return '/'
  if (slug === '/search') return '/photography'
  if (slug.startsWith('/')) return slug
  if (slug === '#') return titleRoutes[title] ?? '/'

  return `/${slug}`
}

export function isExternalMenuHref(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://')
}

export interface PhotoItem {
  id: string
  src: string
  alt: string
  slug: string
  title: string
}

/** 从文章 HTML 正文中提取图片 */
export function extractImagesFromContent(html: string): { src: string; alt: string }[] {
  if (!html) return []

  const images: { src: string; alt: string }[] = []
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g

  for (const match of html.matchAll(imgRegex)) {
    const src = match[1]?.trim()
    if (!src) continue

    const altMatch = match[0].match(/alt="([^"]*)"/)
    images.push({ src, alt: altMatch?.[1]?.trim() || '' })
  }

  return images
}

function isImageUrl(url: string): boolean {
  return url.startsWith('http') || url.startsWith('/')
}

/** 从单条 photo 条目收集图片（正文优先，否则用 icon） */
export function collectPhotosFromEntry(entry: NotionEntry): PhotoItem[] {
  const items: PhotoItem[] = []

  for (const { src, alt } of extractImagesFromContent(entry.content ?? '')) {
    items.push({
      id: entry.id,
      src,
      alt: alt || entry.title,
      slug: entry.slug,
      title: entry.title,
    })
  }

  if (items.length === 0) {
    const icon = entry.icon?.trim()
    if (icon && isImageUrl(icon)) {
      items.push({
        id: entry.id,
        src: icon,
        alt: entry.title,
        slug: entry.slug,
        title: entry.title,
      })
    }
  }

  return items
}

/** 详情页返回路由 */
export function resolveBackRoute(entry: NotionEntry): string {
  if (entry.type === 'photo') return '/photography'
  if (entry.belong === '课程') return '/courses'
  if (entry.belong === '摄影') return '/photography'
  return '/articles'
}

const FROM_ROUTES: Record<string, string> = {
  photography: '/photography',
  courses: '/courses',
  articles: '/articles',
}

export function resolveBackRouteFromQuery(from?: string, entry?: NotionEntry): string {
  if (from && FROM_ROUTES[from]) return FROM_ROUTES[from]
  if (entry) return resolveBackRoute(entry)
  return '/articles'
}

/** 摄影页：从 photo 条目正文中收集全部图片 */
export function collectPhotosFromEntries(entries: NotionEntry[]): PhotoItem[] {
  return entries.flatMap(collectPhotosFromEntry)
}
