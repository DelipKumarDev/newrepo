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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDefaultAdmin = seedDefaultAdmin;
const mongoose_1 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const env_config_1 = require("../config/env.config");
async function seedDefaultAdmin() {
    const cfg = (0, env_config_1.envValidation)();
    await (0, mongoose_1.connect)(cfg.mongoUri);
    const tenantColl = (await Promise.resolve().then(() => __importStar(require('../tenants/tenant.schema')))).Tenant;
    // use mongoose directly for simplicity
    const mongoose = await Promise.resolve().then(() => __importStar(require('mongoose')));
    const TenantModel = mongoose.model('Tenant', (await Promise.resolve().then(() => __importStar(require('../tenants/tenant.schema')))).TenantSchema);
    const UserModel = mongoose.model('User', (await Promise.resolve().then(() => __importStar(require('../users/schemas/user.schema')))).UserSchema);
    const tenant = await TenantModel.findOne({ domain: 'default' });
    let tenantId;
    if (!tenant) {
        const t = await TenantModel.create({ name: 'Default Tenant', domain: 'default' });
        tenantId = t._id;
    }
    else {
        tenantId = tenant._id;
    }
    const admin = await UserModel.findOne({ email: 'admin@example.com' });
    if (!admin) {
        const hashed = await bcrypt.hash('Admin@1234', 10);
        await UserModel.create({ email: 'admin@example.com', firstName: 'Super', lastName: 'Admin', password: hashed, tenantId, roles: ['admin'], isSuperAdmin: true });
        console.log('Default admin user created: admin@example.com / Admin@1234');
    }
}
//# sourceMappingURL=seed.js.map