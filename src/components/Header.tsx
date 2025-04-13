
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { count: cartCount } = useCart();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchDialogOpen(false);
      toast.success(`Buscando: ${searchQuery}`);
    }
  };

  const handleCategoryClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

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
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-charlotte-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
              C
            </div>
            <div className="text-2xl md:text-3xl font-bold text-charlotte-dark font-charlotte flex items-center">
              <span className="text-charlotte-primary">Charlotte</span>
              <span className="ml-1">ARCS</span>
            </div>
          </Link>
        </div>
        
        {!isMobile && (
          <div className="hidden md:flex items-center w-1/3 relative">
            <form onSubmit={handleSearch} className="w-full">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full rounded-full border-2 border-charlotte-light px-4 py-2 focus:border-charlotte-primary outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="text-charlotte-muted" size={20} />
              </button>
            </form>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSearchDialogOpen(true)}
              className="hover:bg-charlotte-light"
            >
              <Search size={24} className="text-charlotte-dark hover:text-charlotte-primary transition-colors" />
            </Button>
          )}
          
          {!isMobile && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hover-scale p-0">
                      <User size={24} className="text-charlotte-dark hover:text-charlotte-primary transition-colors" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/account">Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist">Lista de Deseos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login" className="hover-scale">
                  <User size={24} className="text-charlotte-dark hover:text-charlotte-primary transition-colors" />
                </Link>
              )}
              
              <Link to="/wishlist" className="hover-scale">
                <Heart size={24} className="text-charlotte-dark hover:text-charlotte-primary transition-colors" />
              </Link>
            </>
          )}
          
          <Link to="/cart" className="hover-scale relative">
            <ShoppingBag size={24} className="text-charlotte-dark hover:text-charlotte-primary transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-charlotte-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
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
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="justify-between w-full py-2">
                {categories.map((category) => (
                  <NavigationMenuItem key={category.name}>
                    <NavigationMenuLink asChild>
                      <NavLink 
                        to={category.path}
                        className={({ isActive }) => 
                          `text-sm font-medium product-link ${isActive ? 'text-charlotte-primary' : 'text-charlotte-dark hover:text-charlotte-primary'}`
                        }
                        onClick={() => handleCategoryClick(category.path)}
                      >
                        {category.name}
                      </NavLink>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
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
            
            {user && (
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-charlotte-primary rounded-full flex items-center justify-center text-white">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="font-medium">{user.user_metadata?.full_name || user.email}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-4 border-b">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full rounded-full border-2 border-charlotte-light px-4 py-2 focus:border-charlotte-primary outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="text-charlotte-muted" size={20} />
                </button>
              </form>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-4">
                {categories.map((category) => (
                  <li key={category.name}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-2 rounded text-charlotte-dark hover:bg-charlotte-light"
                      onClick={() => handleCategoryClick(category.path)}
                    >
                      {category.name}
                    </Button>
                  </li>
                ))}
                <li className="border-t pt-4 mt-4">
                  {user ? (
                    <NavLink 
                      to="/account" 
                      className="flex items-center p-2 space-x-2 text-charlotte-dark hover:bg-charlotte-light rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User size={20} />
                      <span>Mi Cuenta</span>
                    </NavLink>
                  ) : (
                    <NavLink 
                      to="/login" 
                      className="flex items-center p-2 space-x-2 text-charlotte-dark hover:bg-charlotte-light rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User size={20} />
                      <span>Iniciar Sesión</span>
                    </NavLink>
                  )}
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
                {user && (
                  <li className="border-t pt-4 mt-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-2 text-red-500 hover:bg-red-50 rounded"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut size={20} className="mr-2" />
                      <span>Cerrar Sesión</span>
                    </Button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}
      
      {/* Search Dialog (Mobile) */}
      <CommandDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <Command>
          <form onSubmit={handleSearch}>
            <CommandInput 
              placeholder="Buscar productos..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </form>
          <CommandList>
            <CommandEmpty>No hay resultados.</CommandEmpty>
            <CommandGroup heading="Categorías populares">
              {categories.slice(0, 5).map((category) => (
                <CommandItem 
                  key={category.name}
                  onSelect={() => {
                    handleCategoryClick(category.path);
                    setSearchDialogOpen(false);
                  }}
                >
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </header>
  );
};

export default Header;
