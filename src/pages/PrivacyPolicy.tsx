
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="prose max-w-none">
            <p className="mb-4">Última actualización: 15 de Abril, 2025</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Información que Recopilamos</h2>
            <p className="mb-4">
              En Charlotte ARCS, recopilamos diferentes tipos de información para proporcionar y mejorar nuestros servicios, incluyendo información personal que usted proporciona directamente, información de uso que recopilamos automáticamente e información de terceros.
            </p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Información Personal</h3>
            <p className="mb-4">
              Podemos recopilar la siguiente información personal:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Nombre y apellidos</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Dirección postal</li>
              <li>Información de pago</li>
              <li>Historial de compras</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Información de Uso</h3>
            <p className="mb-4">
              También recopilamos información sobre cómo utiliza nuestros servicios, incluyendo:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Dirección IP</li>
              <li>Tipo de navegador</li>
              <li>Páginas visitadas</li>
              <li>Tiempo de visita</li>
              <li>Productos vistos</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Cómo Utilizamos su Información</h2>
            <p className="mb-4">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Procesar pedidos y transacciones</li>
              <li>Proporcionar servicio al cliente</li>
              <li>Mejorar nuestros productos y servicios</li>
              <li>Personalizar su experiencia</li>
              <li>Enviar comunicaciones de marketing (si ha dado su consentimiento)</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Compartir Información</h2>
            <p className="mb-4">
              Podemos compartir su información personal con:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Proveedores de servicios que nos ayudan a operar nuestro negocio</li>
              <li>Socios comerciales con su consentimiento</li>
              <li>Autoridades legales cuando sea necesario por ley</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Cookies y Tecnologías Similares</h2>
            <p className="mb-4">
              Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el tráfico y personalizar el contenido. Puede gestionar sus preferencias de cookies a través de la configuración de su navegador.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Sus Derechos</h2>
            <p className="mb-4">
              Dependiendo de su ubicación, puede tener ciertos derechos con respecto a sus datos personales, incluyendo:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>Derecho de acceso</li>
              <li>Derecho de rectificación</li>
              <li>Derecho de supresión</li>
              <li>Derecho de oposición</li>
              <li>Derecho a retirar el consentimiento</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Seguridad de Datos</h2>
            <p className="mb-4">
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso, uso o divulgación no autorizados.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Retención de Datos</h2>
            <p className="mb-4">
              Conservamos sus datos personales durante el tiempo necesario para cumplir con los fines para los que fueron recopilados, a menos que la ley requiera o permita un período de retención más largo.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Cambios a esta Política</h2>
            <p className="mb-4">
              Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos cualquier cambio material publicando la nueva Política de Privacidad en esta página.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Contacto</h2>
            <p className="mb-4">
              Si tiene preguntas o inquietudes sobre nuestra Política de Privacidad, por favor contáctenos a través de nuestra página de Contacto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
