
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Plus, Save, Trash2 } from 'lucide-react';

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    is_new: false,
    inventory_count: 10,
  });
  const { toast } = useToast();

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setProducts(data || []);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: `No se pudieron cargar los productos: ${error.message}`,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Función para editar producto
  const handleEditStart = (product: Product) => {
    setEditingProduct(product);
  };

  const handleEditCancel = () => {
    setEditingProduct(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setEditingProduct(prev => {
      if (!prev) return prev;
      
      if (type === 'number') {
        return { ...prev, [name]: parseFloat(value) };
      } else if (type === 'checkbox') {
        return { ...prev, [name]: (e.target as HTMLInputElement).checked };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handleEditSave = async () => {
    if (!editingProduct) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          original_price: editingProduct.original_price,
          discount_percentage: editingProduct.discount_percentage,
          image: editingProduct.image,
          category: editingProduct.category,
          is_new: editingProduct.is_new,
          inventory_count: editingProduct.inventory_count
        })
        .match({ id: editingProduct.id });
        
      if (error) throw error;
      
      // Actualizar lista de productos
      setProducts(prev => 
        prev.map(p => p.id === editingProduct.id ? editingProduct : p)
      );
      
      setEditingProduct(null);
      
      toast({
        title: 'Éxito',
        description: 'Producto actualizado correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `No se pudo actualizar el producto: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  // Función para crear producto
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setNewProduct(prev => {
      if (type === 'number') {
        return { ...prev, [name]: parseFloat(value) };
      } else if (type === 'checkbox') {
        return { ...prev, [name]: (e.target as HTMLInputElement).checked };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handleCreateProduct = async () => {
    try {
      const productToCreate = {
        ...newProduct,
        created_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert([productToCreate])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Añadir producto a la lista
        setProducts(prev => [data[0], ...prev]);
        
        // Resetear formulario
        setNewProduct({
          name: '',
          description: '',
          price: 0,
          image: '',
          category: '',
          is_new: false,
          inventory_count: 10,
        });
        
        setIsCreating(false);
        
        toast({
          title: 'Éxito',
          description: 'Producto creado correctamente',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `No se pudo crear el producto: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  // Función para eliminar producto
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .match({ id });
        
      if (error) throw error;
      
      // Eliminar producto de la lista
      setProducts(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: 'Éxito',
        description: 'Producto eliminado correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `No se pudo eliminar el producto: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charlotte-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <Button onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? 'Cancelar' : (
            <>
              <Plus size={16} className="mr-2" />
              Nuevo Producto
            </>
          )}
        </Button>
      </div>

      {/* Formulario para crear producto */}
      {isCreating && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Crear Nuevo Producto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <Input
                name="name"
                value={newProduct.name}
                onChange={handleCreateChange}
                placeholder="Nombre del producto"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <Input
                name="category"
                value={newProduct.category}
                onChange={handleCreateChange}
                placeholder="Categoría"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <Input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleCreateChange}
                placeholder="Precio"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original</label>
              <Input
                type="number"
                name="original_price"
                value={newProduct.original_price || ''}
                onChange={handleCreateChange}
                placeholder="Precio Original (opcional)"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
              <Input
                name="image"
                value={newProduct.image}
                onChange={handleCreateChange}
                placeholder="URL de la imagen"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inventario</label>
              <Input
                type="number"
                name="inventory_count"
                value={newProduct.inventory_count}
                onChange={handleCreateChange}
                placeholder="Cantidad en inventario"
                className="w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleCreateChange}
                placeholder="Descripción del producto"
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_new"
                name="is_new"
                checked={newProduct.is_new}
                onChange={(e) => setNewProduct(prev => ({ ...prev, is_new: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="is_new" className="text-sm font-medium text-gray-700">Marcar como nuevo</label>
            </div>
          </div>
          <Button onClick={handleCreateProduct} className="w-full">
            Crear Producto
          </Button>
        </div>
      )}

      {/* Lista de productos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id}>
                  {editingProduct && editingProduct.id === product.id ? (
                    // Modo edición
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Input
                          name="image"
                          value={editingProduct.image}
                          onChange={handleEditChange}
                          placeholder="URL de la imagen"
                          className="w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Input
                          name="name"
                          value={editingProduct.name}
                          onChange={handleEditChange}
                          placeholder="Nombre del producto"
                          className="w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Input
                          name="category"
                          value={editingProduct.category}
                          onChange={handleEditChange}
                          placeholder="Categoría"
                          className="w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Input
                          type="number"
                          name="price"
                          value={editingProduct.price}
                          onChange={handleEditChange}
                          placeholder="Precio"
                          className="w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Input
                          type="number"
                          name="inventory_count"
                          value={editingProduct.inventory_count}
                          onChange={handleEditChange}
                          placeholder="Inventario"
                          className="w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleEditSave} className="bg-green-500 hover:bg-green-600">
                            <Save size={16} />
                          </Button>
                          <Button size="sm" onClick={handleEditCancel} variant="outline">
                            Cancelar
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // Modo visualización
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={product.image} alt={product.name} className="h-10 w-10 object-cover rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.inventory_count}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleEditStart(product)} variant="outline">
                            <Pencil size={16} className="mr-1" /> Editar
                          </Button>
                          <Button size="sm" onClick={() => handleDeleteProduct(product.id)} variant="destructive">
                            <Trash2 size={16} className="mr-1" /> Eliminar
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
