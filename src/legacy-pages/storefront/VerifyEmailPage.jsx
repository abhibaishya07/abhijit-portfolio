import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { resendOtp } from '../../api/authApi';

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  
  const { verifyRegistration, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const submit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('OTP must be 6 digits');
    
    try {
      await verifyRegistration(email, otp);
      toast.success('Verification successful! You are now logged in.');
      navigate('/account');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid Verification Code');
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResendLoading(true);
    try {
      await resendOtp({ email });
      toast.success('A new verification code has been sent!');
      setCooldown(60); // reset 1 minute cooldown
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) return null;

  return (
    <>
      <Navbar />
      <main className="flex items-center justify-center min-h-[70vh] px-4 py-16 bg-lb-gray">
        <div className="w-full max-w-md bg-white p-10 border border-lb-border animate-scaleIn">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-semibold mb-2">Verify Email</h1>
            <p className="text-sm text-gray-500">
              We've sent a 6-digit verification code to <span className="font-semibold text-lb-black">{email}</span>.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5 text-center">Verification Code</label>
              <input 
                type="text" 
                maxLength="6"
                required 
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                className="input-field text-center text-2xl tracking-[0.5em] font-semibold font-display" 
                placeholder="------" 
                autoFocus 
              />
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Spinner size="sm" light /> : 'Verify & Login'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500 mb-3">Didn't receive the code?</p>
            <button 
              type="button" 
              onClick={handleResend}
              disabled={resendLoading || cooldown > 0}
              className={`text-xs uppercase tracking-widest font-bold transition-colors ${
                cooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-lb-mauve hover:text-lb-black'
              }`}
            >
              {resendLoading ? <Spinner size="xs" /> : cooldown > 0 ? `Resend Code in ${cooldown}s` : 'Resend Code'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
