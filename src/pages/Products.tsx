import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MessageCircle, ChevronRight, Package, LayoutGrid } from 'lucide-react'
import { categories, type Product } from '../data/products'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import SEO from '../components/SEO'

// Schema.org structured data for products
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'HVACR Products',
  description: 'Complete range of HVAC and refrigeration parts and components',
  numberOfItems: categories.reduce((acc, cat) => acc + cat.products.length, 0),
  itemListElement: categories.map((cat, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Product',
      name: cat.name,
      description: `${cat.products.length} products in this category`,
      category: cat.name,
    },
  })),
}

export default function Products() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all')
  const [activeThirdCategory, setActiveThirdCategory] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const allProducts = useMemo(() => {
    return categories.flatMap((cat) => cat.products)
  }, [])

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return []

    let products = allProducts
    products = products.filter((p) => p.categoryId === activeCategory)

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
    return products
  }, [allProducts, activeCategory, activeSubCategory, activeThirdCategory, searchQuery])

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

  return (
    <>
      <SEO
        title="HVACR Products - HVACR Parts & Components | HVACR NET"
        description="Browse our comprehensive range of HVACR parts including copper tubes, fittings, valves, insulation materials, cables, mounting accessories and more. One-stop sourcing from China."
        url="/products"
        ogType="website"
      />
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="min-h-screen bg-gray-bg">
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

              {/* Category list */}
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id
                const hasSubs = cat.subCategories.length > 0

                return (
                  <div key={cat.id} className="group relative">
                    <button
                      onClick={() => selectCategory(cat.id)}
                      className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                        isActive && activeSubCategory === 'all'
                          ? 'bg-navy text-white'
                          : 'text-gray-700 hover:bg-navy/5'
                      }`}
                    >
                      {hasSubs && (
                        <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:rotate-90" />
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
                        {cat.subCategories.length}
                      </span>
                    </button>

                    {/* Sub-categories dropdown on hover */}
                    {hasSubs && (
                      <div className="invisible absolute left-full top-0 z-30 ml-1 w-56 rounded-md border border-gray-border bg-white py-2 shadow-lg opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                        <button
                          onClick={() => selectSubCategory(cat.id, 'all')}
                          className={`block w-full px-4 py-2.5 text-left text-sm font-bold transition-colors ${
                            activeSubCategory === 'all' && isActive
                              ? 'bg-navy text-white'
                              : 'bg-gray-50 text-navy hover:bg-navy/10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <LayoutGrid className="h-4 w-4" />
                            All {cat.name}
                          </div>
                        </button>
                        <div className="my-1 border-t border-gray-border" />
                        {cat.subCategories.map((sub) => {
                          const hasThirdLevel = sub.subCategories && sub.subCategories.length > 0
                          return (
                            <div key={sub.id} className="group/sub relative">
                              <button
                                onClick={() => selectSubCategory(cat.id, sub.id)}
                                className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                                  activeSubCategory === sub.id && !activeThirdCategory
                                    ? 'font-semibold text-accent'
                                    : 'text-gray-700 hover:bg-navy/5'
                                }`}
                              >
                                {hasThirdLevel && (
                                  <ChevronRight className="h-3 w-3 shrink-0 transition-transform group-hover/sub:rotate-90" />
                                )}
                                {!hasThirdLevel && <span className="w-3 shrink-0" />}
                                <span className="flex-1">{sub.name}</span>
                                {hasThirdLevel && (
                                  <span className="text-xs text-gray-400">
                                    {sub.subCategories!.length}
                                  </span>
                                )}
                              </button>
                              {/* Third-level dropdown */}
                              {hasThirdLevel && (
                                <div className="invisible absolute left-full top-0 z-40 ml-1 w-56 rounded-md border border-gray-border bg-white py-2 shadow-lg opacity-0 transition-all group-hover/sub:visible group-hover/sub:opacity-100">
                                  <button
                                    onClick={() => selectSubCategory(cat.id, sub.id)}
                                    className={`block w-full px-4 py-2.5 text-left text-sm font-bold transition-colors ${
                                      activeSubCategory === sub.id && !activeThirdCategory
                                        ? 'bg-navy text-white'
                                        : 'bg-gray-50 text-navy hover:bg-navy/10'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <LayoutGrid className="h-4 w-4" />
                                      All {sub.name}
                                    </div>
                                  </button>
                                  <div className="my-1 border-t border-gray-border" />
                                  {sub.subCategories!.map((third) => (
                                    <button
                                      key={third.id}
                                      onClick={() => selectThirdCategory(cat.id, sub.id, third.id)}
                                      className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                                        activeThirdCategory === third.id
                                          ? 'font-semibold text-accent'
                                          : 'text-gray-700 hover:bg-navy/5'
                                      }`}
                                    >
                                      {third.name}
                                    </button>
                                  ))}
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
                  {activeSubCategory !== 'all' && currentSubCategory
                    ? currentSubCategory.name
                    : currentCategory.name}
                </h2>
                <p className="mt-1 text-white/70">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
                </p>
              </div>
            )}

            {/* No category selected - Show category grid */}
            {!activeCategory ? (
              <div>
                <h2 className="mb-6 text-xl font-semibold text-gray-700">Browse by Category</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => selectCategory(cat.id)}
                      className="group overflow-hidden rounded-lg border border-gray-border bg-white transition-all hover:border-navy hover:shadow-md"
                    >
                      <div className="aspect-video bg-gradient-to-br from-navy/10 to-accent/10 flex items-center justify-center">
                        <Package className="h-12 w-12 text-navy/30 transition-transform group-hover:scale-110" />
                      </div>
                      <div className="p-4 text-left">
                        <h3 className="font-semibold text-gray-700 group-hover:text-navy">
                          {cat.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-text">{cat.products.length} products</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-gray-text">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                </p>
                <div className="grid gap-6 grid-cols-1">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onInquire={handleInquire}
                      onViewDetail={setSelectedProduct}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="py-20 text-center">
                <p className="text-lg text-gray-text">No products found matching your criteria.</p>
                <p className="mt-2 text-sm text-gray-text">Try adjusting your search or filters.</p>
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
