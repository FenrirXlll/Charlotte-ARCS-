import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Filter, 
  SlidersHorizontal, 
  ChevronDown, 
  X,
  ArrowUpDown,
  Check
} from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";

interface CategoryTemplateProps {
  title: string;
  description?: string;
  bannerImage: string;
  products: Product[];
  categories?: { name: string; count: number }[];
}

const CategoryTemplate: React.FC<CategoryTemplateProps> = ({
  title,
  description,
  bannerImage,
  products,
  categories = []
}) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("featured");
  
  // Get min and max prices from products
  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));
  
  // Effect to filter and sort products
  useEffect(() => {
    let result = [...products];
    
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
        // Keep the original order or implement featured logic
        break;
    }
    
    setFilteredProducts(result);
  }, [products, priceRange, selectedCategories, sortOption]);
  
  // Handle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Reset all filters
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
          src={bannerImage} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-charlotte">{title}</h1>
            {description && (
              <p className="text-white/90 max-w-2xl mx-auto text-lg">{description}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-charlotte-muted">
          <Link to="/" className="hover:text-charlotte-primary">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-charlotte-dark">{title}</span>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 mr-8">
            <div className="sticky top-24">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Filtros</h3>
                  {(selectedCategories.length > 0 || priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetFilters}
                      className="text-xs"
                    >
                      Restablecer
                    </Button>
                  )}
                </div>
                
                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Precio</h4>
                  <Slider
                    defaultValue={[priceRange[0], priceRange[1]]}
                    max={maxPrice}
                    min={minPrice}
                    step={10}
                    value={[priceRange[0], priceRange[1]]}
                    onValueChange={(value) => setPriceRange([value[0], value[1]])}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm">
                    <span>${priceRange[0].toFixed(2)}</span>
                    <span>${priceRange[1].toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Categories Filter */}
                <div>
                  <h4 className="font-medium mb-2">Categorías</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category.name} className="flex items-center">
                        <Checkbox
                          id={`category-${category.name}`}
                          checked={selectedCategories.includes(category.name)}
                          onCheckedChange={() => toggleCategory(category.name)}
                          className="mr-2"
                        />
                        <label 
                          htmlFor={`category-${category.name}`}
                          className="text-sm flex-1 cursor-pointer"
                        >
                          {category.name} <span className="text-charlotte-muted">({category.count})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Products Grid and Mobile Filters */}
          <div className="flex-1">
            {/* Filters and Sort - Mobile + Desktop */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
              {/* Mobile Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden flex items-center"
                  >
                    <Filter size={14} className="mr-2" />
                    Filtros
                    {(selectedCategories.length > 0 || priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
                      <span className="ml-1 bg-charlotte-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {selectedCategories.length + (priceRange[0] > minPrice || priceRange[1] < maxPrice ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                    <SheetDescription>
                      Filtra los productos por precio y categoría
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6">
                    {/* Price Range Filter - Mobile */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Precio</h4>
                      <Slider
                        defaultValue={[priceRange[0], priceRange[1]]}
                        max={maxPrice}
                        min={minPrice}
                        step={10}
                        value={[priceRange[0], priceRange[1]]}
                        onValueChange={(value) => setPriceRange([value[0], value[1]])}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-sm">
                        <span>${priceRange[0].toFixed(2)}</span>
                        <span>${priceRange[1].toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Categories Filter - Mobile */}
                    <div>
                      <h4 className="font-medium mb-2">Categorías</h4>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <div key={category.name} className="flex items-center">
                            <Checkbox
                              id={`mobile-category-${category.name}`}
                              checked={selectedCategories.includes(category.name)}
                              onCheckedChange={() => toggleCategory(category.name)}
                              className="mr-2"
                            />
                            <label 
                              htmlFor={`mobile-category-${category.name}`}
                              className="text-sm flex-1 cursor-pointer"
                            >
                              {category.name} <span className="text-charlotte-muted">({category.count})</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <SheetClose asChild>
                      <Button variant="outline">Cerrar</Button>
                    </SheetClose>
                    {(selectedCategories.length > 0 || priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
                      <Button variant="ghost" onClick={resetFilters}>
                        Restablecer
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              
              {/* Results Count */}
              <div className="text-charlotte-muted">
                Mostrando {filteredProducts.length} de {products.length} productos
              </div>
              
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <ArrowUpDown size={14} className="mr-2" />
                    Ordenar por
                    <ChevronDown size={14} className="ml-2" />
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
                {priceRange[0] > minPrice || priceRange[1] < maxPrice ? (
                  <div className="bg-charlotte-light px-3 py-1 rounded-full text-sm flex items-center">
                    <span>Precio: ${priceRange[0]} - ${priceRange[1]}</span>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1" onClick={() => setPriceRange([minPrice, maxPrice])}>
                      <X size={12} />
                    </Button>
                  </div>
                ) : null}
                
                {selectedCategories.map(category => (
                  <div key={category} className="bg-charlotte-light px-3 py-1 rounded-full text-sm flex items-center">
                    <span>{category}</span>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1" onClick={() => toggleCategory(category)}>
                      <X size={12} />
                    </Button>
                  </div>
                ))}
                
                <Button variant="ghost" size="sm" className="text-charlotte-primary text-sm" onClick={resetFilters}>
                  Limpiar todo
                </Button>
              </div>
            )}
            
            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product.id}
                    className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SlidersHorizontal size={48} className="mx-auto text-charlotte-muted mb-4" />
                <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
                <p className="text-charlotte-muted mb-4">Intenta ajustar los filtros para ver más resultados</p>
                <Button onClick={resetFilters}>Restablecer filtros</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTemplate;
