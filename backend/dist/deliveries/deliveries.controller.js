"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveriesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs = __importStar(require("fs"));
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
const deliveries_service_1 = require("./deliveries.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const create_delivery_dto_1 = require("./dto/create-delivery.dto");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
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
    async uploadPod(id, file, req) {
        if (!file)
            return { success: false };
        const podPath = `/uploads/${req.user.tenantId}/${file.filename}`;
        return this.deliveriesService.setPodUrl(id, podPath);
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
    (0, permissions_decorator_1.Permissions)('deliveries.create'),
    (0, common_1.UseGuards)(permissions_guard_1.PermissionsGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_delivery_dto_1.CreateDeliveryDto]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    (0, permissions_decorator_1.Permissions)('deliveries.assign'),
    (0, common_1.UseGuards)(permissions_guard_1.PermissionsGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "assign", null);
__decorate([
    (0, common_1.Post)(':id/pod'),
    (0, permissions_decorator_1.Permissions)('deliveries.uploadPod'),
    (0, common_1.UseGuards)(permissions_guard_1.PermissionsGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const tenantId = req.user?.tenantId || 'public';
                const dest = (0, path_1.join)(process.cwd(), 'uploads', String(tenantId));
                try {
                    fs.mkdirSync(dest, { recursive: true });
                }
                catch (err) {
                    // ignore
                }
                cb(null, dest);
            },
            filename: (req, file, cb) => {
                const ts = Date.now();
                const safe = file.originalname.replace(/[^a-z0-9.\-]/gi, '_');
                cb(null, `${ts}_${safe}`);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveriesController.prototype, "uploadPod", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, permissions_decorator_1.Permissions)('deliveries.updateStatus'),
    (0, common_1.UseGuards)(permissions_guard_1.PermissionsGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DeliveriesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('deliveries.read'),
    (0, common_1.UseGuards)(permissions_guard_1.PermissionsGuard),
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
    (0, permissions_decorator_1.Permissions)('deliveries.stats'),
    (0, common_1.UseGuards)(permissions_guard_1.PermissionsGuard),
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