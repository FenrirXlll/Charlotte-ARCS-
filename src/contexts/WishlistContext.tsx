
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { WishlistItem, Product } from '@/types';
import { useAuth } from './AuthContext';
import { toast as sonnerToast } from 'sonner';

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Cargar lista de deseos
  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        setItems([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('wishlist_items')
          .select('*, product:products(*)')
          .eq('user_id', user.id);
          
        if (error) throw error;
        setItems(data || []);
      } catch (error: any) {
        console.error('Error loading wishlist:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user]);

  const addItem = async (product: Product) => {
    if (!user) {
      sonnerToast('Inicia sesión para guardar en tu lista de deseos', {
        description: 'Necesitas tener una cuenta para usar esta función',
        action: {
          label: 'Iniciar sesión',
          onClick: () => window.location.href = '/login'
        }
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Verificar si el producto ya está en la lista de deseos
      const existingItem = items.find(item => item.product_id === product.id);
      
      if (existingItem) {
        toast({
          title: 'Ya en lista de deseos',
          description: `${product.name} ya está en tu lista de deseos.`,
          variant: 'default',
        });
        return;
      }
      
      // Añadir nuevo item
      const newItem = {
        id: crypto.randomUUID(),
        product_id: product.id,
        user_id: user.id,
        added_at: new Date().toISOString(),
        product
      };
      
      const { error } = await supabase
        .from('wishlist_items')
        .insert([{
          id: newItem.id,
          product_id: newItem.product_id,
          user_id: newItem.user_id,
          added_at: newItem.added_at
        }]);
        
      if (error) throw error;
      
      // Actualizar estado local
      setItems(prevItems => [...prevItems, newItem]);
      
      toast({
        title: 'Añadido a favoritos',
        description: `${product.name} añadido a tu lista de deseos.`,
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `No se pudo añadir a favoritos: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const itemToRemove = items.find(item => item.product_id === productId);
      
      if (!itemToRemove) return;
      
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', itemToRemove.id);
        
      if (error) throw error;
      
      // Actualizar estado local
      setItems(prevItems => prevItems.filter(item => item.product_id !== productId));
      
      toast({
        title: 'Eliminado de favoritos',
        description: 'Producto eliminado de tu lista de deseos.',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `No se pudo eliminar de favoritos: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        items, 
        addItem, 
        removeItem, 
        isInWishlist, 
        loading 
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
