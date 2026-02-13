import { Controller, Post, Body, UseGuards, Req, Patch, Param, Get } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PayoutsService } from './payouts.service';
import { JwtGuard, TenantGuard, SuperAdminGuard } from '../auth/guards/auth.guard';

@ApiTags('payouts')
@ApiBearerAuth()
@Controller('api/payouts')
@UseGuards(JwtGuard, TenantGuard)
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Post('generate')
  async generate(@Req() req: Request & { user: { tenantId: string } }, @Body() body: { periodStart: string; periodEnd: string }) {
    const tenantId = req.user.tenantId;
    return this.payoutsService.generate(tenantId, new Date(body.periodStart), new Date(body.periodEnd));
  }

  @Patch(':id/approve')
  @UseGuards(SuperAdminGuard)
  approve(@Param('id') id: string, @Req() req: Request & { user: { sub: string } }) {
    return this.payoutsService.approve(id, req.user.sub);
  }

  @Patch(':id/paid')
  markPaid(@Param('id') id: string, @Req() req: Request & { user: { sub: string } }) {
    return this.payoutsService.markPaid(id, req.user.sub);
  }

  @Get()
  list(@Req() req: Request & { user: { tenantId: string } }) {
    return this.payoutsService.findByTenant(req.user.tenantId);
  }
}
