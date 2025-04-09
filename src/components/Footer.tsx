
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charlotte-dark text-white mt-12">
      {/* Newsletter Subscription */}
      <div className="bg-charlotte-primary py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold">¡Suscríbete a nuestro boletín!</h3>
              <p className="mt-1 text-sm md:text-base">Recibe ofertas exclusivas y noticias de nuevas colecciones.</p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                className="border bg-white/10 backdrop-blur-sm border-white/20 placeholder:text-white/70"
              />
              <Button className="bg-white text-charlotte-primary hover:bg-white/90">
                Suscribirse <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h4 className="text-lg font-bold mb-4">Charlotte ARCS</h4>
            <p className="text-gray-300 mb-4 text-sm">
              Moda que refleja tu personalidad. En Charlotte ARCS nos dedicamos a crear experiencias de moda excepcionales desde 2018.
            </p>
            <Link to="/about-us" className="text-white flex items-center hover:text-charlotte-accent transition-colors text-sm">
              Conoce nuestra historia <ArrowRight size={14} className="ml-1" />
            </Link>
            <div className="flex space-x-3 mt-6">
              <a href="https://facebook.com" className="hover-scale" aria-label="Facebook">
                <Facebook size={20} className="hover:text-charlotte-accent transition-colors" />
              </a>
              <a href="https://instagram.com" className="hover-scale" aria-label="Instagram">
                <Instagram size={20} className="hover:text-charlotte-accent transition-colors" />
              </a>
              <a href="https://twitter.com" className="hover-scale" aria-label="Twitter">
                <Twitter size={20} className="hover:text-charlotte-accent transition-colors" />
              </a>
              <a href="https://youtube.com" className="hover-scale" aria-label="Youtube">
                <Youtube size={20} className="hover:text-charlotte-accent transition-colors" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Categories */}
          <div>
            <h4 className="text-lg font-bold mb-4">Categorías</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/mujeres" className="text-gray-300 hover:text-white transition-colors">Mujeres</Link></li>
              <li><Link to="/category/hombres" className="text-gray-300 hover:text-white transition-colors">Hombres</Link></li>
              <li><Link to="/category/jovenes" className="text-gray-300 hover:text-white transition-colors">Jóvenes</Link></li>
              <li><Link to="/category/bebes" className="text-gray-300 hover:text-white transition-colors">Bebés</Link></li>
              <li><Link to="/category/temporada" className="text-gray-300 hover:text-white transition-colors">Temporada</Link></li>
              <li><Link to="/category/escolar" className="text-gray-300 hover:text-white transition-colors">Escolar</Link></li>
              <li><Link to="/category/perfumeria" className="text-gray-300 hover:text-white transition-colors">Perfumería</Link></li>
              <li><Link to="/category/cosmeticos" className="text-gray-300 hover:text-white transition-colors">Cosméticos</Link></li>
              <li><Link to="/category/joyeria" className="text-gray-300 hover:text-white transition-colors">Joyería</Link></li>
              <li><Link to="/category/shop-c" className="text-gray-300 hover:text-white transition-colors">Shop-C</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Customer Service */}
          <div>
            <h4 className="text-lg font-bold mb-4">Atención al Cliente</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contacto</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-white transition-colors">Devoluciones y Cambios</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">Envíos</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Términos y Condiciones</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>
          
          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contacto</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 text-charlotte-accent" />
                <span className="text-gray-300">
                  Av. Insurgentes Sur 2375, Col. Tizapán, Ciudad de México, CP 01090
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-charlotte-accent" />
                <a href="tel:+525512345678" className="text-gray-300 hover:text-white transition-colors">
                  +52 55 1234 5678
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-charlotte-accent" />
                <a href="mailto:contacto@charlottearcs.com" className="text-gray-300 hover:text-white transition-colors">
                  contacto@charlottearcs.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h5 className="font-semibold mb-2">Horario de Atención</h5>
              <p className="text-gray-300 text-sm">
                Lunes a Sábado: 10:00 - 20:00<br />
                Domingo: 11:00 - 18:00
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} Charlotte ARCS. Todos los derechos reservados.
            </p>
            <div className="mt-4 md:mt-0">
              <img 
                src="https://placehold.co/240x30/8B5CF6/FFFFFF?text=Métodos+de+Pago" 
                alt="Métodos de pago" 
                className="h-8" 
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
