import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';

// Layout Components
import Layout from './components/layout/Layout';
import BreadcrumbNav from './components/layout/BreadcrumbNav';

// Page Components
import HomePage from './pages/HomePage';
import ProductCatalogPage from './pages/ProductCatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import DashboardPage from './pages/DashboardPage';
import PersonalInfoPage from './pages/PersonalInfoPage';
import WishlistPage from './pages/WishlistPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import SizeGuidePage from './pages/SizeGuidePage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import CustomerReviews from './pages/CustomerReviews';
import PaymentPage from './pages/PaymentPage';
import ShippingReturnsPage from './pages/ShippingReturnsPage';
import CareGuidePage from './pages/CareGuidePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import EditProfilePage from './pages/EditProfilePage';

// Global Styles
import './styles/global.css';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<ProductCatalogPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/reviews" element={<CustomerReviews />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        
        {/* Support Routes */}
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/size-guide" element={<SizeGuidePage />} />
        <Route path="/return-policy" element={<ReturnPolicyPage />} />
        
        {/* Protected Routes */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/order-tracking" element={<OrderTrackingPage />} />
        <Route path="/account" element={<DashboardPage />} />
        <Route path="/account/personal-info" element={<PersonalInfoPage />} />
        <Route path="/account/edit-profile" element={<EditProfilePage />} />
        <Route path="/account/wishlist" element={<WishlistPage />} />
        <Route path="/account/orders" element={<OrderHistoryPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        
        {/* New Routes */}
        <Route path="/shipping" element={<ShippingReturnsPage />} />
        <Route path="/care-guide" element={<CareGuidePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <WishlistProvider>
              <CartProvider>
                <ToastProvider>
                  <div className="min-h-screen bg-amber-50">
                    <BreadcrumbNav />
                    <Layout>
                      <AnimatedRoutes />
                    </Layout>
                  </div>
                </ToastProvider>
              </CartProvider>
            </WishlistProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;