import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtGuard, TenantGuard } from '../auth/guards/auth.guard';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtGuard, TenantGuard)
@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('delivery-completion')
  deliveryCompletion(@Req() req: Request & { user: { tenantId: string } }) {
    return this.analytics.deliveryCompletionRate(req.user.tenantId);
  }

  @Get('sla-performance')
  sla(@Req() req: Request & { user: { tenantId: string } }) {
    return this.analytics.slaPerformance(req.user.tenantId);
  }

  @Get('regional-performance')
  regional(@Req() req: Request & { user: { tenantId: string } }) {
    return this.analytics.regionalPerformance(req.user.tenantId);
  }

  @Get('payout-summaries')
  payoutSummaries(@Req() req: Request & { user: { tenantId: string } }) {
    return this.analytics.payoutSummaries(req.user.tenantId);
  }

  @Get('top-associates')
  topAssociates(@Req() req: Request & { user: { tenantId: string } }, @Query('limit') limit = '5') {
    return this.analytics.topPerformingAssociates(req.user.tenantId, Number(limit));
  }
}
