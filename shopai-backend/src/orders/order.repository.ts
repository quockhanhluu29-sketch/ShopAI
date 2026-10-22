import type { CreateOrderDto } from './dto/create-order.dto';

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

export interface OrderPriceLine {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface OrderRepository {
  create(userId: string, total: number, items: OrderPriceLine[]): Promise<unknown>;
  findByUser(userId: string): Promise<unknown[]>;
  findById(userId: string, orderId: string): Promise<unknown | null>;
  setPaid(userId: string, orderId: string): Promise<unknown | null>;
}

export type CreateOrderPayload = CreateOrderDto;