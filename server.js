import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// 301 redirect: hvacrnet.com -> www.hvacrnet.com
app.use((req, res, next) => {
  const host = req.headers.host || ''
  // Check if host is hvacrnet.com (without www)
  if (host === 'hvacrnet.com' || host.startsWith('hvacrnet.com:')) {
    const newUrl = `https://www.hvacrnet.com${req.url}`
    return res.redirect(301, newUrl)
  }
  next()
})

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
