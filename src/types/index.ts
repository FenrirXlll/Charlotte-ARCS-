
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Category {
  id: string;
  name: string;
  path: string;
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
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  created_at: string;
  shipping_address: string;
  payment_method: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
}
