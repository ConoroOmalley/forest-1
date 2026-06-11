import { Client } from '@notionhq/client'
import { readFileSync, writeFileSync, mkdirSync, createWriteStream, existsSync } from 'node:fs'
import { resolve, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { pipeline } from 'node:stream/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const notionImagesDir = resolve(__dirname, '../public/images/notion')

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

async function downloadImage(url) {
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

  try {
    readFileSync(filePath)
    return localPath
  } catch {
    // not cached yet
  }

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`)
  await pipeline(res.body, createWriteStream(filePath))
  return localPath
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

function findFirstImageUrl(blocks) {
  for (const block of blocks) {
    if (block.type === 'image') {
      return block.image?.external?.url || block.image?.file?.url
    }
  }
  return undefined
}

/** 外部 URL 直接用于卡片封面；Notion 托管文件则下载到本地 */
async function resolveIconUrl(url, preferRemote) {
  if (preferRemote) return url
  try {
    return await downloadImage(url)
  } catch {
    return url
  }
}

/** 卡片封面：icon 列 → 页面 cover → 页面 icon → 正文首图 */
async function resolveEntryIcon(page, blocks, iconColumn) {
  const columnIcon = iconColumn?.trim()

  if (columnIcon) {
    if (columnIcon.startsWith('http')) return columnIcon
    return columnIcon
  }

  const coverUrl = page.cover?.external?.url || page.cover?.file?.url
  if (coverUrl) {
    return resolveIconUrl(coverUrl, page.cover?.type === 'external')
  }

  if (page.icon?.type === 'emoji') {
    return page.icon.emoji
  }

  const pageIconUrl = page.icon?.external?.url || page.icon?.file?.url
  if (pageIconUrl) {
    return resolveIconUrl(pageIconUrl, page.icon?.type === 'external')
  }

  const firstImg = findFirstImageUrl(blocks)
  if (firstImg) {
    const imageBlock = blocks.find((b) => b.type === 'image')
    return resolveIconUrl(firstImg, !!imageBlock?.image?.external?.url)
  }

  return undefined
}

function mapPageToEntry(page, contentHtml, icon) {
  const p = page.properties

  const type = p.type?.select?.name ?? 'Post'
  const title = richTextToPlain(p.title?.title)
  const summary = richTextToPlain(p.summary?.rich_text)
  const status = p.status?.select?.name ?? 'Draft'
  const category = p.category?.select?.name ? [p.category.select.name] : []
  const tags = (p.tags?.multi_select ?? []).map((t) => t.name)
  const slugRaw = richTextToPlain(p.slug?.rich_text)
  const slug = slugRaw || slugify(title) || page.id.replace(/-/g, '')
  const password = richTextToPlain(p.password?.rich_text) || undefined
  const belong = p.belong?.select?.name || undefined
  const dateStart = p.date?.date?.start ?? page.created_time?.slice(0, 10)
  const date = dateStart.replace(/-/g, '/')

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
    belong,
    password,
    icon,
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
  const dataSourceId = db.data_sources?.[0]?.id
  if (!dataSourceId) throw new Error('No data source found on database')

  const pages = await queryAllPages(notion, dataSourceId)
  const entries = []

  for (const page of pages) {
    const blocks = await fetchAllBlocks(notion, page.id)
    const iconColumn = richTextToPlain(page.properties?.icon?.rich_text)
    const icon = await resolveEntryIcon(page, blocks, iconColumn)
    let content = await blocksToHtml(notion, blocks)
    content = await localizeImages(content)
    entries.push(mapPageToEntry(page, content, icon))
  }

  const normalizedEntries = dedupeSlugs(entries)

  const blogConfig = {
    label: richTextToPlain(db.title) || 'Blog',
    description: richTextToPlain(db.description) || '',
    avatar: '/images/avatar.png',
    totalReads: '2.4万',
    navIntro: [
      [{ kind: 'text', value: '来自互联网的用户体验设计师，' }],
      [
        { kind: 'text', value: '目前从事' },
        { kind: 'highlight', value: 'AI产品设计' },
        { kind: 'text', value: '，偶尔写点' },
        { kind: 'menu', value: '文章' },
        { kind: 'text', value: '，或者拍拍' },
        { kind: 'menu', value: '摄影' },
        { kind: 'text', value: '。' },
      ],
    ],
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
