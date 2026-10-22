import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsIn, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

class ChatHistoryItemDto {
  @ApiProperty({ enum: ['user', 'model'] })
  @IsIn(['user', 'model'])
  role!: 'user' | 'model';

  @ApiProperty({ maxLength: 500 })
  @IsString()
  @MaxLength(500)
  text!: string;
}

export class ChatDto {
  @ApiProperty({ example: 'Tai nghe nào phù hợp đi làm?' })
  @IsString()
  @MaxLength(500)
  message!: string;

  @ApiProperty({ type: [ChatHistoryItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => ChatHistoryItemDto)
  history?: ChatHistoryItemDto[];
}