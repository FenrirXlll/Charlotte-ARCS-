
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-charlotte-dark text-white">
      {/* Newsletter section */}
      <div className="bg-charlotte-primary py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-1">Suscríbete a Nuestro Newsletter</h3>
              <p className="text-white/90">Recibe ofertas exclusivas y novedades directamente en tu correo.</p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="px-4 py-2 rounded-md text-gray-800 min-w-[250px] focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button className="bg-white hover:bg-white/90 text-charlotte-primary">
                Suscribirse
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About and contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Charlotte ARCS</h4>
            <p className="text-white/80 mb-4">
              Tienda especializada en moda con las últimas tendencias y diseños exclusivos para todos los estilos.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-charlotte-primary" />
                <span className="text-white/80">info@charlottearcs.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-charlotte-primary" />
                <span className="text-white/80">+1 (800) CHARLOTTE</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-charlotte-primary" />
                <span className="text-white/80">Av. Charlotte 123, Ciudad de México</span>
              </li>
            </ul>
          </div>
          
          {/* Quick links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white hover:underline">Inicio</Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-white hover:underline">Acerca de Nosotros</Link>
              </li>
              <li>
                <Link to="/cart" className="text-white/80 hover:text-white hover:underline">Carrito</Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-white/80 hover:text-white hover:underline">Lista de Deseos</Link>
              </li>
              <li>
                <Link to="/account" className="text-white/80 hover:text-white hover:underline">Mi Cuenta</Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white hover:underline">Contacto</Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/80 hover:text-white hover:underline">Preguntas Frecuentes</Link>
              </li>
            </ul>
          </div>
          
          {/* Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Información</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping" className="text-white/80 hover:text-white hover:underline">Envíos</Link>
              </li>
              <li>
                <Link to="/returns" className="text-white/80 hover:text-white hover:underline">Devoluciones</Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/80 hover:text-white hover:underline">Términos y Condiciones</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/80 hover:text-white hover:underline">Política de Privacidad</Link>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white hover:underline">Blog</a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white hover:underline">Afiliados</a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white hover:underline">Trabaja con Nosotros</a>
              </li>
            </ul>
          </div>
          
          {/* Support & Follow us */}
          <div>
            {/* New Support Section */}
            <h4 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Soporte</h4>
            <ul className="space-y-2 mb-6">
              <li>
                <Link to="/admin" className="text-white/80 hover:text-white hover:underline flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2 text-charlotte-primary" />
                  Panel de Administración
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white hover:underline">Contacto de Soporte</Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/80 hover:text-white hover:underline">Ayuda & FAQ</Link>
              </li>
            </ul>
            
            <h4 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Síguenos</h4>
            <div className="flex space-x-3 mb-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-charlotte-primary/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-charlotte-primary/40 transition-colors"
              >
                <Facebook size={18} className="text-white" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-charlotte-primary/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-charlotte-primary/40 transition-colors"
              >
                <Instagram size={18} className="text-white" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-charlotte-primary/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-charlotte-primary/40 transition-colors"
              >
                <Twitter size={18} className="text-white" />
              </a>
            </div>
            
            <h4 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Métodos de Pago</h4>
            <div className="flex flex-wrap gap-2">
              <div className="bg-white/10 rounded p-1">
                <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-6" />
              </div>
              <div className="bg-white/10 rounded p-1">
                <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="MasterCard" className="h-6" />
              </div>
              <div className="bg-white/10 rounded p-1">
                <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-6" />
              </div>
              <div className="bg-white/10 rounded p-1">
                <img src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="American Express" className="h-6" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer bottom */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="font-charlotte text-2xl font-bold">Charlotte ARCS</div>
            <p className="text-white/60 text-sm">© {currentYear} Todos los derechos reservados.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-white/60">
            <Link to="/terms" className="hover:text-white transition-colors">Términos</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contacto</Link>
            <a href="#" className="hover:text-white transition-colors">Mapa del Sitio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
