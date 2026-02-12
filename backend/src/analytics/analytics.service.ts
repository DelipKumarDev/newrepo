import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import { Delivery } from '../deliveries/schemas/delivery.schema';
import { Payout } from '../payouts/schemas/payout.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<Delivery & Document>,
    @InjectModel(Payout.name) private payoutModel: Model<Payout & Document>,
  ) {}

  async deliveryCompletionRate(tenantId: string) {
    const total = await this.deliveryModel.countDocuments({ tenantId: new Types.ObjectId(tenantId) });
    const delivered = await this.deliveryModel.countDocuments({ tenantId: new Types.ObjectId(tenantId), status: 'delivered' });
    return { total, delivered, completionRate: total === 0 ? 0 : Math.round((delivered / total) * 100) };
  }

  async slaPerformance(tenantId: string) {
    const docs = await this.deliveryModel.find({ tenantId: new Types.ObjectId(tenantId), status: 'delivered' }).select('slaMinutes createdAt completedAt').lean() as unknown as Array<{ completedAt: Date | null; createdAt: Date | null; slaMinutes?: number }>;
    const met = docs.filter((d) => {
      if (!d.completedAt || !d.createdAt) return false;
      const minutes = (new Date(d.completedAt).getTime() - new Date(d.createdAt).getTime()) / 60000;
      return minutes <= (d.slaMinutes || 0);
    });
    return { total: docs.length, met: met.length, metRate: docs.length === 0 ? 0 : Math.round((met.length / docs.length) * 100) };
  }

  async regionalPerformance(tenantId: string) {
    const agg = await this.deliveryModel.aggregate([
      { $match: { tenantId: new Types.ObjectId(tenantId), status: 'delivered' } },
      { $group: { _id: '$pickupGeo.region', avgTime: { $avg: { $divide: [{ $subtract: ['$completedAt', '$createdAt'] }, 1000 * 60] } }, count: { $sum: 1 } } },
      { $sort: { avgTime: 1 } },
    ]);
    return agg;
  }

  async payoutSummaries(tenantId: string) {
    const agg = await this.payoutModel.aggregate([
      { $match: { tenantId: new Types.ObjectId(tenantId) } },
      { $group: { _id: '$status', totalNet: { $sum: '$netAmount' }, count: { $sum: 1 } } },
    ]);
    return agg;
  }

  async topPerformingAssociates(tenantId: string, limit = 5) {
    const agg = await this.deliveryModel.aggregate([
      { $match: { tenantId: new Types.ObjectId(tenantId), status: 'delivered', assignedTo: { $ne: null } } },
      { $group: { _id: '$assignedTo', deliveries: { $sum: 1 }, avgTime: { $avg: { $divide: [{ $subtract: ['$completedAt', '$createdAt'] }, 1000 * 60] } } } },
      { $sort: { deliveries: -1 } },
      { $limit: limit },
    ]);
    return agg;
  }
}
