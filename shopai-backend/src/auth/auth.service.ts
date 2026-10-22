import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
    return this.issueToken(user);
  }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email đã được sử dụng');
    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({ data: { email, password, name: dto.name.trim() } });
    return this.issueToken(user);
  }

  private async issueToken(user: { id: string; email: string; name: string }) {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email, name: user.name },
      { expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '7d') as `${number}${'s' | 'm' | 'h' | 'd'}` },
    );
    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}