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
 * | icon       | icon       |
 *
 * 正文 content 来自 Notion 页面块，不在表格列中。
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
