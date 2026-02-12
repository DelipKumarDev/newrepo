import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant, TenantDocument } from './tenant.schema';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(@InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>) {}

  async create(dto: CreateTenantDto) {
    const exists = await this.tenantModel.findOne({ domain: dto.domain });
    if (exists) throw new BadRequestException('Tenant/domain already exists');
    const t = await this.tenantModel.create(dto);
    return t;
  }

  async findAll() {
    return this.tenantModel.find().lean();
  }

  async findOne(id: string) {
    const t = await this.tenantModel.findById(id);
    if (!t) throw new NotFoundException('Tenant not found');
    return t;
  }

  async update(id: string, dto: Partial<Tenant>) {
    const t = await this.tenantModel.findByIdAndUpdate(id, dto, { new: true });
    if (!t) throw new NotFoundException('Tenant not found');
    return t;
  }
}
