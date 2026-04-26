import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '▦', end: true },
  { to: '/admin/products', label: 'Products', icon: '◈' },
  { to: '/admin/inventory', label: 'Inventory', icon: '◉' },
  { to: '/admin/orders', label: 'Orders', icon: '◎' },
];

export default function AdminSidebar() {
  const { adminLogout, admin } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => { adminLogout(); navigate('/admin/login'); };

  return (
    <aside className="w-64 bg-lb-black min-h-screen flex flex-col fixed left-0 top-0 z-30">
      <div className="px-6 py-8 border-b border-white/10">
        <h1 className="font-display text-white text-xl font-semibold">Kivara</h1>
        <p className="text-lb-rose text-xs tracking-widest uppercase mt-1">Admin Portal</p>
      </div>

      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-lb-mauve flex items-center justify-center text-white text-sm font-bold">
            {admin?.name?.[0] || 'A'}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{admin?.name || 'Admin'}</p>
            <p className="text-gray-500 text-xs">{admin?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV.map(({ to, label, icon, end }) => (
          <NavLink
            key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-sm
               ${isActive ? 'bg-lb-mauve text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
            }
          >
            <span className="text-base">{icon}</span>
            <span className="tracking-wide">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-6 border-t border-white/10">
        <NavLink to="/" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors">
          ← View Store
        </NavLink>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-red-400 text-sm transition-colors mt-1">
          ⊗ Logout
        </button>
      </div>
    </aside>
  );
}
