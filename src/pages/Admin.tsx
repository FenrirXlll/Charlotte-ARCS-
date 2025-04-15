
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  ShoppingBag, 
  MessageSquare, 
  Settings, 
  Users, 
  Plus, 
  Edit, 
  Trash, 
  Save, 
  X, 
  Upload,
  Image as ImageIcon,
  Check,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseCustom } from '@/lib/supabase-custom';
import { Product } from '@/types';

interface User {
  id: string;
  email: string;
  created_at: string;
  full_name?: string;
}

interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
  shipping_address: string;
  user_name?: string;
}

interface Comment {
  id: string;
  user_id: string;
  product_id: string;
  content: string;
  created_at: string;
  user_name?: string;
  product_name?: string;
}

const Admin = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    inventory_count: 0,
    is_new: false,
    discount_percentage: 0
  });
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  
  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  
  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  
  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentSearchQuery, setCommentSearchQuery] = useState('');
  
  // Check admin access
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para acceder al panel de administración",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate, toast]);
  
  // Load data based on active tab
  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'products') {
        loadProducts();
      } else if (activeTab === 'orders') {
        loadOrders();
      } else if (activeTab === 'users') {
        loadUsers();
      } else if (activeTab === 'comments') {
        loadComments();
      }
    }
  }, [activeTab, isAdmin]);
  
  // Load products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseCustom
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `No se pudieron cargar los productos: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load orders with user info
  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseCustom
        .from('orders')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Format orders with user name
      const formattedOrders = data.map(order => ({
        ...order,
        user_name: order.profiles?.full_name || 'Usuario'
      }));
      
      setOrders(formattedOrders);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `No se pudieron cargar los pedidos: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseCustom
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `No se pudieron cargar los usuarios: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load comments with user and product info
  const loadComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseCustom
        .from('comments')
        .select(`
          *,
          profiles:user_id (full_name),
          products:product_id (name)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Format comments with user and product names
      const formattedComments = data.map(comment => ({
        ...comment,
        user_name: comment.profiles?.full_name || 'Usuario',
        product_name: comment.products?.name || 'Producto'
      }));
      
      setComments(formattedComments);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `No se pudieron cargar los comentarios: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
    }
  };
  
  // Upload image to storage
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `product-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;
    
    const { error: uploadError } = await supabaseCustom.storage
      .from('images')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    const { data } = supabaseCustom.storage
      .from('images')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };
  
  // Create new product
  const createProduct = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!newProduct.name || !newProduct.description || newProduct.price <= 0 || !newProduct.category) {
        throw new Error('Por favor completa todos los campos requeridos');
      }
      
      let imageUrl = newProduct.image;
      
      // Upload image if one was selected
      if (uploadedImage) {
        imageUrl = await uploadImage(uploadedImage);
      }
      
      // Create product in database
      const { data, error } = await supabaseCustom
        .from('products')
        .insert([
          {
            ...newProduct,
            image: imageUrl,
            price: Number(newProduct.price),
            inventory_count: Number(newProduct.inventory_count),
            discount_percentage: Number(newProduct.discount_percentage) || null
          }
        ])
        .select();
        
      if (error) throw error;
      
      // Reset form and reload products
      setIsCreating(false);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        inventory_count: 0,
        is_new: false,
        discount_percentage: 0
      });
      setUploadedImage(null);
      
      toast({
        title: "Éxito",
        description: "Producto creado correctamente",
      });
      
      loadProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `No se pudo crear el producto: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Update existing product
  const updateProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      setLoading(true);
      
      let imageUrl = selectedProduct.image;
      
      // Upload new image if one was selected
      if (uploadedImage) {
        imageUrl = await uploadImage(uploadedImage);
      }
      
      // Update product in database
      const { error } = await supabaseCustom
        .from('products')
        .update({
          name: selectedProduct.name,
          description: selectedProduct.description,
          price: Number(selectedProduct.price),
          category: selectedProduct.category,
          image: imageUrl,
          inventory_count: Number(selectedProduct.inventory_count),
          is_new: selectedProduct.is_new,
          discount_percentage: Number(selectedProduct.discount_percentage) || null,
          updated_at: new Date()
        })
        .eq('id', selectedProduct.id);
        
      if (error) throw error;
      
      // Reset state and reload products
      setIsEditing(false);
      setSelectedProduct(null);
      setUploadedImage(null);
      
      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente",
      });
      
      loadProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `No se pudo actualizar el producto: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Delete product
  const deleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabaseCustom
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
      });
      
      loadProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `No se pudo eliminar el producto: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Update order status
  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabaseCustom
        .from('orders')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Estado del pedido actualizado correctamente",
      });
      
      loadOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `No se pudo actualizar el estado del pedido: ${error.message}`,
        variant: "destructive",
      });
    }
  };
  
  // Delete comment
  const deleteComment = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      return;
    }
    
    try {
      const { error } = await supabaseCustom
        .from('comments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Comentario eliminado correctamente",
      });
      
      loadComments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `No se pudo eliminar el comentario: ${error.message}`,
        variant: "destructive",
      });
    }
  };
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearchQuery.toLowerCase())
  );
  
  // Filter orders based on search query and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                          order.user_name?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                          order.shipping_address.toLowerCase().includes(orderSearchQuery.toLowerCase());
    
    const matchesStatus = orderStatusFilter ? order.status === orderStatusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(userSearchQuery.toLowerCase())
  );
  
  // Filter comments based on search query
  const filteredComments = comments.filter(comment => 
    comment.content.toLowerCase().includes(commentSearchQuery.toLowerCase()) ||
    comment.user_name?.toLowerCase().includes(commentSearchQuery.toLowerCase()) ||
    comment.product_name?.toLowerCase().includes(commentSearchQuery.toLowerCase())
  );
  
  if (authLoading) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charlotte-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-charlotte-primary">Panel de Administración</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 bg-white">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package size={18} /> Productos
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBag size={18} /> Pedidos
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={18} /> Usuarios
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare size={18} /> Comentarios
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={18} /> Configuración
          </TabsTrigger>
        </TabsList>
        
        {/* Products Tab */}
        <TabsContent value="products">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestión de Productos</h2>
              {!isCreating && !isEditing && (
                <Button 
                  onClick={() => setIsCreating(true)} 
                  className="bg-charlotte-primary hover:bg-charlotte-primary/90"
                >
                  <Plus size={16} className="mr-2" /> Añadir Producto
                </Button>
              )}
            </div>
            
            {/* Search products */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Create product form */}
            {isCreating && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Añadir Nuevo Producto</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsCreating(false)}
                  >
                    <X size={18} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre</label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Nombre del producto"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Categoría</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full rounded-md border border-gray-300 py-2 px-3"
                    >
                      <option value="">Seleccionar categoría</option>
                      <option value="women">Mujeres</option>
                      <option value="men">Hombres</option>
                      <option value="kids">Niños</option>
                      <option value="accessories">Accesorios</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Precio</label>
                    <Input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Inventario</label>
                    <Input
                      type="number"
                      value={newProduct.inventory_count}
                      onChange={(e) => setNewProduct({...newProduct, inventory_count: parseInt(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Descuento (%)</label>
                    <Input
                      type="number"
                      value={newProduct.discount_percentage}
                      onChange={(e) => setNewProduct({...newProduct, discount_percentage: parseInt(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea 
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Descripción del producto"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 min-h-[100px]"
                  />
                </div>
                
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="is_new"
                    checked={newProduct.is_new}
                    onChange={(e) => setNewProduct({...newProduct, is_new: e.target.checked})}
                    className="rounded mr-2"
                  />
                  <label htmlFor="is_new" className="text-sm font-medium">Marcar como nuevo</label>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Imagen</label>
                  <div className="flex items-center">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 mr-2 border border-gray-300">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <span className="flex items-center"><Upload size={16} className="mr-2" /> Seleccionar imagen</span>
                    </label>
                    <span className="text-sm text-gray-500">
                      {uploadedImage ? uploadedImage.name : 'Ningún archivo seleccionado'}
                    </span>
                  </div>
                  {uploadedImage && (
                    <div className="mt-2">
                      <img 
                        src={URL.createObjectURL(uploadedImage)} 
                        alt="Preview" 
                        className="h-32 w-auto object-cover rounded-md border border-gray-300" 
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreating(false)} 
                    className="mr-2"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={createProduct} 
                    disabled={loading}
                    className="bg-charlotte-primary hover:bg-charlotte-primary/90"
                  >
                    {loading ? 'Guardando...' : 'Guardar Producto'}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Edit product form */}
            {isEditing && selectedProduct && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Editar Producto</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedProduct(null);
                      setUploadedImage(null);
                    }}
                  >
                    <X size={18} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre</label>
                    <Input
                      value={selectedProduct.name}
                      onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                      placeholder="Nombre del producto"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Categoría</label>
                    <select
                      value={selectedProduct.category}
                      onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
                      className="w-full rounded-md border border-gray-300 py-2 px-3"
                    >
                      <option value="">Seleccionar categoría</option>
                      <option value="women">Mujeres</option>
                      <option value="men">Hombres</option>
                      <option value="kids">Niños</option>
                      <option value="accessories">Accesorios</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Precio</label>
                    <Input
                      type="number"
                      value={selectedProduct.price}
                      onChange={(e) => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Inventario</label>
                    <Input
                      type="number"
                      value={selectedProduct.inventory_count || 0}
                      onChange={(e) => setSelectedProduct({...selectedProduct, inventory_count: parseInt(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Descuento (%)</label>
                    <Input
                      type="number"
                      value={selectedProduct.discount_percentage || 0}
                      onChange={(e) => setSelectedProduct({...selectedProduct, discount_percentage: parseInt(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea 
                    value={selectedProduct.description}
                    onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                    placeholder="Descripción del producto"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 min-h-[100px]"
                  />
                </div>
                
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="edit_is_new"
                    checked={selectedProduct.is_new || false}
                    onChange={(e) => setSelectedProduct({...selectedProduct, is_new: e.target.checked})}
                    className="rounded mr-2"
                  />
                  <label htmlFor="edit_is_new" className="text-sm font-medium">Marcar como nuevo</label>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Imagen Actual</label>
                  <div className="flex items-center mb-2">
                    {selectedProduct.image ? (
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name} 
                        className="h-32 w-auto object-cover rounded-md border border-gray-300" 
                      />
                    ) : (
                      <div className="h-32 w-32 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300">
                        <ImageIcon size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <label className="block text-sm font-medium mb-1">Nueva Imagen (opcional)</label>
                  <div className="flex items-center">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 mr-2 border border-gray-300">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <span className="flex items-center"><Upload size={16} className="mr-2" /> Seleccionar imagen</span>
                    </label>
                    <span className="text-sm text-gray-500">
                      {uploadedImage ? uploadedImage.name : 'Ningún archivo seleccionado'}
                    </span>
                  </div>
                  {uploadedImage && (
                    <div className="mt-2">
                      <img 
                        src={URL.createObjectURL(uploadedImage)} 
                        alt="Preview" 
                        className="h-32 w-auto object-cover rounded-md border border-gray-300" 
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedProduct(null);
                      setUploadedImage(null);
                    }} 
                    className="mr-2"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={updateProduct} 
                    disabled={loading}
                    className="bg-charlotte-primary hover:bg-charlotte-primary/90"
                  >
                    {loading ? 'Guardando...' : 'Actualizar Producto'}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Products list */}
            {loading && !isCreating && !isEditing ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charlotte-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando productos...</p>
              </div>
            ) : (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">No se encontraron productos.</p>
                    {productSearchQuery && (
                      <Button 
                        variant="outline" 
                        onClick={() => setProductSearchQuery('')}
                      >
                        Limpiar búsqueda
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventario</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 whitespace-nowrap">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="h-12 w-12 object-cover rounded-md" 
                                />
                              ) : (
                                <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded-md">
                                  <ImageIcon size={20} className="text-gray-400" />
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              {product.name}
                              {product.is_new && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  Nuevo
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              {product.category === 'women' && 'Mujeres'}
                              {product.category === 'men' && 'Hombres'}
                              {product.category === 'kids' && 'Niños'}
                              {product.category === 'accessories' && 'Accesorios'}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              ${product.price.toFixed(2)}
                              {product.discount_percentage && product.discount_percentage > 0 && (
                                <span className="ml-2 text-xs text-rose-600">
                                  -{product.discount_percentage}%
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              {product.inventory_count || 0}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setIsEditing(true);
                                  }}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => deleteProduct(product.id)}
                                >
                                  <Trash size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
        
        {/* Orders Tab */}
        <TabsContent value="orders">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Gestión de Pedidos</h2>
            
            {/* Filter and search */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Buscar pedidos..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3"
                >
                  <option value="">Todos los estados</option>
                  <option value="pending">Pendiente</option>
                  <option value="processing">Procesando</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setOrderSearchQuery('');
                    setOrderStatusFilter('');
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
            
            {/* Orders list */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charlotte-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando pedidos...</p>
              </div>
            ) : (
              <>
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No se encontraron pedidos.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                          <div>
                            <h3 className="font-medium">Pedido #{order.id.substring(0, 8)}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString()} • 
                              Cliente: {order.user_name}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3 mt-2 md:mt-0">
                            <div className={`
                              px-2 py-1 rounded-md text-sm
                              ${order.status === 'pending' && 'bg-blue-100 text-blue-800'}
                              ${order.status === 'processing' && 'bg-yellow-100 text-yellow-800'}
                              ${order.status === 'shipped' && 'bg-indigo-100 text-indigo-800'}
                              ${order.status === 'delivered' && 'bg-green-100 text-green-800'}
                              ${order.status === 'cancelled' && 'bg-rose-100 text-rose-800'}
                            `}>
                              {order.status === 'pending' && 'Pendiente'}
                              {order.status === 'processing' && 'Procesando'}
                              {order.status === 'shipped' && 'Enviado'}
                              {order.status === 'delivered' && 'Entregado'}
                              {order.status === 'cancelled' && 'Cancelado'}
                            </div>
                            <select
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="rounded-md border border-gray-300 py-1 px-2 text-sm"
                            >
                              <option value="">Cambiar estado</option>
                              <option value="pending">Pendiente</option>
                              <option value="processing">Procesando</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregado</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between">
                            <div className="text-sm">
                              <strong>Dirección de envío:</strong> {order.shipping_address}
                            </div>
                            <div className="text-right">
                              <strong>Total:</strong> ${order.total.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Gestión de Usuarios</h2>
            
            {/* Search users */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Users list */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charlotte-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando usuarios...</p>
              </div>
            ) : (
              <>
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No se encontraron usuarios.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de registro</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 whitespace-nowrap text-sm">
                              {user.id.substring(0, 8)}...
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              {user.full_name || 'Sin nombre'}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              {user.email || 'Sin email'}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm">
                              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Sin fecha'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
        
        {/* Comments Tab */}
        <TabsContent value="comments">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Gestión de Comentarios</h2>
            
            {/* Search comments */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Buscar comentarios..."
                  value={commentSearchQuery}
                  onChange={(e) => setCommentSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Comments list */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charlotte-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando comentarios...</p>
              </div>
            ) : (
              <>
                {filteredComments.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No se encontraron comentarios.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredComments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between mb-2">
                          <div>
                            <span className="font-medium">{comment.user_name}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteComment(comment.id)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                        <p className="text-gray-700 mb-2">{comment.content}</p>
                        <div className="text-sm text-gray-500">
                          En producto: <span className="font-medium">{comment.product_name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Configuración de la Tienda</h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">Configuración de Envío</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Costo de Envío</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        placeholder="5.00"
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Envío Gratis a partir de</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        placeholder="50.00"
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">Notificaciones de la Tienda</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Mensaje Banner</label>
                  <textarea
                    placeholder="Ej: ¡Envío gratis en pedidos mayores a $50!"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 min-h-[80px]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este mensaje se mostrará en la parte superior de la tienda.
                  </p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">Información del Sitio</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre de la Tienda</label>
                    <Input defaultValue="Charlotte ARCS" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Descripción</label>
                    <textarea
                      defaultValue="Tienda especializada en moda con las últimas tendencias y diseños exclusivos para todos los estilos."
                      className="w-full rounded-md border border-gray-300 py-2 px-3 min-h-[80px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email de Contacto</label>
                    <Input defaultValue="info@charlottearcs.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono</label>
                    <Input defaultValue="+1 (800) CHARLOTTE" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dirección</label>
                    <Input defaultValue="Av. Charlotte 123, Ciudad de México" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="bg-charlotte-primary hover:bg-charlotte-primary/90">
                  <Save size={16} className="mr-2" /> Guardar Configuración
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
