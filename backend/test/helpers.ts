import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TenantsService } from '../src/tenants/tenants.service';
import { UsersService } from '../src/users/users.service';
import { RolesService } from '../src/roles/roles.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../src/users/schemas/user.schema';

// Helpers used by e2e tests to create tenants/users and perform common actions.
export async function createTenantAndAdmin(moduleRef: any, app: INestApplication, overrides?: { tenantName?: string; domain?: string; adminEmail?: string; adminPassword?: string; }) {
  const tenantsService = moduleRef.get(TenantsService);
  const usersService = moduleRef.get(UsersService);

  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
  const uniqueDomain = overrides?.domain || `e2e-${uniqueSuffix}.local`;
  const tenantName = overrides?.tenantName || `E2E Tenant ${uniqueSuffix}`;
  const tenant = await tenantsService.create({ name: tenantName, domain: uniqueDomain });
  const tenantId = tenant._id.toString();

  const adminEmail = overrides?.adminEmail || `e2e-admin+${uniqueSuffix}@example.com`;
  const adminPassword = overrides?.adminPassword || 'Admin@1234';

  // ensure an `admin` role exists for tests with permissions typically required in e2e
  const rolesService = moduleRef.get(RolesService);
  const needed = [
    'deliveries.create',
    'deliveries.read',
    'deliveries.updateStatus',
    'deliveries.uploadPod',
    'deliveries.assign',
    'deliveries.stats',
  ];
  try {
    const existing = await rolesService.findByNames(['admin']);
    if (!existing || existing.length === 0) {
      await rolesService.create({ name: 'admin', permissions: needed });
    } else {
      // merge missing permissions if role exists
      const e = existing[0];
      const merged = Array.from(new Set([...(e.permissions || []), ...needed]));
      await rolesService.update(e._id.toString(), { permissions: merged });
    }
  } catch (err) {
    // ignore transient errors in tests
  }

  await usersService.create({
    email: adminEmail,
    firstName: 'E2E',
    lastName: 'Admin',
    password: adminPassword,
    tenantId,
    roles: ['admin'],
  });

  const res = await request(app.getHttpServer()).post('/api/auth/login').send({ email: adminEmail, password: adminPassword });
  return { tenant, tenantId, adminEmail, adminPassword, accessToken: res.body?.accessToken, refreshToken: res.body?.refreshToken };
}

export async function createUser(moduleRef: any, app: INestApplication, user: { email: string; password: string; tenantId: string; roles?: string[] }) {
  const usersService = moduleRef.get(UsersService);
  await usersService.create({ ...user, firstName: 'E2E', lastName: 'User' });
}

export async function promoteToSuperAdmin(moduleRef: any, email: string) {
  const userModel = moduleRef.get(getModelToken(User.name));
  await userModel.findOneAndUpdate({ email }, { $set: { isSuperAdmin: true } });
}
