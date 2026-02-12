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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliverySchema = exports.Delivery = exports.DeliveryStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["CREATED"] = "created";
    DeliveryStatus["ASSIGNED"] = "assigned";
    DeliveryStatus["PICKED"] = "picked";
    DeliveryStatus["IN_TRANSIT"] = "in_transit";
    DeliveryStatus["DELIVERED"] = "delivered";
    DeliveryStatus["CANCELLED"] = "cancelled";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
let Delivery = class Delivery {
};
exports.Delivery = Delivery;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Delivery.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Delivery.prototype, "reference", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Delivery.prototype, "pickupAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Delivery.prototype, "dropoffAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Delivery.prototype, "pickupGeo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Delivery.prototype, "dropoffGeo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Delivery.prototype, "distanceKm", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', default: null }),
    __metadata("design:type", Object)
], Delivery.prototype, "assignedTo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: DeliveryStatus, default: DeliveryStatus.CREATED }),
    __metadata("design:type", String)
], Delivery.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ timestamp: Date, message: String }], default: [] }),
    __metadata("design:type", Array)
], Delivery.prototype, "logs", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Delivery.prototype, "slaMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: null }),
    __metadata("design:type", Object)
], Delivery.prototype, "predictedDeliveryMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Delivery.prototype, "podUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], Delivery.prototype, "completedAt", void 0);
exports.Delivery = Delivery = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Delivery);
exports.DeliverySchema = mongoose_1.SchemaFactory.createForClass(Delivery);
exports.DeliverySchema.index({ tenantId: 1, reference: 1 }, { unique: true });
//# sourceMappingURL=delivery.schema.js.map