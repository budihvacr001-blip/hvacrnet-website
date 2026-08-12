import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MessageCircle, ChevronRight, Package } from 'lucide-react'
import { categories, solenoidValvesComparison, filterDriersComparison, ballValvesComparison, sightGlassesComparison, type Product } from '../data/products'
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
                        {cat.subCategories.length}
                      </span>
                    </button>

                    {/* Sub-categories inline */}
                    {hasSubs && expandedCategories[cat.id] && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">

                        {cat.subCategories.map((sub) => {
                          const hasThirdLevel = sub.subCategories && sub.subCategories.length > 0
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
                                {hasThirdLevel && (
                                  <span className="text-xs text-gray-400">
                                    {sub.subCategories!.length}
                                  </span>
                                )}
                              </button>
                              {/* Third-level inline */}
                              {hasThirdLevel && expandedSubCategories[`${cat.id}-${sub.id}`] && (
                                <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">

                                  {sub.subCategories!.map((third) => (
                                    <button
                                      key={third.id}
                                      onClick={() => selectThirdCategory(cat.id, sub.id, third.id)}
                                      className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                                        third.isOverview
                                          ? 'font-bold text-gray-900 hover:bg-navy/5'
                                          : activeThirdCategory === third.id
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

            {/* Comparison Table for Overview */}
            {(currentThirdCategory?.isOverview || isSubCategoryOverview) && solenoidValvesComparison && activeSubCategory === 'solenoid-valves' && (
              <div className="mb-8 overflow-hidden rounded-lg border border-navy/20 bg-white shadow-lg">
                <div className="bg-gradient-to-r from-navy to-navy/90 p-6">
                  <h3 className="text-xl font-bold text-white">{solenoidValvesComparison.title}</h3>
                  <p className="mt-2 text-sm text-white/80">{solenoidValvesComparison.subtitle}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-navy/5">
                        {solenoidValvesComparison.headers.map((header, i) => (
                          <th key={i} className="whitespace-nowrap px-3 py-3 text-left font-semibold text-navy border-b border-navy/10">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {solenoidValvesComparison.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {row.map((cell, cellIdx) => {
                            // Product column (index 1) - make it clickable
                            if (cellIdx === 1) {
                              // Map product names to thirdCategoryId
                              const productToId: Record<string, string> = {
                                'Standard Solenoid Valve (ODF, NC)': 'hvd-standard',
                                'High Flow Solenoid Valve, Flanged ODF': 'hvp-high-flow',
                                'Clamping Type Solenoid Valve, Small Port': 'hv-clamping-small',
                                'Clamping Type Solenoid Valve, Large Port': 'hv-clamping-large',
                                'IP65 Sealed Solenoid Valve, Direct Operated': 'sv-ip65-direct',
                                'IP65 Sealed Solenoid Valve, Servo Operated': 'sv-ip65-servo',
                                'Low Power Solenoid Valve 8W, Direct Operated': '10-8w-direct',
                                'Low Power Solenoid Valve 8W, Servo Operated': '10-8w-servo',
                                'Normally Open Solenoid Valve, Small Port': 'hvk-normally-open-small',
                                'Normally Open Solenoid Valve, Large Port': 'hvk-normally-open-large',
                                'Compressor Unloading Solenoid Valve, Flanged': 'hv-unloading-flanged',
                                'Compressor Unloading Solenoid Valve, ODF': 'hv-unloading-odf',
                                'Hot Gas Defrost Solenoid Valve, 3-Way': 'hvs-hot-gas',
                                'High Flow Piston Solenoid Valve, ODF': 'hvdf-high-flow',
                                'High Flow Piston Solenoid Valve, Flanged': 'hvpf-high-flow',
                              };
                              const thirdId = productToId[cell];
                              return (
                                <td key={cellIdx} className="whitespace-nowrap px-3 py-2.5 border-b border-gray-100">
                                  {thirdId ? (
                                    <button
                                      onClick={() => selectThirdCategory('valves', 'solenoid-valves', thirdId)}
                                      className="font-medium text-accent hover:text-accent-dark hover:underline transition-colors"
                                    >
                                      {cell}
                                    </button>
                                  ) : (
                                    <span className="font-medium text-gray-800">{cell}</span>
                                  )}
                                </td>
                              );
                            }
                            return (
                              <td key={cellIdx} className="whitespace-nowrap px-3 py-2.5 text-gray-600 border-b border-gray-100">
                                {cell}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 px-6 py-4 text-xs text-gray-500 border-t border-gray-100">
                  <p><strong>Note:</strong> Kv values are for reference only. MWP = Maximum Working Pressure. Contact us for specific model selection and technical consultation.</p>
                </div>
              </div>
            )}

            {/* Filter Driers Comparison Table for Overview */}
            {(currentThirdCategory?.isOverview || isSubCategoryOverview) && filterDriersComparison && activeCategory === 'filter-driers' && (
              <div className="mb-8 overflow-hidden rounded-lg border border-navy/20 bg-white shadow-lg">
                <div className="bg-gradient-to-r from-navy to-navy/90 p-6">
                  <h3 className="text-xl font-bold text-white">{filterDriersComparison.title}</h3>
                  <p className="mt-2 text-sm text-white/80">{filterDriersComparison.subtitle}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-navy/5">
                        {filterDriersComparison.headers.map((header, i) => (
                          <th key={i} className="whitespace-nowrap px-3 py-3 text-left font-semibold text-navy border-b border-navy/10">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filterDriersComparison.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {row.map((cell, cellIdx) => {
                            // Product column (index 1) - make it clickable
                            if (cellIdx === 1) {
                              // Map product names to subCategoryId
                              const productToId: Record<string, string> = {
                                'Bidirectional Filter Drier, SAE Flare': 'bfk-sae',
                                'Bidirectional Filter Drier, Brazed ODF': 'bfk-odf',
                                'Unidirectional Filter Drier, SAE Flare': 'dfs-sae',
                                'Unidirectional Filter Drier, Brazed ODF': 'dfs-odf',
                                'Replaceable Core Filter Drier, Brazed ODF': 'dfs-replaceable',
                              };
                              const subId = productToId[cell];
                              return (
                                <td key={cellIdx} className="whitespace-nowrap px-3 py-2.5 border-b border-gray-100">
                                  {subId ? (
                                    <button
                                      onClick={() => selectSubCategory('filter-driers', subId)}
                                      className="font-medium text-accent hover:text-accent-dark hover:underline transition-colors"
                                    >
                                      {cell}
                                    </button>
                                  ) : (
                                    <span className="font-medium text-gray-800">{cell}</span>
                                  )}
                                </td>
                              );
                            }
                            return (
                              <td key={cellIdx} className="whitespace-nowrap px-3 py-2.5 text-gray-600 border-b border-gray-100">
                                {cell}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 px-6 py-4 text-xs text-gray-500 border-t border-gray-100">
                  <p><strong>Note:</strong> MWP = Maximum Working Pressure. Contact us for specific model selection and technical consultation.</p>
                </div>
              </div>
            )}

            {/* Sight Glasses Comparison Table for Overview */}
            {(currentThirdCategory?.isOverview || isSubCategoryOverview) && sightGlassesComparison && activeCategory === 'sight-glasses' && (
              <div className="mb-8 overflow-hidden rounded-lg border border-navy/20 bg-white shadow-lg">
                <div className="bg-gradient-to-r from-navy to-navy/90 p-6">
                  <h3 className="text-xl font-bold text-white">{sightGlassesComparison.title}</h3>
                  <p className="mt-2 text-sm text-white/80">{sightGlassesComparison.subtitle}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-navy/5">
                        {sightGlassesComparison.headers.map((header, i) => (
                          <th key={i} className="whitespace-nowrap px-3 py-3 text-left font-semibold text-navy border-b border-navy/10">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sightGlassesComparison.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {row.map((cell, cellIdx) => {
                            // Product column (index 1) - make it clickable
                            if (cellIdx === 1) {
                              // Map product names to thirdCategoryId
                              const productToId: Record<string, string> = {
                                'Moisture Indicator Sight Glass (Brazed ODF)': 'sgn-brazed',
                                'Moisture Indicator Sight Glass (SAE Flare)': 'sgn-sae',
                                'Moisture Indicator Sight Glass (SAE Flare, M/F)': 'sgn-sae-mf',
                                'Moisture Indicator Sight Glass (NPT Threaded)': 'sgn-npt',
                                'Oil Level Sight Glass (G Thread)': 'sgr-g',
                              };
                              const thirdId = productToId[cell];
                              return (
                                <td key={cellIdx} className="whitespace-nowrap px-3 py-2.5 border-b border-gray-100">
                                  {thirdId ? (
                                    <button
                                      onClick={() => selectThirdCategory('sight-glasses', 'sight-glasses-overview', thirdId)}
                                      className="font-medium text-accent hover:text-accent-dark hover:underline transition-colors"
                                    >
                                      {cell}
                                    </button>
                                  ) : (
                                    <span className="font-medium text-gray-800">{cell}</span>
                                  )}
                                </td>
                              );
                            }
                            return (
                              <td key={cellIdx} className="whitespace-nowrap px-3 py-2.5 border-b border-gray-100">
                                <span className={cellIdx === 0 ? 'font-semibold text-navy' : 'text-gray-700'}>{cell}</span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Ball Valves Comparison Table for Overview */}
            {(currentThirdCategory?.isOverview || isSubCategoryOverview) && ballValvesComparison && activeSubCategory === 'ball-valves' && (
              <div className="mb-8 overflow-hidden rounded-lg border border-navy/20 bg-white shadow-lg">
                <div className="bg-gradient-to-r from-navy to-navy/90 p-6">
                  <h3 className="text-xl font-bold text-white">{ballValvesComparison.title}</h3>
                  <p className="mt-2 text-sm text-white/80">{ballValvesComparison.subtitle}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-navy/5">
                        {ballValvesComparison.headers.map((header, i) => (
                          <th key={i} className="whitespace-nowrap px-3 py-3 text-left font-semibold text-navy border-b border-navy/10">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ballValvesComparison.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {row.map((cell, cellIdx) => {
                            // Product column (index 1) - make it clickable
                            if (cellIdx === 1) {
                              // Map product names to thirdCategoryId
                              const productToId: Record<string, string> = {
                                'Electric Ball Valve (Full Bore)': 'dqf-electric',
                                'Manual Ball Valve (Full Bore)': 'hbc-manual-full',
                                'Manual Ball Valve (Reduced Bore)': 'qft-manual-reduced',
                                'CO₂ Ball Valve (Full Bore)': 'qf-co2',
                                'Threaded Ball Valve (NPT)': 'gfm-s-threaded',
                              };
                              const thirdId = productToId[cell];
                              return (
                                <td key={cellIdx} className="whitespace-nowrap px-3 py-2.5 border-b border-gray-100">
                                  {thirdId ? (
                                    <button
                                      onClick={() => selectThirdCategory('valves', 'ball-valves', thirdId)}
                                      className="font-medium text-accent hover:text-accent-dark hover:underline transition-colors"
                                    >
                                      {cell}
                                    </button>
                                  ) : (
                                    <span className="font-medium text-gray-800">{cell}</span>
                                  )}
                                </td>
                              );
                            }
                            return (
                              <td key={cellIdx} className="whitespace-nowrap px-3 py-2.5 text-gray-600 border-b border-gray-100">
                                {cell}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 px-6 py-4 text-xs text-gray-500 border-t border-gray-100">
                  <p><strong>Note:</strong> MWP = Maximum Working Pressure. Contact us for specific model selection and technical consultation.</p>
                </div>
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
