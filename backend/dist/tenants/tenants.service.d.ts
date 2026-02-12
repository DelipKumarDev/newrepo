import { Model } from 'mongoose';
import { Tenant, TenantDocument } from './tenant.schema';
import { CreateTenantDto } from './dto/create-tenant.dto';
export declare class TenantsService {
    private tenantModel;
    constructor(tenantModel: Model<TenantDocument>);
    create(dto: CreateTenantDto): Promise<import("mongoose").Document<unknown, {}, TenantDocument, {}, {}> & Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").FlattenMaps<TenantDocument> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, TenantDocument, {}, {}> & Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, dto: Partial<Tenant>): Promise<import("mongoose").Document<unknown, {}, TenantDocument, {}, {}> & Tenant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
//# sourceMappingURL=tenants.service.d.ts.map