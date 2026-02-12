import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto) {
    const exists = await this.userModel.findOne({ email: dto.email, tenantId: dto.tenantId });
    if (exists) throw new BadRequestException('User already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.userModel.create({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: hashed,
      tenantId: new Types.ObjectId(dto.tenantId),
      roles: dto.roles || ['user'],
    });

    return { id: created._id.toString(), email: created.email };
  }

  async findAll(tenantId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const docs = await this.userModel
      .find({ tenantId })
      .skip(skip)
      .limit(limit)
      .select('-password')
      .lean();
    const total = await this.userModel.countDocuments({ tenantId });
    return { data: docs, total };
  }

  async findById(id: string) {
    const u = await this.userModel.findById(id).select('-password');
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }
    if (dto.firstName) user.firstName = dto.firstName;
    if (dto.lastName) user.lastName = dto.lastName;
    if (dto.email) user.email = dto.email;
    if (dto.roles) user.roles = dto.roles;

    await user.save();
    return { id: user._id.toString(), email: user.email };
  }

  async remove(id: string) {
    const res = await this.userModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('User not found');
    return { success: true };
  }
}
