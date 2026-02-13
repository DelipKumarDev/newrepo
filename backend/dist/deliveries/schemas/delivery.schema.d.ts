import { Document, Types } from 'mongoose';
export type DeliveryDocument = Delivery & Document;
export declare enum DeliveryStatus {
    CREATED = "created",
    ASSIGNED = "assigned",
    PICKED = "picked",
    IN_TRANSIT = "in_transit",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Delivery {
    tenantId: Types.ObjectId;
    reference: string;
    pickupAddress: string;
    dropoffAddress: string;
    pickupGeo: {
        lat: number;
        lng: number;
    };
    dropoffGeo: {
        lat: number;
        lng: number;
    };
    distanceKm: number;
    assignedTo: Types.ObjectId | null;
    status: DeliveryStatus;
    logs: Array<{
        timestamp: Date;
        message: string;
    }>;
    slaMinutes: number;
    predictedDeliveryMinutes: number | null;
    podUrl: string | null;
    completedAt: Date | null;
}
export declare const DeliverySchema: import("mongoose").Schema<Delivery, import("mongoose").Model<Delivery, any, any, any, Document<unknown, any, Delivery, any, {}> & Delivery & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Delivery, Document<unknown, {}, import("mongoose").FlatRecord<Delivery>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Delivery> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=delivery.schema.d.ts.map