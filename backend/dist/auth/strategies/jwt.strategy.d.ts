import { Strategy } from 'passport-jwt';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: {
        sub: string;
        email: string;
        tenantId: string;
        isSuperAdmin?: boolean;
        roles?: string[];
    }): {
        sub: string;
        email: string;
        tenantId: string;
        isSuperAdmin: boolean | undefined;
        roles: string[];
    };
}
export {};
//# sourceMappingURL=jwt.strategy.d.ts.map