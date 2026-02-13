"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const core_1 = require("@nestjs/core");
const env_config_1 = require("./config/env.config");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const context_service_1 = require("./common/context/context.service");
const tenant_middleware_1 = require("./common/middleware/tenant.middleware");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const tenants_module_1 = require("./tenants/tenants.module");
const roles_module_1 = require("./roles/roles.module");
const deliveries_module_1 = require("./deliveries/deliveries.module");
const payouts_module_1 = require("./payouts/payouts.module");
const locations_module_1 = require("./locations/locations.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const analytics_module_1 = require("./analytics/analytics.module");
const ai_module_1 = require("./ai/ai.module");
const health_module_1 = require("./health/health.module");
const cfg = (0, env_config_1.envValidation)();
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(tenant_middleware_1.TenantMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(cfg.mongoUri, { autoCreate: true }),
            jwt_1.JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '8h' } }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            tenants_module_1.TenantsModule,
            roles_module_1.RolesModule,
            deliveries_module_1.DeliveriesModule,
            payouts_module_1.PayoutsModule,
            locations_module_1.LocationsModule,
            audit_logs_module_1.AuditLogsModule,
            analytics_module_1.AnalyticsModule,
            ai_module_1.AiModule,
            health_module_1.HealthModule,
        ],
        providers: [
            context_service_1.ContextService,
            {
                provide: core_1.APP_FILTER,
                useClass: all_exceptions_filter_1.AllExceptionsFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map