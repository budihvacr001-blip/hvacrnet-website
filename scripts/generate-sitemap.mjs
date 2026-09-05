import { writeFileSync, statSync } from 'fs'
import { execSync } from 'child_process'
import { categories } from '../src/data/products.ts'

const BASE_URL = 'https://www.hvacrnet.com'
const DIST_DIR = new URL('../dist/', import.meta.url).pathname

function getLastMod(filePath) {
  try {
    const date = execSync(`git log -1 --format=%cd --date=iso-strict -- "${filePath}" 2>/dev/null`, { encoding: 'utf-8' }).trim()
    if (date) return date.split('T')[0]
  } catch {}
  try {
    const stat = statSync(filePath)
    return stat.mtime.toISOString().split('T')[0]
  } catch {}
  return new Date().toISOString().split('T')[0]
}

function buildRoutes() {
  const routes = []
  const productsSrcMod = getLastMod('src/data/products.ts')

  routes.push({ url: '/', lastmod: getLastMod('src/pages/Home.tsx'), changefreq: 'weekly', priority: '1.0' })
  routes.push({ url: '/products', lastmod: productsSrcMod, changefreq: 'weekly', priority: '0.9' })
  routes.push({ url: '/about', lastmod: getLastMod('src/pages/About.tsx'), changefreq: 'monthly', priority: '0.6' })
  routes.push({ url: '/markets-we-serve', lastmod: getLastMod('src/pages/Markets.tsx'), changefreq: 'monthly', priority: '0.6' })
  routes.push({ url: '/contact', lastmod: getLastMod('src/pages/Contact.tsx'), changefreq: 'monthly', priority: '0.6' })

  for (const cat of categories) {
    if (cat.products.length === 0) continue

    routes.push({ url: `/products/${cat.id}`, lastmod: productsSrcMod, changefreq: 'weekly', priority: '0.8' })

    const subIds = [...new Set(cat.products.map((p) => p.subCategoryId).filter(Boolean))]

    for (const subId of subIds) {
      const sub = cat.subCategories.find((s) => s.id === subId)
      if (sub?.isOverview) continue

      const subProducts = cat.products.filter((p) => p.subCategoryId === subId)
      const thirdIds = [...new Set(subProducts.map((p) => p.thirdCategoryId).filter(Boolean))]

      if (thirdIds.length > 0) {
        for (const thirdId of thirdIds) {
          routes.push({ url: `/products/${cat.id}/${subId}/${thirdId}`, lastmod: productsSrcMod, changefreq: 'monthly', priority: '0.7' })
        }
      } else {
        routes.push({ url: `/products/${cat.id}/${subId}`, lastmod: productsSrcMod, changefreq: 'weekly', priority: '0.7' })
      }
    }
  }

  return routes
}

function generateSitemap(routes) {
  const urls = routes
    .map(
      (r) => `  <url>
    <loc>${BASE_URL}${r.url}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

const routes = buildRoutes()
const xml = generateSitemap(routes)
writeFileSync(`${DIST_DIR}/sitemap.xml`, xml, 'utf-8')
console.log(`Sitemap generated: ${routes.length} URLs`)
