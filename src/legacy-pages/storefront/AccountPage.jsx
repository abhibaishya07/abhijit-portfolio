import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { getMyOrders } from '../../api/orderApi';
import Spinner from '../../components/ui/Spinner';
import WriteReviewModal from '../../components/storefront/WriteReviewModal';

const STATUS_COLORS = {
  Pending:    'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped:    'bg-purple-100 text-purple-800',
  Delivered:  'bg-green-100 text-green-800',
  Cancelled:  'bg-red-100 text-red-800',
};

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingProduct, setReviewingProduct] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getMyOrders().then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  }, [user, navigate]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-[11px] tracking-widest uppercase text-lb-mauve font-semibold mb-2">My Account</p>
            <h1 className="font-display text-4xl font-medium">Hello, {user?.name?.split(' ')[0]} ✦</h1>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="btn-outline">Sign Out</button>
        </div>

        <section>
          <h2 className="font-display text-2xl font-medium mb-6">Order History</h2>
          {loading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-lb-gray border border-lb-border">
              <p className="font-display text-xl text-gray-500 mb-4">No orders yet</p>
              <button onClick={() => navigate('/shop')} className="btn-primary">Start Shopping</button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="bg-white border border-lb-border p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-lb-border/50">
                    <div>
                      <p className="font-mono text-sm font-semibold text-lb-mauve">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <p className="font-bold text-lg">₹{order.total?.toLocaleString()}</p>
                      <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded-sm ${STATUS_COLORS[order.fulfillment?.status] || ''}`}>
                        {order.fulfillment?.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-lb-gray px-4 py-3 border border-lb-border/50">
                        <div className="flex items-center gap-3">
                          {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 object-cover border border-lb-border" />}
                          <div>
                            <span className="text-sm font-medium text-lb-black block">{item.name}</span>
                            <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        {order.fulfillment?.status === 'Delivered' && (
                          <button 
                            onClick={() => setReviewingProduct({ id: item.product, name: item.name })}
                            className="text-[10px] tracking-widest uppercase font-bold text-lb-rose hover:text-lb-mauve transition-colors py-1 px-3 border border-lb-rose/30 hover:border-lb-mauve hover:bg-lb-blush bg-white"
                          >
                            Write a Review
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />

      {reviewingProduct && (
        <WriteReviewModal 
          product={reviewingProduct} 
          onClose={() => setReviewingProduct(null)} 
          onReviewSubmitted={() => {}}
        />
      )}
    </>
  );
}
