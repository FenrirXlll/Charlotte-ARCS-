import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { CartItem, Product } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  count: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');
  const { toast } = useToast();
  const { user } = useAuth();

  // Inicializar el sessionId para usuarios no autenticados
  useEffect(() => {
    const storedSessionId = localStorage.getItem('cartSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('cartSessionId', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Cargar carrito
  useEffect(() => {
    const loadCart = async () => {
      if (!sessionId && !user) return;
      
      setLoading(true);
      try {
        let query = supabase
          .from('cart_items')
          .select('*, product:products(*)')
        
        if (user) {
          query = query.eq('user_id', user.id);
        } else {
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

    if (sessionId || user) {
      loadCart();
    }
  }, [sessionId, user]);

  // Migrar carrito cuando el usuario inicia sesión
  useEffect(() => {
    const migrateCart = async () => {
      if (user && sessionId && items.length > 0) {
        try {
          // Obtener items del carrito del usuario
          const { data: userCartItems } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id);

          // Migrar items de la sesión al usuario
          for (const item of items) {
            if (!item.user_id) {
              const existingItem = userCartItems?.find(i => i.product_id === item.product_id);
              
              if (existingItem) {
                // Actualizar cantidad si el producto ya existe
                await supabase
                  .from('cart_items')
                  .update({ quantity: existingItem.quantity + item.quantity })
                  .eq('id', existingItem.id);
                  
                // Eliminar el item de la sesión
                await supabase
                  .from('cart_items')
                  .delete()
                  .eq('id', item.id);
              } else {
                // Asignar el item al usuario
                await supabase
                  .from('cart_items')
                  .update({ user_id: user.id, session_id: null })
                  .eq('id', item.id);
              }
            }
          }
          
          // Recargar el carrito
          const { data, error } = await supabase
            .from('cart_items')
            .select('*, product:products(*)')
            .eq('user_id', user.id);
            
          if (error) throw error;
          setItems(data || []);
        } catch (error: any) {
          console.error('Error migrating cart:', error.message);
        }
      }
    };

    if (user && sessionId) {
      migrateCart();
    }
  }, [user, sessionId]);

  const addItem = async (product: Product, quantity: number) => {
    try {
      setLoading(true);
      
      // Verificar si el producto ya está en el carrito
      const existingItem = items.find(item => item.product_id === product.id);
      
      if (existingItem) {
        // Actualizar cantidad
        const newQuantity = existingItem.quantity + quantity;
        
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', existingItem.id);
          
        if (error) throw error;
        
        // Actualizar estado local
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === existingItem.id 
              ? { ...item, quantity: newQuantity } 
              : item
          )
        );
      } else {
        // Añadir nuevo item
        const newItem = {
          id: uuidv4(),
          product_id: product.id,
          user_id: user?.id,
          session_id: user ? null : sessionId,
          quantity,
          product
        };
        
        const { error } = await supabase
          .from('cart_items')
          .insert([{
            id: newItem.id,
            product_id: newItem.product_id,
            user_id: newItem.user_id,
            session_id: newItem.session_id,
            quantity: newItem.quantity
          }]);
          
        if (error) throw error;
        
        // Actualizar estado local
        setItems(prevItems => [...prevItems, newItem]);
      }
      
      toast({
        title: 'Añadido al carrito',
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

  const removeItem = async (productId: string) => {
    try {
      setLoading(true);
      const itemToRemove = items.find(item => item.product_id === productId);
      
      if (!itemToRemove) return;
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemToRemove.id);
        
      if (error) throw error;
      
      // Actualizar estado local
      setItems(prevItems => prevItems.filter(item => item.product_id !== productId));
      
      toast({
        title: 'Eliminado del carrito',
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

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    try {
      setLoading(true);
      const itemToUpdate = items.find(item => item.product_id === productId);
      
      if (!itemToUpdate) return;
      
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemToUpdate.id);
        
      if (error) throw error;
      
      // Actualizar estado local
      setItems(prevItems => 
        prevItems.map(item => 
          item.product_id === productId 
            ? { ...item, quantity } 
            : item
        )
      );
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `No se pudo actualizar el carrito: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      
      // Fix: Use the proper TypeScript syntax for Supabase queries
      let { error } = user 
        ? await supabase
            .from('cart_items')
            .delete()
            .match({ user_id: user.id })
        : await supabase
            .from('cart_items')
            .delete()
            .match({ session_id: sessionId });
      
      if (error) throw error;
      
      // Actualizar estado local
      setItems([]);
      
      toast({
        title: 'Carrito vacío',
        description: 'Se han eliminado todos los productos del carrito.',
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

  // Calcular total de productos
  const count = items.reduce((total, item) => total + item.quantity, 0);
  
  // Calcular precio total
  const totalPrice = items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        loading, 
        count, 
        totalPrice 
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
