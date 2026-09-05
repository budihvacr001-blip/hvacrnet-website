import { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'
import type { Product } from '../data/products'
import { getProductFAQs } from '../data/faq-constants'
import DataTable from './DataTable'

interface Props {
  product: Product
  onClose: () => void
  onInquire: (productName: string) => void
}

export default function ProductModal({ product, onClose, onInquire }: Props) {
  const [mainImage, setMainImage] = useState(product.images?.[0] || '')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-1.5 text-gray-text transition-colors hover:bg-gray-bg hover:text-navy"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Main Image */}
        <div className="flex items-center justify-center bg-gray-bg overflow-hidden max-h-80">
          {mainImage ? (
            <img src={mainImage} alt={product.name} className="max-w-full max-h-80 object-contain" style={{ imageRendering: 'auto' }} />
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-navy/10 text-navy">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.125A2.25 2.25 0 0016.5 6h-1.75a2.25 2.25 0 01-1.591-.659l-1.591-1.59A2.25 2.25 0 009.75 3H7.5a2.25 2.25 0 00-1.591.659L4.318 5.25A2.25 2.25 0 012.727 6H1.5A1.5 1.5 0 000 7.5v9a1.5 1.5 0 001.5 1.5h1.227a2.25 2.25 0 001.591.659l1.591 1.59a2.25 2.25 0 001.591.659H9.75a2.25 2.25 0 001.591-.659l1.591-1.59A2.25 2.25 0 0114.523 18h1.727A1.5 1.5 0 0018 16.5V7.5a1.5 1.5 0 00-1.5-1.5" />
                </svg>
              </div>
              <span className="text-sm text-gray-text">Product Image</span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 px-6 py-3 bg-gray-bg border-t border-gray-border">
            {product.images.slice(0, 5).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                className={`w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0 transition-all ${
                  mainImage === img ? 'border-[#1a3a5c]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Product Name */}
          <h2 className="text-2xl font-bold text-navy">{product.name}</h2>

          {/* Description */}
          <div className="mt-3 leading-relaxed text-gray-700">
            {product.description.split('\n\n').map((para, i) => (
              <p key={i} className={i > 0 ? 'mt-3' : ''}>{para}</p>
            ))}
          </div>

          {/* Key Features */}
          {product.features && product.features.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy">
                Key Features
              </h3>
              <ul className="space-y-1.5">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-700">
                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#e8722a]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Available Models */}
          {product.availableModels && product.availableModels.rows.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy">
                Available Models
              </h3>
              <DataTable
                headers={product.availableModels.headers}
                rows={product.availableModels.rows}
              />
            </div>
          )}

          {/* Material & Standard */}
          {product.materialStandard && product.materialStandard.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy">
                Material &amp; Standard
              </h3>
              <DataTable
                keyValue
                rows={product.materialStandard.map(item => [item.label, item.value])}
              />
            </div>
          )}

          {/* Specifications Table */}
          {product.specTable && product.specTable.rows.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy">
                Specifications
              </h3>
              <DataTable
                headers={product.specTable.headers}
                rows={product.specTable.rows}
              />
            </div>
          )}

          {/* Technical Parameters */}
          {product.specs && product.specs.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy">
                Technical Parameters
              </h3>
              <DataTable
                keyValue
                rows={product.specs.map(item => [item.label, item.value])}
              />
            </div>
          )}

          {/* Applications */}
          {product.applications && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-navy">
                Applications
              </h3>
              <p className="text-sm text-gray-700">{product.applications}</p>
            </div>
          )}

          {/* FAQ - Accordion */}
          <ProductFAQSection product={product} />

          {/* CTA */}
          <div className="mt-8">
            <button
              onClick={() => {
                onClose()
                onInquire(product.name)
              }}
              className="w-full rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover sm:w-auto"
            >
              Inquire About This Product
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductFAQSection({ product }: { product: Product }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const faqs = getProductFAQs(
    product.categoryId,
    product.subCategoryId,
    product.faqSelection
  )

  if (faqs.length === 0) return null

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy">
        Frequently Asked Questions
      </h3>
      <div className="divide-y divide-gray-border overflow-hidden rounded-lg border border-gray-border">
        {faqs.map((item, i) => (
          <div key={i}>
            <button
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-bg"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              <span className="pr-4 text-sm font-medium text-navy">{item.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-gray-text transition-transform ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-4 pb-3 text-sm text-gray-700">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
