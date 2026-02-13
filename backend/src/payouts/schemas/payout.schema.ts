import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PayoutDocument = Payout & Document;

export enum PayoutStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class Payout {
  @Prop({ type: Types.ObjectId, required: true })
  tenantId!: Types.ObjectId;

  @Prop({ type: Date, required: true })
  periodStart!: Date;

  @Prop({ type: Date, required: true })
  periodEnd!: Date;

  @Prop({ type: Number, default: 0 })
  grossAmount!: number;

  @Prop({ type: Number, default: 0 })
  adjustments!: number;

  @Prop({ type: Number, default: 0 })
  netAmount!: number;

  @Prop({ enum: PayoutStatus, default: PayoutStatus.PENDING })
  status!: PayoutStatus;

  @Prop({ type: String, default: null })
  approvedBy!: string | null;

  @Prop({ type: String, default: null })
  paidBy!: string | null;
}

export const PayoutSchema = SchemaFactory.createForClass(Payout);
