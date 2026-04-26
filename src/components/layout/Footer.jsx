import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-lb-black text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <h2 className="font-display text-2xl font-semibold mb-4">Kivara</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Curated luxury beauty. Science-backed skincare. Delivered to your door.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3 mt-5">
            <a
              href="https://www.instagram.com/kivara.beauty_?igsh=eWR4bnpzOGx3a2o1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-lb-rose hover:text-lb-rose transition-colors"
            >
              {/* Instagram icon */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="mailto:beautykivara@gmail.com"
              aria-label="Email us"
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-lb-rose hover:text-lb-rose transition-colors"
            >
              {/* Mail icon */}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-xs tracking-widest uppercase font-semibold mb-4 text-lb-rose">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {['Lips','Eyes','Face','Skincare','Fragrance','Nails'].map(c => (
              <li key={c}><Link to={`/shop?category=${c}`} className="hover:text-white transition-colors">{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-widest uppercase font-semibold mb-4 text-lb-rose">Help</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
            <li><Link to="/policies#shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
            <li><Link to="/policies#returns" className="hover:text-white transition-colors">Return Policy</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-widest uppercase font-semibold mb-4 text-lb-rose">Newsletter</h4>
          <p className="text-gray-400 text-sm mb-4">Get first access to new launches and exclusive offers.</p>
          <form className="flex">
            <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-lb-rose" />
            <button className="bg-lb-rose px-4 py-2 text-white text-xs tracking-widest hover:bg-lb-mauve transition-colors">→</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500 tracking-wide">
        © {new Date().getFullYear()} Kivara Beauty. All rights reserved. | Crafted with love in India 🇮🇳
      </div>
    </footer>
  );
}

