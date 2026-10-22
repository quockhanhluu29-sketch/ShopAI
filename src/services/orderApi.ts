import axiosClient from '@api/axiosClient';
import { API_ENDPOINTS } from '@constants/api';
import { recordBreadcrumb, recordNonFatal } from '@services/crashReporter';
import type { CartItem, OrderRecord } from '../types/orders';

interface OrderResponse {
  id: string;
  status: 'PENDING' | 'PAID';
  total: number;
  createdAt: string;
  items: Array<{ productId: string; name: string; price: number; quantity: number; image?: string }>;
}

const toOrderRecord = (order: OrderResponse): OrderRecord => ({
  id: order.id,
  status: order.status,
  total: order.total,
  createdAt: order.createdAt,
  items: order.items.map(item => ({
    id: item.productId,
    name: item.name,
    category: 'Khác',
    price: item.price,
    rating: 0,
    image: item.image ?? 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500',
    description: '',
    inventory: 0,
    quantity: item.quantity,
  })),
});

export const fetchOrders = async (): Promise<OrderRecord[]> => {
  const { data } = await axiosClient.get<OrderResponse[]>(API_ENDPOINTS.orders);
  return data.map(toOrderRecord);
};

export const fetchOrderById = async (orderId: string): Promise<OrderRecord> => {
  const { data } = await axiosClient.get<OrderResponse>(`${API_ENDPOINTS.orders}/${orderId}`);
  return toOrderRecord(data);
};

export const createOrder = async (items: CartItem[], total: number): Promise<OrderRecord> => {
  recordBreadcrumb(`Checkout requested; items=${items.length}`);
  try {
    const { data } = await axiosClient.post<OrderResponse>(API_ENDPOINTS.orders, {
      items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
      total,
    });
    recordBreadcrumb(`Checkout created order ${data.id}`);
    return toOrderRecord(data);
  } catch (error) {
    recordNonFatal('CheckoutOrderFailed', error, { cart_item_count: String(items.length), cart_total: String(total) });
    throw error;
  }
};

export const payOrder = async (orderId: string): Promise<OrderRecord> => {
  const { data } = await axiosClient.post<OrderResponse>(`${API_ENDPOINTS.orders}/${orderId}/pay`);
  return toOrderRecord(data);
};