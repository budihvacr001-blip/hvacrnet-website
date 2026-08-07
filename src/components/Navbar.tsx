import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

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
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src="/logo.png" alt="HVACR NET" className="h-10 w-auto sm:h-12" />
        </Link>

        {/* Desktop nav - horizontal text links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'text-[#1a3a5c]'
                  : 'text-gray-600 hover:text-[#1a3a5c]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language + Mobile toggle */}
        <div className="flex items-center gap-4">
          <button className="hidden rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-500 transition-colors hover:border-[#1a3a5c] hover:text-[#1a3a5c] sm:block">
            EN
          </button>
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6 text-[#1a3a5c]" /> : <Menu className="h-6 w-6 text-[#1a3a5c]" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm font-medium transition-colors ${
                isActive(link.to) ? 'text-[#1a3a5c]' : 'text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button className="mt-2 rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-500">
            EN
          </button>
        </div>
      )}
    </header>
  )
}
