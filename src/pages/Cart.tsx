
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, loading } = useCart();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charlotte-primary"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mb-4 flex justify-center">
            <ShoppingBag size={64} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-6">Parece que no has añadido ningún producto a tu carrito todavía.</p>
          <Button asChild className="bg-charlotte-primary">
            <Link to="/">Continuar comprando</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Carrito de Compras</h1>
        <Button 
          variant="ghost" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => clearCart()}
        >
          <Trash2 size={18} className="mr-2" />
          Vaciar carrito
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 sm:ml-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link to={`/product/${item.product.id}`} className="hover:text-charlotte-primary">
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <div className="flex items-end justify-end">
                            <span className="text-xl font-medium text-gray-900">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                            {item.product.original_price && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                ${(item.product.original_price * item.quantity).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center border rounded">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2 text-gray-600 hover:text-charlotte-primary"
                          >
                            <Minus size={16} />
                          </button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value > 0) {
                                updateQuantity(item.id, value);
                              }
                            }}
                            className="w-16 text-center border-0 focus:ring-0"
                          />
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-gray-600 hover:text-charlotte-primary"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <Button asChild variant="outline">
              <Link to="/" className="flex items-center">
                <ArrowLeft size={16} className="mr-2" />
                Continuar comprando
              </Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Resumen de Compra</h2>
            <div className="border-t border-gray-200 py-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium">Calculado en el siguiente paso</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Impuestos</span>
                <span className="font-medium">Calculado en el siguiente paso</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between mb-4">
                <span className="text-lg font-medium">Total</span>
                <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-charlotte-primary">
                Proceder al pago
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
