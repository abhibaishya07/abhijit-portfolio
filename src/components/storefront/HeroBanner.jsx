import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <section className="relative bg-lb-blush overflow-hidden min-h-[90vh] flex items-center">
      {/* Background split */}
      <div className="absolute inset-0 flex">
        <div className="w-full md:w-1/2 bg-lb-blush" />
        <div className="hidden md:block w-1/2 bg-lb-black/5" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center py-20">
        {/* Text */}
        <div className="space-y-8 animate-fadeIn">
          <div>
            <p className="text-[11px] tracking-widest uppercase font-semibold text-lb-mauve mb-4">New Collection · 2026</p>
            <h1 className="font-display text-5xl md:text-7xl font-medium text-lb-black leading-[1.1]">
              Beauty,<br />
              <em className="italic text-lb-mauve">Redefined</em>
            </h1>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md">
            Discover our curated collection of premium makeup and skincare — formulated for every complexion, crafted for every occasion.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop" className="btn-primary">Explore Collection</Link>
            <Link to="/shop?category=Skincare" className="btn-outline">Shop Skincare</Link>
          </div>
          <div className="flex gap-8 pt-4 border-t border-lb-rose/30">
            {[['500+', 'Products'], ['4.9★', 'Rating'], ['Free', 'Shipping ₹999+']].map(([val, label]) => (
              <div key={label}>
                <p className="font-display text-2xl font-semibold text-lb-black">{val}</p>
                <p className="text-xs text-gray-500 tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero image grid */}
        <div className="hidden md:grid grid-cols-2 gap-3 h-[600px]">
          <div className="space-y-3">
            <div className="h-2/3 overflow-hidden">
              <img src="/images/lipstick.png"
                alt="Lipstick" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="h-1/3 overflow-hidden bg-lb-black">
              <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80"
                alt="Palette" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
          <div className="space-y-3 pt-8">
            <div className="h-1/3 overflow-hidden">
              <img src="/images/highlighter.png"
                alt="Highlighter" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="h-2/3 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=600&q=80"
                alt="Skincare" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-lb-mauve animate-bounce">
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </section>
  );
}
