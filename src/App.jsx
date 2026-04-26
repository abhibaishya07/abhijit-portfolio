import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';

// Layout
import AdminLayout from './components/layout/AdminLayout';
import AdminGuard from './components/layout/AdminGuard';

// Storefront
import HomePage from './pages/storefront/HomePage';
import ProductListPage from './pages/storefront/ProductListPage';
import ProductDetailPage from './pages/storefront/ProductDetailPage';
import CheckoutPage from './pages/storefront/CheckoutPage';
import LoginPage from './pages/storefront/LoginPage';
import RegisterPage from './pages/storefront/RegisterPage';
import ForgotPasswordPage from './pages/storefront/ForgotPasswordPage';
import ResetPasswordPage from './pages/storefront/ResetPasswordPage';
import VerifyEmailPage from './pages/storefront/VerifyEmailPage';
import AccountPage from './pages/storefront/AccountPage';
import GlowBotPage from './pages/storefront/GlowBotPage';
import FAQPage from './pages/storefront/FAQPage';
import PoliciesPage from './pages/storefront/PoliciesPage';
import ContactPage from './pages/storefront/ContactPage';
import KrizmaWidget from './components/layout/KrizmaWidget';

// Admin
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <AdminProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: { fontFamily: 'Inter, sans-serif', fontSize: '13px', borderRadius: '0' },
              }}
            />
            <Routes>
              {/* Customer Storefront */}
              <Route path="/"           element={<HomePage />} />
              <Route path="/shop"       element={<ProductListPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/checkout"   element={<CheckoutPage />} />
              <Route path="/login"      element={<LoginPage />} />
              <Route path="/register"   element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/resetpassword/:resetToken" element={<ResetPasswordPage />} />
              <Route path="/account"    element={<AccountPage />} />
              <Route path="/glowbot"    element={<GlowBotPage />} />
              <Route path="/faq"        element={<FAQPage />} />
              <Route path="/policies"   element={<PoliciesPage />} />
              <Route path="/contact"    element={<ContactPage />} />

              {/* Admin Portal */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
                <Route index            element={<AdminDashboardPage />} />
                <Route path="products"  element={<AdminProductsPage />} />
                <Route path="inventory" element={<AdminInventoryPage />} />
                <Route path="orders"    element={<AdminOrdersPage />} />
              </Route>
            </Routes>
            <KrizmaWidget />
          </AdminProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
