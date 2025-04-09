
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CategoryBannerProps {
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  align?: 'left' | 'center' | 'right';
  theme?: 'light' | 'dark';
}

const CategoryBanner: React.FC<CategoryBannerProps> = ({
  title,
  subtitle,
  image,
  link,
  align = 'left',
  theme = 'light'
}) => {
  const getTextAlignment = () => {
    switch (align) {
      case 'left': return 'text-left items-start';
      case 'center': return 'text-center items-center';
      case 'right': return 'text-right items-end';
    }
  };
  
  const textColor = theme === 'light' ? 'text-charlotte-dark' : 'text-white';
  
  return (
    <div className="relative overflow-hidden rounded-lg group h-[400px] md:h-[500px]">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-6 md:p-8">
        <div className={`flex flex-col ${getTextAlignment()} max-w-md`}>
          <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${textColor}`}>{title}</h3>
          {subtitle && (
            <p className={`mb-4 text-sm md:text-base ${theme === 'light' ? 'text-charlotte-dark/80' : 'text-white/80'}`}>
              {subtitle}
            </p>
          )}
          <Button
            asChild
            className={`${theme === 'light' ? 'bg-charlotte-dark hover:bg-charlotte-dark/90' : 'bg-white text-charlotte-dark hover:bg-white/90'}`}
          >
            <Link to={link}>Ver colección</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryBanner;
