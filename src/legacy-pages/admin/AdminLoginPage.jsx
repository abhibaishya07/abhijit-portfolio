import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { adminLogin, loading } = useAdmin();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-lb-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-10 animate-scaleIn text-lb-black">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-semibold mb-2">Kivara</h1>
          <p className="text-xs tracking-widest uppercase text-lb-mauve font-semibold">Admin Portal</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">Email</label>
            <input name="email" type="email" required value={form.email} onChange={handle}
              className="input-field" placeholder="admin@kivara.com" autoFocus />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">Password</label>
            <div className="relative border border-gray-300 focus-within:border-lb-mauve focus-within:ring-1 focus-within:ring-lb-mauve transition-all duration-200">
              <input name="password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={handle}
                className="w-full text-sm px-4 py-3 bg-white outline-none placeholder-gray-400" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? <Spinner size="sm" light /> : 'Sign In'}
          </button>
        </form>


      </div>
    </div>
  );
}
