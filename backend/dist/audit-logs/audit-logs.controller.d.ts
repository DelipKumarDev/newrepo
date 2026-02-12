import { Request } from 'express';
import { AuditLogsService } from './audit-logs.service';
export declare class AuditLogsController {
    private readonly audit;
    constructor(audit: AuditLogsService);
    create(req: Request & {
        user: {
            tenantId: string;
            sub: string;
        };
    }, body: {
        action: string;
        payload: Record<string, unknown>;
    }): Promise<import("mongoose").Document<unknown, {}, import("./audit-log.schema").AuditLogDocument, {}, {}> & import("./audit-log.schema").AuditLog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    query(req: any, limit?: string): Promise<(import("mongoose").FlattenMaps<import("./audit-log.schema").AuditLogDocument> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
//# sourceMappingURL=audit-logs.controller.d.ts.map