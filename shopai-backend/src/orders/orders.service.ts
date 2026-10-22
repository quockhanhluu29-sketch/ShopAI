import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { ORDER_REPOSITORY, type OrderRepository } from './order.repository';
import type { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
    private readonly products: ProductsService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const items = await Promise.all(dto.items.map(async item => {
      const product = await this.products.getByIdFromDb(item.productId);
      if (product.inventory < item.quantity) {
        throw new BadRequestException(`Sản phẩm ${product.name} không đủ tồn kho`);
      }
      return {
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      };
    }));
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (total !== dto.total) throw new BadRequestException('Tổng tiền không khớp với giá sản phẩm');
    return this.orders.create(userId, total, items);
  }

  list(userId: string) {
    return this.orders.findByUser(userId);
  }

  async detail(userId: string, orderId: string) {
    const order = await this.orders.findById(userId, orderId);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return order;
  }

  async pay(userId: string, orderId: string) {
    const order = await this.orders.setPaid(userId, orderId);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return order;
  }
}
