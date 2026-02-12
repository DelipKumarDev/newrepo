import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema({ timestamps: true })
export class Location {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, default: null })
  parentId: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, required: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Object, default: null })
  geo!: { lat: number; lng: number } | null;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
