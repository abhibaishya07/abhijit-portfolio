import { useEffect, useState } from 'react';
import { getAllProductsAdmin, deleteProduct } from '../../api/productApi';
import Modal from '../../components/ui/Modal';
import ProductForm from '../../components/admin/ProductForm';
import StockBadge from '../../components/admin/StockBadge';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getAllProductsAdmin();
      setProducts(data.products);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (p) => { setEditProduct(p); setModalOpen(true); };
  const handleAdd = () => { setEditProduct(null); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setEditProduct(null); };
  const handleSaved = () => { handleClose(); load(); };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product removed');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-1">Products</h1>
          <p className="text-gray-500 text-sm">{products.length} total products</p>
        </div>
        <button onClick={handleAdd} className="btn-primary whitespace-nowrap">+ Add Product</button>
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search products..." className="input-field max-w-sm" />

      {/* Table */}
      <div className="bg-white border border-lb-border overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-lb-border bg-lb-gray">
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Active', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[10px] tracking-widest uppercase font-semibold text-gray-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-lb-border">
                {filtered.map(p => (
                  <tr key={p._id} className="hover:bg-lb-gray/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 object-cover bg-lb-blush flex-shrink-0" />
                        <div>
                          <p className="font-medium line-clamp-1 max-w-[180px]">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{p.category}</td>
                    <td className="px-4 py-4 font-semibold">₹{p.price.toLocaleString()}</td>
                    <td className="px-4 py-4 font-medium">{p.stock}</td>
                    <td className="px-4 py-4">
                      <StockBadge status={p.stock === 0 ? 'out-of-stock' : p.stock <= p.lowStockThreshold ? 'low' : 'in-stock'} />
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold ${p.isActive ? 'text-green-600' : 'text-red-500'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(p)}
                          className="text-xs tracking-wide font-semibold text-lb-mauve hover:text-lb-black transition-colors px-3 py-1.5 border border-lb-rose hover:border-lb-black">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(p._id, p.name)}
                          className="text-xs tracking-wide font-semibold text-gray-400 hover:text-red-600 transition-colors px-3 py-1.5 border border-gray-200 hover:border-red-300">
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 py-12 text-sm">No products found</p>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={handleClose} title={editProduct ? 'Edit Product' : 'Add New Product'} size="md">
        <ProductForm product={editProduct} onClose={handleClose} onSaved={handleSaved} />
      </Modal>
    </div>
  );
}
