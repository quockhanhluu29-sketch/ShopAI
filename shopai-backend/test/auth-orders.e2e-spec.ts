import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth + Orders (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    prisma = app.get(PrismaService);
    const password = await bcrypt.hash('123456', 4);
    await prisma.user.upsert({
      where: { email: 'demo@shopai.com' },
      update: { password },
      create: { email: 'demo@shopai.com', name: 'ShopAI Demo', password },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('logs in and returns an access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'demo@shopai.com', password: '123456' })
      .expect(201);
    expect(response.body.accessToken).toEqual(expect.any(String));
    accessToken = response.body.accessToken;
  });

  it('rejects an invalid password', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'demo@shopai.com', password: 'wrong-password' })
      .expect(401);
  });

  it('rejects orders without a token', async () => {
    await request(app.getHttpServer())
      .post('/api/orders')
      .send({ items: [{ productId: 'backend_prod_0', quantity: 1 }], total: 390000 })
      .expect(401);
  });

  it('creates an order using the server price with a valid token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ items: [{ productId: 'backend_prod_0', quantity: 1 }], total: 390000 })
      .expect(201);
    expect(response.body.status).toBe('PENDING');
    expect(response.body.total).toBe(390000);
  });
});