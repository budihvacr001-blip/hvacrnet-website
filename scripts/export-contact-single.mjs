// Export the prerendered Contact page as a fully self-contained single HTML file
// (all JS + CSS + local images inlined) for Cloudflare Pages deployment.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const PUBLIC = join(ROOT, 'public')

let html = readFileSync(join(DIST, 'contact', 'index.html'), 'utf8')

function readAsset(url) {
  // url is like /assets/index-XXX.js  or  /favicon.svg
  const rel = url.replace(/^\//, '')
  const p = join(DIST, rel)
  if (!existsSync(p)) throw new Error('missing asset: ' + url)
  return readFileSync(p, 'utf8')
}

// 1) Inline CSS
html = html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g, (m, href) => {
  const css = readAsset(href)
  return '<style>\n' + css + '\n</style>'
})

// 2) Inline main JS module
html = html.replace(/<script type="module"[^>]*src="(\/assets\/[^"]+\.js)"[^>]*><\/script>/g, (m, src) => {
  const js = readAsset(src)
  return '<script type="module">\n' + js + '\n</script>'
})

// 3) Inline public images referenced by src (absolute /x or relative x)
function inlineImages(html) {
  const re = /(\bsrc|href)="([^"]+\.(?:png|jpe?g|webp|gif|svg))"/g
  return html.replace(re, (m, attr, urlRef) => {
    if (/^(https?:)?\/\//.test(urlRef) || urlRef.startsWith('data:')) return m
    const clean = urlRef.replace(/^\.?\//, '')
    const candidates = [join(PUBLIC, clean), join(PUBLIC, urlRef)]
    const file = candidates.find(existsSync)
    if (!file) return m // leave as-is (e.g. external asset)
    const fixed = urlRef.replace(/^\.?\//, '')
    const full = join(PUBLIC, fixed)
    if (!existsSync(full)) return m
    const b64 = readFileSync(full).toString('base64')
    const ext = fixed.split('.').pop()
    const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'gif' ? 'image/gif' : 'image/jpeg'
    return `${attr}="data:${mime};base64,${b64}"`
  })
}
html = inlineImages(html)

const out = join(DIST, 'contact-standalone.html')
writeFileSync(out, html)
console.log('Wrote', out, html.length, 'bytes')