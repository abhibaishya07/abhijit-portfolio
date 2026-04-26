import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../api/orderApi';
import { getAllProductsAdmin } from '../../api/productApi';
import { getInventory } from '../../api/inventoryApi';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ordRes, prodRes, invRes] = await Promise.all([getOrders(), getAllProductsAdmin(), getInventory()]);
        const orders = ordRes.data.orders;
        const products = prodRes.data.products;
        const inventory = invRes.data.inventory;
        const revenue = orders.filter(o => o.payment?.status === 'paid').reduce((s, o) => s + o.total, 0);
        const lowStock = inventory.filter(i => i.stockStatus === 'low' || i.stockStatus === 'out-of-stock').length;
        setStats({ orders: orders.length, products: products.length, revenue, lowStock });
        setRecent(orders.slice(0, 5));
      } catch (err) {
        toast.error('Dashboard Error: ' + (err.response?.data?.message || err.message));
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const CARDS = stats ? [
    { label: 'Total Orders',    value: stats.orders,                   icon: '◎', color: 'bg-purple-50 text-purple-700', link: '/admin/orders' },
    { label: 'Revenue (Paid)',  value: `₹${stats.revenue.toLocaleString()}`, icon: '◈', color: 'bg-green-50 text-green-700',  link: '/admin/orders' },
    { label: 'Products',        value: stats.products,                 icon: '▦', color: 'bg-blue-50 text-blue-700',   link: '/admin/products' },
    { label: 'Low / Out Stock', value: stats.lowStock,                 icon: '⚠', color: stats.lowStock > 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700', link: '/admin/inventory' },
  ] : [];

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="font-display text-3xl font-semibold mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {CARDS.map(({ label, value, icon, color, link }) => (
          <Link key={label} to={link} className="bg-white border border-lb-border p-6 hover:shadow-lg transition-shadow duration-300 group">
            <div className={`inline-flex w-10 h-10 rounded-sm items-center justify-center text-xl mb-4 ${color}`}>{icon}</div>
            <p className="text-2xl font-bold font-display">{value}</p>
            <p className="text-xs text-gray-500 tracking-widest uppercase mt-1 group-hover:text-lb-mauve transition-colors">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-lb-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-lb-border">
          <h2 className="font-display text-lg font-medium">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs tracking-widest uppercase font-semibold text-lb-mauve hover:text-lb-black transition-colors">View All →</Link>
        </div>
        <div className="divide-y divide-lb-border">
          {recent.length === 0 ? (
            <p className="px-6 py-8 text-gray-400 text-sm text-center">No orders yet</p>
          ) : recent.map(o => (
            <div key={o._id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-lb-mauve font-semibold">{o.orderNumber}</p>
                <p className="text-sm font-medium">{o.customer?.name || 'Guest User'}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{o.total?.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{o.fulfillment?.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
