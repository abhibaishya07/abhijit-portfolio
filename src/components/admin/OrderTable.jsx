import { useState } from 'react';
import { updateOrderStatus } from '../../api/orderApi';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Pending:    'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped:    'bg-purple-100 text-purple-800',
  Delivered:  'bg-green-100 text-green-800',
  Cancelled:  'bg-red-100 text-red-800',
};
const PAYMENT_COLORS = { paid: 'text-green-600', pending: 'text-amber-600', failed: 'text-red-600' };

export default function OrderTable({ orders, onUpdated }) {
  const [updating, setUpdating] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      onUpdated();
    } catch {
      toast.error('Failed to update status');
    } finally { setUpdating(null); }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-lb-border bg-lb-gray">
            {['Order #', 'Date', 'Customer', 'Items', 'Total', 'Payment', 'Fulfillment', 'Update Status'].map(h => (
              <th key={h} className="text-left text-[10px] tracking-widest uppercase font-semibold text-gray-500 px-4 py-3 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-lb-border">
          {orders.map(order => (
            <tr key={order._id} className="hover:bg-lb-gray/50 transition-colors">
              <td className="px-4 py-4 font-mono text-xs font-semibold text-lb-mauve">{order.orderNumber}</td>
              <td className="px-4 py-4 text-gray-500 whitespace-nowrap text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
              <td className="px-4 py-4">
                <p className="font-medium">{order.customer?.name || 'Guest User'}</p>
                <p className="text-xs text-gray-500">{order.customer?.email || 'N/A'}</p>
              </td>
              <td className="px-4 py-4 text-gray-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
              <td className="px-4 py-4 font-semibold">₹{order.total?.toLocaleString()}</td>
              <td className="px-4 py-4">
                <span className={`text-xs font-semibold capitalize ${PAYMENT_COLORS[order.payment?.status] || ''}`}>
                  {order.payment?.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded-sm ${STATUS_COLORS[order.fulfillment?.status] || ''}`}>
                  {order.fulfillment?.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <select
                  value={order.fulfillment?.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  disabled={updating === order._id}
                  className="border border-lb-border text-xs px-2 py-1.5 focus:outline-none focus:border-lb-black bg-white min-w-[120px]"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
