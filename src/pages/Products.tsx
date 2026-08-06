import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MessageCircle, ChevronDown, ChevronRight, Package } from 'lucide-react'
import { categories, type Product } from '../data/products'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'

export default function Products() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all')
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set())
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const allProducts = useMemo(() => {
    return categories.flatMap((cat) => cat.products)
  }, [])

  const filteredProducts = useMemo(() => {
    let products = allProducts

    if (activeCategory !== 'all') {
      products = products.filter((p) => p.categoryId === activeCategory)
    }
    if (activeSubCategory !== 'all') {
      products = products.filter((p) => p.subCategoryId === activeSubCategory)
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
  }, [allProducts, activeCategory, activeSubCategory, searchQuery])

  const toggleExpand = (catId: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev)
      if (next.has(catId)) next.delete(catId)
      else next.add(catId)
      return next
    })
  }

  const selectCategory = (catId: string) => {
    setActiveCategory(catId)
    setActiveSubCategory('all')
    setExpandedCats((prev) => new Set(prev).add(catId))
    setSidebarOpen(false)
  }

  const selectSubCategory = (catId: string, subId: string) => {
    setActiveCategory(catId)
    setActiveSubCategory(subId)
    setSidebarOpen(false)
  }

  const selectAll = () => {
    setActiveCategory('all')
    setActiveSubCategory('all')
    setSidebarOpen(false)
  }

  const handleInquire = (productName: string) => {
    navigate('/contact', { state: { productInterest: productName } })
  }

  const currentCategory = categories.find((c) => c.id === activeCategory)
  const currentSubCategory = currentCategory?.subCategories.find((s) => s.id === activeSubCategory)

  return (
    <div className="min-h-screen bg-gray-bg">
      {/* Header */}
      <section className="bg-navy py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">Products</h1>
              <p className="mt-2 text-white/70">
                Browse our comprehensive range of HVACR parts and components
              </p>
            </div>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-md border border-white/30 px-4 py-2 text-sm font-medium text-white lg:hidden"
            >
              {sidebarOpen ? 'Close' : 'Categories'}
            </button>
          </div>

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
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar - Category Tree */}
          <aside
            className={`${
              sidebarOpen ? 'fixed inset-0 z-40 bg-black/50 lg:static lg:bg-transparent' : 'hidden'
            } lg:block lg:w-64 lg:shrink-0`}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSidebarOpen(false)
            }}
          >
            <div
              className={`${
                sidebarOpen
                  ? 'fixed left-0 top-0 h-full w-72 overflow-y-auto bg-white p-6 shadow-xl lg:static lg:shadow-none'
                  : ''
              } lg:h-auto lg:w-full lg:overflow-visible lg:bg-transparent lg:p-0 lg:shadow-none`}
            >
              {/* Mobile close button */}
              {sidebarOpen && (
                <div className="mb-4 flex items-center justify-between lg:hidden">
                  <h3 className="text-lg font-bold text-navy">Categories</h3>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-text hover:text-navy"
                  >
                    ✕
                  </button>
                </div>
              )}

              <nav className="space-y-1">
                {/* All Products */}
                <button
                  onClick={selectAll}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-navy text-white'
                      : 'text-gray-700 hover:bg-navy/5'
                  }`}
                >
                  <Package className="h-4 w-4 shrink-0" />
                  All Products
                </button>

                {/* Category list */}
                {categories.map((cat) => {
                  const isExpanded = expandedCats.has(cat.id)
                  const isActive = activeCategory === cat.id
                  const hasSubs = cat.subCategories.length > 0

                  return (
                    <div key={cat.id}>
                      <button
                        onClick={() => {
                          if (hasSubs) {
                            toggleExpand(cat.id)
                          }
                          selectCategory(cat.id)
                        }}
                        className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                          isActive && activeSubCategory === 'all'
                            ? 'bg-navy text-white'
                            : 'text-gray-700 hover:bg-navy/5'
                        }`}
                      >
                        {hasSubs ? (
                          isExpanded ? (
                            <ChevronDown className="h-4 w-4 shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 shrink-0" />
                          )
                        ) : (
                          <span className="w-4 shrink-0" />
                        )}
                        <span className="flex-1">{cat.name}</span>
                        <span
                          className={`text-xs ${
                            isActive && activeSubCategory === 'all'
                              ? 'text-white/60'
                              : 'text-gray-400'
                          }`}
                        >
                          {cat.products.length}
                        </span>
                      </button>

                      {/* Sub-categories */}
                      {hasSubs && isExpanded && (
                        <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-gray-border pl-3">
                          <button
                            onClick={() => selectSubCategory(cat.id, 'all')}
                            className={`block w-full rounded px-3 py-1.5 text-left text-xs transition-colors ${
                              activeSubCategory === 'all' && isActive
                                ? 'font-semibold text-accent'
                                : 'text-gray-600 hover:text-navy'
                            }`}
                          >
                            All {cat.name}
                          </button>
                          {cat.subCategories.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => selectSubCategory(cat.id, sub.id)}
                              className={`block w-full rounded px-3 py-1.5 text-left text-xs transition-colors ${
                                activeSubCategory === sub.id
                                  ? 'font-semibold text-accent'
                                  : 'text-gray-600 hover:text-navy'
                              }`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Main content - Product grid */}
          <div className="min-w-0 flex-1">
            {/* Breadcrumb */}
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
                  <span className="text-navy">{currentSubCategory.name}</span>
                </>
              )}
            </div>

            {/* Results count */}
            <p className="mb-6 text-sm text-gray-text">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>

            {/* Product grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onInquire={handleInquire}
                    onViewDetail={setSelectedProduct}
                  />
                ))}
              </div>
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

      {/* Product detail modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onInquire={handleInquire}
        />
      )}
    </div>
  )
}
