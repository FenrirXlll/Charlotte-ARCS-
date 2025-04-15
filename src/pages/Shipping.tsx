
import React from 'react';
import { ArrowLeft, Truck, Clock, MapPin, AlertCircle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Shipping = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-6">Política de Envíos</h1>
        
        {/* Hero section */}
        <div className="bg-charlotte-primary/10 p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-semibold mb-3">Envíos Rápidos y Seguros</h2>
              <p className="text-gray-700 mb-4">
                En Charlotte ARCS nos comprometemos a entregar tus productos de manera rápida, segura y eficiente. 
                Trabajamos con los mejores servicios de mensajería para garantizar que tus compras lleguen en perfectas condiciones.
              </p>
              <Button asChild className="bg-charlotte-primary">
                <Link to="/">Comprar Ahora</Link>
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.pexels.com/photos/6169493/pexels-photo-6169493.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Envíos Charlotte ARCS" 
                className="rounded-lg max-h-64 object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Shipping Methods */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Truck className="mr-2 h-5 w-5 text-charlotte-primary" />
            Métodos de Envío
          </h2>
          
          <Table>
            <TableCaption>Métodos de envío disponibles para México</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Método</TableHead>
                <TableHead>Tiempo Estimado</TableHead>
                <TableHead>Cobertura</TableHead>
                <TableHead className="text-right">Costo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Estándar</TableCell>
                <TableCell>3-5 días hábiles</TableCell>
                <TableCell>Nacional</TableCell>
                <TableCell className="text-right">$99 MXN</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Exprés</TableCell>
                <TableCell>1-2 días hábiles</TableCell>
                <TableCell>Nacional</TableCell>
                <TableCell className="text-right">$199 MXN</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Premium</TableCell>
                <TableCell>Mismo día (CDMX y área metropolitana)</TableCell>
                <TableCell>Local</TableCell>
                <TableCell className="text-right">$299 MXN</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Internacional</TableCell>
                <TableCell>7-14 días hábiles</TableCell>
                <TableCell>América y Europa</TableCell>
                <TableCell className="text-right">Desde $499 MXN</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <p className="mt-4 text-sm text-gray-600">
            * Los tiempos de entrega pueden variar dependiendo de la ubicación, disponibilidad y condiciones externas como clima, festividades o situaciones extraordinarias.
          </p>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
            <AlertCircle className="text-yellow-500 mr-3 h-5 w-5 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Envío Gratuito</p>
              <p className="text-sm text-yellow-700">
                Disfruta de envío gratuito en todos los pedidos nacionales superiores a $1,500 MXN. 
                Aplican términos y condiciones.
              </p>
            </div>
          </div>
        </div>
        
        {/* Delivery Times */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-charlotte-primary" />
            Tiempos de Entrega
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">México</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between">
                  <span>Ciudad de México</span>
                  <span>1-3 días hábiles</span>
                </li>
                <li className="flex justify-between">
                  <span>Área Metropolitana</span>
                  <span>2-3 días hábiles</span>
                </li>
                <li className="flex justify-between">
                  <span>Ciudades Principales</span>
                  <span>2-4 días hábiles</span>
                </li>
                <li className="flex justify-between">
                  <span>Resto del País</span>
                  <span>3-5 días hábiles</span>
                </li>
                <li className="flex justify-between">
                  <span>Zonas Extendidas</span>
                  <span>5-7 días hábiles</span>
                </li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Internacional</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between">
                  <span>Estados Unidos</span>
                  <span>3-7 días hábiles</span>
                </li>
                <li className="flex justify-between">
                  <span>Canadá</span>
                  <span>5-10 días hábiles</span>
                </li>
                <li className="flex justify-between">
                  <span>América Latina</span>
                  <span>7-14 días hábiles</span>
                </li>
                <li className="flex justify-between">
                  <span>Europa</span>
                  <span>10-15 días hábiles</span>
                </li>
                <li className="flex justify-between">
                  <span>Resto del Mundo</span>
                  <span>15-21 días hábiles</span>
                </li>
              </ul>
            </div>
          </div>
          
          <p className="mt-4 text-sm text-gray-600">
            * Los tiempos de entrega indicados son estimados y comienzan a partir de la confirmación de tu pedido y verificación de pago.
          </p>
        </div>
        
        {/* Tracking & Packaging */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-charlotte-primary" />
              Seguimiento de Pedidos
            </h2>
            <p className="text-gray-700 mb-4">
              Todos nuestros envíos incluyen un número de seguimiento que te permitirá monitorear el estado de tu pedido en tiempo real.
            </p>
            <p className="text-gray-700 mb-4">
              Recibirás un correo electrónico con el número de seguimiento una vez que tu pedido haya sido enviado. También puedes consultar el estado de tus pedidos en tu cuenta de Charlotte ARCS.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/account">Seguir mi Pedido</Link>
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="mr-2 h-5 w-5 text-charlotte-primary" />
              Embalaje y Sostenibilidad
            </h2>
            <p className="text-gray-700 mb-4">
              En Charlotte ARCS nos comprometemos con el medio ambiente. Utilizamos materiales de embalaje sostenibles y reciclables para reducir nuestro impacto ambiental.
            </p>
            <p className="text-gray-700 mb-4">
              Todos nuestros productos son cuidadosamente empaquetados para garantizar que lleguen en perfectas condiciones.
            </p>
            <div className="flex justify-center">
              <img 
                src="https://images.pexels.com/photos/5921/wood-landscape-mountains-nature.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Embalaje sostenible" 
                className="rounded-md h-32 object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* FAQs */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-6">Preguntas Frecuentes sobre Envíos</h2>
          
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>¿Cómo puedo rastrear mi pedido?</AccordionTrigger>
              <AccordionContent>
                Una vez que tu pedido haya sido enviado, recibirás un correo electrónico con el número de seguimiento. 
                También puedes rastrear tu pedido iniciando sesión en tu cuenta de Charlotte ARCS y visitando la sección 
                "Mis Pedidos". Allí encontrarás un enlace directo al servicio de seguimiento del transportista.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>¿Qué sucede si no estoy en casa cuando llegue mi pedido?</AccordionTrigger>
              <AccordionContent>
                Si no estás en casa en el momento de la entrega, el transportista dejará un aviso y generalmente intentará la 
                entrega al día siguiente. Dependiendo del transportista, es posible que puedas reprogramar la entrega o 
                solicitar que el paquete se deje en un punto de recogida. Para más detalles, contacta directamente al 
                transportista usando el número de seguimiento proporcionado.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>¿Realizan envíos a apartados postales?</AccordionTrigger>
              <AccordionContent>
                Sí, realizamos envíos a apartados postales para pedidos nacionales. Sin embargo, para pedidos internacionales, 
                requerimos una dirección física completa para garantizar la entrega correcta y el seguimiento adecuado.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>¿Qué debo hacer si mi pedido llega dañado?</AccordionTrigger>
              <AccordionContent>
                Si tu pedido llega dañado, por favor contacta a nuestro servicio al cliente dentro de las 48 horas posteriores 
                a la recepción. Te pediremos que envíes fotos del paquete y de los productos dañados. Dependiendo de la 
                situación, organizaremos un reemplazo o un reembolso. Es importante conservar el embalaje original y todos los 
                documentos de envío hasta que se resuelva la situación.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>¿Puedo cambiar la dirección de envío después de realizar mi pedido?</AccordionTrigger>
              <AccordionContent>
                Si necesitas cambiar la dirección de envío, contacta a nuestro servicio al cliente lo antes posible. Podemos 
                modificar la dirección siempre y cuando el pedido no haya sido enviado aún. Una vez que el pedido ha sido 
                procesado para envío, no es posible cambiar la dirección.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger>¿Cómo funcionan los envíos internacionales?</AccordionTrigger>
              <AccordionContent>
                Para envíos internacionales, utilizamos servicios de mensajería internacional. Ten en cuenta que pueden 
                aplicarse impuestos de importación, aranceles y tasas adicionales dependiendo del país de destino. 
                Estos cargos son responsabilidad del cliente y no están incluidos en el precio de envío. El tiempo de 
                entrega para envíos internacionales puede variar significativamente dependiendo de los procesos aduaneros 
                del país de destino.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        {/* Contact & Support */}
        <div className="bg-charlotte-light p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-3">¿Tienes más preguntas sobre envíos?</h2>
          <p className="mb-4">Nuestro equipo de atención al cliente está listo para ayudarte con cualquier consulta.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-charlotte-primary">
              <Link to="/contact">Contáctanos</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/faq">Ver FAQs</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
