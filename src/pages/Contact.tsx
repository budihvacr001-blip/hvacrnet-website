import { useState, useEffect } from 'react'
import {
  Mail,
  MessageCircle,
  MapPin,
  X,
  ArrowRight,
} from 'lucide-react'
import SEO from '../components/SEO'

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05 6.33 6.33 0 0 0 1.9 12.75 6.34 6.34 0 0 0 6.33-6.33v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

const WEB3FORMS_KEY = 'b6cec139-6ea9-4c1c-ad3a-f7bf908421a8'

const INITIAL_FORM = {
  contactPerson: '', // Contact Person
  jobTitle: '', // Job Title / Position
  companyName: '', // Company Name
  country: '',
  email: '',
  phone: '', // WhatsApp / Phone
  productInterest: '',
  message: '',
}

const COUNTRIES = [
  'United States',
  'Canada',
  'Mexico',
  'Brazil',
  'United Kingdom',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Poland',
  'Russia',
  'Turkey',
  'UAE',
  'Saudi Arabia',
  'Egypt',
  'India',
  'Pakistan',
  'Bangladesh',
  'Indonesia',
  'Malaysia',
  'Thailand',
  'Vietnam',
  'Philippines',
  'Singapore',
  'Australia',
  'New Zealand',
  'South Africa',
  'China',
  'Japan',
  'South Korea',
  'Others',
]

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'success' | 'error' | null>(null)
  const [qrOpen, setQrOpen] = useState(false)

  useEffect(() => {
    if (qrOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [qrOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQrOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const update = (field: keyof typeof INITIAL_FORM, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.contactPerson.trim()) e.contactPerson = 'Please enter your contact name.'
    if (!form.companyName.trim()) e.companyName = 'Please enter your company name.'
    if (!form.country) e.country = 'Please select your country.'
    if (!form.email.trim()) e.email = 'Please enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address.'
    if (!form.phone.trim()) e.phone = 'Please enter your WhatsApp / phone number.'
    if (!form.message.trim()) e.message = 'Please describe your requirement.'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    try {
      const payload = {
        access_key: WEB3FORMS_KEY,
        subject: 'New Inquiry from HVACR NET Website',
        from_name: 'HVACR NET Contact Form',
        'Contact Person': form.contactPerson,
        'Job Title / Position': form.jobTitle,
        'Company Name': form.companyName,
        'Country': form.country,
        'Email': form.email,
        'WhatsApp / Phone': form.phone,
        'Product Interest': form.productInterest,
        'Message / Requirement': form.message,
      }
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setForm(INITIAL_FORM)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#e8722a] focus:ring-2 focus:ring-[#e8722a]/20'
  const labelClass = 'mb-1.5 block text-sm font-medium text-[#1a3a5c]'

  const contactItems = [
    {
      icon: <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />,
      label: 'Email',
      body: (
        <a
          href="mailto:info@hvacrnet.com"
          className="text-gray-700 break-all transition hover:text-[#e8722a]"
        >
          info@hvacrnet.com
        </a>
      ),
    },
    {
      icon: <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />,
      label: 'WeChat',
      body: (
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-gray-700">Echo (HVACR_net)</span>
          <button
            type="button"
            onClick={() => setQrOpen(true)}
            className="group relative h-14 w-full overflow-hidden rounded-lg border border-gray-200 bg-white sm:h-14 sm:w-14 sm:shrink-0 sm:-mt-4"
            aria-label="View WeChat QR code"
          >
            <img
              src="images/wechat-qr.jpg"
              alt="WeChat QR Code"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[3] group-hover:shadow-xl"
            />
          </button>
        </div>
      ),
    },
    {
      icon: <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />,
      label: 'WhatsApp',
      body: (
        <a
          href="https://wa.me/8618018696001"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 transition hover:text-[#e8722a]"
        >
          +86 180 1869 6001
        </a>
      ),
    },
    {
      icon: <MapPin className="h-5 w-5 shrink-0" aria-hidden="true" />,
      label: 'Company Address',
      body: <span className="text-gray-700">Ningbo, Zhejiang, China</span>,
    },
  ]

  return (
    <>
      <SEO
        title="Contact Us | HVACR NET — Global HVAC/R Parts Supplier"
        description="Contact HVACR NET for HVAC/R parts request — response within 24 hours. Copper tubes, valves, filter driers, thermostatic expansion valves and more from China."
        ogType="website"
      />
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-[#1a3a5c] sm:text-4xl">Contact Us</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Tell us what you need — we&apos;ll respond within 24 hours
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Left: inquiry form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="mb-8 text-2xl font-semibold text-[#1a3a5c]">Send an Inquiry</h2>

            {status === 'success' && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              >
                <span>
                  Thank you! Your inquiry has been sent. We will respond within 24 hours.
                </span>
              </div>
            )}
            {status === 'error' && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                Something went wrong while sending your inquiry. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
              <input type="hidden" name="subject" value="New Inquiry from HVACR NET Website" />
              <input type="hidden" name="from_name" value="HVACR NET Contact Form" />

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="contactPerson" className={labelClass}>
                    Contact Person <span className="text-[#e8722a]">*</span>
                  </label>
                  <input
                    id="contactPerson"
                    type="text"
                    value={form.contactPerson}
                    onChange={(e) => update('contactPerson', e.target.value)}
                    placeholder="Your full name"
                    className={fieldClass}
                  />
                  {errors.contactPerson && <p className="mt-1 text-xs text-red-600">{errors.contactPerson}</p>}
                </div>
                <div>
                  <label htmlFor="jobTitle" className={labelClass}>
                    Job Title / Position
                  </label>
                  <input
                    id="jobTitle"
                    type="text"
                    value={form.jobTitle}
                    onChange={(e) => update('jobTitle', e.target.value)}
                    placeholder="e.g. Purchasing Manager"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="companyName" className={labelClass}>
                    Company Name <span className="text-[#e8722a]">*</span>
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={form.companyName}
                    onChange={(e) => update('companyName', e.target.value)}
                    placeholder="Your company name"
                    className={fieldClass}
                  />
                  {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>}
                </div>
                <div>
                  <label htmlFor="country" className={labelClass}>
                    Country <span className="text-[#e8722a]">*</span>
                  </label>
                  <select
                    id="country"
                    value={form.country}
                    onChange={(e) => update('country', e.target.value)}
                    className={fieldClass}
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email <span className="text-[#e8722a]">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="your@email.com"
                    className={fieldClass}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    WhatsApp / Phone <span className="text-[#e8722a]">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="+1 234 567 8900"
                    className={fieldClass}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="productInterest" className={labelClass}>
                  Product Interest
                </label>
                <input
                  id="productInterest"
                  type="text"
                  value={form.productInterest}
                  onChange={(e) => update('productInterest', e.target.value)}
                  placeholder="e.g. Copper Tubes, Solenoid Valves"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>
                  Message / Requirement <span className="text-[#e8722a]">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  placeholder="Please describe your requirements, quantity, destination, etc. We will contact you within 24 hours."
                  className={`${fieldClass} resize-y`}
                />
                {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#e8722a] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#cf5f1e] focus:outline-none focus:ring-2 focus:ring-[#e8722a]/40 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {submitting ? 'Sending...' : 'Submit Inquiry'}
                {!submitting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </button>
            </form>
          </div>

          {/* Right: sidebar */}
          <aside className="space-y-6 self-start">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#1a3a5c]">
                Get in Touch
              </h2>
              <div className="divide-y divide-gray-200">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1a3a5c]/5 text-[#1a3a5c]">
                      {item.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#1a3a5c]">{item.label}</p>
                      <div className="mt-1 w-full">{item.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#1a3a5c]">
                Follow Us
              </h2>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/hvacr_net"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  title="Instagram"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-[#1a3a5c] transition hover:border-[#1a3a5c] hover:bg-[#1a3a5c] hover:text-white"
                >
                  <InstagramIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-[#1a3a5c] px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100">
                    Instagram
                  </span>
                </a>
                <a
                  href="https://www.tiktok.com/@kongheng66"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on TikTok"
                  title="TikTok"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-[#1a3a5c] transition hover:border-[#1a3a5c] hover:bg-[#1a3a5c] hover:text-white"
                >
                  <TikTokIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-[#1a3a5c] px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100">
                    TikTok
                  </span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-[#1a3a5c] p-6 text-white shadow-sm">
              <p className="text-4xl font-extrabold">20+</p>
              <p className="mt-2 text-sm text-white/90">
                Years of International Trade Expertise
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* WeChat QR modal */}
      {qrOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setQrOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="WeChat QR code"
        >
          <button
            type="button"
            onClick={() => setQrOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close QR code"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <img
              src="images/wechat-qr.jpg"
              alt="WeChat QR Code"
              className="aspect-square w-full rounded-xl bg-white object-contain p-2"
            />
            <p className="mt-4 text-center text-sm text-white/80">
              Scan the QR code to add us on WeChat
            </p>
          </div>
        </div>
      )}
    </>
  )
}