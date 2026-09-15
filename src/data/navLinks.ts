export interface NavLink {
  to: string
  label: string
}

export const navLinks: NavLink[] = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/markets-we-serve', label: 'Markets We Serve' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
]