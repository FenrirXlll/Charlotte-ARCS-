
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Product, Category, ProductImage, ProductDetail } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Pencil, 
  Plus, 
  Save, 
  Trash2, 
  ImagePlus, 
  Layout, 
  Package,
  Tag,
  Settings,
  ShoppingBag,
  LogOut,
  Image as ImageIcon
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentTab, setCurrentTab] = useState('products');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    is_new: false,
    inventory_count: 10,
  });
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    slug: '',
    image: '',
  });
  const [newProductImages, setNewProductImages] = useState<Partial<ProductImage>[]>([]);
  const [newProductDetails, setNewProductDetails] = useState<Partial<ProductDetail>[]>([
    { specification_key: '', specification_value: '' }
  ]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [productImages, setProductImages] = useState<Record<string, ProductImage[]>>({});
  const [productDetails, setProductDetails] = useState<Record<string, ProductDetail[]>>({});
  const { toast } = useToast();
  const { uploadImage, uploading } = useImageUpload();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Comprobar si el usuario está autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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
        
        // Cargar imágenes adicionales de cada producto
        const productIds = (data || []).map(p => p.id);
        
        if (productIds.length > 0) {
          const { data: imagesData, error: imagesError } = await supabase
            .from('product_images')
            .select('*')
            .in('product_id', productIds);
            
          if (imagesError) throw imagesError;
          
          // Agrupar las imágenes por product_id
          const imagesMap: Record<string, ProductImage[]> = {};
          (imagesData || []).forEach((img) => {
            if (!imagesMap[img.product_id]) {
              imagesMap[img.product_id] = [];
            }
            imagesMap[img.product_id].push(img);
          });
          
          setProductImages(imagesMap);
        }
        
        // Cargar detalles de cada producto
        if (productIds.length > 0) {
          const { data: detailsData, error: detailsError } = await supabase
            .from('product_details')
            .select('*')
            .in('product_id', productIds);
            
          if (detailsError) throw detailsError;
          
          // Agrupar los detalles por product_id
          const detailsMap: Record<string, ProductDetail[]> = {};
          (detailsData || []).forEach((detail) => {
            if (!detailsMap[detail.product_id]) {
              detailsMap[detail.product_id] = [];
            }
            detailsMap[detail.product_id].push(detail);
          });
          
          setProductDetails(detailsMap);
        }
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

    // Cargar categorías
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });
          
        if (error) throw error;
        setCategories(data || []);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: `No se pudieron cargar las categorías: ${error.message}`,
          variant: 'destructive',
        });
      }
    };

    fetchProducts();
    fetchCategories();
  }, [toast]);

  // Función para sanitizar slugs
  const sanitizeSlug = (text: string) => {
    const slug = text
      .toLowerCase()
      .replace(/[áäàâã]/g, 'a')
      .replace(/[éëèê]/g, 'e')
      .replace(/[íïìî]/g, 'i')
      .replace(/[óöòôõ]/g, 'o')
      .replace(/[úüùû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
    return slug;
  };

  // Función para subir una imagen
  const handleUploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setField: (value: string) => void
  ) => {
    const files = event.target.files;
    if (!files || !files.length) return;
    
    const file = files[0];
    const url = await uploadImage(file);
    
    if (url) {
      setField(url);
    }
  };

  // FUNCIONES PARA GESTIONAR PRODUCTOS
  
  // Función para editar producto
  const handleEditStart = (product: Product) => {
    setEditingProduct(product);
    // Reset las imágenes y detalles adicionales para este producto
    setNewProductImages(productImages[product.id] || []);
    setNewProductDetails(productDetails[product.id] || [
      { specification_key: '', specification_value: '' }
    ]);
  };

  const handleEditCancel = () => {
    setEditingProduct(null);
    setNewProductImages([]);
    setNewProductDetails([{ specification_key: '', specification_value: '' }]);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      // Actualizar producto principal
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
          inventory_count: editingProduct.inventory_count,
          updated_at: new Date().toISOString()
        })
        .match({ id: editingProduct.id });
        
      if (error) throw error;
      
      // Actualizar imágenes adicionales del producto
      // Primero, eliminamos todas las imágenes existentes
      await supabase
        .from('product_images')
        .delete()
        .match({ product_id: editingProduct.id });
      
      // Luego, insertamos las nuevas imágenes
      if (newProductImages.length > 0) {
        const imagesToInsert = newProductImages
          .filter(img => img.image_url && img.image_url.trim() !== '')
          .map((img, index) => ({
            product_id: editingProduct.id,
            image_url: img.image_url,
            display_order: index
          }));
        
        if (imagesToInsert.length > 0) {
          const { error: imagesError } = await supabase
            .from('product_images')
            .insert(imagesToInsert);
            
          if (imagesError) throw imagesError;
        }
      }
      
      // Actualizar detalles del producto
      // Primero, eliminamos todos los detalles existentes
      await supabase
        .from('product_details')
        .delete()
        .match({ product_id: editingProduct.id });
      
      // Luego, insertamos los nuevos detalles
      if (newProductDetails.length > 0) {
        const detailsToInsert = newProductDetails
          .filter(detail => detail.specification_key && detail.specification_value)
          .map(detail => ({
            product_id: editingProduct.id,
            specification_key: detail.specification_key,
            specification_value: detail.specification_value
          }));
        
        if (detailsToInsert.length > 0) {
          const { error: detailsError } = await supabase
            .from('product_details')
            .insert(detailsToInsert);
            
          if (detailsError) throw detailsError;
        }
      }
      
      // Actualizar lista de productos
      setProducts(prev => 
        prev.map(p => p.id === editingProduct.id ? {
          ...editingProduct,
          updated_at: new Date().toISOString()
        } : p)
      );
      
      // Actualizar las imágenes y detalles en los estados locales
      if (newProductImages.length > 0) {
        setProductImages(prev => ({
          ...prev,
          [editingProduct.id]: newProductImages.map((img, index) => ({
            ...img,
            id: img.id || crypto.randomUUID(),
            product_id: editingProduct.id,
            display_order: index,
            created_at: new Date().toISOString()
          })) as ProductImage[]
        }));
      } else {
        // Si no hay imágenes, eliminar la entrada del objeto
        const newProductImagesState = { ...productImages };
        delete newProductImagesState[editingProduct.id];
        setProductImages(newProductImagesState);
      }
      
      if (newProductDetails.length > 0) {
        setProductDetails(prev => ({
          ...prev,
          [editingProduct.id]: newProductDetails.map(detail => ({
            ...detail,
            id: detail.id || crypto.randomUUID(),
            product_id: editingProduct.id,
            created_at: new Date().toISOString()
          })) as ProductDetail[]
        }));
      } else {
        // Si no hay detalles, eliminar la entrada del objeto
        const newProductDetailsState = { ...productDetails };
        delete newProductDetailsState[editingProduct.id];
        setProductDetails(newProductDetailsState);
      }
      
      setEditingProduct(null);
      setNewProductImages([]);
      setNewProductDetails([{ specification_key: '', specification_value: '' }]);
      
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
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleAddProductImage = () => {
    setNewProductImages(prev => [...prev, { image_url: '', display_order: prev.length }]);
  };

  const handleRemoveProductImage = (index: number) => {
    setNewProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleProductImageChange = (index: number, value: string) => {
    setNewProductImages(prev => 
      prev.map((img, i) => i === index ? { ...img, image_url: value } : img)
    );
  };

  const handleAddProductDetail = () => {
    setNewProductDetails(prev => [
      ...prev, 
      { specification_key: '', specification_value: '' }
    ]);
  };

  const handleRemoveProductDetail = (index: number) => {
    setNewProductDetails(prev => prev.filter((_, i) => i !== index));
  };

  const handleProductDetailChange = (
    index: number, 
    field: 'specification_key' | 'specification_value', 
    value: string
  ) => {
    setNewProductDetails(prev => 
      prev.map((detail, i) => i === index ? { ...detail, [field]: value } : detail)
    );
  };

  const handleCreateProduct = async () => {
    try {
      // Validar que los campos requeridos están presentes
      if (!newProduct.name || !newProduct.description || !newProduct.image || !newProduct.category) {
        toast({
          title: 'Error',
          description: 'Por favor, complete todos los campos requeridos',
          variant: 'destructive',
        });
        return;
      }
      
      const now = new Date().toISOString();
      
      // Crear el producto principal
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price || 0,
          original_price: newProduct.original_price,
          discount_percentage: newProduct.discount_percentage,
          image: newProduct.image,
          category: newProduct.category,
          is_new: newProduct.is_new || false,
          inventory_count: newProduct.inventory_count || 0,
          created_at: now,
          updated_at: now
        }])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const createdProduct = data[0];
        
        // Añadir imágenes adicionales
        const validImages = newProductImages
          .filter(img => img.image_url && img.image_url.trim() !== '')
          .map((img, index) => ({
            product_id: createdProduct.id,
            image_url: img.image_url,
            display_order: index
          }));
        
        if (validImages.length > 0) {
          const { error: imagesError } = await supabase
            .from('product_images')
            .insert(validImages);
            
          if (imagesError) throw imagesError;
        }
        
        // Añadir detalles del producto
        const validDetails = newProductDetails
          .filter(detail => detail.specification_key && detail.specification_value)
          .map(detail => ({
            product_id: createdProduct.id,
            specification_key: detail.specification_key,
            specification_value: detail.specification_value
          }));
        
        if (validDetails.length > 0) {
          const { error: detailsError } = await supabase
            .from('product_details')
            .insert(validDetails);
            
          if (detailsError) throw detailsError;
        }
        
        // Añadir producto a la lista
        setProducts(prev => [createdProduct, ...prev]);
        
        // Añadir imágenes y detalles a los estados locales
        if (validImages.length > 0) {
          setProductImages(prev => ({
            ...prev,
            [createdProduct.id]: validImages.map((img, index) => ({
              id: crypto.randomUUID(),
              product_id: createdProduct.id,
              image_url: img.image_url,
              display_order: index,
              created_at: now
            }))
          }));
        }
        
        if (validDetails.length > 0) {
          setProductDetails(prev => ({
            ...prev,
            [createdProduct.id]: validDetails.map(detail => ({
              id: crypto.randomUUID(),
              product_id: createdProduct.id,
              specification_key: detail.specification_key,
              specification_value: detail.specification_value,
              created_at: now
            }))
          }));
        }
        
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
        
        setNewProductImages([]);
        setNewProductDetails([{ specification_key: '', specification_value: '' }]);
        
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
      
      // Eliminar imágenes y detalles de los estados locales
      const newProductImagesState = { ...productImages };
      delete newProductImagesState[id];
      setProductImages(newProductImagesState);
      
      const newProductDetailsState = { ...productDetails };
      delete newProductDetailsState[id];
      setProductDetails(newProductDetailsState);
      
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
  
  // FUNCIONES PARA GESTIONAR CATEGORÍAS
  
  // Función para editar categoría
  const handleEditCategoryStart = (category: Category) => {
    setEditingCategory(category);
  };

  const handleEditCategoryCancel = () => {
    setEditingCategory(null);
  };

  const handleEditCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (!editingCategory) return;
    
    // Si es el campo 'name', también actualizar el slug
    if (name === 'name') {
      setEditingCategory({
        ...editingCategory,
        name: value,
        slug: sanitizeSlug(value)
      });
    } else {
      setEditingCategory({
        ...editingCategory,
        [name]: value
      });
    }
  };

  const handleEditCategorySave = async () => {
    if (!editingCategory) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: editingCategory.name,
          slug: editingCategory.slug,
          image: editingCategory.image
        })
        .match({ id: editingCategory.id });
        
      if (error) throw error;
      
      // Actualizar lista de categorías
      setCategories(prev => 
        prev.map(c => c.id === editingCategory.id ? editingCategory : c)
      );
      
      setEditingCategory(null);
      
      toast({
        title: 'Éxito',
        description: 'Categoría actualizada correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `No se pudo actualizar la categoría: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  // Función para crear categoría
  const handleCreateCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Si es el campo 'name', también actualizar el slug
    if (name === 'name') {
      setNewCategory({
        ...newCategory,
        name: value,
        slug: sanitizeSlug(value)
      });
    } else {
      setNewCategory({
        ...newCategory,
        [name]: value
      });
    }
  };

  const handleCreateCategory = async () => {
    try {
      // Validar que los campos requeridos están presentes
      if (!newCategory.name || !newCategory.slug) {
        toast({
          title: 'Error',
          description: 'Por favor, complete el nombre de la categoría',
          variant: 'destructive',
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: newCategory.name,
          slug: newCategory.slug,
          image: newCategory.image
        }])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Añadir categoría a la lista
        setCategories(prev => [...prev, data[0]]);
        
        // Resetear formulario
        setNewCategory({
          name: '',
          slug: '',
          image: ''
        });
        
        setIsCreatingCategory(false);
        
        toast({
          title: 'Éxito',
          description: 'Categoría creada correctamente',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `No se pudo crear la categoría: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  // Función para eliminar categoría
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .match({ id });
        
      if (error) throw error;
      
      // Eliminar categoría de la lista
      setCategories(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: 'Éxito',
        description: 'Categoría eliminada correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `No se pudo eliminar la categoría: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  // Función para cerrar sesión
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
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
        <Button onClick={handleSignOut} variant="outline">
          <LogOut size={16} className="mr-2" />
          Cerrar sesión
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="space-y-2">
            <button
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-md ${currentTab === 'products' ? 'bg-charlotte-primary text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setCurrentTab('products')}
            >
              <Package size={18} />
              <span>Productos</span>
            </button>
            <button
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-md ${currentTab === 'categories' ? 'bg-charlotte-primary text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setCurrentTab('categories')}
            >
              <Tag size={18} />
              <span>Categorías</span>
            </button>
            <button
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-md ${currentTab === 'images' ? 'bg-charlotte-primary text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setCurrentTab('images')}
            >
              <ImageIcon size={18} />
              <span>Imágenes</span>
            </button>
            <button
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-md ${currentTab === 'settings' ? 'bg-charlotte-primary text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setCurrentTab('settings')}
            >
              <Settings size={18} />
              <span>Configuración</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow">
          {/* Pestaña de Productos */}
          {currentTab === 'products' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Gestión de Productos</h2>
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
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Crear Nuevo Producto</CardTitle>
                    <CardDescription>Añade un nuevo producto a tu tienda</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
                        <Input
                          name="name"
                          value={newProduct.name}
                          onChange={handleCreateChange}
                          placeholder="Nombre del producto"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría*</label>
                        <Select 
                          onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}
                          value={newProduct.category}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio*</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
                        <Input
                          type="number"
                          name="discount_percentage"
                          value={newProduct.discount_percentage || ''}
                          onChange={handleCreateChange}
                          placeholder="Porcentaje de descuento"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal*</label>
                        <div className="flex gap-2">
                          <Input
                            name="image"
                            value={newProduct.image}
                            onChange={handleCreateChange}
                            placeholder="URL de la imagen"
                            className="flex-1"
                          />
                          <div className="relative">
                            <Button 
                              type="button" 
                              variant="outline"
                              className="relative"
                              disabled={uploading}
                            >
                              <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={(e) => handleUploadImage(e, (url) => setNewProduct({ ...newProduct, image: url }))}
                              />
                              <ImagePlus size={16} className="mr-1" /> Subir
                            </Button>
                            {uploading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-charlotte-primary"></div>
                              </div>
                            )}
                          </div>
                        </div>
                        {newProduct.image && (
                          <div className="mt-2">
                            <img 
                              src={newProduct.image} 
                              alt="Vista previa" 
                              className="h-20 w-20 object-cover rounded-md border"
                            />
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción*</label>
                        <Textarea
                          name="description"
                          value={newProduct.description}
                          onChange={handleCreateChange}
                          placeholder="Descripción del producto"
                          className="w-full h-32"
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

                    {/* Imágenes adicionales */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium">Imágenes Adicionales</h3>
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="outline" 
                          onClick={handleAddProductImage}
                        >
                          <Plus size={16} className="mr-1" /> Añadir Imagen
                        </Button>
                      </div>
                      {newProductImages.map((image, index) => (
                        <div key={index} className="flex gap-2 items-center mb-2">
                          <Input
                            value={image.image_url}
                            onChange={(e) => handleProductImageChange(index, e.target.value)}
                            placeholder="URL de la imagen"
                            className="flex-1"
                          />
                          <div className="relative">
                            <Button 
                              type="button" 
                              variant="outline"
                              size="icon"
                              className="relative"
                              disabled={uploading}
                            >
                              <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={(e) => handleUploadImage(e, (url) => handleProductImageChange(index, url))}
                              />
                              <ImagePlus size={16} />
                            </Button>
                            {uploading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-charlotte-primary"></div>
                              </div>
                            )}
                          </div>
                          <Button 
                            type="button" 
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveProductImage(index)}
                          >
                            <Trash2 size={16} />
                          </Button>
                          {image.image_url && (
                            <img 
                              src={image.image_url} 
                              alt={`Imagen ${index + 1}`} 
                              className="h-10 w-10 object-cover rounded-md border"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Detalles del producto */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium">Especificaciones Técnicas</h3>
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="outline" 
                          onClick={handleAddProductDetail}
                        >
                          <Plus size={16} className="mr-1" /> Añadir Especificación
                        </Button>
                      </div>
                      {newProductDetails.map((detail, index) => (
                        <div key={index} className="flex gap-2 items-center mb-2">
                          <Input
                            value={detail.specification_key || ''}
                            onChange={(e) => handleProductDetailChange(index, 'specification_key', e.target.value)}
                            placeholder="Característica"
                            className="flex-1"
                          />
                          <Input
                            value={detail.specification_value || ''}
                            onChange={(e) => handleProductDetailChange(index, 'specification_value', e.target.value)}
                            placeholder="Valor"
                            className="flex-1"
                          />
                          <Button 
                            type="button" 
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveProductDetail(index)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleCreateProduct} className="w-full md:w-auto">
                        Crear Producto
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lista de productos */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Inventario</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product.id}>
                        {editingProduct && editingProduct.id === product.id ? (
                          // Modo edición
                          <>
                            <TableCell>
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-2 items-center">
                                  <Input
                                    name="image"
                                    value={editingProduct.image}
                                    onChange={handleEditChange}
                                    placeholder="URL de la imagen"
                                    className="w-full"
                                  />
                                  <div className="relative">
                                    <Button 
                                      type="button" 
                                      variant="outline"
                                      size="icon"
                                      className="relative"
                                      disabled={uploading}
                                    >
                                      <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={(e) => handleUploadImage(e, (url) => setEditingProduct({ ...editingProduct, image: url }))}
                                      />
                                      <ImagePlus size={16} />
                                    </Button>
                                    {uploading && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-charlotte-primary"></div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {editingProduct.image && (
                                  <img 
                                    src={editingProduct.image} 
                                    alt={editingProduct.name} 
                                    className="h-16 w-16 object-cover rounded-md border"
                                  />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                name="name"
                                value={editingProduct.name}
                                onChange={handleEditChange}
                                placeholder="Nombre del producto"
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <Select 
                                onValueChange={(value) => setEditingProduct(prev => prev ? { ...prev, category: value } : prev)}
                                value={editingProduct.category}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.name}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="price"
                                value={editingProduct.price}
                                onChange={handleEditChange}
                                placeholder="Precio"
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="inventory_count"
                                value={editingProduct.inventory_count}
                                onChange={handleEditChange}
                                placeholder="Inventario"
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" onClick={handleEditSave} className="bg-green-500 hover:bg-green-600">
                                  <Save size={16} />
                                </Button>
                                <Button size="sm" onClick={handleEditCancel} variant="outline">
                                  Cancelar
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          // Modo visualización
                          <>
                            <TableCell>
                              <img src={product.image} alt={product.name} className="h-10 w-10 object-cover rounded" />
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.inventory_count}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" onClick={() => handleEditStart(product)} variant="outline">
                                  <Pencil size={16} className="mr-1" /> Editar
                                </Button>
                                <Button size="sm" onClick={() => handleDeleteProduct(product.id)} variant="destructive">
                                  <Trash2 size={16} className="mr-1" /> Eliminar
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Pestaña de Categorías */}
          {currentTab === 'categories' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Gestión de Categorías</h2>
                <Button onClick={() => setIsCreatingCategory(!isCreatingCategory)}>
                  {isCreatingCategory ? 'Cancelar' : (
                    <>
                      <Plus size={16} className="mr-2" />
                      Nueva Categoría
                    </>
                  )}
                </Button>
              </div>

              {/* Formulario para crear categoría */}
              {isCreatingCategory && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Crear Nueva Categoría</CardTitle>
                    <CardDescription>Añade una nueva categoría para organizar tus productos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
                        <Input
                          name="name"
                          value={newCategory.name}
                          onChange={handleCreateCategoryChange}
                          placeholder="Nombre de la categoría"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug*</label>
                        <Input
                          name="slug"
                          value={newCategory.slug}
                          onChange={handleCreateCategoryChange}
                          placeholder="URL amigable"
                          className="w-full"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                        <div className="flex gap-2">
                          <Input
                            name="image"
                            value={newCategory.image}
                            onChange={handleCreateCategoryChange}
                            placeholder="URL de la imagen"
                            className="flex-1"
                          />
                          <div className="relative">
                            <Button 
                              type="button" 
                              variant="outline"
                              className="relative"
                              disabled={uploading}
                            >
                              <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={(e) => handleUploadImage(e, (url) => setNewCategory({ ...newCategory, image: url }))}
                              />
                              <ImagePlus size={16} className="mr-1" /> Subir
                            </Button>
                            {uploading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-charlotte-primary"></div>
                              </div>
                            )}
                          </div>
                        </div>
                        {newCategory.image && (
                          <div className="mt-2">
                            <img 
                              src={newCategory.image} 
                              alt="Vista previa" 
                              className="h-20 w-20 object-cover rounded-md border"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleCreateCategory} className="w-full md:w-auto">
                        Crear Categoría
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lista de categorías */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map(category => (
                      <TableRow key={category.id}>
                        {editingCategory && editingCategory.id === category.id ? (
                          // Modo edición
                          <>
                            <TableCell>
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-2 items-center">
                                  <Input
                                    name="image"
                                    value={editingCategory.image}
                                    onChange={handleEditCategoryChange}
                                    placeholder="URL de la imagen"
                                    className="w-full"
                                  />
                                  <div className="relative">
                                    <Button 
                                      type="button" 
                                      variant="outline"
                                      size="icon"
                                      className="relative"
                                      disabled={uploading}
                                    >
                                      <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={(e) => handleUploadImage(e, (url) => setEditingCategory({ ...editingCategory, image: url }))}
                                      />
                                      <ImagePlus size={16} />
                                    </Button>
                                    {uploading && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-charlotte-primary"></div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {editingCategory.image && (
                                  <img 
                                    src={editingCategory.image} 
                                    alt={editingCategory.name} 
                                    className="h-16 w-16 object-cover rounded-md border"
                                  />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                name="name"
                                value={editingCategory.name}
                                onChange={handleEditCategoryChange}
                                placeholder="Nombre de la categoría"
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                name="slug"
                                value={editingCategory.slug}
                                onChange={handleEditCategoryChange}
                                placeholder="Slug"
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" onClick={handleEditCategorySave} className="bg-green-500 hover:bg-green-600">
                                  <Save size={16} />
                                </Button>
                                <Button size="sm" onClick={handleEditCategoryCancel} variant="outline">
                                  Cancelar
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          // Modo visualización
                          <>
                            <TableCell>
                              {category.image ? (
                                <img src={category.image} alt={category.name} className="h-10 w-10 object-cover rounded" />
                              ) : (
                                <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                                  <Tag size={16} />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>{category.slug}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" onClick={() => handleEditCategoryStart(category)} variant="outline">
                                  <Pencil size={16} className="mr-1" /> Editar
                                </Button>
                                <Button size="sm" onClick={() => handleDeleteCategory(category.id)} variant="destructive">
                                  <Trash2 size={16} className="mr-1" /> Eliminar
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Pestaña de Gestión de Imágenes */}
          {currentTab === 'images' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Gestión de Imágenes</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Subir Imágenes</CardTitle>
                  <CardDescription>Sube imágenes a tu tienda para utilizarlas en tus productos y categorías</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center">
                        <ImagePlus size={48} className="text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Subir Imágenes</h3>
                        <p className="text-gray-500 mb-4">Arrastra y suelta tus imágenes aquí, o haz clic para seleccionarlas</p>
                        <div className="relative">
                          <Button className="relative" disabled={uploading}>
                            <input
                              type="file"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              accept="image/*"
                              onChange={(e) => handleUploadImage(e, (url) => {
                                if (url) {
                                  toast({
                                    title: 'Imagen subida',
                                    description: 'La imagen se ha subido correctamente. Copia la URL para usarla en tus productos.',
                                  });
                                }
                              })}
                            />
                            Seleccionar Imágenes
                          </Button>
                          {uploading && (
                            <div className="mt-2 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-charlotte-primary mr-2"></div>
                              <span>Subiendo...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-md font-medium mb-2">Nota sobre las imágenes</h3>
                      <p className="text-sm text-gray-600">
                        En este momento, las imágenes se simulan con URLs de ejemplo. En un entorno de producción, configurarías Supabase Storage para guardar tus propias imágenes. Las URLs de las imágenes subidas se pueden usar para productos y categorías.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Pestaña de Configuración */}
          {currentTab === 'settings' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Configuración de la Tienda</h2>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Información de la Tienda</CardTitle>
                  <CardDescription>Configura la información básica de tu tienda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Tienda</label>
                      <Input
                        placeholder="Nombre de la tienda"
                        defaultValue="Mi Tienda Online"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contacto</label>
                      <Input
                        type="email"
                        placeholder="Email de contacto"
                        defaultValue="contacto@mitienda.com"
                        className="w-full"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la Tienda</label>
                      <Textarea
                        placeholder="Descripción breve de tu tienda"
                        defaultValue="Tu tienda online con los mejores productos tecnológicos."
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <Input
                        placeholder="Teléfono de contacto"
                        defaultValue="+1234567890"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                      <Input
                        placeholder="Dirección física"
                        defaultValue="Calle Ejemplo 123, Ciudad"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button>Guardar Cambios</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Configuración Avanzada</CardTitle>
                  <CardDescription>Opciones avanzadas de la tienda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Modo Mantenimiento</h3>
                        <p className="text-sm text-gray-500">Poner la tienda en modo mantenimiento</p>
                      </div>
                      <div className="flex items-center h-6">
                        <input
                          id="maintenance"
                          aria-describedby="maintenance-description"
                          name="maintenance"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-charlotte-primary focus:ring-charlotte-primary"
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Mostrar Productos Agotados</h3>
                        <p className="text-sm text-gray-500">Mostrar productos sin stock en la tienda</p>
                      </div>
                      <div className="flex items-center h-6">
                        <input
                          id="show-out-of-stock"
                          name="show-out-of-stock"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-charlotte-primary focus:ring-charlotte-primary"
                          defaultChecked
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Permitir Reseñas de Productos</h3>
                        <p className="text-sm text-gray-500">Permitir que los usuarios dejen reseñas en los productos</p>
                      </div>
                      <div className="flex items-center h-6">
                        <input
                          id="allow-reviews"
                          name="allow-reviews"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-charlotte-primary focus:ring-charlotte-primary"
                          defaultChecked
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button>Guardar Configuración</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
