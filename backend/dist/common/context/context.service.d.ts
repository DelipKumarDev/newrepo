export interface RequestContext {
    tenantId: string;
    userId: string;
    userEmail: string;
    isSuperAdmin: boolean;
    roles: string[];
}
export declare class ContextService {
    private asyncLocalStorage;
    setContext(context: RequestContext): void;
    getContext(): RequestContext | undefined;
    getTenantId(): string;
    getUserId(): string;
    isSuperAdmin(): boolean;
}
//# sourceMappingURL=context.service.d.ts.map