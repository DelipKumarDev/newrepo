import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DeliveryDocument = Delivery & Document;

export enum DeliveryStatus {
  CREATED = 'created',
  ASSIGNED = 'assigned',
  PICKED = 'picked',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Delivery {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true })
  reference: string;

  @Prop({ required: true })
  pickupAddress: string;

  @Prop({ required: true })
  dropoffAddress: string;

  @Prop({ type: Object })
  pickupGeo: { lat: number; lng: number };

  @Prop({ type: Object })
  dropoffGeo: { lat: number; lng: number };

  @Prop({ type: Number, default: 0 })
  distanceKm: number;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  assignedTo: Types.ObjectId | null;

  @Prop({ enum: DeliveryStatus, default: DeliveryStatus.CREATED })
  status: DeliveryStatus;

  @Prop({ type: [{ timestamp: Date, message: String }], default: [] })
  logs: Array<{ timestamp: Date; message: string }>;

  @Prop({ type: Number, default: 0 })
  slaMinutes: number;

  @Prop({ type: Number, default: null })
  predictedDeliveryMinutes: number | null;

  @Prop({ type: String, default: null })
  podUrl: string | null;

  @Prop({ type: Date, default: null })
  completedAt: Date | null;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
DeliverySchema.index({ tenantId: 1, reference: 1 }, { unique: true });
