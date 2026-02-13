import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analytics;
    constructor(analytics: AnalyticsService);
    deliveryCompletion(req: Request & {
        user: {
            tenantId: string;
        };
    }): Promise<{
        total: number;
        delivered: number;
        completionRate: number;
    }>;
    sla(req: Request & {
        user: {
            tenantId: string;
        };
    }): Promise<{
        total: number;
        met: number;
        metRate: number;
    }>;
    regional(req: Request & {
        user: {
            tenantId: string;
        };
    }): Promise<any[]>;
    payoutSummaries(req: Request & {
        user: {
            tenantId: string;
        };
    }): Promise<any[]>;
    topAssociates(req: Request & {
        user: {
            tenantId: string;
        };
    }, limit?: string): Promise<any[]>;
}
//# sourceMappingURL=analytics.controller.d.ts.map