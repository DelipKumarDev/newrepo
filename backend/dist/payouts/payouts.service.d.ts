import { Model, Types, Document } from 'mongoose';
import { Payout, PayoutDocument } from './schemas/payout.schema';
import { Delivery } from '../deliveries/schemas/delivery.schema';
export declare class PayoutsService {
    private payoutModel;
    private deliveryModel;
    constructor(payoutModel: Model<PayoutDocument>, deliveryModel: Model<Delivery & Document>);
    generate(tenantId: string, periodStart: Date, periodEnd: Date): Promise<Document<unknown, {}, PayoutDocument, {}, {}> & Payout & Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    approve(id: string, approver: string): Promise<Document<unknown, {}, PayoutDocument, {}, {}> & Payout & Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    markPaid(id: string, paidBy: string): Promise<Document<unknown, {}, PayoutDocument, {}, {}> & Payout & Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findByTenant(tenantId: string): Promise<(import("mongoose").FlattenMaps<PayoutDocument> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
//# sourceMappingURL=payouts.service.d.ts.map