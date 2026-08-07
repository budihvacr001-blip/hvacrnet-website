export default function About() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-sm font-semibold uppercase tracking-widest text-accent">HVACR NET</h1>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Your Professional Sourcing Partner</h2>
        </div>
      </section>

      {/* Company Story */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
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
    </div>
  )
}
