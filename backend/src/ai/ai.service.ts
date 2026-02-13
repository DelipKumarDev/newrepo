import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Delivery, DeliveryDocument } from '../deliveries/schemas/delivery.schema';

@Injectable()
export class AiService {
  constructor(@InjectModel(Delivery.name) private deliveryModel: Model<DeliveryDocument>) {}

  async predictEta({ distanceKm, region, timestamp }: { distanceKm: number; region?: string; timestamp?: string | Date; }) {
    // Simple heuristic model: average historical time by distance buckets and time of day
    const distanceBucket = Math.max(1, Math.round(distanceKm || 1));

    const startOfDay = new Date(timestamp || Date.now());
    const hour = startOfDay.getHours();

    // Query recent deliveries with similar distance bucket and same hour range
    const docs = await this.deliveryModel
      .find({
        distanceKm: { $gte: Math.max(0, distanceBucket - 1), $lte: distanceBucket + 1 },
        status: 'delivered',
      })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    if (!docs || docs.length === 0) {
      // fallback: 30 minutes per 10 km
      return { predictedDeliveryMinutes: Math.round((distanceKm || 5) * 3) };
    }

    // compute average actual minutes between createdAt and completedAt
    const mins = docs
      .filter((d: any) => d.completedAt && d.createdAt)
      .map((d: any) => {
        const completed = new Date(d.completedAt || Date.now()).getTime();
        const created = new Date(d.createdAt || Date.now()).getTime();
        return Math.max(1, Math.round((completed - created) / 60000));
      });

    const avg = Math.round(mins.reduce((s, v) => s + v, 0) / Math.max(1, mins.length));

    // slight adjustment by hour (rush hours add 15%)
    const rushFactor = hour >= 7 && hour <= 10 ? 1.15 : hour >= 17 && hour <= 20 ? 1.12 : 1;

    return { predictedDeliveryMinutes: Math.max(5, Math.round(avg * rushFactor)) };
  }
}
