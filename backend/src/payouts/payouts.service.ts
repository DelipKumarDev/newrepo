import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import { Payout, PayoutDocument, PayoutStatus } from './schemas/payout.schema';
import { Delivery } from '../deliveries/schemas/delivery.schema';

@Injectable()
export class PayoutsService {
  constructor(
    @InjectModel(Payout.name) private payoutModel: Model<PayoutDocument>,
    @InjectModel(Delivery.name) private deliveryModel: Model<Delivery & Document>,
  ) {}

  async generate(tenantId: string, periodStart: Date, periodEnd: Date) {
    // For demo: gross = #delivered * fixed rate (e.g., 100)
    const deliveredCount = await this.deliveryModel.countDocuments({ tenantId: new Types.ObjectId(tenantId), status: 'delivered', completedAt: { $gte: periodStart, $lte: periodEnd } });
    const gross = deliveredCount * 100; // fixed per-delivery rate for demo
    const adjustments = 0;
    const net = gross + adjustments;

    const payout = await this.payoutModel.create({ tenantId: new Types.ObjectId(tenantId), periodStart, periodEnd, grossAmount: gross, adjustments, netAmount: net, status: PayoutStatus.PENDING });

    return payout;
  }

  async approve(id: string, approver: string) {
    const p = await this.payoutModel.findById(id);
    if (!p) throw new NotFoundException('Payout not found');
    p.status = PayoutStatus.APPROVED;
    p.approvedBy = approver;
    await p.save();
    return p;
  }

  async markPaid(id: string, paidBy: string) {
    const p = await this.payoutModel.findById(id);
    if (!p) throw new NotFoundException('Payout not found');
    p.status = PayoutStatus.PAID;
    p.paidBy = paidBy;
    await p.save();
    return p;
  }

  async findByTenant(tenantId: string) {
    return this.payoutModel.find({ tenantId: new Types.ObjectId(tenantId) }).lean();
  }
}
