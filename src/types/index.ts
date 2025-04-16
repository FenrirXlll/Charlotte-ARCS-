export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  path?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  image: string;
  category: string;
  is_new: boolean;
  inventory_count: number;
  created_at: string;
  updated_at?: string;
  additional_images?: ProductImage[];
  details?: ProductDetail[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface ProductDetail {
  id: string;
  product_id: string;
  specification_key: string;
  specification_value: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  user_id?: string;
  session_id?: string;
  quantity: number;
  product: Product;
}

export interface WishlistItem {
  id: string;
  product_id: string;
  user_id: string;
  added_at: string;
  product: Product;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  created_at: string;
  shipping_address: string;
  payment_method: string;
  user_name?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Comment {
  id: string;
  user_id: string;
  content: string;
  rating: number;
  created_at: string;
  user_name: string;
  user_avatar?: string;
  product_id?: string;
  product_name?: string;
  reply_to?: string;
  replies?: Comment[];
}
