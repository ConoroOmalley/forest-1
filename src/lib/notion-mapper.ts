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

/** 列表只展示已发布的 Post */
export function isPublishedPost(entry: NotionEntry): boolean {
  return entry.type === 'Post' && entry.status === 'Published'
}
