import { useEffect, useState } from 'react';
import { getInventory } from '../../api/inventoryApi';
import InventoryTable from '../../components/admin/InventoryTable';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getInventory();
      setInventory(data.inventory);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = inventory.filter(i => filter === 'all' ? true : i.stockStatus === filter);

  const counts = {
    all:           inventory.length,
    'in-stock':    inventory.filter(i => i.stockStatus === 'in-stock').length,
    low:           inventory.filter(i => i.stockStatus === 'low').length,
    'out-of-stock':inventory.filter(i => i.stockStatus === 'out-of-stock').length,
  };

  const FILTERS = [
    { key: 'all',          label: 'All',          color: 'text-gray-700' },
    { key: 'in-stock',     label: 'In Stock',     color: 'text-green-700' },
    { key: 'low',          label: 'Low Stock',     color: 'text-amber-700' },
    { key: 'out-of-stock', label: 'Out of Stock',  color: 'text-red-700' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="font-display text-3xl font-semibold mb-1">Inventory</h1>
        <p className="text-gray-500 text-sm">Real-time stock levels across all products</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FILTERS.map(({ key, label, color }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`bg-white border p-5 text-left transition-all duration-200 hover:shadow-md
                        ${filter === key ? 'border-lb-black shadow-md' : 'border-lb-border'}`}>
            <p className={`text-2xl font-bold font-display ${color}`}>{counts[key]}</p>
            <p className="text-xs tracking-widest uppercase text-gray-500 mt-1">{label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white border border-lb-border overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">No items in this category</p>
        ) : (
          <InventoryTable inventory={filtered} onUpdated={load} />
        )}
      </div>
    </div>
  );
}
