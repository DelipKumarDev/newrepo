import { RolesService } from './roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(dto: {
        name: string;
        permissions?: string[];
    }): Promise<import("mongoose").Document<unknown, {}, import("./role.schema").RoleDocument, {}, {}> & import("./role.schema").Role & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").FlattenMaps<import("./role.schema").RoleDocument> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./role.schema").RoleDocument, {}, {}> & import("./role.schema").Role & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, dto: Partial<{
        name: string;
        permissions: string[];
    }>): Promise<(import("mongoose").Document<unknown, {}, import("./role.schema").RoleDocument, {}, {}> & import("./role.schema").Role & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=roles.controller.d.ts.map