import { Link } from 'react-router-dom'
import { navLinks } from '../data/navLinks'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Left - Brand */}
          <div>
            <Link to="/" className="inline-block">
              <img src="/logo.png" alt="HVACR NET" className="h-10 w-auto sm:h-12" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Your One-Stop HVACR Parts Supplier from China.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              20 years of international trade expertise.
            </p>
          </div>

          {/* Middle - Quick Links */}
          <div>
            <h3 className="text-base font-bold uppercase text-[#1a3a5c]">Quick Links</h3>
            <div className="mt-1.5 mb-4 h-[3px] w-11 bg-[#1a3a5c]" />
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-600 transition-colors hover:text-[#1a3a5c]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Contact */}
          <div>
            <h3 className="text-base font-bold uppercase text-[#1a3a5c]">Contact</h3>
            <div className="mt-1.5 mb-4 h-[3px] w-11 bg-[#1a3a5c]" />
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="mailto:info@hvacrnet.com" className="transition-colors hover:text-[#1a3a5c]">
                  info@hvacrnet.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/8618018696001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#1a3a5c]"
                >
                  +86 180 1869 6001
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Ningbo HVACR Net Refrigeration Equipment Co., Ltd. All rights reserved.
          {' '}
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            浙ICP备2026072070号
          </a>
        </div>
      </div>
    </footer>
  )
}