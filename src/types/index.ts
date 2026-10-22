export type ProductCategory = string;

export interface Product {
  id: string | number;
  name: string;
  category: ProductCategory;
  price: number;
  rating: number;
  image: string;
  description: string;
  inventory: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  name: string;
  email: string;
  membership: string;
  points: number;
}

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}
