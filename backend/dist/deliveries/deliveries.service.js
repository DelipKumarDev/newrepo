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
exports.DeliveriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const delivery_schema_1 = require("./schemas/delivery.schema");
const ai_service_1 = require("../ai/ai.service");
let DeliveriesService = class DeliveriesService {
    constructor(deliveryModel, aiService) {
        this.deliveryModel = deliveryModel;
        this.aiService = aiService;
    }
    async create(dto) {
        const existing = await this.deliveryModel.findOne({ reference: dto.reference, tenantId: dto.tenantId });
        if (existing)
            throw new common_1.BadRequestException('Reference already exists');
        const predicted = await this.aiService.predictEta({ distanceKm: dto.distanceKm || 5 });
        const d = await this.deliveryModel.create({
            tenantId: new mongoose_2.Types.ObjectId(dto.tenantId),
            reference: dto.reference,
            pickupAddress: dto.pickupAddress,
            dropoffAddress: dto.dropoffAddress,
            pickupGeo: dto.pickupGeo || null,
            dropoffGeo: dto.dropoffGeo || null,
            distanceKm: dto.distanceKm || 0,
            predictedDeliveryMinutes: predicted.predictedDeliveryMinutes,
            slaMinutes: 60,
            logs: [{ timestamp: new Date(), message: 'Created' }],
        });
        return d;
    }
    async assignDelivery(id, userId) {
        const d = await this.deliveryModel.findById(id);
        if (!d)
            throw new common_1.NotFoundException('Delivery not found');
        d.assignedTo = new mongoose_2.Types.ObjectId(userId);
        d.status = delivery_schema_1.DeliveryStatus.ASSIGNED;
        d.logs.push({ timestamp: new Date(), message: `Assigned to ${userId}` });
        await d.save();
        return d;
    }
    async updateStatus(id, status, podUrl) {
        const d = await this.deliveryModel.findById(id);
        if (!d)
            throw new common_1.NotFoundException('Delivery not found');
        d.status = status;
        d.logs.push({ timestamp: new Date(), message: `Status changed to ${status}` });
        if (podUrl)
            d.podUrl = podUrl;
        if (status === delivery_schema_1.DeliveryStatus.DELIVERED)
            d.completedAt = new Date();
        await d.save();
        return d;
    }
    // Persist a Proof-Of-Delivery (POD) URL for a delivery
    async setPodUrl(id, podUrl) {
        const d = await this.deliveryModel.findById(id);
        if (!d)
            throw new common_1.NotFoundException('Delivery not found');
        d.podUrl = podUrl;
        d.logs.push({ timestamp: new Date(), message: `POD uploaded: ${podUrl}` });
        await d.save();
        return d;
    }
    async findAll(tenantId, filter = {}, page = 1, limit = 20) {
        const q = { tenantId: new mongoose_2.Types.ObjectId(tenantId) };
        if (filter.status)
            q.status = filter.status;
        if (filter.assignedTo)
            q.assignedTo = new mongoose_2.Types.ObjectId(filter.assignedTo);
        if (filter.region)
            q['pickupGeo.region'] = filter.region;
        const skip = (page - 1) * limit;
        const docs = await this.deliveryModel.find(q).skip(skip).limit(limit).lean();
        const total = await this.deliveryModel.countDocuments(q);
        return { data: docs, total };
    }
    async getStats(tenantId) {
        const total = await this.deliveryModel.countDocuments({ tenantId: new mongoose_2.Types.ObjectId(tenantId) });
        const delivered = await this.deliveryModel.countDocuments({ tenantId: new mongoose_2.Types.ObjectId(tenantId), status: delivery_schema_1.DeliveryStatus.DELIVERED });
        const avgTimeAgg = await this.deliveryModel.aggregate([
            { $match: { tenantId: new mongoose_2.Types.ObjectId(tenantId), status: delivery_schema_1.DeliveryStatus.DELIVERED } },
            { $project: { minutes: { $divide: [{ $subtract: ['$completedAt', '$createdAt'] }, 1000 * 60] } } },
            { $group: { _id: null, avgMinutes: { $avg: '$minutes' } } },
        ]);
        const avgMinutes = avgTimeAgg?.[0]?.avgMinutes ? Math.round(avgTimeAgg[0].avgMinutes) : null;
        return { total, delivered, avgDeliveryMinutes: avgMinutes };
    }
};
exports.DeliveriesService = DeliveriesService;
exports.DeliveriesService = DeliveriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(delivery_schema_1.Delivery.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        ai_service_1.AiService])
], DeliveriesService);
//# sourceMappingURL=deliveries.service.js.map