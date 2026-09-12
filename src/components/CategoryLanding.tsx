import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronRight, ArrowRight, CheckCircle } from 'lucide-react'
import { type CategoryLandingContent, type Product } from '../data/products'
import DataTable from './DataTable'

const SITE_URL = 'https://www.hvacrnet.com'

interface Props {
  content: CategoryLandingContent
  comparisonData: {
    title: string
    subtitle: string
    headers: string[]
    rows: string[][]
  }
  products: Product[]
  categoryName: string
  categorySlug: string
  subCategoryName?: string
  subCategorySlug?: string
}

export default function CategoryLanding({
  content,
  comparisonData,
  products,
  categoryName,
  categorySlug,
  subCategoryName,
  subCategorySlug,
}: Props) {
  const location = useLocation()
  const currentUrl = `${SITE_URL}${location.pathname}`

  // Build breadcrumb
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: categoryName, href: `/products/${categorySlug}` },
  ]
  if (subCategoryName && subCategorySlug) {
    breadcrumbs.push({ name: subCategoryName, href: `/products/${categorySlug}/${subCategorySlug}` })
  }

  // Build BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  }

  // Build ItemList JSON-LD for comparison table
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: comparisonData.title,
    description: comparisonData.subtitle,
    itemListElement: comparisonData.rows.map((row, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: row[1],
      url: `${currentUrl}#${row[1].toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    })),
  }

  // Build FAQPage JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  // Build product links from comparison table rows
  const getProductLink = (rowIdx: number): string | null => {
    if (rowIdx < products.length) {
      const product = products[rowIdx]
      if (product.thirdCategoryId) {
        return `/products/${categorySlug}/${subCategorySlug || ''}#${product.thirdCategoryId}`
      }
    }
    return null
  }

  // SEO meta
  const seoTitle = `${subCategoryName || categoryName} for Refrigeration & HVAC | HVACR NET Supplier`
  const seoDescription = content.introduction.substring(0, 150).trim() + '...'

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={currentUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Breadcrumbs */}
      <nav className="bg-white border-b border-gray-200" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            {breadcrumbs.map((item, index) => (
              <li key={item.href} className="flex items-center">
                {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />}
                <Link
                  to={item.href}
                  className="hover:text-navy transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* H1 */}
        <h1 className="text-3xl md:text-4xl font-bold text-navy mb-6">
          {content.h1}
        </h1>

        {/* Introduction */}
        <section className="mb-10">
          <p className="text-gray-700 leading-relaxed text-base">
            {content.introduction}
          </p>
        </section>

        {/* Comparison Table */}
        <section className="mb-12" id="comparison">
          <h2 className="text-xl font-bold text-navy mb-2">{comparisonData.title}</h2>
          <p className="text-gray-600 mb-6 text-sm">{comparisonData.subtitle}</p>
          <DataTable
            headers={comparisonData.headers}
            rows={comparisonData.rows}
            stickyColIdx={comparisonData.headers[0] === '#' ? 1 : 0}
            renderCell={(cell, rowIdx, cellIdx) => {
              // Product name column is index 1 if there's a # column, otherwise index 0
              const productColIdx = comparisonData.headers[0] === '#' ? 1 : 0
              if (cellIdx === productColIdx) {
                const productLink = getProductLink(rowIdx)
                if (productLink) {
                  return (
                    <Link
                      to={productLink}
                      className="text-orange font-semibold hover:underline"
                    >
                      {cell}
                    </Link>
                  )
                }
              }
              return cell
            }}
          />
        </section>

        {/* How to Choose */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy mb-6">How to Choose the Right {subCategoryName || categoryName}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {content.howToChoose.map((section, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-base font-bold text-navy mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-orange mr-2 flex-shrink-0" />
                  {section.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-navy mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {content.faq.map((item, index) => (
              <details
                key={index}
                className="bg-white rounded-lg border border-gray-200 group"
              >
                <summary className="px-6 py-4 cursor-pointer font-semibold text-navy hover:text-orange transition-colors list-none flex items-center justify-between">
                  {item.question}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-navy rounded-xl p-8 text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-3">Need Help Selecting?</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Our team can help you choose the right products for your application. Get a quote or download our full catalog.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-orange text-white font-semibold rounded-lg hover:bg-orange/90 transition-colors"
            >
              Request a Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a
              href="/catalog.pdf"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Get Full Catalog
            </a>
          </div>
        </section>

        {/* Related Categories */}
        <section>
          <h2 className="text-xl font-bold text-navy mb-4">Related Categories</h2>
          <div className="flex flex-wrap gap-3">
            {content.relatedCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products/${cat.slug === 'ball-valves' || cat.slug === 'sight-glasses' ? 'valves' : cat.slug === 'filter-driers' ? 'filter-driers' : 'valves'}/${cat.slug}`}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-navy rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                {cat.name}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
