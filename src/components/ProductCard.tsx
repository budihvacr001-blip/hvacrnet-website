import { useState } from 'react';

export interface Product {
  id: string;
  categoryId: string;
  subCategoryId?: string;
  name: string;
  shortDesc: string;
  description: string;
  images?: string[];
  specs?: { label: string; value: string }[];
  applications?: string;
}

interface ProductCardProps {
  product: Product;
  onInquire: (productName: string) => void;
  onViewDetail: (product: Product) => void;
}

export default function ProductCard({ product, onInquire, onViewDetail }: ProductCardProps) {
  const [mainImage, setMainImage] = useState(product.images?.[0] || '');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Main Image */}
      <div className="bg-gray-50 flex items-center justify-center overflow-hidden max-h-64">
        {mainImage ? (
          <img src={mainImage} alt={product.name} className="max-w-full max-h-64 object-contain" style={{ imageRendering: 'auto' }} loading="eager" />
        ) : (
          <div className="text-gray-400 text-sm">No Image</div>
        )}
      </div>

      {/* Thumbnails */}
      {product.images && product.images.length > 1 && (
        <div className="flex gap-2 px-3 py-2 bg-gray-50 border-t border-gray-100">
          {product.images.slice(0, 5).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainImage(img)}
              className={`w-14 h-14 rounded border-2 overflow-hidden flex-shrink-0 transition-all ${
                mainImage === img ? 'border-[#1a3a5c]' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-contain" loading={idx === 0 ? 'eager' : 'lazy'} />
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[#1a3a5c] mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-4">{product.shortDesc}</p>
        <div className="flex gap-2">
          <button
            onClick={() => onInquire(product.name)}
            className="flex-1 bg-[#e8722a] text-white text-sm px-4 py-2 rounded hover:bg-[#d4641f] transition-colors"
          >
            Inquire Now
          </button>
          <button
            onClick={() => onViewDetail(product)}
            className="flex-1 border border-[#1a3a5c] text-[#1a3a5c] text-sm px-4 py-2 rounded hover:bg-[#1a3a5c] hover:text-white transition-colors"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
