import { Document, Types } from 'mongoose';
export type LocationDocument = Location & Document;
export declare class Location {
    name: string;
    parentId: Types.ObjectId | null;
    tenantId: Types.ObjectId;
    geo: {
        lat: number;
        lng: number;
    } | null;
}
export declare const LocationSchema: import("mongoose").Schema<Location, import("mongoose").Model<Location, any, any, any, Document<unknown, any, Location, any, {}> & Location & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Location, Document<unknown, {}, import("mongoose").FlatRecord<Location>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Location> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=location.schema.d.ts.map