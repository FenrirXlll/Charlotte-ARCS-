
import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQs = [
  {
    id: "1",
    question: "¿Cuáles son los métodos de pago aceptados?",
    answer: "Aceptamos tarjetas de crédito y débito (Visa, MasterCard, American Express), PayPal, transferencias bancarias y pago contra entrega en algunas regiones. Todos los pagos se procesan de forma segura a través de nuestra plataforma."
  },
  {
    id: "2",
    question: "¿Cuánto tiempo tarda en llegar mi pedido?",
    answer: "El tiempo de entrega depende de tu ubicación. Generalmente, los pedidos nacionales se entregan en 3-5 días hábiles. Los pedidos internacionales pueden tardar entre 7-14 días hábiles. Una vez que realices tu pedido, recibirás un correo electrónico con el número de seguimiento para que puedas monitorear tu envío."
  },
  {
    id: "3",
    question: "¿Puedo cambiar o cancelar mi pedido?",
    answer: "Puedes modificar o cancelar tu pedido dentro de las primeras 24 horas después de realizarlo contactando a nuestro servicio al cliente. Una vez que el pedido ha sido procesado y enviado, no será posible realizar cambios o cancelaciones."
  },
  {
    id: "4",
    question: "¿Cómo puedo devolver un producto?",
    answer: "Aceptamos devoluciones dentro de los 30 días posteriores a la recepción del producto. El artículo debe estar sin usar, con todas las etiquetas originales y en su embalaje original. Para iniciar una devolución, ve a la sección 'Mis Pedidos' en tu cuenta o contacta a nuestro servicio al cliente."
  },
  {
    id: "5",
    question: "¿Los productos tienen garantía?",
    answer: "Sí, todos nuestros productos tienen una garantía mínima de 6 meses contra defectos de fabricación. Algunos productos premium pueden tener garantías extendidas de hasta 2 años. Los detalles específicos de la garantía se incluyen en la descripción de cada producto."
  },
  {
    id: "6",
    question: "¿Realizan envíos internacionales?",
    answer: "Sí, realizamos envíos a la mayoría de los países. Los costos de envío y tiempos de entrega varían según la ubicación. Durante el proceso de compra, podrás ver los costos exactos de envío a tu país antes de finalizar tu pedido."
  },
  {
    id: "7",
    question: "¿Cómo puedo rastrear mi pedido?",
    answer: "Una vez que tu pedido ha sido enviado, recibirás un correo electrónico con el número de seguimiento y el enlace para rastrearlo. También puedes iniciar sesión en tu cuenta y verificar el estado de tu pedido en la sección 'Mis Pedidos'."
  },
  {
    id: "8",
    question: "¿Ofrecen descuentos para compras al por mayor?",
    answer: "Sí, ofrecemos descuentos especiales para compras al por mayor. Si estás interesado en realizar una compra de este tipo, por favor contáctanos a través de nuestra sección de Contacto o envía un correo a ventas@charlottearcs.com para recibir una cotización personalizada."
  },
  {
    id: "9",
    question: "¿Cómo puedo contactar al servicio al cliente?",
    answer: "Puedes contactarnos por teléfono al +1-800-CHARLOTTE de lunes a viernes de 9am a 6pm, por correo electrónico a soporte@charlottearcs.com, o a través del chat en vivo en nuestra página web durante el horario de atención."
  },
  {
    id: "10",
    question: "¿Tienen tiendas físicas?",
    answer: "Actualmente contamos con tiendas físicas en las principales ciudades. Puedes encontrar la tienda más cercana utilizando el localizador de tiendas en nuestra página web, en la sección 'Nuestras Tiendas'."
  }
];

// Categorías para las preguntas
const categories = [
  { id: "all", name: "Todas" },
  { id: "shipping", name: "Envíos" },
  { id: "payment", name: "Pagos" },
  { id: "returns", name: "Devoluciones" },
  { id: "product", name: "Productos" }
];

const FAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrar FAQs basadas en la búsqueda y categoría seleccionada
  const filteredFAQs = FAQs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-6">Preguntas Frecuentes</h1>

        {/* Búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar en las preguntas frecuentes..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-charlotte-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categorías */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "bg-charlotte-primary" : ""}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left font-medium text-lg hover:text-charlotte-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No se encontraron preguntas que coincidan con tu búsqueda.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-2 text-charlotte-primary"
                >
                  Restablecer búsqueda
                </Button>
              </div>
            )}
          </Accordion>
        </div>

        {/* Contacto adicional */}
        <div className="bg-charlotte-light mt-8 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-3">¿No encontraste lo que buscabas?</h2>
          <p className="mb-4">Nuestro equipo de atención al cliente está listo para ayudarte con cualquier consulta.</p>
          <Button asChild className="bg-charlotte-primary">
            <Link to="/contact">Contáctanos</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
