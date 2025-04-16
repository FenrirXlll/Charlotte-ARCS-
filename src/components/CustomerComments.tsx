
import React, { useState } from 'react';
import { Star, MessageCircle, Send, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Comment } from '@/types';

interface CustomerCommentsProps {
  title?: string;
  subtitle?: string;
}

// Sample comments data with predefined ratings to match 4.5 stars average
const sampleComments: Comment[] = [
  {
    id: "1",
    user_id: "user1",
    user_name: "María Rodríguez",
    user_avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    content: "¡Excelente servicio! Los productos son de muy alta calidad y el trato del personal es inmejorable. La blusa que compré es exactamente como se veía en la foto y me quedó perfecta.",
    rating: 5,
    created_at: "2025-03-15T09:30:00Z"
  },
  {
    id: "2",
    user_id: "user2",
    user_name: "Carlos Mendoza",
    user_avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "Muy contento con mi compra. El envío fue rápido y el producto llegó en perfectas condiciones. Repetiré sin duda.",
    rating: 5,
    created_at: "2025-03-10T14:45:00Z"
  },
  {
    id: "3",
    user_id: "user3",
    user_name: "Sofía López",
    user_avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    content: "La calidad de los productos es excelente. He comprado varias veces y nunca me han decepcionado. El servicio al cliente también es muy bueno.",
    rating: 5,
    created_at: "2025-03-05T11:20:00Z"
  },
  {
    id: "4",
    user_id: "user4",
    user_name: "Javier Martínez",
    user_avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    content: "Me encanta esta tienda. Los diseños son únicos y la calidad es superior. Siempre encuentro algo que me gusta.",
    rating: 4,
    created_at: "2025-02-28T16:15:00Z"
  },
  {
    id: "5",
    user_id: "user5",
    user_name: "Lucía Hernández",
    user_avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    content: "El envío tardó más de lo esperado. La calidad del producto es buena, pero deberían mejorar los tiempos de entrega.",
    rating: 3,
    created_at: "2025-02-20T10:30:00Z",
    replies: [
      {
        id: "5-reply-1",
        user_id: "admin1",
        user_name: "Atención al Cliente",
        content: "Estimada Lucía, lamentamos la demora en su entrega. Estamos trabajando para mejorar nuestros tiempos de envío. Le agradecemos sus comentarios y le ofrecemos un 10% de descuento en su próxima compra como compensación.",
        rating: 5,
        created_at: "2025-02-21T09:15:00Z",
        reply_to: "5"
      }
    ]
  },
  {
    id: "6",
    user_id: "user6",
    user_name: "Eduardo González",
    user_avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    content: "Muy satisfecho con mi compra. El perfume es exactamente como lo describían y el aroma dura todo el día.",
    rating: 5,
    created_at: "2025-02-15T13:40:00Z"
  },
  {
    id: "7",
    user_id: "user7",
    user_name: "Ana Torres",
    user_avatar: "https://randomuser.me/api/portraits/women/42.jpg",
    content: "Excelente experiencia de compra. La página web es muy intuitiva y el proceso de pago es rápido y seguro.",
    rating: 5,
    created_at: "2025-02-10T17:25:00Z"
  },
  {
    id: "8",
    user_id: "user8",
    user_name: "Roberto Sánchez",
    user_avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    content: "Pedí un traje para una boda y llegó 2 días después de la fecha prometida. No pude usarlo para la ocasión. La calidad es buena, pero la demora fue inaceptable.",
    rating: 2,
    created_at: "2025-02-05T15:10:00Z",
    replies: [
      {
        id: "8-reply-1",
        user_id: "admin1",
        user_name: "Atención al Cliente",
        content: "Estimado Roberto, lamentamos profundamente esta situación. Entendemos la importancia de recibir los productos a tiempo, especialmente para ocasiones especiales. Nos gustaría ofrecerle un reembolso parcial como compensación. Por favor, contáctenos directamente para gestionarlo.",
        rating: 5,
        created_at: "2025-02-06T09:30:00Z",
        reply_to: "8"
      }
    ]
  },
  {
    id: "9",
    user_id: "user9",
    user_name: "Carmen Díaz",
    user_avatar: "https://randomuser.me/api/portraits/women/52.jpg",
    content: "Los cosméticos que compré son de excelente calidad. Me encanta que sean productos exclusivos que no se encuentran en otras tiendas.",
    rating: 5,
    created_at: "2025-01-30T12:50:00Z"
  },
  {
    id: "10",
    user_id: "user10",
    user_name: "Miguel Álvarez",
    user_avatar: "https://randomuser.me/api/portraits/men/72.jpg",
    content: "Compré un reloj como regalo para mi padre y quedó encantado. La presentación y el empaque son muy elegantes, perfectos para regalo.",
    rating: 5,
    created_at: "2025-01-25T14:30:00Z"
  }
];

const CustomerComments: React.FC<CustomerCommentsProps> = ({
  title = "Comentarios de nuestros clientes",
  subtitle = "Conoce las opiniones de quienes ya han confiado en nosotros"
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState<Comment[]>(sampleComments);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  
  // Calculate average rating
  const averageRating = comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length;
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;
  
  // Count ratings by star
  const ratingsCount = {
    5: comments.filter(c => c.rating === 5).length,
    4: comments.filter(c => c.rating === 4).length,
    3: comments.filter(c => c.rating === 3).length,
    2: comments.filter(c => c.rating === 2).length,
    1: comments.filter(c => c.rating === 1).length
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    
    const newComment: Comment = {
      id: `user${comments.length + 1}`,
      user_id: `temp-user-${Date.now()}`,
      user_name: "Usuario Anónimo",
      content: commentInput,
      rating: rating,
      created_at: new Date().toISOString()
    };
    
    setComments([newComment, ...comments]);
    setCommentInput('');
    setRating(5);
  };
  
  // Render star rating component
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={`${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-yellow-400' 
            : i < Math.ceil(rating) && rating % 1 >= 0.5 
              ? 'text-yellow-400 fill-yellow-400 opacity-50' 
              : 'text-gray-300'
        }`} 
      />
    ));
  };
  
  // Render star input for comment form
  const renderStarInput = () => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={24} 
        className={`cursor-pointer ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        onClick={() => setRating(i + 1)}
      />
    ));
  };
  
  return (
    <section className="py-12 bg-charlotte-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-charlotte-muted max-w-2xl mx-auto">{subtitle}</p>
          
          {/* Rating summary */}
          <div className="flex justify-center items-center mt-4 mb-6">
            <div className="flex items-center">
              <div className="text-4xl font-bold mr-3">{averageRating.toFixed(1)}</div>
              <div>
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      className={`${
                        i < fullStars 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : i === fullStars && hasHalfStar 
                            ? 'text-yellow-400 fill-yellow-400 opacity-50' 
                            : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <div className="text-sm text-charlotte-muted">{comments.length} opiniones</div>
              </div>
            </div>
          </div>
          
          {/* Rating bars */}
          <div className="max-w-md mx-auto mb-8">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center mb-1">
                <div className="w-10 text-sm font-medium">{star} ★</div>
                <div className="flex-1 mx-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${(ratingsCount[star as keyof typeof ratingsCount] / comments.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-10 text-sm text-right">{ratingsCount[star as keyof typeof ratingsCount]}</div>
              </div>
            ))}
          </div>
          
          {/* View mode toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm">
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                className={`rounded-l-md rounded-r-none ${viewMode === 'list' ? 'bg-charlotte-primary' : ''}`}
                onClick={() => setViewMode('list')}
              >
                Lista
              </Button>
              <Button 
                variant={viewMode === 'table' ? 'default' : 'outline'} 
                className={`rounded-r-md rounded-l-none ${viewMode === 'table' ? 'bg-charlotte-primary' : ''}`}
                onClick={() => setViewMode('table')}
              >
                Tabla
              </Button>
            </div>
          </div>
        </div>
        
        {/* Comment form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">Deja tu comentario</h3>
          <form onSubmit={handleSubmitComment}>
            <div className="flex items-center mb-4">
              <p className="mr-3">Tu valoración:</p>
              <div className="flex">{renderStarInput()}</div>
            </div>
            <div className="mb-4">
              <Textarea 
                placeholder="Comparte tu experiencia con nosotros..." 
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="min-h-24"
              />
            </div>
            <Button 
              type="submit" 
              className="bg-charlotte-primary hover:bg-charlotte-primary/90"
            >
              <Send size={16} className="mr-2" /> Enviar comentario
            </Button>
          </form>
        </div>
        
        {/* Comments display */}
        {viewMode === 'list' ? (
          <div className="space-y-6 max-w-3xl mx-auto">
            {comments.map(comment => (
              <div key={comment.id} className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-md animate-fade-in">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={comment.user_avatar} alt={comment.user_name} />
                      <AvatarFallback>{comment.user_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{comment.user_name}</h4>
                      <div className="flex">{renderStars(comment.rating)}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{comment.content}</p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <ThumbsUp size={14} className="mr-1" /> Útil
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <MessageCircle size={14} className="mr-1" /> Responder
                  </Button>
                </div>
                
                {/* Comment replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 pl-6 border-l-2 border-gray-100">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="bg-gray-50 rounded-lg p-4 mb-2">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{reply.user_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h5 className="font-medium text-charlotte-primary">{reply.user_name}</h5>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(reply.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Comentarios de nuestros clientes</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Valoración</TableHead>
                  <TableHead>Comentario</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map((comment) => (
                  <TableRow key={comment.id} className="hover:bg-gray-50 transition-colors animate-fade-in">
                    <TableCell className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={comment.user_avatar} alt={comment.user_name} />
                        <AvatarFallback>{comment.user_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{comment.user_name}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex">{renderStars(comment.rating)}</div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="line-clamp-2">{comment.content}</div>
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2 pt-2 border-t text-sm text-charlotte-primary">
                          Con {comment.replies.length} respuesta(s)
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerComments;
