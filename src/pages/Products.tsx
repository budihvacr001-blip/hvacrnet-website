import { useState, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, MessageCircle, ChevronRight, Package, Home } from 'lucide-react'
import { categories, solenoidValvesComparison, filterDriersComparison, ballValvesComparison, sightGlassesComparison, categoryLandingContent, isPublished, isProductPublished, MIN_PRODUCTS_TO_SHOW, type Product } from '../data/products'
import { getProductFAQs } from '../data/faq-constants'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import SEO from '../components/SEO'
import CategoryLanding from '../components/CategoryLanding'

// Category positioning statements for global audience
const categoryPositioning: Record<string, string> = {
  'copper-tubes': 'Copper tubes for HVAC and refrigeration systems — straight lengths, pancake coils, and Level Wound Coils (LWC) manufactured to ASTM B280 and EN 12735 standards. Sourced from established mills in Ningbo, China\'s copper processing hub, with a full range of outer diameters and wall thicknesses available. Supplying contractors, wholesalers, and distributors worldwide with flexible MOQ and direct port shipping.',
  'insulation-tubes': 'Insulation tubes for refrigeration and air conditioning piping, engineered to reduce heat loss and prevent condensation across residential, commercial, and industrial applications. Our polyethylene foam and rubber insulation are compatible with all standard copper tube sizes and perform reliably in diverse climate zones. Flexible order quantities with fast dispatch from Ningbo.',
  'ball-valves': 'Refrigeration brass ball valves including shut-off valves, charging valves, and receiver valves for HVAC and refrigeration systems. Each valve is forged from high-grade brass and 100% leak-tested before shipment. We supply service technicians, installation contractors, and wholesale distributors with competitive pricing, low MOQ, and reliable quality from Ningbo\'s HVAC component cluster.',
  'solenoid-valves': 'Refrigeration solenoid valves for precise refrigerant flow control in air conditioning, cold storage, and commercial refrigeration equipment. Our range covers normally closed and normally open configurations compatible with R22, R134a, R404A, R410A, and common refrigerants. Direct sourcing from Ningbo ensures consistent quality and competitive pricing for customers worldwide.',
  'filter-driers': 'HVAC and refrigeration filter driers that protect systems from moisture, acid, and solid contaminants. Our range includes sealed filter driers, replaceable-core filter driers, and suction line filters for residential, commercial, and industrial applications. Every unit is built with molecular sieve and activated alumina for effective moisture and acid removal — one-stop sourcing with flexible MOQ from Ningbo.',
  'sight-glasses': 'Refrigeration sight glasses for monitoring refrigerant flow and moisture content in HVAC and refrigeration systems. Each moisture indicator features a color-changing element that provides instant visual confirmation of system condition. Available in brazed and flare connections across common line sizes. Supplying contractors, service technicians, and wholesale distributors globally with reliable quality at competitive prices.',
}


// Helper function to get the first published product's first image for a category
function getCategoryImage(categoryId: string): string | null {
  const category = categories.find((cat) => cat.id === categoryId)
  if (!category) return null
  // Find first published (content-complete) product with images
  const publishedProduct = category.products.find(p => isProductPublished(p) && p.images && p.images.length > 0)
  if (!publishedProduct || !publishedProduct.images || publishedProduct.images.length === 0) return null
  return publishedProduct.images[0]
}

export default function Products() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all')
  const [activeThirdCategory, setActiveThirdCategory] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [expandedSubCategories, setExpandedSubCategories] = useState<Record<string, boolean>>({})

  const allProducts = useMemo(() => {
    return categories.flatMap((cat) => cat.products)
  }, [])

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return []

    let products = allProducts
    products = products.filter((p) => p.categoryId === activeCategory)

    // Only show published products (content-complete)
    products = products.filter((p) => isProductPublished(p))

    if (activeSubCategory !== 'all') {
      products = products.filter((p) => p.subCategoryId === activeSubCategory)
    }

    if (activeThirdCategory) {
      products = products.filter((p) => p.thirdCategoryId === activeThirdCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    // Sort products by subCategories order defined in the category
    const category = categories.find((c) => c.id === activeCategory)
    if (category && category.subCategories.length > 0) {
      const subCategoryOrder = category.subCategories.map((s) => s.id)
      products = [...products].sort((a, b) => {
        const aId = a.subCategoryId || ''
        const bId = b.subCategoryId || ''
        const aIndex = subCategoryOrder.indexOf(aId)
        const bIndex = subCategoryOrder.indexOf(bId)
        if (aIndex === -1 && bIndex === -1) return 0
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return aIndex - bIndex
      })
    }

    return products
  }, [allProducts, activeCategory, activeSubCategory, activeThirdCategory, searchQuery, categories])

  const selectCategory = (catId: string) => {
    setActiveCategory(catId)
    setActiveSubCategory('all')
    setActiveThirdCategory(null)
  }

  const selectSubCategory = (catId: string, subId: string) => {
    setActiveCategory(catId)
    setActiveSubCategory(subId)
    setActiveThirdCategory(null)
  }

  const selectThirdCategory = (catId: string, subId: string, thirdId: string) => {
    setActiveCategory(catId)
    setActiveSubCategory(subId)
    setActiveThirdCategory(thirdId)
  }

  useEffect(() => {
    if (highlightedProductId) {
      const el = document.getElementById(`product-${highlightedProductId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const timer = setTimeout(() => setHighlightedProductId(null), 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [highlightedProductId])

  // Scroll to product card when third category is selected from comparison table
  useEffect(() => {
    if (activeThirdCategory && activeThirdCategory !== 'solenoid-valves-overview') {
      setTimeout(() => {
        const card = document.getElementById(`product-${activeThirdCategory}`)
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [activeThirdCategory])

  const selectAll = () => {
    setActiveCategory(null)
    setActiveSubCategory('all')
  }

  const handleInquire = (productName: string) => {
    navigate('/contact', { state: { productInterest: productName } })
  }

  const currentCategory = activeCategory ? categories.find((c) => c.id === activeCategory) : null
  const currentSubCategory = activeSubCategory !== 'all' && currentCategory
    ? currentCategory.subCategories.find((s) => s.id === activeSubCategory)
    : null
  const currentThirdCategory = activeThirdCategory && currentSubCategory?.subCategories
    ? currentSubCategory.subCategories.find((t) => t.id === activeThirdCategory)
    : null
  // Check if the selected subCategory itself is an overview (for filter-driers)
  const isSubCategoryOverview = currentSubCategory?.isOverview === true

  // Dynamic SEO title and description — template rules:
  // Title: {metaTitle} | HVACR NET; fallback: {name} | HVACR NET Supplier
  // Description: metaDescription; fallback: shortDesc first 150 chars
  const BRAND = 'HVACR NET'
  const seoTitle = (() => {
    if (currentThirdCategory && !currentThirdCategory.isOverview) {
      const product = filteredProducts.find((p) => p.thirdCategoryId === activeThirdCategory)
      const base = product?.metaTitle || currentThirdCategory.name
      const trimmed = base.length > 50 ? base.slice(0, 47).trim() + '...' : base
      return `${trimmed} | ${BRAND}`
    }
    if (currentSubCategory && !isSubCategoryOverview) {
      const name = `${currentSubCategory.name} - ${currentCategory?.name}`
      const trimmed = name.length > 50 ? name.slice(0, 47).trim() + '...' : name
      return `${trimmed} | ${BRAND}`
    }
    if (currentCategory) {
      const name = `${currentCategory.name} HVAC/R Parts`
      const trimmed = name.length > 50 ? name.slice(0, 47).trim() + '...' : name
      return `${trimmed} | ${BRAND}`
    }
    return `HVACR Parts & Components | ${BRAND}`
  })()

  const seoDescription = (() => {
    if (currentThirdCategory && !currentThirdCategory.isOverview) {
      const product = filteredProducts.find((p) => p.thirdCategoryId === activeThirdCategory)
      if (product?.metaDescription) {
        return product.metaDescription.length > 155 ? product.metaDescription.slice(0, 152).trim() + '...' : product.metaDescription
      }
      // Fallback: shortDesc first 150 chars
      if (product?.shortDesc) {
        return product.shortDesc.length > 150 ? product.shortDesc.slice(0, 147).trim() + '...' : product.shortDesc
      }
    }
    if (currentSubCategory && !isSubCategoryOverview && currentCategory) {
      const positioning = categoryPositioning[currentSubCategory.id]
      if (positioning) return positioning.length > 155 ? positioning.slice(0, 152).trim() + '...' : positioning
    }
    if (currentCategory) {
      const positioning = categoryPositioning[currentCategory.id]
      if (positioning) return positioning.length > 155 ? positioning.slice(0, 152).trim() + '...' : positioning
      return `Browse ${currentCategory.name} for HVAC and refrigeration systems. Quality parts sourced from Ningbo, China with flexible MOQ and global shipping.`
    }
    return 'Browse our comprehensive range of HVACR parts including copper tubes, fittings, valves, insulation materials, cables, mounting accessories and more. One-stop sourcing from Ningbo, China.'
  })()

  const seoUrl = (() => {
    if (currentThirdCategory && !currentThirdCategory.isOverview) {
      return `/products/${currentCategory?.id}/${currentSubCategory?.id}/${currentThirdCategory.id}`
    }
    if (currentSubCategory && !isSubCategoryOverview) {
      return `/products/${currentCategory?.id}/${currentSubCategory?.id}`
    }
    if (currentCategory) {
      return `/products/${currentCategory.id}`
    }
    return '/products'
  })()

  // BreadcrumbList schema
  const breadcrumbSchema = (() => {
    const items: { name: string; url: string }[] = [{ name: 'Home', url: '/' }, { name: 'Products', url: '/products' }]
    if (currentCategory) {
      items.push({ name: currentCategory.name, url: `/products/${currentCategory.id}` })
    }
    if (currentSubCategory && !isSubCategoryOverview) {
      items.push({ name: currentSubCategory.name, url: `/products/${currentCategory?.id}/${currentSubCategory.id}` })
    }
    if (currentThirdCategory && !currentThirdCategory.isOverview) {
      const product = filteredProducts.find((p) => p.thirdCategoryId === activeThirdCategory)
      items.push({ name: product?.name || currentThirdCategory.name, url: seoUrl })
    }
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: `https://www.hvacrnet.com${item.url}`,
      })),
    }
  })()

  // Product schema for individual product view
  const productDetailSchema = (() => {
    if (!currentThirdCategory || currentThirdCategory.isOverview) return null
    const product = filteredProducts.find((p) => p.thirdCategoryId === activeThirdCategory)
    if (!product) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.shortDesc,
      brand: { '@type': 'Brand', name: 'HVACR NET' },
      category: currentCategory?.name || 'HVACR Parts',
      ...(product.images?.[0] ? { image: `https://www.hvacrnet.com${product.images[0]}` } : {}),
      offers: {
        '@type': 'Offer',
        businessFunction: 'http://purl.org/goodrelations/v1#Sell',
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '0',
          priceCurrency: 'USD',
          description: 'Contact for pricing',
        },
        acceptedPaymentMethod: ['Wire Transfer', 'Letter of Credit'],
        seller: { '@type': 'Organization', name: 'Ningbo HVACR Net Refrigeration Equipment Co., Ltd.' },
      },
    }
  })()

  // FAQPage schema - always output for product pages (universal + category FAQs)
  const faqPageSchema = (() => {
    if (!currentThirdCategory || currentThirdCategory.isOverview) return null
    const product = filteredProducts.find((p) => p.thirdCategoryId === activeThirdCategory)
    if (!product) return null
    const faqs = getProductFAQs(product.categoryId, product.subCategoryId, product.faqSelection)
    if (faqs.length === 0) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    }
  })()

  const schemas = [breadcrumbSchema, productDetailSchema, faqPageSchema].filter(Boolean) as object[]

  // Related products (same category, excluding current)
  const relatedProducts = useMemo(() => {
    if (!currentCategory) return []
    const currentProductId = filteredProducts.find((p) => p.thirdCategoryId === activeThirdCategory)?.id
    return categories
      .flatMap((cat) => cat.products)
      .filter((p) => p.categoryId === currentCategory.id && p.id !== currentProductId)
      .slice(0, 6)
  }, [currentCategory, activeThirdCategory, filteredProducts])

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        url={seoUrl}
        ogType={currentThirdCategory && !currentThirdCategory.isOverview ? 'product' : 'website'}
        ogImage={(() => {
          if (currentThirdCategory && !currentThirdCategory.isOverview) {
            const product = filteredProducts.find((p) => p.thirdCategoryId === activeThirdCategory)
            if (product?.images?.[0]) return `https://www.hvacrnet.com${product.images[0]}`
          }
          return undefined
        })()}
        structuredData={schemas.length > 0 ? schemas : undefined}
        noindex={(() => {
          // Add noindex for unpublished content
          if (activeCategory && currentCategory && !isPublished(currentCategory)) return true
          if (activeSubCategory && activeSubCategory !== 'all' && currentSubCategory && !isPublished(currentSubCategory)) return true
          if (activeThirdCategory && currentThirdCategory && !isPublished(currentThirdCategory)) return true
          return false
        })()}
      />
      <div className="min-h-screen bg-gray-bg">
      {/* 404 for unpublished content */}
      {(() => {
        const isCategoryUnpublished = activeCategory && currentCategory && !isPublished(currentCategory)
        const isSubCategoryUnpublished = activeSubCategory && activeSubCategory !== 'all' && currentSubCategory && !isPublished(currentSubCategory)
        const isThirdCategoryUnpublished = activeThirdCategory && currentThirdCategory && !isPublished(currentThirdCategory)
        const isProductUnpublished = activeThirdCategory && !currentThirdCategory?.isOverview && filteredProducts.length === 0
        
        if (isCategoryUnpublished || isSubCategoryUnpublished || isThirdCategoryUnpublished || isProductUnpublished) {
          return (
            <div className="mx-auto max-w-7xl px-4 py-20 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">This page is not available or has been unpublished.</p>
              <Link to="/products" className="inline-block bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy/90 transition-colors">
                Back to Products
              </Link>
            </div>
          )
        }
        return null
      })()}
      {/* Header Banner */}
      <section className="bg-navy py-10 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Text & Search */}
            <div className="flex-1 max-w-2xl">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">Products</h1>
              <p className="mt-2 text-white/70">
                Browse our comprehensive range of HVACR parts and components
              </p>

              {/* Search */}
              <div className="relative mt-6 max-w-xl">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-text" />
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border-0 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            {/* Right: Product Group Image Placeholder */}
            <div className="hidden lg:block w-80 h-48 relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-15">
                {/* TODO: Replace with actual product group photo */}
                <div className="text-white text-center">
                  <Package className="w-24 h-24 mx-auto mb-2" />
                  <p className="text-sm">Product Group Photo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      {(currentCategory || currentSubCategory || currentThirdCategory) && (
        <nav className="bg-white border-b border-gray-border" aria-label="Breadcrumb">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-text">
              <li className="flex items-center">
                <Link to="/" className="hover:text-navy transition-colors flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" />
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                <Link to="/products" className="hover:text-navy transition-colors">Products</Link>
              </li>
              {currentCategory && (
                <li className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                  <button onClick={() => selectCategory(currentCategory.id)} className="hover:text-navy transition-colors">
                    {currentCategory.name}
                  </button>
                </li>
              )}
              {currentSubCategory && !isSubCategoryOverview && (
                <li className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                  <button onClick={() => selectSubCategory(currentCategory!.id, currentSubCategory.id)} className="hover:text-navy transition-colors">
                    {currentSubCategory.name}
                  </button>
                </li>
              )}
              {currentThirdCategory && !currentThirdCategory.isOverview && (
                <li className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                  <span className="text-navy font-medium">{currentThirdCategory.name}</span>
                </li>
              )}
            </ol>
          </div>
        </nav>
      )}

      {/* Main Content - Light background with sidebar + products */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Always visible category list */}
          <aside className="w-64 shrink-0">
            <nav className="space-y-1">
              {/* All Products */}
              <button
                onClick={selectAll}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  activeCategory === null
                    ? 'bg-navy text-white'
                    : 'text-gray-700 hover:bg-navy/5'
                }`}
              >
                <Package className="h-4 w-4 shrink-0" />
                All Products
              </button>

              {/* Category list - only show visible categories */}
              {categories.filter(cat => {
                if (cat.published === false) return false
                // Overview nodes always show
                if (cat.isOverview) return true
                // Count all published products under this category (including subcategories)
                const count = cat.products.filter(p => isProductPublished(p)).length
                // Leaf nodes: show if has at least 1 published product
                if (!cat.subCategories || cat.subCategories.length === 0) return count >= 1
                // Container categories: show if has >= MIN_PRODUCTS_TO_SHOW published products
                return count >= MIN_PRODUCTS_TO_SHOW
              }).map((cat) => {
                const isActive = activeCategory === cat.id
                const hasSubs = cat.subCategories.length > 0
                // Calculate total product count for this category (recursive)
                const totalProductCount = cat.products.filter(p => isProductPublished(p)).length

                return (
                  <div key={cat.id}>
                    <button
                      onClick={() => {
                        selectCategory(cat.id)
                        setExpandedCategories(prev => ({
                          ...prev,
                          [cat.id]: !prev[cat.id]
                        }))
                      }}
                      className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                        isActive && activeSubCategory === 'all'
                          ? 'bg-navy text-white'
                          : 'text-gray-700 hover:bg-navy/5'
                      }`}
                    >
                      {hasSubs && (
                        <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${expandedCategories[cat.id] ? 'rotate-90' : ''}`} />
                      )}
                      {!hasSubs && <span className="w-4 shrink-0" />}
                      <span className="flex-1">{cat.name}</span>
                      <span
                        className={`text-xs ${
                          isActive && activeSubCategory === 'all'
                            ? 'text-white/60'
                            : 'text-gray-400'
                        }`}
                      >
                        {totalProductCount}
                      </span>
                    </button>

                    {/* Sub-categories inline - only show visible subcategories */}
                    {hasSubs && expandedCategories[cat.id] && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">

                        {cat.subCategories.filter(sub => {
                          if (sub.published === false) return false
                          // Overview nodes always show
                          if (sub.isOverview) return true
                          // Count published products under this subcategory
                          const count = cat.products.filter(p => 
                            p.subCategoryId === sub.id && isProductPublished(p)
                          ).length
                          // Leaf nodes: show if has at least 1 published product
                          if (!sub.subCategories || sub.subCategories.length === 0) return count >= 1
                          // Container categories: show if has >= MIN_PRODUCTS_TO_SHOW published products
                          return count >= MIN_PRODUCTS_TO_SHOW
                        }).map((sub) => {
                          const hasThirdLevel = sub.subCategories && sub.subCategories.length > 0
                          // Calculate product count for this subcategory
                          const subProductCount = cat.products.filter(p => 
                            p.subCategoryId === sub.id && isProductPublished(p)
                          ).length
                          return (
                            <div key={sub.id}>
                              <button
                                onClick={() => {
                                  selectSubCategory(cat.id, sub.id)
                                  setExpandedSubCategories(prev => ({
                                    ...prev,
                                    [`${cat.id}-${sub.id}`]: !prev[`${cat.id}-${sub.id}`]
                                  }))
                                }}
                                className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm transition-colors ${
                                  sub.isOverview
                                    ? 'font-bold text-gray-900 hover:bg-navy/5'
                                    : activeSubCategory === sub.id && !activeThirdCategory
                                    ? 'font-semibold text-accent'
                                    : 'text-gray-700 hover:bg-navy/5'
                                }`}
                              >
                                {hasThirdLevel && (
                                  <ChevronRight className={`h-3 w-3 shrink-0 transition-transform ${expandedSubCategories[`${cat.id}-${sub.id}`] ? 'rotate-90' : ''}`} />
                                )}
                                {!hasThirdLevel && <span className="w-3 shrink-0" />}
                                <span className="flex-1">{sub.name}</span>
                                <span className="text-xs text-gray-400">
                                  {subProductCount}
                                </span>
                              </button>
                              {/* Third-level inline */}
                              {hasThirdLevel && expandedSubCategories[`${cat.id}-${sub.id}`] && (
                                <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">

                                  {sub.subCategories!.filter(third => {
                                    if (third.published === false) return false
                                    // Overview nodes always show
                                    if (third.isOverview) return true
                                    // Count published products under this third category
                                    const count = cat.products.filter(p => 
                                      p.thirdCategoryId === third.id && isProductPublished(p)
                                    ).length
                                    // Leaf nodes: show if has at least 1 published product
                                    return count >= 1
                                  }).map((third, index, filteredArray) => {
                                    // Calculate sequence number for non-overview items
                                    const sequenceNumber = filteredArray
                                      .slice(0, index + 1)
                                      .filter(t => !t.isOverview)
                                      .length
                                    const showSequence = !third.isOverview
                                    
                                    return (
                                      <button
                                        key={third.id}
                                        onClick={() => selectThirdCategory(cat.id, sub.id, third.id)}
                                        className={`flex w-full items-start gap-2 rounded px-3 py-2 text-left text-sm transition-colors ${
                                          third.isOverview
                                            ? 'font-bold text-gray-900 hover:bg-navy/5'
                                            : activeThirdCategory === third.id
                                            ? 'font-semibold text-accent'
                                            : 'text-gray-700 hover:bg-navy/5'
                                        }`}
                                      >
                                        {showSequence && (
                                          <span className="shrink-0 text-xs text-gray-400 tabular-nums">
                                            {String(sequenceNumber).padStart(2, '0')}
                                          </span>
                                        )}
                                        <span className="flex-1">{third.name}</span>
                                      </button>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </aside>

          {/* Right Content Area */}
          <div className="min-w-0 flex-1">
            {/* Breadcrumb */}
            {activeCategory && (
              <div className="mb-4 flex items-center gap-2 text-sm text-gray-text">
                <button onClick={selectAll} className="hover:text-navy">
                  All Products
                </button>
                {currentCategory && (
                  <>
                    <span>/</span>
                    <button
                      onClick={() => selectCategory(currentCategory.id)}
                      className="hover:text-navy"
                    >
                      {currentCategory.name}
                    </button>
                  </>
                )}
                {currentSubCategory && activeSubCategory !== 'all' && (
                  <>
                    <span>/</span>
                    <button
                      onClick={() => selectSubCategory(currentCategory!.id, currentSubCategory.id)}
                      className="hover:text-navy"
                    >
                      {currentSubCategory.name}
                    </button>
                  </>
                )}
                {currentThirdCategory && activeThirdCategory && (
                  <>
                    <span>/</span>
                    <button
                      onClick={() => selectThirdCategory(currentCategory!.id, currentSubCategory!.id, currentThirdCategory.id)}
                      className="hover:text-navy"
                    >
                      {currentThirdCategory.name}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Category Banner */}
            {activeCategory && currentCategory && (
              <div className="mb-6 overflow-hidden rounded-lg bg-gradient-to-r from-navy to-navy/80 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white">
                  {currentThirdCategory
                    ? currentThirdCategory.name
                    : activeSubCategory !== 'all' && currentSubCategory
                    ? currentSubCategory.name
                    : currentCategory.name}
                </h2>
                <p className="mt-1 text-white/70">
                  {(currentThirdCategory?.isOverview || isSubCategoryOverview)
                    ? 'Product comparison overview'
                    : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} available`}
                </p>
              </div>
            )}

            {/* Category Positioning Statement */}
            {activeCategory && currentCategory && !currentThirdCategory?.isOverview && !isSubCategoryOverview && (categoryPositioning[currentSubCategory?.id || currentCategory.id]) && (
              <div className="mb-8 rounded-lg border border-navy/10 bg-white p-6 shadow-sm">
                <p className="text-sm leading-relaxed text-gray-700">
                  {categoryPositioning[currentSubCategory?.id || currentCategory.id]}
                </p>
              </div>
            )}

            {/* Category Landing Page for Overview */}
            {(currentThirdCategory?.isOverview || isSubCategoryOverview) && (() => {
              const landingContent = categoryLandingContent.find(c =>
                c.subCategoryId
                  ? c.subCategoryId === activeSubCategory && c.categoryId === activeCategory
                  : c.categoryId === activeCategory && !c.subCategoryId
              );
              if (!landingContent) return null;

              const comparisonMap: Record<string, typeof solenoidValvesComparison> = {
                'solenoid-valves': solenoidValvesComparison,
                'ball-valves': ballValvesComparison,
                'sight-glasses': sightGlassesComparison,
              };
              const filterDrierMap: Record<string, typeof filterDriersComparison> = {
                'filter-driers': filterDriersComparison,
              };
              const comparisonData = comparisonMap[activeSubCategory || ''] || filterDrierMap[activeCategory || ''];
              if (!comparisonData) return null;

              const categoryObj = categories.find(c => c.id === activeCategory);
              const subCategoryObj = categoryObj?.subCategories.find(s => s.id === activeSubCategory);
              const categoryProducts = categoryObj?.products.filter(p =>
                activeSubCategory ? p.subCategoryId === activeSubCategory : true
              ) || [];

              return (
                <CategoryLanding
                  content={landingContent}
                  comparisonData={comparisonData}
                  products={categoryProducts}
                  categoryName={categoryObj?.name || ''}
                  categorySlug={activeCategory || ''}
                  subCategoryName={subCategoryObj?.name}
                  subCategorySlug={activeSubCategory}
                />
              );
            })()}

            {/* No category selected - Show category grid */}
            {!activeCategory ? (
              <div>
                <h2 className="mb-6 text-xl font-semibold text-gray-700">Browse by Category</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.filter(cat => {
                    if (cat.published === false) return false
                    const count = cat.products.filter(p => isProductPublished(p)).length
                    return count >= MIN_PRODUCTS_TO_SHOW
                  }).map((cat) => {
                    const publishedCount = cat.products.filter(p => isProductPublished(p)).length
                    return (
                    <button
                      key={cat.id}
                      onClick={() => selectCategory(cat.id)}
                      className="group overflow-hidden rounded-lg border border-gray-border bg-white transition-all hover:border-navy hover:shadow-md"
                    >
                      <div className="aspect-video bg-gradient-to-br from-navy/10 to-accent/10 flex items-center justify-center overflow-hidden">
                        {(() => {
                          const img = getCategoryImage(cat.id)
                          if (img) {
                            return <img src={img} alt={cat.name} className="w-full h-full object-contain transition-transform group-hover:scale-105" />
                          }
                          return <Package className="h-12 w-12 text-navy/30 transition-transform group-hover:scale-110" />
                        })()}
                      </div>
                      <div className="p-4 text-left">
                        <h3 className="font-semibold text-gray-700 group-hover:text-navy">
                          {cat.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-text">{publishedCount} product{publishedCount !== 1 ? 's' : ''}</p>
                      </div>
                    </button>
                    )
                  })}
                </div>
              </div>
            ) : currentThirdCategory?.isOverview ? null : filteredProducts.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-gray-text">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                </p>
                <div className="grid gap-6 grid-cols-1">
                  {filteredProducts.map((product) => (
                    <div id={`product-${product.id}`}>
                      <ProductCard
                        key={product.id}
                        product={product}
                        onInquire={handleInquire}
                        onViewDetail={setSelectedProduct}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-20 text-center">
                <p className="text-lg text-gray-text">No products found matching your criteria.</p>
                <p className="mt-2 text-sm text-gray-text">Try adjusting your search or filters.</p>
              </div>
            )}

            {/* Related Products */}
            {currentThirdCategory && !currentThirdCategory.isOverview && relatedProducts.length > 0 && (
              <div className="mt-12 border-t border-gray-border pt-10">
                <h3 className="text-xl font-bold text-navy mb-6">Related Products</h3>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.categoryId}/${product.subCategoryId}/${product.thirdCategoryId}`}
                      className="group rounded-lg border border-gray-border p-4 transition-all hover:border-accent hover:shadow-md"
                    >
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={`${product.name} - ${product.shortDesc}`}
                          className="w-full h-32 object-contain mb-3"
                        />
                      )}
                      <h4 className="text-sm font-semibold text-navy group-hover:text-accent transition-colors line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="mt-1 text-xs text-gray-text line-clamp-2">{product.shortDesc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom CTA */}
            <div className="mt-16 rounded-lg bg-navy p-8 text-center sm:p-12">
              <MessageCircle className="mx-auto mb-4 h-10 w-10 text-accent" />
              <h3 className="text-xl font-bold text-white sm:text-2xl">
                Can't find what you need?
              </h3>
              <p className="mt-3 text-white/70">
                We source 1000+ HVACR parts. Send us your requirement and we'll find it for you.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onInquire={handleInquire}
        />
      )}
      </div>
    </>
  )
}
