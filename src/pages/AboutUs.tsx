
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail, Star, Check, Users, TrendingUp, Clock } from 'lucide-react';

const AboutUs = () => {
  useEffect(() => {
    // Animate elements on page load
    const animateElements = () => {
      const elements = document.querySelectorAll('.fade-in');
      elements.forEach((element, index) => {
        setTimeout(() => {
          (element as HTMLElement).style.opacity = '1';
          (element as HTMLElement).style.transform = 'translateY(0)';
        }, index * 200);
      });
    };

    animateElements();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src="https://images.pexels.com/photos/5082976/pexels-photo-5082976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Charlotte ARCS Team" 
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center fade-in opacity-0 transform translate-y-10 transition-all duration-500">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Nuestra Historia</h1>
                <p className="text-white/90 text-lg mb-6">
                  Charlotte ARCS: Una historia de pasión por la moda desde 2018
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-charlotte-dark text-center mb-8 fade-in opacity-0 transform translate-y-10 transition-all duration-500">
            Nuestra Historia
          </h2>
          
          <div className="prose prose-lg max-w-none fade-in opacity-0 transform translate-y-10 transition-all duration-500" style={{ transitionDelay: '100ms' }}>
            <p className="mb-4 text-lg leading-relaxed">
              Todo comenzó en 2018, cuando <strong>Carla Sánchez</strong>, una joven diseñadora con grandes sueños, decidió transformar su pasión por la moda en algo más que un simple hobby. Con apenas un pequeño taller y un equipo de tres personas, nació Charlotte ARCS, un nombre que rinde homenaje a su abuela Charlotte, quien le enseñó a coser desde muy pequeña.
            </p>
            
            <p className="mb-4 text-lg leading-relaxed">
              Los primeros días fueron desafiantes. Carla trabajaba hasta altas horas de la noche diseñando cada prenda con dedicación y esmero, asegurándose de que cada detalle reflejara su visión: crear moda accesible pero de alta calidad para todas las personas, sin importar su género, edad o contexto socioeconómico.
            </p>
            
            <blockquote className="bg-charlotte-light border-l-4 border-charlotte-primary p-4 my-6 italic">
              "Siempre soñé con crear una marca que no solo vendiera ropa, sino que contara historias y ayudara a las personas a sentirse seguras y auténticas. La moda es una forma de expresión personal, y todos merecen tener acceso a ella."
              <footer className="mt-2 not-italic font-medium">— Carla Sánchez, Fundadora y CEO</footer>
            </blockquote>
            
            <p className="mb-4 text-lg leading-relaxed">
              El punto de inflexión llegó en 2020, durante la pandemia. Mientras muchas tiendas de moda cerraban sus puertas, Charlotte ARCS decidió adaptarse a la nueva realidad. Reimaginaron su modelo de negocio, fortalecieron su presencia en línea y comenzaron a fabricar prendas cómodas pero elegantes para el trabajo en casa. Esta capacidad de adaptación no solo salvó a la empresa, sino que multiplicó su clientela.
            </p>
            
            <p className="mb-4 text-lg leading-relaxed">
              Hoy, Charlotte ARCS se ha convertido en sinónimo de calidad, inclusividad y confianza. Con más de 500 empleados y presencia en todo el país, continuamos fieles a nuestra misión original: crear moda que empodere a las personas y las haga sentir especiales.
            </p>
            
            <p className="mb-4 text-lg leading-relaxed">
              Cada prenda que ves en nuestras tiendas y en nuestra plataforma online tiene una historia, un propósito y un compromiso con la calidad. Desde la selección cuidadosa de los materiales hasta el proceso de fabricación ético, cada paso está diseñado pensando en ti y en nuestro planeta.
            </p>
            
            <p className="mb-4 text-lg leading-relaxed">
              Charlotte ARCS no es solo una marca de moda; es una comunidad que crece cada día, unida por el amor al estilo y la autenticidad.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="mb-16">
        <div className="bg-charlotte-light rounded-lg p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3 fade-in opacity-0 transform translate-y-10 transition-all duration-500" style={{ transitionDelay: '200ms' }}>
                <img 
                  src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Carla Sánchez" 
                  className="rounded-full aspect-square object-cover border-4 border-white shadow-lg"
                />
              </div>
              
              <div className="md:w-2/3 fade-in opacity-0 transform translate-y-10 transition-all duration-500" style={{ transitionDelay: '300ms' }}>
                <h3 className="text-2xl font-bold text-charlotte-dark mb-3">Carla Sánchez</h3>
                <p className="text-charlotte-primary font-medium mb-4">Fundadora y CEO</p>
                <p className="mb-4 text-lg leading-relaxed">
                  Carla Sánchez comenzó su carrera en la moda a los 20 años, después de graduarse con honores del Instituto de Diseño de Moda. Su visión innovadora y su pasión inquebrantable la llevaron a fundar Charlotte ARCS en 2018, convirtiendo un pequeño taller en una de las marcas de moda más queridas del país.
                </p>
                <p className="mb-4 text-lg leading-relaxed">
                  Más allá de su talento como diseñadora, Carla es reconocida por su liderazgo empático, su compromiso con la sostenibilidad y su dedicación a causas sociales. Bajo su dirección, Charlotte ARCS ha lanzado múltiples iniciativas para apoyar a mujeres emprendedoras y promover prácticas sostenibles en la industria de la moda.
                </p>
                <div className="flex space-x-2">
                  <a href="https://instagram.com" className="text-charlotte-primary hover:text-charlotte-primary/80 transition-colors">Instagram</a>
                  <span className="text-charlotte-muted">•</span>
                  <a href="https://linkedin.com" className="text-charlotte-primary hover:text-charlotte-primary/80 transition-colors">LinkedIn</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-charlotte-dark text-center mb-8 fade-in opacity-0 transform translate-y-10 transition-all duration-500" style={{ transitionDelay: '400ms' }}>
          Nuestros Valores
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 fade-in opacity-0 transform translate-y-10 transition-all duration-500" style={{ transitionDelay: '500ms' }}>
            <div className="w-12 h-12 bg-charlotte-light rounded-full flex items-center justify-center mb-4">
              <Star className="text-charlotte-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-charlotte-dark mb-2">Calidad sin Compromisos</h3>
            <p className="text-charlotte-muted">
              Cada prenda pasa por rigurosos controles de calidad. Utilizamos los mejores materiales y técnicas de confección para garantizar durabilidad y comfort.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 fade-in opacity-0 transform translate-y-10 transition-all duration-500" style={{ transitionDelay: '600ms' }}>
            <div className="w-12 h-12 bg-charlotte-light rounded-full flex items-center justify-center mb-4">
              <Check className="text-charlotte-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-charlotte-dark mb-2">Integridad y Transparencia</h3>
            <p className="text-charlotte-muted">
              Somos honestos sobre nuestros procesos, precios y políticas. Creemos que la confianza se construye a través de la transparencia en cada paso.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 fade-in opacity-0 transform translate-y-10 transition-all duration-500" style={{ transitionDelay: '700ms' }}>
            <div className="w-12 h-12 bg-charlotte-light rounded-full flex items-center justify-center mb-4">
              <Users className="text-charlotte-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-charlotte-dark mb-2">Inclusividad</h3>
            <p className="text-charlotte-muted">
              La moda es para todos. Diseñamos pensando en la diversidad de cuerpos, estilos y necesidades. Queremos que cada persona se sienta representada.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 fade-in opacity-0 transform translate-y-10 transition-all duration-500" style={{ transitionDelay: '800ms' }}>
            <div className="w-12 h-12 bg-charlotte-light rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="text-charlotte-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-charlotte-dark mb-2">Innovación Constante</h3>
            <p className="text-charlotte-muted">
              Nos reinventamos constantemente, explorando nuevas tendencias, materiales y tecnologías para ofrecerte siempre lo mejor.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 fade-in opacity-0 transform translate-y-10 transition-all duration-500" style={{ transitionDelay: '900ms' }}>
            <div className="w-12 h-12 bg-charlotte-light rounded-full flex items-center justify-center mb-4">
              <Clock className="text-charlotte-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-charlotte-dark mb-2">Compromiso con el Cliente</h3>
            <p className="text-charlotte-muted">
              Tu satisfacción es nuestra prioridad. Brindamos atención personalizada y estamos disponibles para resolver cualquier inquietud.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 fade-in opacity-0 transform translate-y-10 transition-all duration-500" style={{ transitionDelay: '1000ms' }}>
            <div className="w-12 h-12 bg-charlotte-light rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-charlotte-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-charlotte-dark mb-2">Responsabilidad Ambiental</h3>
            <p className="text-charlotte-muted">
              Implementamos prácticas sostenibles en nuestra producción y operaciones, minimizando nuestro impacto en el planeta.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="my-16">
        <div className="bg-charlotte-primary rounded-lg text-white p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center fade-in opacity-0 transform translate-y-10 transition-all duration-500" style={{ transitionDelay: '1100ms' }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Únete a la Familia Charlotte ARCS</h2>
            <p className="mb-6 text-white/90">
              Descubre la diferencia de comprar en una marca que se preocupa tanto por la calidad como por sus clientes. Explora nuestra colección y forma parte de nuestra historia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link to="/">Explorar Colecciones</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:text-charlotte-primary hover:bg-white">
                <Link to="/contact">
                  <Mail className="mr-2 h-4 w-4" /> Contáctanos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
