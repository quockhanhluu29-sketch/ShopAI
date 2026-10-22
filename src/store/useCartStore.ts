import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CartItem } from '../types/orders';
import type { Product } from '../types/product.schema';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalQuantity: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: product =>
        set(state => {
          const existing = state.items.find(item => item.id === product.id);
          return {
            items: existing
              ? state.items.map(item =>
                  item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
                )
              : [...state.items, { ...product, quantity: 1 }],
          };
        }),
      removeItem: productId => set(state => ({ items: state.items.filter(item => item.id !== productId) })),
      setQuantity: (productId, quantity) =>
        set(state => ({
          items:
            quantity < 1
              ? state.items.filter(item => item.id !== productId)
              : state.items.map(item => (item.id === productId ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ items: [] }),
      totalQuantity: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'shopai-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ items: state.items }) as CartState,
    },
  ),
);