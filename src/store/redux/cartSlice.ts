import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Product } from '../../types/product.schema';

export interface ReduxCartItem extends Product {
  quantity: number;
}

interface ReduxCartState {
  items: ReduxCartItem[];
}

const initialState: ReduxCartState = { items: [] };

const cartSlice = createSlice({
  name: 'cartRedux',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) existing.quantity += 1;
      else state.items.push({ ...action.payload, quantity: 1 });
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearItems: state => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, clearItems } = cartSlice.actions;
export default cartSlice.reducer;