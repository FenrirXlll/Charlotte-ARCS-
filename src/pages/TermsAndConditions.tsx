
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="prose max-w-none">
            <p className="mb-4">Última actualización: 15 de Abril, 2025</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Introducción</h2>
            <p className="mb-4">
              Bienvenido a Charlotte ARCS. Al acceder a este sitio web y utilizar nuestros servicios, usted acepta cumplir con estos términos y condiciones, nuestra Política de Privacidad y cualquier otro aviso legal publicado en el sitio.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Uso del Sitio</h2>
            <p className="mb-4">
              Usted acepta utilizar nuestro sitio web y servicios únicamente para fines legales y de manera que no infrinja los derechos de terceros ni restrinja o impida el uso y disfrute del sitio por parte de terceros.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Productos y Precios</h2>
            <p className="mb-4">
              Todos los productos que se muestran en nuestro sitio web están sujetos a disponibilidad. Nos reservamos el derecho de cambiar los precios de los productos que se muestran en nuestro sitio web en cualquier momento y sin previo aviso.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Proceso de Compra</h2>
            <p className="mb-4">
              Al realizar un pedido a través de nuestro sitio web, usted garantiza que está legalmente capacitado para celebrar contratos vinculantes y que tiene al menos 18 años de edad.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Envíos y Entregas</h2>
            <p className="mb-4">
              Haremos todo lo posible para entregar los productos en el plazo indicado. Sin embargo, no seremos responsables de los retrasos causados por circunstancias fuera de nuestro control razonable.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Devoluciones y Reembolsos</h2>
            <p className="mb-4">
              Para obtener información detallada sobre nuestra política de devoluciones y reembolsos, consulte nuestra página de Devoluciones.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Propiedad Intelectual</h2>
            <p className="mb-4">
              El contenido de este sitio web, incluyendo, pero no limitado a, el texto, gráficos, logotipos, iconos y software, es propiedad de Charlotte ARCS y está protegido por leyes de derechos de autor.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Limitación de Responsabilidad</h2>
            <p className="mb-4">
              En la medida máxima permitida por la ley, Charlotte ARCS no será responsable por ningún daño directo, indirecto, incidental, especial, consecuente o punitivo.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Ley Aplicable</h2>
            <p className="mb-4">
              Estos términos y condiciones se regirán e interpretarán de acuerdo con las leyes del país donde Charlotte ARCS tiene su sede.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">10. Cambios en los Términos</h2>
            <p className="mb-4">
              Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Su uso continuado del sitio web después de cualquier cambio constituye su aceptación de los nuevos términos y condiciones.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">11. Contacto</h2>
            <p className="mb-4">
              Si tiene alguna pregunta sobre estos términos y condiciones, póngase en contacto con nosotros a través de nuestra página de Contacto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
