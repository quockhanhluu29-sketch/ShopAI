import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateProductDto } from './dto/create-product.dto';

export interface ProductRecord {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  inventory: number;
}

const categories = ['Điện tử', 'Thời trang', 'Nhà cửa', 'Sức khỏe', 'Nội thất'];
const images = [
  'photo-1505740420928-5e560c06d30e',
  'photo-1546435770-a3e426bf472b',
  'photo-1523275335684-37898b6baf30',
  'photo-1521572267360-ee0c2909d518',
  'photo-1498049794561-7780e7231661',
];

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFromDb(): Promise<ProductRecord[]>;
  async getAllFromDb(
    page: number,
    limit?: number,
  ): Promise<{ items: ProductRecord[]; nextPage: number | null }>;
  async getAllFromDb(
    page?: number,
    limit = 10,
  ): Promise<ProductRecord[] | { items: ProductRecord[]; nextPage: number | null }> {
    if (page === undefined) {
      return this.prisma.product.findMany({ orderBy: [{ name: 'asc' }, { id: 'asc' }] });
    }

    const safePage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
    const safeLimit = Number.isFinite(limit) ? Math.min(100, Math.max(1, Math.floor(limit))) : 10;
    const skip = (safePage - 1) * safeLimit;
    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: safeLimit,
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
      }),
      this.prisma.product.count(),
    ]);

    return { items, nextPage: skip + items.length < total ? safePage + 1 : null };
  }

  async getByIdFromDb(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return product;
  }

  async createInDb(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: { id: randomUUID(), ...dto, rating: 4.5, inventory: 1 },
    });
  }

  private readonly products: ProductRecord[] = Array.from({ length: 20 }, (_, index) => ({
    id: `backend_prod_${index}`,
    name: [
      'Tai nghe Bluetooth Pro',
      'Tai nghe chống ồn Studio',
      'Đồng hồ thông minh Active',
      'Áo khoác Everyday',
      'Bộ sạc nhanh 65W',
    ][index % 5],
    category: categories[index % categories.length],
    price: 390000 + index * 170000,
    rating: Number((4.2 + (index % 8) * 0.1).toFixed(1)),
    image: `https://images.unsplash.com/${images[index % images.length]}?auto=format&fit=crop&w=900&q=85`,
    description: 'Thiết kế chỉn chu, lựa chọn cân bằng cho nhu cầu sử dụng hàng ngày.',
    inventory: 8 + index * 2,
  }));

  getAll(page?: number, limit = 10) {
    if (page === undefined) return this.products;
    const start = (page - 1) * limit;
    const items = this.products.slice(start, start + limit);
    return { items, nextPage: start + limit < this.products.length ? page + 1 : null };
  }

  getById(id: string): ProductRecord {
    const product = this.products.find(item => item.id === id);
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return product;
  }

  create(dto: CreateProductDto): ProductRecord {
    const product: ProductRecord = {
      id: `backend_prod_${Date.now()}`,
      ...dto,
      rating: 4.5,
      inventory: 1,
    };
    this.products.unshift(product);
    return product;
  }
}
