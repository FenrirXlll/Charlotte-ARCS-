
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const categories = [
  { name: 'Mujeres', path: '/category/mujeres' },
  { name: 'Hombres', path: '/category/hombres' },
  { name: 'Jóvenes', path: '/category/jovenes' },
  { name: 'Bebés', path: '/category/bebes' },
  { name: 'Temporada', path: '/category/temporada' },
  { name: 'Escolar', path: '/category/escolar' },
  { name: 'Perfumería', path: '/category/perfumeria' },
  { name: 'Cosméticos', path: '/category/cosmeticos' },
  { name: 'Joyería', path: '/category/joyeria' },
  { name: 'Shop-C', path: '/category/shop-c' }
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white'
    }`}>
      {/* Top Header - Promo Banner */}
      <div className="bg-charlotte-primary text-white py-2 overflow-hidden">
        <div className="flex space-x-4 banner-slide">
          <span className="whitespace-nowrap">¡ENVÍO GRATIS EN PEDIDOS MAYORES A $999!</span>
          <span className="whitespace-nowrap">25% DE DESCUENTO EN NUEVA TEMPORADA</span>
          <span className="whitespace-nowrap">COMPRA AHORA Y PAGA EN 3 MESES SIN INTERESES</span>
          <span className="whitespace-nowrap">¡ENVÍO GRATIS EN PEDIDOS MAYORES A $999!</span>
          <span className="whitespace-nowrap">25% DE DESCUENTO EN NUEVA TEMPORADA</span>
          <span className="whitespace-nowrap">COMPRA AHORA Y PAGA EN 3 MESES SIN INTERESES</span>
        </div>
      </div>
      
      {/* Middle Header - Logo & Search */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl md:text-3xl font-bold text-charlotte-dark flex items-center">
            <span className="text-charlotte-primary">Charlotte</span>
            <span className="ml-1">ARCS</span>
          </Link>
        </div>
        
        {!isMobile && (
          <div className="hidden md:flex items-center w-1/3 relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full rounded-full border-2 border-charlotte-light px-4 py-2 focus:border-charlotte-primary outline-none"
            />
            <Search className="absolute right-3 text-charlotte-muted" size={20} />
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          {!isMobile && (
            <>
              <Link to="/account" className="hover-scale">
                <User size={24} className="text-charlotte-dark hover:text-charlotte-primary transition-colors" />
              </Link>
              <Link to="/wishlist" className="hover-scale">
                <Heart size={24} className="text-charlotte-dark hover:text-charlotte-primary transition-colors" />
              </Link>
            </>
          )}
          <Link to="/cart" className="hover-scale relative">
            <ShoppingBag size={24} className="text-charlotte-dark hover:text-charlotte-primary transition-colors" />
            <span className="absolute -top-2 -right-2 bg-charlotte-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Link>
          
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          )}
        </div>
      </div>
      
      {/* Desktop Navigation */}
      {!isMobile && (
        <nav className="border-t border-b border-gray-200 hidden md:block">
          <div className="container mx-auto px-4">
            <ul className="flex justify-between py-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <NavLink 
                    to={category.path}
                    className={({ isActive }) => 
                      `text-sm font-medium product-link ${isActive ? 'text-charlotte-primary' : 'text-charlotte-dark hover:text-charlotte-primary'}`
                    }
                  >
                    {category.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
      
      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white h-full w-4/5 max-w-sm absolute right-0 animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-semibold">Menú</h2>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </Button>
            </div>
            
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full rounded-full border-2 border-charlotte-light px-4 py-2 focus:border-charlotte-primary outline-none"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-charlotte-muted" size={20} />
              </div>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-4">
                {categories.map((category) => (
                  <li key={category.name}>
                    <NavLink 
                      to={category.path}
                      className={({ isActive }) => 
                        `block p-2 rounded ${isActive ? 'bg-charlotte-light text-charlotte-primary' : 'text-charlotte-dark hover:bg-charlotte-light'}`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </NavLink>
                  </li>
                ))}
                <li className="border-t pt-4 mt-4">
                  <NavLink 
                    to="/account" 
                    className="flex items-center p-2 space-x-2 text-charlotte-dark hover:bg-charlotte-light rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={20} />
                    <span>Mi Cuenta</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/wishlist" 
                    className="flex items-center p-2 space-x-2 text-charlotte-dark hover:bg-charlotte-light rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart size={20} />
                    <span>Mi Lista de Deseos</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/about-us" 
                    className="flex items-center p-2 space-x-2 text-charlotte-dark hover:bg-charlotte-light rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Quiénes Somos</span>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
