import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

// Ensure env for tests
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/newrepo_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt';
process.env.REFRESH_SECRET = process.env.REFRESH_SECRET || 'test_refresh';

import { createTenantAndAdmin, createUser } from './helpers';

describe('RBAC (e2e)', () => {
  let app: INestApplication;
  let moduleRef: any;
  let normalToken: string;

  beforeAll(async () => {
    const m = await import('../src/app.module');
    moduleRef = await Test.createTestingModule({ imports: [m.AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();

    const { tenantId } = await createTenantAndAdmin(moduleRef, app, { adminEmail: 'admin@example.com' });

    // create a normal user and login
    await createUser(moduleRef, app, { email: 'normal@example.com', password: 'User@1234', tenantId, roles: ['user'] });
    const login = await request(app.getHttpServer()).post('/api/auth/login').send({ email: 'normal@example.com', password: 'User@1234' });
    normalToken = login.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('prevents non-super-admin from accessing tenant management', async () => {
    const res = await request(app.getHttpServer()).get('/api/tenants').set('Authorization', `Bearer ${normalToken}`);
    expect([401, 403]).toContain(res.status); // SuperAdminGuard throws UnauthorizedException
  });

  it('blocks create delivery when user role lacks permission and allows when role has permission', async () => {
    // normal user (role: user) should NOT be able to create deliveries
    const createRes = await request(app.getHttpServer())
      .post('/api/deliveries')
      .set('Authorization', `Bearer ${normalToken}`)
      .send({ reference: 'RBAC-USER-1', pickupAddress: 'A', dropoffAddress: 'B', distanceKm: 1 });

    expect([401, 403]).toContain(createRes.status);

    // create a role that has deliveries.create permission
    const { RolesService } = await import('../src/roles/roles.service');
    const rolesService = moduleRef.get(RolesService);
    const existing = await rolesService.findByNames(['dispatcher']);
    if (!existing || existing.length === 0) {
      await rolesService.create({ name: 'dispatcher', permissions: ['deliveries.create'] });
    }
    const exists = await rolesService.findByNames(['dispatcher']);
    expect(exists.length).toBeGreaterThan(0);

    // create a dispatcher user and login
    const { tenantId } = await createTenantAndAdmin(moduleRef, app);
    await createUser(moduleRef, app, { email: 'dispatch@example.com', password: 'Dispatch@123', tenantId, roles: ['dispatcher'] });
    const login = await request(app.getHttpServer()).post('/api/auth/login').send({ email: 'dispatch@example.com', password: 'Dispatch@123' });
    const dispatchToken = login.body.accessToken;

    // sanity check: user exists and has dispatcher role
    const { UsersService } = await import('../src/users/users.service');
    const usersService = moduleRef.get(UsersService);
    const dispatchUser = await usersService.findByEmail('dispatch@example.com');
    expect(dispatchUser).toBeTruthy();
    expect((dispatchUser?.roles || [])).toContain('dispatcher');

    // ensure role document has expected permission
    const dispatcherRole = (await rolesService.findByNames(['dispatcher']))[0];
    expect(dispatcherRole).toBeTruthy();
    expect(dispatcherRole.permissions).toContain('deliveries.create');

    // programmatic permission check (mirror PermissionsGuard logic)
    const rolesForUser = await rolesService.findByNames(dispatchUser.roles || []);
    const userPerms = new Set(rolesForUser.flatMap((r: any) => r.permissions || []));
    expect(userPerms.has('deliveries.create')).toBe(true);

    // verify token payload contains roles
    const { JwtService } = await import('@nestjs/jwt');
    const jwtService = moduleRef.get(JwtService);
    const payload = jwtService.verify(dispatchToken, { secret: process.env.JWT_SECRET });
    expect(payload.roles || []).toContain('dispatcher');

    const ok = await request(app.getHttpServer())
      .post('/api/deliveries')
      .set('Authorization', `Bearer ${dispatchToken}`)
      .send({ reference: 'RBAC-DISPATCH-1', pickupAddress: 'A', dropoffAddress: 'B', distanceKm: 2 });

    if (ok.status !== 201) {
      // dump server response for debugging
      // eslint-disable-next-line no-console
      console.error('dispatch create failed -> status:', ok.status, 'body:', ok.body || ok.text);
    }

    expect(ok.status).toBe(201);
  });
});