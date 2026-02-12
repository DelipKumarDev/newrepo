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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const delivery_schema_1 = require("../deliveries/schemas/delivery.schema");
const payout_schema_1 = require("../payouts/schemas/payout.schema");
let AnalyticsService = class AnalyticsService {
    constructor(deliveryModel, payoutModel) {
        this.deliveryModel = deliveryModel;
        this.payoutModel = payoutModel;
    }
    async deliveryCompletionRate(tenantId) {
        const total = await this.deliveryModel.countDocuments({ tenantId: new mongoose_2.Types.ObjectId(tenantId) });
        const delivered = await this.deliveryModel.countDocuments({ tenantId: new mongoose_2.Types.ObjectId(tenantId), status: 'delivered' });
        return { total, delivered, completionRate: total === 0 ? 0 : Math.round((delivered / total) * 100) };
    }
    async slaPerformance(tenantId) {
        const docs = await this.deliveryModel.find({ tenantId: new mongoose_2.Types.ObjectId(tenantId), status: 'delivered' }).select('slaMinutes createdAt completedAt').lean();
        const met = docs.filter((d) => {
            if (!d.completedAt || !d.createdAt)
                return false;
            const minutes = (new Date(d.completedAt).getTime() - new Date(d.createdAt).getTime()) / 60000;
            return minutes <= (d.slaMinutes || 0);
        });
        return { total: docs.length, met: met.length, metRate: docs.length === 0 ? 0 : Math.round((met.length / docs.length) * 100) };
    }
    async regionalPerformance(tenantId) {
        const agg = await this.deliveryModel.aggregate([
            { $match: { tenantId: new mongoose_2.Types.ObjectId(tenantId), status: 'delivered' } },
            { $group: { _id: '$pickupGeo.region', avgTime: { $avg: { $divide: [{ $subtract: ['$completedAt', '$createdAt'] }, 1000 * 60] } }, count: { $sum: 1 } } },
            { $sort: { avgTime: 1 } },
        ]);
        return agg;
    }
    async payoutSummaries(tenantId) {
        const agg = await this.payoutModel.aggregate([
            { $match: { tenantId: new mongoose_2.Types.ObjectId(tenantId) } },
            { $group: { _id: '$status', totalNet: { $sum: '$netAmount' }, count: { $sum: 1 } } },
        ]);
        return agg;
    }
    async topPerformingAssociates(tenantId, limit = 5) {
        const agg = await this.deliveryModel.aggregate([
            { $match: { tenantId: new mongoose_2.Types.ObjectId(tenantId), status: 'delivered', assignedTo: { $ne: null } } },
            { $group: { _id: '$assignedTo', deliveries: { $sum: 1 }, avgTime: { $avg: { $divide: [{ $subtract: ['$completedAt', '$createdAt'] }, 1000 * 60] } } } },
            { $sort: { deliveries: -1 } },
            { $limit: limit },
        ]);
        return agg;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(delivery_schema_1.Delivery.name)),
    __param(1, (0, mongoose_1.InjectModel)(payout_schema_1.Payout.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map