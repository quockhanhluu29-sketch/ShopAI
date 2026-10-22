import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'buyer@shopai.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'Nguyễn Minh An' })
  @IsString()
  @MinLength(2)
  name!: string;
}