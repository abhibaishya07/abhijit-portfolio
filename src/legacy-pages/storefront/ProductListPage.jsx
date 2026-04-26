import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/storefront/ProductCard';
import { getProducts } from '../../api/productApi';
import Spinner from '../../components/ui/Spinner';

const CATEGORIES = ['All', 'Lips', 'Eyes', 'Face', 'Skincare', 'Hair Care', 'Fragrance', 'Nails', 'Tools'];

/* ─── Sort options ─────────────────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: 'relevance',     label: 'Relevance' },
  { value: 'newest',        label: 'Newest Arrivals' },
  { value: 'price_asc',     label: 'Price: Low to High' },
  { value: 'price_desc',    label: 'Price: High to Low' },
  { value: 'best_sellers',  label: 'Best Sellers' },
  { value: 'popularity',    label: 'Popularity' },
];

function sortProducts(products, sort) {
  const list = [...products];
  switch (sort) {
    case 'price_asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return list.sort((a, b) => b.price - a.price);
    case 'newest':
      return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    case 'best_sellers':
      return list.sort((a, b) => (b.sold ?? b.salesCount ?? 0) - (a.sold ?? a.salesCount ?? 0));
    case 'popularity':
      return list.sort((a, b) => (b.views ?? b.numReviews ?? 0) - (a.views ?? a.numReviews ?? 0));
    case 'relevance':
    default:
      return list;
  }
}

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('relevance');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedCategory = searchParams.get('category') || 'All';

  const setCategory = (cat) => {
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const params = {};
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (debouncedSearch) params.search = debouncedSearch;
    
    getProducts(params).then(({ data }) => {
      if (active) setProducts(data.products);
    }).finally(() => {
      if (active) setLoading(false);
    });
    
    return () => { active = false; };
  }, [selectedCategory, debouncedSearch]);

  const sorted = sortProducts(products, sort);
  const currentLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? 'Sort By';

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] tracking-widest uppercase text-lb-mauve font-semibold mb-2">
            {selectedCategory === 'All' ? 'Full Collection' : selectedCategory}
          </p>
          <h1 className="font-display text-4xl font-medium">Shop {selectedCategory === 'All' ? 'All Products' : selectedCategory}</h1>
          <p className="text-gray-500 text-sm mt-2">{products.length} products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            {/* Search */}
            <div className="mb-6">
              <p className="text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-3 hidden lg:block">Search</p>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search products..." className="input-field text-xs w-full rounded-full lg:rounded-none px-5 py-3.5 shadow-sm lg:shadow-none" />
            </div>
            {/* Categories */}
            <div>
              <p className="text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-3 hidden lg:block">Category</p>
              
              {/* Desktop Categories */}
              <div className="hidden lg:flex flex-col space-y-1">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`w-full text-left text-sm px-3 py-2 transition-colors duration-150 rounded-md lg:rounded-none
                                ${selectedCategory === cat ? 'bg-lb-black text-white font-semibold shadow-md' : 'hover:bg-lb-blush text-gray-400 hover:text-lb-black'}`}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Mobile Categories (Horizontal Scroll) */}
              <div className="lg:hidden flex overflow-x-auto pb-4 -mx-6 px-6 gap-2 scrollbar-hide snap-x">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`flex-shrink-0 snap-start text-xs font-semibold px-5 py-2.5 rounded-full whitespace-nowrap transition-all shadow-sm
                                ${selectedCategory === cat ? 'bg-lb-rose text-white border-2 border-lb-rose' : 'bg-[#1a0a10] text-gray-300 border border-gray-800 hover:bg-[#32111b]'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid + Sort */}
          <div className="flex-1">
            {/* ── Sort Bar ── */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-400 hidden sm:block">
                {loading ? '' : `${sorted.length} result${sorted.length !== 1 ? 's' : ''}`}
              </p>
              <div className="relative ml-auto">
                <button
                  id="sort-dropdown-btn"
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center gap-2 text-sm font-medium border border-gray-200
                             px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200
                             bg-white text-lb-black hover:border-lb-mauve"
                >
                  {/* Sort icon */}
                  <svg className="w-4 h-4 text-lb-mauve" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M10 17h4" />
                  </svg>
                  <span className="hidden sm:inline text-gray-400 text-[10px] tracking-widest uppercase font-bold">Sort:</span>
                  <span className="text-sm font-semibold">{currentLabel}</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 z-20 bg-white border border-gray-100
                                    rounded-2xl shadow-2xl overflow-hidden"
                         style={{ animation: 'fadeInDown 0.15s ease' }}>
                      {SORT_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          id={`sort-${opt.value}`}
                          onClick={() => { setSort(opt.value); setDropdownOpen(false); }}
                          className={`w-full text-left px-5 py-3 text-sm transition-colors duration-150 flex items-center gap-3
                            ${sort === opt.value
                              ? 'bg-lb-blush text-lb-mauve font-semibold'
                              : 'text-gray-600 hover:bg-lb-blush hover:text-lb-black'
                            }`}
                        >
                          {sort === opt.value ? (
                            <svg className="w-3.5 h-3.5 text-lb-mauve flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="w-3.5 flex-shrink-0" />
                          )}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ── Product Grid ── */}
            {loading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : sorted.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-gray-400 mb-2">No products found</p>
                <p className="text-gray-500 text-sm">Try a different category or search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {sorted.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
