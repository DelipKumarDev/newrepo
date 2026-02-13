import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import { envValidation } from './config/env.config';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ContextService } from './common/context/context.service';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { Reflector } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { RolesModule } from './roles/roles.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { PayoutsModule } from './payouts/payouts.module';
import { LocationsModule } from './locations/locations.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';
import { HealthModule } from './health/health.module';

const cfg = envValidation();

@Module({
  imports: [
    MongooseModule.forRoot(cfg.mongoUri as string, { autoCreate: true }),
    JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '8h' } }),
    AuthModule,
    UsersModule,
    TenantsModule,
    RolesModule,
    DeliveriesModule,
    PayoutsModule,
    LocationsModule,
    AuditLogsModule,
    AnalyticsModule,
    AiModule,
    HealthModule,
  ],
  providers: [
    ContextService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // register Reflector (PermissionsGuard applied via @UseGuards where needed)
    Reflector,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
