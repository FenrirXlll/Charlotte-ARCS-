
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Trash2, 
  Edit, 
  Plus, 
  Search, 
  AlertCircle,
  Package,
  Users,
  ShoppingBag,
  Settings,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabaseCustom } from '@/lib/supabase-custom';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Verificar si el usuario es administrador
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        toast({
          title: 'Acceso no autorizado',
          description: 'Debes iniciar sesión para acceder al panel de administración.',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }
      
      // Aquí puedes agregar lógica para verificar si el usuario es admin
      // Por ahora, todos los usuarios autenticados pueden acceder
    };
    
    checkAdmin();
  }, [user, navigate, toast]);
  
  const { data: products, isLoading: productsLoading, refetch: refetchProducts } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      const { data, error } = await supabaseCustom
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Product[];
    },
  });
  
  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabaseCustom
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado correctamente.',
      });
      
      refetchProducts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `No se pudo eliminar el producto: ${error.message}`,
        variant: 'destructive',
      });
    }
  };
  
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (!user) {
    return null; // No renderizar nada si el usuario no está autenticado
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      
      <Tabs defaultValue="products" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-charlotte-light/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Productos</h3>
                <p className="text-3xl font-bold">{products?.length || 0}</p>
              </div>
              <div className="bg-charlotte-light/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Pedidos Pendientes</h3>
                <p className="text-3xl font-bold">5</p>
              </div>
              <div className="bg-charlotte-light/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Ingresos Totales</h3>
                <p className="text-3xl font-bold">$24,560</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="products">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Input 
                placeholder="Buscar productos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-charlotte-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Producto
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Nuevo Producto</DialogTitle>
                    <DialogDescription>
                      Completa los detalles para crear un nuevo producto.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="product-name" className="text-right">
                        Nombre
                      </label>
                      <Input
                        id="product-name"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="product-price" className="text-right">
                        Precio
                      </label>
                      <Input
                        id="product-price"
                        type="number"
                        className="col-span-3"
                      />
                    </div>
                    {/* Más campos aquí */}
                  </div>
                  <DialogFooter>
                    <Button type="submit">Guardar producto</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {productsLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charlotte-primary"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts && filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-16 h-16 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{product.inventory_count || 0}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-red-500"
                                onClick={() => deleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-gray-500">No se encontraron productos</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Gestión de Pedidos</h2>
            <p>Esta funcionalidad está en desarrollo...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>
            <p>Esta funcionalidad está en desarrollo...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Configuración de la Tienda</h2>
            <p>Esta funcionalidad está en desarrollo...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
