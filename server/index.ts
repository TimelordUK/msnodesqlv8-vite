import express from 'express'
import { createServer as createViteServer } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import taskRouter from './api/task.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT ?? 3000

async function start() {
  const app = express()

  app.use(express.json())

  // API routes - msnodesqlv8 is only used here, server-side only
  app.use('/api/task', taskRouter)

  if (isProduction) {
    // In production, serve the built Vite output
    const distPath = path.resolve(__dirname, '..', 'dist')
    app.use(express.static(distPath))
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'))
    })
  } else {
    // In development, use Vite's dev server as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    })
    app.use(vite.middlewares)
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

start().catch(console.error)
