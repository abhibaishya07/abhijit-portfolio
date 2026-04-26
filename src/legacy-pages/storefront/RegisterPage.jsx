import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/verify-email', { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex items-center justify-center min-h-[70vh] px-4 py-16 bg-lb-gray">
        <div className="w-full max-w-md bg-white p-10 border border-lb-border animate-scaleIn">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-semibold mb-2">Create Account</h1>
            <p className="text-sm text-gray-500">Join Kivara for exclusive perks</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your full name' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+91 9876543210', required: false },
              { label: 'Password', name: 'password', type: 'password', placeholder: 'Min. 6 characters' },
            ].map(({ label, name, type, placeholder, required = true }) => (
              <div key={name}>
                <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">{label}</label>
                {type === 'password' ? (
                  <div className="relative border border-gray-300 focus-within:border-lb-mauve focus-within:ring-1 focus-within:ring-lb-mauve transition-all duration-200">
                    <input name={name} type={showPassword ? 'text' : 'password'} value={form[name]} onChange={handle}
                      required={required} className="w-full text-sm px-4 py-3 bg-white outline-none placeholder-gray-400" placeholder={placeholder} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      )}
                    </button>
                  </div>
                ) : (
                  <input name={name} type={type} value={form[name]} onChange={handle} required={required} className="input-field" placeholder={placeholder} />
                )}
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Spinner size="sm" light /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-lb-mauve hover:text-lb-black transition-colors">Sign in</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
