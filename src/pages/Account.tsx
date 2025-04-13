
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          
          if (data) {
            setFullName(data.full_name || '');
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    const loadOrders = async () => {
      if (user) {
        try {
          setOrdersLoading(true);
          const { data, error } = await supabase
            .from('orders')
            .select(`
              *,
              order_items:order_items(*, product:products(*))
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          
          setOrders(data || []);
        } catch (error) {
          console.error('Error loading orders:', error);
        } finally {
          setOrdersLoading(false);
        }
      }
    };

    loadUserData();
    loadOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charlotte-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      toast({
        title: 'Perfil actualizado',
        description: 'Tu información ha sido actualizada correctamente.',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `No se pudo actualizar el perfil: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mi Cuenta</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="orders">Mis Pedidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Actualiza tu información personal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      value={user.email || ''}
                      disabled
                    />
                    <p className="text-sm text-gray-500">
                      El correo electrónico no se puede cambiar.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre Completo</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleUpdateProfile} 
                    disabled={isUpdating}
                    className="bg-charlotte-primary"
                  >
                    {isUpdating ? 'Actualizando...' : 'Guardar Cambios'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Cuenta</CardTitle>
                  <CardDescription>
                    Gestiona tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    Miembro desde: {user.created_at ? formatDate(user.created_at) : 'N/A'}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => signOut()}
                  >
                    Cerrar Sesión
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pedidos</CardTitle>
              <CardDescription>
                Consulta tus pedidos anteriores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charlotte-primary"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aún no has realizado ningún pedido.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                          <p className="font-medium">Pedido #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status === 'completed' ? 'Completado' : 
                             order.status === 'processing' ? 'En proceso' :
                             order.status === 'cancelled' ? 'Cancelado' :
                             'Pendiente'}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <ul className="divide-y divide-gray-200">
                          {order.order_items.map((item: any) => (
                            <li key={item.id} className="py-4 flex">
                              <div className="flex-shrink-0 w-16 h-16">
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                              <div className="ml-4 flex-1">
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                <p className="text-sm font-medium">${(item.price).toFixed(2)}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t flex justify-between">
                          <span className="font-medium">Total</span>
                          <span className="font-bold">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;
