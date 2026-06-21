/** Notion 数据库 type 列 */
export type NotionEntryType =
  | 'Config'
  | 'Notice'
  | 'Post'
  | 'Page'
  | 'Menu'
  | 'SubMenu'
  | 'photo'
  | 'ziliao'
  | 'ziyuan'

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
 * | belong     | belong     |
 * | URL        | url        |
 *
 * Menu：status=Published 且 type=Menu → 左侧导航
 * belong：内容归属菜单（文章 / 课程 / 摄影 / 资料…）
 * slug：菜单跳转路径（# 时按 title 映射站内路由）
 * 正文 content 来自 Notion 页面块，不在表格列中。
 */
export interface NotionEntry {
  /** Notion 页面 ID，用于 slug 重复时精确定位 */
  id: string
  type: NotionEntryType
  title: string
  summary: string
  status: NotionEntryStatus
  category: string[]
  tags: string[]
  slug: string
  date: string
  /** Notion 页面最后编辑时间，用于同日内容排序 */
  lastEditedTime?: string
  belong?: string
  password?: string
  icon?: string
  url?: string
  content?: string
}

export interface NavIntroPart {
  kind: 'text' | 'menu' | 'highlight'
  value: string
}

export interface BlogConfig {
  label: string
  /** 个人简介，来自 Notion 数据库页「添加描述」 */
  description: string
  avatar: string
  /** 首页顶部 banner，来自 Notion 表格页 cover */
  banner?: string
  totalReads: string
  /** @deprecated 旧版导航段落，新同步不再写入 */
  navIntro?: NavIntroPart[][]
}
