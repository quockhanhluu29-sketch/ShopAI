import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const passwordHash = bcrypt.hashSync('123456', 4);
  const prisma = {
    user: { findUnique: jest.fn() },
  };
  const jwt = { signAsync: jest.fn().mockResolvedValue('signed.jwt.token') };
  const config = { get: jest.fn().mockReturnValue('7d') };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('returns a JWT and public user for valid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'demo@shopai.com',
      name: 'ShopAI Demo',
      password: passwordHash,
    });

    await expect(service.login({ email: 'demo@shopai.com', password: '123456' })).resolves.toEqual({
      accessToken: 'signed.jwt.token',
      user: { id: 'user-1', email: 'demo@shopai.com', name: 'ShopAI Demo' },
    });
  });

  it.each([
    ['unknown user', null, '123456'],
    ['wrong password', { id: 'user-1', email: 'demo@shopai.com', name: 'Demo', password: passwordHash }, 'incorrect'],
  ])('rejects %s', async (_caseName, user, password) => {
    prisma.user.findUnique.mockResolvedValue(user);
    await expect(service.login({ email: 'demo@shopai.com', password })).rejects.toBeInstanceOf(UnauthorizedException);
  });
});