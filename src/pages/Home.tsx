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
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-navy">
        {/* Industrial grid pattern */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          {/* Logo with light halo backdrop */}
          <div className="animate-fade-in-up relative mx-auto inline-block">
            <div className="absolute inset-0 -m-8 rounded-full bg-white/10 blur-3xl" />
            <img src="/logo.png" alt="HVACR NET" className="relative mx-auto max-w-xs sm:max-w-sm md:max-w-md drop-shadow-lg" />
          </div>
          <p className="animate-fade-in-up animate-delay-200 mt-8 text-lg font-medium text-white/80 sm:text-xl lg:text-2xl">
            Your One-Stop HVACR Parts Supplier from China
          </p>
          <div className="animate-fade-in-up animate-delay-300 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-lg"
            >
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-md"
            >
              Send Inquiry
            </Link>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="animate-fade-in-up mb-4 text-center text-sm font-semibold uppercase tracking-widest text-accent">
            About Us
          </h2>
          <h3 className="animate-fade-in-up mb-10 text-center text-3xl font-bold text-navy sm:text-4xl">
            Your Professional Sourcing Partner
          </h3>

          <div className="space-y-6 text-base leading-relaxed text-gray-700">
            <p>
              HVACR NET was founded by a 20-year expert of international trade. We are not a traditional trading company — we are your professional sourcing partner for HVAC and refrigeration parts.
            </p>

            <div className="rounded-lg border border-gray-border bg-gray-bg p-6">
              <h4 className="mb-4 text-lg font-bold text-navy">Why us?</h4>
              <p className="mb-4">
                Our founder started from scratch, built a multi-million-dollar export business serving markets across Europe and North America, and established a branch office and warehouse in the United States.
              </p>
              <p className="mb-3 font-semibold text-navy">We understand an international buyer's deepest concerns:</p>
              <ul className="ml-4 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Will the goods arrive as promised after payment is made?
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Will logistics and customs clearance go smoothly?
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Will the quality match what was committed?
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  Who will take responsibility if something goes wrong?
                </li>
              </ul>
              <p className="mt-4">
                Beyond these, many buyers also struggle with unreliable suppliers, incomplete product ranges, forced overstocking, and unclear pricing.
              </p>
              <p className="mt-4 font-semibold text-navy">
                HVACR NET was created to solve these problems — systematically.
              </p>
            </div>

            <p>
              Our supply chain is anchored by a 20-year-old, 1,000-square-meter HVAC wholesale center in Ningbo, China. This foundation enables us to offer:
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-border p-5">
                <h5 className="mb-2 font-bold text-navy">True In-Stock Inventory</h5>
                <p className="text-sm text-gray-600">Massive stock, ready to ship — what you see is what we have.</p>
              </div>
              <div className="rounded-lg border border-gray-border p-5">
                <h5 className="mb-2 font-bold text-navy">Flexible Sourcing</h5>
                <p className="text-sm text-gray-600">Low MOQs and mixed-container loading to minimize inventory risk.</p>
              </div>
              <div className="rounded-lg border border-gray-border p-5">
                <h5 className="mb-2 font-bold text-navy">Professional Support</h5>
                <p className="text-sm text-gray-600">Two decades of experience mean clear, responsive dialogue you can trust.</p>
              </div>
            </div>

            <div className="rounded-lg bg-navy p-6 text-center">
              <p className="text-lg font-semibold text-white">
                Our core belief: Your success is what drives us forward.
              </p>
              <p className="mt-3 text-sm text-white/80">
                We are convinced that only by helping our clients earn greater profits and secure a stronger market position can we grow steadily into the future.
              </p>
            </div>

            <p className="text-center font-medium text-gray-700">
              Choose HVACR NET — and gain not just a supplier, but a long-term dedicated teammate committed to winning your market together.
            </p>
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
