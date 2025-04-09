
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  image: string;
  category: string;
  isNew?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  discountPercentage,
  image,
  category,
  isNew = false
}) => {
  const hasDiscount = originalPrice !== undefined && originalPrice > price;
  
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Product Badge (New or Discount) */}
      {(isNew || hasDiscount) && (
        <div className={`absolute top-2 left-2 z-10 px-2 py-1 text-xs font-bold text-white rounded-full ${
          isNew ? 'bg-charlotte-secondary' : 'bg-charlotte-accent'
        }`}>
          {isNew ? 'NUEVO' : `${discountPercentage}% OFF`}
        </div>
      )}
      
      {/* Wishlist Button */}
      <button 
        className="absolute top-2 right-2 z-10 bg-white/80 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        aria-label="Añadir a favoritos"
      >
        <Heart size={18} className="text-charlotte-dark hover:text-charlotte-primary transition-colors" />
      </button>
      
      {/* Product Image */}
      <Link to={`/product/${id}`} className="block overflow-hidden">
        <div className="relative pb-[125%] overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      
      {/* Quick add button that appears on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <Button className="w-full bg-charlotte-primary hover:bg-charlotte-primary/90">
          Agregar al carrito
        </Button>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-charlotte-muted uppercase mb-1">{category}</p>
        <h3 className="font-medium text-charlotte-dark mb-2 line-clamp-2 min-h-[2.5rem]">
          <Link to={`/product/${id}`} className="hover:text-charlotte-primary transition-colors">
            {name}
          </Link>
        </h3>
        <div className="flex items-baseline">
          <span className="text-lg font-bold text-charlotte-dark">${price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="ml-2 text-sm text-gray-500 line-through">${originalPrice?.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
