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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const delivery_schema_1 = require("../deliveries/schemas/delivery.schema");
let AiService = class AiService {
    constructor(deliveryModel) {
        this.deliveryModel = deliveryModel;
    }
    async predictEta({ distanceKm, region, timestamp }) {
        // Simple heuristic model: average historical time by distance buckets and time of day
        const distanceBucket = Math.max(1, Math.round(distanceKm || 1));
        const startOfDay = new Date(timestamp || Date.now());
        const hour = startOfDay.getHours();
        // Query recent deliveries with similar distance bucket and same hour range
        const docs = await this.deliveryModel
            .find({
            distanceKm: { $gte: Math.max(0, distanceBucket - 1), $lte: distanceBucket + 1 },
            status: 'delivered',
        })
            .sort({ createdAt: -1 })
            .limit(200)
            .lean();
        if (!docs || docs.length === 0) {
            // fallback: 30 minutes per 10 km
            return { predictedDeliveryMinutes: Math.round((distanceKm || 5) * 3) };
        }
        // compute average actual minutes between createdAt and completedAt
        const mins = docs
            .filter((d) => d.completedAt && d.createdAt)
            .map((d) => {
            const completed = new Date(d.completedAt || Date.now()).getTime();
            const created = new Date(d.createdAt || Date.now()).getTime();
            return Math.max(1, Math.round((completed - created) / 60000));
        });
        const avg = Math.round(mins.reduce((s, v) => s + v, 0) / Math.max(1, mins.length));
        // slight adjustment by hour (rush hours add 15%)
        const rushFactor = hour >= 7 && hour <= 10 ? 1.15 : hour >= 17 && hour <= 20 ? 1.12 : 1;
        return { predictedDeliveryMinutes: Math.max(5, Math.round(avg * rushFactor)) };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(delivery_schema_1.Delivery.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AiService);
//# sourceMappingURL=ai.service.js.map