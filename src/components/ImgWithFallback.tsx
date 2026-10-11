import { useState } from 'react';

const FALLBACK_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="#f3f4f6"/>
    <rect x="1" y="1" width="398" height="298" fill="none" stroke="#e5e7eb" stroke-width="2"/>
    <g fill="none" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round">
      <line x1="170" y1="120" x2="200" y2="175"/>
      <line x1="230" y1="120" x2="200" y2="175"/>
      <line x1="188" y1="175" x2="212" y2="175"/>
    </g>
    <text x="200" y="220" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="16" fill="#94a3b8">No Image</text>
  </svg>`,
)}`;

interface ImgWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'eager' | 'lazy';
  draggable?: boolean;
}

export default function ImgWithFallback({ src, alt, className, style, loading, draggable }: ImgWithFallbackProps) {
  const [error, setError] = useState(false);
  return (
    <img
      src={error ? FALLBACK_SVG : src}
      alt={alt}
      className={className}
      style={style}
      loading={loading ?? 'lazy'}
      draggable={draggable}
      onError={() => setError(true)}
    />
  );
}

export { FALLBACK_SVG };