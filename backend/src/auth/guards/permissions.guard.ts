import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RolesService } from '../../roles/roles.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private rolesService: RolesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required: string[] = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || [];

    // quick-pass when no permissions are required
    if (required.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as { roles?: string[]; isSuperAdmin?: boolean } | undefined;

    if (!user) throw new ForbiddenException('No user on request');
    if (user.isSuperAdmin) return true;

    const roleNames = user.roles || [];
    if (roleNames.length === 0) throw new ForbiddenException('Insufficient permissions');

    const roles = await this.rolesService.findByNames(roleNames);
    const userPerms = new Set<string>(roles.flatMap(r => r.permissions || []));



    const ok = required.every(p => userPerms.has(p));
    if (!ok) throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}
