
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface Category {
  name: string;
  count: number;
}

interface FilterSidebarProps {
  categories: Category[];
  selectedCategories: string[];
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onReset: () => void;
}

const FilterSidebar = ({
  categories,
  selectedCategories,
  priceRange,
  minPrice,
  maxPrice,
  onCategoryChange,
  onPriceRangeChange,
  onReset
}: FilterSidebarProps) => {
  return (
    <div className="hidden lg:block w-64 mr-8">
      <div className="sticky top-24">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Filtros</h3>
            {(selectedCategories.length > 0 || priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onReset}
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
              onValueChange={(value) => onPriceRangeChange([value[0], value[1]])}
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
                    onCheckedChange={() => onCategoryChange(category.name)}
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
  );
};

export default FilterSidebar;
