
import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Tipo para los testimonios
interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  date: string;
}

// Props para el componente
interface TestimonialsProps {
  testimonials?: Testimonial[];
  title?: string;
  subtitle?: string;
}

// Datos de muestra para testimonios
const sampleTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "María Rodríguez",
    role: "Cliente Frecuente",
    content: "He comprado varias prendas de Charlotte ARCS y siempre quedo encantada con la calidad. El servicio al cliente es excepcional y los envíos siempre llegan antes de lo esperado. ¡Definitivamente mi tienda favorita!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    date: "10/04/2025"
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    role: "Cliente Nuevo",
    content: "Mi primera experiencia con Charlotte ARCS superó mis expectativas. La calidad de los productos es excelente y el proceso de compra fue muy sencillo. Además, recibí mi pedido en tiempo récord. Sin duda, volveré a comprar.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    date: "05/04/2025"
  },
  {
    id: 3,
    name: "Ana Torres",
    role: "Cliente VIP",
    content: "Como cliente desde hace más de 5 años, puedo decir que Charlotte ARCS mantiene su excelencia constante. Sus productos son duraderos y siempre a la vanguardia de la moda. El programa de fidelidad es genial y las atenciones especiales hacen que me sienta valorada.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    date: "28/03/2025"
  },
  {
    id: 4,
    name: "Javier Pérez",
    role: "Cliente Recurrente",
    content: "Lo que más valoro de Charlotte ARCS es su compromiso con la calidad. He comprado prendas que después de años siguen como nuevas. Aunque los precios son un poco elevados, definitivamente valen cada peso. Recomiendo especialmente su línea de camisas formales.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    date: "20/03/2025"
  },
  {
    id: 5,
    name: "Sofía Gutiérrez",
    role: "Cliente Ocasional",
    content: "Compré un vestido para una ocasión especial y recibí muchos cumplidos. El diseño era exclusivo y la tela de primera calidad. El único inconveniente fue que tuve un pequeño problema con la talla, pero el servicio al cliente lo resolvió rápidamente con un cambio.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    date: "15/03/2025"
  },
  {
    id: 6,
    name: "Roberto Sánchez",
    role: "Cliente Corporativo",
    content: "Utilizamos Charlotte ARCS para los uniformes de nuestra empresa y el resultado ha sido excepcional. El proceso de personalización fue muy profesional y el equipo de atención corporativa nos brindó asesoramiento experto. Los empleados están encantados con la comodidad y el estilo.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    date: "08/03/2025"
  }
];

const Testimonials: React.FC<TestimonialsProps> = ({ 
  testimonials = sampleTestimonials,
  title = "Lo que dicen nuestros clientes",
  subtitle = "Descubre por qué nuestros clientes confían en nosotros"
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [autoplay, setAutoplay] = useState(true);

  // Determinar cuántos testimonios mostrar basado en el ancho de la pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Autoplay para los testimonios
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay, activeIndex, testimonials.length, visibleCount]);

  // Handlers para la navegación
  const handlePrev = () => {
    setActiveIndex((prev) => 
      prev === 0 ? Math.max(0, testimonials.length - visibleCount) : prev - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => 
      prev >= testimonials.length - visibleCount ? 0 : prev + 1
    );
  };

  // Renderizar estrellas basado en la calificación
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section className="py-12 bg-charlotte-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-charlotte-muted max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="relative">
          {/* Controles de navegación */}
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white shadow hover:bg-charlotte-primary hover:text-white"
              onClick={handlePrev}
            >
              <ChevronLeft size={20} />
            </Button>
          </div>
          
          <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white shadow hover:bg-charlotte-primary hover:text-white"
              onClick={handleNext}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
          
          {/* Testimonials Slider */}
          <div className="relative overflow-hidden mx-6 lg:mx-10">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * (100 / visibleCount)}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] p-3"
                >
                  <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                    {/* Quote icon */}
                    <div className="text-charlotte-primary/20 mb-4">
                      <Quote size={32} />
                    </div>
                    
                    {/* Content */}
                    <p className="text-gray-700 mb-4 flex-grow">{testimonial.content}</p>
                    
                    {/* Rating */}
                    <div className="flex mb-4">
                      {renderStars(testimonial.rating)}
                    </div>
                    
                    {/* User Info */}
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                      <div className="ml-auto text-xs text-gray-400">
                        {testimonial.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array(Math.ceil(testimonials.length / visibleCount)).fill(0).map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Math.floor(activeIndex / visibleCount) === i 
                    ? 'bg-charlotte-primary w-6' 
                    : 'bg-gray-300'
                }`}
                onClick={() => setActiveIndex(i * visibleCount)}
                aria-label={`Ver página de testimonios ${i + 1}`}
              />
            ))}
          </div>
          
          {/* Autoplay toggle */}
          <div className="flex justify-center mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setAutoplay(!autoplay)}
              className="text-xs text-gray-500"
            >
              {autoplay ? 'Pausar reproducción' : 'Activar reproducción automática'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
