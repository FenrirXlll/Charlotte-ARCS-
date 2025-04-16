
import React, { useEffect } from 'react';
import BannerSlider from '@/components/BannerSlider';
import ProductCard from '@/components/ProductCard';
import CategoryBanner from '@/components/CategoryBanner';
import Testimonials from '@/components/Testimonials';
import CustomerComments from '@/components/CustomerComments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Banners para slider principal
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
    title: "Perfumes Exclusivos",
    subtitle: "Fragancias únicas que resuenan con tu personalidad",
    buttonText: "Explorar",
    buttonLink: "/category/perfumes"
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/6347888/pexels-photo-6347888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Cosméticos de Alta Calidad",
    subtitle: "Mejora tu rutina de belleza con productos premium",
    buttonText: "Descubrir",
    buttonLink: "/category/cosmeticos"
  }
];

// Productos destacados por categoría
const featuredProducts = {
  dama: [
    {
      id: "p1",
      name: "Vestido Floral de Verano",
      price: 799.99,
      originalPrice: 1299.99,
      discountPercentage: 38,
      image: "https://images.pexels.com/photos/19591624/pexels-photo-19591624/free-photo-of-moda-gente-mujer-verano.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Dama",
      isNew: false
    },
    {
      id: "p5",
      name: "Bolso de Mano Elegante",
      price: 899.99,
      originalPrice: 1199.99,
      discountPercentage: 25,
      image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Dama",
      isNew: true
    },
    {
      id: "p9",
      name: "Blazer Formal Femenino",
      price: 1299.99,
      image: "https://images.pexels.com/photos/7258362/pexels-photo-7258362.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Dama",
      isNew: true
    },
    {
      id: "p13",
      name: "Vestido de Noche Elegante",
      price: 1599.99,
      image: "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Dama",
      isNew: false
    }
  ],
  caballero: [
    {
      id: "p2",
      name: "Camisa Slim Fit a Cuadros",
      price: 599.99,
      image: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Caballero",
      isNew: true
    },
    {
      id: "p4",
      name: "Zapatos Casual de Cuero",
      price: 1299.99,
      image: "https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Caballero",
      isNew: false
    },
    {
      id: "p10",
      name: "Traje Formal Ejecutivo",
      price: 2499.99,
      originalPrice: 2999.99,
      discountPercentage: 16,
      image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Caballero",
      isNew: false
    },
    {
      id: "p14",
      name: "Reloj Analógico Clásico",
      price: 1899.99,
      image: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Caballero",
      isNew: true
    }
  ],
  jovenes: [
    {
      id: "p11",
      name: "Sudadera con Capucha Urban",
      price: 699.99,
      originalPrice: 899.99,
      discountPercentage: 22,
      image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Jóvenes",
      isNew: true
    },
    {
      id: "p12",
      name: "Jeans Rasgados Modernos",
      price: 799.99,
      image: "https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Jóvenes",
      isNew: false
    },
    {
      id: "p15",
      name: "Zapatillas Deportivas Premium",
      price: 1299.99,
      originalPrice: 1599.99,
      discountPercentage: 18,
      image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Jóvenes",
      isNew: true
    },
    {
      id: "p16",
      name: "Mochila Urbana Moderna",
      price: 599.99,
      image: "https://images.pexels.com/photos/1546003/pexels-photo-1546003.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Jóvenes",
      isNew: false
    }
  ],
  bebes: [
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
      id: "p17",
      name: "Pijama Suave para Bebé",
      price: 349.99,
      image: "https://images.pexels.com/photos/3933282/pexels-photo-3933282.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Bebés",
      isNew: true
    },
    {
      id: "p18",
      name: "Set de Juguetes Educativos",
      price: 499.99,
      originalPrice: 699.99,
      discountPercentage: 28,
      image: "https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Bebés",
      isNew: false
    },
    {
      id: "p19",
      name: "Silla de Comer Ajustable",
      price: 1299.99,
      image: "https://images.pexels.com/photos/6114938/pexels-photo-6114938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Bebés",
      isNew: true
    }
  ],
  perfumes: [
    {
      id: "p7",
      name: "Perfume Floral Intenso",
      price: 1499.99,
      image: "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Perfumería",
      isNew: true
    },
    {
      id: "p20",
      name: "Eau de Parfum Elegance",
      price: 1799.99,
      originalPrice: 2199.99,
      discountPercentage: 18,
      image: "https://images.pexels.com/photos/755992/pexels-photo-755992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Perfumería",
      isNew: false
    },
    {
      id: "p21",
      name: "Colonia Refrescante Aqua",
      price: 1199.99,
      image: "https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Perfumería",
      isNew: true
    },
    {
      id: "p22",
      name: "Set de Fragancias Exclusivas",
      price: 2499.99,
      image: "https://images.pexels.com/photos/190334/pexels-photo-190334.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Perfumería",
      isNew: false
    }
  ],
  cosmeticos: [
    {
      id: "p8",
      name: "Set de Maquillaje Profesional",
      price: 999.99,
      originalPrice: 1499.99,
      discountPercentage: 33,
      image: "https://images.pexels.com/photos/2253832/pexels-photo-2253832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Cosméticos",
      isNew: false
    },
    {
      id: "p23",
      name: "Paleta de Sombras Premium",
      price: 699.99,
      image: "https://images.pexels.com/photos/1749452/pexels-photo-1749452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Cosméticos",
      isNew: true
    },
    {
      id: "p24",
      name: "Kit de Cuidado Facial",
      price: 899.99,
      originalPrice: 1099.99,
      discountPercentage: 18,
      image: "https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Cosméticos",
      isNew: false
    },
    {
      id: "p25",
      name: "Labiales de Larga Duración",
      price: 499.99,
      image: "https://images.pexels.com/photos/458766/pexels-photo-458766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Cosméticos",
      isNew: true
    }
  ]
};

// Combinar todos los productos para la vista "todos"
const allProducts = [
  ...featuredProducts.dama,
  ...featuredProducts.caballero,
  ...featuredProducts.jovenes,
  ...featuredProducts.bebes,
  ...featuredProducts.perfumes,
  ...featuredProducts.cosmeticos
];

// Categorías populares con imágenes
const popularCategories = [
  {
    id: 1,
    title: "Moda Mujer",
    subtitle: "Elegancia y estilo para cada ocasión",
    image: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    link: "/category/dama"
  },
  {
    id: 2,
    title: "Moda Hombre",
    subtitle: "Confort y calidad en cada prenda",
    image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    link: "/category/caballero"
  },
  {
    id: 3,
    title: "Perfumes Exclusivos",
    subtitle: "Fragancias únicas para momentos especiales",
    image: "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    link: "/category/perfumes",
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

      {/* Historia de Charlotte ARCS */}
      <section className="container mx-auto px-4 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-charlotte-dark mb-4">Nuestra Historia</h2>
          <p className="text-charlotte-muted mb-6">
            Charlotte ARCS es una innovadora tienda online destacada por ofrecer productos únicos y creativos para todo tipo de público. 
            Nuestro enfoque en la originalidad y calidad nos ha posicionado como un referente en el comercio electrónico, 
            atrayendo a una amplia gama de clientes en busca de artículos especiales.
          </p>
          <Link to="/about" className="text-charlotte-primary hover:text-charlotte-primary/80 transition-colors inline-flex items-center">
            Conoce más sobre nosotros <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
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
                  Descubre nuestros diseños exclusivos y fragancias únicas que acabamos de recibir. Productos que resaltan tu individualidad.
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
              value="dama" 
              className="rounded-none pb-2 px-4 border-b-2 border-transparent data-[state=active]:border-charlotte-primary data-[state=active]:bg-transparent data-[state=active]:text-charlotte-primary"
            >
              Dama
            </TabsTrigger>
            <TabsTrigger 
              value="caballero" 
              className="rounded-none pb-2 px-4 border-b-2 border-transparent data-[state=active]:border-charlotte-primary data-[state=active]:bg-transparent data-[state=active]:text-charlotte-primary"
            >
              Caballero
            </TabsTrigger>
            <TabsTrigger 
              value="jovenes" 
              className="rounded-none pb-2 px-4 border-b-2 border-transparent data-[state=active]:border-charlotte-primary data-[state=active]:bg-transparent data-[state=active]:text-charlotte-primary"
            >
              Jóvenes
            </TabsTrigger>
            <TabsTrigger 
              value="perfumes" 
              className="rounded-none pb-2 px-4 border-b-2 border-transparent data-[state=active]:border-charlotte-primary data-[state=active]:bg-transparent data-[state=active]:text-charlotte-primary"
            >
              Perfumes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="todos" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {allProducts.slice(0, 8).map((product, index) => (
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
          
          <TabsContent value="dama" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.dama.map((product, index) => (
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
          
          <TabsContent value="caballero" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.caballero.map((product, index) => (
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
          
          <TabsContent value="jovenes" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.jovenes.map((product, index) => (
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
          
          <TabsContent value="perfumes" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.perfumes.map((product, index) => (
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

      {/* Customer Comments Section */}
      <CustomerComments />

      {/* Split Banner (Actech partnership) */}
      <section className="container mx-auto px-4 mb-12 mt-12">
        <div className="bg-charlotte-light rounded-lg p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-charlotte-dark mb-4">Supervisión y Asociación con Actech</h2>
          <p className="text-charlotte-muted mb-6 max-w-3xl mx-auto">
            Charlotte ARCS opera bajo la supervisión de Actech, una empresa líder en soluciones digitales. 
            Esta asociación es fundamental para fomentar el crecimiento de pequeños negocios e impulsar el desarrollo digital.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-3">Fomento de Pequeños Negocios</h3>
              <p>Trabajamos en conjunto para integrar a pequeños negocios en nuestra cadena de suministro, ayudándoles a convertirse en fabricantes de productos.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-3">Desarrollo Digital</h3>
              <p>Estamos comprometidos en ayudar a pequeñas empresas a crecer tanto física como digitalmente, brindándoles las herramientas necesarias para prosperar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-charlotte-light py-12 mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-charlotte-dark mb-8 text-center">¿Por qué elegir Charlotte ARCS?</h2>
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 1.043 3.296 3.745 3.745 0 0 1 1.593 3.068c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 1.043 3.296 3.745 3.745 0 0 1 1.593 3.068z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-charlotte-dark mb-2">Calidad Garantizada</h3>
              <p className="text-charlotte-muted">Productos de la mejor calidad</p>
            </div>
            
            <div className="text-center fade-in opacity-0 transform translate-y-10 transition-all duration-500" style={{ transitionDelay: '200ms' }}>
              <div className="w-16 h-16 bg-charlotte-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-charlotte-dark mb-2">Soporte 24/7</h3>
              <p className="text-charlotte-muted">Asistencia personalizada</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
