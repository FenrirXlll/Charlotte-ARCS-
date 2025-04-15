
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Returns = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-6">Política de Devoluciones</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="prose max-w-none">
            <p className="mb-4">Última actualización: 15 de Abril, 2025</p>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mt-6 mb-3">Nuestra Promesa</h2>
              <p className="mb-4">
                En Charlotte ARCS nos comprometemos a ofrecer productos de la más alta calidad. Si no estás completamente satisfecho con tu compra, estamos aquí para ayudarte.
              </p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Período de Devolución</h2>
              <p className="mb-4">
                Aceptamos devoluciones dentro de los 30 días posteriores a la fecha de entrega del producto. Para ser elegible para una devolución, el artículo debe estar sin usar, en las mismas condiciones en que lo recibiste y en su embalaje original.
              </p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Cómo Iniciar una Devolución</h2>
              <p className="mb-4">Para iniciar una devolución, sigue estos pasos:</p>
              <ol className="list-decimal pl-5 mb-4 space-y-2">
                <li>Inicia sesión en tu cuenta Charlotte ARCS.</li>
                <li>Navega a la sección "Mis Pedidos" y selecciona el pedido que contiene el artículo que deseas devolver.</li>
                <li>Selecciona el artículo específico y elige la opción "Iniciar Devolución".</li>
                <li>Completa el formulario de devolución, seleccionando el motivo de la devolución.</li>
                <li>Recibirás por correo electrónico una etiqueta de devolución e instrucciones detalladas.</li>
                <li>Empaca el artículo en su embalaje original y adjunta la etiqueta de devolución.</li>
                <li>Envía el paquete a través del servicio de mensajería indicado.</li>
              </ol>
              <p className="mb-4">
                Alternativamente, puedes contactar a nuestro servicio al cliente al +1 (800) CHARLOTTE o enviar un correo electrónico a devoluciones@charlottearcs.com para recibir asistencia.
              </p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Condiciones de Devolución</h2>
              <p className="mb-4">Para que tu devolución sea aceptada, debe cumplir con las siguientes condiciones:</p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>El producto debe estar en su embalaje original con todas las etiquetas intactas.</li>
                <li>El producto no debe haber sido utilizado, dañado o alterado.</li>
                <li>Debe incluir todos los accesorios, manuales y elementos adicionales que vinieron con el producto.</li>
                <li>Debe proporcionar el comprobante de compra o número de pedido.</li>
              </ul>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Costos de Devolución</h2>
              <p className="mb-4">
                Para devoluciones debido a errores nuestros (producto incorrecto, defectuoso o dañado), cubriremos los costos de envío de la devolución.
              </p>
              <p className="mb-4">
                Para devoluciones por cambio de opinión o selección incorrecta, el cliente es responsable de los costos de envío de la devolución. Se aplicará una tarifa de reposición del 10% para estos casos.
              </p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Reembolsos</h2>
              <p className="mb-4">
                Una vez que recibamos e inspeccionemos el artículo devuelto, te notificaremos sobre la aprobación o rechazo de tu reembolso.
              </p>
              <p className="mb-4">
                Si tu devolución es aprobada, procesaremos el reembolso a tu método de pago original en un plazo máximo de 14 días. El tiempo que tarda en reflejarse en tu cuenta depende de las políticas de tu entidad bancaria o emisor de tarjeta.
              </p>
              <p className="mb-4">
                Ten en cuenta que los gastos de envío originales no son reembolsables, a menos que la devolución sea debido a un error nuestro.
              </p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Intercambios</h2>
              <p className="mb-4">
                Si deseas cambiar un producto por otro, debes iniciar una devolución y realizar un nuevo pedido para el artículo deseado. Esto nos permite procesar tu devolución y nuevo pedido de manera eficiente.
              </p>
              <p className="mb-4">
                Para asistencia con intercambios, por favor contacta a nuestro servicio al cliente.
              </p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Artículos No Retornables</h2>
              <p className="mb-4">
                Algunos productos no son elegibles para devolución, incluyendo:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>Productos de cuidado personal que han sido abiertos o usados (por razones higiénicas).</li>
                <li>Artículos personalizados o hechos a medida.</li>
                <li>Tarjetas de regalo o códigos de descuento.</li>
                <li>Productos con sello de garantía roto.</li>
                <li>Productos en venta final o con descuentos especificados como no retornables.</li>
              </ul>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Productos Defectuosos</h2>
              <p className="mb-4">
                Si recibes un producto defectuoso, por favor contacta a nuestro servicio al cliente dentro de las 48 horas posteriores a la recepción. Te guiaremos a través del proceso de devolución o reemplazo.
              </p>
              <p className="mb-4">
                Para productos defectuosos dentro del período de garantía, consulta nuestra política de garantía o contacta a nuestro servicio al cliente.
              </p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Contacto</h2>
              <p className="mb-4">
                Si tienes preguntas adicionales sobre nuestra política de devoluciones, no dudes en contactarnos:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>Teléfono: +1 (800) CHARLOTTE</li>
                <li>Email: devoluciones@charlottearcs.com</li>
                <li>Formulario de contacto: <Link to="/contact" className="text-charlotte-primary hover:underline">Página de Contacto</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;
