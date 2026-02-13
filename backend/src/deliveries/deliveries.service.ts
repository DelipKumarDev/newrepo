import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Delivery, DeliveryDocument, DeliveryStatus } from './schemas/delivery.schema';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { AiService } from '../ai/ai.service';

interface DeliveryFilter { status?: string; assignedTo?: string; region?: string }

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<DeliveryDocument>,
    private aiService: AiService,
  ) {}

  async create(dto: CreateDeliveryDto) {
    const existing = await this.deliveryModel.findOne({ reference: dto.reference, tenantId: dto.tenantId });
    if (existing) throw new BadRequestException('Reference already exists');

    const predicted = await this.aiService.predictEta({ distanceKm: dto.distanceKm || 5 });
    const d = await this.deliveryModel.create({
      tenantId: new Types.ObjectId(dto.tenantId),
      reference: dto.reference,
      pickupAddress: dto.pickupAddress,
      dropoffAddress: dto.dropoffAddress,
      pickupGeo: dto.pickupGeo || null,
      dropoffGeo: dto.dropoffGeo || null,
      distanceKm: dto.distanceKm || 0,
      predictedDeliveryMinutes: predicted.predictedDeliveryMinutes,
      slaMinutes: 60,
      logs: [{ timestamp: new Date(), message: 'Created' }],
    });

    return d;
  }

  async assignDelivery(id: string, userId: string) {
    const d = await this.deliveryModel.findById(id);
    if (!d) throw new NotFoundException('Delivery not found');
    d.assignedTo = new Types.ObjectId(userId);
    d.status = DeliveryStatus.ASSIGNED;
    d.logs.push({ timestamp: new Date(), message: `Assigned to ${userId}` });
    await d.save();
    return d;
  }

  async updateStatus(id: string, status: DeliveryStatus, podUrl?: string) {
    const d = await this.deliveryModel.findById(id);
    if (!d) throw new NotFoundException('Delivery not found');
    d.status = status;
    d.logs.push({ timestamp: new Date(), message: `Status changed to ${status}` });
    if (podUrl) d.podUrl = podUrl;
    if (status === DeliveryStatus.DELIVERED) d.completedAt = new Date();
    await d.save();
    return d;
  }

  async findAll(tenantId: string, filter: DeliveryFilter = {}, page = 1, limit = 20) {
    const q: Record<string, unknown> = { tenantId: new Types.ObjectId(tenantId) };
    if (filter.status) (q as any).status = filter.status;
    if (filter.assignedTo) (q as any).assignedTo = new Types.ObjectId(filter.assignedTo);
    if (filter.region) (q as any)['pickupGeo.region'] = filter.region;

    const skip = (page - 1) * limit;
    const docs = await this.deliveryModel.find(q as any).skip(skip).limit(limit).lean();
    const total = await this.deliveryModel.countDocuments(q as any);
    return { data: docs, total };
  }

  async getStats(tenantId: string) {
    const total = await this.deliveryModel.countDocuments({ tenantId: new Types.ObjectId(tenantId) });
    const delivered = await this.deliveryModel.countDocuments({ tenantId: new Types.ObjectId(tenantId), status: DeliveryStatus.DELIVERED });
    const avgTimeAgg = await this.deliveryModel.aggregate([
      { $match: { tenantId: new Types.ObjectId(tenantId), status: DeliveryStatus.DELIVERED } },
      { $project: { minutes: { $divide: [{ $subtract: ['$completedAt', '$createdAt'] }, 1000 * 60] } } },
      { $group: { _id: null, avgMinutes: { $avg: '$minutes' } } },
    ]);

    const avgMinutes = avgTimeAgg?.[0]?.avgMinutes ? Math.round(avgTimeAgg[0].avgMinutes) : null;
    return { total, delivered, avgDeliveryMinutes: avgMinutes };
  }
}
