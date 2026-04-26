import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart`, {
      style: { background: '#FF1493', color: '#fff', borderRadius: '0', fontSize: '13px' },
    });
  };

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="lb-card overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-lb-blush">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discount && (
            <span className="absolute top-3 left-3 bg-lb-black text-white text-[10px] font-bold tracking-widest px-2 py-1">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-xs tracking-widest uppercase font-semibold text-lb-mauve">Out of Stock</span>
            </div>
          )}
          {product.stock > 0 && (
            <button
              onClick={handleAdd}
              className="absolute bottom-0 left-0 right-0 bg-lb-black text-white text-xs tracking-widest uppercase font-semibold py-3
                         translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-lb-mauve"
            >
              Add to Cart
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[10px] text-lb-mauve tracking-widest uppercase font-semibold mb-1">{product.brand || 'Kivara'}</p>
          <h3 className="text-sm font-medium text-lb-black leading-snug line-clamp-2 mb-2">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lb-black">₹{product.price.toLocaleString()}</span>
            {product.comparePrice && (
              <span className="text-xs text-gray-400 line-through">₹{product.comparePrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
