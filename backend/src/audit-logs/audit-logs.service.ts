import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog, AuditLogDocument } from './audit-log.schema';

@Injectable()
export class AuditLogsService {
  constructor(@InjectModel(AuditLog.name) private auditModel: Model<AuditLogDocument>) {}

  async create(tenantId: string, action: string, payload: Record<string, unknown>, performedBy: string) {
    return this.auditModel.create({ tenantId: new Types.ObjectId(tenantId), action, payload, performedBy });
  }

  async query(tenantId: string, limit = 100) {
    return this.auditModel.find({ tenantId: new Types.ObjectId(tenantId) }).sort({ createdAt: -1 }).limit(limit).lean();
  }
}
