
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  ChevronDown,
  ShoppingBag,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/hooks/use-toast';
import { authFunctions } from '@/lib/supabase-custom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await authFunctions.signOut();
      navigate('/');
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="font-charlotte text-2xl font-bold text-charlotte-primary">
              Charlotte <span className="text-charlotte-secondary">ARCS</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`${
                location.pathname === '/' ? 'text-charlotte-primary font-semibold' : 'text-gray-700'
              } hover:text-charlotte-primary transition-colors`}
            >
              Inicio
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`${
                  location.pathname.startsWith('/shop') ? 'text-charlotte-primary font-semibold' : 'text-gray-700'
                } hover:text-charlotte-primary transition-colors flex items-center`}>
                  Tienda <ChevronDown size={16} className="ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white">
                <DropdownMenuLabel>Categorías</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/shop/women" className="w-full">Mujeres</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/shop/men" className="w-full">Hombres</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/shop/kids" className="w-full">Niños</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/shop/new" className="w-full">Novedades</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/shop/sale" className="w-full">Ofertas</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link 
              to="/about" 
              className={`${
                location.pathname === '/about' ? 'text-charlotte-primary font-semibold' : 'text-gray-700'
              } hover:text-charlotte-primary transition-colors`}
            >
              Nosotros
            </Link>
            
            <Link 
              to="/contact" 
              className={`${
                location.pathname === '/contact' ? 'text-charlotte-primary font-semibold' : 'text-gray-700'
              } hover:text-charlotte-primary transition-colors`}
            >
              Contacto
            </Link>
          </nav>
          
          {/* Search, Cart, Wishlist and Account */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3 pr-8 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-charlotte-primary"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-charlotte-primary"
              >
                <Search size={16} />
              </button>
            </form>
            
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-1.5 text-gray-700 hover:text-charlotte-primary transition-colors">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-charlotte-secondary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="relative p-1.5 text-gray-700 hover:text-charlotte-primary transition-colors">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-charlotte-secondary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            
            {/* User account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 text-gray-700 hover:text-charlotte-primary transition-colors">
                    <User size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/account" className="w-full flex items-center">
                      <User size={16} className="mr-2" /> 
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/orders" className="w-full flex items-center">
                      <ShoppingBag size={16} className="mr-2" /> 
                      Mis Pedidos
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem>
                      <Link to="/admin" className="w-full flex items-center">
                        <Settings size={16} className="mr-2" /> 
                        Administración
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <div className="w-full flex items-center text-rose-500">
                      <LogOut size={16} className="mr-2" /> 
                      Cerrar Sesión
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="hidden md:flex items-center text-gray-700 hover:text-charlotte-primary transition-colors">
                <User size={20} className="mr-1" />
                <span>Iniciar Sesión</span>
              </Link>
            )}
            
            {/* Mobile menu toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-gray-700 hover:text-charlotte-primary transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t mt-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`${
                  location.pathname === '/' ? 'text-charlotte-primary font-semibold' : 'text-gray-700'
                } hover:text-charlotte-primary transition-colors`}
              >
                Inicio
              </Link>
              <details className="group">
                <summary className={`${
                  location.pathname.startsWith('/shop') ? 'text-charlotte-primary font-semibold' : 'text-gray-700'
                } hover:text-charlotte-primary transition-colors flex items-center cursor-pointer`}>
                  Tienda <ChevronDown size={16} className="ml-1 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="pl-4 mt-2 flex flex-col space-y-2">
                  <Link to="/shop/women" className="text-gray-700 hover:text-charlotte-primary">Mujeres</Link>
                  <Link to="/shop/men" className="text-gray-700 hover:text-charlotte-primary">Hombres</Link>
                  <Link to="/shop/kids" className="text-gray-700 hover:text-charlotte-primary">Niños</Link>
                  <Link to="/shop/new" className="text-gray-700 hover:text-charlotte-primary">Novedades</Link>
                  <Link to="/shop/sale" className="text-gray-700 hover:text-charlotte-primary">Ofertas</Link>
                </div>
              </details>
              <Link 
                to="/about" 
                className={`${
                  location.pathname === '/about' ? 'text-charlotte-primary font-semibold' : 'text-gray-700'
                } hover:text-charlotte-primary transition-colors`}
              >
                Nosotros
              </Link>
              <Link 
                to="/contact" 
                className={`${
                  location.pathname === '/contact' ? 'text-charlotte-primary font-semibold' : 'text-gray-700'
                } hover:text-charlotte-primary transition-colors`}
              >
                Contacto
              </Link>
              
              {!user && (
                <Link 
                  to="/login" 
                  className="text-charlotte-primary font-semibold hover:text-charlotte-primary/80 transition-colors"
                >
                  Iniciar Sesión
                </Link>
              )}
              
              {user && (
                <>
                  <Link 
                    to="/account" 
                    className="text-gray-700 hover:text-charlotte-primary transition-colors"
                  >
                    Mi Perfil
                  </Link>
                  <Link 
                    to="/orders" 
                    className="text-gray-700 hover:text-charlotte-primary transition-colors"
                  >
                    Mis Pedidos
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-charlotte-primary transition-colors"
                    >
                      Administración
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="text-left text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}
            </nav>
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4 relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-charlotte-primary"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-charlotte-primary"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
