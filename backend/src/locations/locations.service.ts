import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Location, LocationDocument } from './schemas/location.schema';

@Injectable()
export class LocationsService {
  constructor(@InjectModel(Location.name) private locationModel: Model<LocationDocument>) {}

  async create(dto: Partial<Location>) {
    return this.locationModel.create(dto);
  }

  async findTree(tenantId: string) {
    return this.locationModel.find({ tenantId: new Types.ObjectId(tenantId) }).lean();
  }
}
