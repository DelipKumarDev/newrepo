import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
  tenantId: string;
  userId: string;
  userEmail: string;
  isSuperAdmin: boolean;
  roles: string[];
}

@Injectable()
export class ContextService {
  private asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

  setContext(context: RequestContext): void {
    this.asyncLocalStorage.enterWith(context);
  }

  getContext(): RequestContext | undefined {
    return this.asyncLocalStorage.getStore();
  }

  getTenantId(): string {
    const context = this.getContext();
    if (!context) {
      throw new Error('No context available');
    }
    return context.tenantId;
  }

  getUserId(): string {
    const context = this.getContext();
    if (!context) {
      throw new Error('No context available');
    }
    return context.userId;
  }

  isSuperAdmin(): boolean {
    const context = this.getContext();
    return context?.isSuperAdmin || false;
  }
}
