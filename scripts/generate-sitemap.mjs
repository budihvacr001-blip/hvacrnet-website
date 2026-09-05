import { writeFileSync, statSync } from 'fs'
import { execSync } from 'child_process'
import { categories } from '../src/data/products.ts'

const BASE_URL = 'https://www.hvacrnet.com'
const DIST_DIR = new URL('../dist/', import.meta.url).pathname

// Helper: check if item is manually published (defaults to true)
const isManuallyPublished = (item) => item.published !== false

// Helper: check if product has complete content (auto-publishing)
const isProductContentComplete = (product) => {
  // 1. Has main image: images array non-empty with valid paths
  if (!product.images || product.images.length === 0) return false
  if (!product.images.some(img => img && img.trim().length > 0)) return false
  
  // 2. Has spec table: specTable with >= 3 rows, OR specs with >= 3 items
  const hasSpecTable = product.specTable && product.specTable.rows && product.specTable.rows.length >= 3
  const hasSpecs = product.specs && product.specs.length >= 3
  if (!hasSpecTable && !hasSpecs) return false
  
  // 3. Has description: description non-empty and at least 100 characters
  if (!product.description || product.description.trim().length < 100) return false
  
  return true
}

// Combined check: manual published AND content complete
const isProductPublished = (product) => {
  if (!isManuallyPublished(product)) return false
  return isProductContentComplete(product)
}

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

  // Static pages
  routes.push({ url: '/', lastmod: getLastMod('src/pages/Home.tsx'), changefreq: 'weekly', priority: '1.0' })
  routes.push({ url: '/products', lastmod: productsSrcMod, changefreq: 'weekly', priority: '0.9' })
  routes.push({ url: '/about', lastmod: getLastMod('src/pages/About.tsx'), changefreq: 'monthly', priority: '0.6' })
  routes.push({ url: '/markets-we-serve', lastmod: getLastMod('src/pages/Markets.tsx'), changefreq: 'monthly', priority: '0.6' })
  routes.push({ url: '/contact', lastmod: getLastMod('src/pages/Contact.tsx'), changefreq: 'monthly', priority: '0.6' })

  for (const cat of categories) {
    // Skip manually unpublished categories
    if (!isManuallyPublished(cat)) continue
    
    // Get content-complete products
    const publishedProducts = cat.products.filter(p => isProductPublished(p))
    
    // Category page: only include if >= 3 published products
    if (publishedProducts.length >= 3) {
      routes.push({ url: `/products/${cat.id}`, lastmod: productsSrcMod, changefreq: 'weekly', priority: '0.8' })
    }
    
    // If no published products, skip entirely
    if (publishedProducts.length === 0) continue

    const subIds = [...new Set(publishedProducts.map((p) => p.subCategoryId).filter(Boolean))]

    for (const subId of subIds) {
      const sub = cat.subCategories.find((s) => s.id === subId)
      if (sub?.isOverview) continue
      // Skip manually unpublished subcategories
      if (sub && !isManuallyPublished(sub)) continue

      const subProducts = publishedProducts.filter((p) => p.subCategoryId === subId)
      const thirdIds = [...new Set(subProducts.map((p) => p.thirdCategoryId).filter(Boolean))]

      if (thirdIds.length > 0) {
        for (const thirdId of thirdIds) {
          // Only include content-complete products
          const product = subProducts.find((p) => p.thirdCategoryId === thirdId)
          if (!product || !isProductPublished(product)) continue
          routes.push({ url: `/products/${cat.id}/${subId}/${thirdId}`, lastmod: productsSrcMod, changefreq: 'monthly', priority: '0.7' })
        }
      } else {
        // Subcategory page without third-level products
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
</urlset>`
}

const routes = buildRoutes()
const sitemap = generateSitemap(routes)
writeFileSync(`${DIST_DIR}/sitemap.xml`, sitemap)
console.log(`Generated sitemap.xml with ${routes.length} URLs`)
