
import React from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
        <p className="text-charlotte-muted">Intenta ajustar los filtros para ver más resultados</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, index) => (
        <div 
          key={product.id}
          className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fadeIn"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProductCard {...product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
