const express = require('express')
const path = require('path')

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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
