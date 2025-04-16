
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/providers/ThemeProvider';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import Cart from '@/pages/Cart';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import AboutUs from '@/pages/AboutUs';
import Account from '@/pages/Account';
import Wishlist from '@/pages/Wishlist';
import ProductDetail from '@/pages/ProductDetail';
import TermsAndConditions from '@/pages/TermsAndConditions';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import FAQ from '@/pages/FAQ';
import Contact from '@/pages/Contact';
import Returns from '@/pages/Returns';
import Shipping from '@/pages/Shipping';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { Toaster as SonnerToaster } from 'sonner';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/returns" element={<Returns />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </Router>
              <SonnerToaster position="top-right" />
              <Toaster />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
