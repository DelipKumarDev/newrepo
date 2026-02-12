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
});