import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BASE_URL = 'https://www.hvacrnet.com'

export function useCanonical() {
  const { pathname } = useLocation()

  useEffect(() => {
    const canonicalUrl = `${BASE_URL}${pathname}`
    
    // Remove existing canonical link if any
    const existing = document.querySelector('link[rel="canonical"]')
    if (existing) {
      existing.setAttribute('href', canonicalUrl)
    } else {
      const link = document.createElement('link')
      link.rel = 'canonical'
      link.href = canonicalUrl
      document.head.appendChild(link)
    }
  }, [pathname])
}
