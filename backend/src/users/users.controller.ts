import { Controller, Get, Post, Body, Param, Query, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard, TenantGuard } from '../auth/guards/auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtGuard, TenantGuard)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll(@Req() req: Request & { user: { tenantId: string } }, @Query('page') page = '1', @Query('limit') limit = '20') {
    const tenantId = req.user.tenantId;
    return this.usersService.findAll(tenantId, Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
