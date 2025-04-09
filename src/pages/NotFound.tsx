
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white">
      <div className="text-center max-w-md px-4">
        <div className="text-charlotte-primary text-7xl md:text-9xl font-bold mb-4">404</div>
        <h1 className="text-2xl md:text-3xl font-bold text-charlotte-dark mb-4">Página no encontrada</h1>
        <p className="text-charlotte-muted mb-8">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-charlotte-primary hover:bg-charlotte-primary/90">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Volver al inicio
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" /> Regresar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
