
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Heart, ShoppingBag, Check, Star, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { supabaseCustom } from '@/lib/supabase-custom';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { addItem } = useCart();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist();
  
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabaseCustom
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });
  
  const { data: relatedProducts, isLoading: relatedLoading } = useQuery({
    queryKey: ['relatedProducts', product?.category],
    queryFn: async () => {
      const { data, error } = await supabaseCustom
        .from('products')
        .select('*')
        .eq('category', product?.category)
        .neq('id', id)
        .limit(4);
      
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!product?.category,
  });
  
  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast({
        title: 'Producto añadido',
        description: `${product.name} se ha añadido al carrito.`,
      });
    }
  };
  
  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: 'Eliminado de favoritos',
        description: `${product.name} se ha eliminado de tu lista de deseos.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: 'Añadido a favoritos',
        description: `${product.name} se ha añadido a tu lista de deseos.`,
      });
    }
  };
  
  if (productLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charlotte-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Producto no encontrado</h1>
        <p className="mb-6">No pudimos encontrar el producto que estás buscando.</p>
        <Button asChild>
          <Link to="/">Volver a la tienda</Link>
        </Button>
      </div>
    );
  }
  
  const hasDiscount = product.original_price !== undefined && product.original_price > product.price;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4 pl-0">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la tienda
          </Link>
        </Button>
        <div className="text-sm text-gray-500">
          <Link to="/" className="hover:text-charlotte-primary">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${product.category}`} className="hover:text-charlotte-primary">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-charlotte-primary">{product.name}</span>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg overflow-hidden shadow">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-charlotte-dark mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="h-5 w-5 text-yellow-400" 
                  fill={star <= 4 ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">(4.0) · 24 valoraciones</span>
          </div>
          
          <div className="flex items-center mb-6">
            <span className="text-2xl font-bold text-charlotte-dark">${product.price.toFixed(2)}</span>
            {hasDiscount && (
              <>
                <span className="ml-3 text-lg text-gray-500 line-through">${product.original_price?.toFixed(2)}</span>
                <span className="ml-3 bg-charlotte-accent text-white px-2 py-1 text-xs font-bold rounded-full">
                  {product.discount_percentage}% DESCUENTO
                </span>
              </>
            )}
          </div>
          
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad
            </label>
            <div className="flex items-center">
              <button 
                className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input 
                type="number" 
                id="quantity"
                value={quantity}
                min="1"
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0) {
                    setQuantity(value);
                  }
                }}
                className="w-16 px-3 py-2 border-t border-b border-gray-300 text-center"
              />
              <button 
                className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button 
              className="flex-1 bg-charlotte-primary hover:bg-charlotte-primary/90"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Añadir al carrito
            </Button>
            
            <Button
              variant="outline"
              className={`flex-1 ${isInWishlist(product.id) ? 'text-red-500 border-red-500' : ''}`}
              onClick={handleWishlistToggle}
            >
              <Heart 
                className={`mr-2 h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} 
              />
              {isInWishlist(product.id) ? 'En favoritos' : 'Añadir a favoritos'}
            </Button>
          </div>
          
          {/* Product Availability */}
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Check className="mr-2 h-4 w-4 text-green-500" />
            <span>
              {product.inventory_count && product.inventory_count > 0 
                ? `En stock (${product.inventory_count} disponibles)` 
                : 'Agotado'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Product Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Descripción</TabsTrigger>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="reviews">Valoraciones</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="bg-white p-6 rounded-lg shadow mt-4">
          <div className="prose max-w-none">
            <p>{product.description}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, eget ultricies nisl nunc eget nunc. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, eget ultricies nisl nunc eget nunc.</p>
          </div>
        </TabsContent>
        <TabsContent value="details" className="bg-white p-6 rounded-lg shadow mt-4">
          <table className="min-w-full">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 px-4 text-sm font-medium text-gray-500">Categoría</td>
                <td className="py-2 px-4 text-sm text-gray-900">{product.category}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm font-medium text-gray-500">Material</td>
                <td className="py-2 px-4 text-sm text-gray-900">Algodón, Poliéster</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm font-medium text-gray-500">Color</td>
                <td className="py-2 px-4 text-sm text-gray-900">Negro, Blanco, Rojo</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm font-medium text-gray-500">Tallas</td>
                <td className="py-2 px-4 text-sm text-gray-900">S, M, L, XL</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm font-medium text-gray-500">Código</td>
                <td className="py-2 px-4 text-sm text-gray-900">CH-{product.id.slice(0, 8)}</td>
              </tr>
            </tbody>
          </table>
        </TabsContent>
        <TabsContent value="reviews" className="bg-white p-6 rounded-lg shadow mt-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Valoraciones de clientes</h3>
            <div className="flex items-center mb-6">
              <div className="flex mr-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className="h-5 w-5 text-yellow-400" 
                    fill={star <= 4 ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">Basado en 24 valoraciones</span>
            </div>
            
            <div className="space-y-4">
              {/* Example Review Item */}
              <div className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className="h-4 w-4 text-yellow-400" 
                        fill={star <= 5 ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">María G.</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-xs text-gray-500">Hace 2 semanas</span>
                </div>
                <p className="text-sm text-gray-600">
                  ¡Excelente producto! La calidad es muy buena y me encanta cómo se ve.
                  Definitivamente compraré más productos de esta marca.
                </p>
              </div>
              
              {/* Example Review Item */}
              <div className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className="h-4 w-4 text-yellow-400" 
                        fill={star <= 4 ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">Carlos M.</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-xs text-gray-500">Hace 1 mes</span>
                </div>
                <p className="text-sm text-gray-600">
                  Muy buena relación calidad-precio. El producto llegó rápido y en perfectas condiciones.
                  Lo recomiendo.
                </p>
              </div>
            </div>
            
            <Button className="mt-6 bg-charlotte-primary">
              <MessageCircle className="mr-2 h-4 w-4" />
              Escribir una valoración
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                id={relatedProduct.id}
                name={relatedProduct.name}
                price={relatedProduct.price}
                originalPrice={relatedProduct.original_price}
                discountPercentage={relatedProduct.discount_percentage}
                image={relatedProduct.image}
                category={relatedProduct.category}
                isNew={relatedProduct.is_new}
                description={relatedProduct.description}
                inventoryCount={relatedProduct.inventory_count}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
