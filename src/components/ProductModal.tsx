import { useState } from 'react'
import { X } from 'lucide-react'
import type { Product } from '../data/products'

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
        <div className="flex aspect-[4/3] items-center justify-center bg-gray-bg overflow-hidden">
          {mainImage ? (
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
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
            {product.images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                className={`w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0 transition-all ${
                  mainImage === img ? 'border-[#1a3a5c]' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
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

          {/* Material & Standard */}
          {product.materialStandard && product.materialStandard.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy">
                Material &amp; Standard
              </h3>
              <div className="overflow-hidden rounded-lg border border-gray-border">
                <table className="w-full text-sm">
                  <tbody>
                    {product.materialStandard.map((item, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-bg' : 'bg-white'}>
                        <td className="px-4 py-2.5 font-medium text-navy w-1/3">{item.label}</td>
                        <td className="px-4 py-2.5 text-gray-700">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Specifications Table */}
          {product.specTable && product.specTable.rows.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy">
                Specifications
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-navy text-white">
                      {product.specTable.headers.map((h, i) => (
                        <th key={i} className="px-3 py-2.5 text-left font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.specTable.rows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-bg' : 'bg-white'}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2 whitespace-nowrap text-gray-700">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
