import { Request } from 'express';
import { LocationsService } from './locations.service';
import { Types } from 'mongoose';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    create(dto: {
        name: string;
        parentId?: string;
        geo?: {
            lat: number;
            lng: number;
        };
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/location.schema").LocationDocument, {}, {}> & import("./schemas/location.schema").Location & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    tree(req: Request & {
        user: {
            tenantId: string;
        };
    }): Promise<(import("mongoose").FlattenMaps<import("./schemas/location.schema").LocationDocument> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
//# sourceMappingURL=locations.controller.d.ts.map