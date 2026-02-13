import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ContextService } from '../context/context.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private contextService: ContextService) {}

  use(req: Request & { user?: { sub: string; email: string; tenantId: string; isSuperAdmin?: boolean; roles?: string[] } }, res: Response, next: NextFunction) {
    // Extract tenant from JWT token or headers
    const user = req.user;

    if (user) {
      this.contextService.setContext({
        tenantId: user.tenantId,
        userId: user.sub,
        userEmail: user.email,
        isSuperAdmin: user.isSuperAdmin || false,
        roles: user.roles || [],
      });
    }

    next();
  }
}
