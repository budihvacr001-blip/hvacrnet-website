import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Mail, Phone, MapPin, MessageCircle, CheckCircle } from 'lucide-react'

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain',
  'Netherlands', 'Belgium', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland',
  'Australia', 'New Zealand', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia',
  'South Africa', 'Nigeria', 'Egypt', 'Saudi Arabia', 'UAE', 'Qatar', 'Kuwait',
  'India', 'Pakistan', 'Bangladesh', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines',
  'Malaysia', 'Singapore', 'Japan', 'South Korea', 'Russia', 'Turkey', 'Other',
]

export default function Contact() {
  const location = useLocation()
  const prefillProduct = (location.state as any)?.productInterest || ''

  const [form, setForm] = useState({
    contactPerson: '',
    jobTitle: '',
    companyName: '',
    country: '',
    email: '',
    whatsapp: '',
    productInterest: prefillProduct,
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (prefillProduct) {
      setForm((f) => ({ ...f, productInterest: prefillProduct }))
    }
  }, [prefillProduct])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.contactPerson.trim()) errs.contactPerson = 'Required'
    if (!form.companyName.trim()) errs.companyName = 'Required'
    if (!form.country) errs.country = 'Please select a country'
    if (!form.email.trim()) errs.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email'
    if (!form.whatsapp.trim()) errs.whatsapp = 'Required'
    if (!form.message.trim()) errs.message = 'Required'
    return errs
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      setSubmitted(true)
    }
  }

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) {
      setErrors((e) => {
        const next = { ...e }
        delete next[field]
        return next
      })
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-bg px-4">
        <div className="text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold text-navy">Inquiry Sent Successfully!</h2>
          <p className="mt-3 text-gray-text">
            Thank you for your interest. Our team will review your inquiry and get back to you within 24 hours.
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setForm({
                contactPerson: '',
                jobTitle: '',
                companyName: '',
                country: '',
                email: '',
                whatsapp: '',
                productInterest: '',
                message: '',
              })
            }}
            className="mt-6 rounded-md bg-navy px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-light"
          >
            Send Another Inquiry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-bg">
      {/* Header */}
      <section className="bg-navy py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Contact Us</h1>
          <p className="mt-2 text-white/70">
            Tell us what you need — we'll respond within 24 hours
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="rounded-lg border border-gray-border bg-white p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-bold text-navy">Send an Inquiry</h2>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Contact Person */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.contactPerson}
                    onChange={(e) => handleChange('contactPerson', e.target.value)}
                    className={`w-full rounded-md border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
                      errors.contactPerson ? 'border-red-400' : 'border-gray-border'
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.contactPerson && <p className="mt-1 text-xs text-red-500">{errors.contactPerson}</p>}
                </div>

                {/* Job Title */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Job Title / Position
                  </label>
                  <input
                    type="text"
                    value={form.jobTitle}
                    onChange={(e) => handleChange('jobTitle', e.target.value)}
                    className="w-full rounded-md border border-gray-border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="e.g. Purchasing Manager"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className={`w-full rounded-md border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
                      errors.companyName ? 'border-red-400' : 'border-gray-border'
                    }`}
                    placeholder="Your company name"
                  />
                  {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
                </div>

                {/* Country */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className={`w-full rounded-md border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
                      errors.country ? 'border-red-400' : 'border-gray-border'
                    }`}
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full rounded-md border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
                      errors.email ? 'border-red-400' : 'border-gray-border'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    WhatsApp / Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    className={`w-full rounded-md border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
                      errors.whatsapp ? 'border-red-400' : 'border-gray-border'
                    }`}
                    placeholder="+1 234 567 8900"
                  />
                  {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp}</p>}
                </div>
              </div>

              {/* Product Interest */}
              <div className="mt-5">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Product Interest
                </label>
                <input
                  type="text"
                  value={form.productInterest}
                  onChange={(e) => handleChange('productInterest', e.target.value)}
                  className="w-full rounded-md border border-gray-border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g. Copper Tubes, Solenoid Valves, Capacitors"
                />
              </div>

              {/* Message */}
              <div className="mt-5">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Message / Requirement <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className={`w-full resize-none rounded-md border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
                    errors.message ? 'border-red-400' : 'border-gray-border'
                  }`}
                  placeholder="Please describe your requirements: quantities, specifications, delivery timeline, etc."
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover sm:w-auto"
              >
                Submit Inquiry
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-border bg-white p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-bold text-navy">Get in Touch</h2>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy">Email</p>
                    <p className="text-sm text-gray-text">info@hvacrnet.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy">WhatsApp</p>
                    <p className="text-sm text-gray-text">+86 XXX XXXX XXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy">Company Address</p>
                    <p className="text-sm text-gray-text">Ningbo, Zhejiang, China</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-border pt-6">
                <p className="mb-3 text-sm font-medium text-navy">Follow Us</p>
                <div className="flex gap-3">
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5 text-navy transition-colors hover:bg-navy hover:text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5 text-navy transition-colors hover:bg-navy hover:text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5 text-navy transition-colors hover:bg-navy hover:text-white">
                    <MessageCircle className="h-5 w-5" />
                  </a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/5 text-navy transition-colors hover:bg-navy hover:text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17V11.7a4.83 4.83 0 01-3.77-1.24V6.69h3.77z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="mt-6 rounded-lg bg-navy p-6 text-center">
              <p className="text-lg font-bold text-white">20+ Years</p>
              <p className="mt-1 text-sm text-white/70">of International Trade Expertise</p>
              <p className="mt-3 text-xs text-white/50">
                Serving markets across Europe, North America, Middle East, and Southeast Asia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
