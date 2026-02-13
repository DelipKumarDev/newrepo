import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    predict(body: {
        distanceKm: number;
        region?: string;
        timestamp?: string;
    }): Promise<{
        predictedDeliveryMinutes: number;
    }>;
}
//# sourceMappingURL=ai.controller.d.ts.map