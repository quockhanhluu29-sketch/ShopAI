import type { Product } from './product.schema';

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'PENDING' | 'PAID';

export interface OrderRecord {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
}