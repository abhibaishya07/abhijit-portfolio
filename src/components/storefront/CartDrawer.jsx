import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQty, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white text-lb-black z-50 shadow-2xl flex flex-col
                       transition-transform duration-350 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-lb-border">
          <h2 className="font-display text-xl font-medium text-lb-black">Your Bag ({items.length})</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-lb-black text-2xl leading-none">×</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 bg-lb-blush rounded-full flex items-center justify-center text-2xl">🛍️</div>
              <p className="text-gray-500 text-sm">Your bag is empty</p>
              <button onClick={onClose} className="btn-outline text-xs">Start Shopping</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item._id} className="flex gap-4 pb-5 border-b border-lb-border last:border-0">
                <img src={item.images?.[0]} alt={item.name} className="w-20 h-24 object-cover bg-lb-blush flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-lb-mauve tracking-widest uppercase font-semibold">{item.brand || 'Kivara'}</p>
                  <p className="text-sm font-medium leading-snug line-clamp-2 mt-0.5 text-lb-black">{item.name}</p>
                  <p className="text-sm font-semibold mt-1 text-lb-black">₹{(item.price * item.quantity).toLocaleString()}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-lb-border">
                      <button onClick={() => updateQty(item._id, item.quantity - 1)} className="px-3 py-1 text-sm hover:bg-lb-blush transition-colors">−</button>
                      <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQty(item._id, item.quantity + 1)} className="px-3 py-1 text-sm hover:bg-lb-blush transition-colors">+</button>
                    </div>
                    <button onClick={() => removeItem(item._id)} className="text-gray-400 hover:text-red-500 transition-colors text-xs tracking-wide">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-lb-border px-6 py-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium tracking-wide text-lb-black">Subtotal</span>
              <span className="font-semibold text-lg text-lb-black">₹{subtotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400">Taxes and shipping calculated at checkout</p>
            <button onClick={handleCheckout} className="btn-primary w-full">Proceed to Checkout</button>
            <button onClick={clearCart} className="text-xs text-gray-400 hover:text-red-500 transition-colors w-full text-center">Clear Bag</button>
          </div>
        )}
      </div>
    </>
  );
}
