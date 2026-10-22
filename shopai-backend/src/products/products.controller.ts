import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách sản phẩm, hỗ trợ phân trang' })
  getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    if (page === undefined) return this.products.getAllFromDb();
    return this.products.getAllFromDb(Number(page), limit ? Number(limit) : 10);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.products.getByIdFromDb(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.products.createInDb(dto);
  }
}
