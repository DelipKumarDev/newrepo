import { Request } from 'express';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { DeliveryStatus } from './schemas/delivery.schema';
export declare class DeliveriesController {
    private readonly deliveriesService;
    constructor(deliveriesService: DeliveriesService);
    create(dto: CreateDeliveryDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/delivery.schema").DeliveryDocument, {}, {}> & import("./schemas/delivery.schema").Delivery & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    assign(id: string, userId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/delivery.schema").DeliveryDocument, {}, {}> & import("./schemas/delivery.schema").Delivery & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    uploadPod(id: string, file: any, req: Request & {
        user: {
            tenantId: string;
        };
    }): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/delivery.schema").DeliveryDocument, {}, {}> & import("./schemas/delivery.schema").Delivery & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        success: boolean;
    }>;
    updateStatus(id: string, body: {
        status: DeliveryStatus;
        podUrl?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/delivery.schema").DeliveryDocument, {}, {}> & import("./schemas/delivery.schema").Delivery & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(req: Request & {
        user: {
            tenantId: string;
        };
    }, page?: string, limit?: string, status?: string, assignedTo?: string, region?: string): Promise<{
        data: (import("mongoose").FlattenMaps<import("./schemas/delivery.schema").DeliveryDocument> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
    }>;
    stats(req: Request & {
        user: {
            tenantId: string;
        };
    }): Promise<{
        total: number;
        delivered: number;
        avgDeliveryMinutes: number | null;
    }>;
}
//# sourceMappingURL=deliveries.controller.d.ts.map