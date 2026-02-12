import { Controller, Post, Body, UseGuards, Req, Get, Query } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { JwtGuard, TenantGuard } from '../auth/guards/auth.guard';

@ApiTags('audit-logs')
@ApiBearerAuth()
@UseGuards(JwtGuard, TenantGuard)
@Controller('api/audit-logs')
export class AuditLogsController {
  constructor(private readonly audit: AuditLogsService) {}

  @Post()
  create(@Req() req: Request & { user: { tenantId: string; sub: string } }, @Body() body: { action: string; payload: Record<string, unknown> }) {
    return this.audit.create(req.user.tenantId, body.action, body.payload, req.user.sub);
  }

  @Get()
  query(@Req() req: any, @Query('limit') limit = '100') {
    return this.audit.query(req.user.tenantId, Number(limit));
  }
}
