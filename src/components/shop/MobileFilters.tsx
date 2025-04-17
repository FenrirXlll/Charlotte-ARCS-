
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface Category {
  name: string;
  count: number;
}

interface MobileFiltersProps {
  categories: Category[];
  selectedCategories: string[];
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onReset: () => void;
}

const MobileFilters = ({
  categories,
  selectedCategories,
  priceRange,
  minPrice,
  maxPrice,
  onCategoryChange,
  onPriceRangeChange,
  onReset
}: MobileFiltersProps) => {
  return (
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
              onValueChange={(value) => onPriceRangeChange([value[0], value[1]])}
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
                    onCheckedChange={() => onCategoryChange(category.name)}
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
            <Button variant="ghost" onClick={onReset}>
              Restablecer
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilters;
