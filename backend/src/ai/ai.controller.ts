import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('ai')
@Controller('api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('predict-eta')
  async predict(@Body() body: { distanceKm: number; region?: string; timestamp?: string }) {
    return this.aiService.predictEta(body);
  }
}
