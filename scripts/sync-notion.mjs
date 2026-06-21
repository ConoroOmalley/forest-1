import { Client } from '@notionhq/client'
import { readFileSync, writeFileSync, mkdirSync, createWriteStream, existsSync } from 'node:fs'
import { resolve, dirname, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { pipeline } from 'node:stream/promises'
import { execFileSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const notionImagesDir = resolve(__dirname, '../public/images/notion')
const notionFilesDir = resolve(__dirname, '../public/files/notion')

/** 优先读 process.env（Vercel 注入），本地可回退到 .env 文件 */
function loadEnv() {
  const fileEnv = {}
  const envPath = resolve(__dirname, '../.env')

  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      if (!line || line.startsWith('#')) continue
      const idx = line.indexOf('=')
      if (idx === -1) continue
      fileEnv[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
    }
  }

  const NOTION_TOKEN = (process.env.NOTION_TOKEN || fileEnv.NOTION_TOKEN || '').trim()
  const NOTION_DATABASE_ID = (process.env.NOTION_DATABASE_ID || fileEnv.NOTION_DATABASE_ID || '').trim()

  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
    throw new Error(
      '缺少 Notion 配置：请设置 NOTION_TOKEN 和 NOTION_DATABASE_ID。\n' +
        '本地：复制 .env.example 为 .env 并填入；\n' +
        'Vercel：Project Settings → Environment Variables 中添加这两个变量。'
    )
  }

  return { NOTION_TOKEN, NOTION_DATABASE_ID }
}

function richTextToPlain(richText = []) {
  return richText.map((item) => item.plain_text).join('')
}

function richTextToHtml(richText = []) {
  return richText
    .map((item) => {
      let text = item.plain_text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      if (item.annotations?.code) text = `<code>${text}</code>`
      if (item.annotations?.bold) text = `<strong>${text}</strong>`
      if (item.annotations?.italic) text = `<em>${text}</em>`
      if (item.href) text = `<a href="${item.href}" target="_blank" rel="noopener">${text}</a>`
      return text
    })
    .join('')
}

async function fetchAllBlocks(notion, blockId) {
  const blocks = []
  let cursor
  do {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    })
    blocks.push(...res.results)
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)
  return blocks
}

/** HEIC/HEIF 浏览器不支持，转为 JPG（macOS 用 sips） */
function convertHeicToJpg(filePath, maxSize = 512) {
  const ext = extname(filePath).toLowerCase()
  if (ext !== '.heic' && ext !== '.heif') return filePath

  const jpgPath = filePath.replace(/\.(heic|heif)$/i, '.jpg')
  if (existsSync(jpgPath)) return jpgPath

  if (process.platform === 'darwin') {
    try {
      const args = ['-s', 'format', 'jpeg', '-Z', String(maxSize), filePath, '--out', jpgPath]
      execFileSync('sips', args, { stdio: 'ignore' })
      if (existsSync(jpgPath)) return jpgPath
    } catch (err) {
      console.warn('[notion-sync] HEIC convert failed:', err.message)
    }
  } else {
    console.warn('[notion-sync] HEIC image skipped (no converter on this platform):', filePath)
  }

  return filePath
}

function toWebImagePath(filePath) {
  return `/images/notion/${basename(filePath)}`
}

function ensureWebImagePath(webPath, maxSize = 512) {
  if (!webPath?.startsWith('/images/notion/')) return webPath
  const filePath = resolve(notionImagesDir, basename(webPath))
  if (!existsSync(filePath)) return webPath
  return toWebImagePath(convertHeicToJpg(filePath, maxSize))
}

async function downloadImage(url, { force = false } = {}) {
  mkdirSync(notionImagesDir, { recursive: true })
  const hash = createHash('md5').update(url.split('?')[0]).digest('hex').slice(0, 12)
  let ext = '.jpg'
  try {
    const pathname = new URL(url).pathname
    const fromPath = extname(pathname)
    if (fromPath) ext = fromPath
  } catch {
    // ignore
  }
  const filename = `${hash}${ext}`
  const localPath = `/images/notion/${filename}`
  const filePath = resolve(notionImagesDir, filename)

  if (!force) {
    try {
      readFileSync(filePath)
      return toWebImagePath(convertHeicToJpg(filePath))
    } catch {
      // not cached yet
    }
  }

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`)
  await pipeline(res.body, createWriteStream(filePath))
  return toWebImagePath(convertHeicToJpg(filePath))
}

async function localizeImages(html) {
  const imgRegex = /<img src="([^"]+)"/g
  let result = html
  const matches = [...html.matchAll(imgRegex)]
  for (const match of matches) {
    const remoteUrl = match[1]
    if (!remoteUrl.startsWith('http')) continue
    try {
      const localPath = await downloadImage(remoteUrl)
      result = result.replace(remoteUrl, localPath)
    } catch (err) {
      console.warn('[notion-sync] image download failed:', err.message)
    }
  }
  return result
}

async function downloadFile(url, name = '') {
  mkdirSync(notionFilesDir, { recursive: true })
  const hash = createHash('md5').update(url.split('?')[0]).digest('hex').slice(0, 12)
  let ext = extname(name)
  if (!ext) {
    try {
      ext = extname(new URL(url).pathname)
    } catch {
      ext = ''
    }
  }
  const filename = `${hash}${ext || '.bin'}`
  const filePath = resolve(notionFilesDir, filename)
  const localPath = `/files/notion/${filename}`

  if (!existsSync(filePath)) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to download file: ${res.status}`)
    await pipeline(res.body, createWriteStream(filePath))
  }

  return { localPath, filePath, name: name || basename(filename) }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function resolveFileBlockName(data, url) {
  if (data.name) return data.name
  if (data.caption?.length) return richTextToPlain(data.caption)

  try {
    const pathname = decodeURIComponent(new URL(url).pathname)
    const fromUrl = basename(pathname.split('?')[0])
    if (fromUrl && fromUrl !== 'download') return fromUrl
  } catch {
    // ignore
  }

  return 'download'
}

async function fileBlockToHtml(url, name) {
  const { localPath, filePath, name: fileName } = await downloadFile(url, name)
  const lowerName = fileName.toLowerCase()
  const isMarkdown = /\.(md|markdown)$/.test(lowerName)

  if (isMarkdown) {
    const markdown = readFileSync(filePath, 'utf8')
    return `<pre class="notion-raw-file"><code>${escapeHtml(markdown)}</code></pre>`
  }

  const safeName = escapeHtml(fileName)

  return `<p class="notion-file-wrap"><a class="notion-file" href="${localPath}" download="${safeName}"><span class="notion-file-icon" aria-hidden="true">↓</span><span class="notion-file-meta"><span class="notion-file-name">${safeName}</span><span class="notion-file-hint">点击下载</span></span></a></p>`
}

async function blocksToHtml(notion, blocks) {
  const parts = []

  for (const block of blocks) {
    const type = block.type
    const data = block[type]
    if (!data) continue

    switch (type) {
      case 'paragraph': {
        const html = richTextToHtml(data.rich_text)
        if (html) parts.push(`<p>${html}</p>`)
        break
      }
      case 'heading_1':
        parts.push(`<h1>${richTextToHtml(data.rich_text)}</h1>`)
        break
      case 'heading_2':
        parts.push(`<h2>${richTextToHtml(data.rich_text)}</h2>`)
        break
      case 'heading_3':
        parts.push(`<h3>${richTextToHtml(data.rich_text)}</h3>`)
        break
      case 'quote':
        parts.push(`<blockquote>${richTextToHtml(data.rich_text)}</blockquote>`)
        break
      case 'bulleted_list_item':
        parts.push(`<ul><li>${richTextToHtml(data.rich_text)}</li></ul>`)
        break
      case 'numbered_list_item':
        parts.push(`<ol><li>${richTextToHtml(data.rich_text)}</li></ol>`)
        break
      case 'code':
        parts.push(`<pre><code>${richTextToPlain(data.rich_text)}</code></pre>`)
        break
      case 'divider':
        parts.push('<hr />')
        break
      case 'callout':
        parts.push(`<blockquote class="callout">${richTextToHtml(data.rich_text)}</blockquote>`)
        break
      case 'image': {
        const url = data.file?.url || data.external?.url
        if (url) {
          const alt = richTextToPlain(data.caption) || 'image'
          parts.push(`<figure class="notion-image"><img src="${url}" alt="${alt}" loading="lazy" /></figure>`)
        }
        break
      }
      case 'file':
      case 'pdf': {
        const url = data.file?.url || data.external?.url
        const name = resolveFileBlockName(data, url)
        if (!url) break
        try {
          parts.push(await fileBlockToHtml(url, name))
        } catch (err) {
          console.warn('[notion-sync] file block failed:', err.message)
          const fallbackName = name || 'download'
          parts.push(
            `<p><a href="${url}" target="_blank" rel="noopener noreferrer">${fallbackName}</a></p>`
          )
        }
        break
      }
      case 'synced_block':
      case 'column_list':
      case 'column':
        if (block.has_children) {
          const children = await fetchAllBlocks(notion, block.id)
          parts.push(await blocksToHtml(notion, children))
        }
        break
      default:
        if (block.has_children) {
          const children = await fetchAllBlocks(notion, block.id)
          parts.push(await blocksToHtml(notion, children))
        }
        break
    }
  }

  return parts.join('\n')
}

function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]+/g, '')
    .slice(0, 60)
}

function findFirstImageInHtml(html) {
  const match = html.match(/<img[^>]+src="([^"]+)"/)
  return match?.[1]
}

async function findFirstImageUrlDeep(notion, blocks) {
  for (const block of blocks) {
    if (block.type === 'image') {
      const url = block.image?.external?.url || block.image?.file?.url
      if (url) return { url, external: !!block.image?.external?.url }
    }

    if (block.has_children) {
      const children = await fetchAllBlocks(notion, block.id)
      const nested = await findFirstImageUrlDeep(notion, children)
      if (nested) return nested
    }
  }

  return undefined
}

/** 外部 URL 直接用于卡片封面；Notion 托管文件则下载到本地 */
async function resolveIconUrl(url, preferRemote, { force = false } = {}) {
  if (preferRemote) return url
  try {
    return await downloadImage(url, { force })
  } catch {
    return url
  }
}

/** 卡片封面：页面 cover → 正文首图 → 页面 icon（emoji/图片） */
async function resolveEntryCover(notion, page, blocks, contentHtml) {
  const coverUrl = page.cover?.external?.url || page.cover?.file?.url
  if (coverUrl) {
    return resolveIconUrl(coverUrl, page.cover?.type === 'external')
  }

  const firstBlockImg = await findFirstImageUrlDeep(notion, blocks)
  if (firstBlockImg) {
    return resolveIconUrl(firstBlockImg.url, firstBlockImg.external)
  }

  const htmlImg = findFirstImageInHtml(contentHtml)
  if (htmlImg && isImageUrl(htmlImg)) {
    if (htmlImg.startsWith('/images/notion/')) return htmlImg
    return resolveIconUrl(htmlImg, htmlImg.startsWith('http') && !htmlImg.includes('notion'))
  }

  if (page.icon?.type === 'emoji') {
    return page.icon.emoji
  }

  const pageIconUrl = extractPageIconUrl(page.icon)
  if (pageIconUrl) {
    return resolveIconUrl(pageIconUrl, page.icon?.type === 'external')
  }

  return undefined
}

function isImageUrl(url) {
  return typeof url === 'string' && (url.startsWith('http') || url.startsWith('/'))
}

function readAvatarProperty(page) {
  const prop = page.properties?.avatar
  if (!prop) return undefined

  if (prop.type === 'files' && prop.files?.length) {
    const file = prop.files[0]
    return file.external?.url || file.file?.url
  }
  if (prop.type === 'url' && prop.url) return prop.url
  if (prop.type === 'rich_text') {
    const text = richTextToPlain(prop.rich_text).trim()
    if (text) return text
  }
  return undefined
}

function extractPageIconUrl(icon) {
  if (!icon) return undefined
  switch (icon.type) {
    case 'external':
      return icon.external?.url
    case 'file':
      return icon.file?.url
    case 'custom_emoji':
      return icon.custom_emoji?.url
    default:
      return undefined
  }
}

async function fetchDatabaseMeta(databaseId, token) {
  const headers = (version) => ({
    Authorization: `Bearer ${token}`,
    'Notion-Version': version,
  })

  const [legacyRes, modernRes] = await Promise.all([
    fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
      headers: headers('2022-06-28'),
    }),
    fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
      headers: headers('2025-09-03'),
    }),
  ])

  if (!legacyRes.ok && !modernRes.ok) {
    throw new Error(`Database meta fetch failed: ${legacyRes.status}/${modernRes.status}`)
  }

  const legacy = legacyRes.ok ? await legacyRes.json() : {}
  const modern = modernRes.ok ? await modernRes.json() : {}

  // 2022 能读到 custom_emoji icon；2025 能读到 cover，合并两者
  return {
    ...legacy,
    ...modern,
    icon: modern.icon ?? legacy.icon,
    cover: modern.cover ?? legacy.cover,
  }
}

async function resolvePageMediaUrl(media, preferRemote, { force = false } = {}) {
  if (!media) return undefined
  const url = extractPageIconUrl(media) || media.external?.url || media.file?.url
  if (!url) return undefined
  return resolveIconUrl(url, preferRemote ?? media.type === 'external', { force })
}

/** 博客头像：表格页 icon → avatar 列 → 同名条目（不用 cover，cover 留给 banner） */
async function resolveBlogAvatar(dbMeta, databaseTitle, databaseDescription, pages, entries) {
  const iconUrl = extractPageIconUrl(dbMeta.icon)
  if (iconUrl) {
    const local = await resolveIconUrl(iconUrl, false)
    return ensureWebImagePath(local)
  }

  let avatarFromRow
  for (const page of pages) {
    const raw = readAvatarProperty(page)
    if (!isImageUrl(raw)) continue

    const type = page.properties?.type?.select?.name
    const resolved = raw.startsWith('http')
      ? await resolveIconUrl(raw, !raw.includes('notion'))
      : raw

    if (type === 'Config') return ensureWebImagePath(resolved)
    avatarFromRow ??= resolved
  }
  if (avatarFromRow) return ensureWebImagePath(avatarFromRow)

  const titledEntry = entries.find(
    (entry) => entry.title === databaseTitle && isImageUrl(entry.icon)
  )
  if (titledEntry?.icon) return ensureWebImagePath(titledEntry.icon)

  const profileEntry = entries.find(
    (entry) =>
      entry.type === 'Page' &&
      isImageUrl(entry.icon) &&
      databaseDescription &&
      databaseDescription.includes(entry.title.replace(/的人$/, ''))
  )
  if (profileEntry?.icon) return ensureWebImagePath(profileEntry.icon)

  const noticeEntry = entries.find((entry) => entry.type === 'Notice')
  if (noticeEntry?.content) {
    const match = noticeEntry.content.match(/<img src="([^"]+)"/)
    if (match && isImageUrl(match[1])) return ensureWebImagePath(match[1])
  }

  return '/images/avatar.png'
}

/** 首页 banner：表格页 cover → Config/同名条目 cover（每次同步强制拉取最新） */
async function resolveBlogBanner(dbMeta, databaseTitle, pages) {
  const pageCover = await resolvePageMediaUrl(
    dbMeta.cover,
    dbMeta.cover?.type === 'external',
    { force: true }
  )
  if (pageCover) return ensureWebImagePath(pageCover, 4096)

  for (const page of pages) {
    const coverUrl = page.cover?.external?.url || page.cover?.file?.url
    if (!coverUrl) continue

    const type = page.properties?.type?.select?.name
    const title = richTextToPlain(page.properties?.title?.title)
    if (type !== 'Config' && title !== databaseTitle) continue

    const local = await resolveIconUrl(coverUrl, page.cover?.type === 'external', { force: true })
    return ensureWebImagePath(local, 4096)
  }

  return undefined
}

function readUrlProperty(properties) {
  for (const prop of Object.values(properties ?? {})) {
    if (prop?.type === 'url' && prop.url) return prop.url
  }
  return undefined
}

function readCategoryProperty(properties) {
  const prop = properties?.category
  if (!prop) return []

  if (prop.type === 'multi_select') {
    return (prop.multi_select ?? []).map((item) => item.name).filter(Boolean)
  }

  if (prop.type === 'select' && prop.select?.name) {
    return [prop.select.name]
  }

  return []
}

function formatResourceTitleFromUrl(url) {
  try {
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`
    const { hostname } = new URL(normalized)
    return hostname.replace(/^www\./i, '')
  } catch {
    return url
  }
}

function mapPageToEntry(page, contentHtml, icon) {
  const p = page.properties

  const type = p.type?.select?.name ?? 'Post'
  let title = richTextToPlain(p.title?.title)
  const summary = richTextToPlain(p.summary?.rich_text)
  const status = p.status?.select?.name ?? 'Draft'
  const category = readCategoryProperty(p)
  const tags = (p.tags?.multi_select ?? []).map((t) => t.name)
  const slugRaw = richTextToPlain(p.slug?.rich_text)
  const url = readUrlProperty(p)
  if (!title && url) title = formatResourceTitleFromUrl(url)
  const slug = slugRaw || slugify(title) || page.id.replace(/-/g, '')
  const password = richTextToPlain(p.password?.rich_text) || undefined
  const belong = p.belong?.select?.name || undefined
  const dateStart = p.date?.date?.start ?? page.created_time?.slice(0, 10)
  const date = dateStart.replace(/-/g, '/')

  const resolvedBelong =
    belong ||
    (type === 'Post' && status === 'Published' ? (url ? '项目' : '文章') : undefined)

  return {
    id: page.id,
    type,
    title,
    summary,
    status,
    category,
    tags,
    slug,
    date,
    lastEditedTime: page.last_edited_time,
    belong: resolvedBelong,
    password,
    icon,
    url,
    content: contentHtml,
  }
}

async function queryAllPages(notion, dataSourceId) {
  const pages = []
  let cursor
  do {
    const res = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      page_size: 100,
    })
    pages.push(...res.results.filter((item) => item.object === 'page'))
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)
  return pages
}

function dedupeSlugs(entries) {
  const groups = new Map()

  for (const entry of entries) {
    if (!groups.has(entry.slug)) groups.set(entry.slug, [])
    groups.get(entry.slug).push(entry)
  }

  return entries.map((entry) => {
    const group = groups.get(entry.slug)
    if (group.length <= 1) return entry

    const shortId = entry.id.replace(/-/g, '').slice(-8)
    return { ...entry, slug: `${entry.slug}-${shortId}` }
  })
}

export async function syncNotion() {
  const env = loadEnv()
  const notion = new Client({ auth: env.NOTION_TOKEN })

  const db = await notion.databases.retrieve({ database_id: env.NOTION_DATABASE_ID })
  const dbMeta = await fetchDatabaseMeta(env.NOTION_DATABASE_ID, env.NOTION_TOKEN)
  const dataSourceId = db.data_sources?.[0]?.id
  if (!dataSourceId) throw new Error('No data source found on database')

  const databaseTitle = richTextToPlain(dbMeta.title ?? db.title) || 'Blog'
  const databaseDescription = richTextToPlain(dbMeta.description ?? db.description) || ''
  const pages = await queryAllPages(notion, dataSourceId)
  const entries = []

  for (const page of pages) {
    const pageType = page.properties?.type?.select?.name
    let blocks = []
    let content = ''
    let icon

    if (pageType === 'ziyuan') {
      icon = await resolveEntryCover(notion, page, blocks, content)
    } else {
      blocks = await fetchAllBlocks(notion, page.id)
      content = await blocksToHtml(notion, blocks)
      content = await localizeImages(content)
      icon = await resolveEntryCover(notion, page, blocks, content)
    }

    entries.push(mapPageToEntry(page, content, icon))
  }

  const normalizedEntries = dedupeSlugs(entries)
  const avatar = await resolveBlogAvatar(
    dbMeta,
    databaseTitle,
    databaseDescription,
    pages,
    normalizedEntries
  )
  const banner = await resolveBlogBanner(dbMeta, databaseTitle, pages)

  const blogConfig = {
    label: databaseTitle,
    description: databaseDescription,
    avatar,
    ...(banner ? { banner } : {}),
    totalReads: '2.4万',
  }

  const output = {
    syncedAt: new Date().toISOString(),
    blogConfig,
    entries: normalizedEntries,
  }

  const outPath = resolve(__dirname, '../src/data/notion-cache.json')
  writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8')
  console.log(`Synced ${normalizedEntries.length} entries → ${outPath}`)
  return output
}

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url)
if (isDirectRun) {
  syncNotion().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
