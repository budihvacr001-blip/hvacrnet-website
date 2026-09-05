import { HelmetProvider } from 'react-helmet-async'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import Markets from './pages/Markets'

export default function App() {
  return (
    <HelmetProvider>
      <div className="flex min-h-screen flex-col">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:categorySlug" element={<Products />} />
            <Route path="/products/:categorySlug/:subCategorySlug" element={<Products />} />
            <Route path="/products/:categorySlug/:subCategorySlug/:thirdCategorySlug" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/markets-we-serve" element={<Markets />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  )
}
