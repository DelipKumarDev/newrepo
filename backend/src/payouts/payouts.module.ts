import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payout, PayoutSchema } from './schemas/payout.schema';
import { PayoutsService } from './payouts.service';
import { PayoutsController } from './payouts.controller';
import { Delivery, DeliverySchema } from '../deliveries/schemas/delivery.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Payout.name, schema: PayoutSchema }, { name: Delivery.name, schema: DeliverySchema }])],
  providers: [PayoutsService],
  controllers: [PayoutsController],
  exports: [PayoutsService],
})
export class PayoutsModule {}
