import SEO from '../components/SEO'

const markets = [
  {
    name: 'Middle East & North Africa',
    content: [
      'The Middle East is one of the world\'s largest HVAC/R aftermarket regions, driven by extreme temperatures that create year-round demand for air conditioning and refrigeration. From the wholesale trading hub of Dubai\'s Deira district to contractors and facility managers across Saudi Arabia, Egypt, and the GCC, we supply copper tubes, fittings, compressors, valves, capacitors, filter driers, and service tools for installation, maintenance, and repair work.',
      'As an HVAC spare parts supplier serving the UAE and broader Middle East, we understand the region\'s need for durable products that perform in high-ambient conditions. We work with importers and wholesalers to consolidate mixed orders — combining multiple product categories into efficient shipments through Jebel Ali Port and other major regional hubs.',
    ],
    keyMarkets: 'United Arab Emirates, Saudi Arabia, Egypt, Kuwait, Qatar, Oman, Bahrain, Jordan, Iraq',
  },
  {
    name: 'Sub-Saharan Africa',
    content: [
      'Africa\'s rapidly growing urban population and expanding cold chain infrastructure are driving rising demand for affordable, dependable HVAC and refrigeration components. We serve AC parts wholesalers and refrigeration spare parts importers across Nigeria, Ghana, Kenya, Tanzania, Ethiopia, and beyond.',
      'Our low-MOQ model is especially well-suited to African markets, where buyers often need to mix multiple product categories in a single container rather than commit to large volumes of one item. From copper tubing and filter driers to capacitors and service tools, we help distributors build a broad inventory without overstocking.',
    ],
    keyMarkets: 'Nigeria, Ghana, Kenya, Tanzania, Ethiopia, South Africa, Uganda',
  },
  {
    name: 'Southeast Asia',
    content: [
      'Southeast Asia\'s tropical climate and booming construction sector generate sustained demand for air conditioning and commercial refrigeration. We supply refrigeration components and HVAC spare parts to distributors and contractors in Vietnam, Indonesia, Thailand, the Philippines, and Malaysia.',
      'Our Ningbo location offers short lead times to Southeast Asian ports, and our flexible ordering model supports both project-based procurement and ongoing aftermarket supply. Whether you need a small trial order or recurring container shipments, we adapt to your business.',
    ],
    keyMarkets: 'Vietnam, Indonesia, Thailand, Philippines, Malaysia, Myanmar',
  },
  {
    name: 'Europe',
    content: [
      'European HVAC/R markets are shaped by strict energy efficiency standards, the transition to low-GWP refrigerants, and rapid growth in heat pump installations. We supply replacement parts and components that meet European quality expectations, including copper tubes manufactured to EN 12735 standards and CE-compliant electrical components.',
      'For distributors serving HVAC installers and refrigeration service companies across Germany, the UK, France, Italy, Spain, and Eastern Europe, we offer reliable sourcing from China\'s manufacturing base with the documentation, communication, and quality consistency that European buyers require.',
    ],
    keyMarkets: 'Germany, United Kingdom, France, Italy, Spain, Poland, Netherlands, Romania',
  },
  {
    name: 'North America',
    content: [
      'The North American HVAC/R aftermarket is among the largest in the world, with millions of installed systems requiring ongoing maintenance and replacement parts. We supply copper tubes meeting ASTM B280 standards, refrigeration components, and service tools to distributors and service companies across the United States and Canada.',
      'Our product range covers both residential and commercial refrigeration applications, and we understand the documentation, packaging, and quality consistency expectations of North American buyers. With two decades of experience in US and European trade, our team communicates clearly and ships reliably.',
    ],
    keyMarkets: 'United States, Canada',
  },
  {
    name: 'South Asia',
    content: [
      'South Asia\'s growing middle class and infrastructure investment are fueling demand for air conditioning and cold chain development. We supply HVAC/R spare parts to importers and distributors in Pakistan, Bangladesh, and Sri Lanka, with competitive pricing and flexible order quantities suited to price-sensitive markets.',
    ],
    keyMarkets: 'Pakistan, Bangladesh, Sri Lanka',
  },
]

const advantages = [
  {
    title: 'One-Stop Sourcing',
    desc: 'Copper tubes, fittings, compressors, valves, filters, capacitors, gauges, tools, and accessories under one roof. Reduce the complexity of managing multiple suppliers.',
  },
  {
    title: 'Flexible MOQ',
    desc: 'Order from 1 piece. Whether you need a sample, a small restock, or a full container, we adapt to your requirements.',
  },
  {
    title: 'Ningbo Location',
    desc: 'Based in the heart of China\'s densest HVAC/R manufacturing cluster, with direct access to Ningbo Port for fast, cost-effective shipping worldwide.',
  },
  {
    title: 'Quality-Focused',
    desc: 'Products sourced from established manufacturers with quality control processes. We stand behind every shipment.',
  },
  {
    title: 'Experienced Team',
    desc: 'Our founding team brings two decades of international trade experience, ensuring clear communication, accurate documentation, and reliable order fulfillment.',
  },
]

export default function Markets() {
  return (
    <>
      <SEO
        title="Markets We Serve | HVAC/R Spare Parts Supplier Worldwide | HVACR NET"
        description="HVACR NET supplies HVAC and refrigeration spare parts across the Middle East, Africa, Southeast Asia, Europe, and North America. One-stop sourcing from Ningbo with flexible MOQ and global shipping."
      />
      <div>
        {/* Page Header */}
        <section className="bg-navy py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-sm font-semibold uppercase tracking-widest text-accent">Global Reach</h1>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Markets We Serve</h2>
          </div>
        </section>

        {/* Intro */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <p className="text-base leading-relaxed text-gray-700">
              Ningbo HVACR Net supplies HVAC and refrigeration spare parts to contractors, wholesalers, distributors, and service companies around the world. Based in Ningbo — home to one of China's largest HVAC/R manufacturing clusters — we offer one-stop sourcing across multiple product categories with flexible MOQ and direct access to Ningbo Port for cost-effective global shipping.
            </p>
          </div>
        </section>

        {/* Markets */}
        <section className="bg-gray-bg py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="space-y-10">
              {markets.map((market) => (
                <div key={market.name} className="rounded-lg border border-gray-border bg-white p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-navy">{market.name}</h3>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-700">
                    {market.content.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                  <div className="mt-4 rounded-md bg-gray-bg p-4">
                    <span className="text-sm font-semibold text-navy">Key markets: </span>
                    <span className="text-sm text-gray-600">{market.keyMarkets}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Buy From HVACR NET */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-navy">Why Buy From HVACR NET</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {advantages.map((adv) => (
                <div key={adv.title} className="rounded-lg border border-gray-border p-6">
                  <h4 className="text-lg font-bold text-navy">{adv.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{adv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
