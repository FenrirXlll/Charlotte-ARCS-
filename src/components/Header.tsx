
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/images/logo.png" 
              alt="Logo" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-charlotte-primary">
              Inicio
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-charlotte-primary">
              Tienda
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-charlotte-primary">
              Contacto
            </Link>
          </nav>

          {/* Cart and Wishlist */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/wishlist" className="relative">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-charlotte-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Button>
            </Link>
            
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-charlotte-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-charlotte-primary">
            Inicio
          </Link>
          <Link to="/shop" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-charlotte-primary">
            Tienda
          </Link>
          <Link to="/contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-charlotte-primary">
            Contacto
          </Link>
          <Link to="/wishlist" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-charlotte-primary">
            Lista de deseos ({wishlistItems.length})
          </Link>
          <Link to="/cart" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-charlotte-primary">
            Carrito ({cartItems.length})
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
