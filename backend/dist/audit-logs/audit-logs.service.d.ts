import { Model, Types } from 'mongoose';
import { AuditLog, AuditLogDocument } from './audit-log.schema';
export declare class AuditLogsService {
    private auditModel;
    constructor(auditModel: Model<AuditLogDocument>);
    create(tenantId: string, action: string, payload: Record<string, unknown>, performedBy: string): Promise<import("mongoose").Document<unknown, {}, AuditLogDocument, {}, {}> & AuditLog & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    query(tenantId: string, limit?: number): Promise<(import("mongoose").FlattenMaps<AuditLogDocument> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
//# sourceMappingURL=audit-logs.service.d.ts.map