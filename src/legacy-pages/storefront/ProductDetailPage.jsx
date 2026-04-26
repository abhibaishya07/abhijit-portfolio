import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { getProductBySlug, getProductReviews } from '../../api/productApi';
import { useCart } from '../../context/CartContext';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <svg key={star} className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-lb-rose' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    getProductBySlug(slug).then(({ data }) => {
      setProduct(data.product);
      return getProductReviews(data.product._id);
    }).then(({ data }) => setReviews(data.reviews)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <><Navbar /><div className="flex justify-center py-32"><Spinner size="lg" /></div></>;
  if (!product) return <><Navbar /><div className="text-center py-32"><p className="font-display text-2xl">Product not found</p><Link to="/shop" className="btn-primary mt-6 inline-block">Back to Shop</Link></div></>;

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(`${product.name} (×${qty}) added to cart`, {
      style: { background: '#FF1493', color: '#fff', borderRadius: '0', fontSize: '13px' },
    });
  };

  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : null;

  return (
    <>
      <Navbar />
      <main className="bg-white text-lb-black max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-lb-black transition-colors text-gray-500">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/shop" className="hover:text-lb-black transition-colors text-gray-500">Shop</Link>
          <span className="text-gray-400">/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-lb-black transition-colors text-gray-500">{product.category}</Link>
          <span className="text-gray-400">/</span>
          <span className="text-lb-black font-medium">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-lb-blush overflow-hidden">
              <img src={product.images?.[imgIdx] || product.images?.[0]} alt={product.name}
                className="w-full h-full object-cover" />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-16 h-16 overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-lb-black' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-[11px] tracking-widest uppercase text-lb-mauve font-semibold mb-2">{product.brand || 'Kivara'}</p>
              <h1 className="font-display text-3xl md:text-4xl font-medium leading-tight mb-3">{product.name}</h1>
              
              {/* Product Rating */}
              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={product.rating || 0} />
                <span className="text-sm text-gray-500 font-medium">{product.rating || '0.0'} / 5</span>
                <span className="text-sm text-lb-mauve hover:text-lb-rose transition-colors">({product.numReviews || 0} reviews)</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">₹{product.price.toLocaleString()}</span>
                {product.comparePrice && <span className="text-lg text-gray-400 line-through">₹{product.comparePrice.toLocaleString()}</span>}
                {discount && <span className="badge-blush">{discount}% off</span>}
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-lb-black/80">{product.description}</p>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map(t => <span key={t} className="text-[10px] tracking-widest uppercase border border-lb-border px-3 py-1 text-gray-500">{t}</span>)}
              </div>
            )}

            {/* Stock */}
            <div className="border-t border-lb-border pt-6">
              {product.stock === 0 ? (
                <p className="text-red-500 text-sm font-semibold tracking-widest uppercase mb-4">Out of Stock</p>
              ) : (
                <>
                  {product.stock < 10 && (
                    <p className="text-amber-600 text-xs font-semibold tracking-widest uppercase mb-4">
                      ⚠ Only {product.stock} left in stock!
                    </p>
                  )}
                  <div className="flex items-center gap-4 mb-4">
                    <label className="text-xs tracking-widest uppercase font-semibold">Qty</label>
                    <div className="flex items-center border border-lb-border">
                      <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-lb-blush transition-colors">−</button>
                      <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{qty}</span>
                      <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-4 py-2 hover:bg-lb-blush transition-colors">+</button>
                    </div>
                  </div>
                  <button onClick={handleAdd} className="btn-primary w-full text-center">Add to Bag</button>
                </>
              )}
            </div>

            {/* Meta */}
            <div className="border-t border-lb-border pt-6 space-y-2 text-sm text-gray-500">
              <p><span className="font-medium text-lb-black">Category:</span> {product.category}</p>
              {product.brand && <p><span className="font-medium text-lb-black">Brand:</span> {product.brand}</p>}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 max-w-4xl mx-auto border-t border-lb-border pt-16 bg-white text-lb-black">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display text-3xl font-medium mb-2 text-lb-black">Customer Reviews</h2>
              <div className="flex items-center gap-3">
                <StarRating rating={product.rating || 0} />
                <p className="text-gray-500 text-sm">Based on {product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'}</p>
              </div>
            </div>
            <Link to="/account" className="btn-outline">
              Review a past purchase
            </Link>
          </div>

          <div className="space-y-8">
            {reviews.length === 0 ? (
              <div className="bg-lb-blush p-8 text-center text-gray-600 border border-lb-border">
                Be the first to share your thoughts on this product!
              </div>
            ) : (
              reviews.map(review => (
                <div key={review._id} className="border-b border-lb-border pb-8">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lb-rose to-lb-mauve flex items-center justify-center text-white font-bold text-sm">
                        {review.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-lb-black">{review.customerName}</p>
                        <p className="text-[10px] text-gray-400 font-mono tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap ml-13 text-lb-black/80">
                    {review.reviewText}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
