import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Delivery, DeliverySchema } from '../deliveries/schemas/delivery.schema';
import { Payout, PayoutSchema } from '../payouts/schemas/payout.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Delivery.name, schema: DeliverySchema }, { name: Payout.name, schema: PayoutSchema }])],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
