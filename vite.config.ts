import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { syncNotion } from './scripts/sync-notion.mjs'

function notionSyncPlugin() {
  let syncing = false

  async function runSync() {
    if (syncing) return
    syncing = true
    try {
      await syncNotion()
    } catch (err) {
      console.error('[notion-sync]', err.message)
    } finally {
      syncing = false
    }
  }

  return {
    name: 'notion-sync',
    async buildStart() {
      await runSync()
    },
    configureServer(server) {
      runSync()

      server.middlewares.use('/api/notion/sync', async (_req, res) => {
        try {
          const data = await syncNotion()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true, count: data.entries.length, syncedAt: data.syncedAt }))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ ok: false, error: err.message }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), notionSyncPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5180,
      host: true,
      open: true,
    },
    preview: {
      port: 5180,
      host: true,
    },
  }
})
