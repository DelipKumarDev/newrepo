import { CanActivate, ExecutionContext } from '@nestjs/common';
declare const JwtGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtGuard extends JwtGuard_base {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest(err: any, user: any, info: any, context?: any): any;
}
export declare class TenantGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
export declare class SuperAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
export {};
//# sourceMappingURL=auth.guard.d.ts.map