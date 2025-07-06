// server.js
import express from 'express'
import path from 'path'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'
import chokidar from 'chokidar'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

// Serve the static output
app.use(express.static(path.join(__dirname, 'dist')))

// Watch for changes in templates, data, partials, styles
const watcher = chokidar.watch(
  ['templates', 'partials', 'data', 'styles.css'],
  { ignoreInitial: true }
)

// Rebuild when a file changes
function rebuild() {
  console.log('🔄 Rebuilding site...')
  exec('node build.js', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Build failed:\n', stderr)
    } else {
      console.log('✅ Rebuilt:\n', stdout)
    }
  })
}

watcher.on('all', (event, file) => {
  console.log(`📝 File ${event}: ${file}`)
  rebuild()
})

app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`)
})
