import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ContextService } from '../context/context.service';
export declare class TenantMiddleware implements NestMiddleware {
    private contextService;
    constructor(contextService: ContextService);
    use(req: Request & {
        user?: {
            sub: string;
            email: string;
            tenantId: string;
            isSuperAdmin?: boolean;
            roles?: string[];
        };
    }, res: Response, next: NextFunction): void;
}
//# sourceMappingURL=tenant.middleware.d.ts.map