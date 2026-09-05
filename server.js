import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// 301 redirect: hvacrnet.com -> www.hvacrnet.com
app.use((req, res, next) => {
  const rawHost = (req.headers['x-forwarded-host'] || req.headers.host || '').toLowerCase()
  const host = rawHost.replace(/:\d+$/, '')
  if (host === 'hvacrnet.com') {
    return res.redirect(301, `https://www.hvacrnet.com${req.url}`)
  }
  next()
})

// 301 redirects: old product slugs -> new slugs
const slugRedirects = {
  // Filter Driers
  '/products/filter-driers/bfk-sae': '/products/filter-driers/bidirectional-sae-flare',
  '/products/filter-driers/bfk-odf': '/products/filter-driers/bidirectional-brazed-odf',
  '/products/filter-driers/dfs-sae': '/products/filter-driers/unidirectional-sae-flare',
  '/products/filter-driers/dfs-odf': '/products/filter-driers/unidirectional-brazed-odf',
  '/products/filter-driers/dfs-replaceable': '/products/filter-driers/replaceable-core-filter-drier',
  // Solenoid Valves
  '/products/valves/solenoid-valves/hvd-standard': '/products/valves/solenoid-valves/standard-piston-nc',
  '/products/valves/solenoid-valves/hvp-high-flow': '/products/valves/solenoid-valves/high-flow-flanged-piston',
  '/products/valves/solenoid-valves/hv-clamping-small': '/products/valves/solenoid-valves/clamping-type-small-port',
  '/products/valves/solenoid-valves/hv-clamping-large': '/products/valves/solenoid-valves/clamping-type-large-port',
  '/products/valves/solenoid-valves/sv-ip65-direct': '/products/valves/solenoid-valves/ip65-direct-operated',
  '/products/valves/solenoid-valves/sv-ip65-servo': '/products/valves/solenoid-valves/ip65-servo-operated',
  '/products/valves/solenoid-valves/10-8w-direct': '/products/valves/solenoid-valves/low-power-8w-direct',
  '/products/valves/solenoid-valves/10-8w-servo': '/products/valves/solenoid-valves/low-power-8w-servo',
  '/products/valves/solenoid-valves/hvk-normally-open-small': '/products/valves/solenoid-valves/normally-open-small-port',
  '/products/valves/solenoid-valves/hvk-normally-open-large': '/products/valves/solenoid-valves/normally-open-large-port',
  '/products/valves/solenoid-valves/hv-unloading-flanged': '/products/valves/solenoid-valves/compressor-unloading-flanged',
  '/products/valves/solenoid-valves/hv-unloading-odf': '/products/valves/solenoid-valves/compressor-unloading-odf',
  '/products/valves/solenoid-valves/hvs-hot-gas': '/products/valves/solenoid-valves/hot-gas-defrost-3-way',
  '/products/valves/solenoid-valves/hvdf-high-flow': '/products/valves/solenoid-valves/high-flow-piston-odf',
  '/products/valves/solenoid-valves/hvpf-high-flow': '/products/valves/solenoid-valves/high-flow-piston-flanged',
  // Ball Valves
  '/products/valves/ball-valves/dqf-electric': '/products/valves/ball-valves/electric-ball-valve-full-bore',
  '/products/valves/ball-valves/hbc-manual-full': '/products/valves/ball-valves/manual-ball-valve-full-bore',
  '/products/valves/ball-valves/qft-manual-reduced': '/products/valves/ball-valves/manual-ball-valve-reduced-bore',
  '/products/valves/ball-valves/qf-co2': '/products/valves/ball-valves/co2-ball-valve-120bar',
  '/products/valves/ball-valves/gfm-s-threaded': '/products/valves/ball-valves/threaded-ball-valve-npt',
}

app.use((req, res, next) => {
  const newPath = slugRedirects[req.path]
  if (newPath) {
    const query = req.search || ''
    return res.redirect(301, newPath + query)
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
