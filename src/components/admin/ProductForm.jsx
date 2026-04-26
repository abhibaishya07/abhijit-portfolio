import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createProduct, updateProduct } from '../../api/productApi';
import Spinner from '../ui/Spinner';

const CATEGORIES = ['Lips', 'Eyes', 'Face', 'Skincare', 'Fragrance', 'Nails', 'Tools'];
const EMPTY = { name: '', description: '', price: '', comparePrice: '', images: '', category: 'Lips', brand: '', stock: '', lowStockThreshold: '10', isFeatured: false };

export default function ProductForm({ product, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        images:        (product.images || []).join(', '),
        price:         product.price || '',
        comparePrice:  product.comparePrice || '',
        stock:         product.stock ?? '',
        lowStockThreshold: product.lowStockThreshold ?? 10,
      });
    } else {
      setForm(EMPTY);
    }
  }, [product]);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price:            Number(form.price),
        comparePrice:     form.comparePrice ? Number(form.comparePrice) : undefined,
        stock:            Number(form.stock),
        lowStockThreshold:Number(form.lowStockThreshold),
        images:           form.images.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (isEdit) await updateProduct(product._id, payload);
      else        await createProduct(payload);
      toast.success(isEdit ? 'Product updated!' : 'Product created!');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const Field = ({ label, name, type = 'text', ...rest }) => (
    <div>
      <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">{label}</label>
      <input name={name} type={type} value={form[name]} onChange={handle} className="input-field" {...rest} />
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Product Name *" name="name" required placeholder="e.g. Velvet Matte Lip Color" />

      <div>
        <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">Description *</label>
        <textarea name="description" value={form.description} onChange={handle} required rows={3}
          className="input-field resize-none" placeholder="Describe the product..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (₹) *" name="price" type="number" required min="0" step="0.01" />
        <Field label="Compare Price (₹)" name="comparePrice" type="number" min="0" step="0.01" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">Category *</label>
          <select name="category" value={form.category} onChange={handle} className="input-field" required>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <Field label="Brand" name="brand" placeholder="e.g. Kivara" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Stock Qty *" name="stock" type="number" required min="0" />
        <Field label="Low Stock Alert At" name="lowStockThreshold" type="number" min="0" />
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">Image URLs (comma-separated)</label>
        <textarea name="images" value={form.images} onChange={handle} rows={2}
          className="input-field resize-none text-xs" placeholder="https://img1.com, https://img2.com" />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handle} className="w-4 h-4 accent-lb-mauve" />
        <span className="text-sm font-medium">Feature on Homepage</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? <Spinner size="sm" light /> : isEdit ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
      </div>
    </form>
  );
}
