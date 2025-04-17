
import React from 'react';
import CategoryTemplate from '@/components/CategoryTemplate';
import { Product } from '@/types';

// Temporary mock data - replace with real data later
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Camiseta Casual",
    description: "Camiseta de algodón premium",
    price: 29.99,
    original_price: 39.99,
    image: "/images/products/product1.jpg",
    category: "Ropa",
    inventory_count: 100,
    is_new: true,
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "Pantalón Clásico",
    description: "Pantalón de vestir elegante",
    price: 59.99,
    image: "/images/products/product2.jpg",
    category: "Ropa",
    inventory_count: 50,
    is_new: false,
    created_at: new Date().toISOString()
  },
  // Add more mock products as needed
];

const mockCategories = [
  { name: "Ropa", count: 15 },
  { name: "Accesorios", count: 8 },
  { name: "Calzado", count: 10 }
];

const Shop = () => {
  return (
    <CategoryTemplate
      title="Nuestra Tienda"
      description="Explora nuestra colección de productos exclusivos"
      bannerImage="/images/hero-bg.jpg"
      products={mockProducts}
      categories={mockCategories}
    />
  );
};

export default Shop;
