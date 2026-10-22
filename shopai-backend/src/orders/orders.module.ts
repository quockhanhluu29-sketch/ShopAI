import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaOrderRepository } from './prisma-order.repository';
import { ORDER_REPOSITORY } from './order.repository';

@Module({
  imports: [ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaOrderRepository, { provide: ORDER_REPOSITORY, useExisting: PrismaOrderRepository }],
})
export class OrdersModule {}