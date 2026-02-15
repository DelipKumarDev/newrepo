import { Model, Types } from 'mongoose';
import { Delivery, DeliveryDocument, DeliveryStatus } from './schemas/delivery.schema';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { AiService } from '../ai/ai.service';
interface DeliveryFilter {
    status?: string;
    assignedTo?: string;
    region?: string;
}
export declare class DeliveriesService {
    private deliveryModel;
    private aiService;
    constructor(deliveryModel: Model<DeliveryDocument>, aiService: AiService);
    create(dto: CreateDeliveryDto): Promise<import("mongoose").Document<unknown, {}, DeliveryDocument, {}, {}> & Delivery & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    assignDelivery(id: string, userId: string): Promise<import("mongoose").Document<unknown, {}, DeliveryDocument, {}, {}> & Delivery & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateStatus(id: string, status: DeliveryStatus, podUrl?: string): Promise<import("mongoose").Document<unknown, {}, DeliveryDocument, {}, {}> & Delivery & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    setPodUrl(id: string, podUrl: string): Promise<import("mongoose").Document<unknown, {}, DeliveryDocument, {}, {}> & Delivery & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(tenantId: string, filter?: DeliveryFilter, page?: number, limit?: number): Promise<{
        data: (import("mongoose").FlattenMaps<DeliveryDocument> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
    }>;
    getStats(tenantId: string): Promise<{
        total: number;
        delivered: number;
        avgDeliveryMinutes: number | null;
    }>;
}
export {};
//# sourceMappingURL=deliveries.service.d.ts.map