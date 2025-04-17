import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductGrid from '@/components/shop/ProductGrid';
import FilterSidebar from '@/components/shop/FilterSidebar';
import MobileFilters from '@/components/shop/MobileFilters';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("featured");
  
  // Get min and max prices from products
  const minPrice = Math.min(...mockProducts.map(p => p.price));
  const maxPrice = Math.max(...mockProducts.map(p => p.price));
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  
  // Effect to filter and sort products
  useEffect(() => {
    let result = [...mockProducts];
    
    // Filter by price
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by categories if any selected
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    // Sort products
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default: // featured or any other
        // Keep original order
        break;
    }
    
    setFilteredProducts(result);
  }, [mockProducts, priceRange, selectedCategories, sortOption]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const resetFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedCategories([]);
    setSortOption("featured");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[40vh] overflow-hidden">
        <img 
          src="/images/hero-bg.jpg" 
          alt="Tienda"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Nuestra Tienda</h1>
            <p className="text-white/90 max-w-2xl mx-auto text-lg">
              Explora nuestra colección de productos exclusivos
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row">
          {/* Filters Sidebar - Desktop */}
          <FilterSidebar
            categories={mockCategories}
            selectedCategories={selectedCategories}
            priceRange={priceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onCategoryChange={toggleCategory}
            onPriceRangeChange={setPriceRange}
            onReset={resetFilters}
          />
          
          {/* Products Grid and Mobile Filters */}
          <div className="flex-1">
            {/* Filters and Sort */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
              {/* Mobile Filters */}
              <MobileFilters
                categories={mockCategories}
                selectedCategories={selectedCategories}
                priceRange={priceRange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onCategoryChange={toggleCategory}
                onPriceRangeChange={setPriceRange}
                onReset={resetFilters}
              />
              
              {/* Results Count */}
              <div className="text-charlotte-muted">
                Mostrando {filteredProducts.length} de {mockProducts.length} productos
              </div>
              
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <ArrowUpDown size={14} className="mr-2" />
                    Ordenar por
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setSortOption("featured")}
                    className="flex items-center justify-between"
                  >
                    Destacados
                    {sortOption === "featured" && <Check size={14} />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("price-asc")}
                    className="flex items-center justify-between"
                  >
                    Precio: De menor a mayor
                    {sortOption === "price-asc" && <Check size={14} />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("price-desc")}
                    className="flex items-center justify-between"
                  >
                    Precio: De mayor a menor
                    {sortOption === "price-desc" && <Check size={14} />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("name-asc")}
                    className="flex items-center justify-between"
                  >
                    Nombre: A-Z
                    {sortOption === "name-asc" && <Check size={14} />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("name-desc")}
                    className="flex items-center justify-between"
                  >
                    Nombre: Z-A
                    {sortOption === "name-desc" && <Check size={14} />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("newest")}
                    className="flex items-center justify-between"
                  >
                    Lo más nuevo
                    {sortOption === "newest" && <Check size={14} />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Active Filters */}
            {(selectedCategories.length > 0 || priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {/* Show active filters as tags */}
                {(priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
                  <div className="bg-charlotte-light px-3 py-1 rounded-full text-sm flex items-center">
                    <span>Precio: ${priceRange[0]} - ${priceRange[1]}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-5 w-5 p-0 ml-1"
                      onClick={() => setPriceRange([minPrice, maxPrice])}
                    >
                      ×
                    </Button>
                  </div>
                )}
                
                {selectedCategories.map(category => (
                  <div key={category} className="bg-charlotte-light px-3 py-1 rounded-full text-sm flex items-center">
                    <span>{category}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-5 w-5 p-0 ml-1"
                      onClick={() => toggleCategory(category)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-charlotte-primary text-sm"
                  onClick={resetFilters}
                >
                  Limpiar todo
                </Button>
              </div>
            )}
            
            {/* Products Grid */}
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
