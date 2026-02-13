import { Model, Document } from 'mongoose';
import { Delivery } from '../deliveries/schemas/delivery.schema';
import { Payout } from '../payouts/schemas/payout.schema';
export declare class AnalyticsService {
    private deliveryModel;
    private payoutModel;
    constructor(deliveryModel: Model<Delivery & Document>, payoutModel: Model<Payout & Document>);
    deliveryCompletionRate(tenantId: string): Promise<{
        total: number;
        delivered: number;
        completionRate: number;
    }>;
    slaPerformance(tenantId: string): Promise<{
        total: number;
        met: number;
        metRate: number;
    }>;
    regionalPerformance(tenantId: string): Promise<any[]>;
    payoutSummaries(tenantId: string): Promise<any[]>;
    topPerformingAssociates(tenantId: string, limit?: number): Promise<any[]>;
}
//# sourceMappingURL=analytics.service.d.ts.map