import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateOrderDto) {
    return this.orders.create(user.sub, dto);
  }

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.orders.list(user.sub);
  }

  @Get(':id')
  detail(@CurrentUser() user: AuthenticatedUser, @Param('id') orderId: string) {
    return this.orders.detail(user.sub, orderId);
  }

  @Post(':id/pay')
  pay(@CurrentUser() user: AuthenticatedUser, @Param('id') orderId: string) {
    return this.orders.pay(user.sub, orderId);
  }
}