export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} Ningbo HVACR Net Refrigeration Equipment Co., Ltd. All rights reserved.
          {' '}
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 transition-colors hover:text-white/60"
          >
            浙ICP备2026072070号
          </a>
        </div>
      </div>
    </footer>
  )
}