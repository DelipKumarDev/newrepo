import { Model, Types } from 'mongoose';
import { Location, LocationDocument } from './schemas/location.schema';
export declare class LocationsService {
    private locationModel;
    constructor(locationModel: Model<LocationDocument>);
    create(dto: Partial<Location>): Promise<import("mongoose").Document<unknown, {}, LocationDocument, {}, {}> & Location & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findTree(tenantId: string): Promise<(import("mongoose").FlattenMaps<LocationDocument> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
//# sourceMappingURL=locations.service.d.ts.map