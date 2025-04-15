
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
  BarChart,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  DialogClose
} from '@/components/ui/dialog';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabaseCustom, authFunctions } from '@/lib/supabase-custom';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { useForm } from 'react-hook-form';

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Verify admin access
  useEffect(() => {
    const checkAdmin = async () => {
      setIsCheckingAdmin(true);
      
      if (!user) {
        toast({
          title: 'Acceso no autorizado',
          description: 'Debes iniciar sesión para acceder al panel de administración.',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }
      
      try {
        // Check if user is admin
        const isUserAdmin = await authFunctions.checkAdminAccess(user.email || '');
        
        if (!isUserAdmin) {
          toast({
            title: 'Acceso no autorizado',
            description: 'No tienes permisos de administrador para acceder a esta página.',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: 'Error',
          description: 'Ocurrió un error al verificar tus permisos. Por favor, intenta de nuevo.',
          variant: 'destructive',
        });
      } finally {
        setIsCheckingAdmin(false);
      }
    };
    
    checkAdmin();
  }, [user, navigate, toast]);
  
  // Fetch products
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
    enabled: isAdmin, // Only fetch if user is admin
  });
  
  // Filter products based on search query
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Delete product
  const deleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
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
  
  // Edit product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductFormOpen(true);
  };
  
  // Create product form
  const ProductForm = ({ product, onClose }: { product: Product | null, onClose: () => void }) => {
    const form = useForm({
      defaultValues: product ? {
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        inventory_count: product.inventory_count || 0,
        is_new: product.is_new || false,
        discount_percentage: product.discount_percentage || 0,
        image: product.image
      } : {
        name: '',
        price: 0,
        description: '',
        category: '',
        inventory_count: 0,
        is_new: false,
        discount_percentage: 0,
        image: ''
      }
    });
    
    const onSubmit = async (data: any) => {
      try {
        if (product) {
          // Update existing product
          const { error } = await supabaseCustom
            .from('products')
            .update({
              ...data,
              updated_at: new Date().toISOString()
            })
            .eq('id', product.id);
            
          if (error) throw error;
          
          toast({
            title: 'Producto actualizado',
            description: 'El producto ha sido actualizado correctamente.'
          });
        } else {
          // Create new product
          const { error } = await supabaseCustom
            .from('products')
            .insert([{
              ...data,
              created_at: new Date().toISOString()
            }]);
            
          if (error) throw error;
          
          toast({
            title: 'Producto creado',
            description: 'El producto ha sido creado correctamente.'
          });
        }
        
        refetchProducts();
        onClose();
      } catch (error: any) {
        toast({
          title: 'Error',
          description: `No se pudo ${product ? 'actualizar' : 'crear'} el producto: ${error.message}`,
          variant: 'destructive'
        });
      }
    };
    
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del producto*</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio*</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" {...field} required />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="inventory_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inventario</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría*</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="women">Mujeres</SelectItem>
                    <SelectItem value="men">Hombres</SelectItem>
                    <SelectItem value="youth">Jóvenes</SelectItem>
                    <SelectItem value="baby">Bebés</SelectItem>
                    <SelectItem value="accessories">Accesorios</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción*</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} required />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de la imagen*</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                {field.value && (
                  <div className="mt-2">
                    <img src={field.value} alt="Vista previa" className="w-32 h-32 object-cover rounded" />
                  </div>
                )}
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="is_new"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input 
                      type="checkbox" 
                      checked={field.value} 
                      onChange={field.onChange}
                      className="mr-2"
                    />
                  </FormControl>
                  <FormLabel className="mt-0">Marcar como Nuevo</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="discount_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descuento (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="100" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {product ? 'Actualizar' : 'Guardar'} Producto
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };
  
  if (isCheckingAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charlotte-primary"></div>
        <span className="ml-3">Verificando permisos de administrador...</span>
      </div>
    );
  }
  
  if (!isAdmin) {
    return null; // Redirecting in the useEffect
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
        
        {/* Dashboard Tab */}
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
        
        {/* Products Tab */}
        <TabsContent value="products">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Input 
                placeholder="Buscar productos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
              <Button 
                className="bg-charlotte-primary"
                onClick={() => {
                  setSelectedProduct(null);
                  setProductFormOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Producto
              </Button>
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
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                              >
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
          
          {/* Product Form Dialog */}
          <Dialog open={productFormOpen} onOpenChange={setProductFormOpen}>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>{selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
                <DialogDescription>
                  {selectedProduct 
                    ? 'Modifica los detalles del producto existente.' 
                    : 'Completa los detalles para crear un nuevo producto.'}
                </DialogDescription>
              </DialogHeader>
              <ProductForm 
                product={selectedProduct} 
                onClose={() => setProductFormOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        {/* Orders Tab */}
        <TabsContent value="orders">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Gestión de Pedidos</h2>
            
            <div className="bg-charlotte-light/10 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-2">Filtros</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="processing">Procesando</SelectItem>
                      <SelectItem value="shipped">Enviado</SelectItem>
                      <SelectItem value="delivered">Entregado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha</label>
                  <Input type="date" />
                </div>
                <div className="flex items-end space-x-2">
                  <Button className="bg-charlotte-primary">Filtrar</Button>
                  <Button variant="outline">Limpiar</Button>
                </div>
              </div>
            </div>
            
            <p>Esta funcionalidad está en desarrollo. Pronto podrás gestionar los pedidos de los clientes.</p>
          </div>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>
            
            <div className="bg-charlotte-light/10 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium mb-2">Buscar Usuarios</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input placeholder="Buscar por nombre o email..." className="flex-1" />
                <Button className="bg-charlotte-primary">Buscar</Button>
              </div>
            </div>
            
            <p>Esta funcionalidad está en desarrollo. Pronto podrás gestionar los usuarios de la tienda.</p>
          </div>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Configuración de la Tienda</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-charlotte-light/10 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Configuración General</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="store-enabled" className="w-4 h-4" defaultChecked />
                    <label htmlFor="store-enabled">Tienda habilitada</label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Anuncio de la tienda</label>
                    <Textarea 
                      placeholder="Ej: ¡Envío gratis en pedidos mayores a $50!" 
                      className="w-full" 
                    />
                    <p className="text-sm text-gray-500 mt-1">Se mostrará en la parte superior de la tienda.</p>
                  </div>
                  
                  <Button className="bg-charlotte-primary">Guardar Configuración</Button>
                </div>
              </div>
              
              <div className="bg-charlotte-light/10 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Configuración de Envíos</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tarifa de envío ($)</label>
                    <Input type="number" step="0.01" min="0" defaultValue="5.00" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Umbral para envío gratuito ($)</label>
                    <Input type="number" step="0.01" min="0" defaultValue="50.00" />
                    <p className="text-sm text-gray-500 mt-1">Los pedidos por encima de este monto tendrán envío gratuito.</p>
                  </div>
                  
                  <Button className="bg-charlotte-primary">Guardar Configuración de Envíos</Button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-charlotte-light/10 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Supabase y Permisos de Base de Datos</h3>
              <p className="mb-4">
                Ten en cuenta que los cambios en los privilegios de columna no se reflejarán en las migraciones 
                cuando se ejecute <code>supabase db diff</code>. La versión actual de la CLI de Supabase no 
                admite privilegios de columna.
              </p>
              <p className="mb-4">
                Deberás aplicar manualmente estos cambios a tu base de datos. Cambiar los privilegios de las 
                columnas puede interrumpir las consultas existentes.
              </p>
              <p>
                Si eliminas el privilegio de columna de un rol, este perderá todo acceso a esa columna. 
                Todas las operaciones de selección * (incluidas las de INSERT, UPDATE y DELETE returning *) fallarán.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
