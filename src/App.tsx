
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/providers/ThemeProvider';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import Product from '@/pages/Product';
import Contact from '@/pages/Contact';
import Cart from '@/pages/Cart';
import Wishlist from '@/pages/Wishlist';
import NotFound from '@/pages/NotFound';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { Toaster as SonnerToaster } from 'sonner';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </Router>
            <SonnerToaster position="top-right" />
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
