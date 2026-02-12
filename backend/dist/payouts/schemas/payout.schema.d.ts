import { Document, Types } from 'mongoose';
export type PayoutDocument = Payout & Document;
export declare enum PayoutStatus {
    PENDING = "pending",
    APPROVED = "approved",
    PAID = "paid",
    REJECTED = "rejected"
}
export declare class Payout {
    tenantId: Types.ObjectId;
    periodStart: Date;
    periodEnd: Date;
    grossAmount: number;
    adjustments: number;
    netAmount: number;
    status: PayoutStatus;
    approvedBy: string | null;
    paidBy: string | null;
}
export declare const PayoutSchema: import("mongoose").Schema<Payout, import("mongoose").Model<Payout, any, any, any, Document<unknown, any, Payout, any, {}> & Payout & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Payout, Document<unknown, {}, import("mongoose").FlatRecord<Payout>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Payout> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=payout.schema.d.ts.map