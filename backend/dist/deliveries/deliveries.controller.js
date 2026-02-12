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
exports.DeliveriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const deliveries_service_1 = require("./deliveries.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const create_delivery_dto_1 = require("./dto/create-delivery.dto");
let DeliveriesController = class DeliveriesController {
    constructor(deliveriesService) {
        this.deliveriesService = deliveriesService;
    }
    create(dto) {
        return this.deliveriesService.create(dto);
    }
    assign(id, userId) {
        return this.deliveriesService.assignDelivery(id, userId);
    }
    updateStatus(id, body) {
        return this.deliveriesService.updateStatus(id, body.status, body.podUrl);
    }
    findAll(req, page = '1', limit = '20', status, assignedTo, region) {
        const tenantId = req.user.tenantId;
        const filter = {};
        if (status)
            filter.status = status;
        if (assignedTo)
            filter.assignedTo = assignedTo;
        if (region)
            filter.region = region;
        return this.deliveriesService.findAll(tenantId, filter, Number(page), Number(limit));
    }
    stats(req) {
        return this.deliveriesService.getStats(req.user.tenantId);
    }
};
exports.DeliveriesController = DeliveriesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_delivery_dto_1.CreateDeliveryDto]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "assign", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('assignedTo')),
    __param(5, (0, common_1.Query)('region')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, String, String]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "stats", null);
exports.DeliveriesController = DeliveriesController = __decorate([
    (0, swagger_1.ApiTags)('deliveries'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtGuard, auth_guard_1.TenantGuard),
    (0, common_1.Controller)('api/deliveries'),
    __metadata("design:paramtypes", [deliveries_service_1.DeliveriesService])
], DeliveriesController);
//# sourceMappingURL=deliveries.controller.js.map