
import React, { useState } from 'react';
import { Star, StarHalf, Send, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ReviewsProps {
  averageRating?: number;
  totalReviews?: number;
}

const CustomerReviewsSection: React.FC<ReviewsProps> = ({
  averageRating = 4.5,
  totalReviews = 1248
}) => {
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [showForm, setShowForm] = useState(false);

  // Demo reviews
  const reviews = [
    {
      id: '1',
      user_name: 'María López',
      user_avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      rating: 5,
      content: '¡Me encantaron los productos! La ropa es de excelente calidad y el perfume tiene un aroma delicioso que dura todo el día.',
      created_at: '2023-11-10'
    },
    {
      id: '2',
      user_name: 'Roberto Gómez',
      user_avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
      rating: 5,
      content: 'Mi esposa quedó fascinada con el vestido y los cosméticos. El servicio al cliente también es excelente, muy atentos a resolver todas mis dudas.',
      created_at: '2023-12-05'
    },
    {
      id: '3',
      user_name: 'Ana Martínez',
      user_avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      rating: 4,
      content: 'Los productos son de muy buena calidad, especialmente la línea de perfumes. Solo le quito una estrella porque el envío tardó un poco más de lo esperado.',
      created_at: '2024-01-15'
    },
    {
      id: '4',
      user_name: 'Carlos Rodríguez',
      user_avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      rating: 2,
      content: 'La calidad de los productos es buena, pero el envío tardó casi tres semanas en llegar. Deberían mejorar sus tiempos de entrega.',
      created_at: '2024-02-20'
    },
    {
      id: '5',
      user_name: 'Laura Sánchez',
      user_avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      rating: 5,
      content: '¡Increíble experiencia de compra! Los perfumes son únicos y duraderos. Ya es la tercera vez que compro y siempre quedo satisfecha.',
      created_at: '2024-03-01'
    },
    {
      id: '6',
      user_name: 'Miguel Torres',
      user_avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
      rating: 5,
      content: 'Compré varias prendas para mi familia y todos quedaron encantados. La calidad y los diseños son excepcionales.',
      created_at: '2024-03-18'
    },
    {
      id: '7',
      user_name: 'Patricia Flores',
      user_avatar: 'https://randomuser.me/api/portraits/women/37.jpg',
      rating: 1,
      content: 'Pedí un conjunto que nunca llegó. El servicio de atención al cliente tardó mucho en responder a mi reclamo.',
      created_at: '2024-03-25'
    },
    {
      id: '8',
      user_name: 'Alejandro Díaz',
      user_avatar: 'https://randomuser.me/api/portraits/men/19.jpg',
      rating: 5,
      content: 'Los cosméticos son de primera calidad. Mi esposa está encantada con los resultados, sin duda seguiremos comprando.',
      created_at: '2024-04-02'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !name.trim()) {
      toast.error('Por favor complete todos los campos');
      return;
    }
    
    toast.success('¡Gracias por tu comentario!', {
      description: 'Tu opinión es muy importante para nosotros.'
    });
    
    setComment('');
    setName('');
    setRating(5);
    setShowForm(false);
  };

  // Generate full and half stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="text-yellow-400 fill-yellow-400" size={18} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="text-yellow-400 fill-yellow-400" size={18} />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={18} />);
    }
    
    return stars;
  };

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-charlotte-dark mb-4">Lo Que Dicen Nuestros Clientes</h2>
          <p className="text-charlotte-muted max-w-2xl mx-auto">
            Descubre por qué miles de clientes confían en Charlotte ARCS para sus compras de moda, perfumería y cosméticos.
          </p>
          
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center mr-4">
              {renderStars(averageRating)}
            </div>
            <div className="text-charlotte-dark">
              <span className="font-bold text-xl">{averageRating}</span>
              <span className="text-charlotte-muted text-sm ml-1">de 5 ({totalReviews} opiniones)</span>
            </div>
          </div>
        </div>
        
        {/* Rating distribution visual */}
        <div className="max-w-3xl mx-auto mb-12 bg-charlotte-light p-6 rounded-lg">
          <h3 className="font-semibold mb-4 text-center">Distribución de calificaciones</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => {
              // Calculate percentage for each rating
              const count = reviews.filter(r => Math.floor(r.rating) === star).length;
              const percentage = (count / reviews.length) * 100;
              
              return (
                <div key={star} className="flex items-center">
                  <div className="w-12 text-sm font-medium text-charlotte-dark">
                    {star} {star === 1 ? 'estrella' : 'estrellas'}
                  </div>
                  <div className="flex-1 h-4 mx-2 bg-gray-200 rounded">
                    <div 
                      className="h-4 bg-charlotte-primary rounded" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-sm font-medium text-charlotte-dark text-right">
                    {percentage.toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Customer comments table */}
        <div className="max-w-4xl mx-auto overflow-hidden bg-white shadow sm:rounded-lg mb-10">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calificación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map(review => (
                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={review.user_avatar} alt={review.user_name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{review.user_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">{review.content}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Comment form */}
        {!showForm ? (
          <div className="text-center">
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-charlotte-primary hover:bg-charlotte-primary/90"
            >
              Dejar mi opinión
            </Button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Comparte tu experiencia</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-charlotte-primary focus:border-charlotte-primary"
                  placeholder="Tu nombre"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calificación
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                                     cursor-pointer hover:scale-110 transition-transform`} 
                        size={24} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Comentario
                </label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-charlotte-primary focus:border-charlotte-primary"
                  rows={4}
                  placeholder="Cuéntanos tu experiencia con nuestros productos..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-charlotte-primary hover:bg-charlotte-primary/90"
                >
                  <Send size={16} className="mr-2" /> Enviar comentario
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerReviewsSection;
