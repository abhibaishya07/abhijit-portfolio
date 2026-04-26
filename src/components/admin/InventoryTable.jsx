import { useState } from 'react';
import StockBadge from './StockBadge';
import { updateStock } from '../../api/inventoryApi';
import toast from 'react-hot-toast';

export default function InventoryTable({ inventory, onUpdated }) {
  const [editing, setEditing] = useState(null); // { id, operation, quantity }
  const [loading, setLoading] = useState(false);

  const startEdit = (id) => setEditing({ id, operation: 'set', quantity: '' });

  const submitStock = async (e) => {
    e.preventDefault();
    if (!editing.quantity && editing.quantity !== 0) return;
    setLoading(true);
    try {
      await updateStock(editing.id, { operation: editing.operation, quantity: Number(editing.quantity) });
      toast.success('Stock updated!');
      setEditing(null);
      onUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-lb-border bg-lb-gray">
            {['Product', 'Category', 'Brand', 'Price', 'Stock', 'Status', 'Action'].map(h => (
              <th key={h} className="text-left text-[10px] tracking-widest uppercase font-semibold text-gray-500 px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-lb-border">
          {inventory.map(item => (
            <tr key={item._id} className="hover:bg-lb-gray/50 transition-colors">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img src={item.images?.[0]} alt={item.name} className="w-10 h-10 object-cover bg-lb-blush flex-shrink-0" />
                  <span className="font-medium line-clamp-2 max-w-[160px]">{item.name}</span>
                </div>
              </td>
              <td className="px-4 py-4 text-gray-600">{item.category}</td>
              <td className="px-4 py-4 text-gray-600">{item.brand || '—'}</td>
              <td className="px-4 py-4 font-medium">₹{item.price?.toLocaleString()}</td>
              <td className="px-4 py-4">
                <span className={`font-bold text-base ${item.stock === 0 ? 'text-red-600' : item.stockStatus === 'low' ? 'text-amber-600' : 'text-green-700'}`}>
                  {item.stock}
                </span>
              </td>
              <td className="px-4 py-4"><StockBadge status={item.stockStatus} /></td>
              <td className="px-4 py-4">
                {editing?.id === item._id ? (
                  <form onSubmit={submitStock} className="flex items-center gap-2">
                    <select value={editing.operation} onChange={e => setEditing(ed => ({ ...ed, operation: e.target.value }))}
                      className="border border-lb-border text-xs px-2 py-1.5 focus:outline-none">
                      <option value="set">Set</option>
                      <option value="add">Add</option>
                      <option value="sub">Subtract</option>
                    </select>
                    <input type="number" min="0" required value={editing.quantity}
                      onChange={e => setEditing(ed => ({ ...ed, quantity: e.target.value }))}
                      className="w-16 border border-lb-border text-xs px-2 py-1.5 focus:outline-none focus:border-lb-black" />
                    <button type="submit" disabled={loading} className="text-xs bg-lb-black text-white px-3 py-1.5 hover:bg-lb-mauve transition-colors">✓</button>
                    <button type="button" onClick={() => setEditing(null)} className="text-xs text-gray-500 hover:text-red-500 px-2">✕</button>
                  </form>
                ) : (
                  <button onClick={() => startEdit(item._id)}
                    className="text-xs tracking-widest uppercase font-semibold text-lb-mauve hover:text-lb-black border border-lb-rose hover:border-lb-black px-3 py-1.5 transition-all duration-200">
                    Adjust
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
