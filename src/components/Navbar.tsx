import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Globe } from 'lucide-react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/contact', label: 'Contact Us' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 border-b border-gray-border bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="HVACR NET" className="h-10 w-auto sm:h-12" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive(link.to) ? 'text-accent' : 'text-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button className="flex items-center gap-1.5 rounded-md border border-gray-border px-3 py-1.5 text-xs font-medium text-gray-text transition-colors hover:border-navy hover:text-navy">
            <Globe className="h-3.5 w-3.5" />
            English
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6 text-navy" /> : <Menu className="h-6 w-6 text-navy" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-border bg-white px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm font-medium transition-colors ${
                isActive(link.to) ? 'text-accent' : 'text-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button className="mt-2 flex items-center gap-1.5 text-xs font-medium text-gray-text">
            <Globe className="h-3.5 w-3.5" />
            English
          </button>
        </div>
      )}
    </header>
  )
}
