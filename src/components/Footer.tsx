import { Link } from 'react-router-dom'
import { navLinks } from '../data/navLinks'

export default function Footer() {
  return (
    <footer className="bg-navy-dark">
      <div className="px-[5vw] py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Left - Brand */}
          <div>
            <Link to="/" className="inline-block">
              <img src="/logo.png" alt="HVACR NET" className="h-10 w-auto sm:h-12" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-300">
              Your One-Stop HVACR Parts Supplier from China.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-300">
              20 years of international trade expertise.
            </p>
          </div>

          {/* Middle - Quick Links */}
          <div>
            <h3 className="text-base font-bold uppercase text-white">Quick Links</h3>
            <div className="mt-1.5 mb-4 h-[3px] w-11 bg-white" />
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-300 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Contact */}
          <div>
            <h3 className="text-base font-bold uppercase text-white">Contact</h3>
            <div className="mt-1.5 mb-4 h-[3px] w-11 bg-white" />
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="mailto:info@hvacrnet.com" className="transition-colors hover:text-white">
                  info@hvacrnet.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/8618018696001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  +86 180 1869 6001
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Ningbo HVACR Net Refrigeration Equipment Co., Ltd. All rights reserved.
          {' '}
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition-colors hover:text-gray-200"
          >
            浙ICP备2026072070号
          </a>
        </div>
      </div>
    </footer>
  )
}