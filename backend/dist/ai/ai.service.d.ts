import { Model } from 'mongoose';
import { DeliveryDocument } from '../deliveries/schemas/delivery.schema';
export declare class AiService {
    private deliveryModel;
    constructor(deliveryModel: Model<DeliveryDocument>);
    predictEta({ distanceKm, region, timestamp }: {
        distanceKm: number;
        region?: string;
        timestamp?: string | Date;
    }): Promise<{
        predictedDeliveryMinutes: number;
    }>;
}
//# sourceMappingURL=ai.service.d.ts.map