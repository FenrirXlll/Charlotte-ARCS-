
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const Logo = () => (
  <div className="flex items-center space-x-2">
    <img 
      src="/images/charlotte-logo.png" 
      alt="Charlotte ARCS Logo" 
      className="w-10 h-10"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "https://via.placeholder.com/40?text=CA";
      }}
    />
    <span className="font-playfair text-xl font-semibold">Charlotte ARCS</span>
  </div>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const cartItemCount = cart.length;
  const wishlistItemCount = wishlist.length;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-charlotte-primary">
              Inicio
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-charlotte-primary">
              Acerca de
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-charlotte-primary">
              Contacto
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="w-full">Mi Cuenta</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
            
            <Link to="/wishlist" className="relative">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-charlotte-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </Button>
            </Link>
            
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-charlotte-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden bg-white absolute w-full left-0 border-b border-gray-200 transition-all duration-300 ease-in-out",
        isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="container mx-auto px-4 py-4 space-y-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-charlotte-primary py-2">
              Inicio
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-charlotte-primary py-2">
              Acerca de
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-charlotte-primary py-2">
              Contacto
            </Link>
          </nav>
          
          <div className="flex justify-between pt-4 border-t border-gray-100">
            {user ? (
              <div className="flex space-x-4">
                <Link to="/account" className="text-gray-700 hover:text-charlotte-primary">
                  Mi Cuenta
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-charlotte-primary"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-charlotte-primary">
                Iniciar Sesión
              </Link>
            )}
            
            <div className="flex space-x-4">
              <Link to="/wishlist" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-charlotte-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>
              
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-charlotte-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
