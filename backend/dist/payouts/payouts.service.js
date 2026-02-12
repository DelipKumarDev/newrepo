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
exports.PayoutsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payout_schema_1 = require("./schemas/payout.schema");
const delivery_schema_1 = require("../deliveries/schemas/delivery.schema");
let PayoutsService = class PayoutsService {
    constructor(payoutModel, deliveryModel) {
        this.payoutModel = payoutModel;
        this.deliveryModel = deliveryModel;
    }
    async generate(tenantId, periodStart, periodEnd) {
        // For demo: gross = #delivered * fixed rate (e.g., 100)
        const deliveredCount = await this.deliveryModel.countDocuments({ tenantId: new mongoose_2.Types.ObjectId(tenantId), status: 'delivered', completedAt: { $gte: periodStart, $lte: periodEnd } });
        const gross = deliveredCount * 100; // fixed per-delivery rate for demo
        const adjustments = 0;
        const net = gross + adjustments;
        const payout = await this.payoutModel.create({ tenantId: new mongoose_2.Types.ObjectId(tenantId), periodStart, periodEnd, grossAmount: gross, adjustments, netAmount: net, status: payout_schema_1.PayoutStatus.PENDING });
        return payout;
    }
    async approve(id, approver) {
        const p = await this.payoutModel.findById(id);
        if (!p)
            throw new common_1.NotFoundException('Payout not found');
        p.status = payout_schema_1.PayoutStatus.APPROVED;
        p.approvedBy = approver;
        await p.save();
        return p;
    }
    async markPaid(id, paidBy) {
        const p = await this.payoutModel.findById(id);
        if (!p)
            throw new common_1.NotFoundException('Payout not found');
        p.status = payout_schema_1.PayoutStatus.PAID;
        p.paidBy = paidBy;
        await p.save();
        return p;
    }
    async findByTenant(tenantId) {
        return this.payoutModel.find({ tenantId: new mongoose_2.Types.ObjectId(tenantId) }).lean();
    }
};
exports.PayoutsService = PayoutsService;
exports.PayoutsService = PayoutsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payout_schema_1.Payout.name)),
    __param(1, (0, mongoose_1.InjectModel)(delivery_schema_1.Delivery.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PayoutsService);
//# sourceMappingURL=payouts.service.js.map