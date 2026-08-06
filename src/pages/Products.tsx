import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MessageCircle } from 'lucide-react'
import { categories, type Product } from '../data/products'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'

export default function Products() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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

  const currentCategory = categories.find((c) => c.id === activeCategory)

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId)
    setActiveSubCategory('all')
  }

  const handleInquire = (productName: string) => {
    navigate('/contact', { state: { productInterest: productName } })
  }

  return (
    <div className="min-h-screen bg-gray-bg">
      {/* Header */}
      <section className="bg-navy py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Category tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-navy text-white'
                : 'bg-white text-gray-700 hover:bg-navy/5'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-navy text-white'
                  : 'bg-white text-gray-700 hover:bg-navy/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sub-category tabs */}
        {currentCategory && currentCategory.subCategories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSubCategory('all')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeSubCategory === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-white text-gray-600 hover:bg-accent/5'
              }`}
            >
              All {currentCategory.name}
            </button>
            {currentCategory.subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubCategory(sub.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeSubCategory === sub.id
                    ? 'bg-accent text-white'
                    : 'bg-white text-gray-600 hover:bg-accent/5'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Product grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
