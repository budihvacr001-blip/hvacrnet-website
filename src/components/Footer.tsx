import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img src="/logo.png" alt="HVACR NET" className="h-8 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              Your One-Stop HVACR Parts Supplier from China.
              <br />
              20 years of international trade expertise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-white/70 transition-colors hover:text-accent">
                Home
              </Link>
              <Link to="/products" className="text-sm text-white/70 transition-colors hover:text-accent">
                Products
              </Link>
              <Link to="/contact" className="text-sm text-white/70 transition-colors hover:text-accent">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/50">
              Contact
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@hvacrnet.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="h-4 w-4 shrink-0" />
                <span>WhatsApp: +86 XXX XXXX XXXX</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Ningbo, Zhejiang, China</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} Ningbo HVACR Net Refrigeration Equipment Co., Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
