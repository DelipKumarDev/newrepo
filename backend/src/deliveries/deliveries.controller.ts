import { Controller, Post, Body, UseGuards, Req, Patch, Param, Get, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { join } from 'path';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DeliveriesService } from './deliveries.service';
import { JwtGuard, TenantGuard } from '../auth/guards/auth.guard';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { DeliveryStatus } from './schemas/delivery.schema';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@ApiTags('deliveries')
@ApiBearerAuth()
@UseGuards(JwtGuard, TenantGuard)
@Controller('api/deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  @Permissions('deliveries.create')
  @UseGuards(PermissionsGuard)
  create(@Body() dto: CreateDeliveryDto) {
    return this.deliveriesService.create(dto);
  }

  @Post(':id/assign')
  @Permissions('deliveries.assign')
  @UseGuards(PermissionsGuard)
  assign(@Param('id') id: string, @Body('userId') userId: string) {
    return this.deliveriesService.assignDelivery(id, userId);
  }

  @Post(':id/pod')
  @Permissions('deliveries.uploadPod')
  @UseGuards(PermissionsGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          const tenantId = (req as any).user?.tenantId || 'public';
          const dest = join(process.cwd(), 'uploads', String(tenantId));
          try {
            fs.mkdirSync(dest, { recursive: true });
          } catch (err) {
            // ignore
          }
          cb(null, dest);
        },
        filename: (req: any, file: any, cb: any) => {
          const ts = Date.now();
          const safe = file.originalname.replace(/[^a-z0-9.\-]/gi, '_');
          cb(null, `${ts}_${safe}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadPod(@Param('id') id: string, @UploadedFile() file: any, @Req() req: Request & { user: { tenantId: string } }) {
    if (!file) return { success: false };
    const podPath = `/uploads/${req.user.tenantId}/${file.filename}`;
    return this.deliveriesService.setPodUrl(id, podPath);
  }

  @Patch(':id/status')
  @Permissions('deliveries.updateStatus')
  @UseGuards(PermissionsGuard)
  updateStatus(@Param('id') id: string, @Body() body: { status: DeliveryStatus; podUrl?: string }) {
    return this.deliveriesService.updateStatus(id, body.status, body.podUrl);
  }

  @Get()
  @Permissions('deliveries.read')
  @UseGuards(PermissionsGuard)
  findAll(@Req() req: Request & { user: { tenantId: string } }, @Query('page') page = '1', @Query('limit') limit = '20', @Query('status') status?: string, @Query('assignedTo') assignedTo?: string, @Query('region') region?: string) {
    const tenantId = req.user.tenantId;
    const filter: { status?: string; assignedTo?: string; region?: string } = {};
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (region) filter.region = region;
    return this.deliveriesService.findAll(tenantId, filter, Number(page), Number(limit));
  }

  @Get('stats')
  @Permissions('deliveries.stats')
  @UseGuards(PermissionsGuard)
  stats(@Req() req: Request & { user: { tenantId: string } }) {
    return this.deliveriesService.getStats(req.user.tenantId);
  }
}
