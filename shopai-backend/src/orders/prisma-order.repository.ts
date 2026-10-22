import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { OrderPriceLine, OrderRepository } from './order.repository';

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, total: number, items: OrderPriceLine[]) {
    return this.prisma.order.create({
      data: {
        id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId,
        total,
        status: 'PENDING',
        items: { create: items },
      },
      include: { items: true },
    });
  }

  findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  findById(userId: string, orderId: string) {
    return this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true },
    });
  }

  async setPaid(userId: string, orderId: string) {
    const order = await this.findById(userId, orderId);
    if (!order) return null;
    if (order.status === 'PAID') return order;
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
      include: { items: true },
    });
  }
}