"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tenant_schema_1 = require("./tenant.schema");
let TenantsService = class TenantsService {
    constructor(tenantModel) {
        this.tenantModel = tenantModel;
    }
    async create(dto) {
        const exists = await this.tenantModel.findOne({ domain: dto.domain });
        if (exists)
            throw new common_1.BadRequestException('Tenant/domain already exists');
        const t = await this.tenantModel.create(dto);
        return t;
    }
    async findAll() {
        return this.tenantModel.find().lean();
    }
    async findOne(id) {
        const t = await this.tenantModel.findById(id);
        if (!t)
            throw new common_1.NotFoundException('Tenant not found');
        return t;
    }
    async update(id, dto) {
        const t = await this.tenantModel.findByIdAndUpdate(id, dto, { new: true });
        if (!t)
            throw new common_1.NotFoundException('Tenant not found');
        return t;
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map