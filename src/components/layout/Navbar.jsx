import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartDrawer from '../storefront/CartDrawer';

const CATEGORIES = ['Lips', 'Eyes', 'Face', 'Skincare', 'Hair Care', 'Fragrance', 'Nails', 'Tools'];

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-lb-black text-white text-center py-2 px-4 text-[10px] sm:text-[11px] tracking-widest uppercase font-medium leading-tight">
        Free Shipping on Orders Above ₹999
      </div>

      <header className="bg-white text-lb-black border-b border-lb-border sticky top-0 z-40 shadow-sm">
        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 lg:h-20">
          
          {/* Mobile menu toggle (Left on mobile) */}
          <button className="md:hidden p-2 -ml-2 text-lb-black hover:text-lb-mauve transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'} />
            </svg>
          </button>

          {/* Logo (Center on mobile, Left on desktop) */}
          <Link to="/" className="font-display text-2xl sm:text-3xl font-semibold tracking-wide text-lb-black flex-1 md:flex-none text-center md:text-left">
            Kivara
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
            <Link to="/shop" className="text-xs text-lb-black tracking-widest uppercase font-bold hover:text-lb-mauve transition-colors">Shop All</Link>
            {CATEGORIES.slice(0, 5).map(c => (
              <Link key={c} to={`/shop?category=${c}`} className="text-xs text-lb-black tracking-widest uppercase font-semibold hover:text-lb-mauve transition-colors">{c}</Link>
            ))}
          </nav>

          {/* Actions (Right) */}
          <div className="flex items-center justify-end gap-3 sm:gap-6 md:flex-none">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/glowbot" className="flex items-center gap-1.5 text-xs tracking-widest uppercase font-bold text-lb-rose hover:text-lb-mauve transition-colors">
                <span className="animate-pulse">✨</span> Krystal
              </Link>
              <div className="w-px h-4 bg-lb-border hidden lg:block"></div>
              {user ? (
                <>
                  <Link to="/account" className="text-xs text-lb-black tracking-widest uppercase font-semibold hover:text-lb-mauve transition-colors">
                    {user.name.split(' ')[0]}
                  </Link>
                  <button onClick={handleLogout} className="text-xs text-lb-black tracking-widest uppercase font-semibold hover:text-lb-mauve transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-xs text-lb-black tracking-widest uppercase font-semibold hover:text-lb-mauve transition-colors">Login</Link>
                </>
              )}
            </div>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative p-1 text-lb-black hover:text-lb-mauve transition-colors" aria-label="Open cart">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-lb-mauve text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu container (Dropdown) */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-[500px] border-t border-lb-border' : 'max-h-0'}`}>
          <div className="bg-white px-6 py-6 flex flex-col gap-5">
            <Link to="/shop" className="text-xs text-lb-black tracking-widest uppercase font-bold" onClick={() => setMenuOpen(false)}>Shop Now</Link>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              {CATEGORIES.map(c => (
                <Link key={c} to={`/shop?category=${c}`} className="text-xs text-lb-black tracking-widest uppercase font-semibold" onClick={() => setMenuOpen(false)}>{c}</Link>
              ))}
            </div>

            <hr className="border-lb-border my-2" />
            
            <Link to="/glowbot" onClick={() => setMenuOpen(false)} className="text-xs tracking-widest uppercase font-bold text-lb-rose flex items-center gap-2">
              <span className="animate-pulse">✨</span> Krystal AI Consultant
            </Link>

            <hr className="border-lb-border my-2" />
            
            <div className="flex flex-col gap-5 pb-2">
              {user ? (
                <>
                  <Link to="/account" className="text-xs text-lb-black tracking-widest uppercase font-bold flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    My Account ({user.name.split(' ')[0]})
                  </Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-xs text-lb-black tracking-widest uppercase font-bold text-left flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-xs text-lb-black tracking-widest uppercase font-bold" onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="text-xs text-lb-black tracking-widest uppercase font-bold" onClick={() => setMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
