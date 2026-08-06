import { ArrowRight } from 'lucide-react'
import type { Product } from '../data/products'

interface Props {
  product: Product
  onInquire: (productName: string) => void
  onViewDetail: (product: Product) => void
}

export default function ProductCard({ product, onInquire, onViewDetail }: Props) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image placeholder */}
      <div
        className="flex h-48 cursor-pointer items-center justify-center bg-gray-bg"
        onClick={() => onViewDetail(product)}
      >
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-navy/10 text-navy transition-colors group-hover:bg-accent/10 group-hover:text-accent">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.125A2.25 2.25 0 0016.5 6h-1.75a2.25 2.25 0 01-1.591-.659l-1.591-1.59A2.25 2.25 0 009.75 3H7.5a2.25 2.25 0 00-1.591.659L4.318 5.25A2.25 2.25 0 012.727 6H1.5A1.5 1.5 0 000 7.5v9a1.5 1.5 0 001.5 1.5h1.227a2.25 2.25 0 001.591.659l1.591 1.59a2.25 2.25 0 001.591.659H9.75a2.25 2.25 0 001.591-.659l1.591-1.59A2.25 2.25 0 0114.523 18h1.727A1.5 1.5 0 0018 16.5V7.5a1.5 1.5 0 00-1.5-1.5" />
            </svg>
          </div>
          <span className="text-xs text-gray-text">Product Image</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3
          className="mb-2 cursor-pointer text-base font-bold text-navy transition-colors hover:text-accent"
          onClick={() => onViewDetail(product)}
        >
          {product.name}
        </h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-text">
          {product.shortDesc}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetail(product)}
            className="flex items-center gap-1 rounded border border-gray-border px-3 py-2 text-xs font-medium text-navy transition-colors hover:border-navy hover:bg-navy/5"
          >
            Details
          </button>
          <button
            onClick={() => onInquire(product.name)}
            className="flex flex-1 items-center justify-center gap-1 rounded bg-accent px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Inquire Now
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
