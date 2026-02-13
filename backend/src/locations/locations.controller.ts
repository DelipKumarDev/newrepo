import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { JwtGuard, TenantGuard } from '../auth/guards/auth.guard';
import { Types } from 'mongoose';

@ApiTags('locations')
@ApiBearerAuth()
@UseGuards(JwtGuard, TenantGuard)
@Controller('api/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() dto: { name: string; parentId?: string; geo?: { lat: number; lng: number } }) {
    const payload: any = { name: dto.name, geo: dto.geo || null };
    if (dto.parentId) payload.parentId = new Types.ObjectId(dto.parentId);
    return this.locationsService.create(payload);
  }

  @Get('tree')
  tree(@Req() req: Request & { user: { tenantId: string } }) {
    return this.locationsService.findTree(req.user.tenantId);
  }
}
