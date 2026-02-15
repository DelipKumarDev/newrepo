import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './role.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async create(dto: Partial<Role>) {
    return this.roleModel.create(dto);
  }

  async findAll() {
    return this.roleModel.find().lean();
  }

  async findByNames(names: string[]) {
    return this.roleModel.find({ name: { $in: names } }).lean();
  }

  async findOne(id: string) {
    const r = await this.roleModel.findById(id);
    if (!r) throw new NotFoundException('Role not found');
    return r;
  }

  async update(id: string, dto: Partial<Role>) {
    return this.roleModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string) {
    const r = await this.roleModel.findByIdAndDelete(id);
    if (!r) throw new NotFoundException('Role not found');
    return { success: true };
  }
}
