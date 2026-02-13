import { Controller, Post, Body, UseGuards, Req, Patch, Param, Get, Query } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DeliveriesService } from './deliveries.service';
import { JwtGuard, TenantGuard } from '../auth/guards/auth.guard';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { DeliveryStatus } from './schemas/delivery.schema';

@ApiTags('deliveries')
@ApiBearerAuth()
@UseGuards(JwtGuard, TenantGuard)
@Controller('api/deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  create(@Body() dto: CreateDeliveryDto) {
    return this.deliveriesService.create(dto);
  }

  @Post(':id/assign')
  assign(@Param('id') id: string, @Body('userId') userId: string) {
    return this.deliveriesService.assignDelivery(id, userId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: DeliveryStatus; podUrl?: string }) {
    return this.deliveriesService.updateStatus(id, body.status, body.podUrl);
  }

  @Get()
  findAll(@Req() req: Request & { user: { tenantId: string } }, @Query('page') page = '1', @Query('limit') limit = '20', @Query('status') status?: string, @Query('assignedTo') assignedTo?: string, @Query('region') region?: string) {
    const tenantId = req.user.tenantId;
    const filter: { status?: string; assignedTo?: string; region?: string } = {};
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (region) filter.region = region;
    return this.deliveriesService.findAll(tenantId, filter, Number(page), Number(limit));
  }

  @Get('stats')
  stats(@Req() req: Request & { user: { tenantId: string } }) {
    return this.deliveriesService.getStats(req.user.tenantId);
  }
}
