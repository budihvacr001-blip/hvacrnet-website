import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')
const distDir = join(rootDir, 'dist')

// Read product data
const productsData = readFileSync(join(rootDir, 'src/data/products.ts'), 'utf-8')

// Extract categories and products using regex (simple parsing)
function extractData() {
  const categories = []
  const categoryRegex = /\{[\s\S]*?id:\s*'([^']+)',[\s\S]*?name:\s*'([^']+)',[\s\S]*?subCategories:\s*\[([\s\S]*?)\][\s\S]*?products:\s*\[([\s\S]*?)\]\s*\}/g
  
  let match
  while ((match = categoryRegex.exec(productsData)) !== null) {
    const id = match[1]
    const name = match[2]
    
    // Extract products for this category
    const productsSection = match[4]
    const productRegex = /\{[\s\S]*?id:\s*'([^']+)',[\s\S]*?name:\s*'([^']+)',[\s\S]*?shortDesc:\s*'([^']*)'[\s\S]*?(?:metaTitle:\s*'([^']*)',)?[\s\S]*?(?:metaDescription:\s*'([^']*)',)?/g
    
    let prodMatch
    while ((prodMatch = productRegex.exec(productsSection)) !== null) {
      categories.push({
        categoryId: id,
        categoryName: name,
        productId: prodMatch[1],
        productName: prodMatch[2],
        productShortDesc: prodMatch[3],
        metaTitle: prodMatch[4] || `${prodMatch[2]} - ${name} | HVACR NET`,
        metaDescription: prodMatch[5] || prodMatch[3]
      })
    }
  }
  
  return categories
}

// Read the base index.html
const baseHtml = readFileSync(join(distDir, 'index.html'), 'utf-8')

function generateHtml(title, description, canonical, bodyContent) {
  return baseHtml
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${description}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonical}" />`)
    .replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`)
}

function generateCategoryLandingHtml(categoryName, categorySlug) {
  const title = `${categoryName} - HVACR NET HVAC/R Parts Supplier from China`
  const description = `Browse our complete range of ${categoryName} products. HVACR NET - Your trusted partner for HVAC/R components from China.`
  const canonical = `https://www.hvacrnet.com/products/${categorySlug}`
  
  const bodyContent = `
    <div class="ssg-content">
      <h1>${categoryName}</h1>
      <p>${description}</p>
    </div>
  `
  
  return generateHtml(title, description, canonical, bodyContent)
}

function generateProductHtml(productName, categorySlug, productId, metaTitle, metaDescription) {
  const title = metaTitle || `${productName} - HVACR NET`
  const description = metaDescription || productName
  const canonical = `https://www.hvacrnet.com/products/${categorySlug}/${productId}`
  
  const bodyContent = `
    <div class="ssg-content">
      <h1>${productName}</h1>
      <p>${description}</p>
    </div>
  `
  
  return generateHtml(title, description, canonical, bodyContent)
}

// Generate pages
const pages = [
  // Static pages
  { path: 'index.html', html: generateHtml(
    'HVACR NET - Your One-Stop HVACR Parts Supplier from China',
    'HVACR NET is a professional HVAC/R parts supplier from China, offering copper tubes, fittings, valves, refrigeration components and more.',
    'https://www.hvacrnet.com/',
    '<div class="ssg-content"><h1>HVACR NET</h1><p>Your One-Stop HVACR Parts Supplier from China</p></div>'
  )},
  { path: 'about.html', html: generateHtml(
    'About HVACR NET - 20 Years of HVAC/R Export Experience',
    'Learn about HVACR NET, a professional HVAC/R parts exporter from Ningbo, China with 20 years of international trade experience.',
    'https://www.hvacrnet.com/about',
    '<div class="ssg-content"><h1>About HVACR NET</h1><p>20 Years of HVAC/R Export Experience</p></div>'
  )},
  { path: 'markets.html', html: generateHtml(
    'Global Markets - HVACR NET Export Coverage',
    'HVACR NET exports HVAC/R parts to 50+ countries across Europe, Americas, Middle East, Asia and more.',
    'https://www.hvacrnet.com/markets',
    '<div class="ssg-content"><h1>Global Markets</h1><p>Exporting to 50+ Countries Worldwide</p></div>'
  )},
  { path: 'contact.html', html: generateHtml(
    'Contact HVACR NET - Request a Quote',
    'Contact HVACR NET for HVAC/R parts inquiries. Email: info@hvacrnet.com | WhatsApp: +86-135-6789-0123',
    'https://www.hvacrnet.com/contact',
    '<div class="ssg-content"><h1>Contact Us</h1><p>Request a Quote Today</p></div>'
  )},
  { path: 'products/index.html', html: generateHtml(
    'Products - HVACR NET HVAC/R Parts Catalog',
    'Browse our complete catalog of HVAC/R parts including copper tubes, fittings, valves, refrigeration components and more.',
    'https://www.hvacrnet.com/products',
    '<div class="ssg-content"><h1>Products</h1><p>Browse by Category</p></div>'
  )}
]

// Extract and generate category/product pages
const data = extractData()
const processedCategories = new Set()

for (const item of data) {
  // Category landing page
  if (!processedCategories.has(item.categoryId)) {
    processedCategories.add(item.categoryId)
    pages.push({
      path: `products/${item.categoryId}/index.html`,
      html: generateCategoryLandingHtml(item.categoryName, item.categoryId)
    })
  }
  
  // Product detail page
  pages.push({
    path: `products/${item.categoryId}/${item.productId}/index.html`,
    html: generateProductHtml(item.productName, item.categoryId, item.productId, item.metaTitle, item.metaDescription)
  })
}

// Write all pages
for (const page of pages) {
  const fullPath = join(distDir, page.path)
  mkdirSync(dirname(fullPath), { recursive: true })
  writeFileSync(fullPath, page.html)
  console.log(`Generated: ${page.path}`)
}

console.log(`\nTotal pages generated: ${pages.length}`)
