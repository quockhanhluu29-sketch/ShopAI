import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Tai nghe chống ồn' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'Điện tử' })
  @IsString()
  category!: string;

  @ApiProperty({ example: 1590000, minimum: 1 })
  @IsNumber()
  @Min(1)
  price!: number;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b' })
  @IsUrl({ require_protocol: true })
  image!: string;

  @ApiProperty({ example: 'Âm thanh chi tiết, pin bền.' })
  @IsString()
  description!: string;
}