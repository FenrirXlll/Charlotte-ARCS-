
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Product, ProductImage, ProductDetail as ProductDetailType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { 
  Heart, 
  ShoppingCart, 
  ArrowLeft, 
  Star, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [additionalImages, setAdditionalImages] = useState<ProductImage[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addItem: addToWishlist, isInWishlist } = useWishlist();

  // Obtener los datos del producto y sus detalles
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Obtener el producto principal
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
          
        if (productError) throw productError;
        
        // Obtener las imágenes adicionales
        const { data: imagesData, error: imagesError } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', id)
          .order('display_order', { ascending: true });
          
        if (imagesError) throw imagesError;
        
        // Obtener los detalles del producto
        const { data: detailsData, error: detailsError } = await supabase
          .from('product_details')
          .select('*')
          .eq('product_id', id);
          
        if (detailsError) throw detailsError;
        
        setProduct(productData);
        setAdditionalImages(imagesData || []);
        setProductDetails(detailsData || []);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: `No se pudo cargar el producto: ${error.message}`,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, toast]);

  // Función para calcular descuento
  const calculateDiscount = () => {
    if (!product?.original_price || !product?.discount_percentage) return null;
    
    return {
      originalPrice: product.original_price,
      discountPercentage: product.discount_percentage,
      savings: product.original_price - product.price
    };
  };

  // Función para manejar la navegación de imágenes
  const handleImageNavigation = (direction: 'prev' | 'next') => {
    const allImages = [product?.image || '', ...(additionalImages?.map(img => img.image_url) || [])];
    const totalImages = allImages.length;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  // Obtener todas las imágenes del producto
  const allImages = product
    ? [product.image, ...(additionalImages?.map(img => img.image_url) || [])]
    : [];

  // Manejar la adición al carrito
  const handleAddToCart = () => {
    if (!product) return;
    
    addItem(product, selectedQuantity);
    toast({
      title: 'Añadido al carrito',
      description: `${product.name} (${selectedQuantity}) añadido al carrito.`,
    });
  };

  // Manejar la adición a la lista de deseos
  const handleAddToWishlist = () => {
    if (!product) return;
    
    addToWishlist(product);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charlotte-primary"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Button onClick={() => navigate('/')}>Volver a la tienda</Button>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center mb-8 text-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} className="mr-2" />
          Volver a la tienda
        </Button>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-muted-foreground">{product.category}</span>
        <ChevronRight size={16} className="mx-2" />
        <span>{product.name}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <div className="relative">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
            <img 
              src={allImages[currentImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
            
            {/* Indicador de producto nuevo */}
            {product.is_new && (
              <div className="absolute top-4 left-4 bg-charlotte-primary text-white px-2 py-1 rounded-md text-xs">
                Nuevo
              </div>
            )}
            
            {/* Navegación de imágenes */}
            {allImages.length > 1 && (
              <>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full"
                  onClick={() => handleImageNavigation('prev')}
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
                  onClick={() => handleImageNavigation('next')}
                >
                  <ChevronRight size={20} />
                </Button>
              </>
            )}
          </div>
          
          {/* Miniaturas */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-16 h-16 rounded-md flex-shrink-0 border-2 overflow-hidden ${
                    currentImageIndex === idx ? 'border-charlotte-primary' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Miniatura ${idx + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Información del producto */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          {/* Precio y descuento */}
          <div className="flex items-center mb-4">
            <span className="text-2xl font-semibold">${product.price.toFixed(2)}</span>
            
            {discount && (
              <>
                <span className="text-gray-500 line-through ml-2">${discount.originalPrice.toFixed(2)}</span>
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                  {discount.discountPercentage}% OFF
                </span>
              </>
            )}
          </div>
          
          {/* Stock */}
          <div className="mb-6">
            {product.inventory_count > 0 ? (
              <div className="text-green-600 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                Disponible ({product.inventory_count} en stock)
              </div>
            ) : (
              <div className="text-red-600 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-red-600 mr-2"></span>
                Agotado
              </div>
            )}
          </div>
          
          {/* Descripción */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Descripción</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          {/* Selector de cantidad */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Cantidad</h2>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setSelectedQuantity(prev => Math.max(1, prev - 1))}
                disabled={selectedQuantity <= 1}
              >
                -
              </Button>
              <span className="mx-4 font-medium w-8 text-center">{selectedQuantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setSelectedQuantity(prev => prev + 1)}
                disabled={selectedQuantity >= product.inventory_count}
              >
                +
              </Button>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex gap-4 mb-8">
            <Button 
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.inventory_count <= 0}
            >
              <ShoppingCart size={20} className="mr-2" />
              Añadir al carrito
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleAddToWishlist}
              className={isInWishlist(product.id) ? 'text-red-500' : ''}
            >
              <Heart size={20} className={isInWishlist(product.id) ? 'fill-current' : ''} />
            </Button>
          </div>
          
          {/* Especificaciones técnicas */}
          {productDetails.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Especificaciones</h2>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {productDetails.map((detail, idx) => (
                      <div 
                        key={idx} 
                        className="py-3 px-4 flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-600">{detail.specification_key}</span>
                        <span className="font-medium">{detail.specification_value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      {/* Productos relacionados se podrían agregar aquí */}
    </div>
  );
};

export default ProductDetail;
