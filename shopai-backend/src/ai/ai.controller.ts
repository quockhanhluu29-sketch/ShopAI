import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatDto } from './dto/chat.dto';
import { AiService } from './ai.service';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat với tư vấn viên AI; Gemini key chỉ nằm trên backend' })
  chat(@Body() dto: ChatDto) {
    return this.ai.chat(dto.message, dto.history);
  }
}