import { Link } from 'react-router-dom'
import { Package, Layers, Warehouse, Award, ArrowRight } from 'lucide-react'

const advantages = [
  { icon: Package, title: 'Low MOQ', desc: 'Start from 1 piece — no forced overstocking' },
  { icon: Layers, title: 'One-Stop Sourcing', desc: '10+ product categories, mixed-container loading in one order' },
  { icon: Warehouse, title: 'Ready Stock', desc: '1,000 sqm warehouse — what you see is what we ship' },
  { icon: Award, title: '20 Years of Trade Expertise', desc: 'Professional communication, technical support, and sourcing advice you can trust' },
]

export default function Home() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative flex h-[55vh] min-h-[380px] items-center justify-center overflow-hidden bg-white">
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          {/* Logo */}
          <div className="animate-fade-in-up relative mx-auto inline-block">
            <img src="/logo.png" alt="HVACR NET" className="relative mx-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl" />
          </div>
          <p className="animate-fade-in-up animate-delay-200 mt-1.5 text-base font-semibold text-[#1a3a5c] sm:text-lg lg:text-xl">
            Your One-Stop HVACR Parts Supplier from China
          </p>
          <div className="animate-fade-in-up animate-delay-300 mt-6 flex justify-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-lg"
            >
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Advantages */}
      <section className="bg-gray-bg py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-navy">Why Choose HVACR NET</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((item, i) => (
              <div
                key={item.title}
                className={`animate-fade-in-up animate-delay-${(i + 1) * 100} group rounded-lg border border-gray-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-navy/5 text-navy transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-navy">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-text">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-navy py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Gain not just a supplier, but a dedicated teammate.
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Let's win your market together.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-lg"
          >
            Send Inquiry
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
