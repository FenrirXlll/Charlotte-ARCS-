
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabaseCustom } from '@/lib/supabase-custom';
import { Product } from '@/types';
import { useAuth } from './AuthContext';
import { toast as sonnerToast } from 'sonner';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
  session_id?: string;
  user_id?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  subtotal: number;
  calculateTotal: (shippingCost: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const generateSessionId = () => {
    const storedId = localStorage.getItem('cart_session_id');
    if (storedId) return storedId;
    
    const newId = crypto.randomUUID();
    localStorage.setItem('cart_session_id', newId);
    return newId;
  };
  
  // Load cart items
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        let query = supabaseCustom.from('cart_items')
          .select('*, product:products(*)');
        
        // Filter based on authentication state
        if (user) {
          query = query.eq('user_id', user.id);
        } else {
          const sessionId = generateSessionId();
          query = query.eq('session_id', sessionId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        setItems(data || []);
      } catch (error: any) {
        console.error('Error loading cart:', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadCart();
  }, [user]);
  
  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);
  
  // Calculate total with shipping
  const calculateTotal = (shippingCost: number) => {
    return subtotal + shippingCost;
  };
  
  // Add item to cart
  const addItem = async (product: Product, quantity = 1) => {
    setLoading(true);
    try {
      // Check if product already exists in cart
      const existingItem = items.find(item => item.product_id === product.id);
      
      if (existingItem) {
        // Update quantity of existing item
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
        return;
      }
      
      // Add new item
      const newItem: Partial<CartItem> = {
        id: crypto.randomUUID(),
        product_id: product.id,
        quantity,
        user_id: user?.id,
        session_id: !user ? generateSessionId() : undefined
      };
      
      const { error } = await supabaseCustom
        .from('cart_items')
        .insert([newItem]);
        
      if (error) throw error;
      
      // Refresh cart after adding item
      const { data, error: refreshError } = await supabaseCustom
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('id', newItem.id)
        .single();
        
      if (refreshError) throw refreshError;
      
      setItems(prev => [...prev, data]);
      
      toast({
        title: 'Producto añadido',
        description: `${product.name} añadido al carrito.`,
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `No se pudo añadir al carrito: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Remove item from cart
  const removeItem = async (itemId: string) => {
    try {
      setLoading(true);
      const { error } = await supabaseCustom
        .from('cart_items')
        .delete()
        .eq('id', itemId);
        
      if (error) throw error;
      
      // Update local state
      setItems(prev => prev.filter(item => item.id !== itemId));
      
      toast({
        title: 'Producto eliminado',
        description: 'Producto eliminado del carrito.',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `No se pudo eliminar del carrito: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeItem(itemId);
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabaseCustom
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);
        
      if (error) throw error;
      
      // Update local state
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `No se pudo actualizar la cantidad: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Clear all items from cart
  const clearCart = async () => {
    try {
      setLoading(true);
      let query = supabaseCustom.from('cart_items').delete();
      
      // Filter based on authentication state
      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        const sessionId = generateSessionId();
        query = query.eq('session_id', sessionId);
      }
      
      const { error } = await query;
      if (error) throw error;
      
      // Clear local state
      setItems([]);
      
      toast({
        title: 'Carrito vacío',
        description: 'Todos los productos han sido eliminados del carrito.',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `No se pudo vaciar el carrito: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        loading, 
        subtotal, 
        calculateTotal 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
