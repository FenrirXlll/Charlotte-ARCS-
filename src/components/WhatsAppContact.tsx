
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, ShoppingCart, Heart, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface WhatsAppContactProps {
  productName?: string;
  buttonText?: string;
  buttonVariant?: 'primary' | 'outline' | 'icon' | 'cart' | 'wishlist';
  buttonSize?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const WhatsAppContact: React.FC<WhatsAppContactProps> = ({
  productName,
  buttonText = "Contactar por WhatsApp",
  buttonVariant = 'primary',
  buttonSize = 'md',
  showIcon = true,
  className = ''
}) => {
  // Replace with your actual WhatsApp number
  const whatsappNumber = '+5255123456789';
  const defaultMessage = productName 
    ? `Hola, me interesa el producto: ${productName}` 
    : 'Hola, me gustaría obtener más información sobre sus productos';
  
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    // Log the action (could be extended for analytics)
    console.log(`WhatsApp contact initiated${productName ? ` for product: ${productName}` : ''}`);
    
    // Open WhatsApp with pre-filled message
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Show toast notification
    toast.success('Redirigiendo a WhatsApp', {
      description: 'Te contactaremos lo antes posible',
    });
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };
  
  // Define button styles based on variant
  const getButtonClasses = () => {
    const sizeClasses = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    };
    
    const baseClasses = `${sizeClasses[buttonSize]} rounded-md font-medium transition-all duration-300 ease-in-out ${className}`;
    
    switch (buttonVariant) {
      case 'primary':
        return `${baseClasses} bg-green-600 hover:bg-green-700 text-white`;
      case 'outline':
        return `${baseClasses} border border-green-600 text-green-600 hover:bg-green-50`;
      case 'icon':
        return 'p-2 rounded-full bg-green-600 hover:bg-green-700 text-white';
      case 'cart':
        return `${baseClasses} bg-charlotte-primary hover:bg-charlotte-primary/90 text-white`;
      case 'wishlist':
        return `${baseClasses} bg-rose-500 hover:bg-rose-600 text-white`;
      default:
        return `${baseClasses} bg-green-600 hover:bg-green-700 text-white`;
    }
  };
  
  // Get icon based on variant
  const getIcon = () => {
    switch (buttonVariant) {
      case 'cart':
        return <ShoppingCart size={buttonSize === 'sm' ? 14 : 18} className="mr-2" />;
      case 'wishlist':
        return <Heart size={buttonSize === 'sm' ? 14 : 18} className="mr-2" />;
      default:
        return <Phone size={buttonSize === 'sm' ? 14 : 18} className="mr-2" />;
    }
  };
  
  return (
    <Button
      onClick={handleClick}
      className={getButtonClasses()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      type="button"
    >
      {showIcon && getIcon()}
      {buttonText}
      {isHovered && <Send size={buttonSize === 'sm' ? 14 : 18} className="ml-2 animate-pulse" />}
    </Button>
  );
};

export default WhatsAppContact;
