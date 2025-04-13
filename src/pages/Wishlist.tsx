
import React from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Wishlist = () => {
  const { items, removeItem, loading } = useWishlist();
  const { addItem } = useCart();
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mi Lista de Deseos</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charlotte-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mi Lista de Deseos</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mb-4 flex justify-center">
            <Heart size={64} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Inicia sesión para ver tu lista de deseos</h2>
          <p className="text-gray-500 mb-6">Necesitas iniciar sesión para guardar y ver tus productos favoritos.</p>
          <Button asChild className="bg-charlotte-primary">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mi Lista de Deseos</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charlotte-primary"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mi Lista de Deseos</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mb-4 flex justify-center">
            <Heart size={64} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Tu lista de deseos está vacía</h2>
          <p className="text-gray-500 mb-6">Agrega productos a tu lista de deseos para guardarlos para más tarde.</p>
          <Button asChild className="bg-charlotte-primary">
            <Link to="/">Explorar productos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mi Lista de Deseos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative pb-[125%] overflow-hidden">
              <img 
                src={item.product.image} 
                alt={item.product.name}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <button 
                className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white"
                onClick={() => removeItem(item.product.id)}
                aria-label="Eliminar de favoritos"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-xs text-charlotte-muted uppercase mb-1">{item.product.category}</p>
              <h3 className="font-medium text-charlotte-dark mb-2 line-clamp-2 min-h-[2.5rem]">
                <Link to={`/product/${item.product.id}`} className="hover:text-charlotte-primary transition-colors">
                  {item.product.name}
                </Link>
              </h3>
              <div className="flex items-baseline mb-4">
                <span className="text-lg font-bold text-charlotte-dark">${item.product.price.toFixed(2)}</span>
                {item.product.original_price && (
                  <span className="ml-2 text-sm text-gray-500 line-through">${item.product.original_price?.toFixed(2)}</span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-charlotte-primary"
                  onClick={() => {
                    addItem(item.product, 1);
                    removeItem(item.product.id);
                  }}
                >
                  <ShoppingBag size={16} className="mr-2" />
                  Añadir al carrito
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
