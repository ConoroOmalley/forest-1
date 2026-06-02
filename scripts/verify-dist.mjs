import { existsSync, readdirSync } from 'node:fs'

if (!existsSync('dist/index.html')) {
  console.error('[verify-dist] dist/index.html 不存在，构建可能失败')
  process.exit(1)
}

const imageDir = 'dist/images/notion'
const imageCount = existsSync(imageDir) ? readdirSync(imageDir).length : 0
const hasAvatar = existsSync('dist/images/avatar.png')

console.log(`[verify-dist] notion 图片: ${imageCount} 张，avatar: ${hasAvatar ? '有' : '无'}`)

if (!hasAvatar) {
  console.warn('[verify-dist] 警告: public/images 未复制到 dist，请检查 Vercel outputDirectory 是否为 dist')
}
