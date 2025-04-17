
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import WhatsAppButton from '@/components/WhatsAppButton';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Bienvenido a nuestra tienda
            </h1>
            <p className="text-xl text-white mb-8">
              Descubre nuestra colección de productos exclusivos
            </p>
            <Button asChild size="lg">
              <Link to="/shop">
                Ver productos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Productos Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Add your featured products here */}
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

export default Home;
