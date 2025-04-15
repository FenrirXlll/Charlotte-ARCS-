
import React, { useEffect } from 'react';
import BannerSlider from '@/components/BannerSlider';
import ProductCard from '@/components/ProductCard';
import CategoryBanner from '@/components/CategoryBanner';
import Testimonials from '@/components/Testimonials';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Sample data for slider
const bannerSlides = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Nueva Colección de Otoño",
    subtitle: "Descubre las últimas tendencias para esta temporada",
    buttonText: "Comprar ahora",
    buttonLink: "/category/temporada"
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/5709665/pexels-photo-5709665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Moda para toda la familia",
    subtitle: "Todo lo que necesitas para cada miembro de tu familia",
    buttonText: "Explorar",
    buttonLink: "/category/jovenes"
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/6347888/pexels-photo-6347888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Últimas tendencias en Perfumería",
    subtitle: "Fragancias exclusivas para ocasiones especiales",
    buttonText: "Descubrir",
    buttonLink: "/category/perfumeria"
  }
];

// Sample featured products
const featuredProducts = [
  {
    id: "p1",
    name: "Vestido Floral de Verano",
    price: 799.99,
    originalPrice: 1299.99,
    discountPercentage: 38,
    image: "https://images.pexels.com/photos/19591624/pexels-photo-19591624/free-photo-of-moda-gente-mujer-verano.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Mujeres",
    isNew: false
  },
  {
    id: "p2",
    name: "Camisa Slim Fit a Cuadros",
    price: 599.99,
    image: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Hombres",
    isNew: true
  },
  {
    id: "p3",
    name: "Conjunto Deportivo Infantil",
    price: 449.99,
    originalPrice: 699.99,
    discountPercentage: 35,
    image: "https://images.pexels.com/photos/35188/child-childrens-baby-children-s.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Bebés",
    isNew: false
  },
  {
    id: "p4",
    name: "Zapatos Casual de Cuero",
    price: 1299.99,
    image: "https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Hombres",
    isNew: false
  },
  {
    id: "p5",
    name: "Bolso de Mano Elegante",
    price: 899.99,
    originalPrice: 1199.99,
    discountPercentage: 25,
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Mujeres",
    isNew: true
  },
  {
    id: "p6",
    name: "Mochila Escolar Resistente",
    price: 349.99,
    image: "https://images.pexels.com/photos/1546003/pexels-photo-1546003.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Escolar",
    isNew: false
  },
  {
    id: "p7",
    name: "Perfume Floral Intenso",
    price: 1499.99,
    image: "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Perfumería",
    isNew: true
  },
  {
    id: "p8",
    name: "Set de Maquillaje Profesional",
    price: 999.99,
    originalPrice: 1499.99,
    discountPercentage: 33,
    image: "https://images.pexels.com/photos/2253832/pexels-photo-2253832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Cosméticos",
    isNew: false
  }
];

// Popular categories with images
const popularCategories = [
  {
    id: 1,
    title: "Moda Mujer",
    subtitle: "Nueva colección primavera-verano",
    image: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    link: "/category/mujeres"
  },
  {
    id: 2,
    title: "Moda Hombre",
    subtitle: "Estilo y confort para cada ocasión",
    image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    link: "/category/hombres"
  },
  {
    id: 3,
    title: "Joyería",
    subtitle: "Piezas únicas para momentos especiales",
    image: "https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    link: "/category/joyeria",
    theme: "dark" as const
  }
];

const Index = () => {
  // Simulating animation on page load
  useEffect(() => {
    const animateElements = () => {
      const elements = document.querySelectorAll('.fade-in');
      elements.forEach((element, index) => {
        setTimeout(() => {
          (element as HTMLElement).style.opacity = '1';
          (element as HTMLElement).style.transform = 'translateY(0)';
        }, index * 200);
      });
    };

    // Run animation on first render
    animateElements();
  }, []);

  return (
    <div>
      {/* Main Slider */}
      <section className="mb-12">
        <BannerSlider slides={bannerSlides} />
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-charlotte-dark mb-6 text-center">Categorías Destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularCategories.map((category, index) => (
            <div 
              key={category.id} 
              className="fade-in opacity-0 transform translate-y-10 transition-all duration-500"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CategoryBanner 
                title={category.title}
                subtitle={category.subtitle}
                image={category.image}
                link={category.link}
                align="center"
                theme={category.theme || "light"}
              />
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals Banner */}
      <section className="container mx-auto px-4 mb-12">
        <div className="relative rounded-lg overflow-hidden h-[300px]">
          <img 
            src="https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="New Arrivals" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-lg fade-in opacity-0 transform translate-y-10 transition-all duration-500">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Nuevas Llegadas</h2>
                <p className="text-white/80 mb-6 text-sm md:text-base">
                  Descubre las últimas tendencias que acabamos de recibir. Prendas exclusivas para renovar tu armario.
                </p>
                <Button asChild className="bg-white text-charlotte-dark hover:bg-white/90">
                  <Link to="/category/nuevas-llegadas">
                    Ver colección
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-charlotte-dark">Productos Destacados</h2>
          <Link to="/products" className="text-charlotte-primary flex items-center hover:text-charlotte-primary/80 transition-colors">
            Ver todos <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <Tabs defaultValue="todos" className="mb-8">
          <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0 mb-6">
            <TabsTrigger 
              value="todos" 
              className="rounded-none pb-2 px-4 border-b-2 border-transparent data-[state=active]:border-charlotte-primary data-[state=active]:bg-transparent data-[state=active]:text-charlotte-primary"
            >
              Todos
            </TabsTrigger>
            <TabsTrigger 
              value="nuevos" 
              className="rounded-none pb-2 px-4 border-b-2 border-transparent data-[state=active]:border-charlotte-primary data-[state=active]:bg-transparent data-[state=active]:text-charlotte-primary"
            >
              Nuevos
            </TabsTrigger>
            <TabsTrigger 
              value="ofertas" 
              className="rounded-none pb-2 px-4 border-b-2 border-transparent data-[state=active]:border-charlotte-primary data-[state=active]:bg-transparent data-[state=active]:text-charlotte-primary"
            >
              Ofertas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="todos" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className="fade-in opacity-0 transform translate-y-10 transition-all duration-500"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="nuevos" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.filter(p => p.isNew).map((product, index) => (
                <div 
                  key={product.id}
                  className="fade-in opacity-0 transform translate-y-10 transition-all duration-500"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="ofertas" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.filter(p => p.originalPrice && p.originalPrice > p.price).map((product, index) => (
                <div 
                  key={product.id}
                  className="fade-in opacity-0 transform translate-y-10 transition-all duration-500"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Split Banner (Shop by gender) */}
      <section className="container mx-auto px-4 mb-12 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="relative overflow-hidden rounded-lg h-[300px]">
            <img 
              src="https://images.pexels.com/photos/794062/pexels-photo-794062.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Moda Mujer" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center p-6 md:p-8">
              <div className="fade-in opacity-0 transform translate-y-10 transition-all duration-500">
                <h3 className="text-2xl font-bold text-white mb-2">Moda Mujer</h3>
                <p className="text-white/80 mb-4 text-sm">Elegancia y estilo para cada ocasión</p>
                <Button asChild className="bg-white text-charlotte-dark hover:bg-white/90">
                  <Link to="/category/mujeres">Comprar ahora</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-lg h-[300px]">
            <img 
              src="https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Moda Hombre" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center p-6 md:p-8">
              <div className="fade-in opacity-0 transform translate-y-10 transition-all duration-500">
                <h3 className="text-2xl font-bold text-white mb-2">Moda Hombre</h3>
                <p className="text-white/80 mb-4 text-sm">Confort y calidad en cada prenda</p>
                <Button asChild className="bg-white text-charlotte-dark hover:bg-white/90">
                  <Link to="/category/hombres">Comprar ahora</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-charlotte-light py-12 mb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center fade-in opacity-0 transform translate-y-10 transition-all duration-500">
              <div className="w-16 h-16 bg-charlotte-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-charlotte-dark mb-2">Envío Gratuito</h3>
              <p className="text-charlotte-muted">En pedidos mayores a $999</p>
            </div>
            
            <div className="text-center fade-in opacity-0 transform translate-y-10 transition-all duration-500" style={{ transitionDelay: '100ms' }}>
              <div className="w-16 h-16 bg-charlotte-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-charlotte-dark mb-2">Calidad Garantizada</h3>
              <p className="text-charlotte-muted">100% satisfacción garantizada</p>
            </div>
            
            <div className="text-center fade-in opacity-0 transform translate-y-10 transition-all duration-500" style={{ transitionDelay: '200ms' }}>
              <div className="w-16 h-16 bg-charlotte-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-charlotte-dark mb-2">Pagos Seguros</h3>
              <p className="text-charlotte-muted">Múltiples opciones de pago</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Instagram Feed Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-charlotte-dark mb-2">Síguenos en Instagram</h2>
          <p className="text-charlotte-muted">@charlotte_arcs</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div 
              key={item} 
              className="relative aspect-square overflow-hidden fade-in opacity-0 transform translate-y-10 transition-all duration-500"
              style={{ transitionDelay: `${item * 50}ms` }}
            >
              <img 
                src={`https://picsum.photos/400/400?random=${item}`} 
                alt={`Instagram Post ${item}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-charlotte-primary/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
