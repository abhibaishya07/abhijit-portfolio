import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { forgotPassword } from '../../api/authApi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSuccess(true);
      toast.success('Password reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex items-center justify-center min-h-[70vh] px-4 py-16 bg-lb-gray">
        <div className="w-full max-w-md bg-white p-10 border border-lb-border animate-scaleIn">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-semibold mb-2">Reset Password</h1>
            <p className="text-sm text-gray-500">
              {success 
                ? "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder."
                : "Enter your email address and we'll send you a link to reset your password."}
            </p>
          </div>

          {!success ? (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">Email</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="input-field" 
                  placeholder="you@example.com" 
                  autoFocus 
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? <Spinner size="sm" light /> : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <Link to="/login" className="btn-primary inline-block w-full text-center">
                Return to Login
              </Link>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Remembered your password?{' '}
            <Link to="/login" className="font-semibold text-lb-mauve hover:text-lb-black transition-colors">Log in here</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
