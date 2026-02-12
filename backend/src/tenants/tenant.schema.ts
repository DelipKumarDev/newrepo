import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TenantDocument = Tenant & Document;

@Schema({ timestamps: true })
export class Tenant {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: true, unique: true })
  domain!: string;

  @Prop({ default: true })
  isActive!: boolean;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
