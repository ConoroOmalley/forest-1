/** Notion 数据库 type 列 */
export type NotionEntryType = 'Config' | 'Notice' | 'Post'

/** Notion 数据库 status 列 */
export type NotionEntryStatus = 'Published' | 'Invisible' | 'Draft'

/**
 * 与 Notion 表格列一一对应的数据结构
 *
 * | Notion 列   | 字段       |
 * |------------|------------|
 * | type       | type       |
 * | title      | title      |
 * | summary    | summary    |
 * | status     | status     |
 * | category   | category   |
 * | tags       | tags       |
 * | slug       | slug       |
 * | date       | date       |
 * | password   | password   |
/**
 * icon 列 → 卡片右侧封面，同步时按以下优先级自动填充：
 * 1. Notion 表格 icon 列（URL 或 emoji）
 * 2. 页面 Cover（Post Gallery 常用）
 * 3. 页面 Icon
 * 4. 正文第一张图片
 */
 */
export interface NotionEntry {
  type: NotionEntryType
  title: string
  summary: string
  status: NotionEntryStatus
  category: string[]
  tags: string[]
  slug: string
  date: string
  password?: string
  icon?: string
  content?: string
}

export interface BlogConfig {
  label: string
  description: string
  avatar: string
  totalReads: string
}
