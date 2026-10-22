import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'backend_prod_0' })
  @IsString()
  productId!: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @ApiProperty({ example: 1780000, minimum: 1 })
  @IsInt()
  @Min(1)
  total!: number;
}