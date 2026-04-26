import { useEffect, useState } from 'react';
import { getOrders } from '../../api/orderApi';
import OrderTable from '../../components/admin/OrderTable';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const STATUS_FILTERS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getOrders();
      setOrders(data.orders);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = orders.filter(o => {
    const matchStatus = status === 'All' || o.fulfillment?.status === status;
    const matchSearch = !search || o.customer?.name?.toLowerCase().includes(search.toLowerCase())
      || o.orderNumber?.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="font-display text-3xl font-semibold mb-1">Orders</h1>
        <p className="text-gray-500 text-sm">{orders.length} total orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or order number..." className="input-field sm:max-w-xs" />
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`text-xs tracking-widest uppercase font-semibold px-3 py-2 border transition-all duration-200
                          ${status === s ? 'bg-lb-black text-white border-lb-black' : 'bg-white text-gray-600 border-lb-border hover:border-lb-mauve'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-lb-border overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">No orders found</p>
        ) : (
          <OrderTable orders={filtered} onUpdated={load} />
        )}
      </div>
    </div>
  );
}
