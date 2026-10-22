import { useCartStore } from '../useCartStore';
import type { Product } from '../../types/product.schema';

const headset: Product = {
  id: 'headset-1',
  name: 'Tai nghe Pro',
  category: 'Điện tử',
  price: 500000,
  rating: 4.8,
  image: 'https://example.com/headset.jpg',
  description: 'Tai nghe thử nghiệm.',
  inventory: 5,
};

describe('useCartStore', () => {
  beforeEach(() => useCartStore.setState({ items: [] }));

  it('adds products and merges duplicate quantities', () => {
    useCartStore.getState().addItem(headset);
    useCartStore.getState().addItem(headset);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it('calculates quantity and price and removes items', () => {
    useCartStore.getState().addItem(headset);
    useCartStore.getState().setQuantity(headset.id, 3);

    expect(useCartStore.getState().totalQuantity()).toBe(3);
    expect(useCartStore.getState().totalPrice()).toBe(1500000);

    useCartStore.getState().removeItem(headset.id);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('clears the cart', () => {
    useCartStore.getState().addItem(headset);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toEqual([]);
  });
});