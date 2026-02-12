import { Request } from 'express';
import { PayoutsService } from './payouts.service';
export declare class PayoutsController {
    private readonly payoutsService;
    constructor(payoutsService: PayoutsService);
    generate(req: Request & {
        user: {
            tenantId: string;
        };
    }, body: {
        periodStart: string;
        periodEnd: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/payout.schema").PayoutDocument, {}, {}> & import("./schemas/payout.schema").Payout & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    approve(id: string, req: Request & {
        user: {
            sub: string;
        };
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/payout.schema").PayoutDocument, {}, {}> & import("./schemas/payout.schema").Payout & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    markPaid(id: string, req: Request & {
        user: {
            sub: string;
        };
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/payout.schema").PayoutDocument, {}, {}> & import("./schemas/payout.schema").Payout & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    list(req: Request & {
        user: {
            tenantId: string;
        };
    }): Promise<(import("mongoose").FlattenMaps<import("./schemas/payout.schema").PayoutDocument> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
//# sourceMappingURL=payouts.controller.d.ts.map